# PluginHub Foundation — remote recovery and pairing checkpoint

**Recorded:** 2026-10-24 19:14 UTC  
**Repository/branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Implementation/evidence starting head:** `a09c26ecf90badb9211b13f4c8f4960f3b542e7a`  
**Foundation exit:** **NOT MET**. Stage 5 remains **PARTIAL**. Stage 6 is not ready. No production deployment.

## Verified work

### Development export-copy recovery

The Cloudflare export endpoint was used for the isolated development D1's `pairings` table only after read-only queries verified that it contained exactly one synthetic fixture row, `recovery-fixture-20261024-1752z`, with device name `RECOVERY FIXTURE`, no approved account and no device/account reference. The resulting SQL export was **585 bytes**, SHA-256 `853502ce730e29811dea5887d29664fa60e78786e344a7e8383c0114858b0e68`.

The export was restored to a fresh local SQLite database after applying the branch's migrations 0001–0005. The restored table contained only the expected synthetic fixture. `PRAGMA integrity_check` returned `ok`; `PRAGMA foreign_key_check` returned no rows; all 10 application tables were present. This proves a populated **single-table export-copy** restore for the synthetic row. It does not prove a complete D1 export, D1-to-D1 restore, Time Travel recovery, or restore of production/user data.

The exact remote fixture was deleted. Follow-up Cloudflare queries found zero rows with that fixture ID and zero pairings at that point. The export attempt mentioned in the earlier 17:52 checkpoint was initially blocked; this later narrowly scoped export succeeded after the table was verified synthetic-only. The earlier statement that no export had started is superseded by this checkpoint.

### Remote runtime and Test User A pairing

The isolated development Worker `aimm-library-api-dev` was exercised through the existing loopback-only Auth0 harness. Test User A passed signed pairing proof, owner phrase verification/approval, one-time device credential delivery and repeat-poll rejection (HTTP 410). The owner then revoked the temporary device and credential; credential reuse returned HTTP 401. The temporary completed pairing row was removed by an exact development-only cleanup query. The temporary device and credential remain unusable.

The daily Worker schedule was read back as `0 3 * * *`. The Worker settings read confirmed D1 binding `DB` points to the isolated database UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`; no binding values or secrets were returned or recorded.

### Source suite

The 14-test suite was run against the exact Foundation source and migration files fetched from the branch starting head `a09c26ecf90badb9211b13f4c8f4960f3b542e7a`: **14/14 passed**. This is executor evidence; it is not an independent review.

## Current read-only development D1 counts

At the end of this checkpoint: 2 accounts; 23 active browser sessions; 4 devices, all revoked; 4 device credentials, none usable; 0 pairings after cleanup; and 0 action receipts. These queries reported no database changes or written rows. The pairing test and cleanup were the only new direct D1 writes for this checkpoint, apart from the exact earlier synthetic recovery fixture insert/delete.

## Open gates

1. Test User B's remote token did not reach the isolation harness, so the remote cross-account denial probe remains **unproven**. The UI login attempt did not enable the harness probe. Do not count the existing local cross-account tests or D1 foreign-key probe as a remote API rejection.
2. The account-deletion proof remains open. The closeout requires separate action-time owner confirmation before the irreversible deletion. The owner confirmation request is pending.
3. A fresh independent Stage 5 review against this checkpoint is still required. The latest recorded independent disposition remains **PARTIAL**.
4. No full D1/D1-to-D1 or Time Travel recovery was demonstrated.

Keep Foundation **NOT MET**, Stage 5 **PARTIAL**, Stage 6 not ready. No production resource, provider terms, or credentials were changed. No production deployment occurred.

## Evidence and limits

- Local suite: 14/14 passed from files fetched at `a09c26ecf90badb9211b13f4c8f4960f3b542e7a`.
- Development export artifact retained only in temporary local storage; it is not committed because the exported INSERT contains a test public key and pairing metadata.
- Recovery export hash: `853502ce730e29811dea5887d29664fa60e78786e344a7e8383c0114858b0e68` (585 bytes).
- Development Worker schedule: `0 3 * * *`.
- Follow-up read-only D1 counts include 23 active sessions, 4 revoked devices, 4 unusable credentials, zero pairings and zero receipts.
