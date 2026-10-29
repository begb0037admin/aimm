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

## Parity gaps still visible

| Gap | Current preview state | Required next work |
|---|---|---|
| Status groups and counters | Updates Available, Up to Date and Manual Check are visibly disabled because a vendor checker is not connected. There is no Unchecked view or paid-upgrade state. | Implement the shared status model and current vendor checks before enabling these filters or displaying counts. |
| View menu | Only the four-column card layout is available. List and Ledger modes, sort controls and the reference View menu are absent. | Add the view selector and reproduce Cards, List and Ledger with the same inventory data and filtering. Preserve the requested four-column card default. |
| Tag/category management | Product tags and category overrides work locally; there is no complete Tag Manager, tag rename/recolour, multi-select/Shift-click categories, or persistent cross-device account preference. | Add the manager and matching selection semantics, then move state to the approved account model when ready. |
| Browse controls | Favorites and My Tags exist. Hidden plug-ins, pinned status, show/hide snoozed controls, Intel-only filtering and all-vendor collapse are absent. | Add the safe view preferences and controls; leave update snooze dependent on real status data. |
| Per-row action coverage | Move to Unused, Uninstall/Trash and Reveal require the native Companion. Snooze needs status integration. License Vault and Report a problem are not connected. | Wire local file actions only through the preview/confirmation/receipt protocol. Implement vault and feedback as their own reviewed surfaces. Keep controls clearly unavailable until their backends exist. |
| Whole-library Tools section | The AIMM Library has no PluginHub-style Tools section or equivalents for Install Manager, batch management, old-installer cleanup, duplicate review, License Vault, list sharing, profile comparison, PluginHub entitlement, Compatibility or Tag Manager. | Add the tool navigation and implement each tool against its own reviewed data/action contract; do not make inert buttons look active. |
| Vendor and layout details | Vendor cards and installer links are present, but vendor management/hiding, full count/filter semantics, status/compatibility pills and all original spacing/interaction details are not complete. | Continue a visual parity pass after the missing layout and status functions exist. |
| Reference-only formats | PluginHub supports AAX. The approved AIMM architecture deliberately excludes AAX from the scanner. | Keep this as a documented product difference unless the architecture is formally revised. Do not silently scan AAX. |

## Safe implementation order

1. Complete the browser Library parity surface first: View menu (Cards/List/Ledger), sorting, multi-select category/tag filtering, vendor collapse, hidden and pinned/favourite views, and the matching counts. Keep the current four-column card layout as the preferred default.
2. Implement status semantics and vendor adapters. Only then enable status counts, snooze and paid-upgrade badges.
3. Build the native Companion actions through the existing exact-preview, confirmation, WebAuthn and per-item-receipt contracts. This covers Move to Unused, Restore, Reveal, Trash, batch work, duplicate review and installer cleanup.
4. Add License Key Vault, compatibility, share/profile and entitlement surfaces under their separate privacy and account contracts.
5. Re-run the same manual-to-preview walk and get fresh independent review before changing any phase gate.

## Gate state

Foundation remains **NOT MET**. Stage 6 remains gated. This parity sweep does not close Stage 5, authorize any local file action, or approve production deployment. The development Worker’s earlier surgical passkey RP hotfix provenance remains a separate limitation recorded in the handover; do not treat this Pages/source review as resolving it. Synthetic non-production data remains the project default. No production deployment or separately gated external action occurred.
