# Plug-in count reconciliation — Phase 1

Counts below describe different units and captures. None is a fixed target for AIMM. No plug-in scan or Logic project action was run for this analysis.

| Observation | Unit and capture | What can be concluded |
|---|---|---|
| PluginHub local snapshot: **1,880** | Format-bundle rows generated 2026-10-22 14:39 UTC; AU 538, VST2 563, VST3 538, AAX 239, CLAP 2 | A single product can have several rows. Excluding AAX leaves **1,641 format rows**, not 1,641 products. |
| PluginHub screenshot: **873** | UI “plugins” count in a different captured session/time | This is a product-level display count, not the snapshot row count. The screenshot cannot prove the exact count from the later saved snapshot. |
| Saved snapshot raw keys: **1,039** | Distinct lowercase raw `manufacturer` + `name` pairs across its 1,880 rows, coalescing null/empty manufacturer to `''`; **1,035** when AAX rows are omitted | This is an independent bounded calculation, **not** PluginHub's canonical count. It does not resolve vendor aliases, helper exclusions, vendor prefixes or Waves shells. |
| Earlier AIMM UI: **1,613** | Browser inventory screenshot at an earlier time | This is AIMM's then-current product grouping; it is not PluginHub's product count. |
| Later AIMM browser scan: **1,618** | 1,880 bundles checked, 2,197 readable records, grouped to 1,618 products; recorded in `docs/HANDOVER.md` | A separate browser scanner and grouping path, including AAX at the time. The identical 1,880 bundle number does not establish identical records or identity rules. |

## Reference identity pipeline

`dashboard_webview.py` `_canonical_snapshot` (around 837) merges scanned and excluded record lists, filters scanner-excluded helper bundle IDs, resolves vendor names, and replaces Waves shell stubs with per-plugin records where enumeration succeeds. `_canonical_plugin_counts` (around 913) calls `profile_compare.build_list` to group by canonical vendor and cleaned product name. `build_list` (around 472 onward) normalizes vendor keys, cleans versions, removes a leading vendor prefix from the grouping name and rolls installed formats into each product. Header and export intentionally use the same grouping. Its count can therefore move in either direction relative to a raw vendor/name count when shell expansion and name cleanup apply.

The local snapshot has nine rows whose raw name includes “WaveShell.” That count is a clue about shell handling, not the number of actual Waves products. The installed source sometimes retains shells if per-plugin enumeration fails. Neither the screenshot's 873 nor the current canonical total can be reconstructed reliably from the snapshot alone without the app's vendor-resolution and Waves catalogue state. The readable installed bundle lacks `cached_checks.py`; no PluginHub code or vendor service was executed to force a current count.

## AIMM rule

Count **one canonical product** per normalized vendor/product identity, with format and local file locations as child records. Publish the unit beside every number: products, format bundles, readable records, updates, or vendors. Exclude AAX/Pro Tools from the AIMM scope. When a companion scan arrives, calculate product and format totals from the same canonical inventory that the website and Hope consume; do not hard-code 873, 1,613 or 1,618.

Source: aggregate/key-only reads of `~/Library/Application Support/PluginHub/plugin_snapshot.json`, PluginHub 2.0.12 source methods above, prior AIMM handover and Kevin's supplied screenshots. The raw-key calculation is a local analytical approximation, not a call to PluginHub.
