# AIMM Plugin Companion

macOS companion for AU, VST2, VST3 and CLAP bundles. It scans system and user plug-in folders at launch and on `POST /scan`. The server listens only on `127.0.0.1:41736` and accepts the existing AIMM origins.

From this folder, run `swift build -c release --disable-sandbox` and `.build/release/aimm-plugin-companion --self-test`. The self-test uses temporary fixture folders only. `swift test` is not executable under the Command Line Tools installation on this Mac; the XCTest target mirrors the self-test. `--scan-json` prints inventory JSON and scans the configured roots.

## API

- `GET /status`, `GET /inventory`, `POST /scan`: connection status and live inventory. Status reports version `0.2.0` and `actions: true`. Every inventory row has a stable 16-character SHA-256-derived `id`.
- `POST /action/reveal` with `{ "ids": [...] }`: show bundles in Finder.
- `POST /action/unuse` with `{ "ids": [...] }`: move each bundle into an `Unused` folder in its format folder. Name collisions receive ` (2)`, ` (3)`, and so on.
- `POST /action/restore` with `{ "moveIds": [...] }`: restore recorded moves if their original locations are empty.
- `POST /action/trash` with `{ "ids": [...] }`: move bundles to the macOS Trash. It never permanently deletes them.
- `GET /unused`: recorded moves whose Unused bundles still exist, with move IDs for restore.
- `GET /duplicates`: live duplicate groups only when bundles share a format and the same bundle file name (case and whitespace ignored) across different folders. Each physical bundle appears once even if it exposes several plug-in rows. The unique newest numeric dot-segment version is marked `keep`; equal, missing or nonnumeric versions set `needsReview` and mark no item to keep. `sideBySideVersions` lists clear dotted-version suffix variants from the same vendor and product family for information only; it never recommends an action. `alreadyUnused` lists existing Unused bundles.

Action requests accept JSON bodies up to 64 KB and batches of up to 500 IDs. Responses contain a result for each ID and a fresh scan with counts. Concurrent write actions return HTTP 409. The move history is written atomically to `~/Library/Application Support/AIMM/plugin-companion-moves.json`.

## Safety and permissions

Actions resolve IDs through the last scan; clients cannot supply paths. The companion verifies each bundle is within a scanned root after resolving symlinks, rejects traversal and unsupported extensions, and never handles AAX. Restore targets must come from recorded moves and remain within scanned roots.

For folders the current user cannot write, the companion requests macOS administrator rights with one system prompt for the privileged items in a batch. It does not collect or store a password. Cancelling reports `administrator approval cancelled`; other items still receive individual results. Set `AIMM_NO_ADMIN_PROMPT=1` to disable the prompt and return `needs administrator rights` for those items. `AIMM_PLUGIN_ROOTS_JSON` accepts a JSON array of root paths for fixture runs; tests can also inject roots, a move-record file and a Trash folder directly.

`build-app.sh` builds, ad-hoc signs and installs one copy at `~/Applications/AIMM Plugin Companion.app`; it refuses to replace it while port 41736 is busy.
