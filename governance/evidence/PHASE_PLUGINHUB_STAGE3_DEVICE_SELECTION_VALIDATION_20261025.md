# Stage 3 device selection validation — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Stage 3:** in progress  
**Foundation:** NOT MET  
**22:47 D1 gate:** open  
**Deployment/cutover:** none

## Change

The account preview and Hope inventory/status tools accept an optional `device_id`. Before this change, a malformed value was silently omitted from the API query, which could return the account's default device and make the response look as if the requested device had been selected. The client now rejects any supplied ID that does not match the expected UUID shape before session or API access. An omitted ID still uses the API's documented default-device behavior. Server-side account ownership checks remain authoritative for valid IDs.

## Verification

Ran `node --test test/library-account.test.js` from `library-api/`: 6/6 passed. The UI/tool test now verifies malformed IDs for both inventory and status fail before any network request. Existing coverage confirms the preview and Hope read the same complete snapshot, show device and observation timestamps, and do not expose local paths.

This is a local browser/API fixture check. It does not prove real Auth0 pairing, remote account isolation, live browser-to-Mac parity, or Foundation exit.

## Source pins

- Source commit: `1a2b79093148ca680dfa879c3457feeee5ab269e`.
- `library-api/library-account.js` blob: `5416b92575afc6ad265bed24d72eab3d67060d41`.
- `library-api/test/library-account.test.js` blob: `1c489f9fffc9dcceb7f4696c8b8cb99c003ea37a`.

Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated. Preserve the 22:47 D1 gate. No remote D1 access/write, deployment, or cutover occurred.
