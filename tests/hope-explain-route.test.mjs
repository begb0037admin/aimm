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
  }, body: JSON.stringify({ input, tools: Array.from({ length: 41 }, () => ({ type: 'web_search' })), max_output_tokens: 5000 }) });
}

test('proxy rejects a request without Origin even with the internal bearer', async () => {
  const request = proxyRequest('internal-secret');
  request.headers.delete('Origin');
  const response = await proxy.fetch(request, { HOPE_INTERNAL_TOKEN: 'internal-secret' });
  assert.equal(response.status, 403);
  assert.equal(await response.text(), 'Forbidden origin');
});

test('proxy accepts either token, rejects wrong tokens, and caps Luna chat', async () => {
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
  for (const payload of payloads) {
    assert.equal(payload.tools.length, 41);
    assert.deepEqual(payload.tools[0], { type: 'web_search' });
    assert.equal(payload.tool_choice, 'auto');
    assert.equal(payload.max_output_tokens, 1200);
  }
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

const access = { 'Cf-Access-Jwt-Assertion': 'access-assertion' };
const jsonHeaders = { 'Content-Type': 'application/json' };
const secretEnv = { HOPE_INTERNAL_TOKEN: 'internal-secret' };
const speechText = { text: 'Hello from Hope.' };
const wav = new Uint8Array(46);
const wavView = new DataView(wav.buffer);
wav.set(Buffer.from('RIFF'), 0);
wavView.setUint32(4, wav.length - 8, true);
wav.set(Buffer.from('WAVEfmt '), 8);
wavView.setUint32(16, 16, true);
wavView.setUint16(20, 1, true);
wavView.setUint16(22, 1, true);
wavView.setUint32(24, 16000, true);
wavView.setUint32(28, 32000, true);
wavView.setUint16(32, 2, true);
wavView.setUint16(34, 16, true);
wav.set(Buffer.from('data'), 36);
wavView.setUint32(40, 2, true);

const chatBody = {
  input: [...input, { type: 'reasoning', id: 'rs_123', summary: [] },
    { type: 'function_call', name: 'get_context', arguments: '{}', call_id: 'call_1' },
    { type: 'function_call_output', call_id: 'call_1', output: '{"ok":true}' },
    { role: 'user', content: [{ type: 'input_text', text: 'Screenshot' },
      { type: 'input_image', image_url: 'data:image/png;base64,YQ==' }] }],
  tools: [{ type: 'function', name: 'get_context', parameters: { type: 'object' }, strict: false }],
  max_output_tokens: 1000,
};
const requests = [
  ['/hope/luna', chatBody],
  ['/hope/ai', { system: 'Be brief', user: 'Summarise this', max_output_tokens: 1200, web_search: true }],
  ['/hope/web-search', { query: 'New release' }],
  ['/hope/tts', speechText],
  ['/hope/read-aloud', speechText],
  ['/hope/stt', wav, 'audio/wav'],
  ['/hope/stt/ticket'],
];
const requestOptions = (body, headers, contentType) => ({
  method: 'POST',
  headers: { ...(body === undefined ? {} : jsonHeaders), ...headers, ...(contentType && { 'Content-Type': contentType }) },
  body: contentType === 'audio/wav' ? body : JSON.stringify(body),
});

test('all Hope bearer routes accept both credentials and rate-limit internal calls under the internal key', async () => {
  const keys = [];
  const env = { ...secretEnv, HOPE_STT_TOKEN: 'speech-secret', OPENAI_API_KEY: 'openai-secret',
    HOPE_USAGE_TTS_API_KEY: 'fake-tts-key', AI: { run: async () => ({ text: 'transcribed' }) },
    HOPE_STT_LIMIT: { limit: async ({ key }) => { keys.push(key); return { success: true }; } } };
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async url => url.includes('elevenlabs.io')
      ? new Response('audio', { headers: { 'Content-Type': 'audio/mpeg' } })
      : Response.json({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'reply' }] }] });
    for (const [path, body, contentType] of requests) {
      keys.length = 0;
      for (const [token, status] of [['wrong', 401], [null, 401], ['speech-secret', 200], ['internal-secret', 200]]) {
        const response = await proxy.fetch(new Request('https://proxy.test' + path, requestOptions(body, {
          ...(token && { Authorization: 'Bearer ' + token }), Origin: 'https://aimixmasters.com', 'CF-Connecting-IP': '192.0.2.5',
        }, contentType)), env);
        assert.equal(response.status, status, path);
      }
      assert.deepEqual(keys, path.endsWith('/ticket') ? ['internal'] : ['192.0.2.5', 'internal'], path);
    }
  } finally { globalThis.fetch = original; }
});

test('both speech credentials issue tickets valid for probe and stream using their rate limit keys', async () => {
  const origin = 'https://aimixmasters.com';
  const keys = [];
  const env = { ...secretEnv, HOPE_STT_TOKEN: 'speech-secret', DEEPGRAM_API_KEY: 'fake-stt-key',
    HOPE_STT_LIMIT: { limit: async ({ key }) => { keys.push(key); return { success: false }; } } };
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('simulated handshake failure', { status: 400 });
    for (const [token, key] of [['speech-secret', '192.0.2.5'], ['internal-secret', 'internal']]) {
      const ticketResponse = await proxy.fetch(new Request('https://proxy.test/hope/stt/ticket', {
        method: 'POST', headers: { Origin: origin, Authorization: 'Bearer ' + token },
      }), { ...env, HOPE_STT_LIMIT: { limit: async () => ({ success: true }) } });
      assert.equal(ticketResponse.status, 200);
      const { ticket } = await ticketResponse.json();
      const probe = await proxy.fetch(new Request('https://proxy.test/hope/stt/probe?ticket=' + ticket, {
        method: 'POST', headers: { Origin: origin },
      }), env);
      assert.equal(probe.status, 502);
      assert.equal((await probe.json()).code, 'deepgram_connect_failed');
      const streamRequest = value => new Request('https://proxy.test/hope/stt/stream?ticket=' + value, {
        headers: { Origin: origin, Upgrade: 'websocket', 'CF-Connecting-IP': '192.0.2.5' },
      });
      assert.equal((await proxy.fetch(streamRequest(ticket), env)).status, 429);
      assert.equal(keys.at(-1), key);
      assert.equal((await proxy.fetch(streamRequest('bad-ticket'), env)).status, 401);
    }
  } finally { globalThis.fetch = original; }
});

test('site forwards Hope payloads through Access and preserves audio and SSE responses', async () => {
  const original = globalThis.fetch;
  let upstream;
  let forwarded;
  try {
    globalThis.fetch = async (url, options) => {
      forwarded = { url, options };
      return upstream;
    };
    for (const [path, body, contentType] of requests) {
      const url = 'https://site.test/api' + path;
      assert.equal((await site.fetch(new Request(url, requestOptions(body, {}, contentType)), secretEnv)).status, 401, path);
      upstream = new Response(new Uint8Array([255, 12, 0, 32]), { status: 206, headers: {
        'Content-Type': path === '/hope/luna' ? 'text/event-stream' : 'audio/mpeg', 'character-cost': '30',
      } });
      forwarded = null;
      const response = await site.fetch(new Request(url, requestOptions(body, { ...access, Authorization: 'ignored' }, contentType)), secretEnv);
      assert.equal(response, upstream, path);
      assert.equal(response.status, 206);
      assert.equal(response.headers.get('character-cost'), '30');
      assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [255, 12, 0, 32]);
      assert.equal(forwarded.url, 'https://aimm-proxy.kevinlelitte.workers.dev' + path);
      assert.equal(forwarded.options.headers.Origin, 'https://aimixmasters.com');
      assert.equal(forwarded.options.headers.Authorization, 'Bearer internal-secret');
      assert.equal(new Headers(forwarded.options.headers).has('Cf-Access-Jwt-Assertion'), false);
      if (contentType === 'audio/wav') assert.deepEqual(forwarded.options.body, wav);
      else if (body) assert.deepEqual(JSON.parse(forwarded.options.body), body, path);
      else assert.equal(forwarded.options.body, undefined, path);
    }
  } finally { globalThis.fetch = original; }
});

test('site validates each Hope request before forwarding', async () => {
  const original = globalThis.fetch;
  let forwarded = false;
  try {
    globalThis.fetch = async () => { forwarded = true; };
    const invalid = [
      ['/luna', { input: [{}] }, 400],
      ['/luna', { ...chatBody, tools: Array(129).fill(chatBody.tools[0]) }, 400],
      ['/luna', { input: [{ role: 'user', content: 'é'.repeat(200_000) }] }, 413],
      ['/ai', { system: 'Be brief', user: {} }, 400],
      ['/web-search', { query: 'x'.repeat(1001) }, 400],
      ['/tts', { text: '' }, 400],
      ['/read-aloud', { text: 'x'.repeat(2401) }, 400],
      ['/stt/ticket', {}, 400],
      ['/stt/probe?ticket=bad', undefined, 401],
      ['/stt', {}, 415],
    ];
    for (const [path, body, expected] of invalid) {
      const response = await site.fetch(new Request('https://site.test/api/hope' + path, requestOptions(body, access)), secretEnv);
      assert.equal(response.status, expected, path);
    }
    const foreignOrigin = new Request('https://site.test/api/hope/stt/ticket', requestOptions(undefined, { ...access, Origin: 'https://other.test' }));
    assert.equal((await site.fetch(foreignOrigin, secretEnv)).status, 403);
    assert.equal(forwarded, false);
  } finally { globalThis.fetch = original; }
});

test('site forwards the speech probe and WebSocket upgrade with only the expected query and headers', async () => {
  const original = globalThis.fetch;
  const ticket = '1785510985000.12345678-1234-1234-1234-123456789abc.' + 'a'.repeat(64);
  try {
    for (const [route, method] of [['probe', 'POST'], ['stream', 'GET']]) {
      const path = '/hope/stt/' + route;
      const url = 'https://site.test/api' + path + '?ticket=' + ticket + '&ignored=yes';
      const headers = method === 'GET' ? { Upgrade: 'websocket' } : {};
      const response = method === 'GET' ? { status: 101, webSocket: {} } : Response.json({ ok: true });
      globalThis.fetch = async (url, options) => {
        assert.equal(url, 'https://aimm-proxy.kevinlelitte.workers.dev' + path + '?ticket=' + ticket);
        assert.equal(options.method, method);
        assert.deepEqual(options.headers, { ...headers, Origin: 'https://aimixmasters.com', Authorization: 'Bearer internal-secret' });
        return response;
      };
      assert.equal((await site.fetch(new Request(url, { method, headers }), secretEnv)).status, 401);
      assert.equal(await site.fetch(new Request(url, { method, headers: { ...headers, ...access } }), secretEnv), response);
    }
  } finally { globalThis.fetch = original; }
});
