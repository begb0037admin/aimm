# 2026-05-12 — UI stabilisation and Snapshots tab

Archived from CLAUDE.md HANDOVER POINT. Covers three earlier 2026-05-12 sessions that pre-date the two latest handovers (reconciliation pass + Codex+Kev Backlog #4 ship), which remain live in `CLAUDE.md`.

Sessions included, newest first:

1. Hope → Adam handoff — Backlog #4 spec (**SUPERSEDED** by the Backlog #4 shipped entry in CLAUDE.md)
2. KB categorisation on the Insight tab
3. Snapshots tab + tab reorder + drag-to-reorder + browser-tab style (Adam clone on top of Kev's dashboard-intelligence batch)

---

## Session of 2026-05-12 (Hope → Adam handoff — Backlog #4 Snapshot-pill workbench restore queued for Dev seat) — **SUPERSEDED**

> **STATUS: SUPERSEDED.** This was a queued spec for the Dev seat. The work shipped — see the Codex + Kev smoke entry in CLAUDE.md ("Backlog #4 Workbench Snapshot Integration shipped + post-smoke polish"). Preserved here for the design-decision audit trail.

Hope-seat wrapped its session with dashboard polish + maintenance protocol shipped (see ROADMAP.md Shipped log for the bullet list) and Kev's KB-categorisation commit still pending paste. Adam (Dev seat) picks up Backlog #4 — Snapshot pill → restore workbench state. Kev hand-waved "make it so" rather than answer the two open design questions, so Hope locked them on his behalf. **Adam: briefly confirm the locked design with Kev at session start before coding — if he pushes back on either, re-open the question.**

**Locked design (subject to Kev's session-start confirm):**

1. **Click model — split-click.** Pill body click = existing recall behaviour (compose draft when idle, `sendContextualUpdate` mid-call), unchanged. New hover-revealed icon next to the existing ★ ✏ 📋 × row triggers Apply-to-workbench. Reuses existing pill markup + hover affordance. Rationale: preserves muscle memory, opt-in for the destructive action, no modal interruption for the common case.

2. **Backup current before apply — default-on checkbox.** Confirm modal includes a checkbox "Save current Workbench as a backup pill first" defaulted ON. Kev can untick. Backup pill auto-titled `Backup before <originalPillTitle> · YYYY-MM-DD HH:MM`. Rationale: protects against accidental overwrite without forcing an extra step, gives Kev visible undo via the new backup pill.

**Spec lives in ROADMAP.md Backlog #4.** Read that section fully before coding.

**Implementation order (Adam's job):**

1. **Schema extension.** Add `workbenchSnapshot: {chain, genre, platform, meters, symptoms}` optional field to `STATE.journal[]` entries. Existing entries lack the field → text-recall-only (Apply button hidden on those). New snapshots get both fields. No `localStorage` version bump — field is back-compat optional.

2. **Capture path.** `aichatToJournal` (search this name in `index.html`) clones current state into `workbenchSnapshot` at creation time. Use `JSON.parse(JSON.stringify(state))` round-trip — `STATE.chain` is nested, so don't share references. Workbench state is all plain JSON so round-trip is fine.

3. **Apply UI on pill markup.** In `renderFavouritePills` / `pillHtml`, extend the hover-revealed action row with a new Apply icon (suggested glyph: a small chain-icon SVG matching the project's line-art style; or 🎚 if Kev prefers an emoji during prototyping). Only render the icon when `entry.workbenchSnapshot` exists. `event.stopPropagation()` on click so it doesn't bubble to the pill's `onclick="recallFavourite(...)"`.

4. **Confirm modal.** New `#applyPillModal` matching the `.modal-backdrop` / `.modal-form` pattern from the existing edit-pill modal (`#editPillModal` — copy-paste the markup + handlers, rename the IDs). Modal contents: title "Restore workbench from snapshot?", body shows the pill title + a short summary of what will change (e.g. "5 plugins on master, 3 on vocal, 2 on drums; genre: trap; target: -14 LUFS"), checkbox "Save current Workbench as a backup pill first" defaulted ON, [Cancel] + [Apply] buttons. Esc / backdrop click dismisses.

5. **Restore path.** On Apply confirm: if backup checkbox ticked, fire `aichatToJournal` first with a backup title (`Backup before <originalTitle> · YYYY-MM-DD HH:MM`); then clone the snapshot's state into `STATE` (chain / genre / platform / meters / symptoms), call `saveState()`, re-render chain (`renderChain()`), genre picker, platform picker, symptom pills. Toast "Workbench restored from '<pillTitle>'" (optional: include "Backup saved as '<backupTitle>'" if backup was taken).

**Verification before commit:**

- `node --check` on extracted inline JS (the project's standard pre-commit gate — there's no other CI).
- Real-browser: create a snapshot, modify the chain, click Apply on the snapshot pill, confirm chain restores to the snapshot state.
- Reload-persistence: applied state should survive a hard-reload (since `saveState()` persists).
- Backup checkbox: confirm a backup pill is created when ticked, NOT created when unticked.
- Apply icon visibility: confirm it shows on new snapshots (which carry `workbenchSnapshot`), does NOT show on old text-only pills.
- Existing recall path (pill body click) still works unchanged — both idle (compose draft) and mid-call (`sendContextualUpdate`) paths.

**Maintenance protocol applies.** Per the section at the top of this CLAUDE.md, when you ship Backlog #4, move it from Backlog to Recently shipped in BOTH `ROADMAP.md` and `DASHBOARD.html` in the same turn. Bump status snapshot. Bump dashboard "Last updated" line. Update the Now section (`▶ Now` will need to revert to "Nothing chunky in flight" or whatever Kev picks up next).

**Commit convention.** Single end-of-session commit per AIMM convention. Same lockfile-cleanup pattern as the KB categorisation commit Kev still has pending paste from earlier today.

**Open questions Kev may want to weigh in on at session start:**

- Icon glyph for the Apply button (suggested: small chain-icon SVG matching the line-art family).
- Modal title + body wording (suggestions above — tune to Kev's voice).
- Toast wording on success.
- Whether to deep-clone or `JSON.parse(JSON.stringify(...))` the snapshot state. Round-trip is the safe default. Workbench state is plain JSON so this is fine.

**Hope-seat context for Adam if useful:** Hope just shipped (in working tree, awaiting Kev's commit-paste) the maintenance protocol at top of this file + clickable dashboard tiles + capture-aware bug count + numerical Polish ordering + P14 (Community tab) rename + F0 promoted to proper roadmap entry + Backlog #5 logged (the future "generate dashboard cards from ROADMAP" architectural fix). None of that work touches `index.html` — it's all dashboard/roadmap/CLAUDE.md/clients-README cleanup. Adam's `index.html` baseline is the same one Kevin shipped KB-categorisation against; no merge conflicts expected.

---

## Session of 2026-05-12 (KB categorisation on Insight tab — Kevin session, on top of the Snapshots-tab + dashboard-intelligence batch)

Brought the Knowledge Base on the Insight tab up to the same UX standard Hope's Memory just got. Same categorised-collapsible-card pattern, drag-to-reorder, Expand-all / Collapse-all toolbar buttons, bytes meter. All existing per-card actions preserved.

**What shipped this session:**

1. **`KB_CATEGORIES` + `KB_CAT_PATTERNS` constants** (right before `knowledgeRender` in index.html, ~line 7031). Eight hardcoded categories: Mixing techniques / Producer interviews + chains / Plugin recipes + settings / Reference tracks / Mastering / Vocal techniques / Workflow / Misc. Categories confirmed with Kev before any coding. Regex map ORDERED producers → mastering → vocals → plugins → refs → workflow → mixing — producer names are the most specific signal (a Jaycen Joshua note about vocal chains belongs in producers, not vocals), so they win first. Fall-through is misc. 12/12 smoke-test cases pass against representative note titles.

2. **`knowledgeMigrateCategories()` — idempotent heuristic migration.** Runs at the top of every `knowledgeRender()` call. For any note missing a valid `.category`, inspects title + tags + summary + first 800 chars of raw and assigns via the regex map. Saves + logs only when something actually changed. Notes with valid categories no-op so subsequent renders are free. No localStorage version bump — `.category` is a back-compat optional field. Legacy notes get auto-bucketed on first load after the update.

3. **Rewrote `knowledgeRender()` — categorised + collapsible.** Empty state (zero notes total) keeps the original onboarding panel. Once at least one note exists, notes group by category and emit one `.fact-cat-card.collapsible` per category (reuses Hope's-Memory's class for free collapse system + chevron CSS). Each category's note container is `.kb-cat-list[data-cat="..."]` with header showing `(N)` count. Empty categories show a small dashed "drag one in" hint so Sortable still has a drop target. `kbRenderCard` unchanged except for a new `<span class="kb-grip">⋮⋮</span>` at the start of `.kb-row1` as the Sortable handle.

4. **`wireKbCardsDragdrop()` — Sortable across all category lists.** `group:'kbNotes'` + `handle:'.kb-grip'` (button clicks inside cards don't start a drag). `animation:180`, ghost + drag classes match Hope's-Memory style. `onEnd` walks each `.kb-cat-list` in `KB_CATEGORIES` order, rewrites every dropped card's `note.category` to the destination cat, rebuilds the flat `STATE.knowledge` array preserving visible order, defensive-appends any notes whose DOM nodes went missing, saves + re-renders. Drag-between-categories persists across reload via `saveState()`.

5. **`kbActiveBytes()` + bytes meter.** Sum of active-note text length (summary or raw per `useSummary`). Mirrors Hope's-Memory style: amber ≥ 6000, red ≥ 8000, soft 8000-byte budget. Pure UX signal — `buildResearchDigest()` doesn't actually truncate. The kb-toolbar gains `#kbBytes` span between the spacer and `#kbStats`, plus Expand all / Collapse all `.btn ghost sm` buttons scoped to `#kbList` (so they don't accidentally collapse Hope's-Memory which lives in the same `#knowledge` panel under a separate `#hopeMemoryContainer`).

6. **CSS** (lines ~604-620). New rules: `.kb-cat-list` (padding + flex column gap 8px + min-height 44px so empty lists have a drop target), `.kb-cat-list-empty` (dashed hint when category has no notes), `.fact-cat-card.collapsed > .kb-cat-list { display:none }` (extends the shared collapse system), `.kb-bytes-meter` + `.amber` / `.red` variants matching `.hope-bytes-meter`, `.kb-grip` (cursor:grab in idle, grabbing on active, purple on hover), `.kb-card.sortable-ghost` + `.sortable-drag` (drag affordance during Sortable operation).

**Verification done in-session:**
- `node --check` on extracted inline JS — passes (608005 chars, no syntax errors).
- 12/12 regex smoke-test cases against realistic note titles (Jaycen Joshua NLS → producers, Wheezy 808 → producers, FabFilter Pro-Q → plugins, Mastering for Spotify → mastering, Reference track A-Bing → refs, Vocal tuning workflow → vocals, Session template + aux send → workflow, Sidechain compression on master bus → mastering, Mixing kick + 808 → mixing, random note → misc, Soundtoys Decapitator → plugins).
- Grep confirms all markers present: `KB_CATEGORIES`, `KB_CAT_PATTERNS`, `knowledgeMigrateCategories`, `kbCategorize`, `kbActiveBytes`, `wireKbCardsDragdrop`, `.kb-grip`, `.kb-bytes-meter`, `.kb-cat-list`, `group: 'kbNotes'`.

**Live-browser smoke tests Kev should run before commit:**
- Open Insight tab → KB notes should appear in their correct categories (heuristic migration runs on first render). Misses can be drag-fixed.
- Grab a note's ⋮⋮ grip → drag to another category → drop → category swap should persist across page reload.
- Click any category header → that card collapses / expands. Chevron rotates. State persists per category via the shared `aimmCollapsedSections_v1` localStorage key.
- Expand all / Collapse all in the toolbar toggles every KB category card without touching Hope's-Memory below.
- Edit / Delete / Active toggle / Inject summary / Re-summarise / View body — all still work inside each card.
- Watch the bytes meter — flips amber at 6000 bytes of active-note content, red at 8000.
- `buildResearchDigest()` still returns the same content shape (categories are display-only; the digest doesn't group by category, just lists active notes).

**Apply drill:** No registration script re-run, no Publish click. Pure index.html / DASHBOARD.html / ROADMAP.md changes. Hard-refresh `localhost:8000`.

**Commit message Kev can paste at end-of-session** (clears any stale .git/HEAD.lock from the sandbox, then commits + pushes — single batch):

```
cd ~/Documents/Claude/Artifacts/trap-master-reference && rm -f .git/HEAD.lock .git/index.lock && git add index.html DASHBOARD.html ROADMAP.md CLAUDE.md && git commit -m "Insight tab: categorise Knowledge Base notes into 8 collapsible buckets

- KB_CATEGORIES + KB_CAT_PATTERNS (regex heuristic, ordered producers-first)
- knowledgeMigrateCategories() — idempotent, runs on every render
- knowledgeRender() rewritten to group by category, reuses .fact-cat-card
- Sortable group:'kbNotes' with .kb-grip handle, drag-between-categories
- Toolbar: Expand all / Collapse all + bytes meter (8000-byte soft budget)
- All existing per-card actions preserved (active/summary/edit/delete/etc.)
- No localStorage migration — .category is back-compat optional

Mirrors the Hope's-Memory pattern shipped earlier today. 12/12 regex
smoke-test cases pass; node --check passes." && git push origin voice-elevenlabs
```

**Possible follow-ups for next session (not yet logged in ROADMAP.md):**
- "Filter by category" search bar above the cards if Kev finds himself opening one category at a time.
- Per-category bytes breakdown in the meter tooltip (e.g. `producers: 2400 · mastering: 1100 · ...`).
- Haiku-side category hint when `kbExtractMetadata` runs — return a `category` field too so import-on-drop lands in the right bucket without waiting for the heuristic.

---

## Session of 2026-05-12 (Snapshots tab + tab reorder + drag-to-reorder + browser-tab style — Adam clone shipped on top of Kev's dashboard-intelligence batch)

Two productive sessions in one day. Kev shipped dashboard intelligence + dedup tooling first commit (`6d8d7d4`); Adam (Work2 failover) picked up the Snapshots-tab clone task per the queued spec and shipped it on top in a second commit. Both summarised here in order.

**ADAM'S SESSION — Snapshots tab batch (this entry, post-clone wrap-up):**

1. **New Snapshots tab.** Bookmark glyph (`<path d="M6 3h12v18l-6-4-6 4z"/>`) ribbon-style line-art SVG matching the existing tab icon family. New `<button class="tab" data-tab="snapshots" data-label="Snapshots" data-persona-label="Hope">` in the tab nav strip + new `<div class="panel" id="snapshots">` below #voice. Panel houses the relocated Snapshot pills section (section-head with bookmark icon + new blurb, `.snapshot-pills-toolbar` now hover-hint-only since the creator moved, `.rt-pills-grid#rtPillsGrid`, dormant `rt-pills-flank` wrappers) AND the full Session Snapshots panel (section-head + Export/Clear toolbar + `#journalList`). IDs are unchanged so every existing handler (rtRenderPills / aichatRender / journalExport / journalClear / editPill modal) keeps working without code touches beyond the panel wrap.

2. **#aiChatToJournal stays on Conversation.** Moved the creator button back into the `.aichat-bar` (replacing the old "relocated to the Snapshot pills toolbar below" comment) so creation is in-context with the chat. Tooltip updated to mention "auto-favourites the new entry as a pill on the Snapshots tab". The pills toolbar on the new tab is now hover-hint-only.

3. **Tab nav reorder + default-active swap.** New visible order: Conversation → Library → Workbench → Repair → Insight → Snapshots → Reference → Marketing → Community. Settings stays last and hidden. Workbench's `active active-section` classes stripped (active-section was a Workbench-only green-icon-glow affordance; the new browser-tab fill replaces it). Conversation gained `active` alongside its existing `voice-tab`. `<div class="panel" id="chain">` lost `active`; `<div class="panel" id="voice">` gained it.

4. **Drag-to-reorder via Sortable.js.** Two IIFEs inserted just before the existing active-tab init IIFE (line ~4467). First: `aimmReplayTabOrder()` reads `localStorage['aimmTabOrder_v1']`, re-appends `.tab` children in stored order, appends any missing tabs at the end (gracefully handles future-added tabs without forcing a localStorage migration), filters out the hidden Settings tab and re-appends it last. Second: `aimmWireTabSortable()` calls `Sortable.create(.tabs, {delay:150, delayOnTouchOnly:false, animation:180, filter:'[data-tab="settings"]', onEnd: …})` — onEnd saves the new order to localStorage filtered to exclude Settings. Container gets `title="Press and hold to drag — release to drop"`.

5. **Browser-tab visual style.** New CSS block right after the existing `.tab.active` rules (line ~64): adds `border-radius:8px 8px 0 0` + `position:relative` to base `.tab`; `.tab:not(:last-child):not(.active)::after` paints a 1px right-side divider (top:25% bottom:25%, `#374151` at 60% opacity); `.tab:not(.active):hover` background bumped to `rgba(31,41,55,.3)` (was the global `.tab:hover` light wash); `.tab.active` gets background `#1f2937` and bottom-border transparent (kills the underline since the fill itself signals selection); `.tab.active::after` is suppressed so the divider doesn't leak under the raised active tab. The existing `-1px translate` + purple text + icon glow stay as-is.

6. **Hope wiring for the new tab.** `TAB_DISPLAY_NAMES` + `TAB_PURPOSES` + `TAB_PERSONA_MAP` all gain a `snapshots` entry. `switch_tab` tool description + enum updated in TOOL_DEFS AND `elevenlabs-client-tools.json` (the enum + the prose Tabs list). The `VALID` array in the handler also gets `'snapshots'`. `buildAppKnowledgeDigest()` rewrites: TAB NAV catalog is now 9 tabs in the new order, with a paragraph documenting drag-to-reorder + the browser-tab visual style; new `SNAPSHOTS TAB (snapshots) — NEW May 2026` section between Insight and Reference; Conversation full-inventory section trimmed of pills/Session-Snapshots line items (replaced with a "relocated to Snapshots tab" note); new Snapshots full-inventory section in the second pass with all DOM IDs called out.

7. **DASHBOARD.html status header refreshed.** "Last updated" now reflects the Snapshots-tab batch on top of Kev's dashboard work; "In flight" line swapped to "Snapshots tab live · pills + Session Snapshots relocated · tabs draggable · browser-tab style". The 2026-05-12 ship-group expanded into a single merged entry covering Adam's 5 line items (tab, button location, reorder, drag, browser-tab style, Hope wiring) AND Kev's 6 line items (P10 tiles, collapsibles, dedup check, scan modal, auto-cleanup, Backlog #4) — each Kev item is tagged `(Kev session)` for traceability.

**Apply drill:** Re-run `EL_API_KEY=<key> python3 register_elevenlabs_tools.py` because BOTH `capture_to_roadmap` (gained the `force` param earlier today) AND `switch_tab` (gained the `snapshots` enum value) changed schemas — the agent's tool list needs the fresh registration. Then click Publish on Hope's agent dashboard. Then hard-refresh `localhost:8000`. Kev knows the drill.

**KEV'S SESSION earlier in the day — dashboard intelligence + dedup tooling:**

1. **P10 auto-calc dashboard tile counts from ROADMAP.md.** Tiles now derive their counts (Open bugs / Dashboard TODOs / Backlog / Shipped last-7d) by fetching ROADMAP.md on every page load + every focus (no cache — Kev wanted live updates the moment he saves the file). Markdown parsed via `parseRoadmapCounts(md)` — section detection on `## ` headers, then counts entries matching regex per section, excluding `CLOSED / WON'T FIX / KILLED / DONE / FIXED / RESOLVED`. Written into existing tile DOM via `writeTileCounts(c)`. Fallback to `?` when fetch fails. `[dashboard] tile counts refreshed from ROADMAP.md` console log on every run for diagnostics.

2. **Dashboard collapsible sections.** Every `<section class="section">` head is now clickable — toggles `.collapsed` class which hides children. Chevron span injected programmatically on init (rotates -45deg when collapsed). State persists per-section key in `localStorage['aimmDashboardSectionState_v1']`. `sectionKey()` derives a stable key from the h2 text (lowercased alphanumeric). Click handler skips toggle if a link/button inside the head was clicked (so footer-style blurb links still work).

3. **Hope dedup check on `capture_to_roadmap`.** Handler in `index.html` `case 'capture_to_roadmap':` (~line 9187 area) now does a fuzzy-match dedup pass BEFORE persisting. Unless `args.force === true`, it normalises the proposed title (word-set Jaccard similarity with a stopword filter) and compares against (a) existing captures in localStorage, (b) every `### header` line in ROADMAP.md (fetched at handler call time). Threshold 0.5. On match returns `{ok:false, duplicate_found:true, match:{source, title, similarity, id}, message:"Looks like that's already on the roadmap as Pxx ('title'). Want me to log it anyway, or skip?"}`. Tool description + RT_INSTRUCTIONS updated so Hope speaks the message to Kev verbatim and waits for confirmation before calling again with `force:true`. JSON schema (`elevenlabs-client-tools.json`) updated with the new `force` boolean parameter. **REQUIRES register_elevenlabs_tools.py re-run + Publish for the new schema to reach the agent.**

4. **Dashboard duplicate scan modal.** New `🔎 Scan for duplicates` action button above the tile strip. Click → modal opens, fetches ROADMAP.md, parses entries via `parseRoadmapEntries(md)` (sections excluded: Shipped / Status snapshot / Now / Add a new idea), folds in captures-inbox entries too so cross-type matches get flagged, runs pairwise Jaccard similarity (threshold 0.4 — looser than the capture-side check since this is human-reviewed), surfaces each match as a `.dedup-pair` card with "Keep both — skip" and "▶ Continue here" actions. Continue button builds a tailored Cowork prompt with the merge snippet + delete instructions and copies to clipboard via the existing `continueInCowork(prompt)` helper. The merge-snippet logic itself lives in `buildMergeSnippet(pair)` — picks the shorter id, longer title, concatenates bodies with `---` separator.

5. **Auto-cleanup of inbox-vs-roadmap duplicates.** On dashboard load + focus, `autoCleanupInboxDuplicates()` runs silently: loads captures, fetches ROADMAP.md, and for each capture computes similarity against every roadmap entry. If any pair clears the AUTO_CLEANUP_THRESHOLD (0.6 — stricter than the scan), the capture is removed from the inbox and a `🧹 Auto-cleaned N inbox duplicate(s)` toast fires. The scan modal still surfaces these for review if Kev manually opens it, but in practice they auto-vanish before he even clicks the button. Roadmap-vs-roadmap duplicates require human judgment so they only show in the scan modal, never auto-cleanup.

6. **Backlog entry #4 added to ROADMAP.md** — "Snapshot pill → restore workbench state." Spec covers extending `STATE.journal[]` entries with an optional `workbenchSnapshot` field, the apply-to-workbench restore path, a confirm guard before overwriting current chain, and how it pairs with #2 (intelligent snapshot auto-suggestions). ~2-3 hours effort. Sits between Backlog #2 and #3.

**Verification notes for the next session:** Snapshots-tab batch verified by `node --check index.html` (passes — see Verify task below in the session log). All 30 client tools intact. Two gotchas the spec called out, resolved in this batch:
- App knowledge digest grew with the new Snapshots section + drag-to-reorder paragraph; if Kev ever sees `[EL] contextual update SKIPPED:` in DevTools console, this is the candidate. Measured added length ~1.4KB — well inside the limit.
- The default-active swap (chain → voice) means `applyFloatMicVisibility` no longer sees a `.tab.active.active-section` combo. `active-section` was Workbench-only and was stripped from the chain tab in this batch. Repair (meter) still has the class but the `.tab[data-persona-label]` rule at line 60 overrides the green colour so it's dead code there — left as-is to keep the change scope minimal.
