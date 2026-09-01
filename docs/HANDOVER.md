# HANDOVER.md — AIMM

---

## Working Model

Work happens directly in Claude Code (terminal or desktop) — no separate seats, no Cowork, no dedicated Chrome hand-off, no brief-passing between different Claude surfaces. If a task needs domain-specific ownership (e.g. AIMM's general product work vs. its embedded voice feature), route it to the right named agent — see the Hope-account Instructions for Claude for the current Agent Dispatch table.

**Retired 5 Aug 2026, confirmed stale:** the old Seat A/Cowork/Chrome model below this line, including a "Failover chain... Adam (Work2)" reference — Cowork is no longer used, and "Adam (Work2)" does not exist and never referred to the hr-fa-knowledge-base Adam agent. Any reference to Cowork briefs, Chrome briefs, or seat hand-offs elsewhere in this file's session history below is historical record only — don't follow it as current process.

---

## ⚠️ Blocker — read before starting any Hope→Mia rename work (added 2026-08-04)

**Do not touch the Hope→Mia persona rename until Cat exists.** Cat is Kevin's dedicated agent for general AIMM product engineering (not yet built as of 2026-08-04) — most of the rename (index.html text/DOM, docs, mockups) is his scope, not a generic session's to improvise. Full plan: `docs/HOPE_TO_MIA_RENAME_PLAN.md`. Roadmap entry: `docs/ROADMAP.md` → "Hope → Mia persona rename." Also blocked on the Mixio-violet redesign epic reaching a stable/shipped state (currently IN PROGRESS, not settled — see `docs/STATUS.md`).

## Hope voice provider — settled 2026-08-28 (Markey)

Hope is an **ElevenLabs Conversational AI Agent**, not a swappable TTS engine. Decision: **do not migrate to Deepgram Flux for cost** (full runtime replacement, L/L+ effort, break-even ≈230 conversation-min/month). Cut cost by **downgrading the ElevenLabs plan** instead (Agents run on every tier at the same $0.08/min — Creator $22 → Starter $6). Open: Kevin to pull real Agents minutes from elevenlabs.io/app/usage to pick the tier. **Bug flagged regardless:** `aimm-proxy`'s `ELEVENLABS_API_KEY` secret is a key *ID* not a real `sk_…` key — cost card + reconcile broken, voice calls unaffected. Full record: `docs/VOICE_PROVIDER_DECISION.md`. Reopen only on a non-cost trigger (strategic EL exit / Deepgram barge-in model / specific voice).

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

---

## HANDOVER POINT — 2026-09-01, R3 Mix Check redesign SHIPPED & LIVE; post-ship fix round pending

**Status: `main` @ `dbc793d`, build `2026-09-01.9` — the R3 Mix Check full-layout redesign is promoted and live** at https://begb0037admin.github.io/aimm/ (Mix Check tab). Kevin ran the PowerShell `git merge --ff-only` himself. Steps 0–7 of the plan in `docs/HANDOVER-r3-mixcheck.md` shipped; Gate 1 + Gate 2 both Kevin-approved; Codex TP2 per-step + TP3 end-to-end, no blockers.

### ⏸ SWITCH POINT — 2026-09-01 evening (account switch, usage ~80%) — where we are RIGHT NOW

The post-ship fix list below is **captured and partly done**. State at this stop:

- **`main` @ `dbc793d` (build `2026-09-01.9`) is LIVE and unchanged.** No agent has touched `main`.
- **Local `main` is 2 commits ahead of `origin/main`** — `37ed60e` + `ee0d334`, both docs-only (this post-ship handover + the screenshot-evidence trail). **Kevin still needs to run `git push origin main`** to publish them. Nothing else is waiting on that.
- **Branch `r3-mixcheck-fixes` @ `c9d0822`, pushed to `origin/r3-mixcheck-fixes`** (build `2026-09-02.1`). Contains the 6 post-ship docs commits + **Cat's panel-fix pass**: items **#2, #4, #5, #6, #7 + the Cat half of #3** all DONE (see "POST-SHIP FIXES — Cat pass" below for the per-item detail). `index.html` + `docs/HANDOVER.md` only. Codex TP2 read-only ×3 clean. Rendered headless (WAV loaded + playback) — renders in `scratchpad/fix-*.png`. **NOT merged — awaiting Kevin's render review.**

**NEXT ACTIONS, in order (fresh session on the main account picks up here):**
1. **Kevin renders + reviews `r3-mixcheck-fixes`** (branch, build `2026-09-02.1`) — the Cat pass. Needs a rendered preview / Artifact, per standing rule.
2. **Decide item #1 (corridor).** Cat's pre-R3 diff proved there is **no regression to restore** — `REF_CORRIDORS` / `refActiveCorridor` / `ozBandDelta` / the BS.1770-4 engine are byte-identical to pre-R3 (`68a3ffa`). If the corridor *values* still feel wrong that's a deliberate **Jules** re-tune of the house-made genre tables, not a restore. Kevin's call whether to open that.
3. **Dispatch Markey** for #3's Hope-awareness half on `r3-mixcheck-fixes` (do NOT let Markey and Cat hold `index.html` at once — Cat is done, so Markey is clear to go). Brief: rewrite `buildAppKnowledgeDigest` + `get_context` + the tool list + the `eq` focus-mode block for the Mix Check board / Fix Queue; feed `window.mcFixQueue.list()` + `breakdownData()` into per-message context on `aimm:analysis-complete` and every queue change; wire each Fix Queue item's `move` (currently `MOVE_PENDING` placeholder) to the KB-grounded path (`propose_mix_move` / `claude_research` against the YouTube scrape); make analysis-complete a real conversational LLM turn with the card as supporting detail. Acceptance test = the NEGATIVE EXAMPLE below (Hope must never ask "Session Snapshot? Repair tab? Insight tab?").
4. Two loose ends Cat flagged for Kevin: (a) the small transport `#refFileName` label still shows `markermix.wav` *with* extension — #2 was `#mcTitle`-scoped; say if it should be stripped there too. (b) the 1-line `.mc-wave` CSS scope non-blocker from TP3 (still open).
5. After Markey + Kevin's review: `r3-mixcheck-fixes` needs Kevin's approval + a manual promote to `main` (PowerShell, bottom of this section).

Route for the fix list: **Cat** = Mix Check panel / centre column (done), **Markey** = Hope's voice/chat rail (next), **Jules** = design review / corridor re-tune if #1 is opened.

---

### ⏸⏸ SESSION PAUSE — 2026-09-01 late (Hope account) — READ THIS FIRST ON RESUME

Supersedes the SWITCH POINT above. State at this stop:

- **`main` @ `dbc793d` (build `2026-09-01.9`) — LIVE, untouched.** Nothing from this round has shipped.
- **Branch `r3-mixcheck-fixes` @ `cb6f92bb4`** (pushed). = Cat pass (`c9d0822`, build `2026-09-02.1`) + Jules corridor spec v1 (`a177315`) + 3 docs commits locking the `#mcWave` waveform + reframing #5 (`2d9907b`→`cb6f92b`). **`index.html` is still at build `2026-09-02.1` — no code changes since the Cat pass.**
- **Kevin SIGNED OFF the Cat-pass render** (2026-09-01) — Artifact https://claude.ai/code/artifact/856ae34d-f2e5-489e-aa6b-4cdc56053ee4 — with ONE addendum: the Hope rail is cramped, the "Hope" title clips at the top edge, everything sits too close to its edges → give it breathing room (folded into Markey's brief, item C).

**TWO SUBAGENTS WERE DISPATCHED THEN FAILED on the Anthropic account session limit (reset ~02:10
Europe/London, 2026-09-02). NOTHING LANDED — branch tip is `410fe08fb`, `index.html` unchanged since
the Cat pass. Both must be RE-DISPATCHED on resume (after the limit resets). Their briefs, verbatim:**

1. **Markey** (Hope-rail half) — brief = (A) #3 Hope-awareness: rewrite `buildAppKnowledgeDigest` + `get_context` + tool list + `eq` focus block for Mix Check / the Fix Queue; feed `mcFixQueue.list()` + `breakdownData()` into per-message context on `aimm:analysis-complete` + every queue change; wire each item's `move` (`MOVE_PENDING`) to the pre-R3 KB path (`propose_mix_move` / `claude_research` vs the YouTube scrape — RESTORE, don't reinvent; diff P-A `a3d96ba`); make analysis-complete a real conversational turn. Acceptance test = the NEGATIVE EXAMPLE (Hope must never ask "Session Snapshot / Repair tab / Insight tab?"). (B) restyle `#hopeWave` to MATCH the locked `#mcWave` look, KEEP the speech animation. (C) Hope-rail breathing room / un-clip the "Hope" title. Bumps `AIMM_BUILD`. Codex TP2. Pushes to `origin/r3-mixcheck-fixes` only.
2. **Jules** (corridor spec REVISION) — brief = rebuild `docs/corridor-retune-spec.md` with every `REF_CORRIDORS` value traced to a published source (primary: iZotope Tonal Balance Control target curves; corroborating: LTAS / spectral-average studies). Kevin's instruction: "Get your information from iZotope… go and do your research." Drive the ear-only open questions to near-zero. Docs only, no `index.html`, no build bump. Pushes to `origin/r3-mixcheck-fixes` only.

**RESUME — do this in order (once the account session limit has reset):**
1. `gh api "repos/begb0037admin/aimm/commits?sha=r3-mixcheck-fixes"` — confirm tip. Expected `410fe08fb` (this handover). Any commit past it = a re-run already happened; read it. Otherwise both agents still owe their work — re-dispatch Markey and Jules with the briefs below (also in coordinator memory `aimm-mixcheck-waveform-locked.md` + `r3-mixcheck-visual-signoff-gate.md`).
   - **Markey commit present** (touches `index.html`, bumps `AIMM_BUILD` past `2026-09-02.1`): read its `docs/HANDOVER.md` / `docs/HANDOVER-r3-mixcheck.md` §1 row for what landed + the acceptance-test transcript. Then render `r3-mixcheck-fixes` (raw.githack + Chrome, WAV loaded + a simulated queue; see "Working method" below) → new Artifact for Kevin covering: Hope reasoning over the queue (the "about fix #02" exchange), `#hopeWave` matching `#mcWave`, the rail padding. Kevin reviews.
   - **Markey commit ABSENT** — the Hope-rail work did NOT land (session died first). Re-dispatch Markey with the same brief (it's above + in the coordinator's memory `aimm-mixcheck-waveform-locked.md`).
   - **Jules commit present** (`docs/corridor-retune-spec.md` changed): read the revised spec. Give Kevin the 7 old→proposed tables + the SOURCES section + any residual ear-only question. Kevin approves the spec (at minimum answers its top question).
   - **Jules commit ABSENT** — re-dispatch Jules with the same brief.
2. Once Kevin signs off Markey's render AND approves Jules's corridor spec → dispatch **Cat** (index.html now free — Markey done): (a) swap the 7 `pts` arrays into `REF_CORRIDORS` per Jules's approved spec, (b) loose end — strip `.wav` from the transport `#refFileName` label (Kevin approved), (c) loose end — scope the 1-line `.mc-wave` / `.mc-wave-cap` CSS with `#eq.oz-mixcheck` (Kevin approved). One commit, bump `AIMM_BUILD`, Codex TP2, render for Kevin's before/after on the corridor.
3. Kevin's manual PowerShell ff-only promote of the bundle (Cat pass + Markey #3 + `#hopeWave` + rail padding + corridor swap + loose ends) to `main`.
4. **FOLLOW-UP promote (separate):** real section detection (#5 reframed) — Cat builds the client-side SSM/novelty segmentation as an ADDITIVE OVERLAY on the locked `#mcWave`, Jules specs the overlay render, its own render gate. Does NOT hold the promote in step 3.

**Also still Kevin's:** `git push origin main` from `C:\Users\admin\github\aimm` for 2 docs-only commits (`37ed60e` + `ee0d334`). Low priority.

**HARD LOCKS (do not re-litigate — full text in `docs/CLAUDE.md` hard rules + §4 LOCKED DECISIONS below):** the `#mcWave` transport waveform as rendered at build `2026-09-02.1` (rendered peak bars, `--send-blue` played span, advancing playhead, no section markup) is LOCKED — never revert/restyle/redraw it. The Spectral Balance analyser stays as-is. #5 = build REAL section detection as an additive overlay, never a redraw. `#hopeWave` restyles to match `#mcWave` but the animation stays.

---

---

_Original 2026-09-01 end-of-session note (kept for context):_ after promote, Kevin used the live build and said *"There are many things that are not working and not up to scratch with this."* — then gave the list below. It is shipped but this revision round was queued; don't assume the redesign is "done".

### ⭑ GOVERNING PRINCIPLE — Kevin, 2026-09-01 (overrides everything below)

*"This is a mixed workbench. Everything must be analysed. Nothing must be static. Nothing is
fabricated or made up or dumbed down — everything has real data behind it. Hope knows everything;
she is the heart. If I don't know it, she knows it. She knows the board; she knows what we're
looking at. She can explain every part of this board — there is nothing on this screen she does
not know or understand. She is intelligent. This is her home; this is where she lives."*

Concretely, for the whole Mix Check surface:
- **No static / canned content.** `MIX_ISSUE_RECIPES` (8 hard-coded recipe strings) is DELETED as a
  content source. Every fix title / "why" / "Move —" recommendation is generated from the real
  measured analysis + the YouTube KB scrape, per song. No template that reads the same for every mix.
- **Everything measured.** Every number on the board traces to `refAnalyse()` / `refFileSpectrum()`
  on the actual uploaded audio, judged against a correct corridor (#1). Nothing displayed that
  isn't real (this also kills the fictional INTRO/VERSE/BRIDGE labels — #5).
- **Hope has total awareness.** Full live context of the board: the loaded file, the complete
  analysis, the Fix Queue and what each item means, every tab and control. She can be asked about
  anything on screen and explain it. She reasons over real data, grounded in the KB — she is the
  intelligent heart of the workbench, not a card renderer.

### POST-SHIP FIX LIST — Kevin, 2026-09-01 (verbatim intent + routing)

> **Governing instruction for this whole round (Kevin, 2026-09-01):** *"Refer to what was already working before we began this. I do not want to reinvent the wheel. All of this was working prior. Check your research. Do not recreate something that already exists."* Several of these items are **regressions** the mockup→live R3 rebuild introduced — the corridor, Hope's awareness, the KB-grounded advice, the moving playhead all worked in the pre-R3 build. For each item: **diff the pre-redesign `index.html` (before the R3 line — git history, P-A build `a3d96ba` @ 2026-06-04) and restore the working behaviour**, don't design a new one.

1. **Target / reference corridor is inaccurate** — the Spectral Balance "Target: auto (workbench genre)" corridor (and the genre presets in that dropdown: Trap / 808-heavy, Hip-Hop, R&B, Pop, Afrobeats, Lo-Fi, Flat / reference) draws a corridor that doesn't reflect a real target. Correct the reference-curve data / the per-genre target corridors so the "vs target" readouts (band deviation meters, Fix Queue deltas) mean something. **Cat.** Likely `refActiveCorridor` / the genre corridor tables + `refPtsFromDbBins` mapping.

2. **Drop the file extension from the header title entirely** — when a file is uploaded, show ONLY the name, no `.wav` (or any) extension. This SUPERSEDES the earlier "name orange + `.wav` gradient accent" treatment — there is no extension shown at all now. (Header currently renders e.g. `Paypadream$ (mastered).wav` → should be `Paypadream$ (mastered)`.) **Cat.** `mcSetHeader` — strip the extension before setting `#mcTitle`; the orange colour on the name stays.

3. **Hope's awareness regressed + the Fix Queue / breakdown content is fiction, not analysis** — this is the biggest item. Kevin's evidence (screenshot 2026-09-01): the transcript auto-posts a "HOPE — MIX BREAKDOWN" card and an "ACTION ITEM 1 / 5" card full of specifics — "+8.9 dB low vs the corridor", "Pull ~4.0 dB around 49 Hz, Q ≈ 1.0, on the mix bus. Dynamic EQ if it only builds on the drops" — but when the user then asks Hope *"about fix #02"*, **Hope has no idea what they mean** and asks whether it came from a Session Snapshot / the Repair tab / the Insight tab (tabs that don't exist in this redesign). Three failures:
   (a) **Hope has zero awareness of the Mix Check tab / Fix Queue.** DIAGNOSED 2026-09-01 (coordinator diffed `68a3ffa` vs `dbc793d`): **nothing was deleted** — `sendContextualUpdate` / `buildLibraryDigest` / `buildResearchDigest` / `buildAppKnowledgeDigest` / `pendingContext` / `propose_mix_move` / `inspect_app` / `read_doc` / `RT_INSTRUCTIONS` / `MIX_ISSUE_RECIPES` all present, identical counts pre vs post. The regression is a **context gap**: `buildAppKnowledgeDigest` still describes the *pre-R3* app — "4. Repair (meter) — diagnostics + troubleshooter … Symptom pills … Ask Claude button" — with NO mention of the Mix Check tab, the Fix Queue, `window.mcFixQueue`, the band meters, stereo width, the transport waveform, or the auto-posted cards. `get_context` still returns "flagged symptoms" not the Fix Queue. The tool-surface list in the digest still enumerates the old 26 tools (no `mark_fix_applied`, no Fix-Queue tools). So Hope reaches for the only vocabulary she has — Repair tab, symptom pills, Session Snapshot, Insight notes — because as far as her context knows, that's still the app. **Restore:** rewrite `buildAppKnowledgeDigest` (+ `get_context` + the tool list) to describe Mix Check / the Fix Queue / what each item means; feed `window.mcFixQueue.list()` + `breakdownData()` into the per-message context on analysis-complete and every queue change; purge Repair/Insight references. Delivery machinery is untouched and working. **Markey.**
   **NEGATIVE EXAMPLE — Hope must NEVER respond like this (Kevin flagged 2026-09-01):**
   > "You're asking about a specific fix — can you give me a bit more context? Where did you see
   > 'Fix #02 — Pull ~8.9 dB out of the low end (20–120 Hz)'? Was it from a Session Snapshot you
   > saved? Something from the Repair tab (a flagged symptom recipe)? A note in your Insight tab?
   > Or a recommendation from a previous chat session? Once I know the source I can dig into the
   > specifics…"
   She posted that fix. It is on her screen. She must know it is Fix #02 in the Mix Check Fix
   Queue, know it was derived from the measured low-band energy of the loaded file vs the trap
   corridor, and answer the real question (is 8.9 dB right / where in the chain / which EQ from the
   library) immediately — grounded in the real numbers + the KB. Naming Session Snapshot / Repair
   tab / Insight tab (retired surfaces) is the exact regression. Use this as an acceptance test.

   (a2) **Hope stopped talking — she renders cards instead of conversing.** The "HOPE — MIX BREAKDOWN" and "ACTION ITEM 1/5" cards are structured UI dropped into her transcript (a numbered metrics list + a templated "Move —" line) with her name on top — **not an LLM turn**. Kevin: *"She doesn't talk. She just gives me information."* Pre-R3, Hope narrated the mix in natural language ("your low end's ~9 dB hot against the trap corridor, mids scooped, top dull — I'd pull a wide cut around 50 Hz, want me to card it?") then *optionally* attached a Mix Move card as supporting detail. R3 replaced "Hope talks, card optional" with "card only, no conversation." **Restore:** on analysis-complete Hope produces a real conversational turn — a plain-language read grounded in the real numbers + the YouTube KB — and the breakdown/action data is *supporting detail she can reference*, not the whole message. She must be able to answer "why that fix first?" by reasoning over the queue in her context, not by re-rendering a card. **Markey.**
   (b) **The fix advice text is templated fiction, not grounded knowledge.** The "Move —" recommendations + the breakdown prose come from hard-coded `MIX_ISSUE_RECIPES` templates with numbers plugged in. Kevin: *"Where is this information coming from? It all seems very fictional. Hope should be getting this information not from the internet but from the abundant resources she has from our YouTube scrape."*
   ⚠️ **DO NOT BUILD A NEW KB-GROUNDING SYSTEM. Kevin: *"Refer to what was already working before we began this. I do not want to reinvent the wheel. All of this was working prior. Check your research. Do not recreate something that already exists."*** The KB-grounded, app-aware Hope existed and worked *before* the R3 redesign. The redesign replaced the working "6 Mix Issues pills" with the `window.mcFixQueue` Fix Queue and, in doing so, swapped the KB-grounded advice path for `MIX_ISSUE_RECIPES` canned strings — and dropped the Mix Check state from Hope's context bundle. **The task is to RESTORE the pre-R3 behaviour, not reinvent it.**
   Pre-R3 infrastructure that already exists in `index.html` (all "SHIPPED" in `docs/STATUS.md`): the YouTube KB ingestion (330+ MWTM/producer transcripts, topic index in `RT_INSTRUCTIONS`, 28 topics→video_ids); `claude_research` (KB + web); `read_doc` / `inspect_app` for app + dashboard awareness; `propose_mix_move` ("Mix Move cards, Mixio steal #1") — the structured KB-grounded advice card with an Apply button; `buildLibraryDigest` / `buildResearchDigest` / `buildProfileDigest` feeding `sendContextualUpdate`. Diff the pre-redesign `index.html` (before the R3 line — see git history / the P-A build `a3d96ba`, 2026-06-04) against current to see exactly what the Fix Queue rewrite bypassed, and wire `MC_FIXQUEUE` back into that path. **Markey** (Hope context + KB path) + **Cat** (Fix Queue derive → the existing advice path, not a new one).
   (c) **The measured deltas may be wrong too.** "+8.9 dB low vs the corridor" is only meaningful if the corridor is right — it isn't (see #1). Fix #1 first; then the numbers `derive()` produces are real; then Hope reasons about real numbers grounded in the KB. **Cat** (`MC_FIXQUEUE.derive()` off `refAnalyse` + a correct corridor, real magnitudes, no placeholders).

4. **Transport playhead is stationary** — the white playhead line on the `#mcWave` waveform does not move during playback. It should start at the left and travel to the right as the track plays. **Cat.** Bug in the `MC_WAVE.draw()` playhead-x calc or the redraw loop (`refIdleAnimate`/`refLiveAnimate`) not ticking during play. `refStartOffset` / `refCtx.currentTime` → fraction → playhead x.

5. **Remove the INTRO / VERSE / BRIDGE / VERSE section labels from the waveform** — they are fictional (fixed cosmetic positions, no real detection), they don't correspond to the actual song structure, and there's no chorus. Kevin wants them **gone**, not kept as a cosmetic placeholder. This overrides the earlier "keep as fixed cosmetic layer" decision. **Cat.** Remove the `.wave .seg` washes + the `.secs` section-label ruler from `#mcWave` / its markup + JS. Keep the plain greyscale/coloured waveform bars + the transport controls; real arrangement detection stays deferred to the analyst phase (but shows NOTHING until it exists).

6. **Mix Check tab icon is still small** — Cat's "tab icons larger" pass (14→18px) took on the other 8 tabs but the first tab ("Mix Check") icon is still the old size. Bump it to match. **Cat.** Check for a `.tab.oz-tab.active` or first-child override winning over the `.tab-ico svg` size rule.

7. **The progress bar / track is tiny and its labels are cut off** — the "N / M done" progress track in the Fix Queue header (thin stub next to "0 / 5 done") should span the full available width, one end to the other; text is being clipped. **Cat.** `.track` / the fix-queue-head progress element width — make it flex-fill the row.

Cross-check with known backlog: #5 relates to the deferred "real arrangement detection" (now: remove the fake labels rather than keep them); #6 is a gap in the already-done "tab icons larger"; #1/#2/#3/#4/#7 are new.

### Screenshot evidence (Kevin, 2026-09-01 — images not carried forward, described here)

- **Target dropdown** open: presets `Target: auto (workbench genre)` / `Trap / 808-heavy` / `Hip-Hop` / `R&B` / `Pop` / `Afrobeats` / `Lo-Fi` / `Flat / reference`. The corridor these draw is what #1 is about.
- **Panel header**: title rendered `…red).wav` in orange with a `:42` sub-line — the `.wav` is still shown (#2 wants it gone entirely).
- **Fix Queue** crop: header `0 / 5 done` + `Hide queued (4)`; UP NEXT card `#02  Pull ~8.9 dB out of the low end (20–120 Hz)`, orange freq graphic pegged left, scale `20 / 200 / 2k / 20k`, `FOCUS low · IMP high · CONF med`, `Ask Hope about this`, hint "Click the card to expand the full move." The `#02` here vs `ACTION ITEM 1 / 5` in Hope's card = the numbering mismatch. The progress track is a short stub (#7).
- **Transport** crop: `Paypadream$ (mastered).wav`, controls (skip / −10 / play / +10 / stop), `0:00` … `2:42`; coloured bar waveform with `INTRO / VERSE / BRIDGE / VERSE` labels (fiction, #5); the white playhead line sits at the far left and does not advance (#4).
- **Tab strip** crop: the `Mix Check` tab's star icon is visibly smaller than the `Workbench` (and other) tab icons — #6.
- **Hope transcript** (the decisive one): a purple `HOPE — MIX BREAKDOWN` card ("Paypadream$ (mastered).wav — first read. … 1. Loudness & dynamics: -6.9 LUFS, PLR 7 … 2. Tonal balance: +8.9 dB low, -1.9 dB mid, -13.2 dB high vs the corridor … 3. Transients: balanced — Crest 8.5 dB … Top fixes → #01 2000–8k Hz · #02 20–120 Hz · #03 120–400 Hz"), then an `ACTION ITEM 1 / 5 · RECOMMENDED FIRST FIX` card ("Pull ~8.9 dB out of the low end (20–120 Hz) … Measured low end: 8.9 dB above the Trap / 808-heavy corridor … Move — Gentle wide cut, ~4.0 dB around 49 Hz, Q ≈ 1.0, on the mix bus. Dynamic EQ if it only builds on the drops.", `▶ Play` disabled), then a YOU turn "About fix #02 — 'Pull ~8.9 dB out of the low end (20–120 Hz)':" — and **Hope replies she doesn't know what it is**: "Where did you see 'Fix #02'? Was it from a Session Snapshot you saved? Something from the Repair tab (a flagged symptom recipe)? A note in your Insight tab? Or a recommendation from a previous chat session?" She has no visibility of the queue she just posted into, and names retired tabs. This is #3, the core failure.

### POST-SHIP FIXES — Cat pass (branch `r3-mixcheck-fixes`, `AIMM_BUILD 2026-09-02.1`, NOT merged — awaiting Kevin's render review; Markey does #3's Hope-awareness half next)

Cat's items #2, #4, #5, #6, #7 + the Cat half of #3 done on branch `r3-mixcheck-fixes` (index.html only; pushed to `origin/r3-mixcheck-fixes`; `main` untouched). Pre-R3 diff done against `68a3ffa` (the pre-redesign tip). Codex TP2 read-only, `model_reasoning_effort=low`: pass 1 NO BLOCKERS, pass 2 flagged only the string `MIX_ISSUE_RECIPES` surviving in two comments (fixed), pass 3 confirm.

- **#1 (corridor) — NO CODE CHANGE, flagged for Kevin/Jules.** Diff finding: `REF_CORRIDORS`, `corridorAt`, `refActiveCorridor`, `ozBandDelta`, `refPtsFromDbBins`, `refFileSpectrum`, `fftMag`, and the BS.1770-4 `li`/`tp`/`dr` engine are **byte-identical** to the pre-R3 build (`68a3ffa`). The ONLY R3 change in that region is cosmetic: `MAX_DB` 6→18 + a new `Y_TOP_PAD=0.18` in `dbToY()` (deliberate, Gate-1-approved "analyser headroom" fix, `86b4910`) — it only rescales the *visible* canvas Y-axis, not any "vs corridor" number. So #1 as a *regression to restore* does not hold — there is nothing pre-R3 to restore. If the corridor *values themselves* feel wrong, that is a pre-existing tuning matter (the corridors are "house-made", never externally validated) and needs a deliberate Jules pass, not a restore. Cat did not touch it (hard stop: RESTORE, don't reinvent).
- **#2 (header extension)** — `mcSetHeader` strips the extension; keeps an empty `<em></em>` so `#mcTitle:has(em)` still fires the orange (#f97316) treatment. Handles no-dot filenames. Empty state stays "Mix Check" (white).
- **#3 Cat half — DONE.** `MIX_ISSUE_RECIPES` (+ `RECIPE`, `recipeMove`) **deleted entirely** from index.html — the last static-prose path in Mix Check is gone. `MC_FIXQUEUE.build()` now emits **measurement-only** `title` + `why` for every item (real values from `tp`/`dr`/`corr`/`li`/`subRatio`/`airRatio`/`ozBandDelta` vs the active corridor — nothing that reads the same for two different mixes), and `move: MOVE_PENDING` — a neutral "Analysing — pulling the specific move from the reference library…" placeholder. **Markey's half:** wire the KB-grounded advice (`propose_mix_move` / `claude_research` against the YouTube scrape) to replace each item's `move`, per song, + feed the full Fix Queue / analysis into Hope's context. `window.mcFixQueue` 8-method contract + `aimm:analysis-complete` event + the exact item shape are all unchanged.
- **#3 numbering — DONE.** One source of truth: the Fix Queue card and `askHope()` prefill now show the **progress ordinal** (`appliedCount + 1`, `#0N`), matching Hope's "Action item N / total" card. `it.id` is unchanged as the internal stable key for `markApplied`/`dismiss`/`data-id`.
- **#4 (playhead) — DONE (a restore).** The pre-R3 transport was a `#refScrubFill` bar whose width advanced with playback. R3 replaced it with a fixed cosmetic graphic and left the real `#mcWave` canvas (real min/max peaks + a playhead that advances via `refLiveAnimate → MC_WAVE.draw` every frame) sitting at `opacity:0` as a click-catcher. Fix: made the canvas visible; playhead now draws every frame + always visible (even at x=0). No new rAF loop.
- **#5 (fiction section labels) — DONE (removed fiction).** Deleted from the markup: the `INTRO/VERSE/BRIDGE/VERSE` `.secs` ruler, the 4 `.seg` washes, the 2 fake `.pip` "issue marker" pins, the sine-generated `.bars` strip (`#mcWaveBars`), its static `.played` fill, and `#mcWaveCap`. `mcFillWaveBars()` is now a no-op stub. The `intro/drop/outro` energy-marker chips are also no longer rendered on the canvas (`markers()` kept defined + exported for when real detection lands) — nothing shown until real arrangement detection exists.
- **#6 (Mix Check tab icon) — DONE.** No CSS override was shrinking it — the `.tab-ico svg` box was already 18px like every other oz-tab. The 4-point star *path* only filled ~x6–18 / y3–15 of its 24×24 viewBox, so it read visibly smaller. Widened the path to span ~2–22 in both axes to match the sibling icons.
- **#7 (progress track) — DONE.** `.mcq-hr` / `.mcq-prog` / `.track` now flex-fill the Fix Queue header row (the "N / M done" label wrapped in `.mcq-prog-n` with `flex:0 0 auto white-space:nowrap` so it can't clip; the track takes the remaining width). All scoped to `#eq.oz-mixcheck`.

3-column bottom-align verified after (CDP probe: `mcSpecs` = `mcActions` = `hopeRail` = 1322). Console clean on load + WAV + playback. Renders in the session scratchpad: `fix-fullpage.png`, `fix-header.png` / `fix-header-empty.png`, `fix-transport.png` / `fix-transport-playing.png`, `fix-analyser.png`, `fix-fixqueue.png`, `fix-tabs.png`.

### CAT-PASS RENDER + JULES CORRIDOR SPEC + #5 REFRAME (coordinator, 2026-09-01 evening, Hope account)

**Branch tip is now `a177315`** (Jules docs commit; adds `docs/corridor-retune-spec.md`, no `index.html`).

- **Cat-pass render delivered to Kevin** — rendered `r3-mixcheck-fixes` @ build `2026-09-02.1` live via
  raw.githack + Chrome (WAV loaded + played). Per-item Artifact review page:
  https://claude.ai/code/artifact/856ae34d-f2e5-489e-aa6b-4cdc56053ee4 . Verified in-render: #2 header
  no-extension, #4 playhead advancing (caught 0:04/0:18), #5 no section markup (plain waveform), #6 tab
  icon matched, #7 progress track full-width, #3 measurement-only `why` + `MOVE_PENDING`. Console clean.
- **Jules corridor spec delivered** — `docs/corridor-retune-spec.md` @ `a177315`. Root cause of #1: the
  corridors fall ~−1.5 dB/oct where a raw commercial-master LTAS falls ~−4 dB/oct → every finished
  master reads deficient-in-highs (Kevin's screenshot −13.2 dB high). `ozBandDelta` gain-normalises to
  the corridor's 150 Hz–3 kHz mean, so only corridor **shape** matters, not absolute level or width.
  Spec has old→proposed `pts` arrays for all 7 genres + cited sources + **5 open questions for Kevin's
  ear (Q1 = low-band elevation, the key one)**. Also flags a separate Cat-lane bug: `refPopulate()`
  hard-codes a −8 LUFS / DR≥7 target regardless of genre → false "over-compressed" on lofi/R&B.
  Path: Kevin approves the spec → **Cat** swaps the 7 `pts` arrays into `REF_CORRIDORS` on the branch,
  bumps `AIMM_BUILD`, re-renders analyser + 3 meters + Fix Queue for Kevin's before/after sign-off.
- **Post-ship fix #5 REFRAMED — Kevin, on seeing the render:** section labels are a FEATURE he wants —
  *"instead of removing it, just fix it."* #5 is no longer "remove the fake labels"; it becomes **build
  real client-side structural section detection** and render detected sections as an **ADDITIVE
  OVERLAY** on the LOCKED `#mcWave` waveform (see §4 — the current waveform must not change; Kevin said
  so three times + sent a screenshot). Approach: ~2 Hz feature frames (RMS/loudness env, spectral
  centroid, spectral flux, chroma, low-rate timbre) → cosine self-similarity matrix → novelty-curve
  peak-pick for boundaries → heuristic labels (highest sustained recurring energy = CHORUS/DROP; first
  low-energy = INTRO; last = OUTRO; single mid contrasting = BRIDGE; else VERSE); confidence-gated
  (flat/ambiguous novelty → show nothing); in a worker so the analyser isn't blocked. **Cat** builds
  the DSP; **Jules** specs the overlay render. Analyst-phase scope, its OWN render gate.
- **Also — Hope rail waveform (`#hopeWave`):** Kevin wants it restyled to MATCH the locked `#mcWave`
  look while keeping the speech-tied animation. **Markey** implements, **Jules** design-reviews. Folds
  into the Markey #3 dispatch. (Full detail in §4.)
- **Sequencing — Kevin's call (2026-09-01):** promote the rest of the Cat pass (#2 / #4 / #6 / #7 + #3
  measurement half) + Markey's #3 Hope-awareness half + the `REF_CORRIDORS` swap FIRST, once Kevin
  signs off the Cat-pass render. **Real section detection (#5) lands in a FOLLOW-UP promote** — the fix
  round does not wait on it. `#hopeWave` restyle rides with the Markey #3 promote.
- **Markey is still HELD** — not dispatched until Kevin signs off the Cat-pass render. Loose ends
  approved by Kevin this session: (a) strip `.wav` from the transport `#refFileName` label too; (b)
  scope the 1-line `.mc-wave` CSS. Both fold into the Cat commit alongside the Markey work.

### Known backlog (already logged in `docs/ROADMAP.md` / `docs/STATUS.md` / `DASHBOARD.html` as Backlog 6/7/8)

Accepted Gate-2 residuals:
- **A** — empty (no-WAV) state: the Audio Specs left column runs well below the shorter empty analyser card before the three columns bottom-align. Needs a grid tweak to match the empty analyser height.
- **B** — very hot bands peg at the ±6 dB edge of the new deviation meter (e.g. LOW +11 dB shows the bar at the edge); the signed value above carries the true number.
- **C** — stereo-width meter is a 1:1 %→track map; typical masters (~25–40%) sit left of centre. Could switch to a compressed scale.
- **D** — Hope's speaking-meter amplitude gain (`×11` on the EL `getOutputVolume()` reading) is only structurally verified — needs a **live voice call** to tune; the synthetic envelope is what renders headless.
- **E** — the composer speaker/mute button does nothing with no call live (it arms the mute preference for the next call) — could show a disabled state.
- **F** — PRE-EXISTING (not R3): empty-state analyser hint text ("target: Trap / 808-heavy — drop a WAV…") overlaps the "Low / Low-Mid / High-Mid / High" axis labels. Long-standing, still there.

Deferred to the analyst phase:
- Real arrangement detection — the waveform's INTRO/VERSE/BRIDGE section blocks are **fixed cosmetic positions**, not detected. Real segmentation DSP + coloured named sections were LOCKED out of this build (§4 of `docs/HANDOVER-r3-mixcheck.md`).
- The CLASSIFIED "with full analysis" placeholders (Subgenre / Production style / Energy / Mood / Dissonance) render as muted stubs pending full analysis.

One non-blocker from Codex TP3:
- Two new `.mc-wave` / `.mc-wave-cap` CSS rules are not `#eq.oz-mixcheck`-prefixed (match the file's pre-existing global `.ref-*` transport-CSS convention; verified 0 cross-tab element bind). Trivial 1-line scope fix if wanted.

### Branch / repo state
- `main` = `origin/main` = **`dbc793d`** (build `2026-09-01.9`). GitHub Pages serves this.
- `r3-mixcheck-codex` = the line that shipped (merged fast-forward into `main`; `index.html` byte-identical to the Gate-2-approved `256cae8`).
- `r3-mixcheck-full` @ `2f78e2c` = **abandoned** (had a tab-strip-indent regression; superseded).
- Durable step-by-step record: `docs/HANDOVER-r3-mixcheck.md` (§1 commit table, §2 Codex status, §7 residuals, §8 promote command — now executed).

### Working method (standing, carry forward)
- **Kevin reviews from rendered screenshots / Artifact review pages, never raw code.** Every visual change needs a render (`scratchpad/` CDP driver, or an Artifact link) before he'll approve.
- **Two-gate discipline** when there's an approved mockup: Kevin exclusively signs off the visual; chrome first (Gate 1), then feature build on the approved base (Gate 2). Nothing merges/promotes without his explicit "approved".
- **Standing rules** (in memory): (1) any size change to one region must keep every adjacent column/card stretching uniformly so edges stay flush — grid bottoms on one line, no ragged columns; the render must prove it. (2) On Mix Check, every readout must be **actionable mixing information** (Kevin's reference: SSL Meter 2 — labelled scales, reference lines, numeric readouts) — nothing decorative or vague. (3) Where a mockup is approved, match it exactly; deviations are deliberate and recorded.
- **Codex discipline:** `codex exec` on this desktop needs `codex login` (OAuth) — check `codex login status` first; it dropped mid-build once. Full-reasoning passes time out on this repo — use `-c model_reasoning_effort="low"`, pre-written diff files, BLOCKERS-only, `< /dev/null` (stdin must be closed or codex hangs).
- **Multi-session risk:** Kevin runs several Claude sessions. This build collided once with a parallel terminal session (Steps 5-fu/6 + the codex branch appeared unexpectedly on the shared branch). Coordinate via `ListAgents` / `SendMessage`; don't assume sole ownership of a branch.
- **Promote to `main` is Kevin's manual PowerShell step** (agent pushes to `main` are classifier-blocked): `cd C:\Users\admin\github\aimm; git fetch origin; git checkout main; git pull --ff-only origin main; git merge --ff-only origin/<branch>; git push origin main`.

---

## HANDOVER POINT — 2026-08-16, MixCheck Ozone redesign, session paused by Kevin

**Status: revision 3 built and verified locally, NOT pushed. Awaiting Kevin's sign-off.**

**What happened this session:**
1. Kevin approved the design direction: the "Ozone 12" graphite/teal-blue MixCheck mockup (`docs/mockups/redesign-v5-mixcheck-dashboard.html`, confirmed same design as `docs/mockups/ozone-redesign-v1.dc.html` in two export formats) over the currently-live v4 dark-purple design, for the MixCheck tab specifically.
2. **Revision 1** (colour-only reskin of the existing DOM): rejected — "this is nothing like v5, but the colour scheme is fine."
3. **Revision 2** (layout rebuilt into a two-column module rack): rejected — still didn't match closely enough; Kevin specifically flagged the Spectral Balance analyser as visibly wrong.
4. **Revision 3** (current): rebuilt directly against `ozone-redesign-v1.dc.html`'s real unbundled source (not a screenshot approximation) by a dedicated Cat session. Covers:
   - Header/tab-bar chrome restyled to match the mockup's compact logo + pill tab strip + status pill, **without deleting any real tabs/navigation** (Conversation, Marketing, Community, genre/platform selectors, Settings all preserved).
   - Hope panel's visual chrome rebuilt into an actual conversation-thread design (message bubbles, inline Mix Move card, composer) — functional voice/chat wiring code untouched (Markey's, permanently).
   - Manual meter-override inputs hidden via CSS to match the mockup (not deleted — still wired).
   - Spectral Balance card rebuilt using the mockup's actual curve-rendering technique — a blurred glow **ribbon** around the line (two blur passes + a gradient clipped to the band shape), not a flat area fill. This was Kevin's specific callout ("look at the spectral analyser - it is different, please pay attention to detail") and got dedicated verification against the real mockup render.
   - Section order changed to match the mockup: Hope analysis → Spectral Balance → Mix Issues.
   - Troubleshooter grid + both data tables (Platform Loudness Comparison, True Peak Ceilings) hidden via CSS (mockup doesn't show them) — code and data intact, not deleted.
5. Verified via direct headless-Chrome render-and-compare against `mockup_render.png` (a real render of Kevin's own local mockup file, confirmed byte-identical to the repo's copy via md5). Codex-reviewed across 6 touchpoints total spanning all three revisions, final pass = GO.
6. A review page comparing revision 3 against the real mockup was pushed to `docs/mockups/mixcheck-r3-review.html` (this is a review-only asset, does not touch `index.html`) — live at https://begb0037admin.github.io/aimm/docs/mockups/mixcheck-r3-review.html — because the Artifact hosting tool the coordinator normally uses was down (502s) during this session.
7. Kevin said "good, we'll continue tomorrow" before reviewing/approving the visual on that page. **Session paused here — no approval given yet, one way or the other.**

**Disclosed, deliberate deviations from the mockup in revision 3 (not bugs — reasoned calls, listed on the review page):**
- App title kept as "AI Mix Masters" — the mockup's minimal "AIMM" wordmark was a design placeholder, not a real branding instruction.
- Each meter card keeps a small real sub-label (e.g. "LUFS · integrated") pre-dating the whole redesign — the mockup omits it, but it's real content, not decoration.
- Hope panel has 3 real action buttons vs. the mockup's 4 — the 4th has no backing feature in the real app.
- Tab strip uses an underline for the active tab rather than the mockup's filled pill — a smaller residual styling gap, flagged rather than silently left.

**Where the actual revision-3 code lives right now:** only in local scratch files on Kevin's Windows machine, under `%TEMP%\claude\...\scratchpad\aimm\index.html` (plus `docs/HANDOVER.md`/`docs/STATUS.md` scratch copies) — **not committed anywhere**, per the standing Show → Approve → Push rule (Kevin approved the *direction*, not yet the actual diff). A resuming session should treat these scratch files as the latest candidate build, verify they still exist, and re-render/re-verify before assuming they're still accurate (scratch dirs can be cleaned between sessions).

**Exact next action:** get Kevin's explicit yes/no on the visual at `docs/mockups/mixcheck-r3-review.html`. If approved: commit the scratch `index.html` changes to `main` (batched per `aimm/CLAUDE.md`'s own commit convention), bump `AIMM_BUILD`, update this file and `docs/STATUS.md` to SHIPPED. If he wants further changes: make them, re-verify against the mockup, re-render, produce a new review page, ask again — do not re-litigate the six already-made structural decisions (see this file's prior entries and `docs/STATUS.md`) unless Kevin explicitly reopens one.

**Do not restart from revision 1 or 2.** Both are confirmed rejected. Build on revision 3's scratch files if still present.

---

## HANDOVER POINT — 2026-08-17, round 5: verbatim-copy rebuild, IN FLIGHT — session switching machines (Windows → Mac)

**Status: a Cat dispatch is actively running RIGHT NOW on Kevin's Windows machine, in a Claude Code session that will NOT carry over to a new Mac session.** If you're picking this up cold on Mac, that Windows-session background task is not visible or resumable from here — treat this entry as the full picture of what it was doing and pick up fresh.

**Why round 5 exists:** rounds 1–4 (see prior entries above and `docs/handovers/2026-08-17-*.md`) were all hand-rebuilds from screenshots/visual review, and each left real gaps — culminating in a finding that none of the three review pages (`mixcheck-r3-review.html`, `-v2.html`, `-v3.html`) ever contained a live, checkable build; they were all static baked-in screenshots. `aimm/index.html` has never been committed with any of this redesign work. Root-cause brief: `docs/handovers/2026-08-17-mixcheck-r3-round4-live-build-required.md`.

**What round 5 is doing:** Kevin supplied the literal, exact source of the approved reference (both as the raw `ozone-redesign-v1.dc.html`/`.dc.html` component source AND as a browser-computed absolute-positioned HTML snapshot of the same design, pasted directly into chat). This is a verbatim-copy task, not a re-derivation:

1. Transplant the reference's exact DOM structure, inline styles, colours, spacing, the 6-tab header strip, 5-row Platform Targets table, 8-chip Mix Issues list, 3 LOW/MID/HIGH summary boxes, and the Hope panel's 4-icon row directly into `aimm/index.html`'s `#eq` MixCheck panel — copy, don't re-implement.
2. Port the Spectral Balance `<canvas>` animation JS (the `componentDidMount` code in the `.dc.html` source — plain canvas drawing keyed to a time value, no framework dependency beyond trivial lifecycle wiring) verbatim.
3. Wire real app data (BS.1770-4 analysis, Platform Targets checks, Mix Issues detection) into this exact structure — the structure/styling is not up for reinterpretation, only the data binding is new work.
4. Preserve all real functionality with no reference counterpart (manual overrides, Troubleshooter, the two data tables, the extra stereo/correlation readouts) via the established hide-via-CSS-don't-delete pattern.
5. Keep all real existing tabs (Conversation, Marketing, Community) appended after the reference's 6.
6. Never touch Markey's voice/chat functional wiring.
7. **Host the result live on a non-`main` branch** (e.g. `r3-preview`) with GitHub Pages enabled for that branch — this is the blocking fix from round 4: get an actual live, independently-loadable URL instead of another screenshot-based review page.

**What to check first if resuming on Mac:**
- Check whether a `r3-preview` branch (or similar) now exists on `begb0037admin/aimm` with GitHub Pages enabled, and whether it's live — that's the deliverable this round was building toward.
- Check `docs/handovers/` for any new brief filed after this one (round 5's own completion report, if it got that far).
- If nothing new exists, the Windows session's dispatch may still be running or was interrupted — treat this as the starting brief and consider re-dispatching Cat with the same instructions (the full literal source is preserved in this handover context and in `docs/handovers/2026-08-17-mixcheck-r3-round4-live-build-required.md`'s linked reference files, `docs/mockups/ozone-redesign-v1.dc.html` and `docs/mockups/redesign-v5-mixcheck-dashboard.html` in this repo).
- **Nothing has been pushed to `main`** as of this checkpoint. `main`'s `aimm/index.html` has zero redesign changes in it — the live app is still the original v4 dark-purple design.

**Do not restart from rounds 1–4's approach** (screenshot-based hand-rebuild). This round's whole point is copying the literal reference source directly — if round 5 didn't finish, continue that approach, don't regress to visual re-derivation.

---

## HANDOVER POINT — 2026-08-17, round 5 COMPLETE: live build pushed to `r3-preview`, awaiting Kevin's sign-off

**Status:** The round-5 dispatch above finished. `#eq` rebuilt from `index.original.html` using `docs/mockups/ozone-redesign-v1.dc.html`'s literal DOM/inline-styles as the direct template (verified structurally identical to what Kevin pasted verbatim into the round-5 brief, modulo the browser-computed absolute-positioning artefacts his paste already carried — confirmed by reading the actual repo file directly, not trusting the brief's description of it).

**Live, independently-loadable build (this round's whole point, per round 4's blocking finding):** `https://raw.githack.com/begb0037admin/aimm/r3-preview/index.html` — real branch content, not a screenshot. One-time "Open the page" click needed (githack's standard anti-abuse splash on first visit; click through and it renders live). Commit `433888d` on branch `r3-preview`, pushed to origin. **`main` is untouched** — confirmed via `git diff main r3-preview -- index.html` before push and `git log origin/main -1` showing no index.html change.

**What's real vs disclosed deviation — full list in `docs/STATUS.md`'s "Full-page Mixio-violet redesign" row.** Headline items: all 4 left-rail meters + Platform Targets + Mix Issues chips (7 of 8) are wired to the real BS.1770-4/threshold engine, not placeholders; the Spectral Balance canvas is the reference's own decorative wave animation ported verbatim (not the real per-file FFT, which stays real but hidden — see `.oz-legacy-hide`); default landing tab, outer header grid, and Hope-rail toolbar controls were deliberately NOT force-fit to the reference beyond a palette restyle, disclosed as such rather than silently reinterpreted.

**One real bug found and fixed during my own verification, before reporting anything to Kevin:** `#eq.oz-mixcheck{display:grid}` was more specific than `.panel{display:none}`, so MixCheck bled through on every tab. Caught by screenshotting the default (Conversation) tab with headless Chrome and seeing MixCheck's meter cards behind it — not by inspection alone. Fixed by gating the rule behind `.oz-mixcheck.active`, then re-verified Conversation/Library/Settings tabs are clean and MixCheck itself still renders fully.

**Verification method (why this round is different from 1–4):** headless-Chrome screenshots of the actual pushed file (not a hand-picked crop), a `node --check` pass on every inline `<script>` block, an HTML tag-balance count across the whole `#eq` block, and a direct call to the real `refPopulate()`/`refEvalPills()` functions (exposed via a test-only patch, never shipped) with real-shaped numbers to confirm the new markup's ids actually receive and display data end-to-end. Codex read-only review: first pass hit this sandbox's proxy/network friction against `agent-commons` and returned nothing usable; second, better-scoped pass read the diff directly and traced function definitions/call order — no further issues found.

**Exact next action:** Kevin opens the live URL above, reviews interactively (not a screenshot), and either signs off (→ merge `r3-preview` to `main`, bump nothing further, update `docs/STATUS.md` to SHIPPED) or requests changes (→ fix on `r3-preview`, re-push, same URL updates automatically via raw.githack's CDN cache — allow ~10 min for cache invalidation, or use `https://raw.githack.com/.../index.html?nocache=<timestamp>` to force a fresh fetch).

**Not done this round (intentionally out of scope per the round-5 brief):** stub-tab designs (Library/Insight/Snapshots content), the Hope→Mia rename, and the outer page-header grid rebuild beyond the tab-strip chrome itself.

### Deep diff report — pre-R3 Hope (coordinator, 2026-09-01, 68a3ffa vs dbc793d)

Nothing deleted. Four restorations, no rebuild:

1. **Screenshot button** — `#aiChatImageBtn` ("Attach screenshot", drag/drop/paste/upload, vision-aware)
   is fully wired; hidden by the Gate-1 strip pass: `index.html` line ~1785
   `#hopeRail .aichat-compose .send-col #aiChatImageBtn{display:none}` (and `#aiChatClear` the same
   way). Un-hide both, place in the composer row next to Send / mic / speak. When Hope says "give me
   a screenshot" this is the tool she means. **Cat** (or Markey — it's the composer row).
2. **Context describes the old app** — `elStart`'s `fullInstructions` still assembles
   `RT_INSTRUCTIONS + buildLibraryDigest + buildResearchDigest + buildProfileDigest` + a focus-mode
   addendum, but the Mix Check focus block still reads *"FOCUS MODE — REFERENCE GUIDE … four sections
   of reference cards … add_eq_tile"* (`index.html` ~line 12635). `buildAppKnowledgeDigest` still
   describes *"Repair (meter) — meter tiles, symptom pills, Ask Claude"*. `get_context` still returns
   *"flagged symptoms"*. **Rewrite all three** to describe the Mix Check tab, the Fix Queue, the band
   meters, stereo width, the transport, and the R3 tool surface. **Markey.**
3. **Analysis never reaches Hope** — `aimm:analysis-complete` (fires ~line 17045) has ONE listener
   (~line 16761, `onAnalysisComplete` = the Step-7 card renderer). No `sendContextualUpdate`
   anywhere near it. Add one: on analysis-complete (and on every `mcFixQueue` change) push Hope the
   filename + the read + `window.mcFixQueue.list()` / `breakdownData()` via
   `EL.conversation.sendContextualUpdate`. **Markey.**
4. **KB advice path unused** — `propose_mix_move` ("Show Kev a structured MIX MOVE CARD … call this
   EVERY time you recommend a move … plugin MUST be from Kev's library digest") is still defined.
   `MC_FIXQUEUE.derive()` emits `MIX_ISSUE_RECIPES` template strings instead. Route Fix Queue
   advice through `propose_mix_move` / the research path. **Cat** (derive hand-off) + **Markey** (the call).

Plus: pre-R3 `RT_INSTRUCTIONS` told Hope to be direct/proactive ("offer them directly", "surface it
explicitly in your reply"). Kevin 2026-09-01: *"I won't hold back as she was"* — restore
opinionated, talking Hope; she is a conversationalist, not a card renderer (see item 3 a2 above).
