# PluginHub Stage 2–5 — exact-preview authorization groundwork

**Verified:** 2026-10-25  
**Tested source checkpoint:** `be6ac59915b428d15edcdac8cb0d7cb094582d37` on `codex/pluginhub-foundation`  
**Result:** The local API now accepts a paired-device-signed exact preview, stores its canonical path payload encrypted, and provides a session-bound one-use owner preview capability after the action-specific WebAuthn flow. Foundation remains **NOT MET**; Stages 2–5 remain in progress.

## Change

Migration `0016_encrypted_action_previews.sql` adds an isolated encrypted preview-payload table with a maximum ten-minute lifetime and operation capability metadata. The Worker accepts only a bounded, schema-limited preview from the paired device. It checks the operation/account/device/nonce/kind/generation and current inventory, verifies the device ECDSA signature, derives the canonical SHA-256 digest, and stores the canonical path payload with AES-GCM and operation-bound authenticated data. Ordinary action reads remain redacted.

Migration `0017_owner_preview_capabilities.sql` binds the owner capability to the WebAuthn-verified browser session. The action-specific unlock challenge is bound to the operation, digest and preview expiry. After successful WebAuthn verification, the API stores only a hash of a random capability, bounded to two minutes and the preview expiry. The exact-path GET requires that capability and the same signed-in session, decrypts the preview, consumes the capability once, and records that the owner viewed it. A later action-confirm challenge requires the viewed state; successful verification records confirmation and deletes the encrypted payload.

## Verification

- Focused API tests: PASS. Tests cover device signature verification, active inventory binding, encrypted-at-rest storage without plaintext paths, same-preview replay, changed-preview rejection, malformed/unopened/cross-account/expired challenges, exact challenge binding, same-session capability access, wrong-session/account rejection and one-use replay rejection.
- `sh scripts/pluginhub-nonprod-check.sh`: PASS. Swift companion/journal checks; scanner 3/3; API/browser 33/33; syntax checks; local D1 migrations through 0017 and Worker runtime; pairing, inventory sync, Manual Check and signed synthetic reveal receipt.
- The owner capability GET is tested with a local synthetic WebAuthn-authorized fixture. No real authenticator was enrolled or used, and a valid real WebAuthn assertion was not exercised end to end. The encryption key was local test data only; no production key was configured. No remote D1 write, deployment or cutover occurred.

## Source pins

- Worker API: commit `04ef27f6519018e9c5be16d8a9afe26e3ae42dee`, blob `ce87117670e290124fd4bdeafbac5dcfee581fd7`.
- API tests: commit `de833b8f9496f556c170d419f60b7bc3b1edb476`, blob `0696f7de7601972c39a3d25e0a89d4210f8de520`.
- Recovery tests: commit `58b0ff32270f31ee9ebfc8c72e748ffee0811cc3`, blob `80b7a31a9219b1ee5fb38ec55f79b3ac198f996c`.
- Migration 0017: commit `be6ac59915b428d15edcdac8cb0d7cb094582d37`, blob `ac587816021559558a3b8aacfe9539d2d0f53086`.

## Remaining gates

The companion does not yet construct and upload this exact preview from its local journal, and the account UI does not yet run the owner unlock/view/confirm sequence. The successful real-authenticator assertion and device-side digest/expiry/generation revalidation are still unverified. Provider-backed remote runtime, remote cross-account/recovery evidence, real current-Mac parity, remaining Stage 2–5 features, and fresh independent review also remain open. Preserve the recorded 22:47 D1 authorization chronology. Foundation exit remains **NOT MET** and Stage 6 remains gated.
