# Mix Check feedback board — 2026-09-02

**This is the operating surface for Kevin's Mix Check feedback.** Every item below has the screenshot
Kevin marked up, what he asked for, who owns it, and its status. Agents work from this. The
coordinator updates it every turn. Kevin checks it instead of repeating himself.

- Live build on `main`: **`2026-09-02.4`** (`83802ae`) — the R3 post-ship fix round shipped.
- Header re-layout branch: `mixcheck-header-relayout` (`51163ed`, build `2026-09-02.5`) — NOT on `main`.

**Status legend:** `RULE` (standing) · `APPROVED` · `RENDER READY` (built, awaiting Kevin's yes) ·
`QUEUED` (not started) · `VERIFY` (needs a live check).

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

### 3 — Header re-layout. `RENDER READY` — Cat

![header relayout](03-header-relayout.png)

Move the **`Hip-Hop / Trap ‑8 LUFS / Settings`** cluster **down** onto the file-title row (right
side). Move **`Drop / browse WAV`** **into the transport bar**. (Earlier take: `03-header-relayout-early.png`.)

- Built on `mixcheck-header-relayout` (`51163ed`, build `2026-09-02.5`). Mix-Check-scoped — other
  8 tabs unchanged. Empty state: the transport card is the drop zone so the loader is always
  reachable.
- Render: `https://raw.githack.com/begb0037admin/aimm/mixcheck-header-relayout/index.html` +
  composite `relayout-review.png`.
- Kevin (2026-09-02): *"I think we can work with this."* → **awaiting firm approve + ff-only promote.**

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

### 9 — Tab strip: fill the whole row, no gap. `RENDER READY` (in #3) — Cat

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
