# PluginHub VST control and tool-surface sweep — 2026-10-30

## VST control checkpoint

Branch `codex/pluginhub-foundation` source commit `f550878fa1e29910c81881534d8c8b6a2bbb97ac` uses `index.html` blob `b35f0fd495954eb4c5c28565394801ccbe747445`. Development Pages deployment `ce77fbf0-8908-41ac-a758-c502c003ac4e` succeeded at https://ce77fbf0.aimm-pluginhub-foundation-dev.pages.dev/.

Jules passed the exact source and final desktop visual review. The VST popover has three compact, readable rows with a left label and right-aligned selected state. Playwright’s computed role/name lookup resolves the VST3 button by both its dynamic accessible name and visible label. The CUA accessibility snapshot omits the three button names. This points to a snapshot-bridge limitation; it does not establish that a native screen reader omits the names. The source finding is closed; do not churn the markup to accommodate the CUA snapshot.

On the empty development preview, manual interaction confirmed:
- The tilde sequence cycles All → AU → VST (both formats) → VST3 → VST2 → CLAP → All. AAX remains excluded by the approved scanner architecture.
- Normal click selects one VST mode and replaces the prior selection.
- Shift-clicking VST2 while VST3 is selected combines both; Shift-clicking the fully selected VST aggregate clears both.
- Arrow Down from the VST aggregate option selects VST3 and moves focus; Escape closes the menu and returns focus to its trigger.
- The preview was returned to All formats. It contained 0 installed products and 0 connected folders. No scan, inventory upload, automated test, Worker deployment or production action occurred.

## Manual tool sweep

The installed PluginHub 2.0.12 manual lists these Tools: Batch Plugin Management, Install Manager, Remove Old Installers, Check for Duplicates, License Key Vault, Share Plugin List, Compare Plugin Profiles and PluginHub License. Library navigation separately includes All Plugins, Plugin Compatibility and Tag Manager. The per-plugin menu includes category and tags, note/rating, update mark, Move to Unused, uninstall to Trash, Finder reveal, rescan, copy name, License Vault, keep-version, snooze and problem-report actions.

Current AIMM support is intentionally bounded:
- The browser Library has a partial row menu for local category/tag/note/marker/hide/rescan/copy actions and official vendor/Installer Hub links. Filesystem actions and unconnected services remain disabled.
- The Companion has a read-only duplicate analyzer. It groups only records sharing a non-empty bundle identifier and format, deduplicates standardized paths, keeps paths local, and does not authorize a file action. There is no verified Library/whole-library tool entry point for it.
- A verified installer-download component exists in Companion source, but no complete PluginHub-style Install Manager surface is connected to the Library preview.
- No complete batch-management, old-installer cleanup, License Key Vault, share-list, profile-comparison or PluginHub-license surface was verified in the current Library preview.
- Intel-only filtering still lacks architecture metadata. Update, up-to-date and snooze views remain disabled in the browser because the page does not consume the required complete vendor observations and preference state.

The local PluginHub app window was not available to the computer-use session in this pass; the tool inventory above was taken from its installed manual, and current AIMM surfaces were inspected in branch source and the empty development preview. This is a product-parity checkpoint, not Foundation evidence.

## Next work

1. Map each whole-library tool to its approved AIMM owner and existing backend contract before adding navigation or controls. Start with a read-only Companion duplicate-review entry that keeps paths local; do not present it as a web service until the generation-bound account contract is reviewed.
2. Continue the manual sweep across row menus, vendor actions, Cards/List/Ledger layouts, sorting, folders, status and compatibility. Implement only actions that have reviewed, working backends; keep filesystem changes behind exact preview, owner confirmation and receipt.
3. Add Intel-only or snooze/status controls only after their required metadata and observations are available.

Foundation remains **NOT MET**. Stage 6 remains gated until all exit evidence is complete and a fresh independent review accepts it. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Use synthetic non-production data only.
