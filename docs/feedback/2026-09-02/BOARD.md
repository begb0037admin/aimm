# Mix Check feedback board — 2026-09-02

**This is the operating surface for Kevin's Mix Check feedback.** Every item below has the screenshot
Kevin marked up, what he asked for, who owns it, and its status. Agents work from this. The
coordinator updates it every turn. Kevin checks it instead of repeating himself.

- Live build on `main`: **`2026-09-02.4`** (`83802ae`) — the R3 post-ship fix round shipped.
- `mixcheck-header-relayout` (`51163ed`, build `2026-09-02.5`) — items 3 + 9, **APPROVED by Kevin**.
  Promote HELD so it folds into the Markey pass (one promote covers header re-layout + Hope rail + #10).
- Markey Hope-rail pass — branch off `mixcheck-header-relayout` — items 4, 5, 6, 8, 10 — **BUILDING**.

**Status legend:** `RULE` (standing) · `APPROVED` (Kevin said yes) · `BUILDING` (agent working) ·
`RENDER READY` (built, awaiting Kevin's yes) · `QUEUED` (not started) · `VERIFY` (needs a live check).

---

## ⏹ SESSION END — 2026-09-02 (Kevin out of usage → switching to main account)

- `main` @ `83802ae`, build **2026-09-02.4** — R3 fix round LIVE.
- **Items 3 + 9 APPROVED**, built on `mixcheck-header-relayout` (`51163ed`, build 2026-09-02.5).
  Kevin has the ff-only promote command but is **holding it** so it lands with the Markey pass in
  ONE promote (`git merge --ff-only <markey-branch-tip>` → carries header re-layout + Hope rail + #10).
- **Markey Hope-rail pass (items 4/5/6/8/10) — NOT started, nothing committed.** Markey did a
  read-only analysis with exact line numbers (below). Branch `hope-rail-pass` was created locally
  at base `51163ed` but has zero commits and is not pushed.
- **Item 7** — QUEUED for Cat, after the Markey pass lands.
- **Item 3 VERIFY** — not checked. Owed: clear chat, analyse a fresh track, confirm Hope answers
  directly and names no retired surface.

**RESUME, in order:**
1. Re-dispatch **Markey** for items 4/5/6/8/10, branch off `mixcheck-header-relayout` (`51163ed`),
   next build id `2026-09-02.6`. Use the line-number analysis below — it's verified, no code written.
2. Markey renders the real app (long transcript injected so #8 internal scroll + #4 spacing show)
   → Kevin reviews.
3. On Kevin's OK → **one ff-only promote** of Markey's branch to `main` (superset of `51163ed`).
   PowerShell from `C:\Users\admin\github\aimm`, `cd` in the same paste.
4. Dispatch **Cat** for item 7 off the new `main`.
5. Run the item-3 VERIFY check.

### Markey's implementation analysis (2026-09-02, read-only — no code written)

Base `51163ed` = build 2026-09-02.5. All line numbers are that build's `index.html`.

- **Item 4** — rail-head padding-top is in TWO desktop rules: `:1800` (`#hopeRail .rail-head{padding:22px 18px 16px}`)
  and `:1875` (the `@media(min-width:1024px)` one-liner). `#hopeWave` is the last child of
  `.rail-head` (markup `:1912`), currently `display:none` when idle (`:1810`, the "no idle presence"
  rule). Item 4 reverses that: reserved always-present band (`display:block;opacity:0` idle →
  `opacity:1` speaking). Gap before first message = bump `.rail-body` top padding in the `:1875`
  rule (currently `14px 16px`).
- **Item 5** — remove markup `:2150` (`#aiChatComposeResize`); remove `wireAiChatComposeResize()`
  (`:11283-11311`) + its call (`:11344`); remove CSS `:539-543` + `:1660-1662`. KEEP
  `getAiChatComposeHeight` / `setAiChatComposeHeight` / `AICHAT_COMPOSE_HEIGHT_KEY` — still used by
  the snapshot-recall path at `:6032-6034`.
- **Item 6** — both buttons already exist + wired. `#aiChatClear` ("Clear chat", handler
  `aichatClear` `:11342`) hidden by CSS `:1825`; `#aiChatImageBtn` ("Attach screenshot") hidden by
  CSS `:1842`. Flip those two `display:none` rules; give `#aiChatClear` a rail pill style mirroring
  `#aiChatImageBtn` (`:1677-1678`). Keep `#aiChatClearInput` hidden. Row order already
  Send | mic | speaker | Attach | Clear — no reorder.
- **Item 8** — `.container` is `grid-template-columns:minmax(0,1fr) var(--hope-w)`, `align-items:start`,
  no explicit rows → single implicit row sized to tallest child, so a long transcript inflates the
  page. `#hopeRail` rule `:1735` currently `align-self:stretch;height:auto;max-height:none`. Fix:
  `height:0;min-height:100%` on that rule. Then in the `:1875` block: `.rail-body` → `overflow:hidden`,
  `#aiChatTranscript` → `overflow-y:auto` + thin-scrollbar CSS, `.aichat-compose` → `flex:0 0 auto`.
  Headless-verify `min-height:100%` resolves against the grid area (expected yes in Chrome).
- **Item 10** — LOADED-state compact `#mcInput` form was added on the header-relayout branch as a
  plain dark button. Change `#eq.oz-mixcheck #mcTransport .ref-transport .mc-input-main{...}` + its
  `:hover` (additions in `git diff 83802ae 51163ed -- index.html`) to carry
  `background:var(--grad);color:var(--grad-ink)` like the empty-state `.mc-input-main` (`:1273`),
  keeping the compact padding. Label swap via `placeMcInput()` shim, unchanged.
- **Render pattern** — headless CDP + synth-WAV + inject `AICHAT.history` turns is documented in
  `markey/memory/aimm-hope-mixcheck-awareness-restore-2026-09-02.md` (+ the backtick-in-template-literal hazard).

---

## Context — why the live site looked wrong mid-session

![old build](00-going-backwards-old-build.png)

Screenshot `00` (Kevin: *"why are we going backwards"*). This was **build `2026-09-01.9`** — the
`git push origin main` had not landed yet (wrong directory). Everything here (fake INTRO/VERSE
labels, `.wav` in the header, Hope asking about a "Session Snapshot", the MIX BREAKDOWN card,
HIGH −13.2) is the *pre-fix* build. After the push landed, `main` = `2026-09-02.4` with all 9
fixes. Not a regression — a missed push.

---

## The list

### 1 — No wireframes. `RULE`

Kevin opened the grey Jules wireframe and: *"This is the worst… I'm losing the will to live."*
**Every proposal from here is rendered from the real app** (branch + raw.githack + screenshot),
never a paper prototype. Wireframe review is off.

### 2 — Hope rail header look — keep it. `APPROVED`

![hope header](02-hope-header-keep.png)

*"I want this."* The shipped Hope identity treatment (✨ stars, "Hope" blue→purple wordmark,
"chat & voice assistant", the `#hopeWave` gradient bars) is signed off. Do not restyle it.

### 3 — Header re-layout. `APPROVED` — Cat (built `51163ed`)

![header relayout](03-header-relayout.png)

Move the **`Hip-Hop / Trap ‑8 LUFS / Settings`** cluster **down** onto the file-title row (right
side). Move **`Drop / browse WAV`** **into the transport bar**. (Earlier take: `03-header-relayout-early.png`.)

- Built on `mixcheck-header-relayout` (`51163ed`, build `2026-09-02.5`). Mix-Check-scoped — other
  8 tabs unchanged. Empty state: the transport card is the drop zone so the loader is always reachable.
- **Kevin approved 2026-09-02.** Promote HELD so it lands together with the Markey pass + item 10.

### 10 — WAV-loader button: same style in both states. `QUEUED` — Markey (folds into the Hope-rail pass)

![loader button states](10-loader-button-consistency.png)

Cat's loaded-state loader (`Load WAV ▾`, compact, in the transport row) renders **plain dark** —
the empty-state one is the **blue→purple gradient** `Drop / browse WAV`. Kevin: the gradient
treatment must stay after a file is dropped. Compact size is fine in the loaded state; the
fill/gradient/style must match the empty-state button.

### 4 — "Hope's domain" — drop Hope down, drop the chat down. `QUEUED` — Markey

![hopes domain](04-hopes-domain.png) ![alignment](04b-hopes-domain-alignment.png) ![drop down](04c-drop-hope-and-chat-down.png)

The whole Hope identity zone (stars, name, subtitle, **speech wave**) is **"Hope's domain"**.

**It is whitespace, not font size** (Kevin, screenshot `04c`: *"this is the room to breathe — not
the text/font/name"*). Three moves:
- **Drop the Hope block down** off the top edge — vertical space *above* "Hope" so it isn't jammed
  against the rail top.
- **Drop the chat down** — a clear gap *between* the Hope block and the first message; the
  conversation starts lower.
- The gap that opens is **room for the `#hopeWave` speech wave** — it gets its own clear band
  between the "chat & voice assistant" subtitle and the first chat turn, not crushed against the
  transcript (Kevin: *"then we will have breathing space for the speech wave"*).
- Do **not** enlarge the "Hope" wordmark or pad tight around it — the name treatment is locked (item 2).

Alignment (screenshot `04b`): the chat's start aligns to the **yellow line** — level with the top
of the centre banner, i.e. just below the header controls row. Nothing from the chat appears above
that line (the top "YOU / About fix #02" turn — red X — should not be up in Hope's zone).

### 5 — Remove the dead drag bar. `QUEUED` — Markey

![drag bar](05-dead-drag-bar.png)

The transcript↔composer drag handle (`trapMasterAiChatComposeHeight_v1`) does nothing in the rail
layout. Remove it.

### 6 — Composer: add Clear-chat + Upload-screenshot buttons. `QUEUED` — Markey

![composer](06-composer-buttons.png)

Add a **Clear chat** button (new) and an **Upload screenshot** button to the composer row.
The screenshot button is a **restore** — `#aiChatImageBtn` (drag/drop/paste, vision-aware send)
exists but was hidden in the R3 strip pass. Un-hide it and place it in the composer row.

### 7 — Fix Queue frequency bar: the brown wash. `QUEUED` — Cat (after #3)

![brown bar](07-fixqueue-brown-bar.png)

Item `#01` is a **broadband** fix (`FOCUS broadband`) — no frequency range — so the band graphic
renders an empty full-width wash. The **brown** is orange (`#f97316`) at low opacity over the dark
card; brown isn't in the palette. Fix: broadband items draw **no** frequency band (or a broadband
indicator); band items get a **solid clear** fill, not a low-alpha wash.

### 8 — Rail must not grow the page. `QUEUED` — Markey

![chat overflow](08-chat-overflow.png)

The Hope rail is growing the whole document — a long transcript pushes the dashboard out of view.
Rail is **height-locked to the dashboard** (the yellow line = the centre column's bottom). Long
transcripts **scroll inside the transcript area** with a minimal/hidden scrollbar. The page never
extends past the dashboard. (Pairs with #4 — same boundary.)

### 9 — Tab strip: fill the whole row, no gap. `APPROVED` (in #3, `51163ed`) — Cat

![tab strip](09-tabstrip-full-width.png)

The strip stops short of the right edge. It must **fill the row edge-to-edge**, right end aligned
with the panel grid below it, **zero trailing gap**. Tabs can be larger to fill it. (Earlier take
on the review artifact: `09-tabstrip-early.png`.)

- Done in the `mixcheck-header-relayout` branch: indent rule deleted, taller padding, container
  spans the full column, `flex:1 1 0` tabs fill it. CDP-measured: strip right edge = analyser grid
  right edge (1020px), no gap. **Verify in Kevin's render.**

---

## Question (answered — not an action)

![corridor research](Q-corridor-research.png)

*"How has this been researched?"* — The corridors are computed from **Elowsson & Friberg 2017**
(measured LTAS of 12,345 commercial masters, BS.1770‑4), corroborated by **Pestana et al. 2013**
(772 #1 singles) + cited practitioner references; iZotope Tonal Balance Control informs the model
only (no numeric curve published). Full write-up: `docs/corridor-retune-spec.md` on `main`.
One parameter still needs Kevin's ear — **low-band elevation for bass genres** (test in §6: load
3–5 trusted trap masters, Target = Trap, average the LOW meter).

---

## VERIFY — item 3 (Hope awareness) on the live build

Screenshot `08` is build **`2026-09-02.4`** (the fixes) and Hope **still** replies *"Was it from a
Session Snapshot / the Repair tab / your Insight tab?"* to "about fix #02". Either the fix isn't
working live, or that's **persisted chat history** (`AICHAT_HISTORY_KEY`, last 50 messages) shown
after a reload. **Needs a clean check:** clear the chat, analyse a fresh track, ask Hope about a
fix — confirm she answers directly and names no retired surface. Until then item 3's live status is
unconfirmed.

---

## Sequencing

1. **Cat — now:** #3 + #9 render ready → Kevin approves → ff-only promote (`git merge --ff-only 51163ed`).
2. **Cat — next:** #7 (Fix Queue bar), own branch off updated `main`.
3. **Markey — after #3 lands:** #4, #5, #6, #8 in one Hope-rail pass → render → Kevin approves → promote.
4. **Coordinator — parallel:** the item‑3 VERIFY check.
- Nothing reaches `main` without Kevin's explicit approval on a real-app render.
