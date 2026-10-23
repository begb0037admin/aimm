# PluginHub replica — Phase 2 independent challenge report

**Date:** 2026-10-23  
**Operating mode:** Option A — Controlled GitHub Artefact Writer  
**Reviewer model and effort:** GPT-6 Sol, medium. This architecture, privacy and authorization review spans multiple systems and consequential user actions.  
**Repository and branch:** begb0037admin/aimm, codex/pluginhub-replication  
**Review baseline:** checkpoint f7b4a370748dabe065c5738d0ae2268c80c9b92e through Review Request commit 5b56384c627945531a6b8db467ae4ea08e4effa4. A prior challenge report was added at e3d5935e5f37ee4899daa65042f10abde627a935; this independent review replaces that report's content.  
**Decision boundary:** These findings do not make Kevin's governance decision.

## Method and primary evidence

I treated the Evidence Package and Review Request as unverified claims. I fetched both, every named architecture input, the governance standard, the Phase 1 parity matrix and decision, and all six cited technical review files through the connected GitHub Contents API. I fetched individual handoff commit details and compared checkpoint to Review Request through the GitHub API. The GitHub API comparison reports nine commits ahead, zero behind and exactly two added files in the net diff. Its individual commit list and each commit's file diff were checked; no interim application, service or planning file write appears in that nine-commit sequence.

The supplied inputs GET-verified at the Review Request ref and again at the branch ref observed during this review:

| File | Observed content/blob SHA |
|---|---|
| Evidence Package | 31a6b34ae9599da14cf2f844fece211829503fae |
| Review Request | 1fbf16d888116a401148263c9d2957d7c564fa49 |
| Governance Workflow Standard | ce78b5bd78a5c03c27191304c89efb8451d6e62b |
| Phase 2 architecture | c69ecc6c453561c563466efed63cd39a2e1395f2 |
| Phase 2 ownership map | b3d98e3d1afcbe2ff8d89474ab28c0f3cb47722f |
| Data boundary | 25ca4c65b0c7b5b4c909c07f094701b0f6876cbf |
| Dated Phase 2 handover | 7a4fa44e1219a8a728c31b606784911648c1db69 |
| Phase 1 parity matrix | ef465563a0932366f5ddfc21326a16505945f614 |
| Phase 1 governance decision | 83b45e47ea4b160ebe27fed87b6726c0f6757294 |

Source paths: [Evidence Package](https://github.com/begb0037admin/aimm/blob/5b56384c627945531a6b8db467ae4ea08e4effa4/governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_EVIDENCE_PACKAGE_20261023.md), [Review Request](https://github.com/begb0037admin/aimm/blob/5b56384c627945531a6b8db467ae4ea08e4effa4/governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_REVIEW_REQUEST_20261023.md), [workflow standard](https://github.com/begb0037admin/aimm/blob/f7b4a370748dabe065c5738d0ae2268c80c9b92e/governance/GOVERNANCE_WORKFLOW_STANDARD.md), [architecture](https://github.com/begb0037admin/aimm/blob/f7b4a370748dabe065c5738d0ae2268c80c9b92e/docs/PLUGINHUB_PHASE2_ARCHITECTURE.md), [ownership map](https://github.com/begb0037admin/aimm/blob/f7b4a370748dabe065c5738d0ae2268c80c9b92e/docs/PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md), [data boundary](https://github.com/begb0037admin/aimm/blob/f7b4a370748dabe065c5738d0ae2268c80c9b92e/docs/PLUGINHUB_DATA_BOUNDARY.md), [handover](https://github.com/begb0037admin/aimm/blob/f7b4a370748dabe065c5738d0ae2268c80c9b92e/docs/handovers/2026-10-23-pluginhub-phase2-architecture.md), [Phase 1 matrix](https://github.com/begb0037admin/aimm/blob/f7b4a370748dabe065c5738d0ae2268c80c9b92e/docs/PLUGINHUB_PARITY_MATRIX.md), [Phase 1 decision](https://github.com/begb0037admin/aimm/blob/f7b4a370748dabe065c5738d0ae2268c80c9b92e/governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_DECISION_20261023.md).

The [checkpoint commit](https://github.com/begb0037admin/aimm/commit/f7b4a370748dabe065c5738d0ae2268c80c9b92e) changes DASHBOARD.html, docs/HANDOVER.md, docs/PLUGINHUB_REPLICA.md, docs/ROADMAP.md, docs/STATUS.md and the dated Phase 2 handover. All are in AIMM. The nine subsequent commits are:

| Commit | Actual file effect from GitHub commit detail |
|---|---|
| [8524ac7](https://github.com/begb0037admin/aimm/commit/8524ac7c175aefc1576d7551681fe16089c4a8b4) | Add Evidence Package only; initial blob f1cd2f9a4093b1293304a76c43218edb67a81a8a |
| [7e5b442](https://github.com/begb0037admin/aimm/commit/7e5b4422ee66d9852f6059bd4cdee0577341e845) | Update Evidence Package metadata only |
| [828d4fc](https://github.com/begb0037admin/aimm/commit/828d4fc94543515b179b5eac2ed01838722fe270) | Update Evidence Package backup wording only |
| [08230ee](https://github.com/begb0037admin/aimm/commit/08230eec147c4d0f1b96808c823419d4e9877403) | Add Review Request only |
| [acd6ceb](https://github.com/begb0037admin/aimm/commit/acd6ceb6dbfd8c48bb3ba1b8a1520baeda1b9e76) | Update Review Request creation reference only |
| [4c2efed](https://github.com/begb0037admin/aimm/commit/4c2efedc77de6a23d9ed1fefc1b97212e6fbabe4) | Update Evidence Package output references only |
| [f8eb54b](https://github.com/begb0037admin/aimm/commit/f8eb54ba3e8137914ba5fe348586c29ce1462224) | Update Review Request package reference only |
| [2399987](https://github.com/begb0037admin/aimm/commit/2399987d8a82bf6a51ca9f7397dd1fa829969aa6) | Update Evidence Package historical-SHA label only |
| [5b56384](https://github.com/begb0037admin/aimm/commit/5b56384c627945531a6b8db467ae4ea08e4effa4) | Update Review Request final package pin only |

The two initial commits add files; the seven follow-ups edit only those new files. The compare from checkpoint to 5b56384 shows no other file path. I also queried the two repositories explicitly excluded by the package, ai-news-channel and personal-finance, for commits on 2026-10-23 through the GitHub API; both queries returned no commits. This checks the named phase window, not all possible off-repository local activity.

## Findings by verification task

| Task | Finding | Evidence and limitation |
|---|---|---|
| VT-01 — Repository scope | **PASS** | The checkpoint and all nine handoff commit diffs are in AIMM. The named excluded repositories had no commits in the phase date window. This is a repository-history finding; unstaged local work cannot be inferred from GitHub. |
| VT-02 — Authentication | **PASS** | The connected API returned the earliest package commit 8524ac7, its add-file diff and subsequent metadata commits 7e5b442, 828d4fc, 4c2efed and 2399987. This proves API access and recorded writes, not personal authorship or cryptographic commit signing. |
| VT-03 — Authorization | **PASS** | The Phase 1 decision authorizes Phase 2 architecture planning, expressly excluding implementation, local actions, merge and deployment. The nine handoff writes only create/update the two governance artifacts; the workflow standard requires this evidence/challenge sequence and leaves governance approval to Kevin. No approval decision is present in these writes. |
| VT-04 — Backup validation | **PASS** | The two handoff files were added from absence and only those files were updated. No existing file was overwritten by the handoff, so a backup is inapplicable. Earlier planning archives are not rollback prerequisites for these governance artifacts. |
| VT-05 — Rollback | **PASS** | Reverting the nine artifact commits in reverse order removes the new artifacts and their metadata edits while leaving checkpoint architecture inputs in parent history. The Git diffs do not change application/service files. This is a Git-content conclusion; no runtime restore was tested or claimed. |
| VT-06 — Assumptions and architecture | **PARTIAL** | The architecture, map and boundary support the design summaries and most risk statements, but the architecture does not itself clearly require separate authorization for purchases/paid commitments and for each later implementation/account/API/service/local-action step. Package assumption that Kevin asked for this specific formal review is reported by the handover rather than directly evidenced by the cited source set. Retention timing differs between boundary and architecture. |
| VT-07 — Estate and GET | **PASS** | The package claims only AIMM updated in this phase. Both newly added files GET-verified at the pinned SHAs above at 5b56384 and at the later branch ref observed during challenge. The later report-only commit e3d5935 changes only this permitted report path. |
| VT-08 — Residual risks | **PARTIAL** | Major technical unknowns are named and bounded, but the authorization and retention sequencing gaps below leave an architecture-only handoff open to misreading. No implementation, security test, vendor request or operational proof follows from these documents. |

### VT-06 and VT-08 detail

**Supported design and user boundaries.** The architecture's “Approved outcome and scope,” “Architecture direction under evaluation,” “Identity, pairing and permissions,” “Operation state and local safety,” and “Build sequence and cutover gates” label this a proposed design. It specifies an AIMM-owned Mac companion without PluginHub dependencies; account/device-scoped auth; the same inventory generation and status summary for site and Hope; local-only secrets and project files; encrypted short-lived exact-path previews; fresh user-verification confirmation; per-item signed receipts; offline/stale states; and a staged replacement of the browser scanner and PluginHub-dependent bridge. The data boundary's table and action requirements agree with those boundaries. The ownership map has one unique P01–P31 row for each of the 31 Phase 1 matrix IDs and future observable gates. It explicitly leaves vendor endpoint validity, effective checker coverage, full Samples UX and canonical count unverified. The architecture also names OIDC selection, entitlement/device limits, P31, vendor routes, Xcode signing, D1 limits and retention as unresolved. Those statements are design requirements, not evidence that the system exists or has passed security testing.

**Assumptions and risks.** Package assumption 1 attributes the formal-review request to Kevin. The handover reports a requested independent Terminal review, and the Phase 1 decision authorizes architecture planning, but the supplied primary source set does not contain Kevin's direct request for this particular governance handoff. Treat that attribution as reported context. Assumption 2 is supported as a scope limit: six review files exist, with blobs 9f6364c57519cb7a3421a4af64c54de4610a5117, 078e219bd1ed24d9f143d2a432d5fd7122c00929, b469a49f270a06894240f927e0a8b3774ed7f04e, 5520eaccddf2e2e5eeb9c2a17e750fd45dd243ac, e39804337209fe86e2c3f49320d1ec786a3060d1 and 32a7eb1bea5f926cf9ef924a917ddd6818124f15. Reviews 1–5 record PARTIAL findings; review 6 reports PASS on two narrow remaining blockers. They are technical review records, not a formal whole-phase governance validation or runtime proof. Assumption 3 is directionally supported by the Phase 1 decision and architecture's design-only status; the missing future authorization wording is the partial finding. Assumption 4 is supported for the handoff: all nine commits are on the named branch.

The package risks are substantially supported as documented risks. Its stale local checkout/DNS statement is a reported local condition, not independently testable from GitHub. The unresolved provider, entitlement, Samples, vendor, signing and operations items are explicit in the architecture. The PluginHub-dependent prototype and running LaunchAgent are reported by the architecture/handover; GitHub cannot establish whether a local service was running or untouched. The code-design risks are real because the proposed API, companion, WebAuthn path and file actions have not been exercised.

**Gate gap.** The architecture introduction says it is not a build or deployment approval and the build/cutover section provides technical prerequisites. Its no-paid-provider/no-resource statement describes what happened during architecture work. It does not explicitly say that a later purchase, paid-provider commitment, account/API creation, credential/signing setup, service change, companion implementation or local file action each require their own authorization before execution. The handover says foundation implementation must be separately planned and authorized, but the Review Request asks whether the architecture document itself preserves those gates. Add one explicit future-authority paragraph there; also preserve separate merge, cutover and deployment approval. This is a documentation/governance gap, not evidence that any such action occurred.

**Retention sequencing.** The data boundary's “Evidence limit” says exact AIMM retention is a Phase 2 design decision. The architecture's “Design assumptions and remaining decisions” defers exact retention windows for receipts, profiles, shares and deleted accounts to API implementation. State whether these windows must be settled before implementation starts or are an implementation task, then align the two documents. The ten-minute preview access lifetime and purge window already have a concrete rule.

## Required next stage

VT-06 and VT-08 are PARTIAL. Under Governance Workflow Standard v1.0, Stage 4 remediation and Stage 5 independent validation are required before Stage 6. The remediation should (1) correct or source the Kevin-request attribution, (2) add explicit future authorization gates in the architecture, and (3) align the retention-decision timing. This report makes no approval decision.
