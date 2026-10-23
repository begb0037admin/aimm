# PluginHub workflow trace — Phase 1

**Status:** partial read-only trace, 2026-10-23. This describes observed reference behaviour and the requirements for an independent AIMM implementation. No PluginHub action was run and no local plug-in was changed.

## Local file management

| Reference action | Observed mechanics | AIMM requirement |
|---|---|---|
| Build move plan | `_build_move_plan` selects existing snapshot paths by vendor, friendly product name and format; each destination is the sibling `(Unused)` folder. An empty plan means no matching existing files. | Resolve current canonical identity to exact on-disk paths; preview every source, destination, format and collision before confirmation. |
| Move to Unused | `move_plugins_to_unused` combines selected plans, reports moved/errors and can request an admin retry. The reference keeps a move ledger. | Keep an operation ID and per-path result. Store original location for restore. Make any existing `(Unused)` destination conflict and cleanup visible before acting. |
| Restore | `restore_moved_plugins` reverses recorded paths. It skips a destination that already contains an active bundle rather than moving a bundle inside another bundle. Permission failures can require an admin retry. | Refuse active-path collisions; do not overwrite or nest bundles. Show partial completion and allow a safe retry of only unfinished paths. |
| Uninstall to Trash | `move_plugin_to_trash` uses macOS recycle so Finder Put Back is available; it returns `trashed`, `errors` and sometimes `requires_admin`. A permission failure can occur after earlier paths succeeded. | Preview the exact files. Use recoverable Trash, preserve per-path state and rescan after the action. Do not infer all-or-nothing success from a batch-level flag. |
| Remove unused duplicates | `trash_unused_duplicates` only targets duplicate instances marked `unused`. Its response sets `ok: true` even when `errors` or `requires_admin_paths` is nonempty. | Require explicit selection/confirmation and inspect every result array. Never report success from `ok` alone. Active copies must remain untouched. |

Source: installed PluginHub 2.0.12 `dashboard_webview.py` `_build_move_plan` (3421), `move_plugins_to_unused` (4187), `move_plugin_to_trash` (5075), `trash_unused_duplicates` (5615), `restore_moved_plugins` (5773). Function line numbers refer to this installed build and may move in later releases.

## Profile and public-list sharing

- `build_profile` exports vendor, plug-in name, format, installed version, bundle ID, manufacturer/plugin codes and install timestamp. It omits local paths, raw plist keys and architecture details. **It includes machine label, hostname, macOS version and PluginHub version**, so the reference profile is not anonymous.
- Profile share uses a separate authenticated create/fetch/revoke/list path. The client sends a licence key and device ID; the client source documents a default seven-day expiry, size and rate caps. The client alone does not prove the server enforces these claims. Revocation is supported in the client. The five comparison buckets are in sync, version diverged, only remote, only local and format mismatch.
- Public list share is a different endpoint and payload. It can exclude vendors and optionally include versions, formats and installation dates. It also includes a machine label **and hostname**. Its optional 4–6 digit passkey only gates link access; it is not a robust account permission boundary.
- AIMM must specify its own account/device authorization, retention and deletion rules. Sharing is user initiated and separate from routine Hope inventory sync. The public list should omit hostname by default; profile comparison should disclose exactly which machine fields are sent. No licence keys, local paths or vault contents belong in shared data.

Source: `profile_compare.py` `build_profile` (90), profile share/fetch/revoke/list (225–305), `build_list` (roughly 490–700), `share_list`/`revoke_list` (706–756), `diff_profiles` (758). The PluginHub Worker implementation has not been verified here, so server caps, retention and access enforcement remain open.

## Pending trace

- Confirm actual UI preview/confirmation calls for each destructive file action and whether any backend operation changes files before that UI step.
- Trace batch list persistence, installer queue receipts and cancellation across partial operations.
- Inspect the share Worker only if an installed readable source exists; otherwise treat server behaviour as unknown and define AIMM’s independent semantics in Phase 2.
