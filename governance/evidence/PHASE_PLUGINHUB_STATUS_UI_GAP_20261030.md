# PluginHub status-scope UI connection gap — 2026-10-30

## Latest account-backed status checkpoint — ready for review

Source commit [aa4c38cbc0e380283dd6f613b438bdd15f27a631](https://github.com/begb0037admin/aimm/commit/aa4c38cbc0e380283dd6f613b438bdd15f27a631) connects the visible Library scopes to the authenticated, read-only `GET /v1/status-summary` projection and clarifies empty scopes and help text. The latest Pages deployment [062ec0f2](https://062ec0f2.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic) succeeded. The signed-in review route is the [branch preview](https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/?review=aa4c38c).

During review, the endpoint returned 3,285 format records across three devices/generations: 0 Updates, 0 Up to date, 0 Manual check, 1,644 Unchecked, 1,641 Stale, and 0 Errors. Counts are disjoint for this snapshot. Empty Updates copy now explicitly says that zero update observations do not mean everything is current. The saved observations were read only; no vendor check ran. Records retain device, generation and record identity and are not joined to browser folder scans. Full notes are in [account status evidence](PHASE_PLUGINHUB_ACCOUNT_STATUS_SCOPES_20261030.md).

The visual status UI clarity gap is closed for the synthetic preview. Live status scopes are now connected and ready for Kevin's review; actual fresh vendor observations and active status-check workflows remain open.

## Latest synthetic UI checkpoint — version emphasis and status guidance

Source commit [`762aeb81737a29b896a95097001c849b26d1911a`](https://github.com/begb0037admin/aimm/commit/762aeb81737a29b896a95097001c849b26d1911a), UI blob `83b0df4f3222b3daa110e0ddea8cf6ed7615f0dc`, and Pages deployment [`c0215f2e`](https://c0215f2e.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic) add per-format installed → sample latest version rows to the synthetic status cards. The newer sample version is red, installed remains muted, and the coloured format dots remain beside each format chip. All four status filters retain explicit guidance; the mobile banner stacks at ≤680px. Jules passed source review and final visual checks at 1920×1052 and 390×844. See [current evidence](PHASE_PLUGINHUB_SYNTHETIC_STATUS_UI_20261030.md).

The synthetic UI clarity gap is closed. The authenticated status projection is now connected to the visible Library as described above. The snapshot currently contains unchecked and stale observations; it does not contain fresh vendor-backed results.

## Historical synthetic preview checkpoint — counts and markers

Source commit [`1018be83b451b8db6429ba5bf3b869f223fed40b`](https://github.com/begb0037admin/aimm/commit/1018be83b451b8db6429ba5bf3b869f223fed40b) now demonstrates record-level status display and filtering in the opt-in synthetic fixture: 3 Updates, 4 Up to date, 3 Manual check and 4 Unchecked across 14 format records. Deployment `1a442d22-c05b-4fbd-a3c4-6cfcccd72288` was the current development Pages preview at that checkpoint. These values are generated in memory and do not come from vendor observations or the authenticated account status endpoint. Jules passed source review and deployed visual review at 1920×815. At 390×844, layout metrics confirm one column and no horizontal overflow; the sidebar is an icon rail and the lower page was not visually captured.

The live Library connection gap below remains open.

## Current source trace

The Library API exposes authenticated `GET /v1/status-summary`. It reads the selected account/device’s current complete inventory generation, applies freshness rules to generation-bound check observations, and returns counts and per-format records for update, up-to-date, manual, unchecked, error and stale states. `library-api/library-account.js` uses this endpoint for Hope’s `get_plugin_status` tool.

The visible Library now reads account status through the isolated read-only bridge in `library-api/library-status-view.js`; it does not join account records to browser `INV_SCAN_ROWS`. The exact API device/generation/record identity remains attached to each format row. Earlier synthetic source commits `178b6e82d18f63dca2f9849c3cf80b25a9a87cd8` and `1018be83b451b8db6429ba5bf3b869f223fed40b` remain UI fixtures only; they are not vendor observations.

## Completed source groundwork

Reviewed source commit [`8101fdaf364524407a4bc0432f1d1f90bc2773f0`](https://github.com/begb0037admin/aimm/commit/8101fdaf364524407a4bc0432f1d1f90bc2773f0) adds nullable `publisher_name`, `publisher_source` and `canonical_product_id` fields to Companion/API format records. The Companion uses only explicit Info.plist `Manufacturer` and `Vendor`; source labels distinguish those keys. The API accepts only those two labels, requires the name/source pair and Info.plist metadata, and rejects non-null canonical IDs until a reviewed mapping exists. No path, filename or bundle-ID inference is promoted to identity. Opaque record IDs remain unchanged and local paths are not uploaded.

The API finalization INSERT and both paged Library queries now carry publisher fields. `/v1/status-summary` also returns publisher and canonical fields. Migration `0022_publisher_identity.sql` is present in branch source but has **not** been applied remotely. Existing records remain unresolved. Jules passed exact-source review. Follow-up source commit `1cd91114497184496063afb91b8fdbec7c763087` also preserves status device/generation/record IDs and nullable publisher identity fields in Hope’s read-only account tool output; this does not connect the visible Library. See [Hope status projection evidence](PHASE_PLUGINHUB_ACCOUNT_STATUS_TOOL_PROVENANCE_20261030.md) and [publisher provenance evidence](PHASE_PLUGINHUB_PUBLISHER_IDENTITY_20261030.md).

## Remaining identity and UI work

The browser scanner and Companion still have different row models. The browser’s `invReadBundle` expands AU `AudioComponents` into component rows and has display-only publisher heuristics; the Companion emits one bundle-level record. Multi-component AU records therefore still cannot be joined row-for-row to local UI records. Do not promote folder names or bundle-ID segments to authoritative publisher identity. Preserve bundle-level action targets while defining a reviewed component/product roll-up.

The API reports status at format-record level. Product totals and any product-level roll-up need explicit matching semantics. Until a reviewed canonical mapping exists, keep product and format-record totals separate and preserve stale/error states.

## Required implementation sequence

1. **Source groundwork complete:** bounded publisher provenance and nullable canonical identity fields are in the Companion/API contract. Canonical IDs remain null and are rejected on ingestion until reviewed mapping is implemented.
2. **API projection complete; mapping/roll-up remains:** publisher provenance is returned in inventory and status rows. Define reviewed canonical identity and product/format count semantics before product-level status roll-up.
3. **UI connection implemented; ready for review:** the status scopes and counts use the authenticated generation-bound snapshot. Device/generation/record identity, freshness, stale/error and per-format states are preserved. Synthetic mode remains isolated and never appears as live status.
4. **Tools open:** implement Install Manager on verified vendor observations and existing Companion installer/action contracts, with per-item progress and receipts. Complete every remaining Tool through real workflows; do not expose no-op buttons.

## Verification and limits

Focused checks against the exact GitHub source passed: `node --check` for the Worker, foundation test file and `library-account.js`; extracted publisher-normalization cases for valid provenance, null publisher, unsupported source, filename-only provenance and non-null canonical-ID rejection; and migration 0022 plus its source constraint against an in-memory SQLite fixture. The synthetic API assertions were added to `foundation.test.js`, but the full `npm test` suite was **not run**: an isolated Git clone failed because this environment could not resolve GitHub. The dirty local checkout was left untouched.

The current review called the authenticated status-summary endpoint read-only and read account rows; it did not scan folders or trigger vendor checks. The successful development Pages preview is [062ec0f2](https://062ec0f2.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), with the signed-in [branch review route](https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/?review=aa4c38c). No remote migration or Worker deployment was applied. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch build.
