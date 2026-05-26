> ⚠️ ACTIVE DOCS HAVE MOVED — see docs/CLAUDE.md for current scaffold and session bootstrap instructions.
> This file is preserved as historical record.

# CLAUDE.md — AI Mix Masters

Project context for future Claude (or Cowork) sessions. Read this first when picking the project back up.

> **Naming history:** the project was renamed in May 2026 from *Master Mix Workbench* (and earlier *Trap Master Reference*) to **AI Mix Masters**. The GitHub repo slug was renamed from `trap-master-reference` to `aimm` on 2026-05-21, completing the rename across user-facing and infrastructure layers.

## What this is

**AI Mix Masters** — a single-page, browser-only mixing/mastering assistant for Kevin's iLok + Waves + Native Access + Plugin Alliance library. Genre-aware plugin picks, per-bus chain builder, platform loudness targets, troubleshooter, snapshot journal, and a voice/text co-pilot powered by the OpenAI Realtime API plus (optionally) Claude with web search for niche-knowledge lookups.

> **Voice migration in flight:** the project is being migrated from OpenAI Realtime to ElevenLabs Conversational AI (Claude Sonnet 4.6 brain, Hope voice, Expressive Mode on). Work happens on the `voice-elevenlabs` branch. The OpenAI path on `main` stays as the production fallback until the new path is solid.

## ⚠️ Roadmap + Dashboard maintenance — non-negotiable, read EVERY session

`ROADMAP.md` and `DASHBOARD.html` are paired source-of-truth for this project. They drift constantly without active maintenance, and once stale they lose Kev's trust — at which point he stops using them and the project loses its planning surface. The fix is **continuous reflexive update**, not end-of-session cleanup. **Every Claude session in this project follows this discipline, regardless of seat (Kevin Lead / Hope Builder / Adam Dev / Work Uni / Admin Org).**

### Triggers — fire IMMEDIATELY in the same turn, not later

Any of these = update BOTH files before the conversation moves on:

- **Idea captured** (Kev raises a feature / polish / bug verbally, or `capture_to_roadmap` fires) → log to `ROADMAP.md` in the correct section with the next-free numerical ID + add matching card to `DASHBOARD.html` in numerical order with a `▶ Continue here` button.
- **Something shipped** (work that's actually in the file and verified, even if not yet committed) → move from Now / Backlog / Polish to Recently shipped in BOTH. Bump the dashboard's "Last updated" date in the header.
- **Status change** (Now → in flight, Backlog → Now, anything → Closed / Killed / Won't fix) → reflect in BOTH.
- **Numbering conflict noticed** (duplicate IDs, gaps that look intentional but aren't, items in the wrong section, ordering drift) → fix in BOTH.
- **Card description drifts from current reality** → rewrite in BOTH.

### Session-start self-audit (first action, before any user-facing reply)

1. Read `ROADMAP.md` Status snapshot + Now + most recent Shipped entry.
2. Read `DASHBOARD.html` Now section + most recent ship-group.
3. Cross-check against `CLAUDE.md` HANDOVER POINT — does the dashboard reflect what handover says is the current state? Does Now contain anything that's actually shipped? Are Backlog / Polish IDs in numerical order?
4. If drift is found, fix it in the same turn as your handover summary. Tell Kev what you found and corrected. Don't quietly continue past a stale dashboard.

### Pre-commit drift check (before composing any git commit)

1. Scan `ROADMAP.md` sections for items that should have moved (shipped-but-still-in-Now, captured-but-not-logged, items in the wrong category).
2. Scan `DASHBOARD.html` for cards that contradict `ROADMAP.md` or are out of numerical order.
3. Fix everything before composing the commit. The maintenance edits go in the same commit as the feature work — don't leave them for next session.

### Numerical ordering rule

Backlog and Polish entries appear in **ascending numerical order** in both files. Not insertion order, not effort order, not "pairs-with-#N" order. When adding a new item with the next-free ID, put it at the end of its section. When renumbering for any reason, update both files in the same turn.

### File-of-origin rule

When in doubt about which file to edit first: `ROADMAP.md` is canonical. `DASHBOARD.html` mirrors. But never leave a session with one updated and the other stale — that's the failure mode this protocol exists to prevent.

### Diagnostic question to ask yourself constantly

"If Kev opened `DASHBOARD.html` right now, would what he sees match the actual state of the project?" If no, fix it before the next user turn.

---

## Handover archive — where historical context lives

This file keeps only the **latest two handovers** live in the HANDOVER POINT section below. Older shipped session handovers are preserved verbatim in `docs/HANDOVERS/` (newest-first index in `docs/HANDOVERS/README.md`). The persona system prompt recipe lives at `docs/persona-system-prompt-template.md`.

Don't read the archive on session start — the live HANDOVER POINT + operational sections in this file are sufficient for picking up. Reach into the archive only when investigating a specific past decision, shipped feature, or design rationale.

Current archive index (newest first):

- `docs/HANDOVERS/2026-05-12-ui-stabilisation-and-snapshots.md` — Hope→Adam Backlog #4 spec **(SUPERSEDED)**, KB categorisation on Insight tab, Snapshots tab + tab reorder + drag-to-reorder + browser-tab style (Adam clone on top of Kev's dashboard-intelligence batch).
- `docs/HANDOVERS/2026-05-11-capture-and-dashboard-phase.md` — `capture_to_roadmap` tool (30th client tool) + dashboard inbox + 5 polish entries + Continue-here modal + Phase 2 KILLED kill-record.
- `docs/HANDOVERS/2026-05-08_to_2026-05-10-persona-and-oracle-evolution.md` — KB import upgrade (drag-drop + Haiku auto-extract), NotebookLM workflow + voice consistency, oracle batch shipped (inspect_app + read_doc + project-history digest), Hope-as-oracle queued spec **(SUPERSEDED)**, mid-call tab awareness, cross-call continuity hardening, Hope-only baseline + KB note seed, Markey↔Matthew role swap.
- `docs/HANDOVERS/2026-05-03_to_2026-05-06-foundation-batches.md` — Voice-migration batches 1–5 (OpenAI Realtime → ElevenLabs Conversational AI), persona system + UI overhaul, post-Batch-5 polish (17-item UI re-shape), batch retrospective specs, items 10–15 of the original "What's already done" list (batch implementation retros).

### Known killed / won't-fix decisions

Anti-re-litigation pointers. The full kill-records live in the archive entries linked above; this list is here so future Claude doesn't re-open settled decisions.

- **Phase 2 (auto-stub KB note from `emit_notebooklm_prompt`) — KILLED 2026-05-11.** Made redundant by the KB import upgrade's auto-extract-on-drop. The purple `📋 NotebookLM Prompt` bubble in chat is sufficient as a "research in progress" reminder. Full kill record: `docs/HANDOVERS/2026-05-11-capture-and-dashboard-phase.md`.
- **P9 (profile-aware `claude://` Continue button) — WON'T FIX 2026-05-11.** Protocol handler is registered but produces no visible app-switch on Kev's machine. Modal now confirms clipboard + shows Cmd-V steps + single dismiss; no `claude://` invocation. Full record: `docs/HANDOVERS/2026-05-11-capture-and-dashboard-phase.md`.
- **Batch 3 (AI Chat "Read aloud": OpenAI TTS → ElevenLabs TTS) — DROPPED 2026-05-04.** Read-aloud-as-feature went away in Batch 3b because the AI Chat tab folded into Voice Chat and the merged tab is voice-first (Hope speaks every reply automatically via Conversational AI WebSocket). OpenAI TTS code path stays dormant in `aichatSpeak` for back-pocket revival. Full record: `docs/HANDOVERS/2026-05-03_to_2026-05-06-foundation-batches.md`.

---

## ⚠️ HANDOVER POINT — read this first if you're picking up the voice-elevenlabs branch

**Session of 2026-05-25 (Kevin Lead / Cowork failover — Reference tab shipped + Session 6 design sprint):**

**What shipped tonight (committed 4be7200, live on GitHub Pages):**

- 🎛 **Reference tab full rebuild** — `#eq` panel replaced with WAV drop zone, play/pause/stop/±10s scrub transport, 2×2 meter dashboard (LUFS Int, LUFS Short-term, True Peak, Dynamic Range), canvas spectral analyser (FabFilter-style gradient fill curve, live FFT + idle sine-wave animation), Platform Loudness Comparison table, True Peak Ceilings table. CSS block added before `</style>`; JS IIFE `// ── REFERENCE TAB ENGINE ──` added before `</script>`.

**What was designed (not built — Session 6 targets):**

Five items fully scoped in `docs/ROADMAP.md` (P-A through P-E). Mockups in `docs/mockups/`. See `docs/HANDOVER.md` for the ordered implementation plan.

- **P-A: Mix Check tab** — rename Reference→Mix Check; remove static Reference Guides; add auto-highlighted troubleshooter pills driven by WAV analysis thresholds; add manual input override to each meter card
- **P-B: A/B Ref tab** — new tab in freed Repair slot; two drop zones; overlaid spectral canvas (your mix = gradient, reference = grey); delta meters; Hope commentary
- **P-C: Retire Repair tab** — remove Repair tab HTML/JS; update tool enum and KB catalog
- **P-D: Hope's sphere** — canvas particle orb replaces the floating mic button; idle/listening/speaking/thinking states; amplitude-reactive during Hope's speech; teal/cyan/purple colour palette
- **P-E: Hope tools** — `get_mix_check_state`, `set_meter_value`, `get_ab_ref_state` client tools; extend `toggle_symptom`

**Implementation order for Session 6:** P-A → P-C → P-B → P-D → P-E

**Where to resume:** Start with P-A. Read `docs/ROADMAP.md` P-A spec for exact pill threshold logic before touching `index.html`. Mockup at `docs/mockups/mix-check-pills.html`.

**Docs committed this session:** `docs/STATUS.md`, `docs/HANDOVER.md`, `docs/ROADMAP.md`, `CLAUDE.md`, `docs/mockups/` (three mockup files). Commit command in `docs/HANDOVER.md`.

---

**Session of 2026-05-12 (Adam seat — end-of-session reconciliation pass: status-strip lift + snapshot-icon unification + cross-tab smoke):** No new features, no refactors. Reconciliation only — `ROADMAP.md`, `DASHBOARD.html`, and this handover updated to reflect what's actually live in `index.html` after tonight's polish + verification.

**What shipped tonight (already in working tree, not yet committed):**

- 🧱 **Global `.rt-status-strip` lifted into shared header chrome.** The strip used to live inside the Conversation (`#voice`) panel; it now sits in the shared panel title bar so a single status indicator renders across every tab. Reactive `.is-active` greenify behaviour preserved — `rtSetStatus` adds the class on `live` / `speaking` / `researching`; `setVoiceState` removes on `idle` / `connecting` and adds on `recording` / `responding` / `waiting`. Instructional "Tap the floating mic…" copy preserved.
- 🧼 **Duplicate static "Idle" line removed from panel headers.** `#panelStatusLine`'s static "Idle" stamp gone; the lifted strip is the sole session-state indicator. `updateGlobalStatus()` keeps its `if(!el) return;` guard so existing callers no-op cleanly.
- 🎛 **Snapshot hover-action system refined.** Unified `.rt-pill-act` base (24×24 hit area, 14px icon) with semantic colour modifiers — `.apply` green / `.fav` gold / `.edit` blue / `.copy` purple / `.delete` red (red container at rest). All icons inline SVG inheriting `currentColor`. Existing `onclick` + `event.stopPropagation()` calls preserved verbatim. Legacy `.danger:hover` kept as back-compat alias.

**Cross-tab smoke verification (passed):**

Verified live on `localhost:8000` — UI stable across Conversation, Library, Workbench, Repair, Insight, Snapshots, and Reference. No layout regressions, no header overlap, no stray status duplicates. Snapshot restore behaviour intact end-to-end: pill body click still recalls text into Conversation; hover-revealed Apply still opens `#applyPillModal`, honours the backup-default-on checkbox, restores + persists chain / genre / platform / meters / symptoms.

**Planning surfaces updated this turn:**

- `ROADMAP.md` Status snapshot — `Last shipped` reworded to "Global status strip lifted into header chrome + unified snapshot-pill icons (cross-tab smoke-verified)"; `In flight` notes the uncommitted reconciliation edits.
- `ROADMAP.md` Shipped log — top entry rewritten to match tonight's actual scope (strip-lift framed correctly, smoke-verification bullet added).
- `DASHBOARD.html` — head-right In-flight line, top ship-group bullets, and footer Last-updated line all mirrored to ROADMAP.
- `CLAUDE.md` — this entry.

**Not done tonight (intentional):**

- No commit — Kev controls the end-of-session commit per AIMM convention.
- No `index.html` changes — pure docs/dashboard reconciliation.
- No new ROADMAP entries, no Polish renumbering.

**Where to resume:** Same as the previous handover point below — nothing chunky in flight; next recommended pickup is Backlog #1 (Multiple voice personas) unless Kev wants a smaller polish item first.

---

**Session of 2026-05-12 (Codex + Kev smoke — Backlog #4 Workbench Snapshot Integration shipped + post-smoke polish):** Backlog #4 is no longer queued. `index.html` now captures optional `workbenchSnapshot:{chain, genre, platform, meters, symptoms}` on new `aichatToJournal` entries, renders Apply only on pills that carry the field, opens `#applyPillModal` with default-on backup checkbox, creates `Backup before <title> · YYYY-MM-DD HH:MM` pills when requested, restores chain / genre / platform / meters / symptoms, saves state, and keeps pill-body click as recall-only.

**Kev-led smoke test passed on `localhost:8000`:**

- Created a snapshot from a 5-plugin Drum Bus + Trap / Trap -8 LUFS + harsh-hats symptom + LUFS meter value.
- Cleared Drum Bus, clicked Apply on the new snapshot pill, confirmed the 5 plugins returned.
- Verified default-on backup pill creation, then re-tested with checkbox unticked and confirmed no extra backup pill.
- Hard-refresh confirmed restored Workbench state persisted.
- Confirmed old text-only pill had no Apply icon.
- Confirmed pill body click still recalls text into the Conversation compose box rather than restoring.

**Post-smoke UX polish in this handoff:** Apply changed from the prototype `🎚` glyph to a small green square with white `✓`; Snapshots hover hint now reads `✓ apply · ★ unfavourite · ✏ edit · 📋 copy · × delete`; Conversation composer starts taller and has a horizontal drag handle between transcript and composer. Height persists in `localStorage['trapMasterAiChatComposeHeight_v1']` with min/max bounds.

**Planning surfaces updated:** Backlog #4 moved out of Now / Backlog and into Recently shipped in `ROADMAP.md` + `DASHBOARD.html`. Current state is "nothing chunky in flight"; next recommended pickup is Backlog #1 (Multiple voice personas) unless Kev chooses smaller polish first.

---

## Operational invariants (don't redo this)

Stable facts about the live system. Items 10–15 of the original "What's already done" list (batch-by-batch implementation retros from the May 2026 voice migration) live in `docs/HANDOVERS/2026-05-03_to_2026-05-06-foundation-batches.md` for the audit trail — they no longer need to be in active session context.

1. **Scaffolding in `index.html`** — keys + agent ID UI on the Voice Chat tab, provider toggle (OpenAI / ElevenLabs), `EL` state object parallel to `RT`, `elStart()` / `elEnd()` / `elCleanup()`, transcript hookup. Search for `========== ELEVENLABS` to find the section.

2. **SDK pin: `@elevenlabs/client@0.1.7`** loaded from `https://esm.sh/@elevenlabs/client@0.1.7`. **Do not change this to @latest.** All 0.2.0+ versions pull in livekit-client v2 which expects `/v1/rtc` endpoints, but ElevenLabs' production server is still on LiveKit Server 1.9.0. We hit `NegotiationError: negotiation timed out` for hours before finding this. 0.1.5–0.1.7 use a direct WebSocket transport with zero runtime deps and connect cleanly. When ElevenLabs upgrades their LiveKit server, we can revisit; until then, leave the pin alone.

3. **Prompt override deliberately omitted from `Conversation.startSession()`.** The server rejects `overrides.agent.prompt.prompt` with WebSocket close code 1008 ("Override for field 'prompt' is not allowed by config") **even when** the dashboard's Security → Overrides → System prompt toggle is ON. Likely a field-name / schema mismatch on their side. Workaround: workbench context (RT_INSTRUCTIONS + buildLibraryDigest + buildResearchDigest) is injected via `EL.conversation.sendContextualUpdate(...)` from the `onConnect` callback. See `EL.pendingContext` in elStart for the wiring.

4. **System prompt + first message + Hope voice** are configured directly in the ElevenLabs agent dashboard and Published. The system prompt is the producer-coach version that includes Hope's identity ("Your name is Hope"). If you need to tweak it, edit in the dashboard, then click Publish (top-right of the agent page) — changes don't propagate until published.

5. **Agent config — all personas:**

   | Persona | Role | Agent ID |
   |---|---|---|
   | Hope | Default (Voice Chat + Community) | `agent_2601kqm4g7txfsvv0pkvpe02389p` |
   | Matthew Wheeler | Mix Engineer (Workbench + Repair + Plugin Library) | `agent_4701kqynjkprfn8s3k46561fgws6` |
   | Markey | Producer Coach (Insight + Reference) | `agent_0301kqynm3kmf92s5ptv9s7xvtyw` |
   | Katie | Pop A&R (Marketing) | `agent_8201kqyng5apf319e1fmyvvn5hp2` |
   | Ashley | Vocal Producer (future tab) | `agent_4801kqynnd8gfgas9f131zq701jv` |
   | Lauren | Lo-Fi Curator (future tab) | `agent_0901kqynptmjf73a9w7qda6dx9xz` |

   - Voice: **Hope** (`WAhoMTNdLdMoq1j3wf3I`)
   - LLM: **Claude Sonnet 4.6**
   - TTS model: **eleven_v3_conversational** with Expressive Mode ON
   - Security: Public, no auth, no allowlist (System prompt override toggle is ON but server rejects anyway — see point 3)
   - First message: "Hey Kev, it's Hope. What are we working on?"

   Personas are currently dormant baseline — every tab routes to Hope via `TAB_PERSONA_MAP` all-Hope mapping. Persona infrastructure (system prompts on dashboard, greeting pools in code, colour palette, agent-ID Settings fields) stays in place for one-line revival. Persona system prompt recipe lives at `docs/persona-system-prompt-template.md`.

6. **Client tools wired end-to-end.** `clientTools` field on `Conversation.startSession()` is built programmatically from `TOOL_DEFS` — each tool name maps to an async wrapper that funnels into the same `handleToolCall(name, args)` the OpenAI path uses. Returns are `JSON.stringify`-ed because the SDK expects string/number/void. Every tool call is console-logged as `[EL tool] <name> <args> → <result>` so we can watch them fire. See `elStart` in `index.html` — the `clientTools` block sits just above the `Conversation.startSession({...})` call. Current tool count: 30 (May 2026).

7. **Tool registration script + schema dump.** Two new files at the repo root:
   - `elevenlabs-client-tools.json` — the tool schemas extracted from `TOOL_DEFS` (name + description + parameters JSON Schema for each).
   - `register_elevenlabs_tools.py` — pure-Python (stdlib only, runs on macOS's built-in `python3`) bulk-register script. POSTs each tool to `/v1/convai/tools`, collects IDs, then PATCHes the agent's `prompt.tool_ids` list. Run with `EL_API_KEY=... python3 register_elevenlabs_tools.py`. The agent ID is hardcoded as the production agent. Idempotent in a destructive sense: re-running creates fresh tools and re-attaches them; old workspace tools become orphaned and need manual cleanup from the dashboard's Tools list.

8. **Schema-validation quirk handled in the Python script.** ElevenLabs requires every leaf parameter — string/number/integer/boolean properties AND array `items` schemas — to declare one of: `description`, `dynamic_variable`, `is_system_provided`, or `constant_value`. Our `TOOL_DEFS` omits descriptions on enum-only fields and array-item types because OpenAI doesn't need them. The `ensure_param_descriptions` function in the Python script walks each schema and injects a sensible default description before POSTing. If you ever extend `TOOL_DEFS` and re-run the script, the same normalisation handles your new fields automatically.

9. **Profile system — cross-conversation memory.** `STATE.profile` (string, capped at 2 KB by `PROFILE_MAX_LEN`) is persisted in `trapMasterState_v1`. `buildProfileDigest()` formats it as a system-prompt block; both `rtStart` and `elStart` append it to their session instructions (OpenAI via `session.update`, EL via `sendContextualUpdate` in the pendingContext bundle). `maybeExtractProfile()` runs at end-of-call (hooked from `rtEnd` AND `onDisconnect`, BEFORE cleanup wipes the transcript) — `snapshotTranscript()` reads from `RT.transcriptIndex`, then `extractProfile()` fires a Haiku call (`claude-haiku-4-5-20251001`) with a focused system prompt that captures durable preferences only. UI panel lives on the Insight tab (`Hope's memory` section, post Batch-5 polish move): `#profileText` textarea + Save / Clear / status / byte counter. Spend is rolled into the existing `addSpend('an', cost)` Anthropic bucket.

### Localstorage keys added by the migration

- `aiMixMastersElevenKey_v1` — ElevenLabs API key
- `aiMixMastersElevenAgent_v1` — Agent ID (validated to start with `agent_`)
- `aiMixMastersVoiceProvider_v1` — `'openai'` or `'elevenlabs'` (the dormant dropdown on the Voice Chat tab — Batch 1 hid the UI; key stays for back-pocket use)
- `aiMixMastersSpendEleven_v1` — EL cumulative spend bucket (Batch 2 starts feeding it from Scribe; Batch 4 reads it for the cost panel)

### Files / sections to read before touching the EL code

In `index.html` (line numbers approximate — file is ~9100 lines):

- **`const EL_SDK_URL`** — the SDK pin and the rationale comment. Read the comment before changing.
- **`const EL = {...}`** — the state object. Mirrors `RT` in spirit.
- **`elLoadKey / elSaveKey / elLoadAgentId / elSaveAgentId / loadVoiceProvider`** — persistence helpers. `loadVoiceProvider` becomes vestigial after Batch 1.
- **`async function elStart()`** — the main connect path. Two key blocks: (a) the `clientTools` dict built programmatically from `TOOL_DEFS` just above the `Conversation.startSession({...})` call (each tool becomes an async wrapper around `handleToolCall` that JSON.stringifies its return), and (b) the `EL.pendingContext` flow that injects workbench state via `sendContextualUpdate` from `onConnect`. `pendingContext` already includes `buildLibraryDigest()`, `buildResearchDigest()`, AND `buildProfileDigest()` — append the focus-mode addendum here too if Batch 1 wants to fold the focus-tab system prompts into EL.
- **`async function elEnd() / function elCleanup()`** — disconnect + state reset.
- **`document.getElementById('rtCallBtn').addEventListener('click', ...)`** — the START CALL button. Currently branches by `getVoiceProvider()` and ends-anything-active; after Batch 1, drop the branch and just route to elStart/elEnd.
- **`function micStartFromFloat()`** — the float-mic click entry point. Currently branches by provider; Batch 1 simplifies to EL-only.
- **Spacebar handler `window.addEventListener('keydown', ...)`** — same provider branching, same simplification.
- **`async function maybeExtractProfile()` + `extractProfile()` + `snapshotTranscript()`** — profile extraction pipeline. Hooked from both `rtEnd` AND EL `onDisconnect` BEFORE cleanup wipes `RT.transcriptIndex`. Don't move the hook order or the transcript snapshot returns empty.
- **`function updateCallButtonState()`** (Batch 1) — gates `#rtCallBtn` on EL key + Agent ID. Called from every EL key/agent setter and at init. Early-returns during RT/EL active/connecting so it doesn't stomp `setVoiceState` paint. Search this name to find the function.
- **DICTATION (DICT) module** — search `// DICTATION (DICT)`. Post Batch-2: PTT path hits Scribe v2; the `SCRIBE_KEYTERMS` array near the top of the module is the editable plugin/producer dictionary. Always-on still uses Web Speech. Post Batch-3b: dictation-as-a-feature is dormant — the AI Chat tab is gone, so `activeTabId() === 'aichat'` branches in the float-mic + spacebar handlers never fire.
- **`function addSpend(provider, delta)`** — accepts `'oai'` / `'an' | 'ant'` / `'el'` (Batch 2 added the third bucket). Routes to `SPEND_KEY_OAI` / `SPEND_KEY_ANT` / `SPEND_KEY_EL`. The render functions only know about OAI + ANT until Batch 4.
- **AI Chat TTS** — search `aichatSpeak`. Dormant post Batch-3b: Read-aloud was retired in favour of Hope speaking every voice reply via the EL WebSocket. The TTS state machine + audio element live behind a `data-dormant="aichat-readaloud"` wrapper.
- **Merged Conversation surface** — search `<!-- CONVERSATION` in `index.html`. The single `<div class="aichat-layout">` block in `<div class="panel" id="voice">` holds the toolbar + transcript + compose area + foot row. `#aiChatTranscript` is the only transcript element — voice + typed turns share it.
- **`function snapshotTranscript()`** (Batch 3b) — primary path reads from `AICHAT.history` filtered by `source:'voice'`; rt-transcript DOM walk is the back-pocket fallback. Used by `maybeExtractProfile` for end-of-call profile extraction.
- **EL `onMessage`** — search `onMessage:` inside `elStart`. Post Batch-3b: pushes only to `AICHAT.history`, calls `aichatRender()` + `aichatSave()`. The `rtAppendTurnText` call into `#rtTranscript` was retired.

### Known good user flow

1. `python3 -m http.server 8000` from the repo root → open <http://localhost:8000>.
2. **Settings tab** (rightmost) → ElevenLabs API key + Agent ID saved + Anthropic key saved (loaded from localStorage on subsequent loads).
3. **Voice Chat tab** → click **START CALL** → Hope greets him in her voice with Claude Sonnet 4.6 brain. Live cost chip on the status row ticks `Live · 0:42 · $0.06` once per second during the call.
4. Try voice tool calls: "what's on my master bus?", "add Maag EQ4 to the master", "switch genre to trap" — workbench updates in real time, DevTools console logs `[EL tool] <name> <args> → <result>` for every call.
5. End the call → Haiku extracts profile updates (if Anthropic key saved + transcript >200 chars). The `#profileText` panel updates with new lines. Next call she remembers. Behind the scenes, `elFetchConversationCost` reconciles the live estimate against ElevenLabs' exact minute figure and tops up the spend bucket if needed.

### Open follow-ups

The OpenAI removal is **complete** — all five batches shipped (Batch 1 / 2 on 2026-05-03, Batches 3a / 3b on 2026-05-04, Batch 4 on 2026-05-05, Batch 5 on 2026-05-06). Possible future polish (not committed):

- **B1: floating mic mouse-click scrolls page to bottom (spacebar fine).** Open bug carried from May 2026 sessions. Unrelated to continuity.
- **F0: Hope's voice sounds different in workbench vs ElevenLabs portal preview.** Diagnostic plan: get Stability / Similarity / Style / Speed slider values + TTS model name + Expressive Mode toggle from the agent dashboard, compare to Voices-listing preview defaults. Most likely cause is slider drift; second-most-likely is `RT_INSTRUCTIONS` content shifting how v3 reads Hope's lines.
- **F1: slow / slurry voice from Hope (Kev flagged 2026-05-06).** v3 conversational TTS occasionally sounds dragged-out. Voice settings sliders are not customisable on v3 models — pacing comes from the model's interpretation of the text, the Expressive Mode toggle in the dashboard, and the system-prompt + contextual-update content. Suspected cause: the auto-extracted profile blob contains language that the model reads as a "speak slowly" cue. Kev punted: "We'll come back to it if it persists." Diagnostic path if revisited: clear `STATE.profile`, refresh, test a call. If she perks up → it was the profile content. If still slow → toggle Expressive Mode off in the agent dashboard and Publish.
- **EL TTS character budget.** The `updateElBalance` toast surfaces `character_limit - character_count` from the subscription endpoint as supplementary info. It's not a separately-tracked spend bucket because TTS-per-character spend was retired in Batch 3b. If you ever revive a separate Read-aloud feature, this is where character-spend would re-enter.
- **`/v1/convai/conversations/{id}` field-name verification.** `elFetchConversationCost` tries seven plausible response paths because the exact field name has shifted over ElevenLabs API versions. Worth confirming the canonical path with a real call + simplifying the helper once the schema is locked in.
- **Live history bars tile.** The `historyBars` DOM is null right now (the tile was removed pre-EL-migration). If you ever re-add it, `renderHistoryBars` is already EL-aware — just drop the early-return null check on `wrap`.
- **Voice provider toggle revive.** The dormant-wrapped `#voiceProvider` dropdown is still in the DOM. If ElevenLabs ever has an extended outage and you need to fall back to OpenAI Realtime, drop the `hidden` attr on the dormant wrapper and the dual-provider plumbing comes back to life. Not free — `rtStart` would need a fresh OpenAI key paste — but the bones are there.

### Non-obvious gotchas

- **`.git/index.lock` permission issue** — Kev runs git commands in his real Terminal, not via the agent. Don't try to commit/push from inside Claude — generate the commands and have him paste them.
- **Free tier** — Conversational AI requires Creator plan ($22/mo). Kev is now on Creator. Don't suggest free tier for testing — it'll silently fail.
- **Mic permission** — never call `navigator.mediaDevices.getUserMedia()` before `Conversation.startSession()`. The SDK acquires the mic itself; pre-acquiring it causes the SDK to fail silently and you get a 30s "Successful, 0 messages" timeout pattern in the Conversations log. We learned this the hard way.
- **System prompt override** — toggle in the agent's Security → Overrides is ON, but the server still rejects the override. Don't waste time re-debugging this; we use `sendContextualUpdate` instead.
- **Drafts vs Live** — only manual dashboard edits (typing into System Prompt, Voice settings, First message, etc.) create Drafts that need the **Publish** button (top-right of the agent page) to go live. The `register_elevenlabs_tools.py` script writes via the API and DOESN'T create a Draft — its tool attachments take effect immediately, no Publish needed. Past instruction "click Publish after running the script" was wrong; corrected 2026-05-10. Rule: if YOU didn't touch anything in the dashboard UI yourself, there's no Draft to publish.
- **Tool schema strictness** — ElevenLabs' tool-create endpoint requires every leaf parameter to declare a `description` (or `dynamic_variable` / `is_system_provided` / `constant_value`). This applies to enum-only fields, primitives like `{type:"integer"}`, AND array `items` schemas. Our `TOOL_DEFS` in `index.html` omits descriptions on those because OpenAI doesn't need them, so the Python register script normalises before POSTing — see `ensure_param_descriptions`.
- **Tool registration is per-workspace, not per-agent** — `POST /v1/convai/tools` creates tools in the workspace; the agent then references them by ID via `prompt.tool_ids`. Re-running the register script creates fresh tool entries; old ones become orphans that need manual cleanup from the dashboard's Tools list. Don't run the script casually.
- **Dormant-wrap pattern (Batch 1)** — when a UI section needs to disappear but its JS DOM lookups should keep working without null guards, wrap the block in `<div hidden data-dormant="<reason>">` and add a comment. The `hidden` HTML attribute hides the element CSS-side but leaves it in the DOM. To revive, drop the `hidden` attribute. Used in many places (OpenAI Realtime key/model/voice/provider dropdowns, AI Chat read-aloud TTS + dictation, workbench-snapshot button, big-call-button, rt-pills-flank columns). Subsequent batches should follow this convention.
- **Updating the START CALL button label.** Don't add new ad-hoc `getElementById('rtCallLabel').textContent = '...'` calls outside the existing call-state machine. Idle/disabled paint is owned by `updateCallButtonState()`; mid-call paint is owned by `setVoiceState`/`rtStart`/`elStart`. New gating conditions (e.g. Batch 4 plan-quota warnings) should plug into `updateCallButtonState`.
- **Scribe keyterms surcharge (Batch 2).** Sending `keyterms` to `/v1/speech-to-text` adds +20% to base transcription cost, and crossing 100 keyterms triggers a 20-second minimum-billing rule per request. The `SCRIBE_KEYTERMS` array stays well under 100 (currently ~50). If you grow it past 100, either (a) split by domain and pick a subset per request, or (b) accept the 20s minimum and revise `SCRIBE_RATE_PER_MIN` accordingly. Don't blindly extend.
- **`tag_audio_events` defaults to true.** Without `tag_audio_events=false` Scribe will inject `(laughter)`, `(footsteps)` etc. into the transcript text — those land verbatim in `#aiChatInput` and look ridiculous. Always send `false` for typed-out chat input. (For meeting-style transcription where event tags are useful, leave it on.)
- **Batch 3b dormancy convention.** When Batch 3b retired AI Chat as a tab, the `activeTabId() === 'aichat'` and `tab === 'aichat'` checks in float-mic + spacebar handlers stayed VERBATIM (didn't get wrapped in `if (false &&`). The branches are unreachable because the tab key 'aichat' is no longer in the DOM, so they short-circuit naturally. If you ever need to verify a future change can't accidentally re-fire one of these, search for `activeTabId() === 'aichat'` and confirm the calling site doesn't set the tab.
- **`snapshotTranscript()` source-of-truth.** Post Batch-3b the function reads from `AICHAT.history` (filtered to `source:'voice'`) instead of `#rtTranscript` DOM children. Profile extraction depends on this — if you ever clear `AICHAT.history` aggressively (e.g. add a Clear-chat button that wipes it before `maybeExtractProfile()` runs), the profile dossier won't update from voice calls. Order matters: `maybeExtractProfile()` is hooked from EL `onDisconnect` BEFORE `elCleanup()`. Don't reorder.
- **Merged transcript renders both kinds of turns.** Voice (Hope) turns from EL `onMessage` and typed (Claude) turns from `aichatSend` both land in `AICHAT.history` and render through `aichatRender()` into `#aiChatTranscript`. Voice items are tagged `source:'voice'`; typed items are not. Future styling (a small mic glyph next to voice turns, a different background tint, etc.) can branch on `m.source === 'voice'` in `aichatRender`.
- **RT_INSTRUCTIONS template-literal backticks.** `RT_INSTRUCTIONS = \`...\`` is a template literal in `register_elevenlabs_tools.py`. Don't use backticks for inline emphasis inside that string — they terminate the literal early and crash the script. Use single quotes or ASCII-style emphasis instead. Logged after backtick-in-backtick crashes twice during 2026-05-10's oracle batch.
- **App knowledge digest size.** `buildAppKnowledgeDigest()` is ~25–30K chars and growing with each new tab/feature. ElevenLabs may have an undocumented contextual-update size limit. If Hope stops getting context, watch for `[EL] contextual update SKIPPED:` in console or smaller-than-expected `[EL] sent contextual update, NNN chars`. Mitigation: split into multiple `sendContextualUpdate` calls (one per major section).

- Live: <https://begb0037admin.github.io/aimm/>
- Repo: <https://github.com/begb0037admin/aimm> (branch `main` is what GitHub Pages serves)
- Local source: `~/Documents/Claude/Artifacts/aimm/`

## File layout

```
aimm/
├── index.html                       ← THE app. Single-file: HTML + CSS + vanilla JS, all inline.
├── README.md                        ← User-facing readme (setup, voice chat keys, what's in it).
├── CLAUDE.md                        ← This file.
├── ROADMAP.md                       ← Canonical planning surface (Status / Now / Backlog / Polish / Shipped).
├── DASHBOARD.html                   ← Visual project snapshot (mirrors ROADMAP.md).
├── elevenlabs-client-tools.json     ← (voice-elevenlabs branch) Tool schemas extracted from TOOL_DEFS.
├── register_elevenlabs_tools.py     ← (voice-elevenlabs branch) bulk-register script — POST tools + PATCH agent.
├── docs/
│   ├── HANDOVERS/                   ← Archived session handovers (newest-first; see README inside).
│   └── persona-system-prompt-template.md  ← Persona prompt recipe (dormant baseline, recipe stays current).
├── .gitignore                       ← Ignores macOS junk, editor folders, secrets, versions/, __pycache__.
├── versions/                        ← Cowork's local artifact history. Gitignored — do NOT commit, do NOT touch.
└── .git/                            ← Standard git repo, remote `origin` → GitHub above.
```

**Rule of thumb:** every change is an edit to `index.html`. There is no build step, no bundler, no framework. No CSS or JS files to import.

## How `index.html` is organized

The JS is broken up by `// ========== SECTION ==========` banners. Use them to navigate. Roughly in order:

| Approx. line | Section |
| --- | --- |
| 1–537 | `<head>` + CSS |
| 538–1061 | HTML body (tabs, modals, toolbar) |
| 1062 | PUBLISHERS — alias map for plugin vendor names |
| 1124 | STAGES — signal-chain stage taxonomy |
| 1147 | BUILT-IN PLUGINS — the seed library |
| 1256 | GENRE TOP PICKS — the ⭐ map |
| 1268 | BUSES — master / vocal / 808 / drums / fx |
| 1275 | STATE — the in-memory STATE object |
| 1295 | PERSISTENCE — `saveState`/`loadState` (key: `trapMasterState_v1`) |
| 1400 | CHAIN BUILDER |
| 1448 | PICKER (add-plugin modal) |
| 1471 | LIBRARY RENDER |
| 1602 | GENRE PICKER + per-bus preset picker |
| 1752 | CHAIN PRESETS — 808, vocal, drums, master, FX |
| 2079 | PRESET MODAL |
| 2144 | SESSION JOURNAL |
| 2227 | METER + TROUBLESHOOTER |
| 2293 | TABS |
| 2297 | SNAPSHOT EXPORT |
| 2399 | REALTIME VOICE (OpenAI WebRTC) |
| 2709 | TOOLS exposed to the model — function-calling tools |
| 2812 | KNOWLEDGE BASE |
| 3131 | PLUGIN IMPORT (paste/screenshot → Claude → preview → commit) |
| 3580 | RESEARCH (Claude API + web search) |
| 3661 | AI CHAT (text-only Claude conversation) |
| 4670 | SESSION INSTRUCTIONS (system prompt for the voice model) |
| 4757 | WEBRTC + SESSION wiring |
| 4950 | COST PANEL |
| 4982 | INIT |
| 5002 | TILE PICKERS (genre + platform) |

If you're hunting for a UI element, grep its emoji/label in the HTML body block first, then jump to the matching `render*` / handler in the JS.

## State + localStorage

All user state lives in `localStorage` on the user's machine — nothing is sent to a server we control. Keys:

- `trapMasterState_v1` — chain, genre, target, favorites, custom plugins, journal, knowledge notes, user-saved chain presets, etc. (versioned suffix — bump to `_v2` only with a migration).
- `LIB_PUB_FILTER_KEY` — library publisher multi-select.
- `RT_KEY_STORAGE` — OpenAI API key (voice).
- `RT_ANT_KEY_STORAGE` — Anthropic API key (optional research/chat).
- `RT_PREFS_STORAGE` — voice tab prefs (model, voice, budget cap, etc.).
- `AICHAT_HISTORY_KEY` — text chat history (last 50 messages).
- `trapMaster_eqLayouts_v2` — Mastering Reference card order + custom user-added tiles (see Sortable section below). The `_v1` key, if present, was an earlier GridStack pilot — safe to ignore/clear.
- `trapMaster_troubleLayout_v1` — Troubleshooter (Diagnose tab) symptom pills: order + hidden built-ins + custom user-added symptoms.
- `trapMaster_voiceToolsLayout_v1` — Voice Chat Session tools cards: order + hidden built-ins + custom note tiles.
- `trapMasterAiChatComposeHeight_v1` — Conversation composer textarea drag-handle height.
- `aimmTabOrder_v1` — User's custom tab order (drag-to-reorder; Settings excluded, re-appended last).
- `aimmCollapsedSections_v1` — Collapsed state per Insight-tab KB / Hope's-memory category card.
- `aimmDashboardSectionState_v1` — Collapsed state per DASHBOARD.html section.
- `hopeRoadmapCaptures_v1` — `capture_to_roadmap` tool inbox (most-recent-first, capped at 200 entries).
- Spend-tracker keys for OpenAI / Anthropic / ElevenLabs session + balance.

**Never** introduce server-side persistence without flagging it — the privacy promise in `README.md` is "browser only."

## Local dev

```bash
cd ~/Documents/Claude/Artifacts/aimm
python3 -m http.server 8000
# open http://localhost:8000
```

Voice chat needs a secure context — `file://` will not let Chrome touch the mic. Use `localhost`, the GitHub Pages URL, or open the artifact through the Cowork sidebar.

## Deploy flow

GitHub Pages serves `main` from this repo at the live URL above. To ship a change:

```bash
cd ~/Documents/Claude/Artifacts/aimm
git add index.html               # plus README.md / CLAUDE.md if touched
git commit -m "<short feature-focused title>"
git push origin main
```

GitHub Pages typically updates within ~1 minute. There is no staging environment.

## Commit convention (Kev's preference, set 2026-05-08)

- **Don't prompt for commits mid-session.** Skip the "commit when ready" footers after individual changes — they were creating noise.
- **Batch into one commit at end-of-session.** When Kev signals end of work — `goodnight`, `let's continue tomorrow`, `I'm done for the day`, `that's it for me`, or similar — provide ONE consolidated commit command covering everything since the last `git push`. Single `git add` of all modified files + a multi-line commit message summarising the day's work.
- **Mid-session exceptions.** If Kev explicitly asks for a commit, or you're about to do something risky (large refactor, schema change, anything you'd want to roll back from), then offer a commit at the inflection point. Otherwise default to silence on git commands.
- **Commit message style.** First line: short imperative-ish title that names the user-visible change. Optional parenthetical with the implementation gist. Body: bullet list of distinct changes — same style as the existing commit history. Examples already in the log:
   - `Voice panels breathing room + publisher alias normalisation (alias map, custom-label promotion, one-time migration, sharper Claude prompt)`
   - `AI Chat: 📷 Attach screenshot on compose — drag/drop/paste, vision-aware send, inline transcript display`
   - `Add Tidal -14 LUFS as 6th master target`

Don't generate verbose multi-paragraph bodies unless the change really warrants it.

## Voice tools surface (function-calling)

The Realtime model can read and mutate the workbench through these tools (defined ~line 2709):

`get_context`, `set_genre`, `set_platform`, `add_plugin_to_bus`, `remove_plugin_from_bus`, `move_plugin`, `clear_bus`, `toggle_symptom`, `list_symptoms`, `toggle_favorite`, `record_meter`, `list_plugins`, `get_library`, `clear_plugin_settings`, plus `pin_plugin_settings` / `claude_research` / `inspect_app` / `read_doc` / `switch_tab` / `emit_notebooklm_prompt` / `capture_to_roadmap`. Tool count: 30 (May 2026).

If you add UI state that should be voice-controllable, add a tool here and wire its handler in the WEBRTC + SESSION block.

## Mastering Reference (Sortable pilot — drag-to-reorder + custom tiles)

The cards on the **Mastering Reference** tab (`#eq` panel) can be dragged to reorder, and users can add their own custom tiles per section. Powered by [Sortable.js v1](https://sortablejs.github.io/Sortable/) loaded from jsdelivr — ~30 KB, no deps. This is a *pilot* — no other tabs use it yet. If it earns its keep here, the same pattern extends to other card-heavy sections (e.g. Voice Chat session tools, Plugin Library stage columns).

Deliberately scoped: **no resize, no scroll-inside-tile.** Cards size themselves to their content like normal CSS-grid items. An earlier GridStack-based attempt added resize and scroll-inside-tile and Kev didn't want either — see git history for that branch if you ever need to revisit.

How it's wired:

- Each `<div class="row-grid">` in `#eq` carries a `data-section` attribute (`freqMap`, `loudness`, `truePeak`, `stereoWidth`). One Sortable instance per section.
- The `EQGRID` namespace in the main script handles init, persistence, toggle, custom-tile add/delete, and reset.
- Init is *lazy* — fires on the first click of the Mastering Reference tab.
- Per-card IDs: built-in cards get a slug of their `<h3>` text (`Sub-bass` → `sub-bass`); custom cards get `custom-<random>` and carry a `data-tile-id` attribute.
- The `.eq-toolbar` at the top of `#eq` exposes "Customise layout" (toggles `.editing` class on each section + enables Sortable) and "Reset layouts" (clears `localStorage`, drops custom tiles, restores original order).
- In edit mode each section gains a `.eq-add-tile` placeholder at the end. Clicking it expands an inline title + body form; saving creates a new custom card.

Storage layout (`trapMaster_eqLayouts_v2`):

```json
{
  "freqMap":     {"order": ["sub-bass", "bass-body", "custom-…"], "customs": [{"id": "custom-…", "title": "230 Hz trick", "body": "Kick punch sweet spot"}]},
  "loudness":    {...},
  "truePeak":    {...},
  "stereoWidth": {...}
}
```

Fallbacks:

- If Sortable's CDN fails to load, `eqGridInit()` retries up to 20× at 250ms then logs a warning. The tab still renders — cards just stay static.
- `forceFallback: true` is on in the Sortable options — works more cleanly with the CSS-grid `.row-grid` than HTML5 native drag.

When changing the Mastering Reference HTML:

- New section → add `data-section="<key>"` to the new `.row-grid` and the key to `EQGRID.SECTIONS`.
- Renaming an existing card's `<h3>` → either update the saved order key in `localStorage` or accept that the saved order for that card resets.

## Other customisable tile sections (Troubleshooter + Voice Tools)

After the Mastering Reference pilot proved out, the same drag/hide/add pattern was extended to two more places using a generic `makeTileSection(opts)` helper in the main script. Each section registers itself once and rerenders through a callback the helper invokes.

**Troubleshooter (Diagnose tab, `#symptomGrid`):**

- Pills can be reordered, built-in pills can be hidden, custom pills can be added (label only — no body).
- Custom pill IDs are `custom-<random>` and they participate in `STATE.symptoms` exactly like built-ins (toggle on/off, included in snapshot context for Claude). The Voice AI's `list_symptoms` / `toggle_symptom` tools currently see only built-ins — extending those is a separate task.
- `renderSymptoms` was refactored to honour saved order, hidden built-ins, and custom symptoms via `getDisplaySymptoms()` / `getAllSymptomsList()`.
- Toolbar buttons: `#troubleCustomiseBtn`, `#troubleResetBtn`. Edit hint: `#troubleEditHint`.

**Voice Chat Session tools (`#voice .rt-tools-panel .rt-tools-grid`):**

- Built-in cards (Cost/min, Soft budget cap, Session breakdown, Auto-pause, Usage dashboards, History bars) can be reordered or hidden. Custom title+body note tiles can be added.
- Built-in cards are annotated with `data-tile-id` derived from their `.label` text on first init. The annotation is idempotent.
- Toolbar buttons: `#voiceToolsCustomiseBtn`, `#voiceToolsResetBtn`. Edit hint: `#voiceToolsEditHint`.

Both sections eager-init at page load (right after `renderLibrary`) so saved customs are available before the Snapshot button is clicked. The helper retries with backoff if Sortable hasn't responded yet.

## Conventions / gotchas

- **Single-file rule.** No splitting into separate JS/CSS files unless we're explicitly doing that refactor — it would change the deploy story. (The GridStack CDN is the one external dependency, intentional.)
- **Inline event handlers** (`onclick="..."`) are used heavily. Match the existing style; don't introduce a framework.
- **`escapeHtml` / `escapeJs`** helpers exist (~line 1287). Use them when injecting any string into HTML or `onclick` attributes.
- **`STATE.favorites` is a `Set`** — serialization to `localStorage` converts to/from an array; check `saveState`/`loadState` if you add new state fields.
- **`versions/`** is Cowork's auto-snapshot folder. Gitignored. Ignore for diffs and edits.
- **Storage version (`_v1`).** Adding/removing top-level state fields is fine if defaults are handled in `loadState`. Renaming or restructuring should bump the suffix and write a migration.
- **Mobile** is not a target — the layout assumes a desktop-ish width. Don't sink time into mobile polish unless asked.

## Picking up next session — quick checklist

1. `git status` and `git log --oneline -5` to see where we left off.
2. Skim recent commits for the last user-facing change in flight.
3. Check the Cowork chat transcript / session notes for the open thread.
4. If Kevin describes a UI tweak: grep the visible label in `index.html`, jump to the nearest `// ==========` banner, edit in place.
5. Always test locally with `python3 -m http.server 8000` before pushing — there's no CI.
