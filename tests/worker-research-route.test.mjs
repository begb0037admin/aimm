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

test('E1: embed mode rejects a missing token', async () => {
  const response = await invoke(requestFor('/research/kb-search', { body: { mode: 'embed', inputs: ['one'] } }));
  assert.equal(response.status, 401);
});

test('E2: embed mode rejects a wrong token', async () => {
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'embed', inputs: ['one'] }, headers: { Authorization: 'Bearer wrong-token' },
  }));
  assert.equal(response.status, 401);
});

test('E3: embed mode returns one ordered embedding per document input without querying or writing', async () => {
  let voyageCall;
  let queryCalls = 0;
  let putCalls = 0;
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'embed', input_type: 'document', inputs: ['first', 'second', 'third'] },
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), {
    VEC_YT_KB: {
      async query() { queryCalls++; return { matches: [] }; },
      async put() { putCalls++; },
    },
  }, async (url, options) => {
    assert.equal(String(url), 'https://api.voyageai.com/v1/contextualizedembeddings');
    voyageCall = JSON.parse(options.body);
    return Response.json({ data: ['first', 'second', 'third'].map((_, i) => ({
      data: [{ embedding: [i + 1, (i + 1) * 10] }],
    })) });
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { embeddings: [[1, 10], [2, 20], [3, 30]] });
  assert.deepEqual(voyageCall.inputs, [['first'], ['second'], ['third']]);
  assert.equal(voyageCall.input_type, 'document');
  assert.equal(queryCalls, 0);
  assert.equal(putCalls, 0);
});

test('E4: query input_type is passed through to Voyage', async () => {
  let voyageCall;
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'embed', input_type: 'query', inputs: ['search text'] },
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), {}, async (_url, options) => {
    voyageCall = JSON.parse(options.body);
    return Response.json({ data: [{ data: [{ embedding: [0.4] }] }] });
  });
  assert.equal(response.status, 200);
  assert.equal(voyageCall.input_type, 'query');
});

test('E5: omitted input_type defaults to document', async () => {
  let voyageCall;
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'embed', inputs: ['document text'] },
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), {}, async (_url, options) => {
    voyageCall = JSON.parse(options.body);
    return Response.json({ data: [{ data: [{ embedding: [0.5] }] }] });
  });
  assert.equal(response.status, 200);
  assert.equal(voyageCall.input_type, 'document');
});

test('E6: more than 50 inputs is rejected without calling Voyage', async () => {
  let voyageCalls = 0;
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'embed', inputs: Array.from({ length: 51 }, (_, i) => `text ${i}`) },
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), {}, async () => { voyageCalls++; throw new Error('Voyage must not be called'); });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /at most 50/);
  assert.equal(voyageCalls, 0);
});

test('E7: empty inputs, empty strings, and non-string entries are rejected', async () => {
  for (const inputs of [[], [''], ['valid', 42]]) {
    const response = await invoke(requestFor('/research/kb-search', {
      body: { mode: 'embed', inputs }, headers: { Authorization: `Bearer ${TEST_TOKEN}` },
    }));
    assert.equal(response.status, 400);
  }
});

test('E8: unsupported input_type is rejected', async () => {
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'embed', input_type: 'bogus', inputs: ['valid'] },
    headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }));
  assert.equal(response.status, 400);
});

test('E9: embed mode reports a missing Voyage API key', async () => {
  const response = await invoke(requestFor('/research/kb-search', {
    body: { mode: 'embed', inputs: ['valid'] }, headers: { Authorization: `Bearer ${TEST_TOKEN}` },
  }), { VOYAGE_API_KEY: undefined });
  assert.equal(response.status, 501);
  assert.deepEqual(await response.json(), { error: 'VOYAGE_API_KEY not set', code: 'no_key' });
});
