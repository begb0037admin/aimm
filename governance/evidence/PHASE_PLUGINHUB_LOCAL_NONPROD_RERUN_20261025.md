# PluginHub local non-production rerun — 2026-10-25 13:01 UTC

Repository `begb0037admin/aimm`, branch `codex/pluginhub-foundation`, source checkpoint `59cc9db06d179fa501526e4d7f8ce4665e58cf6b`.

## Result

Ran `sh scripts/pluginhub-nonprod-check.sh` from the project root. **All non-production checks passed.** The script built and ad-hoc signed a local companion preview; ran Swift build/journal and recovery fixtures; scanner tests passed 3/3; API/browser tests passed 38/38; disposable local D1 migrations completed through 0021; the local Worker passed health/auth/CORS and synthetic cross-account credential rejection; and the Swift client passed local pairing, inventory sync, Manual Check, reveal, move and restore flows. The installer check passed descriptor-anchored staging, atomic no-replace publication, actual redirect-delegate rejection, streaming limits, DMG structure and digest checks. Installer bytes and accounts were synthetic fixtures only.

This is local non-production evidence. It does not establish remote D1 identity/migration state, remote account isolation, remote recovery, real provider-backed Auth0/passkey pairing, or live browser-to-Mac parity. No remote D1 query or write occurred. No production data was used. Nothing was deployed or cut over; no provider terms were accepted and no credentials were created.

## Remote D1 authorization and blocker

The owner authorized bounded validation of the existing non-production database `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`): verify database identity/current migration state, apply migration 0003 only if required, run synthetic two-account isolation checks, and verify recovery through a suitable non-production route. The separate 22:47 creation authorization is resolved. Wrangler 4.152.0's stored token expired and its refresh endpoint was unreachable. Cloudflare's GitHub OAuth consent for read-only email access remains pending. Do not query or write remote D1 until the owner completes that sign-in or restores Wrangler authentication; then verify the exact target and migration state before any write. Do not attempt a broad table export or an alternate path around the previous automatic-review rejection.

## Publication and project gates

The local branch was clean before this run. GitHub was verified at `d14b6764dfbc945fdd9d65129a1c39fffc43b99a`; the authorized fast-forward push then succeeded and published local checkpoint `59cc9db06d179fa501526e4d7f8ce4665e58cf6b`.

Foundation remains **NOT MET**; Stages 2–5 remain partial/in progress; Stage 6 remains gated. Fresh independent end-to-end Foundation validation, remote D1 isolation/recovery evidence, provider-backed runtime/pairing, browser-to-Mac parity, remaining Stage 5 actions and required distribution/signing work remain open. This report records a local verification rerun only.
