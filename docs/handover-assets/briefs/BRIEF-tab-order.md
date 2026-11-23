# BRIEF: reorder main tabs (Kevin, 23 Nov 2026)
Branch library-bars, file standalone/assets/index.html. Change ONLY the order of the main tab buttons (and any sidebar/rail/nav list or JS array that sets the same visible order) to:
Mix Check, Library, Plugins, MixBus, then the rest unchanged (Settings, Marketing, Community etc.).
Currently: Mix Check, MixBus, Plugins, Library (buttons near line 3685-3688).
Rules: no visual changes, no renaming, keyboard/tab shortcuts that depend on order must follow the new order. Bump AIMM_BUILD to 2026-11-23.8 and the 3 stamp tests. Run node --test tests/*.test.mjs (must all pass). Do not commit. Report in 4 lines.
