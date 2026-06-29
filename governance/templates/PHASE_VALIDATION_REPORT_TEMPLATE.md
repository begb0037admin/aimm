# PHASE_[NAME]_VALIDATION_REPORT_[YYYYMMDD].md
# Phase [Name] — Validation Report

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Produced by | [Challenging agent identifier] |
| Validates | Remediation Evidence at commit SHA: [SHA] |
| Against | Challenge Report at commit SHA: [SHA] |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Status | Final |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Validation Findings

| Gap ID | Original VT | Original finding | Remediation commit SHA | Content SHA (live GET) | Expected SHA | Evidence type | Revised finding |
|--------|-------------|-----------------|------------------------|------------------------|--------------|---------------|-----------------|
| GAP-01 | VT-[XX] | [FAIL/PARTIAL] | [SHA] | [SHA] | [SHA] | [Directly inspected] | [PASS/PARTIAL/FAIL] |

---

## Overall Validation Verdict

**[ALL CLOSED / GAPS REMAIN]**

---

## NEXT STAGE

**If ALL CLOSED:** → Stage 6. Produce `PHASE_[NAME]_GOVERNANCE_REVIEW_REQUEST_[YYYYMMDD].md` → `aimm/governance/evidence/`.

**If GAPS REMAIN:** → Revised Remediation Request for Kevin's approval before re-submitting.

---

## Claude Code Commit Handoff (Option B only)

| Field | Value |
|-------|-------|
| Artefact to commit | This Validation Report |
| Exact filename | `PHASE_[NAME]_VALIDATION_REPORT_[YYYYMMDD].md` |
| Repository target path | `begb0037admin/aimm/docs/project/generated/` |
| Wording preservation | Commit exactly as supplied — no edits |

[Codex: paste full Markdown content here for Claude Code to commit verbatim.]
