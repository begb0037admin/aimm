# Stage 5 verified installer staging — pause checkpoint, 2026-10-25

## Current implementation

Implementation commit: `8a64ad0835e3e72aa34062c1884b1a02ccbe6b96` on `codex/pluginhub-foundation`.

The companion now has a local DMG staging primitive that requires an explicit trusted SHA-256 digest, checks HTTPS host/redirect policy, response status and content type, declared and streamed size, basic UDIF footer structure, and the final digest. The staging name uses UUID interpolation; it is opened with exclusive, no-follow POSIX flags and the open descriptor is retained while streaming. Oversized input is rejected as soon as it crosses the limit. This corrects the first independent review's predictable staging-name defect.

The fixture checks cover a synthetic success, digest mismatch, hostile final response, disallowed-host predicate, missing content type, chunked size overflow, and malformed UDIF footer. The synthetic hostile-response case does not exercise the real URLSession redirect delegate or prove that an unapproved host receives no request. Path checks and final publication still have a path-based TOCTOU window; the independent reviewer identified this as unresolved. Fresh independent validation of the correction is pending. The prior independent verdict was **REJECTED** for the predictable staging path and related path race; do not represent this slice as independently accepted.

The downloader is not wired to an API action queue, owner passkey confirmation, progress/cancellation UI, or installer-open flow. No authenticated vendor digest or reviewed signer is configured for the FabFilter route. No live installer was fetched.

## Verification

After the staging-path correction, `sh scripts/pluginhub-nonprod-check.sh` passed. It built and ad-hoc signed the local preview, ran the Swift build/journal fixtures, scanner 3/3, API/browser 38/38, local D1 migrations through 0021, local Worker auth/CORS and synthetic two-account rejection, and local Swift pairing, sync, Manual Check, reveal, move and restore flows. The installer checks above ran with synthetic bytes. `git diff --check` passed before the implementation commit.

This verifies local non-production behavior only. No remote D1 was accessed or written. Nothing was deployed or cut over.

## Project gates

Foundation remains **NOT MET**. Stages 2–5 remain partial, Stage 6 is gated, and the 22:47 D1 authorization gate remains open. Open work includes fixing or eliminating the publication path race, an actual redirect-delegate test, provider-backed Auth0/passkey runtime and pairing, remote two-account isolation, populated remote backup recovery, live browser-to-Mac parity, remaining Stage 5 action classes, Developer ID distribution as required by the approved design, and fresh independent end-to-end validation.

## Source pins

- `companion/Sources/AIMMCompanionCore/VerifiedInstallerDownload.swift`: blob `f05eb30672aa320a6dc54287199ff27407e93e3d`.
- `companion/Sources/aimm-journal-check/main.swift`: blob `02448e67a15a84f5eb1ad609be2181bcefbc0583`.
