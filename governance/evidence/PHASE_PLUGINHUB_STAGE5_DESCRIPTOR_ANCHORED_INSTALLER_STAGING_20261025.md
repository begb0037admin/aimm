# Stage 5 descriptor-anchored installer staging — 2026-10-25

**Branch:** `codex/pluginhub-foundation`  
**Base checkpoint:** `d14b6764dfbc945fdd9d65129a1c39fffc43b99a` (confirmed identical to the GitHub branch head through the connected GitHub integration)  
**Foundation:** **NOT MET**; Stages 2–5 partial; Stage 6 gated  
**22:47 D1 authorization gate:** open  
**Deployment/cutover:** none

## Change

The non-production verified installer staging path walks the selected download directory component by component with `openat`, `O_DIRECTORY`, and `O_NOFOLLOW`. A UUID, owner-only (0700) staging directory is created relative to the held destination descriptor; the partial file is created inside it with exclusive/no-follow flags. Streaming writes, `fstat` identity/size checks, UDIF footer reads and SHA-256 hashing all use the retained staging descriptor. Before publication, the code checks the staging entry identity and atomically renames it into the destination with no-replace semantics, using both held directory descriptors. The private directory limits staging-entry replacement by other local users; protection against a hostile process running as the same user is outside the current threat model.

After publication, the code reopens the selected directory through the no-symlink traversal and verifies that both the directory and published file still resolve to the held inodes. If the selected folder was moved or replaced during transfer, it removes the just-published file through the pinned descriptor and returns an unsafe-destination error instead of returning a stale `fileURL` receipt.

Added an integration probe using the actual `URLSession` redirect delegate and a URLProtocol fixture. It confirms an HTTPS redirect to `attacker.invalid` is rejected before a second-host request is issued. Existing synthetic cases continue to cover a valid DMG, digest mismatch, hostile final response, missing content type, streamed size overflow, and malformed UDIF footer.

No real installer was downloaded. The helper is still not connected to the API action queue, owner passkey confirmation, progress/cancel UI, or installer-open flow; no vendor-authenticated digest or reviewed signer is configured.

## Verification

`swift build` and `swift run aimm-journal-check` passed. Fixtures confirm successful publication and rejected oversized downloads leave no private staging directory. A new fixture moves the selected directory and replaces its original path with a symlink during transfer; the stale receipt is rejected and no installer remains in either location. The complete `sh scripts/pluginhub-nonprod-check.sh` passed: ad-hoc local preview signature, Swift and recovery fixtures, scanner 3/3, API/browser 38/38, disposable local D1 migrations through 0021, local Worker health/auth/CORS and two-account rejection, and Swift pairing/sync/Manual Check/reveal/move/restore integration. All D1 and account fixtures were disposable and local. No remote D1 was accessed or written.

## Review and remaining gates

The fresh independent read-only review of the prior implementation returned **PARTIAL**. It accepted the earlier path/ancestor and redirect fixes for other local users but found that a moved download directory could make the returned receipt path stale, and noted the same-UID threat boundary. The stale-receipt case now has a fail-closed identity check and regression fixture; same-UID process interference remains outside the current threat model. Request a second independent review of these corrections before calling the slice accepted.

Provider-backed Auth0/passkey runtime and pairing, remote two-account isolation, populated remote backup recovery, live browser-to-Mac parity, remaining Stage 5 action classes, Developer ID distribution, and fresh independent end-to-end validation remain open. Foundation remains **NOT MET**. Keep Stage 6 gated and the 22:47 D1 gate open. No deployment or cutover.
