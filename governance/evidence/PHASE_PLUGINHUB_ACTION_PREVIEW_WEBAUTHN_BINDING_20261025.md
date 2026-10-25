# PluginHub Stage 2–5 — signed preview submission and owner capability groundwork

**Verified:** 2026-10-25  
**Tested source checkpoint:** `326fd668ae3b78623ea25a66c0a2e1c66e478fd4` on `codex/pluginhub-foundation`  
**Result:** The Swift companion now builds and submits a signed exact preview after claiming a local action. The Worker checks it, hashes it, encrypts its path payload in D1, and exposes a WebAuthn-gated one-use owner-preview capability. Foundation remains **NOT MET**; Stages 2–5 remain in progress.

## Change

Migration `0016_encrypted_action_previews.sql` adds a separate encrypted preview-payload table with a maximum ten-minute lifetime; migration `0017_owner_preview_capabilities.sql` binds the owner capability to the WebAuthn-verified browser session. The Worker accepts only a bounded, schema-limited preview from the paired device. It checks the operation/account/device/nonce/kind/generation and current inventory, verifies the device ECDSA signature, derives the canonical SHA-256 digest, and stores the canonical path payload with AES-GCM and operation-bound authenticated data. Ordinary action reads remain redacted.

The companion now constructs the preview from the current local journal record, signs the sorted JSON bytes with its paired P-256 key, and sends it after claiming the operation. A fresh owner WebAuthn unlock can mint a random capability whose hash alone is stored, bound to the same browser session and limited to two minutes (or the earlier preview expiry). The exact-path GET consumes it once and records that the owner viewed the paths. A later action-confirm challenge requires the viewed state; successful verification records confirmation and deletes the encrypted payload.

## Verification

- Focused API tests: PASS. They cover device signature verification, active inventory binding, encrypted-at-rest storage without plaintext paths, same-preview replay, changed-preview rejection, malformed/unopened/cross-account/expired challenges, exact challenge binding, same-session access, wrong-session/account rejection, and one-use replay rejection.
- `sh scripts/pluginhub-nonprod-check.sh`: PASS. Swift companion/journal checks; scanner 3/3; API/browser 33/33; syntax checks; local D1 migrations through 0017 and Worker runtime; Swift pairing, inventory sync, Manual Check, command claim, signed encrypted-preview submission and signed reveal receipt.
- The preview API path and capability GET are exercised with local synthetic fixtures. No real authenticator assertion or browser UI walkthrough has occurred. The encryption key is supplied only as a deterministic local test value; no production key was configured. No remote D1 write, deployment or cutover.

## Source pins

- Worker API: commit `02192ae2601d00d60875dab1d5053d4869cdd363`, blob `d58132d2c1622a354a4eeecaa664c3e03e91b197`.
- Companion API client: commit `a67ad578029a4d8a481cde402b8aa564e17f1a55`, blob `22bb1a799376711b292153d4ff56ac4d3ebb8125`.
- Companion UI action flow: commit `252f3f8d63d63ac88aafbbdbf2a26d492f406b97`, blob `76c3ce6c84a94b2f0d03adfe80bc1414914f45e4`.
- Integration fixture: commit `fada8c17f085d8a6d85c28bce1d59482cbe0c592`, blob `4dd3eea8a270b90df721960645de65aee228b9f0`.
- Non-production runner: commit `326fd668ae3b78623ea25a66c0a2e1c66e478fd4`, blob `a73d9dc394a1aedc87b9aae22642f2b7b77d183d`.
- Migration 0017: commit `be6ac59915b428d15edcdac8cb0d7cb094582d37`, blob `ac587816021559558a3b8aacfe9539d2d0f53086`.

## Remaining gates

The account UI still needs to invoke the owner unlock/view/confirm sequence, and a valid authenticator assertion needs real or cryptographically valid end-to-end verification. The companion must revalidate digest, expiry, generation and live item state immediately before each action, and action execution must wait for authorization where required. Provider-backed remote runtime, cross-account/recovery evidence, real current-Mac parity, remaining Stage 2–5 work, and fresh independent review also remain open. Preserve the recorded 22:47 D1 authorization chronology. Foundation exit remains **NOT MET** and Stage 6 remains gated.
