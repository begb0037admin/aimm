# PluginHub Foundation — D1 authorization chronology and verification addendum

**Date:** 2026-10-24  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Starting commit:** `730b4746988dfdf5ba64cb37e16e9582229ca56e`  
**Scope:** Owner chronology review and live non-production D1 evidence only. This is not independent Stage 5 validation or a Stage 6 decision.

## Authorization chronology review

The initial review documented uncertainty. Kevin later confirmed that creation was authorized; see the [D1 authorization confirmation](PHASE_PLUGINHUB_FOUNDATION_D1_AUTHORIZATION_CONFIRMATION_20261024.md). This supersedes the earlier uncertainty without changing the contemporaneous timestamps.

| UTC time | Primary record | Observation |
|---|---|---|
| 2026-10-23 22:45:30 | Commit `bd871c9c6b0f319a7a321337e902c1beca2089f1` | Foundation scope was recorded as authorized, while the retention implementation entry gate was still pending. |
| 2026-10-23 22:47:13.736 | Cloudflare D1 database metadata GET | The empty non-production database `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`) was created. |
| 2026-10-23 22:47:47 | Commit `7871e99bacc4446394dfc566afc258c68373b435` | The checkpoint records that empty D1 resource and still describes the entry gate as pending. |
| 2026-10-23 22:51:26 | Commit `37aef4a6c53cea07af5edbdcaccccb9c5742a0f2` | The retention decision records approval of 90-day receipt and 30-day share/profile/deleted-account backup limits. |
| 2026-10-23 22:51:40 | Commit `a2cffab323c14e4316103053d45bc25ccdf87503` | The restart checkpoint records the retention gate as resolved. |

The Foundation authorization record includes non-production D1 setup in scope, but the checkpoint still marked the retention entry gate pending when the database was created. The database creation predates the recorded retention approval by about four minutes. The earlier records alone did not independently establish authorization. Kevin subsequently confirmed it in the owner addendum linked above. That confirmation is an owner attestation, not a backdated artifact. The 22:51 written retention approval remains a distinct later timestamp.

**Initial owner review outcome (2026-10-24):** Kevin was initially unsure whether creation at 22:47 UTC was authorized. This was superseded by the later explicit owner confirmation recorded in [D1 authorization confirmation](PHASE_PLUGINHUB_FOUNDATION_D1_AUTHORIZATION_CONFIRMATION_20261024.md). The gate is now **RESOLVED BY OWNER CONFIRMATION**; the timestamps remain unchanged.

## Direct D1 verification

The authenticated Cloudflare connection returned account `Kevin@lelitte.com's Account` (account ID `f1896a0ef4e88f1f90abcc2cbbdd87f1`). A direct metadata GET for the exact database UUID returned name `aimm-library-foundation-dev`, creation time `2026-10-23T22:47:13.736Z`, region `WEUR`, no jurisdiction lock, eight tables including Cloudflare and migration tables, and file size 135168 bytes.

A read-only `sqlite_master` query confirmed the deployed DDL contains:
- `devices_id_account_unique` on `devices(device_id, account_id)`;
- composite foreign keys from both `device_credentials(device_id, account_id)` and `action_receipts(device_id, account_id)` to the matching device/account pair;
- the 90-day receipt expiry check and 30-day share, profile and deletion-tombstone bounds;
- the `deleted_identities` table and retention indexes.

The read-only `d1_migrations` query returned:
```text
1 | 0001_foundation.sql | 2026-10-23 23:11:56
2 | 0002_enforce_ownership_and_retention.sql | 2026-10-23 23:12:24
```

Before the probe, application-table counts were zero. A synthetic negative insert used two temporary accounts and one device owned by the second account, then attempted to insert a device credential pairing that device with the first account. D1 rejected the insert with HTTP 400, SQLite error 7500, `SQLITE_CONSTRAINT_FOREIGNKEY: FOREIGN KEY constraint failed`. The synthetic accounts were then deleted; the follow-up query returned zero rows for both probe accounts, the probe device and the rejected credential. Post-probe application counts remain zero.

These are direct Cloudflare API observations made by the executing session. The SQL schema/history and cross-account rejection are now evidenced here; this does not replace fresh independent validation, nor does it establish API runtime/account-isolation behavior.

## Remaining Foundation gates

Foundation exit remains **NOT MET**. Still open:
- D1 creation authorization is resolved by Kevin's owner confirmation; no further confirmation is pending. The timestamp distinction remains documented.
- Owner-authenticated Auth0 development setup and client/scope configuration where required. No tenant, provider terms, credentials or paid feature were created or accepted.
- Authorized Worker runtime evidence for token profiles/scopes, account isolation, deletion and cleanup. The Worker is not deployed.
- Backup expiry and recovery evidence within the approved 30-day limit. No restore was attempted; the current D1 Free Time Travel window is seven days.
- Browser HttpOnly session/CSRF and device-pairing implementation and evidence.

No production data, Worker deployment, provider/legal action, credential creation, merge, cutover or release occurred. No build or test suite was run. This bounded SQL constraint probe used only temporary synthetic rows and confirmed their removal.
