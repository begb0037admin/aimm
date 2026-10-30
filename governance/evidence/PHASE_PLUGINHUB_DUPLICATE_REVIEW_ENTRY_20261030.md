# PluginHub Duplicate Review hand-off — 2026-10-30

## Change

A Library sidebar Tools entry now offers a route to the Companion’s read-only Duplicate Review. The fixed URL is `aimm-companion://duplicates`; it contains no product names, paths, inventory rows, or account data. The Companion accepts only that exact route and presents duplicate groups from its last locally saved scan. Opening it does not scan, upload, move, delete, or alter files. The saved local paths are displayed only in the Companion.

The development-only synthetic preview removes the URL from this entry, marks it disabled, and displays a visible explanation that no local inventory is connected. This keeps the synthetic preview isolated from the user’s saved scan.

## Source and review

| File | Blob |
|---|---|
| `index.html` | `5cc44ace7943d6ecb050bc301c16cf339e0995d0` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `4ff206ecc6c06e041d19e269ca381612619d9e83` |
| `scripts/package-pluginhub-nonprod-app.sh` | `bb97dfd2578f5768760603961fa15b5ea147cbcd` |
| `companion/README.md` | `71b007dc4db717e80974c94e5fe61de277eaaa69` |

UI/route commit: `f2b4ca938ece84e7080bdbf8627ad2d2da757dcb`. Follow-up status-text interpolation fix: `7b117fa3b98df4dfbd06d2fbc73a4bf28c38dfd8`.

Jules passed source review of the exact route allowlist, local-only data boundary, synthetic-preview guard, and scoped disabled styling. Jules visually passed the deployed development [synthetic preview](https://15c23fd2.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic), Pages deployment `15c23fd2-9ee5-4ea6-a84f-25d95ed676af`. At desktop and 390px, the Tools entry is visible and muted; in the synthetic runtime it has no `href`, `aria-disabled=true`, reduced opacity, muted text, and no pointer action. The visible sample notice explains that Duplicate Review is unavailable because no local inventory is connected. Cards remain four columns; All Plugins retains 12 synthetic products and neutral Unchecked cells.

## Updated runtime follow-up — 2026-10-30

The earlier state above recorded the compile-only checkpoint. Since then, the source was updated with an isolated-preview flag and reviewed packaging script. The current branch builds and packages an ad-hoc signed non-production Companion app. CUA launched the exact package and Jules visually passed the isolated empty state, with zero format counts, a visible isolation disclosure, and scan/folder/pairing/status/request controls disabled. The package does not load normal UserDefaults, Keychain credentials, Application Support journal or folder bookmarks. See [isolated package/runtime evidence](PHASE_PLUGINHUB_COMPANION_ISOLATED_PACKAGE_20261030.md), blob `81e1db871c7b3979a0afb17c1201c8d1397b9599`.

Actual web-to-AppKit URL dispatch remains unverified. The managed shell's Launch Services attempt failed with `kLSNoExecutableErr`; its `NSWorkspace` lookup found no handler. The app was not installed and no URL handler/default was registered or changed. No route was opened and no scan or file action occurred. The package is built and the isolated app launches in CUA; dispatch must be verified through a supported Launch Services path without changing the user's default handler.

During the visual review, a reviewer first selected the ordinary preview app by display name and saw saved-generation and paired-device state plus the Development API URL field. They used no controls and did not view or copy paths or inventory rows; field values and identifiers are not retained. Review then switched to the exact isolated package path. Future app selection must use the exact isolated bundle path/identifier, never its ambiguous display name.

No plug-in folders were scanned or uploaded. No local file operation, automated test, Worker/production deployment, share or other external action occurred. Foundation remains **NOT MET**; Stage 6 remains gated pending fresh exit evidence and independent acceptance. The development Worker passkey RP fix remains a surgical patch, not a reproducible build from branch source. Synthetic non-production data only.