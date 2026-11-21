# BRIEF — Session safety wording (repo /Users/admin/github/aimm, branch: create `safety-wording` from main)
Edit ONLY standalone/assets/index.html (NOT root index.html). Text changes only, no layout/CSS/ids/logic changes.
In the Session safety section (#settingsSafety, ~line 5285) make exactly these replacements:
1. `<div class="label">Auto session reminder</div>` -> `<div class="label">Remind me when a call reaches this length</div>`
2. Text in `#budgetSub`: `Shows a reminder during an Auto (ElevenLabs) call at this time. It does not end the call. Deepgram calls are unaffected.` -> `Pops up a message and pulses the mic button once, when an Auto (ElevenLabs) call reaches this length. Watch the running clock at the top of Hope's chat. It does not end the call. Deepgram calls are unaffected.`
3. `<div class="label">End an idle Auto call</div>` -> `<div class="label">Hang up after 2 minutes of silence</div>`
4. `End after 2 minutes without a conversation turn` -> `Hang up an Auto call if nobody speaks for 2 minutes`
5. `Warns first, then ends an unattended ElevenLabs Live Agent call. This does not apply to the separate Deepgram route.` -> `Warns at 1:45, then ends the call so an empty call is not billed. Never cuts in while Hope is replying. Does not apply to Deepgram.`
Also update the in-app guide lines (~5148, ~12963, ~13091) only if they name the old titles ("Auto session reminder", "End an idle Auto call"); keep meaning.
Bump AIMM_BUILD to 2026-11-19.5, add a STATUS.md entry in the same commit, run all tests (`for f in tests/*.test.mjs; do node $f | grep "^ℹ fail"; done`) and fix any test that asserts the old wording. Commit on the branch. Do not push or deploy.
