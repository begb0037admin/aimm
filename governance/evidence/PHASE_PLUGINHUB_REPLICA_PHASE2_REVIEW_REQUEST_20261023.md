# PHASE_PLUGINHUB_REPLICA_PHASE2_REVIEW_REQUEST_20261023.md
# PluginHub replica — Phase 2 independent review request

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | PluginHub replica — Phase 2 architecture |
| Date | 2026-10-23 |
| Produced by | Codex |
| Addressed to | Independent challenging agent |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v1.0 |
| Status | Open — awaiting Challenge Report |
| Commit SHA (initial creation) | Pending API result |

---

## Challenger Operating Mode

Before beginning, verify and declare the operating mode.

**Requested mode: Option A — Controlled GitHub Artefact Writer**, if the connected GitHub API permits writing to the approved path. Write only review artefacts to `begb0037admin/aimm/docs/project/generated/` on branch `codex/pluginhub-replication`.

If that path/branch is not writable, use **Option B — Read-Only Reviewer With Claude Code Commit Handoff** and return the complete Markdown report in chat.

**Write boundary:** only approved challenge/remediation/validation artefacts in `docs/project/generated/`. Do not change standards, templates, implementation, production, backups, evidence package, review request or HANDOVER.md.

---

## Inputs

| Input | Repository path | Commit / content SHA |
|-------|----------------|----------------------|
| Evidence Package | `aimm/governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_EVIDENCE_PACKAGE_20261023.md` | Latest package commit `828d4fc94543515b179b5eac2ed01838722fe270`; GET content/blob SHA `fd22a71c634107cf14df8987c08131c3569a377b` |
| Governance Workflow Standard | `aimm/governance/GOVERNANCE_WORKFLOW_STANDARD.md` | Content SHA `ce78b5bd78a5c03c27191304c89efb8451d6e62b` at checkpoint `f7b4a370748dabe065c5738d0ae2268c80c9b92e` |
| Architecture candidate | `aimm/docs/PLUGINHUB_PHASE2_ARCHITECTURE.md` | Content SHA `c69ecc6c453561c563466efed63cd39a2e1395f2` |
| Ownership map | `aimm/docs/PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md` | Content SHA `b3d98e3d1afcbe2ff8d89474ab28c0f3cb47722f` |
| Data boundary | `aimm/docs/PLUGINHUB_DATA_BOUNDARY.md` | Content SHA `25ca4c65b0c7b5b4c909c07f094701b0f6876cbf` |
| Phase 2 handover | `aimm/docs/handovers/2026-10-23-pluginhub-phase2-architecture.md` | Content SHA `7a4fa44e1219a8a728c31b606784911648c1db69` |
| Branch checkpoint | `codex/pluginhub-replication` | `f7b4a370748dabe065c5738d0ae2268c80c9b92e` |

All referenced files are in `begb0037admin/aimm`, branch `codex/pluginhub-replication`. The Evidence Package is an **unverified claim set**. Retrieve primary evidence directly through the GitHub API; do not accept this request, the package, prior CLI reviews, or executing-agent statements as proof.

---

## Outputs

| Output | Filename | Destination |
|--------|----------|-------------|
| Challenge Report | `PHASE_PLUGINHUB_REPLICA_PHASE2_CHALLENGE_REPORT_20261023.md` | `begb0037admin/aimm/docs/project/generated/` |
| Remediation Request (if findings are FAIL/PARTIAL) | `PHASE_PLUGINHUB_REPLICA_PHASE2_REMEDIATION_REQUEST_20261023.md` | `begb0037admin/aimm/docs/project/generated/` |

---

## Critical Instructions for the Challenging Agent

1. You are independent and have no memory of the execution session. Treat the Evidence Package as unverified.
2. Independently retrieve every supporting file/commit via GitHub API. Record the actual refs and content SHAs observed.
3. Give every verification task a finding of PASS, PARTIAL, or FAIL; distinguish direct inspection from reported evidence.
4. Review the architecture as an architecture approval candidate, including whether the document itself preserves the implementation, account/API, service, purchase, local-action, merge and deployment gates.
5. Do not call the architecture implemented, security-tested, runtime-verified, or operationally proven.
6. If any finding is FAIL or PARTIAL, Stage 4 remediation and Stage 5 validation are mandatory under the workflow.
7. Do not issue Kevin's governance decision. This challenge cannot approve the architecture.
8. Obey the write boundary and report any access limitation.

---

## Verification Tasks

### VT-01 — Repository Scope Completeness

Confirm the package accurately limits this named phase to `begb0037admin/aimm` and does not omit another repository actually modified by the architecture work.

Required evidence: GitHub API confirmation of each claimed commit and a review of the checkpoint/change scope.

### VT-02 — Authentication Verification

Verify the connected GitHub API was used and the earliest package write commit exists.

Required evidence: GitHub API commit detail for package creation commit `8524ac7c175aefc1576d7551681fe16089c4a8b4`, plus the follow-up package metadata commits where present.

### VT-03 — Authorization Verification

Check that writes in this handoff are limited to the new governance evidence/review artefacts on the intended branch and do not bypass an approval gate.

Required evidence: list of commits/files written, cross-referenced against the governance workflow and the stated design-only authority.

### VT-04 — Backup Validation

The package claims no backup is applicable because these are newly created governance files and no existing file is overwritten. Confirm the API commit diff supports this claim. Do not require unrelated architecture archives to be treated as backups for this handoff.

Required evidence: commit/file list for the evidence and review request writes.

### VT-05 — Rollback Claims

Check the stated revert-based rollback is consistent with the actual additive commits and would leave the architecture inputs and application/service state unchanged.

Required evidence: GitHub commit diffs and parent/checkpoint refs.

### VT-06 — Governance Assumptions and Architecture Candidate

Review each assumption and risk in the package. Independently inspect whether the architecture, ownership map and data-boundary files support their descriptions, expose material unknowns, preserve required user boundaries, and clearly gate build/cutover work.

Required evidence: direct GitHub Contents API reads with content SHAs; cite exact files/sections and flag unsupported claims.

### VT-07 — Estate-Wide Completion and GET Verification

Confirm only `aimm` is claimed as updated in this phase and GET-verify every new file written by this handoff at the latest branch ref.

Required evidence: current GETs and content SHAs for the Evidence Package and Review Request, plus commit metadata.

### VT-08 — Residual Design Risks

Independently assess whether unresolved decisions and security/operational risks are stated clearly enough for an architecture-only decision, and identify any omissions that materially prevent approval.

Required evidence: direct references to the candidate architecture and ownership/data-boundary documents.

---

## NEXT STAGE

**→ Challenging agent produces:** `PHASE_PLUGINHUB_REPLICA_PHASE2_CHALLENGE_REPORT_20261023.md`

If every finding is PASS, the executing agent may prepare the Stage 6 Governance Review Request. If any finding is FAIL or PARTIAL, remediate and obtain an independent Validation Report before Stage 6.
