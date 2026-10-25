## Runtime follow-up

The exact packaged app was launched from the recorded artifact path. The live first-run window shows “No scan yet”, no saved custom folders, no account pairing, and states that nothing is scanned automatically. I did not start a scan or pair the Mac.

A separate local Auth0 sign-in attempt used `http://127.0.0.1:4317/dev-auth-test.html` and was rejected by Auth0 with `Callback URL mismatch`. The Auth0 Dashboard then required a fresh administrator sign-in to inspect the allowlist. The pre-existing pairing test page at `http://127.0.0.1:4173/dev-auth-test.html` targets a process named `pluginhub-foundation-remote-proxy.mjs` on port 4174; I did not use that path because it may write to the remote project D1 while the 22:47 gate remains open. No Auth0 settings were changed, no credentials were entered, and no remote project database was written.

To finish this real Auth0 check, the callback must be authorized for the local-only test page and the test must point at the disposable local Worker. The current failure is a provider callback allowlist configuration requirement; all synthetic/local tests remain green.

# Stage 2 local ad-hoc signed companion build — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source checkpoint:** `9017a1baa0194e8c1950100418d1d891ae53daa2`  
**Foundation exit:** **NOT MET**  
**Stages 2–5:** in progress  
**Stage 6:** gated  
**Deployment / cutover:** none

## Build

The non-production packager now creates an ad-hoc-signed native app bundle and runs strict signature verification before reporting success. The standard non-production check invokes the packager and verifies the bundle signature. The README distinguishes local ad-hoc signing from Developer ID distribution and notarization.

Created a local preview bundle at:

`/Users/admin/aimm-pluginhub-preview-2026-10-25/AIMM Companion Preview.app`

- Bundle size: 2.0 MB.
- Signature: valid ad-hoc signature; no Team ID.
- Strict verification: `codesign --verify --strict` passed.
- Executable SHA-256: `12f2927135d7ddc5c415700000c7ffdd09dcafeef94cc33a9b76f3ccb6a383f9`.

This is suitable for local non-production hands-on testing on this Mac. It is not Developer ID signed, notarized, or suitable for distribution to other users. No signing credential or provider terms were used.

## Verification

The full local `sh scripts/pluginhub-nonprod-check.sh` passed after adding package verification:
- Bundle creation, plist validation and strict ad-hoc signature verification.
- Swift companion build and journal/recovery checks.
- Scanner integration: 3/3.
- Library API/browser suite: 34/34.
- Local D1 migrations through 0020, isolated Worker HTTP runtime, CORS and unauthenticated rejection.
- Pairing, inventory sync, Manual Check, signed encrypted-preview submission, and signed reveal receipt against local Worker/D1.

All project data used by the integration checks was disposable local state. No project D1 was written or deployed.

## Source pins

- Packager: blob `3c65a7f4653899f7cb273eb5ac31273a2d30db30`.
- Companion README: blob `c0d5685dc8fd43ab557c447645047236c2e1cf8d`.
- Full-check script: blob `5ef9977e4519c52a401938156e3a47ec5abf6112`.

## Remaining Stage 2 and project gates

This advances local preview packaging and makes its signature check repeatable. It does not provide Developer ID distribution/signing evidence or a real Auth0/passkey pairing walkthrough. Stages 2–5 remain in progress; Foundation remains **NOT MET**; Stage 6 remains gated; the 22:47 D1 gate remains open. Provider-backed remote runtime, remote account isolation and recovery, live browser/Mac evidence, remaining Stage 2–5 parity/action work, and fresh independent review remain open.
