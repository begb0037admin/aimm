## Repeatable local checks — 2026-10-24 20:50 UTC

Run the test suite from the repository root:

```sh
sh scripts/pluginhub-nonprod-check.sh
```

Passed: Swift build and mocked sync/journal check, scanner 3/3, API/browser 27/27, and Worker/browser JavaScript syntax. Current evidence is `governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_BROWSER_CHECKPOINT_20261024.md`, blob `bb497469802cd2488f8c323841131b912acbcf08`.

## Run the local non-production Worker

From `library-api`:

```sh
npm ci
npm run db:migrate:local
npm run dev
```

These commands use Wrangler 4.152.0 and a local-only D1 database. The Worker runs on loopback at port 8787. No remote Worker is deployed.

To serve the Auth0 test page on loopback in a second terminal:

```sh
cd library-api
npm run dev:auth-test
```

Open `http://127.0.0.1:4173/dev-auth-test.html`. The harness is restricted to loopback and uses PKCE with the read-only `read:library` scope. Provider-backed sign-in still requires the owner's already-configured development tenant and a test account. Do not enter secrets in the harness or commit them.

Verified local runtime: migration history 0001–0009 with no pending migrations; `/health` 200; unauthenticated `/v1/me` 401; approved-origin preflight 204; hostile-origin preflight 403. Wrangler/package pins: `library-api/package.json` blob `7889d64171d3fc811c9c54c52082ec8316e85297`; lockfile blob `27de8bc6051022d635c25b1da74c8944f36a6034`.


## Sync-client verification — local development

The `aimm-journal-check` executable also runs a mocked URLSession check of the real sync client. It validates the generation start/chunk/finalize requests, device bearer headers, the approved development API host, and omission of filesystem paths from the inventory payload. Run `swift run aimm-journal-check` from this package. This check is local and does not prove live pairing or remote account isolation.

---

# AIMM companion development app

This package now includes an unsigned, local development menu-bar app and a command-line scanner. It is not signed or notarised and is not a release build.

The scanner accepts only roots chosen with the folder picker or passed to the CLI. It recognises AU `.component`, VST2 `.vst`, VST3 `.vst3`, and CLAP `.clap` entries; explicitly excludes AAX; reads bounded `Info.plist` metadata for bundle formats; and uses a CLAP filename only because reading embedded metadata would require parsing or loading plug-in code. It does not load, execute, or modify plug-ins. Full paths stay in the local SQLite journal and are not uploaded.

Build with `swift build`, launch the app with `swift run aimm-companion`, and run the local journal checks with `swift run aimm-journal-check`. Run scanner integration tests with `python3 -m unittest discover -s tests`; they create temporary plug-in bundles and do not inspect the Mac's installed plug-ins. The command-line scanner takes explicit roots: `swift run aimm-scan --root <directory>`.

The app does not scan automatically. It has a pairing flow, stores its device signing key and credential in Keychain, and uploads complete generations over HTTPS after pairing. The companion only accepts the approved development Worker host or localhost/127.0.0.1; arbitrary HTTPS hosts are rejected before device credentials are sent. Configure an approved non-production API URL and approve the displayed phrase in the AIMM account page. Inventory sync omits local paths and uses device-keyed opaque IDs. The web preview is feature-flagged and leaves the existing Library as fallback. Local Finder reveal requests require a separate confirmation in the companion and produce a signed, path-free receipt. Remote Auth0/browser runtime, account isolation, recovery and end-to-end action evidence remain unverified; this package is unsigned and not a release build.
