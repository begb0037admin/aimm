# PluginHub View Hidden visibility parity slice — 2026-10-30

## Change

Source commit `6d32e6a870497e913e12662d3a50ad4009f868bf`, Library blob `7b3104e459d2e9d985bfb503c2aef8ccb41512af`, adds **Show hidden plug-ins** to View. In normal scopes, the setting includes locally hidden products within the active favorite/tag scope and category, tag, search and format filters. Hidden products carry a clear badge. The dedicated Hidden scope continues to show only hidden products, and the View checkbox is disabled there with a title explaining why.

The preference is stored in browser-local storage in normal mode. Synthetic preview keeps preference state in memory only. Synthetic product actions use an in-memory clone and permit only changes to the hidden field; other synthetic product edits remain rejected.

## Independent review

Jules passed source review and the visual/interaction flow on [synthetic development preview deployment 6b55072b](https://6b55072b.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), deployment ID `6b55072b-1f94-493d-a834-f5c83e14d863`.

At 1920×815, Jules hid **Meter Bloom** from the row menu; it disappeared from All and the Hidden count rose to one. Enabling **Show hidden plug-ins** restored it with a Hidden badge and increased Unchecked from 11 to 12. Jules hid **Keynote Piano** too; Hidden scope showed only the hidden products and disabled the View checkbox with the explanatory title. Search, VST3 and Instruments & MIDI filters composed correctly with hidden visibility. Jules restored both products and the default view state: All scope, Hidden count zero, Show hidden off, Cards/Vendor, empty search, category and notes display on, and View closed.

Tag filtering was not checked because the synthetic fixture contains no tags and synthetic tag edits remain blocked.

## Scope and limits

Only synthetic data was used. No localStorage was accessed, no real inventory or credentials were read, no folders were connected or scanned, and no automated tests were run. The source review confirmed synthetic hide state is memory-only and all synthetic product writes except the hidden field remain rejected.

Foundation remains **NOT MET** and Stage 6 remains gated pending complete fresh exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch build.
