# Hope account status provenance projection — 2026-10-30

## Change reviewed

Branch source commit [`1cd91114497184496063afb91b8fdbec7c763087`](https://github.com/begb0037admin/aimm/commit/1cd91114497184496063afb91b8fdbec7c763087) updates only `library-api/library-account.js`. The read-only installed-inventory tool now preserves nullable publisher name/source and canonical product ID from the API. The read-only `get_plugin_status` tool now preserves device, generation and record IDs plus nullable publisher/canonical identity fields, and its search includes publisher and bundle identifier.

These IDs are opaque API join keys; the projection does not include local paths, credentials, cookies or tokens. Older API responses without optional provenance remain null-safe. Existing action behavior is unchanged.

## Review and verification

Jules reviewed the exact source commit and returned **PASS**. `node --check` passed on the exact branch file. No automated test or deployment was performed for this change.

## Remaining boundary

This improves Hope’s account tool output, not the visible Library UI. The status filters/counts on the page still use the synthetic/local view and do not consume the authenticated status snapshot. The 0/0/0/14 values remain synthetic. No account rows were read, no remote migration was applied, and no Worker was deployed. Foundation remains **NOT MET**; Stage 6 remains gated. The development Worker passkey RP fix remains a surgical patch, not a reproducible branch build.
