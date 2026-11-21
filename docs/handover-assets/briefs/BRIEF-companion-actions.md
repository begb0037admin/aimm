# BRIEF — Plugin companion slice 2, step 2: write actions + duplicates (repo /Users/admin/github/aimm, new branch `plugin-companion-actions` from main)
Plan: /Users/admin/aimm-previews/PLAN-plugin-companion-slice2.md (approved by Kevin, with: Move to Unused is the default; Trash secondary; macOS admin password prompt for system folders; "Keep newest" moves older copies to Unused, not Trash). Page screens were approved as previews; the PAGE IS NOT PART OF THIS STEP. Only plugin-companion/ (Swift) + docs/STATUS.md + its README.
Existing code to extend: plugin-companion/Sources/AIMMPluginCompanion/{LocalBridge,Scanner,App,main}.swift (loopback 127.0.0.1:41736, allowed origins aimixmasters.com + www, endpoints GET /status, GET /inventory, POST /scan, CLI --scan-json).

## 1. Row ids
Add a stable `id` to every row in /inventory (e.g. SHA-256 of bundle path + plug-in name + format, hex, first 16). The companion keeps the last scan's id->row map. All actions take ids, never paths.

## 2. Endpoints (POST, JSON body max 64 KB, batch max 500 ids, same Origin check as today; GET for the two read ones)
- POST /action/reveal  {ids}: NSWorkspace activateFileViewerSelecting on the bundle paths. No file change.
- POST /action/unuse   {ids}: move each BUNDLE (dedupe rows that share a path) into `<format folder>/Unused/` e.g. /Library/Audio/Plug-Ins/VST3/Unused/Name.vst3. Create Unused if missing. Name collision -> "Name (2).vst3". Record each move in ~/Library/Application Support/AIMM/plugin-companion-moves.json (id of move, original path, unused path, rowIds, movedAt ISO). Write that file atomically.
- POST /action/restore {moveIds}: move back to the recorded original path; refuse if the original path now exists (report "original location is occupied").
- POST /action/trash   {ids}: move bundle to the macOS Trash (FileManager.trashItem). Never permanent delete.
- GET  /unused: records from the moves file whose unused path still exists (name, vendor if known, format, version if readable, original path, movedAt, moveId).
- GET  /duplicates: from the live rows (Unused already excluded by the scanner) group by lowercased vendor + name + format where there is more than one DISTINCT bundle path. Per group list path, rootId, version, and `keep: true` for the newest version (compare numeric dot segments; tie -> prefer system root over user root; if versions are missing mark `keep:false` for all and `needsReview:true`). Also include `alreadyUnused` entries by reading the Unused folders (plug-in name + path) for information.
- Every action returns per-id results [{id, ok, reason?}] and a final rescan so the response includes fresh counts. A failure never aborts the rest of the batch.

## 3. Safety (hard requirements, each needs a test)
1. Resolve each id to a path via the last-scan map only. Unknown id -> error.
2. Before any action: standardise and resolve symlinks; the real path must be inside one of the scanned roots (/Library/Audio/Plug-Ins/{Components,VST,VST3,CLAP} and ~/Library/Audio/Plug-Ins/{...}), must NOT equal a root, must end in .component/.vst/.vst3/.clap, no ".." components, and the bundle itself must not be a symlink that points outside the roots. Never AAX.
3. Restore may only target an original path that was recorded earlier and is itself inside the roots.
4. Serialise actions with a lock (one write action at a time); return 409 if busy.
5. Roots must be injectable for tests (env var AIMM_PLUGIN_ROOTS_JSON or an init parameter) and the admin-prompt path must be switchable off for tests (env AIMM_NO_ADMIN_PROMPT=1 -> report "needs administrator rights" instead).

## 4. Administrator rights for system folders
/Library/Audio/Plug-Ins/Components and /VST are root-owned and not writable by Kevin's user; VST3 is world-writable; CLAP is group-wheel; user folders are Kevin's. For a move/trash where the parent folder is not writable by the current user, batch those items and run ONE privileged command through NSAppleScript `do shell script "<cmd>" with administrator privileges` with a clear `with prompt`, e.g. "AIMM Plugin Companion wants to move N plug-ins". The command must be built only from already-validated absolute paths, each single-quote-escaped; use `/bin/mkdir -p` and `/bin/mv` (for privileged trash: mv into the user's ~/.Trash with a unique name). Never accept a password in the app, never read or store it, never log it. If the user cancels the prompt, nothing is moved and the result says "administrator approval cancelled". Items that don't need admin are processed without any prompt.

## 5. Tests
- Add a `--self-test` CLI mode that runs the logic against temp directories (fixture roots) and prints PASS/FAIL per check, exit code non-zero on failure, because `swift test` does not execute under Command Line Tools on this Mac. Also add XCTest cases mirroring it.
- Cover: unuse/restore round trip; collision naming; trash to a temp "Trash" (inject trash dir for tests); rejection of ".." paths, symlink escape, wrong extension, a root folder, an unknown id; restore refusing an occupied original; moves file persisted and re-read; /duplicates grouping across two roots, newest-keep rule, missing versions -> needsReview; batch limit; busy lock -> 409; a non-writable-parent item reports needs admin when prompts are disabled.
- NEVER run the self-test or anything else against the real /Library or ~/Library plugin folders. Temp dirs only.

## 6. Finish
`swift build -c release --disable-sandbox` must pass; run `.build/release/aimm-plugin-companion --self-test` and report the output. Update plugin-companion/README.md (endpoints, safety rules, admin prompt) and add an undeployed docs/STATUS.md entry. Do not touch standalone/ or tests/*.mjs. Commit on branch plugin-companion-actions with trailer "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>". Do not push, install or launch the app.
