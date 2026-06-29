# PHASE_[NAME]_EVIDENCE_PACKAGE_[YYYYMMDD].md
# Phase [Name] — Evidence Package

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Produced by | [Agent identifier / session ID] |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Status | Draft — awaiting challenge |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Inputs

| Input | Source | SHA / reference |
|-------|--------|------------------|
| [Input 1] | [repo/path] | [SHA] |
| [Input 2] | [repo/path] | [SHA] |

---

## Outputs

| Repository | File path | Action | Commit SHA | Content SHA |
|------------|-----------|--------|------------|-------------|
| [owner/repo] | [path] | [created / updated / deleted] | [SHA] | [SHA] |

---

## Evidence References

### [Repository] — [File path]

```
[Paste API response excerpt: sha, commit.sha, commit.message, commit.author.date]
```

---

## Backup Validation

| Repository | Backup file | Backup commit SHA | Backup content SHA | GET verified |
|------------|-------------|-------------------|--------------------|---------------|
| [owner/repo] | [Archive/file_backup_YYYYMMDD.ext] | [SHA] | [SHA] | [YES / NO] |

---

## Rollback Claims

| Repository | Rollback method | Backup SHA to restore | Restoration commit would overwrite |
|------------|-----------------|----------------------|-----------------------------------|
| [owner/repo] | Restore from Archive/[backup file] | [content SHA] | [current SHA after write] |

---

## Repository Scope

| Repository | In scope this phase | Action taken | Reason if excluded |
|------------|---------------------|--------------|--------------------|
| begb0037admin/aimm | [YES/NO] | [action] | [—] |
| begb0037admin/ai-news-channel | [YES/NO] | [action] | [—] |
| begb0037admin/personal-finance | [YES/NO] | [action] | [—] |

---

## Authentication and Authorization

| Item | Evidence |
|------|----------|
| Authentication mechanism | [e.g., MCP GitHub server / gh CLI keyring] |
| Auth verified by | [e.g., successful GET of API endpoint at HH:MM] |
| Write authorization evidence | [first successful PUT commit SHA and timestamp] |

---

## Assumptions

1. [Assumption 1]
2. [Assumption 2]

---

## Risks

| Risk | Severity | Mitigation or deferral |
|------|----------|------------------------|
| [Risk 1] | [HIGH / MEDIUM / LOW] | [Mitigation] |

---

## NEXT STAGE

**→ Stage 3: Challenge**

The executing agent must now produce `PHASE_[NAME]_REVIEW_REQUEST_[YYYYMMDD].md`
and commit it to `aimm/governance/evidence/`. The Review Request must reference
this Evidence Package by its commit SHA.

**Review Request commit SHA:** [populated after commit]
