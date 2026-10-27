# Library account sign-in and same-origin session fix — 2026-10-27

**Branch:** `codex/pluginhub-foundation`  
**Verified source commit:** `3fab04f0a1389c576ef6acfe4f5867aa8ac2d82f`  
**Development preview:** `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev`  
**Pages deployment:** `b679f885-fffa-47fa-b721-4377637f31d2`

## Result

The Library sign-in issue was caused by the browser page and API being on different origins while the API relied on a strict session cookie. Auth0 could return to the app, but the browser would not reliably send the API session cookie on the next cross-site request.

The approved non-production fix adds a same-origin Pages Function proxy at `/account-api`. It forwards only `/v1/*` requests to the fixed development Worker, allows the required HTTP methods, checks any supplied Origin against the preview origin, forwards the session and CSRF headers, and marks responses `no-store`. The Pages Functions route list is restricted to `/account-api/*`. The Library helper defaults to this route on the approved preview and migrates the saved development Worker URL to it.

## Verification

- The focused proxy tests passed **2/2**, covering session cookie and API response-cookie forwarding, plus rejection of cross-origin and non-`/v1` requests.
- The updated account helper parsed successfully. A focused API-base check confirmed the approved Worker URL maps to the same-origin proxy and arbitrary API hosts are rejected.
- The branch preview sign-in completed. The API session was created and the preview read the account snapshot, showing **1,641 records**. No product names or inventory rows are copied into this evidence.
- The browser-local scan still shows **0** records. This proves account API connectivity, not browser-to-Mac inventory parity.

No full project test suite or build was run for this checkpoint. The normal browser session was created in the existing non-production D1 as part of the previously authorized account/API check. No migration, D1 administration, credential change, provider setting change, production deployment, or cutover occurred.

## Remaining Foundation gates

Account-backed browser/Mac/Hope parity, the supported live wrong-device paired-credential rejection probe, remaining approved Stages 2–5 evidence, and fresh independent end-to-end Foundation acceptance remain open. Foundation remains **NOT MET**; Stage 6 remains gated. Preserve the recorded 22:47 authorization chronology.
