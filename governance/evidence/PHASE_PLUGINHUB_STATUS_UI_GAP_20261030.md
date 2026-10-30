# PluginHub status-scope UI connection gap — 2026-10-30

## Current synthetic preview checkpoint

Source commit [`1018be83b451b8db6429ba5bf3b869f223fed40b`](https://github.com/begb0037admin/aimm/commit/1018be83b451b8db6429ba5bf3b869f223fed40b) now demonstrates record-level status display and filtering in the opt-in synthetic fixture: 3 Updates, 4 Up to date, 3 Manual check and 4 Unchecked across 14 format records. Deployment `1a442d22-c05b-4fbd-a3c4-6cfcccd72288` is the current development Pages preview. These values are generated in memory and do not come from vendor observations or the authenticated account status endpoint. Jules passed source review and deployed visual review at 1920×815. At 390×844, layout metrics confirm one column and no horizontal overflow; the sidebar is an icon rail and the lower page was not visually captured.

The live Library connection gap below remains open.

## Current source trace

The Library API exposes authenticated `GET /v1/status-summary`. It reads the selected account/device’s current complete inventory generation, applies freshness rules to generation-bound check observations, and returns counts and per-format records for update, up-to-date, manual, unchecked, error and stale states. `library-api/library-account.js` uses this endpoint for Hope’s `get_plugin_status` tool.

The visible Library page in `index.html` does not call that endpoint. Its `INV_SCAN_ROWS` come from the browser’s local scan cache and have no API generation/record-ID join. Source commit `178b6e82d18f63dca2f9849c3cf80b25a9a87cd8` first made the four scopes selectable and showed 0/0/0/14 in its then-current synthetic fixture. Follow-up source commit `1018be83b451b8db6429ba5bf3b869f223fed40b` now gives the opt-in fixture explicit statuses: 3/4/3/4 format records, and filters groups by whether any format row matches. These are synthetic fixture counts, not vendor observations. The four scopes still do not filter authenticated status rows.

## Completed source groundwork

Reviewed source commit [`8101fdaf364524407a4bc0432f1d1f90bc2773f0`](https://github.com/begb0037admin/aimm/commit/8101fdaf364524407a4bc0432f1d1f90bc2773f0) adds nullable `publisher_name`, `publisher_source` and `canonical_product_id` fields to Companion/API format records. The Companion uses only explicit Info.plist `Manufacturer` and `Vendor`; source labels distinguish those keys. The API accepts only those two labels, requires the name/source pair and Info.plist metadata, and rejects non-null canonical IDs until a reviewed mapping exists. No path, filename or bundle-ID inference is promoted to identity. Opaque record IDs remain unchanged and local paths are not uploaded.

The API finalization INSERT and both paged Library queries now carry publisher fields. `/v1/status-summary` also returns publisher and canonical fields. Migration `0022_publisher_identity.sql` is present in branch source but has **not** been applied remotely. Existing records remain unresolved. Jules passed exact-source review. Follow-up source commit `1cd91114497184496063afb91b8fdbec7c763087` also preserves status device/generation/record IDs and nullable publisher identity fields in Hope’s read-only account tool output; this does not connect the visible Library. See [Hope status projection evidence](PHASE_PLUGINHUB_ACCOUNT_STATUS_TOOL_PROVENANCE_20261030.md) and [publisher provenance evidence](PHASE_PLUGINHUB_PUBLISHER_IDENTITY_20261030.md).

## Remaining identity and UI work

The browser scanner and Companion still have different row models. The browser’s `invReadBundle` expands AU `AudioComponents` into component rows and has display-only publisher heuristics; the Companion emits one bundle-level record. Multi-component AU records therefore still cannot be joined row-for-row to local UI records. Do not promote folder names or bundle-ID segments to authoritative publisher identity. Preserve bundle-level action targets while defining a reviewed component/product roll-up.

The API reports status at format-record level. Product totals and any product-level roll-up need explicit matching semantics. Until a reviewed canonical mapping exists, keep product and format-record totals separate and preserve stale/error states.

## Required implementation sequence

1. **Source groundwork complete:** bounded publisher provenance and nullable canonical identity fields are in the Companion/API contract. Canonical IDs remain null and are rejected on ingestion until reviewed mapping is implemented.
2. **API projection complete; mapping/roll-up remains:** publisher provenance is returned in inventory and status rows. Define reviewed canonical identity and product/format count semantics before product-level status roll-up.
3. **UI connection open:** connect the four already-selectable scopes and counts to the authenticated generation-bound status snapshot. Match the same complete generation and record identity; preserve stale/error, freshness and per-format counts. Do not show synthetic values as live.
4. **Tools open:** implement Install Manager on verified vendor observations and existing Companion installer/action contracts, with per-item progress and receipts. Complete every remaining Tool through real workflows; do not expose no-op buttons.

## Verification and limits

Focused checks against the exact GitHub source passed: `node --check` for the Worker, foundation test file and `library-account.js`; extracted publisher-normalization cases for valid provenance, null publisher, unsupported source, filename-only provenance and non-null canonical-ID rejection; and migration 0022 plus its source constraint against an in-memory SQLite fixture. The synthetic API assertions were added to `foundation.test.js`, but the full `npm test` suite was **not run**: an isolated Git clone failed because this environment could not resolve GitHub. The dirty local checkout was left untouched.

No status endpoint was called, no account rows or real inventory were read, no folders were scanned, no remote migration was applied, and no Worker was deployed. The development Pages preview remains [synthetic deployment 623f8c93](https://623f8c93.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic). Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch build.
