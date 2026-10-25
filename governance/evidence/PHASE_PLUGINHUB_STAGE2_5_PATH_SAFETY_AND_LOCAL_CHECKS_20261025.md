# Stage 2–5 path safety and local verification — 2026-10-25

**Source commit:** `b4906aeff63fb099fbf26d18709ed83bf0897e52`  
**Targeted independent review:** ACCEPTED for the path and fixture fixes at parent commit `41867c9c410ec518e27e3020861112b58220336a`  
**Foundation:** NOT MET  
**22:47 D1 authorization gate:** open

## Changes

- Restore path identity now normalizes only macOS's `/tmp` → `/private/tmp` and `/var` → `/private/var` aliases. It does not resolve arbitrary symlinks.
- Restore execution and preview validation use the same path identity. The restore integration fixture journals `/tmp/...` while the companion record uses `/private/tmp/...`, asserts that the strings differ, and exercises the complete restore flow.
- `validateDirectory` checks every directory component and rejects symlinked ancestors. A regression fixture verifies that a symlinked ancestor blocks a move and leaves the source in place.
- The local Worker fixture uses a newly created, uniquely named temporary directory. Cleanup removes only that owned directory; the previous fixed-path `rm -rf` was removed.
- Wrangler's local Miniflare dependency was using vulnerable `undici` 7.29.1. The lockfile now pins patched `undici` 7.30.1 without changing Wrangler 4.152.0.

## Verification

After the final source commit, `sh scripts/pluginhub-nonprod-check.sh` passed:

- Ad-hoc preview packaging and signature verification.
- Swift build and journal/recovery checks; scanner checks 3/3.
- API/browser suite 38/38, JavaScript syntax checks, and D1 migrations through 0021 in disposable local storage.
- Local Worker health, authentication and CORS checks; two synthetic accounts rejected each other's device credentials with HTTP 401.
- Actual Swift pairing, sync, Manual Check, reveal, move and restore flows against local Worker/D1, including signed previews/receipts and the differing `/tmp` and `/private/tmp` restore paths.
- `sh scripts/pluginhub-cross-volume-check.sh` passed on distinct filesystem devices `16777233 → 16777239`, including staged-copy verification, move, restore and recovery. The temporary APFS image was detached and removed.
- `npm audit` reported **0 vulnerabilities** after the pinned dependency patch.

The independent reviewer accepted the targeted code changes by read-only inspection and ran no tests or external checks. The full local integration suite intentionally inserts owner-confirmation timestamps into disposable D1; it is not a real browser WebAuthn ceremony or Auth0 pairing. These results do not establish remote account isolation/recovery, real provider runtime, live browser-to-Mac parity, or Foundation exit.

## Still open

Real Auth0/passkey runtime and pairing, remote two-account isolation, populated remote recovery, live browser-to-Mac parity, remaining Stage 5 actions, Developer ID distribution, and fresh end-to-end independent validation remain open. Preserve Foundation **NOT MET**, Stage 6 gated, and the 22:47 D1 authorization gate open. No remote project D1 was read or written; no deployment or cutover occurred.
