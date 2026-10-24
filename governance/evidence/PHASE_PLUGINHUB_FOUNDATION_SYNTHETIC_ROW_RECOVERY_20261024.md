# Synthetic D1-to-local recovery check — 2026-10-24 17:52 UTC

**Result: limited row-level recovery PASS; full export/D1-to-D1 recovery remains OPEN. Foundation remains NOT MET.**

Target was isolated development D1 `aimm-library-foundation-dev` (database UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`). The existing remote table state before the fixture was checked read-only. It contained 2 accounts, 20 active browser sessions, 3 revoked devices, 3 revoked/expired device credentials, and 0 pairings. No account or session values were selected.

A synthetic pairing-only row was inserted into `pairings` with no account or device reference and no real credential material. D1 reported `changed_db:true`, `rows_written:3` for the insert. A parameter-bound, read-only SELECT then retrieved only that exact synthetic row (`rows_read:1`, `changed_db:false`, `rows_written:0`). The row was inserted into a fresh local SQLite database after executing pinned migrations 0001–0005. The local restore returned `integrity_check=ok`, an empty `foreign_key_check`, and all ten expected application tables. The temporary SQLite file and migration copies were deleted after verification.

The remote fixture was removed with an exact-ID DELETE. D1 reported `changed_db:true`, `rows_written:1`; follow-up read-only checks returned zero remaining fixture rows and zero total pairings. The database still had 3 revoked devices and 3 revoked/expired credentials; there were no active devices or usable credentials. No production resource changed.

A D1 export limited to the `pairings` table was rejected by automatic approval review because the export endpoint would return the entire remote table and could include sensitive internal pairing data. No export was started. I did not retry or route around that rejection. This report therefore establishes a row-level development recovery check, not an exported backup restore or D1-to-D1/Time Travel recovery.

The local restore used branch migrations at reviewed commit `e4afdeb74001311d1344ad4d0318f0dfaf4d7f1d`:
- `0001_foundation.sql`: blob `21838cf37171bd59fb10207679ff432872658e13`
- `0002_enforce_ownership_and_retention.sql`: blob `374781b9ded5dfa7d07993ceaf05f65095ae617a`
- `0003_browser_sessions.sql`: blob `d82f4a228b2df079d265b482bc0f940d41396111`
- `0004_device_pairing.sql`: blob `8005dc890221b9daef8c29972c70faf7599b1dab`
- `0005_device_credential_rotation.sql`: blob `2301b4725b10b25dfa315a6cac81e25eb8a499c7`

**Remaining gates:** meaningful Test User B cross-account denial; populated exported-backup or D1-to-D1 recovery; separate action-time owner confirmation before account deletion; then a fresh independent Stage 5 decision after the remaining gates have evidence. Preserve **NOT MET**.
