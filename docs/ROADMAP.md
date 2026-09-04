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
  - D. Speaking-meter real-amplitude path is structurally verified only; a live voice call is needed to tune the ×11 gain; synthetic envelope renders headless.
  - E. Speaker button in the composer has no effect with no call live (arms the mute preference); could show a disabled state.
  - F. PRE-EXISTING: empty-state analyser hint text overlaps the "Low / Low-Mid / High-Mid / High" axis labels — long-standing, not introduced by R3, still present.

## Mix Check redesign — outstanding feedback queue (2026-09-02 round)

Operating surface: `docs/feedback/2026-09-02/BOARD.md` on branch `feedback-board` — every item there
has Kevin's marked-up screenshot, the ask, the owner and the status. This section is the durable
roadmap mirror of what is still OPEN from that round. Feedback items 1–15 (16 folded into 15), 17,
18, 20 are LIVE on `main` (build `2026-09-02.15`) — see Recently shipped. The `#N` numbers are kept
verbatim so the board, Kevin's chat and this roadmap all line up; the `9`–`14` are this roadmap's
own backlog IDs (matching the DASHBOARD.html Backlog cards). **Build in this order:**

### 9. Mix Check feedback #21 — Real section detection + issue markers on the transport waveform · owner: Cat builds, Jules specs the overlay

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

**Effort:** L.

### 10. Mix Check feedback #22 — Read-aloud button in the composer row · owner: Markey

Replace the composer-row mute/speaker button (currently a mute toggle with no effect when no call is
live) with a Read-aloud control: text selected in the chat transcript → speak just the selection;
nothing selected → read the last Hope message aloud. ElevenLabs TTS in Hope's voice, spend into the
EL bucket. **First step:** confirm the `aimm-proxy` ElevenLabs key is a valid `sk_` key — known
issue, it is currently a key ID, not an `sk_` secret. Retires the accepted Gate-2 residual E.

**Effort:** M.

### 11. Mix Check feedback #19 — Capture PC / tab audio into the Mix Check analyser · owner: Markey (capture) + Cat (wire into analyser)

A control to capture whatever is playing on the machine (e.g. Spotify) via `getDisplayMedia`
tab-audio and run it through the Mix Check analyser exactly like a loaded file. Regression — the
capability used to exist (the "Capture tab audio" bar from P0i live input metering) and there is no
button for it in the R3 Mix Check layout now. **First step:** confirm whether it was ever actually
built into the R3 layout or only planned.

**Effort:** M.

### 12. Mix Check feedback #3 — Hope tab-awareness verify + persisted-history fix · owner: Markey

Confirm on a clean live build that Hope no longer asks "was it from a Session Snapshot / the Repair
tab / your Insight tab?". Markey has confirmed the instruction text on `main` is already reconciled
(post `9797772`); the wording only reappears when pre-fix persisted chat history
(`trapMasterAiChatHistory_v1` / `AICHAT_HISTORY_KEY`) replays on load. Permanent fix: bump the
history key so pre-fix turns cannot replay. Verify method: clear the chat, analyse a fresh track,
ask Hope about a fix — she must answer directly and name no retired surface.

**Effort:** S.

### 13. Mix Check — Default tab on load should be Mix Check, not Conversation · owner: Cat

The app should open on Mix Check (`data-tab="eq"`). The markup currently hardcodes `active` on the
Conversation tab and panel; the Mix Check engine lazy-inits on first click, so switching the default
also needs an on-load init check so the tab is fully live without a manual click.

**Effort:** S.

### 14. Mix Check feedback #6 — "Clear chat" button wraps to its own line at narrow rail width · owner: Markey

At ≲380px rail width the new "Clear chat" button wraps to its own full-width line (same
`.send-col{flex-wrap:wrap}` behaviour "Attach screenshot" has always had). Jules's review called it
acceptable graceful degradation. Kevin's call whether to force it single-line at all widths (shrink
pill padding/font, or `flex-wrap:nowrap` + `min-width:0` on the row).

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
  reaction still needs a real voice call to confirm.
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

## Multi-stem Mix Check — stem upload / auto-split so Hope can see per-element measurements (captured 2026-09-04)

**Not yet scoped or built — backlog capture only, not build authorization.** Session goal
approved by Kevin 2026-09-04: move to the mockup stage (Jules builds an interactive HTML mockup
per the standing mockup-first process — see `docs/CLAUDE.md`), not to implementation.

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

Kevin hasn't picked A vs B or scoped effort.

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

## ✅ P0 — ElevenLabs Billing Fix SHIPPED (2026-06-04)

**Root cause:** Accidental single-tap starts on the sphere generating micro-sessions.
**Fix:** Double-tap guard on `micStartFromFloat()` — first tap arms (500ms sphere flash), second tap starts the session. Single taps silently do nothing. Also: `sendContextualUpdate` tab-change notifications debounced at 30s.
**Commit:** `dcd9ef7` — live on GitHub Pages.

---

## Shipped
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
- **Smoke test: YouTube KB** — verify `[YT_KB] loaded` in console, Hope can fetch SEIDS Logic Pro 101 chunks on demand (next in-office session)
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
