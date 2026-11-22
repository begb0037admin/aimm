# BRIEF: Library channel filter (build 2026-11-22.7)
Repo worktree = current dir, branch library-tab. Read docs/CLAUDE.md first. Kevin (22 Nov): "I want to be able to filter channels so that if I wanted to select all Mix With The Masters videos, I can select that once I drop down."
1. Add a channel drop-down to the Browse row (next to the search box; same width/room-to-breathe rules). Options: "All channels" then every channel in the library (23 today) sorted by video count, each with its count, e.g. "Mix With The Masters 336". Build the list from the videos data, so channels added later appear automatically (dashboard-added videos too).
2. Choosing a channel filters the Videos section to that channel's videos and opens the Videos fold automatically (still 12 at a time with Show more, category groups kept). Works together with the search box (both apply). "All channels" returns to the folded default.
3. Selection should be obvious in plain words (e.g. the Videos heading count shows "336 of 739"); no highlights/glows. Use a native-looking select styled like the existing fields; keyboard accessible.
4. Notes and Saved chats are unaffected (Notes may match on Source if trivial; skip otherwise).
5. Bump AIMM_BUILD to 2026-11-22.7 + the 3 stamp tests; add a test for the channel list and filter; run ALL tests (173 before). Check 1900/1300/560 wide.
6. Do NOT commit, push or deploy. Report in 5 lines.
