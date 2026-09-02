# Feedback board item 18 — Mix Check fits one viewport at 100 % zoom (density spec)

**Owner:** Jules (spec) → Cat (build). Jules does not implement.
**Status:** SPEC READY — awaiting Kevin's call on the two tradeoffs in §7, then Cat builds to this.
**Date:** 2026-09-02. Base measured against `origin/main` @ `e13925e`, build `2026-09-02.9`, at 1920×1080.

---

## 1. Target dashboard height + reference viewport

| | value |
|---|---|
| **Design target (3‑col flush, loaded state)** | **≤ 950 px, design point 915–940 px** |
| Current (loaded) | ~1315 px (board figure) — reconstructed ~1262–1315 depending on Fix‑Queue depth / header‑actions wrap |
| Overall vertical compression | ≈ 0.71× on the dashboard; ≈ 0.70× on the reducible mid‑section (analyser + specs list + transport), ≈ 0.85× on the shell chrome, **1.0× (untouched)** on the calibrated zones (see §6) |
| **Reference viewport** | **1920 × 1080 @ 100 %, browser maximised** |

**Why 915–940, and why that reference:**

- 1920×1080 maximised, Chrome/Edge with tab‑strip + address bar, **no bookmarks bar**, Windows taskbar visible:
  usable height ≈ 1080 − 40 (taskbar) − ~88 (browser chrome) ≈ **952 px**. A 915–940 dashboard clears it with
  10–35 px headroom — this is exactly Kevin's "give it a little more headroom / ~95 %" instinct, and it is the
  reason the target is not simply "= 952".
- 1920×1080 with a bookmarks bar shown: usable ≈ 920 px → the 915 design point still fits, with ~0 headroom.
- The single biggest lever (the analyser canvas) has a **usefulness floor of ~180 px** (§6). Even with every
  other cut maxed, the dashboard floor is ~960 px *unless* two Kevin decisions in §7 are taken — those get it to
  ~915. So the honest position is: **~1000 px is reachable with zero calibration risk; 915–940 needs §7.**

**Open — Kevin's actual viewport.** This spec is built for 1920×1080. Kevin's Mix Check screenshots do not carry a
window size. Cat must re‑measure the built result against Kevin's real screen on the render. If Kevin is on a
14"/13" laptop (1512×864, 1440×900 → usable ~740–780 px) the page will still scroll ~140–180 px after this pass —
closing that gap means taking the analyser below its usefulness floor, which defeats the Tonal‑Balance view. See
§7.3.

---

## 2. How the height is built today (measured, 1920×1080)

Vertical stack, document top → dashboard bottom (loaded state):

```
  16   .container padding-top
  39   .header-top  (slim brand bar)
  16   .app-col gap
  67   .tabs.oz-tabstrip           ← mostly padding (item 9 made it taller)
  16   .app-col gap
─ grid starts (row-gap = --gutter = 16) ─
  36   .mc-head
  16   grid row-gap
  49   #refHopeBox.mc-banner
  16   grid row-gap
 ~176  #mcTransport (loaded: control row + #mcWave box 104 + padding 28)
  16   grid row-gap
 ┌ left col  #mcSpecs  ~799  ── THE HEIGHT DRIVER (both states) ──┐
 └ right col  .oz-spec-card 498  + gap 16 + #mcActions ~210 = ~724 ┘
= dashboard bottom ≈ 1262–1315
```

Key facts that shape the spec:

- **The left column (`#mcSpecs`, Audio Specs) is the flush‑height driver** in both empty and loaded states
  (measured `#mcSpecs` h ≈ 799 vs right column ≈ 724). Trimming the Audio Specs list reduces the dashboard
  height 1:1 until the two columns balance (~560 px each) — past that point further list cuts only add internal
  whitespace.
- The analyser canvas (320 px) is the largest single element but lives in the **non‑driving** column — shrinking
  it keeps proportion and covers taskbar‑visible / bookmarks‑bar cases, but does not move the flush line until
  the right column becomes the driver.
- `#mcWave` **canvas rendering is LOCKED** (CLAUDE.md). Only its container box `.mc-wave-box{height}` may change.

---

## 3. Per‑component spec — deltas Cat applies

All selectors are `#eq.oz-mixcheck`‑scoped unless flagged **[shell]** (affects other tabs / the Hope rail — see
§5). Line numbers are `origin/main` @ `e13925e`. "Δ" is the vertical px saved on that element.

### A. Shell chrome above the grid — **[shell]**

| Selector | Prop | Now | New | Δ |
|---|---|---|---|---|
| `.tabs.oz-tabstrip .tab.oz-tab` (~1808) | `padding` | `11px 8px` | `7px 8px` | −8 |
| `.tabs.oz-tabstrip .tab.oz-tab .tab-ico svg` (~1218 / ~1801) | `width`/`height` | `18px`/`16px` | `16px`/`14px` | −2 |
| **tab strip block** | height | ~67 | **~57** | **−10** |
| `.header-top` (~22) | vertical padding / content | h ~39 | slim to **~30** (tighten `h1` line-height + any inner padding) | −9 · *tier‑2, see §7.2* |

`.header-top` and the two `.app-col` gaps (16 px) are **left at their current values in tier 1** to keep the
banner‑top line fixed for Hope‑rail alignment (item 4b). Tier 2 reclaims the brand bar (§7.2).

### B. Grid head + banner (keep the *top* geometry fixed — only shrink downward‑growing padding)

| Selector | Prop | Now | New | Δ |
|---|---|---|---|---|
| `#refHopeBox.mc-banner` (~1448) | `padding` | `14px` | `9px` | −10 |
| `#refHopeBox.mc-banner` | `align-items` | `flex-start` | `center` | 0 |
| `#refHopeBox.mc-banner` | `line-height` | `1.5` | `1.4` | −3 |
| `.mc-banner .mcb-ico` (~1453) | size | `18px` | `15px` | 0 (fits the line) |
| **banner** | height | 49 | **~36** | **−13** |
| `.mc-head` (~1242) | `padding` | `2px 0` | `2px 0` — **unchanged** | 0 |
| `.mc-ttl` (~1297) | `font-size` | `24px` | `24px` — **unchanged** (item 2 / item 3 parity) | 0 |

Banner padding shrinks the banner *downward* (its top is set by the row above), so this is safe for item 4b.
The banner keeps its dismiss `×` and gradient border. Desktop is one line; the `≤1023px` wrap rule is untouched.

### C. Transport — `#mcWave` **canvas untouched, box only**

| Selector | Prop | Now | New | Δ |
|---|---|---|---|---|
| `.mc-wave-box` (1589) | `height` | `104px` | **`72px`** (floor 64) | −32 |
| `.mc-wave-box` `@media ≤1023` (1085) | `height` | `88px` | `64px` | (mobile; desktop‑only app) |
| `#mcTransport` (1250) | `padding` | `14px` | `10px` | −8 |
| `#refDzLoaded.visible` (1560) | `gap` | `12px` | `10px` | −2 |
| **transport (loaded)** | height | ~176 | **~134** | **−42** |

72 px still shows the min/max peak envelope, the played‑span wash and the advancing playhead clearly — Cat to
confirm on the render that `MC_WAVE.draw()` (reads `clientHeight`) stays legible; if not, 80 px is the fallback.
The volume slider (item 13, `.tp-vol` h 32) and the loader button (item 10‑rev, `.mc-input-main`) sit in the
control row and are **not touched** — they already fit the 32 px row.

### D. Spectral Balance analyser (right column)

| Selector | Prop | Now | New | Δ |
|---|---|---|---|---|
| `.oz-spec-canvas-wrap` (1466) | `height` | `320px` | **`200px`** (tier‑1) / **`180px`** (tier‑3 floor) | −120 / −140 |
| `.oz-spec-head` (1462) | `margin-bottom` | `10px` | `8px` | −2 |
| `.oz-band-grid` (1470) | `margin-top` | `14px` | `10px` | −4 |
| `.oz-band-card` (1472) | `padding` | `11px 13px` | `9px 12px` | −4 |
| `.oz-band-val` (1475) | `font-size` / `margin-top` | `22px` / `4px` | `18px` / `3px` | −5 |
| `.oz-band-bar` (1485) | `margin-top` / `margin-bottom` | `10px` / `16px` | `7px` / `10px` | −9 |
| **analyser card** | height | ~498 | **~348** (tier‑1) / ~328 (tier‑3) | **−150 / −170** |

**200 px is the recommended floor for keeping the view useful.** The corridor band + the live mix line still
show clear vertical separation and enough dB range to read "hot / on‑target / low". The 4 axis labels
(Low / Low‑Mid / High‑Mid / High) are `position:absolute; bottom:8px` and stay put. **Below ~180 px** the
corridor thickness and the mix‑line headroom compress to the point the Tonal‑Balance comparison stops being
readable — do not go lower (§7.1).

### E. Audio Specs — `#mcSpecs`, the **height driver**

| Selector | Prop | Now | New | Δ |
|---|---|---|---|---|
| `.mc-kick` (1365) | `margin-bottom` | `9px` | `6px` | −3 |
| `.mc-tiles .mc-tile` (1367) | `padding` | `9px 8px` | `7px 8px` | −4 |
| `.mc-tile-v` (1369) | `font-size` | `19px` | `17px` | −2 |
| `.mc-rows` (1371) | `margin-top` | `12px` | `8px` | −4 |
| `.mc-row` (1372) | `padding` | `7px 0` | **`5px 0`** | −4 / row |
| `.mc-row` | `font-size` | `11.5px` | `11px` | ~−0.5 / row |
| `.mc-sw` (1382) | `padding` | `0 0 12px 15px` | `0 0 8px 15px` | −4 |
| `.mc-tiles-2` (1412) | `margin-top` | `14px` | `9px` | −5 |
| `.mc-tiles-2 .mc-tile` (1413) | `min-height` / `padding` | `54px` / `9px 6px` | `44px` / `7px 6px` | −10 |
| `.mc-tiles-2 .mc-tile-v` (1416) | `font-size` | `19px` | `16px` (keep `.fit1`/`.fit2` steps) | −3 |
| `.mc-cls` (1396) | `margin-top` / `padding-top` | `16px` / `10px` | `10px` / `6px` | −10 |
| `.mc-cls-h` (1397) | `padding` | `10px 0 2px` | `6px 0 2px` | −4 |
| **`#mcSpecs` subtotal (no row removal)** | height | ~799 | **~678** | **−121** |
| **+ hide the 5 "with full analysis" placeholder rows** — Dissonance (metrics) + Subgenre / Production style / Energy / Mood (CLASSIFIED): `display:none` until the offline analyst phase populates them | | 5 rows shown | 5 rows hidden | **−~115** |
| **`#mcSpecs` after placeholder hide** | height | ~799 | **~563** | **−236** |
| **+ tier‑2: 2‑column the plain metric‑row list** (RMS·Crest·LRA·Phase·Width·SR·LUFS‑st·TP·Headroom·Noise → 2 per line; the stereo‑width widget, the `.mc-tiles-2` and CLASSIFIED stay full‑width) | | ~10 rows | ~5 rows | **−~115** |
| **`#mcSpecs` tier‑2** | height | ~799 | **~448** | **−351** |

### F. Fix Queue — `#mcActions`

| Selector | Prop | Now | New | Δ |
|---|---|---|---|---|
| `#mcActions.oz-card` (via `.oz-card` 1238) | `padding` | `14px` | `11px` | −6 |
| `.mcq-head` (1503) | `margin-bottom` | `12px` | `9px` | −3 |
| `.mcq-card` (1518) | `padding` / `margin-top` | `12px 14px` / `10px` | `10px 12px` / `8px` | −6 |
| `.mcq-mini` (1526) | `height` | `34px` | `24px` | −10 |
| `.mcq-fx` (1525) | `margin-top` | `9px` | `7px` | −2 |
| `.mcq-row` (1522) | `margin-top` | `5px` | `4px` | −1 |
| `.mcq-meta` (1536) | `margin-top` | `6px` | `5px` | −1 |
| `.mcq-acts` (1537) | `margin-top` | `10px` | `8px` | −2 |
| `.mcq-hint` (1545) | `margin-top` / `padding-top` | `9px` / `8px` | `7px` / `6px` | −4 |
| **Fix Queue card** | height | ~210 | **~175** | **−35** |

`.mcq-mini i` (item 7's solid `#f97316` position marker) rule is **unchanged** — only the strip it sits in
gets shorter. The card stays fully actionable (rank · title · FOCUS/IMP/CONF · dismiss · Ask Hope · expand).

### G. Grid gaps

Leave the `#eq.oz-mixcheck` grid `gap` at **16 px** in tier 1 — dropping it to 12 px moves the banner top up
4 px and breaks item 4b's ~2 px tolerance for a mere 12 px saving. Tier‑2 option: scoped `row-gap:12px` on the
grid **plus** Markey re‑tracks `.rail-head` `padding-top` −4 px (§5).

---

## 4. Result — three tiers

Effective flush height = `columns‑top` + `max(left col, right col)`.

| | tier 1 — zero calibration risk | tier 2 — + §7.2 (brand bar) + §7 2‑col specs | tier 3 — + analyser 180 + Fix‑Queue tight |
|---|---|---|---|
| `columns‑top` | ~466 | ~449 | ~445 |
| left col `#mcSpecs` | ~563 | ~448 | ~448 |
| right col (analyser + Fix Queue) | ~539 | ~532 | ~504 |
| driver | left | right | right |
| **dashboard flush height** | **~1029** | **~1005** | **~962** |
| + tier‑3 shell cut (tab strip → 48, wave‑box → 60, grid gap → 12 w/ Markey re‑track) | | | **~915** |

- **Tier 1** ships with every current calibration intact. Fits a 1080p screen only when the browser is
  maximised with **no** bookmarks bar and the taskbar auto‑hidden.
- **Tier 3 + shell cut (~915)** is what actually delivers Kevin's "fits at 100 % with headroom" on a normal
  1080p setup. It needs the two §7 decisions.

**Recommended:** build **tier 2** (~1005) as the baseline — it is all low‑risk — and let Kevin decide on the
render whether to push to tier 3 + shell cut for the headroom.

---

## 5. Hope rail — impact + Markey coordination

The rail is height‑locked to the dashboard (`#hopeRail{height:0;min-height:100%}` against `grid-row:1/-1`).
Shrinking the dashboard from ~1315 → ~915–1005 shrinks the rail by the same amount.

**Does it still work?** Yes. Rail non‑transcript furniture ≈ `.rail-head` 175 + composer ~150 + quick‑prompts/
bar ~40 ≈ 365 px. At a 915 px rail: 915 − 365 ≈ **550 px** for the transcript region — far above
`#aiChatTranscript{min-height:110px}`; the mask‑fade top (item 14) and internal scroll (item 8) are unaffected.
The `#hopeWave` 34 px reserved band (item 4 / item 17) is **not touched by this spec** and does not reflow.

**One real coordination item — item 4b (chat starts level with the banner top line):**

- Tier‑1 shell cut is the tab strip only (−10), so the banner top rises from ~206 → **~196**.
- `.rail-head{padding-top:44px}` (item 4's calibration) is fixed → the first chat turn stays at ~222.
- Net: the first turn would sit ~26 px **below** the banner line (item 4b calibrated it to ~level, within 2 px).

**Resolution (Markey owns `.rail-head` — needs a quick re‑verify, not a redesign):** drop
`.rail-head{padding-top}` 44 → **~30**, and nudge `.rail-body{padding-top}` to match, so the first turn re‑lands
~level with the new banner top. This is also a **density win** — `.rail-head` is currently 175 px tall; −14 px
there is free room for the transcript. If tier‑2's brand‑bar cut (−9) and/or grid‑gap cut (−4) land, add those
to the re‑track (44 → ~17).

**Zero‑coordination fallback:** do not cut the tab strip (keep 67). Banner top stays at 206, item 4b untouched,
and the lost 10 px comes from analyser 200 → 190. Loses ~10 px of budget only.

Nothing else in the rail (item 8 height‑lock, item 14 transcript layout, item 17 `#hopeWave` port, the composer
row from item 6, the volume slider from item 13) is touched by this spec.

---

## 6. Held at 1.0× — do not compress

| Zone | Why |
|---|---|
| `#mcWave` canvas rendering (the min/max peak bars, played wash, playhead, seek) | LOCKED — CLAUDE.md. Only `.mc-wave-box{height}` moves. |
| `.mc-ttl` 24 px title + the `AImixMasters` wordmark / `Hope` wordmark treatment | item 2 (locked), item 3, design‑system.md brand section |
| `.rail-head` `padding-top` **as a number Jules sets** | item 4 is Markey's calibration — Jules flags the new target, Markey re‑tracks and re‑verifies |
| `#hopeWave` 34 px reserved band + its `margin-top:22px` | item 4 / item 17 — reserved slot, no reflow |
| The analyser **below 180 px** | Tonal‑Balance corridor vs mix‑line comparison stops being readable |

---

## 7. Tradeoffs for Kevin to decide

### 7.1 Analyser floor
200 px keeps the corridor/mix‑line comparison comfortably readable; 180 px is the hard floor and buys ~20 px.
Anything lower guts the feature. **Decision: is 180 acceptable, or hold at 200 and accept ~20 px more height?**

### 7.2 Brand bar
The slim top brand bar (`.header-top`, ~39 px) sits above everything and every px there also shortens the Hope
rail. Slimming it to ~30 px (−9) is safe visually. **Decision: slim it, or leave it?**

### 7.3 Reference screen — the big one
- Design for **1920×1080 maximised** (this spec): tier 3 + shell cut ≈ 915 px fits with headroom; sub‑1080p
  laptops (14"/13", ~740–780 px usable) still scroll ~140–180 px.
- Design for a **14" laptop** (~760 px usable): needs the analyser at ~140 px, the Audio Specs list 2‑column
  **and** CLASSIFIED collapsed behind a `<details>` — the analyser stops working as a Tonal‑Balance view and
  the specs page becomes a dense grid.
- **Recommendation: target 1080p, accept a short scroll on small laptops.** Confirm Kevin's actual screen so
  Cat measures against the right thing on the render.

### 7.4 Audio Specs list — single vs two column
Tier 1 keeps the familiar single‑column list and only removes the 5 no‑data placeholder rows (safe, no
information lost). Tier 2's 2‑column metric list is the difference between ~1029 and ~1005 and matches "density",
but it is a visible restructure of a list Kevin knows. **Decision: single‑column (hide placeholders only) or
two‑column?**

### 7.5 Tab strip vs item 9
Item 9 deliberately made the tab strip taller to "fill the row". This spec trims its vertical padding
`11px → 7px` (horizontal `flex:1 1 0` fill is unchanged). Low risk, but it is a soft touch on a LIVE item —
**Kevin to confirm the shorter strip on the render.**

---

## 8. Build notes for Cat

- **Docs‑only spec. Do not treat any number as approved** until Kevin signs off §7 on a real‑app render.
- Everything here is CSS‑only except the placeholder‑row hide (add a class / `display:none` rule — no JS logic
  change; the rows still exist for when the analyst phase fills them) and, if Kevin picks tier 2, the
  2‑column `.mc-rows` grid (CSS `grid-template-columns` on the metric‑row wrapper; leave `.mc-sw`, `.mc-tiles-2`,
  `.mc-cls` full‑width).
- Keep all new values `#eq.oz-mixcheck`‑scoped except the two **[shell]** items in §3A/§7.2 — those are global
  and must be checked against the other 8 tabs before committing.
- **Measure before/after** at 1920×1080 **and** at Kevin's real viewport: `#mcSpecs` bottom, `#mcActions`
  bottom, `#hopeRail` bottom must stay equal (3‑col flush) — report the new flush figure.
- Confirm on the render: `#mcWave` legible at 72 px box; analyser corridor/mix‑line readable at the chosen
  height; Fix Queue card still fully actionable; volume slider + loader button still fit the control row; Hope
  rail transcript still scrolls internally with the composer pinned; item 4b re‑checked with Markey's rail‑head
  re‑track.
- Bump `AIMM_BUILD`. One branch, off current `main`. Render (desktop + Kevin's width) → Kevin approves → ff‑only
  promote.
