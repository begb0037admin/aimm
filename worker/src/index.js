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

    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)){
      return new Response('Forbidden origin', { status: 403 });
    }
    if (request.method === 'OPTIONS'){
      return new Response(null, { status: 204, headers: corsHeaders(origin, request) });
    }

    const url = new URL(request.url);

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
