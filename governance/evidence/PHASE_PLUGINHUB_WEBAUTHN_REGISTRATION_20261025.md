# PluginHub Foundation increment — WebAuthn registration base

**Date:** 2026-10-25  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source checkpoint:** `e08d731565aa1d2dfb8ff418f28814513120f19a`

## Change

The non-production Library API now has the first real WebAuthn credential-registration path. It generates a five-minute challenge for the current signed-in browser session, requires the configured same-site Origin and CSRF token, requests user verification, and verifies the browser credential against the configured site RP ID and exact Origin. Challenges are bound to both account and browser session, consumed once, and removed after expiry. The D1 schema stores credential ID, public key, signature counter and transports; it does not store an authenticator private key or secret.

The account preview now includes a “Set up a passkey” button using the browser’s native WebAuthn API. A real passkey is created only after the owner signs in and presses that button.

Schema migration: `library-api/migrations/0013_webauthn_credentials.sql`.

## Verification

- `npm test`: 31 tests passed.
- `sh scripts/pluginhub-nonprod-check.sh`: passed, including Swift companion/journal, scanner 3/3, API/browser 31/31, isolated local D1 migrations and Worker runtime, pairing, inventory sync, Manual Check, and signed synthetic reveal receipt.
- The WebAuthn tests check CSRF rejection, same-account cross-session rejection, five-minute challenge lifetime, required user verification, invalid-credential rejection, one-use replay rejection, expired-challenge cleanup, and recovery migration through 0013.
- No real passkey was enrolled or attested in this run; successful browser-authenticator verification still needs an end-to-end authenticator check. Authentication/assertion, exact action-preview binding and owner confirmation are not implemented yet.

## Source pins

- Worker API: commit `97bc9a39a293a0148bdc530a68f5085225590979`, blob `cb4ba6470aad319fbea5d64aab13cc10128aedb1`.
- Browser registration UI: commit `3b654f6d9dc76a3819bb7df72d4867eb1f19cff0`, blob `bf54af4a2ce06837dd349ef06de7bce6857d1695`.
- Schema migration: commit `e08d731565aa1d2dfb8ff418f28814513120f19a`, blob `ba89193f1712e36b56cad4ad9ba41cfbf3ca6429`.
- Pinned dependency manifests: `package.json` blob `6704a787819bb3a601c5a9dca335d40967ebba35`; `package-lock.json` blob `87742ce62be4a36e9454c9edd6ffa073c5b14c45`.
- API tests: commit `bbec435b46d334d6eecfb32f91e4c7a050495f1f`, blob `1d9dc4dbae2f4efaa5f82f1296188e840c7c5092`.
- Recovery migration test: commit `723be93138bdf899c96e9a5b7aadbbd7db5d8563`, blob `e2cc08020b1f0dd519c15c8a612cf04bc26d5b6a`.

## Dependency note

The local install reported three npm audit advisories (two moderate, one high). A follow-up `npm audit --json` could not reach `registry.npmjs.org` because DNS/network access returned `ENOTFOUND`, so the affected dependency paths and current advisory details remain unverified. This must be resolved before any production use; no deployment occurred.

## Gate status

This is implementation and local evidence only. It does not close the real-authenticator check, Stage 5’s exact-preview authorization/action work, provider-backed runtime, remote account isolation or recovery, current-Mac parity, or independent review. Foundation remains **NOT MET**. Stages 2–5 remain in progress; Stage 6 remains gated. No remote project D1 write, deployment or cutover occurred.
