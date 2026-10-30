# Plugin row context menu visual review — 2026-10-30

## Preview and review

The existing product action menu in Library source blob `60d03fdfb2585c3359f8bcee59dbeb2327ab738c` was visually reviewed by Jules in the opt-in synthetic preview at [deployment 38bed09a](https://38bed09a.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). Review opened the synthetic Meter Bloom menu only. No action was selected and no scan was started.

At desktop, the menu presents Category, Tags, Note & rating, version-bound Mark as up to date, Move to Unused, Uninstall (Move to Trash), Reveal in Finder, Hide, Rescan plugin folders, Copy plugin name, Installer Hub, Website, License Key Vault, Keep this version, Snooze and Report a problem. Move/Uninstall/Reveal, License Key Vault, Snooze and Report are visibly muted/disabled with reasons. Lower entries are below the initial viewport but reachable with the menu’s internal scroll. Desktop review passed. Narrow/mobile behavior remains unverified.

## Remaining parity

The user-provided PluginHub menu screenshot includes a header line with “Installed or updated” and a date. The current Library row data has no source-backed install/update timestamp for this menu. Do not invent a date; only add that detail when a real local inventory generation provides the corresponding timestamp. The menu’s narrow-width layout has not been reviewed.

No plug-in folders, real local inventory, saved scan, path or credential were read by this synthetic menu review. Foundation remains **NOT MET**; Stage 6 remains gated until all exit evidence is complete and fresh independent review accepts it. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only.
