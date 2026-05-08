# AI Mix Masters — Roadmap

The single source of truth for what's done, what's in flight, what's queued, and what's just an idea.

> **Visual at a glance:** [DASHBOARD.html](./DASHBOARD.html) — open in your browser for a quick read on where the project is.
> **Implementation detail / handover:** [CLAUDE.md](./CLAUDE.md) HANDOVER POINT — full technical state for the next Claude session.

---

## Status snapshot

- **Branch:** `voice-elevenlabs` (not yet merged to `main`)
- **Voice migration:** ✅ complete — all five OpenAI-removal batches shipped
- **Active development:** UI iteration + polish on the EL flow + new feature exploration
- **Open bugs:** 1 (mic-click page-jump)
- **Pending dashboard edits in ElevenLabs:** 3
- **Backlog (big features):** 3 captured
- **Last shipped:** 2026-05-08 — Hope-only baseline locked + Jaycen Joshua KB note imported
- **Active:** none — clean baseline, ready for one-at-a-time persona re-enable when chosen

---

## Now (in progress)

**Hope-only baseline is the active state.** Every tab routes to Hope via `TAB_PERSONA_MAP` (all entries `{persona:null, storage:null}`). Persona infrastructure stays in `index.html` as dormant code — system prompts on dashboard, agent ID fields in Settings, greeting pools, persona colours, role-swap helpers — all preserved. To re-enable a persona, replace its entry with the original mapping (preserved as a comment block right above the active map in `index.html`).

**Recommended re-enable order:**
1. Markey on `chain` only first → verify reads KB note via voice + tools fire
2. Expand to `meter` + `library`
3. Matthew on `knowledge` + `eq`
4. Katie on `marketing`
5. Ashley / Lauren when their tabs exist

**Three known unknowns parked from 2026-05-08 — to test next time Markey is enabled in isolation:**
- ElevenLabs server may treat `sendContextualUpdate` content as background rather than ground truth (fix: split bundle, send research-notes as own focused message)
- Markey's dashboard prompt may need stronger "QUOTE THE NOTE BODY VERBATIM" language (fix: dashboard paste)
- Sonnet-on-EL may parse markdown tables differently from Anthropic-direct (fix: reformat the NLS table as bullets in the note)

---

## Open bugs

### B1. Floating mic click scrolls page to bottom (mouse only)

**Symptom:** Clicking the floating mic with a mouse jumps the page to the bottom every time. Spacebar path is fine.

**Investigation so far:**
- Bug only fires on the mouseup → `micStartFromFloat()` path. Spacebar's `keydown` calls `elStart()` directly without a tab switch.
- `micStartFromFloat()` does an `elStart()` then a manual tab-switch (`.tab.active` and `.panel.active` class toggles). Tab-switching alone shouldn't trigger scroll, but something during this sequence is.
- Suspects: focus moving to the audio element (`#rtAudio`) at the bottom of the panel; default button-focus side-effects despite `e.preventDefault()`; the `.panel.active` style change shifting layout.

**Next step:** open DevTools → Performance → record a mic click; trace which element receives focus or `scrollIntoView`. Or temporarily comment out the manual tab-switch in `micStartFromFloat` and see if the jump goes away.

**Effort:** 30 min – 1 hour to diagnose + fix.

---

## Backlog — big features

### 1. Multiple voice personas (legally clean) ← **next up**

Hope as default, plus producer / mixer / artist archetype voices. NOT impersonations of real public figures.

**Confirmed voices (from Kevin's ElevenLabs "My Voices" — 2026-05-06):**
- *Hope* — default, warm, introductory, general chat (existing agent, already live)
- *Matthew Wheeler* — Mix Engineer (Workbench + Repair + Reference tabs)
- *Katie* — Pop A&R (Marketing tab)
- *Markey* — Producer Coach (Insight tab)
- *Ashley* — Vocal Producer (tab TBD)
- *Lauren* — Lo-Fi Curator (tab TBD)

**Tab-aware auto-switching (key addition from 2026-05-06 discussion):**

The persona doesn't just change via a Settings picker — it switches automatically based on which tab is active. The floating mic and the tab's chat label both update to reflect who you're talking to:

| Tab | Voice | Chat label |
|---|---|---|
| Hope | Hope | *Chat with Hope* |
| Workbench | Matthew Wheeler | *Chat with Matthew* |
| Repair | Matthew Wheeler | *Chat with Matthew* |
| Reference | Matthew Wheeler | *Chat with Matthew* |
| Plugin Library | Matthew Wheeler | *Chat with Matthew* |
| Insight | Markey | *Chat with Markey* |
| Marketing | Katie | *Chat with Katie* |
| Community | TBD | TBD |
| *(future)* | Ashley — Vocal Producer | TBD |
| *(future)* | Lauren — Lo-Fi Curator | TBD |

Personas should have actual names, not just job titles — "Chat with Marcus" feels like a collaborator, "Chat with Mix Engineer" feels like a feature. Naming pass needed once persona set is finalised.

**Marketing tab (new — from 2026-05-06 discussion):**

A new tab powered by the Pop A&R persona. Scope:
- Marketing strategy for AI Mix Masters (AIMixmasters.com)
- Web presence, social, artist positioning
- Release planning and distribution
- Future product/business direction
- Artist development conversations

This expands the product from a pure mixing tool into a full creative business assistant. Add to the tab nav after Reference, before Settings.

**Discussion:**
- ElevenLabs explicitly bans impersonating real public figures without consent. So no Dr. Dre / Beyoncé / Kendrick / Taylor Swift voices — we name personas by archetype, not by artist. Both TOS (account ban risk) and legal (publicity-rights claims have teeth).
- Mechanically: each persona = its own ElevenLabs agent (separate `agentId` + voice + system prompt). Switch `agentId` at `Conversation.startSession()` time based on active tab.
- Settings tab keeps a manual override picker (localStorage key) for when the auto-switch isn't what Kev wants in a given session. Defaults to Hope if no tab-specific persona is mapped.
- Per-persona dashboard work (system prompts, voice selection, first message) is manual in ElevenLabs UI — not scriptable from this file. ~30 min per persona.
- `pendingContext` bundle already handles injecting workbench state — persona switch doesn't change that wiring, just the `agentId`.

**Effort:** ~3 hours code + ~30 min per persona dashboard setup. Marketing tab HTML is an additional ~1 hour.

### 2. Intelligent snapshot auto-suggestions

Hope automatically suggests snapshot pills from conversations instead of Kev clicking `📋 Snapshot → Claude chat` manually.

**How it'd work:**
- Background Haiku pipeline watches `AICHAT.history`.
- Detects "snapshot-worthy" moments (techniques, recipes, durable facts, plugin settings).
- Creates journal entries with a `suggested: true` flag.
- Pills render with amber dashed border (visually distinct from confirmed purple pills).
- Kev approves (✓ promotes to populated / purple), edits (✏ opens existing edit modal), or dismisses (×).
- Trigger: every N messages OR end-of-call (extending `maybeExtractProfile` so we don't pay for an extra Haiku call).

**Bonus:** tab name changes per active voice persona — depends on #1.

**Discussion:**
- Suggested pills should be visually obvious so Kev doesn't think they're already saved.
- Cap on suggestions (e.g. 3 per session) to avoid pill spam.
- Auto-promote vs explicit-approve: explicit-approve keeps Kev in control; auto-promote is friction-free but risks pollution.

**Effort:** ~2 hours after persona system is wired (or standalone if we skip personas first).

### 3. Unified Knowledge Base with `suggested` / `active` states

Replaces the originally-discussed separate "What I've learned" silo. Hope auto-extracts technique/fact learnings from conversations and proposes them as KB notes. The existing KB IS the learning store.

**Architecture:** one Knowledge Base, two states per note — `suggested` and `active`.

- Manually-added notes (existing `kbAdd` flow) default to `active` → injected into prompts, no change from today.
- End-of-call extraction extends `maybeExtractProfile` to return profile + learnings in one Haiku JSON (cheaper than two separate calls). Each learning becomes a KB note with `status:'suggested'`. NOT injected into prompts until approved.
- Suggested notes float to top of KB list, amber dashed border, with ✓ Approve / ✏ Edit / × Dismiss inline buttons.
- Post-call toast: `📚 N new KB notes suggested`.
- Small count badge on Knowledge tab nav button.

**Discussion:**
- Trade-off: combining profile + learnings into one Haiku JSON makes the prompt longer and parsing more complex. If learning extraction returns malformed JSON it could break profile extraction too. Mitigation: try-catch each section independently.
- Auto-extracted vs Hope-mid-call: extraction happens after disconnect (when transcript is finalised), so Hope can't announce "I learned X" verbally before the call ends. The toast handles the surfacing. The PROACTIVE INSIGHTS block in pendingContext (shipped 2026-05-08) covers the mid-call surfacing piece.

**Effort:** ~2 hours.

---

## Polish + smaller ideas

### P1. "From NotebookLM" preset on `kbAdd` form

When pasting from NotebookLM, the source field could pre-fill with `notebooklm` and the title could be inferred from the first heading in the paste. Minor UX polish — the existing manual paste already works for any source. **Effort:** 30 min.

### P2. Custom snapshot / KB note paste-in (no chat round-trip)

Add a "Paste research" affordance that creates a snapshot or KB note directly without going through the chat-summarise flow. The NLS-trick scenario (Kev pastes producer research from elsewhere) currently requires: paste into compose → Send → click `📋 Snapshot → Claude chat`. A paste-direct affordance would skip the round-trip. **Effort:** 1 hour.

### P3. Workbench mini-view tiles (deprioritised in favour of pills)

Earlier proposal: 8 informational tiles flanking the START CALL button showing live workbench state — Genre + Target / Chain density / Active issues / Hope's memory size on the left; Last call / Today's spend / Tools fired this week / Plan headroom on the right. Glanceable status, no clicks. Kev pivoted to favourite snapshot pills instead — keeping captured in case we want to revisit. **Effort:** ~2 hours if revived.

### P5. Community tab — social presence + community hub

Tab is already in the nav as a placeholder (`data-tab="community"`). Full scope to build out:

- **Social monitoring** — reactions, mentions, comments across platforms (YouTube, Instagram, TikTok, X)
- **Community inbox** — centralised place for fan ideas, feedback, and messages; could feed directly into roadmap triage
- **GitHub integration** — link to the AI Mix Masters repo, open issues, community contributions
- **Community pages** — Discord server, Reddit community, YouTube channel hub
- **Post scheduler / content ideas** — light content planning board for social posts (ties into Marketing tab)

Distinct from Marketing (which is strategy + planning) — Community is the live engagement and listening layer. **Effort:** TBD — scope first, then estimate. Start with a static links page and grow from there.

### P4. End-of-call "what we covered" toast

Light-touch end-of-session summary: "We talked about NLS chains, Orion drum bus, kick fundamental — flagged 2 for KB." Already partially covered by #3 (the KB suggested/active model), but could ship sooner as a standalone toast even before the full KB rework lands. **Effort:** 1 hour.

---

## Pending dashboard edits (Kev's TODO)

The SDK side of these is wired; they need a manual edit in the ElevenLabs dashboard to take effect.

### D1. First-message variable for time-aware greetings

**Status:** SDK passes `dynamicVariables: { greeting, time_of_day }` on every `Conversation.startSession()`. Without the dashboard reference, the variables flow through unused and Hope says her static first message every call.

**To do in the dashboard:**
1. Open the agent (https://elevenlabs.io/app/agents/agents/agent_2601kqm4g7txfsvv0pkvpe02389p).
2. Edit **First message** — replace whatever's there with: `Hey Kev. {{greeting}}`. Type the `{{greeting}}` placeholder as literal free text after dismissing the picker with Esc (the picker only shows system variables).
3. Click **Publish** (top-right) — drafts don't propagate until published.
4. Refresh the agent page. The "Variables" panel on the right should auto-populate with `greeting`.

**Plan B if the dashboard refuses literal `{{greeting}}`:** swap to ElevenLabs' built-in `system__time` variable: `Hey Kev. The current time is {{system__time}} — open with a brief, time-appropriate greeting (Good morning / Afternoon / Evening) followed by a producer-style one-liner.` Less variety than our 90-line pool but ships immediately.

### D2. Remove "introduce yourself by name" from system prompt

**Symptom:** Even after the greeting variable is wired, Hope keeps saying "it's Hope" because the dashboard system prompt explicitly tells her to.

**To do in the dashboard:**
1. Same agent as above.
2. Edit **System prompt** — replace the IDENTITY block's "introduce yourself by name" line with: `Your name is Hope. Kev already knows you — don't introduce yourself by name in greetings. If he asks who you are, you're Hope, his AI Mix Masters voice coach.`
3. Click **Publish**.

### D3. Confirm Variables panel populates after publish

Quick sanity check after D1 + D2: the dashboard's "Dynamic variables" panel (right side) should auto-detect `greeting` once the first message references `{{greeting}}` and the agent is published. If the panel stays empty, the placeholder didn't take — try Plan B fallback or paste a screenshot for me to debug.

---

## Open follow-ups (carried from original CLAUDE.md)

These were flagged at the end of the voice migration as low-priority polish. Untouched since.

### F1. Slow / slurry Hope voice

**Symptom (Kev flagged 2026-05-06):** v3 Conversational TTS occasionally sounds dragged-out / slurry.

**Diagnostic path (documented but never run):**
1. Clear `STATE.profile` (Knowledge tab → Hope's memory → Clear button).
2. Refresh the page.
3. Test a call. If she perks up → the auto-extracted profile content was the cue (probably contains language reading as "speak slowly").
4. If still slow → toggle Expressive Mode OFF in the agent dashboard and Publish.

**Notes:** Voice settings sliders aren't customisable on v3 models. Pacing comes from the model's interpretation of the text + Expressive Mode toggle + the system-prompt and contextual-update content. Kev punted: "We'll come back to it if it persists." **Effort:** 15 min if path #1 fixes it; longer if we have to disable Expressive Mode and re-test.

### F2. `/v1/convai/conversations/{id}` field-name simplification

**Symptom:** `elFetchConversationCost(conversationId)` tries seven plausible response paths because the schema has shifted across ElevenLabs API versions:

```
metadata.charging.minutes_used
metadata.charging.duration_minutes
metadata.duration_minutes
charging.minutes_used
minutes_used
duration_seconds / 60
metadata.duration_seconds / 60
```

Worth confirming the canonical path with a real call + collapsing the helper down once the schema is locked in. **Effort:** 30 min.

### F3. Live history bars tile

**Symptom:** The historyBars DOM is null right now (the tile was removed pre-EL-migration). `renderHistoryBars` is already EL-aware — just early-returns on null `wrap`. To revive: add the tile markup back to the Settings → Session safety panel and the existing render code will populate it. **Effort:** 30 min.

---

## Shipped — chronological log

Most recent first. Each entry is a one-line summary; for full implementation detail see [CLAUDE.md](./CLAUDE.md) HANDOVER POINT.

### 2026-05-08 (evening) — Hope-only baseline + KB note import

**Knowledge Base:**
- 📥 Imported "Jaycen Joshua — Drum Bus Architecture & Mixing Philosophy" as first KB note. Synthesis of an uploaded PDF + a secondary study guide Kev provided. ~6KB raw, Active, Inject summary OFF (full NLS table preserved). Verified injecting cleanly via `buildResearchDigest()` — AI Chat (text mode) quotes Row 1 verbatim.

**Persona system parked, Hope-only baseline locked:**
- ↺ `TAB_PERSONA_MAP` flipped — every tab routes to `{persona:null, storage:null}`. Hope answers on every tab (Workbench / Repair / Reference / Plugin Library / Insight / Marketing / Community / Voice Chat). Persona system intact in file as dormant code — system prompts on dashboard, agent ID fields in Settings, greeting pools, persona colours, role-swap helpers all preserved. Single-line uncomment to re-enable any persona.
- 🎯 Recommended re-enable path: Markey on `chain` only first, verify in isolation, expand. Then Matthew on `knowledge`/`eq`. Then Katie on `marketing`.

**Three Markey-can't-quote-body hypotheses parked for future:**
- 🔬 ElevenLabs server may treat `sendContextualUpdate` content as background rather than ground truth (fix: split into multiple sequential sends, research-notes first as its own focused message)
- 🔬 Dashboard system prompt may need stronger "QUOTE THE NOTE BODY VERBATIM, do not paraphrase" language
- 🔬 Sonnet-on-EL may parse markdown tables differently from Anthropic-direct (fix: reformat NLS table as bullets in the KB note)

**Tested + reverted (preserved in `index.html.broken-2026-05-08-backup`):**
- 🧪 Bundle-trim patch — for non-Hope personas, skipped `RT_INSTRUCTIONS` (~2200 tokens) + `PROACTIVE INSIGHTS` blocks; reordered so research notes go first. Dropped Markey's `pendingContext` from 28722 → 18867 chars. Bundle structure was correct, note body verifiably present in the snippet, but Markey still couldn't quote NLS Row 1 — pointing at one of the three hypotheses above.
- 🧪 Routing-aware `updateTabLabels` — only show persona name for tabs whose routing actually goes to that persona. Caused TDZ bug (`TAB_PERSONA_MAP` const accessed before initialisation by page-load IIFE) → broke chain rendering. Reverted via `git restore index.html`.

**Other small wins:**
- 🌅 `MARKEY_GREETING_LINES` swapped to time-of-day-agnostic "Sup" pool (Kev's preference); GREETING TONE block in `elStart` made persona-aware so Markey doesn't get morning/afternoon/evening priming.
- 🔧 Diagnostic `[EL] pendingContext size:` console log added in `elStart` (tested + reverted with the rest).
- 🏷 Stripped non-Hope `data-persona-label` attributes from tab nav. Clicking Workbench / Repair / Reference / Plugin Library / Insight / Marketing no longer flashes "Matthew" / "Markey" / "Katie" cosmetically. Voice Chat + Community keep `data-persona-label="Hope"` because Hope correctly answers there.

**New open follow-up (F0): Hope sounds different in app vs dashboard preview.** Voice + LLM + dashboard prompt all confirmed correct on her agent page. Suspected slider drift (Stability / Similarity / Style / Speed) between agent settings and preview defaults — Kev to capture those values next session. Also possible: `RT_INSTRUCTIONS` in `index.html` shifting v3's tone (working as designed). Tracked in DASHBOARD.html as F0.

### 2026-05-06 — Persona system + UI overhaul (mega session)

**Personas:**
- 🎭 Five new ElevenLabs agents duplicated from Hope: Matthew Wheeler (Mix Engineer), Markey (Producer Coach), Katie (Pop A&R), Ashley (Vocal Producer), Lauren (Lo-Fi Curator)
- 📝 System prompts written for all five — genre-aware (Trap/Hip-hop/R&B/Lo-fi/UK Drill light), screen-aware, terse
- 🗣 Greeting pools added: 30 lines each (10 per time slot), all in character
- ⚙ Tab-aware `agentId` switching — `elStart()` reads active tab, picks right agent via `TAB_PERSONA_MAP`, falls back to Hope
- 🏷 5 new agentId fields in Settings → API Keys, one per persona with persona-coloured labels
- 🔌 `makePersonaAgentHandlers` factory — save/load/clear for all 5, init on page load

**Tab UI overhaul:**
- 🏷 Tab labels swap on click: rest = function name (Workbench), active = persona name (Matthew)
- 🎨 Persona colour system: all tabs neutral at rest; hover = colour hint; active = full persona colour + underline + icon glow
- 🎨 Colours: Hope=#fb7185, Matthew=#38bdf8, Markey=#fb923c, Katie=#facc15, Ashley=#c084fc, Lauren=#4ade80
- 📌 Panel title bar: shows section name in persona colour below tabs, equal spacing above + below
- 📊 Global status line: shows Idle / Connecting / Live·0:42 / Speaking / Ending in Xs — visible on every tab
- 🗂 Renamed tabs: Voice Chat (was Hope), Voice Chat→Hope on active
- ➕ Marketing + Community tabs added (placeholder panels)

**Settings overhaul:**
- 🔄 Section order resequenced via CSS flex `order`: Costs → Safety → Notes → Reset → API Keys → Models
- ⚙ Reset button moved from toolbar into Settings → Reset section
- ⚙ Settings shortcut button in toolbar (purple ring, gear icon, matches Trap/Target button style)
- 🔄 EL cost card tiles reordered: Balance → Total credits → Used → Remaining
- 💳 Credits used / Remaining now pulled from EL subscription API (`character_count`/`character_limit`)
- ⏱ Session time nudge replaces Soft Budget Cap: 10-min default, amber pulse on float mic when crossed
- 📊 Previous session tile: shows last call duration + research cost, persists across reloads
- 🖱 Session Safety tiles drag-to-reorder (Sortable, order saved to localStorage)

**Hope instructions tightened:**
- 1-3 sentence response limit, screen awareness rules, no filler, no reading back what's on screen
- Plugin listing = names only, no settings narrated back

**Other:**
- 🚀 Start Server.command — double-click to start server + open browser in one click
- 🔧 EL rate corrected: $0.088 → $0.08/min; Creator plan = 275 min included/month
- 🏷 `rtTimer` now ticks during EL calls (was broken — checked RT.startedAt not EL.startedAt)

### 2026-05-08 — Roadmap + dashboard + Hope-proactive nudge

- 🆕 `ROADMAP.md` created (single source of truth for ideas, bugs, shipped history)
- 🆕 `DASHBOARD.html` created (visual snapshot, dark theme matching the app)
- ✨ Hope-proactive `PROACTIVE INSIGHTS` block added to `pendingContext` — nudges her to surface durable techniques mid-flow with save-worthy framing (capped 1–2 per session)

### 2026-05-08 — Snapshot UI consolidation + edit modal

- ✏ Edit-pill modal (`#editPillModal`) — title input + recall-content textarea, saves back to `STATE.journal` in place; trims Claude's TL;DR before recall
- 🔄 `📋 Snapshot → Claude chat` button moved out of the conversation toolbar into a dedicated `.snapshot-pills-toolbar` above the pill grid
- 🎯 Four hover-revealed action icons on every populated pill (★ unfavourite, ✏ edit, 📋 copy, × delete)
- 🏷 Tab nav evenly distributed end-to-end (`justify-content:space-between` + `flex:1 1 0`)
- 🏷 Mastering Reference → Reference (one-word rename, all user-facing strings + tool descriptions Hope sees)
- 🎨 Pink 🧠 emoji icons replaced with white-stroke SVGs (book SVG for Knowledge Base, brain SVG for Profile h4) — matches existing aesthetic
- 🏷 Import Plugin label sync (Library + Voice Chat both `✨ Import Plugin`)

### 2026-05-07 — Voice Chat tab redesign + bug fix + polish

- 🔥 Big START CALL button retired (dormant-wrapped) — floating mic is the universal call trigger across every tab
- 🎨 Full-width pill grid `repeat(auto-fit, minmax(220px, 1fr))` replacing the 3-col flank layout
- 🎨 Pills restyled to match Troubleshooter symptoms — purple-when-populated, dashed-neutral when empty, 2-line label clamp
- 🐛 Float-mic drag-to-reposition no longer starts a call (moved `micStartFromFloat` from mousedown → mouseup with `wasDrag` short-circuit)
- 🔄 Voice Chat panel order: status strip → Conversation → Snapshot pills → Session Snapshots → audio
- 📐 Hope's memory textarea enlarged in Knowledge tab (rows 6 → 14, min-height 110px → 280px)
- 🎨 Settings Costs reworked into 4-up metric tile grid per provider (Session / Balance / Spent / Left as self-contained tiles)
- 🐛 Float-mic visibility set emptied (`FLOAT_MIC_HIDE_TABS = new Set()`) — mic now shows on every tab including Voice Chat

### 2026-05-06 — Pill capacity + time-aware greeting + snapshot rename

- 📐 Pill capacity bumped 8 → 24 (12 per side) with new spacing rhythm (gap 24 → 56, `align-items:center` on each column)
- ⏰ Time-aware greeting wired via `dynamicVariables: { greeting, time_of_day }` on `Conversation.startSession` + `GREETING TONE FOR THIS SESSION` block in `pendingContext` (90-line pool: 3 moods × 3 time slots × 10 lines)
- 🏷 `📜 TL;DR → Snapshot` → `📋 Snapshot → Claude chat` (button + class flipped from green to purple)
- 💤 Purple workbench-snapshot button (`#snapshotBtn`) dormant-wrapped — internal label `📋 Snapshot session → Claude` if revived

### 2026-05-06 — Post-Batch-5 UI iteration

- 🔄 Profile editor moved from Voice Chat → Knowledge tab (bottom, under "Hope's memory" section-head)
- 📐 Compose box shrunk (rows 9 → 3, min-height 380 → 96, max-height 640 → 280)
- 💤 Quick Prompts column dormant-wrapped (`data-dormant="aichat-quickprompts"`)
- 📐 Session Snapshots panel grown (min-height 320, max-height 560 with internal scroll)
- ✨ Favourite snapshot pill system — `STATE.journal[].favourite` flag, 8-pill flanking layout, auto-favourite on `aichatToJournal`, FIFO-drop oldest, click-to-recall (mid-call → contextualUpdate / idle → compose draft)
- 🎨 Settings Costs cards full-width, bigger fonts (precursor to the 4-up tile grid that landed 2026-05-07)

### 2026-05-06 — Batch 5: Settings tab split

Final batch of the voice migration. New rightmost `data-tab="settings"` button (line-art gear icon) + new `<div class="panel" id="settings">` panel with five sections: API keys / Models / Costs / Session safety / Notes. Every relocated DOM ID preserved so existing handlers find their targets unchanged. Voice Chat panel stripped to: START CALL + status row + live cost chip + profile editor + Conversation block + Session Snapshots + audio sink.

### 2026-05-05 — Batch 4: Cost panel rewire

OpenAI cost card → ElevenLabs cost card (`#costCardEleven`, indigo accent). New `EL_CONVAI_RATE_PER_MIN` ($0.088/min Creator plan), `elRenderLiveCost` (1Hz live in-call estimate), `elFetchConversationCost` (post-disconnect reconcile against EL's exact billed minutes), `updateElBalance` (subscription-tier headroom). Session breakdown collapsed: 4 OpenAI rows → 2 active rows (`brEl` + `brResearch`).

### 2026-05-04 — Batch 3b: Tab merge

AI Chat tab folded into Voice Chat as the merged Conversation surface. `#aiChatTranscript` becomes the single source of truth for both voice (Hope) and typed (Claude) turns. Read-aloud button retired (Hope speaks every voice reply via the EL WebSocket). `snapshotTranscript()` rewritten to read from `AICHAT.history` filtered by `source:'voice'`.

### 2026-05-04 — Batch 3a: Floating button labelling sweep

Pure labelling cleanup. Float-mic title attribute, `setVoiceState` dynamic titles, `applyFloatMicVisibility` post-session-end hint all reworded for always-on tap-to-toggle ("Tap to start a call with Hope · Spacebar"). Mechanics of tap-to-toggle were already correct from prior session's EL wiring.

### 2026-05-03 — Batches 1 + 2

**Batch 1** — UI sweep on Voice Chat tab. Provider dropdown, OpenAI key field, voice-model + OpenAI-voice dropdowns wrapped in `<div hidden data-dormant="openai-realtime">`. `rtCallBtn` click + `micStartFromFloat` + spacebar `keydown` simplified to EL-only. New `updateCallButtonState` helper.

**Batch 2** — AI Chat dictation migrated from OpenAI Whisper → ElevenLabs Scribe v2. Endpoint `api.elevenlabs.io/v1/speech-to-text`, `model_id=scribe_v2`, vocab biasing via `keyterms` array (replaces Whisper's `prompt`). Web Speech remains the no-key fallback. Cost rolls into a new `addSpend('el', cost)` bucket.

### Pre-migration (Trap Master Reference / Master Mix Workbench era)

The foundational app before the voice migration. Single-file `index.html` mixing/mastering assistant covering:

- 🎚 Chain Builder — per-bus plugin chains (master / vocal / 808 / drums / fx returns), drag-to-reorder, Auto-fill via Haiku
- 📚 Plugin Library — Kev's iLok + Waves + Native Access + Plugin Alliance library, genre-aware ⭐ top picks, Import via Claude (paste / screenshot / image), publisher filters
- 🎯 Mastering Reference (now "Reference") tab — Frequency map / Loudness targets / True peak ceilings / Stereo width by band, drag-to-reorder, custom user tiles
- 🩺 Diagnose tab — Meter Check (numeric pass/warn/fail vs. platform target) + Troubleshooter (symptom pills, recipe cards, Claude diagnosis)
- 🧠 Knowledge Base — paste research from NotebookLM, YouTube transcripts, articles; active notes inject into every Claude/Hope session
- 💬 AI Chat (now folded into Voice Chat) — text-only Claude with full workbench context, web search, screenshot attach, TL;DR → Snapshot
- 🎙 Voice Chat (originally OpenAI Realtime) — live voice session with workbench-aware tools
- 📋 Session Journal — chain + meters + symptoms snapshots, auto-saved on Snapshot → Claude clicks
- 🛠 Workbench-aware tools — 25+ function-calling tools (`get_context`, `set_genre`, `add_plugin_to_bus`, `add_eq_tile`, `claude_research`, etc.)
- 💰 Cost tracking — OpenAI + Anthropic spend buckets, soft budget cap, auto-pause, balance updaters
- 🔍 Plugin import via Claude — paste/screenshot/image → Claude normalises names, guesses publisher/stage, flags duplicates

Pre-migration the project was named *Master Mix Workbench* (and earlier *Trap Master Reference*) — the GitHub slug `trap-master-reference` and live URL stay unchanged, the rename is user-facing only.

---

## Add a new idea

Copy this template into the relevant section (Backlog / Bugs / Polish) and fill in:

```markdown
### N. <Short title>

<One-line description of the idea or bug.>

**Discussion:** (optional — capture gotchas, decisions, alternatives)

**Effort:** <rough estimate — minutes / hours / day>
```
