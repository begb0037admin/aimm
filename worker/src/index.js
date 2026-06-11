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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers':
      request.headers.get('Access-Control-Request-Headers') || 'Content-Type, anthropic-version',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env){
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)){
      return new Response('Forbidden origin', { status: 403 });
    }
    if (request.method === 'OPTIONS'){
      return new Response(null, { status: 204, headers: corsHeaders(origin, request) });
    }

    const url = new URL(request.url);
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
