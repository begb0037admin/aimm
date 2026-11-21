# Handover to Mac mini session - 21 Nov 2026 (evening)

Repo: begb0037admin/aimm. Work is on branch **sidebar-v3** (pushed). `main` is unchanged apart from Jules's design files. Live site is still build 2026-11-20.27 (NOT deployed). Branch build is 2026-11-21.4.

## Start here
`cd ~/github/aimm && git fetch origin && git checkout sidebar-v3 && git pull origin sidebar-v3`. Read docs/CLAUDE.md first (standing rules: zero manual steps for Kevin, short plain replies, preview before live, ask before any deploy; design by Jules, build by Codex through Jacob).
Local preview: `python3 -m http.server 8765 --bind 127.0.0.1 --directory standalone/assets`, open http://127.0.0.1:8765/ in Chrome. The Mini has the real plug-in scan (All plugins 1,145 = 59 + 36 + 141 + 909 + 0), so Kevin sees real numbers there.

## What was done this session (all on sidebar-v3, tests 155/155 pass)
Library tab sidebar redesign, designed by Jules (docs/handover-assets/jules-sidebar-v3/SPEC.md, override.css), built by Codex (brief: docs/handover-assets/briefs/BRIEF-sidebar-v3.md):
- Heading numbers and the word BROWSE removed; subheadings, blue squares and both notes removed ("Counts are products", "AIMM tools run from this browser...").
- Header is only a collapse icon (panel glyph); sticky, stays in view when scrolling, in the full sidebar and the rail. No title word (Kevin decided).
- Section fold icons are plus/minus. Selected-here dot removed (Kevin agreed it confused).
- Selected row paints its own teal background; the JS pill overlay is deleted.
- "Plugin Compatibility" row removed. "Not licensed (UAD)" row removed (UAD licence logic and test-asserted lines kept; Kevin accepted that the "treat as licensed" override is now unreachable from the UI).
- "Stock Plugins (Logic Pro 13)" renamed "Logic Pro stock"; Video chain picks rows have icons.
- Scan folders moved from the sidebar into Settings > Plugin companion card (id invSidebarFolderMeta kept). Add folder / Scan buttons stay on the Plugins tab.
- Bigger and wider (Kevin: "too small, too narrow", expanded and rail): expanded 280px (cap 32vw), icon glyph 24, rows 46, headings 16; rail 80px, glyph 28, tiles 56; rail counts hidden. All scale with the text-size setting.
- hope-tools-manifest.json lost `plugin_compatibility`; DASHBOARD.html and docs/STATUS.md updated.

## Open items, in order (Kevin approves each)
1. Kevin to look at sidebar-v3 on the Mini (real data, larger screen). Check: long labels wrap cleanly at the new 280px width (Jules did NOT re-run the wrap sweep at 280px), Settings > Scan folders line shows correct text when Settings is opened first, sticky header, rail at narrow widths. Fix anything he reports (Jules specs, Codex builds, bump AIMM_BUILD each commit, run all tests).
2. When Kevin approves: merge sidebar-v3 to main, then deploy only after he says so (`cd standalone && npx -y wrangler@4.161.0 deploy`; token from 1Password item "Cloudflare API Token - AIMM Worker deploy" via environment, never pasted; verify `curl "https://aimixmasters.com/?cb=$RANDOM"`). Before deploy, check whether Hope's tool list registered on the ElevenLabs agent needs a refresh because the manifest dropped plugin_compatibility (scripts/hope-tool-sync.mjs, tests/tool-sync.test.mjs; use the ElevenLabs MCP connector, never a pasted key).
3. Continue original open item 1: sweep the REST of the app for boxed counts, tiles and pills that break the no-boxes rule (only the Plugins sidebar is done). Design via Jules, build via Codex, preview first. Kevin's feedback style: he wants a coherent professional look, not patches; it must auto-resize on any machine; he spots wrap/orphan words and unnecessary explanatory text, so Jules should sweep for those proactively.
4. Remaining items from docs/HANDOVER-macbook-2026-11-21.md: voice tests for Kevin; optional merge of duplicate format entries (not approved); verify Shape/Shape Expansion licences; stock lists for Fender Studio Pro 8 / Ableton / Pro Tools deferred; Snapshots pill hover star still gold (ask Kevin).

## Also known
- Jules's earlier optional suggestions not taken: shorten long hover tooltips on Updates / Up to date / Manual check.
- Kevin is dyslexic: short plain replies, one question at a time, never ask him to copy/paste values.
- Jacob does not implement; dispatch Jules (design) and Codex (`codex exec -s workspace-write -m gpt-6-sol -c model_reasoning_effort=medium "Read <brief> and carry it out"`), then verify tests and previews yourself.
