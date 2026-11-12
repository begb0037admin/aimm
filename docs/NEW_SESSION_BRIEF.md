# Brief: AIMM (AI Mix Masters) — picking up from 11–12 Nov 2026

You are taking over AIMM design and build work for Kevin Lelitte from a previous session. Read this whole brief first. This file is in the repo as `docs/NEW_SESSION_BRIEF.md`, so it works on any of Kevin's machines. Do not start work until you have checked the live state (step 1 below).

## 1. What AIMM is
- Single-file web app: `standalone/assets/index.html` in the repo `begb0037admin/aimm`, served live at https://aimixmasters.com/.
- Repo checkout on Kevin's Mac: `/Users/admin/github/aimm` (branch main). On other machines, clone `begb0037admin/aimm`.
- Live build stamp is `AIMM_BUILD` near the top of `index.html`. Format `YYYY-MM-DD.N`.

## 2. Where things stand (as of 12 Nov 2026, early morning)
- **Live build: `2026-11-11.07`, commit `92a94a85`** on origin/main. It contains:
  - Mix Check Audio Specs as tiles: labels and figures aligned, Tempo and Key hidden, measurement rows shown as tiles, Match Sound hidden.
  - The Spotify logo in the Mix Check header is the connect control. White connects; green asks first, then disconnects.
  - Hope name tags hidden in the chat panel.
- **Docs commit `654139a4`** updated `docs/HANDOVER.md`, `docs/STATUS.md`, `ROADMAP.md` and `docs/CLAUDE.md` (adds the Preview in Place rule).
- **Not browser-tested:** the disconnect confirmation on the green logo. Ask Kevin to tap it on the live site and report what happens. Do not claim it works until he has.
- **The "More measurements" bar is still visible** in the live build and in the approved preview. Jules's spec r3 asked for it hidden. Kevin asked for it removed earlier. This is an open decision for Kevin. Do not change it without his answer.
- **Fix queue** is not previewed. It only fills in once a WAV is loaded, so it cannot be checked on an empty page.

## 3. How we work (Kevin's rules — these are firm)
- **Preview in Place** is the default for any AIMM visual change:
  1. Take the live source (`git show origin/main:standalone/assets/index.html`).
  2. Make a preview copy with CSS-only overrides and sample values. Do not edit the repo file for a preview.
  3. Open the copy in Chrome on Kevin's Mac: `open -a "Google Chrome" <file>`.
  4. Iterate quickly on Kevin's feedback.
  5. Nothing is committed or pushed from a preview.
- **The approved look is the preview file:** `/Users/admin/aimm-previews/spotify-logo-connect-preview.html`. It is a copy of the live page with the approved styling on top. Its title is "AI Mix Masters".
- **Approval is Kevin's own words in this chat.** Relayed approval (one agent passing on what Kevin said) does not count. Ask for it directly if it's missing.
- **AIMM repo changes go through Codex, not Claude.** Process per `docs/UI_CHANGE_PROCESS.md`: design by Jules (review of spec and screenshots), implementation by Codex, merge only after Kevin approves the screenshots in chat.
  - Caveat: on 11 Nov Codex's sandbox could not write to `.git` (`index.lock: Operation not permitted`). Kevin then told Claude to push from the shell. Both pushes that day (`92a94a85`, `654139a4`) were made from the shell, which breaks the Codex-only rule. Kevin has not yet said whether that rule still stands. Ask him before the next push.
- **Zero manual steps.** Never ask Kevin to click, copy or paste anything an agent can do. Check tools first.
- **Keep it short and plain.** Kevin is dyslexic. One question at a time. Short sentences. No walls of text.
- **Before any question to Kevin:** play a sound with `afplay /System/Library/Sounds/Glass.aiff`.
- **Verify before reporting.** Check the live build with `curl -s https://aimixmasters.com/ | grep -o "AIMM_BUILD *= *'[^']*'"` and `origin/main` with `git fetch` and `git show origin/main:standalone/assets/index.html`. Do not say something is live until both show the new stamp.
- **Do not open browser windows or DevTools on Kevin's Mac** unless he asks. He has asked for this explicitly.
- **Do not change things he has not approved.** If he says "stop", stop everything and report.

## 4. Known problems and gotchas
- **Stale Codex job:** PID 59683 (`codex exec`, worktree `/Users/admin/github/aimm-chore`) has been running for days. It was meant to untrack `audio-reference-companion/.build`. Check it before touching anything; do not kill it without Kevin's yes.
- **`.build` is still tracked** in git (about 278 files). Untracking it is a separate, approved task.
- **GitHub is the source of truth.** Kevin uses several machines. Keep anything a new session needs in the repo (under `docs/`), not in local folders or scratchpads.
- **Headless Chrome from the Codex sandbox crashes** (exit 134). Headless from Kevin's shell works: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,1000 --virtual-time-budget=8000 --screenshot=<out.png> "file://<path>"`.
- **Preview sample values** (-9.1 LUFS, -1.2 dBTP, 7.4 DR, 0.62 width) are for previews only. They must not ship. Live shows dashes until a file is loaded.

## 5. Open decisions for Kevin (ask, one at a time)
1. Does the "More measurements" bar stay, or is it removed?
2. Does the Codex-only rule for AIMM still stand, given the shell pushes on 11 Nov?
3. Disconnect confirmation: has Kevin tested the green-logo tap on the live site?

## 6. Next topic
- **The Mixbus tab.** Kevin's next topic. Start with a Preview in Place copy of the live page. Do not write code for it before Kevin has seen the preview and approved the direction. Read `docs/CLAUDE.md` and `docs/UI_CHANGE_PROCESS.md` first.

## 7. First steps for the new session
1. Check the live build stamp and origin/main (section 3). Confirm build `2026-11-11.07`, commit `92a94a85`.
2. Read `docs/HANDOVER.md` (top section, "CURRENT STATE") and `docs/CLAUDE.md` (hard rules).
3. Tell Kevin in one short message where things stand, and ask whether he has tested the green logo tap.
4. Wait for his answer before any repo or live change.
