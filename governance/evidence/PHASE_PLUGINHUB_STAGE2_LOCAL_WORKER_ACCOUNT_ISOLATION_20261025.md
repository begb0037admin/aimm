# Stage 2 local Worker two-account credential isolation — 2026-10-25

## Result

The local non-production checker now seeds two independent synthetic accounts, each with a separate device ID and bearer credential. It probes the local Worker in both directions:

- Account B's device credential presented for Account A's device identity returns HTTP 401.
- Account A's device credential presented for Account B's device identity returns HTTP 401.

The integration confirms the device credential is bound to both its device ID and account row in the disposable local D1/Worker setup. It is a local synthetic probe only; it is not the required remote two-account isolation test and does not prove Auth0-backed browser identities.

## Verification

The complete `sh scripts/pluginhub-nonprod-check.sh` passed:

- Ad-hoc signed companion preview package.
- Swift build and journal/recovery fixtures.
- Scanner 3/3; API/browser suite 38/38.
- Local D1 migrations through 0021 and local Worker health/auth/CORS.
- Two-way synthetic cross-account device-credential rejection.
- Swift pairing bootstrap, inventory sync, Manual Check, reveal signed receipt.
- Linked Swift move-to-Unused and restore through local Worker/D1, including complete resync and signed receipts for both actions.

All test data and files are disposable local fixtures. Owner-confirmation timestamps for the local move/restore flow were directly inserted into local D1 for exact matching preview digests. No browser passkey ceremony, live Auth0 session, remote project D1, deployment or cutover was involved.

## Source pins

Source commit: `946ad71df470bf3d4c5ada00de5d9a7ab9ff3f15`.

- `scripts/pluginhub-nonprod-check.sh`: `173c87777323eef7c2d50d4c21a36e4005bc8f5e`
- `scripts/pluginhub-local-worker-fixture.mjs`: `4068f9bb30fe40de3ad71b6b784839d8fa1bd755`

## Remaining gates

Real Auth0/provider runtime and pairing, remote two-account isolation, remote backup recovery, live browser-to-Mac parity, remaining Stage 5 action classes, Developer ID distribution, and fresh independent end-to-end review remain open. Preserve Foundation **NOT MET**, Stage 6 gated, and the 22:47 D1 authorization gate open.
