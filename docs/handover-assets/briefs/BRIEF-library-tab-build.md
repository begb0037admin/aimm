# BUILD BRIEF: Library tab (Insight + Snapshots merged) - build 2026-11-22.5

Repo worktree = current dir, branch library-tab (based on the tab-id rename, build .4). Read docs/CLAUDE.md and docs/UI_DESIGN_STANDARD.md first.
Kevin APPROVED Jules's design. Build exactly:
- docs/handover-assets/jules-library-tab/SPEC.md (all sections), preview.html (visual truth), library.css (CSS draft)
- docs/handover-assets/briefs/BRIEF-library-tab-merge.md (product intent + hard design rules)

## Do
1. One tab: id `library`, label "Library", replacing Insight (knowledge) and Snapshots. Keep aliases: old ids `knowledge` and `snapshots` (saved tab order in localStorage, Hope switch_tab) open Library. Migrate aimmTabOrder_v2 safely.
2. Build the page per SPEC: Add card (paste YouTube link row = keep existing working feature; Find videos request + approval list), To review (Hope tips), Browse (videos, notes, saved chats) as strict column rows (SPEC section 9), snapshot pills with unchanged behaviour (recallFavourite; mid-call send, idle compose box).
3. Find videos: add Worker route in worker/src/index.js (e.g. POST /kb/search-youtube) using Apify streamers/youtube-scraper via the existing APIFY_TOKEN secret (same pattern as /kb/add-youtube). Return id, title, channel, duration, views, url, one-line reason, and EXCLUDE any video already in the library (match by video id over the repo library and /kb/user-videos); return the count excluded. Add/Add all call the existing /kb/add-youtube. Do NOT deploy the Worker.
4. Hope tips: add_knowledge_note gets a to-review state; shows in To review with Keep/Edit/Delete. Update Hope tool descriptions and switch_tab enum/aliases (library; knowledge+snapshots stay as aliases); update hope-tools-manifest.json. Do not change Hope's voice text beyond what SPEC section 12 says.
5. Categories: the six in SPEC (Mixing techniques, Producer interviews / chains, Reference tracks, Mastering, Vocal techniques, Workflow); Plugin recipes and Misc removed; migrate existing notes in those to Mixing techniques (fallback). Notes data must not be lost.
6. Remove: per-item token counts, Hope's memory facts section, plugin recipes/misc, the old tick/on-off control is kept as in SPEC (Pause/Resume decision pending - keep what the SPEC shows).
7. Design rules (all must pass, verify at 1900, 1300, 560 wide): ROOM TO BREATHE, full width (no max-width/ch caps), no highlights/glows/tinted fills/underline markers, no boxes behind counts/icons, no emoji icons, primary palette only, MixBus/Plugins card outline. Update UI_DESIGN_STANDARD.md "soft glow" conflict.
8. Bump AIMM_BUILD to 2026-11-22.5 and the 3 stamp tests. Add tests for: tab aliases, category migration, Find exclusion logic, tip to-review flow. Run ALL tests; fix what you broke (165 before).
9. Do NOT commit, push or deploy. Report: diff summary, test result, any open points.
