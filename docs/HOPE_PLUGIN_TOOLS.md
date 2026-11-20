# Hope Plugins tools — build 2026-11-20.9 (registered)

Hope's 15 `inventory_*` tools are registered on the ElevenLabs agent (version `agtvrsn_5101m7wwhq0pe5e9nagavh7txsz8`): three old `pluginhub_*` tools were renamed in place and 12 are new. They run in the page through the same handlers as the Plugins controls. Read results are JSON. A disconnected companion is reported explicitly. Agent rollback is the previous agent version in ElevenLabs history; voice test pending.

| Tool | Arguments | Action | Confirmation |
| --- | --- | --- | --- |
| `inventory_navigate` | `item` | Opens a Plugins sidebar item and reports its live view or disabled reason. | No |
| `inventory_search` | `query`, `format`, `status`, `offset`, `limit` (optional) | Searches the cached scan without changing the view. | No |
| `inventory_summary` | None | Returns product, format, status and vendor totals. | No |
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
