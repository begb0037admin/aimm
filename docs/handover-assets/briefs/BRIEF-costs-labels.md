# BRIEF — Costs card: clean labels (repo /Users/admin/github/aimm, branch costs-switch-fix)
Edit ONLY standalone/assets/index.html (the live app, not the root index.html).
1. Remove the two text lines under the Primary/Backup buttons (#elAccountSummary "Primary: — left · Backup: — left" and #elAccountLabel "Primary — Hope Voice account"). Remove or guard the JS that writes them so nothing throws. Keep #elAccountStatus (used for "Backup account not connected yet" and fetch errors).
2. Button text: Primary button = "Primary · kevin@lelitte.co.uk", Backup button = "Backup · begb0037@ox.ac.uk". Keep aria-labels meaningful (e.g. "Show Primary account, kevin@lelitte.co.uk"). Same styling as now (teal selected with black text, grey resting, 9px radius).
3. Nothing else changes. Update the matching test(s) in tests/ if they assert the removed lines. Run all tests. Bump AIMM_BUILD to 2026-11-19.2, add a STATUS entry. Commit on this branch. No push, no deploy.
4. In your final message, grep-print the two button lines from standalone/assets/index.html.
