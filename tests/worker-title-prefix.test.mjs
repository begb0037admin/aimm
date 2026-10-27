import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workerSource = await readFile(new URL('../worker/src/index.js', import.meta.url), 'utf8');
const workerModuleUrl = `data:text/javascript;base64,${Buffer.from(workerSource).toString('base64')}`;
const { default: worker } = await import(workerModuleUrl);

async function upsertOneChunk({ videoId, chunk }) {
  const originalFetch = globalThis.fetch;
  let voyagePayload;
  const upsertedVectors = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), 'https://api.voyageai.com/v1/contextualizedembeddings');
    voyagePayload = JSON.parse(options.body);
    return new Response(JSON.stringify({
      data: voyagePayload.inputs.map(group => ({
        data: group.map((_, index) => ({ embedding: [index + 0.25], index })),
      })),
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const response = await worker.fetch(new Request('https://worker.test/kb/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AIMM-Ingest-Key': 'test-ingest-key',
      },
      body: JSON.stringify({ video_id: videoId, chunks: [chunk] }),
    }), {
      AIMM_INGEST_KEY: 'test-ingest-key',
      VOYAGE_API_KEY: 'test-voyage-key',
      VEC_YT_KB: { upsert: async vectors => upsertedVectors.push(...vectors) },
      AIMM_KV: { get: async () => null, put: async () => {} },
    });
    return { response, voyagePayload, upsertedVectors };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('KB upsert embeds each chunk with the title and channel prefix and keeps raw metadata', async () => {
  const chunk = {
    chunk: 3,
    title: 'The #1 EQ Mistake Ruining Your Sound',
    channel: 'Make Your Music',
    text: 'The transcript chunk explains the mistake and how to avoid it.',
  };
  const { response, voyagePayload, upsertedVectors } = await upsertOneChunk({
    videoId: '5QDXc8s6GgM',
    chunk,
  });

  assert.equal(response.status, 200);
  assert.equal(voyagePayload.input_type, 'document');
  assert.deepEqual(voyagePayload.inputs, [[
    `Title: ${chunk.title} | Channel: ${chunk.channel}\n${chunk.text}`,
  ]]);
  assert.equal(upsertedVectors.length, 1);
  assert.equal(upsertedVectors[0].metadata.text, chunk.text);
  assert.equal(upsertedVectors[0].metadata.title, chunk.title);
  assert.equal(upsertedVectors[0].metadata.channel, chunk.channel);
});

test('KB upsert retains the MWTM session label after the title and channel prefix', async () => {
  const chunk = {
    chunk: 1,
    title: 'Lady London — Part 1: Vocal Production',
    channel: 'Mix With The Masters',
    text: 'This chunk covers the vocal production session.',
  };
  const { response, voyagePayload } = await upsertOneChunk({
    videoId: 'mwtm-jaycen-joshua-lady-london-p01',
    chunk,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(voyagePayload.inputs, [[
    `Title: ${chunk.title} | Channel: ${chunk.channel}\nSession: Jaycen Joshua Lady London (${chunk.channel})\n${chunk.text}`,
  ]]);
});
