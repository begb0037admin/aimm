# BRIEF — AIMM Plugin Companion, step 1: the Mac app only (repo /Users/admin/github/aimm, branch `plugin-companion`, already created)
Approved by Kevin 2026-11-19. Plan: /Users/admin/aimm-previews/PLAN-plugin-companion-slice1.md (read it). This brief is STEP 1 ONLY: the companion app + tests. Do NOT touch standalone/assets/index.html or any page/Worker file.

## Name and look (Kevin decided)
- App name: **AIMM Plugin Companion**. Bundle id `com.aimixmasters.plugin-companion`. Executable `aimm-plugin-companion`. Installed copy: `~/Applications/AIMM Plugin Companion.app`.
- Icon files already in `plugin-companion/assets/` (AppIcon.icns, AppIcon-1024.png). Use them; do not redraw.
- Folder: `/Users/admin/github/aimm/plugin-companion/` with Package.swift, Sources/AIMMPluginCompanion/, Tests/, build-app.sh, README.md.

## Copy the audio companion's pattern (/Users/admin/github/aimm/audio-reference-companion)
Same structure: SwiftUI App.swift with one Window scene, CompanionInstanceLock (lock file `~/Library/Application Support/AIMM/plugin-companion.lock`, second launch exits), LocalBridge loopback HTTP on **127.0.0.1:41736** (NOT 41735), same allowed-origins list (aimixmasters.com, www, and whatever the audio bridge allows), same CORS / Private-Network-Access headers, build-app.sh modelled on the audio one (ad-hoc codesign, installs the single copy, refuses to replace if the port is busy, no screen/audio permission strings). Window shows: app name, "Listening on 127.0.0.1:41736", last scan time, counts per format. No other UI.

## Scanner (read-only)
- Roots: `/Library/Audio/Plug-Ins/{Components,VST,VST3,CLAP}` and `~/Library/Audio/Plug-Ins/{Components,VST,VST3,CLAP}` (skip a root that does not exist).
- Formats by extension: .component=AU, .vst=VST2, .vst3=VST3, .clap=CLAP. Skip .aaxplugin, hidden entries, any name ending " (Unused)", any folder named Unused. Do not follow symlinks out of the roots. Depth cap 32, entry cap 50000 per root, skip Info.plist over 2 MB; count `unreadable`/`truncated`.
- For each bundle read Contents/Info.plist (use PropertyListSerialization; handles XML and binary). Build rows exactly like the page's `invReadBundle` in /Users/admin/github/aimm/standalone/assets/index.html (~lines 7553-7616) and `invVendorHint`, `invFormatFromName`: same name / vendor / version / bundleId / category / bundleName rules, including multi-plug-in AU (one row per AudioComponents entry, vendor from "Vendor: Name"), vendor fallback order, "Unknown publisher". Row fields: name, vendor, format, version, bundleId, rootId, category, bundleName, path (display path of the bundle). READ that page code and port it faithfully; list any rule you could not port.
- rootId: stable string per root, e.g. `system-components`, `user-vst3`.

## Endpoints (JSON, read-only)
- GET /status -> {app:"AIMM Plugin Companion", version, scanning:bool, lastScanAt}
- GET /inventory -> {generation, scannedAt, roots:[{id,path,exists,count}], counts:{AU,VST2,VST3,CLAP,products,bundles,unreadable}, truncated:bool, rows:[...]}
- POST /scan -> runs a fresh scan, returns same as /inventory.
- Scan runs once at launch and on POST /scan, off the main thread. Origin check as in the audio bridge; reject others with 403. No writes except the lock file. No network calls. No PluginHub anywhere.
- CLI: `aimm-plugin-companion --scan-json` prints the inventory JSON to stdout and exits (no server, no window) — for verification.

## Tests (swift test)
Fixture temp folder with fake bundles: AU (single), AU (multi-component), VST3, VST2, CLAP, an .aaxplugin that must be skipped, an "(Unused)" bundle, a hidden bundle, a bundle with broken plist, a binary plist, a symlink pointing outside the root. Assert rows, counts, skips, unreadable count, origin rejection (unit-test the origin check function), JSON shape.

## Finish
Run `swift build -c release --disable-sandbox` and `swift test`; run `--scan-json` on this Mac and report counts per format (this Mac has ~540 Components, 65 VST, 304 VST3, 2 CLAP bundles in /Library/Audio/Plug-Ins; explain differences — products vs bundles). Add a STATUS.md entry. Commit on the branch. Do NOT run build-app.sh install, do NOT push, do NOT deploy, do NOT change any file outside plugin-companion/ and docs/STATUS.md.
