# PluginHub — current D1 identity, migration, and synthetic isolation check

**Observed:** 2026-10-25 17:22–17:30 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Verified branch head before this record update:** `203430d4077dfa236b5df68ad580ae58aa401568`  
**Cloudflare API profile:** `kevin@lelitte.com`  
**Account:** `f1896a0ef4e88f1f90abcc2cbbdd87f1`  
**Database:** `aimm-library-foundation-dev` / `66c91fd6-fae8-43a1-8e3b-372274acd7dc`

## Identity and chronology

The connected Cloudflare API session exposed the project account and verified the exact database name and UUID. Cloudflare reports creation at `2026-10-23T22:47:13.736Z`; the owner-confirmed 22:47 creation gate remains resolved, and the separate 22:51 retention timestamp is preserved. The earlier Wrangler profile is still signed into a different account (`4338cbf377b201a3d0b85f43f5a35a79`), so Wrangler itself was not used for these database operations. No broader OAuth login was attempted.

The list endpoint and exact database endpoint both returned the expected database. Metadata reports region `WEUR`; the exact database endpoint reports 25 tables. A bounded schema-name read found 26 non-system entries because it includes Cloudflare's `_cf_KV` table. No row contents from existing accounts or devices were read.

## Migration state

A read-only query of `d1_migrations` returned all 21 source migrations, through `0021_restore_actions.sql`. The latest migration remains `0021_restore_actions.sql`. No schema changes were needed or made.

## Synthetic account-isolation probe

Before the probe, bounded aggregate counts were 2 accounts, 4 devices and 4 device credentials. Two synthetic accounts were inserted, then one synthetic device was attached to the second account. An attempted credential row pairing the first account with the second account's device was rejected by D1 with `SQLITE_CONSTRAINT_FOREIGNKEY`, as expected from the composite ownership constraint.

The two synthetic accounts were deleted; cascading cleanup removed the synthetic device. Follow-up counts were zero for all synthetic account, device and credential markers. Aggregate counts returned to 2 accounts, 4 devices and 4 credentials. The failed cross-account credential insert created no row. All final reads reported zero rows written and `changed_db: false`.

This verifies the database-level ownership constraint. It does not verify Auth0 claims, Worker route authorization, or an authenticated two-user HTTP flow.

## Recovery evidence and limit

Cloudflare returned the current D1 time-travel bookmark `0000002e-00000000-0000510f-6808aba87798d1da272420c264fc537a`. This verifies that a recovery bookmark is available. No restore was performed: the supported restore operation rewinds the whole shared development database, which currently contains non-synthetic account, device and credential rows. Rewinding it to test synthetic recovery could discard intervening application changes. No broad export or user-row access was performed.

The existing synthetic export-to-SQLite recovery fixture remains local evidence only. A live D1 recovery test still needs an isolated synthetic-only recovery target or a controlled restore window that protects the existing database state.

## Local non-production verification

`sh scripts/pluginhub-nonprod-check.sh` passed after the default sandbox denied SwiftPM's manifest subprocess and the rerun used the already authorized local build scope. It passed the ad-hoc signed preview build, Swift journal/recovery, installer transfer and redirect checks, scanner 3/3, API/browser 38/38, local D1/Worker checks, synthetic two-account rejection, and Swift pairing/sync/Manual Check/reveal/move/restore flows. The suite used disposable local state and did not access the remote D1.

## Disposition

- Exact non-production database identity: **VERIFIED**.
- Current migrations: **ALIGNED THROUGH 0021**.
- D1 composite account/device ownership check: **PASS**; synthetic rows cleaned up.
- Time-travel bookmark availability: **VERIFIED**; restore not run.
- Local non-production suite: **PASS**; remote database not accessed by the suite.
- Auth0-backed two-account Worker isolation: **OPEN**.
- Live D1 recovery: **OPEN**.
- Foundation exit: **NOT MET**; Stage 6 remains gated.
- No deployment, cutover, production access, provider terms acceptance, or credential creation occurred in this checkpoint.
