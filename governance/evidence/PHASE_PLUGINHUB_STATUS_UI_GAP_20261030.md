# PluginHub status-scope UI connection gap — 2026-10-30

## Read-only source trace

The Library API already exposes authenticated `GET /v1/status-summary`. It reads the selected account/device’s current complete inventory generation, applies freshness rules to generation-bound check observations, and returns `counts`, `raw_counts` and per-format `records` for update, up-to-date, manual, unchecked, error and stale states. `library-api/library-account.js` calls this endpoint for Hope’s `get_plugin_status` tool.

The visible Library page in `index.html` does not call that endpoint. Its `INV_SCAN_ROWS` come from the browser’s local scan cache and have no API generation/record-ID join. Source commit 178b6e82d18f63dca2f9849c3cf80b25a9a87cd8 makes Updates Available, Up to Date, Manual Check and Unchecked selectable and displays counts per format record. The synthetic fixture therefore shows 0/0/0/14, and selecting an empty status scope explains that vendor observations are not connected. This resolves the disabled controls and dash placeholders but does not connect the API observations or let the page truthfully filter real rows by the account generation.

There is also a grouping contract gap. `PluginRecord` currently carries id, name, bundle identifier, version, format, metadata source and local path, but no vendor/publisher. `published_inventory_records` likewise stores no vendor field. A reviewed additive source change now returns the selected `bundle_identifier` (or `null`) in each status row, commit `84e2e2a3a5c1ad2c2fd0355130e449a5cb03dff5`, `library-api/src/index.js` blob `6f04f7f8e042214eaf263f7103d6aa2fbc3fdc7b`. Publisher attribution and a canonical product identity remain absent. Counts remain per format record. The UI now labels this count unit and keeps it separate from grouped product totals; do not present format counts as publisher/plugin totals without an explicit grouping rule.

The visible browser scanner has a second identity mismatch with the Companion snapshot: `invReadBundle` expands each AU `AudioComponents` entry into its own named row and derives a display publisher from AU name metadata, plist `Manufacturer`/`Vendor`, the vendor folder segment, or the bundle-identifier segment (falling back to “Unknown publisher”). `invBuildGroups` groups those local rows by normalized publisher plus normalized product name. These are existing UI display heuristics; do not promote folder names or bundle-ID segments to authoritative publisher identity. The Companion `PluginScanner` emits one record per bundle and names it from `CFBundleDisplayName`, `CFBundleName`, or the filename; it has no publisher field. A multi-component AU bundle therefore cannot be joined row-for-row to the browser inventory from bundle identifier alone. Keep bundle-level action identity intact while defining how component-level products and status roll-up map to it.

## Required implementation sequence

1. Extend each format record with nullable, validated `publisher_name`, `publisher_source` and `canonical_product_id`; populate publisher evidence only from explicit metadata or a separately reviewed mapping. Keep unresolved identity null, do not infer it from product names, folder hints or bundle-ID segments, and preserve current format-level record IDs, action targets and generation binding.
2. Return the additive fields from the generation-bound status response. Group products only by identical non-null canonical IDs; report product and format-record counts separately, and keep status counts per format record until a reviewed product-level roll-up rule exists. Define raw, actionable, paid, snoozed, hidden and filtered count semantics; preserve stale/error as distinct outcomes.
3. Keep all four UI scopes active and connect them to the authenticated status snapshot; make filters/counts operate on that same generation. Keep Unchecked distinct from Manual Check.
4. Build the Install Manager on the verified vendor update observations and existing Companion installer/action contracts, with per-item progress and receipts. Do not expose no-op buttons.

### Proposed field bounds and privacy

Use a closed `publisher_source` enum: `infoPlistManufacturer`, `infoPlistVendor`, `audioComponentManufacturerName`, or `reviewedMapping`; store `null` source and publisher when unresolved. Store no raw plist data and transmit no local path. A canonical product ID may be a stable opaque value derived by the reviewed mapping; keep it nullable where the evidence does not support a cross-format identity. Publisher names and canonical product IDs still reveal installed-software metadata, so keep them inside the existing consented, account/device/generation-scoped retention and deletion model.

## Scope and limits

This continuation includes branch-source review and interaction with the opt-in synthetic development preview. No status API endpoint was called; no account rows or real inventory were read; no local folders were scanned; no automated tests ran. Use the synthetic preview for UI work. Real-inventory validation and separately gated external actions remain under existing authorization requirements.

Kevin’s target remains all four status scopes active with truthful counts and every AIMM Tool active through a complete workflow. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch build.
