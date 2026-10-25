# Stage 2 loopback-only pairing harness — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Foundation exit:** **NOT MET**  
**Stages 2–5:** in progress  
**Stage 6:** gated  
**22:47 D1 gate:** open  
**Deployment / cutover:** none

## Change

Added `library-api/pair-remote-test.html`, a manual Auth0 pairing and account-isolation walkthrough. The page now refuses to run off loopback, derives its OAuth callback from its own local URL, and sends every API request to the fixed disposable Worker URL `http://127.0.0.1:8787`. It cannot be configured to target a remote API or the pre-existing port 4174 proxy. The access token stays in page memory; the PKCE verifier/state are short-lived tab session data. The page contains no client secret and does not persist tokens.

Added `library-api/test/pair-remote-test.test.js` for script parsing, non-loopback blocking, fixed local API target, same-page callback, scopes, PKCE, and secret/token-storage boundaries.

## Verification

Ran `sh scripts/pluginhub-nonprod-check.sh` after the change. It passed:

- 38 API/browser tests, including the four new harness checks.
- Companion build, journal and recovery checks.
- Scanner integration: 3/3.
- Local D1 migrations through 0020 and isolated local Worker checks.
- Local Swift pairing, inventory sync, Manual Check, signed exact-preview and signed reveal receipt.
- Local ad-hoc-signed preview bundle validation.

Also applied all 20 D1 migrations to a separate disposable local state directory and started the Worker with `SITE_ORIGIN=http://127.0.0.1:4173`. The local auth pairing page loaded and displayed its fixed Worker target. The disposable state was removed after inspection. No Auth0 sign-in or pairing ceremony was completed because the Auth0 Teams session required a user login; no credentials were entered. The earlier `127.0.0.1:4317` callback mismatch remains unresolved; this page uses the previously prepared `127.0.0.1:4173/pair-remote-test.html` callback, whose allowlist still needs real provider confirmation.

No remote project D1 request or write occurred. The 22:47 database gate remains open. No provider settings, credentials, deployment, or cutover were changed.

## Source pins

- Pairing harness commit: `58a5b6d196cf627fcffdc737e17d0e8812221625`.
- Pairing harness blob: `aa2417c854d98330f41cae3e40e83feadd17583e`.
- Harness test commit: `9d3bdceca5d9c8775e746b81e10e3c4df055c7be`.
- Harness test blob: `05e69f1596ad9508c1f2ae741d0736787677481a`.
- Baseline Worker blob: `1e22c7839e153dfbec348112f605e919e74093fd`.
- Baseline full-check script blob: `5ef9977e4519c52a401938156e3a47ec5abf6112`.

## Remaining Stage 2 and project gates

This provides a safe, repeatable local walkthrough surface. It does not prove real Auth0 sign-in, two-account isolation, an actual pairing ceremony, or Developer ID distribution. Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated. Provider-backed remote runtime, remote account isolation/recovery, live browser/Mac parity, remaining Stage 2–5 evidence, and fresh independent review are still open.
