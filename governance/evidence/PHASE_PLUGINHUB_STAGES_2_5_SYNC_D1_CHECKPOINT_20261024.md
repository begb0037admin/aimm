# Repeatable non-production check — 2026-10-24 20:28 UTC

Added `scripts/pluginhub-nonprod-check.sh` at commit `da99d143619d302c28c6ff1ef2a32e3c9acb6c83`, blob `1a63d98602be5618e3fe086f4f947b77d0d73ec6`. Running `sh scripts/pluginhub-nonprod-check.sh` completed successfully. It runs the Swift companion build, mocked sync/journal checker, scanner integration suite (3/3), Library API suite (18/18), and `node --check src/index.js`. It does not deploy or mutate remote services.

The last independent review remains scoped to the client code and is recorded at `governance/evidence/PHASE_PLUGINHUB_STAGE2_SYNC_CLIENT_REVIEW_20261024.md`, blob `22e82bde6ec382e80fc0541eec6b4db04ee12dfe`.

---

# Stage 2–5 local sync and D1 schema checkpoint — 2026-10-24 20:23 UTC

**Scope:** non-production implementation only. No Worker deployment, production change, account data deletion, or cutover.

## Local verification

- Code tip: `7a696e00efe817cfc3190904b9f88364b61a075e`.
- `swift build`: PASS.
- `swift run aimm-journal-check`: PASS. Covers endpoint restrictions, same-origin redirect rules, local journal persistence and incomplete-generation rejection, plus mocked start/chunk/finalize sync, bearer headers, approved HTTPS origin/default port, and path-free request bodies.
- `python3 -m unittest discover -s tests -v`: PASS, 3/3 scanner integration checks.
- `npm test` in `library-api`: PASS, 18/18 API tests.
- Independent source review: PASS for this sync-client change only; report `PHASE_PLUGINHUB_STAGE2_SYNC_CLIENT_REVIEW_20261024.md`.

## Isolated development D1 migrations

Target: development D1 `aimm-library-foundation-dev`, ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. The migration SQL was read from the branch and applied through Cloudflare's D1 Query API. Each migration's name was inserted into `d1_migrations` after its statements succeeded.

Applied in order:

- `0006_inventory_generations.sql`
- `0007_status_preferences.sql`
- `0008_safe_actions.sql`
- `0009_check_comparison_reason.sql`

A follow-up read-only query confirmed ledger entries 0001–0009 and the nine expected Stage 2–5 tables: scan generations, inventory chunks, published inventory, device inventory heads, check observations, account settings, library marks, operations, and operation items. The query returned zero rows written and no database change. A separate `PRAGMA integrity_check` request was denied by the Cloudflare API with SQLITE_AUTH, so no integrity-check result is claimed.

These changes add the development schema and migration ledger only. Live Worker behavior is still unverified because no deployment occurred. Real Auth0/browser and paired-Mac runtime, cross-account isolation, full recovery, end-to-end status/action receipts, broad parity, and fresh independent Foundation exit validation remain open. Keep Foundation NOT MET and Stage 6 gated.
