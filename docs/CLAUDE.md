# CLAUDE.md — AIMM Active Bootstrap

> Source of truth for session startup. Root CLAUDE.md is preserved as historical record.

## Project identity
- Name: AIMM — AI Mix Masters
- Repo: aimm (renamed from trap-master-reference on 2026-05-21)
- Live: https://begb0037admin.github.io/aimm/ (GitHub Pages — migrating to aimixmasters.com)
- Active branch: main

## Bootstrap order (every session)
1. Read docs/CLAUDE.md (this file)
2. Read CONSTITUTION.md
3. Read AGENT_MODEL.md
4. Read docs/STATUS.md
5. Read docs/HANDOVER.md
6. Ask Kev for session goal — begin immediately

## Governance
AIMM is a governed repository. Before any named phase begins:
- Read CONSTITUTION.md (supreme authority)
- Read AGENT_MODEL.md (runtime model)
- Read governance/GOVERNANCE_WORKFLOW_STANDARD.md (6-stage workflow)
- Templates in governance/templates/
- Phase artefacts in governance/evidence/ (executing agent) and docs/project/generated/ (challenger)

## Hard rules
- ElevenLabs SDK pinned at @elevenlabs/client@0.1.7 — never upgrade
- versions/ is gitignored — never touch
- Batch commits end-of-session only (index.html changes)
- Desktop-only layout
- **Bump `AIMM_BUILD`** (const at the top of the main script in index.html, rendered as the bottom-right badge) in EVERY commit that touches index.html. Format `YYYY-MM-DD.N`.
- **Backup before write** for any governed file during a named phase (CONSTITUTION.md Section 4)
- **One change at a time** — verify before the next write

## File architecture (post AIMM_SPLIT_MIGRATE)
After the split phase completes, the app will be:
- `index.html` — shell only (head, layout divs, link/script tags)
- `css/styles.css` — all styles
- `js/app.js` — all JavaScript

Until the split is complete, `index.html` remains the single-file monolith.

## Seat map
- Seat A (Reasoning): Claude Code — plans, designs, routes
- Seat B (Human): Kev — approval authority, browser tasks (Cloudflare, ElevenLabs dashboard)
- Seat C (Execution): Claude Code — GitHub API writes
- Seat D (Verification): Claude Code — confirms live behaviour; Kev is final visual check

## Active workstreams
See docs/STATUS.md for current status of each.
