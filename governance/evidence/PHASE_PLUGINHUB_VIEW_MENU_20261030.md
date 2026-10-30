# PluginHub View menu parity slice — 2026-10-30

## Latest update — Larger publisher and plug-in names — 2026-10-30

Source commit `75655b4b2f327e3fff6d52c30f8512c34d1ffc9c`, Library blob `f9868f5392be7633e12da8520f05b05ed0c66071`, raises vendor headings from 11px to 13px and plug-in names from 10px to 12px across Cards/List/Ledger, still following the Text size setting. Jules passed source and visual review on [synthetic deployment aed2938c](https://aed2938c.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), desktop and 390×844. Four balanced columns remain at desktop; narrow cards stack to one column with names readable and action/version controls aligned. The page retains 44px shell overflow outside the card grid. See [typography evidence](PHASE_PLUGINHUB_VISUAL_PARITY_NAMES_20261030.md).

## Historical update — Hidden visibility — 2026-10-30

The View menu now includes Show hidden plug-ins, which adds locally hidden rows to the current scope and filters, shows a Hidden badge, and leaves Hidden scope hidden-only. Normal preferences persist locally; synthetic hide/show is memory-only and limited to the hidden field. Jules passed source and synthetic desktop interaction on deployment 6b55072b: hidden rows disappeared, reappeared with badges and showed alone in Hidden scope. Search, VST3 and category filters composed correctly. Tags were unavailable in the fixture. See [Hidden View evidence](PHASE_PLUGINHUB_VIEW_HIDDEN_20261030.md).

## Historical update — Collections — 2026-10-30

The View menu now supports named category/tag Collections, source commit `e4edbd07746529486af730fcfd40e0853ab15549`, Library blob `439450e31aa71e37daf7623436f533ff793f60c3`. Jules passed source and interaction review at synthetic preview deployment `7a099e45-4e28-4c40-9e5f-c4322c251df2`, desktop and 390px. Save/apply/placeholder/remove work, including confirmation, feedback and focus return. Synthetic state is in memory only; the temporary collection was removed. See [Collections parity evidence](PHASE_PLUGINHUB_VIEW_COLLECTIONS_20261030.md).

## Brightness and typography size — 2026-10-30

Brightness and typography-only Text size are supported in source commit `82c886d690eaaf41560af83cff4155a769cc553d`, Library blob `a535b0a5830ad3449e1f27f14238c6f4685f5997`. See [brightness/text-size parity evidence](PHASE_PLUGINHUB_VIEW_BRIGHTNESS_TEXT_20261030.md).

## Historical update — Category and note/rating display — 2026-10-30

The View menu has since gained **Show category labels** and **Show notes and ratings**, implemented in source commit `e86c9b1787b3289a66eaa2f83f5f21260bc25a43`, Library `index.html` blob `b56aad4f068d531a1cb930394073c72eef9f537d`. Jules passed source and visual/interaction review on synthetic preview deployment `52913ac6-09bb-4dde-9034-6ee29299ed0d` at desktop and 390px. The new controls work across Cards/List/Ledger; note/rating rendering is separate from tags/local marks. The sample has no saved notes or ratings, so populated badge styling is not reviewed. Preferences are memory-only in synthetic mode.

See [View display options parity slice](PHASE_PLUGINHUB_VIEW_DISPLAY_OPTIONS_20261030.md), which records exact evidence and remaining gaps.

## Change

Branch commit `fec3cf8c2482b1dd9aa105723ffe106b1038a33d`, `index.html` blob `d8c019b92ad3edee72384bc067211f53697bd3cc`, groups AIMM’s existing layout selector, sort selector, and Collapse/Expand vendor controls in a single **View** disclosure menu, matching the reference app’s toolbar grouping. Existing layout and sort values are unchanged: Cards/List/Ledger and Vendor/Product/Format/Version. The vendor buttons remain available only when Cards is selected.

The menu uses native `<details>/<summary>`, exposes a stable “View options” accessible name and synchronized expanded state, closes after layout/sort selection, on Escape, or outside pointerdown, and returns focus to View after keyboard close/selection. The menu has a 280px maximum and clamps its width for compact viewports.

This implements Layout, Sort, category/note visibility, Brightness, typography-only Text size, Collections and Hidden visibility. Light/Dark/System appearance, colorblind status colors, sidebar/top-tab navigation and license-key marks remain incomplete. PluginHub-specific List/Ledger semantics and newest/oldest sorting still need source-backed status/format metadata and per-record timestamps.

## Development preview and Jules review

Cloudflare Pages deployment `1915928d-7ef2-40cd-9a24-0de6a2a871e7` is the successful preview deployment for the exact source commit, at [synthetic development preview](https://1915928d.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). Project configuration reports preview environment and production deployments disabled.

Jules passed source and final visual review on desktop, 390px, and 320px. Layout and Sort appear in the panel; Collapse/Expand appear in Cards mode. Selecting List and Product updated the existing table/sort, closed the menu, set `aria-expanded=false`, and returned focus. Escape returned focus; outside click closed without stealing focus. At 320px the panel clamps to 224px and all controls remain visible; the vendor-button labels wrap to two lines.

At 320px, document `scrollWidth` is 434px with the View menu both open and closed. This is existing page overflow outside the View menu; the menu itself ends within the viewport and does not add horizontal overflow. The 390px review has no View-menu fit issue.

The exact preview used only the in-memory synthetic sample. No real inventory, saved preferences, credentials, connected folders, scans or row actions were used. Jules reset layout to Cards, closed the menu, and restored the normal viewport. No automated tests were run.

## Current status

Foundation remains **NOT MET** and Stage 6 remains gated pending complete fresh exit evidence and fresh independent acceptance. The development Worker passkey RP fix remains a surgical patch rather than a reproducible build from branch source. No Worker or production deployment occurred.
