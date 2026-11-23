# BRIEF: opening a video must not show the raw transcript (build 2026-11-23.5)

Repo ~/github/aimm, branch library-bars. Keep all existing work; do not revert files. Read docs/CLAUDE.md first.

Bug: in Library > Videos, opening a row (Show/View) shows the raw transcript chunk including front matter ("--- title: ... source: ..."). Fix: open shows the video's summary under its title. Use the summary note (a Notes entry whose source equals the video url) when one exists. For library videos with no summary note, show the transcript text with the front matter block stripped. The user must never see "--- title:" front matter. Keep the Videos table at six columns (Title, Channel, Added, Edit, Show, Link).

Add a test for both cases. Bump AIMM_BUILD to 2026-11-23.5 and the 3 stamp tests, run node --test tests/*.test.mjs. Do NOT commit, push or deploy. Report diff summary and test result.
