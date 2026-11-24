# Hope workbench coverage — build 2026-11-20.14 (BUILT, NOT DEPLOYED)

Hope has a standing Plugins scan summary in typed and voice context: product total, scan time, favourites, hidden, Unused, and companion connection/scanning. A completed companion scan refreshes it. `inventory_rescan` waits up to 120 seconds for `/status` to report `scanning:false` and a new `lastScanAt`, reloads the companion inventory, and returns before/after product totals or `timed_out:true`.

The 14 new tool schemas are in `standalone/assets/hope-tools-manifest.json`; the registration subset is exported as `new-hope-tools.json`. Snapshots tools reuse the journal, Apply backup pill and workbench restore. Plugins tag and Hidden tools use the existing product-action and tag stores. Mix Check can read reference state and select a saved target; audio loading, Spotify/tab capture and Match Sound were excluded. MixBus can load an exact named preset and run Auto-fill. The older MixBus write tools verify saved state; `clear_bus` now requires `confirmed`. `settings_status` returns provider configured booleans, ElevenLabs credits used/limit/remaining for each account, selected models and companion status, with no credential values or dollar spend. Unknown credits are `null`; Hope reports only returned credits and says when a value is unavailable.

Every new write takes `confirmed`: Hope first reads its summary aloud with `confirmed:false`, waits for Kev's yes, then repeats with `confirmed:true`. A failed saved-state check returns `ok:false`. Typed chat and Luna use the shared page catalogue and handler; the ElevenLabs agent has not been changed. `tests/tool-sync.test.mjs` checks the page catalogue against the manifest and handler. `scripts/hope-tool-sync.mjs live-agent-tools.json` reports missing/extra live names. `scripts/hope-smoke.mjs` attempts a served-page headless read-only pass and prints the manual checklist if Chrome or loopback access is unavailable.

# Hope chain favourites — build 2026-11-20.19 (BUILT, NOT DEPLOYED)

`vocal_favorites_read` and `vocal_favorites_apply` keep their names. Both accept `chain` (`vocal`, `drums`, `808`, `master`, or `all`); read also accepts `section`, while apply accepts `names`, an optional array of exact item names. Omitting `names` applies the whole chain view. Apply still requires the spoken `confirmed:false` summary, Kevin’s clear yes, then `confirmed:true`, and returns verified starred, already, unresolved and not-saved results. The four chain lists use scan matched, licensed products and Logic Pro 13 stock only. For a bus build Hope reads the matching chain first, prefers owned, close versions, equivalents, then stock, and says what was swapped. The exact registration schemas are in `standalone/assets/hope-tools-manifest.json`. ElevenLabs registration is pending.

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

# Hope video cueing — build 2026-11-23.46 (BUILT, NOT DEPLOYED)

`cue_video(video_id, title?, channel?)` accepts an exact 11-character YouTube ID, switches to Library, and selects the video in the existing player with autoplay off. It returns `{ok:true,cued:true,title}`. Title and channel label videos that are not already ingested. `search_youtube_videos(query)` POSTs to the same `/kb/search-youtube` proxy endpoint as the Library search and returns up to five `{video_id,title,channel,duration}` results. Hope cues the first result only when it clearly matches Kev's request; otherwise she asks which result he wants.

When a plugin chain or advice uses an ingested YouTube source from `search_yt_knowledge` / `read_yt_knowledge`, Hope calls `cue_video` for that source and says, “I have cued it in the player if you want to have a look.” A private Mix With The Masters recording with a non-YouTube ID cannot be passed to this 11-character YouTube tool; Hope must not invent an ID or claim it was cued. Typed chat and the other page providers inherit both tools from `TOOL_DEFS`. The ElevenLabs agent itself remains unchanged until its two client tools and prompt guidance are registered there.
