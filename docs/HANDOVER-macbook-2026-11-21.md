# Handover to MacBook terminal session - 21 Nov 2026

Repo: begb0037admin/aimm, branch main (pull first: `git pull origin main`). Live: https://aimixmasters.com, build 2026-11-20.27 (deployed, pushed, verified live). Page Worker "aimm" (deploy: `cd standalone && npx -y wrangler@4.161.0 deploy`; verify `curl "https://aimixmasters.com/?cb=$RANDOM"`), proxy Worker "aimm-proxy".

## What shipped this session (all live)
- Hope coverage tools (snapshots, tags/hidden, reference, saved targets, MixBus load/auto-fill, settings_status credits-only), registered on the ElevenLabs agent (agent_9001m42hnyrwedts40en5a5npapp). Tool drift guard: tests/tool-sync.test.mjs, scripts/hope-tool-sync.mjs, scripts/hope-smoke.mjs.
- Speech false-repeat fix; UAD licence handling (unlicensed UAD hidden from Plugins tab; "Not licensed (UAD)" view, 336 rows).
- Video chain picks (was "Chain favourites"): card grid, four chains (Vocal/Drums/808/Master bus), Owned / Stock Plugins (Logic Pro 13) / Not installed, per-item ticks + "Apply N selected to Favorites", same-maker-first equivalents. Hope's vocal_favorites_read / vocal_favorites_apply take `chain` and `names[]`.
- Starred items: one plain purple glow star everywhere (no teal box).
- Plugins sidebar redesign (Jules Option C): coloured filled section headings, active section glows, teal selected row, one item lit at a time, bigger plain numbers, plain arrows, no boxes.
- KB: Streaky Ozone Maximizer video ingested (739 videos), embeddings upserted.
- New design rule (docs/UI_DESIGN_STANDARD.md, docs/CLAUDE.md): no boxes/tiles/pills behind counts, arrows, icons or markers.

## Open items (pick up in this order, Kevin approves each)
1. Sweep the whole app for boxed counts/tiles/pills that break the new no-boxes rule (only the Plugins sidebar was done). Design via Jules, build via Codex, preview first.
2. Voice tests Kevin should run after hard refresh: "how many plug-ins do I have?", "list my snapshots", "show me my drum favourites", "apply just my 808 favourites" (count aloud, yes, verify), Settings credits, hide/show with confirm.
3. Optional: merge duplicate format entries into one card per product (Valhalla shows "4 plug-ins" for 2 products) - offered, not approved.
4. Verify whether Shape / Shape Expansion (LUNA content, ~8 GB) are licensed; Kevin uninstalls unlicensed UAD himself (list: /Users/admin/aimm-previews/uad-uninstall-list.md on the Mac mini).
5. Fender Studio Pro 8 / Ableton / Pro Tools stock lists deferred. Settings tile rename note. companion-window branch stays unmerged (Kevin likes current companion look; backed up on origin).
6. Pill hover star in Snapshots is still gold (action button, left alone) - ask Kevin if it should be purple.

## Standing rules (read docs/CLAUDE.md fully)
- Zero manual steps for Kevin; never ask for or handle passwords/secrets; use connectors/APIs (ElevenLabs MCP connector for agent/tool work). 1Password CLI can supply keys by piping straight into a command, never printed.
- Confirm before deploys/pushes; UI changes need a preview Kevin sees first; say "deployed" vs "preview"; open screenshots with `open`.
- Design goes to Jules; Codex implements (`codex exec -s workspace-write -m gpt-6-sol -c model_reasoning_effort=medium "Read <brief> and carry it out"` from inside the repo; Codex cannot commit or run servers/screenshots, so the coordinator commits and previews). Bump AIMM_BUILD on every index.html commit (tests assert it: hope-installed-rule, vocal-favs, sidebar-option-c). Keep DASHBOARD.html, STATUS.md in step. Run ALL tests/*.test.mjs before commit.
- Keep replies short and plain (Kevin is dyslexic). No emoji in the UI.
- YouTube KB ingest: `python3 scripts/ingest_yt.py <url> --channel "<name>"` (needs VPN, check public IP first); semantic embeddings via scripts/backfill_kb_embeddings.py with AIMM_PROXY_URL=https://aimm-proxy.kevinlelitte.workers.dev and AIMM_INGEST_KEY piped from 1Password item "AIMM Ingest Key".

## MacBook differences to expect
- The plugin scan, UAD licence map and uninstall lists were made on the Mac mini; the MacBook may have a different plugin set and no companion app. Local preview: `python3 -m http.server 8765 --bind 127.0.0.1 --directory standalone/assets` (companion allows that origin).
- Check `claude`/`codex`/`wrangler`/`op` are installed and signed in before starting; Cloudflare deploy needs the Cloudflare token (1Password item "Cloudflare API Token - AIMM Worker deploy") via the environment, never pasted.
