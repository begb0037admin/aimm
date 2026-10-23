# PluginHub replica — Phase 2 architecture handover (2026-10-23)

## Current position

Phase 1 research is approved and closed. Phase 2 architecture work is a documentation-only candidate on `codex/pluginhub-replication`. The design at `c54ef19` covers an AIMM-owned Mac companion, account Library API, the site/Workbench/Hope shared inventory, 31 Phase 1 parity rows, local action authorization and the staged cutover. The final two previously open documentation blockers were independently marked PASS; the six read-only Claude CLI reviews are preserved as `2026-10-23-pluginhub-phase2-architecture-review-{1..6}.md` in this directory. Earlier reviews were PARTIAL and drove the committed corrections. This is cumulative technical review closure, not a formal Phase 2 governance decision or a working companion.

Start with [Phase 2 architecture](../PLUGINHUB_PHASE2_ARCHITECTURE.md), [31-row ownership map](../PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md), the [updated data boundary](../PLUGINHUB_DATA_BOUNDARY.md), and the [Phase 1 brief](../PLUGINHUB_REPLICA.md). The central [status](../STATUS.md), [roadmap](../ROADMAP.md) and [handover](../HANDOVER.md), plus `DASHBOARD.html`, carry the same phase state.

## Decisions captured

- Keep `aimixmasters.com`, Workbench and Hope as one product. An AIMM-owned, signed Mac companion supplies local scan, checks, downloads and file actions; it never calls PluginHub. An authenticated AIMM Library API supplies a single account/device inventory to the page and Hope.
- AU, VST2, VST3 and CLAP are in scope. AAX and Pro Tools are excluded. A product is one visible card with per-format installs; duplicate copies are a separate management tool.
- The API publishes only complete scan generations. A single versioned status-summary function supplies counts to both the site and Hope. Unknown/stale observations do not become "up to date".
- The Mac prepares and signs exact action previews. File-changing and installer actions require a fresh owner WebAuthn confirmation bound to the preview digest. The Mac rechecks the current file state and returns per-item signed receipts. Hope cannot receive exact paths or complete the confirmation.
- Exact paths remain local except for an explicitly requested, encrypted owner preview with a 10-minute access expiry and later purge. The preview fields and exclusions are enumerated in the architecture and data-boundary docs. Licence values and project files remain local.
- The candidate `index.html` diff and `bridge/` in this worktree depend on PluginHub and were neither staged nor run. The separate running PluginHub bridge LaunchAgent from `/Users/admin/github/aimm/bridge/` was not changed. Cutover explicitly waits for independent AIMM behavior to be proven.

## Saved checkpoints and review

The first architecture and ownership map were pushed at `ccfc89d`; review remediations were saved at `f898abf`, `fff0f24`, `6c729b1`, `7792c59` and `c54ef19`. Before-edit Archive commits include `721d466`, `3d247ed`, `b1e27dc`, `813ac73`, `958610b`, `1dbcbcb` and `74a9a2a`; central-record backups were saved at `50e2cb7`. Review outputs were committed at `022b779` and `8bb3456`. Check `git status --short` before any new work and preserve pre-existing `index.html`, `bridge/` and `pluginhub-ui-review.patch`.

The final narrow review (`review-6.md`) marked the sample-tag model/route/P31 and the installer preview/privacy fields PASS. Prior review 5 marked retry and device scope PASS and found no new high/medium safety contradiction. No single review was a formal governance validation of the entire phase. Do not describe the design as implemented or independently runtime verified.

## Next work at initial architecture checkpoint (completed below)

1. Produce the formal Phase 2 evidence package and independent governance challenge/validation under `governance/GOVERNANCE_WORKFLOW_STANDARD.md`. Present the resulting governance review request to Kevin for approval of the architecture, not implementation.
2. Resolve the pre-build gates recorded in the architecture: OIDC provider, account entitlement/device policy, full P31 Samples visible workflow, vendor adapter/update/download verification, Xcode-capable signing environment, and retention/operational details. Do not claim PluginHub checker or installer coverage from the static Phase 1 counts.
3. Only after architecture approval, plan and authorize the foundation implementation separately. Preserve live Hope/MixCheck and the browser scanner until the independent companion and account API are proven and cutover is approved.

No product code, Logic project, PluginHub action, installer file, running service, live site, or deployment was changed during Phase 2 architecture planning.


## Governance handoff continuation — 2026-10-23

The formal Phase 2 Evidence Package and Review Request were committed. The independent challenge marked VT-01–05 and VT-07 PASS and VT-06/08 PARTIAL, identifying authorization-gate wording, retention timing and review-attribution gaps. All three were remediated; the independent Validation Report marks each PASS. The governance process was also updated to v1.1 with adaptive model/effort selection: use the least costly adequate setting, escalate automatically when risk/uncertainty/impact warrants it, record the choice, and return to the normal lower-cost setting afterwards. The challenge used GPT-6 Sol at medium effort for this cross-system privacy/authorization review.

The final [Phase 2 Governance Review Request](../../governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_GOVERNANCE_REVIEW_REQUEST_20261023.md) is ready for Kevin. It asks for approval of the architecture as a design baseline only. Implementation, spending, resources, credentials, services, local actions, merge, cutover and deployment remain separately gated. The updated [current handover](../HANDOVER.md), status, roadmap, project brief and dashboard all show that the independent validation is complete and Kevin's architecture decision is pending.
