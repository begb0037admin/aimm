# BRIEF — Costs card buttons: plain labels (repo /Users/admin/github/aimm, branch costs-switch-fix)
Edit ONLY standalone/assets/index.html (and tests if they assert the old text).
1. Button text must be exactly "Primary" and "Backup" (#elAccountPrimary, #elAccountBackup). No email, no extra words, no tooltip/title with emails. aria-labels: "Show Primary account" / "Show Backup account". Styling unchanged.
2. Do not put either email address anywhere in standalone/assets/index.html.
3. Run all tests. Bump AIMM_BUILD to 2026-11-19.3, add a STATUS entry. Commit on this branch. No push, no deploy.
4. Final message: grep-print the two button lines.
