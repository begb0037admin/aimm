# PluginHub Stage 2–5 — exact-preview passkey challenge binding

**Verified:** 2026-10-25  
**Tested source checkpoint:** `8c6da696b8e030e9f301385046159f2802ef5a7f` on `codex/pluginhub-foundation`  
**Result:** The action-confirm passkey challenge now accepts only a claimed operation whose exact preview digest is present, unexpired, and already marked unlocked. Foundation remains **NOT MET**; Stages 2–5 remain in progress.

## Change

Added migration `0015_action_preview_authorization_binding.sql` to store the preview digest/expiry and owner-confirmation metadata on an operation, and to bind WebAuthn assertion challenges to a purpose, operation ID, preview digest, and preview expiry.

The API rejects malformed digests, unsupported purposes, another account's operation, an operation that is not claimed, a preview that is not unlocked, a changed digest, and an expired preview. A valid challenge remains bound to the signed-in browser session and expires within five minutes.

This increment covers challenge binding only. It does not yet create or verify the device-signed canonical preview, encrypt and serve the exact-path payload, issue the one-use two-minute preview capability, record confirmation end-to-end, or gate companion execution on that authorization. No file-changing action is enabled by this increment.

## Verification

- Focused action-confirm challenge test: PASS. It covers malformed, unopened, changed-digest, cross-account, valid binding and expired-preview cases.
- `sh scripts/pluginhub-nonprod-check.sh`: PASS. Swift companion/journal checks; scanner 3/3; API/browser 33/33; syntax checks; isolated local D1 migrations/Worker runtime; pairing, inventory sync, Manual Check, and signed synthetic reveal receipt.
- Local only. No real authenticator was used, no project D1 write occurred, and nothing was deployed or cut over.

## Source pins

- Worker API: commit `1ed291e77f032ec185f94309ab570f16b5b20504`, blob `782dec9434de8aefb1b6d62494128933135ef100`.
- API tests: commit `65ca14d3d919cc711ffdba0efc3fa6c6033f3a81`, blob `33f6d797e5972eee9879a38cb43de7370844c387`.
- Migration: commit `8c6da696b8e030e9f301385046159f2802ef5a7f`, blob `0286d2840ecb088ee3857eacf94e79094cf36e76`.

## Remaining gates

The owner preview/unlock/confirm protocol and device-side fresh authorization check remain incomplete. Remote provider runtime, cross-account and recovery evidence, real current-Mac parity, remaining Stage 2–5 features, and fresh independent review remain open. Preserve the recorded 22:47 D1 authorization chronology. Foundation exit remains **NOT MET** and Stage 6 remains gated.
