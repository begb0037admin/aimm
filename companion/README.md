# AIMM companion development app

This package now includes an unsigned, local development menu-bar app and a command-line scanner. It is not signed or notarised and is not a release build.

The scanner accepts only roots chosen with the folder picker or passed to the CLI. It recognises AU `.component`, VST2 `.vst`, VST3 `.vst3`, and CLAP `.clap` entries; explicitly excludes AAX; reads bounded `Info.plist` metadata for bundle formats; and uses a CLAP filename only because reading embedded metadata would require parsing or loading plug-in code. It does not load, execute, or modify plug-ins. Full paths stay in the local SQLite journal and are not uploaded.

Build with `swift build`, launch the app with `swift run aimm-companion`, and run the local journal checks with `swift run aimm-journal-check`. Run scanner integration tests with `python3 -m unittest discover -s tests`; they create temporary plug-in bundles and do not inspect the Mac's installed plug-ins. The command-line scanner takes explicit roots: `swift run aimm-scan --root <directory>`.

The app does not scan automatically. It now has a pairing flow, stores its device signing key and credential in Keychain, and uploads complete generations over HTTPS after pairing. Configure a non-production API URL and approve the displayed phrase in the AIMM account page. Inventory sync omits local paths and uses device-keyed opaque IDs. The web preview is feature-flagged and leaves the existing Library as fallback. Remote runtime, deployment, migration, update checks and local actions remain unverified or unimplemented.
