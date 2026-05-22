# HANDOVER.md — AIMM

## Current handover point
**Date:** 2026-05-21 (evening session)
**Session:** YT KB smoke test passed + doc restructure + partial rename sweep

### What was done this session
- YT KB smoke test: PASSED — `read_yt_knowledge` fires correctly, Hope cites SEIDS Logic Pro 101 by name, no hallucination
- RT_INSTRUCTIONS: YT KB routing tightened — explicit priority rules so Hope calls `read_yt_knowledge` before `research` when a video is named
- `elevenlabs-client-tools.json`: recreated with all 31 tools including `read_yt_knowledge` — registered + published to EL agent
- Doc restructure: `CLAUDE.md` and `ROADMAP.md` merged and promoted from docs/ to root
- Slug sweep: `aimm` slug corrected across live files (index.html, CLAUDE.md, docs/CLAUDE.md)
- Batch committed and pushed to voice-elevenlabs

### What is NOT done yet — first thing tomorrow
**Rename sweep — Phase 1 through 5 (do this first)**

Phase 1 — Fix stale references (Cowork):
- `docs/STATUS.md:10` — rename still says PENDING
- `docs/ROADMAP.md:14` — rename still says PENDING
- `docs/HANDOVER.md:19` — rename still says pending
- `DASHBOARD.html:1568` — GitHub link still points to trap-master-reference
- `DASHBOARD.html:1570` — Live link still points to trap-master-reference
- `README.md:9` — Live demo URL still points to trap-master-reference

Phase 2 — Local folder rename (terminal):
```bash
mv ~/Documents/Claude/Artifacts/trap-master-reference ~/Documents/Claude/Artifacts/aimm
```

Phase 3 — Git remote update (terminal, from new folder):
```bash
cd ~/Documents/Claude/Artifacts/aimm && git remote set-url origin https://github.com/begb0037admin/aimm.git
```

Phase 4 — Path sweep (Cowork — remount at aimm first): Update all `~/Documents/Claude/Artifacts/trap-master-reference` path references to `aimm` across:
- `CLAUDE.md` (lines 238, 243, 325, 337)
- `docs/COLD_START_PROMPT.md` (lines 43, 54, 84)
- `docs/MORNING_CHECKLIST.md` (lines 10, 38)
- `docs/HANDOVER.md` (line 30)
- `DASHBOARD.html` (line 734)

Phase 5 — Batch commit everything.

### After rename is done — second priority
YouTube channel crawl

1. Fix `ingest_yt.py` to auto-update `docs/knowledge/index.json` on each ingestion
2. Begin ingesting SEIDS back catalogue + additional channels (40+ channels planned)
3. Design context window cap for `buildYtKbDigest` before volume gets large

### Tomorrow's bootstrap order
1. Read root `CLAUDE.md`
2. Read root `ROADMAP.md`
3. Read this file (`docs/HANDOVER.md`)
4. Begin Phase 1 of rename sweep immediately — no preamble needed
