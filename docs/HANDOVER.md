# HANDOVER.md — AIMM

---

## Working Model

Work happens directly in Claude Code (terminal or desktop) — no separate seats, no Cowork, no dedicated Chrome hand-off, no brief-passing between different Claude surfaces. If a task needs domain-specific ownership (e.g. AIMM's general product work vs. its embedded voice feature), route it to the right named agent — see the Hope-account Instructions for Claude for the current Agent Dispatch table.

**Retired 5 Aug 2026, confirmed stale:** the old Seat A/Cowork/Chrome model below this line, including a "Failover chain... Adam (Work2)" reference — Cowork is no longer used, and "Adam (Work2)" does not exist and never referred to the hr-fa-knowledge-base Adam agent. Any reference to Cowork briefs, Chrome briefs, or seat hand-offs elsewhere in this file's session history below is historical record only — don't follow it as current process.

---

## ⚠️ Blocker — read before starting any Hope→Mia rename work (added 2026-08-04)

**Do not touch the Hope→Mia persona rename until Cat exists.** Cat is Kevin's dedicated agent for general AIMM product engineering (not yet built as of 2026-08-04) — most of the rename (index.html text/DOM, docs, mockups) is his scope, not a generic session's to improvise. Full plan: `docs/HOPE_TO_MIA_RENAME_PLAN.md`. Roadmap entry: `docs/ROADMAP.md` → "Hope → Mia persona rename." Also blocked on the Mixio-violet redesign epic reaching a stable/shipped state (currently IN PROGRESS, not settled — see `docs/STATUS.md`).

## Current handover point

**Date:** 2026-08-06 (redesign baseline update + Hope→Mia scoping, both pushed to `main`)
**Status:** Two separate threads, both awaiting Kevin's next move — neither blocks the other, but the rename thread is itself blocked (see the pinned blocker note above).

**2026-08-16 update (Cat — verification only, nothing implemented, no index.html touched):**

Kevin asked to "continue the redesign." Read both mockups directly via GitHub API and inspected their embedded content and structure directly, against v4 and against each other, before recommending any action. Finding that changes the shape of the decision below: **`redesign-v5-mixcheck-dashboard.html` and `ozone-redesign-v1.dc.html` are not two competing directions — they render the identical MixCheck design at the product/UI level** (same visible content, styling, controls, and spectrum animation — the two files are not byte-identical, they differ in size and packaging, so "same design" means same rendered UI, not identical bytes). Confirmed directly: both contain the same embedded banner text ("REDESIGN — Ozone 12 visual direction · graphite module-rack chrome, teal signal accent, meter-bridge metering"), the same hex palette (`#141618` bg, `#5aa9e6`/`#2f6fae` teal-blue accent, `#71787e` labels, `#a78bfa` purple Hope-label accent, `#ffb454` amber warning), the same mock meter readings (−8.2 / −6.4 LUFS, −1.1 dBTP, PLR 7.1), and the same tab-strip labels. Both were added in the same commit (`65b64bc`, 2026-08-04) — `redesign-v5-mixcheck-dashboard.html` is a self-contained bundled/compiled export (ships its own unpacking runtime, no external file needed); `ozone-redesign-v1.dc.html` is the raw Claude-Artifact "dc" component source for the same design (needs `docs/mockups/support.js`, which is present in the repo — confirmed, 1911 lines, added in the same commit). Practically: opening either live URL shows the same "Ozone 12" graphite + teal-blue MixCheck redesign, just via two different rendering paths.

Also confirmed: **both mockups only implement the MixCheck tab.** `Library`/`Insight`/`Snapshots`/`Settings` appear as inert tab-strip nav labels in both files (no tab content behind them — same stub state as v4); `Marketing` doesn't appear in either file's tab strip at all. None of the still-open stub tabs from `docs/STATUS.md` are actually addressed by this baseline.

**Revised decision needed from Kevin — one question, not a pick-one-of-two:** does he approve the "Ozone-12" graphite/teal-blue treatment as the **MixCheck-tab design baseline**, replacing v4's dark-purple Mixio-violet MixCheck look? (Not "the app's overall skin" — only MixCheck is actually designed in either file.) That needs his own interactive review via the GitHub Pages links below, per the mockup process in `docs/CLAUDE.md` (Kevin reviews live, not a screenshot or a description) — no prior approval of either file exists yet, checked directly, nothing to build on. Once that's answered, the stub tabs (Library/Insight/Snapshots/Marketing/Settings) still need their own dedicated mockup(s) — in whichever direction is chosen — with their own Kevin approval, before any of them can ship; this baseline doesn't cover them.

No files under this repo's redesign scope were changed this session beyond this doc correction and the matching one in `docs/STATUS.md`. Hope→Mia rename untouched, still blocked per the pinned note above.

**Codex read-only review (retroactive — should have run before the first push, corrected process going forward):** a `codex exec -s read-only` pass over this finding and the STATUS.md/HANDOVER.md diffs it produced confirmed the core "same design, two formats" conclusion is well-supported (no material layout/content/control/animation divergence found), and caught three imprecise claims in the first version of this entry — the "byte-for-byte" wording, the "no Library/Insight/Snapshots/Marketing/Settings markup at all" wording (nav labels do appear, just inert), and the "overall app skin" framing of the decision (overstated — only MixCheck is designed). All three are corrected in this version.

**Thread 1 — Mixio-violet redesign, new baseline added, not yet reviewed**

- Two new mockup files pushed to `main` (2026-08-04): `docs/mockups/redesign-v5-mixcheck-dashboard.html` and `docs/mockups/ozone-redesign-v1.dc.html` — **same "Ozone 12" MixCheck design, two export formats, not two directions** (see 2026-08-16 update above). `ozone-redesign-v1.dc.html` is a Claude Artifact "dc" component and needs `docs/mockups/support.js` alongside it to render (present in repo). These supersede `redesign-v4-mixcheck.html`/`aimm-redesign-v2.html` as the current reference point, but only for the MixCheck tab — the still-open stub tabs (Library, Insight, Snapshots, Marketing, Settings) are not addressed by either file.
- `docs/STATUS.md`'s "Full-page Mixio-violet redesign" row was corrected from **SHIPPED** to **IN PROGRESS** — it had been marked shipped while still listing remaining stub tabs, which was already wrong before the new mockups made it worse.
- **Not yet done:** Kevin hasn't reviewed/approved the Ozone-12 MixCheck design (either file opens the same thing). No token rollout should target it until he has.
- Live URLs: `https://begb0037admin.github.io/aimm/docs/mockups/redesign-v5-mixcheck-dashboard.html` and `.../ozone-redesign-v1.dc.html`.

**Thread 2 — Hope→Mia persona rename, fully scoped, blocked from starting**

- Full plan committed: `docs/HOPE_TO_MIA_RENAME_PLAN.md`. Scope confirmed via direct repo verification (not assumption): ~213 "Hope" references in `index.html`, DOM/CSS ids (`hopeRail`, `hopeSphereCanvas`), 6 localStorage keys, `docs/mockups/` + one backup file. Explicitly **excluded**: the dormant 5-persona system (Matthew/Markey/Katie/Ashley/Lauren — Kevin wants this kept, not removed, for possible future revival), the `hope-kb` tag on ~330 unrelated ingested KB transcript files, and `ai-news-channel`'s unrelated "Hope" (a different real person).
- **Blocked on two things, both still true as of this entry:** (1) Cat — Kevin's dedicated agent for general AIMM product engineering — doesn't exist yet; most of this rename is his scope, not a generic session's to improvise. (2) The redesign epic (Thread 1 above) needs to settle first, since `hopeRail` itself is redesign-era code still being actively worked.
- **Open decision, not yet made:** how to handle the 6 localStorage keys for existing users — read-old/write-new (recommended default) vs. outright rename (existing users lose that data). Whoever executes this needs to get an explicit answer from Kevin before touching storage code.
- `docs/ROADMAP.md` → "Hope → Mia persona rename" entry and this file's pinned blocker note (above) both point back to the full plan — a fresh session doesn't need this chat's history, just those two anchors.
- **Naming note found mid-session:** a real agent named Markey (`begb0037admin/markey`) now exists, built 2026-08-03 for voice engineering across Kevin's projects — completely unrelated to AIMM's old dormant in-app persona of the same name. Don't conflate the two if this comes up again.

---

**Date:** 2026-06-29 (v4 Mixio-violet redesign — mockup phase in progress)**
**Status:** File split (AIMM_SPLIT_MIGRATE) on branch `claude/host-domain-redesign-6qbjec` / PR #23. MixCheck mockup built and pushed to `main`. Kevin reviewing.

**2026-06-29 addendum (redesign session — governance + mockup process established):**

**Key decisions locked this session:**

1. **Mockup-first process established and documented.** All UI redesign tabs go through the process in `docs/CLAUDE.md` (§ Mockup review process). One tab at a time, interactive HTML to `docs/mockups/` on `main`, Kevin reviews via GitHub Pages URL, explicit approval before moving to next tab, implementation in live files only after ALL tabs approved. Screenshots rejected — Kevin wants interactive HTML only.

2. **Platform Evolution Epic re-confirmed** (original decision 2026-06-23 — see addendum below). Kevin's exact framing this session: *"AIMM evolves into a proper web app — hosted, login-based, no install. Cloudflare is the natural home since the Worker is already there. Staged approach: Stage 1 — Finish the redesign (single-file, Mixio-violet v4). Stage 2 — Backend foundation (Cloudflare Worker + R2 + auth). Stage 3 — RoEx layer (Python/Librosa microservice, WAV → scored grades). Stage 4 — HyFi/mastering layer (upload mix → get mastered WAV). Stage 5 — Full product (login, project history, server-side Hope memory)."*

3. **AIMM_SPLIT_MIGRATE shipped to feature branch.** `index.html` (shell) + `css/styles.css` + `js/app.js` + `js/sphere.js` — PR #23 on `claude/host-domain-redesign-6qbjec`. Kevin needs to verify aimixmasters.com loads correctly before merging.

4. **Effort level:** High effort authorised for the v4 redesign phase.

5. **Hard rule re-confirmed:** Everything through git — no local edits. All file writes committed and pushed. GitHub is the source of truth.

**What was committed to `main`:**
- `docs/CLAUDE.md` — Mockup review process documented + git-discipline hard rule added
- `docs/mockups/redesign-v4-mixcheck.html` — MixCheck tab mockup (dark violet, 3-column, interactive)

**What was committed to `claude/host-domain-redesign-6qbjec`:**
- `index.html`, `css/styles.css`, `js/app.js`, `js/sphere.js` — AIMM_SPLIT_MIGRATE (PR #23)

**Next session priorities:**
1. Kevin approves (or requests changes to) MixCheck mockup → `https://begb0037admin.github.io/aimm/docs/mockups/redesign-v4-mixcheck.html`
2. Build remaining tab mockups one at a time: Workbench → Library → Insight → Snapshots → Marketing → Settings
3. Kevin verifies aimixmasters.com loads after split → merge PR #23
4. Once ALL mockups approved, implement redesign in live files

---

**Date:** 2026-06-23 (Platform Evolution Epic — architecture decision session)**
**Status:** ROADMAP.md + DASHBOARD.html + STATUS.md updated. No index.html changes.

**2026-06-23 addendum (Platform Evolution Epic — architecture decision):**

Session brief asked for Librosa (Python audio analysis) integration into AIMM's Mix Check feature. Investigation revealed this is architecturally impossible in a browser-only single-file app without Pyodide or a backend. Rather than a hack, Kev confirmed the correct direction: **AIMM evolves beyond single-file**.

**Key decisions locked this session:**

1. **MixCheck accuracy acknowledged as insufficient.** Current Web Audio API pipeline (even with BS.1770-4 meters shipped in build .8) doesn't match professional tools like RoEx. Root cause: tonal balance, dynamics, low-end clarity, transient punch, stereo width all rely on Librosa-level spectral math — not feasible in the browser.

2. **RoEx-style scored analysis report card.** AIMM will produce an A–F (or 0–100) overall mix health score plus per-dimension grades: tonal balance, dynamics, loudness, low end, stereo width, transient punch. Powered by Python/Librosa in a microservice (FastAPI on Railway or Render). This is ARCH-2.

3. **HyFi-style AI online mastering.** Like LANDR — user uploads mix, AI processes it, user downloads mastered WAV. Server-side chain (EQ → compression → limiting → stereo enhancement), platform loudness targeting, genre-aware. This is ARCH-3.

4. **Platform architecture decision: online, browser login, no install ever.** Staged rollout:
   - Stage 1 (current): v4 redesign, single-file, in progress
   - ARCH-1: Backend Foundation — Cloudflare Worker extension + R2 audio storage + auth (Cloudflare Access or magic-link). ~1 day. Gates ARCH-2 + ARCH-3.
   - ARCH-2: RoEx-style Mix Analysis — Python microservice. ~2–3 days. Depends on ARCH-1.
   - ARCH-3: HyFi-style AI Online Mastering — full server-side audio processing. ~3–5 days. Depends on ARCH-1 + ARCH-2.
   - Stage 5: Login, project history, multiple mixes, saved masters, server-side Hope memory.

5. **Cloudflare is primary infrastructure.** Worker already live at `https://aimm-proxy.kevinlelitte.workers.dev` — natural extension point for ARCH-1.

6. **Single-file stays functional throughout migration.** No big-bang rewrite. Each arch stage layers on top; current app degrades gracefully.

**What was committed:**
- `e57a27b` — `docs/ROADMAP.md`: Platform Evolution Epic section appended (ARCH-1/2/3 + Stage 5 + Non-negotiables)
- `c171f959` — `DASHBOARD.html`: placeholder push (error — immediately superseded)
- `e0fe364` — `DASHBOARD.html`: 3 new Backlog cards (ARCH-1, ARCH-2, ARCH-3), count 9→12, footer date 2026-06-23
- `88d7bdf` — `docs/STATUS.md`: Platform Evolution Epic row added, last-updated bumped to 2026-06-23

**index.html was NOT touched this session.** Planning only.

**Next session priorities:**
1. Continue v4 redesign — fill stub tabs (Library, Insight, Snapshots, Marketing, Settings)
2. ARCH-1 scoping — write detailed spec for Cloudflare Worker extension + R2 + auth before touching any code
3. Existing backlog items per ROADMAP.md ordering

---

**Date:** 2026-06-17 (KB ingestion session)**
**Status:** 92 Mix With The Masters videos ingested — KB at 333 total. Commit pending on Mac.

**2026-06-17 addendum (KB ingestion — Mix With The Masters):**
92 videos from `https://www.youtube.com/@mixwiththemasters` ingested via Mac Terminal (YouTube blocks cloud/datacenter IPs — residential IP required). KB: 241 → 333 videos.

Engineers covered: Jaycen Joshua, Leslie Brathwaite, Bainz, Illangelo, Teezio, Anthony Kilhoffer, Young Guru, Boi-1da, Jahaan Sweet, Rodney Jerkins, Timbaland, Stuart White, Ben Baptie, Tom Elmhirst, Josh Gudwin, Kevin Davis, Finneas, Jon Castelli, Neal Pogue + general mastering/technique videos.

17 videos failed (no output files — skip in commit):
- Transcripts disabled: UtKtPe-__r0, 4t_BS6vNIto, oqMxROvki4U, UgYYXosJhNw, vETna7TD25w, 39LGM6iClHs, 0W2mCNTgroI, TtTwXNDLycM, LldUctIXm9I, D3cwAkeNGUU, _txkFmQVxd4, bWmyZiORIp8, tco6qrWcmMI, ycWpHpregLs, bQIZONdZvk8, cPzQXr6rm4E
- Age-restricted: lo4860g6rps

**Kev: run these commands in Mac Terminal to commit and push the new KB files:**

```bash
cd ~/Documents/Claude/Artifacts/aimm
git pull origin main
git add docs/knowledge/
git commit -m "Add 92 Mix With The Masters videos to KB (total 333)"
git push origin main
```

**Genre additions discussed this session (not yet implemented):**
AIMM currently lacks Pop and several adjacent genres. Suggested additions: Pop, R&B/Soul, UK Hip-Hop, Latin Pop, Alt-Pop. Especially Pop — the Mix With The Masters ingestion includes engineers who work heavily in pop (Josh Gudwin/Finneas = Billie Eilish; Tom Elmhirst = Adele/Amy Winehouse). Add to `index.html` genre picker in a future session.

---

**Date:** 2026-06-04 (end of session — Cowork)**
**Status:** P-A + P-C shipped. Voice call start/end via mouse BROKEN. Spacebar-only redesign queued for next session.

**2026-06-11 addendum (remote session):** Cloudflare Worker key relay SHIPPED — merged PR #1 (`a533ed3`), live on Pages. `worker/` + `AIMM PROXY` shim in index.html + default agent IDs baked in; Worker deployed at `https://aimm-proxy.kevinlelitte.workers.dev` with both key secrets set, `/health` verified green pre-merge. No key/agent entry needed on any device now. Rotation + sharing-security notes in `worker/README.md`.

**2026-06-11 addendum 2 (remote session):** The queued spacebar-only redesign from the 2026-06-04 brief is now IMPLEMENTED, plus the true root cause of stacked sessions found and fixed: `elEnd()` during the connect window cleaned up state while `EL.conversation` was still null, orphaning the in-flight session — next press stacked a new one (double billing). Fix: `EL.liveSessions` registry (elEnd kills ALL handles), `EL.endRequested` (end-mid-connect honoured when the handle exists), `EL.ending` re-entrancy lock, 600ms spacebar cooldown, mouse/touch call control stripped from the sphere (drag-only now), double-tap arming deleted. Also fixed: `open_dashboard` (popup-blocked synthetic anchor → in-app overlay iframe, relative URL so localStorage origin always matches), `capture_to_roadmap` dedup now reads `docs/ROADMAP.md` not the frozen root file, and captures fire a visible toast. NEW PLANNED ITEM: durable captures store (Worker KV) — see docs/ROADMAP.md. The "Voice call start/end via mouse BROKEN" status line above is RESOLVED.

**2026-06-11 addendum 4 (remote session):** Kev's retest showed round-1-only symptoms — stale Pages cache suspected (his "end during connect works" = round-1 behaviour that didn't exist before; everything failing = round-2 territory; both deploys confirmed green in Actions). Shipped per Kev's request: `AIMM_BUILD` version stamp (bottom-right badge, const at top of main script, **bump every index.html commit — now a hard rule in docs/CLAUDE.md**) and the panic button (`pagehide` → endSession on all `EL.liveSessions`, so closing the tab always stops billing instantly). Verification protocol going forward: stamp must read the expected build BEFORE any retest. Current build: `2026-06-11.4`. Also note theory on mid-call stacking: an unanswered open_dashboard tool call trips the SDK error path → old onError wiped call state while the server session lived → next space press started session 2. Round 2's TOOL_DEFS fix removes the trigger; if stacking recurs on build ≥ .4, investigate onError → elCleanup as the next suspect (consider NOT cleaning up on non-fatal errors).

**2026-06-11 addendum 5 (remote session, build .5):** Kev verified build .4: spacebar start/end + "Ending call…" toast PASS, dashboard tool FIRES — but the full-screen overlay hid the chat (felt like a lost call; he emergency-closed the tab and the panic button correctly killed the session). Shipped in .5: open_dashboard tries `window.open` (new tab) first — works every time once Kev allows pop-ups for the site (Chrome: padlock → Site settings → Pop-ups → Allow) — overlay is now only the blocked-popup fallback, and Hope's tool response explains which happened. Plus durable captures: Worker `/captures` endpoint (Workers KV, binding `AIMM_KV`), capture_to_roadmap + DASHBOARD.html sync the inbox there (merge by id, localStorage fallback). KEV SETUP PENDING: KV namespace `aimm-captures` + binding `AIMM_KV` + re-paste worker code — steps in worker/README.md; `/health` confirms with "AIMM_KV — bound".

**2026-06-11 addendum 6 (remote session, build .6):** Hope's dashboard "sight" + inbox autonomy restored. (a) `read_doc('DASHBOARD.html')` remapped to a live digest — captures inbox (numbered + ids) + docs/ROADMAP.md — so she discusses exactly what Kev sees; RT_INSTRUCTIONS rewritten (she must never claim she can't see the dashboard). (b) New `manage_roadmap_inbox` tool (TOOL_DEFS + handler): list/remove/promote/edit inbox entries, persists to localStorage + Worker KV, refreshes the open overlay live. (c) Server-side registration WITHOUT the orphaning bulk script: Settings → "🔧 Register dashboard-inbox tool" button calls the EL API through the key relay (POST /v1/convai/tools if name absent, then PATCH agent tool_ids append-only). KEV ACTIONS PENDING: click that button once, start a fresh call; plus the still-pending KV binding (addendum 5) — without `AIMM_KV` the inbox works per-browser only. Roadmap-file items stay read-only for Hope (repo files; editing them = future GitHub-token Worker feature).

**2026-06-11 addendum 7 (remote session, build .7):** Double-tap orb call control for iPad (no spacebar there). `orbTap()` in the mouseup/touchend handlers: first non-drag tap arms (mic-armed flash, 450ms window), second tap calls `callToggleFromGesture()` — same shared 600ms cooldown + hardened elEnd + restart lock as the spacebar. This SUPERSEDES the morning's "spacebar-only, sphere does nothing" decision; safe now because the stacking root causes (orphaned sessions, eager cleanup) were fixed in builds .3–.4. Single taps never start calls; drag untouched; tooltips updated.

**2026-06-11 addendum 8 (remote session, build .8):** Mix Check meters rebuilt on real ITU-R BS.1770-4 after Kev found readings "completely off" vs RoEX + his DAW. Old analyser: raw RMS "LUFS" (no K-weighting/gating), sample-peak "true peak". New: `kWeighting(fs)` biquads (sample-rate-redesigned, pyloudnorm formulas), gated 400ms blocks (integrated), loudest 3s window (short-term), `truePeakDb` 4× windowed-sinc oversampling, DR = PLR. Validated in Node against reference signals before shipping (997Hz −18dBFS stereo = −18.00 LUFS at 44.1k + 48k; inter-sample test: sample peak −3.01 → TP +0.08). If future meter disputes arise: extract the engine with the regex in this session's notes and re-run the calibration suite rather than eyeballing.

**2026-06-11 addendum 9 (remote session, build .9):** Live input metering on Mix Check (Kev's Tonal-Balance ask). `LIVE` engine in the REFERENCE TAB IIFE: getUserMedia (processing disabled, device picker, mono up-mix guard) or getDisplayMedia tab audio → ScriptProcessor(4096) → stateful K-weighting biquads → 100ms segments → momentary/short-term/gated-integrated + max-hold 4× TP; renders to the existing meter cards 4×/s; Stop locks into refLastAnalysis/refPopulate/refEvalPills. Spectral canvas live via swapped refAnalyser (restored on stop if a file is loaded; file load stops live first). Streaming path validated in Node: simulated −18dBFS 997Hz stereo chunk-feed reads −18.00 LUFS / −18.00 dBTP. DAW feed on macOS = BlackHole 2ch + Multi-Output Device; correlation/balance/band pills remain file-analysis-only for now.

**2026-06-11 addendum 10 (remote session, build .10):** Tonal Balance-style spectral display on Mix Check. `REF_CORRIDORS` (per-genre [freq,lo,hi] anchors, log-interpolated via `corridorAt`), renderer rewritten (`refDrawCanvas`: corridor band + quadratic-smoothed cyan curve, gain-normalised to the corridor over 150Hz–3kHz), `refPtsFromDbBins` 64 log-spaced points from float analyser data (fftSize now 8192 everywhere), `fftMag`/`refFileSpectrum` Welch-average whole-file spectrum drawn at load, `#refCurveTarget` selector (auto = STATE.genre), graphite CSS restyle, corridor paints on tab open, idle sine animation retired. Corridor curves are house-made approximations — tune anchors in REF_CORRIDORS if Kev wants them tighter/looser per genre.

**2026-06-11 addendum 11 (remote session, build .11):** Mix Move cards (Mixio steal #1) shipped: `propose_mix_move` in TOOL_DEFS + handler (pushes kind:'mix-move' into AICHAT.history), card renderer branch in aichatRender (+ .mm-* CSS), `aimmApplyMixMove` (add_plugin_to_bus + set_plugin_settings + ✓ applied flip), RT_INSTRUCTIONS rule. Settings register button generalised: `AIMM_NEW_AGENT_TOOLS` list — registers manage_roadmap_inbox + propose_mix_move idempotently. KEV ACTIONS: re-click the Settings register button, then fresh call. CAPTURED: P-K2 bus snapshot overlay (planned) + the full-page RoEX-modern redesign epic (mockup-first; waiting on RoEX screenshots from Kev to anchor palette/type).

**2026-06-11 addendum 12 (remote session, build .12):** Spectral display fix per Kev's screenshot (curve clipping at top): MAX_DB 0 → +6 headroom, canvas 216 → 300px, dB gridlines recomputed for the +6..-48 scale (0/-6/-12/-18/-24/-36 at 11/22/33/44/56/78%). Plus the redesign mockup BUILT: docs/mockups/aimm-redesign-v1.html — Mixio-violet (from Kev's actual screenshot; he corrected RoEX → Mixio) × TBC corridor; three zones: channel rack (bus colours, M/S, capture-soloed-bus button), black analyzer well (corridor + multicolour jagged per-bus curves = P-K2 preview), Hope chat with numbered mix-move card + confidence %. View at /aimm/docs/mockups/aimm-redesign-v1.html on Pages. Awaiting Kev sign-off before any design-token work on index.html.

**2026-06-11 addendum 13 (remote session, build .13):** Redesign epic APPROVED. Shipped ahead of the skin: **Hope rail** — `#hopeRail` fixed right dock on every tab; open = `.aichat-layout` node physically relocated into `#hopeRailBody` (ids/listeners travel), collapsed = node returns before `#aichatHome` in the Conversation panel; `aimmHopeRail_v1` persisted, default open ≥1200px, reopen bubble bottom-right. Per-tab mockups: docs/mockups/aimm-redesign-v2.html (clickable tabs, 8 views, content-inventory footers per tab). Kev constraints locked: NO content loss (CSS reskin only), OUR smooth corridor analyser stays (Mixio's jagged multicolour FFT rejected), chat rail everywhere. Next: Kev reviews v2 → staged design-token rollout, tab by tab, build bump per stage.

**2026-06-11 addendum 3 (remote session, round 2):** Kev retested — dashboard still "isn't connecting" + spacebar end felt dead. TRUE root cause of the dashboard found: `open_dashboard` is registered on the ElevenLabs side but was never added to `TOOL_DEFS` in index.html, and `clientTools` is built from `TOOL_DEFS` — the agent's call had no client handler and timed out. Entry added (no EL re-registration needed). Also: `read_doc` server-side enum can't express `docs/ROADMAP.md`, so the client now remaps `ROADMAP.md`→`docs/ROADMAP.md` and `CLAUDE.md`→`docs/HANDOVER.md` (Hope was reciting the frozen root roadmap). And `elEnd` now paints instant "Ending…" feedback (status/button/sphere/toast) before the async teardown (3s cap) — the dead-feeling end press was why Kev kept pressing and stray sessions crept in.

---

### What is AIMM

**AI Mix Masters** — a single-page browser app (one file: `index.html`, ~13,000 lines, no framework, no build step) that helps Kevin mix and master trap/hip-hop. It connects to ElevenLabs Conversational AI (Claude Sonnet 4.6 brain, Hope voice) so Kev can talk to an AI assistant while working on his mix. The "sphere" is a Three.js WebGL particle orb that acts as the call button — tap it to start/end a conversation with Hope.

**Live:** https://begb0037admin.github.io/aimm/
**Local:** `~/Documents/Claude/Artifacts/aimm/` → `python3 -m http.server 8000`

---

### What shipped this session (2026-06-04)

| Commit | What |
|---|---|
| `dcd9ef7` | P0 billing fix: double-tap guard on sphere + tab-change debounce |
| `999006a` | Dashboard tile parser fix |
| `a3d96ba` | P-A: Mix Check tab — threshold pills + manual input overrides |
| `795f7c1` | Docs update |
| `3a87e82` | Voice bug fixes: safety net, restart lock, spacebar routing |
| `962cd30` | Fix: show meter dashboard without WAV file |
| `620f708` | P-C: Retire Repair tab, reorder Mix Check layout |

---

### The billing problem (context)

ElevenLabs bills per conversation session. Each `elStart()` call = one billable session. Kevin was generating 50+ micro-sessions per day at ~£85/month because every accidental tap on the sphere opened a new session.

**The fix attempt:** We added a double-tap guard — first tap arms the sphere (visual flash), second tap within 500ms starts the call. This worked for starting. But it broke ending.

---

### What broke — the voice start/end mess

**The core failure:** The sphere is a Three.js WebGL canvas inside a draggable div. Mouse events on it are unreliable. After multiple rounds of fixes, the call start/end behaviour via mouse is still broken and inconsistent. Here's the history:

**Problem 1 — original:** Single tap on sphere during active call was starting a NEW call instead of ending. Root cause: `EL.active` check in `mouseup` handler was being bypassed (likely Three.js canvas event handling interference).

**Fix attempt 1:** Added `EL.active` safety net inside `micStartFromFloat()` itself — if called while active, end instead of start.

**Problem 2 — introduced by fix 1:** Now there are two code paths that can call `elEnd()` on a tap:
- `mouseup` handler: `if (EL.active) → elEnd()`
- `micStartFromFloat()`: `if (EL.active) → elEnd()`

Because `elEnd()` is **async** (`await EL.conversation.endSession()`), `EL.active` doesn't become false until after the await resolves. If both paths fire in quick succession (which happens on Mac trackpad with its multiple events), `elEnd()` gets called **twice**, corrupting the state machine.

**Problem 3 — double-tap + end interaction:** The 500ms double-tap window interacts badly with the end gesture. A single tap to end the call takes ~100ms to process; if the user taps again within 500ms expecting the same double-tap symmetry as starting, the second tap arms the start sequence.

**Current state:** Mouse-based call control is fundamentally unreliable on the Three.js sphere. The event chain is too complex and the async state machine has too many race conditions to fix cleanly.

---

### The decision: spacebar only

**Kevin's call:** Disable mouse entirely for call start/end. Spacebar is the only trigger.

**Rationale:**
- Spacebar is a single, unambiguous event — no drag detection, no multi-event sequences, no async races
- The current spacebar handler already has `if (EL.active || EL.connecting){ elEnd(); return; }` before `isTypingTarget` — it already correctly ends a call
- Starting via spacebar calls `micStartFromFloat({force:true})` which bypasses double-tap
- Clean, predictable, no race conditions

**What "working correctly" looks like:**
- **Space** = start call (no double-tap needed, it's deliberate)
- **Space** = end call (single press, immediate)
- **Mouse/tap on sphere** = do nothing (completely disabled for call control)
- The sphere still animates (idle/listening/speaking states via Three.js)
- The sphere is still draggable (repositioning still works)

---

### What Seat A needs to design

Read the current `mouseup`, `mousedown`, `touchstart`, `touchend` handlers on `floatMicEl` in `index.html` (search `floatMicEl.addEventListener`). There are four of them, starting around line 12560.

**The ask:** Design the minimal surgical change to:
1. Strip out all call start/end logic from the mouse handlers (mouseup, touchend) — leave only drag handling
2. Verify the spacebar handler is clean and correct
3. Confirm `micStartFromFloat()` still works correctly for spacebar path
4. Decide whether the double-tap guard should stay (for spacebar, `force:true` bypasses it anyway) or be removed entirely since mouse is disabled

**Do NOT touch:**
- Drag repositioning logic (mousedown/mousemove/mouseup drag detection must stay)
- The sphere Three.js animation code
- `elStart()` / `elEnd()` / `elCleanup()` internals
- Any tab or non-sphere UI

**Issue the brief** once you've read the code and know exactly which lines to change.

---

### Current working tree state

All files committed and pushed. Working tree is clean. Last commit: `620f708`.

### Spacebar handler location

Search `window.addEventListener('keydown'` — around line 12710. The handler correctly checks `EL.active || EL.connecting` BEFORE `isTypingTarget` (this was fixed this session). For starting, it calls `micStartFromFloat({force:true})`.

### Mouse handler locations

Search `floatMicEl.addEventListener` — four handlers around line 12560:
- `mousedown` — sets `RT.mouseHeldOnMic`, drag start, EL no-op
- `mouseup` — owns start/end logic (THIS is where to remove call control)
- `touchstart` — mobile equivalent of mousedown
- `touchend` — mobile equivalent of mouseup (THIS too)

### The `micStartFromFloat` function

Around line 12416. Currently has:
1. `EL.active` safety net → `elEnd()` (should be REMOVED if mouse is disabled)
2. Agent ID check
3. 1.5s restart lock (can be REMOVED if mouse is disabled)
4. Double-tap guard with `opts.force` bypass (can be SIMPLIFIED or REMOVED)

If mouse is disabled, `micStartFromFloat` is only ever called by spacebar with `{force:true}`. The double-tap, restart lock, and safety net all become unnecessary.

---

## Previous handover point

**Date:** 2026-05-26 evening (Seat C: Cowork — Hope sphere v3 Three.js, NOT YET CONFIRMED)**
**Session:** Hope sphere v3 mockup build — Three.js WebGL particle orb

**Date:** 2026-05-27 evening
**Status:** Hope sphere v3 THREE.js — LIVE on GitHub Pages (https://begb0037admin.github.io/aimm/)

### Working practice — PERMANENT

Kev works against the live GitHub Pages URL at all times:
https://begb0037admin.github.io/aimm/

Never direct Chrome to local `file://` paths or `docs/mockups/` paths.
All smoke testing and verification uses the live URL only.
Mockup files in `docs/mockups/` are design references — they are never opened directly for testing.

### What the current v3 contains

- **Three.js r128** from cdnjs — WebGLRenderer, alpha:true, 300×300 canvas
- **5000 fibonacci sphere particles** (surface, radius 1.0) + **800 inner glow** (radius 0.40) — both ShaderMaterial + AdditiveBlending
- **Fresnel atmosphere**: BackSide SphereGeometry(1.22), rim = `pow(1-dot(N,V), 2.2) * uGlow`
- **Core bead**: MeshBasicMaterial + AdditiveBlending, r=0.055, pulses in speaking state
- **6 animated states** (idle/listening/speaking/thinking/emphatic/happy) with smooth lerp transitions
- **State buttons + reference cards** (CSS gradient orbs, not extra WebGL contexts)
- **GLSL is strictly ASCII** — all shader source is `['line',...].join('\n')` arrays. This was the root cause of every black-screen failure in v1/v2.

### Visual upgrades to apply next session (before showing Kevin)

Adobe Stock reference search confirmed the target aesthetic. These are the improvements to make before asking Kevin for sign-off:

1. Canvas `SIZE` 300 → 420px
2. Surface particles 5000 → 12000
3. Add spray layer: 500 particles at radius 1.06–1.14, `uPx: 80`
4. Fragment shader: `pow(vBr, 1.3)` on the alpha for sharper bright/dark band contrast
5. `.stage` CSS: `background: radial-gradient(ellipse 60% 50% at 50% 50%, #00e5ff0a 0%, transparent 70%)`
6. Idle state: very slow heartbeat pulse (0.08Hz) on core opacity

### NOT committed

Nothing was committed this session. When Kevin approves the sphere mockup, the end-of-session commit should cover everything outstanding from the prior session too:

```bash
cd ~/Documents/Claude/Artifacts/aimm
git add index.html docs/HANDOVER.md docs/mockups/ CLAUDE.md
git commit -m "feat(hope-sphere): Three.js WebGL particle orb mockup v3 + prior session mix-check tab rename"
git push origin main
```

### Smoke test results (2026-05-27 evening)
1. **open_dashboard** — FAIL. Hope says "still not connecting — that tool isn't connecting right now." Switch level fix committed but not yet confirmed working. First task tomorrow: verify the fix landed correctly and re-test.
2. **read_doc docs/ROADMAP.md** — FAIL. Hope still falling back to root ROADMAP.md or offering read_doc as alternative. Enum and whitelist updated and re-registered but not yet smoke tested clean.
3. **Hope/You label colours** — PARTIAL. Changes applied and committed, live app not yet verified.
4. **User bubble purple** — PARTIAL. Applied and committed, live app not yet verified.
5. **Sphere flash** — PASS. Confirmed fixed during session.
6. **Sphere colours** — PASS. Confirmed electric violet idle, emerald green speaking.

### First tasks tomorrow (in order)
1. Hard refresh live app, verify Hope/You labels and user bubble colour
2. Ask Hope "Can we look at the roadmap together?" — verify open_dashboard fires and opens tab
3. Ask Hope "What's in the P1 backlog?" — verify read_doc hits docs/ROADMAP.md
4. If open_dashboard still fails — inspect switch structure again before any further briefs
5. Once smoke tests pass — move to remaining P-A work (threshold pills + manual override)

---

## Previous handover point (2026-05-26 session start)

**Date:** 2026-05-26 (session 6)**
**Session:** P-A partial + Hope sphere design sprint

### What shipped this session (committed to main)

- **Tab rename:** `data-label="Reference"` → `data-label="Mix Check"`, span text updated in `index.html`
- **Reference Guides removed:** Frequency Map card + Stereo Width by Band card deleted from `#eq` in `index.html`
- **Seat map updated:** `docs/CLAUDE.md` seat map rewritten to Seat A/B/C/D naming; `CLAUDE.md` session headers updated to match
- **Mockups updated:**
  - `docs/mockups/mix-check-pills.html` — FabFilter gaussian island spectral renderer applied (replaces old simple gradient fill); canvas height 140px, background #0d1117
  - `docs/mockups/ab-ref-v2.html` — New file. Side-by-side A and B layout; separate spectral canvas per side with FabFilter gaussian island renderer; four independent metric cards per side; getDisplayMedia tab-audio capture for B slot; ACRCloud fingerprinting noted for auto-track-name; Hope commentary section
  - `docs/mockups/hope-sphere-v2.html` — **REJECTED** (see below). Do not use as reference.

### Commit state

`index.html` tab rename + Reference Guides removal are committed. All mockup files above are written to disk but **not yet committed**. End-of-session commit should include:

```bash
cd ~/Documents/Claude/Artifacts/aimm
git add index.html docs/HANDOVER.md docs/mockups/
git commit -m "feat(mix-check): rename tab, remove Reference Guides, update mockups (FabFilter spectral + A/B Ref v2)"
git push origin main
```

---

### ⚠️ SINGLE TASK FOR NEXT SESSION — Hope sphere mockup (GLSL WebGL)

**Previous mockup `hope-sphere-v2.html` was rejected.** It used Canvas 2D Lissajous parametric ribbon curves — too stylised, not realistic enough. Kevin explicitly said "This is nothing like the screenshot I gave you."

**Visual reference:** Adobe Stock asset ID `1883051794` — *"Glowing red plasma sphere forming from darkness and fading out, dynamic flowing light surface, futuristic energy orb animation, seamless loop, 4K 60fps."* The sphere IS the plasma — the surface churns organically, emerges from black space, has deep volumetric glow. No solid boundary. Ultra-realistic.

**Agreed approach: GLSL WebGL volumetric plasma shader** — single HTML file, no library needed.

**Technical spec:**

```
Canvas: <canvas> with WebGL context { alpha: true }
Clear colour: (0, 0, 0, 0) — fully transparent
Position: fixed, draggable (same principle as current floating mic button)
Size: ~200×200px canvas

Vertex shader:
  - Full-screen quad (two triangles)
  - Passes UV coordinates to fragment shader

Fragment shader:
  1. Compute ray direction from UV (simple ortho or slight perspective)
  2. Ray-sphere intersection test (sphere at origin, radius 0.9)
  3. If miss → discard (transparent pixel)
  4. If hit → raymarch inside sphere (12–16 steps along ray)
     - At each step: sample FBM noise at (worldPos + uTime * uSpeed)
     - FBM = 4 octaves, each octave: value noise or hash-based gradient noise
     - Domain-warp the noise (warp input pos by another noise pass first)
     - Accumulate emission density: density += fbm(pos) * stepSize
  5. Fresnel rim glow: pow(1.0 - dot(normal, viewDir), 3.0)
     - Normal = point on sphere surface at ray entry
     - Adds bright rim that fades to transparent at edge
  6. Final colour: mix(uColor1, uColor2, fbmValue) * density + fresnel * uColor1
  7. Alpha: clamp(density * 2.0 + fresnel * 0.6, 0.0, 1.0)
  8. Simple reinhard tone-map: col / (col + 1.0)

Uniforms:
  - uTime (float) — updated each rAF
  - uResolution (vec2)
  - uColor1 (vec3) — primary plasma colour
  - uColor2 (vec3) — secondary/accent colour
  - uSpeed (float) — noise animation speed
  - uAmplitude (float) — 0.0–1.0, scales plasma churn for speaking state
  - uRainbow (float) — 0.0 or 1.0, enables hue-cycle for happy state
```

**State configs (buttons in mockup, uniforms only — no shader recompile):**

| State | uColor1 | uColor2 | uSpeed | Notes |
|---|---|---|---|---|
| idle | `#00e5ff` (teal) | `#7c3aed` (purple) | 0.3 | slow drift |
| listening | `#22d3ee` (cyan) | `#3b82f6` (blue) | 0.6 | medium pulse |
| speaking | `#a855f7` (purple) | `#ec4899` (pink) | 1.2 | uAmplitude oscillates via sin(time) |
| thinking | `#1d4ed8` (deep blue) | `#e2e8f0` (near-white) | 0.2 | slow, compressed warp |
| emphatic | `#f59e0b` (amber) | `#f97316` (orange) | 0.7 | grounded warm pulse |
| happy | rainbow | rainbow | 1.5 | uRainbow=1 → hsl(uTime*55, 100%, 70%) in shader |

**Mockup requirements:**
- Save as `docs/mockups/hope-sphere-v3.html` (v2 is the rejected one)
- Dark panel background behind the canvas so Kevin can judge transparency (e.g. a dark gradient div)
- State switcher buttons below the canvas
- Canvas itself transparent — the dark background shows through it
- Draggable canvas (mousedown + mousemove + mouseup)
- Static label showing current state name

**Do NOT touch `index.html`** — mockup only. Integration happens in a later session once Kevin approves the visual.

---

### Remaining P-A work (after sphere mockup approved)

Two sub-tasks of P-A not yet done:
1. Mix Issues symptom pills section — auto-highlight from WAV analysis thresholds (spec in `docs/ROADMAP.md` P-A)
2. Editable manual override input on each meter card

### P-C, P-B, P-E

Not started. Order: P-C (retire Repair tab) → P-B (build A/B Ref tab) → P-E (new Hope tools).
Specs in `docs/ROADMAP.md`. Mockup for P-B: `docs/mockups/ab-ref-v2.html` (approved).
Mockup for P-D: pending approval of `hope-sphere-v3.html` this session.

---

## Previous handover point

**Date:** 2026-05-24 (session 5)
**Session:** Smoke test + KB pipeline fixes + TheCosmicAcademy ingestion

### What was done this session

- Full 15-question smoke test run against Hope — identified KB never firing (0/15 hits)
- Root cause 1: buildResearchDigest() early-exit when no active KB notes — YT digest never reached Hope
- Root cause 2: .nojekyll missing — GitHub Pages was 404ing all .md transcript files via Jekyll processing
- Root cause 3: KB trigger language too conservative — "clearly relevant" causing Hope to skip KB
- All three fixed and verified — retest showed 6/6 KB hits, Hope citing video titles and channels unprompted
- Added 28-topic YouTube topic index to RT_INSTRUCTIONS
- Ingested 18 TheCosmicAcademy videos — KB now at 241 videos
- ~/bin/ingest wrapper script installed and on PATH
- Ingest Video.command double-click launcher created at repo root
- docs/INGEST.md created — full two-path ingestion protocol
- Both branches at 952a37d, GitHub Pages live

### ⚠️ IMMEDIATE NEXT SESSION TASKS

1. DAW Bridge Epic — first priority next session. Three phases scoped 2026-05-24, inspired by EchoJay plugin review:
   PHASE 1 — Plugin Scan (companion JUCE plugin)
   - Lightweight VST/AU/AAX companion plugin
   - Single function: scan DAW plugin list → export aimm-plugins.json
   - User drops JSON into AIMM → Hope confirms library update
   - Existing manual/screenshot/voice input kept as fallbacks
   PHASE 2 — AIMM Import Handler (index.html)
   - "Sync from DAW" button on Library or Settings tab
   - JSON drop/import handler
   - Merges with existing plugin library, no duplicates
   PHASE 3 — Audio Capture Bridge
   - Plugin captures snippet during DAW playback
   - Sends LUFS, spectrum, dynamics to AIMM via local WebSocket
   - Hope advises based on actual signal data
   - Reference track comparison (à la EchoJay compare feature)
   SESSION 6 START: assess whether the JUCE plugin for Phase 1 can be built, or if an alternative approach is needed
   (e.g. Logic Pro script, DAW export workaround). Scope Phase 1
   fully before touching index.html.
2. Add TheCosmicAcademy videos to the YOUTUBE TOPIC INDEX in RT_INSTRUCTIONS (18 new videos not yet in the topic map)
3. YouTube citation links — Hope should surface clickable YouTube URLs when citing a video, not just title and channel
4. Branch strategy — stop working on voice-elevenlabs separately, consolidate to main only
5. Continue KB ingestion — Logic Pro & DAW Training tier (14 channels remaining)

### ⚠️ Commit reminder

index.html has no uncommitted changes. All clean.

### Remaining Mixing/Mastering channels (12 of 15) — superseded

### Remaining Mixing/Mastering channels (12 of 15)

| Channel | URL | Notes |
|---|---|---|
| ~~Alex Rome~~ | ~~`https://www.youtube.com/@AlexRome`~~ | ~~Hip-hop/beat mixing — skip EDM~~ — ✅ 12 ingested (index 116→127) |
| ~~Nathan James Larsen~~ | ~~`https://www.youtube.com/channel/UC3JgLB0Jw2KwXg0OAXS4rng`~~ | ~~Home studio mixing~~ — ✅ 12 ingested (index 127→139) |
| ~~Adam Lewis Mixing~~ | ~~`https://www.youtube.com/channel/UCSA5LGpNaob5kajkhaBTbrQ`~~ | ~~Hip-hop before/afters — high value~~ — ✅ 20 ingested (index 139→159) |
| ~~Try Karra~~ | ~~`https://www.youtube.com/channel/UCLwDLGL3Ejqu-xJp57CptRg`~~ | ~~Pop vocal — evaluate carefully~~ — ✅ 8 ingested (index 159→167) |
| ~~Underdog Music Academy~~ | ~~`https://www.youtube.com/channel/UC1sxbxdkwQKWV5YUzDVftcA`~~ | ~~Verify content first~~ — ⛔ Skipped — techno/modular/eurorack only, zero hip-hop relevance |
| ~~Bthelick~~ | ~~(search YouTube)~~ | ~~House/EDM — likely skip~~ — ⛔ Skipped |
| ~~Wayne.wav~~ | ~~(search YouTube)~~ | ~~High value — pick freely~~ — ⏸ Deferred (needs evaluation) |
| ~~London Rain~~ | ~~(search YouTube)~~ | ~~Likely artist — verify then likely skip~~ — ⛔ Confirmed artist, skipped |
| ~~Arsiney Music~~ | ~~(search YouTube)~~ | ~~Artist not tutor — skip~~ — ⛔ Skipped |
| ~~Yaahn Hunter Jr.~~ | ~~(search YouTube)~~ | ~~High value — pick freely~~ — ✅ 15 ingested |
| ~~Produce Like A Pro~~ | ~~`https://www.youtube.com/@ProduceLikeAPro`~~ | ~~Warren Huart — pick mixing-specific only~~ — ✅ 20 ingested |
| ~~Hardcore Music Studio~~ | ~~`https://www.youtube.com/channel/UCb-ISKOACgJCOtQ9vO_99QQ`~~ | ~~Rock/metal — trim to mixing principles only~~ — ⏸ Deferred |

### ⚠️ Commit reminder — index.html still uncommitted

`index.html` (buildYtKbDigest 6000-char cap) remains in working tree. Commit alongside next batch.

### ⚠️ Ingestion process — ALWAYS follow this going forward

**Pre-flight checklist (Kev must do before every batch):**
1. Connect VPN (fresh IP — home IP may still be rate-limited)
2. Have `cookies.txt` present at `~/Documents/Claude/Artifacts/aimm/cookies.txt`
3. Test a single video first before running the full batch

**Command template for every future ingestion run:**

Single video:
```bash
cd ~/Documents/Claude/Artifacts/aimm
python3 scripts/ingest_yt.py "https://www.youtube.com/watch?v=<VIDEO_ID>" \
  --channel "Channel Name" \
  --cookies cookies.txt \
  --delay 5
```

Batch (multiple videos — ALWAYS use this for 2+ videos):
```bash
cd ~/Documents/Claude/Artifacts/aimm && for vid in ID1 ID2 ID3 ID4; do python3 scripts/ingest_yt.py "https://www.youtube.com/watch?v=$vid" --channel "Channel Name" --cookies cookies.txt --delay 5; done
```

Replace `ID1 ID2 ID3` etc with the video IDs to ingest.

**Important**: Always pass full YouTube URLs, not raw video IDs. Always include `--channel`, `--cookies`, `--delay 5`.

### Sandbox constraint — permanent

Cowork historically could not run `ingest_yt.py` against YouTube (sandbox proxy blocks all YouTube traffic — 403 Forbidden), and Cowork is retired anyway. Note kept for historical context only — not relevant to current process.

**Full ingestion process:**

1. Find channel URL via web search
2. Kev runs in his terminal: `yt-dlp --flat-playlist --print "%(id)s|%(title)s" "<channel_url>/videos" 2>/dev/null` — pastes output back
3. Curate top 20, Kev confirms
4. Issue ingest commands for Kev to run in his terminal (VPN on, cookies.txt present)
5. Update HANDOVER.md + STATUS.md after Kev confirms success

### Remaining channels after this batch (42 total — Mixing/Mastering 12 + others):

**Mixing/Mastering** (12 remaining — see Current handover point above)

**Logic Pro & DAW Training** (SEIDS done — 14 remaining):
MusicTechHelpGuy, Why Logic Pro Rules, Jono Buchanan, Sun Dog, imamusicmogul, Logic Pro Life, SF Logic Ninja, KC Sounds, Make Your Music, Constantine_music, Valentina Bilancieri, Charles Cleyn, Beat Making Basics, Busy Works Beats

**Trap/Hip-Hop Specific:**
Jewel Kane, ProducerGrind, Cymatics

**Plugin & Sound Design:**
Streaky, Kush Audio

**Music Business & Marketing** (do last — trim weak ones first):
Smart Music Business, Curtiss King TV, Smart Rapper, BrandMan, Adam Ivy, Music Industry How To, Baywood Media, Bandzoogle, Music Millionaires, Paradym Music Group, Full Stack Creative, JamMob, Pay Us No Mind, K Felon, View Maniac

---

## Bootstrap order (every session)

1. Read root `CLAUDE.md`
2. Read root `ROADMAP.md`
3. Read this file (`docs/HANDOVER.md`)
4. Read `docs/STATUS.md`
5. Confirm oriented with three-bullet summary
6. Check: is index.json over 50 videos? If yes, flag context window cap issue before starting ingestion.
7. Begin work

---

## Previous handover — 2026-05-22 (evening)

**Session:** ingest_yt.py fix + SEIDS back catalogue ingestion

### What was done
- Rename sweep: confirmed complete by Kev — all phases done
- `ingest_yt.py` fix: `update_index()` function added — now auto-upserts entry into `docs/knowledge/index.json` after every ingestion. Idempotent re-ingestion confirmed working.
- `today` pulled up to `main()` and passed into both `write_markdown()` and `update_index()`
- index.json structure confirmed as `{"videos": [...]}` — update_index() reads/writes `data["videos"]` correctly
- SEIDS back catalogue: 20 videos ingested, index at 20 videos, zero errors
- yt-dlp PATH fix: added `$HOME/Library/Python/3.9/bin` to `~/.zshrc` — permanent

### SEIDS — 20 videos ingested

| Video ID | Title |
|---|---|
| 6WPtHxWkY2k | Logic Pro 101: Beginner's Guide (previously ingested) |
| 86BqtxsJWnI | Melodyne in Logic Pro 101: Beginner Guide |
| VZtH4_Z7gos | 3 Easy Ways to Create Bass In Logic Pro |
| K6fC7VBBj_o | Create a Stutter Effect in Logic (Using ONLY Stock Plugins) |
| JPKUpYrnXQs | Melodyne Is $99–$700… Logic Pro Has This Free |
| 0ITnE9QmgKs | How to Produce a Demo in Logic Pro |
| YRvSLQwVG7g | Free Logic Pro Plugins You're Sleeping On |
| gQ2dTLPbOks | 5 Logic Pro Automation Tricks You NEED to Try |
| RfR-0M7YoFM | How to Write Beautiful Chord Progressions in Logic Pro |
| YljiLCUs4Kc | How I Turned a 4-Bar Loop Into a Full Song |
| jBJh9Sn2RSE | Make INSANE Sounds in Logic Pro (No Plugins Needed) |
| phuwWWSWrDY | Most Producers Have NO Idea These Logic Pro Features Exist |
| zpyJFmx9NAU | You're Not Using Logic Pro Correctly |
| sxvAhaqQ5Ew | Every Producer Should Try THIS Daily Exercise |
| 8C837VYG1ws | 3 Ways to Create Chords in Logic Pro |
| p0bnk53H5hc | Secret Logic Pro Shortcuts That Will Save You HOURS |
| Nsn_koz9tVI | Logic Pro Tricks EVERY User Should Know NOW! |
| iAXC61dcGBg | Set Up the Ultimate Logic Pro Template |
| T9cjd8EElKs | This Logic Pro Workflow Changed My Life! |
| ccnq0qay7Fs | Writer's Block? Use These Logic Pro Song Starters |
