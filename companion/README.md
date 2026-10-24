# AIMM companion development app

This package now includes an unsigned, local development menu-bar app and a command-line scanner. It is not signed or notarised and is not a release build.

The scanner accepts only roots chosen with the folder picker or passed to the CLI. It recognises AU `.component`, VST2 `.vst`, VST3 `.vst3`, and CLAP `.clap` entries; explicitly excludes AAX; reads bounded `Info.plist` metadata for bundle formats; and uses a CLAP filename only because reading embedded metadata would require parsing or loading plug-in code. It does not load, execute, or modify plug-ins. Full paths stay in the local SQLite journal and are not uploaded.

Build with `swift build`, launch the app with `swift run aimm-companion`, and run the local journal checks with `swift run aimm-journal-check`. Run scanner integration tests with `python3 -m unittest discover -s tests`; they create temporary plug-in bundles and do not inspect the Mac's installed plug-ins. The command-line scanner takes explicit roots: `swift run aimm-scan --root <directory>`.

The app does not scan automatically and currently works offline. Pairing UI, Keychain-backed device credentials, authenticated sync, inventory reconciliation, site/Hope integration, update checks and local actions remain to be implemented and reviewed. The API's inventory generation routes are currently exercised with a synthetic D1 test double; no remote database migration or deployment was performed.
