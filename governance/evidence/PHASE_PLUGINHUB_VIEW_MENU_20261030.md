# PluginHub View menu parity slice — 2026-10-30

## Latest update — Category and note/rating display — 2026-10-30

The View menu has since gained **Show category labels** and **Show notes and ratings**, implemented in source commit `e86c9b1787b3289a66eaa2f83f5f21260bc25a43`, Library `index.html` blob `b56aad4f068d531a1cb930394073c72eef9f537d`. Jules passed source and visual/interaction review on synthetic preview deployment `52913ac6-09bb-4dde-9034-6ee29299ed0d` at desktop and 390px. The new controls work across Cards/List/Ledger; note/rating rendering is separate from tags/local marks. The sample has no saved notes or ratings, so populated badge styling is not reviewed. Preferences are memory-only in synthetic mode.

See [View display options parity slice](PHASE_PLUGINHUB_VIEW_DISPLAY_OPTIONS_20261030.md), which records exact evidence and remaining gaps.

## Change

Branch commit `fec3cf8c2482b1dd9aa105723ffe106b1038a33d`, `index.html` blob `d8c019b92ad3edee72384bc067211f53697bd3cc`, groups AIMM’s existing layout selector, sort selector, and Collapse/Expand vendor controls in a single **View** disclosure menu, matching the reference app’s toolbar grouping. Existing layout and sort values are unchanged: Cards/List/Ledger and Vendor/Product/Format/Version. The vendor buttons remain available only when Cards is selected.

The menu uses native `<details>/<summary>`, exposes a stable “View options” accessible name and synchronized expanded state, closes after layout/sort selection, on Escape, or outside pointerdown, and returns focus to View after keyboard close/selection. The menu has a 280px maximum and clamps its width for compact viewports.

This implements the supported grouping plus category-label and note/rating visibility, not the full PluginHub View menu. Appearance/brightness/text size, sidebar/top-tab navigation, key display preferences, Hidden and Collections remain incomplete. Vendor “newest/oldest” sorting still needs source-backed per-record timestamps.

## Development preview and Jules review

Cloudflare Pages deployment `1915928d-7ef2-40cd-9a24-0de6a2a871e7` is the successful preview deployment for the exact source commit, at [synthetic development preview](https://1915928d.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). Project configuration reports preview environment and production deployments disabled.

Jules passed source and final visual review on desktop, 390px, and 320px. Layout and Sort appear in the panel; Collapse/Expand appear in Cards mode. Selecting List and Product updated the existing table/sort, closed the menu, set `aria-expanded=false`, and returned focus. Escape returned focus; outside click closed without stealing focus. At 320px the panel clamps to 224px and all controls remain visible; the vendor-button labels wrap to two lines.

At 320px, document `scrollWidth` is 434px with the View menu both open and closed. This is existing page overflow outside the View menu; the menu itself ends within the viewport and does not add horizontal overflow. The 390px review has no View-menu fit issue.

The exact preview used only the in-memory synthetic sample. No real inventory, saved preferences, credentials, connected folders, scans or row actions were used. Jules reset layout to Cards, closed the menu, and restored the normal viewport. No automated tests were run.

## Current status

Foundation remains **NOT MET** and Stage 6 remains gated pending complete fresh exit evidence and fresh independent acceptance. The development Worker passkey RP fix remains a surgical patch rather than a reproducible build from branch source. No Worker or production deployment occurred.
