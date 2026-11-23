# BRIEF: apply Jules's review fixes D1-D4 (build 2026-11-23.5)

Repo ~/github/aimm, branch library-bars. Keep all existing work; do not revert files.

Read docs/handover-assets/jules-library-hover-pills/REVIEW.md. Apply EXACTLY its fixes for D1 (disabled Added/Adding/Adding all too dim, opacity), D2 (results heading uppercase), D3 (tip edit row Cancel/Save layout at 1300+), D4 (8px row gap on wrapped action rows). Do not change anything else. Do NOT touch the items marked "for Jacob, not design" (raw transcript view, 6 vs 9 columns, NaN views); list them in your report only.

Bump AIMM_BUILD to 2026-11-23.5 and the 3 stamp tests, run node --test tests/*.test.mjs. Re-run Jules's harness in docs/handover-assets/jules-library-hover-pills/review-tools/ and report its results for D1-D4. Do NOT commit, push or deploy.
