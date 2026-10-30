# PluginHub View Collections parity slice — 2026-10-30

## Change

Branch source commit `e4edbd07746529486af730fcfd40e0853ab15549`, Library `index.html` blob `439450e31aa71e37daf7623436f533ff793f60c3`, adds the manual’s **Collections** control to the View menu.

A collection stores only the currently selected category and tag filters. The menu can save a named selection, apply it in one selection, or remove it through an inline confirmation. Applying restores category/tag filters and returns the Library to the all scope. Duplicate names are rejected instead of silently replacing a saved filter. Save/remove persistence failures roll back the in-memory state and show feedback. Focus returns to visible controls after save, cancel, removal or applying a collection; removal confirmation is associated with its prompt for assistive technology.

In normal Library mode, collections are stored as a local browser preference. The opt-in synthetic preview keeps them in memory and returns before any localStorage read/write.

## Independent review

Jules passed source review and visual/interaction review on [synthetic development preview deployment 7a099e45](https://7a099e45.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), deployment ID `7a099e45-4e28-4c40-9e5f-c4322c251df2`.

Using the synthetic **Instruments & MIDI** filter (two sample products), Jules saved a clearly labelled synthetic collection, applied it, chose the placeholder and confirmed that the category and both visible products remained while Remove became disabled. The inline removal prompt named the collection; confirmation returned focus and displayed “Collection removed”. Jules then removed the sample and restored All/Cards, Vendor sort, default display preferences, desktop viewport and closed View menu.

At 390px the View panel was 294px wide, clamped to 391px high and scrolled internally; the Collections selector, Save current, disabled Remove, live status, and Collapse/Expand controls remained reachable. The existing 44px page-level horizontal overflow remains outside the panel.

## Scope and remaining gaps

Only the in-memory synthetic sample was used. No localStorage was inspected, no folders were connected/scanned, and no real inventory, credentials or row actions were used. No automated tests were run.

The View menu still lacks Light/Dark/System appearance, colorblind-friendly status colors, sidebar/top-tab navigation, license-key marks, Hidden, and timestamp-based vendor sorting. Keep status colors and timestamp sorting unavailable until source-backed observations and per-record metadata exist. Do not substitute scan time or infer status.

Foundation remains **NOT MET** and Stage 6 remains gated pending complete fresh exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source.