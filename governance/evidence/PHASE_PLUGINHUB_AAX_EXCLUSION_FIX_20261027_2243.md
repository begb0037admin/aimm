# PluginHub AAX exclusion fix — source verification

**Observed:** 2026-10-27 22:43 UTC  
**Branch source commit:** `14a5592b14472190ea544efa18073e94193d1ddf`  
**Source file:** `index.html`, blob `c66421ed567c038e4cc6f76648ba085296c8c8f4`  
**Scope:** The approved architecture excludes AAX/Pro Tools. The live source had exposed an AAX format pill and detected `.aaxplugin` as a supported format.

## Change

- Removed AAX from the Library’s format summary, filter, and visual format class.
- Removed AAX from recognized plug-in bundle extensions and format-folder vendor hints.
- Made the scanner skip `.aaxplugin` directories before traversing their contents.
- Removed AAX name-suffix handling.
- On page load, filtered legacy browser-cached AAX rows from the inventory and rewrote that browser-local inventory cache without those rows. No plug-in files or account data were changed.

## Targeted verification

A source-level logic check passed **5/5**:

1. AU, VST2, VST3 and CLAP still map to their formats.
2. `.aaxplugin` is no longer recognized as a format.
3. Legacy cached AAX rows are filtered and removed from the browser inventory cache.
4. The scanner skips `.aaxplugin` directories before recursion.
5. The Library AAX filter, summary, and style are absent.

This was not a full application build or browser rescan. The existing non-production preview has not been deployed with this source change. No database was queried or written, no test user credentials were used, and no deployment occurred.

## Gate disposition

This fixes the observed AAX scope defect in the branch source but does not complete Stage 4 parity. The browser/Mac/account comparison remains 317 browser-only rows and two version differences. Fresh remote Worker/D1 action/recovery, the paired-credential wrong-device HTTP 401, and fresh independent end-to-end Foundation acceptance remain open. The current D1 validation/write hold remains open; preserve the separate 22:47 database creation chronology.

Foundation remains **NOT MET**. Stage 6 remains gated.
