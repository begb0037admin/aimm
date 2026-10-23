# PluginHub replica — Phase 1 governance review request

| Field | Value |
|---|---|
| Phase | PluginHub replica, Phase 1: source research |
| Date | 2026-10-23 |
| Produced by | Codex executing session |
| Addressed to | Kevin Lelitte |
| Governed by | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.0 |
| Status | Awaiting Kevin's Governance Decision |
| This request commit | Determined after push; verify by GitHub API |

## Plain-English summary

Phase One's research package is complete on the isolated `codex/pluginhub-replication` branch. It maps PluginHub's installed 2.0.12 functions into 31 AIMM parity items, records update and file-management workflows, separates the website/account/companion data boundaries, and reconciles the cited inventory counts by unit. The work did not implement the companion, use PluginHub as a runtime dependency, change Logic, or deploy AIMM. Independent technical review found and drove corrections. The formal GitHub governance challenge found four documentation gaps; remediation was independently validated **ALL PASS**. The remaining vendor endpoints, effective checker behavior and account/service contracts are explicitly Phase Two design and validation work.

## Evidence chain

| Artefact | Repository path | Committed at |
|---|---|---|
| Final technical work product | `docs/PLUGINHUB_REPLICA.md` and linked parity/source records | `24f96614ee041ce84444bb6a7ef06bd4c6d76e58` |
| Corrected Evidence Package | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_EVIDENCE_PACKAGE_20261023.md` | `b88b88e8f4717fadc74fe698e4b2bbb0ac0f67c5`, blob `a939f5b48f3bcab769bbc1c63b3cb2b64a2006bc` |
| Review Request | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_REVIEW_REQUEST_20261023.md` | `d6c780cb51da1200e2e96fab8a6889fc97ef2727` |
| Challenge Report — gaps found | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_CHALLENGE_REPORT_20261023.md` | `6b8b5a8cdef8216844cdb45c0c5d83e8f6582507` |
| Remediation Request | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_REMEDIATION_REQUEST_20261023.md` | `6b8b5a8cdef8216844cdb45c0c5d83e8f6582507` |
| Separately committed pre-remediation backup | `Archive/2026-10-23-aimm-pluginhub-phase1-remediation/EVIDENCE_PACKAGE.pre-remediation.md` | `b6b6bf4c901b38e8960191167b1390ba9bc1e3c9` |
| Remediation Evidence | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_REMEDIATION_EVIDENCE_20261023.md` | `65e0e92ca32307aceef41695867913eb239bff5c` |
| Validation Request | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_VALIDATION_REQUEST_20261023.md` | `1b7d25d6eb4a7edb365b1def2cd9a74fe96be7f1` |
| Validation Report — **ALL PASS** | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_VALIDATION_REPORT_20261023.md` | `a5cf2545f7ae4c564234fa9d0e0ea79a24548ce8`, blob `cd1277740b4f8b14c6200b3b25b316450289f97b` |

## Independent findings

| Verification task | Final finding |
|---|---|
| VT-01 Repository scope completeness | PASS after remediation and validation |
| VT-02 Authentication wording and evidence limit | PASS after remediation and validation |
| VT-03 Authorization/scope | PASS in challenge |
| VT-04 Backup validation and timing disclosure | PASS after remediation and validation |
| VT-05 Rollback claims | PASS in challenge |
| VT-06 Assumptions and limits | PASS after remediation and validation |
| VT-07 Current work-product file SHAs | PASS in challenge |

The validation accepted disclosure of executor-reported local audit/snapshot figures. The independent CLI could inspect source and GitHub records, but did not itself execute the installed checker audit or contact vendor endpoints. Earlier Phase One Archive copies were committed alongside their edits; their prior content is recoverable from immutable parent commits, and this timing is recorded. The remediation backup was separately committed before its evidence edit.

## Kevin's decision

Please decide whether to **approve Phase One as a completed research phase and accept this evidence chain**. Approval authorises proceeding to Phase Two architecture planning; it does **not** approve a PluginHub-coupled bridge, installer download, local file management action, Logic edit, merge, or live deployment. If approved, the Governance Decision document will be committed and the handover/status/roadmap/dashboard will record the closure. If deferred or rejected, the decision record will state what must change.

Phase Two will design the AIMM-owned Mac companion, paired account/API contract and site/Hope integration for every parity row. It must validate vendor routes and current downloads, define safe local action receipts, and plan the replacement of the existing PluginHub-dependent prototype/LaunchAgent without interrupting the current site.
