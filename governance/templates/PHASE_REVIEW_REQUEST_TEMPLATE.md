# PHASE_[NAME]_REVIEW_REQUEST_[YYYYMMDD].md
# Phase [Name] — Review Request

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Produced by | [Executing agent identifier / session ID] |
| Addressed to | [Challenging agent — e.g., Codex / independent Claude Code session] |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Status | Open — awaiting Challenge Report |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Challenger Operating Mode

Before beginning review, the challenger must verify and declare its operating mode:

**Option A — Controlled GitHub Artefact Writer**
Challenger has write access to `begb0037admin/aimm/docs/project/generated/`
and will commit approved review artefacts directly.

**Option B — Read-Only Reviewer With Claude Code Commit Handoff**
Challenger does not have write access. Will output full Markdown artefact
contents in chat for Claude Code to commit to
`begb0037admin/aimm/docs/project/generated/`.

**Challenger write boundary:** May write only to `docs/project/generated/`.
Must not modify governance standards, templates, implementation files,
production files, application code, backups, remediation evidence, or HANDOVER.md.

---

## Inputs

| Input | Repository path | Commit SHA |
|-------|----------------|------------|
| Evidence Package | aimm/governance/evidence/PHASE_[NAME]_EVIDENCE_PACKAGE_[YYYYMMDD].md | [SHA] |
| Governance Workflow Standard | aimm/governance/GOVERNANCE_WORKFLOW_STANDARD.md | [SHA] |

---

## Outputs

| Output | Filename | Destination |
|--------|----------|-------------|
| Challenge Report | `PHASE_[NAME]_CHALLENGE_REPORT_[YYYYMMDD].md` | `begb0037admin/aimm/docs/project/generated/` |
| Remediation Request (if gaps found) | `PHASE_[NAME]_REMEDIATION_REQUEST_[YYYYMMDD].md` | `begb0037admin/aimm/docs/project/generated/` |

---

## Critical Instructions for the Challenging Agent

1. **You are an independent challenger.** You have no memory of the execution
   session and no prior relationship with the executing agent's claims.
2. **The Evidence Package is an unverified claim set.** Every claim must be
   independently confirmed before you mark it PASS.
3. **Primary evidence only.** A claim is verified only when you have retrieved
   the supporting data directly from the GitHub API.
4. **No silent passes.** Every verification task must receive a finding.
5. **Distinguish directly inspected from reported evidence.** PASS requires
   direct inspection.
6. **Write boundary.** See Operating Mode above.

---

## Verification Tasks

### VT-01 — Repository Scope Completeness
Verify the Evidence Package accounts for every repository in personal governance scope.
Required evidence: GitHub API response confirming each claimed commit SHA exists.

### VT-02 — Authentication Verification
Verify the authentication mechanism described was actually used.
Required evidence: GitHub API commit detail for the earliest write commit.

### VT-03 — Authorization Verification
Verify writes were within authorized scope — no approval gate was bypassed.
Required evidence: list of files written cross-referenced against approval gates.

### VT-04 — Backup Validation
For every backup claimed: retrieve via GitHub Contents API, confirm content SHA,
confirm backup committed before the write.
Required evidence: GitHub Contents API response for each backup file.

### VT-05 — Rollback Claims
Verify rollback path is independently executable.
Required evidence: GitHub Contents API response for each backup file.

### VT-06 — Governance Assumptions
Review every assumption in the Evidence Package; assess validity.
Required evidence: API response, documentation reference, or explicit statement.

### VT-07 — Estate-Wide Completion
Verify every repository intended to be updated was updated.
Required evidence: live GET for each updated file returning current content SHA.

---

## NEXT STAGE

**→ Challenging agent produces: `PHASE_[NAME]_CHALLENGE_REPORT_[YYYYMMDD].md`**

If all findings PASS → executing agent proceeds to Stage 6.
If any finding FAIL or PARTIAL → Stage 4 (Remediation) is mandatory.

**Challenge Report commit SHA:** [populated after commit]
