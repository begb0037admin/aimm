# PluginHub vendor and action research — Phase 1

**Status:** partial source and saved-report inventory, 2026-10-23. This document records observed capabilities for AIMM’s independent implementation. It is not an installer allowlist and does not make PluginHub a runtime dependency.

## Evidence and counting rules

- Read-only inputs: PluginHub 2.0.12 `vendor_checkers.py`, `hub_checkers.py`, `run_checks.py`, `checker_core.py`, and the saved `version_report.json` under `~/Library/Application Support/PluginHub/`. No checker, download, hub or vendor site was invoked.
- The saved report contains 159 update **rows** across 15 vendor labels; 102 rows carry a paid-upgrade flag. Its `cache_status.source` is `cache` at the 2026-10-22 report time. A source checker implementation therefore does not prove that this particular report fetched the vendor live.
- All 159 update rows have `download_url`; only 13 have both `installer_url` and `installer_size`. The 13 rows are FabFilter 1, SSL 6, Sonnox 6. `download_url` may be a product or vendor page. The direct installer link must pass URL, extension, redirect, version, platform and demo checks before AIMM offers a download.
- The source defines 42 hub IDs with 55 vendor associations in `hub_checkers.py` `KNOWN_HUBS`. A hub definition is not proof that the hub is installed, signed in, owns the product, or can perform an unattended update. The reference discovers candidate `.app` paths and opens the resolved path when requested.
- Static source inspection found 45 generic batch checker configurations and 70 functions that call `_installer_fields`. These are source-shape counts, not verified vendor coverage or currently available downloads. The registry is also extended by direct assignments and audit tables; complete effective-key enumeration is still pending.

## Vendors appearing in the saved update report

| Vendor | Reference checker route in source | Direct installer rows in saved report | Defined vendor hub | AIMM action shown until a result is verified |
|---|---|---:|---|---|
| Arturia | Local Arturia hub reader | 0 | Arturia Software Center | Open vendor hub or vendor page |
| EVAbeat | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| FabFilter | Dedicated vendor checker | 1 | — | Candidate direct installer; verify the current link before offering it |
| iZotope | Local/service-centre and vendor source reader | 0 | Native Access; iZotope Product Portal | Open appropriate vendor hub; paid upgrade is separate from a free update |
| Liquidsonics | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| MeldaProduction | Dedicated vendor checker | 0 | MPluginManager | Open vendor hub or vendor page |
| Plugin Boutique | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| Softube | Dedicated vendor checker | 0 | Softube Central | Open vendor hub or vendor page |
| Sonarworks | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| Sonible | Dedicated per-product checker | 0 | — | Vendor page / manual install |
| Sonnox | Dedicated vendor checker | 6 | — | Candidate direct installers; verify current links before offering them |
| Soundtoys | Dedicated vendor checker | 0 | — | Vendor page / manual install |
| SSL | Dedicated vendor checker; later registration overrides its earlier implementation | 6 | SSL Download Manager | Candidate direct installers for six rows; hub/vendor page for the remaining row |
| ujam | Local ujam app catalogue reader | 0 | UJAM | Open vendor hub or vendor page |
| Waves | Local Waves catalogue/shell reader | 0 | Waves Central | Open Waves Central; distinguish paid major upgrades |

This table is **limited to update rows on this Mac at one saved-report time**. It does not mean that other vendors lack checkers or that a link available then will remain valid. The source supports many more vendors, including manual-check stubs. A fresh AIMM scan and vendor response must decide the current action per product.

## Action decision required in AIMM

1. **Observed update:** preserve installed version by format, vendor-reported latest version, source timestamp, checker status, paid-upgrade flag and any error. User marks and snoozes stay separate from that observation.
2. **Verified direct installer:** offer download only for a current HTTPS installer file whose product, version and Mac platform can be verified. Show download progress and allow open/reveal/cancel/cleanup. After a vendor installer runs, rescan and compare the installed version before saying “installed.”
3. **Vendor hub:** detect the actual installed app path and offer “Open [hub].” If absent, offer a verified vendor download page. Opening the hub is a handoff, not proof of installation.
4. **Vendor page/manual:** show the vendor’s page and why AIMM cannot automate that row. A check error, login gate or paid upgrade must not be represented as a directly installable update.
5. **No reliable version:** retain the product in Manual Check or Unchecked and preserve the reason. Never synthesize a latest version from a generic site or unrelated file.

## Source pointers and open items

- `vendor_checkers.py` `ALL_CHECKERS` starts near line 6290 and is extended throughout the module; `_installer_fields` and its URL guards are near line 163 onward. `check_ssl` is defined twice; the later definition is assigned to the registry near line 24384. This is why a simple function count is not an effective registry count.
- `hub_checkers.py` `KNOWN_HUBS` starts near line 3158 and `get_installed_hubs` near line 3735. The Arturia, Waves, iZotope and ujam readers are in the same module.
- `run_checks.py` `run_all_checkers` near line 3222 handles local TTL/error behavior; `run_checks_main` near line 6128 delegates to `cached_checks.run_all_or_cache`. The readable installed bundle did not expose `cached_checks.py` as a separate file, so the precise central-cache transport/fallback remains unverified. The saved report states `source=cache`.
- Next: enumerate the effective checker registry with overrides and dynamically registered audit tables; classify actual result type per vendor; identify which direct installer URLs are still available; trace hub mapping and website fallback for all reference vendors. Do not treat static `_installer_fields` calls as successful downloads.
