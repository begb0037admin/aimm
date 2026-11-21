# Hope workbench coverage — build 2026-11-20.13 (BUILT, NOT DEPLOYED)

Hope has a standing Plugins scan summary in typed and voice context: product total, scan time, favourites, hidden, Unused, and companion connection/scanning. A completed companion scan refreshes it. `inventory_rescan` waits up to 120 seconds for `/status` to report `scanning:false` and a new `lastScanAt`, reloads the companion inventory, and returns before/after product totals or `timed_out:true`.

The 14 new tool schemas are in `standalone/assets/hope-tools-manifest.json`; the registration subset is exported as `new-hope-tools.json`. Snapshots tools reuse the journal, Apply backup pill and workbench restore. Plugins tag and Hidden tools use the existing product-action and tag stores. Mix Check can read reference state and select a saved target; audio loading, Spotify/tab capture and Match Sound were excluded. MixBus can load an exact named preset and run Auto-fill. The older MixBus write tools verify saved state; `clear_bus` now requires `confirmed`. `settings_status` returns only configuration booleans, spend/usage totals, selected models and companion status, with no credential values.

Every new write takes `confirmed`: Hope first reads its summary aloud with `confirmed:false`, waits for Kev's yes, then repeats with `confirmed:true`. A failed saved-state check returns `ok:false`. Typed chat and Luna use the shared page catalogue and handler; the ElevenLabs agent has not been changed. `tests/tool-sync.test.mjs` checks the page catalogue against the manifest and handler. `scripts/hope-tool-sync.mjs live-agent-tools.json` reports missing/extra live names. `scripts/hope-smoke.mjs` attempts a served-page headless read-only pass and prints the manual checklist if Chrome or loopback access is unavailable.

# Hope Plugins tools — build 2026-11-20.12 (BUILT, NOT DEPLOYED)

Vocal-chain favourites are available locally in the Plugins Library. `vocal_favorites_read` returns owned scan products, Logic Pro 13 stock products, and missing video products with scanned equivalents. `vocal_favorites_apply` follows the inventory confirmation pattern: call with `confirmed:false`, read the counts aloud, wait for Kevin's yes, then call with `confirmed:true`. It uses the existing Plugins star action for scanned products and a separate saved list for Logic stock. The result reports verified `starred`, `already`, `unresolved`, and `not_saved`. These new schemas have **not** been registered on ElevenLabs.

```json
{"name":"vocal_favorites_read","description":"Read vocal-chain favourites from the video report: scanned owned plug-ins, Logic Pro 13 stock plug-ins, and not-installed video plug-ins with owned equivalents.","parameters":{"type":"object","properties":{"section":{"type":"string","enum":["owned","stock","missing","all"],"description":"Section to read; defaults to all."}},"required":[]}}
```

```json
{"name":"vocal_favorites_apply","description":"Prepare or apply vocal-chain favourites. First call with confirmed false, read the scanned and Logic stock counts aloud, get Kevin's clear yes, then call with confirmed true.","parameters":{"type":"object","properties":{"confirmed":{"type":"boolean","description":"True only after Kevin clearly confirms the proposed count."}},"required":["confirmed"]}}
```

# Previous build — 2026-11-20.11 (DEPLOYED)

Hope's 16 `inventory_*` tools are registered on the ElevenLabs agent: the first 15 were registered in agent version `agtvrsn_5101m7wwhq0pe5e9nagavh7txsz8` (three old `pluginhub_*` tools renamed in place and 12 new tools). They run in the page through the same handlers as the Plugins controls. Read results are JSON. A disconnected companion is reported explicitly. Agent rollback is the previous agent version in ElevenLabs history; voice test pending. Build .11 is deployed as Worker `761a1406-7d93-419c-92ae-1d15c2b17143`; rollback is build .10, Worker `9a3c5675-84e7-4bff-b74f-c3b53c9cf446`.

`inventory_set_favorite` is the sixteenth tool in build .11. It is in the page catalogue for Hope's Luna and typed chat routes and registered on the ElevenLabs agent as `tool_2301m7x1pdx9f078wzmq6wv2k4e2`. The agent prompt gained a STARRING INSTALLED PLUG-INS paragraph. It matches the exact normalised product name in the scanned inventory. Supply `publisher` if several products share a name. It uses the Plugins star action and the existing `trapMasterState_v1` favourite persistence, with publisher-qualified keys for scanned products and existing name-only favourites recognised when that scanned name is unique. It returns `changed: false` if the requested state is already set; `ambiguous`, `not_found`, or `not_saved` errors must be spoken as failures. It does not switch tabs or change filters. The legacy `toggle_favorite` remains for MixBus catalogue hearts; an installed request marked `installed: true` routes to the inventory action. Voice test pending.

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
