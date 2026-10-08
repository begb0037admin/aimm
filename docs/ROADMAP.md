# ROADMAP.md — AIMM Active

> Active planning doc. Root ROADMAP.md is preserved as historical record.

## ✅ R3 Mix Check full-layout redesign — PROMOTED & LIVE on `main` @ `dbc793d` (build 2026-09-01.9), 2026-09-01 — post-ship fix round pending (see `docs/HANDOVER.md`)

The Mix Check (`#eq`) tab has been rebuilt mockup→live to the approved Jules mockup
`begb0037admin/jules` `mockups/05-r3-mixcheck-full-layout.html` @ `8c2785e` — the first R3 tab to go
from mockup to a real, working build (browser DSP, NOT the deferred server-side analysis phase).
Base = `main` @ `68a3ffa`; branch HEAD = `256cae8`. **Durable record: `docs/HANDOVER-r3-mixcheck.md`**
(full 8-step plan, locked decisions, the `window.mcFixQueue` contract, Codex pass history, promote command).

- **Steps 0–7 DONE + committed on `r3-mixcheck-codex`:** grid shell + de-pinned transport → panel
  header + single `Drop / browse WAV ▾` input + brand wordmark (`AI` yellow + `MixMasters`/`Hope`/
  filename-accent gradient) → Audio Specs panel absorbing the 4 meter cards (RMS/Crest/LRA/noise-floor
  DSP, Tempo via `web-audio-beat-detector`, in-browser chroma Key, TEMPO/KEY headline tiles,
  stereo-width meter, SSL-style band deviation meters) → context banner → Fix Queue with the
  `window.mcFixQueue` contract + `aimm:analysis-complete` event (replaces the 6 Mix Issues pills) →
  transport waveform → `#hopeRail` full-height grid item with a speech-tied meter → Hope transcript
  mix-breakdown + live action-item cards + `mark_fix_applied` tool (Markey).
- **Codex:** TP1 (plan) = approve-with-notes, folded. Per-step TP2 = clean. **TP3 end-to-end complete —
  no blockers** (one CSS-scoping nit on uniquely-named `.mc-wave`/brand/AI-star classes, assessed
  non-blocking: probe confirms 0 out-of-scope bindings; matches the file's existing `.ref-*` convention).
- **Gate 1 + Gate 2 = Kevin-approved 2026-09-01 @ `256cae8`.** PROMOTED to `main` via Kevin's
  PowerShell ff-only merge 2026-09-01 — `main` @ `dbc793d`, live. **Post-ship fix round pending:
  7 items from Kevin + residuals A–F, see `docs/HANDOVER.md` top entry.**
- Supersedes the stale "R5 Ozone-12" framing below and in `docs/STATUS.md`, plus the 2026 rounds 1–5
  screenshot-rebuild history and the `r3-preview` branch.
- **Rest of the R3 per-tab redesign** (Workbench, Library, Insight, Snapshots, Settings, Marketing,
  Community, Conversation) still to do — the redesign epic is not fully settled.
- **2026-09-02 Mix Check feedback round:** feedback items 1–15 (16 folded into 15), 17, 18, 20 are
  SHIPPED & LIVE on `main` (build `2026-09-02.15`) — see the dedicated `## ✅ Mix Check 2026-09-02
  feedback round` section below. The still-open queue (feedback #21, #22, #19, #3, #6 + a default-tab
  change) is tracked in `## Mix Check redesign — outstanding feedback queue (2026-09-02 round)`
  below. Operating surface: `docs/feedback/2026-09-02/BOARD.md` on branch `feedback-board`.

### Backlog — from the R3 Mix Check redesign

- **6. Real values for the Audio Specs placeholders** — Subgenre / Production style / Energy / Mood /
  Dissonance render as "with full analysis" placeholder rows (neutral dot); real detected values need
  the deferred server-side analysis phase (Platform Evolution ARCH-2 territory). Placeholders by design.
- **7. Real arrangement detection on the transport waveform** — **SUPERSEDED** by "Mix Check
  redesign — outstanding feedback queue" item **9 (feedback #21)** below, now scoped as a real
  analysis-driven ADDITIVE overlay (section boundaries + labels + clickable issue markers) on the
  LOCKED `#mcWave` canvas. The old fixed INTRO / VERSE / BRIDGE graphic was decorative and was
  removed entirely in R3 post-ship fix #4/#5 — there is no cosmetic layer left to replace.
- **8. Gate-2 accepted residuals + speaking-meter gain tune** (Kevin signed off 2026-09-01 with these known):
  - A. Empty (no-WAV) state — the Audio Specs column runs well below the shorter empty analyser card before the columns bottom-align; matching the empty analyser height is a separate grid tweak.
  - B. Very hot bands peg at the ±6 dB edge of the deviation meter (e.g. LOW +11 shows at the edge); the signed value above carries the true number.
  - C. Stereo-width meter is a 1:1 %→track map; typical masters (~25–40%) sit left of centre; could switch to a compressed scale.
  - D. NOT RESOLVED as of round 1. The flat `×18` gain (docs previously mis-stated `×11`) was replaced with an AGC/compressor-style reference-tracking gain (`markey-hopewave-gain-tune`, merged to `main` build `2026-09-06.3`) — but Kevin live-tested it and reported "no change." Root cause: the reference tracked `rms` with only a 550ms lag, self-cancelling the gain within roughly a word (compressor behavior, not VU-meter behavior). Round 2 fix (`markey-hopewave-gain-tune-2-work`, build `2026-09-06.4`, **not yet merged**) replaces the single symmetric tau with an asymmetric attack (1500ms)/release (4000ms) follower — Codex TP1+TP2 verified against a hand-worked quiet/LOUD/quiet numerical example. Full detail in docs/STATUS.md. Kevin's own live listen is still the remaining confirmation step.
  - E. Speaker button in the composer has no effect with no call live (arms the mute preference); could show a disabled state.
  - F. PRE-EXISTING: empty-state analyser hint text overlaps the "Low / Low-Mid / High-Mid / High" axis labels — long-standing, not introduced by R3, still present.

## Mix Check redesign — outstanding feedback queue (2026-09-02 round)

**Reconciled 2026-10-08 (Jacob) — this whole section was stale, every item below checked directly
against real code on `main`, not assumed.** Items 12 and 13 are confirmed SHIPPED & MERGED (see
their entries below) — moved out of the open-queue framing. This is also the exact section Hope
reads when asked "what's on the roadmap" (her `read_doc`/dashboard-digest mechanism fetches this
file directly) — if this section is stale, so is her answer, which is exactly the incident that
triggered this reconciliation pass.

Operating surface: `docs/feedback/2026-09-02/BOARD.md` on branch `feedback-board` — every item there
has Kevin's marked-up screenshot, the ask, the owner and the status. Feedback items 1–15 (16 folded
into 15), 17, 18, 20 are LIVE on `main` (build `2026-09-02.15`) — see Recently shipped. The `#N`
numbers are kept verbatim so the board, Kevin's chat and this roadmap all line up; the `9`–`14` are
this roadmap's own backlog IDs (matching the DASHBOARD.html Backlog cards).

### 9. Mix Check feedback #21 — Real section detection + issue markers on the transport waveform · owner: Cat builds, Jules specs the overlay · **Confirmed not started, 2026-10-08**

Windowed onset/energy analysis of the decoded buffer produces INTRO / VERSE / CHORUS / BRIDGE
boundaries and labels, drawn as an ADDITIVE overlay **under** the LOCKED `#mcWave` canvas — never a
redraw of it — with labels shown only where confidence is high. On top of the same windowed feature
extraction, place **issue markers** on the waveform showing WHERE IN THE TRACK each Fix Queue problem
occurs (e.g. an orange marker at the track position where a band deviation is worst), each clickable
to seek playback there and listen. This needs **time-localised analysis** — per-window / per-section
band-deviation, finding where each queued fix's deviation peaks — not the current whole-track
aggregate; it builds on the same windowed feature extraction the section detection already requires.
It effectively revives the old "issue marker pins" that R3 post-ship #4/#5 removed, but real
(analysis-driven) instead of fictional; the old fixed INTRO/VERSE/BRIDGE graphic (also decorative,
also removed in #4/#5) is replaced by the real segmentation. Jules specs the overlay — markers and
labels together. Supersedes the old "Backlog 7 — real arrangement detection" bullet above.
**Verified 2026-10-08: zero onset/section-detection code anywhere in `index.html` — genuinely not
started, not just undocumented.**

**Effort:** L.

### 10. Mix Check feedback #22 — Read-aloud button in the composer row · owner: Markey · **Status unclear, 2026-10-08 — re-verify before acting**

Replace the composer-row mute/speaker button (currently a mute toggle with no effect when no call is
live) with a Read-aloud control: text selected in the chat transcript → speak just the selection;
nothing selected → read the last Hope message aloud. ElevenLabs TTS in Hope's voice, spend into the
EL bucket. **First step:** confirm the `aimm-proxy` ElevenLabs key is a valid `sk_` key — known
issue, it is currently a key ID, not an `sk_` secret. Retires the accepted Gate-2 residual E.
**Flagged 2026-10-08, not resolved:** code comments elsewhere in `index.html` describe the whole
Read-aloud feature as "DORMANT, retired in Batch-3b" — unclear whether this card's ask is that same
retired feature (making this item moot) or a genuinely separate open request. Needs a real look at
the composer row before this status is stated either way — flagging the uncertainty rather than
guessing at it.

**Effort:** M.

### 11. Mix Check feedback #19 — Capture PC / tab audio into the Mix Check analyser · owner: Cat · **Confirmed built, button hidden — 2026-10-08**

A control to capture whatever is playing on the machine (e.g. Spotify) via `getDisplayMedia`
tab-audio and run it through the Mix Check analyser exactly like a loaded file. Regression — the
capability used to exist (the "Capture tab audio" bar from P0i live input metering) and there is no
button for it in the R3 Mix Check layout now. **Verified 2026-10-08: the capability is actually
implemented** (`window.refLiveTab`, a real `getDisplayMedia` call, wired to the live-metering
pipeline) — but its button (`#refLiveTabBtn`) carries a `hidden` attribute in the current R3 layout,
so it's real but genuinely inaccessible right now. Fix is small: decide whether to un-hide the
existing button or redesign its placement — not a from-scratch build.

**Effort:** S (button only — the capture logic already exists), down from M.

### 12. Mix Check feedback #3 — Hope tab-awareness verify + persisted-history fix · owner: Markey · ✅ **SHIPPED & MERGED, confirmed 2026-10-08**

Confirm on a clean live build that Hope no longer asks "was it from a Session Snapshot / the Repair
tab / your Insight tab?". Markey has confirmed the instruction text on `main` is already reconciled
(post `9797772`); the wording only reappears when pre-fix persisted chat history
(`trapMasterAiChatHistory_v1` / `AICHAT_HISTORY_KEY`) replays on load. Permanent fix: bump the
history key so pre-fix turns cannot replay. Branch `markey-hope-history-key-bump` @ `d492eb1`.
**Verified 2026-10-08 (Jacob), directly against real code, not assumed:** `git merge-base
--is-ancestor d492eb1 main` confirms the branch IS merged; `AICHAT_HISTORY_KEY` is `_v2` in the live
code; the Conversation tab nav button is confirmed removed. This card had been sitting marked
"pending merge" on the dashboard for weeks after actually shipping — the exact staleness that
triggered this whole reconciliation pass (Kevin caught it live, 2026-10-08).

**Effort:** S. **Done.**

### 13. Mix Check — Default tab on load should be Mix Check, not Conversation · owner: Cat · ✅ **SHIPPED & MERGED, confirmed 2026-10-08**

The app should open on Mix Check (`data-tab="eq"`). Shipped on branch `mixcheck-audiospecs-label-align`
(build `2026-09-05.1`), merged to `main` 2026-09-05. Markup hardcodes `active` on the Mix Check
tab/panel; the three tab-click-gated lazy-inits this card originally flagged now also fire on cold
load. **Re-verified 2026-10-08:** still true on current `main` — Conversation tab has since been
fully retired as a side effect of item 12's work, so this is doubly moot as a concern now.

**Effort:** S. **Done.**

### 14. Mix Check feedback #6 — "Clear chat" button wraps to its own line at narrow rail width · owner: Markey · **Needs a live check, 2026-10-08**

At ≲380px rail width the new "Clear chat" button wraps to its own full-width line (same
`.send-col{flex-wrap:wrap}` behaviour "Attach screenshot" has always had). Jules's review called it
acceptable graceful degradation. Kevin's call whether to force it single-line at all widths (shrink
pill padding/font, or `flex-wrap:nowrap` + `min-width:0` on the row). **Not re-verified 2026-10-08**
— real recent work has touched the Clear-chat button since this was written (it was restored to the
composer row in the Hope-rail pass), so this specific narrow-width wrap claim needs a live
narrow-viewport check before its status can be stated either way, rather than assumed unchanged.

**Effort:** S.

## ✅ Mix Check 2026-09-02 feedback round — items 1–15 (16 folded into 15), 17, 18, 20 SHIPPED & LIVE on `main` (build `2026-09-02.15`)

Batched feedback round worked from `docs/feedback/2026-09-02/BOARD.md` (branch `feedback-board`),
promoted to `main` ff-only by Kevin across builds `2026-09-02.5`–`.15`. What landed:

- **Header re-layout (#3, #9)** — Genre / Target / Settings cluster moved down onto the file-title
  row; `Drop / browse WAV` moved into the transport bar (empty state: the transport card is the drop
  zone); tab strip fills the row edge-to-edge with no trailing gap. Mix-Check-scoped, the other 8
  tabs unchanged.
- **Hope-rail pass (#2, #4, #5, #6, #8)** — Hope identity block + chat dropped down with a clear band
  for the `#hopeWave` speech wave; dead transcript↔composer drag handle removed; Clear-chat +
  Attach-screenshot buttons restored to the composer row; the rail is height-locked to the dashboard
  and long transcripts scroll internally (the page never grows). Jules design-review = APPROVE.
- **Fix Queue + transport batch (#7, #10, #12, #13)** — broadband Fix Queue items draw no frequency
  band, band items get a solid `#f97316` position marker (no brown wash); the WAV loader keeps the
  full gradient "Drop / browse WAV" button in both states; the newest chat bubble always scrolls
  fully into view; a horizontal volume slider added to the transport row (gain node spliced
  downstream of the analyser so meters / Spectral Balance / `#mcWave` are unaffected).
- **Hope-rail transcript layout (#14)** — role-label/bubble spacing, horizontal wrap/clip hardening,
  and a soft top-fade so the scrolled transcript meets Hope's zone without clipping under the wave.
- **`#hopeWave` PTT waveform port (#17)** — Hope's speech waveform replaced like-for-like with the
  `windows-mac-dictation` PTT Mini Float waveform (bar markup + CSS + amplitude analysis), wired to
  Hope's ElevenLabs output stream, keeping the item-4 reserved band. The live `getOutputVolume()`
  reaction gain was tuned 2026-09-06 (see Backlog 8 item D, RESOLVED, above) — Kevin's own live listen
  is the remaining confirmation step.
- **Viewport-fit density pass (#18)** — Mix Check dashboard compressed to ~0.81× height (flush
  ~1046px loaded) so it fits a 1920×1080 viewport with no page scroll; `#mcWave` render untouched.
- **Page gutter (#20)** — symmetric responsive `padding-inline` on `.container` (32px each side
  ≥1600px, 16px 1024–1599px) + `max-width:2000px` cap; `.container{padding-right:0}` dropped.
- **Fix "production line" (#15, #16)** — **queue side** (build `.13`): a direct "✓ Mark done" button
  on the UP NEXT card calls `MC_FIXQUEUE.markApplied()`; `emit()` carries a payload and dispatches a
  new `window` CustomEvent `aimm:fix-queue-changed`; completed cards drop off one by one to a clean
  "N / N done" state. **Hope side** (build `.15`, `e9bcd8a` — Kevin kept this on `main`): the current
  Fix Queue item renders as a self-updating card in Hope's chat transcript (revived
  `renderFixActionBody()` in the `hopeMixRead` IIFE) — analyse → card for #01 → mark done (card
  button, dismiss ×, or Hope's `mark_fix_applied` tool) → same marker re-renders as #02 → … → queue
  clear → an "ALL CLEAR" card, the marker floating to the end of the transcript on each advance;
  the count always reads live so it cannot mismatch; `onAnalysisComplete` purges stale fix-action /
  breakdown / `mc-advance` entries; `RT_INSTRUCTIONS` / digests reconciled.
- **#1** — standing rule: no wireframes, every proposal rendered from the real app.

Still open from this round → queue items 9–14 above (feedback #21, #22, #19, #3, #6 + default-tab).
Accepted Gate-2 residual E (composer speaker button inert with no call live) is folded into queue
item 10.

## Multi-stem Mix Check — stem upload / auto-split so Hope can see per-element measurements (captured 2026-09-04) — **PRIORITY BUMPED 2026-09-06**

**Not yet scoped or built — backlog capture only, not build authorization.** Session goal
approved by Kevin 2026-09-04: move to the mockup stage (Jules builds an interactive HTML mockup
per the standing mockup-first process — see `docs/CLAUDE.md`), not to implementation.

**Priority bumped 2026-09-06 (Kevin's explicit reprioritization):** moved up ahead of the Fix
Queue placeholder bug fix (that item was correspondingly dropped to low priority, see
`docs/STATUS.md` for its status) — this is now the next thing to pick up. DASHBOARD.html Backlog
card 22 mirrors this.

**Mockup stage update, 2026-09-07 (Jules):** `docs/mockups/multistem-mixcheck.html` now covers
all 7 requirements below (previously just 1-2), pushed to `main` (commit `24e491e`), Codex
three-touchpoint reviewed. Awaiting Kevin's review at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck.html` — see `docs/STATUS.md`
for the full design-decision writeup. Still backlog capture only, still not build authorization;
Option A vs B below is still Kevin's open call, unaffected by the mockup existing. (Note: this
mockup was pushed straight to `main`, not its own branch — `docs/CLAUDE.md`'s standing mockup
process is the authoritative one, superseding the "own branch" pattern used for the original
2026-09-04 requirement-1/2 pass.)

**v2 mockup, 2026-09-07 (Jules), later same day again — SUPERSEDES the minimal pass below after
Kevin tested it and found a real bug plus a wrong interaction model.** Kevin reported: (1) a real
bug — dropping files produced 7 identical duplicate stem rows, a "mismatched stem(s) excluded"
warning; root cause confirmed by live headless-Chrome reproduction — no dedupe check against an
already-loaded identical stem, plus zero visible feedback below 2 stems, so a user re-dropping the
same file (getting no acknowledgement) silently accumulated duplicates. (2) Wrong interaction
model — Kevin pointed at the ORIGINAL standalone mockup's per-stem-slot panel (fixed Drums/Bass/
Vocals/Other, each independently droppable, + "+ Add stem") as the correct shape, explicitly
rejecting the minimal pass's shared multi-file picker, and asked for each stem's own inline
waveform preview. **`docs/mockups/multistem-mixcheck-v2.html`** delivers per-stem drop slots
(replace-not-append semantics close the duplicate bug structurally), restyled to the real app's
own tokens/`.ref-t-btn` class (not the standalone mockup's separate dark-card system Kevin already
flagged as inconsistent), a per-slot own-waveform preview alongside the still-present shared
combined waveform, and a generation-token race guard. Codex three-touchpoint review found and
fixed 3 real issues in TP2 (a legacy-drop state-divergence risk, a `mcClearAllStems()` gap, and a
remove-then-reload requirement for replacing a loaded slot) plus one more found during TP3
iteration (a loaded dynamic "+ Add stem" slot had no way to remove the slot itself) — all fixed
and re-verified via real headless-Chrome execution. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-v2.html`. Full write-up in
`docs/STATUS.md`. Still backlog capture only, still not build authorization; Option A vs B below
remains Kevin's open call, unaffected by any of the mockups.

**Minimal-pass mockup, 2026-09-07 (Jules), later same day — SUPERSEDES both mockups below for
review purposes, per a fresh live design discussion with Kevin.** Kevin's explicit framing: the
two mockups below (all-7-requirements and in-context) were both too elaborate and built the wrong
shape — "we already have this, just add the tracks." **Kevin should review
`docs/mockups/multistem-mixcheck-minimal.html`** (live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-minimal.html`), not the two
below — they stay live/unchanged for reference only, not deleted. New scope, nothing more: the
real transport bar (play/prev/loop/stop/volume/time/`Drop / browse WAV ▾`) is completely unchanged
mechanically; the only new capability is that the drop control accepts multiple named stems
(filename = label, no fixed taxonomy) with a minimal inline mute(M)/solo(S)/remove(×) toggle per
stem styled with the exact same `.ref-t-btn` class as the existing transport buttons. **EQ
(requirement 7) is explicitly DROPPED from scope this pass — Kevin: "remove EQ — this is not
working."** None of either prior mockup's EQ code was carried into this one. Build approach: a
fresh, never-edited `main` `index.html` as the base, with a small surgical in-place diff; every
real analysis mechanism (Audio Specs, Spectral Balance, Fix Queue, the waveform, the transport) is
reused UNMODIFIED — currently-audible stems are summed into one combined buffer and fed through
the app's own existing single-file `refLoadFile()` pipeline (requirement 3 — live reactive
analysis — comes for free this way), with sample rate/channel/length validation on load
(requirement 1) flagging and excluding mismatched stems rather than silently misaligning them.
Codex three-touchpoint review found and fixed real bugs, not just scope creep: TP1 (plan) flagged
7 concrete implementation risks before code was written; TP2 (diff) reproduced two real bugs live
— a drop-bubbling double-load and a muted-lone-stem-silently-unmutes-itself case — both fixed; TP3
(real headless-Chrome click-through) regression-tested both plus the full requirement checklist,
all clean. Requirements 4-6 (Hope-awareness, tool-calling control, demonstrate-vs-instruct) were
NOT built this pass — explicitly deferred as lower priority per the brief, not dropped. Full
write-up in `docs/STATUS.md`. Still backlog capture only, still not build authorization; Option A
vs B below remains Kevin's open call, unaffected by any of the three mockups existing.

**In-context mockup, 2026-09-07 (Jules), added alongside the standalone one above, per Kevin's
explicit ask after reviewing it ("I want to see it in context of the entire page"):**
`docs/mockups/multistem-mixcheck-in-context.html` wraps the SAME multi-stem Mix Check feature (all
7 requirements, unchanged) inside the real, freshly-fetched `main` `index.html`'s own chrome — real
header, real 8-tab strip (Mix Check active by default), real `#hopeRail` dock — so Kevin can judge
it sitting in the actual app rather than as an isolated single-tab demo. `index.html` itself is
read-only reference for this pass, never edited. Codex three-touchpoint reviewed; TP1 surfaced
several real-page init hooks (`wireDropZone`/`wireMcBanner`/`wireMcInput`/`wireScrub`/`wireMcVol`/
`ozSpecInit`, the transport/header-actions relocation shims) that retry forever against missing DOM
nodes, which shaped a hide-not-delete approach for the real Mix Check markup that had to move aside;
TP2 found (and this pass fixed) a real event-bubbling bug where a stem-row file drop would silently
reach the real page's own drop handler and overwrite the real Mix Check title, plus a CSS
specificity collision on several transport class names reused from the real component's own
styling; TP3 (real headless-Chrome click-through) confirmed all 8 tabs switch correctly, the new
content survives round-trips through every other tab, and the multi-stem feature itself (demo
stems, mute/solo, live analysis, Hope demonstrate/instruct, EQ, Undo) is unchanged and fully
functional. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-in-context.html` — full
design-decision writeup in `docs/STATUS.md`. Still backlog capture only, still not build
authorization; Option A vs B below remains Kevin's open call, unaffected by either mockup.


**Final agreed brief mockup, 2026-09-07 (Jules) — SUPERSEDES `multistem-mixcheck.html`,
`multistem-mixcheck-in-context.html`, and `multistem-mixcheck-minimal.html` for review purposes,
per Kevin's final agreed brief after an extensive live design discussion.** One-line reason each
is superseded, so the history stays legible:
- `multistem-mixcheck.html` (+ its all-7-reqs expansion) — **wrong drop-target structure**: a
  separate stem-slot panel bolted on beside the real transport, instead of extending the app's own
  existing shared `Drop / browse WAV` control.
- `multistem-mixcheck-in-context.html` — **hidden real components + duplicate Hope**: hid the real
  Mix Check markup behind a wrapper instead of genuinely extending it in place, and carried a second
  scripted "Hope" panel alongside the real `#hopeRail`.
- `multistem-mixcheck-minimal.html` — **wrong interaction model**: reused `refLoadFile()` for BOTH
  playback and analysis (one single-buffer engine), so mute/solo had to stop/reload the whole mix
  rather than keep every stem's source node continuously running — the opposite of what Kevin
  corrected this pass to require — and labelled stems from the filename, which produced the
  concatenated-filenames header bug Kevin flagged directly.

**Flagged discrepancy, not silently resolved:** `docs/mockups/multistem-mixcheck-v2.html` (Jules,
later on 2026-09-07, per-stem drop slots — see the STATUS.md/DASHBOARD.html entries for that pass)
is a fourth prior mockup that Kevin's final brief for this pass did **not** name in its explicit
supersession list (which named only the three above). This final pass's point 1 ("one shared drop
zone... nothing existing is removed") is a shared-picker model, which is the opposite structural
direction from v2's per-stem-slot design that Kevin had explicitly asked for after rejecting the
minimal pass's shared picker. Read together with the rest of this final brief (content-based
classification + click-to-rename, which removes the filename-labelling problem v2's slots existed
partly to solve), it looks very likely that v2 is *also* superseded by this final direction — but
since the brief didn't say so explicitly, this is logged as an open question for Kevin to confirm
rather than assumed. `multistem-mixcheck-v2.html` is left untouched, live, and its DASHBOARD.html
badge is not silently removed.

Delivered: `docs/mockups/multistem-mixcheck-final.html`, pushed to `main`. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-final.html`. Base = a fresh
fetch of `main` `index.html` (commit `2d0f949afb3aa1f78f8e6fac10d1ea259f0e2a01`), edited in place —
`index.html` itself untouched, read-only reference throughout.

**What's new vs the minimal pass, per the brief's 11 numbered points:** the shared drop zone now
accepts multiple named stems (single-file load byte-for-byte unchanged, the degenerate case);
**every stem's `AudioBufferSourceNode` runs continuously for the whole playback duration regardless
of mute state** — mute/solo ONLY ramps that stem's own persistent `GainNode`, never
stops/starts/reschedules a source (the specific correction Kevin gave, verified — see the TP3
summary in `docs/STATUS.md`); each stem gets its own stacked waveform row (a faithful port of the
real, LOCKED `#mcWave`/`MC_WAVE` peak-drawing algorithm, parameterized per stem — `#mcWave` itself
untouched); stem labels come from real content-based classification (transient density + spectral
flatness + low/mid band-energy ratios, concrete documented thresholds, not filenames), honestly
badged "guessed" and click-to-rename; the header never concatenates — `#mcSub` shows a clean
"N stems loaded — duration" summary, individual names live only in their own row; a Snapshot
extends the existing `STATE.journal`/`createWorkbenchBackupPill()` pattern (`type:'stem-session'`,
fingerprint-keyed restore, settings-only, no raw audio) so reloading the same files restores
labels/mute/solo without re-classifying; Audio Specs/Spectral Balance/Fix Queue stay real and
unmodified, reacting live to the audible subset via the same summed-buffer-through-`refLoadFile()`
black-box technique the minimal pass proved, now serialized via a latest-wins queue; still no EQ;
exactly one real `#hopeRail`.

**Codex three-touchpoint review — all three found real, concrete issues, all fixed and
re-verified via live headless-Chrome (Playwright), not self-report.** TP1 (plan) materially
reshaped the playback-engine design (gain-automation cancel-before-ramp, transport-generation
discipline, `refCtx.resume()` handling), the analysis-serialization approach (a latest-wins drain
queue, a content-fingerprint-based Fix Queue signature instead of a timestamp), the classification
constants (concrete FFT size/hop/thresholds instead of vague adjectives, an energy-preserving
mono downmix to avoid phase cancellation), and the Snapshot fingerprint design (stable identity,
occurrence-indexed for duplicates), before any code was written. TP2 (diff review against the
actual built file) confirmed the mute/solo path never touches a source node — only
`gainNode.gain` — and found and fixed 6 more real bugs: an analysis-reset race (`mcResetStems()`
didn't invalidate the in-flight analysis generation), a solo+mute inconsistency (a stem that was
both soloed and individually muted was audible in playback but excluded from analysis — now both
paths call the same `effectiveMuted()`), a session-local-id Fix-Queue signature that changed on
every reload of the same files (now keyed to stable content fingerprints), a Snapshot-restore
duplicate-matching gap (now occurrence-indexed explicitly), a stem added mid-playback staying
silent until the next manual transport action (now re-schedules immediately, in sync), and a
mismatch-reference edge case (removing the reference stem could leave the last remaining stem
stuck flagged with nothing left to compare against). TP3 (real headless-Chrome click-through
against 4 spectrally-distinguishable synthetic demo stems — drums/bass/vocals/other) found and
fixed two more: a `[hidden]` CSS-specificity bug where the stem-stack panel showed even on a
single-file load, and a backwards onset-detection condition that required the frame BEFORE a
transient to already be active — which structurally excluded the silence-to-hit transition that
IS the onset for percussive content, so the synthetic drums stem misclassified as "Other" until
fixed. All fixed; the full TP3 suite re-ran clean afterward with zero regressions.

**Continuous-sync-while-muted, verified not just built:** a debug hook
(`window.__mcDebug`) exposes the real `AudioContext` and generation counters (not exposed on
`window` anywhere else in the app) so the test harness can inspect actual engine state rather than
trust self-report. With 4 stems loaded and playing, `AudioContext.prototype.createBufferSource`
was instrumented to count real invocations; three full rounds of mute-toggling every stem plus a
solo/un-solo cycle produced **zero** new source-node creations, `AudioContext.state` stayed
`"running"` throughout, `currentTime` kept advancing, and the transport's play state and elapsed
time both continued forward uninterrupted (confirmed advancing from the toggle point to +1s later
mid-track). Isolating a single stem (all others muted) changed the measured loudness from -70.0
LUFS (all muted, near-silence) to -14.7 LUFS (real signal) — live-reactive analysis confirmed
functionally correct, not just visually plausible.

**Classification heuristic, honestly assessed:** concrete, documented constants (2048-sample FFT,
1024 hop, analyzes up to the first 20s, a 5-window minimum before guessing at all); on the 4
spectrally-distinguishable synthetic demo stems built for TP3 (broadband decaying percussive hits,
a 55Hz sine, layered vocal-range harmonics with vibrato, a sustained high-passed noise pad) it
classified all 4 correctly after the TP3 onset-detection fix. Known, disclosed limitations (found
via Codex TP1's own critique, not hidden): tonal mid-band material that isn't a voice (guitars,
synths, pianos) will often satisfy the "Vocals" rule; a very percussive bass line or a low piano
can read as "Drums"/confuse the "Bass" rule; this is a real, honest heuristic guess, not ML-grade
classification — which is exactly why it's badged "guessed" in the UI and click-to-rename exists
as the correction path, per the brief.

**Problem:** Hope can currently only measure the whole rendered mix (`balance.wav`) on Mix Check —
she has no visibility into individual stems, so when asked "what's causing this low-end issue,"
she can only give informed reasoning from the full mix, not real per-element measurements.

**Kevin's ask, verbatim intent:** "I need to be able to upload stems for Hope to analyse — they
all need to be present, or maybe give her the ability to stem split."

**Two directions, not yet chosen:**
- **Option A — Multi-stem upload.** Kevin drops multiple stems (drums/bass/vocals/etc.) onto Mix
  Check instead of just one WAV; analyser runs BS.1770-4 + spectral measurement per stem plus the
  combined mix, so Hope can point at which specific stem is driving a flagged issue instead of
  guessing from the full mix alone. Straightforward with the existing measurement pipeline —
  requires Kevin to already have stems.
- **Option B — Client-side stem separation.** If only a single mixed WAV is provided, run a
  stem-splitting step (e.g. a WASM/ONNX port of a model like Demucs/Spleeter, or a server-side
  microservice call) to derive approximate stems automatically, then measure those. A bigger lift —
  needs a separation model, and the browser-only single-file constraint may force a backend/
  microservice call — same shape as the ARCH-2/ARCH-3 Platform Evolution Epic already below in this
  doc; cross-reference that section for the backend-microservice pattern this would reuse.

**Decision (2026-09-07, Kevin): both, not either/or.** "Can I have both?" — yes: A and B are
not mutually exclusive, they're two entry paths into the same downstream system. Once stems exist
(whether Kevin supplied them or they were auto-split), live reactive analysis, Hope's awareness,
her control tools, and per-stem EQ all work identically regardless of source. **Sequencing: build
Option A first** — cheap, immediate value, works with the existing measurement pipeline as-is, and
unblocks everything else (reqs 3-7). **Option B follows later** as an enhancement for when Kevin
only has a single mixed file and doesn't want to bounce out to a DAW to export stems first — it's
the bigger lift (needs a real separation model, same backend-microservice shape as the ARCH-2/
ARCH-3 Platform Evolution Epic) and isn't blocking A's build.

**Competitive context (captured 2026-09-05, context only — not a task list to copy):** a live
competitor product already ships, as paid features: AI stem-splitting (not just stem upload — they
split for you), a scored mix-history library with compare-versions, a "Tools" marketplace (Voice
De-Noise, Audio Restoration, Karaoke, A Capella, Delivery Master, Professional Audio, Workflows),
and a locked Reference-track A/B feature. Kevin's read: their structure is generic and replicable,
but AIMM's real differentiator has to be **Hope actually being intelligent** — teaching,
referencing, driving, and demonstrating — not matching their feature checklist point-for-point.
This note exists to inform priority calls (see Library reorganization, item 23 below, explicitly
deprioritized behind Hope-intelligence work as a result) — it is not itself a build item.

**Product vision, sharpened 2026-09-07 (Kevin, in his own words, reviewing the Multi-stem Mix
Check mockup's Hope demonstrate/instruct behavior):** "this is the kind of interaction I want from
Hope and set this apart from all the other mix apps out there." The concrete shape of it: Hope
should be conversationally smart enough to flag a real problem unprompted in plain language ("your
bass is high and over") and then genuinely act on it ("here, let me show you" — a real solo/mute
call, not just a description), or offer to talk the user through doing it themselves. This is the
explicit, load-bearing differentiator for AIMM going forward — not a nice demo moment, the actual
reason Hope exists as a product idea. Treat any future Hope-intelligence work (Backlog 24/25, the
demonstrate/instruct mechanism itself, and anything similar) as building directly toward this
statement, not a generic assistant feature.

**Requirements gathered so far (2026-09-04 session, Kevin's refinements as the spec developed —
fold all of these into whichever option/build a future session picks up):**

1. **Sync.** Stems must be exported full-length from bar 1 (no trimming) — same duration/sample
   rate. On upload, validate every stem's sample count/sample rate match and flag a mismatch rather
   than silently misaligning. Playback schedules all stem `AudioBufferSourceNode`s to start at the
   same Web Audio clock timestamp for sample-accurate sync.
2. **UI concept — for Jules to mock up, not for Cat to build yet.** Where the single Drop/browse
   WAV zone is now, a stack of stem slots (fixed categories like Kick/Bass/Vocals/Other, or generic
   "+ Add stem" rows — Jules's call), each with its own drop target, filename, and mute/solo toggle.
   One shared transport plays all unmuted stems in sync.
3. **Hard requirement — live reactive analysis.** Spectral Balance and Audio Specs must reflect
   only the currently audible (unmuted) stems, updating live as mute/solo state changes. E.g. if
   only the Bass stem is unmuted, the corridor/LOW-MID-HIGH readings show that stem's balance
   alone, not the full mix. This is **not** a static per-stem breakdown list — it's the existing
   whole-mix analysis re-running against whatever subset is currently audible. Fix Queue items
   should be able to point at a specific stem once isolated this way (e.g. "Bass stem +9 dB in Low
   band").
   - **Refinement, 2026-09-07 (Kevin — real architectural gap found in testing):** "reflect
     whatever subset is currently audible" turned out to be incomplete on its own — Kevin: "when
     you drop a solo bass stem into Mix Check, the app compares it against a full-mix corridor
     target — so it screams that your low end is forty one dB over, which is meaningless, because
     of course a bass stem has no highs. The corridor doesn't know it's looking at a stem." Kevin
     offered two options (a stem-specific reference target, or skipping the tonal-balance
     comparison entirely) and chose the SECOND, simpler one: a fabricated "what a solo bass stem
     should look like" target would be just as likely to mislead as the wrong-target comparison it
     replaces. **Fixed** on `docs/mockups/multistem-mixcheck-final.html` (mockup only,
     `index.html` untouched) — reflecting the audible subset honestly now means: when the
     currently-audible set is a single isolated stem out of a MULTI-stem session (solo, or muted
     down to one — `window.__mcSingleStemIsolated()`), the Spectral Balance corridor-deviation
     cards, the raw canvas framing, the corridor-based Fix Queue items, and Hope's own tonal-balance
     context all say the comparison isn't meaningful right now, rather than computing/reciting a
     number regardless. Loudness/true peak/dynamics/correlation remain fully live-reactive and
     valid in every state, isolated or not — only the corridor COMPARISON is suppressed, never the
     whole analysis. The ordinary single-file-loaded case (nothing else ever loaded alongside it)
     is explicitly unaffected — that state IS the full file the corridor was designed to judge. Full
     write-up (exact detection condition, what's suppressed vs. shown, Codex three-touchpoint
     summary): `docs/STATUS.md`.
4. **Hard requirement — Hope must be aware of stem state at all times, not just the finished mix.**
   Once stems ship, extend the existing Hope-awareness context mechanism
   (`buildMixCheckState()` / `buildMixCheckContextBlock()`, line ~8450/~8494 in `index.html` — the
   same pattern used for the Fix Queue live-state feed from the earlier post-ship #3 work) to
   include: which stems are loaded, which are currently muted/soloed, and the live analysis of
   whatever subset is currently audible — fed to Hope on every mute/solo/upload change, the same
   way Fix Queue changes are pushed now. This should not require Hope to ask "which stem is
   playing" or "is this the full mix or just bass" — the same acceptance bar as the earlier
   Hope-awareness restore (never ask, she already knows).
5. **Hard requirement — control/tool-calling, not just awareness.** Kevin's exact words: "able to
   control play and mute and everything else — I want Hope to be able to drive." Hope needs new
   client tools (`TOOL_DEFS` + handlers, same pattern as existing tools like `propose_mix_move` /
   `manage_roadmap_inbox`, see `index.html` ~8297 onward) so she can actually drive the transport
   and stem state via voice/chat, not just read it. At minimum: play/pause/stop transport, seek,
   mute/unmute a named stem, solo a named stem (and un-solo/return to all-unmuted), and any other
   stem-rack control that exists in the UI once built. E.g. Kevin says "solo the bass" or "mute
   everything except vocals" and Hope calls the tool directly rather than talking him through
   clicking it himself.
6. **Hard requirement — demonstrate AND instruct, not just one.** Kevin's exact words:
   "demonstrate and instruct." Hope should be able to both **demonstrate** (actually perform the
   action herself via her tools — e.g. solo the bass stem live so Kevin hears/sees it happen) AND
   **instruct** (walk Kevin through doing it himself manually, e.g. "click the solo button on the
   bass stem row") — not just one or the other. Which mode she uses should fit the moment
   (demonstrate when he wants it done now / instruct when he's asking how something works or wants
   to do it himself), same general instructional-vs-active split Hope already has to make with mix
   moves.
   - **Why this matters (Kevin's framing, not a nice-to-have):** "this is how she is able to help
     and advise — 'let me show you.'" This is core to how Hope is meant to help, not an add-on:
     when she has a suggestion, she should be able to say "let me show you" and then actually
     solo/mute/play the relevant stem herself via her tools, rather than only describing it. A
     future implementer should treat this as central to the advisory interaction model.
7. **Scope extension — basic live EQ, so a demonstrated move can actually be heard.** Kevin's
   reasoning: "this means we need some basic plugins — live EQ." For Hope to actually
   "demonstrate" a fix (requirement 6) rather than only mute/solo/play stems, she needs at least a
   basic live EQ she can apply and adjust in real time on a stem/bus — so a suggested move like
   "cut 3dB at 80Hz on the bass" can be heard live, not just described.
   - **Findings, checked directly against current `main` `index.html` (2026-09-04, so the next
     implementer isn't starting blind):** `docs/HANDOVER.md`'s 2026-06-11 addendum references
     `aimmApplyMixMove` and the `add_plugin_to_bus` / `set_plugin_settings` tool handlers built for
     Mix Move cards — confirmed these still exist and work (`aimmApplyMixMove` at ~line 10551 calls
     `add_plugin_to_bus` at ~line 11797; `add_plugin_to_bus`'s `TOOL_DEFS` entry at ~line 8315).
     **But this plumbing is a symbolic chain-builder list only** — it adds a plugin *name* (from
     Kev's owned-plugin library) and a settings *note* to the Workbench's chain view, for Kevin to
     go apply by hand in his real DAW. There is **no actual real-time audio DSP anywhere in the
     app** — confirmed via `grep` for `BiquadFilterNode`/`createBiquadFilter`, zero matches in
     `index.html`. So a live EQ Hope can apply and actually be *heard* is **new work, not an
     extension of existing plumbing** — it needs a real Web Audio `BiquadFilterNode` chain (start
     simple: a few bands, gain/freq/Q) applied live to a stem or the mix bus, with new tools for
     Hope to create/adjust it, separate from the existing symbolic `add_plugin_to_bus`.

**Cross-reference:** Option B (auto stem-split) and the live-EQ requirement above both likely need
a backend/microservice for anything beyond a toy WASM model — see the ARCH-2 (RoEx-style analysis
microservice) and ARCH-3 (HyFi-style server-side processing) sections of the Platform Evolution
Epic further down this doc; whoever scopes this should read those sections first rather than
re-deriving the same backend-vs-browser tradeoff from scratch.

**Next step:** Jules builds an interactive HTML mockup (stem slots + mute/solo + shared transport,
per requirement 2) pushed to `docs/mockups/` on its own branch per the standing mockup-first
process in `docs/CLAUDE.md` — Kevin reviews live via GitHub Pages, no screenshots, no code merged
until he approves. Not started as of this entry.

## 23. Library reorganization — sub-sections restructure (captured 2026-09-05, LOWER PRIORITY)

**Backlog capture only — not build authorization.** Explicitly deprioritized by Kevin, behind the
Hope-intelligence work (items 24/25 below) — per the competitive-context note above, matching a
competitor's feature layout is not itself the priority.

**Idea:** restructure AIMM's Library tab into sub-sections analogous to a competitor's structure —
a scored history/archive of past analyzed mixes, a Tools section, and a Stems section.

- **Scored history/archive** — ties to AIMM's existing Snapshots concept; needs reconciling with
  Snapshots rather than building a duplicate parallel history feature. Not scoped which one absorbs
  the other.
- **Tools section** — **deferred, new scope.** No processing-tools feature (Voice De-Noise, Audio
  Restoration, Karaoke, A Capella, Delivery Master, etc.) exists anywhere in AIMM today; this would
  be genuinely new engineering, not a UI reorg of something that already exists.
- **Stems** — ties directly to the "Multi-stem Mix Check" item above (this doc, "captured
  2026-09-04") — cross-reference that section, don't duplicate its requirements here.
- **References** — ties to the existing "P-B: A/B Ref tab" section below (this doc) and its
  `B-P2` backlog card — cross-reference, don't duplicate.

**Explicitly LOWER PRIORITY than the Hope-intelligence work in items 24/25 below**, per Kevin.

## 24. Hope DAW-specific instruction quality (captured 2026-09-05)

**Backlog capture only — not build authorization.** Ties to / expands the existing "Hope KB: Logic
Pro & DAW Training tier" item (`docs/STATUS.md` → Hope Knowledge Base — ingestion row; DASHBOARD.html
Now/P2 card).

**Idea:** Hope's mixing advice should name actual Logic Pro UI elements and concrete steps ("open
Channel EQ, click the high-shelf band, drag to 8kHz") rather than generic mixing language — the KB
already has the depth to support this. Confirmed directly (2026-09-05 session): **33 of the 333
ingested KB videos are Logic-Pro-specific** (SEIDS, Sean Divine, Try Karra, Yaahn Hunter Jr
channels — beginner basics, shortcuts, templates, automation, stock-plugin-only mixing/mastering
walkthroughs, vocal chains). The blocker isn't content depth, it's two existing unverified backlog
items:

- **"Smoke test: YouTube KB hits"** (DASHBOARD.html card title; this doc's "In progress" section
  below tracks the same item as "Smoke test: YouTube KB" — same item, shortened name) — never
  confirmed end-to-end that Hope actually cites this material in a live response. **Now elevated
  to P1 as of 2026-09-05** (DASHBOARD.html badge updated accordingly).
- **"YouTube citation links"** (DASHBOARD.html card / `docs/STATUS.md` row) — no clickable URL in
  KB metadata yet. **Now elevated to P1 as of 2026-09-05** (DASHBOARD.html badge updated
  accordingly; `docs/STATUS.md` row updated too).

**Live confirmation, 2026-09-06 (Kevin):** had a live text/voice session asking Hope about gain
staging (both general and Logic-Pro-specific) — her answers were accurate and specifically
grounded ("From the Mastering dot com video on this...", named a concrete −18dBFS/−6dBFS
average-vs-peak split, walked through Logic's Region Gain + VU-meter-plugin workflow). Confirms the
KB-grounding itself works well; the missing piece is exactly the "YouTube citation links" gap above
— she named the source ("the Mastering dot com video") but gave no link Kevin could click through
to actually watch it. Kevin's ask: when she cites specific videos like this, surface one or a
couple of actual clickable links in the transcript ("here's a couple of links you might want for
gain staging") rather than only a spoken/text source name. Not a bug, an enhancement — reinforces
this item's existing P1 elevation rather than adding new scope.

**Both of the above are flagged ELEVATED PRIORITY as of 2026-09-05**, referenced from this item —
they gate whether this DAW-specific-instruction-quality idea is even achievable soon, since neither
has been confirmed working.

## 25. Hope actually driving/controlling Logic Pro (captured 2026-09-05) — research spike RESOLVED, see item 41 for the voice-trigger build

**Backlog capture only — not build authorization. Bigger, unscoped.** Ties to the existing "DAW
Bridge Epic (3 phases)" section below (this doc) and its `B-DAW1` / `B-DAW2` / `B-DAW3` DASHBOARD
backlog cards.

**Idea:** Kevin wants Hope to eventually say "click here in Logic, open that, use this plugin" and
actually walk him through or drive it live.

**Real caveat, logged explicitly so a future implementer doesn't assume a plain engineering
estimate:** Logic Pro does not have a rich public scripting/automation API like some other DAWs.
This needs a **technical research spike first** — what's actually possible via AppleScript hooks,
MIDI/OSC control surfaces, or anything else Logic exposes — **before any build estimate**, not an
estimate assumed straight from B-DAW1/2/3's existing (vaguer) description. This research-spike
requirement has been added to B-DAW1's own description below (this doc, "DAW Bridge Epic") so it
isn't lost the next time someone scopes B-DAW1.

**Spike RESOLVED, 2026-09-27, confirmed working (see `project_aimm_logic_pro_track_colour.md`):**
Logic Pro Creator Studio IS drivable — not via AX mutation (the inspector's colour swatch is a
custom-drawn AppKit control with no AX children), but via opening the real native "Assign Track
Color…" window and computing a synthetic mouse click at a live-read screen coordinate
(`osascript`/System Events). Track rename and track colour are both implemented and live-verified
in `/Users/admin/logic-pro-mcp-creator-v310` (branch `aimm-routing`); bulk bus creation was
underway. The technique generalises to any Logic action reachable through a real, AX-visible
window or menu — not a one-off hack for colour specifically. **Item 41 below is the concrete
voice-activated build on top of this, captured 2026-10-07 — read that before re-scoping this item
from scratch.**

## 26. Mix Check first-run onboarding — pending Kevin's decision (captured 2026-09-05)

**Design work exists — pending Kevin's review + choice, NOT yet approved for build.** Not a
"not started" backlog item; log it as a pending-decision item.

Jules built two mockup versions of an improved empty/first-load state for Mix Check:

- **v1 (lightweight)** — branch `jules-mixcheck-empty-state`. Hope greeting + quick-prompt chips in
  the rail, a slim "① Drop → ② Measure → ③ Ask Hope" strip, cleaner idle Spectral Balance hint.
- **v2 (full first-run guided tour)** — branch `jules-mixcheck-firstrun-tour`. 5 AIMM-specific
  steps, first-run-only with a re-triggerable "?" icon, reference pattern from a competitor
  screenshot.

Kevin has **not yet reviewed/chosen** between them. Note: the **Hope-rail greeting message piece**
specifically (the first element of v1's mockup) is being extracted and built for real **right now**
by Markey, separately from this pending decision — Kevin's call ("there's nothing stopping us, it's
a quick win") — so that piece is NOT "not started"; only the rest of the onboarding-tour direction
(v1 vs v2, quick-prompt chips, the guided tour) is still pending Kevin's review and choice.

The "① Drop → ② Measure → ③ Ask Hope" strip specifically from v1 is tracked separately — see item
27 below — rather than bundled into whichever onboarding direction Kevin eventually picks.

## 27. Mix Check onboarding — "1-2-3 guide" strip (captured 2026-09-05, deferred to a later stage)

**Backlog capture only.** The slim "① Drop → ② Measure → ③ Ask Hope" getting-started strip from
Jules's v1 mockup (see item 26 above). Kevin wants this treated as its **own separate future-stage
item, explicitly deferred** — not bundled into whichever onboarding direction gets picked from item
26. Distinct from the Hope-greeting piece of the same v1 mockup, which is being built now (see item
26) — the 1-2-3 guide specifically is "some other stage."

## 28. Spectral Balance card — revisit (captured 2026-09-05, deprioritized)

**Backlog capture only — vague placeholder, no specifics.** Kevin flagged he wants to come back to
the Audio Specs / Spectral Balance card at some point. No specifics given yet — this is a flagged
area of interest, not a scoped task. Kevin explicitly said Hope's intelligence work (items 24/25
above) matters more right now. Do not invent scope for this item; expand it only when Kevin gives
specifics. **Items 29 and 30 below (captured same day) are the specifics that eventually landed —
cross-reference this item when either is picked up so it isn't scoped a second time from scratch.**

## Note — Mix Check's three loudness/genre-target controls (investigated 2026-09-05)

**Context only, not an action item.** Kevin flagged the Audio Specs card's Classified Genre reading
seemed "stuck on Trap." Investigation (reading the live `index.html` directly, not assuming) found
THREE separate, confusingly-similar controls on the Mix Check tab, only one of which was actually
broken:

1. **Header "Genre" pill (`STATE.genre`)** — works correctly. Drives plugin library top-picks and
   the Classified→Genre display. Kevin's own screenshots confirmed the Genre pill and Classified
   reading both showed "Hip-Hop" consistently — this control is fine.
2. **Header "Target" pill (platform loudness spec — Trap −8 / Spotify −14 / Apple −16 /
   SoundCloud −10 / YouTube −14 / Tidal −14)** — **confirmed broken/dormant.** `refPopulateOzTargets()`
   (`index.html` ~line 16247) hardcodes its pass/fail checks — `li>=-8` for the Trap and SoundCloud
   rows, and a literal `true` for the Spotify and Apple rows regardless of the actual measured
   loudness — instead of reading real analysis output. On top of that, both UI surfaces that would
   ever display this table's result are already dormant in the current R3 layout: the header-pill
   wrapper (`data-dormant="r3-platform-targets"`, `index.html` ~line 2773) and the full legacy
   "Platform Loudness Comparison" table (`data-dormant="mixcheck-r5-legacy"`, `index.html` ~line
   2856, table itself ~line 2924). So this was never just a hardcode bug — the whole feature is
   currently invisible to users regardless of the calculation being wrong. See item 29 below for the
   planned fix (revive + expand + correct the calculation) — this note exists purely so a future
   session doesn't treat the root cause as unexplored territory.
3. **Spectral Balance panel's own "Target" dropdown** (e.g. "Target: auto (workbench genre)") — also
   labelled "Target," which is the source of the original confusion, but this one does work. It
   compares the mix against a synthetic averaged genre-corridor curve (`REF_CORRIDORS`), not a real
   reference track. See item 30 below for the planned upgrade to a real reference-track comparison.

**Do not touch `index.html` to "fix" #2 as a standalone task** — it's folded into item 29's scoped
revival below, which also needs a Jules mockup first per the standing mockup-first process.

## 29. Revive + expand Platform Loudness Comparison table (captured 2026-09-05, awaiting a Jules mockup)

**Trigger:** Kevin referenced [loudnesspenalty.com](https://www.loudnesspenalty.com/) — a well-known
free tool that shows, all at once (not one platform at a time), how much loudness penalty a track
takes on every major streaming platform. Kevin's reaction: "this is more useful" than AIMM's current
single-platform Target picker. This maps almost exactly onto the dormant "Platform Loudness
Comparison" table already sitting in `index.html` (see the note above) — it needs reviving,
expanding, and having its calculation fixed rather than being built from scratch.

**Scope:**
- **Revive** the dormant table — drop the `hidden`/`data-dormant="r3-platform-targets"` wrapper
  (`index.html` ~line 2773) and/or the `data-dormant="mixcheck-r5-legacy"` wrapper containing the
  full "Platform Loudness Comparison" table (~line 2856/2924), whichever Jules's mockup places it
  in — this is a design decision, not a foregone conclusion, since R3's layout has moved on since
  either was last live.
- **Expand the platform list** to match loudnesspenalty.com's fuller set — add Tidal, Amazon,
  Pandora, Deezer alongside the existing Trap/Club, Spotify, YouTube, Apple Music, SoundCloud rows
  (Trap/Club and Tidal loudness targets already exist elsewhere in the app's platform-target data —
  reuse rather than re-deriving).
- **Fix the underlying calculation** — `refPopulateOzTargets()` (`index.html` ~line 16247) currently
  hardcodes `li>=-8` for Trap/SoundCloud and a literal `true` for Spotify/Apple regardless of
  measured loudness. Replace with real pass/fail logic against each platform's actual target, driven
  by the real measured integrated LUFS (`refSpecPoints`/the existing LUFS pipeline), same as the
  rest of the Audio Specs card.
- **UX direction, per Kevin:** show every platform's penalty at once in a single comparison view —
  not a picker that shows one platform at a time. loudnesspenalty.com is the direct visual/UX
  inspiration.

**Process gate — mockup required before any build.** Kevin wants to see a Jules mockup of this
table's layout within the current Mix Check (R3) design before implementation starts, per the
standing mockup-first process (`docs/CLAUDE.md` "Mockup review process"). **Status is "awaiting a
Jules mockup," not "not started"** — the direction and scope above are locked, only the visual
layout is open.

**Priority, per Kevin's explicit instruction:** queued behind Hope's intelligence work (items 24/25)
— build after, not before or instead of.

## 30. Real A/B reference-track comparison for Spectral Balance (captured 2026-09-05)

**Reinforces and updates the existing "P-B: A/B Ref tab" section below (this doc, under "Planned —
Session 6 priorities") and its matching DASHBOARD.html card "B-P2. Build A/B Reference tab" — this
is new direction for that same backlog item, not a duplicate.**

**Trigger:** Kevin referenced iZotope's own guidance on [mixing with reference
tracks](https://www.izotope.com/community/blog/mixing-reference-tracks), which confirms the
professional standard for tonal-balance comparison is uploading a real commercial reference track
and comparing a mix's actual measured spectral/loudness/stereo characteristics against that specific
track's actual measured characteristics — not a synthetic genre-average curve. This directly
validates the never-built P-B item, and specifically supersedes/updates the Spectral Balance panel's
current "Target: auto (workbench genre)" dropdown (see the note above, control #3) which only offers
a synthetic `REF_CORRIDORS` comparison today.

**Direction, per Kevin's explicit decision:** build P-B as a real reference-track A/B comparison —
let Kevin upload an actual reference track (WAV/high-quality MP3) and compare the mix's real
measured spectral/loudness/stereo characteristics against that track's real measured
characteristics, replacing or supplementing the current synthetic-corridor-only comparison. P-B's
existing spec below (two drop zones, overlaid spectral canvas, side-by-side delta meters, Hope
commentary, shared Web Audio pipeline) already describes this shape — this item's job is to fold in
the specific "real track, not synthetic corridor" validation and keep the two records from drifting
apart, not to re-scope P-B from zero.

**Priority, per Kevin's explicit instruction:** queued behind Hope's intelligence work (items 24/25)
— build after, not before or instead of. P-B's own spec still notes "Spec + mockup needed from Seat
A before any code" — that gate still applies.

## 31. Frequency-range solo / ear-training mode for Mix Check (captured 2026-09-06)

**Backlog capture only — not build authorization.** Kevin explicitly called this "a must-have
feature for stems."

**Numbering note:** this doc's own "Multi-stem Mix Check" section (above, "captured 2026-09-04")
has no numeric prefix, but `DASHBOARD.html` labels the same item **Backlog 22** — that mismatch
pre-dates this capture (confirmed by re-checking both files directly rather than assuming). This
item cross-references that section by its actual heading, and by "Backlog 22" where DASHBOARD.html
is the reference.

**Trigger:** Kevin referenced [Carve Audio's "Mixing Cheat
Sheet"](https://www.audioloom.com/carve-audio/mixing-cheat-sheet), a free plugin. Its core
mechanic: instead of only showing a visual frequency chart, it lets you **solo a specific frequency
range** so you actually hear what problem terms like "mud," "fizz," "presence," "air," "boxy,"
"harsh," "sibilant," "boomy," "thin," "nasal," "hissy" sound like in context, plus per-instrument
EQ/compression guidance. **This is the direct inspiration for the solo-to-hear mechanic — not
something to copy exactly.** Carve's plugin is a static per-instrument reference tool; AIMM's
version should be live/measured against the actual loaded audio (or, once stems exist, a specific
stem), not a generic cheat sheet.

**Kevin's exact framing for why this matters:** "the more Hope can point us to the issue, muddy,
boxed, hissy etc the better she can help to really improve a mix." This is not a generic
frequency-solo feature for its own sake — it's specifically about giving Hope real diagnostic
vocabulary backed by an actual audible demonstration, not just a dB-delta number.

**Scope:**
- **Core mechanic** — let the user (or Hope, once her control-tools item is built, see the
  "Multi-stem Mix Check" section's requirement 5) solo/isolate a specific frequency range of the
  loaded audio so it's audible in isolation, not just shown as a number/chart. Once stems exist
  (see cross-reference below), extend this to a specific stem's frequency range.
- **Vocabulary layer** — map frequency ranges + measured characteristics to named mix problems, so
  Hope can name the actual problem in plain language AND let the user hear it, not just report a
  delta number. Starting map (refine at build time against real measured data, not fixed exactly as
  below):
  - **Muddy** — low-mid buildup, ~200–500Hz
  - **Boxy** — ~300–600Hz resonance
  - **Harsh** — ~2–4kHz excess
  - **Sibilant** — ~5–8kHz excess in vocals
  - **Boomy** — sub/low buildup
  - **Thin** — lack of low-mid body
  - **Nasal** — ~800Hz–1.5kHz buildup
  - **Hissy** — high-frequency noise floor

**Explicit cross-references — this is dependent on/extends other backlog items, not a standalone
precursor:**
- **Direct extension of the "Multi-stem Mix Check" item** (this doc, captured 2026-09-04 /
  `DASHBOARD.html` Backlog 22). Once stems exist, this becomes per-stem — solo just the vocal
  stem's harsh 3–5kHz range, or just the bass stem's boxy low-mids — much more useful than soloing
  a frequency range across the full mix.
- **This is what item 22's requirement 6 ("demonstrate AND instruct" — Hope's "let me show you"
  capability) would actually demonstrate.** Requirement 6 is the general instructional/active
  mechanism; this item is the concrete diagnostic capability that mechanism would exercise for
  frequency-problem coaching.
- **Related DSP work to item 22's requirement 7** (basic live EQ, so a demonstrated move can
  actually be heard) — soloing a frequency band and applying an EQ move to it are closely related
  Web Audio work (a `BiquadFilterNode` filter chain). A future implementer scoping either should
  read both requirements together rather than building two separate filter chains.

**Priority, per Kevin's explicit instruction:** **not** prioritized ahead of Hope's core
intelligence build items (24/25) or the multi-stem item (22 / "Multi-stem Mix Check" above) — this
capability makes the most sense to build as an extension of those once they exist. Sequence
accordingly: 24/25 → 22 → this item, not the reverse.

**Forward cross-reference:** item 32 below (Glossary/Reference tab, captured same day) is the
broader vocabulary layer this item's term-to-frequency map lives inside — this map is that
glossary's audio-diagnostic subset, not a separate vocabulary to maintain twice. A future
implementer should read item 32 before finalizing this map so the two don't drift apart.

## 32. Glossary/Reference tab — mixing-terms glossary, for Kevin and Hope both (captured 2026-09-06)

**Backlog capture only — not build authorization.**

**Trigger:** Kevin referenced iZotope's own [glossary of common and confusing mixing
terms](https://www.izotope.com/community/blog/a-glossary-of-common-and-confusing-mixing-terms) as
scope/structure inspiration — **do not reproduce that article's text verbatim** anywhere in this
item or eventually in the app; it's a reference for shape and coverage, AIMM needs its own written
glossary content, not a copy. Checked directly (WebFetch, 2026-09-06, not taken on faith): the page
splits into a "confusing terms" section (roughly 30 entries — e.g. Air, Bloom, Muddy) and a "common
terms" section (roughly 50 entries — e.g. Automation, De-essing, Headroom), each with a short
1–3-sentence practical definition. Treat the exact split/count as approximate scope reference
(~80–110 terms total), not a number to hit precisely.

**Nav placement, per Kevin's framing:** this can take the nav slot freed up when the Conversation
tab was retired (see the Hope history-key-bump work, this doc/`docs/STATUS.md`, 2026-09-05) — not
literally reviving Conversation, just filling that gap in the tab strip with something useful
instead, since the tab strip already redistributed its width when Conversation was removed.

**Scope — two parts:**
1. **A visible Glossary/Reference tab Kevin can browse himself** — a curated glossary of mixing
   terms (~100+ scope, similar structure to the iZotope reference: term + practical definition,
   organized/searchable).
2. **Hope must be able to draw on the same glossary when she uses a term in conversation.**
   Kevin's exact words: "Hope can use this when explaining e.g. muddy." When she says a mix sounds
   "muddy," she should ground that in an actual definition (build-up of low-mid frequencies
   reducing clarity), not just use the word loosely.

**Explicit cross-reference — do not duplicate the term-to-frequency mapping in two places.** Item
31 above (Frequency-range solo / ear-training mode) already defines a term-to-frequency vocabulary
map for exactly this purpose — see item 31's "Vocabulary layer" bullet for the actual term list and
frequency ranges, not repeated here. That mapping IS the audio-diagnostic subset of this glossary's
content, not a separate thing to re-derive. A future implementer should treat item 31's map as the
seed for this glossary's audio-diagnostic terms, and this glossary as the broader vocabulary layer
(including non-diagnostic terms like Automation, Headroom, Sidechain, Transients) that item 31's
terms live inside.

**Implementation consideration, not a decision to make now:** Hope's side of this could likely
reuse whatever mechanism Markey is building for the YouTube KB search (`read_yt_knowledge`,
`docs/CLAUDE.md`/item 24 above) — a compact, always-loadable reference set. ~110 short terms is far
smaller than the video KB, so this might not even need search — could just be a compact digest
always in her context, similar in spirit to `buildProfileDigest()`/`buildLibraryDigest()`. Flagged
for whoever scopes this to evaluate, not decided here.

**Priority, per Kevin's explicit instruction:** backlog capture only, sequenced sensibly relative
to the other Hope-intelligence and multi-stem work already logged — not prioritized ahead of items
24/25 (Hope's core intelligence build) or item 22 (Multi-stem Mix Check). Read alongside item 31,
which this item's glossary content directly feeds.

## ✅ 33. Fix Queue "Analysing…" stuck-placeholder safety net SHIPPED — branch `cat-fixqueue-stuck-placeholder-safety-net` (2026-09-06, build 2026-09-06.4), awaiting merge

**Trigger:** Kevin's live screenshot repro — the "Up Next" card's "Recommended move" field stayed
stuck on the neutral `MOVE_PENDING` placeholder ("Analysing — pulling the specific move from the
reference library…") forever, even in a session where Hope had ALREADY given him the full,
specific move verbally in the chat/voice transcript (via her own separate `propose_mix_move`
tool path).

**Confirmed root cause:** two independent systems that don't talk to each other. (1) Hope's
spoken/typed answers come from her live ElevenLabs conversation + knowledge digest — working
correctly. (2) The Fix Queue card's own "Recommended move" text is populated by a SEPARATE,
silent background call to Anthropic's API using Kevin's own key (`MC_FIXMOVES.generate()`,
`index.html`). That function's early-return guard (`if (!key || !list || !list.length)`, fired
whenever no Anthropic key is configured or nothing's queued yet) returned immediately WITHOUT
ever assigning the honest fallback text that the function's own `finally` block already used for
a failed/unparseable API call — so `movesById` stayed empty and the card patched with nothing,
permanently, with no retry mechanism anywhere.

**Fix shipped:** the early-return branch now applies the same honest fallback string already used
elsewhere in this function ("Ask Hope to talk through the move — she has it grounded in your
reference library.") before returning, so the card can never get stuck on the neutral placeholder
forever regardless of Anthropic-key state, network failure, or parse failure.

**The second, real gap Kevin pointed at — investigated, NOT force-fixed:** even when Hope has
already given the answer live, the on-screen card still doesn't reflect it, because
`propose_mix_move` (Hope's tool, takes `bus`: master/vocal/808/drums/fx) and the Fix Queue's items
(built in `MC_FIXQUEUE.build()`, keyed by `key`: clips/crushed/mono/quiet/muddy/808/harsh/band-*
and `focusBand`: low/lowmid/mid/high/broadband, displayed as `#01`/`#02`…) use two entirely
different taxonomies with no natural 1:1 mapping — `propose_mix_move` has no `fix_id` argument at
all (unlike `mark_fix_applied`, which does). Forcing a guess-based match risked silently
misattributing a move to the wrong card. **Flagged as a follow-up UX/product decision for Kevin:**
should `propose_mix_move` gain an optional `fix_id` argument so Hope can explicitly say which Fix
Queue card a move belongs to? That's a voice-prompt/tool-definition change spanning Markey's
territory (`RT_INSTRUCTIONS`/`TOOL_DEFS`), not something to guess at silently. Not built this
round.

**Verification:** Codex three-touchpoint review (TP1 plan / TP2 diff / TP3 end-to-end) all clean.
Pushed to `cat-fixqueue-stuck-placeholder-safety-net` off `main` @ `2c98bfd` — not merged, awaiting
Kevin/coordinating session. Per Kevin's 2026-09-06 explicit priority reorder (see `docs/STATUS.md`
top entry), this item drops to low priority relative to Backlog 22 once merged — it's a real
confirmed bug fix, just no longer urgent.

## 34. AIMM stem separation — cloud backend + RunPod serverless Demucs worker — APPROVED, Kevin committed to build (decided 2026-09-21)

**STATUS: APPROVED.** Kevin decided 2026-09-21: "we will implement this." This is no longer a
proposal under consideration — it is committed to build. This status change is docs-only; nothing
has been built or spent yet. **Priority position unchanged** — still behind the Hope-intelligence
backlog (items 24/25) in the queue; not reprioritized to jump ahead unless Kevin explicitly says so.
**Next step: implementation via Codex as lead implementer, Cat reviews, per standing process — not
started this pass.**

**Historical capture note (2026-09-20), kept for history not deleted:** originally logged as a
parked Runpod-GPU-credit idea — backlog capture only, not build authorization at the time. Nothing
has been created on Runpod; no pod, endpoint or volume exists for this item as of this update.

**Fact, per Kevin's own note (not re-verified live by this capture):** Kevin has Runpod credit worth
about 13 hours on an RTX 4090 at $0.74/hr (roughly $9.60 nominal, my arithmetic). The credit sits on
**Kevin's Runpod account, not on this repo**, so any of his projects can draw on it.

**Candidate aimm uses — candidates only, not plans.** The repo was not inspected for GPU-bound tasks
when this was captured. Two ideas that would be slow on Kevin's RTX 3070 but fast on a rented GPU:
- **Stem separation** (e.g. Demucs) — possible link to Backlog 22 (Multi-stem Mix Check), my inference, unchecked.
- **Heavier audio analysis** — possible link to the Platform Evolution Epic's ARCH-2 analysis work, my inference, unchecked.

**Caution — data boundary:** a rented GPU is third-party hosting outside Kevin's controlled setup. **Never
send Oxford or work-related audio or documents to it.** Hope in AI and personal projects only.

**Recommendation:** do not spend the credit just to use it up. Only if a real slow or GPU-bound job
actually appears, and **state the pod's hourly cost before creating anything.**

**Research brief:** `docs/RUNPOD-GPU-RESEARCH-BRIEF.md` (added 2026-09-20 for a fresh session; research
only, no spend).

**2026-09-21 update (Cat) — stem-separation feasibility, findings appended to the brief.** Confirmed:
stem separation is NOT built (it's Backlog 22's deferred "Option B"); AIMM's only backend today is the
`aimm-proxy` key-relay Worker, no storage/auth/job-queue (verified against `index.html` directly), so
ARCH-1 is still unbuilt; Demucs is the practical model; a Runpod serverless endpoint is a good fit for
the compute step but does not remove the ARCH-1 gap. Two proposals logged for Kevin's decision:
(A) an outside-the-app Demucs workaround feeding the already-live Option A upload, vs. (B) the real
in-product Option B (multi-day ARCH-1 + ARCH-2/3-shaped build). **Superseded same day, see below** —
Kevin clarified AIMM is intended to be monetized, so a workaround tied to Kevin's own hardware doesn't
qualify as a real answer.

**2026-09-21 update, later same day (Cat) — REVISED: monetization rules out the local-GPU workaround.**
Kevin's clarification: stem separation must work for any user on any computer via the app itself, not
depend on Kevin's local hardware or any user's GPU. This retires proposal A above entirely (kept for
history, not deleted) — **proposal B is now the only candidate**, and this pass works it out in real
architectural detail instead of a one-line sketch. Live GPU pricing pulled by the coordinator
(`list-gpu-types`, serverless, secure): **RTX 4090 serverless $1.10/hr** (HIGH availability, 10 DCs) or
**RTX A5000 serverless $0.69/hr** (also HIGH availability) — both ample VRAM (24GB) for Demucs; serverless
(per-second billing), not a rented pod, is the right product type for AIMM's bursty per-user usage.
At ~1 min inference/song: **≈$0.018/song on the 4090, ≈$0.011/song on the A5000** — compute spend is not
the blocker at scale. Minimal backend needed (an ARCH-1-equivalent slice, not the full Epic): auth/user
identity, an R2 presigned-upload path for the input WAV, a job-trigger + tracking record (Worker → RunPod
`/run` → D1/KV job row), a result-delivery path (worker pushes output stems straight to R2, avoiding a
large payload round-trip), a storage retention policy, and — the actual monetization hook — a usage
ledger (per-user, per-job) built in from day one so a future quota/paywall is a policy change, not a
rebuild. RunPod serverless worker: a Demucs Docker image with a standard `handler(event)` — check the
RunPod Hub first for an existing maintained Demucs worker before building a custom image. Full detail,
pricing table, and the cost/monetization breakdown: `docs/RUNPOD-GPU-RESEARCH-BRIEF.md`.

**Next action — APPROVED 2026-09-21, Kevin: "we will implement this."** This ARCH-1-slice +
RunPod-Demucs build is committed; queue position unchanged (Hope-intelligence work still sits ahead
of it). Implementation goes through Codex as lead implementer next (Cat reviews), per standing
process — not started this pass, docs-only update. Open live-tool-access questions to resolve
before/during that build: does a maintained Demucs worker already exist on the RunPod Hub, does the
account's endpoint config support completion webhooks, and the exact model-caching setup for htdemucs
weights.

**Picked up 2026-10-08 (Jacob), model-licensing decision made, real build started.** Checked the
RunPod Hub directly — **no official/maintained Demucs template exists there.** Found one small
community repo (`dwin-gharibi/runpod-demucs`, 0 stars, 7 commits, unlicensed handler code) usable
only as a reference, not something to deploy as-is. Separately surfaced a real licensing fact before
picking a model: Demucs' best-quality variant (`htdemucs`, Hybrid Transformer Demucs) is
**CC-BY-NC — non-commercial only**; `mdx_extra`/`hdemucs_mmi` are MIT (commercial-safe) but lower
quality. **Kevin's explicit decision, 2026-10-08: use `htdemucs` now** — AIMM is not yet monetized,
so CC-BY-NC is fine today. **This is a real, dated constraint, not a detail to lose: the model
MUST be swapped to an MIT-licensed variant (or a commercial Demucs license obtained) before AIMM is
actually monetized** — flag this explicitly whenever monetization work starts, don't let it ship
commercially on a non-commercial model by oversight.

RunPod API key created by Kevin (RunPod dashboard → API Keys → "AIMM Demucs", full access) and
stored in 1Password (Personal vault, item `RunPod API Key`, API Credential, `credential` field) —
never pasted into chat, read via `op read "op://Personal/RunPod API Key/credential"` when needed.
No Docker installed locally on Kevin's Mac — building the worker image via a GitHub Actions
workflow (push Dockerfile + handler → Actions builds + pushes to GHCR) instead of a local `docker
build`, so no new local tooling install is needed.

**Real end-to-end proof-of-path built, then the whole approach reframed — same session,
2026-10-08.** Worker repo `begb0037admin/aimm-demucs-worker` built (handler + Dockerfile + GHCR CI,
Codex-reviewed and fixed at every step per the mandatory implementation process), image deployed to
a real RunPod Serverless endpoint, two real bugs found and fixed via actual live test runs (Cloudflare
WAF banning `urllib`'s default User-Agent; job run/status calls hitting the wrong API host —
`api.runpod.ai/v2`, not `rest.runpod.io/v1`, which only handles template/endpoint management). Kevin
then pushed back on the cold-start wait this architecture inherently has (RunPod spinning a GPU
worker from zero + pulling a multi-GB image) — research confirmed this isn't a fixable bug, it's a
real tradeoff: truly-instant stem tools (LALAL.AI's fast mode) run entirely on-device, and the
directly-comparable cloud tool (Moises) itself averages ~75s/song, cloud processing time being real
regardless of cold starts.

**Reframe (Kevin, 2026-10-08) — the deeper insight: for Kevin's own use, stem SEPARATION technology
(Demucs/RunPod, and Logic Pro's built-in Stem Splitter) solves a problem he doesn't have.** Demucs-
style separation exists to pull apart an already-mixed-down single file. Kevin works inside his own
Logic Pro sessions — the bass, drums, vocal tracks etc. are ALREADY separate real audio, not
something that needs AI separation at all. **The actual need is simpler and higher-fidelity:
export the tracks that already exist and get them into AIMM without a manual step** — not run a
separation model on a bounced mixdown.

**Revised plan, replaces the RunPod/Stem-Splitter path for Kevin's own workflow:**
1. Automate Logic Pro's **File → Export → All Tracks as Audio Files** (or per-track Bounce in
   Place) — a long-standing standard Logic command, likely simpler to automate than the newer Stem
   Splitter feature, and the result is Kevin's actual mixed tracks, not an AI's guess at separating
   them. Reuses item 41's proven AX-window + computed-click technique; cross-reference that item
   rather than re-deriving the automation approach here.
2. Land the exported files in AIMM automatically via a **File System Access API folder grant**
   (Chrome-only, persists after one one-time grant — the single unavoidable manual step, same
   category as a one-time OAuth "Allow" click) — AIMM watches a folder Logic's export writes into,
   no drag-and-drop ever needed again after that one grant. This is the missing half of item 22
   (Multi-stem Mix Check), which is still mockup-only.
3. **Analysis and the actual Hope conversation stay in the AIMM web app — no Logic Pro plugin.**
   Considered and explicitly rejected (Kevin, 2026-10-08): building a second "Hope" inside a Logic
   plugin (AU/JUCE, a completely different tech stack) would duplicate the analysis engine (Audio
   Specs, Spectral Balance, Fix Queue) that already exists in AIMM and is the explicit product
   differentiator (see the "Hope actually being intelligent" vision note earlier in this doc). Logic
   is just the background export engine Hope reaches for; the "let me show you" conversation stays
   exactly where it is today.

**RunPod/Demucs work is NOT deleted — stays parked for a genuinely different, narrower future
case:** someone hands AIMM a single already-mixed file with no multitrack session at all (no Logic
project, just a bounced WAV) — that's the one scenario real separation technology is still needed
for, and it's the monetizable-product case per [[feedback_keep_monetization_pivot_cheap]]. Template
+ endpoint still exist on RunPod (idle, zero cost); repo `begb0037admin/aimm-demucs-worker` stays as
the real, working, Codex-reviewed starting point for whenever that case is actually built.

**Next step:** research spike into Logic Pro's "Export All Tracks as Audio Files" command — where
it lives in the menu, whether it's AX-accessible or needs the synthetic-click approach, what the
real invocation/wait/completion flow looks like. Not yet started.

**Context only, other repos — not aimm scope, not acted on:** `ai-news-channel` upscaling/restoration
of Flow footage (Hope's visuals are Codex-exclusive, so that would have to route through Codex), and
Markey's voice repos (larger speech models such as Whisper large-v3, or private TTS experiments).

## 35. Hope's KB search misses content when the question's wording doesn't match the transcript's vocabulary — ✅ SHIPPED, LIVE, VERIFIED (captured 2026-10-03, closed 2026-10-04) · owner: Markey + Adam

**Both sides are live, backfilled, and independently verified against the real deployed apps.** Full
architecture: voyage-context-3 embeddings → Cloudflare Vectorize → hybrid with existing BM25 via
Reciprocal Rank Fusion → Cohere Rerank 3.5. Brief: `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`.

**Linda (hr-fa-knowledge-base):** deployed to `hr-kb-ai.kevinlelitte.workers.dev`. Backfill: 6,678
documents, 23,298 vectors, **0 failures** (after fixing one real duplicate-document-key bug found live —
see Incident Log below). Verified directly via the real `/semantic-search` endpoint: the target
"Registering a New Radiation Worker" document returns as the #1 hit for its own title (score 0.63). The
full chat-UI test is still Kevin's to confirm himself (browser automation had trouble with Linda's specific
composer widget) — not a sign of a problem with the fix, just an untested surface.

**Hope (aimm):** PR #26 reviewed and merged by Kevin directly in conversation ("yes please go ahead and
merge and run the test"), deployed to `aimm-proxy.kevinlelitte.workers.dev`. Backfill: 608 videos, 3,191
chunks, **0 failures** on the final clean run (after fixing a real Vectorize ID-length bug found mid-run —
see Incident Log below). **Live-verified with 5 real chat tests, all grounded, zero fabrication:**

1. Teezio's clap EQ (357/1,100/5,900 Hz cuts + Spectre air) — exact quote, correct source
2. Teezio sibilance vs. Stuart White mic chain (compound question) — Teezio's half fully grounded;
   Stuart White's half correctly declined with a disclosed, accurate web-search fallback (Telefunken 251,
   Avalon 737, Tube-Tech CL 1B — verified against the same facts independently) rather than fabricating,
   when the KB search came up short on that exact generic phrasing
3. Jaycen Joshua's 808 sidechain setup (duplicated-kick trigger into Soothe2) — exact quote, correct source
4. Leslie Brathwaite's kick-vs-808 decision on "Care" — search correctly dug past a shallower transcript
   part to find the right one (Part 3), exact quote, correct source
5. Teezio's de-essing load-sharing philosophy — correctly reused the answer already established earlier
   in the same conversation instead of re-searching needlessly, same real quote, no wasted tool calls

Full question/answer text for all 5 tests is in this session's transcript; not duplicated here to keep
this entry readable. The pattern across all 5: real citations, real quotes, correct multi-hop search→read
behavior when needed, honest fallback instead of invention when search genuinely comes up short.

**Incident log — two real bugs found live, both fixed, both verified fixed:**
- **Linda:** `kb.json` has one genuine duplicate document (the same archived guide scraped twice under
  different topic passes, byte-identical content). The backfill script correctly raised rather than
  silently corrupting data. Fixed by skipping the duplicate during embedding — NOT by editing `kb.json`
  itself, since `kb-index.json` references documents by positional array index and deleting an entry
  would have silently shifted every later index.
- **Hope:** Vectorize vector IDs were a raw, unbounded `${videoId}::${chunk}` string, which exceeded
  Cloudflare's 64-byte ID limit for long MWTM slugs (producer-artist-song-partNN titles) — 3+ videos
  failed with `VECTOR_UPSERT_ERROR 40008` at 477/608 into the first backfill attempt. Fixed (commit
  `7f3775f`) with a short FNV-1a hash + truncated readable prefix + chunk number; `metadata.video_id`
  stays the full, unhashed source of truth for display, so nothing downstream changed. The Vectorize
  index was deleted and recreated clean before the final backfill run, so none of the content upserted
  under the old, broken ID scheme survived as orphaned duplicates.
- A separate browser-automation quirk (not an app bug) caused one round of live testing to silently fail
  — the `computer` tool's type/click actions weren't registering keystrokes into Hope's composer textarea.
  Confirmed via direct DOM inspection (the real input's `.value` stayed empty after "typing"). Dispatching
  the message via a direct JS `value` + `input` event + `.click()` on the real elements worked immediately
  and is the reliable method going forward for automated testing of this composer.

**Standing delegation note:** the PR #26 merge and "go ahead" were Kevin's own explicit calls in
conversation, made after reviewing a file-by-file diff summary (not the raw diff). Both bug fixes above
were narrow, clearly-justified technical corrections made under his standing overnight delegation
("accept and approve anything on my behalf... I will not be available to authorise 1Password prompts or
anything else") while he was asleep — recorded as delegated, not as if he personally reviewed either diff
line-by-line, since he hadn't at the time. He has since reviewed and confirmed the live test results
himself the next morning ("this is great").

**Overnight Cloudflare-access outage, for the record:** the 1Password↔Cloudflare-API-token bridge went
unresponsive right as Kevin went to sleep ("authorization timeout", confirmed genuinely down via multiple
isolated checks, not a chaining artifact — very likely his Mac's screen-lock blocking 1Password's
desktop-app bridge). Per his standing zero-manual-steps rule and explicit instruction against repeated
cycling, this was tried a reasonable number of times, confirmed real, then the work was paused and clearly
documented rather than hammered. It recovered on its own by morning and the remaining work (clean
reindex, deploy, backfill, live verification) completed immediately once it did.

**Remaining open items, not blocking, Kevin's call on priority:**
1. Linda's full chat-UI test, by Kevin's own hand, to close out the one surface browser automation
   couldn't reliably exercise.
2. The generic-phrasing gap (test 2 above) — the KB search still occasionally misses on very vague
   wording even when the content exists and ranks well for better-targeted queries. Not a regression,
   not fabrication (correct, disclosed fallback every time it's been seen) — a real, smaller follow-up
   on retrieval precision for a future session, not urgent.
3. `read_yt_knowledge`'s open design question (still literal substring-match) — now that semantic search
   can surface a video via paraphrase alone with no shared wording, should the read-deeper step also move
   off substring-matching? Flagged by Markey, not yet decided.

**Earlier blockers, since resolved:** Voyage AI and Cohere accounts were both created by Kevin directly in
conversation (billing added to each after hitting real rate-limit/propagation issues — Voyage's 200M free
token grant meant the actual backfill cost was effectively $0 regardless). `gh auth refresh -h github.com
-s workflow` for Linda's backfill GitHub Action was flagged as needed but turned out unnecessary — the
backfill ran via a temporary local clone instead of through GitHub Actions, sidestepping that blocker
rather than fixing it.

**Status: DECIDED, implementation dispatched 2026-10-03.** Full architecture brief, research trail, and
per-project implementation requirements: `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`. Short version:
**voyage-context-3 embeddings → Cloudflare Vectorize → hybrid with the existing BM25 via Reciprocal Rank
Fusion → Cohere Rerank 3.5.** Properly researched per Kevin's explicit directive — "I need the absolute
best fix, I don't care if it's going to cost me... I need robust options, no quick fix or cheaper
bandaids" — not a quick prompt patch. Same architecture applies to Linda (hr-fa-knowledge-base), who
has the identical underlying limitation (see below) — Markey builds Hope's side, Adam builds Linda's,
each against their own repo, both dispatched 2026-10-03.

**Original find (kept for history).** Found live-testing the two fixes shipped overnight
2026-10-02→03 (commits `5d76abb`, `d0a4cc8` — typed-chat KB-tool parity + anti-fabrication rule, then
compound/comparison-question decomposition into per-subject searches). Both of those fixes are
confirmed working live, no regression here — this is a separate, deeper, pre-existing limitation they
surfaced rather than caused.

**The bug:** `search_yt_knowledge`/`read_yt_knowledge` use a client-side BM25-style keyword match
(`kbSearchTok`/`kbSearchRetrieve` in `index.html`) against `docs/knowledge/kb-search-index.json`. When
a natural question's wording doesn't share vocabulary with the transcript's own wording, real,
already-ingested content can go completely unfound — not an honest "doesn't exist" case, a genuine
retrieval miss.

**Proven directly (not inferred):** asking Hope to compare Teezio's J. Cole sibilance work against
Stuart White's mic chain on Beyoncé's "Yoncé." The Stuart White content is real and already in the
KB (`docs/knowledge/mwtm-stuart-white-beyonce-yonce-p03.md` — Elam 251 mic w/ AC701 tube, Avalon 737
mic pre, Tube-Tech compressor, "warm" saturation setting). Hope ran 3 separate, properly-targeted
searches for it (the new decomposition fix working as intended) and still came back empty — correctly
declining to fabricate rather than inventing a gear list. Replicating the real scoring logic in Python
confirmed why: a query using natural phrasing ("mic chain", "recording") doesn't rank the right chunk;
the same query using the transcript's own gear-name vocabulary ("Elam 251 Avalon 737 Tube-Tech
compressor warm setting") ranks it correctly. Pure keyword search has no way to bridge that gap.

**Why PRIORITY, per Kevin (2026-10-03):** after reviewing the live test result himself, Kevin called
this the bigger issue of the two found that night. The anti-fabrication rule is working — but it
means a retrieval miss now LOOKS like an honest "not covered," which could quietly mask real content
gaps across the whole MWTM corpus (145 parts, 576 chunks) indefinitely unless the search itself gets
smarter. Flagged by Markey in the `af1bd1726f24befd4` hand-back as a reusable lesson: "a working
anti-fabrication rule will mask [a retrieval bug] as an honest 'I don't know' instead of exposing it."

**Measured scale (2026-10-03) — this is not a one-off edge case.** Using each video's own title as
the search query (the most natural available proxy for "would a user's question about this video find
it at all"), and checking whether its own chunks appear in the GLOBAL top-10 results:

| | MWTM (new, 2026-10-02 ingestion) | Pre-existing YouTube KB |
|---|---|---|
| Videos totally invisible to their own title search (0 chunks in top-10) | **56.6%** (82/145) | **47.5%** (220/463) |
| Deep content (chunk 2+) unreachable via the title | **86.5%** (373/431) | **92.2%** (1,984/2,152) |

This is NOT an MWTM-ingestion problem — the pre-existing, already-live YouTube KB has the same (or
worse) rate. This is a systemic limitation of the keyword-match search across the whole 608-video,
3,191-chunk library, present since before this week's ingestion, that went unnoticed precisely because
a working anti-fabrication rule makes a retrieval miss look identical to an honest "not covered." One
honest caveat on methodology: bare titles are a worst-case proxy — real conversational questions are
usually more detailed than a title, so the true miss rate on everyday questions is likely somewhat
better than these numbers — but the scale is consistent across old and new content alike, not a
small-sample fluke.

**Kevin's reaction (2026-10-03), directly:** "this is worrying and went unnoticed." Work on this started
same day — first step is investigating whether Linda's (hr-fa-knowledge-base) larger, reportedly-working
search setup has a reusable approach, before deciding whether AIMM needs something new.

**Adam's investigation (2026-10-03) — ANSWERED: Linda has the exact same limitation, nothing to reuse.**
Dispatched read-only, verified directly against the live code (not memory files) via the GitHub API:
Linda's `index.html` (`hr-fa-knowledge-base`) runs the identical family of search — client-side
TF-IDF/BM25-style keyword match (`retrieve()`, explicitly commented `BM25-style`), no embeddings, no
vector DB, nothing semantic anywhere (grepped both `index.html` and the 305-line `worker/worker.js` for
embed/vector/pinecone/weaviate/qdrant — zero matches, independently re-confirmed by Jacob). Her "larger
database" (6,680 docs, 23,345 chunks, ~33MB, confirmed via git blob API) is just more raw corpus, not
better technology. Adam replicated her real `retrieve()` logic in Python against the real data files
and ran the same style of test used on Hope: her own title-search blind-spot rate is **27.9%** (lower
than Hope's 47.5–56.6%, but Adam attributes this to a denser/more repetitive HR-jargon vocabulary
domain masking the same flaw, not a better algorithm — a direct vocabulary-gap test on a real document
("Registering a New Radiation Worker") returned **zero relevant hits** for natural phrasing, exactly
like the Elam-251/Avalon-737 case on Hope). **Conclusion: option (c) — AIMM genuinely needs something
new; so, less urgently, does Linda.** Full write-up: `begb0037admin/adam/memory/linda-search-mechanism-same-blind-spot.md`,
cross-cutting lesson logged at `begb0037admin/agent-commons/memory/candidate_linda_bm25_same_blind_spot_as_hope.md`.

**Candidate directions, now ranked by Adam (not yet chosen — Kevin's decision next):**
1. **Real embedding-based semantic search** (highest leverage) — precompute chunk embeddings at ingest
   time (static JSON vector array alongside existing chunk text), embed the user's query at search time
   via the same API, rank by cosine similarity. AIMM's existing `aimm-proxy` Cloudflare Worker is already
   the right shape to add this as a second key-relay route. Small per-query cost (fractions of a cent).
   This is the most direct fix for the exact gap measured (semantic similarity vs. raw token overlap).
2. **A hosted vector DB** (e.g. Cloudflare Vectorize, pairs naturally with the existing Worker) — same
   idea with ANN infrastructure instead of brute-force client-side cosine similarity; worth it once chunk
   counts get large enough that client-side scoring gets slow — not obviously necessary yet at AIMM's
   current scale (3,191 chunks).
3. **Lower-effort interim stopgap, not a full fix:** chunk/metadata term boosting or a small fixed
   domain-synonym table for query expansion — cheaper to build, reduces but doesn't eliminate the gap.

**Not a quick prompt fix — needs real scoping.** Markey's full write-up on the original compound-question
fix: `begb0037admin/markey/memory/aimm-hope-compound-comparison-kb-search-2026-10-03.md`.

**Next action:** DECIDED 2026-10-03 — see the top of this item + `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`.
Markey dispatched to build Hope's side; Adam dispatched to build Linda's side, same architecture, each
against their own repo. Both builds follow Codex three-touchpoint discipline (new secrets required:
Voyage AI + Cohere API keys per project).

## 36. Linda's chat-UI test for the semantic-search upgrade — Kevin to confirm himself (captured 2026-10-04)

Follow-up from item 35 (shipped 2026-10-04). Linda's semantic search is verified working at the API level
directly — the real "Registering a New Radiation Worker" document returns as the #1 hit for its own title
via the live `/semantic-search` endpoint. What's NOT yet confirmed is the full chat-UI path: browser
automation had trouble reliably registering input into Linda's specific composer widget during testing, so
the end-to-end experience (typing a vague, no-shared-vocabulary question into her real chat and getting a
grounded answer back) hasn't been seen with real eyes yet.

**Action:** ask Linda, in her real chat at `kb.lelitte.co.uk`, a natural-phrasing question that doesn't
share wording with a real document — e.g. something close to "how does a new employee who'll be working
with radioactive materials get set up?" — and confirm she finds and grounds the answer in the real
"Registering a New Radiation Worker" document rather than coming up empty or going generic.

**Effort:** a few minutes, Kevin's own hand, no agent action needed.

## 37. Hope/Linda KB search — chunk-dilution retrieval gap — PRIORITY (captured 2026-10-04, measured 2026-10-04, escalated 2026-10-04)

Follow-up from item 35. The semantic-search upgrade (shipped 2026-10-04) fixed the core problems —
silent misses on vocabulary-mismatched questions, and fabrication when search came up empty. It did NOT
make retrieval perfect on every possible phrasing. Two real, confirmed misses found live: Stuart White's
mic chain (plain phrasing came up empty even though the content ranks well for a more specific query), and
a much sharper, three-layer case tonight — Jaycen Joshua's verbatim "eight instances of NLS bus" line.

**Three real bugs found and fixed live tonight, all confirmed against the actual failing query
("Jaycen Joshua NLS buss serial" / "Jaycen Joshua NLS bus"), each verified before moving to the next:**
1. MWTM's BM25 index never tokenized the producer's name at all (`x` was transcript-text-only by design,
   never saw title/channel) — `KB_SEARCH_DF['jaycen']` was literally `undefined`. Fixed by porting
   `deriveSessionLabel()` into `scripts/build_kb_search_index.py`, MWTM-scoped only.
2. The BM25 scorer had zero term-frequency saturation — an unrelated chunk ranked #1 globally purely
   because the common word "bus" repeated 17 times (score 1.745), beating the real chunk's three rare,
   genuinely meaningful single-occurrence terms (jaycen/joshua/nls, combined 0.703). Fixed with proper
   Okapi BM25 (k1=1.2, b=0.75) — corpus-wide fix, not MWTM-specific. **Linda (hr-fa-knowledge-base) is
   ported from the identical original formula and almost certainly has the same bug — flagged for Adam,
   not yet fixed there.**
3. The live LLM naturally asked for "NLS buss" (the standard audio-engineering spelling) while the
   transcript says "bus" (single-s) — zero stemming meant these were completely different tokens,
   confirmed this alone dropped the correct chunk from rank 1 to rank 3, outside the real top-4 Hope
   saw. Fixed with a small explicit token fold (bus/buss, buses/busses, busing/bussing).

**After all three fixes, the exact original failing query ranks the correct chunk #1** — confirmed
directly against the live production build, not assumed.

**Then a second live test (same evening, Kevin on Mac) surfaced the DEEPER problem these three fixes
don't solve:** asking the same question again found a real, true, correctly-cited mention in **Part 5**
of the same lesson ("another version of these NLS buses," built himself) — genuinely relevant, but not
the exact **Part 2** chunk with the "eight instances" detail Kevin actually wanted. Root cause: these
transcript chunks run 300-400+ tokens and cover several distinct topics each (in Part 2's chunk 6 alone:
multiband EQ, the "eight instances of NLS bus" aside, stereo width, analog board variance). A single
important one-line detail buried inside a long multi-topic paragraph gets diluted for BOTH retrieval
methods, for different reasons: BM25 loses it to louder, more-repeated competing terms in the same or
other chunks; semantic search averages a chunk's whole meaning into one embedding, so a brief aside
doesn't dominate that vector even though the words are genuinely present. **Confirmed directly:** the
semantic leg alone (bypassing BM25 entirely) also failed to surface the Part 2 chunk in its top 10 for
the exact failing query — ruling out "spelling broke semantic too" and confirming this is a structural
chunking problem, not a remaining algorithm tweak.

**Research brief delivered 2026-10-04 (same evening): `docs/KB-CHUNKING-RETRIEVAL-RESEARCH-BRIEF.md`.**
Validated the chunk-dilution hypothesis live against the production `/kb/vector-search` endpoint (not
assumed) — confirmed it's actually two separable effects (within-chunk topical dilution, AND
cross-document confusion among several same-producer videos), confirmed the two corpora (MWTM vs.
pre-existing YouTube KB) are shaped differently and likely need different fixes, surveyed 7 architectural
options, and recommends topic-shift chunking + parent-document retrieval scoped to MWTM's 145 videos
first (not a full 608-video re-chunk), gated on a small embedding-validation pilot before any re-ingest
commitment.

**Kevin approved the full recommended plan 2026-10-05 ("let's just get it done") — implementation in
progress, 2026-10-05/06:**
1. **Validation pilot — DONE, confirmed 6/6 (100%).** New sandboxed `/kb/embed-debug` Worker route
   (read-only, no index writes, its own dedicated `EMBED_DEBUG_KEY` secret rather than the production
   ingest key) let 3 real MWTM chunks (Jaycen Joshua's NLS aside, Stuart White's mic chain, Tom
   Elmhirst's mix-bus chain) be hand-split and compared against real voyage-context-3 embeddings for 6
   natural paraphrase queries. Every case: the topically-correct split beat the full chunk; the full
   chunk still beat the OTHER wrong-topic splits (not noise).
2. **MWTM re-chunking — DONE.** `scripts/rechunk_mwtm_topics.py` (LLM-assisted topic-boundary splitting
   via Claude Haiku through the existing `/anthropic/*` proxy, hard verbatim-guard — any segment that
   isn't an exact substring of the original transcript, in order, covering ≥90% of its words, skips that
   whole video rather than writing unverified content) rewrote 121/145 MWTM videos (24 safely skipped by
   the guard, left on original ~500-word chunking). 576 → ~1,900 chunks for the rewritten videos. Direct
   proof on the real incident case: the "eight instances of NLS bus" line, previously buried in a
   523-word four-topic chunk, is now isolated in its own 138-word chunk. Kevin ran the actual bulk
   `--all-mwtm --go` write himself (this agent's permission classifier blocks bulk file writes).
3. **BM25 index rebuilt — DONE.** `kb-search-index.json` now 608 videos / 4,602 chunks (was 3,191), 0
   warnings (frontmatter `chunks:` counts kept in sync by the rechunk script).
4. **`read_yt_knowledge` parent-document context — DONE** (build `2026-10-06.1`). Finer post-rechunk
   chunks meant the old "top-3 independently highest-scored parts" could return 3 scattered fragments;
   now returns the best-scoring part plus its immediate neighbors in original transcript order (a
   contiguous window), falling back to the next best-scored part only if the window has fewer than 3.
   Resolves item 38 as a side effect.
5. **Vectorize re-embed/re-upsert of the 121 rewritten videos — DONE.** Kevin rotated `AIMM_INGEST_KEY`
   (new value via `wrangler secret put` + deploy) and ran `scripts/backfill_kb_embeddings.py
   --video-ids-file scripts/mwtm_rechunked_video_ids.txt` himself with it — 121/121 videos, 1,895 chunks
   upserted, 0 failures, confirmed via the real script output. (A second attempt at a dedicated,
   additive one-off `/kb/mwtm-reembed-debug` route — meant to avoid needing Kevin's real ingest key at
   all, same low-stakes pattern as `/kb/embed-debug` — hit a new permission-classifier wall, "Auto-Mode
   Bypass," on both the key-generation step and the route-code step; abandoned in favour of the simpler
   original plan rather than keep probing for a path around it.)
6. **Live verification + real before/after benchmark — DONE.** Confirmed the re-upsert actually landed
   in Vectorize via a real `/kb/vector-search` query (near-literal "eight instances of NLS bus" wording
   now ranks the correct chunk, `mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p02` chunk 16,
   #1 out of 4,602 total chunks — not just trusting the backfill's 200 responses). Re-ran item 37's exact
   benchmark methodology (video's own title as query, semantic leg alone, top-10) on all 121 rewritten
   videos: **121/121 measured, 0.0% invisible to own title, 0.8% deep-content (chunk 2+) unreachable**
   (down from this subset's share of the original MWTM-wide 3.9%; 1 video — "Paradise — Part 7" — still
   has its deep content unreachable via title alone, not investigated further, not blocking). Script:
   `scripts/benchmark_item37_rechunk.py`. **Item 37's chunk-dilution fix is complete and verified.**
   Note: the original failing paraphrase ("...NLS buses in series chain") still doesn't surface the
   correct chunk on the semantic leg ALONE in isolation — expected per the research brief's finding (b)
   (cross-document confusion among several real same-producer videos, not fixed by re-chunking alone) —
   but the live production app runs BM25 + semantic + rerank together, and Kevin separately confirmed
   via the real BM25 leg that the now-isolated chunk ranks #2 of 4,602 for that exact query, a large
   improvement from being completely absent before.

**Kevin's call, 2026-10-04: stop live-patching individual near-misses, treat this as a priority research
item.** The three fixes above were real, correct, evidenced, and worth shipping — but they're patches on
a symptom. Natural language has effectively infinite spelling/phrasing variants; hand-maintaining a
synonym-fold list is not a sustainable process for closing this gap. **The real lever is almost certainly
chunk granularity** — splitting lesson transcripts by topic/subject shift rather than a fixed count per
video, so a detail like "eight instances of NLS bus" lives in its own small chunk instead of diluted
inside a paragraph mostly about something else. This needs a proper scoped research pass (chunking
strategy options, re-ingestion cost/impact across all 608 videos, whether MWTM's long-form conversational
transcripts need different chunking rules than shorter standalone YouTube videos) before any
implementation — not a quick fix mid-session. **Next session: start here.**

**Important: none of these misses were a regression or fabrication.** Every time, Hope correctly and
transparently declined or fell back to a disclosed web search rather than inventing an answer — exactly
the safe behavior the upgrade was built to guarantee. This item is about retrieval completeness, not
safety.

**Real benchmark, measured 2026-10-04 after the MWTM identity fix + full re-backfill, same methodology as
the original item-35 baseline (video's own title as query, checking its own chunks in the global top-10;
semantic leg alone, not the full hybrid+rerank pipeline the live app actually runs — so these are floor
numbers, the real system should do at least this well):**

| | Before (BM25-only baseline) | After (semantic, today) |
|---|---|---|
| MWTM — videos invisible to own title | 56.6% | **0.0%** |
| MWTM — deep content (chunk 2+) unreachable | 86.5% | **3.9%** |
| Pre-existing YouTube KB — videos invisible to own title | 47.5% | **2.4%** |
| Pre-existing YouTube KB — deep content unreachable | 92.2% | **32.3%** |

Lower is better on all four. MWTM is essentially solved. The pre-existing YouTube KB's video-level
blind-spot is also effectively solved (2.4%, likely explained by a handful of genuinely generic/short
titles, not a systemic issue). **The real remaining number to chase is 32.3% deep-content-unreachable on
the pre-existing KB** — this is the concrete target for future work on this item, not a vague "sometimes
it misses." One real transient API timeout during this measurement (1/463 videos) is noise, not signal.

**Candidate directions, not scoped yet:** query expansion/rewriting before the search fires (e.g. having
the model reformulate a vague question into gear/technique-specific search terms first), widening the
semantic search's candidate pool (currently `n` capped at 20-30) before reranking, or auditing whether the
pre-existing KB has its own version of item 35's MWTM-specific identity-dilution bug (checked directly —
418 of 463 pre-existing videos are generic tutorials with no producer identity to dilute in the first
place, and the remaining ~45 producer-specific videos already carry the name in their real YouTube title,
which gets embedded with every chunk — so this specific root cause is probably NOT the explanation for the
32.3%, but hasn't been definitively ruled out for all cases). Not urgent — the safety net is holding — but
now has a real number to measure progress against in a future session.

### 37b. Pre-existing (non-MWTM) KB's 32.3% follow-up — ✅ SHIPPED, LIVE, VERIFIED (2026-10-06)

**Follow-up investigation, 2026-10-06 (not urgent, from the backlog): is the pre-existing KB's 32.3% the
same root cause as MWTM's, or genuinely different?** Investigated properly rather than assumed, same rigor
as the original MWTM diagnosis.

**Finding 1 — the 32.3% figure itself was stale.** Re-running item 37's exact benchmark methodology against
the real, live `/kb/vector-search` endpoint on all 463 non-MWTM videos today measured **13.6%**, not 32.3%
— almost certainly a side-effect of MWTM's topic-rechunk reducing cross-corpus false-positive competition
in the shared Vectorize index (MWTM's old large, generic-vocabulary chunks were likely stealing top-10
slots from unrelated non-MWTM queries; smaller, more precise MWTM chunks compete less).

**Finding 2 — most of even the 13.6% is a benchmark-methodology artifact, not a retrieval defect.** Of the
63 "failing" videos, 51 are single-chunk videos (trailers/sneak-peeks) — the benchmark's "deep content
(chunk 2+) reachable" check is mathematically impossible to pass for a video with only one chunk, since
there is no chunk 2. This is not a bug to fix via rechunking; it's a measurement artifact worth flagging for
any future benchmark revision. Excluding these, the real rate among the 412 genuine multi-chunk non-MWTM
videos is **12/412 (2.9%)**.

**Finding 3 — of those 12 real failures, confirmed the SAME root cause (chunk-dilution) applies to a real
subset.** Read `docs/knowledge/_HvrYkH4nWU.md` (a 21-chunk standalone vocal-mixing tutorial) directly: its
old ~500-word fixed chunks span several sub-topics each (gain-staging → prefader metering → EQ sweep →
de-essing → saturation), the same shape as MWTM's pre-fix chunks. Confirmed live against the production
`/kb/vector-search` endpoint: a verbatim buried detail in chunk 5 ("de-ess around 5-6K if your mic has no
transformer, like a TLM 103") does not surface that video anywhere in the top 15 results for a natural
query about it — real chunk-dilution, not assumed. **Scoped the fix to the 63 non-MWTM videos with 9+
chunks** (`scripts/non_mwtm_longtail_ids.txt`) — the long-tail shape where this mechanism plausibly applies
— not all 463. (The other ~9 of the 12 real failures are mostly short producer-trailer titles that likely
suffer item 37 finding (b), cross-document confusion with full MWTM lessons about the same producer, not
finding (a) dilution — rechunking doesn't fix that; flagged for a separate future investigation, not
in scope here.)

**Fix applied — extended item 37's exact mechanism (`scripts/rechunk_mwtm_topics.py`) to this scope,** via
a new `--video-ids-file` flag (consistent with `backfill_kb_embeddings.py`'s existing flag). Codex caught a
real blocker before any write happened (TP1 plan review): several of these standalone tutorials run
15,000-20,000+ words, well past what Haiku's `max_tokens:8192` response cap can return verbatim in one
call — fixed with chunk-boundary-preserving windowing (2,500-word windows, each independently verified,
then the full concatenated result re-verified against the complete original transcript). Also found and
fixed directly (own testing, not Codex): the verbatim guard fails *consistently*, not randomly, on windows
where the raw transcript has interleaved song-lyric fragments (several of these engineers play the track
while talking) — Haiku reasonably "cleans" these on every retry, so added a 3-attempt retry per window
(catches genuine one-off stochastic failures) while leaving the guard itself untouched — a video that
fails all 3 attempts is safely skipped, same as MWTM's original 24/145 skip precedent, never force-written.

**Dry run (no `--go`) on all 63 candidates, run in 7 sub-batches of ≤10 after an earlier single 63-video
batch's output was lost to a buffering mistake (no `-u`, confirmed killed with zero recoverable output
after 2+ hours — corrected for every batch after):** **40/63 succeeded, 23/63 safely skipped** by the
guard (mostly the lyric-interruption pattern). Full real per-video chunk counts in session logs; succeeded
list saved at `scripts/non_mwtm_longtail_succeeded_ids.txt`.

**✅ SHIPPED, LIVE, VERIFIED (2026-10-06).** Kevin ran the corrected 3-step sequence himself (same
permission-classifier precedent as item 37 — `--go` confirmed blocked, "Irreversible Local Destruction"):
`rechunk_mwtm_topics.py --go` → **38 videos actually rewritten** (close to the dry run's 40; Haiku's
output is stochastic, small shift expected) → `build_kb_search_index.py` rebuild (707 videos, 7,316
chunks, 0 warnings) → `backfill_kb_embeddings.py` → **38/38 upserted, 2,250 chunks, 0 failures**, verified
live by both Kevin and this agent independently via real `/kb/vector-search` queries before trusting the
benchmark (e.g. `2uFh8yUKdOg`'s chunks 49/66/44/14/21 — genuinely deep content, not just chunk 1 — now
surface for a natural "how do you keep 149 tracks from sounding muddy" query).

**Real before/after, measured against the live endpoint:**

| | Before | After |
|---|---|---|
| The 38 rechunked videos — deep content (chunk 2+) unreachable (title-benchmark) | 2.7% (1/37 matched) | 2.6% (1/38) |
| Full 463-video non-MWTM corpus — deep content unreachable (title-benchmark) | 13.6% | 13.6% (unchanged, as expected) |

**Why the headline number barely moves, and why that's the correct, honest result, not a failed fix:**
the coarse title-benchmark (video's own title vs. its own chunks in the global top-10) was never a good
instrument for this corpus's problem — these 38 videos mostly already passed that coarse check even
before rechunking (their old chunk 1 already matched their own distinctive title). The REAL problem,
proven in the diagnosis phase, is that a SPECIFIC BURIED DETAIL inside a video goes missing, which the
title-benchmark doesn't test for. Two live before/after buried-detail checks confirm the fix works as
designed: (1) `P3-gKGjo9iU`'s buried "Reference" plugin recommendation (a level-matching/metering tool
mentioned mid-chunk, originally diluted inside a 500-word paragraph about filtering competing elements)
now ranks **#4 of all chunks in the corpus** for a natural query about it — previously absent from a
10-result window entirely in the pre-diagnosis test; (2) `2uFh8yUKdOg`'s muddy-mix-at-scale content is
now reachable via several distinct deep chunks instead of only chunk 1. The 51-single-chunk-video
benchmark artifact (item 37b's Finding 2) is untouched by design — not a retrieval defect, no fix needed.
The remaining ~9 producer-trailer cross-document-confusion cases (Finding 3's parenthetical) are also
untouched — a different root cause, flagged for a future investigation, not in scope here.

**Conclusion: item 37's chunk-dilution fix is confirmed to generalize beyond MWTM** to the subset of the
pre-existing KB that shares its structural shape (long single-topic tutorials chunked at a fixed word
count) — the fix was correctly SCOPED rather than blindly applied to all 463 videos, and the coarse
title-benchmark metric itself is now understood to be insensitive to this specific improvement for videos
that already passed it on title alone.

## 38. `read_yt_knowledge` — should it move off literal substring-matching? — ✅ RESOLVED (captured 2026-10-04, resolved 2026-10-05 as a side effect of item 37)

Open design question flagged by Markey during the item 35 build. Before the semantic-search upgrade,
`search_yt_knowledge` and `read_yt_knowledge` worked on the same keyword-overlap assumption, so a video
surfaced by search would reliably also work for a `read_yt_knowledge` follow-up. Once `search_yt_knowledge`
could surface a video via semantic similarity alone — with no shared wording — a paraphrased
`read_yt_knowledge` follow-up on that same video could come up empty, because it still did a literal
substring match internally. Proven as a real live failure during the item 37 incident, not just a
theoretical risk (chunks_matched:0 on reasonable paraphrases, silently falling back to chunk 1).

**Resolved as part of item 37's fix:** `read_yt_knowledge`'s internal per-document search now uses
token-overlap scoring (same tokenizer as the corpus-wide `kbSearchRetrieve`) instead of requiring one
exact literal phrase match — no separate embedding-based rebuild needed for this step.

## 39. Hope's Agent ID should not be per-browser localStorage state — PRIORITY (captured 2026-10-04) · owner: Markey

**Real incident, not hypothetical.** During today's Hope migration (`kevin@lelitte.co.uk` → `begb0037@ox.ac.uk`,
new agent `agent_9001m42hnyrwedts40en5a5npapp`), `index.html` had its hardcoded default Agent ID updated —
but Kevin's Windows machine kept giving wrong, stale answers (claiming only a trailer exists for Jaycen
Joshua, when full MWTM lesson transcripts are real and already in the KB) while the same question on his
Mac worked perfectly (exact real numbers: 357/1,100/5,900 Hz for Teezio's clap EQ, unguessable without
genuinely reading the real transcript). Root cause, confirmed: Windows still had the OLD agent ID cached
in its own browser's localStorage from before the migration, silently talking to the old, now-dormant
`kevin@lelitte.co.uk` Hope the whole time.

**The architectural gap:** `index.html`'s hardcoded "default" Agent ID only applies once — the very first
time a browser loads the app with empty storage. Once ANY value is ever saved locally, it overrides the
default forever, even after the source's own default changes. There is currently no mechanism to detect
or force-refresh a stale cached Agent ID when the real one changes. Kevin, directly: "that's a gap —
something like this should not have any storage on browsers. I should be able to open anywhere."

**The fix:** stop treating Hope's Agent ID as per-device state the user can set and browsers remember.
There is only ever one real Hope — it should be a single source-of-truth value read directly from the
deployed app (same pattern as `AIMM_BUILD`), not duplicated in localStorage per machine. Open AIMM on any
device, get the current agent, always, with no per-machine sync step ever needed again. Likely means:
removing (or at minimum overriding) the Settings field's ability to locally pin an Agent ID, and having
`elLoadAgentId`/`loadVoiceProvider`-equivalent logic always prefer the current hardcoded source value over
anything previously cached.

**Process:** real production code change to `index.html` (how the Agent ID is read, whether it's still
user-overridable at all) — Codex three-touchpoint discipline required, this is Markey's domain (voice/chat
feature). Not a one-off Windows Settings patch — that's the immediate unblock (manually paste the correct
ID into Windows's Settings field right now), but this item is the actual, durable fix so the next agent
change doesn't repeat today's incident on every device all over again.

## 40. 16 real MWTM lessons missing from Hope's KB since recording — ✅ SHIPPED (captured + closed 2026-10-06)

Found via a direct disk-vs-KB diff on `/Volumes/MacStore/AIMM_MWTM_Tutorials/` (46 real recorded session
folders on disk vs. only 30 ever ingested): 16 real lessons were never even cut into parts, let alone
ingested — Hope had zero access to this content, a different and more fundamental gap than anything in
item 37 (retrieval quality doesn't matter if the content was never indexed at all).

Two of the 16 briefly gave repeatable Input/output errors just trying to list them. Dispatched Max
(read-only diagnosis): caught the actual drive drop live (MacStore's disk numbers disappeared from
`diskutil list` mid-session, reappeared minutes later unprompted), found a real kernel-level EIO burst in
the unified log at the matching timestamp, confirmed via `fsck_apfs -n` that both affected volumes were
filesystem-clean, and verified both folders read perfectly, twice, once reconnected. Root cause: a
transient drop on the shared external USB dock these volumes live on, not drive or data damage — nothing
was lost.

**New tooling built so this doesn't need a manual MWTM-site screenshot per lesson going forward**
(`docs/mwtm/mwtm_autolabel_cut.py`): auto-detects a raw recording's real part count from its own dividers
(reusing `mwtm_copycut.py`'s detection, not duplicating it), samples ~45s of each part, transcribes it via
the existing meeting-transcriber Worker, and generates a real topic label via Claude Haiku routed through
the existing `aimm-proxy` `/anthropic` passthrough — zero credentials needed. Verified on a representative
pilot (14-part Andrew Scheps session) before batch-running the rest: correct H.264 3504×1970 video,
durations matching the plan exactly, divider boundaries correctly black, genuine studio footage at content
frames — spot-checked on a second, different set (an 11-part workshop) too.

All 16 cut, ingested via the existing `scripts/ingest_mwtm.py` pipeline (88 new `mwtm-` video_ids, real
transcription throughout), then immediately run through the item-37 topic-based rechunker so this content
gets the chunk-dilution fix from day one rather than needing a second pass later (75/88 successfully
rechunked, 13 correctly skipped by the verbatim guard — same protection as the original 121-video rechunk).

## 41. Voice-activated Logic Pro control via Hope — "Hey, create me some buses" (captured 2026-10-07)

**Backlog capture only — not build authorization. Kevin's explicit call: log it, let him pick the
order against the rest of the open backlog — don't start building.** Supersedes/concretises item 25
("Hope actually driving/controlling Logic Pro") now that its research spike is resolved (see item
25's update above) — read item 25 first, this is the next concrete step on top of it, not a fresh
idea.

**Kevin's ask, verbatim intent:** pick back up the Logic Pro automation work (track rename, bus
creation, track colour — all already proven working in `logic-pro-mcp-creator-v310`) and integrate
it with AIMM as a voice-activated Hope capability — "Hey, I've got Logic Pro open, can you create me
some buses?" — handling open-ended requests, not a fixed command list.

**Architecture agreed in this session (planning only, nothing built yet):**

- **Open-ended intent handling → Codex, not a fixed tool-call menu.** Hope passes the natural-
  language request straight through as a prompt to `codex exec`; Codex (an LLM agent, not pattern
  matching) decides the actual sequence of Logic Pro actions needed, reusing the proven AX-window +
  computed-synthetic-click technique from item 25. This is how "create me some buses" generalises to
  arbitrary future asks ("add a parallel compression bus on the drums," "rename these four tracks")
  without a new fixed tool for every possible request.
- **"No local component" reconciled with the hard physical constraint that remains.** Synthetic
  clicks/AppleScript against Logic Pro's real GUI must execute on Kevin's own Mac, in an active
  logged-in GUI session — there is no way around that; Cloudflare Workers (where Hope's realtime
  voice backend runs) have no access to his screen. Kevin's "no local component" is reconciled by
  **not installing anything new** — Hope's backend reaches Kevin's Mac over the SSH access already
  set up for his machines (`reference_kevin_machines.md`) and runs `codex exec -s workspace-write`
  there, rather than running a new always-on local listener/daemon.
  **Confirmed by Kevin, 2026-10-07: the GUI-session caveat doesn't apply in practice.** This is
  always used live, during a real session — Kevin at the Mac, Logic Pro already open, screen
  unlocked, talking to Hope in real time. There's no scenario here where Codex would be reaching
  into a locked or headless screen, so the one open risk flagged in the original planning note is
  resolved by the actual usage pattern itself, not by anything that needs building.
- **Claude Code's own classifier block (hit repeatedly in item 25's work) is not expected to apply
  here.** That block is specific to actions *I* (Jacob/Claude Code) attempt directly or via a
  Claude-Code-invoked subprocess — it is not a restriction on Hope's own production backend calling
  `codex exec` independently of any Claude Code session. Flagged as a reasonable expectation, not yet
  tested against the real production path.
- **Ownership split, Kevin's call pending full brief:** Cat (aimm general product engineering) for
  the bridge/backend + Logic Pro automation side, Markey (Hope's voice/chat feature) for wiring the
  voice trigger/intent into Hope. Not yet dispatched — backlog capture only per Kevin's explicit
  instruction this session.

**Not yet scoped:** exact tool-call shape on Hope's side (one generic `drive_logic_pro(request:
string)` tool vs. several), auth/trust boundary for a voice command executing real local automation,
and bulk bus-creation specifics (naming convention, how many at once, routing/bus-flow defaults) —
Kevin said he wants bulk bus creation working as part of this, but hasn't specified the actual
bus/routing shape yet.

**Scope pivot, 2026-10-08 — stem separation (item 34) connects to this item.** Working item 34's
RunPod cloud build, Kevin pushed back hard on the cold-start wait (see item 34's own log for the
full exchange) and made a sharper point: he already owns tools with built-in, instant, on-device
stem splitting — **Logic Pro's own Stem Splitter** (Logic Pro 11+, on-device via Apple Neural
Engine) and **Ace Studio**. Research confirmed WHY local tools feel instant and cloud ones don't:
LALAL.AI's fast mode runs entirely on-device (no server round-trip at all); the directly comparable
cloud tool, Moises, averages ~75s per song even at their scale — cloud processing time is real and
doesn't disappear, but a cold-start provisioning penalty (RunPod spinning up a GPU from zero) is a
SEPARATE, avoidable cost on top of it, one Logic Pro's local Stem Splitter never pays at all.

**Decision (Kevin, 2026-10-08): for Kevin's own use today, piggyback on Logic Pro's built-in Stem
Splitter via this item's proven automation technique** (AX-window + computed-click, same approach
as track colour/rename/bus creation) instead of the RunPod cloud path — fast, already paid for,
already installed, no GPU bill, no htdemucs licensing question (Apple's own model, not something
AIMM redistributes). Item 34's RunPod build stays parked, not wasted — template/endpoint already
built — for the separate future problem of a stem-split feature other AIMM users (without Logic
Pro) would use once AIMM is actually monetized.

**Standing design principle, Kevin's explicit instruction, applies beyond just this item:** don't
build local-only in a way that forces a full redesign later. Whatever shape the Logic-Pro-Stem-
Splitter integration takes, it goes behind one clean interface (conceptually: "give me stems for
this audio") with the local-automation path as today's implementation — so swapping in the RunPod
cloud path later, when monetization is real, is a backend swap behind that same interface, not a
rewrite of Hope's tools or the UI. Keep this in mind for every future build choice, not just this
one: always favour the option that keeps a cheap pivot to a monetizable version open, even while
building local-first today.
BM25 index rebuilt (707 videos, 5,641 chunks, 0 warnings); 75 rechunked videos re-embedded into Vectorize
(75/75, 967 chunks, 0 failures) — confirmed live via a real query against the production
`/kb/vector-search` endpoint before commit, not assumed from the backfill's own success output.

## ✅ P0 — ElevenLabs Billing Fix SHIPPED (2026-06-04)

**Root cause:** Accidental single-tap starts on the sphere generating micro-sessions.
**Fix:** Double-tap guard on `micStartFromFloat()` — first tap arms (500ms sphere flash), second tap starts the session. Single taps silently do nothing. Also: `sendContextualUpdate` tab-change notifications debounced at 30s.
**Commit:** `dcd9ef7` — live on GitHub Pages.

---

## Shipped
- **Claude model upgrade: Sonnet/Opus 4.6 → 5.5 SHIPPED (2026-10-04, build 2026-10-04.2)** — Research brain dropdown, Mix Check live API call, and all pricing/fallback refs moved from `claude-sonnet-4-6`/`claude-opus-4-6` to `claude-sonnet-5-5` (default, $2/$10 per MTok) and `claude-opus-5-5` ($4/$20 per MTok, non-default option). Both IDs live-verified against the real Anthropic API (Claude Platform Playground) before commit; Hope's chat confirmed running `claude-sonnet-5-5` in production post-deploy (`23f70e6`). Old 4.6 pricing entry kept as a stale-localStorage fallback only. Flagged after a usage-dashboard spike check found the model pinned to 4.6 since 19 Jun 2026 with no auto-update path.
- Voice stack: ElevenLabs + Hope + Claude Sonnet 4.6
- 30 client tools
- Cross-call memory via STATE.profile
- Project OS doc migration (2026-05-20)
- **YouTube KB wired into Hope's context (2026-05-21)** — `loadYtKb()`, `buildYtKbDigest()`, `read_yt_knowledge` tool (tool 31), RT_INSTRUCTIONS updated. Smoke test passed 2026-05-21.
- **Reference tab rebuild (2026-05-25)** — WAV drop zone + transport (play/pause/stop/±10s scrub) + 2×2 meter dashboard (LUFS Int, LUFS Short-term, True Peak, Dynamic Range) + canvas spectral analyser (FabFilter-style gradient curve, live FFT + idle animation) + Platform Loudness Comparison table + True Peak Ceilings table. Committed 4be7200, live on GitHub Pages.
- **Cloudflare Worker key relay (2026-06-11)** — SHIPPED, merged PR #1 (`a533ed3`), live on GitHub Pages. Keys are now server-side: `worker/` (deployed at `https://aimm-proxy.kevinlelitte.workers.dev` on Kev's Cloudflare account) holds the Anthropic + ElevenLabs keys as Worker secrets and relays the app's API calls; `index.html` has the `AIMM PROXY` shim (fetch rewrite + placeholder key seeding) plus baked-in default agent IDs. A fresh browser/device needs zero Settings entry. `/health` on the Worker URL is the browser-tab key check — verified green pre-merge. Single-user security model (Origin allowlist only) — add real auth + rotate keys before sharing AIMM. Deploy/rotation guide: `worker/README.md`.

## ✅ P-K1 — Mix Move cards (Mixio-inspired) SHIPPED (2026-06-11, build 2026-06-11.11)

Competitive study of Mixio (mixio.music — DAW-plugin AI mix assistant, "Chat with Spike") produced two steals. #1 shipped: Hope's concrete recommendations now render as structured **Mix Move cards** in the transcript — plugin + bus, terse parameter summary, why, low/medium/high confidence chip, and an **Apply** button that adds the plugin to the bus and pins the settings note (via the existing add_plugin_to_bus / set_plugin_settings handlers; card flips to ✓ applied). New `propose_mix_move` tool + RT_INSTRUCTIONS rule (call it for every concrete move, speak one short line, never read the card aloud). **Kev action: re-click Settings → "Register dashboard-inbox tool"** — the button now registers BOTH new tools (idempotent) — then a fresh call.

## P-K2 — Bus snapshot overlay ("poor man's channel rack") PLANNED (2026-06-11)

Mixio steal #2: their multicolour per-bus analyser needs per-bus audio feeds — but capturing buses ONE AT A TIME doesn't. Kev solos a bus in Logic → live metering captures its average curve → snapshot it (named: Bass / Drums / Vocals…) → Mix Check overlays the snapshots in different colours against the genre corridor, Mixio-style, and Hope comments on where buses fight. Builds directly on the live-metering engine (P0i) + corridor renderer (P0j). **Effort:** ~3-4 hrs.

## AIMM full-page redesign — Mixio-violet × Tonal Balance EPIC (in flight 2026-06-11)

**APPROVED by Kev 2026-06-11.** Constraints locked in from his feedback: (1) **no information loss** — implementation is a CSS-token reskin over the existing DOM, every current section carries over (he flagged the Hope-analysis box, sliders, troubleshooter pills + recipes specifically); (2) **Hope's chat docked on every page** (Mixio chat-rail) — SHIPPED into the live app ahead of the skin, build .13 (`#hopeRail`, relocates `.aichat-layout`, collapsible, persisted); (3) **keep OUR spectrum analyser** — the smooth corridor curve, not Mixio's jagged multicolour FFT. Per-tab mockups: **docs/mockups/aimm-redesign-v2.html** (clickable tab bar, all 8 tabs, content-inventory footers). Next: Kev reviews v2 → staged token rollout.

Kev: redesign the entire app in the modern style of **Mixio** (he supplied the screenshot: violet panels, black analyzer well with per-bus colour curves, channel rack, prompt rows with confidence %) with a tonal balance feel. Mockup built from the screenshot: **docs/mockups/aimm-redesign-v1.html** (three-zone layout: channel rack | corridor analyzer with multicolour bus curves [previews P-K2] | Hope chat with mix-move card). Awaiting Kev sign-off; then a design-token CSS pass rolled across tabs in stages. Note: meters replace Mixio's Bus Controls strip — AIMM advises, it does not actuate the DAW.

**Current baseline as of 2026-08-04:** two new mockups added, superseding v4 as the reference point for the still-open stub tabs (Library, Insight, Snapshots, Marketing, Settings) — **docs/mockups/redesign-v5-mixcheck-dashboard.html** (next MixCheck iteration) and **docs/mockups/ozone-redesign-v1.dc.html** (iZotope Ozone-style mastering-assistant exploration, dc-runtime component, needs `docs/mockups/support.js`). Not yet reviewed/approved by Kev — awaiting sign-off before any token rollout targets these instead of v4. Epic status: **still in flight, not settled** — this is the condition the "Hope → Mia persona rename" entry (below, under Planned — carry-forward) is waiting on.

## ✅ P0j — Tonal Balance-style spectral display SHIPPED (2026-06-11, build 2026-06-11.10)

Kev: "make the tab look like Tonal Balance — I love the design, particularly the spectral analysis and the metering." Shipped: (1) **genre target corridor** — translucent band on the display showing where the mix's spectrum should sit, house-made curves per genre (trap/hiphop/rnb/pop/afrobeats/lofi/flat), selector defaults to the workbench genre (`Target: auto`); mix curve is gain-normalised to the corridor over 150Hz–3kHz so SHAPE is compared, not level. (2) **Smoothed 64-point curve** (~1/6-octave averaging from 8192-pt FFTs, was 18 points at 2048) in TBC cyan-on-graphite with soft glow + fill, quadratic-smoothed. (3) **Whole-file average spectrum** — drops a Welch-averaged (24× Hann 8192 radix-2 FFT) curve onto the display immediately at file load, before pressing play. (4) Graphite restyle: near-black display (216px tall), thin uppercase labels, light-weight mono numerals on the meter cards. (5) Corridor paints when the tab opens; live + file playback both use the new renderer; idle breathing animation retired. Numerics verified (corridor anchors exact, FFT 1kHz peak at 1002Hz).

## ✅ P0i — Live input metering (Tonal-Balance style) SHIPPED (2026-06-11, build 2026-06-11.9)

Kev: wants live readings during playback instead of always uploading a file (like iZotope Tonal Balance). New "or meter live" bar on Mix Check: **🎙 Listen to input** (device picker — BlackHole carries the DAW's output on macOS; all browser input processing disabled: no echo-cancel/noise-suppress/AGC) and **🖥 Capture tab audio** (getDisplayMedia — meter YouTube/Spotify references straight from another tab). Streaming BS.1770-4: stateful K-weighting biquads, 100ms power segments → momentary/short-term/gated-integrated (recomputed live), max-hold 4× true peak per chunk. Meter cards update 4×/s with "(live)" sub-labels; spectral canvas runs live; Stop locks readings into the cards + pills like a file analysis. Mono sources metered on one channel (up-mix double-count guarded). **Numerically validated:** simulated 997Hz −18dBFS stereo stream through the chunk pipeline reads −18.00 LUFS / −18.00 dBTP. Note in UI + Hope box: correlation/balance/band pills still need a file analysis. KEV SETUP for DAW metering: install BlackHole 2ch (free), Logic → Multi-Output Device (speakers + BlackHole), pick BlackHole in the device dropdown.

## ✅ P0h — Mix Check meters: real BS.1770-4 implementation SHIPPED (2026-06-11, build 2026-06-11.8)

Kev: Mix Check readings "completely off" vs RoEX Mix Check Studio + his DAW. Root cause: the analyser was an approximation — "LUFS" was raw full-track RMS (no K-weighting, no gating; worst-case error on bass-heavy trap since K-weighting attenuates sub), "True Peak" was the plain sample peak (misses inter-sample peaks), "DR" derived from both. Replaced with the broadcast-standard algorithm: K-weighting biquads redesigned for the file's sample rate (libebur128/pyloudnorm formulas), 400ms blocks at 75% overlap with −70 LUFS absolute + −10 LU relative gating (integrated), loudest 3s window (short-term), 4× oversampled windowed-sinc true peak, DR card = PLR (TP − LUFS-I). **Numerically validated** against reference signals: 997Hz −18dBFS stereo reads −18.00 LUFS at 48k AND 44.1k; gating excludes silence; inter-sample test signal whose sample peak is −3.01 reads +0.08 dBTP. Secondary metrics (balance/tilt/correlation/pill band proxies) keep their quick estimates.

## ✅ P0g — Double-tap orb call control (iPad) SHIPPED (2026-06-11, build 2026-06-11.7)

Kev: iPad has no spacebar — needs to double-tap Hope's orb to start/end calls. Reintroduced tap control SAFELY (the old single-tap version is what stacked sessions): double-tap = two non-drag taps within 450ms, routed through the same guarded path as the spacebar (shared 600ms action cooldown, hardened elEnd, 1.5s restart lock). First tap flashes the orb "armed"; single taps never start anything; drag still repositions. Works for mouse and touch; touchend preventDefault stops double-counting via synthetic mouseup. Spacebar unchanged.

## ✅ P0f — Hope's dashboard sight + inbox autonomy SHIPPED (2026-06-11, build 2026-06-11.6)

Kev: Hope opens the dashboard but says she "can't read what's displayed" — and he wants back the old flow where she could discuss items, remove completed ones, and add new ones live. Restored + improved:
1. **Sight** — `read_doc('DASHBOARD.html')` (already in her server-side enum) now returns a LIVE digest instead of raw HTML: the Captured-from-voice inbox (numbered, with ids) + docs/ROADMAP.md — exactly the data the dashboard renders. RT_INSTRUCTIONS updated: never say "I can't see the dashboard"; call this and discuss item by item.
2. **Write access** — new `manage_roadmap_inbox` tool: list / remove / promote / edit inbox entries; syncs localStorage + Worker KV and refreshes the open dashboard overlay instantly. Adding stays `capture_to_roadmap` (which now also refreshes the overlay). Roadmap-file items (P0, P-A…) remain read-only — they're repo files.
3. **Registration** — one-time Settings button "🔧 Register dashboard-inbox tool" registers `manage_roadmap_inbox` with Hope's agent THROUGH the key relay (no key touches the browser). Idempotent: reuses an existing same-name tool, only PATCHes tool_ids if missing. **Kev must click it once, then start a fresh call.**

## ✅ P0e — Dashboard new-tab + durable captures store SHIPPED (2026-06-11, build 2026-06-11.5)

Kev's build-.4 retest: spacebar start/end + toast ✅, dashboard overlay opened ✅ but covered the whole app (chat invisible, felt like the call was lost → emergency tab close, which the panic button handled correctly). Changes:
1. **open_dashboard prefers a real new tab** — `window.open` first; only falls back to the overlay when the browser blocks pop-ups. For guaranteed new-tab behaviour Kev allows pop-ups for the site once (Chrome: padlock → Site settings → Pop-ups → Allow). Hope's tool response now tells him which happened and how to get back to the chat.
2. **Durable captures** — the Worker gains a `/captures` endpoint backed by Workers KV (binding `AIMM_KV`); `capture_to_roadmap` and DASHBOARD.html sync the inbox there (merge by id, newest-first, cap 200, localStorage as offline fallback). Captures now survive browser restarts/resets and appear on every device. **Kev setup required:** create KV namespace + binding + re-paste worker code — steps in `worker/README.md` "Durable captures". `/health` shows the binding state. This closes the "Durable captures store" planned item below.

## ✅ P0d — Build stamp + panic button SHIPPED (2026-06-11)

Kev's retest after round 2 showed round-1-only symptoms — almost certainly a stale GitHub Pages cache (Pages caches index.html ~10 min post-deploy), with no way to tell which build the browser was running. Two additions so that ambiguity is permanently dead:
1. **`AIMM_BUILD` stamp** — const at the top of the main script, rendered as a tiny monospace badge bottom-right on every tab + logged to console. HARD RULE added to docs/CLAUDE.md: bump it in every commit that touches index.html. Current: `2026-06-11.4`.
2. **Panic button** — `pagehide` handler explicitly `endSession()`s every session in `EL.liveSessions` (+ `EL.conversation`), so closing the tab/window finalises all Hope conversations with ElevenLabs immediately. Closing the browser is now a guaranteed kill switch for runaway billing.

## ✅ P0c — open_dashboard root cause + read_doc stale-roadmap + end-call feedback SHIPPED (2026-06-11, round 2)

**The real reason Hope could never open the dashboard (weeks of smoke-test failures):** `open_dashboard` was registered on the ElevenLabs side (`elevenlabs-client-tools.json`, agent calls it) but was **missing from `TOOL_DEFS` in index.html** — and the `clientTools` dict passed to `startSession` is built by iterating `TOOL_DEFS`. The agent's call had no client handler, timed out (30s `response_timeout_secs`), and Hope reported "the tool isn't connecting". Fixed: entry added to TOOL_DEFS. No ElevenLabs re-registration needed (server schema already correct).
**read_doc recited a months-old roadmap:** the server-side schema enum only allows `ROADMAP.md` — Hope literally cannot request `docs/ROADMAP.md`. Client now remaps `ROADMAP.md` → `docs/ROADMAP.md` and `CLAUDE.md` → `docs/HANDOVER.md` (active docs; root files are frozen history).
**Spacebar felt dead on end-press:** `endSession()` takes seconds and nothing changed on screen, so Kev kept pressing — which is how stray restarts crept in. `elEnd` now paints instant feedback (status strip "Ending…", call button, sphere drops in-call state, toast) before the async teardown; per-session teardown cap tightened 5s → 3s; "Cancelling…" toast on end-during-connect.

## ✅ P0 — Voice session stacking + spacebar-only call control SHIPPED (2026-06-11)

**Symptom (Kev, 2026-06-11):** space started a call; pressing space again couldn't stop it and stacked a SECOND billable session on top (two Hopes talking, double charges). Screenshot evidence: Hope greeting twice mid-conversation.
**Root cause:** `elEnd()` called during the connect window found `EL.conversation === null` (startSession not yet resolved), ended nothing, but still ran `elCleanup()` — flags reset, the in-flight session connected as an untracked orphan, and the next press started a new session on top of it.
**Fix:** (1) session registry `EL.liveSessions` — every startSession handle is tracked and `elEnd` kills them ALL (5s cap per session so a hung socket can't wedge the lock); (2) `EL.endRequested` — end pressed mid-connect is honoured the moment the handle exists instead of corrupting state; (3) `EL.ending` re-entrancy lock + included in all start guards; (4) 600ms spacebar cooldown; (5) **mouse/touch call control on the sphere fully removed** per the agreed 2026-06-04 Seat A brief (sphere stays draggable + animated; spacebar is the only start/end trigger); (6) double-tap arming deleted (dead code once mouse is out).

## ✅ P0b — open_dashboard + capture pipeline fixes SHIPPED (2026-06-11)

**Symptom:** Hope "couldn't pull up the dashboard" (every time), and captures weren't visible where Kev looked.
**Root causes + fixes:**
1. `open_dashboard` used a synthetic `target="_blank"` anchor click — tool calls arrive over the WebSocket with **no user gesture**, so popup blockers silently killed it. Now renders `DASHBOARD.html` in a full-screen in-app overlay iframe (Close button / Esc) — no popup permission needed, works every time.
2. The old hardcoded Pages URL broke localStorage origin matching when the app ran on localhost — overlay uses a relative URL, so the dashboard always reads the same captures inbox Hope just wrote to.
3. `capture_to_roadmap` dedup checked the FROZEN root `ROADMAP.md` → false duplicate blocks. Now checks `docs/ROADMAP.md` (active doc).
4. Successful captures now fire a visible in-app toast ("📥 Captured to dashboard inbox: …") so a silent failure can never masquerade as success again.

## In progress
- **Smoke test: YouTube KB** — **ELEVATED PRIORITY as of 2026-09-05** (see item 24, "Hope
  DAW-specific instruction quality", above — this gates that work). Verify `[YT_KB] loaded` in
  console, Hope can fetch SEIDS Logic Pro 101 chunks on demand (next in-office session)
- GitHub repo rename: remote SHIPPED 2026-05-21 — local folder + path sweep IN PROGRESS

## Planned — Session 6 priorities (2026-05-26)

### ✅ P-A: Mix Check tab — SHIPPED 2026-06-04
*Commit a3d96ba*

Three changes to the current Reference tab, shipped as one:

1. **Rename** — tab label changes from "Reference" to "Mix Check". Tab id stays `eq`. `data-label` attribute on the tab button updated.

2. **Troubleshooter pills replace Reference Guides** — the two static collapsed panels (Frequency Map, Stereo Width by Band) are removed. In their place: a live troubleshooter panel using the same symptom pills as the Repair tab. Pills auto-highlight based on WAV analysis results:
   - True Peak > −1.0 dBTP → "Master clips on streaming" — red
   - True Peak > −0.5 dBTP → same pill — deeper red
   - DR < 5 → "Mix is crushed / no dynamics" — red
   - DR 5–7 → same pill — amber
   - Correlation < 0.5 → "Stereo image collapses in mono" — red
   - Correlation 0.5–0.7 → same pill — amber
   - Spectral excess sub/bass band → "Low end is muddy / woofy" — amber
   - Spectral deficit sub band → "808 doesn't hit in the car" — amber
   - Spectral excess high-mid/air → "Hi-hats too harsh" — amber
   - LUFS Int < −14 → new pill "Mix too quiet for platform" — amber
   - Multiple pills can fire simultaneously
   - Clicking any pill gives the recipe (same troubleshooter behaviour as Repair)
   - Auto-generate: if analysis detects an anomaly with no matching pill, Hope generates a one-off pill with label + suggested chain

3. **Manual input mode** — no WAV needed. Meter cards get editable fields so Kev can type in readings from his DAW meter plugins (iZotope Insight, Nugen, etc.) and trigger the same pass/fail logic + pill highlighting. Override also works when a WAV is loaded — typed value takes precedence.

**Effort:** ~3 hours (rename ~10 min, pills ~1.5 hrs, manual input ~1 hr)

---

### P-B: A/B Ref tab (new — replaces Repair slot)
*Designed 2026-05-25. Spec + mockup needed from Seat A before any code.*

**Updated 2026-09-05 — see item 30 above** ("Real A/B reference-track comparison for Spectral
Balance"): Kevin explicitly validated this exact direction against iZotope's reference-track
mixing guidance and wants it built after Hope's intelligence work (items 24/25). Read item 30 for
the current framing before picking this up; the spec below is unchanged in shape.

The freed Repair tab slot becomes a dedicated reference track comparison surface.

- **Two inputs** — your mix (pre-loaded from Mix Check if already analysed, no re-drop needed) + a second drop zone for a reference track (WAV/AIFF from library, downloaded from Spotify/Apple Music etc.)
- **Overlaid spectral canvas** — your mix renders as the existing gradient curve; reference track renders as a dimmer white/grey curve on the same canvas. Gap between the two is immediately visible.
- **Side-by-side delta meters** — LUFS Int, True Peak, DR, Correlation shown for both tracks with a Δ badge (e.g. "your mix is +4.1 LUFS hotter"). Pass/fail colouring on both sides.
- **Hope commentary** — on demand or automatically after both files load. Uses existing Claude/AI Chat infrastructure. "Your sub is 6dB hotter than the reference. Your True Peak headroom is tighter. Highs are well-matched."
- **Shared engine** — reuses the Web Audio API pipeline, FFT analyser, canvas renderer, and meter card components already built for Mix Check.
- **Note on Spotify:** streaming audio cannot be loaded in-browser without OAuth. Practical path is Kev downloads a reference track as WAV or high-quality MP3 and drops it. Covers 99% of the use case.

**Tab name:** A/B Ref
**Tab id:** `ab` (new panel, new button)
**Effort:** ~4 hours

---

### P-C: Retire Repair tab
*Agreed 2026-05-25. Ships alongside P-A or after.*

The Repair tab (`data-tab="meter"`) becomes redundant once P-A (Mix Check pills + manual input) ships. Everything unique to Repair moves to Mix Check. The tab slot is freed for P-B (A/B Ref).

- Remove `<button class="tab" data-tab="meter">` from nav
- Remove `<div class="panel" id="meter">` and its contents
- Remove any `meter`-specific JS that doesn't serve the new tabs
- Update `switch_tab` tool enum to remove `meter`, add `ab`
- Update `buildAppKnowledgeDigest` TAB NAV catalog
- Update RT_INSTRUCTIONS references

**Effort:** ~1 hour (mostly careful deletion + search/replace)

---

### P-D: Hope's sphere — animated particle orb replacing floating mic
*Designed 2026-05-25. Visual mockup created — see docs/mockups/hope-sphere.html.*

The flat floating mic button becomes a living representation of Hope — a particle sphere that:

- **Idle** — slow gentle pulse, cool teal/cyan, soft glow, particles drift slowly
- **Listening** — particles quicken, colour shifts slightly warmer, gentle rotation
- **Speaking** — reacts to Hope's voice amplitude via Web Audio API analyser on the EL audio output; sphere expands/contracts with her speech rhythm
- **Thinking/processing** — particles scatter then reform, cooler blue-white
- **Emotional intensity** — colour temperature shifts: calm = teal (#06b6d4), engaged = purple (#a78bfa), emphatic = white-hot (#f0f9ff)

Implementation: canvas-based, ~150 particles, no external library. Same Web Audio API infrastructure as the spectral analyser. Still draggable/floatable, same position persistence.

Reference image provided by Kev (2026-05-25 session) — teal/cyan glowing particle sphere on black background, equatorial band detail.

**Effort:** ~3 hours

---

### P-E: Hope tools for Mix Check + A/B Ref
*Designed 2026-05-25. Depends on P-A and P-B shipping first.*

New client tools added to `TOOL_DEFS` so Hope can see and interact with both new tabs:

- `get_mix_check_state` — returns filename, LUFS Int, LUFS Short-term, True Peak, DR, Correlation, Stereo Balance, which pills are highlighted and their severity
- `set_meter_value` — manually sets a meter value (LUFS/True Peak/DR/Correlation) in the Mix Check dashboard, same as Kev typing it in
- `get_ab_ref_state` — returns both sides of A/B Ref (filenames, all meter values, delta values) when both files are loaded
- Extend `toggle_symptom` to cover Mix Check pills (currently only Repair)

Hope proactively flags issues without being asked: if True Peak is over ceiling after a file loads, she mentions it on the next voice turn.

**Effort:** ~1.5 hours (after P-A + P-B)

---

## Planned — carry-forward from previous sessions

### DAW Bridge Epic (3 phases)
*Inspired by EchoJay review — 2026-05-24*

**Phase 1 — Plugin Scan (companion JUCE plugin, Cowork builds)**
- Lightweight VST/AU/AAX companion plugin
- Single function: scan DAW plugin list → export `aimm-plugins.json`
- User drops JSON into AIMM → Hope confirms library update
- Existing manual/screenshot/voice input kept as fallbacks
- **Research spike required before any build estimate (added 2026-09-05, see item 25 above,
  "Hope actually driving/controlling Logic Pro"):** Logic Pro does not have a rich public
  scripting/automation API like some other DAWs. Before scoping effort for B-DAW1/2/3, a technical
  spike must confirm what's actually possible — AppleScript hooks, MIDI/OSC control surfaces, or
  anything else Logic exposes. Do not carry forward an engineering estimate assumed from this
  section's existing (pre-spike) phase descriptions.

**Phase 2 — AIMM Import Handler (index.html)**
- "Sync from DAW" button
- JSON drop/import handler
- Merges with existing plugin library

**Phase 3 — Audio Capture Bridge**
- Plugin captures snippet during DAW playback
- Sends LUFS, spectrum, dynamics to AIMM via local WebSocket
- Hope advises based on actual signal data

**Other carry-forward:**
- `ingest_yt.py` → auto-update `index.json`
- Hope KB: channel crawl continuation
- iPad PWA

### ✅ Durable captures store — SHIPPED 2026-06-11 (see P0e above)
Built as scoped: `/captures` on the aimm-proxy Worker, Workers KV, app + dashboard sync with localStorage fallback. Remaining: Kev's one-time KV namespace + binding setup (`worker/README.md`).

### Hope → Mia persona rename (blocked, scoping only — captured 2026-08-04)
Rename the AIMM voice persona "Hope" to "Mia." Full spec, scope table, and phased plan: **`docs/HOPE_TO_MIA_RENAME_PLAN.md`**.

- **Blocked on:** Cat (Kevin's dedicated agent for general AIMM product engineering) must exist first — not yet built as of 2026-08-04.
- **Sequenced after:** the in-flight Mixio-violet redesign epic reaches a stable/shipped state (currently still moving — `redesign-v5-mixcheck-dashboard.html` / `ozone-redesign-v1.dc.html` added 2026-08-04).
- **Scope:** `index.html` UI text (~213 refs), `hopeRail`/`hopeSphereCanvas` DOM/CSS ids, 6 localStorage keys, `docs/mockups/`, active docs. Excludes the dormant 5-persona system (see Icebox below), `hope-kb` KB tag, and `ai-news-channel`'s unrelated "Hope."
- **Separate track:** ElevenLabs dashboard config (system prompt, first message, voice label) owned by Markey, not this repo.
- **Open decision:** localStorage key compatibility policy (read-old/write-new vs. outright rename) — needs Kevin's confirmation before work starts.

## Icebox
- Five dormant personas (Matthew, Markey, Katie, Ashley, Lauren) — one-line revival ready

---

## Platform Evolution Epic — AIMM Beyond Single-File (captured 2026-06-23)

**Decision (2026-06-23):** AIMM evolves from a single-file browser app into a proper hosted, login-based web app with a backend. No install — browser login only. Driven by two product goals that the single-file constraint cannot support: RoEx-style mix analysis (needs Librosa/Python) and HyFi-style AI online mastering (needs server-side audio processing output). Cloudflare is the primary infrastructure (Worker already live). Staged rollout — don't break the current app while building the next layer.

**Staged rollout:**

### Stage 1 — Complete the redesign (current, no architecture change)
Ship the v4 Mixio-violet redesign. Single-file stays. No backend changes.

### ARCH-1 — Backend Foundation (Stage 2)
Extend the existing Cloudflare Worker + add R2 for audio file storage + add auth (Cloudflare Access or magic-link login). Audio files persist across sessions — no re-drop on every visit. This is the gate for all subsequent ARCH stages.

**Effort:** ~1 day

### ARCH-2 — RoEx-style Mix Analysis (Stage 3)
Python microservice (FastAPI on Railway or Render) with Librosa. WAV uploads to R2, analysis job runs, results return scored grades per dimension:
- **Tonal balance** — dark / neutral / bright (spectral centroid + band energy vs genre corridor)
- **Dynamics** — PLR + crest factor, over-compression detection
- **Loudness** — platform compliance (LUFS vs target)
- **Low end** — sub (<80Hz) vs bass (80–250Hz) energy ratio
- **Stereo width** — M/S energy ratio + correlation
- **Transient punch** — onset density (first-difference RMS envelope)
- **Overall mix health score** — A–F or 0–100 weighted average

Replaces current Web Audio API approximations. Scored report card UI replaces the current meter cards. Depends on ARCH-1.

**Effort:** ~2–3 days

### ARCH-3 — HyFi-style AI Online Mastering (Stage 4)
Online mastering: upload mix → AI processes → download mastered WAV. Like LANDR / HyFi — no install, no DAW needed for the mastering step. Server-side audio processing chain (EQ → compression → limiting → stereo enhancement) informed by ARCH-2 analysis scores. Platform loudness targeting baked in (Spotify −14, Apple −16, YouTube −14, etc.). Genre-aware chain selection. Depends on ARCH-1 + ARCH-2.

**Effort:** ~3–5 days

### Stage 5 — Full product
Login with project history. Multiple mixes per project. Saved master versions. Hope's memory server-side (not just localStorage). Multi-device sync.

**Non-negotiables:**
- Online, browser login — no install ever
- Cloudflare as primary infrastructure (Worker already live, extend don't replace)
- Staged — Stage 1 (redesign) ships on single-file; ARCH-1 onward adds the backend layer
- Current single-file app stays functional throughout the migration
