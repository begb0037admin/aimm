# PluginHub Foundation — D1 account correction and bounded validation

**Observed:** 2026-10-25 13:38–13:40 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Starting branch commit:** `a0cf4ecc262a5495959ddc41eb4bcccd38dd7cda`  
**Scope:** Authorization chronology review, exact non-production D1 identity and migration read, synthetic ownership constraint probe, and existing recovery-artifact recheck. No deployment or cutover.

## Authorization chronology

The 22:47 database-creation authorization is resolved by Kevin's owner confirmation. Kevin's latest “yes” confirms clearing the review gate. This changes the gate disposition only; it does not change timestamps or imply that the later retention approval happened earlier. Cloudflare records the database creation at `2026-10-23T22:47:13.736Z`; the written retention approval remains at 22:51 UTC. The bounded validation remains limited to the named non-production database, synthetic checks, and a suitable non-production recovery path.

## Account mismatch corrected

The earlier identity checkpoint looked in Wrangler's authenticated account `4338cbf377b201a3d0b85f43f5a35a79` and got an empty database list and error 7404 for the configured UUID. That was the wrong Cloudflare account for this project; it did not show the database had disappeared.

The connected Cloudflare API read against the account already named in the D1 authorization evidence, `f1896a0ef4e88f1f90abcc2cbbdd87f1`, returned HTTP 200 for database `aimm-library-foundation-dev`, UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. Metadata reports 20 tables and 282,624 bytes. No replacement database was created, no binding was changed, and no schema migration was applied.

## Migration state

A direct read of `d1_migrations`, served by the WEUR primary (LHR), returned migrations `0001_foundation.sql` through `0009_check_comparison_reason.sql`. In particular, `0003_browser_sessions.sql` is already present, applied at `2026-10-24 09:18:11`. The read query reports 9 rows read, 0 written, and `changed_db: false`; therefore the conditional migration step was unnecessary.

## Synthetic cross-account constraint probe

Two synthetic accounts and a device owned by the second account were inserted temporarily. An attempt to attach that device to a credential row for the first account was rejected by Cloudflare D1 with HTTP 400 / SQLite `SQLITE_CONSTRAINT_FOREIGNKEY`. This demonstrates the deployed composite ownership constraint at D1 level; it does not prove OIDC token handling or Worker route authorization.

The probe's cleanup deleted the synthetic accounts, cascading their device. A separate follow-up read found zero rows matching the probe markers in `accounts`, `devices`, and `device_credentials`. No existing account rows were enumerated or altered. No application rows were written by the final verification read. The failed insert is the expected negative result, not a test failure.

## Recovery artifact recheck

No export was taken from the live database and no D1 restore was attempted. The existing corrected synthetic recovery snapshot `artifacts/PHASE_PLUGINHUB_FOUNDATION_D1_FULL_RECOVERY_EXPORT_20261024.sql` was re-applied to fresh in-memory SQLite. Its SHA-256 remains `d7a920bb6864999a36a517331c0e13b37e6a68fc22836d6978701c5ed74775c1`; integrity check returned `ok`, foreign-key check returned zero violations, and the synthetic account, device, and browser session were present. This revalidates the existing export-to-SQLite fixture only; it is not a Cloudflare D1-to-D1 restore, backup expiry/purge proof, or recovery of the current live database.

For clarity, the older 3,715-byte empty export `PHASE_PLUGINHUB_FOUNDATION_D1_EXPORT_20261024.sql` still fails `PRAGMA foreign_key_check` with `foreign key mismatch - "action_receipts" referencing "devices"`. The prior recovery addendum already marks that artifact superseded; this checkpoint does not rely on it. The separate 1,529-byte synthetic fixture also passes integrity and foreign-key checks and contains the expected account and device.

## Runtime check and limits

A prior read-only check of the existing dev Worker returned HTTP 200 from `/health` and HTTP 401 from unauthenticated `/v1/me`, with no account data returned. No Worker deployment occurred. This confirms availability and unauthenticated rejection only. No Auth0-authenticated browser session, two-user HTTP isolation, browser CSRF/session lifecycle, real device pairing, or deletion/cleanup route was exercised in the live Worker during this checkpoint.

## Disposition

- D1 creation chronology gate: **RESOLVED BY OWNER CONFIRMATION**; preserve the 22:47 creation and 22:51 retention timestamps.
- Exact database: verified in account `f1896a0ef4e88f1f90abcc2cbbdd87f1`.
- Migration 0003: already applied; no migration write needed.
- D1 composite ownership probe: rejected a cross-account credential/device link; synthetic residue count zero.
- Recovery: existing synthetic export-to-SQLite fixture rechecked; real D1 restore remains open.
- Foundation: **NOT MET**. Stage 6 remains gated.

Open Foundation evidence still includes Auth0-backed runtime and real browser/device pairing; two-account isolation through authenticated Worker routes; browser session/CSRF and account deletion/cleanup behavior; a suitable live non-production backup recovery check; live browser-to-Mac parity and outstanding Stage 2–5 criteria; and a fresh independent end-to-end review. No provider terms were accepted, no credentials were created, no production data was accessed, and nothing was deployed or cut over.
