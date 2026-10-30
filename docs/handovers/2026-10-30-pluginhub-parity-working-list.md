# AIMM PluginHub parity — working list

Updated: 2026-10-30
Branch: `codex/pluginhub-foundation`

This is the running checklist for the user’s screenshot-led reverse engineering. Keep every requested item here until it is verified in the app and explicitly reported review-ready. Work one item at a time. Preserve visible status dots and leave room around every control and tile.

## Review-ready

- [x] **Remove excluded tools from the sidebar.** Removed Batch Plugin Management, Remove Old Installers, Check for Duplicates, License Key Vault, and Compare Plugin Profiles, plus the stale note claiming Duplicate Review had the only connected hand-off. Confirmed the synthetic preview shows only the in-scope Install Manager, Share Plugin List, and PluginHub License tools. Preview: `https://4460cb34.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` (2026-10-30).

- [x] **Return to publisher cards from List view.** Corrected View panel placement so Layout is visible rather than clipped under the top bar. Verified List → “Back to Cards” → publisher tiles in the synthetic preview on 2026-10-30.
- [x] **Status scopes and Install Manager entry point — first slice.** The Updates scope shows its heading, count, and next-step guidance; empty results explain that no update observations does not mean everything is current. Status counts use red for updates, green for up-to-date, amber for manual check, and grey for unchecked. The sidebar Install Manager opens an account-backed status view with totals and a vendor-page queue. Verified in the approved branch preview on 2026-10-30. The actual snapshot shown had no update rows; stale/unchecked totals were presented. Download/install remain explicitly unavailable because the connected local verified-download flow is not yet wired to the app. Review this item before calling the manager complete.

## Remaining design work

- [x] **Match PluginHub’s clearer status scopes and colour the counts.** Selected status is unmistakable; Updates (red), Up to Date (green), Manual Check (amber), and Unchecked (grey) counts remain visible in their status colours. Each scope has a matching colour banner with its count and next-step/interpretation guidance. Verified Updates, Up to Date, Manual Check, and Unchecked separately in the synthetic preview on 2026-10-30. Mixed-format products retain per-format versions and status dots; sample data is clearly identified and never presented as live vendor status.
- [x] In update rows, foreground the installed → available version pair. Available versions are red; confirmed current versions green; manual-check versions amber. Status dots remain as a secondary cue. Verified in the synthetic card preview.
- [x] Increase publisher and plug-in name size to match the PluginHub comparison. Verified in the synthetic card preview.
- [x] Align summary tiles, filter controls, counts, and cards at common grid edges; add breathing room to the inventory cards and format/version rows. Sidebar group spacing remains queued under the sidebar item.
- [x] Use the requested format colours consistently: VST blue, CLAP brown. AU/VST2 distinctions and status dots remain separate from format chips. Verified in the synthetic card preview.
- [x] Keep card and table views reachable after selecting a library/category/status scope. The View panel opens below the control so Layout stays visible; List view changes the shortcut to “Back to Cards,” and activating it restores publisher tiles. Verified in the synthetic preview on 2026-10-30.
- [x] **Align sidebar categories and counts, preserve breathing room.** Added consistent row spacing and minimum row height; count figures use a fixed, right-aligned column and remain visible on selected rows. Verified the full category list in the synthetic preview on 2026-10-30.

## Tool activation — continue after the design review

Activate and review each tool as an individual slice. A control is complete only when its user-visible action works and its limits are clear.

- [ ] **Install Manager — direct installer flow:** add a verified local installer-download route and receipt UI before offering download/install actions. The account-backed manager can request a vendor webpage or ask the paired Companion to choose and confirm the vendor app; the existing API and Companion handle that confirmation. This hand-off is deployed in commit `cf88154` and its follow-up wording fix is included in `bf8a98d`. Keep direct download/install open: the account API has no `download_installer` action, the Companion action journal has no installer handler, and `VerifiedInstallerDownload` requires a trusted SHA-256 release digest. FabFilter’s adapter can parse an official macOS DMG URL but supplies no trusted digest. Do not claim downloaded/installed until a verified route, Companion action, and actual local receipt are implemented and verified.

- [ ] **Share Plugin List — full account share:** implement an expiring, optionally passkey-protected link with user-controlled label, format scope, fields and publisher exclusions; include revocation and a public read-only view. The local export slice is active and review-ready: filter formats, exclude publishers, choose versions/categories, preview rows, copy TSV for Sheets or download CSV. It performs no network request. Verified that selecting CLAP yields Tapeform and Amber Delay (2 rows) in the deployed synthetic preview `https://4d315dcc.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic` on 2026-10-30. Public link, recipient/expiry, passkey protection, revocation and shared web view remain unimplemented.
- [ ] **Plugin Compatibility:** the Library item remains disabled. Activate it with clear compatibility evidence and useful actions; do not present a guess as verified compatibility.

- [x] **PluginHub License.** Replaced the disabled control with an accessible information panel explaining that PluginHub app activation is separate from audio plug-in vendor keys, and linking to PluginHub’s official licence page. Verified open/close and destination in the deployed synthetic preview on 2026-10-30; the link opens only when the user chooses it.

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
