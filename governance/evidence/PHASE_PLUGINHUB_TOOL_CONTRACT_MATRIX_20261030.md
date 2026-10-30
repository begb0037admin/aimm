# PluginHub tool and browse contract matrix — 2026-10-30

## Scope and source basis

This manual-to-source comparison uses the installed PluginHub manual at `/Applications/PluginHub.app/Contents/Resources/manual.html` (PluginHub 2.0.12) and AIMM branch `codex/pluginhub-foundation`, now at `ebf9316968d4d7ec808d421c01d6ba96ee027c42`. AIMM Library source is `index.html`, blob `de438302c8791668549298893b3c3579cdf60cdc`. The new All Plugins destination was Jules-reviewed on the development-only [preview](https://20379065.aimm-pluginhub-foundation-dev.pages.dev/); Pages deployment `20379065-736f-4171-a291-3dfbb568192d` succeeded. The earlier VST control remains in its separately reviewed [preview](https://ce77fbf0.aimm-pluginhub-foundation-dev.pages.dev/).

PluginHub’s sidebar has four Status groups, optional Pinned, six Tools plus PluginHub License, Library entries for All Plugins, Plugin Compatibility and Tag Manager, categories and counts. The manual also covers Check for Duplicates as a separate menu-bar tool. It describes Cards/List/Ledger layouts; vendor sort A→Z, newest install/update first and oldest first; sortable Ledger headings; and a separate flat All Plugins table.

## Browse and row-action mapping

| PluginHub surface | AIMM branch state | Next parity work |
|---|---|---|
| Four-column vendor cards | Present; cards are grouped by vendor, with an adaptive grid up to four columns. | Compare density, alignment, and card actions against a populated synthetic-only fixture. The current preview remains empty. |
| Cards, List and Ledger | The current Library source has all three selectors. The older parity checkpoint saying List/Ledger were wholly missing is stale. | Compare exact grouping, columns and interactions with the manual; a selector alone does not establish full parity. |
| Sort | AIMM offers Vendor, Product, Format and Version. PluginHub offers vendor A→Z, newest install/update first and oldest first; Ledger columns are independently sortable. | Add only when install/update timestamps exist; adapt Ledger to meaningful, sortable status/format columns. Current options differ from PluginHub’s semantics. |
| All Plugins | A separate Library > All Plugins button now opens the existing List row-table mode; it preserves current filters and leaves Cards as default. Jules visually passed the navigation on the exact empty preview. The rows are product-grouped, and the manual’s status semantics/column are still absent, so full flat-table parity is not met. | Complete the row projection with generation-backed status and manual columns/behavior. The reviewed preview had zero products/folders, so populated row appearance remains unreviewed. |
| Plugin Compatibility | Present in the user-provided PluginHub sidebar reference. No matching Plugin Compatibility page or navigation entry was found in current AIMM `index.html`. | Inspect the actual PluginHub compatibility view and its supported host/format data before implementing. Do not invent compatibility rules. |
| Status | AIMM sidebar shows Updates Available, Up to Date and Manual Check disabled; Unchecked is absent. The Companion has Manual Check fallback and selected vendor checks. The Library API supports status observations, but this Library page does not consume a complete generation-bound status projection. | Connect displayed observations and preferences to the same inventory generation, compute matching counts, and distinguish Unchecked from Manual Check. Never fabricate counts. |
| Categories, tags, Note & rating | Category, tag and note actions are browser-local in the Library. | Preserve their local scope unless a separately reviewed account-sync contract is used. |
| Mark up to date, Keep, Hide, Rescan, Copy name | Local mark/keep/hide, selected-root rescan and copy-name actions are present. A local mark is not vendor verification. | Keep marks version-bound and label them local. |
| Move to Unused, Uninstall to Trash, Reveal in Finder | Visible but disabled in the web row menu. The menu names the native Companion requirement. The Companion/action API has exact-preview, owner-confirmation and receipt patterns. | Connect through that reviewed action flow; no browser-only filesystem action. |
| Installer Hub and Website | Vendor links appear on cards and row menus. | Keep official destination mapping; keep Installer Hub and vendor Website clearly labelled as different destinations. |
| Snooze, problem report, vendor-key vault | Snooze and report are disabled in the preview; vault is not connected. | Snooze needs version-bound status/preferences; report needs a service owner; vendor keys need a local Keychain vault, separate from the device credential. |

## Whole-library Tools contract map

| PluginHub tool | AIMM implementation observed | Next implementation boundary |
|---|---|---|
| Batch Plugin Management | No complete Library tool surface or multi-item selection/receipt flow. Companion/action API patterns cover individual local operations. | Extend exact-preview / confirmation / receipt to a reviewed selected set, with per-item outcomes and safe partial-failure handling. |
| Install Manager | Companion contains a verified installer-download component; a complete user-facing queue/install/receipt flow was not verified. | Keep download/install local, verify vendor source and artifact, require an explicit install choice, then rescan. |
| Check for Duplicates | Companion source already renders a read-only local Duplicate Review backed by `DuplicateAnalyzer`. It groups matching vendor bundle IDs, same format and distinct standardized paths. Paths stay in Companion; no Library-page hand-off is connected. | Add a clear Library-to-Companion entry point if needed. Keep results informational; duplicates never authorize cleanup. |
| Remove Old Installers | No cleanup surface was verified. | Companion-only scan of a user-chosen folder, exact path/name/size/age preview, item selection, separate confirmation and receipt. Never infer arbitrary Downloads files are safe to remove. |
| Share Plugin List | Account API share routes/tables exist, but no complete PluginHub-style share composer/import flow is connected to this Library page. | Wire only after remote account-isolation and recovery gates pass fresh independent review. Define shared fields, expiry, revocation and exclusions; never share paths or credentials. |
| Compare Plugin Profiles | Account API comparison routes/tables exist, but a complete profile-sharing/diff flow is not connected to this Library page. | Bind comparison to account-owned devices and inventory generations; define fields and share lifetime. Keep paths and secrets local and clear remote isolation/recovery gates first. |
| License Key Vault | No vendor-key vault UI/storage flow was verified. The Companion’s device credential Keychain is not a vendor-key vault. | Implement a separate local Keychain-backed flow; never place vendor keys in the website, Worker, inventory or share payloads. |
| PluginHub License | PluginHub product licensing is not an AIMM capability. | Keep PluginHub activation/licensing out of AIMM. |

## Safe implementation order

1. The Library > All Plugins destination is now visible and switches to List while preserving filters. Complete its row/status semantics and compare populated layout against PluginHub; the reviewed preview was empty. Cards/List/Ledger and AIMM’s four sort selectors exist, but grouping and sort semantics remain different or unverified.
2. Connect the Library status sidebar to the existing generation-bound API observations and preferences. Include an honest Unchecked state and reconciled counts.
3. Add a Library entry point to the Companion’s already-present local Duplicate Review; preserve path locality and informational-only results.
4. Build batch local actions and installer/cleanup surfaces through Companion exact-preview and receipt flows.
5. Keep API share/profile UI behind remote isolation, recovery and fresh independent acceptance. Design a separate local vendor-key vault. Keep PluginHub licensing out of scope.

## Evidence and limits

- The installed 2.0.12 manual says Tools appear in the default sidebar and menu bar; the old top-tab layout has a Tools button/window. AIMM currently has no equivalent whole-library Tools navigation in this Library page. Plugin Compatibility is an additional missing Library destination visible in the user-provided PluginHub screenshot.
- Current branch API README and source contain status, share and profile routes. This does not establish those features as usable from the current PluginHub-style Library page or as remotely validated.
- Jules passed the new All Plugins navigation visually at deployment `20379065` from source `ebf9316968d4d7ec808d421c01d6ba96ee027c42`; it fits the sidebar, has distinct active styling, and leaves Cards as the initial layout. The preview showed zero products and zero folders, so populated rows were not assessed.
- No plug-in folders were scanned and none of their metadata was uploaded. Synthetic non-production data only.
- No automated tests, Worker deployment, production deployment, install, deletion, share or external action occurred in this slice.
- Foundation remains **NOT MET**. Stage 6 remains gated pending fresh exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source.
