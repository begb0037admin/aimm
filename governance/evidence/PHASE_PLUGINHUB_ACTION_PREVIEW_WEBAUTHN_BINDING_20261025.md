# PluginHub Stage 2–5 — signed owner preview flow

**Verified:** 2026-10-25  
**Tested source checkpoint:** `e41e8b12cf573f311a1198310b76859195c962fb` on `codex/pluginhub-foundation`  
**Result:** The Swift companion signs and submits the current local action preview; the Worker verifies and encrypts it; the account preview now requests passkey verification and uses the one-use capability to show the exact path. Foundation remains **NOT MET**; Stages 2–5 remain in progress.

## Change

Migration `0016_encrypted_action_previews.sql` adds a separate encrypted preview-payload table with a maximum ten-minute lifetime; migration `0017_owner_preview_capabilities.sql` binds the owner capability to the WebAuthn-verified browser session. The Worker checks the paired device signature, current operation/account/device/nonce/kind/generation and inventory binding, derives the canonical SHA-256 digest, and stores the canonical path payload with AES-GCM and operation-bound authenticated data. Ordinary action reads expose only redacted status and preview digest metadata.

The companion forms the exact preview from the current local record, signs the sorted JSON bytes with its paired P-256 key, and uploads it after claiming an action. The owner account UI has a “View exact path with passkey” action. It requests an operation/digest-bound WebAuthn challenge, then GETs the exact preview using the returned session-bound one-use capability. The displayed path view clears after two minutes. Confirmation challenge options require the owner to have viewed the preview; successful confirmation records authorization and deletes the encrypted payload.

## Verification

- Focused API and browser tests: PASS. Coverage includes signature verification, current inventory binding, encryption/no plaintext paths, replay/conflict, malformed/unopened/cross-account/expired challenges, same-session capability access, wrong-session/account rejection, one-use replay rejection, and the account UI sending the bound WebAuthn request then using the capability header.
- `sh scripts/pluginhub-nonprod-check.sh`: PASS. Swift companion/journal; scanner 3/3; API/browser 34/34; migrations through 0017; local Worker/D1; pairing, inventory sync, Manual Check, signed preview submission and signed reveal receipt.
- Local synthetic fixtures only. Browser WebAuthn was mocked in the UI test; no real authenticator assertion or real account walkthrough occurred. Encryption uses a deterministic local test value. No remote D1 write, deployment or cutover.

## Source pins

- Worker API: commit `25686733962d18451fb0b7648eecc5c4ad83fb1e`, blob `e6eaa0e4cfdd49c72dab00f4bf95014598b5e1e8`.
- Account preview UI: commit `a4440a9e733561fd8f3f9236ea89276933ae7e2e`, blob `de480e567dc8c82bb9bf337604148652065b3671`.
- Account preview test: commit `e41e8b12cf573f311a1198310b76859195c962fb`, blob `9344419eddbe3d284401984d40756f8305de6590`.
- Companion API client: commit `a67ad578029a4d8a481cde402b8aa564e17f1a55`, blob `22bb1a799376711b292153d4ff56ac4d3ebb8125`.
- Companion action UI: commit `252f3f8d63d63ac88aafbbdbf2a26d492f406b97`, blob `76c3ce6c84a94b2f0d03adfe80bc1414914f45e4`.
- Worker integration fixture: commit `fada8c17f085d8a6d85c28bce1d59482cbe0c592`, blob `4dd3eea8a270b90df721960645de65aee228b9f0`.
- Non-production runner: commit `326fd668ae3b78623ea25a66c0a2e1c66e478fd4`, blob `a73d9dc394a1aedc87b9aae22642f2b7b77d183d`.
- Migration 0017: commit `be6ac59915b428d15edcdac8cb0d7cb094582d37`, blob `ac587816021559558a3b8aacfe9539d2d0f53086`.

## Remaining gates

A valid real authenticator assertion and real browser/Mac account walkthrough remain outstanding. Before executing any higher-risk file action, the companion must verify the owner authorization against its locally journaled digest, expiry and generation, then re-resolve the item. Production encryption-key setup, provider-backed remote runtime, remote account isolation/recovery, current-Mac/site parity, remaining Stage 2–5 features, and fresh independent review also remain open. Preserve the recorded 22:47 D1 authorization chronology. Foundation exit remains **NOT MET** and Stage 6 remains gated.
