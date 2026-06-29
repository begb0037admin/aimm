# GOVERNANCE_WORKFLOW_STANDARD.md
# Governance Workflow Standard — Personal Domain

**Version:** 1.0
**Status:** Ratified
**Ratified by:** Kevin Lelitte
**Date:** 2026-06-29
**Owner:** Kevin Lelitte (personal domain)
**Governed by:** CONSTITUTION.md
**Scope:** All named governance operations affecting personal repositories under begb0037admin

---

## 1. Purpose

This standard defines the mandatory workflow, artefacts, agent responsibilities,
and handoff requirements for all governance operations affecting personal
repositories. It exists to ensure that governance actions are independently
verified, recoverable, and approved by Kevin before closure.

This standard does not cover routine single-file writes (index.html edits,
script updates, content additions). It applies to any operation that:
- modifies shared governance files (CONSTITUTION.md, AGENT_MODEL.md, CLAUDE.md)
  across multiple repositories;
- adds or removes repositories from governance scope;
- changes hosting, authentication, or domain architecture; or
- is designated as a named Phase by Kevin.

---

## 2. Mandatory Artefact Set

Every governed operation produces the following artefacts in sequence.
No stage may begin until all artefacts required by the preceding stage
exist and are verified.

| Stage | Artefact | Template | Produced by |
|-------|----------|----------|-------------|
| 1 — Execute | Work product (code, files, commits) | — | Claude Code |
| 2 — Evidence | Phase Evidence Package | PHASE_EVIDENCE_PACKAGE_TEMPLATE.md | Claude Code |
| 3 — Review | Phase Review Request | PHASE_REVIEW_REQUEST_TEMPLATE.md | Claude Code |
| 3 — Challenge | Phase Challenge Report | PHASE_CHALLENGE_REPORT_TEMPLATE.md | Challenger (committed to `docs/project/generated/`) |
| 3 — Remediation Req | Phase Remediation Request | PHASE_REMEDIATION_REQUEST_TEMPLATE.md | Challenger (committed to `docs/project/generated/`; conditional) |
| 4 — Remediation | Phase Remediation Evidence | PHASE_REMEDIATION_EVIDENCE_TEMPLATE.md | Claude Code |
| 5 — Validation | Phase Validation Request | PHASE_VALIDATION_REQUEST_TEMPLATE.md | Claude Code |
| 5 — Validation | Phase Validation Report | PHASE_VALIDATION_REPORT_TEMPLATE.md | Challenger (committed to `docs/project/generated/`) |
| 6 — Governance | Phase Governance Review Request | PHASE_GOVERNANCE_REVIEW_REQUEST_TEMPLATE.md | Claude Code |
| 6 — Governance | Phase Governance Decision | PHASE_GOVERNANCE_DECISION_TEMPLATE.md | Kevin |

Stages 4 and 5 are conditional: required if the Challenge Report finds any
FAIL or PARTIAL findings; skipped if all findings are PASS.

All challenger-produced artefacts must be committed to
`begb0037admin/aimm/docs/project/generated/`.

---

## 3. Stage Definitions

### Stage 1 — Execute

Claude Code performs the approved work. All writes follow the backup-first
protocol defined in AGENT_MODEL.md Section 3. Commit SHAs, content SHAs,
and backup locations are recorded as work proceeds — not retrospectively.

**Exit criterion:** All intended writes committed to the target branch.

### Stage 2 — Evidence

Claude Code produces a Phase Evidence Package using the template. The package
must contain primary evidence (commit SHAs, content SHAs, API response
excerpts) for every claim. Assertions without evidence are inadmissible.

The package is committed to `governance/evidence/` in aimm with the filename
pattern `PHASE_[NAME]_EVIDENCE_PACKAGE_YYYYMMDD.md`.

**Exit criterion:** Evidence Package committed and GET-verified.

### Stage 3 — Review and Challenge

Claude Code produces a Phase Review Request addressed to an independent
challenging agent (Codex or a fresh Claude Code session). The challenging
agent independently verifies each claim in the Evidence Package.

The Challenge Report and (if gaps found) the Remediation Request are
committed to `docs/project/generated/` by the challenger. If the challenger
cannot write to GitHub, it outputs the full Markdown in chat and Claude Code
commits to `docs/project/generated/`.

**Exit criterion:** Challenge Report committed. ALL PASS → Stage 6.
GAPS FOUND → Stage 4 mandatory.

### Stage 4 — Remediation (conditional)

Claude Code implements each gap closure under the backup-first, GET-verify
protocol. On completion, produces a Remediation Evidence document committed
to `governance/evidence/`.

**Exit criterion:** All FAIL/PARTIAL findings addressed. Remediation Evidence committed.

### Stage 5 — Validation (conditional)

Claude Code submits a Validation Request to the challenging agent. The
challenger independently re-verifies each previously failed or partial
finding. All items must reach PASS before Stage 6.

**Exit criterion:** Validation Report committed with all findings at PASS.

### Stage 6 — Governance Decision

Claude Code produces a Governance Review Request summarising the full evidence
chain for Kevin. Kevin reviews and issues a Governance Decision
(APPROVED / REJECTED / DEFERRED). No governed operation is considered complete
until a Governance Decision at APPROVED has been committed.

**Exit criterion:** Governance Decision committed by Kevin. Operation closed.

---

## 4. Agent Responsibilities

### Executing Agent (Claude Code)

- Performs Stage 1 work under AGENT_MODEL.md Section 3.
- Produces all evidence-side artefacts (Stages 2, 4 execute, 5 request, 6 request).
- Does not self-challenge.
- Commits all executing-agent artefacts to `aimm/governance/evidence/`.
- When challenger outputs artefacts in chat (fallback mode), Claude Code
  commits them to `docs/project/generated/` exactly as supplied — no edits.
- Notifies Kevin at Stage 3 handoff and again at Stage 6.

### Challenging Agent (Codex or independent Claude Code session)

- Receives the Review Request and Evidence Package as its sole inputs.
- Independently queries GitHub API to verify every claim.
- Records each finding as PASS, PARTIAL, or FAIL with primary evidence.
- **Write boundary:** May write only to `aimm/docs/project/generated/`.
  Must not modify any other file.
- **Operating mode:** Verifies GitHub write access before beginning.
  If write access is unavailable, outputs full Markdown in chat for
  Claude Code to commit.

### Kevin (Approval Authority)

- Reviews and approves the Governance Review Request before Stage 6 artefact is committed.
- Issues the Governance Decision.
- May DEFER if evidence chain is incomplete.
- The Governance Decision is the only artefact Kevin commits directly.

---

## 5. Handoff Requirements

### Executing Agent → Challenging Agent (Stage 3)

The Review Request must include:
1. Repository path of the Evidence Package (owner/repo/path at commit SHA).
2. Explicit instruction that the Evidence Package is an unverified claim set.
3. Complete list of verification tasks with required evidence type.
4. Statement of what the challenger must NOT accept as evidence.
5. Commit SHA of the Review Request itself.
6. Approved challenger write path (`docs/project/generated/`) and fallback instruction.

### Executing Agent → Kevin (Stage 6)

The Governance Review Request must include:
1. One-paragraph plain-English summary of what was done and verified.
2. Full artefact chain with repository paths and commit SHAs.
3. Any residual risks or open items.
4. Clear statement of what Kevin is being asked to approve.

---

## 6. Naming Conventions

Executing-agent artefacts in `aimm/governance/evidence/`:

| Artefact | Filename pattern |
|----------|------------------|
| Evidence Package | `PHASE_[NAME]_EVIDENCE_PACKAGE_YYYYMMDD.md` |
| Review Request | `PHASE_[NAME]_REVIEW_REQUEST_YYYYMMDD.md` |
| Remediation Evidence | `PHASE_[NAME]_REMEDIATION_EVIDENCE_YYYYMMDD.md` |
| Validation Request | `PHASE_[NAME]_VALIDATION_REQUEST_YYYYMMDD.md` |
| Governance Review Request | `PHASE_[NAME]_GOVERNANCE_REVIEW_REQUEST_YYYYMMDD.md` |
| Governance Decision | `PHASE_[NAME]_GOVERNANCE_DECISION_YYYYMMDD.md` |

Challenger artefacts in `aimm/docs/project/generated/`:

| Artefact | Filename pattern |
|----------|------------------|
| Challenge Report | `PHASE_[NAME]_CHALLENGE_REPORT_YYYYMMDD.md` |
| Remediation Request | `PHASE_[NAME]_REMEDIATION_REQUEST_YYYYMMDD.md` |
| Validation Report | `PHASE_[NAME]_VALIDATION_REPORT_YYYYMMDD.md` |

`[NAME]` is the uppercase phase identifier (e.g., `AIMM_SPLIT_MIGRATE`).

---

## 7. Relationship to Other Governance Documents

| Document | Relationship |
|----------|--------------|
| CONSTITUTION.md | Supreme authority. This standard operates within it. |
| AGENT_MODEL.md | Defines execution mechanics, backup rules, and approval gates. |
| CLAUDE.md (per repo) | Defines repo-specific rules that Stage 1 must follow. |
| HANDOVER.md | Updated at session close to reference all committed governance artefacts. |

---

## 8. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-29 | Initial ratification for AIMM personal domain. Mirrors command-centre GOVERNANCE_WORKFLOW_STANDARD.md v1.1, adapted for AIMM as the governance hub (`aimm/governance/evidence/` and `aimm/docs/project/generated/`). |

---

## 9. Challenger Write Constraint

The challenging agent is an independent technical reviewer.

The challenger may inspect:
- Repository contents, commit history, governance files, backup artefacts, SHAs, evidence packages.

The challenger may write only its approved review artefacts, and only to:
- `begb0037admin/aimm/docs/project/generated/`

Approved challenger artefacts:
- `PHASE_X_CHALLENGE_REPORT.md`
- `PHASE_X_REMEDIATION_REQUEST.md`
- `PHASE_X_VALIDATION_REPORT.md`

The challenger must not write, modify, or commit:
- governance standards, templates, implementation files, production files,
  application code, backups, remediation evidence, HANDOVER.md.

If write access is unavailable, the challenger outputs full Markdown
artefact contents for Claude Code to commit.
