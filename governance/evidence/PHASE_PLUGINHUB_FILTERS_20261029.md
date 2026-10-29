# PluginHub browse filter parity — 2026-10-29

## Reference behavior

The installed PluginHub v2.0.12 manual describes My Tags as a toolbar dropdown that filters like a category; Shift-click adds/removes tags in the selection. It exposes New tag and Tag Manager from the same dropdown. The manual also says format pills replace the current format on a normal click, while Shift-click combines/removes formats. Search matches vendor, plug-in name and category.

## Branch implementation and review

Branch: `codex/pluginhub-foundation`  
Source commit: `80dd8012a19f8b3cd662ee2125aa1c30e94b4ae6`  
File: `index.html`, blob `b6295c90c92703fe7e36f9eb289ec7cbc7e031a4`  
Jules source review: PASS.

The Library toolbar now has a My Tags dropdown with tag colours and membership counts. A normal tag click selects that tag (and clicking the only selected tag again clears it, matching the manual's category behavior); Shift-click combines/removes tags. Active tag chips clear an individual selection. The menu's New tag and Plugin Tag Manager controls open the existing browser-local manager. Tag selection combines with categories, formats, search and the other current Library scope.

Format pills now replace the selection on normal click, combine/remove on Shift-click, and All formats clears the selection. Search now includes the resolved category. These controls remain browser-side and do not add a filesystem or network action.

## Development preview verification

Cloudflare Pages preview deployment `415a8b76-f53c-4c0e-82d5-20f7dd4eeb23` succeeded for the exact source commit above. Deployment URL: https://415a8b76.aimm-pluginhub-foundation-dev.pages.dev/ . The stable branch preview remains https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/.

In the clean, deployment-specific origin, Library showed zero installed products and zero connected folders. The toolbar displayed the My Tags dropdown. Selecting AU, Shift-clicking VST3, and then clicking All formats produced the expected accessibility states: both formats selected, then cleared. A separate deployment-specific origin held one synthetic tag only; selecting it displayed an active filter chip, and clicking its × cleared the tag selection and restored its unselected state. That tag was browser-local and had no product memberships. No real catalogue data was used for this interaction.

Jules reviewed the source behavior and passed. No automated tests were run. The clean preview had no installed inventory, so product-result matching was not exercised. No folder picker, scan, inventory upload, Worker deployment or production deployment occurred.

## Remaining parity and gates

The Library filters now cover individual and combined tag selection, multi-select categories and formats, search, and view/sort controls. Remaining parity includes the PluginHub VST cycling control, Intel-only and snoozed/status filters (which require architecture metadata and live status observations), Companion-backed file operations, and whole-library Tools workflows. Tag definitions are browser-local, not account-synchronised. AAX remains excluded by the approved scanner architecture.

This is not Foundation exit evidence. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only for further gated workflows.
