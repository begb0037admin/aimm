# BRIEF: stop blank "[]" facts appearing in Hope's memory (Insight)

Repo ~/github/aimm, branch fix-empty-facts (from main, live build 2026-11-22.1). Read docs/CLAUDE.md first.

Bug (Kevin, screenshot): Insight > Hope's memory fills with facts whose text is "[]". Root cause in standalone/assets/index.html extractProfile(): the model correctly answers "[]" (nothing new); JSON.parse gives an empty array; the code then treats `!parsed.length` as "Luna slipped into prose" and runs the plaintext fallback, turning the text "[]" into a fact line. Each call with nothing new adds one.

Fix:
1. extractProfile: if a JSON array was found and parsed successfully, return it (an empty array means no new facts) and do NOT run the plaintext fallback. Only fall back to plaintext when no JSON array could be parsed at all.
2. Add one shared guard (e.g. isMeaningfulFactText) used by extractProfile's filter, maybeExtractProfile, addFact, and any other place facts are created or imported: reject text with fewer than 3 letters/digits in total, and reject placeholder answers such as [], {}, none, n/a, nothing new, no new facts (case-insensitive, ignoring punctuation). Manual add of an empty/placeholder fact must show a plain message and not add.
3. One-time cleanup on load: remove existing profileFacts whose text fails the guard, but NEVER remove a fact that is pinned or has been edited by the user; save state once; if any were removed, show a short status line "Removed N blank facts". Make it idempotent.
4. Add tests (no network): extractProfile-style parsing for "[]", "[ ]", "none", prose, valid JSON; the guard; the cleanup keeps real facts and pinned ones.
5. Bump AIMM_BUILD to 2026-11-22.2 and update the 3 build-stamp tests (tests/hope-installed-rule.test.mjs, sidebar-option-c.test.mjs, vocal-favs.test.mjs). Run all tests (155 before).
6. Do NOT commit, push or deploy. Report diff summary and test result.
