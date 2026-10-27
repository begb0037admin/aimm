# PluginHub — bounded non-production D1 and Worker validation

**Observed:** 2026-10-27 23:03 UTC  
**Branch at start:** `f804f23c8d98d6288c76cd7a39c428ac17532e76`  
**Authorization:** Kevin approved clearing the current D1 validation/write hold in this conversation for the bounded synthetic non-production checks. This scope is limited to the existing development database and synthetic fixtures. The historical 22:47 database-creation authorization remains separately resolved by owner confirmation; see [authorization chronology](PHASE_PLUGINHUB_FOUNDATION_D1_AUTHORIZATION_CONFIRMATION_20261024.md), blob `58944ee7c2603f7f36b435163827e5ce04a80c3d`.

## Database identity and migration state

Cloudflare authenticated profile: `kevin@lelitte.com`; account `f1896a0ef4e88f1f90abcc2cbbdd87f1`. Exact-name lookup returned one `aimm-library-foundation-dev` match with UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. Fetching that exact UUID confirmed the name, creation time `2026-10-23T22:47:13.736Z`, WEUR primary region, replication disabled, and 25 application tables. The list endpoint's `num_tables` summary said 0; direct UUID metadata and a bounded `sqlite_master` table-name query confirmed the application schema is present (25 application tables plus SQLite/Cloudflare support tables). No table contents were exported.

A bounded `d1_migrations` read returned all 21 migrations, `0001_foundation.sql` through `0021_restore_actions.sql`. `0003_browser_sessions.sql` is applied. No migration was run.

## Synthetic ownership and live device-credential isolation

A two-account D1 fixture (Accounts A and B, Device A) tested the composite ownership constraint. Inserting a credential row that paired Account B with Account A's device was rejected by Cloudflare D1 with HTTP 400 / error 7500 / `SQLITE_CONSTRAINT_FOREIGNKEY`, as expected. Cleanup removed the three inserted rows; a bounded verification returned zero fixture accounts, devices, and credentials.

A second fixture created one synthetic account with devices A and B and an ephemeral synthetic bearer credential stored only as a hash for Device A. Against the live development Worker:
- `GET /v1/devices/{device-A}/identity` with that credential returned **HTTP 200** (positive control).
- The same credential sent to `GET /v1/devices/{device-B}/identity` returned **HTTP 401 unauthorized**.

This is a live endpoint test with a synthetic credential, not the paired Mac's real credential. Cleanup removed all four inserted rows; bounded verification returned zero fixture accounts, devices, and credentials. An initial malformed one-shot request was discarded because its test command sent an empty authorization header; its fixture was also cleaned, and it is not counted as a result.

## Runtime and recovery evidence

- Live non-production `GET /health`: **HTTP 200**, `{"status":"ok","service":"aimm-library-api","api_version":1}`.
- Live unauthenticated `GET /v1/me`: **HTTP 401 unauthorized**.
- Remote synthetic-only D1 Time Travel recovery had previously passed on a separate temporary database using the current 21-migration schema; that temporary database was deleted. See [recovery evidence](PHASE_PLUGINHUB_D1_TIME_TRAVEL_RECOVERY_20261025.md), blob `6d3d3f881bc6d861744d9bd72dfbaec6074b75f3`. No restore or rewind was run against the shared project database.

## Disposition and limits

- Exact development database and current migration state: **PASS**; migration 0003 already applied.
- Synthetic cross-account D1 ownership constraint: **PASS**; cleanup verified.
- Live Worker device credential binding: **PASS for synthetic credentials**; correct device 200, different device 401; cleanup verified.
- Worker health and unauthenticated rejection: **PASS**.
- Existing isolated synthetic D1 Time Travel recovery: **PASS**, per linked evidence; not repeated in this session.
- Real Auth0 User A/B session and CSRF isolation, current paired Mac credential wrong-device check, remote companion move/restore action and recovery, remaining Library parity (317 browser-only and 2 version differences), and fresh independent end-to-end Foundation validation: **OPEN**.
- The current D1 validation/write hold is cleared for this bounded non-production synthetic scope only. No production data, migration, credential change, provider terms, Worker change, deployment, or cutover occurred.

Foundation remains **NOT MET**; Stage 6 remains gated.
