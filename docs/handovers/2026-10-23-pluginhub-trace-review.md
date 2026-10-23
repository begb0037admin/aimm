# Read-only Claude CLI review — PluginHub Phase 1 trace

**Date:** 2026-10-23

**Reviewer:** Claude CLI 2.1.306, safe mode, read-only file tools, plan permission mode

**Scope:** `docs/PLUGINHUB_VENDOR_ACTION_MATRIX.md`, `docs/PLUGINHUB_WORKFLOW_TRACE.md`, relevant claims in `docs/PLUGINHUB_REPLICA.md`, and installed PluginHub 2.0.12 Python source. Kevin explicitly approved sending these materials to Claude. No PluginHub operation or document edit was delegated to Claude.

## Verdict and corrections

Claude rated the vendor matrix **PARTIAL**, the workflow trace **PARTIAL with material omissions**, and one statement in the central specification **FAIL**. Its findings were checked locally before the corrections below.

| Finding | Installed source evidence | Correction made |
|---|---|---|
| Basic installer URL guard does not itself verify version; deny patterns run on the whole URL. | `vendor_checkers.py` `_is_installer_url` around 175 and `_resolve_redirect_installer` around 245 | Matrix now separates reference URL guards from AIMM's independent product/version/platform verification. |
| Hub-backed Arturia, iZotope, Waves and ujam routes are conditional on `HUB_CHECKERS_AVAILABLE`; Softube is registered as `check_softube_live`. | `vendor_checkers.py` around 6320–6360 | Vendor routes corrected; import failure remains an explicit limitation. |
| `cached_checks.py` is absent from the readable bundle although several modules import it. | `run_checks.py` around 6179; `dashboard_webview.py` around 1306; `installer_payload.py` around 747; `contribute.py` around 687 | Matrix identifies central-cache transport/config/fallback as unverified. |
| Move-to-Unused can permanently delete the active source after a size-only destination check; cross-volume moves copy then delete; stale destination cleanup can use Trash. | `dashboard_webview.py` `_dest_is_complete_copy` around 2844, `_move_tree_user` around 2868, `move_plugins_to_unused` around 4227 | Workflow trace and central specification now record these risks. AIMM must preview conflicts and verify copies more strongly. |
| Offload settings can redirect an `(Unused)` destination; restore reports active-path collisions and can remove an empty husk. | `dashboard_webview.py` `_resolve_unused_dir` around 2673, `restore_moved_plugins` around 5816–5833 | Workflow trace corrected. |
| Uninstall recycle is asynchronous with a short poll; duplicate cleanup recomputes targets and an admin branch can stage into Trash then remove originals with `rm -rf`. | `dashboard_webview.py` around 5075–5124, 5615–5654, 5715–5726 | Workflow trace now requires path revalidation, per-file receipts, staged-copy verification and completion checks. |
| Profile `install_mtime` is a scanner display date derived from filesystem time signals; sharing can reuse a snapshot cached for 300 seconds; create calls place credentials in the JSON body. | `plugin_scanner.py` around 1292–1348; `dashboard_webview.py` `_get_compare_snapshot_cached` around 7585 and `profile_compare_share` around 11681; `profile_compare.py` around 90–152 and 225–240 | Removed the incorrect “always rescans” claim; the follow-up review refined the date description to include `st_ctime`. AIMM's own design must keep secrets out of shares and logs. |
| Public-list exclusions are not the whole export: `plugins_excluded` utility bundles can be merged. The 4–6-digit passkey appears in a docstring but is not validated by the client. | `dashboard_webview.py` around 12293–12305; `profile_compare.py` around 706–728 | Workflow trace now marks server validation and access enforcement unknown. |
| Opt-in aggregate contribution was missing from the source map. | `contribute.py` around 49–61 and 316–356 | Added to source map and workflow trace; remote retention/anonymity remain unverified. |

The saved report counts were **not** checked by Claude. A separate read-only local aggregation of `version_report.json` confirmed 159 update rows across 15 vendors, 102 `is_paid_upgrade` rows, 13 rows with installer URL and size, 159 rows with `download_url`, 100 up-to-date rows, 19 errors, one unchecked and `cache_status.source=cache`. Static AST inspection confirmed 42 `KNOWN_HUBS` IDs with 55 literal vendor associations and 45 batch configurations. No current vendor URL was probed.

## Review limits

- This is an editorial source review, **not** the formal Phase 1 governance challenge. The complete feature parity matrix and evidence package are not finished.
- Claude did not verify the remote share Worker, central cache, contribution endpoint, current installer links, runtime file-operation timing or user-facing confirmation screens.
- The first sandboxed CLI call failed with `ENOTFOUND`. After Kevin's explicit approval, the unrestricted read-only call completed. No app code, user plug-ins or Logic projects were changed.

## Focused follow-up review

Claude ran a second read-only pass over the corrected documents. It passed the documented five-minute profile cache, credential transport, hostname fields, conditional hub registration, restore collision handling and partial Trash results. It still marked several points PARTIAL and one date description FAIL. Local source inspection confirmed the follow-up findings, and the documents were refined again:

- The scanner's display date uses the maximum `st_mtime`/`st_ctime` across selected bundle paths, not plain modification time (`plugin_scanner.py` 1292–1326).
- The admin move-to-Unused path can also use `rm -rf` after a size-only copy check (`dashboard_webview.py` around 4364–4405); unreachable configured offload storage blocks moves (2585–2594).
- Staged Trash copies are checked by size for directories and not verified after copying individual files (2975–2993).
- `_installer_fields` does not itself check Mac platform or version, and `run_all_checkers` has no readable-source caller because the entrypoint imports missing `cached_checks` (`vendor_checkers.py` 305–323; `run_checks.py` 6179–6190).
- Optional contribution also has automatic snapshot and report telemetry paths. The opt-in report can include plug-in names and versions, DAW preference and a persistent pseudonymous ID (`contribute.py` 460–473, 503–600, 715 onward; `app.py` 4704–4707).
- The reference's passkey comments disagree on length (`profile_compare.py` 318 and 714).

These final refinements were independently source-checked locally. Claude has **not** issued a third verdict on the resulting text; do not label the whole Phase 1 trace PASS. The formal evidence package and challenge remain pending.
