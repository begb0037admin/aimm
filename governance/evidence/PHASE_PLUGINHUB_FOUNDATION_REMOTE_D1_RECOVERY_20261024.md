# PluginHub Foundation — remote D1 isolation and recovery addendum

**Observed:** 2026-10-24 09:18 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Starting branch commit:** `aec95ef90bf6ceb5af1e115497b9aa64032222cf`  
**Scope:** Bounded non-production D1 checks and export-copy recovery; executor evidence only.

## Authorization chronology

The 22:47:13.736 UTC D1 creation authorization remains resolved by Kevin's owner confirmation. The written retention approval remains timestamped 22:51 UTC. Neither timestamp is changed or backdated.

## Remote D1 observation

Cloudflare metadata GET confirmed the isolated database `aimm-library-foundation-dev`, UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`, in WEUR. Read-only queries showed zero application rows before and after the checks. Migration history now lists:

```text
1 | 0001_foundation.sql
2 | 0002_enforce_ownership_and_retention.sql
3 | 0003_browser_sessions.sql
```

Migration 0003 was applied to this already-authorized development D1 on 2026-10-24 09:18 UTC. It adds the browser-session table and indexes; no Worker was deployed.

## Bounded remote probes

- Created two temporary synthetic accounts and a device belonging to the second account. A credential insert pairing that device with the first account was rejected by Cloudflare D1 with SQLite extended error `SQLITE_CONSTRAINT_FOREIGNKEY`. The synthetic accounts were deleted, and a follow-up query showed zero probe accounts, devices, or credentials.
- Created a synthetic account and valid eight-hour browser session. D1 accepted it, rejected a nine-hour session with `SQLITE_CONSTRAINT_CHECK`, then account deletion cascaded to the session. The follow-up query showed zero probe accounts or sessions.

These checks exercise remote D1 constraints only. They do not prove deployed Worker OIDC validation, route authorization, HTTP account isolation, browser CSRF behavior, deletion handler, or scheduled cleanup.

## Export-copy recovery check

A SQL export of the current remote schema and migration history was downloaded and restored into a fresh in-memory SQLite database. `PRAGMA integrity_check` returned `ok`; migrations 0001–0003 and `browser_sessions` were present; all application tables contained zero rows.

- Snapshot: [sanitized empty D1 export](artifacts/PHASE_PLUGINHUB_FOUNDATION_D1_EXPORT_20261024.sql)
- GitHub commit: `2133a11749deeb2214d522b1481f6e07345c70d0`
- Git blob: `64d6daaa0afd8acb73fef37edeaf3daf97779394`
- Snapshot SHA-256: `85613880a52cc38239d0c7d4ab7a651af605e040b65f5abe48d40c6311012620`
- Size: 3,715 bytes

This proves that this exported empty snapshot can be restored into SQLite. It does not prove a Cloudflare D1-to-D1 restore, scheduled backup expiry, or retention for the approved 30-day bound. Cloudflare Time Travel on the current Free plan was documented as seven days, so the 30-day recovery/retention requirement remains open.

## Foundation disposition

Foundation exit remains **NOT MET**. Remaining evidence/actions include owner-authenticated Auth0 development tenant/client/scope setup; provider-backed Worker runtime tests for token profiles/scopes, HTTP account isolation, deletion and cleanup, browser session/CSRF, and device pairing; a backup-expiry and recovery design meeting the approved 30-day limit; and a fresh independent Stage 5 review. The independent reviewer must verify both this addendum and the prior D1 chronology record.

No production data, Worker deployment, provider terms acceptance, credential creation, paid service, merge, cutover, or release occurred. The D1 creation and 22:51 retention timestamps remain distinct.


## Local API regression rerun (2026-10-24 09:19 UTC)

The branch-pinned Worker source `library-api/src/index.js` (blob `aabfb0f64e501642c311f11a3f0a5f35bd7659b7`) was byte-for-byte identical to the source in the isolated local test workspace. `node --test test/foundation.test.js` passed 5/5: health/auth rejection, OIDC/session restore/CSRF/logout, bearer account isolation and OAuth client validation, account deletion/tombstone behavior, and scheduled cleanup. This is local executor evidence, not remote Worker runtime evidence.

A final read-only Cloudflare query after all probes confirmed migrations 0001–0003 and zero rows in accounts, devices, credentials, browser sessions, action receipts, shares, profile comparisons and deleted-identity tombstones. No remote app data remains.
