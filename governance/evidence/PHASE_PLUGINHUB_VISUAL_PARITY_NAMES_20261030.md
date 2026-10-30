# PluginHub library typography parity — 2026-10-30

## Change

Branch source commit `75655b4b2f327e3fff6d52c30f8512c34d1ffc9c`, Library `index.html` blob `f9868f5392be7633e12da8520f05b05ed0c66071`, raises vendor headings from 11px to 13px and plug-in names from 10px to 12px in Cards, List and Ledger. Both sizes continue to follow the View menu’s Text size control. Existing ellipsis, responsive grid and row controls remain in place.

## Independent review

Jules passed source review and visual review on [synthetic Pages deployment aed2938c](https://aed2938c.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), deployment ID `aed2938c-9752-4fac-97fd-ca91eb174768`.

At 1920×815, vendor headings compute to 13px and product names to 12px, with four balanced vendor columns. At 390×844 the cards stack to one column, product names fit, long vendor headings truncate with ellipsis, and version/favorite/action controls remain aligned. The 44px page-shell overflow persists outside the card grid. Jules also spot-checked synthetic Hide/Show; the row returned with its Hidden badge. Default state was restored.

No real inventory, storage, folders, scans or credentials were used. No automated tests were run.

## Scope

The user-provided comparison showed AIMM’s names visibly smaller than PluginHub’s. This change addresses that specific visual gap. It does not claim exact typography parity across all modes or actual installed products.
