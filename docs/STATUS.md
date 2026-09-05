# STATUS.md — AIMM

Last updated: 2026-09-04 (Cat — docs reconciliation pass, no index.html change). Current reality:
the 2026-09-02 Mix Check feedback round — items 1–15 (16 folded into 15), 17, 18, 20 — is
**SHIPPED & LIVE on `main` @ `e9bcd8a`, build `2026-09-02.15`**. Docs were reconciled the same
day in a docs-only commit, **`main` @ `4424590`** (DASHBOARD.html + docs/ROADMAP.md only,
`index.html` untouched, no build bump) — that is `main`'s current HEAD. The still-open queue from
that round (Backlog 9–14 / feedback #21, #22, #19, #3, #6 + a default-tab change) is tracked in
`docs/ROADMAP.md` → "Mix Check redesign — outstanding feedback queue" and mirrored as DASHBOARD.html
Backlog cards 9–14 (owners: mostly Markey, one Cat item — #13 default tab, one Cat-builds/Jules-specs
item — #9). **Nothing is currently mid-build** — there is no active branch in flight. DASHBOARD.html
is Kevin's working source of truth for planning; its "Now" section's 4 legacy P1 cards (P-C/P-B/P-K2/P-E,
carried over from the 2026-05/06 Session-6 priorities) were corrected in place 2026-09-04 rather than
removed: P-C (Retire Repair tab) was actually already shipped 2026-06-04 (`620f708`) and is now marked
done there; P-B/P-K2/P-E are confirmed not started and not currently in flight, marked accordingly —
none of the four represent active work. See `docs/HANDOVER.md` top entry for the full correction record.

**2026-09-05 update (Markey):** Backlog item 12 (feedback #3 — Hope tab-awareness verify +
persisted-history fix) is done and **pushed pending merge**, not backlog anymore. Root cause:
the 9797772 instruction fix (RETIRED SURFACES / "never ask" rule in `buildAppKnowledgeDigest`/
`RT_INSTRUCTIONS`) was correct, but a user's pre-fix persisted chat history under
`AICHAT_HISTORY_KEY` (`trapMasterAiChatHistory_v1`) could still replay old contaminated turns on
page load. Fixed by bumping the key to `_v2` (old key orphaned, not migrated) plus, as a
defense-in-depth fold-in from Codex review, bumping `EL_LAST_CALL_KEY`
(`aiMixMastersLastCall_v1 → _v2`, the 30-min voice-call continuity cache, same contamination
path). Live-verified headless against a real HTTP origin: old key seeded with contaminated
history is ignored on reload, new turns persist only under the new keys, the 9797772 instruction
text confirmed unregressed. Codex 3-touchpoint review (plan / diff / end-to-end) all clean. Not
independently verified: a live Anthropic/ElevenLabs round-trip (no API key available in the
review sandbox) — the mechanism-level fix is proven directly instead, per the card's own verify
steps. Branch `markey-hope-history-key-bump` @ `f8cb2b6`, off `main` @ `ced9e6cf1`,
`AIMM_BUILD 2026-09-05.1`, pushed, **NOT merged** (Kevin merges).

**2026-09-05 correction round (Markey, same branch, commit `d492eb1`, `AIMM_BUILD 2026-09-05.2`):**
Kevin reviewed the above and gave three corrections:
1. Confirmed the Insight tab was never actually named in the RETIRED SURFACES list — only "an
   Insight note" (as a fix source) was disclaimed there, distinct from the Insight tab itself,
   which was always described elsewhere as a real, active tab. Nothing to remove; added an
   explicit "NOT retired" clarifier to prevent future ambiguity.
2. Retired the standalone **Conversation tab** for real, since Hope's chat is now a persistent
   rail docked on every tab: removed the nav button + default-active markup (Mix Check `#eq` is
   the new default-active tab+panel, which also resolves backlog item 13 as a forced side effect,
   including an on-load init fix — `eqGridInit()`/`window.refTargetChanged()` — so Mix Check is
   fully live without requiring a manual first click); updated Hope's own instructions
   (`buildAppKnowledgeDigest()` — both the tour list AND a second "full inventory" appendix
   section Codex TP1 found I'd missed — and `RT_INSTRUCTIONS`) so she never offers to switch
   there; removed `voice` from the `switch_tab` tool's enum and its case-handler VALID list;
   removed the now-dead `TAB_DISPLAY_NAMES.voice`/`TAB_PURPOSES.voice` entries; fixed a
   legacy-but-still-wired Troubleshooter handoff handler (Codex TP1 catch) that force-activated
   the retired panel directly; fixed several genuinely user-visible strings (tip-boxes, toasts,
   empty states, tooltips) referencing "the Conversation tab"/"the Hope tab" as a destination.
   **Investigated the mobile collapse-fallback mechanism FIRST, per Kevin's explicit caveat**,
   before removing anything: confirmed live (headless Chrome, 390×844 mobile viewport) that
   `#voice`'s DOM node (kept in place, just never `.active`/nav-reachable) is still the exact
   attachment point the rail re-parents `.aichat-layout` into when "closed" below the 1024px
   breakpoint, and that the floating `#railReopen` button (position:fixed, not scoped to any tab)
   already opens the chat overlay from any tab regardless of Conversation's existence — switched
   to the Workbench tab, tapped reopen, chat opened correctly; collapsed again, correctly
   re-parented back to `#voice` immediately before `#aichatHome`. No mobile regression.
3. Tab-strip must not shrink when Conversation is removed. Confirmed no CSS change needed:
   `.tabs.oz-tabstrip .tab.oz-tab{flex:1 1 0}` is already global (R3 round 15). Measured live
   before (pristine `main` @ `ced9e6cf1`) vs after: strip `left:16 right:1088 width:1072` in BOTH
   states — identical — 9 tabs @ ~115-117px each before, 8 tabs @ ~130-132px each after.
   Screenshots taken of both states for visual confirmation.

Codex 3-touchpoint review ran across both rounds; the correction round's TP1 (plan-confirmation)
found the real gaps listed above (all folded in, none dropped), TP2 (diff review) and TP3
(end-to-end incl. the live render results) both came back clean. One **pre-existing, unrelated**
issue flagged non-blocking by TP3: ~9 toast/status strings across the file already said "add a
key on the Hope tab" before this change, even though those keys live in Settings — not caused or
worsened by this correction, left untouched to avoid scope creep (candidate for a separate,
small follow-up ticket). Branch `markey-hope-history-key-bump` @ `d492eb1`, off `main` @
`ced9e6cf1` (confirmed unchanged throughout both rounds), `AIMM_BUILD 2026-09-05.2`, pushed,
**NOT merged** (Kevin merges).

## Workstream status

| Workstream | Status | Notes |
|---|---|---|
| Project OS setup | SHIPPED | Committed, pushed |
| GitHub repo rename | SHIPPED | github.com/begb0037admin/aimm live |
| Hope Knowledge Base — wiring | SHIPPED | Smoke tested, KB hitting correctly |
| Hope Knowledge Base — .nojekyll fix | SHIPPED | Transcript files now serve on GitHub Pages |
| Hope Knowledge Base — trigger fix | SHIPPED | buildResearchDigest early-exit fixed |
| Hope Knowledge Base — topic index | SHIPPED | 28 topics mapped to video_ids in RT_INSTRUCTIONS |
| Hope Knowledge Base — ingestion | IN PROGRESS | 333 videos ingested (+92 Mix With The Masters 2026-06-17: Jaycen Joshua, Leslie Brathwaite, Bainz, Illangelo, Teezio, Anthony Kilhoffer, Young Guru, Boi-1da, Rodney Jerkins, Timbaland, Stuart White, Ben Baptie, Tom Elmhirst, Josh Gudwin, Neal Pogue, Finneas, others; 17 failed — no transcript/age-restricted). Logic Pro & DAW Training tier next (14 channels). |
| YouTube citation links | PLANNED | Hope cites title/channel but no clickable URL yet |
| Ingest tooling | SHIPPED | ~/bin/ingest + Ingest Video.command + docs/INGEST.md |
| **Reference tab rebuild** | **SHIPPED** | WAV drop + transport + meter dashboard + spectral analyser + loudness tables. Committed 4be7200, live on GitHub Pages. |
| **Mix Check tab (P-A)** | **SHIPPED 2026-06-04** | Renamed Reference→Mix Check; threshold-driven troubleshooter pills from WAV analysis + manual input overrides. Commit a3d96ba. Superseded by the R3 Mix Check full-layout redesign (row below). |
| **R3 Mix Check full layout** | **PROMOTED & LIVE on `main` @ `dbc793d` (build 2026-09-01.9), 2026-09-01. Post-ship fix round CLOSED 2026-09-02 — feedback items 1–15 (16 folded into 15), 17, 18, 20 SHIPPED & LIVE on `main` @ `e9bcd8a` (build 2026-09-02.15). Docs reconciled `main` @ `4424590` (2026-09-04). Still-open queue (Backlog 9–14 / feedback #21, #22, #19, #3, #6 + default-tab) tracked in `docs/ROADMAP.md` — nothing currently mid-build.** | First R3 tab rebuilt mockup→live to Jules mockup `05-r3-mixcheck-full-layout.html` @ `8c2785e`. Grid shell + de-pinned transport; single `Drop / browse WAV ▾` input + brand wordmark; Audio Specs panel absorbing the 4 meter cards (RMS/Crest/LRA/noise-floor DSP, Tempo via web-audio-beat-detector, in-browser chroma Key, TEMPO/KEY headline tiles, stereo-width meter, SSL-style band deviation meters); context banner; Fix Queue with the `window.mcFixQueue` contract + `aimm:analysis-complete` event (replaces the 6 Mix Issues pills); transport waveform; `#hopeRail` full-height grid item with a speech-tied meter; Hope transcript mix-breakdown + live action-item cards + `mark_fix_applied` tool (Markey). Codex TP1 approve-with-notes (folded), per-step TP2 clean, TP3 end-to-end complete (no blockers). Gate 1 + Gate 2 Kevin-approved 2026-09-01; PROMOTED to `main` via Kevin's PowerShell ff-only merge 2026-09-01 (`main` @ `dbc793d`, live). Durable record: `docs/HANDOVER-r3-mixcheck.md`; post-ship fix round: `docs/HANDOVER.md`. Deferred/residual items listed below. **Post-fix follow-up (header re-layout, tab strip full-width + taller, Genre/Target/Settings → title row, WAV loader → transport bar) shipped as part of the 2026-09-02 feedback round above — no longer awaiting review.** |
| **A/B Ref tab (P-B)** | **PLANNED** | New tab: two drop zones, overlaid spectral curves, delta meters, Hope commentary. Spec in docs/ROADMAP.md. Mockup: docs/mockups/ab-ref.html |
| **Retire Repair tab (P-C)** | **PLANNED** | Remove Repair tab once P-A ships; slot freed for P-B. ~1 hr. |
| **Hope's sphere (P-D)** | **PLANNED** | Animated particle orb replaces floating mic button. Idle/listening/speaking/thinking states. Mockup: docs/mockups/hope-sphere.html |
| **Hope tools for Mix Check + A/B Ref (P-E)** | **PLANNED** | get_mix_check_state, set_meter_value, get_ab_ref_state client tools. Depends on P-A + P-B. |
| **Cloudflare Worker key relay** | **SHIPPED** | Merged PR #1 (`a533ed3`), live. Worker deployed at aimm-proxy.kevinlelitte.workers.dev, secrets set, `/health` verified green. Zero Settings entry on any device. |
| **Voice session stacking fix + spacebar-only** | **SHIPPED 2026-06-11** | Root cause: elEnd during connect orphaned the in-flight session. Session registry + endRequested + ending lock + 600ms space cooldown; mouse call control removed per 2026-06-04 brief. Sphere = drag only. |
| **open_dashboard + capture fixes** | **SHIPPED 2026-06-11** | Dashboard now opens in in-app overlay (popup blocker killed the old new-tab path); relative URL fixes localStorage origin; capture dedup reads docs/ROADMAP.md; captures toast on success. |
| **open_dashboard root cause (round 2)** | **SHIPPED 2026-06-11** | Tool was registered on EL side but MISSING from TOOL_DEFS → no client handler → 30s timeout → "isn't connecting". Added. Also: read_doc remaps to active docs (ROADMAP.md→docs/ROADMAP.md, CLAUDE.md→docs/HANDOVER.md); elEnd paints instant "Ending…" feedback. |
| **Build stamp + panic button** | **SHIPPED 2026-06-11** | `AIMM_BUILD` const + bottom-right badge (bump every index.html commit — hard rule in docs/CLAUDE.md); pagehide handler explicitly endSession()s every live Hope session so closing the tab always stops billing instantly. Build `2026-06-11.4`. |
| **Durable captures store** | **SHIPPED 2026-06-11** | `/captures` on aimm-proxy Worker (Workers KV, binding `AIMM_KV`); app + DASHBOARD sync with localStorage fallback. Kev one-time setup: KV namespace + binding + re-paste worker code (`worker/README.md`). |
| **Dashboard opens in new tab** | **SHIPPED 2026-06-11** | window.open first (needs one-time pop-up allow for the site), overlay only as fallback. Build 2026-06-11.5. |
| **Hope dashboard sight + inbox autonomy** | **SHIPPED 2026-06-11** | read_doc DASHBOARD.html → live digest (inbox + roadmap); new manage_roadmap_inbox tool (list/remove/promote/edit, live overlay refresh). Kev one-time: Settings → "Register dashboard-inbox tool", then fresh call. Build 2026-06-11.6. |
| **Double-tap orb call control (iPad)** | **SHIPPED 2026-06-11** | Double-tap (2 non-drag taps ≤450ms) toggles the call via the same guarded path as spacebar; first tap arms (orb flash). Build 2026-06-11.7. |
| **Mix Check meter accuracy (BS.1770-4)** | **SHIPPED 2026-06-11** | Real K-weighted gated LUFS + 4× oversampled true peak + PLR; validated vs reference signals (−18dBFS 997Hz → −18.00 LUFS exact). Was raw RMS/sample-peak. Build 2026-06-11.8. |
| **Live input metering** | **SHIPPED 2026-06-11** | "or meter live" bar: input device (BlackHole = DAW feed) or tab-audio capture; streaming BS.1770 + max-hold TP; Stop locks readings. Validated −18.00/−18.00 on simulated stream. Build 2026-06-11.9. |
| **Tonal Balance-style spectral display** | **SHIPPED 2026-06-11** | Genre target corridor + normalised smoothed 64-pt curve (8192 FFT) + whole-file average spectrum at load + graphite restyle. Target selector follows workbench genre. Build 2026-06-11.10. |
| **Mix Move cards (Mixio steal #1)** | **SHIPPED 2026-06-11** | propose_mix_move tool → structured card (plugin/move/why/confidence) + Apply button (adds plugin + pins settings). Kev: re-click the Settings register button, fresh call. Build 2026-06-11.11. |
| **Bus snapshot overlay (Mixio steal #2)** | **PLANNED** | Solo a bus → capture curve via live metering → overlay colours on the corridor display. Spec in docs/ROADMAP.md P-K2. |
| **Full-page redesign — R3 per-tab rollout** | **Mix Check tab PROMOTED & LIVE on `main` @ `dbc793d` (build 2026-09-01.9) 2026-09-01, plus the full 2026-09-02 feedback round on top (`main` @ `e9bcd8a`, build 2026-09-02.15); other tabs still to do** | The R3 Mix Check full-layout redesign (see the dedicated row above) is the first R3 tab taken mockup→live to a real working build against Jules mockup `05-r3-mixcheck-full-layout.html` @ `8c2785e`. Gate 1 + Gate 2 Kevin-approved 2026-09-01 @ `256cae8`; the PowerShell `git merge --ff-only` promote of `main` was run by Kevin 2026-09-01 (`main` @ `dbc793d`). The 2026 rounds 1–5 screenshot-rebuild history and the `r3-preview` branch (`https://raw.githack.com/begb0037admin/aimm/r3-preview/index.html`) are **superseded** by this build. Still to do: the rest of the R3 per-tab redesign — Workbench, Library, Insight, Snapshots, Settings, Marketing, Community, Conversation. Epic not fully settled (still blocks the Hope→Mia rename — see docs/ROADMAP.md). |
| **Hope chat rail (static on every page)** | **SHIPPED 2026-06-11** | #hopeRail docks .aichat-layout on the right of every tab (Mixio-style); collapse returns it to the Conversation tab; persisted. Build 2026-06-11.13. |
| DAW Bridge Epic | PLANNED | 3 phases scoped, not started |
| iPad PWA | PLANNED | Not started |
| Branch consolidation | PLANNED | Consolidate voice-elevenlabs into main only |
| **Platform Evolution Epic** | **PLANNED — decision locked 2026-06-23** | AIMM evolves from single-file to hosted, login-based web app. No install ever. 3 staged arches: ARCH-1 (Cloudflare Worker + R2 + auth), ARCH-2 (RoEx-style analysis via Python/Librosa microservice), ARCH-3 (HyFi-style AI online mastering). Spec in docs/ROADMAP.md. Cards in DASHBOARD.html. |

## R3 Mix Check full-layout — deferred & accepted residuals (as of build 2026-09-01.9)

**Deferred to the analyst phase (tracked, not bugs — logged as Backlog 6/7 in ROADMAP.md + DASHBOARD.html):**

- **Audio Specs "with full analysis" placeholders** — Subgenre / Production style / Energy / Mood / Dissonance render as placeholder rows with a neutral dot; real detected values need the deferred server-side analysis phase (Platform Evolution ARCH-2 territory). Placeholders by design.
- **Transport waveform INTRO / VERSE / BRIDGE / VERSE sections** are fixed cosmetic proportional layers, not detected from the audio. Real arrangement detection (SSM / novelty / energy segmentation) is an analyst-phase job, explicitly deferred in the build's locked decisions.
- **Markey's Hope-rail speaking-meter real-amplitude gain** (`EL.conversation.getOutputVolume()` × 11) is structurally verified only; the gain needs a tune against a live voice call (the synthetic envelope path renders headless).

**Accepted Gate-2 residuals (Kevin signed off 2026-09-01 with these known — logged as Backlog 8):**

- A. Empty (no-WAV) state — Audio Specs column runs well below the shorter empty analyser card before the columns bottom-align; matching the empty analyser height is a separate grid tweak.
- B. Very hot bands peg at the ±6 dB edge of the deviation meter (e.g. LOW +11 shows at the edge); the signed value above carries the true number.
- C. Stereo-width meter is a 1:1 %→track map; typical masters (~25–40%) sit left of centre; could switch to a compressed scale.
- D. Speaking-meter real-amplitude path is structurally verified only; a live voice call is needed to tune the ×11 gain; synthetic envelope renders headless.
- E. Speaker button in the composer has no effect with no call live (arms the mute preference); could show a disabled state.
- F. PRE-EXISTING: empty-state analyser hint text overlaps the "Low / Low-Mid / High-Mid / High" axis labels — long-standing, not introduced by R3, still present.

## Last known good state

- index.html on `main`: v4 redesign live — build 2026-06-18.3 (3-column layout, canvas orb, ribbon waveform). **Unchanged this round — confirmed `git diff main r3-preview -- index.html` before push.**
- index.html on `r3-preview` (branch, NOT merged): round-5 MixCheck rebuild, build 2026-08-17.1, commit `433888d`. **Superseded by `r3-mixcheck-codex` below — do not use for sign-off.**
- index.html on `main` @ `dbc793d`: R3 Mix Check full-layout redesign, build 2026-09-01.9 (merged ff-only from `r3-mixcheck-codev` @ `256cae8`). Gate 1 + Gate 2 Kevin-approved 2026-09-01; Codex TP3 end-to-end clean; PROMOTED & LIVE 2026-09-01. Durable record: `docs/HANDOVER-r3-mixcheck.md`; post-ship fixes: `docs/HANDOVER.md`.
- index.html on `main` @ `e9bcd8a` (build 2026-09-02.15): the 2026-09-02 Mix Check feedback round fully shipped on top of `dbc793d` — header re-layout, Hope-rail pass, Fix Queue + transport batch, transcript layout, `#hopeWave` PTT port, viewport-fit density, page gutter, Fix Queue "production line" (queue side + Hope side). **This is the current live index.html on `main`.**
- `main` HEAD as of 2026-09-04 is `4424590` — one docs-only commit on top of `e9bcd8a` (DASHBOARD.html + docs/ROADMAP.md, no index.html/build change) reconciling the feedback round into Recently Shipped and queuing Backlog 9–14.
- `main` HEAD confirmed live 2026-09-05 (Markey, at dispatch time) is `ced9e6cf1`, unchanged when this branch was pushed.
- index.html on branch `markey-hope-history-key-bump` @ `f8cb2b6` (off `main` @ `ced9e6cf1`): item 12 fix (`AICHAT_HISTORY_KEY`/`EL_LAST_CALL_KEY` → `_v2`), build `2026-09-05.1`. Pushed, **NOT merged**.
- Tag pre-v4-redesign: full pre-v4 app preserved for instant revert
- docs/knowledge/index.json: 333 videos (+92 Mix With The Masters, 2026-06-17)
- ~/bin/ingest: installed and smoke tested
- Both branches: 4be7200 (voice-elevenlabs and main both at this commit)
- GitHub Pages: live — https://begb0037admin.github.io/aimm/ (still serving `main`, untouched)
- Round 3/4 screenshot-only review pages (mixcheck-r3-review.html / -v2.html / -v3.html) are superseded by the round-5 live build above — don't use them for sign-off.

## Session 6 start priorities (2026-05-26)

P-A → P-C → P-B → P-D → P-E (in that order, each depends on prior)
Effort total: ~12.5 hours across all five items.
Start with P-A (Mix Check) — smallest risk, highest immediate value.
