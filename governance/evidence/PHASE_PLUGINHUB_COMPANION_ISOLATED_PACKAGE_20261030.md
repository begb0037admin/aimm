# Isolated Companion preview package and Duplicate Review runtime — 2026-10-30

## Source and package

Branch `codex/pluginhub-foundation` commit `0d7bc962045315656b32e90131575f3b3c6023ff` adds an opt-in isolated Companion preview mode and packaging metadata:
- App source `companion/Sources/aimm-companion/AIMMCompanionApp.swift` blob `015a63b963c36c0a8b7598bb8e1ef986cb890ee9`.
- Package script `scripts/package-pluginhub-nonprod-app.sh` blob `30b581d7e24c13eb4c61562be61112e87a61ca53`.

The non-production package carries `AIMMIsolatedPreview=true` and a unique bundle identifier (customizable). Isolated mode uses a dedicated preferences suite, does not load the device credential or standard Application Support scan journal, blocks scan/pairing methods, and disables scan, folder, forget-folder and pending-request controls. Every plug-in bookmark read/write uses the selected defaults suite. Normal unmarked app bundles retain normal behavior.

Build and package completed in an isolated temporary tree using the branch-source packager with `AIMM_DISABLE_SWIFTPM_SANDBOX=1` and bundle ID `com.aimixmasters.companion.preview.toolsweep`. The SwiftPM sandboxed invocation had previously been denied by the managed environment; the explicit bypass was limited to this local preview build. `plutil -lint` and ad-hoc `codesign --verify --strict` passed.

## Runtime review and limits

The exact packaged path `/private/tmp/aimm-pluginhub-duplicate-build/output-v4/AIMM Companion Preview.app` was launched through CUA. Jules visually passed that exact bundle: “No scan yet,” zero AU/VST2/VST3/CLAP counts, isolated-preview disclosure, no paired credential, and disabled scan/folder/forget/pair/status/request controls. No path, inventory row or saved generation appeared in the isolated view. No control was clicked; no scan or file action occurred.

A reviewer initially selected the ordinary preview app by display name before switching to the exact isolated bundle path. The ordinary preview UI exposed saved-generation and paired-device state plus the Development API URL field. The reviewer used no controls and did not view or copy paths or inventory rows; field values and identifiers are not retained here. This was a UI selection mistake, not part of the isolated runtime review. Future app selection must use the exact isolated bundle path/bundle identifier, never the ambiguous display name.

The package contains the `aimm-companion` URL declaration and the SwiftUI source guard accepts only the exact `aimm-companion://duplicates` route. Actual OS URL dispatch remains unverified: the managed shell’s Launch Services open attempt returned `kLSNoExecutableErr`, and `NSWorkspace` could not resolve an installed handler. CUA did launch the exact isolated bundle. No handler was changed or registered, no app was installed, and no URL route was triggered. The web-to-AppKit hand-off therefore remains open.

## Status

Synthetic/non-production only. No local scan, saved journal, credentials, API, remote account or folder was accessed by the isolated package. No production deployment or separately gated external action occurred. Foundation remains **NOT MET**; Stage 6 remains gated until all exit evidence is complete and fresh independent review accepts it. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source.
