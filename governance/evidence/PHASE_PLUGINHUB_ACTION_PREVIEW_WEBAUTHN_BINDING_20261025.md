# PluginHub Stage 2–5 — exact-preview authorization groundwork

**Verified:** 2026-10-25  
**Tested source checkpoint:** `cea877952d6c3765e58db4376aa0044d83c748f1` on `codex/pluginhub-foundation`  
**Result:** The companion can submit a device-signed exact preview, which the Worker verifies against the current claimed operation and inventory, hashes, and stores encrypted in a short-lived D1 table. Foundation remains **NOT MET**; Stages 2–5 remain in progress.

## Change

Migration `0016_encrypted_action_previews.sql` adds an isolated encrypted preview-payload table with a maximum ten-minute lifetime and operation capability metadata. The Worker accepts only a bounded, schema-limited preview from the paired device. It checks the operation/account/device/nonce/kind/generation, verifies the current inventory record and device ECDSA signature, derives the canonical SHA-256 digest, and stores the canonical path payload using AES-GCM with operation-bound additional authenticated data. The ordinary action view remains redacted.

Migration `0015_action_preview_authorization_binding.sql` and the WebAuthn options path bind a later owner-confirm challenge to the same claimed operation, digest, expiry, account and browser session. A valid action-confirm challenge is refused until the preview has been marked unlocked.

The local API test checks the signed upload, derived digest, encrypted-at-rest storage, no plaintext path in the payload column, same-preview idempotent replay and changed-preview rejection. It also covers malformed, unopened, changed-digest, cross-account and expired owner-confirm challenges.

## Verification

- Focused API tests: PASS.
- `sh scripts/pluginhub-nonprod-check.sh`: PASS. Swift companion/journal checks; scanner 3/3; API/browser 33/33; syntax checks; local D1 migrations through 0016 and Worker runtime; pairing, inventory sync, Manual Check, and signed synthetic reveal receipt.
- Local-only AES-GCM key fixture. No production encryption secret was created or configured. No real authenticator, remote D1 write, deployment or cutover.

## Source pins

- Worker API: commit `441a26d1dbb081b92082d5cd19d71bc08122fecd`, blob `88764bd07afbaf389ce0e8814db7fd034f312022`.
- API tests: commit `2469f5291ccf22cdbb0a7d37e58c73a9df5cfbd7`, blob `09e93e6caf44ec8def2899c574eba93fe2d41236`.
- Recovery migration test: commit `cff8d50d507906d816889e9887972189d6879f9d`, blob `b323343f88a62229c37072924c998f1d32e7b950`.
- Migration 0016: commit `cea877952d6c3765e58db4376aa0044d83c748f1`, blob `d9af6de05e6fbdc720148153e13b2aaa7e03652e`.

## Remaining gates

The owner UI still needs a fresh passkey unlock, a one-use two-minute capability, exact-path retrieval and display, a second explicit passkey confirmation, and companion-side digest/expiry/generation revalidation before execution. Real authenticator evidence is outstanding. Provider-backed remote runtime, remote cross-account and recovery checks, real current-Mac parity, remaining Stage 2–5 features, and fresh independent review also remain open. Preserve the recorded 22:47 D1 authorization chronology. Foundation exit remains **NOT MET** and Stage 6 remains gated.
