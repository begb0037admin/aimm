# PHASE_[NAME]_GOVERNANCE_DECISION_[YYYYMMDD].md
# Phase [Name] — Governance Decision

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | [Phase name and number] |
| Date | [YYYY-MM-DD] |
| Decision authority | Kevin Lelitte |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v[X] |
| Reviewing | Governance Review Request at commit SHA: [SHA] |
| Status | **[APPROVED / REJECTED / DEFERRED]** |
| Commit SHA (this document) | [SHA — populated after commit] |

---

## Durable status synchronization

| Surface | Commit SHA | Content SHA |
|---------|------------|-------------|
| `DASHBOARD.html` | [SHA] | [SHA] |
| `docs/ROADMAP.md` | [SHA] | [SHA] |
| `docs/STATUS.md` | [SHA] | [SHA] |
| `docs/HANDOVER.md` | [SHA] | [SHA] |
| Dated phase handover / project brief, if used | [path + SHA] | [path + SHA] |

## Kevin's Assessment

[Kevin's notes]

---

## Decision

**[ ] APPROVED** — Phase [Name] is complete. The evidence chain is accepted.
The executing agent may proceed to the next phase.

**[ ] REJECTED** — Phase [Name] is not accepted. Reason: [Kevin's reason].

**[ ] DEFERRED** — Decision deferred pending: [Kevin's condition].

---

## NEXT STAGE

**If APPROVED:** State the next authorized stage and its boundaries. Approval of a design does not authorize implementation unless the decision explicitly says so. Synchronize and GET-verify `DASHBOARD.html`, `docs/ROADMAP.md`, `docs/STATUS.md`, and `docs/HANDOVER.md`; update the dated handover and project brief where relevant. Link the decision, architecture, and evidence chain. Record exact commit and content SHAs below or in the dated handover before closing the session.

**If REJECTED / DEFERRED:** State the required follow-up and synchronize all four status surfaces to the decision.

---

**Signed:** Kevin Lelitte
**Date:** [YYYY-MM-DD]
**Commitment SHA:** [SHA of this committed document]
