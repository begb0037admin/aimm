// AIMM key relay — Cloudflare Worker
//
// Holds the real Anthropic + ElevenLabs API keys as Worker secrets and
// forwards requests from the AIMM app, so no API key ever lives in the
// (public) GitHub repo, on GitHub Pages, or in browser localStorage.
//
// Routes:
//   /anthropic/<path>  → https://api.anthropic.com/<path>   (injects x-api-key)
//   /elevenlabs/<path> → https://api.elevenlabs.io/<path>   (injects xi-api-key)
//
// Deploy + secrets: see worker/README.md.

const UPSTREAMS = {
  anthropic:  { base: 'https://api.anthropic.com',  header: 'x-api-key',  secret: 'ANTHROPIC_API_KEY' },
  elevenlabs: { base: 'https://api.elevenlabs.io',  header: 'xi-api-key', secret: 'ELEVENLABS_API_KEY' },
};

// Origins allowed to call the relay. This is browser-enforced only — a curl
// with a faked Origin header gets through — so it deters casual abuse, not a
// determined attacker who finds the Worker URL. Acceptable for a single-user
// app; add a shared-token check (and rotate keys) before sharing AIMM.
const ALLOWED_ORIGINS = [
  'https://begb0037admin.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function jsonResponse(value, status, extraHeaders = {}){
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function corsJsonResponse(value, status, origin, request){
  return jsonResponse(value, status, { ...corsHeaders(origin, request) });
}

async function readJson(request){
  return JSON.parse(await request.text());
}

function extractVoyageEmbeddings(payload){
  if (!payload || !Array.isArray(payload.data)) {
    throw new Error('Voyage response missing data array');
  }
  return payload.data.map((document, docIndex) => {
    if (!document || !Array.isArray(document.data)) {
      throw new Error(`Voyage response missing data[${docIndex}].data array`);
    }
    return document.data;
  });
}

function extractContextualEmbedding(payload, docIndex){
  const documents = extractVoyageEmbeddings(payload);
  const group = documents[docIndex];
  if (!group) throw new Error(`Voyage response missing data[${docIndex}].data entries`);
  const item = group[0];
  if (!item || !Array.isArray(item.embedding)) {
    throw new Error(`Voyage response contained an invalid embedding at data[${docIndex}].data[0]`);
  }
  return item.embedding;
}

function extractContextualGroup(payload, docIndex){
  const documents = extractVoyageEmbeddings(payload);
  const group = documents[docIndex];
  if (!group) throw new Error(`Voyage response missing data[${docIndex}].data entries`);
  if (!group.every(item => item && Array.isArray(item.embedding))) {
    throw new Error(`Voyage response contained an invalid embedding in data[${docIndex}].data`);
  }

  const hasIndexes = group.some(item => Object.prototype.hasOwnProperty.call(item, 'index'));
  if (!hasIndexes) return group.map(item => item.embedding);
  if (!group.every(item => Number.isInteger(item.index))) {
    throw new Error(`Voyage response contained an invalid index in data[${docIndex}].data`);
  }
  const ordered = new Array(group.length);
  for (const item of group){
    if (item.index < 0 || item.index >= group.length || ordered[item.index]) {
      throw new Error(`Voyage response contained an out-of-range or duplicate index in data[${docIndex}].data`);
    }
    ordered[item.index] = item.embedding;
  }
  if (ordered.some(embedding => !Array.isArray(embedding))) {
    throw new Error(`Voyage response contained incomplete indexed data[${docIndex}].data`);
  }
  return ordered;
}

async function voyageEmbeddings(inputs, inputType, apiKey){
  // The contextualizedembeddings path is the Voyage context-3 endpoint used
  // by this upgrade. Confirm the live endpoint during the first provisioned
  // smoke test before production backfill; this session must not make it.
  const response = await fetch('https://api.voyageai.com/v1/contextualizedembeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs,
      model: 'voyage-context-3',
      input_type: inputType,
      output_dimension: 1024,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Voyage HTTP ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`);
  }
  return response.json();
}

function validateUpsertBody(body){
  if (!body || typeof body.video_id !== 'string' || !body.video_id.trim()) {
    throw new Error('video_id is required');
  }
  if (!Array.isArray(body.chunks) || !body.chunks.length) {
    throw new Error('chunks must be a non-empty array');
  }
  for (const chunk of body.chunks){
    if (!chunk || !Number.isFinite(Number(chunk.chunk)) ||
        typeof chunk.text !== 'string' || !chunk.text ||
        typeof chunk.title !== 'string' || !chunk.title ||
        typeof chunk.channel !== 'string' || !chunk.channel) {
      throw new Error('each chunk requires chunk, text, title, and channel');
    }
  }
}

// Real incident, 2026-10-04: a chunk containing Jaycen Joshua's verbatim
// "eight instances of NLS bus" line was missed by BOTH BM25 and semantic
// search across many real query attempts, despite being an exact, rare-term
// match. Root cause: that specific chunk never re-states "Jaycen Joshua" --
// it's deep in a multi-part lesson transcript where the producer's name is
// only said once, early on. The embedding's only identity signal was
// `${title} — ${channel}`, and for MWTM content `channel` is always the
// generic "Mix With The Masters" (shared across all ~145 videos, zero
// discriminating signal) and `title` is just that part's topic list, never
// the producer's name. So a chunk about "NLS" with no re-stated name had
// nothing in its embedding tying it back to Jaycen Joshua at all. Fix:
// derive a real session label from video_id itself for "mwtm-" prefixed
// videos (the producer/artist/song IS encoded in the slug), and embed that
// alongside title+channel. Non-mwtm videos are untouched -- their `channel`
// field is already the real, specific YouTube channel name, not a shared
// generic one, so this gap is MWTM-specific.
function deriveSessionLabel(videoId, channel){
  if (!videoId.startsWith('mwtm-')) return channel;
  const slug = videoId.replace(/^mwtm-/, '').replace(/-p\d+$/, '');
  const readable = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `${readable} (${channel})`;
}

// Vectorize caps vector IDs at 64 bytes. Long video_id slugs (MWTM titles in
// particular, e.g. "mwtm-<producer>-<artist>-<song>-p<NN>") combined with
// "::<chunk>" routinely exceed that, causing a silent per-video upsert
// failure (VECTOR_UPSERT_ERROR 40008) -- found live during the 2026-10-03
// backfill (3 real videos hit this). Fix: hash the video_id portion down to
// a short, fixed-length, deterministic value before appending the chunk
// number, instead of concatenating the raw (unbounded-length) video_id.
// A fast synchronous hash (FNV-1a) is used rather than crypto.subtle.digest
// specifically to avoid converting both call sites to async for an ID that
// has no security requirement -- metadata.video_id (unhashed, full string)
// remains the source of truth for display/lookup; this value is purely an
// internal Vectorize key.
function hashVideoId(videoId){
  let hash = 0x811c9dc5; // FNV-1a 32-bit offset basis
  for (let i = 0; i < videoId.length; i++){
    hash ^= videoId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV-1a 32-bit prime
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function vectorIdFor(videoId, chunkNumber){
  return `${hashVideoId(videoId)}::${videoId.slice(0, 40)}::${chunkNumber}`;
}

function corsHeaders(origin, request){
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers':
      request.headers.get('Access-Control-Request-Headers') || 'Content-Type, anthropic-version',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env){
    // /health — visit in any browser tab (no Origin gate, no DevTools needed).
    // Probes both upstreams with their free endpoints (Anthropic model list,
    // ElevenLabs subscription) so it validates the secrets at zero cost.
    // Reveals nothing but "key valid / not valid".
    if (new URL(request.url).pathname === '/health'){
      const lines = [];
      for (const [name, up] of Object.entries(UPSTREAMS)){
        const key = env[up.secret];
        if (!key){ lines.push('❌ ' + up.secret + ' — secret not set'); continue; }
        try {
          const probe = await fetch(
            up.base + (name === 'anthropic' ? '/v1/models' : '/v1/user/subscription'),
            { headers: name === 'anthropic'
                ? { [up.header]: key, 'anthropic-version': '2023-06-01' }
                : { [up.header]: key } });
          lines.push(probe.ok
            ? '✅ ' + up.secret + ' — OK'
            : '❌ ' + up.secret + ' — rejected by ' + name + ' (HTTP ' + probe.status + ') — check the key value');
        } catch(e){ lines.push('❌ ' + up.secret + ' — ' + e.message); }
      }
      lines.push(env.AIMM_KV
        ? '✅ AIMM_KV — bound (captures sync ON)'
        : '⚠️ AIMM_KV — not bound (captures sync OFF; app falls back to per-browser storage). See worker/README.md "Durable captures".');
      return new Response('AIMM key relay health\n\n' + lines.join('\n') + '\n',
        { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const url = new URL(request.url);

    // Ingest is a server-to-server path. It intentionally does not use the
    // browser Origin allow-list; the shared ingest secret is mandatory and is
    // checked before reading the request body so an unset secret can never
    // become an authentication bypass.
    if (url.pathname === '/kb/upsert'){
      const suppliedKey = request.headers.get('X-AIMM-Ingest-Key');
      if (!env.AIMM_INGEST_KEY || suppliedKey !== env.AIMM_INGEST_KEY){
        return jsonResponse({ error: 'Forbidden', code: 'bad_ingest_key' }, 403);
      }
      if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
      try {
        if (!env.VOYAGE_API_KEY) return jsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501);
        if (!env.VEC_YT_KB) return jsonResponse({ error: 'VEC_YT_KB not bound', code: 'no_index' }, 501);
        const body = await readJson(request);
        validateUpsertBody(body);
        const videoId = body.video_id.trim();
        const chunks = body.chunks;
        const newChunkNumbers = chunks.map(c => Number(c.chunk));
        let staleIds = [];

        // Vectorize v2 does not provide a reliable list-by-metadata-prefix
        // operation. AIMM_KV is therefore the authoritative per-video
        // manifest: it lets a full-video upsert delete vectors removed from a
        // refreshed transcript without scanning the index.
        if (env.AIMM_KV){
          const manifestKey = `kb-vec-manifest:${videoId}`;
          const previousRaw = await env.AIMM_KV.get(manifestKey);
          const previous = previousRaw ? JSON.parse(previousRaw) : [];
          const keep = new Set(newChunkNumbers);
          staleIds = (Array.isArray(previous) ? previous : [])
            .filter(number => !keep.has(Number(number)))
            .map(number => vectorIdFor(videoId, number));
        } else {
          // Without the existing AIMM_KV manifest, Vectorize cannot safely
          // enumerate stale ids by metadata. Upsert remains correct for the
          // current set, but stale vectors require restoring the binding and
          // rerunning this full-video operation.
        }

        const BATCH_SIZE = 50;
        for (let start = 0; start < chunks.length; start += BATCH_SIZE){
          const batch = chunks.slice(start, start + BATCH_SIZE);
          // Each batch is embedded as one contextualized document group. For
          // giant videos, context across groups is lost; this is an
          // acceptable tradeoff to stay within the provider's request size.
          const inputs = [batch.map(c => `${deriveSessionLabel(videoId, c.channel)} — ${c.title}\n\n${c.text}`)];
          const voyage = await voyageEmbeddings(inputs, 'document', env.VOYAGE_API_KEY);
          const batchEmbeddings = extractContextualGroup(voyage, 0);
          const vectors = batch.map((chunk, i) => ({
            id: vectorIdFor(videoId, chunk.chunk),
            values: batchEmbeddings[i],
            metadata: {
              video_id: videoId,
              chunk: Number(chunk.chunk),
              title: chunk.title,
              channel: chunk.channel,
              text: chunk.text,
            },
          }));
          if (!vectors.every(v => Array.isArray(v.values))) throw new Error('Voyage returned incomplete batch embeddings');
          await env.VEC_YT_KB.upsert(vectors);
        }

        if (staleIds.length) await env.VEC_YT_KB.deleteByIds(staleIds);
        if (env.AIMM_KV){
          await env.AIMM_KV.put(`kb-vec-manifest:${videoId}`, JSON.stringify(newChunkNumbers));
        }
        return jsonResponse({
          ok: true,
          video_id: videoId,
          chunks_upserted: chunks.length,
          stale_deleted: staleIds.length,
        }, 200);
      } catch(e){
        return jsonResponse({ error: e.message || String(e), code: 'upsert_failed' }, 502);
      }
    }

    // Research/debug-only; added 2026-10-05 for the KB chunk-dilution validation pilot (ROADMAP item 37); never called by index.html.
    if (url.pathname === '/kb/embed-debug'){
      const suppliedKey = request.headers.get('X-AIMM-Ingest-Key');
      if (!env.AIMM_INGEST_KEY || suppliedKey !== env.AIMM_INGEST_KEY){
        return jsonResponse({ error: 'Forbidden', code: 'bad_ingest_key' }, 403);
      }
      if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
      try {
        if (!env.VOYAGE_API_KEY) return jsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501);
        const body = await readJson(request);
        if (!body || !Array.isArray(body.inputs) || !body.inputs.length) {
          throw new Error('inputs must be a non-empty array');
        }
        if (body.inputs.length > 50) throw new Error('inputs must contain no more than 50 items');
        if (body.inputs.some(input => typeof input !== 'string' || !input.trim())) {
          throw new Error('inputs must contain only non-empty strings');
        }
        const inputType = body.input_type === undefined ? 'document' : body.input_type;
        if (inputType !== 'document' && inputType !== 'query') {
          throw new Error('input_type must be document or query');
        }
        const voyage = await voyageEmbeddings([body.inputs], inputType, env.VOYAGE_API_KEY);
        const embeddings = extractContextualGroup(voyage, 0);
        return jsonResponse({ embeddings }, 200);
      } catch(e){
        return jsonResponse({ error: e.message || String(e), code: 'embed_debug_failed' }, 502);
      }
    }

    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)){
      return new Response('Forbidden origin', { status: 403 });
    }
    if (request.method === 'OPTIONS'){
      return new Response(null, { status: 204, headers: corsHeaders(origin, request) });
    }

    // /captures — durable cross-device store for Hope's capture_to_roadmap
    // inbox, backed by Workers KV (binding: AIMM_KV). The app and
    // DASHBOARD.html sync the full array here; localStorage stays as the
    // offline fallback. Single-user, last-write-wins.
    if (url.pathname === '/captures'){
      const cors = corsHeaders(origin, request);
      if (!env.AIMM_KV){
        return new Response(JSON.stringify({ error: 'KV binding AIMM_KV is not configured on this Worker — see worker/README.md "Durable captures"' }),
          { status: 501, headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      if (request.method === 'GET'){
        const raw = await env.AIMM_KV.get('captures');
        return new Response(raw || '[]', { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      if (request.method === 'PUT'){
        const body = await request.text();
        try {
          const v = JSON.parse(body);
          if (!Array.isArray(v)) throw new Error('not an array');
        } catch(_){
          return new Response('Expected a JSON array of capture entries', { status: 400, headers: cors });
        }
        await env.AIMM_KV.put('captures', body);
        return new Response('{"ok":true}', { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    if (url.pathname === '/kb/vector-search'){
      const cors = corsHeaders(origin, request);
      try {
        if (!env.VOYAGE_API_KEY) return corsJsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501, origin, request);
        if (!env.VEC_YT_KB) return corsJsonResponse({ error: 'VEC_YT_KB not bound', code: 'no_index' }, 501, origin, request);
        const body = await readJson(request);
        const query = typeof body.query === 'string' ? body.query.trim() : '';
        if (!query) return corsJsonResponse({ error: 'query is required' }, 400, origin, request);
        const requested = Number(body.n);
        const n = Number.isFinite(requested) ? Math.max(1, Math.min(requested, 30)) : 20;
        const voyage = await voyageEmbeddings([[query]], 'query', env.VOYAGE_API_KEY);
        const vector = extractContextualEmbedding(voyage, 0);
        const result = await env.VEC_YT_KB.query(vector, { topK: n, returnMetadata: 'all' });
        const matches = Array.isArray(result && result.matches) ? result.matches : [];
        return corsJsonResponse({ results: matches.map(match => {
          const metadata = match.metadata || {};
          return {
            video_id: metadata.video_id,
            chunk: Number(metadata.chunk),
            title: metadata.title,
            channel: metadata.channel,
            text: metadata.text,
            score: match.score,
          };
        }) }, 200, origin, request);
      } catch(e){
        return corsJsonResponse({ error: e.message || String(e), code: 'vector_search_failed' }, 502, origin, request);
      }
    }

    if (url.pathname === '/kb/rerank'){
      const cors = corsHeaders(origin, request);
      try {
        if (!env.COHERE_API_KEY) return corsJsonResponse({ error: 'COHERE_API_KEY not set', code: 'no_key' }, 501, origin, request);
        const body = await readJson(request);
        const query = typeof body.query === 'string' ? body.query.trim() : '';
        const documents = Array.isArray(body.documents) ? body.documents : [];
        if (!query || documents.some(d => !d || typeof d.id !== 'string' || typeof d.text !== 'string')) {
          return corsJsonResponse({ error: 'query and documents[{id,text}] are required' }, 400, origin, request);
        }
        const requestedTopN = Number(body.top_n);
        const topN = requestedTopN || documents.length;
        const upstream = await fetch('https://api.cohere.com/v2/rerank', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'rerank-v3.5',
            query,
            documents: documents.map(d => d.text),
            top_n: topN,
          }),
        });
        if (!upstream.ok) {
          const detail = await upstream.text();
          throw new Error(`Cohere HTTP ${upstream.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`);
        }
        const payload = await upstream.json();
        if (!Array.isArray(payload.results)) throw new Error('Cohere response missing results array');
        const results = payload.results;
        // Require BOTH a valid index and a finite relevance_score on every
        // kept item — an item missing relevance_score would otherwise sort
        // as NaN (unstable ordering) while still looking like a successful
        // rerank to the caller.
        const valid = results.filter(item =>
          item && Number.isInteger(item.index) && documents[item.index] &&
          Number.isFinite(item.relevance_score));
        if (results.length && !valid.length) {
          throw new Error('Cohere response contained no valid {index, relevance_score} results');
        }
        return corsJsonResponse({ results: valid
          .map(item => ({ id: documents[item.index].id, relevance_score: item.relevance_score }))
          .sort((a, b) => b.relevance_score - a.relevance_score) }, 200, origin, request);
      } catch(e){
        return corsJsonResponse({ error: e.message || String(e), code: 'rerank_failed' }, 502, origin, request);
      }
    }

    const m = url.pathname.match(/^\/(anthropic|elevenlabs)(\/.*)$/);
    if (!m){
      return new Response('Not found', { status: 404, headers: corsHeaders(origin, request) });
    }

    const up = UPSTREAMS[m[1]];
    const key = env[up.secret];
    if (!key){
      return new Response('Worker secret ' + up.secret + ' is not set — run: npx wrangler secret put ' + up.secret,
        { status: 500, headers: corsHeaders(origin, request) });
    }

    // Forward the request as-is, minus browser/identity headers, plus the
    // real key. Body streams through untouched (JSON and multipart alike).
    const headers = new Headers(request.headers);
    headers.delete('Origin');
    headers.delete('Host');
    headers.delete('Cookie');
    headers.delete('x-api-key');
    headers.delete('xi-api-key');
    headers.set(up.header, key);

    const upstream = await fetch(up.base + m[2] + url.search, {
      method: request.method,
      headers,
      body: (request.method === 'GET' || request.method === 'HEAD') ? undefined : request.body,
    });

    const respHeaders = new Headers(upstream.headers);
    for (const [k, v] of Object.entries(corsHeaders(origin, request))) respHeaders.set(k, v);
    return new Response(upstream.body, { status: upstream.status, headers: respHeaders });
  },
};
