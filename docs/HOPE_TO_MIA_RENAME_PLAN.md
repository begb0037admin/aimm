# AIMM: Hope → Mia Rename — Handoff Plan for Terminal

**Status: scoping only. Nothing in `aimm`'s live app has been changed as a result of this plan. Not to be started until Kevin gives the explicit go-ahead.**

**Date:** 2026-07-24 (updated 2026-08-04)
**Scope:** Rename the AIMM voice persona "Hope" to "Mia," in the `aimm` repo only.

---

## Prerequisite — blocks Phase 0

**Cat must exist before this plan commences.** Cat is Kevin's dedicated agent for general product engineering on `aimm` (and `ai-news-channel`), per `begb0037admin/markey`'s own `AGENT.md`: *"Markey does not own general product engineering on aimm (that's Cat's)."* Most of this plan — `index.html` text/DOM renames, docs, mockups — is general AIMM product work, not voice engineering, so it is Cat's job, not Markey's and not a generic Terminal session improvising scope. Cat has not been built yet as of this update (2026-08-04) — Kevin has this as a separate to-do. **Do not begin Phase 0 until Cat exists and this plan has been reviewed against Cat's own `AGENT.md` scope.**

---

## Confirmed scope

| In scope | Out of scope (do not touch) |
|---|---|
| ~213 "Hope" references in `index.html` (UI copy, greetings, status text, tab labels) | The dormant 5-persona system (Matthew/Markey/Katie/Ashley/Lauren): code, agent IDs, `docs/persona-system-prompt-template.md`. Kevin may revive it later — leave it exactly as-is. Note: "Markey" here is AIMM's old dormant in-app persona name, unrelated to Kevin's real agent `begb0037admin/markey` — don't conflate the two |
| DOM/CSS identifiers: `hopeRail`, `hopeSphereCanvas` | `hope-kb` tag across ~330 ingested YouTube knowledge-base transcript files (`docs/knowledge/*.md`) — an unrelated KB category label from `scripts/ingest_yt.py`, not persona identity |
| localStorage keys: `hopeRoadmapCaptures_v1`, `aimmHopeRail_v1`, `hopeMemBytes`, `hopeMemoryCategories`, `hopeMemAdd`, `hopeMemoryContainer` | The `ai-news-channel` repo's "Hope" — a different, real person (podcast host), different project |
| Reference-tab commentary box: `refHopeBox` / `refHopeText` | Claude/domain-account references |
| `docs/mockups/` (current baseline: `redesign-v5-mixcheck-dashboard.html`, `ozone-redesign-v1.dc.html`, plus prior files) + `index.html.broken-2026-05-08-backup` | |
| ElevenLabs dashboard: system prompt, first message, voice label, agent display name — **separate track, owned by Markey** (his `AGENT.md`: "any engineering change to Hope's voice, chat behaviour, or underlying config... routes through Markey") | |

---

## Sequencing — decided

**Do this after the in-flight Mixio-violet redesign epic settles, not now.**

Reason: `hopeRail` itself shipped as part of that same redesign (2026-06-11), and the redesign is still actively working through stub tabs (Library, Insight, Snapshots, Marketing, Settings) in the same file. As of 2026-08-04 the redesign baseline has moved forward again (`redesign-v5-mixcheck-dashboard.html`, `ozone-redesign-v1.dc.html` added to `docs/mockups/`, committed `65b64bc`) — still in flight, not settled. Renaming mid-flight means editing a moving target twice. Wait for `docs/STATUS.md`'s redesign epic to reach a stable/shipped state, then run this as one clean, isolated pass.

**Trigger to re-open this plan:** when `docs/STATUS.md`'s Mixio-violet redesign epic shows the remaining stub tabs as SHIPPED, not PLANNED, **and** Cat exists.

---

## Open decision — needs Kevin's confirmation before work starts

**localStorage key handling** for existing users' data under `hopeRoadmapCaptures_v1`, `aimmHopeRail_v1`, `hopeMemBytes`, `hopeMemoryCategories`, `hopeMemAdd`, `hopeMemoryContainer`:

- **Default assumption (needs confirming, not yet approved):** new code writes Mia-named keys going forward; still reads the old Hope-named key if the new one is empty, so no existing user's data disappears on next load.
- Alternative: rename outright (existing users lose that specific piece of data on next load — profile memory, dashboard captures, chat-rail state).

Whoever executes this (Cat, once built) should raise this explicitly and get a yes/no before touching any storage code, rather than assuming the default.

---

## Structured plan (trimmed to what actually applies)

### Phase 0 — Freeze and baseline
- Confirm Cat exists and this plan has been checked against Cat's own scope.
- Confirm redesign epic is at a stable stopping point (trigger condition above).
- Record the exact commit/branch being started from.
- Confirm Kevin as approver, Markey as the ElevenLabs-side owner (Phase 5).
- Confirm the localStorage key-handling decision above.

### Phase 1 — Discovery
- Full case-insensitive sweep for `hope` across `index.html`, `docs/mockups/*.html`, `index.html.broken-2026-05-08-backup`, active docs (`README.md`, `CLAUDE.md`, `docs/STATUS.md`, `docs/ROADMAP.md`, `docs/HANDOVER.md`).
- Do **not** run this sweep against `docs/knowledge/` (330 files) — already excluded (`hope-kb` tag).
- Deliverable: line-numbered inventory, scoped to the "in scope" table above only.

### Phase 2 — Classify each hit
Same six categories as the original draft (rename directly / rename with migration / preserve for compatibility / update selectively / leave unchanged / review manually) — **no "remove" category needed**, since the only removal candidate (the 5-persona system) is already fully excluded from this rename, not being decommissioned as part of it.

### Phase 3 — Runtime implementation
- Update approved active references: persona labels, greetings, system/session prompt text (repo-side only — the ElevenLabs dashboard prompt is Phase 5), voice-chat status messages, tab labels, orb/rail visible labels, profile/memory labels, roadmap capture UI.
- Rename `hopeRail` → `miaRail`, `hopeSphereCanvas` → `miaSphereCanvas` (or Kevin's preferred naming) consistently across CSS/HTML/JS.
- Apply the confirmed localStorage key policy from the open decision above.

### Phase 4 — Documentation and mockups
- Update active docs (`README.md`, `CLAUDE.md`, `docs/STATUS.md`, `docs/ROADMAP.md`, current `docs/HANDOVER.md` entry).
- Mockups + backup file: lowest priority, trail behind the live-app rename, no blocking dependency.
- Do not touch: superseded handovers, `docs/knowledge/`, `ai-news-channel`.

### Phase 5 — ElevenLabs dashboard (Markey, separate from this repo)
- Agent display name, system prompt identity block, first message, greeting variations, voice label, published vs. draft state.
- Publish only after repo-side changes are verified working.
- Markey's own non-negotiable applies: show Kevin the exact change before publishing anything that touches Hope's live voice/chat behaviour.

### Phase 6 — Validation
- Re-run the Phase 1 sweep; every remaining hit should classify as intentionally preserved, excluded, or missed rename — nothing ambiguous left over.
- Manual product pass: app load, Conversation tab, call start/end, greeting, mid-call status, profile/memory display, roadmap capture, existing localStorage data (confirm old-user data still loads under the confirmed key policy), fresh-user state.

### Phase 7 — Sign-off
- Repo diff summary, remaining intentional Hope references (if any), ElevenLabs dashboard confirmation from Markey, test results, rollback note (redesign-style tag, matching the existing `pre-v4-redesign` tag convention already used in this repo).
- Kevin signs off before merge/deploy.

---

*No app code has been changed. This document is the handoff artifact, committed to `aimm/docs/` so it is discoverable via GitHub rather than living only in a chat session — consistent with `AGENT_MODEL.md`'s "GitHub is the sole authoritative source of truth" rule. Do not begin Phase 0 until Cat exists, the redesign-epic trigger condition is met, and Kevin gives explicit go-ahead.*
