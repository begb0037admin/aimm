# CLAUDE.md — AIMM Active Bootstrap

> Source of truth for session startup. Root CLAUDE.md is preserved as historical record.

## Project identity
- Name: AIMM — AI Mix Masters
- Repo: aimm (renamed from trap-master-reference on 2026-05-21)
- Live: https://begb0037admin.github.io/aimm/ (GitHub Pages — migrating to aimixmasters.com)
- Active branch: main

## Bootstrap order (every session)
0. **Accountable lead: Cat** (`agent-commons/AGENT_DIRECTORY.md`). Any local session working in this repo should dispatch to Cat immediately rather than operating as a generic session — Cat reads its own `AGENT.md`, `MEMORY.md`, and this file before doing anything, except the embedded voice/chat feature ("Hope"), which is Markey's — Cat is read-only there, for context.
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
- **Kevin performs ZERO manual steps an agent can do itself — no exceptions, no "just this one click."** Fixed 2026-09-06 after a severe incident: getting an ElevenLabs API key from Kevin to run a local registration script turned into a very long, repeated cycle of copy-paste/dashboard-click instructions that caused serious, stated distress (Kevin is dyslexic — multi-step manual/text instructions are actively harmful to him, not merely slow or inconvenient). He was explicit and permanent: this can never happen again, on this project or any other, for any agent.
  - **Before asking Kevin to do anything manually, exhaust every agentic path first.** Check `ToolSearch` for an MCP connector before assuming a task needs a local script + secret. The incident's actual fix was authenticating a direct ElevenLabs MCP connector (`/mcp` → select "claude.ai ElevenLabs", one-time OAuth Kevin clicks through in his browser) and then completing the entire task — reading the agent config, creating the new tool, updating `tool_ids` — via `mcp__claude_ai_ElevenLabs__*` tool calls. Zero copy-paste, no API key ever touched by any agent or session. Use this same connector for all future ElevenLabs agent/tool/knowledge-base work on aimm — never fall back to `register_elevenlabs_tools.py` + a pasted `EL_API_KEY` unless the connector is confirmed unavailable.
  - Never ask Kevin to copy or paste a value between two surfaces (terminal, browser, chat) — if an agent can read or write it directly via a tool/API, do that instead.
  - Never present a numbered list of GUI clicks as a first resort. That's a last resort, reserved only for something no agent can possibly do (e.g. a one-time OAuth "Allow" click only the account owner can make).
  - If a task looks like it will need multiple manual steps, stop and search harder for a tool/API path *before* presenting any steps to Kevin.
  - Never ask him to paste a credential/secret into chat, ever, even if he offers repeatedly — but the correct response when hitting that wall is to go find an OAuth/connector-based path, not to re-ask for the same secret a different way, and not to cycle through many alternative manual workarounds one after another (that cycling is itself what caused the harm in the 2026-09-06 incident, independent of the credential problem).
  - If genuinely stuck with no possible agentic path: say so plainly once, and stop. Don't keep generating new manual approaches.
- ElevenLabs SDK pinned at @elevenlabs/client@0.1.7 — never upgrade
- versions/ is gitignored — never touch
- Batch commits end-of-session only (index.html changes)
- Desktop-only layout
- **No emoji as UI icons, and no emoji embedded in UI copy/text, anywhere in the app.** Fixed 2026-08-17 after a full-app cleanup pass (r3-preview). Applies to every tab (Mix Check, Workbench, Library, Insight, Snapshots, Settings, Conversation/Hope rail, Marketing, Community) — buttons, headers, tooltips, placeholders, toast/status copy, CSS `content` pseudo-icons, everything static. Use a plain text label, or an existing non-emoji dingbat/typographic glyph already established in this app's style (e.g. `×` delete, `✓` apply, `★`/`⭐` favourite/top-pick, `➕`/`＋` add, `↑`/`↓` reorder) — never a colourful pictographic emoji (the Unicode `U+1F300`–`U+1FAFF` block, plus similar). This is a durable convention for every future round, not a one-off cleanup — check new UI additions against it before committing. **Exception:** `RT_INSTRUCTIONS`, the ElevenLabs agent/system prompt, and any other string that is part of Hope's actual spoken/generated conversational output are out of scope — that's voice-functionality territory owned by Markey, not a static-UI concern, and must not be edited under this rule.
- **Mix Check transport waveform (`#mcWave`) is LOCKED** as rendered at build `2026-09-02.1` on branch `r3-mixcheck-fixes` (Kevin, 1 Sep 2026, stated three times + screenshot-confirmed — *"it's the actual effect I've been trying to get for a long time… do not lose this"*): full-width canvas of rendered min/max peak bars from the decoded buffer; blue→purple `--send-blue` (`#2fa1e6→#a557f4`) fill on the played span; dim grey on the unplayed span; a thin light playhead that advances left→right during playback; click/drag seek. **Never revert, restyle, redraw, or replace this rendering.** The deleted `.secs` ruler / `.seg` washes / `.pip` pins / `#mcWaveBars` sine strip / `.played` fill / `#mcWaveCap` stay deleted. Real arrangement/section detection (post-ship fix #5) is a SEPARATE gated feature and must be an **additive overlay** on this canvas — never a redraw of it. Hope's rail waveform (`#hopeWave`) is to be restyled to **match this look** while keeping its speech-tied animation (Markey builds, Jules design-reviews). See `docs/HANDOVER-r3-mixcheck.md` §4.
- **Bump `AIMM_BUILD`** (const at the top of the main script in index.html, rendered as the bottom-right badge) in EVERY commit that touches index.html. Format `YYYY-MM-DD.N`.
- **`DASHBOARD.html` is the canonical roadmap — keep it in sync at all times, no exceptions.** Fixed 2026-09-04 (Kevin, after a drift incident: DASHBOARD.html's Now section carried stale/duplicate P1 cards left over from the May/June session-6 priorities for months, and `docs/STATUS.md` + `docs/HANDOVER.md` still described pre-merge state after a roadmap-mixcheck-queue merge had already landed on `main`). `DASHBOARD.html` is Kevin's actual working source of truth for planning — not a secondary view generated from `docs/ROADMAP.md`. Every time work ships, gets queued, or changes status: `DASHBOARD.html` is updated **in the same commit/session the work lands** (never deferred to a later cleanup pass), and `docs/ROADMAP.md`, `docs/STATUS.md`, `docs/HANDOVER.md` are brought into line with what `DASHBOARD.html` now says, not the other way round. Corrections to stale dashboard content are made in place (status/badge/wording fixed to reflect reality) — never silently deleted. Same tier as the `AIMM_BUILD` bump rule above: a shipped feature or status change that isn't reflected on `DASHBOARD.html` by the end of that session did not happen, for planning purposes.
- **Backup before write** for any governed file during a named phase (CONSTITUTION.md Section 4)
- **One change at a time** — verify before the next write
- **Everything through git — no uncommitted local edits.** All file writes must be committed and pushed. Never leave the working tree dirty between turns. GitHub is the source of truth, not the local clone.

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

## Mockup review process (established 2026-06-29)

All UI redesign work follows this process. No code is committed to the live app until Kevin has approved every tab's mockup.

**The process — one tab at a time:**
1. Claude builds a self-contained mockup HTML file in `docs/mockups/` (e.g. `redesign-v4-mixcheck.html`)
2. Claude explains the design decisions in words before or alongside the mockup
3. Claude pushes the mockup file to `main` (mockups are design artifacts — they do not affect the app)
4. Kevin opens the live GitHub Pages link: `https://begb0037admin.github.io/aimm/docs/mockups/FILENAME.html`
5. Kevin reviews interactively, requests changes or approves
6. Claude updates and pushes again if changes requested — repeat until Kevin approves
7. Only after Kevin explicitly approves does Claude move to the next tab
8. Implementation in the live files (`index.html`, `css/styles.css`, `js/app.js`) begins only after ALL tabs are approved

**Rules:**
- Never assume a mockup is approved — wait for Kevin's explicit word
- Screenshots are not acceptable — Kevin reviews interactively via the GitHub Pages link
- Mockup files on `main` are never the live app — they live in `docs/mockups/` only
- One tab per approval cycle — do not bundle multiple tab designs into one review

**URL pattern:** `https://begb0037admin.github.io/aimm/docs/mockups/FILENAME.html`

## Active workstreams
See docs/STATUS.md for current status of each.
