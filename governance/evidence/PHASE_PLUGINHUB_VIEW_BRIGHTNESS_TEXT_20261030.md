# PluginHub View brightness and text-size parity slice — 2026-10-30

## Change

Branch source commit `82c886d690eaaf41560af83cff4155a769cc553d`, Library `index.html` blob `a535b0a5830ad3449e1f27f14238c6f4685f5997`, adds Brightness and Text size controls to the View menu.

Brightness applies to the Library shell. Text size scales numeric font sizes and font shorthands in the page stylesheets through the `--inv-text-scale` property on `#library`. It changes typography while leaving product/vendor widths, gaps, padding and SVG/image/CSS-sized icon dimensions fixed; row and card heights can reflow as text wraps. Text-rendered affordances such as the favorite star and action dots scale with the text preference. Both settings default to 100%, persist as Library display preferences in normal mode, and remain memory-only in the opt-in synthetic preview.

The View panel now chooses the side with more room, limits its height to the available viewport space (up to 560px), and scrolls internally when needed.

## Independent review

Jules passed source review, then passed visual/interaction review on [synthetic development preview deployment 72b0770b](https://72b0770b.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), deployment ID `72b0770b-8718-47b7-8d03-b61b54752ea0`.

At 80%, 100% and 120%, the 10px product label computed to 8px, 10px and 12px. Product width remained 277px, vendor width 279px, and SVG icons 18×18px. The sampled product row height reflowed from 69.8px to 73.5px to 78.2px as text size increased. Cards reflowed without overlap or clipping. Brightness worked at 80%, 100% and 120%. At 390px, the View panel fit the available space, scrolled internally to every control and flipped above the trigger when needed. The panel itself fit; a pre-existing 44px page-level horizontal overflow remained. Jules restored brightness/text size to 100%, Cards view, and the menu closed.

## Scope and remaining gaps

Only the in-memory synthetic preview was used. No folder connection, scan, real inventory, saved preference, credential, or row action was used. No automated tests were run.

PluginHub’s Light/Dark/System appearance and colorblind-friendly status colors, sidebar/top-tab navigation, license-key marks, Hidden, saved Collections and timestamp-based vendor sorting remain incomplete. Keep status colors and timestamp sorting unavailable until the source-backed observations/record metadata exist; never substitute scan time or infer status.

Foundation remains **NOT MET** and Stage 6 remains gated pending complete fresh exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source.