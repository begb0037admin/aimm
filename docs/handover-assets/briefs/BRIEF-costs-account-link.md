# BRIEF — Costs card: Account link (repo /Users/admin/github/aimm, branch costs-switch-fix)
Edit ONLY standalone/assets/index.html (and tests if needed).
1. In the ElevenLabs cost card actions row (next to #elTopup and #elUpdate) add a third button "Account ↗" (id elAccountLink, same class/style as Top up) that opens https://elevenlabs.io/app/settings in a new tab with noopener (same pattern as the elTopup handler ~line 20549). Title: "Open your ElevenLabs account settings in a new tab". The row becomes three equal buttons; keep it tidy at narrow widths.
2. Order: Top up, Account, Update balance. Nothing else changes. No emails anywhere in the file.
3. Run all tests, add a test that the handler opens that URL if simple. Bump AIMM_BUILD to 2026-11-19.4, add a STATUS entry, commit on this branch. No push, no deploy.
4. Final message: grep-print the new button line and handler line.
