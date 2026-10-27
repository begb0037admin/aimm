# PluginHub Foundation — synthetic account isolation probe — 2026-10-27

## Result

**Partial live account-isolation evidence recorded.** The signed-in development preview continued to return the signed-in account's 1,641-item Library after a clearly labelled one-item fixture was inserted under a separate synthetic account in the isolated D1 database. Searching the refreshed account inventory for the synthetic marker returned **0 of 1,641 products**. The fixture was then removed; a bounded readback confirmed zero remaining rows for its test account, device, generation, inventory record, and inventory head.

This verifies the preview's account-backed Library read path did not expose the second account's sentinel. It does not complete the full Foundation isolation gate: two separately authenticated OIDC users were not exercised, and a live paired-device credential presented against the other device's identity URL was not sent.

## Environment and scope

- Branch: `codex/pluginhub-foundation`
- Source commit before evidence-record update: `c7c275860d14d89997609de5b4fb3f8f649026b4`
- Database: `aimm-library-foundation-dev`
- Database ID: `66c91fd6-fae8-43a1-8e3b-372274acd7dc`
- Synthetic non-production data only. No personal account rows were selected or exported.
- No migration, deployment, production access, or provider credential change occurred.

## Procedure and observations

1. Read the live schema definitions for `accounts`, `devices`, `scan_generations`, `published_inventory_records`, and `device_inventory_heads`; checked reserved fixture identifiers were absent.
2. Added one synthetic account, one synthetic device, one complete one-record generation, one inventory head, and the sentinel record `AIMM Foundation Isolation Probe (Synthetic)` in the development D1 database.
3. Used the already signed-in development preview's **Compare inventory** control to refresh its account snapshot. The account API still reported 1,641 items. Searching the account inventory for the exact sentinel name displayed **0 of 1,641 products** and “No products match these filters.”
4. Deleted only the fixture rows by their reserved identifiers in dependency order. A follow-up query returned 0 for each of: fixture account, device, generation, published record, and inventory head.

## Limits and remaining checks

- The preview was authenticated as the existing account; the test did not create or use a second Auth0 user or obtain a second OIDC token. The second account was an explicitly synthetic D1 fixture.
- The live wrong-device `GET /v1/devices/{other-device-id}/identity` request with a paired device credential was not executed. A direct shell connectivity check to `aimm-library-api-dev.kevinlelitte.workers.dev` failed DNS resolution (`curl` exit 6, “Could not resolve host”), before any HTTP request was sent.
- Therefore this is positive evidence for one live account-scoped inventory read, not proof of every account API route or device-credential binding.

## Gate state

The synthetic preview isolation observation is **MET for this specific read path**. Full remote isolation and paired-credential wrong-device rejection remain **OPEN**. Stages 2–5 remain partial; independent Foundation review remains PARTIAL; synthetic recovery remains MET; Foundation exit remains **NOT MET**; Stage 6 remains gated.
