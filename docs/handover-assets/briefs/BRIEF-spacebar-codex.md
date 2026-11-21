# Brief for Codex: AIMM spacebar does not start Hope's voice

Task: find the cause. Read-only. Do not edit, commit, push or deploy.

Problem
- In the AIMM app (standalone/assets/index.html, live at https://aimixmasters.com), pressing Space no longer starts Hope's voice. Nothing happens.
- It worked before 15 Nov 2026.

What we know
- Space handler: document keydown listener near line 20721 of index.html. It starts voice through micStartFromFloat() (ElevenLabs route, elStart near line 18861) or hopeUsageToggle() (Deepgram route).
- That handler is byte-identical in every build from 2026-11-14.11 to now.
- Kevin says Space was also dead on the pre-today code and the pre-today Worker. So the cause may not be in today's changes.
- Live now: build 2026-11-15.4 (commit 87bb4910; Worker f9be20ff).
- The big Start call button (#rtCallBtn) is hidden. Space is the only start path.
- Nothing on the Mac takes Space: PTT uses right Ctrl, skhd uses Alt+S and Alt+X.
- Headless Chrome tests crash on this Mac, so nothing was tested by pressing keys.

What to check
1. Read the keydown handler, isTypingTarget, micStartFromFloat, elStart, elLoadSDK, hopeUsageToggle.
2. Look for anything that stops Space acting: a script error at page load, EL.connecting / EL.ending / EL.active stuck true, a stuck cooldown, or focus stuck in #aiChatInput.
3. Check the SDK load: curl https://esm.sh/@elevenlabs/client@0.1.7 still resolves.
4. Compare today's commits for anything that could cause it: 8cd90465, f50777cd (Worker /docs proxy), 952b4b01 (build stamp in #hopeRail), 87bb4910.

Report
- Most likely causes, ranked, with file:line evidence.
- The smallest safe fix, and how to regression-test the spacebar.
