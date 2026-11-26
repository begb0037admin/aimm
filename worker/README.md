# AIMM key relay (Cloudflare Worker)

The proxy Worker holds OpenAI and ElevenLabs keys as server-side secrets.
The signed-in AIMM page calls same-origin `/api/hope/*` routes for Hope chat,
speech and small Luna tasks. The AIMM Worker forwards them to this proxy
using the shared `HOPE_INTERNAL_TOKEN` secret. The page needs no saved Hope
token. Direct legacy proxy clients can still authenticate with `HOPE_STT_TOKEN`.

The Settings → Costs ElevenLabs card can read a second account through
`GET /elevenlabs-backup/v1/user/subscription`. Configure the optional Worker
secret `ELEVENLABS_API_KEY_BACKUP` for that account. The route accepts only
that GET path, uses the same allowed origins as the primary relay, and returns
`503` with `code: no_backup_key` until the secret is configured. No backup
account key belongs in the page or localStorage.

Why not just commit the keys to GitHub? The repo is **public**, and GitHub
Pages serves every file in it publicly — anyone who found the URL could drain
the ElevenLabs/OpenAI accounts. Secrets must live server-side; this Worker
is that server. Cloudflare's free tier (100k requests/day) is far more than
AIMM will ever use.

## One-time setup (~5 minutes)

Kev's Cloudflare account already exists (kevinlelitte.workers.dev — hr-kb-ai,
cc-tasks-writer and github-proxy live on it), and `AIMM_PROXY_URL` in
`index.html` is already set to `https://aimm-proxy.kevinlelitte.workers.dev`
— the name this config deploys to. So the only remaining work is deploying
the Worker and storing the required secrets, either route below.

### Route A — Terminal (wrangler)

```bash
cd /Users/admin/github/aimm/worker

# 1. Authenticate (opens a browser window, click Allow)
npx wrangler login

# 2. Deploy — should print https://aimm-proxy.kevinlelitte.workers.dev
npx wrangler deploy

# 3. Store the real keys as Worker secrets (each prompts for the value —
#    paste the key, press Enter; nothing is written to disk or the repo)
npx wrangler secret put ELEVENLABS_API_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put HOPE_INTERNAL_TOKEN
# Optional for legacy direct proxy clients:
npx wrangler secret put HOPE_STT_TOKEN
```

### Route B — Dashboard (no terminal)

1. dash.cloudflare.com → Workers & Pages → **Create application** → Create
   Worker → name it exactly **`aimm-proxy`** → Deploy.
2. Edit code → replace the hello-world with the contents of
   `worker/src/index.js` → Save and deploy.
3. Worker → Settings → Variables and Secrets → add **`OPENAI_API_KEY`**,
   **`ELEVENLABS_API_KEY`**, and **`HOPE_INTERNAL_TOKEN`** as Secrets. Set
   **`HOPE_STT_TOKEN`** if legacy direct proxy clients still use it.

> If the deployed URL ends up different from
> `https://aimm-proxy.kevinlelitte.workers.dev` (e.g. a different worker
> name), update `AIMM_PROXY_URL` in `index.html` to match and push — the URL
> is not a secret.

Configure the same `HOPE_INTERNAL_TOKEN` secret on the Access-protected AIMM
Worker. Hope uses the signed-in session for its same-origin requests.

## Durable captures (KV) — Hope's roadmap inbox, cross-device

The `/captures` endpoint stores the `capture_to_roadmap` inbox in Workers KV
so captures survive browser resets and appear on every device (the app and
DASHBOARD.html sync against it automatically, falling back to per-browser
localStorage when it's unreachable). One-time setup, dashboard route:

1. Cloudflare dashboard → **Storage & Databases → KV** → Create namespace →
   name it `aimm-captures`.
2. **Workers & Pages → aimm-proxy → Settings → Bindings → Add binding** →
   type **KV Namespace** → Variable name exactly **`AIMM_KV`** → select
   `aimm-captures` → Deploy.
3. Re-paste the current `worker/src/index.js` via **Edit code** → Deploy
   (the code must include the `/captures` route).
4. Verify: `/health` now shows `✅ AIMM_KV — bound (captures sync ON)`.

Terminal route instead: `npx wrangler kv namespace create aimm-captures`,
put the printed id into the `kv_namespaces` block in `wrangler.toml`
(template is commented there), then `npx wrangler deploy`.

Until the binding exists, `/captures` answers 501 and everything degrades
gracefully to the old per-browser behaviour.

## Hope usage-test streaming speech (Deepgram Flux + ElevenLabs Flash)

The optional **Usage test** voice mode requests a signed 60-second ticket
through `POST /api/hope/stt/ticket`. The same-origin WebSocket at
`/api/hope/stt/stream` passes microphone audio through the proxy to Deepgram
Flux (`/v2/listen`). Its end-of-turn event sends the transcript to Luna and
the client-side tool loop. `/api/hope/stt/probe` uses the ticket to diagnose
failed WebSocket handshakes. Audio is processed in memory.

Spoken replies use `/api/hope/tts` and typed-chat read-aloud uses
`/api/hope/read-aloud`. Both use Hope's ElevenLabs Flash voice, the
`HOPE_USAGE_TTS_API_KEY` Worker secret and a 2,400-character cap. The proxy's
rate-limit binding groups internal traffic under the `internal` key. The
legacy Whisper WAV endpoint is available at `/hope/stt` on the proxy and
`/api/hope/stt` on the signed-in site.

## Semantic search (Voyage + Vectorize + Cohere)

The semantic YouTube KB routes use Voyage `voyage-context-3` for contextualised
embeddings, Cloudflare Vectorize for storage, and Cohere Rerank 3.5 for the
final ordering. Set the three new Worker secrets from a terminal in this
repository's `worker/` directory:

```bash
npx wrangler secret put VOYAGE_API_KEY
npx wrangler secret put COHERE_API_KEY
npx wrangler secret put AIMM_INGEST_KEY
```

Create the Vectorize index once, then uncomment the `[[vectorize]]` block in
`worker/wrangler.toml` and deploy:

```bash
npx wrangler vectorize create aimm-yt-kb --dimensions=1024 --metric=cosine
```

This is a **one-time manual step Kevin runs himself**. No agentic path exists
for third-party account creation under this project's zero-manual-steps
carve-out. This section exists because there is no MCP connector for Voyage or
Cohere (checked and confirmed); Cloudflare Vectorize needs no new account, only
an authenticated `wrangler` session on the existing Cloudflare account.

**`AIMM_KV` must also be bound** (see "Durable captures" above) — `/kb/upsert`
uses it as the authoritative per-video manifest to find and delete stale
vectors when a video is re-ingested with fewer or renumbered chunks. Without
`AIMM_KV` bound, `/kb/upsert` still upserts the current chunk set correctly,
but silently CANNOT clean up vectors from a shrunk/changed video — those stale
entries stay in the index and can surface in search results indefinitely. If
`AIMM_KV` isn't already bound on this Worker, create and bind it (see the KV
namespace steps above) before running the backfill, not after.

After the Vectorize binding, all three secrets, and `AIMM_KV` all exist, run
the local backfill script described in the repository's ingest documentation.
It sends complete per-video chunk sets to `/kb/upsert`, so refreshed videos
also remove stale vectors — provided `AIMM_KV` is bound as above.

## Insight YouTube link import

Set `APIFY_TOKEN` as a Worker secret before deploying this route. The browser sends only a YouTube URL; the Worker keeps the token server-side, files the transcript in `AIMM_KV`, and embeds its chunks in `VEC_YT_KB`. The existing `AIMM_KV`, `VEC_YT_KB`, and `VOYAGE_API_KEY` bindings are required.

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

## Known bug — `ELEVENLABS_API_KEY` secret is a key *ID*, not a real key

The `ELEVENLABS_API_KEY` secret currently set on `aimm-proxy` is an ElevenLabs
API key **ID**, not a real `sk_…` key ("API key ID used as API key" on any
call). Effect: the in-app cost card, ElevenLabs balance display, and post-call
cost reconcile (`elFetchConversationCost`, `/v1/user/subscription`) are broken,
and `/health` shows ElevenLabs red. **Voice calls still work** — they use the
public agent-id over WebSocket and never touch this key. Fix: rotate the key in
the ElevenLabs dashboard and set the real `sk_…` value —
`npx wrangler secret put ELEVENLABS_API_KEY` (or dashboard → Worker → Settings
→ Variables). Found 2026-08-28 during the Hope voice-provider scoping — see
`docs/VOICE_PROVIDER_DECISION.md`.

## Voice provider — settled, do not migrate for cost

Hope is an **ElevenLabs Conversational AI Agent**, not a swappable TTS
`model_id`; Deepgram Flux TTS is engine-only and can't plug into an EL Agent.
Decision (2026-08-28): **do not migrate to Deepgram for cost** (full runtime
replacement, L/L+ effort, break-even ≈230 conversation-min/month, multi-year
payback). Cut cost instead by **downgrading the ElevenLabs plan** (Agents run on
every tier at the same $0.08/min overage — Creator $22 → Starter $6). Reopen
only on a non-cost trigger. Full record: `docs/VOICE_PROVIDER_DECISION.md`.
