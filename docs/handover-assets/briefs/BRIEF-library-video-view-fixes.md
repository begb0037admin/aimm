# BRIEF: Library video view fixes (build 2026-11-23.6)

Repo ~/github/aimm, branch library-bars. Keep all existing work; do not revert files. Apply AFTER BRIEF-library-review-fixes.md (build .5) is done; stamp becomes .6.

1. Opening a video row (the Show / View action in Videos) currently shows the raw transcript chunk with front matter ("--- title: ... source: ..."). It must show a readable summary for that video, as the Library design intends (summary under the title, a Raw option for the transcript). Use the video's summary note (Notes entry whose source equals the video url) when one exists; for library videos without one, show the transcript with the front matter block stripped, as Raw. Never show "--- title:" front matter to the user.
2. Search results: a video's views must never render "NaN views". Check what /kb/search-youtube in worker/src/index.js returns for viewCount (number or string) and make the page format any numeric or numeric-text value, and hide the views part entirely when it is missing or not a number. If the Worker is the cause fix it there too, but do NOT deploy the Worker.
3. Leave the Videos table at 6 columns: Kevin removed Re-summarise, Remove and the Hope-reads tick on purpose.

Add or update tests for 1 and 2. Bump AIMM_BUILD to 2026-11-23.6 and the 3 stamp tests, run node --test tests/*.test.mjs. Do NOT commit, push or deploy.
