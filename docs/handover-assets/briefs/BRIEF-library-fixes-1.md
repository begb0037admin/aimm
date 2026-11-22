# BRIEF: Library tab fixes round 1 (build 2026-11-22.6)
Repo worktree = current dir, branch library-tab. Read docs/CLAUDE.md first. Kevin's instructions (22 Nov):
1. Rename "To review" to "Hope's review" everywhere visible (heading, counts, Hope tool text, tests, docs). Internal ids may stay unless trivial.
2. Videos section (739 real videos): starts FOLDED SHUT showing only the heading + count and the Browse search box. No long list by default. Typing in the search box shows matching videos (auto-expanded, still 12 at a time with Show more). Notes and Saved chats keep their normal behaviour unless trivially the same pattern.
3. Section colours in RAINBOW ORDER using only the existing palette, starting at blue: Add to Hope's library = blue #36a8ed, Hope's review = purple #b970ff, Videos = pink #f472b6, Notes = orange #f97316, Saved chats = yellow #e8b45a. Selected stays teal. Black ink on bars as now.
4. Old videos with no date: Added column shows an en dash instead of "Library".
5. Bump AIMM_BUILD to 2026-11-22.6 and the 3 stamp tests; run ALL tests (171 before); fix breakage. Check 1900/1300/560 wide (room to breathe, full width, no highlights).
6. Do NOT commit, push or deploy. Report diff summary + test result in 6 lines.
