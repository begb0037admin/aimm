# PluginHub replica — Phase 1 validation request

| Field | Value |
|---|---|
| Phase | PluginHub replica, Phase 1: source research |
| Date | 2026-10-23 |
| Produced by | Codex executing session |
| Addressed to | Independent Claude CLI governance challenger |
| Governed by | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.0 |
| Status | Open — awaiting Validation Report |
| Challenge Report | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_CHALLENGE_REPORT_20261023.md`, commit `6b8b5a8cdef8216844cdb45c0c5d83e8f6582507`, blob `9e0c8483b7a2ba51733448d0a6b153868865e02b` |
| Remediation Request | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_REMEDIATION_REQUEST_20261023.md`, same commit, blob `22977efbd65c8d00cdaa587da34277a054046a64` |
| Remediation Evidence | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_REMEDIATION_EVIDENCE_20261023.md`, commit `65e0e92ca32307aceef41695867913eb239bff5c`, blob `3a80474de48d8c488d401a8468f7053af4a362c2` |
| Corrected Evidence Package | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_EVIDENCE_PACKAGE_20261023.md`, commit `b88b88e8f4717fadc74fe698e4b2bbb0ac0f67c5`, blob `a939f5b48f3bcab769bbc1c63b3cb2b64a2006bc` |
| Pre-edit backup | `Archive/2026-10-23-aimm-pluginhub-phase1-remediation/EVIDENCE_PACKAGE.pre-remediation.md`, separately committed at `b6b6bf4c901b38e8960191167b1390ba9bc1e3c9`, blob `fa153a5dba0a065675a29ba916fc48058eb1a0e9` |

## Validation tasks

| Gap | Original VT | Remediation | Re-verify with independent GitHub GETs |
|---|---|---|---|
| R-01 | VT-01 | Complete commit/trace-review inventory and sibling-repo scope evidence | Check `fbd76e9` and `d752d0b` Commit API details, `trace-review` blob, both sibling Repo/main-ref responses, and revised package. |
| R-02 | VT-02 | Attribution-only authentication wording | Check revised package says unsigned GitHub attribution and does not claim which credential pushed. |
| R-03 | VT-04 | All 18 Archive blobs, parent-content and same-commit timing disclosed; non-pre-edit vendor copy flagged | Check Archive Contents API; verify `c717fc6` rollback and the separately committed `b6b6bf4` backup precedes `b88b88e`. Do not expect a retroactive change to earlier backup timing. |
| R-04 | VT-06 | Final technical PARTIAL/limits, cached-report and installer-guard risks, executor-labeled transcript | Compare corrected package to the final technical review and vendor matrix; distinguish source-backed claims from local executor-reported observations. |

The challenger should mark each R item PASS/PARTIAL/FAIL and explain any remaining gap. The work remains a Phase 1 research package. Do not use PluginHub, edit a Logic project, download an installer, modify product code, merge, or deploy.

Return a complete `PHASE_PLUGINHUB_REPLICA_PHASE1_VALIDATION_REPORT_20261023.md` as a read-only Option B handoff for exact commit to `docs/project/generated/`. All items must PASS before Stage 6. The commit SHA for this request is determined after pushing it.
