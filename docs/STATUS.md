# STATUS.md — AIMM

Last updated: 2026-06-11

## Workstream status

| Workstream | Status | Notes |
|---|---|---|
| Project OS setup | SHIPPED | Committed, pushed |
| GitHub repo rename | SHIPPED | github.com/begb0037admin/aimm live |
| Hope Knowledge Base — wiring | SHIPPED | Smoke tested, KB hitting correctly |
| Hope Knowledge Base — .nojekyll fix | SHIPPED | Transcript files now serve on GitHub Pages |
| Hope Knowledge Base — trigger fix | SHIPPED | buildResearchDigest early-exit fixed |
| Hope Knowledge Base — topic index | SHIPPED | 28 topics mapped to video_ids in RT_INSTRUCTIONS |
| Hope Knowledge Base — ingestion | IN PROGRESS | 241 videos ingested; Logic Pro & DAW Training tier next (14 channels) |
| YouTube citation links | PLANNED | Hope cites title/channel but no clickable URL yet |
| Ingest tooling | SHIPPED | ~/bin/ingest + Ingest Video.command + docs/INGEST.md |
| **Reference tab rebuild** | **SHIPPED** | WAV drop + transport + meter dashboard + spectral analyser + loudness tables. Committed 4be7200, live on GitHub Pages. |
| **Mix Check tab (P-A)** | **PLANNED** | Rename Reference→Mix Check + troubleshooter pills auto-highlighted from WAV analysis + manual input mode. Spec in docs/ROADMAP.md. Mockup: docs/mockups/mix-check-pills.html |
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
| **Full-page Mixio-violet redesign** | **EPIC — APPROVED, v2 PER-TAB MOCKUPS READY** | v1 approved; v2 = all 8 tabs clickable (docs/mockups/aimm-redesign-v2.html). Constraints: zero content loss, our analyser stays, chat rail everywhere. |
| **Hope chat rail (static on every page)** | **SHIPPED 2026-06-11** | #hopeRail docks .aichat-layout on the right of every tab (Mixio-style); collapse returns it to the Conversation tab; persisted. Build 2026-06-11.13. |
| DAW Bridge Epic | PLANNED | 3 phases scoped, not started |
| iPad PWA | PLANNED | Not started |
| Branch consolidation | PLANNED | Consolidate voice-elevenlabs into main only |

## Last known good state

- index.html: Reference tab rebuild live — 4be7200
- docs/knowledge/index.json: 241 videos
- ~/bin/ingest: installed and smoke tested
- Both branches: 4be7200 (voice-elevenlabs and main both at this commit)
- GitHub Pages: live — https://begb0037admin.github.io/aimm/

## Session 6 start priorities (2026-05-26)

P-A → P-C → P-B → P-D → P-E (in that order, each depends on prior)
Effort total: ~12.5 hours across all five items.
Start with P-A (Mix Check) — smallest risk, highest immediate value.
