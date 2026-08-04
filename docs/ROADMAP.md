# ROADMAP.md — AIMM Active

> Active planning doc. Root ROADMAP.md is preserved as historical record.

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
