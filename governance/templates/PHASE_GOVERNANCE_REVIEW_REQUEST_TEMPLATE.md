# PHASE_[NAME]_GOVERNANCE_REVIEW_REQUEST_[YYYYMMDD].md
# Phase [Name] — Governance Review Request

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Produced by | Claude Code |
| Addressed to | Kevin Lelitte |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Status | Awaiting Kevin's Governance Decision |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Inputs

| Input | Repository path | Commit SHA |
|-------|----------------|------------|
| Evidence Package | aimm/governance/evidence/PHASE_[NAME]_EVIDENCE_PACKAGE_[YYYYMMDD].md | [SHA] |
| Review Request | aimm/governance/evidence/PHASE_[NAME]_REVIEW_REQUEST_[YYYYMMDD].md | [SHA] |
| Challenge Report | aimm/docs/project/generated/PHASE_[NAME]_CHALLENGE_REPORT_[YYYYMMDD].md | [SHA] |
| Remediation Request (if applicable) | aimm/docs/project/generated/PHASE_[NAME]_REMEDIATION_REQUEST_[YYYYMMDD].md | [SHA / N/A] |
| Remediation Evidence (if applicable) | aimm/governance/evidence/PHASE_[NAME]_REMEDIATION_EVIDENCE_[YYYYMMDD].md | [SHA / N/A] |
| Validation Report (if applicable) | aimm/docs/project/generated/PHASE_[NAME]_VALIDATION_REPORT_[YYYYMMDD].md | [SHA / N/A] |

---

## Plain-English Summary

[One paragraph — what was done, what was independently verified, what the outcome was.]

---

## What Was Done

| Action | Repositories affected | Evidence |
|--------|-----------------------|---------|
| [Action 1] | [repo list] | Commit SHA [SHA] |

---

## What Was Independently Verified

| Verification task | Challenger's finding |
|------------------|---------------------|
| VT-01 — Repository scope completeness | [PASS] |
| VT-02 — Authentication | [PASS] |
| VT-03 — Authorization | [PASS] |
| VT-04 — Backup validation | [PASS] |
| VT-05 — Rollback claims | [PASS] |
| VT-06 — Governance assumptions | [PASS] |
| VT-07 — Estate-wide completion | [PASS] |

---

## What Kevin is Being Asked to Approve

1. That Phase [Name] ([brief description]) is considered complete.
2. That the evidence chain above is accepted as the formal record.
3. That any residual risks listed above are acknowledged.

---

## NEXT STAGE

**→ Kevin commits: `PHASE_[NAME]_GOVERNANCE_DECISION_[YYYYMMDD].md`**

To `aimm/governance/evidence/` with decision APPROVED / REJECTED / DEFERRED.
