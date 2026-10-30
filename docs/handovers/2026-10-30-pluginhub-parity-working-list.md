# AIMM PluginHub parity — working list

Updated: 2026-10-30
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

## Tool activation — continue after the design review

Activate and review each tool as an individual slice. A control is complete only when its user-visible action works and its limits are clear.

- [x] **Install Manager — interactive sample batch preview.** The synthetic preview now opens an Install Manager with vendor filter/totals, per-vendor queue-all, row queueing, global queue-all, a batch panel, simulated single/batch results, Clear installed & failed, Start over, Download folder, and Done. Queue and simulate actions were exercised; the result count updates and reset/clear work. The folder action clearly says the browser preview cannot access a local folder. All rows and outcomes are synthetic; no plug-in folder, real inventory, vendor page, installer, or file was accessed. Preview: `https://233c2587.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` (2026-10-30).

- [ ] **Install Manager — direct installer flow:** add a verified local installer-download route and receipt UI before offering download/install actions. The account-backed manager can request a vendor webpage or ask the paired Companion to choose and confirm the vendor app; the existing API and Companion handle that confirmation. This hand-off is deployed in commit `cf88154` and its follow-up wording fix is included in `bf8a98d`. Keep direct download/install open: the account API has no `download_installer` action, the Companion action journal has no installer handler, and `VerifiedInstallerDownload` requires a trusted SHA-256 release digest. FabFilter’s adapter can parse an official macOS DMG URL but supplies no trusted digest. Do not claim downloaded/installed until a verified route, Companion action, and actual local receipt are implemented and verified.

- [x] **Share Plugin List — local export and guarded link interface.** Local export lets the user name a list, select a format, exclude publishers, include versions/categories, preview rows, copy TSV or download CSV. The deployed dialog now also shows expiry and account-link controls in a separate panel; synthetic mode labels these as sample-only and disables all account requests. Public-link visibility and missing passkey protection are stated plainly. Fixed the modal width inheritance so nested controls stay inset and aligned. Verified the deployed preview `https://9665bae4.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` on 2026-10-30; the export still shows the sample inventory and no account request was made.

- [ ] **Share Plugin List — activate account links.** Worker source now implements account-owned create/list/revoke routes and a public read-only page. It bounds and sanitises submitted rows, stores only an opaque token hash, enforces expiry, escapes public HTML, sets restrictive response headers, and now requires CSRF for cookie-authenticated create/revoke writes. Worker syntax and Wrangler bundling dry-run pass. The actual dev Worker deployment is still pending: Wrangler reported its stored Cloudflare token expired and the auth server could not be reached, so the running API does not yet have these routes. Retry the dev-only deploy, then verify create/list/revoke/public view without creating a link from real inventory. Passkey protection remains unavailable and must stay explicit.
- [x] **Plugin Compatibility — Mac architecture view (UI slice).** Replaced the declared-format checker prototype because it did not match PluginHub’s Mac compatibility view. The Library opens macOS target-version and target-architecture selectors with Ready / Check first / Intel only / No word yet / Unknown filters. AIMM does not inspect binaries and no source-backed compatibility evidence is connected, so all 12 synthetic plug-ins remain Unknown, unsupported buckets display “—” (not misleading zeroes), and selecting Intel only returns an explicit no-source-verified-results explanation. Preview checked at `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` on 2026-10-30: the modal opened, counts and uncertainty were visible, Intel only showed the evidence explanation. This UI slice is ready for review; it does not establish compatibility.

- [ ] **Plugin Compatibility — source-verified Mac architecture evidence.** Real Ready / Check first / Intel only / No word yet decisions remain open until each plug-in build has reliable evidence for target macOS version and Intel or Apple Silicon architecture. The Companion scanner records bundle name, bundle ID, version and AU/VST2/VST3/CLAP format; it does not inspect binary architecture. Do not infer readiness from format, vendor name, or synthetic sample data.

- [x] **PluginHub License.** Replaced the disabled control with an accessible information panel explaining that PluginHub app activation is separate from audio plug-in vendor keys, and linking to PluginHub’s official licence page. Verified open/close and destination in the deployed synthetic preview on 2026-10-30; the link opens only when the user chooses it.

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
