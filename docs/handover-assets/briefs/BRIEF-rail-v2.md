# Brief v2 (replaces BRIEF-rail-space.md, which is CANCELLED - do not read it)
Kevin approved /Users/admin/aimm-previews/rail-mock2.html (screenshot rail-mock2.png). Build EXACTLY this, nothing else. Do NOT touch the header, waveform, typing box, button sizes, labels, shapes or order in the Hope chat panel. Kevin rejected any layout change there.

Three CSS-only changes to /Users/admin/github/aimm/standalone/assets/index.html (and the root index.html copy only if that file is kept in step with it - check how the repo does it; mirror what previous commits did):
1. Desktop (min-width:1024px): `.container > #hopeRail{align-self:start;position:sticky;top:16px;height:calc(100vh - 32px);min-height:calc(100vh - 32px)}` (use !important only if needed to beat existing rules). Confirm no ancestor overflow breaks sticky, and Mix Check / Plugins tabs still look right and the rail does not overlap the footer.
2. Hide the two header dropdowns visually: `#genreSelect + .cs,#platformSelect + .cs{display:none}`. Do NOT delete elements or JS.
3. Remove the grey block behind the four buttons: `#hopeRail .aichat-compose .send-col{background:transparent}` and the four buttons' non-hover, non-disabled background transparent. Keep hover/disabled styles, hairline dividers, outlines.
Exact reference CSS is in the <style id="railMock"> block of rail-mock2.html.

Process: work on a NEW branch rail-v2 off main in /Users/admin/github/aimm. Bump AIMM_BUILD to the next number after 2026-11-15.4 (2026-11-16.1). Append the docs/STATUS.md entry in the same commit. Commit on the branch. Do NOT push, do NOT merge, do NOT deploy. Then screenshot with headless Chrome (2000x1216) the MixBus, Mix Check and Plugins tabs to /Users/admin/aimm-previews/rail-v2-*.png and report: files changed, diff stat, and any dependency on the two dropdowns.
