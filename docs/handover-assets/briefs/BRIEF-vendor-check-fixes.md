# BRIEF — Vendor check: name matching + Waves major version (repo /Users/admin/github/aimm, branch main)
Code: standalone/src/index.js (sourceFor ~line 369, compareVersions ~308, VENDOR_SOURCES line 1, Waves parser 'waves-suite'). Worker-only change if possible; no UI layout/colour change. Do exactly this.

## 1. Vendor-name matching
Companion rows carry vendor strings like "uaudio", "ikmultimedia", "scalermusic", "slatedigital", "ValhallaDSP", "AconDigital", "pluginalliance", "SirAudioTools", "AurallySound" while VENDOR_SOURCES `matches` use spaced names ("scaler music", "slate digital", "sir audio tools" ...). In sourceFor, also match when the vendor with all spaces removed equals a match with all spaces removed, or starts with it followed by a word boundary in the original. Must NOT cause cross-vendor mistakes: "wavesfactory" must stay Wavesfactory (not Waves); "Universal Audio"/"uaudio" have no source yet and must stay unmatched. Add tests with those exact strings.

## 2. Waves major version
The Waves source page returns only a bare major ("17"). Installed Waves plugins are 16.7.33 (V16) or 17.1.42 (V17). Today every V16 plugin is flagged "Update available" and V17 ones are probably flagged too.
- Installed major equal to latest major (17.1.42 vs "17") => up-to-date.
- Installed major lower than latest major (16.7.33 vs "17") => do NOT count as a normal update. Report it as a major-version upgrade: reuse the page's existing "paid upgrade"/manual status handling if there is one (search the page for paid upgrade / P03 behaviour and the status values "updates", "up-to-date", "manual-check"); if none exists, return status "manual-check" with reason "Waves V17 is a new major version (V16 installed). Check your Waves Update Plan." Say in your final report which one you used.
- Waves products whose version is unrelated to the suite (e.g. Trackspacer 2.5.10) must not be compared to the suite major; keep existing behaviour for those.
Add tests for 16.7.33, 17.1.42, 2.5.10.

## 3. Finish
Run all tests (`for f in tests/*.test.mjs; do node $f | grep "^ℹ fail"; done`) and report counts. Bump AIMM_BUILD to 2026-11-19.10 (only if index.html is touched; otherwise leave it and say so), add a short undeployed STATUS.md entry, commit on main with trailer "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>". Do not push or deploy.
