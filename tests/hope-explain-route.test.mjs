import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const proxySource = readFileSync(new URL('../worker/src/index.js', import.meta.url), 'utf8');
const siteSource = readFileSync(new URL('../standalone/src/index.js', import.meta.url), 'utf8');
const proxy = (await import('data:text/javascript;base64,' + Buffer.from(proxySource).toString('base64'))).default;
const site = (await import('data:text/javascript;base64,' + Buffer.from(siteSource).toString('base64'))).default;
const input = [{ role: 'system', content: 'Explain briefly.' }, { role: 'user', content: 'What should I do?' }];

function proxyRequest(token) {
  return new Request('https://proxy.test/hope/luna', { method: 'POST', headers: {
    Authorization: `Bearer ${token}`, 'CF-Connecting-IP': '192.0.2.1', Origin: 'https://aimixmasters.com',
  }, body: JSON.stringify({ input, tools: [{ type: 'web_search' }], max_output_tokens: 1200 }) });
}

test('proxy rejects a request without Origin even with the internal bearer', async () => {
  const request = proxyRequest('internal-secret');
  request.headers.delete('Origin');
  const response = await proxy.fetch(request, { HOPE_INTERNAL_TOKEN: 'internal-secret' });
  assert.equal(response.status, 403);
  assert.equal(await response.text(), 'Forbidden origin');
});

test('proxy accepts either token, rejects wrong token, and restricts internal requests', async () => {
  const keys = [];
  const env = { HOPE_STT_TOKEN: 'speech-secret', HOPE_INTERNAL_TOKEN: 'internal-secret', OPENAI_API_KEY: 'openai-secret',
    HOPE_STT_LIMIT: { limit: async ({ key }) => { keys.push(key); return { success: true }; } } };
  assert.equal((await proxy.fetch(proxyRequest('wrong'), env)).status, 401);
  const original = globalThis.fetch;
  const payloads = [];
  try {
    globalThis.fetch = async (_url, options) => {
      payloads.push(JSON.parse(options.body));
      return new Response('data: done\n\n', { headers: { 'Content-Type': 'text/event-stream' } });
    };
    assert.equal((await proxy.fetch(proxyRequest('speech-secret'), env)).status, 200);
    assert.equal((await proxy.fetch(proxyRequest('internal-secret'), env)).status, 200);
  } finally { globalThis.fetch = original; }
  assert.deepEqual(keys, ['192.0.2.1', 'internal']);
  assert.deepEqual(payloads[0].tools, [{ type: 'web_search' }]);
  assert.equal(payloads[0].max_output_tokens, 1200);
  assert.equal(payloads[1].tools, undefined);
  assert.equal(payloads[1].tool_choice, undefined);
  assert.equal(payloads[1].max_output_tokens, 1000);
});

function siteRequest(body, access = true) {
  return new Request('https://site.test/api/hope-explain', { method: 'POST', headers: {
    'Content-Type': 'application/json', ...(access ? { 'Cf-Access-Jwt-Assertion': 'access-assertion' } : {}),
  }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}

test('site route requires Access and a valid compact text request', async () => {
  const env = { HOPE_INTERNAL_TOKEN: 'internal-secret' };
  assert.equal((await site.fetch(siteRequest({ input }, false), env)).status, 401);
  assert.equal((await site.fetch(siteRequest('{', true), env)).status, 400);
  assert.equal((await site.fetch(siteRequest({ input: [] }, true), env)).status, 400);
  assert.equal((await site.fetch(siteRequest({ input: [{ role: 'assistant', content: 'x' }] }, true), env)).status, 400);
  assert.equal((await site.fetch(siteRequest({ input: [{ role: 'user', content: {} }] }, true), env)).status, 400);
  assert.equal((await site.fetch(siteRequest({ input: [{ role: 'user', content: 'x'.repeat(60_000) }] }, true), env)).status, 413);
  const missing = await site.fetch(siteRequest({ input }, true), {});
  assert.equal(missing.status, 503);
  assert.equal((await missing.json()).code, 'no_internal_auth');
});

test('site route forwards the allowed origin and internal bearer, strips tools, and streams status and content type', async () => {
  const original = globalThis.fetch;
  let sent;
  let controller;
  const stream = new ReadableStream({ start(value) { controller = value; value.enqueue(new TextEncoder().encode('data: first\n\n')); } });
  try {
    globalThis.fetch = async (url, options) => {
      sent = { url, options };
      return new Response(stream, { status: 429, headers: { 'Content-Type': 'text/event-stream' } });
    };
    const response = await site.fetch(siteRequest({ input, tools: [{ type: 'web_search' }], tool_choice: 'auto', max_output_tokens: 1500 }), { HOPE_INTERNAL_TOKEN: 'internal-secret' });
    assert.equal(sent.url, 'https://aimm-proxy.kevinlelitte.workers.dev/hope/luna');
    assert.equal(sent.options.headers.Origin, 'https://aimixmasters.com');
    assert.equal(sent.options.headers['Content-Type'], 'application/json');
    assert.equal(sent.options.headers.Authorization, 'Bearer internal-secret');
    assert.deepEqual(JSON.parse(sent.options.body), { input, max_output_tokens: 1000 });
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('Content-Type'), 'text/event-stream');
    const reader = response.body.getReader();
    assert.equal(new TextDecoder().decode((await reader.read()).value), 'data: first\n\n');
    controller.enqueue(new TextEncoder().encode('data: second\n\n'));
    assert.equal(new TextDecoder().decode((await reader.read()).value), 'data: second\n\n');
    controller.close();
  } finally { globalThis.fetch = original; }
});
