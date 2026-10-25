# PluginHub Stage 2–5 — full local non-production rerun

**Observed:** 2026-10-25 13:40–13:42 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Source commit:** `a0cf4ecc262a5495959ddc41eb4bcccd38dd7cda`  
**Command:** `sh scripts/pluginhub-nonprod-check.sh`

The first sandboxed invocation stopped before SwiftPM could compile because `sandbox-exec` returned `Operation not permitted`. The same user-authorized local command then ran with elevated local execution and exited 0.

Passed checks:

- Local ad-hoc companion package and signature validation.
- Swift companion and journal checks, including descriptor-anchored installer staging, no-replace publication, actual URLSession redirect-delegate rejection before a second request, response-size/content checks, disk-image structure and trusted digest verification. No live installer was downloaded.
- Interrupted cross-volume restore recovery, verified copy-before-source-removal, staged recovery, and duplicate-copy recovery fixtures.
- Scanner integration tests: 3/3.
- API/browser Node suite: 38/38, including OIDC/CSRF, pairing, account isolation, session, action authorization, and local recovery fixtures.
- Disposable local D1 migration/Worker checks, CORS, unauthenticated rejection, local two-account credential rejection, Swift pairing, inventory sync, Manual Check, signed preview/reveal, move, restore, and signed receipt validation.

All fixtures used synthetic test data and disposable local D1. Some local move/restore fixtures insert owner-confirmation timestamps directly; they do not perform a real browser WebAuthn ceremony. These results do not exercise the remote project D1, real Auth0-authenticated runtime, live browser-to-Mac parity, or live provider account isolation. No remote D1 write, deployment, or cutover occurred.

Foundation remains **NOT MET**; Stages 2–5 remain partial/in progress; Stage 6 remains gated.
