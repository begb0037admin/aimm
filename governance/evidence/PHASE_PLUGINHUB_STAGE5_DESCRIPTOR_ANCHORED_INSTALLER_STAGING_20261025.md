# Stage 5 descriptor-anchored installer staging — 2026-10-25

**Branch:** `codex/pluginhub-foundation`  
**Base checkpoint:** `d14b6764dfbc945fdd9d65129a1c39fffc43b99a` (confirmed identical to the GitHub branch head through the connected GitHub integration)  
**Foundation:** **NOT MET**; Stages 2–5 partial; Stage 6 gated  
**22:47 D1 authorization gate:** open  
**Deployment/cutover:** none

## Change

Reworked the non-production verified installer staging path so the selected download directory is walked and opened component by component with `openat`, `O_DIRECTORY`, and `O_NOFOLLOW`. A UUID staging file is created relative to the held directory descriptor with exclusive/no-follow flags. Streaming writes, `fstat` identity/size checks, UDIF footer reads and SHA-256 hashing all use the retained staging descriptor. Before publication, the code checks the staging directory entry still names that inode and uses an atomic no-replace rename relative to the held directory descriptor. Cleanup uses `unlinkat` on that same descriptor.

Added an integration probe using the actual `URLSession` redirect delegate and a URLProtocol fixture. It confirms an HTTPS redirect to `attacker.invalid` is rejected before a second-host request is issued. Existing synthetic cases continue to cover a valid DMG, digest mismatch, hostile final response, missing content type, streamed size overflow, and malformed UDIF footer.

No real installer was downloaded. The helper is still not connected to the API action queue, owner passkey confirmation, progress/cancel UI, or installer-open flow; no vendor-authenticated digest or reviewed signer is configured.

## Verification

`swift build` and `swift run aimm-journal-check` passed. The complete `sh scripts/pluginhub-nonprod-check.sh` passed: ad-hoc local preview signature, Swift and recovery fixtures, scanner 3/3, API/browser 38/38, disposable local D1 migrations through 0021, local Worker health/auth/CORS and two-account rejection, and Swift pairing/sync/Manual Check/reveal/move/restore integration. All D1 and account fixtures were disposable and local. No remote D1 was accessed or written.

## Review and remaining gates

The implementation was checked against the prior review finding: metadata, footer and digest no longer reopen the staging path; ancestor traversal and publication are anchored to the held directory descriptor; publication is atomic and no-replace; and the actual redirect delegate is exercised. A fresh independent review has not yet been obtained, so this slice is **not independently accepted**.

Provider-backed Auth0/passkey runtime and pairing, remote two-account isolation, populated remote backup recovery, live browser-to-Mac parity, remaining Stage 5 action classes, Developer ID distribution, and fresh independent end-to-end validation remain open. Foundation remains **NOT MET**. Keep Stage 6 gated and the 22:47 D1 gate open. No deployment or cutover.
