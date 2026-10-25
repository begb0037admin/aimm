# PluginHub Foundation increment — WebAuthn assertion base

**Date:** 2026-10-25  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source checkpoint:** `bbbeb33f7e4f84fb3b75f94d3355529c4b2e2104`

## Change

Added a passkey assertion path to the non-production Library API and account preview. The API offers assertion options only to a same-site signed-in browser session with a registered account credential. Challenges expire after five minutes and are bound to the account and browser session, with one-time consumption. Verification checks the exact configured Origin and RP ID, requires user verification, validates the registered public key, and updates its signature counter and last-used time. The browser preview can now set up and verify a passkey using native WebAuthn.

This assertion confirms the owner session only. It does not authorize an action. Stage 5 still needs the companion's signed, exact action preview and an assertion cryptographically bound to that preview digest and expiry before protected file actions can be confirmed.

## Verification

- `npm test`: 32 tests passed.
- `sh scripts/pluginhub-nonprod-check.sh`: passed, including Swift companion/journal, scanner 3/3, API/browser 32/32, isolated local D1 migrations and Worker runtime, pairing, inventory sync, Manual Check, and signed synthetic reveal receipt.
- Tests cover no-credential rejection, required user verification, same-account cross-session rejection, invalid-assertion rejection, replay rejection, expiry cleanup, and recovery migration through 0014.
- No real authenticator was used, so successful attestation/assertion through a physical or platform passkey remains unverified. No account passkey was created.

## Source pins

- Tested branch checkpoint: `bbbeb33f7e4f84fb3b75f94d3355529c4b2e2104`.
- Worker API: commit `be7e7555220b11a89b84a5b30f6460dbf27db1cd`, blob `a81c620019600e2f6b27aecd3ceeade801a38f41`.
- Browser UI: commit `79c9ec7af404a7a87c7a7d77d10139d06adb5903`, blob `5e33e4de48e027a21bf0884d1417e05aeae2113d`.
- Migration `0014_webauthn_authentication_challenges.sql`: blob `dccd56e00a78ae272ab6fd1c3c4a06378544f349`.
- API tests: commit `498ee21df29f495e1986a62e1cc639de1fe11fd4`, blob `2d200481e9159ee42866fd01fd9796a0299fe1fd`.
- Recovery test: commit `b2e2082544c7b00e461cfa78ac9073d3b76dab49`, blob `ae7451ab82f5b8ef0d99f6fb9f6334edda4975e1`.

## Gate status

This is local non-production evidence. The full exact-preview authorization/action flow, real authenticator validation, provider-backed runtime, remote account isolation/recovery, live Mac/site parity, remaining Stage 2–5 functionality and fresh independent review remain open. Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated. No remote project D1 write, deployment or cutover occurred.
