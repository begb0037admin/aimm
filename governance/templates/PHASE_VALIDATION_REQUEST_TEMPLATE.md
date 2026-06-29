# PHASE_[NAME]_VALIDATION_REQUEST_[YYYYMMDD].md
# Phase [Name] — Validation Request

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Produced by | Claude Code |
| Addressed to | [Challenger — same agent that produced the Challenge Report] |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Status | Open — awaiting Validation Report |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Inputs

| Input | Repository path | Commit SHA |
|-------|----------------|------------|
| Challenge Report | aimm/docs/project/generated/PHASE_[NAME]_CHALLENGE_REPORT_[YYYYMMDD].md | [SHA] |
| Remediation Evidence | aimm/governance/evidence/PHASE_[NAME]_REMEDIATION_EVIDENCE_[YYYYMMDD].md | [SHA] |
| Remediation Request | aimm/docs/project/generated/PHASE_[NAME]_REMEDIATION_REQUEST_[YYYYMMDD].md | [SHA] |

---

## Validation Tasks

| Gap ID | Original VT | Remediation commit SHA | Re-verify |
|--------|-------------|------------------------|----------|
| GAP-01 | VT-[XX] | [SHA] | [Confirm content SHA and existence via GET] |

---

## NEXT STAGE

→ Challenger produces: `PHASE_[NAME]_VALIDATION_REPORT_[YYYYMMDD].md`
→ Commit to `begb0037admin/aimm/docs/project/generated/`

All FAIL/PARTIAL items must reach PASS before Stage 6.

**Validation Report commit SHA:** [populated after commit]
