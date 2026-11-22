# BRIEF: no arrows in the Library (build 2026-11-22.8)
Repo worktree = current dir, branch library-tab. Kevin: "Why are you using an arrow in a dropdown? We don't use arrows." AIMM uses plus/minus for folds, never arrows/chevrons.
1. The Browse channel drop-down (#libChannel, ~line 3395 forces appearance:auto / menulist = native arrow). Make it appearance:none with a plus glyph at the right end, same glyph style/weight/colour as the fold icons on the section bars (plus when closed; if you can detect open state cheaply use minus, otherwise plus only). Keep it a real, keyboard-accessible select, same width and room to breathe.
2. Sweep the whole Library panel (#library, including selects, inputs type=search, date/number spinners, any ::-webkit arrows, unicode arrows such as ↓ ↑ ⌄ ▾ in buttons or text) and remove every arrow. Replace with plain words or plus/minus.
3. Bump AIMM_BUILD to 2026-11-22.8 + the 3 stamp tests; run ALL tests (175 before). Check 1900/1300 wide.
4. Do NOT commit, push or deploy. Report in 4 lines.
