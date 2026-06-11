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

## One-time setup (~5 minutes)

Kev's Cloudflare account already exists (kevinlelitte.workers.dev — hr-kb-ai,
cc-tasks-writer and github-proxy live on it), and `AIMM_PROXY_URL` in
`index.html` is already set to `https://aimm-proxy.kevinlelitte.workers.dev`
— the name this config deploys to. So the only remaining work is deploying
the Worker and storing the two secrets, either route below.

### Route A — Terminal (wrangler)

```bash
cd ~/Documents/Claude/Artifacts/aimm/worker

# 1. Authenticate (opens a browser window, click Allow)
npx wrangler login

# 2. Deploy — should print https://aimm-proxy.kevinlelitte.workers.dev
npx wrangler deploy

# 3. Store the real keys as Worker secrets (each prompts for the value —
#    paste the key, press Enter; nothing is written to disk or the repo)
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put ELEVENLABS_API_KEY
```

### Route B — Dashboard (no terminal)

1. dash.cloudflare.com → Workers & Pages → **Create application** → Create
   Worker → name it exactly **`aimm-proxy`** → Deploy.
2. Edit code → replace the hello-world with the contents of
   `worker/src/index.js` → Save and deploy.
3. Worker → Settings → Variables and Secrets → add **`ANTHROPIC_API_KEY`**
   and **`ELEVENLABS_API_KEY`**, type **Secret** → paste each key → Deploy.

> If the deployed URL ends up different from
> `https://aimm-proxy.kevinlelitte.workers.dev` (e.g. a different worker
> name), update `AIMM_PROXY_URL` in `index.html` to match and push — the URL
> is not a secret.

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
