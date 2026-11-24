import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../standalone/src/index.js', import.meta.url), 'utf8');
const { default: worker } = await import('data:text/javascript,' + encodeURIComponent(source));
const config = readFileSync(new URL('../standalone/wrangler.toml', import.meta.url), 'utf8');
const bytes = new TextEncoder().encode('0123456789');

function environment() {
  const calls = [];
  const env = {
    MWTM: {
      async get(key, options = {}) {
        calls.push({ key, options });
        if (!['manifest.json', 'film/clip.mp4', 'film/thumb.jpg'].includes(key)) return null;
        const range = options.range;
        const body = range ? bytes.slice(range.offset, range.offset + range.length) : bytes;
        return {
          size: bytes.length,
          httpEtag: '"abc123"',
          body: new ReadableStream({ start(controller) { controller.enqueue(body); controller.close(); } }),
        };
      },
    },
    ASSETS: { async fetch() { return new Response('asset'); } },
  };
  return { env, calls };
}
async function request(path, init = {}, env = environment().env) {
  return worker.fetch(new Request('https://aimixmasters.com' + path, init), env);
}

test('Wrangler keeps the dashboard Custom Domain and binds private R2', () => {
  assert.match(config, /workers_dev = false/);
  assert.match(config, /preview_urls = false/);
  assert.match(config, /binding = "MWTM"\s+bucket_name = "aimm-mwtm"/);
  assert.doesNotMatch(config, /^\s*(?:routes?\s*=|\[\[routes\]\])/m);
});

test('manifest and media return their cache headers and correct types', async () => {
  for (const [path, type, cacheControl] of [
    ['/mwtm/manifest.json', 'application/json', 'private, no-cache'],
    ['/mwtm/f/film/clip.mp4', 'video/mp4', 'private, max-age=3600'],
    ['/mwtm/f/film/thumb.jpg', 'image/jpeg', 'private, max-age=3600'],
    ['/mwtm/f/manifest.json', 'application/json', 'private, max-age=3600'],
  ]) {
    const response = await request(path);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Content-Type'), type);
    assert.equal(response.headers.get('Cache-Control'), cacheControl);
    assert.equal(response.headers.get('ETag'), '"abc123"');
    assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
    assert.equal(response.headers.get('Content-Length'), '10');
    assert.equal(await response.text(), '0123456789');
  }
});

test('versioned manifest URL ignores the query string when selecting its R2 key', async () => {
  const { env, calls } = environment();
  const response = await request('/mwtm/manifest.json?b=2026-11-23.36', {}, env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Type'), 'application/json');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-cache');
  assert.equal(await response.text(), '0123456789');
  assert.deepEqual(calls.map(call => call.key), ['manifest.json']);
});

test('manifest revalidates with ETag while media keeps its existing response', async () => {
  for (const method of ['GET', 'HEAD']) {
    for (const ifNoneMatch of ['"abc123"', 'W/"abc123"', '"other", "abc123"', '*']) {
      const response = await request('/mwtm/manifest.json', { method, headers: { 'If-None-Match': ifNoneMatch } });
      assert.equal(response.status, 304);
      assert.equal(response.headers.get('Cache-Control'), 'private, no-cache');
      assert.equal(response.headers.get('ETag'), '"abc123"');
      assert.equal(response.headers.get('Content-Length'), null);
      assert.equal(await response.text(), '');
    }
  }
  const changed = await request('/mwtm/manifest.json', { headers: { 'If-None-Match': '"old"' } });
  assert.equal(changed.status, 200);
  assert.equal(await changed.text(), '0123456789');
  const media = await request('/mwtm/f/film/clip.mp4', { headers: { 'If-None-Match': '"abc123"' } });
  assert.equal(media.status, 200);
  assert.equal(media.headers.get('Cache-Control'), 'private, max-age=3600');
});

test('single, open-ended and suffix ranges read only requested bytes', async () => {
  for (const [header, expected, contentRange] of [
    ['bytes=2-5', '2345', 'bytes 2-5/10'],
    ['bytes=7-', '789', 'bytes 7-9/10'],
    ['bytes=-3', '789', 'bytes 7-9/10'],
    ['bytes=-50', '0123456789', 'bytes 0-9/10'],
  ]) {
    const { env, calls } = environment();
    const response = await request('/mwtm/f/film/clip.mp4', { headers: { Range: header } }, env);
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), contentRange);
    assert.equal(response.headers.get('Content-Length'), String(expected.length));
    assert.equal(await response.text(), expected);
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[1].options.range, { offset: Number(contentRange.match(/bytes (\d+)/)[1]), length: expected.length });
  }
});

test('bad ranges return 416; HEAD returns metadata without a body', async () => {
  for (const range of ['bytes=10-', 'bytes=5-3', 'bytes=-0', 'bytes=0-1,4-5', 'bytes=x-y']) {
    const response = await request('/mwtm/f/film/clip.mp4', { headers: { Range: range } });
    assert.equal(response.status, 416);
    assert.equal(response.headers.get('Content-Range'), 'bytes */10');
  }
  const { env, calls } = environment();
  const head = await request('/mwtm/f/film/clip.mp4', { method: 'HEAD', headers: { Range: 'bytes=-2' } }, env);
  assert.equal(head.status, 206);
  assert.equal(head.headers.get('Content-Range'), 'bytes 8-9/10');
  assert.equal(await head.text(), '');
  assert.equal(calls.length, 1);
});

test('only named objects and GET/HEAD work; unrelated paths retain ASSETS', async () => {
  assert.equal((await request('/mwtm/f/missing.mp4')).status, 404);
  assert.equal((await request('/mwtm/f/')).status, 404);
  // Request normalises dot segments itself; pass a raw URL as Workers can receive.
  const raw = { url: 'https://aimixmasters.com/mwtm/f/%2e%2e/secret.mp4', method: 'GET', headers: new Headers() };
  assert.equal((await worker.fetch(raw, environment().env)).status, 404);
  assert.equal((await request('/mwtm/f/film/a..b.mp4')).status, 404);
  const forbidden = await request('/mwtm/manifest.json', { method: 'POST' });
  assert.equal(forbidden.status, 405);
  assert.equal(forbidden.headers.get('Allow'), 'GET, HEAD');
  assert.equal(await (await request('/unrelated')).text(), 'asset');
});
