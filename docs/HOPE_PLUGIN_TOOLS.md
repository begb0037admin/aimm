# Hope Plugins tools — build 2026-11-20.11 (favourites built, not deployed)

Hope's 15 `inventory_*` tools are registered on the ElevenLabs agent (version `agtvrsn_5101m7wwhq0pe5e9nagavh7txsz8`): three old `pluginhub_*` tools were renamed in place and 12 are new. They run in the page through the same handlers as the Plugins controls. Read results are JSON. A disconnected companion is reported explicitly. Agent rollback is the previous agent version in ElevenLabs history; voice test pending.

`inventory_set_favorite` is a new sixteenth tool in build .11. It is in the page catalogue for Hope's Luna and typed chat routes, but has **not** been registered on the ElevenLabs agent or deployed. It matches the exact normalised product name in the scanned inventory. Supply `publisher` if several products share a name. It uses the Plugins star action and the existing `trapMasterState_v1` favourite persistence, with publisher-qualified keys for scanned products and existing name-only favourites recognised when that scanned name is unique. It returns `changed: false` if the requested state is already set; `ambiguous`, `not_found`, or `not_saved` errors must be spoken as failures. It does not switch tabs or change filters. The legacy `toggle_favorite` remains for MixBus catalogue hearts; an installed request marked `installed: true` routes to the inventory action.

| Tool | Arguments | Action | Confirmation |
| --- | --- | --- | --- |
| `inventory_navigate` | `item` | Opens a Plugins sidebar item and reports its live view or disabled reason. | No |
| `inventory_search` | `query`, `format`, `status`, `offset`, `limit` (optional) | Searches the cached scan without changing the view. | No |
| `inventory_summary` | None | Returns product, format, status and vendor totals. | No |
| `inventory_set_favorite` | `plugin`, optional `publisher`, `favorite` (boolean) | Stars or unstars an exact scanned product; saves and refreshes the Plugins Favorites count and open list. | No |
| `inventory_status` | None | Reports companion connection, version, scan, vendor checks, last action and warnings. | No |
| `inventory_duplicates` | None | Loads and returns duplicate groups and side by side versions. | No |
| `inventory_unused` | None | Loads and returns the Unused list. | No |
| `inventory_reveal` | `plugin`, `publisher`, optional `format` | Reveals exact scanned rows in Finder through the companion. | No |
| `inventory_rescan` | None | Presses the existing Scan connected folders control. | No |
| `inventory_move_to_unused` | `plugin`, `publisher`, optional `format`, `confirmed` | Moves matching companion row IDs to Unused. | Yes |
| `inventory_restore` | `plugin`, `publisher`, optional `format`, `confirmed` | Restores matching move IDs from the loaded Unused list. Read `inventory_unused` first. | Yes |
| `inventory_move_to_trash` | `plugin`, `publisher`, optional `format`, `confirmed`, `confirmed_trash` | Moves matching companion row IDs to macOS Trash. | Yes, plus explicit Trash confirmation |
| `inventory_mark_vendor_app_checked` | `plugin`, `publisher`, `confirmed` | Records the product's vendor app check through the existing page handler. | Yes |
| `inventory_unmark_vendor_check` | `plugin`, `publisher`, `confirmed` | Removes a saved vendor app check through the existing page handler. | Yes |
| `inventory_keep_newest_duplicates` | `confirmed` | Keeps newest copies and moves actionable older duplicate row IDs to Unused. Read `inventory_duplicates` first. | Yes |
| `inventory_add_to_bus` | `plugin`, `publisher`, `bus`, `stage`, optional `position`, `confirmed` | Adds an exact scanned product to a MixBus. | Yes |

For each confirmed action, first call with `confirmed: false`. Hope must read the returned `summary` aloud, obtain Kev's yes, then repeat with `confirmed: true`. Trash also requires `confirmed_trash: true`. An unconfirmed call does not change state. Companion actions send IDs only, retain the companion's 500-item batch limit, and return per-item failure reasons.

Legacy names `pluginhub_navigate`, `pluginhub_search_inventory` and `pluginhub_add_to_bus` still route to their `inventory_*` equivalents.
