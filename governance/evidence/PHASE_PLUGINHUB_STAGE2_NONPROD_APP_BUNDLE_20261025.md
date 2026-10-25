# PluginHub Stage 2 — local non-production companion app bundle

**Verified:** 2026-10-25 07:33 UTC  
**Branch:** `codex/pluginhub-foundation`  
**Scope:** Local preview packaging and first-launch smoke check; unsigned and not for release.

## Change

Added `scripts/package-pluginhub-nonprod-app.sh`. It builds the SwiftPM `aimm-companion` executable and places it in a standard macOS `.app` bundle with an explicit development bundle identifier and minimum OS version. The script requires a new output directory and refuses to overwrite an existing app bundle. Companion README documents the command and the unsigned status.

## Verification

- Packaging script completed successfully and `plutil -lint` accepted the generated `Info.plist`.
- Launched the generated `AIMM Companion Preview.app`; macOS reported it running and the UI exposed the expected companion window.
- First-launch UI showed “Nothing is scanned automatically”, no saved folders, no pairing until a development API URL is entered, and no loaded inventory. No scan, pairing, network request or local plug-in file operation was started.
- The reproducible full local non-production check passed in the preceding checkpoint: companion build/journal checks, scanner 3/3, API/browser 30/30, isolated local D1/Worker, pairing, sync, Manual Check and signed action-receipt flow.

## Pins

- Packager: commit `e342a88f155a5e4d13efc32a221fe691157e3589`, blob `c386d8176b9f87e0523f63aa874e9ec9378377aa`.
- Companion README: commit `e01e490afbf15242343e831a94c44743d1d86ceb`, blob `4098f17d963110ff6e0ff95b9fbe3ce82df69aff`.
- Local preview bundle used for smoke check: `/private/tmp/aimm-nonprod-app-20261024-2230/AIMM Companion Preview.app`. Recreate it with the packager in a fresh destination directory.

## Limits

The bundle is unsigned and not notarised. It is a test build, not a release candidate. This verifies first-run packaging and UI only; it does not prove real account-provider runtime, remote account isolation, backup recovery, full parity, or Stage 5 action classes. Foundation remains **NOT MET** and Stage 6 remains gated. No deployment or cutover occurred.
