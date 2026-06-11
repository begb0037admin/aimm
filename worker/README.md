# AIMM key relay (Cloudflare Worker)

Moves the Anthropic + ElevenLabs API keys off the browser and out of the repo.
The Worker holds the real keys as **server-side secrets** and relays the app's
`api.anthropic.com` / `api.elevenlabs.io` calls. Once it's deployed and wired
in, a fresh browser or device runs AIMM with **zero Settings entry** — no keys,
no agent ID.

Why not just commit the keys to GitHub? The repo is **public**, and GitHub
Pages serves every file in it publicly — anyone who found the URL could drain
the ElevenLabs/Anthropic accounts. Secrets must live server-side; this Worker
is that server. Cloudflare's free tier (100k requests/day) is far more than
AIMM will ever use.

## One-time setup (~10 minutes, Kev in Terminal — Seat B)

Prereq: a free Cloudflare account (<https://dash.cloudflare.com/sign-up>) and
Node installed (any recent version — `npx` ships with it).

```bash
cd ~/Documents/Claude/Artifacts/aimm/worker

# 1. Authenticate (opens a browser window, click Allow)
npx wrangler login

# 2. Deploy the Worker — note the URL it prints, e.g.
#    https://aimm-proxy.<your-subdomain>.workers.dev
npx wrangler deploy

# 3. Store the real keys as Worker secrets (each prompts for the value —
#    paste the key, press Enter; nothing is written to disk or the repo)
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put ELEVENLABS_API_KEY
```

## Wire the app to it

1. In `index.html`, find `const AIMM_PROXY_URL = ''` (search `AIMM PROXY`).
2. Paste the Worker URL from step 2: `const AIMM_PROXY_URL = 'https://aimm-proxy.<your-subdomain>.workers.dev';`
3. Commit + push — GitHub Pages picks it up. The URL is not a secret; it's
   fine in the public repo.

That's it. On any browser/device, the app now: routes all Claude and
ElevenLabs REST calls through the Worker (which adds the real keys
server-side), and uses the baked-in agent IDs. The Settings key fields are
auto-filled with an `aimm-proxy-managed` placeholder so the existing
"key saved?" gates pass — they're never sent upstream.

Optional cleanup on browsers that have real keys saved: Settings → Clear on
the Anthropic and ElevenLabs key fields (the placeholder reseeds on reload).

## Updating

- Code change in `worker/src/index.js` → `npx wrangler deploy` again.
- Key rotation → re-run the matching `npx wrangler secret put …`.
- New dev origin (different port, etc.) → add it to `ALLOWED_ORIGINS` in
  `worker/src/index.js` and redeploy.

## Security model (single-user assumptions — revisit before sharing AIMM)

- Real keys exist only in Cloudflare's secret store. Not in the repo, not on
  Pages, not in localStorage.
- The Worker only accepts requests whose `Origin` is the GitHub Pages site or
  localhost. That stops other websites and casual snooping, but Origin can be
  faked outside a browser — so someone who finds the Worker URL *could* use
  it from a script. Before sharing AIMM with anyone else, add a proper auth
  token (or Cloudflare Access) in front of it and rotate both keys.
- The voice call itself (ElevenLabs Conversational AI WebSocket) doesn't go
  through the Worker — it never needed a key, because the agents are public.
