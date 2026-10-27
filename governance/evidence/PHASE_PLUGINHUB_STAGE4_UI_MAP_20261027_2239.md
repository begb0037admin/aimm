# PluginHub Stage 4 — live UI map and gaps

**Observed:** 2026-10-27 22:39 UTC  
**Source branch:** `codex/pluginhub-foundation`, verified head `6219e9837ad3d15e2934d63254f5a3fc70e49102` before this evidence commit.  
**Runtime:** non-production Pages preview, build `2026-10-22.5`; signed-in account preview; paired Mac companion `AIMM Companion Status Fix`.  
**Method:** read-only accessibility-tree inspection of Library, Settings/Library Settings, and the companion window. No full inventory export, database write, file action, or deployment was performed. This maps visible controls and observed limitations; it is not a feature acceptance test.

The live page exposes account-backed Library controls inside Settings while the Library tab remains a separate browser-local scanner. The current Mac generation is `9ff4225e-fb10-4966-aae4-393cf8294210` (1,641 records; observation 21:48:16Z). The account preview reports 1,641 matches, 317 browser-only, 0 account-only, and 2 version differences. It names examples without disclosing a full list: Guitar Rig 7 MFX AU; AudioTrack (s) AU; Flow Motion (0->2) AU; GTR Solo Tool Rack (s) AU; and GTR Solo Tool Rack (m->s) AU. Version differences: UAD Hitsville EQ AU, browser 11.8.0/account 11.9.0; UAD Black Box Analog Design HG-2 AU, browser 11.9.0/account 11.8.0. Parity remains unresolved.

## 31-row as-built UI map

“Visible” means a control or surface was observed. It does not mean the acceptance criteria in the Phase 1 matrix/Phase 2 ownership map passed.

| ID | Current surface observed | As-built disposition |
|---|---|---|
| P01 | Site navigation; paired companion scan/pair controls; Settings shows last Mac contact and scan generation | **Partial.** Live status badges and offline-state parity are not proven. |
| P02 | Account Settings has status-observation counts and filters; Library status buttons are disabled with “vendor checks are not connected yet” | **Partial.** Account observations exist; same buckets on Library and Hope are not proven. |
| P03 | Account preview rows expose favourite, pin, hide, tags, snooze, and action controls | **Partial.** Version-aware mark, expiry, reset, and cross-device conflict behaviour are not validated. |
| P04 | Library shows grouped cards, find, format filters, and category filters; Settings account list has find/sort/format and pagination | **Partial.** Three-view parity, responsive behaviour, and shared membership are not proven. |
| P05 | Site has Mix Check, Workbench, Library, Insight, Snapshots, Settings, Marketing, and Community navigation | **Visible.** Keyboard, collapsed-sidebar labels, and persistence are not validated. |
| P06 | Library browser-local favourites; account rows have favourite, pin, and hide controls; Settings has favourites/hidden views | **Partial.** Cross-device sync and reliable undo are not proven. |
| P07 | Library categories are visible; Settings rows expose tags | **Partial.** Multi-select taxonomy and saved collections are not demonstrated; “My tags” is unavailable in the Library scanner. |
| P08 | Vendor/product labels and vendor links are visible | **Partial.** Licensed official marks and fallback behaviour were not assessed. |
| P09 | Browser Library groups by publisher/product and displays format details; account view lists product-format records | **Partial.** Canonical aliases, helpers, Waves shells, and cross-format counts remain unverified. |
| P10 | Browser offers Manage plug-in folders; companion offers standard/custom folder scans | **Partial.** Unused/offload destinations, permission recovery, and overlapping-root behaviour are not mapped. |
| P11 | Companion scan reports format counts; browser displays version/format metadata | **Fail against approved scope.** The running Library still lists and filters AAX, while the approved architecture excludes it. |
| P12 | Companion exposes FabFilter, Voxengo, u-he, Valhalla DSP, and Manual Check actions; account status observations are visible | **Partial.** Only bounded vendor coverage is supported; other products remain Manual Check. |
| P13 | No direct installer/download queue controls were visible in the inspected Library/Settings surfaces | **Not observed.** Verified Mac artifact, queue, cancellation, and installed-version receipt remain open. |
| P14 | Account row exposes “Open hub app on Mac” | **Partial.** Installed-hub discovery and truthful entitlement/login state were not verified. |
| P15 | Account row exposes Finder preview, reveal, and Move to Unused; prior local synthetic move/restore evidence exists | **Partial.** Fresh remote Worker/D1 action and recovery evidence is still open; no live file was changed here. |
| P16 | No batch-selection/progress/cancel UI was visible | **Not observed.** |
| P17 | Companion has a “Possible duplicate copies — review only” section | **Partial.** Current list contents, analysis binding, and safe removal are not validated. |
| P18 | No installer-file cleanup controls were visible | **Not observed.** |
| P19 | Account preview has no visible share/export/revoke flow in the inspected surface | **Not observed.** |
| P20 | No Logic/Cubase project requirement parser surface was visible | **Not observed.** |
| P21 | AAX format filter is visible in the Library and scanner format summary includes AAX | **Fail against approved exclusion.** The scanner must not discover, count, filter, check, or act on AAX. |
| P22 | “Compare inventory” is available in Library Settings | **Partial.** Five-bucket profile diff, share, revoke, and expiry are not proven. |
| P23 | No licence vault UI was visible in the inspected site/companion surface | **Not observed.** Local-only scope remains mandatory. |
| P24 | No contribution/telemetry consent surface was visible | **Not observed.** |
| P25 | Settings includes voice reminder/idle-call controls; companion shows scan/check controls | **Partial.** Scheduler frequency, login launch, and complete reset scope are not verified. |
| P26 | Dark AIMM visual system and Settings section navigation/guide are visible | **Visible.** Brightness, text-size, layout persistence, and keyboard access are not validated. |
| P27 | Status rows show source, timestamp, and manual-check reason; companion describes its checks | **Partial.** Redacted diagnostics and permission-troubleshooting export were not observed. |
| P28 | No AIMM entitlement/paywall/device-limit surface was observed | **Not observed.** |
| P29 | No companion self-update/rollback surface was observed | **Not observed.** |
| P30 | Site sign-in/account preview and companion “Pair this Mac” are visible | **Partial.** A full first-run privacy, pairing, and folder-permission onboarding flow is not demonstrated. |
| P31 | No sample-library inventory surface was observed | **Not observed.** |

## Stage 4 disposition

The mapping work is now recorded for all 31 parity rows. It does **not** close Stage 4 implementation or validation: visible site/account parity is incomplete, most feature acceptance was not observed, and P21 currently contradicts the approved AAX exclusion. The 317-row and two-version Mac/account mismatch remains open. Stage 4 remains **PARTIAL**.

## Foundation and authorization disposition

Foundation remains **NOT MET**; Stage 6 remains gated. The 22:47 D1 creation chronology is preserved separately from the current D1 validation/write hold. This checkpoint performed no remote D1 query or write. Prior local synthetic Worker/D1 action/recovery evidence and its **PARTIAL** independent review are unchanged. Fresh remote Worker/D1 action/recovery and fresh independent end-to-end Foundation acceptance remain open. No deployment or production action.
