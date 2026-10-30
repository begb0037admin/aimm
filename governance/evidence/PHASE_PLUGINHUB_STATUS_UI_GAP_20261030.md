# PluginHub status-scope UI connection gap — 2026-10-30

## Read-only source trace

The Library API already exposes authenticated `GET /v1/status-summary`. It reads the selected account/device’s current complete inventory generation, applies freshness rules to generation-bound check observations, and returns `counts`, `raw_counts` and per-format `records` for update, up-to-date, manual, unchecked, error and stale states. `library-api/library-account.js` calls this endpoint for Hope’s `get_plugin_status` tool.

The visible Library page in `index.html` does not call that endpoint. Its `INV_SCAN_ROWS` come from the browser’s local scan cache and have no API generation/record-ID join. Only the local Unchecked scope is active; Updates Available, Up to Date and Manual Check remain disabled. The UI therefore cannot truthfully filter its current rows by the account API’s status observations.

There is also a grouping contract gap. `PluginRecord` currently carries id, name, bundle identifier, version, format, metadata source and local path, but no vendor/publisher. `published_inventory_records` likewise stores no vendor field. The status-summary response includes name/format but omits bundle identifier and publisher in its returned row. Its counts are per format record, so they cannot be presented as distinct publisher/plugin totals without an explicit canonical grouping rule.

## Required implementation sequence

1. Extend the Companion-to-API inventory contract with reviewed, source-backed publisher attribution and a canonical product identity while preserving format-level record IDs and generation binding. Do not infer vendor from a product name.
2. Return the grouping fields in the generation-bound status response and define raw, actionable, paid, snoozed, hidden and filtered count semantics. Preserve stale/error as distinct outcomes.
3. Connect the visible Library UI to the authenticated status snapshot, activate all four user-requested scopes, and make filters/counts operate on that same generation. Keep Unchecked distinct from Manual Check.
4. Build the Install Manager on the verified vendor update observations and existing Companion installer/action contracts, with per-item progress and receipts. Do not expose no-op buttons.

## Scope and limits

This was a branch-source/documentation inspection only. No API endpoint was called, no account rows or real inventory were read, no local folders were scanned, and no tests ran. Use the synthetic preview for UI work. Real-inventory validation and separately gated external actions remain under existing authorization requirements.

Kevin’s target remains all four status scopes active with truthful counts and every AIMM Tool active through a complete workflow. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch build.
