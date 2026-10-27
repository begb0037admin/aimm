import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const workerSource = await readFile(new URL('../worker/src/index.js', import.meta.url), 'utf8');
const workerModule = await import(`data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`);
const originMainSource = execFileSync('git', ['show', 'origin/main:worker/src/index.js'], { encoding: 'utf8' });
const TEST_TOKEN = 'research-test-token';

function routeBlock(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `route block ${startMarker} exists`);
  return source.slice(start, end);
}

function requestFor(path, { method = 'POST', body = {}, headers = {} } = {}) {
  return new Request(`https://worker.test${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(body),
  });
}

async function invoke(request, overrides = {}, fetchStub = async () => {
  throw new Error('Unexpected upstream request');
}) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = fetchStub;
  try {
    const env = {
      RESEARCH_TOKEN: TEST_TOKEN,
      VOYAGE_API_KEY: 'voyage-test-key',
      COHERE_API_KEY: 'cohere-test-key',
      VEC_YT_KB: { query: async () => ({ matches: [] }) },
      ...overrides,
    };
    return await workerModule.default.fetch(request, env);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('W1: missing Authorization is rejected', async () => {
  const response = await invoke(requestFor('/research/kb-search', { body: { mode: 'vector', query: 'mixing' } }));
  assert.equal(response.status, 401);
});

test('W2: wrong bearer token is rejected', async () => {
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'vector', query: 'mixing' }, headers: { Authorization: 'Bearer wrong-token' },
  }));
  assert.equal(response.status, 401);
});

test('W3: an unset research token is unavailable even when a token is supplied', async () => {
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'vector', query: 'mixing' }, headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), { RESEARCH_TOKEN: undefined });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'research route not configured' });
});

test('W4: vector mode returns mapped matches and passes the requested topK', async () => {
  let queryArgs;
  let voyageCall;
  const match = {
    metadata: { video_id: 'vid-1', chunk: '4', title: 'A title', channel: 'A channel', text: 'A transcript chunk' },
    score: 0.91,
  };
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'vector', query: 'mixing vocals', n: 7 },
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), {
    VEC_YT_KB: { async query(vector, options) { queryArgs = { vector, options }; return { matches: [match] }; } },
  }, async (url, options) => {
    assert.equal(String(url), 'https://api.voyageai.com/v1/contextualizedembeddings');
    voyageCall = JSON.parse(options.body);
    return Response.json({ data: [{ data: [{ embedding: [0.1, 0.2, 0.3] }] }] });
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { results: [{
    video_id: 'vid-1', chunk: 4, title: 'A title', channel: 'A channel', text: 'A transcript chunk', score: 0.91,
  }] });
  assert.deepEqual(queryArgs, { vector: [0.1, 0.2, 0.3], options: { topK: 7, returnMetadata: 'all' } });
  assert.equal(voyageCall.input_type, 'query');
});

test('W5: rerank mode preserves IDs and sorts by relevance score', async () => {
  let cohereCall;
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'rerank', query: 'mixing vocals', documents: [
      { id: 'first', text: 'First transcript' }, { id: 'second', text: 'Second transcript' },
    ], top_n: 2 },
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), {}, async (url, options) => {
    assert.equal(String(url), 'https://api.cohere.com/v2/rerank');
    cohereCall = JSON.parse(options.body);
    return Response.json({ results: [
      { index: 0, relevance_score: 0.2 }, { index: 1, relevance_score: 0.8 },
    ] });
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { results: [
    { id: 'second', relevance_score: 0.8 }, { id: 'first', relevance_score: 0.2 },
  ] });
  assert.equal(cohereCall.model, 'rerank-v3.5');
  assert.equal(cohereCall.top_n, 2);
});

test('W6: GET is not allowed on the research route', async () => {
  const response = await invoke(requestFor('/research/kb-search', { method: 'GET' }));
  assert.equal(response.status, 405);
});

test('W7: unknown research mode is rejected', async () => {
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'unknown' }, headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }));
  assert.equal(response.status, 400);
});

test('W8: existing KB routes match origin/main and browser origin gate remains in effect', async () => {
  const vectorMarker = "if (url.pathname === '/kb/vector-search')";
  const rerankMarker = "if (url.pathname === '/kb/rerank')";
  const fallbackMarker = "const m = url.pathname.match(/^\\/(anthropic|elevenlabs)(\\/.*)$/)";
  assert.equal(routeBlock(workerSource, vectorMarker, rerankMarker), routeBlock(originMainSource, vectorMarker, rerankMarker));
  assert.equal(routeBlock(workerSource, rerankMarker, fallbackMarker), routeBlock(originMainSource, rerankMarker, fallbackMarker));

  const response = await invoke(requestFor('/kb/vector-search', {
    body: { query: 'mixing' }, headers: { Origin: 'https://evil.example' },
  }));
  assert.equal(response.status, 403);
});
