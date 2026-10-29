## Latest implementation checkpoint — 2026-10-29

Branch source `3570ad1bd5dfb55d69685f6a10c201e6b2553048` passed Jules review and is deployed to the development Pages preview (deployment `01f39e82-a295-4204-9b27-32f94d6c0cdf`). The preview uses the [stable branch URL](https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/); the deployment-specific URL was opened for clean-origin verification.

The first Library render has category counts. Four-column Cards, List and Ledger, sort controls, existing local/vendor card actions and the two-pane Plugin Tag Manager are present. Tag Manager supports browser-local create, rename, recolour, order, delete, search and per-product membership, including atomic vendor-level Add all. The clean deployment origin showed zero installed products/folders and the accurate Tag Manager empty state. No folder picker or scan was invoked. Details: [Tag Manager implementation evidence](PHASE_PLUGINHUB_TAG_MANAGER_20261029.md).

Current remaining parity: My Tags filtering still needs individual/multiple tag selection and combined-filter comparison with the reference. Intel-only filtering requires architecture metadata; snooze and update-status filters require live status observations. Per-row filesystem actions need the native Companion protocol. Whole-library tools need their own reviewed backends and flows. AAX remains excluded by the approved scanner architecture.

Jules reviewed the Tag Manager source, not Foundation acceptance. No automated tests, folder scan, inventory upload, Worker deployment or production action occurred. Foundation remains **NOT MET**; Stage 6 remains gated. The live development Worker passkey RP fix remains a surgical patch, not a reproducible branch-source deployment.

# PluginHub parity sweep — 2026-10-29

## Scope and evidence

This is a feature-by-feature sweep of the installed PluginHub reference and the AIMM Library development preview. It records the product surface described by the installed PluginHub manual and visible in PluginHub v2.0.12, then compares it with the checked-out GitHub source at `304ba8df644c1ceba4cd0eb5f6ddf8693ef3aa62` and the approved development Pages preview:

- `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/`
- The preview is a non-production Pages site. It was refreshed and visually inspected in Chrome.
- The preview used an already-present local inventory snapshot. No product names or paths from that machine are persisted in this report.
- The installed manual was read from `/Applications/PluginHub.app/Contents/Resources/manual.html`; the dashboard was observed at version 2.0.12.
- This is a visual/product parity record, not Foundation exit evidence. No tests were run.

## What the reference actually provides

The manual and running app show these distinct surfaces:

| Area | PluginHub reference |
|---|---|
| Status | Updates Available, Up to Date, Manual Check, Unchecked; counts reflect check results. Paid-upgrade signals are separate from ordinary updates. |
| Browse | All Plugins, Hidden, format filters (AAX, AU, VST, CLAP), where VST cycles through VST (all), VST3 and VST2; vendor folders, My Tags, search, sort and a View menu. |
| Layouts | Cards, List and Ledger. Card view uses vendor tiles with compact plug-in rows, format/status pills, vendor identity, vendor links, collapse controls and an installer-hub link where available. |
| Filters | Categories, tags, favourites/pinning, Intel-only filtering, and show/hide snoozed plug-ins. The manual supports combining category selections with Shift-click. |
| Tools | Install Manager; Batch Plugin Management; Remove Old Installers; Check for Duplicates; License Key Vault; Share Plugin List; Compare Plugin Profiles; PluginHub License. The Library section separately contains All Plugins, Plugin Compatibility and Tag Manager. |
| Row menu | Category; Tags; Note & rating; Mark as up to date; Move to Unused; Uninstall (Move to Trash); Reveal in Finder; Rescan plugin folders; Copy plugin name; License Key Vault; Keep this version; Snooze update; Report a problem. Snooze includes timed choices (one week, one month, a chosen date or forever) and vendor-level snoozing; when already snoozed the menu offers stop-snoozing actions. A global Show/Hide Snoozed Plugins control also exists. Some actions are conditional on item state or require macOS access. |
| Settings and support | Plugin folders and custom install paths; update-check frequency; launch-at-login; sound on update; show snoozed plugins; anonymous sharing choice; reset; privacy and troubleshooting guidance. |
| Other library flows | Session imports for supported DAWs, vendor management/hiding, compatibility guidance, installer cleanup and profile comparison. |

The manual is the source for feature names and intended behavior; it does not mean those behaviors are implemented in AIMM.

## AIMM preview: verified present

The current development preview visibly has a four-column vendor-card layout at the inspected desktop width, with cards placed in masonry columns. Each card contains compact installed-product rows. Vendor cards expose available official vendor and Installer Hub links.

The Library also has:

- AU, VST2, VST3 and CLAP filters, free-text search, inventory totals and connected-folder scan controls. (AIMM's separate VST2 and VST3 buttons do not yet match PluginHub's VST cycle.)
- Single-category filtering, a favourites filter and a My Tags filter.
- A per-product ⋮ action menu, opened and inspected in the preview.
- Editable categories and tags, notes and ratings, copying the product name, a local up-to-date marker, a local keep label and rescan controls.
- Explicit UI explanations for actions that need a native Companion or a service not connected to this preview.

The current row menu was visually checked for a product with one known version. Category and tag submenus open; the top category option is accurately labelled “Use AIMM’s inferred category.” The action menu contains working local/preview actions and visibly disabled Companion/service actions. No preference was saved during this inspection.

## Remaining parity gaps after the latest implementation checkpoint

| Gap | Current preview state | Required next work |
|---|---|---|
| Status groups and counters | Updates Available, Up to Date and Manual Check remain disabled because vendor checks are not connected. Unchecked and paid-upgrade states are absent. | Implement status semantics and live vendor checks before enabling these filters or counters. |
| Tag management | Per-product tags exist; a complete Tag Manager, rename/recolour, and persistent account-level management are not established. | Implement the manager against the reviewed preference contract. |
| Browse controls | All plugins, Favorites, My tags, Hidden, category filters, four format filters, search, sort, and collapse/expand vendor controls are visible. Intel-only and snoozed controls remain absent. | Add the missing browse controls; connect snooze only to real update status. |
| Per-row actions | Local metadata actions are present. Move to Unused, Uninstall/Trash, and Reveal require the native Companion. Snooze depends on status data; License Vault and Report a problem need their own backends. | Use the preview/confirmation/receipt protocol for local file operations. Keep unavailable actions disabled until reviewed backends exist. |
| Whole-library Tools | No complete PluginHub-style Tools collection or equivalents for installer cleanup, duplicate review, License Vault, sharing, profile comparison, entitlement, Compatibility, or Tag Manager are verified. | Add tool navigation and implement each surface against its own reviewed contract. |
| Vendor and layout details | Four-column Cards, List and Ledger modes, Vendor/Product/Format/Version sorting, vendor links, and collapse/expand controls are present. | Continue the reference walk for unverified interaction and spacing details, especially across alternate layouts. |
| Reference-only formats | PluginHub supports AAX. Approved AIMM scanner architecture excludes it. | Keep as a documented difference unless architecture is formally revised. |

## Safe implementation order

1. Complete Tag Manager and persistent tag editing against the approved preference contract; verify category multi-select and combined filters during the manual walk.
2. Add Intel-only and snoozed controls. Implement status semantics and vendor adapters before enabling update counters, snooze or paid-upgrade badges.
3. Build native Companion actions through the existing exact-preview, confirmation, WebAuthn and per-item-receipt contracts. This covers Move to Unused, Restore, Reveal, Trash, batch work, duplicate review and installer cleanup.
4. Add License Key Vault, compatibility, share/profile and entitlement surfaces under their separate privacy and account contracts.
5. Re-run the manual-to-preview walk across Cards, List and Ledger, all sort modes and combined filters. Obtain fresh independent review before changing any phase gate.

## Gate state

Foundation remains **NOT MET**. Stage 6 remains gated. This parity sweep does not close Stage 5, authorize any local file action, or approve production deployment. The development Worker’s earlier surgical passkey RP hotfix provenance remains a separate limitation recorded in the handover; do not treat this Pages/source review as resolving it. Synthetic non-production data remains the project default. No production deployment or separately gated external action occurred.
