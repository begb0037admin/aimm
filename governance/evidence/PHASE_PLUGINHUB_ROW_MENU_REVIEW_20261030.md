# Plugin row context menu visual review — 2026-10-30

## Preview and review

The existing product action menu in Library source blob `60d03fdfb2585c3359f8bcee59dbeb2327ab738c` was visually reviewed by Jules in the opt-in synthetic preview at [deployment 38bed09a](https://38bed09a.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). Review opened the synthetic Meter Bloom menu only. No action was selected and no scan was started.

At desktop and at 390×844, the menu presents Category, Tags, Note & rating, version-bound Mark as up to date, Move to Unused, Uninstall (Move to Trash), Reveal in Finder, Hide, Rescan plugin folders, Copy plugin name, Installer Hub, Website, License Key Vault, Keep this version, Snooze and Report a problem. Move/Uninstall/Reveal, License Key Vault, Snooze and Report are visibly muted/disabled with reasons. At narrow width the menu is 272px wide, stays within the viewport, and its 661px content scrolls inside the 606px viewport so Snooze and Report remain reachable. Labels and disabled reasons stay readable. Jules passed both desktop and narrow reviews. No action was selected and no scan was started.

## Remaining parity

The user-provided PluginHub menu screenshot includes a header line with “Installed or updated” and a date. The current Library row data has no per-record file timestamp. The reference PluginHub scanner derives its menu date from max(mtime, ctime) over the bundle, Info.plist and MacOS files; AIMM’s scan generation time is not an install/update date. The row must remain date-free until an optional per-record timestamp is carried by a reviewed, versioned Companion/API/library contract. Never substitute scan time or borrow an unrelated vendor date. See the [manual/source sweep](PHASE_PLUGINHUB_REFERENCE_SWEEP_20261030.md), blob `SWEEP_BLOB`.

The synthetic preview review read no real inventory. The separate read-only reference-app inspection exposed the app’s already-rendered local vendor/plugin names and counts in its accessibility view; none were copied to project records or sent to the preview. No scan or file operation was run. Foundation remains **NOT MET**; Stage 6 remains gated until all exit evidence is complete and fresh independent review accepts it. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only.
