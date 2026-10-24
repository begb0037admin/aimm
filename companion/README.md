## Repeatable local check — 2026-10-24 20:39 UTC

Run the complete non-deploying verification from the repository root with:

```sh
sh scripts/pluginhub-nonprod-check.sh
```

Passed: companion build and mocked sync/journal checker; scanner 3/3; API/browser 25/25; Worker and browser-module JavaScript syntax. The browser module URL is corrected, and ordinary sign-in asks only for `read:library`; `manage:devices` is requested only for valid pairing approval. Script commit `fd4c0519174848abcc5867c72ed8ea6fdc03f9ad`, blob `52c7210b0096cad63c29c04e6f4daa3d36901204`. Browser evidence `governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_BROWSER_CHECKPOINT_20261024.md`, blob `a39099c15b7bdd891e7154c37db46ccb83a98ec1`.

These are local/mock checks. They do not prove live Auth0, paired-Mac runtime, remote account isolation or recovery. Foundation remains NOT MET; Stage 6 is gated. No deployment or cutover.


## Current development verification — 2026-10-24 20:25 UTC

The local suite passes: `swift build`, `swift run aimm-journal-check`, scanner integration 3/3, and Library API tests 18/18. The checker uses a mocked URLSessionConfiguration; the client always installs its own redirect delegate. The isolated development D1 has migrations 0001–0009 applied. This is not a live Worker or paired-Mac test; no deployment occurred.

---

## Sync-client verification — local development

The `aimm-journal-check` executable also runs a mocked URLSession check of the real sync client. It validates the generation start/chunk/finalize requests, device bearer headers, the approved development API host, and omission of filesystem paths from the inventory payload. Run `swift run aimm-journal-check` from this package. This check is local and does not prove live pairing or remote account isolation.

---

# AIMM companion development app

This package now includes an unsigned, local development menu-bar app and a command-line scanner. It is not signed or notarised and is not a release build.

The scanner accepts only roots chosen with the folder picker or passed to the CLI. It recognises AU `.component`, VST2 `.vst`, VST3 `.vst3`, and CLAP `.clap` entries; explicitly excludes AAX; reads bounded `Info.plist` metadata for bundle formats; and uses a CLAP filename only because reading embedded metadata would require parsing or loading plug-in code. It does not load, execute, or modify plug-ins. Full paths stay in the local SQLite journal and are not uploaded.

Build with `swift build`, launch the app with `swift run aimm-companion`, and run the local journal checks with `swift run aimm-journal-check`. Run scanner integration tests with `python3 -m unittest discover -s tests`; they create temporary plug-in bundles and do not inspect the Mac's installed plug-ins. The command-line scanner takes explicit roots: `swift run aimm-scan --root <directory>`.

The app does not scan automatically. It has a pairing flow, stores its device signing key and credential in Keychain, and uploads complete generations over HTTPS after pairing. The companion only accepts the approved development Worker host or localhost/127.0.0.1; arbitrary HTTPS hosts are rejected before device credentials are sent. Configure an approved non-production API URL and approve the displayed phrase in the AIMM account page. Inventory sync omits local paths and uses device-keyed opaque IDs. The web preview is feature-flagged and leaves the existing Library as fallback. Local Finder reveal requests require a separate confirmation in the companion and produce a signed, path-free receipt. Remote Auth0/browser runtime, account isolation, recovery and end-to-end action evidence remain unverified; this package is unsigned and not a release build.
