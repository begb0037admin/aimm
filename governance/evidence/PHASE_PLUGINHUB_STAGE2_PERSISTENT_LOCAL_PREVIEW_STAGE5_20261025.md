# Persistent local companion preview build — 2026-10-25

## Artifact

Built from the tested Stage 2–5 companion source in the local checkout aligned with `codex/pluginhub-foundation` source commit `946ad71df470bf3d4c5ada00de5d9a7ab9ff3f15`.

- App: `/Users/admin/aimm-pluginhub-preview-2026-10-25-stage5-local-e2e/AIMM Companion Preview.app`
- Executable SHA-256: `5496bbd4946211d6331469ef64619d50ef322010f29b49d7d326f68a301e3ff6`
- Bundle ID: `com.aimixmasters.companion.preview`
- Architecture: arm64
- Signature: local ad-hoc; strict `codesign --verify` passed; no Team ID.
- Info.plist lint passed.

This is a non-production hands-on preview, not Developer ID signed or notarized. The GUI was not launched and no folders were scanned. The build was not deployed.

## Verification context

Immediately before packaging, `sh scripts/pluginhub-nonprod-check.sh` passed, including Swift build/journal/recovery, scanner 3/3, API/browser 38/38, local D1 through migration 0021, isolated local Worker health/auth/CORS, two-way synthetic account credential rejection, pairing/sync, Manual Check, reveal, and linked local move/restore with signed receipts. The move/restore harness used synthetic confirmation writes in disposable local D1; it did not perform a real browser passkey ceremony or Auth0 runtime check.

No remote project D1 was accessed or written. Nothing was deployed or cut over. Foundation remains **NOT MET**; Stages 2–5 partial; Stage 6 gated; the 22:47 D1 authorization gate remains open.
