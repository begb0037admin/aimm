# PluginHub View display options parity slice — 2026-10-30

## Change

Branch source commit `e86c9b1787b3289a66eaa2f83f5f21260bc25a43`, Library `index.html` blob `b56aad4f068d531a1cb930394073c72eef9f537d`, adds two display preferences to the existing View menu: **Show category labels** and **Show notes and ratings**.

Category labels can be hidden or shown in Cards, List, and Ledger. In List and Ledger, both the category column heading and row values follow the preference. The notes control affects only note and rating metadata; tags and local up-to-date/keep markers remain visible. Note and rating metadata is now rendered under product names in List, as it already was in Cards and Ledger.

Preferences default on. In normal Library mode they are stored as local display preferences. In the opt-in synthetic preview they stay in memory; preference code does not read or write local storage.

## Independent review

Jules passed the source review after a correction to List rendering and metadata scope. Jules passed visual and interaction review on [synthetic development preview deployment 52913ac6](https://52913ac6.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), deployment ID `52913ac6-09bb-4dde-9034-6ee29299ed0d`, at desktop 1920×815 and narrow 390×844.

Both toggles are readable and fit in the View panel at both sizes. Category labels hide/show in all three layouts, including List/Ledger headings and cells. The notes control operates in Cards, List and Ledger and keeps the menu open. Selecting a layout still closes the menu.

The sample contains no saved note/rating values, tags or local marks. The review confirms that the controls and metadata rendering paths work, but it could not visually assess populated note/rating badge content. The page has a pre-existing 44px horizontal overflow at 390px (`scrollWidth=434`); the View panel remains inside the viewport and does not cause that overflow. Jules restored Cards, both preferences on, and the normal viewport.

## Scope and remaining gaps

The preview uses only the in-memory synthetic sample (12 products, 14 format bundles). No connected folders, real inventory, saved preferences, credentials, scan, row action, or separately gated operation was used. No automated tests were run.

The View menu still lacks PluginHub’s Light/Dark/System appearance control, colorblind-friendly status colors, brightness, text size, sidebar/top-tab navigation, key marks, Hidden and saved Collections. Newest/oldest vendor sorting and meaningful status colors require source-backed timestamps and connected vendor status observations; do not substitute scan time or infer status.

Foundation remains **NOT MET** and Stage 6 remains gated pending complete fresh exit evidence and acceptance by independent review. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source.