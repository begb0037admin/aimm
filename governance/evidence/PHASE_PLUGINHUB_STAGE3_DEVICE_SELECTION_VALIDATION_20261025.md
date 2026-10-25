# Stage 3 device selection validation — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Stage 3:** in progress  
**Foundation:** NOT MET  
**22:47 D1 gate:** open  
**Deployment/cutover:** none

## Change

The account preview and Hope inventory/status tools accept an optional `device_id`. Before this change, a malformed value was silently omitted from the API query, which could return the account's default device and make the response look as if the requested device had been selected. The client now rejects any supplied ID that does not match the expected UUID shape before session or API access. An omitted ID still uses the API's documented default-device behavior. Server-side account ownership checks remain authoritative for valid IDs.

An independent narrow code review identified that the first UUID check accepted misplaced dashes and uppercase IDs were not normalised. The implementation now validates canonical UUID group/version/variant structure, enforces exact 36-character length, normalises accepted IDs to lowercase, and rejects a final newline. The reviewer rechecked commit `0fad9dbb2c016545a0611736d8cdc01d6f1d5e78` and accepted this narrow change. This is not the separate full Stage 5 independent review.

## Verification

Ran `node --test test/library-account.test.js` from `library-api/`: 6/6 passed. The UI/tool test now verifies malformed IDs for both inventory and status fail before any network request. Existing coverage confirms the preview and Hope read the same complete snapshot, show device and observation timestamps, and do not expose local paths.

Then ran `sh scripts/pluginhub-nonprod-check.sh`: PASS. It completed the ad-hoc signed local app check, Swift/journal recovery and cross-volume fixtures, scanner integration 3/3, API/browser suite 38/38, local D1 migrations through 0020, isolated Worker health/auth/CORS checks, Swift pairing and inventory sync, Manual Check, and signed action preview/receipt checks. The first sandboxed attempt could not run SwiftPM's manifest compiler; the same command passed when run with the required local build permissions. No remote D1 was contacted.

This is a local browser/API fixture check. It does not prove real Auth0 pairing, remote account isolation, live browser-to-Mac parity, or Foundation exit.

## Source pins

- Source commit: `1a2b79093148ca680dfa879c3457feeee5ab269e`.
- Final source commit: `0fad9dbb2c016545a0611736d8cdc01d6f1d5e78`.
- `library-api/library-account.js` blob: `f08001cd77117fd88e992f2ae9ecb5937c98d9e9`.
- `library-api/test/library-account.test.js` blob: `45ce539b60f05b218c49bd0dff1981705e61575d`.

Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated. Preserve the 22:47 D1 gate. No remote D1 access/write, deployment, or cutover occurred.
