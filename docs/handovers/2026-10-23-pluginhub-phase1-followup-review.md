**Overall: PARTIAL.** The key-index bug is fixed, and the parity-family additions are mostly right. The audit still mishandles guards and bindings, and it silently drops one registration block. I did not re-run the audit or the SHA-256 check, because this session allows only read-only tools. The 962, 1,221 and 629 figures are therefore still unverified. I made no edits and wrote no plan file, since this is a verification answer.

## Prior findings 1–11

| # | Finding | Verdict | Evidence |
|---|---|---|---|
| 1 | Batch rows keyed by display name | PASS | `vendor_checkers.py:14663–14664` unpacks `display_name, key`. Audit `:125–130` selects index 1. |
| 2 | Guard semantics | FAIL | 21 of 23 guards are `and` expressions. Audit `:113–116` matches only a bare `ast.Compare`. See gap 1. |
| 3 | Wrapper and loop-variable bindings | PARTIAL | Wrapper skip at `:119–121` is right for key existence. Wrapped bindings at `vendor_checkers.py:23529` are not recorded. Loop-variable callees remain. See gap 4. |
| 4 | Snapshot counts | not re-checked | |
| 5 | Direct-installer scope | PASS | `version_report.json` has 56 `installer_url`/`installer_size` values, which is 28 rows. That matches the prior 13 update rows plus 15 others. The docs scope the 13 to update rows. |
| 6 | "Eleven" category claim | PASS | No "eleven categor" claim remains in `docs/`. Category UI is flag-gated at `run_checks.py:53`. The default is unknown because `feature_flags.py` is absent. |
| 7 | Installed source incomplete | PASS for modules | `cached_checks`, `feature_flags`, `plugin_categories` and `login_launch` are absent. A control glob (`**/run_checks.py`) resolves. The audit has a new omission; see gap 3. |
| 8 | Missing parity families | PARTIAL | Licensing (P28), Sparkle (P29), onboarding (P30) and Samples (P31) are added. P19 Sheets wording is wrong (gap 8). Install launch is missing (gap 7). |
| 9 | AAX sites enumerated | PARTIAL | Not enumerated. See gap 6. |
| 10 | Cubase inclusion | not re-checked | |
| 11 | Citations | PARTIAL | Most line citations check out. Drift is listed in gap 9. |

## Remaining gaps

1. **Guard detection (FAIL).** `research/pluginhub_registry_audit.py:113–116` recognises only a bare `Compare`. Only `vendor_checkers.py:9018` and `:20214` are bare. The other 21 are `kind == "tier2" and key not in ALL_CHECKERS`: `:9349, 9379, 24524, 24646, 24976, 28530, 28581, 29000, 29285, 29341, 29395, 29438, 29486, 29941, 29965, 29977, 29990, 30036, 30101, 30133, 30195`. The audit treats each as an unconditional override.

2. **Kind filter ignored (FAIL, new).** Loop bodies run only for `kind == "tier2"`. The audit ignores that filter, so non-tier2 keys get recorded as stub registrations. Last-line-wins then picks the wrong binding:
   - `igniteamps`, `dexed`, `parallaxaudio`, `bbesound`, `pressplay`: live at `:9313–9317` and bound by the `_lfn` loop at `:9319`. The audit records `_tier2_no_data` at `:9350`, from `_AUDIT_R2`, where they are kind "live" at `:9327–9331`.
   - `rtmaudio`: bound by the Moonbase loop at `:23462`, from a table at `:23408–23445`. The audit records `:30102`, where it is kind "live" at `:30073`.
   - `vastdynamics`: `check_vastdynamics` at `:29180`. The audit records `:29342`, where it is kind "live" at `:29337`.
   - `telestream`: real stub at `:28940`. The audit records `:29001`, where it is kind "active".

   The 629 `_tier2_no_data` figure is therefore overstated by at least 7.

3. **Conditional hub spread dropped silently (FAIL, new).** `vendor_checkers.py:6336–6360` is `**({...} if HUB_CHECKERS_AVAILABLE else {})`. The audit expands `**` only when the value is an `ast.Dict` (`audit:93`). An `IfExp` is skipped without being reported as unresolved. Eight keys are missing from the 962: `uad`, `uad_snapshot`, `uad_dsp`, `waves`, `izotope`, `arturia_hub`, `cradle`, `ujam`. None has another `ALL_CHECKERS[...]` registration in the file. "Zero unresolved" holds only for the forms the script models.

4. **Loop-variable callees unresolved (PARTIAL).** Literal tuples can resolve about 25 keys, but the audit still reports the variable name:
   - `_lfn` at `:9174`: 6 keys.
   - `_fn` at `:29697`: 6 keys, from `:29695–29696`.
   - `_sw26_f` at `:31123`: 13 keys, from `:31115–31121`.

   The wrapper's effective callable (`:23529`, invoked at `:32023`) is also not recorded.

5. **Headline figures (unverified).** By my reading, 629 is high by at least 7, and 962 is low by at least 8. Restate them as unverified until the audit is fixed and re-run.

6. **AAX sites not enumerated (PARTIAL).** P21 evidence (`PLUGINHUB_PARITY_MATRIX.md:27`) names `app.py`, `contribute.py`, `installer_cleanup.py` and `profile_compare.py`, plus `ptx_parser.py`. Case-sensitive `AAX` counts in the `.py` files are: `run_checks.py` 69, `vendor_checkers.py` 55, `dashboard_webview.py` 63, `plugin_scanner.py` 47, `profile_compare.py` 19, `hub_checkers.py` 16, `app.py` 6, `contribute.py` 3, and 1 each in `installer_cleanup.py`, `installer_payload.py`, `checker_core.py` and `logicx_parser.py`. Not listed in P21: `dashboard_webview`, `run_checks`, `plugin_scanner`, `vendor_checkers`, `hub_checkers`, `installer_payload`, `checker_core`, and `dashboard.html`. Alias strings such as `vendor_checkers.py:31963` ("PreSonus AAX Shell") also need a decision.

7. **Install step has no parity row (PARTIAL).** `PLUGINHUB_REPLICA.md:146` lists "launch vendor installer" and "batch sequential install with one admin authorization". P13 covers download, queue, cancel, open, reveal and mark only. Source: `dashboard_webview.py:1664` `download_and_install`, `:1547` `installer_batch_start`, `:1597` `installer_batch_finish`.

8. **P19 Sheets claim is wrong as written (FAIL).** `PLUGINHUB_PARITY_MATRIX.md:25` and `PLUGINHUB_REPLICA.md:149` say Sheets was "not found in installed source". `dashboard.html:26087`, `:27026` and `:30129` contain "Copy for Sheets", which is a clipboard TSV. The Python modules have no Sheets file export. Reword accordingly.

9. **Citation and wording drift (PARTIAL).**
   - `PLUGINHUB_WORKFLOW_TRACE.md:28` says report submission is "around 715". The defined entry is `contribute.py:734` (`auto_submit_report`). The opt-in gate is `_should_submit_report` at `:488`.
   - `PLUGINHUB_WORKFLOW_TRACE.md:26` says `app.py` calls both helpers "when the user has opted in". The call at `app.py:4704–4707` has no visible gate. The gate is inside the helpers.
   - `PLUGINHUB_PARITY_MATRIX.md:36` cites "app.py first-run path near 1690–1711". That block is the beta/test-build cascade. The first-run explainer is `app.py:3540`.

Not re-checked in this pass: the SHA-256, the 962/1,221 run, snapshot counts, Cubase, `KNOWN_HUBS` (`hub_checkers.py:3158`), `plugin_scanner.py` 1292–1326, and `contribute.py` 460–473 and 503–600.
