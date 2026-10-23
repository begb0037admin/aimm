## Verdict: PARTIAL

The research is mostly grounded in the installed source, and the Cubase decision holds. But the AST audit has a demonstrable keying bug, the parity matrix omits whole feature families, and some claims conflict with the source or the saved report. Phase One is not closed yet.

I could not run `research/pluginhub_registry_audit.py` in this read-only session, so its output figures are unverified. The findings below come from reading the code and running counts.

| Area | Verdict | Basis |
|---|---|---|
| AST audit soundness | FAIL | Batch rows keyed by display name (1) |
| Count interpretation | PASS with notes | 1,880 / 239 / 538 / 563 / 2 reconcile (4) |
| AAX exclusion | PARTIAL | Decision is clear, but the sites are not enumerated (9) |
| Cubase inclusion | PASS | Analyser present, no AAX logic (10) |
| Factual claims and citations | PARTIAL | Most line refs correct; several wrong or overstated (5–7, 11) |
| Missing full-feature workflows | FAIL | Licensing, Sparkle update, onboarding, Samples missing (8) |

## Material findings

1. **FAIL: the audit keys batch rows by the wrong field.** `research/pluginhub_registry_audit.py:53–54` takes `item.elts[0]` for tuple rows. `BATCH_VENDOR_CONFIGS` rows are `(display_name, key, urls, aliases)` (`vendor_checkers.py:14281–14286`), and the loop unpacks `display_name, key, …` at `:14663–14664`. The `babyaudio` row (`:14286`) is therefore recorded under `"Baby Audio"`. The 45 `_make_batch_checker` bindings carry display names, so the "full key inventory" is wrong for those vendors.

2. **PARTIAL: guard semantics are ignored.** Several stub loops are guarded by `if key not in ALL_CHECKERS` (`vendor_checkers.py:9018`, `:9349`, `:20214`, `:24524`). The script's last-line-wins rule (`audit.py:126–128`) treats them as unconditional. I checked the guarded keys I could find (`smartelectronix`, `accusonus`, `fb`, `audiorake`, `chromadsp`, `tunedplugins`, `firesonic`, `noteperformer`) and none showed the failure. So this is a latent error, and the 628 `_tier2_no_data` figure is unproven either way.

3. **PARTIAL: wrapper and loop-variable bindings are misreported.** `vendor_checkers.py:23503–23529` rebinds every key in three dicts to `_make`, even where `base is None` skips the wrap (`:23506–23507`). Loop-variable callees appear as binding names (`_sw26_f` at `:31115–31123`, `_fn` at `:29695–29697`), not function identities. The vendor matrix's "named or generated functions" description is inaccurate for these keys.

4. **PASS: snapshot counts.** `plugin_snapshot.json` lines 4–10 give `total_plugins` 1,880 and `by_format` AAX 239, VST3 538, AU 538, VST2 563, CLAP 2. Excluding AAX gives 1,641 format rows, as the count doc says. Raw `"format": "AAX"` matches are 241 because some non-row occurrences also match. Any row-level recount must use the `plugins` array.

5. **PASS with a scoping note: direct installers.** 13 installer rows sit in `updates_available` (`version_report.json` lines 100, 283–444, 1056–1169). 15 further installer rows sit in `up_to_date` and `errors` (from line 3157). The matrix should say "in `updates_available`".

6. **PARTIAL: "eleven categories" is unsupported.** The saved report's `category_counts` has 15 labels (`version_report.json:21212–21226`). Categories are flag-gated: `run_checks.py:40–53` says "OFF by default", and the dashboard strip is hidden unless `_featureFlags.categories` (`dashboard.html:39318–39328`, `:39640`). The taxonomy module `plugin_categories` is absent from the bundle, though imported at `run_checks.py:163`, `:200` and `contribute.py:91–135`. The report contains a top-level `categories` key (`:14046`), so the flag was on for that run. P07 should say "flag-gated" and drop "eleven" unless a source is found.

7. **PARTIAL: the installed source is incomplete.** `run_checks.py:37` imports `feature_flags` unguarded, and `feature_flags.py` is not anywhere under `/Applications/PluginHub.app`. Also missing: `plugin_categories`, `cached_checks` (`run_checks.py:6179`), and `login_launch` (`app.py:76`, `dashboard_webview.py:10168`). The matrix's boundary note mentions only `cached_checks`. Flag defaults for `samples_view`, `categories` and `direct_downloads` are therefore unknown. P13 is affected: `run_checks.py:5151` emits `installer_url` only when `ENABLE_DIRECT_DOWNLOADS` is on, and the saved report carries it, so the feature was live on that Mac.

8. **FAIL: missing full-feature workflows.**
   - **Licensing and paywall, on by default.** `app.py:115` sets `PLUGINHUB_ENABLE_LICENSE` to `"1"`. States are LICENSED, TRIAL_AVAILABLE and TRIAL_EXPIRED (`license_manager.py:154–157`). The file also covers activate/deactivate with device limits (`:1306`, `:1481`) and legacy grandfathering (`:752–832`). The paywall is requested at `app.py:155`, `:2419`, `:4442`. PARITY line 38 mentions only "account/licence gates".
   - **Self-update via Sparkle** (`dashboard_webview.py:634–640`). No row.
   - **Onboarding and first-run cascade** (`app.py:~1690–1711`). No row.
   - **Samples view**, flag `samples_view` (`run_checks.py:38`, `:4403–4406`, `:5462`). No row.
   - **P19 "Sheets" export**: CSV (`dashboard_webview.py:12616`) and PDF (`:12520`) exist. I found no Sheets export in `dashboard_webview.py`, `profile_compare.py` or `app.py`.

9. **PARTIAL: AAX exclusion needs an enumerated site list.** P21 says to remove AAX "from counts, sharing and telemetry," but AAX also surfaces at:
   - the format filter and "AAX-wins" logic (`app.py:2154`, `:2767`, `:2810–2836`);
   - the AAX category mask in contribution (`contribute.py:131–172`);
   - the installer-cleanup extension list (`installer_cleanup.py:94`, `.aaxplugin`);
   - profile codes and format counts (`profile_compare.py:116`, `:501`);
   - the format-suffix parser (`profile_compare.py:463`).

10. **PASS: Cubase inclusion.** `profile_compare_analyze_cpr` is at `dashboard_webview.py:12125`, and `cpr_parser.py` has no AAX or Pro Tools logic (only a `.ptx` precedent comment at `:31`). The Pro Tools analyser is present (`ptx_parser.py:393`, `dashboard_webview.py:11872`), so P21 "Exclude" is an implementation decision, not a gap in the source.

11. **PARTIAL: trace and matrix citations.**
    - `_admin_unused_from_plan` is defined at `dashboard_webview.py:4304`, not "around 4364–4405" (the range sits inside it).
    - "Polls for about one second" holds for the per-bundle path (`:5523`, 20 × 0.05 s). But `_recycle_and_wait` defaults to 10 s (`:3026`) and is used by the batch and offload paths (`:5265`, `:5563`, `:5701`).
    - `build_list` is defined at `profile_compare.py:472`, not "roughly 490–700".
    - The passkey conflict is real: `profile_compare.py:318` says 4-digit, `:714` says 4–6.
    - Confirmed: size-only gate `_dest_is_complete_copy` (`dashboard_webview.py:2844–2866`) gates source deletion (`:2893–2899`, `:4227–4229`). `trash_unused_duplicates` returns `ok: True` with errors (`:5709`). The admin path uses `rm -rf` (`:4405`, `:4438`).

12. **PASS: status rules.** `compare_versions` prefix rule (`run_checks.py:3141–3164`), 2-hour default TTL (`:3222`), offline `max(ttl, 24)` with no force (`:6185–6186`), 6-hour report cooldown and opt-in gate (`contribute.py:485–500`, `:734–740`). `app.py:4704–4707` calls `auto_submit_report()` without a visible check, but the gate is inside it. The comment at `app.py:4701` ("if user opted in") is misleading.

## What would close Phase One

1. Fix the audit: use the key index per table, model `not in` guards as conditional, model the wrapper loop, resolve loop variables to function names. Add a fixture test, rerun, and commit the CSV with the bundle hash. Restate 1,008 / 628 / 45 / 22 / 21 as candidates until then.
2. Add parity rows for licensing and trial, Sparkle self-update, onboarding, and Samples view. Rewrite P07 and P13 with flag status. Drop "eleven" unless sourced.
3. List the AAX sites in item 9 as acceptance criteria for Phase 2.
4. Record the four missing modules as known gaps, and mark flag defaults as unknown.
5. Correct the citations in item 11, drop or source the P19 Sheets claim, and scope the 13-row installer figure to `updates_available`.

## Not verified

The AST output, the 1,039 / 1,035 raw-key figures, the 55 vendor associations, the 159 / 100 / 19 / 1 report counts, the HANDOVER figures, and the manual pages. I did not invoke any app action, vendor site or Worker. I read `version_report.json` and `plugin_snapshot.json` only by counts and specific lines, with no licence or credential values.

I did not write a plan file, since this was a read-only review with nothing to implement. Say if you want the five steps above turned into a plan.
