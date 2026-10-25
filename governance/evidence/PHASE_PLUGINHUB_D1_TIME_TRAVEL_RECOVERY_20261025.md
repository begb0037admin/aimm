# PluginHub — isolated Cloudflare D1 time-travel recovery check

**Observed:** 2026-10-25 17:46–17:50 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Source branch head:** `2d7c4d36aa4c5d87cf7999e2e0e5ed00ab70c4f3`  
**Cloudflare account:** `f1896a0ef4e88f1f90abcc2cbbdd87f1`

## Scope

Kevin approved creating a separate temporary development database to test recovery without restoring or rewinding the existing project D1. The check used only synthetic account, device, credential-hash placeholder and browser-session data. It changed no Worker binding and no Worker was deployed.

## Isolated recovery database

Created `aimm-library-recovery-probe-20261025-1746`, database UUID `e8536d00-0fb1-4752-aa82-8be6c2141d48`, in the project account. The database was placed in WEUR with read replication disabled. The current source migrations `0001_foundation.sql` through `0021_restore_actions.sql` were applied in order, and a read returned 21 ledger rows through `0021_restore_actions.sql`.

Seeded one synthetic account, device, device credential row with a non-secret synthetic hash placeholder, and browser session. The returned pre-loss bookmark was:

`00000000-00000068-0000510f-984b3a7436dac950fbbdca14f53af2eb`

The synthetic account was then deleted. Cascading foreign keys removed its device, credential row and browser session; a bounded read confirmed all four counts were zero while all 21 migration records remained.

Cloudflare accepted a time-travel restore to the captured bookmark. The post-restore bounded reads found the synthetic account, device, credential row and browser session (one each), all 21 migrations through 0021, and the expected project table set. Reads reported zero rows written and `changed_db: false`.

## Cleanup and original database verification

After the recovery check, the temporary D1 was deleted by its exact UUID. A subsequent exact-name database list returned zero results.

The original `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`) was rechecked after cleanup. It remains in the project account with its recorded creation time, 25 reported tables and the same 364,544-byte size. Its ledger remains at 21 migrations through 0021; aggregate counts remain 2 accounts, 4 devices and 4 device credentials; the previous synthetic isolation markers remain at zero. Final queries against it reported zero rows written and `changed_db: false`.

## Disposition

- Isolated Cloudflare D1 time-travel recovery with current schema and synthetic relational data: **PASS**.
- Temporary database cleanup: **PASS**; exact database name no longer listed.
- Existing project D1 altered by this recovery test: **NO**.
- Auth0-backed authenticated Worker isolation, browser session/CSRF, real device pairing, browser-to-Mac parity and fresh independent end-to-end review: **OPEN**.
- Foundation exit: **NOT MET**; Stage 6 remains gated.
- No production data, provider terms, credential creation, Worker binding change, deployment or cutover.
