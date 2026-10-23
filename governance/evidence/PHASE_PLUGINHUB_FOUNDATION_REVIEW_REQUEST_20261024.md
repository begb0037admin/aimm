# PHASE_PLUGINHUB_FOUNDATION_REVIEW_REQUEST_20261024.md
# PluginHub Foundation — Review Request

---

## Document Information

| Field | Value |
|-------|-------|
| Phase | PluginHub replica — Foundation (partial implementation slice) |
| Date | 2026-10-24 |
| Produced by | Codex executing agent |
| Addressed to | Independent Codex challenge reviewer |
| Governed by | GOVERNANCE_WORKFLOW_STANDARD.md v1.2 |
| Status | Open — awaiting Challenge Report |
| Commit SHA (this document) | Pinned in the challenger handoff message after creation |

---

## Challenger Operating Mode

Before review, verify GitHub API read/write access. Declare Option A if the challenge report and any remediation request can be committed directly; otherwise declare Option B and return the full Markdown artefacts for commit by the executing agent.

**Challenger write boundary:** May write only to `begb0037admin/aimm/docs/project/generated/`. Do not edit any other file.

## Reviewer Model and Effort

Select the least costly model and effort that can independently assess the implementation and its security, privacy, authorization, retention and governance claims. Escalate automatically where warranted. Record model, effort and reason in the Challenge Report, then return to the normal lower-cost setting.

---

## Inputs

| Input | Repository path | Pinned commit SHA | Content SHA |
|-------|----------------|------------------|-------------|
| Evidence Package | begb0037admin/aimm/governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md | `4638d129ebd5fdede0d265d7682b96b268737948` | `2215941a6525b26654767b88c3740667ded95266` |
| Governance Workflow Standard | begb0037admin/aimm/governance/GOVERNANCE_WORKFLOW_STANDARD.md | `4638d129ebd5fdede0d265d7682b96b268737948` | `0e6a090198638dd13d301e243949e27cc1a783d7` |

The Evidence Package is an **unverified claim set**. Independently retrieve every claim from GitHub or the named provider; do not accept this request, the package, chat summaries, dashboard text, or prior review reports as proof.

---

## Outputs

| Output | Filename | Destination |
|--------|----------|-------------|
| Challenge Report | `PHASE_PLUGINHUB_FOUNDATION_CHALLENGE_REPORT_20261024.md` | `begb0037admin/aimm/docs/project/generated/` |
| Remediation Request, if any finding is FAIL or PARTIAL | `PHASE_PLUGINHUB_FOUNDATION_REMEDIATION_REQUEST_20261024.md` | `begb0037admin/aimm/docs/project/generated/` |

If GitHub write access is unavailable, return the complete Markdown for each required output.

---

## Critical Instructions

1. Treat every statement in the Evidence Package as unverified.
2. Use independent direct GETs and inspect the implementation diff; distinguish repository-verifiable evidence from reported Cloudflare Console evidence.
3. Give every verification task a PASS, PARTIAL or FAIL finding with evidence. No silent passes.
4. Do not infer runtime correctness from static source or schema presence.
5. Do not claim the Foundation phase is complete. Assess only the committed slice and its evidence, including the limits stated in the package.
6. Record the model and effort used.
7. The request commit SHA is supplied in the challenge handoff. The Evidence Package and this Review Request are your sole task inputs; any links they cite may be retrieved as verification evidence.

---

## Verification Tasks

### VT-01 — Authorization, scope and phase boundary
Verify authorization and retention records, the architecture's Foundation scope, and that this branch's work stays within that authorization. Confirm the exclusion gates for legal acceptance, paid services, credentials, deployment, merge, cutover and live relay/site/bridge changes.
**Required evidence:** direct GitHub GETs of the pinned architecture, authorization and retention decision; relevant file list and commit diffs; identify any scope mismatch.

### VT-02 — Repository writes and evidence integrity
Verify each listed AIMM commit and current path/content SHA; inspect the four isolated `library-api/` files and status records. Verify the same-day backups exist at the cited content SHAs and were committed before the corresponding governed-file writes.
**Required evidence:** direct GitHub API commit details and GETs; compare chronological commit metadata; report unexplained or unverifiable rows.

### VT-03 — API authentication and account isolation
Inspect `library-api/src/index.js`, Wrangler configuration, SQL schema and README. Assess token issuer/audience/expiry/JWKS handling, account identity mapping, endpoint authorization, input handling, error responses and cross-account isolation. Identify concrete code or contract gaps; do not treat static inspection as runtime proof.
**Required evidence:** pinned source GETs and line-specific or code-specific findings, plus commit diff.

### VT-04 — Schema integrity and migration state
Review the D1 schema for account/device ownership integrity, foreign keys, uniqueness, retention columns and migration idempotence. Compare code/config/schema DB identifiers and determine what is directly proven about actual D1 state and Wrangler migration history.
**Required evidence:** source SQL/config GETs; clearly separate direct provider evidence from claims merely transcribed in the package. Flag composite-ownership or migration-registration gaps if present.

### VT-05 — Retention, deletion and provider claims
Verify the retention policy text and determine whether code or scheduled jobs enforce it. Check whether Auth0 is only selected or whether any tenant/credentials exist. Assess whether provider and Cloudflare pricing/limit assertions are relevant and adequately sourced for this evidence package.
**Required evidence:** direct policy/source inspection and explicit status of unimplemented enforcement; distinguish official-source claims from account state.

### VT-06 — Backups and rollback
Verify each listed backup path, content SHA and preceding commit. Assess whether the documented repository rollback method is executable without history rewriting and whether D1 rollback claims match the absence/presence of user data evidence.
**Required evidence:** direct backup GETs and GitHub commit details. Report inability to inspect provider rollback state as a limit.

### VT-07 — Status-surface consistency
Retrieve `DASHBOARD.html`, `docs/ROADMAP.md`, `docs/STATUS.md` and `docs/HANDOVER.md`. Determine whether phase, completion state, authorization boundary, links and next steps agree with the Evidence Package and each other; identify stale or contradictory statements.
**Required evidence:** direct content GETs and blob SHAs for all four surfaces.

### VT-08 — Evidence completeness
Assess whether the package distinguishes directly verified evidence from reported evidence, includes the required template sections and primary evidence, and states material residual risks without overstating completion.
**Required evidence:** compare the package against `governance/templates/PHASE_EVIDENCE_PACKAGE_TEMPLATE.md` and governance workflow v1.2. Cite missing evidence and sections.

---

## NEXT STAGE

Submit a Challenge Report with findings for VT-01 through VT-08. If any finding is FAIL or PARTIAL, Stage 4 remediation is mandatory, followed by a separately requested Stage 5 validation.
