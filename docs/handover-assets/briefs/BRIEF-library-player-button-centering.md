# BRIEF: centre the player-row button text (build 2026-11-23.7)

Repo ~/github/aimm, branch library-bars. Keep all work; do not revert files.

Defect (seen in your own screenshots /private/tmp/aimm-player-1900.png and -560.png): in the Library player's channel row, 'Open on YouTube' and 'Copy link' render their text jammed against the TOP edge of the pill (not vertically centred, nearly clipped), at 1900 and 560 wide. Jules's preview (docs/handover-assets/jules-library-player-v3/shots/v3-1900.png) shows them correctly centred in 48px pills. Find the cause (likely inherited button/line-height/padding from the app's global button rule, or the pill rule not applied) and fix it so text is vertically and horizontally centred, pill height and gaps matching Jules's SPEC.md. Then check every other text button and input in the new player surface (search field, Channel filter, Read more, playlist rows, cannot-embed state) for the same inherited-style problem, and compare the whole surface against Jules's v3 screenshots at 1900, 1300 and 560.

Take new headless screenshots at 1900, 1300 and 560 of the real page (real video rendering), VIEW them, and state what you compared. Bump AIMM_BUILD to 2026-11-23.7 and the 3 stamp tests, run node --test tests/*.test.mjs. Do NOT commit, push or deploy. Report.
