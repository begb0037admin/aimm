# PluginHub Stages 2–5 checkpoint — 2026-10-24 22:04 UTC

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Verified starting head:** `5e364f70c65c7f99758809a46bdb6a6af6f8b46a`  
**Code head after this increment:** `392c72bd8c358790ac4be262faeed6331c284b19`  
**Foundation exit:** **NOT MET**. Historical independent Stage 5 review: **PARTIAL**.  
**Stages 2–5:** in progress. **Stage 6:** not ready. **Deployment/cutover:** none.

## Stage 3 and Stage 5 action-preview work

Added an authenticated, account-scoped read-only endpoint and Hope tool named `get_plugin_action_preview`. The browser can also preview a Finder action from the account inventory. A preview uses one record from the selected device's current complete generation and returns its name/format plus a redacted action summary. It never returns a local path or URL, creates no operation, changes no file, and does not execute an action. Cross-account lookups return not found. Every supported action still requires confirmation on the Mac.

## Verification

The full `sh scripts/pluginhub-nonprod-check.sh` suite passed at 22:04 UTC:

- Swift companion and journal checker build; scanner fixtures 3/3.
- API/browser tests: 30/30; JavaScript syntax checks passed.
- Recovery export restore and migrations through 0012 passed.
- Temporary local D1/Worker health, auth and CORS checks passed.
- Synthetic Swift pairing-init, inventory sync, Manual Check upload, and signed reveal-receipt readback passed.
- API tests confirm preview is path-free, account-scoped, non-mutating, and does not queue an operation; browser test confirms Hope returns the redacted preview.

No actual Finder/hub launch, real Keychain pairing, live Auth0 session, remote two-account probe, application D1 write, deployment or cutover was performed.

## Remaining Stage 2–5 work

Real paired-Mac/Keychain and user-granted folder evidence; actual Finder/hub action evidence; broader vendor/status coverage and remaining 31-row parity; other Stage 5 action classes and their failure/recovery checks; remote two-account isolation using valid Auth0 sessions; and fresh independent Stage 5/Foundation validation remain open. Foundation remains **NOT MET**, historical Stage 5 review remains **PARTIAL**, and Stage 6 remains gated.

## Source pins

| File | Commit | Verified blob |
|---|---|---|
| `library-api/src/index.js` | `e26878d39a260626e3b1058d15bca13e36e4608d` | `84ce00b548e577f41f5fb42a88b581f6370114e3` |
| `library-api/library-account.js` | `868f20f94317dde9526b164ceaefea70e91c3c5b` | `cff9557a8ceca6b5de5aabafaa72fcc923642a78` |
| `library-api/test/foundation.test.js` | `e2c1cf92a954e6bd113876d22cb3be6ee5f27a34` | `8d20e43b4154de1bebcd2b56bd5b972f1e59a07a` |
| `library-api/test/library-account.test.js` | `392c72bd8c358790ac4be262faeed6331c284b19` | `7d51649bf65e93156e6f8b9660852e49458d40a8` |

No provider terms or credentials were accepted or created. The project D1 and live services remain unchanged; no deployment or cutover occurred.
