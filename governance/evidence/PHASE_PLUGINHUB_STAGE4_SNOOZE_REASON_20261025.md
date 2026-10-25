# Stage 4 snooze reason and expiry controls — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source checkpoint:** `ef99a140b9585a50b7eddf57709d75daf4d6ef1c`  
**Foundation exit:** **NOT MET**  
**Stages 2–5:** in progress; **Stage 6:** gated

## Change

Migration 0019 adds a bounded `snooze_reason` field to account product/vendor marks without rebuilding the table or changing existing marks. The preferences API validates, returns and persists the reason alongside the expiry. The status summary includes the active snooze reason and expiry for Hope and other account consumers.

The Library preview now lets an owner snooze a product for one week, enter a reason, see the saved expiry and reason, and clear the snooze. Clearing it also clears the reason.

## Verification

The full local `sh scripts/pluginhub-nonprod-check.sh` passed against the tested source checkpoint:

- API/browser: 34/34; scanner: 3/3.
- Swift companion/journal checks.
- Local D1 migration through 0019, isolated Worker health/auth/CORS, pairing, sync, Manual Check, signed preview and receipt.
- Focused API assertions cover reason validation, persistence, status output, clearing, and recovery-migration preservation of existing mark data.
- UI assertions cover the one-week snooze payload, visible reason/expiry, and visible cleared state.

No remote project D1 write, provider change, deployment, or cutover occurred. The 22:47 authorization chronology remains open and unchanged.

## Remaining limits

This completes only the snooze portion of Stage 4 preferences. Version-bound “mark up to date” expiry, fuller live browser/Mac parity, other Stage 2–5 gaps, provider-backed remote runtime/isolation/recovery, real Auth0/passkey walkthroughs and fresh independent review remain open. Foundation remains **NOT MET**.

## Source pins

- Migration 0019: `library-api/migrations/0019_snooze_reason.sql`, blob `4f37eaab819c4a1012790252dd8dd76d0e8b6454`.
- Worker API: blob `c384a68b1e173705bd3c5c03a053d39096553d6a`.
- Account UI: blob `fa75e00a6c97b9385896db8fed7b3143a41161be`.
- API tests: blob `19d1090ea1f87dfcafd95c727274d37f2fc65e42`.
- UI tests: blob `fa3e3f63ff060c599eaa5abab2547e3f5a784237`.
- Recovery test: blob `cb7aab10cbef31e59a2234a2ef8da21e64a802a1`.
