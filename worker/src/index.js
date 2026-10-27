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
  'https://aimixmasters.com',
  'https://www.aimixmasters.com',
  'https://begb0037admin.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:8765',
  'http://127.0.0.1:8765',
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

async function hopeSpeechTicket(secret, origin){
  const expires = Date.now() + 60_000;
  const nonce = crypto.randomUUID();
  const message = `${origin}|${expires}|${nonce}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(secret)), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
  const hex = Array.from(signature, byte => byte.toString(16).padStart(2,'0')).join('');
  return `${expires}.${nonce}.${hex}`;
}

async function hopeSpeechTicketValid(ticket, secret, origin){
  const match = String(ticket || '').match(/^(\d{13})\.([0-9a-f-]{36})\.([0-9a-f]{64})$/i);
  if (!match) return false;
  const expires = Number(match[1]);
  if (expires < Date.now() || expires > Date.now() + 60_000) return false;
  const message = `${origin}|${expires}|${match[2]}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(secret)), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
  const hex = Array.from(signature, byte => byte.toString(16).padStart(2,'0')).join('');
  let mismatch = hex.length ^ match[3].length;
  for (let i=0;i<hex.length;i++) mismatch |= hex.charCodeAt(i) ^ match[3].charCodeAt(i);
  return mismatch === 0;
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
    // Let the browser read ElevenLabs' actual per-request character charge for
    // Hope's optional usage-based TTS path. The Worker still passes upstream
    // billing headers through unchanged.
    'Access-Control-Expose-Headers': 'character-cost, x-character-count, request-id, xi-request-id',
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

    // Research/debug-only; added 2026-10-05 for the KB chunk-dilution validation pilot (ROADMAP item 37); never called by index.html; uses its own EMBED_DEBUG_KEY secret, not the production ingest key.
    if (url.pathname === '/kb/embed-debug'){
      const suppliedKey = request.headers.get('X-AIMM-Ingest-Key');
      if (!env.EMBED_DEBUG_KEY || suppliedKey !== env.EMBED_DEBUG_KEY){
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
        let embeddings;
        if (inputType === 'query') {
          const voyage = await voyageEmbeddings(body.inputs.map(text => [text]), 'query', env.VOYAGE_API_KEY);
          embeddings = body.inputs.map((_, i) => extractContextualEmbedding(voyage, i));
        } else {
          const voyage = await voyageEmbeddings([body.inputs], 'document', env.VOYAGE_API_KEY);
          embeddings = extractContextualGroup(voyage, 0);
        }
        return jsonResponse({ embeddings }, 200);
      } catch(e){
        return jsonResponse({ error: e.message || String(e), code: 'embed_debug_failed' }, 502);
      }
    }

    if (url.pathname === '/research/kb-search'){
      if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
      if (!env.RESEARCH_TOKEN) return jsonResponse({ error: 'research route not configured' }, 503);
      const authorization = request.headers.get('Authorization') || '';
      const bearer = authorization.match(/^Bearer\s+(.+)$/i);
      const supplied = bearer ? bearer[1] : '';
      const expected = String(env.RESEARCH_TOKEN);
      let mismatch = supplied.length ^ expected.length;
      for (let i = 0; i < Math.max(supplied.length, expected.length); i++) {
        mismatch |= (supplied.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
      }
      if (!bearer || mismatch !== 0) return jsonResponse({ error: 'Unauthorized' }, 401);
      let body;
      try {
        body = await readJson(request);
        if (body && body.mode === 'embed') {
          if (!env.VOYAGE_API_KEY) return jsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501);
          const inputType = body.input_type === undefined ? 'document' : body.input_type;
          if (inputType !== 'document' && inputType !== 'query') {
            return jsonResponse({ error: "input_type must be 'document' or 'query'" }, 400);
          }
          if (!Array.isArray(body.inputs) || body.inputs.length === 0 || body.inputs.some(text => typeof text !== 'string' || text.length === 0)) {
            return jsonResponse({ error: 'inputs must be a non-empty array of non-empty strings' }, 400);
          }
          if (body.inputs.length > 50) {
            return jsonResponse({ error: 'inputs must contain at most 50 texts' }, 400);
          }
          const voyage = await voyageEmbeddings(body.inputs.map(text => [text]), inputType, env.VOYAGE_API_KEY);
          return jsonResponse({ embeddings: body.inputs.map((_, i) => extractContextualEmbedding(voyage, i)) }, 200);
        }
        if (body && body.mode === 'vector') {
          if (!env.VOYAGE_API_KEY) return jsonResponse({ error: 'VOYAGE_API_KEY not set', code: 'no_key' }, 501);
          if (!env.VEC_YT_KB) return jsonResponse({ error: 'VEC_YT_KB not bound', code: 'no_index' }, 501);
          const query = typeof body.query === 'string' ? body.query.trim() : '';
          if (!query) return jsonResponse({ error: 'query is required' }, 400);
          const requested = Number(body.n);
          const n = Number.isFinite(requested) ? Math.max(1, Math.min(requested, 30)) : 20;
          const voyage = await voyageEmbeddings([[query]], 'query', env.VOYAGE_API_KEY);
          const vector = extractContextualEmbedding(voyage, 0);
          const result = await env.VEC_YT_KB.query(vector, { topK: n, returnMetadata: 'all' });
          const matches = Array.isArray(result && result.matches) ? result.matches : [];
          return jsonResponse({ results: matches.map(match => {
            const metadata = match.metadata || {};
            return {
              video_id: metadata.video_id,
              chunk: Number(metadata.chunk),
              title: metadata.title,
              channel: metadata.channel,
              text: metadata.text,
              score: match.score,
            };
          }) }, 200);
        }
        if (body && body.mode === 'rerank') {
          if (!env.COHERE_API_KEY) return jsonResponse({ error: 'COHERE_API_KEY not set', code: 'no_key' }, 501);
          const query = typeof body.query === 'string' ? body.query.trim() : '';
          const documents = Array.isArray(body.documents) ? body.documents : [];
          if (!query || documents.some(d => !d || typeof d.id !== 'string' || typeof d.text !== 'string')) {
            return jsonResponse({ error: 'query and documents[{id,text}] are required' }, 400);
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
          const valid = results.filter(item =>
            item && Number.isInteger(item.index) && documents[item.index] &&
            Number.isFinite(item.relevance_score));
          if (results.length && !valid.length) {
            throw new Error('Cohere response contained no valid {index, relevance_score} results');
          }
          return jsonResponse({ results: valid
            .map(item => ({ id: documents[item.index].id, relevance_score: item.relevance_score }))
            .sort((a, b) => b.relevance_score - a.relevance_score) }, 200);
        }
        return jsonResponse({ error: 'mode must be embed, vector, or rerank' }, 400);
      } catch(e){
        const code = body && body.mode === 'rerank' ? 'rerank_failed' : 'vector_search_failed';
        return jsonResponse({ error: e.message || String(e), code }, 502);
      }
    }

    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)){
      return new Response('Forbidden origin', { status: 403 });
    }
    if (request.method === 'OPTIONS'){
      return new Response(null, { status: 204, headers: corsHeaders(origin, request) });
    }

    // A short-lived ticket lets the browser open a streaming socket without
    // ever receiving the long-lived Deepgram API key or reusing the static
    // Hope speech token in a WebSocket URL.
    if (url.pathname === '/hope/stt/ticket'){
      if (request.method !== 'POST') return corsJsonResponse({ error:'Method not allowed' },405,origin,request);
      if (!env.HOPE_STT_TOKEN) return corsJsonResponse({ error:'Hope speech access is not configured',code:'no_stt_auth' },503,origin,request);
      const supplied=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
      const expected=String(env.HOPE_STT_TOKEN);
      let mismatch=supplied.length^expected.length;
      for(let i=0;i<Math.max(supplied.length,expected.length);i++)mismatch|=(supplied.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
      if(!supplied||mismatch!==0)return corsJsonResponse({ error:'Hope speech access token is missing or invalid',code:'invalid_stt_auth' },401,origin,request);
      return corsJsonResponse({ ticket:await hopeSpeechTicket(expected,origin),expires_in:60 },200,origin,request);
    }

    // A signed, short-lived preflight exposes the actual upstream handshake
    // failure to the app. WebSocket.onerror hides HTTP response bodies/status.
    if (url.pathname === '/hope/stt/probe'){
      if(request.method!=='POST')return corsJsonResponse({error:'Method not allowed'},405,origin,request);
      if(!env.DEEPGRAM_API_KEY)return corsJsonResponse({ok:false,code:'no_deepgram_key',error:'Deepgram speech is not configured.'},503,origin,request);
      if(!env.HOPE_STT_TOKEN||!(await hopeSpeechTicketValid(url.searchParams.get('ticket'),env.HOPE_STT_TOKEN,origin)))return corsJsonResponse({ok:false,code:'invalid_ticket',error:'Speech check expired. Restart the microphone.'},401,origin,request);
      try{
        const upstream=await fetch('https://api.deepgram.com/v2/listen?model=flux-general-en&eot_threshold=0.65&eot_timeout_ms=1600&tag=aimm-hope',{
          headers:{Upgrade:'websocket',Authorization:'Token '+String(env.DEEPGRAM_API_KEY).trim()}
        });
        if(upstream.status===101&&upstream.webSocket){try{upstream.webSocket.close(1000,'preflight complete');}catch(_){}return corsJsonResponse({ok:true},200,origin,request);}
        const detail=(await upstream.text().catch(()=>'' )).replace(/\s+/g,' ').slice(0,400);
        return corsJsonResponse({ok:false,code:'deepgram_connect_failed',status:upstream.status,error:detail||'Deepgram rejected the live speech handshake.'},502,origin,request);
      }catch(error){
        const detail=String(error&&error.message||error).replace(/\s+/g,' ').slice(0,300);
        return corsJsonResponse({ok:false,code:'deepgram_unavailable',error:detail||'Could not connect to Deepgram live speech.'},502,origin,request);
      }
    }

    // Deepgram Flux streaming proxy. Only the short-lived signed ticket is
    // accepted from the browser; the permanent API key stays in Worker Secrets.
    if (url.pathname === '/hope/stt/stream'){
      if(request.method!=='GET'||(request.headers.get('Upgrade')||'').toLowerCase()!=='websocket')return corsJsonResponse({ error:'WebSocket upgrade required',code:'upgrade_required' },426,origin,request);
      if(!env.DEEPGRAM_API_KEY)return corsJsonResponse({ error:'Deepgram speech is not configured',code:'no_deepgram_key' },503,origin,request);
      if(!env.HOPE_STT_TOKEN)return corsJsonResponse({ error:'Hope speech access is not configured',code:'no_stt_auth' },503,origin,request);
      if(!(await hopeSpeechTicketValid(url.searchParams.get('ticket'),env.HOPE_STT_TOKEN,origin)))return corsJsonResponse({ error:'Speech connection ticket is invalid or expired. Restart the microphone.',code:'invalid_ticket' },401,origin,request);
      if(!env.HOPE_STT_LIMIT)return corsJsonResponse({ error:'Hope speech rate limit is not configured',code:'no_rate_limit' },503,origin,request);
      const ip=request.headers.get('CF-Connecting-IP')||'unknown';
      const {success}=await env.HOPE_STT_LIMIT.limit({key:ip});
      if(!success)return corsJsonResponse({ error:'Hope voice is being used too quickly. Wait a minute and try again.',code:'rate_limited' },429,origin,request);
      try{
        const upstream=await fetch('https://api.deepgram.com/v2/listen?model=flux-general-en&eot_threshold=0.65&eot_timeout_ms=1600&tag=aimm-hope',{
          headers:{ Upgrade:'websocket', Authorization:'Token '+String(env.DEEPGRAM_API_KEY).trim() }
        });
        if(upstream.status!==101||!upstream.webSocket)return corsJsonResponse({ error:'Deepgram could not open a live speech connection (HTTP '+upstream.status+').',code:'deepgram_connect_failed' },502,origin,request);
        const pair=new WebSocketPair();
        const [client,server]=Object.values(pair);
        const dg=upstream.webSocket;
        // With the Worker's 2026 compatibility date, WebSocket binary frames
        // arrive as Blob by default. Cloudflare's WebSocket.send() accepts
        // strings, ArrayBuffers, and views — not Blob — so the old relay
        // silently dropped every microphone frame inside its catch block.
        // Normalize both sides before accepting sockets to preserve binary
        // audio frames across the proxy.
        server.binaryType='arraybuffer';
        dg.binaryType='arraybuffer';
        server.accept({allowHalfOpen:true});
        dg.accept({allowHalfOpen:true});
        const relay=(from,to)=>{
          from.addEventListener('message',event=>{try{if(to.readyState===WebSocket.OPEN)to.send(event.data);}catch(error){console.error('[Hope STT] WebSocket frame relay failed:',String(error&&error.message||error));try{if(to.readyState<WebSocket.CLOSING)to.close(1011,'speech frame relay failed');}catch(_){}}});
          from.addEventListener('close',event=>{try{if(to.readyState< WebSocket.CLOSING)to.close(event.code||1000,event.reason||'closed');}catch(_){}});
          from.addEventListener('error',()=>{try{if(to.readyState< WebSocket.CLOSING)to.close(1011,'speech connection error');}catch(_){}});
        };
        relay(server,dg);relay(dg,server);
        return new Response(null,{status:101,webSocket:client});
      }catch(_){
        return corsJsonResponse({ error:'Could not connect to Deepgram live speech.',code:'deepgram_unavailable' },502,origin,request);
      }
    }

    // /hope/stt — short, in-memory push-to-talk transcription for Hope's
    // optional usage-based voice mode. Audio is never written to KV or R2.
    if (url.pathname === '/hope/stt'){
      if (request.method !== 'POST') return corsJsonResponse({ error: 'Method not allowed' }, 405, origin, request);
      if (!env.HOPE_STT_TOKEN) return corsJsonResponse({ error: 'Hope speech access is not configured', code: 'no_stt_auth' }, 503, origin, request);
      const supplied = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
      const expected = String(env.HOPE_STT_TOKEN);
      let mismatch = supplied.length ^ expected.length;
      const compareLength = Math.max(supplied.length, expected.length);
      for (let i = 0; i < compareLength; i++) mismatch |= (supplied.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
      if (!supplied || mismatch !== 0) return corsJsonResponse({ error: 'Hope speech access token is missing or invalid', code: 'invalid_stt_auth' }, 401, origin, request);
      if (!env.AI) return corsJsonResponse({ error: 'Workers AI binding is not configured', code: 'no_ai_binding' }, 501, origin, request);
      if (!env.HOPE_STT_LIMIT) return corsJsonResponse({ error: 'Hope transcription rate limit is not configured', code: 'no_rate_limit' }, 503, origin, request);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.HOPE_STT_LIMIT.limit({ key: ip });
      if (!success) return corsJsonResponse({ error: 'Hope voice is being used too quickly. Wait a minute and try again.', code: 'rate_limited' }, 429, origin, request);
      const contentType = String(request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
      if (contentType !== 'audio/wav' && contentType !== 'audio/x-wav') {
        return corsJsonResponse({ error: 'Expected a mono 16 kHz PCM WAV recording', code: 'unsupported_audio' }, 415, origin, request);
      }
      const maxBytes = 1_000_000;
      const declaredBytes = Number(request.headers.get('Content-Length'));
      if (Number.isFinite(declaredBytes) && declaredBytes > maxBytes) return corsJsonResponse({ error: 'Recording is too large (maximum 30 seconds)', code: 'audio_too_large' }, 413, origin, request);
      let bytes;
      try {
        const reader = request.body && request.body.getReader();
        if (!reader) return corsJsonResponse({ error: 'Recording body is empty', code: 'empty_audio' }, 400, origin, request);
        const chunks = []; let total = 0;
        while (true){
          const { value, done } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > maxBytes){ await reader.cancel(); return corsJsonResponse({ error: 'Recording is too large (maximum 30 seconds)', code: 'audio_too_large' }, 413, origin, request); }
          chunks.push(value);
        }
        if (!total) return corsJsonResponse({ error: 'Recording body is empty', code: 'empty_audio' }, 400, origin, request);
        bytes = new Uint8Array(total); let offset = 0;
        for (const chunk of chunks){ bytes.set(chunk, offset); offset += chunk.byteLength; }
      } catch(e){
        return corsJsonResponse({ error: 'Could not read the audio recording', code: 'audio_read_failed' }, 400, origin, request);
      }
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      if (bytes.length < 44 || view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57415645) {
        return corsJsonResponse({ error: 'Recording is not a valid WAV file', code: 'invalid_wav' }, 400, origin, request);
      }
      let format = null, dataOffset = -1, dataBytes = 0;
      for (let chunkOffset = 12; chunkOffset + 8 <= bytes.length;){
        const chunkId = view.getUint32(chunkOffset, false);
        const chunkSize = view.getUint32(chunkOffset + 4, true);
        const chunkData = chunkOffset + 8;
        const chunkEnd = chunkData + chunkSize;
        if (chunkEnd > bytes.length) return corsJsonResponse({ error: 'WAV chunk exceeds the recording boundary', code: 'invalid_wav' }, 400, origin, request);
        if (chunkId === 0x666d7420){
          if (chunkSize < 16) return corsJsonResponse({ error: 'WAV format chunk is incomplete', code: 'invalid_wav' }, 400, origin, request);
          format = { code:view.getUint16(chunkData,true), channels:view.getUint16(chunkData+2,true), rate:view.getUint32(chunkData+4,true), bits:view.getUint16(chunkData+14,true) };
        } else if (chunkId === 0x64617461){ dataOffset = chunkData; dataBytes = chunkSize; break; }
        chunkOffset = chunkEnd + (chunkSize & 1);
      }
      if (!format || format.code !== 1 || format.rate !== 16000 || format.channels !== 1 || format.bits !== 16) {
        return corsJsonResponse({ error: 'Recording must be mono 16 kHz, 16-bit PCM WAV', code: 'invalid_wav_format' }, 400, origin, request);
      }
      if (dataOffset < 0 || !dataBytes || dataBytes > 960000 || dataOffset + dataBytes > bytes.length) {
        return corsJsonResponse({ error: 'Recording must contain no more than 30 seconds of audio', code: 'invalid_audio_duration' }, 413, origin, request);
      }
      try {
        const result = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
          audio: { body: new Response(bytes).body, contentType: 'audio/wav' },
          task: 'transcribe', language: 'en', beam_size: 1,
          initial_prompt: 'AIMM audio mixing and mastering: stems, 808, LUFS, true peak, EQ, bus, sidechain, compressor, limiter, Waves, FabFilter, Ozone.'
        });
        const text = String(result && result.text || '').trim();
        if (!text) return corsJsonResponse({ error: 'No speech detected in the recording', code: 'no_speech' }, 422, origin, request);
        return corsJsonResponse({ text, language: result && result.transcription_info && result.transcription_info.language || 'en' }, 200, origin, request);
      } catch(e){
        return corsJsonResponse({ error: 'Cloudflare transcription failed', code: 'stt_failed' }, 502, origin, request);
      }
    }

    // /hope/luna — streamed GPT-6 Luna Responses API for Hope's custom voice
    // route. The key remains a Worker secret; model responses are not stored.
    if (url.pathname === '/hope/luna'){
      if(request.method!=='POST')return corsJsonResponse({error:'Method not allowed'},405,origin,request);
      if(!env.HOPE_STT_TOKEN)return corsJsonResponse({error:'Hope speech access is not configured',code:'no_stt_auth'},503,origin,request);
      const supplied=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
      const expected=String(env.HOPE_STT_TOKEN);
      let mismatch=supplied.length^expected.length;
      for(let i=0;i<Math.max(supplied.length,expected.length);i++)mismatch|=(supplied.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
      if(!supplied||mismatch!==0)return corsJsonResponse({error:'Hope speech access token is missing or invalid',code:'invalid_stt_auth'},401,origin,request);
      if(!env.OPENAI_API_KEY)return corsJsonResponse({error:'GPT-6 Luna is not configured on the AIMM Worker',code:'no_openai_key'},503,origin,request);
      if(!env.HOPE_STT_LIMIT)return corsJsonResponse({error:'Hope speech rate limit is not configured',code:'no_rate_limit'},503,origin,request);
      const ip=request.headers.get('CF-Connecting-IP')||'unknown';
      const {success}=await env.HOPE_STT_LIMIT.limit({key:ip});
      if(!success)return corsJsonResponse({error:'Hope voice is being used too quickly. Wait a minute and try again.',code:'rate_limited'},429,origin,request);
      let body;
      try{body=await readJson(request);}
      catch(_){return corsJsonResponse({error:'Expected a JSON Luna request',code:'invalid_luna_request'},400,origin,request);}
      if(!body||!Array.isArray(body.input)||!body.input.length||body.input.length>24||JSON.stringify(body).length>100000)
        return corsJsonResponse({error:'Luna request is empty or too large',code:'luna_request_too_large'},413,origin,request);
      const safeBody={
        model:'gpt-6-luna',reasoning:{effort:'low'},input:body.input,
        max_output_tokens:Math.max(64,Math.min(512,Number(body.max_output_tokens)||220)),
        stream:true,store:false,
        ...(Array.isArray(body.tools)&&body.tools.length?{tools:body.tools.slice(0,40),tool_choice:'auto'}:{})
      };
      try{
        const upstream=await fetch('https://api.openai.com/v1/responses',{
          method:'POST',headers:{Authorization:'Bearer '+String(env.OPENAI_API_KEY).trim(),'Content-Type':'application/json'},body:JSON.stringify(safeBody)
        });
        if(!upstream.ok){
          const detail=(await upstream.text().catch(()=>'' )).replace(/\s+/g,' ').slice(0,400);
          return corsJsonResponse({error:'GPT-6 Luna request failed (HTTP '+upstream.status+')'+(detail?': '+detail:''),code:'luna_request_failed'},upstream.status,origin,request);
        }
        const headers=new Headers(corsHeaders(origin,request));
        headers.set('Content-Type',upstream.headers.get('Content-Type')||'text/event-stream; charset=utf-8');
        headers.set('Cache-Control','no-cache, no-transform');
        headers.set('X-Accel-Buffering','no');
        return new Response(upstream.body,{status:200,headers});
      }catch(_){return corsJsonResponse({error:'Could not reach GPT-6 Luna',code:'luna_unavailable'},502,origin,request);}
    }

    // /hope/web-search — one Claude web-search call for Luna's KB fallback.
    // Anthropic credentials stay in Worker Secrets; callers use the same
    // short-lived Hope usage token and per-IP rate limit as /hope/luna.
    if (url.pathname === '/hope/web-search'){
      if(request.method!=='POST')return corsJsonResponse({error:'Method not allowed'},405,origin,request);
      if(!env.HOPE_STT_TOKEN)return corsJsonResponse({error:'Hope speech access is not configured',code:'no_stt_auth'},503,origin,request);
      const supplied=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
      const expected=String(env.HOPE_STT_TOKEN);
      let mismatch=supplied.length^expected.length;
      for(let i=0;i<Math.max(supplied.length,expected.length);i++)mismatch|=(supplied.charCodeAt(i)||0)^(expected.charCodeAt(i)||0);
      if(!supplied||mismatch!==0)return corsJsonResponse({error:'Hope speech access token is missing or invalid',code:'invalid_stt_auth'},401,origin,request);
      if(!env.ANTHROPIC_API_KEY)return corsJsonResponse({error:'Web search is not configured on the AIMM Worker',code:'no_anthropic_key'},503,origin,request);
      if(!env.HOPE_STT_LIMIT)return corsJsonResponse({error:'Hope web-search rate limit is not configured',code:'no_rate_limit'},503,origin,request);
      const ip=request.headers.get('CF-Connecting-IP')||'unknown';
      const {success}=await env.HOPE_STT_LIMIT.limit({key:ip});
      if(!success)return corsJsonResponse({error:'Hope web search is being used too quickly. Wait a minute and try again.',code:'rate_limited'},429,origin,request);
      let body;
      try{body=await readJson(request);}
      catch(_){return corsJsonResponse({error:'Expected a JSON web-search request',code:'invalid_web_search_request'},400,origin,request);}
      const query=String(body&&body.query||'').trim();
      if(!query||query.length>1000)return corsJsonResponse({error:'Query must contain 1–1000 characters',code:'invalid_web_search_query'},400,origin,request);
      try{
        const upstream=await fetch('https://api.anthropic.com/v1/messages',{
          method:'POST',headers:{'x-api-key':String(env.ANTHROPIC_API_KEY).trim(),'anthropic-version':'2023-06-01','Content-Type':'application/json'},
          body:JSON.stringify({model:'claude-haiku-5-5',max_tokens:700,system:'Answer the question briefly using web search. Include relevant current facts and cite source URLs. Do not answer from memory when the search does not provide support.',tools:[{type:'web_search_20250305',name:'web_search',max_uses:3}],messages:[{role:'user',content:query}]})
        });
        if(!upstream.ok){
          const detail=(await upstream.text().catch(()=>'' )).replace(/\s+/g,' ').slice(0,300);
          return corsJsonResponse({error:'Claude web search failed (HTTP '+upstream.status+')'+(detail?': '+detail:''),code:'web_search_failed'},502,origin,request);
        }
        const result=await upstream.json();
        const content=Array.isArray(result.content)?result.content:[];
        const answer=content.filter(block=>block&&block.type==='text').map(block=>String(block.text||'')).join('\n').trim().slice(0,5000);
        const urls=new Set();
        const collectUrls=value=>{
          if(!value)return;
          if(Array.isArray(value)){for(const item of value)collectUrls(item);return;}
          if(typeof value!=='object')return;
          if(typeof value.url==='string'&&/^https?:\/\//i.test(value.url))urls.add(value.url);
          for(const child of Object.values(value))if(child&&typeof child==='object')collectUrls(child);
        };
        collectUrls(content);
        return corsJsonResponse({answer,sources:Array.from(urls).slice(0,10),web_search_requests:Number(result.usage&&result.usage.server_tool_use&&result.usage.server_tool_use.web_search_requests)||0},200,origin,request);
      }catch(_){return corsJsonResponse({error:'Could not reach Claude web search',code:'web_search_unavailable'},502,origin,request);}
    }

    // /hope/tts — private Flash speech endpoint for the optional Usage route.
    // /hope/read-aloud — one-click typed-chat read-back; allowed origins,
    // per-IP rate limit and a 2,400-character cap bound use of the TTS-only key
    // without requiring the separate microphone/Usage access token.
    if (url.pathname === '/hope/tts' || url.pathname === '/hope/read-aloud'){
      if (request.method !== 'POST') return corsJsonResponse({ error: 'Method not allowed' }, 405, origin, request);
      if (url.pathname === '/hope/tts'){
        if (!env.HOPE_STT_TOKEN) return corsJsonResponse({ error: 'Hope speech access is not configured', code: 'no_stt_auth' }, 503, origin, request);
        const supplied = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
        const expected = String(env.HOPE_STT_TOKEN);
        let mismatch = supplied.length ^ expected.length;
        const compareLength = Math.max(supplied.length, expected.length);
        for (let i = 0; i < compareLength; i++) mismatch |= (supplied.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
        if (!supplied || mismatch !== 0) return corsJsonResponse({ error: 'Hope speech access token is missing or invalid', code: 'invalid_stt_auth' }, 401, origin, request);
      }
      if (!env.HOPE_USAGE_TTS_API_KEY) return corsJsonResponse({ error: 'Hope usage speech is not configured', code: 'no_tts_key' }, 503, origin, request);
      if (!env.HOPE_STT_LIMIT) return corsJsonResponse({ error: 'Hope speech rate limit is not configured', code: 'no_rate_limit' }, 503, origin, request);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.HOPE_STT_LIMIT.limit({ key: ip });
      if (!success) return corsJsonResponse({ error: 'Hope voice is being used too quickly. Wait a minute and try again.', code: 'rate_limited' }, 429, origin, request);
      const declaredBytes = Number(request.headers.get('Content-Length'));
      if (Number.isFinite(declaredBytes) && declaredBytes > 15000) return corsJsonResponse({ error: 'Speech text is too large', code: 'text_too_large' }, 413, origin, request);
      let body;
      try { body = await readJson(request); }
      catch(_){ return corsJsonResponse({ error: 'Expected JSON speech text', code: 'invalid_tts_request' }, 400, origin, request); }
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!text) return corsJsonResponse({ error: 'Speech text is required', code: 'empty_tts_text' }, 400, origin, request);
      if (text.length > 2400) return corsJsonResponse({ error: 'Speech text exceeds the 2400-character limit', code: 'text_too_large' }, 413, origin, request);
      try {
        const upstream = await fetch('https://api.elevenlabs.io/v1/text-to-speech/qFJ4KX1Kat5K6ywU2Rnm?output_format=mp3_44100_128', {
          method: 'POST',
          headers: { 'xi-api-key': String(env.HOPE_USAGE_TTS_API_KEY), 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, model_id: 'eleven_flash_v2_5', voice_settings: { stability: 0.5, similarity_boost: 0.8, speed: 1 } }),
        });
        if (!upstream.ok) {
          const detail = await upstream.text().catch(()=> '');
          return corsJsonResponse({ error: 'ElevenLabs speech failed (HTTP ' + upstream.status + ')' + (detail ? ': ' + detail.slice(0, 180) : ''), code: 'tts_failed' }, upstream.status, origin, request);
        }
        const headers = new Headers(corsHeaders(origin, request));
        headers.set('Content-Type', upstream.headers.get('Content-Type') || 'audio/mpeg');
        for (const name of ['character-cost', 'x-character-count', 'request-id', 'xi-request-id']) {
          const value = upstream.headers.get(name);
          if (value) headers.set(name, value);
        }
        return new Response(upstream.body, { status: 200, headers });
      } catch(_){
        return corsJsonResponse({ error: 'Could not reach ElevenLabs speech service', code: 'tts_unavailable' }, 502, origin, request);
      }
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
