# PluginHub replica — Phase 1 evidence package

| Field | Value |
|---|---|
| Phase | PluginHub replica, Phase 1: source research |
| Date | 2026-10-23 |
| Produced by | Codex executing session |
| Governed by | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.0 |
| Status | Work product committed; awaiting independent governance challenge and Kevin's decision |
| Work product commit | `24f96614ee041ce84444bb6a7ef06bd4c6d76e58` on `codex/pluginhub-replication` |
| Evidence package commit | Determined by GitHub after this file is committed; use the Review Request's commit reference |

## Scope and authorization

Kevin requested a full PluginHub-functionality replica in AIMM, with Phase 1 reverse engineering first, durable handover/roadmap records, and read-only Claude CLI review as work proceeds. He approved proceeding on the isolated feature branch. This package covers research and documentation in `begb0037admin/aimm` only. `ai-news-channel` and `personal-finance` were not in scope and were not changed. No PluginHub action, Logic project edit, installer download, app implementation, merge, or live deployment was part of Phase 1.

Pre-existing, unrelated `index.html`, `bridge/`, and `pluginhub-ui-review.patch` working-tree changes were excluded from all commits. The separate running PluginHub bridge LaunchAgent was observed read-only and not changed.

## Inputs and reproducible source evidence

| Input | Evidence and limit |
|---|---|
| User manual | `/Users/admin/Desktop/PluginHub_Manual.pdf`, 32 pages, read with PDFKit. No copy or modification of the manual. |
| Installed reference app | `/Applications/PluginHub.app`, version 2.0.12; source inspected under `Contents/Resources/` without importing/executing app code. |
| Checker source | `vendor_checkers.py` SHA-256 `8605f7317ff3120b1d32d776b691b428e4254daa939d99d05bda55f59e143afe`. `python3 research/pluginhub_registry_audit.py /Applications/PluginHub.app/Contents/Resources/vendor_checkers.py` emitted 970 distinct candidate keys, 1,230 registration expressions and zero unresolved sites in its supported forms. The script emits source conditions and **does not claim effective runtime bindings**. Its CSV was kept in `/private/tmp`, not copied into AIMM. |
| Local aggregate data | `plugin_snapshot.json` 1,880 format rows (AAX 239, VST3 538, AU 538, VST2 563, CLAP 2); excluding AAX gives 1,641 rows. `version_report.json` has 159 updates, 100 up-to-date, 19 errors, one unchecked; updates span 15 vendor labels, 102 paid flags, 13 update-row direct-installer candidates. Only keys and aggregate counts were read. |
| Independent technical review | Three read-only Claude CLI outputs are committed under `docs/handovers/2026-10-23-pluginhub-phase1-*-review.md`. First two found faults and prompted corrections. Final review found no source-backed research-exit blocker; it could not itself execute the audit, so the executing Terminal ran it against the pinned SHA. |

## Work product and GitHub primary evidence

GitHub Commit API GET for `24f9661` returned SHA `24f96614ee041ce84444bb6a7ef06bd4c6d76e58`, message `Finalize PluginHub Phase One technical trace`, author date `2026-10-23T17:48:33Z`, and exactly five changed paths: the parity matrix, vendor/action matrix, final technical review, dated handover and audit script. Earlier work-product commits are `c2cd0d1dbd59a045c1e9eb7778560f74572f2fbd`, `f87dedf` and `9c0df063b016de50074631be9e8b67e0c95306ad`. GitHub Tree API GET `git/trees/24f9661?recursive=1` returned `truncated:false` and the following current blob SHAs (GitHub content SHAs):

| AIMM path | Current blob SHA |
|---|---|
| `docs/PLUGINHUB_REPLICA.md` | `bcff35a42532145f4f7fab39b028cf7c63504b1a` |
| `docs/PLUGINHUB_PARITY_MATRIX.md` | `ef465563a0932366f5ddfc21326a16505945f614` |
| `docs/PLUGINHUB_VENDOR_ACTION_MATRIX.md` | `9c75b665bd35c9699b2ce667eedfa2a3dd35a787` |
| `docs/PLUGINHUB_WORKFLOW_TRACE.md` | `4aa369299ccd2118f2dae9c4f9b4c72a98bfbc1b` |
| `docs/PLUGINHUB_STATUS_RULES.md` | `9676c94145781fa24f82d9499c3e2ab91ec3b247` |
| `docs/PLUGINHUB_COUNT_RECONCILIATION.md` | `db4d1a231c5add084f8d844232c838a5ff3dbbdf` |
| `docs/PLUGINHUB_DATA_BOUNDARY.md` | `3440110f3d3f37e2255209030595339b221ba9d0` |
| `research/pluginhub_registry_audit.py` | `f4896a8766e50011c09d69659bd8d39bce0a5a07` |
| `docs/HANDOVER.md` | `b1e9d29c043b77871881460ef07f0b64e22f8a91` |
| `docs/STATUS.md` | `e1e84f1b3a6b738d0a51e8e0e9b13db7e6244301` |
| `docs/ROADMAP.md` | `db1f5d53181e1961c82cb4ff7e68da8463839ecf` |
| `DASHBOARD.html` | `e305761da79be79ff0c600d1cd650b29326fe2d3` |
| `docs/handovers/2026-10-23-pluginhub-reverse-engineering.md` | `503359cc171f29e57e16739c68ff6e736df3a3bc` |
| `docs/handovers/2026-10-23-pluginhub-phase1-technical-review.md` | `563ebe54041290aa9b89019391bd9259954aa52e` |
| `docs/handovers/2026-10-23-pluginhub-phase1-followup-review.md` | `d3594cd29e65509eba547c5ec28fbd9cf8857402` |
| `docs/handovers/2026-10-23-pluginhub-phase1-final-technical-review.md` | `152584b71c9edd46eca1d2e4ec26a3676e9a6c06` |

The Phase 1 output is a 31-row functional parity matrix with explicit Include/Adapt/Exclude decisions, a source/workflow and vendor-action inventory, status rules, count reconciliation, and local/account/public/telemetry boundaries. It keeps AAX/Pro Tools excluded, Cubase in scope, one product card per canonical product, and Hope/Workbench mechanics unchanged. No product implementation is claimed.

## Backups and rollback

The four central pre-edit planning snapshots were committed earlier at `d9cd8315b19eb0b7c926ef04c7d5178c62dfcae1` in `Archive/2026-10-23-aimm-pluginhub-phase1/`. A second eight-file rollback set was committed with the first work-product update at `c2cd0d1dbd59a045c1e9eb7778560f74572f2fbd` under `Archive/2026-10-23-aimm-pluginhub-phase1-exit/`. GitHub Contents API GET on the branch returned these backup blob SHAs:

| Rollback file under `Archive/2026-10-23-aimm-pluginhub-phase1-exit/` | GitHub blob SHA |
|---|---|
| `2026-10-23-pluginhub-reverse-engineering.md` | `cde487d94412af515bb95ee6fcf2d8f37700bb2b` |
| `DASHBOARD.html` | `748b76592afce3ba79c9af6387f3719be046ba9a` |
| `HANDOVER.md` | `addb75c1f3062886c81383a03de31ec3370427ea` |
| `PLUGINHUB_REPLICA.md` | `a587c6abdc46c3b3ee4affd8c46bdfe4414a2208` |
| `PLUGINHUB_VENDOR_ACTION_MATRIX.baseline-d752d0b.md` | `160c205480fe8b333919ffb85df90996d6a7e40c` |
| `PLUGINHUB_VENDOR_ACTION_MATRIX.md` | `cb1230f191f7fc4748b492564a587372147ea3f5` |
| `ROADMAP.md` | `915e44d1ca91994f01aa3c054a43d81fa8bd95eb` |
| `STATUS.md` | `c246bb58cee3a27171560e501fc102aa5fc972bd` |

The seven copied files other than the vendor/action matrix matched the prior tracked `d752d0b` contents byte for byte before central edits. The vendor/action matrix copy followed an initial local audit paragraph edit, so its exact pre-edit version was also restored from immutable commit `d752d0b` as the `baseline-d752d0b` backup. **The second Archive set was committed in the same commit as the research update, not before it; it must not be described as a prior committed backup.** Earlier Git commits and the older four-file Archive set provide the prior committed rollback point. Restoring any file would be a separate reviewed commit, not an action performed here.

## Authentication, risks and assumptions

The feature branch was pushed with existing Git credentials; a GitHub Commit API GET of `c2cd0d1` and `24f9661`, Tree API GET of `24f9661`, and eight Contents API GETs of the rollback files succeeded. No credential values were printed or stored in this package. The GitHub API should be queried independently by the challenger; these are executing-agent observations.

| Assumption or risk | Treatment |
|---|---|
| Static checker source equals a running update service | Rejected. Missing `cached_checks.py`, `feature_flags.py`, `plugin_categories.py` and `login_launch.py`; current vendor reachability and flag defaults unknown. |
| Saved installer metadata proves a safe current download | Rejected. Thirteen update candidates had offline structural checks only; current URL, product, Mac platform, entitlement and file integrity need independent validation. |
| 873 PluginHub products equals 1,618 AIMM products | Rejected. Different unit, scanner, grouping and capture; see count reconciliation. |
| PluginHub licensing/paywall must be copied exactly | Rejected. Functional entitlement parity is mapped, but AIMM policy is a Phase 2 decision. |
| PluginHub-coupled bridge is AIMM architecture | Rejected. Pre-existing working-tree and main-checkout bridge remain untouched; Phase 2 must plan replacement/cutover. |

## Next stage

Produce and commit `PHASE_PLUGINHUB_REPLICA_PHASE1_REVIEW_REQUEST_20261023.md` referring to this package's verified commit SHA. The challenger independently verifies GitHub evidence and writes a Challenge Report in `docs/project/generated/`. No Phase 2 implementation or live cutover is authorized by this research package.
