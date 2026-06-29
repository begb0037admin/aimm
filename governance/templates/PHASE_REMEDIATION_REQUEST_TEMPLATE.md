# PHASE_[NAME]_REMEDIATION_REQUEST_[YYYYMMDD].md
# Phase [Name] — Remediation Request

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Produced by | [Challenging agent identifier] |
| In response to | Challenge Report at commit SHA: [SHA] |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Status | Awaiting Claude Code remediation |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Gap Register

### GAP-01 (from VT-[XX])
**Finding:** [FAIL/PARTIAL]
**Gap description:** [What was missing or incorrect]
**Root cause:** [Why the gap occurred]
**Required remediation (for Claude Code):** [Specific action]
**Files affected:** [repo/path]
**Backup required before remediation write?** [YES/NO]

---

## Kevin Approval Gate

This Remediation Request requires Kevin's explicit approval before any
remediation write proceeds.

**Kevin — please confirm:**
- [ ] Gap register accurately describes the gaps found.
- [ ] Proposed remediations are appropriate.
- [ ] You authorise Claude Code to proceed with the writes listed above.

**Kevin's approval recorded at:** [timestamp / commit SHA]

---

## NEXT STAGE

→ Claude Code implements remediations and produces:
- `PHASE_[NAME]_REMEDIATION_EVIDENCE_[YYYYMMDD].md` → `aimm/governance/evidence/`
- `PHASE_[NAME]_VALIDATION_REQUEST_[YYYYMMDD].md` → `aimm/governance/evidence/`

---

## Claude Code Commit Handoff (Option B only)

| Field | Value |
|-------|-------|
| Artefact to commit | This Remediation Request |
| Exact filename | `PHASE_[NAME]_REMEDIATION_REQUEST_[YYYYMMDD].md` |
| Repository target path | `begb0037admin/aimm/docs/project/generated/` |
| Wording preservation | Commit exactly as supplied — no edits |

[Codex: paste full Markdown content here for Claude Code to commit verbatim.]
