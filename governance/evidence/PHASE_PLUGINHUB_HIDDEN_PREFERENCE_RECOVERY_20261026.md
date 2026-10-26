# Stage 3/4 reversible library preferences — 2026-10-26

## Change

The account-backed inventory preview now exposes a counted **Show favourites** filter, a per-product **Pin/Unpin** control, and recoverable hidden-product handling. Products marked hidden leave the default list and remain in **Show hidden (n)**; **Unhide** restores them. Preference saves refresh the filter counts. These are reversible account metadata actions and do not touch local plug-in files.

## Verification

- `npm test` in `library-api`: passed, 38/38 tests.
- The account-preview UI test covers favourite filtering, pinning, hiding a product, opening the hidden-items view, unhiding it, and confirming it returns to the normal list.
- `sh scripts/pluginhub-nonprod-check.sh`: did not reach its tests. SwiftPM manifest planning failed under the execution sandbox with `sandbox_apply: Operation not permitted`. No build or companion tests completed in that run.

## Source pins

The local working-tree blobs are `library-api/library-account.js` `ef171ceee7816128ea707ba0de929b66f20c1ce4` and `library-api/test/library-account.test.js` `c38e8aad20fb36ea9d3250ad201a0411456eedf4`. These are uncommitted blob IDs, not a published commit.

## Limits

This is account-preview behavior backed by the existing preferences API; it does not change the main public `index.html` or deploy the feature. No Auth0 provider call, remote D1 access/write, local plug-in file action, deployment, or cutover occurred. The remote D1 validation/write hold remains **OPEN**. Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated.

The working tree is based on local commit `d4bdcf741fd940bb9e79fee39fb76d61becb12a3`. GitHub showed branch head `d705f1a51b13f0839ba8b8c5386debf2eadd4c73`, while shell fetch failed because `github.com` did not resolve. Changes remain local and uncommitted pending branch reconciliation.
