# PluginHub — remote non-production D1 migrations 0010–0021

**Observed:** 2026-10-25, approximately 14:37–14:42 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Source checkpoint:** `3ba0b9dc3c7b8b176520c1b1d83414f38d26b8bb`  
**Cloudflare account:** `f1896a0ef4e88f1f90abcc2cbbdd87f1`  
**Database:** `aimm-library-foundation-dev` / `66c91fd6-fae8-43a1-8e3b-372274acd7dc`  
**Scope:** Apply the approved source migrations to the exact existing development D1; verify the ledger and run the approved local test suite. No deployment, production access, provider terms, or credential creation.

## Authorization and identity

Kevin approved applying migrations 0010–0021 to the named development database as part of the bounded non-production continuation. The 22:47 database-creation authorization chronology remains resolved by owner confirmation; the distinct 22:51 retention approval is preserved.

Before writing, the connected Cloudflare API returned HTTP 200 for the exact database UUID and name under account `f1896a0ef4e88f1f90abcc2cbbdd87f1`. The earlier Wrangler account `4338cbf377b201a3d0b85f43f5a35a79` remains the wrong account. The pre-write `d1_migrations` ledger ended at `0009_check_comparison_reason.sql`.

Pre-write aggregate counts were: operations 0, operation items 0, library marks 0, accounts 2, devices 4. No account or device rows were read or changed. The rebuild migrations preserve and copy their operation rows; the operation tables had no rows before the migration.

## Migrations applied

Applied each source file in order, recording its filename in Wrangler's `d1_migrations` ledger after the SQL succeeded:

- `0010_action_retries.sql`
- `0011_vendor_site_action.sql`
- `0012_launch_hub_action.sql`
- `0013_webauthn_credentials.sql`
- `0014_webauthn_authentication_challenges.sql`
- `0015_action_preview_authorization_binding.sql`
- `0016_encrypted_action_previews.sql`
- `0017_owner_preview_capabilities.sql`
- `0018_move_to_unused_action.sql`
- `0019_snooze_reason.sql`
- `0020_version_bound_marks.sql`
- `0021_restore_actions.sql`

Each Cloudflare D1 query returned HTTP 200 with no SQL errors. A follow-up read of `d1_migrations` returned all 21 migrations, through `0021_restore_actions.sql`. The migration table is now aligned with the source schema. D1's query endpoint denied `PRAGMA integrity_check` with `SQLITE_AUTH`; no broader permission or export was attempted.

## Local verification

`sh scripts/pluginhub-nonprod-check.sh` passed after the default shell sandbox denied SwiftPM's sandbox subprocess. The approved validation rerun passed preview app signing, Swift build and journal/recovery, installer staging/redirect safety, scanner 3/3, API/browser 38/38, local D1 migrations, local Worker auth/CORS, synthetic two-account credential rejection, and actual Swift pairing, inventory sync, Manual Check, reveal, move and restore receipts.

These results are local synthetic checks. They do not establish live Auth0 login, remote Worker account isolation, browser session/CSRF behavior, or live D1 recovery.

## Runtime and recovery gates

The dev Worker `aimm-library-api-dev` remains bound to the verified D1. Its configured secret list is empty; source requires `ACTION_PREVIEW_ENCRYPTION_KEY` to store exact-path action previews. Until that secret is configured through the secure project vault path, the protected action-preview route returns `503 preview_encryption_unavailable`. No key was generated, copied, or exposed.

The Worker health URL could not be reached from this session: shell DNS could not resolve `aimm-library-api-dev.kevinlelitte.workers.dev`; the browser automation surface was unavailable and the web reader does not fetch this custom Worker URL. Wrangler 4.152.0 remains unauthenticated because its stored token expired and the Cloudflare auth endpoint is unreachable. The Cloudflare connector could verify Worker metadata but was not used to deploy. 1Password CLI 2.41.0 could not connect to the desktop app, so secure key provisioning and vault storage were not attempted.

No Auth0 user was created in this checkpoint. No live account-isolation HTTP probe, backup/restore, or independent review was run. A previous SQL `PRAGMA integrity_check` denial is not represented as a recovery pass. No deployment or cutover occurred.

## Disposition

- Remote D1 schema: **ALIGNED THROUGH 0021**.
- Local non-production suite: **PASS**.
- Auth0-backed remote runtime and authenticated route isolation: **OPEN**.
- Browser session/CSRF and real device pairing: **OPEN**.
- Live D1 recovery: **OPEN**.
- Independent end-to-end Foundation review: **OPEN**.
- Foundation: **NOT MET**; Stage 6 remains gated.
