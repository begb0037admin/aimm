# SESSION HANDOVER — AIMM Mix Check — 2026-09-02 (evening)

Session ended on low usage. Two agents (Cat mechanical, Jules spec) were stopped
mid-run; **neither pushed anything**, no partial work exists. Working tree clean
on `main`.

---

## LIVE STATE — `origin/main` @ `e9bcd8a`, build `2026-09-02.15`

The 2026-09-02 Mix Check feedback round is essentially **shipped**. Live at
https://begb0037admin.github.io/aimm/ — feedback items **1–15** (16 folded into
15), **17, 18, 20** promoted across builds `.5`–`.15`:

| Items | What |
|---|---|
| #3 / #9 | Header re-layout |
| #2 / #4 / #5 / #6 / #8 | Hope-rail pass |
| #7 / #10 / #12 / #13 | Fix Queue + transport batch |
| #14 | Transcript layout |
| #17 | `#hopeWave` PTT waveform port |
| #18 | Viewport-fit density |
| #20 | Page gutter |
| **#15 / #16** | **Fix "production line" — BOTH sides live** |

**Item 15 behaviour now live:** the current fix renders as an ACTION-ITEM card in
Hope's chat. Mark it done (the card's `✓ Mark done` button, or say "done" to
Hope) → that card leaves → the next fix's card appears at the bottom of the chat
→ the next fix moves to UP NEXT on the left panel → repeat → "ALL CLEAR" card
when the queue is empty. Queue side = build `.13` (`ac2cd9c`), Hope side = build
`.15` (`e9bcd8a`). Headless-verified by Markey.

---

## PENDING — Kevin must run one merge

**`roadmap-mixcheck-queue` @ `4424590`** — `ROADMAP.md` + `DASHBOARD.html` only.
Reconciles the roadmap: all shipped feedback items moved to "Recently shipped",
the 6 remaining items queued as backlog IDs 9–14 (feedback `#N` kept in titles).
Fast-forward-clean off `e9bcd8a`. Kevin was asked several times and has not run
it. Command:

```powershell
cd C:\Users\admin\github\aimm
git fetch origin
git merge --ff-only origin/roadmap-mixcheck-queue
git push origin main
```

Also pending: fold this session-handover doc + the first-run/empty-state bundle
entry into the roadmap once merged.

---

## GOVERNANCE ISSUE — investigate before next Markey dispatch

Markey's branch work reached `origin/main` **twice without Kevin running the
promote**:

- build `.14` (`4092d1c`) — was broken (Kevin tested it: fix card didn't appear
  in chat, old retired-tab wording showed). Kevin rolled `main` back to
  `ac2cd9c`.
- build `.15` (`e9bcd8a`) — tested-good; Kevin chose to keep it.

Both landed right after a Markey agent completed, both despite briefs stating
"push branch, do NOT merge, do NOT push to main". `e9bcd8a`'s own commit message
says "NOT promoted". Reflog shows only "update by push" (no author). An agent or
its tooling is pushing to `main` — find out how and stop it.

---

## QUEUE — agreed order (Kevin put the first-run bundle AHEAD of #21)

### 1. First-run / empty-state bundle  *(Kevin's main ask this session)*

When he opens the URL: land on **Mix Check** (not Conversation), full layout
visible but **blank** with no track, and it must **not** auto-reopen the last
track/chat. Then:

- **Friendly non-modal empty state** — an "upload your first track" call-to-action
  plus light tutorial-style pointers at the real controls. Kevin explicitly
  dislikes the current popup — must not be a blocking modal.
- **Hope rail open on load with a welcome line** (no chat history).
- **Session-resume list in the Hope rail** — past tracks worked on, newest-first,
  date-ordered, each row clickable to resume that session.

Build split:

- **MECHANICAL — Cat** (redispatch). Branch off `e9bcd8a`, build → `2026-09-02.16`,
  `index.html` only:
  1. Default active tab = Mix Check. Markup hardcodes `active` on
     `button.tab[data-tab="voice"]` (~2135) + `#voice` panel (~2208); move it to
     `data-tab="eq"` (~2118) + `#eq`. The Mix Check engine lazy-inits on first
     `eq`-tab click (`eqGridInit` ~15157/15399, `refIdleAnimate` ~16040, idle
     spectral animation) — add an on-load init path so it renders with no click.
     Keep the `voiceTabBtn.click()` / force-active branches (~6179, ~6550) firing
     for real calls, not on load.
  2. Full Mix Check grid renders with **no track** — AUDIO SPECS, SPECTRAL
     BALANCE (idle), FIX QUEUE, transport all present but blank, not hidden.
     Extend the empty state at ~`index.html:9033` ("keep the original onboarding
     panel"). Keep item 18 density, item 20 gutter, 3-col bottom-align intact.
  3. Stop the last-session auto-restore on load — open clean every time. Do NOT
     delete persisted data (Snapshots, chat history, profile stay); just gate the
     rehydrate.
  - Do NOT build the friendly prompt / coach marks / Hope welcome / session list
    (that's Jules-spec'd). Do NOT touch `#mcWave`, the Hope rail internals, the
    `window.mcFixQueue` contract.
- **DESIGN — Jules** (redispatch). Spec only (`docs/design/`), no build:
  the friendly empty state + non-modal coach marks (copy, pointer positions,
  visual treatment, dismissal), the Hope welcome copy + layout, the session-list
  row layout (track name / date / one-line summary), how many rows, the no-history
  case, and what must be persisted per session. Hand wiring points to Markey.
  Reference `index.html:9033`.

The standalone "default tab" item is folded into this bundle.

### 2. #21 — section detection + issue markers on the transport waveform

Real INTRO / VERSE / CHORUS / BRIDGE detection **and** an **orange issue marker
for each Fix Queue problem** at the track position where that band deviation
peaks, clickable to seek there and listen. Additive overlay on the **LOCKED**
`#mcWave` canvas — never a redraw. Needs time-localised (per-window / per-section)
band-deviation analysis, not the current whole-track aggregate — builds on the
windowed feature extraction the section detection needs. This is the real version
of the "issue pins" removed in R3 post-ship #4/#5. **Cat builds, Jules specs the
overlay.** Effort **L**. Old Backlog 7 ("real arrangement detection") is
superseded by this.

### 3. #22 — Read-aloud button

Replace the composer-row mute/speaker toggle (Kevin: "useless… I would just be
spending credits for nothing"). New behaviour: text highlighted in the chat
transcript → speak just the selection; nothing selected → read the last Hope
message. **ElevenLabs TTS, Hope's voice**, spend into the EL bucket. **First
check** the `aimm-proxy` `ELEVENLABS_API_KEY` secret is a valid `sk_…` key —
known bad: it is currently a key *ID*. There is a dormant read-aloud TTS path
(`aichatSpeak`, `data-dormant="aichat-readaloud"`) to build on. **Markey.**

### 4. #19 — Capture PC / tab audio

A control to capture whatever is playing on the machine (e.g. Spotify) via
`getDisplayMedia` tab-audio and run it through the Mix Check analyser like a
loaded file. Regression — used to work, no button now. **First step:** confirm
whether it was ever built or only planned. **Markey** (capture) + **Cat** (wire
into analyser).

### 5. #3 — Hope tab-awareness verify + persisted-history fix

The instruction text on `main` is **already fully reconciled** (Markey confirmed:
`RT_INSTRUCTIONS`, `buildAppKnowledgeDigest`, `buildMixCheckContextBlock`,
`get_context` desc, `eq` focus block all forbid it). The retired-surface wording
("Was it from a Session Snapshot / the Repair tab / your Insight tab?") only
reappears from **pre-fix persisted chat history**
(`trapMasterAiChatHistory_v1` / `AICHAT_HISTORY_KEY`) replaying on load.
**Permanent fix = bump the history key** so pre-fix turns don't replay. Then
verify on a clean live build. **Markey.**

Note: "Request failed: Failed to fetch" in Hope's chat on a **raw.githack render**
is EXPECTED — the render has no API key and CSP blocks the call. Not a bug; does
not happen on the live site with a key saved.

### 6. #6 — "Clear chat" button wraps

Wraps to its own line at narrow rail width (≲380px). Graceful degradation;
Kevin's call whether to force single-line. Non-blocking. **Markey.**

---

## STANDING PROCESS (unchanged)

- `agent-commons/SESSION_PROTOCOL.md` §8 — stay within accountable scope, hand
  back out-of-scope work naming the right owner.
- **Jules specs AIMM layout/CSS · Cat implements · Markey only voice/chat wiring.**
- Real-app render (raw.githack) → **Kevin visual approval** → one branch → Kevin
  promotes with a `cd`-prefixed PowerShell ff-only block. **Never a wireframe.**
- Mix Check work is tracked on `ROADMAP.md` + `DASHBOARD.html` (outstanding +
  shipped) — the standing record, not chat lists. Keep "feedback #N" in titles.
- `#mcWave` transport canvas is **LOCKED** (see `docs/CLAUDE.md` hard rules).
- No emoji as UI icons anywhere in the app (typographic glyphs only).
- Bump `AIMM_BUILD` on every `index.html` commit.

---

## RESUME TOMORROW — ordered

1. Kevin runs the `roadmap-mixcheck-queue` ff-only merge (command above).
2. Coordinator adds the first-run/empty-state bundle to the roadmap ahead of #21;
   folds in / deletes this `SESSION-HANDOVER-2026-09-02.md` once absorbed.
3. Redispatch **Cat** (first-run mechanical, build `.16`) and **Jules** (first-run
   design spec) — briefs are section "QUEUE › 1" above, verbatim-usable.
4. Investigate the Markey-to-`main` push before the next Markey dispatch.
5. Then **#21**.
