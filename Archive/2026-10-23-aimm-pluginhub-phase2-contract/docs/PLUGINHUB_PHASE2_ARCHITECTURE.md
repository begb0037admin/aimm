# AIMM Plugin Library — Phase 2 architecture

**Status:** Research checkpoint 1, in progress (2026-10-23). Phase 1 was approved; no companion or account inventory has been built.

## Approved outcome and scope

Design one AIMM-owned plugin library for aimixmasters.com, its Workbench, Hope and a Mac companion. Cover the 31 Phase 1 parity rows with explicit owners and data contracts. The companion must work without PluginHub installed or running. AU, VST2, VST3 and CLAP are included; AAX and Pro Tools are excluded. This document is an architecture work product, not a build or deployment approval.

## Inspected baseline

| Surface | Source at inspection | Finding |
|---|---|---|
| Published app source | `origin/main` / GitHub `main` at `c717fc616a8a1caf6cc66d8a6e35767ab53783c6`, `index.html` | Static single-file site. Installed-plugin scanner reads bundle names and Info.plist metadata through browser-granted folder handles. It stores handles in IndexedDB and rows/scan summary in browser localStorage (`aimmPluginInventoryRows_v1`, `aimmPluginInventoryScan_v1`). The scan includes an AAX path today. Product grouping is normalized vendor plus name. |
| Hope in the site | Same `index.html`, `buildLibraryDigest`, `TOOL_DEFS`, `handleToolCall` | Hope's `list_plugins`/`get_library` and session library digest use the built-in `allPlugins()` catalogue. They do not use the installed inventory rows, so ownership assertions are not grounded in the browser scan. The existing chat/voice providers share the tool handler; that common handler is the integration seam. |
| Existing Worker source | `worker/src/index.js`, `worker/wrangler.toml` at branch base | The Worker relays AI calls and has `/captures` in KV, knowledge search and Hope voice routes. `/captures` is a single-user, last-write-wins array. The Worker has no AIMM account/device identity or plugin inventory API. Its Origin allowlist is browser enforcement, not user authentication; it cannot secure shared plugin data or actions. |
| Existing bridge artifacts | Unstaged `index.html`, `bridge/` in this checkout; separate running LaunchAgent from `/Users/admin/github/aimm/bridge/` | The prototype imports PluginHub's `dashboard_webview` and reads PluginHub report/data. It cannot be the independent companion. It must be considered in cutover; it was not invoked or changed. |
| Mac build environment | `swift --version`, `xcode-select -p`, `xcodebuild -version` on 2026-10-23 | Swift 6.3.3 command-line tools are available. Full Xcode is not active (`xcodebuild` requires Xcode). Packaging/signing a Mac app needs a later build-environment decision. |

The current site's `aimixmasters.com` domain and the GitHub Pages repository are the same product. Product observations above come from repository source, not a fresh live login or runtime plugin check.

## Architecture direction under evaluation

1. **AIMM-owned Mac companion** scans and acts on local plugins, keeps paths and secrets locally, and sends only permitted inventory metadata to the AIMM account. It initiates an outbound connection to the AIMM API for sync and action work. The UI does not need to call a localhost bridge.
2. **Authenticated AIMM account API** stores per-device inventory snapshots, check observations, account preferences and operation summaries. It separates private inventory, public shares and optional aggregate contribution. The current key relay and captures KV are not suitable as this authoritative store without new auth and data models.
3. **One site/ Hope inventory service** makes the page and Hope read the same account snapshot and observation timestamps. Hope actions use a named backend operation and return the companion's verified receipt. The existing `TOOL_DEFS`/`handleToolCall` routing is retained as the site-side entry point, with new plugin tools added when implemented.
4. **Explicit local action authorization** requires a fresh preview and confirmation for moves, Trash and uninstall operations. Hub launch and installer download are separate actions; a downloaded file or opened hub never counts as an installed update. The companion rescans after local changes.

These are proposed boundaries. The remaining sections will settle the component choice, schema, authentication and pairing, operation state machine, parity ownership, failure recovery and cutover sequence before Phase 2 exit review.

## Work still required for the architecture exit

- Decide the companion packaging and login/startup approach from current Mac tooling, including signed update and installer handling.
- Specify account identity, device pairing/revocation, session security and exact API contracts for site, Hope and companion.
- Define product identity/alias rules, per-format records, status/check freshness, preference merge rules, counts and snapshots.
- Define the local operation protocol, permission elevation, progress/receipts, cancellation, offline expiry, retries and file recovery.
- Allocate each Phase 1 parity row to companion, API, site and Hope; identify direct vendor route validation gates.
- Define migration from browser inventory and PluginHub-dependent bridge/LaunchAgent without disrupting the current Library or Hope.
- Obtain an independent Terminal review of the finished architecture, as Kevin requested, then present the concrete result for approval.

## Evidence and restart

Start with [`PLUGINHUB_REPLICA.md`](PLUGINHUB_REPLICA.md), the [31-row parity matrix](PLUGINHUB_PARITY_MATRIX.md), [data boundary](PLUGINHUB_DATA_BOUNDARY.md), [status rules](PLUGINHUB_STATUS_RULES.md), [vendor/action matrix](PLUGINHUB_VENDOR_ACTION_MATRIX.md), and [workflow trace](PLUGINHUB_WORKFLOW_TRACE.md). Phase 1 approval is in `governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE1_GOVERNANCE_DECISION_20261023.md`. The Phase 2 before-edit backups are in `Archive/2026-10-23-aimm-pluginhub-phase2-start/` at commit `721d466`.

Preserve the current unstaged `index.html`, `bridge/` and `pluginhub-ui-review.patch`. Do not treat those PluginHub-dependent files as the new architecture or stage them in documentation commits. No PluginHub operation, file action, Logic change, application build, service change, merge or deployment was performed at this checkpoint.
