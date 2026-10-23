# PluginHub vendor and action research — Phase 1

**Status:** partial source and saved-report inventory, 2026-10-23. This document records observed capabilities for AIMM’s independent implementation. It is not an installer allowlist and does not make PluginHub a runtime dependency.

## Evidence and counting rules

- Read-only inputs: PluginHub 2.0.12 `vendor_checkers.py`, `hub_checkers.py`, `run_checks.py`, `checker_core.py`, and the saved `version_report.json` under `~/Library/Application Support/PluginHub/`. No checker, download, hub or vendor site was invoked.
- The saved report contains 159 update **rows** across 15 vendor labels; 102 rows carry a paid-upgrade flag. Its `cache_status.source` is `cache` at the 2026-10-22 report time. A source checker implementation therefore does not prove that this particular report fetched the vendor live.
- All 159 `updates_available` rows have `download_url`; only 13 of those rows have both `installer_url` and `installer_size`. The 13 update rows are FabFilter 1, SSL 6, Sonnox 6. Further installer metadata can occur in `up_to_date` and `errors`; 13 is not a whole-report total. `download_url` may be a product or vendor page. The reference's basic URL guard checks HTTPS, a file extension and deny patterns against the entire URL. `_installer_fields` rejects apparent demos but does **not** verify version or Mac platform; its Mac slot can accept `.exe`/`.msi` through the shared extension guard. Redirect resolution and some vendor-specific callers add checks, but they are not universal. AIMM must independently verify product, version, Mac platform, current destination and trial/demo status before offering a direct download.
- The source defines 42 hub IDs with 55 vendor associations in `hub_checkers.py` `KNOWN_HUBS`. A hub definition is not proof that the hub is installed, signed in, owns the product, or can perform an unattended update. The reference discovers candidate `.app` paths and opens the resolved path when requested.
- Static source inspection found 45 generic batch checker configurations. Many functions call `_installer_fields`; a count of call sites is not verified vendor coverage or currently available downloads. The registry is also extended by direct assignments and audit tables, so its runtime-effective keys cannot be inferred from the initial dictionary alone.

The corrected AST audit in `research/pluginhub_registry_audit.py` resolves **962 static candidate registry keys** and 1,221 registration statements from the installed `vendor_checkers.py` with SHA-256 `8605f7317ff3120b1d32d776b691b428e4254daa939d99d05bda55f59e143afe`. It selects the checker-key field in batch tuples, treats `key not in ALL_CHECKERS` as a fallback, and does not mistake the augmentation wrapper for a new checker. There are no unresolved loop sites within its supported literal-table forms. The last static expression for 629 keys is `_tier2_no_data`, 25 is `_make_moonbase_checker`, and 21 is `_make_audioloom_checker`; the batch functions are later overridden. Some expressions are loop variables, not resolved callable identities. These are **source expressions**, not live support claims: other conditions, imports and the absent `cached_checks.py` leave the production execution path unverified. The script prints the key/expression/line inventory on demand without importing PluginHub; the full vendor catalogue is not copied into AIMM.

An offline structural check of the 13 saved direct-installer candidates found **13 distinct HTTPS URLs**, all with `.dmg`, `.pkg` or `.zip` paths and positive `installer_size`. The saved latest-version string appears in the path for SSL 6/6 and Sonnox 6/6, but not FabFilter 0/1. This is metadata validation only. It did not contact vendor sites, verify the file content, prove the URL still works, or establish a legal/owned entitlement.

## Vendors appearing in the saved update report

| Vendor | Reference checker route in source | Direct installer rows in saved report | Defined vendor hub | AIMM action shown until a result is verified |
|---|---|---:|---|---|
| Arturia | Local Arturia hub reader, conditional on hub-checker import | 0 | Arturia Software Center | Open vendor hub or vendor page |
| EVAbeat | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| FabFilter | Dedicated vendor checker | 1 | — | Candidate direct installer; verify the current link before offering it |
| iZotope | Local/service-centre and vendor source reader; hub route is conditional on import | 0 | Native Access; iZotope Product Portal | Open appropriate vendor hub; paid upgrade is separate from a free update |
| Liquidsonics | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| MeldaProduction | Dedicated vendor checker | 0 | MPluginManager | Open vendor hub or vendor page |
| Plugin Boutique | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| Softube | `check_softube_live` vendor checker | 0 | Softube Central | Open vendor hub or vendor page |
| Sonarworks | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| Sonible | Dedicated per-product checker | 0 | — | Vendor page / manual install |
| Sonnox | Dedicated vendor checker | 6 | — | Candidate direct installers; verify current links before offering them |
| Soundtoys | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| SSL | Dedicated vendor checker; later registration overrides its earlier implementation | 6 | SSL Download Manager | Candidate direct installers for six rows; hub/vendor page for the remaining row |
| ujam | Local ujam app catalogue reader, conditional on hub-checker import | 0 | UJAM | Open vendor hub or vendor page |
| Waves | Local Waves catalogue/shell reader, conditional on hub-checker import | 0 | Waves Central | Open Waves Central; distinguish paid major upgrades |

This table is **limited to update rows on this Mac at one saved-report time**. It does not mean that other vendors lack checkers or that a link available then will remain valid. The source supports many more vendors, including manual-check stubs. A fresh AIMM scan and vendor response must decide the current action per product.

## Action decision required in AIMM

1. **Observed update:** preserve installed version by format, vendor-reported latest version, source timestamp, checker status, paid-upgrade flag and any error. User marks and snoozes stay separate from that observation.
2. **Verified direct installer:** offer download only for a current HTTPS installer file whose product, version and Mac platform can be verified. Show download progress and allow open/reveal/cancel/cleanup. After a vendor installer runs, rescan and compare the installed version before saying “installed.”
3. **Vendor hub:** detect the actual installed app path and offer “Open [hub].” If absent, offer a verified vendor download page. Opening the hub is a handoff, not proof of installation.
4. **Vendor page/manual:** show the vendor’s page and why AIMM cannot automate that row. A check error, login gate or paid upgrade must not be represented as a directly installable update.
5. **No reliable version:** retain the product in Manual Check or Unchecked and preserve the reason. Never synthesize a latest version from a generic site or unrelated file.

## Source pointers and open items

- `vendor_checkers.py` `ALL_CHECKERS` starts near line 6290 and is extended throughout the module; URL guards start near line 156 and `_installer_fields` is near line 305. `check_ssl` is defined twice; the later definition is assigned to the registry near line 24384. Hub-backed reader registration depends on `HUB_CHECKERS_AVAILABLE` near line 6336. This is why a simple function count is not an effective registry count.
- `hub_checkers.py` `KNOWN_HUBS` starts near line 3158 and `get_installed_hubs` near line 3735. The Arturia, Waves, iZotope and ujam readers are in the same module.
- `run_checks.py` defines `run_all_checkers` near line 3222 with local TTL/error behavior, but no caller was found in the readable installed source. `run_checks_main` near line 6128 delegates to `cached_checks.run_all_or_cache`; its `offline` route requests at least a 24-hour TTL and no forced refresh. The readable installed bundle did not expose `cached_checks.py` as a separate file, although `run_checks.py`, `dashboard_webview.py`, `installer_payload.py` and `contribute.py` import it. The precise central-cache transport, config, actual use of `run_all_checkers` and fallback remain unverified. The saved report states `source=cache`.
- Next: independently review the AST inventory and classify the remaining named checker functions by public source, local hub, partner manifest or manual failure; identify which direct installer URLs are still available; trace hub mapping and website fallback for all reference vendors. Do not treat a static registration or `_installer_fields` call as a successful live check or download.
