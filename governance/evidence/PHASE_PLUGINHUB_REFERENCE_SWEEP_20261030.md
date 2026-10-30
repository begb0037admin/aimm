# PluginHub reference-app and manual sweep — 2026-10-30

## Scope

Read-only inspection of the already-open PluginHub 2.0.12 app and its installed manual/source at `/Applications/PluginHub.app/Contents/Resources/`, compared with AIMM branch `codex/pluginhub-foundation` at `fe70cc4d6378aff346ac553e3deff7bdd73e5d89`. The app’s View menu and one plugin row action menu were opened for reference. No tool workflow, filesystem action, scan, export, installer, share or vault operation was started. The app’s accessibility view included its current local vendor/plugin names and counts; none were copied into the branch, reports or development preview.

AIMM visual evidence uses only the opt-in synthetic development preview. No real inventory was uploaded or used for the visual pass.

## What the reference app exposes

The View menu groups appearance, brightness and text size; Icon, Ledger and List layouts; sidebar or top-tab navigation; vendor sorting; category labels; note/rating badges; license-key marks; Hidden; and saved Collections. The manual describes Icon as vendor cards, List as full-width vendor blocks with multiple plugins per line, and Ledger as one row per vendor with status and format counts. Ledger headings sort their own columns and selecting a vendor expands its plugins.

The top bar keeps format filtering, Folders, My Tags, search, View and Refresh together. The manual’s three vendor sort modes are A→Z, newest install/update first and oldest first. The menu and manual also establish status tabs, paid-upgrade and Intel-only controls, categories, tags, Favorites/Pinned, Hidden, and a separate flat All Plugins view.

The row menu is version-aware and contains category/tag/note-rating, status mark, Move to Unused, Uninstall to Trash, Reveal, rescan, copy name, vendor Installer Hub/website links, License Key Vault, keep-version, snooze and report actions. Filesystem actions are reversible or confirmed in the native app; this does not authorize AIMM to bypass its exact-preview/confirmation/receipt contract.

The manual’s whole-library tool contracts are richer than their labels: batch management builds a multi-vendor selection and reports per-item outcomes; Install Manager downloads from vendor sources and opens vendor installers, with a batch queue and receipt; Remove Old Installers limits review to Downloads and moves selected items to Trash; duplicate review distinguishes active and (Unused) copies; list sharing has field/format scope and expiry; profile comparison has five difference buckets; License Key Vault is local Keychain storage with user presence. AIMM’s current matrix remains authoritative for which API/Companion contracts and UI surfaces exist.

## Installed/updated date finding

PluginHub’s installed scanner source derives the menu date from filesystem metadata for the matching plugin. It takes the maximum of `mtime` and `ctime` across the bundle directory, `Contents/Info.plist`, and files in `Contents/MacOS`. It separately uses `mtime` only for a content-change signal because metadata/signature touches can move `ctime` without a true update. The menu displays the per-plugin date only when it finds a matching plugin; it does not borrow a vendor-level date.

AIMM’s branch-source `PluginRecord` contains no per-record file timestamp. `ScanGenerationSummary.startedAt/completedAt` describes the scan, not the plugin’s install/update time, and the inventory API currently has a strict record-field allowlist without a timestamp. Therefore this reference sweep does **not** make a date displayable in AIMM. Do not substitute scan time or copy a date from the separate PluginHub app. A later implementation needs a reviewed, optional per-record field that is captured by the Companion and carried through a versioned API/library contract, with migration and synthetic-only validation. Keep the distinction between a filesystem-derived “touched” date and a verified install date explicit.

## Current implementation and review

The AIMM row action menu source is Library `index.html` blob `60d03fdfb2585c3359f8bcee59dbeb2327ab738c`. Jules passed its desktop review at [synthetic deployment 38bed09a](https://38bed09a.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic) and the 390×844 narrow review. At narrow width it is 272px wide, fits horizontally, keeps labels/disabled reasons readable, and scrolls internally to expose Snooze and Report. No action was selected and no scan started.

The menu still lacks the source-backed date line. Filesystem actions and disconnected service actions remain disabled with reasons. See [row-menu review](PHASE_PLUGINHUB_ROW_MENU_REVIEW_20261030.md) and the [tool contract matrix](PHASE_PLUGINHUB_TOOL_CONTRACT_MATRIX_20261030.md).

## Safe next sequence

1. Add a per-record filesystem touch timestamp to the Companion and a versioned API/library read model only after the privacy and schema contract is reviewed; use synthetic fixture bundles for all validation. Do not upload actual inventory during the work.
2. Implement the matching row-menu date display only after the full generation path returns that field. Retain “no date” when absent or unmatched.
3. Continue the manual sweep feature-by-feature, implementing only after the supporting data and reviewed Companion/API operation exists. Preserve exact-preview, confirmation and per-item receipt for local actions.
4. Keep URL dispatch open: the isolated Companion is packaged and visually reviewed, but Launch Services dispatch remains unverified. Do not install it or change the default handler for this verification.

Foundation remains **NOT MET**; Stage 6 remains gated pending fresh complete exit evidence and independent acceptance. The development Worker passkey RP fix is still a surgical patch, not a reproducible build from branch source.
