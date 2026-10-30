# AIMM PluginHub parity — working list

Updated: 2026-10-30
Branch: `codex/pluginhub-foundation`

This is the running checklist for the user’s screenshot-led reverse engineering. Keep every requested item here until it is verified in the app and explicitly reported review-ready. Work one item at a time. Preserve visible status dots and leave room around every control and tile.

## Review-ready

- [x] **Return to publisher cards from List view.** Corrected View panel placement so Layout is visible rather than clipped under the top bar. Verified List → “Back to Cards” → publisher tiles in the synthetic preview on 2026-10-30.
- [x] **Status scopes and Install Manager entry point — first slice.** The Updates scope shows its heading, count, and next-step guidance; empty results explain that no update observations does not mean everything is current. Status counts use red for updates, green for up-to-date, amber for manual check, and grey for unchecked. The sidebar Install Manager opens an account-backed status view with totals and a vendor-page queue. Verified in the approved branch preview on 2026-10-30. The actual snapshot shown had no update rows; stale/unchecked totals were presented. Download/install remain explicitly unavailable because the connected local verified-download flow is not yet wired to the app. Review this item before calling the manager complete.

## Remaining design work

- [ ] Match PluginHub’s clearer status scopes: make the selected status unmistakable, keep each count visible and color it by status, and make Updates / Up to Date / Manual Check / Unchecked explain what the user is seeing and the next action.
- [x] In update rows, foreground the installed → available version pair. Available versions are red; confirmed current versions green; manual-check versions amber. Status dots remain as a secondary cue. Verified in the synthetic card preview.
- [x] Increase publisher and plug-in name size to match the PluginHub comparison. Verified in the synthetic card preview.
- [x] Align summary tiles, filter controls, counts, and cards at common grid edges; add breathing room to the inventory cards and format/version rows. Sidebar group spacing remains queued under the sidebar item.
- [x] Use the requested format colours consistently: VST blue, CLAP brown. AU/VST2 distinctions and status dots remain separate from format chips. Verified in the synthetic card preview.
- [x] Keep card and table views reachable after selecting a library/category/status scope. The View panel opens below the control so Layout stays visible; List view changes the shortcut to “Back to Cards,” and activating it restores publisher tiles. Verified in the synthetic preview on 2026-10-30.
- [x] **Align sidebar categories and counts, preserve breathing room.** Added consistent row spacing and minimum row height; count figures use a fixed, right-aligned column and remain visible on selected rows. Verified the full category list in the synthetic preview on 2026-10-30.

## Tool activation — continue after the design review

Activate and review each tool as an individual slice. A control is complete only when its user-visible action works and its limits are clear.

- [ ] **Install Manager:** connect a verified local installer-download workflow and receipt UI before offering download/install actions. The present status and vendor-page queue slice is review-ready; do not claim installer actions work.
- [ ] **Batch Plugin Management:** provide working selection and batch actions with per-item results.
- [ ] **Remove Old Installers:** provide a reviewed local preview, confirmation and recoverable receipt flow.
- [ ] **Check for Duplicates:** verify and clearly present the existing read-only Companion hand-off.
- [ ] **License Key Vault:** implement local protected key storage and its user flow.
- [ ] **Share Plugin List:** implement reviewed, user-controlled sharing and recipient/expiry choices.
- [ ] **Compare Plugin Profiles:** implement profile selection and readable differences.
- [ ] **PluginHub License:** replace the dead control with a clear, working AIMM explanation or destination; do not imply AIMM owns PluginHub licensing.

## Review protocol

1. Work one checklist item at a time and keep the others queued.
2. Inspect the actual preview, correct the implementation, and verify the visible result.
3. Mark an item review-ready only after that verification. Report what changed, how to find it in the preview, and any capability that remains unavailable.
4. Do not treat synthetic sample rows or old account snapshots as current vendor status.
