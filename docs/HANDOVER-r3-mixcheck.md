# HANDOVER — R3 Mix Check full-layout build

**Assume zero context.** This is the durable resume record for the R3 Mix Check redesign build.
Owner: **Cat** (`begb0037admin/cat`) — general AIMM product engineering. The Hope voice/chat surface
is **Markey's** (`begb0037admin/markey`); design review is **Jules's** (`begb0037admin/jules`).

Steps 0–6 built + committed on `r3-mixcheck-codex` (`58ee1bb`, `de1cce3`, `c5fabe9`, `0a306b2`,
`cc299f0`+`419bc43`, `99674af` step-4 Jules follow-ups, `009699a`+`17028ad` Step 5 + 5-fu,
`0aa1632` Step 6, then `0f34e5e`+`fd98850`+`18166ef` Codex mockup-05 pass + regression fix, then
the consolidation commit, then **the Codex SOLE-AUTHOR comprehensive layout pass**
(`AIMM_BUILD 2026-09-01.2`) — the real element-by-element pixel-match — then `f78a365`
(coloured waveform sections + Hope-rail flex, `2026-09-01.3`), then **`afd8363` — the strip pass**
(§1 table last row, `AIMM_BUILD 2026-09-01.4`): Kevin's region-by-region review flagged elements
the live build had that mockup 05 does NOT — Hope rail waveform reshaped to the mockup's vivid
bottom-aligned bar meter, analyser "idle · press play" status text hidden, band verdict pills
hidden, CLASSIFIED Genre-row dot hidden, rail composer reduced to Send only. Codex TP2 clean.
**Awaiting Kevin's visual sign-off** — deliverable renders `strip-fullpage.png` /
`strip-railhead.png` / `strip-analyser.png` in the session scratchpad.
Only Step 7 remains (Markey's). See §6 for the exact next action.

---

## 1. Branch + commits

> **Branch renamed as the working line 2026-09-01.** `r3-mixcheck-full` @ `2f78e2c` had a
> tab-strip-indent regression from its own Step 6 `.app-col` wrap. `r3-mixcheck-codex` =
> `2f78e2c` + `0f34e5e` (Codex mockup-05 pass) + `fd98850` + `18166ef` (regression fix +
> mobile-scope), then a consolidation commit (Jules `.mcq-tk` `200` nit + regression checks +
> restored transport clear affordance). **`r3-mixcheck-codex` is the authoritative R3 Mix Check
> branch — Kevin's ruling.** `r3-mixcheck-full` is frozen at `2f78e2c`; do NOT push to it.

- **Branch:** `r3-mixcheck-codex`, based off `main` @ `68a3ffa` ("R3 round 16") via `r3-mixcheck-full`
  @ `2f78e2c`.
- GitHub Pages serves `main`. Agent pushes to `main` are classifier-blocked → Kevin promotes manually
  (PowerShell fast-forward, at the very bottom of this doc — **DO NOT RUN yet**).
- `main`'s "R3 round 16" contains a **rejected** viewport-pinned transport bar; this build replaces it.

| Commit | Step | What it did |
|---|---|---|
| `68a3ffa` | — | base (main HEAD, "R3 round 16") |
| `58ee1bb` | 0 | Grid shell: `#eq.oz-mixcheck` → CSS `grid-template-areas` (head / banner / transport / specs+analyser / specs+actions). Deleted the round-16 viewport-pinned `#ozTransport` + its `body:has()` show rule + the `.container{padding-bottom:96px}` hack + the forced `#hopeRail{bottom:0}`. New in-flow `#mcTransport` `.oz-card` (grid-area:transport, hidden until a file loads via `:has(#refDzLoaded.visible)`). Relocation shim retargeted `#ozTransport`→`#mcTransport`. New empty wrappers `.mc-head` (grid-area:head) and `#mcActions` (grid-area:actions), collapsed while empty. `#refHopeBox` lifted out of `.oz-center` to be a direct grid child (grid-area:banner). Mobile `@media(max-width:1023px)` redefines the areas single-column. `AIMM_BUILD` → `2026-08-31.1`. |
| `de1cce3` | 1 | Panel header `.mc-head`: accent-word title `#mcTitle` (filename with a gradient `.ext` `<em>` accent once a mix loads, "Mix Check" before) + `#mcSub` format line (`analysed just now · <sr>kHz / <bits>-bit · <mm:ss>`, hidden until loaded). One `Drop / browse WAV [▾]` split-button (`#mcInputMain` opens the picker; `#mcInputCaret` toggles `#mcInputMenu` → browse file / listen live / capture tab). Removed the 3 separate left-rail Input-card buttons; `#refLiveBtn`/`#refLiveTabBtn` kept as **hidden no-op stubs** (with the `.oz-live-label` span) so the live-metering label-update code (~line 15297/15328) doesn't crash. Input card shrank to a compact dashed drop hint; `#refDropZone`/`#refDzEmpty`/`#refFileInput` stay in DOM so `wireDropZone` + `refLoadFile`/`refClearFile` still work. `#eq` + `#mcTransport` added as extra drop targets. `mcReadBitDepth(ab)` reads `bitsPerSample` from the RIFF/WAVE header **before** `decodeAudioData()` detaches the ArrayBuffer; `mcSetHeader()` drives the title/sub from `refLoadFile`, resets on `refClearFile`. Brand wordmark: `<h1>` = `AI` (solid `#fbbf24`) + `MixMasters` (gradient text off `--send-blue`); Hope rail title = yellow 3-sparkle AI-star SVG + "Hope" in the same gradient. |
| `c5fabe9` | 2 | Audio Specs panel (`#mcSpecs` — one `.oz-card`, `grid-area:specs`, `flex:1`): 3 headline tiles keep the exact inner-span ids `refLufsInt`/`refTruePeak`/`refDynRange` so `refPopulate()` writes unchanged; measured metric rows (RMS, Crest, LRA (EBU-style short-term windows), Phase/correlation `#mcCorr`, Sample rate, LUFS short-term `#refLufsSt`, True peak dup, Headroom, Noise floor) + Dissonance placeholder; `── CLASSIFIED ──` sub-block (Genre mirrors `STATE.genre`, Tempo, Key + "approx", then Subgenre/Production style/Energy/Mood placeholders). All 4 legacy meters' sub/tag/bar + `.meter-override` inputs kept in a hidden `.oz-legacy-hide` block (manual override still works). New DSP in `refAnalyse()` (additive return shape): `rmsLin`/`rmsDb`/`peakSampleLin`/`peakDb`/`crestDb`/`lra`/`noiseFloorDb`. `mcEvalSignals(r)` = plain threshold flags, ZERO DOM (replaces `refEvalPills` at its 3 call sites: `refLoadFile`, `refManualUpdate`, live-stop). `MC_SPECS.populate(r)` writes the rows; `refLoadFile` reordered so `refSpecPoints = refFileSpectrum(refBuffer)` runs BEFORE `MC_SPECS.populate` (BLOCKER-4). Tempo: lazy `import('https://esm.sh/web-audio-beat-detector@8.2.39')`, 8 s timeout, "unavailable" on fail. Key: hand-rolled Krumhansl-Schmuckler chromagram (central 25–75%, ≤90 s, ~11 kHz mono, 4096/2048 frames, chunked yield every 200 frames, generation-counter abort), rendered with a muted "approx". NO WASM/worker. `AIMM_BUILD` → `2026-08-31.2`. |
| `0a306b2` | 3 | Context banner: `#refHopeBox` restyled to `.mc-banner` — full-width flex row, blue→purple gradient border via `linear-gradient(#1b1d20,#1b1d20) padding-box, var(--send-blue) border-box` weighted 3px on the left, `border-radius:8px`, `padding:14px`. Purple info `.mcb-ico` SVG (replaces the old `HOPE — ANALYSIS` kicker, per mockup 05). `#refHopeText` unchanged as the headline target. New `<span id="mcBannerFixes" class="mcb-fixes" role="button" hidden>` after the headline — **empty/hidden until Step 4's `MC_FIXQUEUE` fills it**; `wireMcBanner()` wires its click/Enter/Space → `#mcActions.scrollIntoView({behavior:'smooth',block:'nearest'})`, removing a `mc-collapsed` class / `hidden` attr first. Dismiss `×` button `#mcBannerX` → hides the banner + sets the `_mcBannerDismissed` session flag (**no localStorage**). `refLoadFile` + `refLiveStop` clear `_mcBannerDismissed`, call `mcBannerFixesReset()`, and set `hb.style.display='flex'` (was `'block'` — needed for the new flex layout) so the banner re-shows fresh per file. **Folded-in Jules Step 2 nits:** (a) Genre/Tempo/Key spec-row dots start neutral grey `.na` and only earn their semantic dot on a real value — `mcDetectTempo`/`mcDetectKey` set `.na` while "estimating"/"unavailable", green/amber on a real result; `MC_SPECS.reset()` + `populateClassified()` updated to match. (b) `MC_SPECS.syncGenre()` (new, exported) sets the Genre row = `genreLabel(STATE.genre)` + green dot **even before a WAV loads** — seeded once right after the `MC_SPECS` IIFE and re-run from `renderLibrary()` (fires on every genre-change path: the select, snapshot restore, the voice `set_genre` tool). `AIMM_BUILD` → `2026-08-31.3`. |
| `cc299f0` (+`419bc43` TP2 fixes) | 4 | **Fix Queue + `window.mcFixQueue` contract.** New `MC_FIXQUEUE` engine IIFE (right after `MC_SPECS`): `build(r)` ranks items from `mcEvalSignals(r)` magnitudes (clips/crushed/mono/quiet direct-measure + muddy/808/harsh ratio) **plus** per-band corridor deltas via the existing `ozBandDelta()` for `low`/`lowmid`/`mid`/`high`; `score = distance-past-threshold × band weight`; dedupe (spectral bands merge a ratio-signal with its band-delta; the broadband direct-measures — true peak / dynamics / mono / loudness — dedupe on signal key so they stay distinct, per mockup 05's breakdown listing true-peak as its own #03); merged titles fold into the survivor's `why` as "also considered". `state = {items, applied:Set, dismissed:Set, sig}`, persisted `localStorage['aimmMcFixQueue_v1']`, keyed `name|size|lastModified|duration.toFixed(2)`; different sig → applied/dismissed reset. `derive(r,spec,fileSig)` from `refLoadFile` (after `refSpecPoints` + `MC_SPECS.populate`); `recompute(rOverride)` wired into `refManualUpdate` (passes the override-adjusted `rr`) + the live-stop path (passes `refLastAnalysis`); `refClearFile` → `derive(null,null,null)` empties it. New `.oz-card #mcActions` render: "FIX QUEUE" + "N / {total} applied" + progress `.track` + "Show all queued (N) ▾" (opt-in, stays open across re-renders); one `.mcq-card` (the `current()` item) — orange `#f97316` freq-target mini-graphic + `#0N` + title + `FOCUS band · IMP x · CONF y` + dismiss `×` + "Ask Hope about this" (prefills `#aiChatInput`, never auto-sends) + click-to-expand the full `why` + recommended `move` (from `MIX_ISSUE_RECIPES`) **in this centre card** (Jules hard line holds); "Play from [t]" rendered only when `playFromSec != null` (always null this build). `window.mcFixQueue` facade = `list / current / markApplied / dismiss / onChange / total / appliedCount / breakdownData` (exact §4); `list()`/`topFixes` return frozen deep copies; each `item` is exactly `{id,key,title,why,move,focusBand,freqRange:{loHz,hiHz},impact,confidence,playFromSec}`. `breakdownData()` = `{fileSignature, analysisRev (++ per derive/recompute), loudnessVsTarget:{lufsI,targetLufs,deltaDb,plr,verdict}, tonalBalanceDeltas:{low,mid,high}, transientRead:{character,crestDb,note}, topFixes:[first 3 of list()]}`. At the END of `refLoadFile`: `window.dispatchEvent(new CustomEvent('aimm:analysis-complete',{detail:window.mcFixQueue.breakdownData()}))`. `MC_FIXQUEUE.onChange(syncBanner)` + direct calls from derive/recompute keep `#mcBannerFixes` = "N action items · top fix: <title> →" (unhidden), hidden on empty queue. **Removed:** `refEvalPills` + its 3 dead call-markers; `window.mixIssueClick`; the `.aichat-mix-issues` markup (`#mixIssuePills`, 8 `.oz-chip` pills, `#mixIssueDetail`/`Label`/`Text`); the Mix-Issues slots `<script>` IIFE (`MIX_ISSUE_ALL` / `getMixIssueSlots` / `setMixIssueSlots` / `setMixIssueSlot`, `aimmMixIssueSlots_v1`); the now-orphan `.oz-issues-*` / `.oz-chip*` / `.aichat-mix-issues` / `#mixIssuePills` CSS. **Kept:** `MIX_ISSUE_RECIPES` (now feeds each item's why/move). `AIMM_BUILD` → `2026-08-31.4`. |
| `99674af` | 4-fu | **Step 4 Jules review follow-ups.** (1) Show-all queued list: the current (up-next) item stays as row 1 of the full queue (keeps "Show all queued (N)" + "n / total applied" consistent) but is now marked `.mcq-allrow.is-current` — `#f97316` left accent (`inset 3px 0 0`), faint warm `#1b1712` tint, `.mcq-alltag` "Up next" tag. The row is NOT removed. (2) `.mcq-mini` freq graphic: broadband fixes (true peak / dynamics / mono / loudness) were painting a 100%-wide `opacity:.9` orange bar reading as a meter fill — they now render a faint full-range wash via `.mcq-mini.broad i{opacity:.14}` (JS sets the `broad` flag + `left:0;width:100`); spectral-band markers keep their log-scaled position with width `Math.min(fxWd,34)` so the band always reads as a spectrum marker; `i` gets `border-radius:3px`. Base + marker gradients unchanged (already matched mockup 05). (3) Confirmed the "n / {total} applied" denominator is genuinely dynamic — `const total=items.length` at render (`index.html` ~15799); the step-4 render's 5 was coincidental. NO code change for (3). `AIMM_BUILD` → `2026-08-31.5`. |
| `009699a` | 5 | **Transport waveform + conservative energy markers.** New `MC_WAVE` engine IIFE (right after `refFileSpectrum`, exposed `window.MC_WAVE` for parity): `build(buf)` → 700 min/max buckets over a mono downmix, cached on buffer identity; `markers(buf,analysis)` → coarse recomputed energy envelopes (400 ms blocks / 100 ms hop full-band + a `sr/120` moving-avg lowpass for <120 Hz), cached, returns `[{type:'intro'|'drop'|'outro',t0,t1}]` — CONSERVATIVE: **intro** = leading run ≥8 LU below the gated median (≥1.5 s, capped 20% of duration), **outro** = same from the tail, **drop(s)** = short-term step ≥6 LU with a ≥4 LU rise in ≤2 s AND <120 Hz energy up ≥3 dB, ≤2 marks ≥20 s apart, candidates inside/against the intro-outro regions excluded; if ambiguous nothing is pushed. `draw()` renders greyscale min/max bars, a `#2fa1e6`→`#a557f4` wash over the played portion, a 1px `#eef2f5` playhead, `#f97316` marker pips/ticks + low-alpha neutral brackets + lowercase `intro`/`drop`/`outro` labels; `clear()` nulls the caches + wipes the canvas. **Drawn ONLY from inside `refIdleAnimate()` + `refLiveAnimate()`** — no competing rAF loop; `wireScrub`'s drag/seek path routes its immediate redraw through `refIdleAnimate()`. Markup: `#refScrubTrack`/`#refScrubFill` thin bar replaced by `<canvas id="mcWave" class="mc-wave">` (140 px desktop / 88 px mobile) + `#mcWaveCap` literal caption `intro / drop / outro estimated from energy — full arrangement detection with the analysis phase` (shown only when ≥1 marker); a **skip-start** button added and the control row ordered skip-start / −10 / play-pause / +10 / stop. `#mcTransport .ref-transport{flex-wrap:wrap}` + `.ref-scrub-wrap{flex:1 1 100%}` puts the full-width waveform on its own line under the controls. **Removed:** the 2 `.ref-scrub-track`/`.ref-scrub-fill` CSS rules, `window.refScrubClick` (dead with the element), and every dead `refSetStyle('refScrubFill',…)` write in `refLiveAnimate`/`refStopAudio`/`refSeek`/`refClearFile`. **LOCKED held:** no named Intro/Verse/Bridge sections, no A/B/C labels, no SSM / novelty / worker. `AIMM_BUILD` → `2026-08-31.6`. |
| `17028ad` | 5-fu | **(parallel session — from ITS own Jules review: "APPROVE WITH NOTES, 1 REQUIRED change R1".)** **Jules step-5 review R1 (required).** `MC_WAVE.draw()` label rendering only. Every canvas marker label (`intro`/`drop`/`outro`) now gets an opaque rounded chip painted **before** the glyph — fill `rgba(27,29,32,.85)` (card surface `#1b1d20` @ .85), 3px/2px padding, 2px radius — so the text always clears the bars. A mid-track `drop` now drops its orange tick to `y≈11` and hangs the label immediately **below** the tick (`chipY = tick+8`) instead of at `y≈0`; `intro`/`outro` keep their corner anchor and just gain the chip. Chip x is clamped `max(edge, min(x, cw − chipW − edge))` (edge = 2px) so it can never overflow a canvas edge. No behaviour change, no new call sites — still drawn only from `refIdleAnimate()`/`refLiveAnimate()`. Re-rendered `step5-desktop-markers.png` + `step5-mobile-markers.png` (+ a `#mcWave` crop): `drop` label clears the bars, no top clip, on both surfaces. `AIMM_BUILD` → `2026-08-31.7`. |
| `0aa1632` | 6 | **(parallel session — `#hopeRail` grid-item via the `.app-col` BLOCKER-3 fallback. Preceded by `9bb3798` self-ref SHA fill for `17028ad`.)** **`#hopeRail` height = grid-item (BLOCKER-3 resolved via `.app-col` fallback).** DOM: all app content wrapped in one new `<div class="app-col">`; `#hopeRail` relocated to be `.container`'s first child so `.app-col` is a single contiguous run → `.container` has exactly two flow children (`#hopeRail` + `.app-col`). `#railReopen` / `#buildStamp` (both `position:fixed`) move inside `.app-col`, unaffected. CSS: the base `#hopeRail` rule is stripped to VISUALS ONLY (no `position`, no `display`). `@media(min-width:1024px)`: `.container > #hopeRail{grid-column:2;grid-row:1/-1;align-self:stretch;position:static;display:flex;height:auto;max-height:none}` — `display:flex` UNCONDITIONAL (verified: rail is `display:flex` with AND without `body.rail-open` on desktop) (Markey cond. a); `grid-row:1/-1` kept for spec-fidelity but it's `align-self:stretch` that spans the app column (render: `railBottom === #mcActions bottom`, delta 0; rail runs past the viewport, not clipped). `@media(max-width:1023px)`: `#hopeRail{position:fixed;top:0;right:0;bottom:0;width:min(86vw,360px);max-height:100vh;display:none}` + `body.rail-open #hopeRail{display:flex}` — the overlay path is byte-for-byte the old behaviour (Markey cond. b). New base `.app-col{grid-column:1;min-width:0;display:flex;flex-direction:column;gap:var(--gutter)}` restores the 16px header/tabs/panel rhythm the `.container` grid `gap` used to provide. **`setRail()` unchanged** — desktop collapse stays a deliberate no-op (its existing `min-width:1024px` guard; `#railToggle` is `display:none` on desktop). Renders: `step6-desktop-open.png`, `step6-desktop-collapsed.png` (= open; desktop has no collapse), `step6-mobile-open.png` (fixed overlay, `#railToggle` visible, unchanged), `step6-mobile-closed.png` (`display:none`, `#railReopen` shown, `.aichat-layout` re-parented to the Conversation panel). Collapse/expand verified working on mobile; N/A on desktop by design. `AIMM_BUILD` → `2026-08-31.8`. |
| `2f78e2c` | 6 | (parallel session) Self-ref SHA fill for `0aa1632` in HANDOVER. **This is the frozen HEAD of `r3-mixcheck-full`** — `r3-mixcheck-codex` forks from here. |
| `0f34e5e` | codex | **Codex full-layout implementation to mockup 05.** Panel header `.mc-head .mc-cta` → flex column with a `.mc-cta-sub` caption ("browse file · live input · capture tab"). `#mcSub` format line trimmed to `48 kHz` / `48 kHz / 24-bit` (space around `kHz` and `/`, single `·` join). **Removed the transport `.ref-dz-file-row`** (the icon + `#refFileName` + `#refFileMeta` + the `✕ clear` button that called `refClearFile()`) — `#refFileName` moved inline into `.ref-transport` as `.tp-file`, `#refFileMeta` hidden. `AIMM_BUILD` → `2026-08-31.9`. |
| `fd98850` | codex-fu | **Codex-pass review follow-ups.** Restore the Mix Check tab-strip indent (broken by Step 6's `.app-col` wrap): the old `.container > .tabs.oz-tabstrip` `>`-form rule was dead once the tab strip became a grandchild of `.container`, so it's now the descendant form `.container .tabs.oz-tabstrip` (set + reset). Also trimmed `#mcSub` kHz to `48 kHz`. `AIMM_BUILD` → `2026-08-31.10` (approx — see next row). |
| `18166ef` | codex-fu | **Scope the tab-strip indent to `@media (min-width:1024px)`.** The plain descendant rule out-specified the mobile reset and leaked the 256px `margin-left` onto ≤1023px. Now `body:has(#eq.oz-mixcheck.active) .container .tabs.oz-tabstrip{margin-left:calc(var(--mc-rail-w) + var(--gutter))}` lives inside the `min-width:1024px` block; a `.container .tabs.oz-tabstrip{margin-left:0}` reset stays in the `max-width:1023px` block. **`origin/r3-mixcheck-codex` HEAD before this consolidation.** `AIMM_BUILD` = `2026-08-31.10`. |
| `18166ef` (prev row's parent) | consolidation | **Consolidate on `r3-mixcheck-codex` + Jules `.mcq-tk` nit + regression checks.** (1) Verified zero surviving `>`-form tab-strip selectors — all descendant form. (2) `.mcq-tk` axis relabel `250` → `200` (Jules: the flex `space-between` middle-left `<span>` sits at 33.3%, which on the `fxPct()` 3-decade log map is exactly 200 Hz — `fxPct()` math untouched). (3) Restored a transport clear affordance dropped in `0f34e5e`: a `× clear` button (`.tp-clear`) in `#mcTransport .ref-transport` calling `refClearFile()`. (4) Confirmed Steps 2–5 intact (`window.mcFixQueue` 8 methods, `aimm:analysis-complete` fires at end of `refLoadFile`, `MC_SPECS`/`MC_WAVE`/`MC_FIXQUEUE` present, no `refEvalPills`/`MIX_ISSUE_ALL`/mix-issue-slots tokens). (5) HANDOVER retargeted `r3-mixcheck-full` → `r3-mixcheck-codex` (§1/§2/§3/§6/§7/§8). `AIMM_BUILD` → `2026-09-01.1`. |
| `70f5515` | codex layout pass | **Codex is SOLE AUTHOR of a comprehensive element-by-element pixel-match of the whole Mix Check tab to mockup 05 (`8c2785e`).** CSS + `#eq` panel markup only — zero JS beyond the `AIMM_BUILD` bump. 3 Codex brief-iterations (medium reasoning, `codex exec` on gpt-5.6-terra): (1) full layout pass — grid/`.oz-card` radius 10 / `.mc-head` (split input button → ONE gradient `.mc-input-main` with inline caret `<span>`) / `.mc-banner` / Audio Specs (`.oz-rail`/`#mcSpecs`/tiles/rows/dots/CLASSIFIED, `#f87171`/`#fbbf24` var hexes) / analyser (deleted the 3 flex-grow rules, canvas wrap FIXED `height:230px`, 3 `.oz-spec-div` dividers, plain 4-span `.oz-spec-axis`, radial bg, band label unit spacing `20–250 Hz` etc, `.oz-band-val` 22px `var(--mono)`) / transport (`.ref-transport` children restructured to mockup `.tp-row`: `.tp-file`, flat `.tp-btns` row of 5 32×32 buttons, `#refTimeElapsed`/`#refTimeDuration` moved UP into the row with `margin-left:auto`, old `.ref-scrub-times` block deleted, `#mcWave` wrapped in `.mc-wave-box` @ 104px, `.ref-t-wrap`/`.ref-t-label` spans removed) / Fix Queue `.mcq-*` (progress track 120px, `.mcq-hint` divider+italic, `.mcq-showall`, `.mcq-x:hover` `#f87171`) / responsive mobile `.mc-head` column + full-width input + `.mc-wave-box` 88px. `.tp-clear` transport clear button REMOVED (mockup has none — `refClearFile` is UI-unreachable by design). (2) consolidation — folded a duplicate appended rule-block back into the in-place rules (one rule per selector); **fixed the filename `.wav` accent rendering as a solid gradient block** (a stray `background:` shorthand was resetting `background-clip`); deleted the `min-height:240px` flex-grow rules outright so the canvas is genuinely 230px; transport button SVGs → mockup's exact path data (rewind/forward now the mockup's circular-arrow glyphs); `#mcBannerFixes` moved to a direct child of `.mc-banner` before `.mcb-x` (mockup `.jump` position); analyser `<select>` styled to mockup `.sel`. (3) mobile-only guard so the long JS-filled `#mcBannerFixes` wraps instead of squeezing `.mcb-body` at ≤1023px. All element IDs + inline `onclick=` preserved; every Mix-Check rule scoped `#eq.oz-mixcheck`. Headless verify: `window.mcFixQueue` = 8 methods, `aimm:analysis-complete` fires, `MC_SPECS`/`MC_WAVE`/`MC_FIXQUEUE` present, `#mcWave` seek works, zero console errors, `AIMM_BUILD` `2026-09-01.2`. Codex TP2 (low-reasoning, BLOCKERS-only, pre-written diff) = **NO BLOCKERS**. **Gated on Kevin's visual sign-off** — side-by-side region renders vs mockup 05 delivered. `AIMM_BUILD` → `2026-09-01.2`. |
| `f78a365` (amended) | codex transplant | **Verbatim mockup-05 transplant pass — the two element groups `70f5515` had NOT matched.** Kevin rejected the `70f5515` render twice ("not identical to mockup 05"); most recent feedback named the Hope rail specifically ("input chat box move down", "hope panel move down"). Codex (`codex exec --approve-for-me`, medium reasoning, `index.html`-only, write mode) added: (1) **the mockup's coloured named arrangement sections on the transport waveform** — 4 `.seg` washes + `.bars#mcWaveBars` (120 cosmetic cyan→blue→orange bars via a ported `segGrad()`/`fill()` IIFE, rebuilt idempotently at DOMContentLoaded + end of `refLoadFile` + live-stop) + `.played` + 2 amber `.pip` markers + `.secs` ruler with `Intro/Verse/Bridge/Verse` labels at the mockup's 22/30/22/26% widths and exact colours. `<canvas id="mcWave">` KEPT as a transparent (`opacity:0`, `pointer-events:auto`, `z-index:6`) pointer-capture overlay so real seek/scrub + `MC_WAVE.build/draw/markers` keep working. This supersedes the §4 "no named sections" lock (see §4). (2) **Hope rail = mockup `.rail` flex column** — desktop `@media(min-width:1024px)` block: `#hopeRail{flex-direction:column}`, `.rail-body{flex:1;min-height:0;display:flex;flex-direction:column}`, `.aichat-layout`+`#aiChatTranscript` set `flex:1;min-height:0;max-height:none` (removes the old `38vh`/`flex:0 1 auto` caps) so the transcript FILLS the rail height and `.aichat-compose` (with a `border-top`, 12px pad) PINS to the bottom. Composer buttons (Send/Attach/Clear) + all ids/handlers unchanged; `setRail()`/`aichatSend`/mobile overlay rules untouched. Plus: mockup scoped tokens (`--mono`, `--accent-a/-b`, `--grad` via vars); `.card`/`.tile`/`.specs`/`.an-wrap`/`.transport`/`.tp-row` mockup class aliases added alongside the live `.oz-*` classes; `#mcActions` `MC_FIXQUEUE` render template classes aligned to the mockup (`ai-head`/`qhr`/`qcard`/`qk`/`qrow`/`qfx`/`qmini`/`qtk` + "applied"→"done" label); banner radius 10→8. **Cat mechanical fix (folded in):** `#eq.oz-mixcheck .mc-wave-cap{display:none}` — mockup has no caption under the wave and the "estimated from energy" copy is inaccurate now the sections are fixed cosmetic layers. Headless CDP verify (`envmix.wav`, musical envelope): `window.mcFixQueue` 8 methods, `MC_SPECS`/`MC_WAVE`/`MC_FIXQUEUE` present, `#mcWave` pointer-seek dispatch did not throw, `mcWaveBars`=120 / `.secs` span×4 / `.seg`×4 / `.pip`×2, rail `railBodyH 1099` `transcriptH 791` `composerBottomGap 12` (composer pinned bottom, transcript fills), zero console errors, `build 2026-09-01.3`. `AIMM_BUILD` → `2026-09-01.3`. **Gated on Kevin's visual sign-off** — full-page renders `page-v2.png` (WAV loaded) + `page-v2-empty.png` (no WAV) delivered. |
| `afd8363` | codex strip | **Strip the Mix Check tab to mockup 05 EXACTLY — remove/reshape everything the mockup lacks (Kevin's region-by-region review).** Codex (`codex exec` medium reasoning, `index.html`-only, write mode) authored 100%; Cat wrote the brief + reviewed + rendered. Mix-Check-scoped CSS + ONE band-fill render line — no engine/logic touch. Diff = 32 ins / 28 del. **(1) Hope rail waveform `#hopeWave`:** greyscale near-flat sliver → vivid **bottom-anchored** 40-bar meter; `linearGradient` flipped vertical (`x2=0 y2=1`) with the mockup's 4 stops `#2ee6c6 / #3b82f6 .45 / #a855f7 .78 / #ec4899`; all 40 `<rect>`s rewritten to a shared baseline (`y=60−h`, heights ~8–52); CSS drops `filter:grayscale(1) brightness(1.18)`, `opacity:.5→.45`, `height:34px`, `margin-top:12px`, `transform-origin:center→bottom`, `@keyframes hopeWaveIdle` calmed to `scaleY(.82→1)`. **PRESERVED:** `id="hopeWave"`, `data-speaking`, `--wave-amp` hook, `[data-speaking="1"]` states + `@keyframes hopeWaveTalk` + the per-rect `animation-delay` list (all re-scoped `#hopeRail`). `.rail-head` un-pinned from `min/max-height:142px` → content-sized (**probe: 124px**), `padding:16px 14px 12px`, `flex-direction:column`; the three `.rail-head` base rule-groups re-scoped `#hopeRail`. **(2) Analyser status:** `#eq.oz-mixcheck #refSpecStatus{display:none !important}` — permanent in-tab hide the JS `.className=` writes can't undo; `refSetEl` textContent writes still no-op safely (element kept). **(3) Band verdict pills:** `#eq.oz-mixcheck #ozBandLowTag,#ozBandMidTag,#ozBandHighTag{display:none}` (nodes kept, `ozPopulateBands` still writes to them harmlessly); band-fill JS render changed — `pct=Math.min(34,Math.max(4,|d|*8.33))` short centred segment, `background='var(--grad)'` always (dropped the `#5aa9e6`/`#ffb454` delta recolour). `.oz-band-bar`/`center`/`fill` already matched mockup `.band .bar`/`b`/`i`. **(4) Stray "+":** searched `#eq .oz-center` / `.oz-band-grid` / `#refSpecWrap` — **no such control exists** in the live build; no change (flagged to Kevin — could not reproduce it in renders). **(5) Analyser axis:** `.oz-spec-axis` already byte-matches mockup `.an .ax` (`bottom:8px`, `font:9px Inter`, `#5b6068`, 4 `flex:1;text-align:center` spans) — verified, unchanged. **Sweep:** banner radius `8→10`; CLASSIFIED **Genre-row status dot** `#eq.oz-mixcheck #mcdGenre{display:none}` (mockup Genre row has no dot; `#mcdGenre` kept for `MC_SPECS.syncGenre()`); **rail composer** reduced to Send only — `#hopeRail .aichat-compose .send-col #aiChatImageBtn` + `#aiChatClear` → `display:none` (nodes + click handlers kept, no null-ref); textarea placeholder → `"Ask Hope about a fix…"`. `AIMM_BUILD` `2026-09-01.3 → 2026-09-01.4`. **Codex TP2 (BLOCKERS-only, low reasoning, `< /dev/null`, ~39k tok): NO BLOCKERS.** Headless CDP probe (`envmix.wav`): `window.mcFixQueue` = exactly 8 methods, `mcFixQueue.total()`=4, `MC_SPECS`/`MC_WAVE`/`MC_FIXQUEUE` all `object`, `#hopeWave` present with `data-speaking="0"` + 40 rects + `opacity:.45` + `filter:none`, `#refSpecStatus` computed `display:none`, all 3 `#ozBand*Tag` `display:none`, `#mcdGenre` `display:none`, rail `#aiChatImageBtn`/`#aiChatClear` `display:none` + `#aiChatSend` `display:block`, chat send click executed without throwing (headless has no API → graceful "Failed to fetch" toast, path confirmed live), `railHeadHeight:124`, `AIMM_BUILD 2026-09-01.4`, **0 console errors**. `aimm:analysis-complete` not re-triggered in-probe (fires inside `refLoadFile`, already run) but the diff touches neither `refLoadFile` nor the dispatch. **Committed by Codex self-commit** as `afd8363` — message reads `Match Mix Check strip to mockup 05` (not Cat's briefed subject line) and lacks the `Co-Authored-By: Claude Sonnet 5` / `Claude-Session:` trailers; a message-only `--force-with-lease` amend was blocked by the auto-mode classifier, so `afd8363` stands as-is (content is correct; force-rewriting pushed history for a subject line wasn't worth it). Pushed `0e96e77..afd8363` → `origin/r3-mixcheck-codex` ONLY; `origin/main` (`68a3ffa`) + `r3-mixcheck-full` (`2f78e2c`) untouched. **Gated on Kevin's visual sign-off** — deliverables `strip-fullpage.png` / `strip-railhead.png` / `strip-analyser.png` in the session scratchpad. |

This file is committed alongside each step's `index.html` change. `docs/ROADMAP.md` + `DASHBOARD.html`
get their consolidated R3-Mix-Check update in the **final docs commit** (§3 "Final commit"), not per
step — this doc is the live planning surface for the epic until then.

**Local render tooling:** recreate the CDP screenshot driver in the **SESSION Temp scratchpad** each
session — NOT in the repo (`aimm/scratchpad/` is not gitignored). Node 24 has a global `WebSocket`
(undici flavour — use `addEventListener('message', …)`, not `.on`) + `fetch`. Launch Chrome
(`C:/Program Files/Google/Chrome/Application/chrome.exe`) with `--headless=new
--remote-debugging-port=<p> --user-data-dir=<tmp> --window-size=W,H`; connect to a **page** target
(`http://127.0.0.1:<p>/json/list` → `type==='page'` → its `webSocketDebuggerUrl`; the `/json/version`
browser endpoint rejects `Page.enable`). `Page.navigate` → wait `Page.loadEventFired` → activate the
tab with `Runtime.evaluate` `document.querySelector('.tab.oz-tab[data-tab="eq"]').click()` → for a
WAV-loaded shot, `DOM.querySelector` `#refFileInput` + `DOM.setFileInputFiles` (backslash path) then
sleep ~9 s for `refLoadFile` (decode + analyse + tempo `import()` + key chromagram) → `Emulation.
setDeviceMetricsOverride` + `Page.captureScreenshot {captureBeyondViewport:true, clip}`. Serve with
`python -m http.server 8791 --directory "C:/Users/admin/github/aimm"`, shoot
`http://localhost:8791/index.html`. A working copy of this driver from the Step 3 session:
`…\<session-id>\scratchpad\shot.mjs` (+ `testmix.wav`, an 8 s stereo 44.1 kHz test file).

---

## 2. Codex review status (mandatory 3-touchpoint policy, 4-pass cap per touchpoint)

- **TP1 (plan review): DONE — verdict: approve-with-notes.** One thorough full-reasoning pass produced
  5 BLOCKERs + ~12 SHOULD-FIX. **All folded into the plan below** with concrete fixes. Two follow-up
  "verify-the-fixes" passes timed out at 9–10 min each (Codex/gpt-5.6 on this repo size is slow) — not
  re-run; treated as satisfied by the substantive pass 1 (Codex-scarcity fallback in
  `agent-commons/operating-model/COORDINATOR_AND_CODEX_POLICY.md`).
- **TP2 (steps 0–1 diff): DONE — verdict: PASS, no blockers.** Two full-reasoning passes timed out;
  a third pass with `-c model_reasoning_effort="low"` completed (~27k tokens) and found **no blockers**:
  all visible grid children have a `grid-area` (remaining direct children are hidden — `#refFileInput`,
  the legacy wrapper); relocation shim correct; `mcReadBitDepth` runs before `decodeAudioData`; hidden
  live-button stubs prevent ReferenceErrors; mobile grid-area override syntactically correct.
- **TP2 (step 2 diff): DONE — Codex-clean, no blockers** (Jules render review = APPROVE WITH NOTES,
  §5). Committed `c5fabe9`.
- **TP2 (step 3 diff): DONE — verdict: NO BLOCKERS (1 pass, ~67k tokens, low-reasoning).** Diff
  pre-written to the SESSION Temp scratchpad; Codex traced the new selectors + the deferred `MC_SPECS`
  access (guarded) + the changed tempo/key dot paths and found nothing. Fix cap: 1 of 4 for this
  touchpoint. Rendered desktop + mobile + empty-state, all clean (§5).
- **TP2 (step 4 diff): DONE — verdict: NO BLOCKERS (2 passes, low-reasoning).** Pass 1 (~13k tokens)
  raised two minor items — a lingering `refEvalPills` **string in a lineage comment** (not a code ref),
  and `derive()` pruning stale ids without a `persist()` afterward. Both fixed in follow-up commit
  `419bc43` (reworded the comment; added `persist()` after `pruneSets()` in `derive`). Pass 2
  (~41k tokens) re-checked and confirmed clean: `refEvalPills` absent, `derive()` now
  `pruneSets(); persist();`, no dangling refs to the deleted mix-issue globals/markup, and
  `window.mcFixQueue` exposes **exactly** the 8 methods `list / current / markApplied / dismiss /
  onChange / total / appliedCount / breakdownData`. Fix cap: 1 of 4 for this touchpoint.
- **TP2 (step 4-fu + step 5 diff): DONE — verdict: NO BLOCKERS after 1 fix (pass 1 substantive,
  ~38k tokens, low-reasoning; pass 2 blocked by Codex usage-limit — retry-at ~22:05).** Pass 1
  returned 5 OK + 1 BLOCKER: `MC_WAVE.draw()` was called directly from the `wireScrub` drag handler,
  so waveform drawing wasn't strictly limited to `refIdleAnimate()` / `refLiveAnimate()`. Fixed in
  this same commit — the drag `applyFrac()` now does `cancelAnimationFrame(refRaf); refIdleAnimate();`
  and `MC_WAVE.draw()` is invoked ONLY from `refIdleAnimate()` (15125) + `refLiveAnimate()` (15147);
  `.clear()` only from `refClearFile`. Verified by grep + `node --check` + clean CDP renders (no
  console errors). Pass 1 OKs: scrub retargeted to `#mcWave` with pointer-capture lifecycle intact;
  no runtime refs to `#refScrubTrack`/`#refScrubFill`/`refScrubClick` or dead `refSetStyle` writes;
  `build`/`markers` cache on buffer identity so per-frame `draw()` stays O(1); marker math guarded
  for short/near-silent buffers + array bounds; LOCKED no-named-sections / no-SSM / no-worker holds.
  Pass 2 could not run (Codex quota) — treated as satisfied via the direct verification of the
  one-line fix (Codex-scarcity fallback). Fix cap: 1 of 4 for this touchpoint.
- **TP2 (step 5-fu / Jules R1 diff): DONE — verdict: NO BLOCKERS via direct verification (Codex
  still quota-blocked, every invocation errors immediately at the usage-limit gate, no review
  tokens spent).** The R1 change is label-render-only inside `MC_WAVE.draw()`. Direct-verified:
  (1) the chip `g.fill()` (`rgba(27,29,32,.85)`) is executed **before** `g.fillText(mm.type,…)`;
  (2) `chipX = Math.max(edge, Math.min(lx − cPadX, cw − chipW − edge))` — all inputs finite
  (`cw` guarded `>0` at the top of `draw()`, `tw` from `measureText` on a static string), no
  division, no NaN path, and it cannot place the chip off-canvas for any realistic width
  (label ≤ ~30px, canvas ≥ 360px); (3) `draw()` call sites unchanged — still only
  `refIdleAnimate()` (15125) + `refLiveAnimate()` (15147), `.clear()` only from `refClearFile`;
  (4) no new globals / no removed-symbol refs, `g.arcTo` is standard Canvas2D; `new Function()`
  parse of the whole `MC_WAVE` IIFE is clean. Re-rendered desktop + mobile markers (+ crop),
  no console errors, `drop` label chipped + below its tick + no top clip on both surfaces.
  Fix cap: 0 of 4 for this touchpoint (no fixes needed).
- **TP2 (step 6 / `0aa1632` diff): NO COMPLETED CODEX PASS — flag for TP3 to cover end-to-end.**
  The parallel session that shipped `0aa1632` did **direct verification only** (no Codex tokens
  spent — Codex was quota-blocked at the time). A later coordinator background Codex pass on this
  diff **timed out** and was not re-run. So Step 6's `.app-col` wrap + the `#hopeRail` grid-item
  rules have **not** had an actual Codex review — **TP3 (full `main...r3-mixcheck-codex`) must
  explicitly cover the Step 6 changes end-to-end.** The direct-verification findings from the
  parallel session are retained below as the interim record: (1) `@media(min-width:1024px)` /
  `@media(max-width:1023px)` are disjoint and exhaustive (1023 < 1024); (2) the rewritten base
  `#hopeRail` rule carries NO `position` and NO `display` (desktop `getComputedStyle` →
  `position:static`, `display:flex`); (3) desktop `display:flex` is unconditional — rail stays
  `display:flex` with `body.rail-open` removed; the old global `body.rail-open #hopeRail` rule
  now lives ONLY inside the `<=1023px` block; (4) the `<=1023px` block has
  `position:fixed;top/right/bottom;width:min(86vw,360px);display:none` + `body.rail-open →
  display:flex` (mobile render: `position:fixed`, full-viewport height, overlay + box-shadow);
  (5) `.container.children` → exactly `[#hopeRail, .app-col]`; (6) `git diff` changes ZERO JS
  lines — `setRail()` byte-identical, and 4 renders + a probe navigation exercised
  init/open/close re-parenting with no console errors; (7) `<div>`/`</div>` balance is the
  same (+1, pre-existing) as `9bb3798` — the `.app-col` wrap added one matched open/close, the
  `.container` subtree depth-walks to exactly two children and closes cleanly.
- **TP2 (`0f34e5e` + `fd98850` + `18166ef` Codex mockup-05 pass): partial.** These landed via the
  parallel/coordinator Codex-implementation route (`0f34e5e` message = "Codex full-layout
  implementation to mockup 05"); `fd98850`/`18166ef` are its own review follow-ups. No separate
  standalone Cat-run TP2 diff review is on record — **also fold into TP3.**
- **TP2 (consolidation commit `18166ef..HEAD` diff): DONE — verdict: NO BLOCKERS (1 pass,
  ~53.5k tokens, low-reasoning).** Diff pre-written to the SESSION Temp scratchpad; `codex exec
  -s read-only -c model_reasoning_effort="low"`, BLOCKERS-only. Scope: `.tp-clear` button + CSS,
  `.mcq-tk` `250`→`200` relabel, `AIMM_BUILD` bump. Codex traced `refClearFile` (defined,
  `window.refClearFile=function(){…}`), the new selector (no dup, valid), and the button's place
  in the `.ref-transport` flex-wrap row — nothing. Pass count: 1 of 4 for this touchpoint.
- **TP2 (Codex SOLE-AUTHOR comprehensive layout pass — §1 table last row): DONE — verdict:
  NO BLOCKERS (1 pass, ~26k tokens, low-reasoning, BLOCKERS-only, pre-written cumulative diff).**
  Codex traced the full CSS + `#eq`-markup diff for: JS/behavioural changes (none beyond the
  `AIMM_BUILD` string), removed/renamed element ids (none — all preserved, only moved), dropped
  inline `onclick=` on the transport buttons (none), CSS leaking out of `#eq`/`#eq.oz-mixcheck`
  scope (none — every rule scoped), broken/unbalanced `#eq` HTML (balanced: 210/210 `<div>` in
  the panel, was 213/213, net −3 for the removed `.ref-t-wrap`/`.ref-scrub-wrap` wrappers),
  re-introduced `.tp-clear` (absent), edits to `#hopeRail`/`.aichat-layout`/`#aiChatTranscript`
  (none), changes to `MC_WAVE`/`MC_SPECS`/`MC_FIXQUEUE`/`window.mcFixQueue`/`aimm:analysis-complete`
  (none). **`TP2: NO BLOCKERS`.** Fix cap: 0 of 4 for this touchpoint. Headless CDP verify
  (envelope-shaped test WAV, quiet→loud→quiet): `window.mcFixQueue` 8 methods, `aimm:analysis-complete`
  fired, `MC_SPECS`/`MC_WAVE`/`MC_FIXQUEUE` present, `#mcWave` seek dispatch did not throw, no
  console errors, `AIMM_BUILD 2026-09-01.2`. Jules render review + Kevin's visual sign-off still
  outstanding (see §6).
- **TP2 (`f78a365` verbatim transplant diff — coloured waveform sections + Hope-rail flex):
  PENDING as of this write.** Codex authored the diff in write mode and self-committed; Cat's
  headless CDP verify passed (8 `mcFixQueue` methods, `MC_SPECS`/`MC_WAVE`/`MC_FIXQUEUE` present,
  `#mcWave` seek dispatch no-throw, no console errors, `build 2026-09-01.3`). A BLOCKERS-only
  low-reasoning `codex exec` TP2 pass on the `fe1cb52..HEAD` diff is the next Codex action; fold
  into TP3 if the standalone pass can't complete. **This transplant supersedes the residual
  waveform deviation (a) in §3 — the coloured named sections + labelled ruler are now present.**
- **TP2 (`afd8363` strip-to-mockup-05 diff — Hope waveform / analyser status text / band verdict
  pills / composer): DONE — verdict: NO BLOCKERS** (1 pass, ~39k tokens, `codex exec -s read-only
  -c model_reasoning_effort="low"`, BLOCKERS-only, pre-written diff `scratchpad/tp2.diff`, `<
  /dev/null`). Codex quoted the full 155-line diff and checked all 7 blocker criteria: no
  `MC_WAVE`/`MC_SPECS`/`MC_FIXQUEUE`/`window.mcFixQueue`/`aimm:analysis-complete`/`refAnalyse`
  change; chat send intact; `#hopeWave` `id`/`data-speaking`/`--wave-amp`/`[data-speaking="1"]`
  states all preserved; composer buttons + `#refSpecStatus` + `#ozBand*Tag` `display:none` (not
  deleted); every rule scoped `#eq.oz-mixcheck` or `#hopeRail`; band-fill line syntactically
  clean; no pictographic emoji added. Fix cap: 0 of 4. (Codex spent ~1 pass of prelude re-reading
  agent-commons routing docs before reviewing — its own local `AGENTS.md` fleet instructions; the
  review itself was sound.)
- **Remaining Codex passes:** **TP3** = full `main...r3-mixcheck-codex` end-to-end — and it MUST
  explicitly cover Step 6 (`0aa1632`), the `0f34e5e`/`fd98850`/`18166ef` mockup-05 pass, the
  `f78a365` transplant, AND `afd8363` (though `afd8363` HAS a completed standalone TP2), none of
  the first three of which has a completed standalone Codex TP2. (The Codex SOLE-AUTHOR layout
  pass above HAS a completed standalone TP2.)
- **4-pass cap:** TP1 used 3 attempts (1 substantive + 2 timeouts). TP2 used 3 attempts (2 timeouts + 1
  substantive). Both within cap. Reset per touchpoint going forward.
- **Codex invocation that works here:** `codex exec -s read-only --skip-git-repo-check -c model_reasoning_effort="low" -C "C:\Users\admin\github\aimm" "<terse prompt, point it at a pre-written diff file in scratchpad, ask for BLOCKERS ONLY>"` with a ~340s `timeout`. Full-reasoning passes reliably exceed 9 min and get killed.

**Codex findings deferred (larger, not yet actioned) — carry as open items:**
- BLOCKER-3 — **RESOLVED in Step 6 via the `.app-col` fallback (the naive `grid-row:1 / -1`
  path was render-tested and FAILED).** Naive test (`grid-row:1 / -1` on `#hopeRail`, no DOM
  change): rendered `railH ≈ 544px`, ending ~1268px ABOVE `#mcActions` — as predicted, `-1`
  resolves against a grid with no explicit rows so it collapses to a single-row span. Shipped
  fix: all app content (header + tab strip + every `.panel` + the fixed `#railReopen` /
  `#buildStamp`) is wrapped in ONE `<div class="app-col">`, and `#hopeRail` is relocated to be
  `.container`'s FIRST child so `.app-col` can be one contiguous run. `.container` now has
  exactly two flow children (`#hopeRail` + `.app-col`, verified live:
  `[...container.children] → "hopeRail | app-col"`). `#hopeRail{align-self:stretch}` then
  matches the app column's height — render confirms `railBottom === mcActionsBottom` (delta 0)
  and the rail extends past the viewport bottom (not clipped at 100vh). `.app-col` also carries
  `display:flex;flex-direction:column;gap:var(--gutter)` to preserve the 16px rhythm the
  `.container` grid `gap` used to give header/tabs/panel (they're block-flow children now).
- BLOCKER-5 (LRA): implement proper EBU-R128-style (short-term 3 s/100 ms hop, abs gate −70 LUFS, rel
  gate at mean−20 LU, then P95−P10). Not "P95−P10 of raw windows".

---

## 3. The full 8-step plan (0–6 DONE on `r3-mixcheck-codex`, 7 REMAINING — Markey's)

> Steps 0–6 are all ✅ DONE and committed on `r3-mixcheck-codex` (SHAs in the §1 table).
> Step 5-fu = `17028ad`, Step 6 = `0aa1632` (BLOCKER-3 resolved via the `.app-col` fallback:
> all app content wrapped in one `<div class="app-col">`, `#hopeRail` made `.container`'s first
> child, `.container` now has exactly 2 flow children). On top of Step 6, the Codex mockup-05
> pass (`0f34e5e` + `fd98850` + `18166ef`) + a consolidation commit landed on `r3-mixcheck-codex`,
> and then **the Codex SOLE-AUTHOR comprehensive layout pass** (§1 table last row, `2026-09-01.2`) —
> this is the *real* full element-by-element pixel-match of the whole Mix Check tab to mockup 05
> (the earlier `0f34e5e` pass was narrower). Codex authored 100% of it across 3 brief-iterations;
> the coordinator did brief refinement + region-by-region render comparison only, no hand-implementation.
> TP2 clean. **Gated on Kevin's visual sign-off** (§6) — then Step 7 (Markey's) is the only thing left.
>
> **Residual mockup deviations to raise at Kevin's visual review (NOT bugs — all either LOCKED,
> data-driven, or intentional live-only elements):** (a) ~~greyscale energy waveform, no coloured
> sections~~ **RESOLVED in `f78a365`** — the transport waveform now has the mockup's coloured
> `.seg` section washes + 120 cyan→blue→orange `.bars` + `Intro/Verse/Bridge/Verse` `.secs` ruler
> + amber `.pip` markers (fixed cosmetic layers; caption hidden). Live-only remainders still to
> flag: the real `MC_WAVE` greyscale/played-wash/energy-pips still paint on the now-transparent
> `#mcWave` overlay (not visible), and the sections are fixed proportional positions, not detected;
> (b) ~~`#refSpecStatus` ("idle · press play") in the analyser header~~ **RESOLVED in `afd8363`**
> — `display:none !important` in-tab; (c) ~~per-band verdict pills (`#ozBandLowTag` etc,
> "↓ LOW VS TARGET" / "✓ ON TARGET")~~ **RESOLVED in `afd8363`** — `display:none` in-tab, band
> cards now label / value / bar only per the mockup; (d) an extra "LUFS short-term" spec row
> (live design, Step 2 — still a deliberate deviation); (e) ~~CLASSIFIED Genre row keeps a 7px
> status dot~~ **RESOLVED in `afd8363`** — `#mcdGenre{display:none}` (all other classified rows
> keep their dot, matching the mockup); (b2/NEW) Kevin flagged a stray "+" control between the
> band cards — Cat could NOT reproduce it in any 1440-desktop render (loaded or empty) and found
> no such element in the analyser/band subtree; **needs Kevin to point at it** if still present;
> (f) Fix-Queue copy "N / M applied" and the tick "…200…" vs the mockup's "N / M done" / "…250…"
> are JS-emitted strings, not layout; (g) the Audio Specs rail is `flex:1` so CLASSIFIED
> bottom-aligns (matches the mockup's own CSS — just more visible with real content); (h) head is
> ~10px taller than the mockup's 56px.

Spec: `begb0037admin/jules` `mockups/05-r3-mixcheck-full-layout.html` @ `8c2785e` (authoritative over
the blueprint `blueprints/r3-mixcheck-layout.md` where they differ). Single-file `index.html`, no build,
no framework. Keep the `// ==========` section style. **Bump `AIMM_BUILD` every commit touching
index.html** (`YYYY-MM-DD.N`). **No pictographic emoji anywhere in static UI** — plain text or existing
dingbats (`×` `✓` `★` `＋` `↑` `↓`).

### Grid (done in Step 0, for reference)
```
#eq.oz-mixcheck: grid-template-columns: var(--mc-rail-w) minmax(0,1fr); align-items:start;
  grid-template-areas: "head head" "banner banner" "transport transport" "specs analyser" "specs actions";
Mobile <=1023px: grid-template-columns: minmax(0,1fr);
  grid-template-areas: "head" "banner" "transport" "specs" "analyser" "actions";
```

### Step 0 — grid shell + de-pin transport ✅ DONE (`58ee1bb`)

### Step 1 — panel header + single input control + brand ✅ DONE (`de1cce3`)

### Step 2 — Audio Specs panel (absorb the 4 meter cards) + new browser DSP — ✅ DONE (`c5fabe9`)
Rendered + reviewed: Jules verdict **APPROVE WITH NOTES** (see §5). Sub-scope as originally planned:
Full sub-scope:
- Replace `.oz-rail` inner (the 4 `.oz-card` meter cards + the shrunk Input card) with **one `.oz-card`
  "AUDIO SPECS"** (`grid-area:specs`, `align-self:stretch`, `flex:1` so it stretches level with the
  bottom of the Fix Queue):
  - **3 headline `.tile`s**: Loudness (`<span id="refLufsInt">`), Peak (`<span id="refTruePeak">`),
    DR (`<span id="refDynRange">`). **Keep those exact ids as inner spans** so `refPopulate()` writes
    unchanged. Keep `refLufsInt/Sub/Tag/Bar` + the `.meter-override` inputs for ALL FOUR meters
    (incl. `refLufsSt`) inside a `.oz-legacy-hide` wrapper in the card — manual override stays, hidden
    (current behaviour). `#refLufsSt` (LUFS short-term) has no tile in the mockup → render it as a
    metric row so `refPopulate`'s `refSetEl('refLufsSt',…)` still has a target.
  - **Metric `.row`s** (status dot + label + mono value), REAL now: RMS (dBFS), Crest factor (dB),
    LRA (LU — EBU-style, see BLOCKER-5), Phase / correlation (reuse `refCorrVal` or add `#mcCorr`),
    Sample rate, True peak (dup of tile — OK, mockup has it), Headroom (`= −tp` dB), Noise floor
    (dBFS — 10th-percentile of 400 ms-block RMS, excluding blocks < −90 dBFS). **Dissonance = placeholder**
    ("with full analysis" + `.d.na` dot).
  - **`── CLASSIFIED ──` sub-block**: Genre (mirrors `STATE.genre`, ok/green dot), Tempo (real bpm or
    "unavailable", ok dot), Key (real estimate + a muted "approx" qualifier, **amber dot**), then
    **Subgenre / Production style / Energy / Mood** as placeholder rows — value text = literal muted
    "with full analysis", `.d.na` grey dot, identical styling on all, not italic. Real rows come FIRST,
    placeholders grouped under.
- **New DSP in `refAnalyse()`** — return-shape ADDITIVE (only caller is `refLoadFile`, no spread/index
  consumer): add named `rmsLin`, `rmsDb`, `peakSampleLin`, `peakDb`, `crestDb` (`20·log10(peak/rms)`),
  `lra`, `noiseFloorDb`. `rms` is already computed internally (line ~15078) — just also return it.
- **`mcEvalSignals(r)`** — rename/repurpose the ex-`refEvalPills` logic to return **plain threshold
  flags, ZERO DOM** (`{clips,crushed,mono,muddy,low808,harsh,quiet}` + magnitudes). **BLOCKER-2:**
  `refManualUpdate()` (~line 14951) AND the live-stop path (~line 15243) currently call `refEvalPills()`
  — do NOT leave a dangling reference. Point them at `mcEvalSignals` + `MC_FIXQUEUE.recompute()` +
  `MC_SPECS.populate()`.
- **`MC_SPECS.populate(r)`** — writes the metric rows + classified block. Call it from `refLoadFile`
  right after `refPopulate`. **BLOCKER-4:** reorder `refLoadFile` so `refSpecPoints =
  refFileSpectrum(refBuffer)` runs BEFORE `MC_SPECS.populate` and `MC_FIXQUEUE.derive` (per-band
  corridor deltas need `refSpecPoints`; today `refFileSpectrum` runs after `refPopulate`).
- **Tempo:** lazy `const { analyze } = await import('https://esm.sh/web-audio-beat-detector@8.2.32')`
  (pin the exact 8.x — verify latest at build), `await analyze(refBuffer)` → round to int. 8 s timeout
  + try/catch → Tempo row "unavailable" (never a fake number). Cache on the buffer. Works on HTTPS +
  `localhost`; may not on bare `file://` — test via the http.server. **NO WASM.**
- **Key:** hand-rolled, ~100–120 lines, clearly a stopgap. Bounded: analyse ~90 s from the 25–75%
  region, decimate to ~11 kHz mono, ~4096-sample frames / 2048 hop, accumulate a 12-bin chromagram
  (`12·log2(f/440)` fold), correlate vs Krumhansl-Schmuckler major + minor profiles rotated through
  12 tonics → tonic + mode. **Chunk the frame loop** (`await new Promise(r=>setTimeout(r))` every ~200
  frames) so the main thread doesn't jank; show "estimating key…"; abort on a new file (generation
  counter). Render e.g. `F minor` + a muted "approx". **NO WASM, no worker.**

### Step 3 — context banner (restyle `#refHopeBox`) — ✅ DONE (`0a306b2`)
- `#refHopeBox` → `.mc-banner`: full-width flex row, blue→purple gradient border
  (`linear-gradient(#1b1d20,#1b1d20) padding-box, var(--send-blue) border-box`, 3px left / 1px rest),
  `border-radius:8px`, purple `.mcb-ico` info SVG, `#refHopeText` unchanged as the headline target.
- Dismiss `#mcBannerX` `×` → hide + `_mcBannerDismissed` **session flag, no localStorage**.
  `refLoadFile` + `refLiveStop` clear the flag, call `mcBannerFixesReset()`, and set
  `hb.style.display='flex'` (was `'block'`) so it re-shows fresh per file. `refClearFile` still hides it.
- `<span id="mcBannerFixes" class="mcb-fixes" hidden>` built + `wireMcBanner()` click/keyboard handler
  wired (`#mcActions.scrollIntoView`, clears a `mc-collapsed` class / `hidden` attr first) but **left
  empty/hidden — Step 4's `MC_FIXQUEUE.onChange` populates it** (`// Step 4:` marker left in place).
- **Jules Step 2 nits folded into this same commit:** neutral `.na` dots on Genre/Tempo/Key until a
  real value; `MC_SPECS.syncGenre()` makes the Genre row mirror `STATE.genre` from init (seed call +
  `renderLibrary()` hook), not only in `refLoadFile`.

### Step 4 — Fix Queue (`grid-area:actions`) + `window.mcFixQueue` contract — ✅ DONE (`cc299f0` + `419bc43`; Jules follow-ups `99674af`)
**This is the step that unblocks Markey.** Built as specced below. Notes on what landed:

**Jules step-4 render review = APPROVE WITH NOTES, 2 CHANGES REQUIRED — both ACTIONED in `99674af`:**
1. Show-all queued list keeps the current item as row 1 (consistent with "(N)" + "n / total applied")
   and now marks it `.mcq-allrow.is-current` (`#f97316` left accent + faint tint + "Up next" tag) so
   the repeat reads as "you're actioning this now", not a duplicate bug.
2. `.mcq-mini` freq graphic calmed: broadband fixes render a faint full-range wash
   (`.mcq-mini.broad i{opacity:.14}`) instead of a 100%-wide `opacity:.9` bar; spectral markers are
   width-capped at 34% so they always read as a spectrum marker, not a level meter.
   The `{total}` denominator was already dynamic (`const total=items.length`) — no code change.
- **Grep result (mix-issue globals):** `MIX_ISSUE_ALL` / `getMixIssueSlots` / `setMixIssueSlots` /
  `setMixIssueSlot` / `mixIssueClick` / `mixIssuePills` / `aimmMixIssueSlots` appear **only** in
  `index.html` itself and in this HANDOVER doc. Nothing in `elevenlabs-client-tools.json` or
  `register_elevenlabs_tools.py` (grepped `issue` / `recipe` / `pill` there — nothing). Deleted
  outright, no shims — matches Markey's earlier confirmation.
- **Jules hard line HELD** — the full `why` + recommended `move` (the `MIX_ISSUE_RECIPES` text) live in
  the centre `.mcq-card`, revealed by click-to-expand. No escalation needed.
- **Deviation from "dedupe by `focusBand`":** the spectral bands (`low`/`lowmid`/`mid`/`high`) still
  dedupe by band, but the four **broadband** direct-measure signals (true peak / dynamics / mono /
  loudness) dedupe on their signal `key` so they stay distinct — otherwise 3 of 4 whole-mix issues
  vanish into one "also considered" footnote, and jules mockups/05's breakdown explicitly lists
  true-peak as its own `#03` next to two spectral fixes.
- **`recompute(rOverride)`** takes the effective analysis: `refManualUpdate` passes the
  override-adjusted `rr`, the live-stop path passes `refLastAnalysis`. `refClearFile` calls
  `derive(null,null,null)` to empty the queue + hide the banner span.
- `_mcBannerDismissed=false; mcBannerFixesReset()` was moved **before** the `MC_FIXQUEUE` call in both
  `refLoadFile` and the live-stop path, so `syncBanner()` isn't wiped right after it fills the span.

Original spec (as built):
- New `.oz-card #mcActions`: head = "FIX QUEUE" + **"N / 5 applied"** (Jules's wording; but render the
  real queue length as the denominator, not a hard-coded 5 → "N / {total} applied") + a progress
  `.track`, plus a **"Show all queued (N) ▾"** toggle.
- **Default body = ONE `.qcard`** — the next not-applied, not-dismissed item — **fully actionable**:
  orange freq-target mini-graphic + `#0N` rank + title + `FOCUS x · IMP y · CONF z` chips + a dismiss
  `×` + **"Play from [t]"** + **"Ask Hope about this"** (prefills `#aiChatInput`, does NOT auto-send)
  + **expand-on-click revealing the full recommended-move detail** (from `MIX_ISSUE_RECIPES` text).
  **JULES HARD LINE — stop-and-escalate if this can't hold:** the complete current-fix detail MUST
  live in this centre panel card (expanded). Markey's transcript card *discusses/advances* it, never
  *replaces* it. A user who never opens the Hope rail must be able to read + action every fix from the
  Mix Check panel alone.
- **"Show all queued" expands IN PLACE** inside `grid-area:actions` — every remaining queued item, each
  with its own dismiss `×`; stays expanded for the session once opened; count always visible.
- **`MC_FIXQUEUE` engine:**
  - `derive(r, spec)` → ranked `items[]` from `mcEvalSignals(r)` + per-band corridor deltas
    (`refSpecPoints` vs the active corridor) + `li/tp/dr/correlation`. Severity score = distance past
    threshold × band-impact weight. Dedupe by `focusBand` (keep highest score; stash merged titles as
    "also considered").
  - `state = {items, applied:Set<id>, dismissed:Set<id>, sig}` persisted
    `localStorage['aimmMcFixQueue_v1']`, keyed by `name + '|' + size + '|' + lastModified + '|' +
    duration.toFixed(2)`. Different sig → reset.
  - `recompute()` — re-run `derive` from `refLastAnalysis` + current `refSpecPoints` (called by
    `refManualUpdate` + live-stop).
- **Removes:** the `refEvalPills(...)` call site in `refLoadFile`; the `.aichat-mix-issues` markup +
  `#mixIssuePills` + the slots IIFE (`~line 15587–15622`) + its stale comment + `mixIssueClick` +
  `#mixIssueDetail`/`Label`/`Text` + the exported globals `MIX_ISSUE_ALL` / `getMixIssueSlots` /
  `setMixIssueSlots` / `setMixIssueSlot`. **KEEP `MIX_ISSUE_RECIPES`** (reused for item why/move text).
  Markey confirmed nothing in `TOOL_DEFS` / `handleToolCall` / `elevenlabs-client-tools.json` /
  `register_elevenlabs_tools.py` references those globals — safe to delete outright, no shims.
- **"Play from [t]"** → `refSeek` to `item.playFromSec` (null until Step 8 → hide the button when null).

#### `window.mcFixQueue` CONTRACT — implement EXACTLY this (Markey builds Step 7 against it)
```js
window.mcFixQueue = {
  list(),          // -> item[]  (full ordered queue, immutable copies)
  current(),       // -> item | null  (next not-applied, not-dismissed)
  markApplied(id), // advance: item -> applied, next item becomes the .qcard, N/total updates, fires onChange
                   //   (this is the blueprint's "markDone" — Markey calls it when Hope's "ready for #0X?" is answered yes)
  dismiss(id),     // item -> dismissed, advance, fires onChange
  onChange(cb),    // cb() on every markApplied/dismiss
  total(),         // -> int  (queue length)
  appliedCount(),  // -> int
  breakdownData(), // -> see below (for Markey's auto-posted "Mix breakdown" card)
};

// breakdownData() returns:
{
  fileSignature: "name|size|lastModified|duration",
  analysisRev: <int, increments per (re)analysis of any file>,
  loudnessVsTarget: { lufsI, targetLufs, deltaDb, plr, verdict:"hot"|"quiet"|"on-target" },
  tonalBalanceDeltas: { low, mid, high },            // dB vs the active corridor
  transientRead: { character:"spiky"|"balanced"|"sustained", crestDb, note:"<one line>" },
  topFixes: [ item, item, item ]                     // first 3 of list(), immutable copies
}
// each `item`:
{ id:"#01", key, title, why, move, focusBand:"low"|"lowmid"|"mid"|"high"|"broadband",
  freqRange:{loHz,hiHz}, impact:"high"|"med"|"low", confidence:"high"|"med"|"low", playFromSec:null }

// At the END of refLoadFile (after refSpecPoints + MC_SPECS + MC_FIXQUEUE.derive):
window.dispatchEvent(new CustomEvent('aimm:analysis-complete', { detail: window.mcFixQueue.breakdownData() }));
```

### Step 5 — transport waveform + energy markers — ✅ DONE (`009699a` + Jules-R1 follow-up `17028ad`, `AIMM_BUILD 2026-08-31.7`)
**Jules design review: APPROVE WITH NOTES, 1 REQUIRED change (R1) — actioned in the follow-up
commit.** R1: opaque rounded chip behind all three canvas marker labels + a mid-track `drop`
label moved below its (lowered) tick + chip-x clamp (see the §1 `5-fu` row and §5). All other
review notes are sanctioned as-is / deferred — see §5.

Built per the spec below. What landed: `MC_WAVE` IIFE (after `refFileSpectrum`, `window.MC_WAVE`
exposed) — `build(buf)` 700 min/max buckets over a mono downmix (cached on buffer identity);
`markers(buf,analysis)` recomputes coarse energy envelopes cheaply (400 ms / 100 ms-hop full-band +
an `sr/120` moving-avg lowpass for <120 Hz — did NOT change `refAnalyse`'s return shape), cached,
returns `[{type,t0,t1}]` with the conservative intro/outro/drop tests + an intro-outro exclusion
zone for drop candidates; `draw()` = greyscale min/max bars + `#2fa1e6`→`#a557f4` played wash +
1px `#eef2f5` playhead + `#f97316` pips/ticks + low-alpha brackets + lowercase `intro`/`drop`/`outro`
labels; `clear()` nulls caches + wipes canvas. Called ONLY from `refIdleAnimate()` + `refLiveAnimate()`
(the Codex TP2 pass-1 BLOCKER was a direct `draw()` in the drag handler — fixed, now routes through
`refIdleAnimate()`). Markup: canvas `#mcWave` (140/88 px) + `#mcWaveCap` caption (literal, shown only
with ≥1 marker) replace `#refScrubTrack`/`#refScrubFill`; skip-start button added; control row
skip-start / −10 / play-pause / +10 / stop; `#mcTransport .ref-transport{flex-wrap:wrap}` +
`.ref-scrub-wrap{flex:1 1 100%}` drops the full-width waveform to its own line under the controls.
Removed: 2 dead scrub CSS rules, `window.refScrubClick`, all `refSetStyle('refScrubFill',…)` writes.
Renders (CDP, no console errors): `step5-desktop.png` (playback progress → wash + playhead visible),
`step5-desktop-markers.png` (synth WAV — intro + drop + outro all fired + caption), `step5-mobile.png`
(390w, 88px canvas). **LOCKED held:** no named sections, no A/B/C labels, no SSM / novelty / worker.

Original spec (as built):
- `#mcTransport` inner: control row (skip-start / −10 / play-pause / +10 / stop — reuse `#refPlayIcon`/
  `#refPauseIcon` + `refTogglePlay`/`refSeek`/`refStopAudio`), `#refTimeElapsed`, `#refTimeDuration`
  (right-aligned).
- Replace the `#refScrubTrack`/`#refScrubFill` thin bar with `<canvas id="mcWave">` (~140px desktop /
  ~88 mobile). `MC_WAVE.build(buf)` — mono downmix, ~700 min/max buckets, cache on buffer. Draw
  **greyscale** min/max bars; **played portion** (left of `refStartOffset/duration`) washed
  **blue→purple**; a 1px playhead line.
- Remove the now-dead `refSetStyle('refScrubFill',…)` writes in `refStopAudio`/`refSeek`/
  `refScrubClick`/`refClearFile`/`refLiveAnimate` (they null-guard, so no crash, but tidy them).
  Draw the waveform from inside `refIdleAnimate()` + `refLiveAnimate()` (which `refDrawCanvas` owns) —
  **no competing permanent rAF loop.** Immediate redraw on pause/drag/seek.
- Seek: pointerdown/move/up on `#mcWave` → fraction → `refStartOffset = frac*refBuffer.duration`
  (port the `wireScrub` IIFE pattern, retarget from `#refScrubTrack`). `refClearFile` clears canvas +
  cached peaks.
- **Energy markers** (`MC_WAVE.markers(buf, analysis)` — reuse the 400 ms block-RMS + short-term
  loudness arrays from `refAnalyse`; expose them on the return or recompute cheaply). CONSERVATIVE —
  if ambiguous, render NOTHING:
  - **intro**: leading run of blocks ≥ ~8 LU below the gated median, from t=0, capped ~20% of duration.
  - **outro**: same test from the tail.
  - **drop(s)**: short-term loudness rises ≥ ~4 LU within ≤ ~2 s AND low-band (<120 Hz) energy also
    steps up; require pre-level ≥ ~6 LU below post-level. Mark ≤ 2, ≥ 20 s apart.
  - Markers use the ONE orange `#f97316` as pip/tick; brackets low-alpha neutral.
  - Caption under the canvas, literal: `intro / drop / outro estimated from energy — full arrangement detection with the analysis phase`.
- **~~LOCKED: NO named Intro/Verse/Bridge sections~~ — SUPERSEDED 2026-09-01 by Kevin's
  identical-to-mockup-05 directive.** Kevin approved mockup 05, which HAS coloured
  INTRO/VERSE/BRIDGE/VERSE waveform section washes + a labelled `.secs` ruler + amber pips, and
  explicitly wants them. The `f78a365` transplant reproduces them as **fixed cosmetic layers at the
  mockup's proportional positions** (22/30/22/26%) — there is no segmentation DSP and none is
  implied (the honest "estimated from energy" caption is now hidden — it no longer applies).
  Still LOCKED: NO A/B/C repetition labels, NO self-similarity matrix / novelty curve / worker.
  Real arrangement detection (variable section boundaries, repeat-aware labels) stays a deferred
  analyst-phase item.

### Step 6 — `#hopeRail` height = grid-item — ✅ DONE (`0aa1632`, `AIMM_BUILD 2026-08-31.8`)
**BLOCKER-3 path taken: `.app-col` fallback** — the naive `grid-row:1 / -1` was render-tested
and failed (rail only ~544px tall, ending far above `#mcActions`). See the §1 `6` row + the
BLOCKER-3 resolution note in §2 for exactly what shipped. Markey's 2 conditions both verified
live (desktop `display:flex` is unconditional; the `<=1023px` overlay path is unchanged);
`setRail()` untouched; mobile collapse/expand confirmed working in the renders; desktop
collapse remains a deliberate no-op (pre-existing `setRail` guard + `#railToggle` hidden on
desktop). Original spec below (as targeted):

- `@media(min-width:1024px){ #hopeRail{ grid-column:2; grid-row:1 / -1; align-self:stretch;
  position:static; display:flex; height:auto; max-height:none; } }` — so the rail ends level with the
  bottom of `#mcActions` instead of the viewport.
- `@media(max-width:1023px){ #hopeRail{ position:fixed; top:0; right:0; bottom:0; width:min(86vw,360px); } }`
  + the existing overlay / `#railReopen` rules — **unchanged**.
- Remove/scope the base `#hopeRail{position:fixed…}` (line ~1176) so it doesn't leak into desktop.
- **MARKEY'S 2 CONDITIONS:** (a) desktop `#hopeRail{display:flex}` must be UNCONDITIONAL inside the
  `min-width:1024px` block — must NOT depend on `body.rail-open` or init timing; (b) the grid-item rule
  is strictly scoped to `min-width:1024px`, and a `max-width:1023px` rule still carries `position:fixed`
  + offsets + width so the mobile overlay path is genuinely untouched. `setRail()` (DOM re-parenting of
  `.aichat-layout` into `#hopeRailBody`) is unchanged — verify collapse/expand still works, desktop +
  mobile, in the render.
- **See BLOCKER-3 in §2** — `grid-row:1 / -1` may not span as intended; `.app-col` wrapper is the
  documented fallback.

### Step 7 — Hope auto-post + active card — MARKEY BUILDS (Cat delivers only the event/contract)
- Cat's part is done once Step 4 lands: `window.mcFixQueue` + the `aimm:analysis-complete` CustomEvent.
- Markey builds: the active action-item card rendered *inside* `#aiChatTranscript` (distinct render
  kind — not user, not plain ai/system; title / why / recommended move / freq-target graphic /
  Play-from + Alternatives; **no manual tick**); Hope conversationally offering "Ready to move on to
  #02?" and calling `window.mcFixQueue.markApplied(id)` on yes; Hope auto-posting a labelled "Mix
  breakdown" card on `aimm:analysis-complete` (dedup on `fileSignature`, replace on `analysisRev` bump).

### Final commit — docs + build stamp
- `AIMM_BUILD` → the merge date `.N`.
- `docs/STATUS.md`: retire the stale "R5 Ozone-12 / IN PROGRESS" row → "R3 Mix Check full layout —
  SHIPPED" + the deferred stubs (waveform named sections; Subgenre/Production/Energy/Mood/Dissonance
  placeholders) + Markey's Hope items.
- `docs/ROADMAP.md` + `DASHBOARD.html`: mirror; log the deferred items as their own entries.

---

## 4. LOCKED DECISIONS (do not re-litigate)

- **Waveform:** greyscale rendered min/max peaks from the decoded buffer + blue→purple played-portion
  fill + click/drag seek. Plus CONSERVATIVE energy-only markers: **intro** (quiet leading region),
  **outro** (quiet trailing region), **drop(s)** (large positive step in short-term loudness / low-band
  energy). Honest caption. **NO named/coloured sections, NO A/B/C labels, NO SSM/novelty/worker** —
  deferred to the analyst phase.
- **Tempo:** `web-audio-beat-detector` (few KB, ESM, **no WASM**), lazy dynamic `import()`, pinned
  version, 8 s timeout, graceful "unavailable". **Key:** rough in-browser Krumhansl chromagram estimate,
  bounded + chunked, rendered with an "approx" qualifier + amber dot. Analyst phase replaces both.
- **Audio Specs placeholders:** Subgenre / Production style / Energy / Mood / Dissonance render as rows
  with literal muted value text "with full analysis" + the neutral `.d.na` (`#3a3f45`) dot. Not hidden,
  not a lock glyph (no-emoji rule). Real rows (Genre, Tempo, Key + the measured metrics) come first.
- **Brand:** `AI` solid `#fbbf24`; `MixMasters` + `Hope` (rail title) + the filename `.ext` accent all
  use ONE shared gradient token — in `index.html` that token is **`--send-blue`**
  (`linear-gradient(90deg,#2fa1e6,#a557f4)`), clipped to text
  (`-webkit-background-clip:text;background-clip:text;color:transparent`). **Keep the space in "AI
  MixMasters"** ("MixMasters" is the single word). The 3-sparkle AI-star SVG stays solid yellow
  `#fbbf24` via its own explicit colour (NOT a shared token — keeps brand-yellow decoupled from
  warn-amber, which also uses `#fbbf24` on meters/pills). Jules is pinning the exact wordmark
  (spacing/weight) in `jules/design-system.md` — conform to it when available.
- **Fix Queue (Jules):** ONE "next up" card, fully actionable, with the full move detail **expand-on-
  click IN the centre card** (STOP-AND-ESCALATE if that can't hold). Progress label "N / 5 applied"
  (denominator = real queue total). "Show all queued" expands **in place**. ONE orange only (`#f97316`,
  same as the waveform markers). Row order: real values then placeholders. `--gutter:16px` drives every
  gap. ONE `.oz-card` style for every card (banner, transport, action items, metric tiles).
- **Markey's 2 rail conditions:** see Step 6.
- **Shell/nav unchanged:** keep the 2-column shell + the 9-tab top strip. The collapsible left nav rail
  (MMP borrow #8) is a **separate epic, explicitly out of scope** here.

---

## 5. Coordination state (Markey + Jules)

- Markey and Jules were run as **subagents from the coordinator seat**. Both are **LOST when this
  session ends** — the next session must **re-spawn them** (or the coordinator does).
- **⚑ MARKEY IS NOW CLEAR TO BE RELEASED.** Step 4 (the Fix Queue panel + the exact `window.mcFixQueue`
  contract + the `aimm:analysis-complete` CustomEvent) is committed + pushed — originally to
  `origin/r3-mixcheck-full` @ `cc299f0`/`419bc43`, now carried on the authoritative
  `origin/r3-mixcheck-codex` (SHA in the §1 table). **Markey builds Step 7 on `r3-mixcheck-codex`.**
  The contract surface Markey builds Step 7 against: `window.mcFixQueue.list()` /
  `current()` / `markApplied(id)` / `dismiss(id)` / `onChange(cb)` / `total()` / `appliedCount()` /
  `breakdownData()`, plus `window.addEventListener('aimm:analysis-complete', e => e.detail === breakdownData())`.
  Every `item` is exactly `{id,key,title,why,move,focusBand,freqRange:{loHz,hiHz},impact,confidence,playFromSec}`
  (frozen copies from `list()`/`topFixes`). The **coordinator does the actual spawn.**
- **Markey's brief** (release ONLY after Step 4 — the panel + `window.mcFixQueue` contract — is
  committed on `r3-mixcheck-codex`): the 3 Hope-transcript items in Step 7 above. He confirmed: (a)
  nothing references the mix-issue globals, delete them outright; (b) the `#hopeRail` reposition is OK
  subject to his 2 conditions.
- **Jules's role:** design review of the RENDERED result, per step. **She has no browser tooling** —
  she needs PNG file paths to `Read` locally. Produce desktop (≥1280) + mobile (~390) PNGs per step via
  `scratchpad/shot.mjs` and hand the absolute paths to the coordinator to relay. Jules confirmed the 3
  mockup-vs-brief divergences (one-card Fix Queue; Tempo/Key real + 4 placeholders; greyscale waveform
  + energy markers, no named sections) and the brand treatment.
- Step 0–1 render PNGs (may be gone if scratchpad is cleared): `step0-desktop2.png`, `step0-mobile2.png`,
  `step1-desktop2.png`, `step1-mobile.png` in
  `C:\Users\admin\AppData\Local\Temp\claude\C--Users-admin-github-aimm\e775bf75-afa8-4f52-85bb-c3614a2d3169\scratchpad\`.
- **Step 2 review — Jules verdict: APPROVE WITH NOTES.** Panel rendered desktop + mobile; Jules signed
  off on the layout, tiles, metric rows and CLASSIFIED block. Deferred nits carried forward (none block
  Step 2, none are Step 3's job either unless noted):
  - **Unit formatting** — normalise sample-rate / bit strings (`48.0kHz` vs `48 kHz`, spacing around
    `/`). Folded into the **Step 1 header backlog** (the `#mcSub` line uses the same helper).
  - **Mobile "Chat" pill vs build-stamp overlap** at the narrow breakpoint — pre-existing, logged as a
    general **backlog** polish item (not R3-introduced).
  - **Noise-floor threshold** — Jules to confirm the `-55 dBFS` warn cutoff in `populateMeasured` is the
    number she wants; left as-is pending her word.
  - Two nits WERE actioned now, in the Step 3 commit: neutral empty-state dots + Genre-mirrors-`STATE`
    (see Step 3 above).
- **Step 3 render PNGs:** `step3-desktop.png` (≥1280), `step3-mobile.png` (~390), `step3-empty.png`
  (no WAV — shows the empty-state dot fix + Genre-mirrors-STATE fix). Paths handed to the coordinator
  in the session report.
- **Step 3 review — Jules verdict: APPROVE WITH NOTES.** `.mc-banner` faithful to mockup 05, nothing
  blocks. Cat's 2 questions answered: (a) **keep the "HOPE — ANALYSIS" kicker dropped** — icon-only is
  correct; the banner is an app analysis readout, not a Hope turn, and Step 7's transcript "Mix
  breakdown" card is the real attributed Hope surface — do NOT re-add the label; (b) **ship the
  desktop gradient border as-is** — subtle is the right register for a dismissible low-priority
  banner. Backlog polish note (not now): `--send-blue` is a 90° gradient so the 3px left border
  samples only the blue end and reads as a solid rule on wide desktop; if the blue→purple is ever
  wanted legible on the left edge at any width, use a dedicated 180° (vertical) gradient on a left
  pseudo-element. Also confirmed: empty-state Genre="Trap"+green dot, Tempo/Key grey "– –", all
  measured rows grey `.na` — the Step 2 nit fixes landed correctly.
- **Step 4 Jules changes — ACTIONED in `99674af`** (own commit, `AIMM_BUILD 2026-08-31.5`): the
  show-all current-item marker (`.mcq-allrow.is-current` + "Up next" tag; row kept in the list) and
  the calmed `.mcq-mini` graphic (broadband → faint `.broad` wash, spectral width-capped at 34%).
  The `{total}` denominator was already dynamic. Re-rendered on the same panel in the Step 5 shots
  (`step4-followup-fixqueue.png` shows the Fix Queue with Show-all open + the marker; the broadband
  faint-wash path is logic-verified — `#02` true-peak fix → `.mcq-mini broad`, `left:0;width:100`).
- **Step 5 review — Jules verdict: APPROVE WITH NOTES, 1 REQUIRED change.**
  - **R1 (required) — ACTIONED in the `5-fu` follow-up commit (`17028ad`, `AIMM_BUILD 2026-08-31.7`).**
    The mid-track `drop` canvas label was clipping the canvas top and colliding with the bars. Fix in
    `MC_WAVE.draw()`: (1) an opaque rounded chip behind **all three** labels (`intro`/`drop`/`outro`,
    for consistency) — `rgba(27,29,32,.85)` (card surface `#1b1d20` @ .85), 3px/2px padding, 2px
    radius, painted BEFORE the glyph; (2) a mid-track `drop` now drops its orange tick to `y≈11` and
    places the label just below it (`chipY = tick + 8`), not at `y≈0` — `intro`/`outro` keep the
    corner anchor + gain the chip; (3) chip x clamped `max(2, min(x, cw − chipW − 2))` so it never
    overflows an edge. Re-rendered `step5-desktop-markers.png` + `step5-mobile-markers.png` (+ a
    `#mcWave` crop): no clip, label clears the bars, both surfaces. Codex TP2 on the R1 diff =
    NO BLOCKERS via direct verification (Codex quota-blocked; see §2).
  - **Sanctioned as-is — do NOT "correct" these back:**
    - **Elapsed / duration sit BELOW the canvas at its left/right edges, not in the control row.**
      Jules explicitly **accepts this as an intentional improvement over mockup 05** (which puts them
      in the row). Leave it.
    - `−10s` / `+10s` "10s" text captions under the seek buttons — keep as-is.
    - intro/outro bracket tint `rgba(255,255,255,.045)` — keep; `.06` is the ceiling if ever bumped,
      not now (it reads as barely-there on mobile — acknowledged, the orange tick + chipped label
      carry the region).
  - **Deferred (separate passes, not this build):** caption copy nit ("…detection with the analysis
    phase") → a copy pass with Kevin.
  - **CDP renders (all off the merged tree, no console errors):** `step5-desktop.png` (~50% playback,
    played wash + playhead), `step5-desktop-markers.png` (intro + drop + outro all fired + caption,
    post-R1), `step5-mobile.png` (390w, 88px canvas, plain WAV mid-playback), `step5-mobile-markers.png`
    (390w, all three markers + labels + caption, post-R1), `step5-mobile-markers-crop.png` (tight
    `#mcWave` crop). Kevin's PRIMARY surface for this feature is mobile — the ~390px shots are the
    main review artefact.
- **Jules agent on the Mac:** `~/.claude/agents/jules.md` is now created (synced from
  `begb0037admin/jules` `AGENT.md`); it registers on the next Claude Code start, so from Step 6 on the
  design review spawns the real `jules` agent rather than an ad-hoc subagent.

---

## 6. EXACT NEXT ACTIONS (fresh session, in order)

**Steps 0–6 are DONE + committed on `r3-mixcheck-codex` (`58ee1bb`, `de1cce3`, `c5fabe9`,
`0a306b2`, `cc299f0`+`419bc43`, `99674af`, `009699a`+`260e925`, `17028ad`+`9bb3798` (5-fu),
`0aa1632` (Step 6, via the `.app-col` BLOCKER-3 fallback), then `0f34e5e`+`fd98850`+`18166ef`
(Codex mockup-05 pass + tab-strip regression fix + mobile-scope) + a consolidation commit —
SHAs in the §1 table). Step 5 Jules review CLOSED (APPROVE WITH NOTES, R1 done). `r3-mixcheck-full`
is frozen at `2f78e2c` and is NOT touched. Step 7 is Markey's (Cat's Step 7 contract already
shipped inside Step 4) — serialized AFTER Step 6.**

1. `git checkout r3-mixcheck-codex`; confirm HEAD == `origin/r3-mixcheck-codex`,
   `main` still `68a3ffa`, `r3-mixcheck-full` still `2f78e2c` (do NOT touch it). Re-read this doc
   fully. Spawn the real `jules` agent (`~/.claude/agents/jules.md`) for a render review of
   `r3-mixcheck-codex` HEAD (desktop + mobile + the two `.qmini` crops — see §6 render list in the
   consolidation dispatch). Fold any real blocker into a follow-up commit on `r3-mixcheck-codex`.
2. **Step 7 is Markey's** — the active-card render inside `#aiChatTranscript` + Hope's
   "ready for #0X?" → `window.mcFixQueue.markApplied(id)` + the auto-posted "Mix breakdown" card
   on `aimm:analysis-complete`, built against the exact §4 contract. Cat delivered the event +
   contract in Step 4; nothing more from Cat. Markey builds on `r3-mixcheck-codex`.
3. Final: docs commit (`docs/STATUS.md` + `ROADMAP.md` + `DASHBOARD.html`), `AIMM_BUILD` bump, Codex
   **TP3** (full `main...r3-mixcheck-codex` — MUST explicitly cover Step 6 `0aa1632` and the
   `0f34e5e`/`fd98850`/`18166ef` mockup-05 pass, neither of which has a completed standalone Codex
   TP2), Jules end-to-end design review, Kevin's explicit sign-off.
4. Hand Kevin the PowerShell fast-forward promote command (below).

---

## 7. Open items

- **h1 crush behind the Genre/Target/Settings pills below ~390px** — PRE-EXISTING on `main`
  (`.header-top` is `flex-wrap:nowrap`). Not this build's job. Logged as a separate polish item for
  Jules/Kevin.
- ~~**BLOCKER-3** (`#hopeRail` `grid-row:1/-1` span)~~ — **CLOSED.** Resolved in Step 6 (`0aa1632`)
  via the `.app-col` fallback: all app content wrapped in one `<div class="app-col">`, `#hopeRail`
  made `.container`'s first child, `.container` has exactly 2 flow children, `#hopeRail{align-self:
  stretch}` matches the app-column height (render: `railBottom === mcActionsBottom`, delta 0).
- ~~**`48.0kHz` / `48 kHz` unit-formatting nit**~~ (Jules Step 2 backlog) — **CLOSED.** Fixed in
  `0f34e5e` (+ `fd98850`): `#mcSub` now emits `48 kHz` / `48 kHz / 24-bit` (space around `kHz`
  and `/`, single `·` join).
- ~~**Mix Check tab-strip indent regression**~~ (from Step 6's `.app-col` wrap — the old
  `.container > .tabs.oz-tabstrip` `>`-form rule went dead when the strip became a grandchild) —
  **CLOSED.** Fixed in `fd98850` (descendant-form `.container .tabs.oz-tabstrip` set + reset) +
  `18166ef` (scoped the set rule to `@media (min-width:1024px)` so it stops leaking the 256px
  indent onto ≤1023px). Consolidation commit re-verified: zero surviving `>`-form tab-strip
  selectors.
- **BLOCKER-5** (proper EBU-style LRA) — implement in Step 2, don't ship "P95−P10 of raw windows".
  _(Still open — carried; Step 2's LRA was not reworked in this line.)_
- **Codex full-reasoning passes time out** on this repo (>9 min). Use `-c model_reasoning_effort="low"`
  + pre-written diff files + terse BLOCKERS-only prompts. Escalate to the coordinator if a step needs
  deeper review than low-reasoning gives.
- **Step 6 (`0aa1632`) + the `0f34e5e`/`fd98850`/`18166ef` mockup-05 pass have NO completed
  standalone Codex TP2** — direct verification / Codex-implementation route only. TP3 must cover
  them end-to-end (see §2).
- `docs/STATUS.md` / root `docs/ROADMAP.md` were stale (still described the "R5 Ozone-12" line, never
  mentioned R3 rounds 8–19). This build's final docs commit fixes that.

---

## 8. PROMOTE COMMAND — DO NOT RUN until the whole Mix Check tab is built + TP3 passes + Kevin approves

Agent pushes to `main` are classifier-blocked. When everything is done, reviewed, and Kevin has
explicitly signed off on the rendered result, Kevin runs this in **PowerShell** from the repo:

```powershell
cd C:\Users\admin\github\aimm
git checkout main
git pull origin main
git merge --ff-only r3-mixcheck-codex
git push origin main
```

If `--ff-only` fails (main moved), rebase the branch first:
```powershell
git checkout r3-mixcheck-codex
git rebase origin/main
# re-run Codex TP3 + a render check after the rebase, then:
git checkout main
git merge --ff-only r3-mixcheck-codex
git push origin main
```
GitHub Pages redeploys `main` within ~1 minute.

**`r3-mixcheck-full` is frozen at `2f78e2c` and is NOT the promote source — do not merge it.**
