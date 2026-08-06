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

## Hope Voice — Brand Brain

Locked via interview 2026-08-06. This is the reference for Markey when doing any dialogue/script work on the voice feature (onboarding, tips, in-app copy, "Meet Hope" video content) — check new copy against it before writing.

**Audience:** A trap/hip-hop producer who already owns real plugins (Waves/Plugin Alliance tier or similar) and knows the vocabulary from tutorials — compressor, ratio, de-esser — but doesn't yet have the ear or experience to connect what they're hearing to what to adjust. They can load a chain but can't diagnose it.

**Transformation:** Before — they load a vocal chain, something sounds off (harsh, muddy, thin), and they're stuck guessing between settings they don't know how to map to what they're hearing, or bouncing back to generic tutorials that don't match their track. After — they describe what they're hearing in plain language and get a specific fix tied to their actual chain. Hope isn't a tool they graduate from — she's a standing second pair of ears, mix after mix, because every mix teaches something new.

**Points of view:**
1. **Diagnosis over presets** — a preset chain is a starting guess, not an answer; the real skill is knowing what to change when it's wrong, and that's what Hope teaches every time.
2. **Built on your real rack, not a hypothetical one** — Hope only ever recommends what's actually in your plugin library; no advice for gear you don't own.
3. **Genre-literal, not genre-flavored** — trap/hip-hop mixes break in specific ways (808 clarity vs. low end, vocals buried under a busy beat); Hope's guidance targets those specific failure points, not general mixing advice with a trap preset slapped on.

## Active workstreams
See docs/STATUS.md for current status of each.
