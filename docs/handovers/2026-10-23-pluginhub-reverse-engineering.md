# Session handover — AIMM PluginHub feature replica

**Date:** 2026-10-23

**Working branch:** `codex/pluginhub-replication`

**Branch base / restore point:** `c717fc6` (`origin/main` at session start)
**Status:** Phase 1 started; source research is read-only and incomplete. No app implementation, PluginHub action, scan, download, file move, or deployment was performed.

## Objective

Kevin clarified that AIMM’s plugin library should reproduce PluginHub’s complete functionality in AIMM. The companion is the AIMM-owned local engine that makes local scanning and management possible. AIMM must not depend on PluginHub at runtime or use the earlier PluginHub bridge prototype as product architecture.

The full durable specification and restart point is [`docs/PLUGINHUB_REPLICA.md`](../PLUGINHUB_REPLICA.md). It contains the phase plan, feature matrix, constraints, evidence, source map, open items, and new-session instructions.

## Evidence inspected

1. Read `/Users/admin/Desktop/PluginHub_Manual.pdf`, a 32-page manual. `pdfinfo` and `pdftotext` were unavailable, so the system’s PDFKit was used to extract all page text. No PDF modification was made.
2. Read the installed app bundle metadata: `/Applications/PluginHub.app`, bundle ID `com.pluginhub.app`, version `2.0.12`.
3. Inspected bundled source/module names and relevant function structure read-only under `/Applications/PluginHub.app/Contents/Resources/`. No source was copied into AIMM and no PluginHub code was executed.
4. Inspected aggregate counts and top-level keys from local PluginHub scan/report files. Did not read license vault contents, credentials, or private key values.

## Confirmed scope from the manual

PluginHub covers status tabs and pinned items; card/list/ledger layouts; filters, search, sorting and keyboard controls; categories, tags, favorites, hidden items and collections; paid-upgrade flags, snoozes and version-aware marks; per-product and batch hide/move/restore/uninstall; installer downloads, queues, installation receipts and old-installer cleanup; duplicate detection; share links and exports; profile comparison; a local license-key vault; standard/custom folder management; menu-bar controls, scheduled checks, privacy and diagnostics. See the full page-by-page matrix in `docs/PLUGINHUB_REPLICA.md`.

Kevin-specific decisions recorded: omit AAX/Pro Tools; do not show duplicate product cards; keep a deliberate duplicate-management feature; preserve AIMM and Hope; keep secrets local; implement AIMM-owned equivalents.

## Initial local-state evidence

- PluginHub snapshot generated `2026-10-22T14:39:02.856570Z`: 1,880 format records (AAX 239, VST3 538, AU 538, VST2 563, CLAP 2).
- PluginHub last check `2026-10-22T15:39:05.869022`: 159 update rows, 100 up-to-date rows, 19 errors, 1 unchecked; unreadable roots and scan warnings were zero.
- 13 of the 159 update rows had both `installer_url` and `installer_size`. The presence of `download_url` on all 159 rows does not establish that every row is directly installable.
- A separate prior AIMM browser scan reported 1,880 bundles checked, 2,197 readable records, grouped into 1,618 products. Kevin’s earlier AIMM sidebar screenshot showed 1,613; a separate PluginHub screenshot showed 873. These are distinct products, paths, timestamps and count definitions.

## Source-trace progress

The durable specification now has a source-trace table for scanner/product identity, update routes, direct-download gating, vendor cache/retry rules, version/status comparison, categories, local file actions, installer/hub actions, shares and scheduled checks. This was static source inspection only.

The 159 saved update rows span 15 vendors; 13 have direct installer URL and size metadata (FabFilter 1, SSL 6, Sonnox 6), and 102 are flagged as paid upgrades. `app.py` defaults check frequency to seven days if the setting is absent. PluginHub’s UI count is grouped product identity, while the 1,880 snapshot count is format bundles. Exact count reconciliation and complete vendor coverage remain open.

Follow-up source trace is in [`docs/PLUGINHUB_VENDOR_ACTION_MATRIX.md`](../PLUGINHUB_VENDOR_ACTION_MATRIX.md) and [`docs/PLUGINHUB_WORKFLOW_TRACE.md`](../PLUGINHUB_WORKFLOW_TRACE.md). The saved report’s cache metadata says `source=cache`; the readable bundle does not expose `cached_checks.py`, so central-cache transport/fallback is unverified. The 42 configured hub IDs are candidate launch routes, not evidence that a product can be installed unattended. Direct installer metadata is a candidate link until AIMM independently verifies the current URL. File operations can complete partially: `trash_unused_duplicates` returns `ok: true` even if paths need admin or have errors. The reference share payloads include a hostname; AIMM must decide its own explicit disclosure and access rules.

## Source modules to trace

- Scanner and identity: `plugin_scanner.py`
- Categories and vendor aliases: `run_checks.py`
- Vendor and hub checks: `vendor_checkers.py`, `hub_checkers.py`, `checker_core.py`
- Dashboard behavior: `dashboard.html`
- Native companion interface and file actions: `dashboard_webview.py`
- Installer support/eligibility: `installer_payload.py`
- Installer cleanup: `installer_cleanup.py`
- Shares and profile comparison: `profile_compare.py`
- App license gates and local key vault: `license_manager.py`, `license_vault.py`, `keychain.py`

## Remaining Phase 1 work

Continue the checklist in `docs/PLUGINHUB_REPLICA.md`, especially the vendor checker/action inventory, status and cache rules, file-operation authorization/recovery semantics, share/profile server handling, product grouping, and the count reconciliation. Phase 1 is not complete until every supported feature is classified with source evidence and the unresolved questions are explicit.

## Working-tree preservation

The candidate checkout had pre-existing modifications to `index.html` and untracked `bridge/` files plus `pluginhub-ui-review.patch`. They were left untouched. A subsequent read-only review confirmed that `index.html` uses PluginHub bridge endpoints, offers “Open PluginHub,” and replaces the AIMM browser scanner. The bridge reads PluginHub data and can rescan, request version checks, open vendor hubs/tools, and download listed installers. This prototype conflicts with the agreed independent AIMM companion. It must not be staged, pushed or deployed with the documentation. The main checkout `/Users/admin/github/aimm` was not modified.

Read-only `launchctl print gui/501/com.aimm.pluginhub-bridge` showed an installed LaunchAgent running from `/Users/admin/github/aimm/bridge/pluginhub_bridge.py` (a different copy from this candidate branch). Its plist is `~/Library/LaunchAgents/com.aimm.pluginhub-bridge.plist`, set to start at login and keep running. The running script imports PluginHub’s local dashboard module. Neither service nor app was started, stopped or invoked by this research. Phase 2 must account for this existing local component when replacing the PluginHub-dependent path. Do not dump the LaunchAgent’s inherited environment in a handover or terminal log.

Before editing the existing planning files, exact backups were created at `Archive/2026-10-23-aimm-pluginhub-phase1/`. SHA-256 of each backup matches its source at the time of backup. No code implementation, merge or live deployment has been performed for this Phase 1 work.

Before this follow-up edit to the central specification and handover, copies were saved in `Archive/2026-10-23-aimm-pluginhub-phase1-followup/`. No pre-existing application changes were staged or altered.

## Independent Terminal review

Claude CLI 2.1.306 reviewed these planning files in read-only plan mode on 2026-10-23. It rated the first draft PARTIAL: Phase 1 status and backup references passed, but it found the uncommitted PluginHub-coupled `index.html`/`bridge/` prototype had been described too vaguely, the 1,613 screenshot was attributed to the wrong product, and the restart instructions omitted the documentation exit artefacts. It also identified a legacy DAW Bridge “Phase 1” naming collision. A follow-up review confirmed those corrections but found the running LaunchAgent had not been documented; it rated the documentation PARTIAL again. The planning files now include the LaunchAgent and distinguish it from the candidate branch bridge. Neither review inspected the full manual/source trace, so these are editorial checkpoints, not the formal Phase 1 challenge.

A further read-only Claude CLI review of the vendor/action and workflow trace was attempted in safe mode. Its sandboxed API call failed with `ENOTFOUND`. Automatic approval review rejected an unrestricted retry because it would upload local project documentation and PluginHub analysis to Anthropic without specific authorization for that export. No workaround was used. This new source trace has **not** received an independent Claude verdict; do not treat the previous editorial reviews as covering it. Continue local evidence gathering and request approval for the external review only after a concrete review packet is ready.

## Next action

Continue the Phase 1 checklist in `docs/PLUGINHUB_REPLICA.md`: enumerate the effective checker registry, inspect status/UI persistence and installer receipts, reconcile grouping counts, and classify every manual feature with source evidence. Then create the required phase evidence package and review request, and obtain an independent read-only Terminal review before treating Phase 1 as complete.
