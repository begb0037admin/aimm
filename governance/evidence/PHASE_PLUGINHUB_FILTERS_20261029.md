# PluginHub browse filter parity — 2026-10-29

## Reference behavior

The installed PluginHub v2.0.12 manual describes My Tags as a toolbar dropdown that filters like a category; Shift-click adds/removes tags in the selection. It exposes New tag and Tag Manager from the same dropdown. The manual also says format pills replace the current format on a normal click, while Shift-click combines/removes formats. Search matches vendor, plug-in name and category.

## Branch implementation and review

Branch: `codex/pluginhub-foundation`  
Source commit: `80dd8012a19f8b3cd662ee2125aa1c30e94b4ae6`  
File: `index.html`, blob `b6295c90c92703fe7e36f9eb289ec7cbc7e031a4`  
Jules source review: PASS.

The Library toolbar now has a My Tags dropdown with tag colours and membership counts. A normal tag click selects that tag (and clicking the only selected tag again clears it, matching the manual's category behavior); Shift-click combines/removes tags. Active tag chips clear an individual selection. The menu's New tag and Plugin Tag Manager controls open the existing browser-local manager. Tag selection combines with category, format and search filters. Choosing a specific tag resets the separate sidebar scope (such as Favorites or Hidden) to All.

Format pills now replace the selection on normal click, combine/remove on Shift-click, and All formats clears the selection. Search now includes the resolved category. These controls remain browser-side and do not add a filesystem or network action.

## Development preview verification

Cloudflare Pages preview deployment `415a8b76-f53c-4c0e-82d5-20f7dd4eeb23` succeeded for the exact source commit above. Deployment URL: https://415a8b76.aimm-pluginhub-foundation-dev.pages.dev/ . The stable branch preview remains https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/.

In the clean, deployment-specific origin, Library showed zero installed products and zero connected folders. The toolbar displayed the My Tags dropdown. Selecting AU, Shift-clicking VST3, and then clicking All formats produced the expected accessibility states: both formats selected, then cleared. A separate deployment-specific origin held one synthetic tag only; selecting it displayed an active filter chip, and clicking its × cleared the tag selection and restored its unselected state. That tag was browser-local and had no product memberships. No real catalogue data was used for this interaction.

Jules reviewed the source behavior and passed. No automated tests were run. The clean preview had no installed inventory, so product-result matching was not exercised. No folder picker, scan, inventory upload, Worker deployment or production deployment occurred.

## Remaining parity and gates

The Library filters now cover individual and combined tag selection, multi-select categories and formats, search, and view/sort controls. Remaining parity includes the PluginHub VST cycling control, Intel-only and snoozed/status filters (which require architecture metadata and live status observations), Companion-backed file operations, and whole-library Tools workflows. Tag definitions are browser-local, not account-synchronised. AAX remains excluded by the approved scanner architecture.

This is not Foundation exit evidence. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only for further gated workflows.


## Final My Tags chevron correction — 2026-10-29

The dropdown summary previously rendered a literal down-arrow alongside the CSS chevron, so opening it showed two opposite arrows. Source commit `ad1e460dea5009dbf7e88eba6cd5c16d5941ba54` (index.html blob `ff5ba161b998b7adc36b975242e6d4d38ad952e1`) removes the literal glyph and keeps one CSS chevron. Jules reviewed the exact source and passed. The fresh Pages preview deployment `1a5f0a2b-b78f-493f-8532-0d57ce2540e5` succeeded at https://1a5f0a2b.aimm-pluginhub-foundation-dev.pages.dev/. Visual review confirms one down chevron while closed and the same chevron pointing up while open. The combined format behavior remains verified on source `80dd8012a19f8b3cd662ee2125aa1c30e94b4ae6` / deployment `415a8b76-f53c-4c0e-82d5-20f7dd4eeb23`; this final visual-only correction did not alter it.

No inventory was connected or scanned for the final visual check. Synthetic browser-local tag demos on earlier unique deployment origins had no product memberships and were isolated from the stable app origin. Foundation remains **NOT MET** and Stage 6 remains gated; the Worker RP fix is still a surgical patch, not a reproducible branch-source build.
