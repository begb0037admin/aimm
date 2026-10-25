# Stage 5 interrupted cross-volume restore recovery — 2026-10-25

**Branch:** `codex/pluginhub-foundation`  
**Implementation commit:** `fd081bb1f956a1e3d98d759dddfd77a48841cd70`  
**Foundation:** **NOT MET**; Stages 2–5 partial; Stage 6 gated  
**22:47 D1 authorization gate:** open  
**Deployment/cutover:** none

Added a deterministic crash-recovery fixture for the local restore executor. It forces a synthetic restore onto the cross-volume copy path, interrupts publication after the staging copy, verifies that the original Unused item and staging copy are both preserved with the journal marked `needs_recovery`, then resumes with the same operation and verifies the destination before removing the Unused source. This closes a local Stage 5 test gap; it does not operate on installed plug-ins.

Verification completed on the implementation commit:

- `swift build` and `swift run aimm-journal-check`: PASS, including the interrupted staged-restore recovery fixture.
- `sh scripts/pluginhub-nonprod-check.sh`: PASS. App signature, Swift journal/recovery, scanner 3/3, API/browser 38/38, local D1 migrations through 0021, local Worker auth/CORS, synthetic two-account token rejection, Swift pairing/sync, Manual Check, reveal, move and restore all passed.
- `git diff --check`: PASS.

The integration suite uses disposable local D1/Worker state and synthetic fixture files. Its move/restore owner-confirmation timestamps are injected by the local test harness; this is not real browser WebAuthn/Auth0 runtime evidence. This check does not establish remote account isolation or backup recovery, live browser-to-Mac parity, remaining Stage 5 actions, Developer ID distribution, or fresh independent end-to-end acceptance. Preserve Foundation **NOT MET** and Stage 6 gated. No remote D1 was accessed or written; nothing was deployed or cut over.
