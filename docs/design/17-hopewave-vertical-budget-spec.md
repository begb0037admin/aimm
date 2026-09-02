# Spec — Hope-rail head vertical budget (re-spec of board item 4, feeds item 17)

**Author:** Jules (design) · **Date:** 2026-09-02 · **Status:** SPEC — numbers only, Markey implements on `hopewave-ptt-port`
**Targets:** `index.html` on `origin/main` build `2026-09-02.9` (`e13925e`)
**Supersedes:** the `#hopeWave` band size + `.rail-head` `padding-top` set by board item 4 (build `2026-09-02.6`). Item 4's *calibration goal* (first chat turn ~level with the top of the centre banner) is preserved unchanged.

---

## Why

Board item 4 gave `#hopeWave` a 34px reserved band and pushed the Hope block down with `.rail-head`
`padding-top:44px` so the first chat turn lands ~level with the centre banner top (item-4 review
measured first-turn top 222px vs banner top 224px). Kevin has now reviewed the PTT-waveform port
(item 17) and wants the wave **much deeper — PTT-parity — so it reads as "alive", not a flat
ribbon.** 34px is too shallow. This spec deepens the band to 60px and reclaims the extra height
from the dead space above the wordmark and from the wave's own top margin, so **the first chat
turn does not move**.

## The numbers

| Token | Selector | Before | After |
|---|---|---|---|
| band flex-basis | `#hopeRail #hopeWave` | `flex:0 0 34px` | `flex:0 0 60px` |
| band height | `#hopeRail #hopeWave` | `height:34px` | `height:60px` |
| band top margin | `#hopeRail #hopeWave` | `margin-top:22px` | `margin-top:10px` |
| rail-head padding — **base rule** (`index.html` ~line 1856) | `#hopeRail .rail-head` | `padding:44px 18px 18px` | `padding:30px 18px 18px` |
| rail-head padding — **`@media (min-width:1024px)` mirror** (~line 1954) | `#hopeRail .rail-head` | `padding:44px 18px 18px` | `padding:30px 18px 18px` |

Nothing else in `.rail-head`, `.rail-body`, `#aiChatTranscript` or the composer changes. The
`#hopeWave` grid definition (`repeat(54,1fr)`, `gap:1.5px`, `padding:0`, `align-items:center`,
`order:5`, `min-width:60px`, `align-self:stretch`, `box-sizing:border-box`) is unchanged — only
`flex-basis`, `height` and `margin-top` move.

### Band height — why 60px

- Range Kevin asked for: ~55–65px. **60px** is the midpoint and it is a real parity number, not a
  round guess:
  - PTT / Mini Float `.waveform-container` is `76px` tall with `8px 12px` padding →
    **inner wave-drawing area = 76 − 16 = 60px**. `#hopeWave` has `padding:0`, so a 60px band is
    byte-parity with PTT's inner wave area.
  - It lets Markey restore PTT's **native `paintBar(60,4)`** bar-height call instead of the shrunk
    `paintBar(26,3)` the 34px band forced (item 17 build notes, "adapted only where mechanically
    required" (a)). That adaptation can now be reverted — closer to true like-for-like.
- `margin-top` drops 22 → **10px**. The gap between the "chat & voice assistant" subtitle and the
  band stays deliberate but tighter, because the taller band now carries its own visual weight and
  no longer needs a big run-up to feel separated. 8–12px all read fine; 10px is the spec value.

### rail-head `padding-top` — why 30px

- Reclaim needed to hold the first-turn position = band growth = **+26px** (34 → 60).
- Split: **−12px** off `#hopeWave` `margin-top` (22 → 10) + **−14px** off `.rail-head`
  `padding-top` (44 → 30). 12 + 14 = 26. **Net vertical change of the rail-head = 0.**
- 30px above the 26px "Hope" wordmark is **comfortably clear of the top edge** — it is +8px over
  the pre-item-4 value (22px) that Kevin called cramped/clipped, and −14px under the item-4
  value (44px) he now reads as dead space. This trims the dead space without re-introducing the
  jam-to-the-top complaint.
- The wordmark's own anti-clip treatment from R3 round 17 (`.oz-rail-name`
  `overflow:visible; line-height:1.22; padding-top:1px`) is **untouched** — no ascender/descender
  clip regression.
- Both the base rule **and** the `@media (min-width:1024px)` mirror get `30px` — they must stay
  identical (item-4 review flagged this).

## Rail-head height — before → after

Approx component stack, desktop (`min-width:1024px`):

| Part | Before | After |
|---|---|---|
| `padding-top` | 44 | **30** |
| `.oz-rail-name` ("Hope" 26px × 1.22 + 1px) | ~33 | ~33 |
| `.oz-rail-status` (`margin-top:4` + 13px line) | ~22 | ~22 |
| `#hopeWave` `margin-top` | 22 | **10** |
| `#hopeWave` band | 34 | **60** |
| `padding-bottom` | 18 | 18 |
| `border-bottom` | 1 | 1 |
| **Total rail-head height** | **~174px** | **~174px** |

**Net change: 0px** (−14 padding-top −12 margin-top +26 band). The first chat turn therefore
stays at the same Y — item 4's "first turn ~level with the centre banner top" calibration is
preserved. `.rail-body` `padding-top:16` + `#aiChatTranscript` `padding-top:14` (item 14 split)
are untouched, so the ~30px rest above the first turn is unchanged.

## `#hopeRail` outer height + 3-column bottom-align — unchanged

- `#hopeRail` outer height is locked by the `@media (min-width:1024px)` rule:
  `grid-column:2; grid-row:1 / -1; align-self:stretch; height:0; min-height:100%`. It resolves
  against the grid row (the app-column height), **not** against `.rail-head` content. Changing the
  rail-head's internal budget cannot change `#hopeRail`'s outer height.
- Net rail-head change is 0px anyway; and even the sub-pixel line-height rounding is absorbed by
  `.rail-body` `flex:1` / `#aiChatTranscript` `flex:1 1 auto`, which soak any slack inside the
  fixed outer box.
- The 3-column bottom-align (`#mcSpecs` = `#mcActions` = `#hopeRail` bottom = **1315** loaded /
  **1214** empty, from the item-4 / item-14 / item-17 verification runs) is driven by the app
  column and **does not move**. Item 8's `height:0; min-height:100%` lock is not touched.

## For the render / review

Prove on the rendered branch build, desktop (≥1315 width) **and** a mobile width:
1. `#hopeWave` computed `height` = 60px, `margin-top` = 10px; bars visibly deeper / PTT-parity.
2. First chat turn top Y within ~±3px of the item-4 figure (was 222 vs banner 224) — chat start
   still level with the centre banner top.
3. "Hope" wordmark + "chat & voice assistant" subtitle not jammed to the top edge; no clip.
4. `#mcSpecs` = `#mcActions` = `#hopeRail` bottom still flush (loaded 1315 / empty 1214); page
   `scrollHeight == innerHeight` (rail still does not grow the page).
5. Idle + speaking states: band height identical (zero reflow when Hope starts talking).
