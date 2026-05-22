# ROADMAP.md — AIMM Active

> Active planning doc. Root ROADMAP.md is preserved as historical record.

## Shipped
- Voice stack: ElevenLabs + Hope + Claude Sonnet 4.6
- 30 client tools
- Cross-call memory via STATE.profile
- Project OS doc migration (2026-05-20)
- **YouTube KB wired into Hope's context (2026-05-21)** — `loadYtKb()`, `buildYtKbDigest()`, `read_yt_knowledge` tool (tool 31), RT_INSTRUCTIONS updated. Smoke test passed 2026-05-21.

## In progress
- **Smoke test: YouTube KB** — verify `[YT_KB] loaded` in console, Hope can fetch SEIDS Logic Pro 101 chunks on demand (next in-office session)
- GitHub repo rename: remote SHIPPED 2026-05-21 — local folder + path sweep IN PROGRESS (tomorrow)

## Planned
- **`ingest_yt.py` → auto-update `index.json`** — script currently writes `.md` files but doesn't update the manifest; needs a one-time fix so new ingestions are discoverable automatically
- **Hope KB: channel crawl** — ingest whole @SEIDS_ back catalogue + multi-channel support
- iPad PWA — GitHub Pages hosted voice interface

## Icebox
- Five dormant personas (Matthew, Markey, Katie, Ashley, Lauren) — one-line revival ready
