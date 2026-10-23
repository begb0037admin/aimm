# PluginHub replica — Phase 1 remediation evidence

| Field | Value |
|---|---|
| Phase | PluginHub replica, Phase 1: source research |
| Date | 2026-10-23 |
| Produced by | Codex executing session |
| Implements | Independent Remediation Request committed at `6b8b5a8cdef8216844cdb45c0c5d83e8f6582507` (GitHub blob `22977efbd65c8d00cdaa587da34277a054046a64`) |
| Kevin approval | Kevin's standing instruction to continue Phase 1 to completion and earlier approval to proceed with the read-only research/Claude review; no product write or deployment in this stage |
| Governed by | `governance/GOVERNANCE_WORKFLOW_STANDARD.md` v1.0 |
| Status | Remediation complete — awaiting independent validation |
| Remediation Evidence commit | Determined after this document is committed |

## Outputs and backup order

| Repository | Path | Action | Commit SHA | GitHub blob SHA |
|---|---|---|---|---|
| aimm | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_CHALLENGE_REPORT_20261023.md` | Challenger output, committed verbatim | `6b8b5a8cdef8216844cdb45c0c5d83e8f6582507` | `9e0c8483b7a2ba51733448d0a6b153868865e02b` |
| aimm | `docs/project/generated/PHASE_PLUGINHUB_REPLICA_PHASE1_REMEDIATION_REQUEST_20261023.md` | Challenger output, committed verbatim | `6b8b5a8cdef8216844cdb45c0c5d83e8f6582507` | `22977efbd65c8d00cdaa587da34277a054046a64` |
| aimm | `Archive/2026-10-23-aimm-pluginhub-phase1-remediation/EVIDENCE_PACKAGE.pre-remediation.md` | Exact pre-edit package copy, committed **before** edit | `b6b6bf4c901b38e8960191167b1390ba9bc1e3c9` | `fa153a5dba0a065675a29ba916fc48058eb1a0e9` |
| aimm | `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_EVIDENCE_PACKAGE_20261023.md` | Corrected package | `b88b88e8f4717fadc74fe698e4b2bbb0ac0f67c5` | `a939f5b48f3bcab769bbc1c63b3cb2b64a2006bc` |

GitHub Commit API GET `commits/b6b6bf4` returned only the Archive backup path; GitHub Contents API GET returned blob `fa153a5...`, matching the old evidence package. GitHub Commit API GET `commits/b88b88e` returned only the evidence package path; Contents API GET returned blob `a939f5b...`. The backup commit is its parent and precedes the edit.

## Gap closure record

| Gap | Original finding | Closure | GitHub GET evidence | Status |
|---|---|---|---|---|
| R-01 | VT-01 PARTIAL: incomplete work-product chain and sibling scope evidence | Revised package lists `d9cd831`, `fbd76e9`, `d752d0b`, `c2cd0d1`, `f87dedf`, `9c0df06`, `24f9661`; names trace-review handover blob `7504011...`; records sibling repo `pushed_at` and default-head SHAs with non-default-branch limit. | Commit API GETs for `fbd76e9` and `d752d0b`; Repo and main-ref GETs for `ai-news-channel` and `personal-finance`; corrected package blob `a939f5b...` | Closed for validation |
| R-02 | VT-02 PARTIAL: credential mechanism overclaim | Revised package says commits are attributed to `begb0037admin` and unsigned; GitHub API cannot identify the pushing credential or prove client-set author identity. No history rewrite. | Corrected package blob `a939f5b...`; prior challenge's Commit API evidence | Closed for validation |
| R-03 | VT-04 PARTIAL: backup timing/inventory | Revised package lists all four Archive sets (18 files), all blob SHAs, parent-content equivalence, and same-commit timing. Explicitly marks the exit vendor matrix `cb1230f...` as post-edit and `baseline-d752d0b` `160c205...` as the usable pre-edit copy. The pre-Phase-1 `c717fc6` commit remains the clean rollback point. | Corrected package blob `a939f5b...`; challenger already GET verified all Archive blobs; new separate backup blob `fa153a5...` | Closed for validation; historical same-commit timing disclosed, not retroactively changed |
| R-04 | VT-06 PARTIAL: review status/risk omissions and unverified local counts | Revised package states final technical review **PARTIAL**, lists its unverified items and five resolved residuals; adds `.exe/.msi` Mac-slot weakness and cached-report caveat; labels source SHA/counts as executor-reported and includes exact Terminal command/output. | Corrected package blob `a939f5b...`; final technical review blob `152584b...` | Closed for validation; local audit not independently re-run by governance challenger |

No product file, PluginHub runtime, Logic project, bridge, merge or deployment was changed during remediation. The pre-existing dirty `index.html`, `bridge/` and `pluginhub-ui-review.patch` remain outside these commits.

## Next stage

Commit and push a Validation Request referring to this Remediation Evidence commit SHA. The independent challenger rechecks only VT-01, VT-02, VT-04 and VT-06 with GitHub GETs, then returns a Validation Report in `docs/project/generated/`. Stage 6 follows only when every finding reaches PASS.
