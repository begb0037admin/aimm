# PluginHub Foundation — Fresh Stage 5 Independent Review

**Date:** 2026-10-24  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Branch head reviewed:** `123102b2fa6aa73d40aff57665cb633286cfccc8` (the branch compared identical to this commit before this report was added)  
**Reviewer model:** GPT-6 (Codex agent)  
**Reasoning effort:** Unavailable in this session  
**Method:** Read-only review of the approved architecture, handover, closeout, evidence package, source, migrations and D1/recovery records; independent read-only Cloudflare D1 queries; local in-memory SQLite validation of the pinned export artifact.  
**Review report:** This file is the sole repository write for this review. No deployment, Auth0 change, remote D1 write, or provider action was performed.

## Disposition

**Stage 5: PARTIAL. Foundation exit: NOT MET. Stage 6 is not ready.**

The D1 creation authorization question is resolved by Kevin's explicit owner confirmation. The 2026-10-23 22:47:13.736 UTC creation time and the distinct 22:51 UTC written retention approval remain separate and unchanged.

A recovery artifact defect was reproduced: the pinned empty D1 SQL export cannot pass SQLite foreign-key validation because it omits a unique index required by a composite foreign key. The account/device fixture restores only a subset of the schema and does not establish full-schema recovery. Provider-backed Worker/browser evidence and device pairing also remain incomplete.

## Branch and evidence pins

The branch was retrieved through the connected GitHub source. GitHub comparison reported the branch identical to `123102b2fa6aa73d40aff57665cb633286cfccc8`.

| Record or source | Commit / blob |
|---|---|
| Current evidence package | commit `dc329e693672f196e99e0b351d0ddc257ec4f43e` / blob `5637d7241c77a0462dd75ad021f7ffd9c657eb37` |
| Current closeout | blob `a11a6e863e16dd4fd8e0260aa53014e6c89209d0` |
| Remote D1 recovery record | blob `dbf78fb7337e693a4f07ef7600d22ea77f302479` |
| Owner D1 authorization confirmation | blob `58944ee7c2603f7f36b435163827e5ce04a80c3d` |
| Auth0 setup checkpoint | blob `667a03260121cc3e25e45ce92c8ccb36e831a4be` |
| Worker source | blob `aabfb0f64e501642c311f11a3f0a5f35bd7659b7` |
| Migration 0001 | blob `21838cf37171bd59fb10207679ff432872658e13` |
| Migration 0002 | blob `374781b9ded5dfa7d07993ceaf05f65095ae617a` |
| Migration 0003 | blob `d82f4a228b2df079d265b482bc0f940d41396111` |
| Empty D1 SQL export artifact | commit `2133a11749deeb2214d522b1481f6e07345c70d0` / blob `64d6daaa0afd8acb73fef37edeaf3daf97779394` |
| Synthetic recovery fixture SQL | commit `47578315fe9c13b94882325290ce9023a0eb9860` / blob `01ad2e57d976964df630d7d87b9df2f5c57910c7` |
| Dashboard snapshot recorded by package | commit `49e661cd3180784bfb2f142f3f1e7bf4f8ed7c68` / blob `7fcf7a4bf6029e437b65fa427e37a81aefce8107` |
| Roadmap snapshot recorded by package | commit `49e661cd3180784bfb2f142f3f1e7bf4f8ed7c68` / blob `cfb7dac93e1e4d844c29a62d1fae90d85b9673d6` |
| Status snapshot recorded by package | commit `49e661cd3180784bfb2f142f3f1e7bf4f8ed7c68` / blob `61d80eb570d87329d4eb5d7dd468444ee0296743` |

The approved architecture is `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`. The pinned closeout describes the current stage as Foundation and preserves Foundation exit as NOT MET.

## Independent D1 chronology and state check

The owner confirmation records Kevin's later statement, “i have approved it”, as confirmation that the empty development database creation was authorized. It explicitly does not represent that statement as a contemporaneous 22:47 artifact. The separate written retention approval remains at 22:51 UTC. I accept the owner confirmation for the authorization gate as instructed; neither timestamp is rewritten.

Using read-only Cloudflare API calls, I independently checked database `aimm-library-foundation-dev`, UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`:

- Metadata returned the exact database name and UUID, creation time `2026-10-23T22:47:13.736Z`, region `WEUR`, and disabled read replication.
- `d1_migrations` contains 0001, 0002 and 0003, with 0003 recorded at `2026-10-24 09:18:11`.
- Read-only counts returned zero rows for accounts, devices, credentials, browser sessions, action receipts, shares, profiles and tombstones.
- Live `sqlite_master` confirmed `devices_id_account_unique`, composite device/account foreign keys for credentials and receipts, and the configured retention/session checks and indexes.
- Queries reported zero rows written. I did not repeat the reported cross-account rejection probe because this review was read-only.

A read-only Worker scripts listing did not contain `aimm-library-api-dev`; the Foundation Worker is undeployed.

## Recovery artifact validation

The recovery record claims that the pinned export was restored into fresh SQLite and reports `PRAGMA integrity_check = ok`. I independently fetched the exact pinned export artifact and restored its SQL into an in-memory SQLite database. The integrity check returned `ok`, but the subsequent statement:

```sql
PRAGMA foreign_key_check;
```

raised:

```text
sqlite3.OperationalError: foreign key mismatch - "action_receipts" referencing "devices"
```

The export defines `action_receipts` with:

```sql
FOREIGN KEY (device_id, account_id)
  REFERENCES devices(device_id, account_id) ON DELETE CASCADE
```

but omits the parent unique index `devices_id_account_unique ON devices(device_id, account_id)`, which is present in the live D1 schema and is needed for that composite reference. The export also omits the live schema's secondary indexes. Therefore the submitted SQL artifact is not a full schema/index recovery image, even though its empty database passes `integrity_check`.

The separately pinned synthetic fixture contains only accounts, devices and migration history plus one synthetic account/device. It can demonstrate those rows were represented in a SQL copy, but it does not demonstrate full-schema restore or a Cloudflare D1-to-D1 recovery. This review does not conclude that Cloudflare native Time Travel is broken; it finds that the submitted export-copy artifact is incomplete and its documented recovery claim is insufficient.

## VT findings

| VT | Result | Finding |
|---|---|---|
| **VT-01 — Authorization, scope and phase boundary** | **PASS** | Kevin's explicit owner confirmation resolves the 22:47 D1 creation authorization. The evidence preserves the later confirmation and keeps the 22:51 retention approval separate. No reviewed evidence showed production data, deployment, merge, cutover or release. |
| **VT-02 — Repository writes and evidence integrity** | **PARTIAL** | The current package and source pins resolve. However, closeout and handover retain duplicate historical/current checkpoint text with stale package/provider statements alongside newer records. The records need a single reconciled latest ledger so a cold session can identify authoritative state without interpreting conflicting snapshots. |
| **VT-03 — API authentication and account isolation** | **PARTIAL** | Current source validates RS256, issuer, audience, allowlisted `azp`, accepted grant profile and required route scopes; its account/device access is scoped by account. The package reports 5/5 local synthetic tests. The Auth0 checkpoint still records the SPA `read:library` grant at 0/1. No real provider token, authenticated Worker HTTP route, browser session/CSRF, or HTTP cross-account rejection test is evidenced. The Worker is undeployed. |
| **VT-04 — Schema integrity and migration state** | **PARTIAL** | Independent read-only checks confirmed the live D1 migration history through 0003, current DDL, indexes, constraints and empty application tables. The prior remote rejected cross-account insert remains executor-reported; I did not write a probe during this read-only review. |
| **VT-05 — Retention, deletion and provider claims** | **PARTIAL** | Source and live DDL contain bounded deletion/tombstone, expiry and cleanup mechanisms. Local tests are reported, but no deployed Worker runtime deletion/cleanup check or provider-backed deletion/retention proof is available. The seven-day development Time Travel window is reported as within the approved 30-day maximum; production backup behavior remains unverified. |
| **VT-06 — Backups and rollback** | **FAIL** | The pinned full-schema SQL export reproduces a SQLite foreign-key mismatch due to a missing required unique index. The synthetic fixture restores only a partial schema and rows; a D1-to-D1 restore was not exercised. |
| **VT-07 — Status-surface consistency** | **PASS** | Current Dashboard, Roadmap and Status snapshots agree that Stage 5 is partial and Foundation exit is NOT MET. They state the Auth0 grant is still 0/1 and provider-backed runtime evidence is absent. |
| **VT-08 — Evidence completeness** | **PARTIAL** | Authorization chronology and D1 state are now independently corroborated. The recovery artifact is incomplete, provider/runtime evidence is missing, the Auth0 grant state has not been updated in repository evidence after the owner's recent action, and the closeout/handover retain conflicting historical checkpoints. |

## Gates remaining before Foundation exit

1. Complete and evidence the approved Auth0 `read:library` SPA grant. The repository checkpoint still says 0/1; the owner's recent “done” message is not yet reflected by verified provider evidence. No additional scopes were requested or granted by this reviewer.
2. Run non-production provider-backed local Worker and browser checks for real token claims/scopes, session cookies, CSRF and account isolation. No production deployment is needed for these local checks.
3. Implement and test device pairing and credential issuance.
4. Replace or correct the D1 export-copy artifact so the full schema, required unique indexes and supporting indexes restore; rerun integrity and foreign-key checks. Decide whether D1-to-D1 restore is required for the development gate; it remains untested.
5. Reconcile the cold-session handover/closeout/package latest pins and status after the new evidence is captured.
6. Obtain the next independent Stage 5 validation after the failed recovery evidence and other gates are corrected. Stage 6 remains gated on a passing Foundation exit package.

**No deployment, Auth0 modification, D1 write, or other repository change was made in this review.**
