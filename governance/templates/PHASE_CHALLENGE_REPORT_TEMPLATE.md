# PHASE_[NAME]_CHALLENGE_REPORT_[YYYYMMDD].md
# Phase [Name] — Challenge Report

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Produced by | [Challenging agent identifier / session ID] |
| Reviewing | Evidence Package at commit SHA: [SHA] |
| Review Request at | aimm/governance/evidence/PHASE_[NAME]_REVIEW_REQUEST_[YYYYMMDD].md |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Status | [Draft / Final] |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Challenger Operating Mode Declaration

**Operating mode:** [Option A — Controlled GitHub Artefact Writer / Option B — Read-Only Reviewer With Claude Code Commit Handoff]
**Write access verified:** [YES / NO — switching to Option B]
**Artefact destination:** `begb0037admin/aimm/docs/project/generated/`
**Write boundary confirmed:** Will write only to `docs/project/generated/`.

---

## Inputs

| Input | Repository path | Commit SHA used |
|-------|----------------|------------------|
| Evidence Package | aimm/governance/evidence/PHASE_[NAME]_EVIDENCE_PACKAGE_[YYYYMMDD].md | [SHA] |
| Review Request | aimm/governance/evidence/PHASE_[NAME]_REVIEW_REQUEST_[YYYYMMDD].md | [SHA] |
| Governance Workflow Standard | aimm/governance/GOVERNANCE_WORKFLOW_STANDARD.md | [SHA] |

---

## Findings

### VT-01 — Repository Scope Completeness
**Finding:** [PASS / PARTIAL / FAIL]
**Evidence type:** [Directly inspected / Reported by executing agent]
**Evidence:**
```
[Paste API response]
```
**Gap (if PARTIAL or FAIL):** [Description]

### VT-02 — Authentication Verification
**Finding:** [PASS / PARTIAL / FAIL]
**Evidence type:** [Directly inspected / Reported]
**Evidence:**
```
[Paste API response]
```

### VT-03 — Authorization Verification
**Finding:** [PASS / PARTIAL / FAIL]
**Evidence:**
```
[List of files written vs. approval gates]
```

### VT-04 — Backup Validation
**Finding:** [PASS / PARTIAL / FAIL]

| Repository | Backup file | Content SHA (claimed) | Content SHA (actual GET) | Committed before write? | Finding |
|------------|-------------|----------------------|--------------------------|-------------------------|---------|
| [repo] | [path] | [claimed] | [actual] | [YES/NO] | [PASS/FAIL] |

### VT-05 — Rollback Claims
**Finding:** [PASS / PARTIAL / FAIL]
**Evidence:**
```
[Backup SHA retrievable confirmation]
```

### VT-06 — Governance Assumptions
**Finding:** [PASS / PARTIAL / FAIL]

| # | Assumption | Assessment | Evidence |
|---|-----------|------------|----------|
| 1 | [text] | [VALID / UNVERIFIABLE / FALSE] | [evidence] |

### VT-07 — Estate-Wide Completion
**Finding:** [PASS / PARTIAL / FAIL]

| Repository | File path | Content SHA (claimed) | Content SHA (live GET) | Match |
|------------|-----------|-----------------------|------------------------|-------|
| [repo] | [path] | [claimed] | [actual] | [YES/NO] |

---

## Overall Verdict

**[ALL PASS / GAPS FOUND]**

| Finding ID | Result | Requires remediation |
|------------|--------|----------------------|
| VT-01 | [PASS/PARTIAL/FAIL] | [YES/NO] |
| VT-02 | [PASS/PARTIAL/FAIL] | [YES/NO] |
| VT-03 | [PASS/PARTIAL/FAIL] | [YES/NO] |
| VT-04 | [PASS/PARTIAL/FAIL] | [YES/NO] |
| VT-05 | [PASS/PARTIAL/FAIL] | [YES/NO] |
| VT-06 | [PASS/PARTIAL/FAIL] | [YES/NO] |
| VT-07 | [PASS/PARTIAL/FAIL] | [YES/NO] |

---

## Claude Code Commit Handoff (Option B only)

| Field | Value |
|-------|-------|
| Artefacts to commit | This Challenge Report; Remediation Request (if GAPS FOUND) |
| Exact filenames | `PHASE_[NAME]_CHALLENGE_REPORT_[YYYYMMDD].md`; `PHASE_[NAME]_REMEDIATION_REQUEST_[YYYYMMDD].md` |
| Repository target path | `begb0037admin/aimm/docs/project/generated/` |
| Wording preservation | Commit exactly as supplied — no edits |

[Codex: paste full Markdown content here for Claude Code to commit verbatim.]
