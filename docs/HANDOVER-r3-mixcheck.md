# HANDOVER — R3 Mix Check full-layout build

**Assume zero context.** This is the durable resume record for the R3 Mix Check redesign build.
Owner: **Cat** (`begb0037admin/cat`) — general AIMM product engineering. The Hope voice/chat surface
is **Markey's** (`begb0037admin/markey`); design review is **Jules's** (`begb0037admin/jules`).

Steps 0–5 built + committed on `r3-mixcheck-full` (`58ee1bb`, `de1cce3`, `c5fabe9`, `0a306b2`,
`cc299f0`+`419bc43`, `99674af` step-4 Jules follow-ups, then Step 5 = this branch HEAD). Steps 6–7
remain (7 is Markey's). See §6 for the exact next action.

---

## 1. Branch + commits

- **Branch:** `r3-mixcheck-full`, based off `main` @ `68a3ffa` ("R3 round 16").
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
| `<this commit>` | 5 | **Transport waveform + conservative energy markers.** New `MC_WAVE` engine IIFE (right after `refFileSpectrum`, exposed `window.MC_WAVE` for parity): `build(buf)` → 700 min/max buckets over a mono downmix, cached on buffer identity; `markers(buf,analysis)` → coarse recomputed energy envelopes (400 ms blocks / 100 ms hop full-band + a `sr/120` moving-avg lowpass for <120 Hz), cached, returns `[{type:'intro'|'drop'|'outro',t0,t1}]` — CONSERVATIVE: **intro** = leading run ≥8 LU below the gated median (≥1.5 s, capped 20% of duration), **outro** = same from the tail, **drop(s)** = short-term step ≥6 LU with a ≥4 LU rise in ≤2 s AND <120 Hz energy up ≥3 dB, ≤2 marks ≥20 s apart, candidates inside/against the intro-outro regions excluded; if ambiguous nothing is pushed. `draw()` renders greyscale min/max bars, a `#2fa1e6`→`#a557f4` wash over the played portion, a 1px `#eef2f5` playhead, `#f97316` marker pips/ticks + low-alpha neutral brackets + lowercase `intro`/`drop`/`outro` labels; `clear()` nulls the caches + wipes the canvas. **Drawn ONLY from inside `refIdleAnimate()` + `refLiveAnimate()`** — no competing rAF loop; `wireScrub`'s drag/seek path routes its immediate redraw through `refIdleAnimate()`. Markup: `#refScrubTrack`/`#refScrubFill` thin bar replaced by `<canvas id="mcWave" class="mc-wave">` (140 px desktop / 88 px mobile) + `#mcWaveCap` literal caption `intro / drop / outro estimated from energy — full arrangement detection with the analysis phase` (shown only when ≥1 marker); a **skip-start** button added and the control row ordered skip-start / −10 / play-pause / +10 / stop. `#mcTransport .ref-transport{flex-wrap:wrap}` + `.ref-scrub-wrap{flex:1 1 100%}` puts the full-width waveform on its own line under the controls. **Removed:** the 2 `.ref-scrub-track`/`.ref-scrub-fill` CSS rules, `window.refScrubClick` (dead with the element), and every dead `refSetStyle('refScrubFill',…)` write in `refLiveAnimate`/`refStopAudio`/`refSeek`/`refClearFile`. **LOCKED held:** no named Intro/Verse/Bridge sections, no A/B/C labels, no SSM / novelty / worker. `AIMM_BUILD` → `2026-08-31.6`. |

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
- **Remaining Codex passes:** per-step TP2 on the step 6 diff (batch tightly, low-reasoning
  is fine and much faster on this repo); then **TP3** = full `main...r3-mixcheck-full` end-to-end.
- **4-pass cap:** TP1 used 3 attempts (1 substantive + 2 timeouts). TP2 used 3 attempts (2 timeouts + 1
  substantive). Both within cap. Reset per touchpoint going forward.
- **Codex invocation that works here:** `codex exec -s read-only --skip-git-repo-check -c model_reasoning_effort="low" -C "C:\Users\admin\github\aimm" "<terse prompt, point it at a pre-written diff file in scratchpad, ask for BLOCKERS ONLY>"` with a ~340s `timeout`. Full-reasoning passes reliably exceed 9 min and get killed.

**Codex findings deferred (larger, not yet actioned) — carry as open items:**
- BLOCKER-3 (`#hopeRail` can't span app height just via `align-self:stretch` — it's a sibling of
  header/tabs/panels in `.container`, auto-places into one row). Plan's approach: `grid-row:1 / -1` on
  `#hopeRail` inside `@media(min-width:1024px)`. **Unverified.** Fallback if it misbehaves: wrap
  header+tabs+panels in an `.app-col` div so `.container` has exactly two children. Resolve in Step 6
  with a real desktop+mobile render.
- BLOCKER-5 (LRA): implement proper EBU-R128-style (short-term 3 s/100 ms hop, abs gate −70 LUFS, rel
  gate at mean−20 LU, then P95−P10). Not "P95−P10 of raw windows".

---

## 3. The full 8-step plan (0–1 DONE, 2–7 REMAINING)

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

### Step 5 — transport waveform + energy markers — ✅ DONE (`<this commit>`, `AIMM_BUILD 2026-08-31.6`)
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
- **LOCKED: NO named Intro/Verse/Bridge sections, NO A/B/C repetition labels, NO self-similarity
  matrix / novelty curve / worker in this build.** Full coloured named-section detection = deferred
  item (analyst phase), tracked alongside the Audio Specs placeholders.

### Step 6 — `#hopeRail` height = grid-item — REMAINING (Markey-confirmed, hold his 2 conditions)
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
  contract + the `aimm:analysis-complete` CustomEvent) is committed + pushed to `origin/r3-mixcheck-full`
  (SHA in the §1 table). The contract surface Markey builds Step 7 against: `window.mcFixQueue.list()` /
  `current()` / `markApplied(id)` / `dismiss(id)` / `onChange(cb)` / `total()` / `appliedCount()` /
  `breakdownData()`, plus `window.addEventListener('aimm:analysis-complete', e => e.detail === breakdownData())`.
  Every `item` is exactly `{id,key,title,why,move,focusBand,freqRange:{loHz,hiHz},impact,confidence,playFromSec}`
  (frozen copies from `list()`/`topFixes`). The **coordinator does the actual spawn.**
- **Markey's brief** (release ONLY after Step 4 — the panel + `window.mcFixQueue` contract — is
  committed on `r3-mixcheck-full`): the 3 Hope-transcript items in Step 7 above. He confirmed: (a)
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
- **Step 5 render — awaiting Jules.** Three CDP renders (no console errors): `step5-desktop.png`
  (transport + waveform, ~50% playback so the blue→purple played wash + playhead show),
  `step5-desktop-markers.png` (synthesised quiet-intro / loud-body / quiet-outro WAV — **intro, drop
  AND outro markers all fired** + the literal caption), `step5-mobile.png` (390w, 88px canvas).
  Paths handed to the coordinator in the session report.

---

## 6. EXACT NEXT ACTIONS (fresh session, in order)

**Steps 0, 1, 2, 3, 4, 4-fu, 5 are DONE + committed on `r3-mixcheck-full` (`58ee1bb`, `de1cce3`,
`c5fabe9`, `0a306b2`, `cc299f0`+`419bc43`, `99674af`, then Step 5 — SHA in the §1 table). Step 6 is
next. Markey's Step 7 can run in parallel.**

1. `git checkout r3-mixcheck-full`; confirm HEAD == `origin/r3-mixcheck-full` (the Step 5 commit),
   `main` still `68a3ffa`. Re-read this doc fully. Re-spawn Markey + Jules (or have the coordinator
   do it). Get Jules's step-4-fu + step-5 render verdict; fix any real blocker in a branch commit.
2. Build **Step 6** — `#hopeRail` height = grid-item, per §3 Step 6 — same loop. **Hold Markey's
   2 conditions**, resolve BLOCKER-3 with a real desktop + mobile render. Its own commit, bump
   `AIMM_BUILD`.
3. Codex TP2 on the Step 6 diff (low-reasoning, terse, BLOCKERS only, ~340s timeout, pre-write the
   diff to a scratchpad file). Render Step 6 desktop + mobile via the CDP driver; hand PNG paths to
   the coordinator for Jules.
4. Step 7 is Markey's. Cat's only Step 7 work (the event + contract) shipped inside Step 4.
5. Final: docs commit (`docs/STATUS.md` + `ROADMAP.md` + `DASHBOARD.html`), `AIMM_BUILD` bump, Codex
   **TP3** (full `main...r3-mixcheck-full`), Jules end-to-end design review, Kevin's explicit sign-off.
6. Hand Kevin the PowerShell fast-forward promote command (below).

---

## 7. Open items

- **h1 crush behind the Genre/Target/Settings pills below ~390px** — PRE-EXISTING on `main`
  (`.header-top` is `flex-wrap:nowrap`). Not this build's job. Logged as a separate polish item for
  Jules/Kevin.
- **BLOCKER-3** (`#hopeRail` `grid-row:1/-1` span) — unverified; `.app-col` wrapper fallback documented.
  Resolve in Step 6 with a real render.
- **BLOCKER-5** (proper EBU-style LRA) — implement in Step 2, don't ship "P95−P10 of raw windows".
- **Codex full-reasoning passes time out** on this repo (>9 min). Use `-c model_reasoning_effort="low"`
  + pre-written diff files + terse BLOCKERS-only prompts. Escalate to the coordinator if a step needs
  deeper review than low-reasoning gives.
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
git merge --ff-only r3-mixcheck-full
git push origin main
```

If `--ff-only` fails (main moved), rebase the branch first:
```powershell
git checkout r3-mixcheck-full
git rebase origin/main
# re-run Codex TP3 + a render check after the rebase, then:
git checkout main
git merge --ff-only r3-mixcheck-full
git push origin main
```
GitHub Pages redeploys `main` within ~1 minute.
