# AIMM PluginHub parity — working list

Updated: 2026-10-31
Branch: `codex/pluginhub-foundation`

This is the running checklist for the user’s screenshot-led reverse engineering. Keep every requested item here until it is verified in the app and explicitly reported review-ready. Work one item at a time. Preserve visible status dots and leave room around every control and tile.

## Review-ready

- [x] **Remove excluded tools from the sidebar.** Removed Batch Plugin Management, Remove Old Installers, Check for Duplicates, License Key Vault, and Compare Plugin Profiles, plus the stale note claiming Duplicate Review had the only connected hand-off. Confirmed the synthetic preview shows only the in-scope Install Manager, Share Plugin List, and PluginHub License tools. Preview: `https://4460cb34.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` (2026-10-30).

- [x] **Return to publisher cards from List view.** Corrected View panel placement so Layout is visible rather than clipped under the top bar. Verified List → “Back to Cards” → publisher tiles in the synthetic preview on 2026-10-30.
- [x] **Status scopes and Install Manager entry point — first slice.** The Updates scope shows its heading, count, and next-step guidance; empty results explain that no update observations does not mean everything is current. Status counts use red for updates, green for up-to-date, amber for manual check, and grey for unchecked. The sidebar Install Manager opens an account-backed status view with totals and a vendor-page queue. Verified in the approved branch preview on 2026-10-30. The actual snapshot shown had no update rows; stale/unchecked totals were presented. Download/install remain explicitly unavailable because the connected local verified-download flow is not yet wired to the app. Review this item before calling the manager complete.

## Remaining design work

- [x] **Match PluginHub’s clearer status scopes and colour the counts.** Selected status is unmistakable; Updates (red), Up to Date (green), Manual Check (amber), and Unchecked (grey) counts remain visible in their status colours. Each scope has a matching banner with its count and next step. Rechecked all four separately in the deployed synthetic preview on 2026-10-30: Updates shows red installed→available versions; Up to date shows the green formats only; Manual check names the vendor-release check; Unchecked says no vendor result exists. Mixed-format products retain their other format’s own version and dot. All shown rows remain explicitly synthetic, not live vendor status. Preview: `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic`.
- [x] In update rows, foreground the installed → available version pair. Available versions are red; confirmed current versions green; manual-check versions amber. Status dots remain as a secondary cue. Verified in the synthetic card preview.
- [x] Increase publisher and plug-in name size to match the PluginHub comparison. Verified in the synthetic card preview.
- [x] Align summary tiles, filter controls, counts, and cards at common grid edges; add breathing room to the inventory cards and format/version rows. Sidebar group spacing remains queued under the sidebar item.
- [x] Use the requested format colours consistently: VST blue, CLAP brown. AU/VST2 distinctions and status dots remain separate from format chips. Verified in the synthetic card preview.
- [x] Keep card and table views reachable after selecting a library/category/status scope. The View panel opens below the control so Layout stays visible; List view changes the shortcut to “Back to Cards,” and activating it restores publisher tiles. Verified in the synthetic preview on 2026-10-30.
- [x] **Align sidebar categories and counts, preserve breathing room.** Added consistent row spacing and minimum row height; count figures use a fixed, right-aligned column and remain visible on selected rows. Verified the full category list in the synthetic preview on 2026-10-30.
- [x] **Unify sidebar count badges — review-ready on the live domain.** Every numeric sidebar value in Status, Library and Categories now uses the same compact pill, including zeroes. Status colours remain red, green, amber and grey; counts stay in a fixed right-aligned column. Verified the synthetic preview and the normal Library view on `https://aimixmasters.com/` at build `2026-10-31.2` (2026-10-31).
- [x] **Fix collapsed-sidebar selection clipping — review-ready on the live domain.** Constrained the collapsed grid item, nav and buttons to the 64px column, and kept keyboard focus styling inside its edge. Verified the selected Updates row, zero-count badge and divider spacing in preview and on `https://aimixmasters.com/` at build `2026-10-31.3` (2026-10-31).
- [ ] **Standardise arrow and chevron size.** Kevin’s 2026-10-31 comparison shows inconsistent arrow sizes in the collapsed-sidebar toggle and View dropdown. Sweep the app’s navigation, dropdown, expand/collapse and disclosure arrows; use one consistent visual size and alignment.

## Tool activation — continue after the design review

Activate and review each tool as an individual slice. A control is complete only when its user-visible action works and its limits are clear. The screenshot-parity requirement is that retained tools open useful, clearly bounded workflows. Full account link sharing, automatic installer downloading, and source-backed binary compatibility are optional follow-on integrations unless Kevin prioritises them; do not count them as blockers to the parity pass.

- [x] **Install Manager — interactive sample batch preview.** Rechecked on the latest deployed branch preview. Vendor totals and queue-all work; queued records appear in the batch panel; simulated results update the receipt count; Clear installed & failed returns the view to an empty queue. Download folder and Done remain present. Visible copy says no file is downloaded or installed and real downloads require an approved release digest plus a verified local Companion receipt. All rows/outcomes are synthetic. Preview: `https://b6bdc6cc.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` (2026-10-30).

- [ ] **Optional follow-on — Install Manager direct installer download.** The interactive manager and vendor-page hand-off are the parity-level workflow. Direct downloads with a Companion receipt are a deeper integration: the account API has no `download_installer` action, the Companion action journal has no installer handler, and `VerifiedInstallerDownload` requires a trusted SHA-256 release digest. Keep this optional unless prioritised; never report a file downloaded or installed without a verified route and local receipt.

- [x] **Share Plugin List — local export and guarded link interface.** Local export lets the user name a list, select a format, exclude publishers, include versions/categories, preview rows, copy TSV or download CSV. The deployed dialog now also shows expiry and account-link controls in a separate panel; synthetic mode labels these as sample-only and disables all account requests. Public-link visibility and missing passkey protection are stated plainly. Fixed the modal width inheritance so nested controls stay inset and aligned. Verified the deployed preview `https://9665bae4.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` on 2026-10-30; the export still shows the sample inventory and no account request was made.

- [ ] **Optional follow-on — Share Plugin List public account links and passkey protection.** Local CSV/TSV export is the parity-level workflow and is active. The Worker source also contains account-owned create/list/revoke routes and a public read-only page, but deployment and passkey protection remain open. Keep this optional unless public URL sharing is prioritised; synthetic preview must not publish sample rows.
- [x] **Plugin Compatibility — Mac architecture view (UI slice).** Replaced the declared-format checker prototype because it did not match PluginHub’s Mac compatibility view. The Library opens macOS target-version and target-architecture selectors with Ready / Check first / Intel only / No word yet / Unknown filters. AIMM does not inspect binaries and no source-backed compatibility evidence is connected, so all 12 synthetic plug-ins remain Unknown, unsupported buckets display “—” (not misleading zeroes), and selecting Intel only returns an explicit no-source-verified-results explanation. Preview checked at `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` on 2026-10-30: the modal opened, counts and uncertainty were visible, Intel only showed the evidence explanation. This UI slice is ready for review; it does not establish compatibility.

- [ ] **Optional follow-on — source-verified Mac architecture evidence.** The Mac-specific compatibility view is active and accurately keeps rows Unknown when evidence is missing. To show Ready / Check first / Intel only / No word yet results for real plug-ins, each build needs reliable target macOS and Intel/Apple Silicon evidence. The Companion scanner records bundle name, bundle ID, version and AU/VST2/VST3/CLAP format; it does not inspect binary architecture. Keep the existing Unknown state unless this evidence workflow is prioritised.

- [x] **PluginHub License.** Replaced the disabled control with an accessible information panel explaining that PluginHub app activation is separate from audio plug-in vendor keys, and linking to PluginHub’s official licence page. Verified open/close and destination in the deployed synthetic preview on 2026-10-30; the link opens only when the user chooses it.

- [x] **iLok License Manager desktop link.** Added an active Tools entry using the app’s registered `ilm://` URL scheme. Local read-only inspection confirmed `/Applications/iLok License Manager.app` registers the `ilm` and `mylicenses` schemes. Verified the deployed synthetic preview exposes the link as “iLok License Manager” with destination `ilm://`; it is not activated during review, so launch remains user-initiated. Removed the anchor underline to match the other sidebar items. Review deployment: `https://3cb3b170.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` (2026-10-31).

## Manual and official-source sweep (2026-10-30)

The official Windows manual was reviewed for the shared dashboard, statuses, Install Manager, Share Plugin List, and Plugin Compatibility workflows; the official FAQ was cross-checked for Mac update/status behavior. Kevin's supplied macOS screenshots remain the visual source of truth for the Mac UI. References: [PluginHub Windows manual](https://www.pluginhubapp.com/manual-windows), [PluginHub FAQ](https://www.pluginhubapp.com/faq), and [PluginHub product page](https://www.pluginhubapp.com/).

The installed macOS 2.0.12 manual was also checked read-only at `/Applications/PluginHub.app/Contents/Resources/manual.html` against Kevin's screenshots. Its concrete Mac workflow confirms the same status grouping and Install Manager layout, while the screenshots/manual supply the macOS installer hand-off details. Status semantics from the Mac manual: Updates count plug-ins (not vendors); Up to Date is successfully checked/current; Manual Check supports a dated “Mark up to date” action and reset/export of marks; Unchecked still shows installed version, formats and vendor website. Compatibility’s Mac-specific purpose is Intel-only/Rosetta readiness. No plugin rows or local inventory names from the reference app were copied.

- Status views must behave as separate queues with live counts and clear interpretation. Updates Available shows installed and current versions side by side; Up to Date means the checker confirmed current; Manual Check requires the person to visit the vendor/installer hub or mark their own check; Unchecked means no checker is available. Keep status-colored figures and dots: red, green, amber, grey.
- Install Manager’s reference workflow is row download/install or multi-select queue, vendor grouping, queue all, visible batch progress, and a receipt. It only offers openly published vendor installers; login-gated, vendor-app-only, and demo builds are excluded. Nothing should run without the user's action. AIMM's sample manager is an interactive simulation; the real verified-download and local installer hand-off is still open.
- Share Plugin List’s reference workflow accepts the whole inventory or supported DAW session files, requires a list name, offers expiry and optional passkey, format/vendor/version filters, and exports as CSV, PDF, or a spreadsheet. AIMM has local CSV/TSV export and a guarded account-link panel; account sharing remains open until backend routes are deployed and passkey protection is implemented.
- Plugin Compatibility must report scoped evidence, not a vague “compatible” claim. The PluginHub Windows manual describes a target operating system, plug-in build information and community observations, with Ready / Check first / Unknown buckets. The Mac reference additionally calls out Intel-only builds and Rosetta readiness. AIMM's current Mac Compatibility screen exposes target macOS version and CPU architecture filters but labels every row Unknown until reliable architecture and target support evidence exists. Its current scanner does not inspect plug-in binaries. Do not infer Intel-only, Ready or host loading from format overlap, vendor name or synthetic rows.
- The optional PluginHub License sidebar item is a link/information destination about the PluginHub app licence. It is distinct from vendor plug-in keys. The user excluded License Key Vault from AIMM scope.

## Explicitly out of scope (per Kevin)

- Batch Plugin Management
- Remove Old Installers
- Check for Duplicates
- License Key Vault
- Compare Plugin Profiles

## Review protocol

1. Work one checklist item at a time and keep the others queued.
2. Inspect the actual preview, correct the implementation, and verify the visible result.
3. Mark an item review-ready only after that verification. Report what changed, how to find it in the preview, and any capability that remains unavailable.
4. Do not treat synthetic sample rows or old account snapshots as current vendor status.
