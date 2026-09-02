# Item 20 — Page gutter (left/right breathing room on the app shell)

**Owner:** Jules (spec) · Cat (build) · **Status:** SPEC READY
**Date:** 2026-09-02 · **Base:** `origin/main` @ `39178ba`, build `2026-09-02.11` (item 18 density pass shipped), measured at 1920×1080.

Kevin: the Mix Check app runs edge-to-edge. He wants "a bar on each side" — a real, symmetric margin so it has room to breathe. Not a font/spacing change; a shell-level horizontal inset.

---

## 1. Current state (why it looks flush)

`.container` (index.html line 21) is the top-level grid — one child per column: `.app-col` (all app content, grid-column 1) and `#hopeRail` (grid-column 2, fixed 380px).

```
.container{ … padding:var(--gutter); padding-right:0; padding-bottom:var(--gutter); … }
```

So the shell padding today is **`16px 0 16px 16px`** — 16px on the left, **0 on the right**. The Hope rail's right edge sits on the viewport edge. That asymmetry (16 / 0) is what reads as "flush".

`:root` tokens: `--gutter:16px` (internal grid gap — **do not touch**, item 18 §"leave the grid gap at 16px"), `--hope-w:380px`, `--mc-rail-w:240px`. No `max-width` anywhere (`.container{max-width:none}`).

---

## 2. Mechanism — recommendation: BOTH (responsive symmetric `padding-inline` + `max-width` cap)

| Option | Behaviour on Kevin's 1920 | Ultra-wide (2560+) | Verdict |
|---|---|---|---|
| Pure `padding-inline` (fixed gutter) | Fixed symmetric bar — works | dashboard keeps widening, analyser line-length sprawls | good, incomplete |
| `max-width` + `margin-inline:auto` only | if cap ≈ 1920 the gutter is **0** at 1920; only bites above the cap | caps width | fails Kevin's actual screen |
| **Both** | symmetric bar from `padding-inline`; cap is inert | cap stops sprawl | **use this** |

`padding-inline` does the visible work at 1920. The `max-width` cap is cheap insurance — **inert at 1920** (2000 > 1920), only earns its keep if Kevin later moves to a wider display. Standard app-shell pattern, least surprising.

---

## 3. Tokens + values

Add one token; keep `--gutter` unchanged.

```css
:root{ … --page-gutter:16px; }              /* NEW — the shell side gutter   */
@media (min-width:1600px){ :root{ --page-gutter:32px; } }   /* Kevin's 1920 case */
```

`.container` (line 21) — replace `padding:var(--gutter);padding-right:0;padding-bottom:var(--gutter)` with:

```css
.container{ … padding:var(--gutter) var(--page-gutter); max-width:2000px; margin-inline:auto; … }
```

Result: vertical padding stays `--gutter` (16px top / 16px bottom — **vertical budget untouched**); horizontal padding is symmetric `--page-gutter`.

| Viewport width | `--page-gutter` (each side) | Rationale |
|---|---|---|
| ≥ 1600px (incl. Kevin's 1920) | **32px** | a deliberate, visible bar on a wide screen |
| 1024–1599px | **16px** | parity with today's left-only 16; the 1440 laptop range is already tight (item 18 Tier 3 not built) — don't steal more width there |
| ≤ 1023px | 12px (existing `.container` mobile rule, line 1808 — leave as-is) | rail is a fixed overlay here; gutter is cosmetic |

Symmetric on both edges at every breakpoint. `max-width:2000px` = 1920 + 2×~40 — inert at 1920, caps content at ~1936px on ultra-wide with the overflow becoming symmetric outer margin via `margin-inline:auto`.

**Also update (tracking edits, not new geometry):**

- `#buildStamp` (line 1198): `right:calc(var(--hope-w) + var(--gutter) + 8px)` → `right:calc(var(--hope-w) + var(--page-gutter) + 8px)` so the build stamp keeps sitting just left of the rail after the rail moves inward.

---

## 4. Hope rail sits INSIDE the gutter

`#hopeRail` is a child of `.container`. `padding-inline` on `.container` insets the **whole grid** — both `.app-col` and `#hopeRail`. The rail's right edge moves inward by `--page-gutter` (32px at 1920), giving a symmetric 32px bar between the rail and the viewport's right edge. Today's flush-right is caused specifically by `.container{padding-right:0}`, which this spec removes. The gutter is on the outside of the whole app, rail included — not just the left content column.

Mobile (`≤1023px`): `#hopeRail{position:fixed;right:0}` is a slide-in drawer — stays flush, no change.

---

## 5. Width math at 1920 (≥1600 → 32px gutter)

| Region | Before (build .11) | After item 20 | Δ |
|---|---|---|---|
| Left gutter | 16 | **32** | +16 |
| Right gutter | 0 | **32** | +32 |
| **Main app column** (`.app-col`, grid col 1) | **1508** | **1460** | **−48** |
| Internal grid gap | 16 | 16 | 0 |
| Hope rail (`#hopeRail`, grid col 2) | 380 | 380 | 0 |
| ·· specs rail (`--mc-rail-w`), inside `.app-col` | 240 | 240 | 0 |
| ·· `#eq.oz-mixcheck` gap, inside `.app-col` | 16 | 16 | 0 |
| ·· analyser / center column, inside `.app-col` | **1252** | **1204** | **−48** |

Check: 32 + 1460 + 16 + 380 + 32 = 1920. ✓

**Usable content width at 1920 = main app column 1460px** (was 1508). The flexible analyser / Tonal-Balance column absorbs the whole −48px → **1204px** (was 1252). Specs rail (240) and Hope rail (380) are untouched.

---

## 6. 3-column bottom-align — unchanged

No rule in the bottom-align path is touched. `#mcSpecs` (240, fixed) = `#mcActions` = `#hopeRail` (380, fixed) bottoms still align via `align-items:start` on the grids + `#hopeRail{align-self:stretch;min-height:100%;grid-row:1/-1}`. Only the flexible analyser column between them is narrower. Same mechanism, narrower canvas.

---

## 7. Does item 18's no-scroll fit survive?

**Direct answer: yes** — the gutter is horizontal and adds zero height on its own. The fixed vertical zones (shell chrome, transport, analyser canvas at 200px, Fix Queue, specs list) are unchanged.

**Indirect risk — one element:** the analysis context banner `#refHopeBox.mc-banner` → `.mcb-body` (12.5px / line-height 1.4) is **variable-height**. Its text is assembled from the measured LUFS / true-peak / DR values; the worst-case branch (hot LUFS + true-peak over the −1.0 dBTP ceiling + low DR) is ~215 characters ≈ ~1290px of rendered text.

- Today's analyser column is 1252px → the worst-case banner already wraps to 2 lines on `main`.
- A mid-length banner (~180 chars) is 1 line at both 1252 and 1204.
- The gutter narrows the column to **1204px**, so there is a narrow band of banner lengths (rendered text ~1204–1252px wide) that tips from 1 line → 2 lines: **≈ +18px**.

Item 18 as shipped only clears a **literal** 1920×1080 viewport (`scrollHeight == innerHeight`, ~2px slack); at a realistic ~952px usable height it already scrolls ~110px (item 18 §1, and the item 18 build note). So if a banner wraps one extra line on the branch: the literal-1080 case gains ~18px of page scroll; the realistic case goes ~110 → ~128px.

### What Cat must watch / pre-empt

Capture Mix Check at **1920×1080, `main` vs the item-20 branch**, loaded with a **worst-case banner** (force hot LUFS + true-peak over ceiling + low DR — the longest string). Then:

- **If the branch wraps the banner one line more than `main`:** claw it back with
  `#eq.oz-mixcheck .oz-spec-canvas-wrap{height:200px → 184px}` (line 1479) — one edit, stays **at/above the item 18 hard floor of 180px**, Tonal-Balance corridor still readable. This is the clean single lever.
  (Alt, weaker: `.oz-band-grid{margin-top:10px→6px}` + `.oz-band-bar{margin-bottom:10px→6px}` ≈ −8px, two edits, only half.)
- **If no extra wrap in the render:** ship the gutter as-is; item 18's literal-1080 fit is preserved.

The gutter itself does not need a vertical claw-back — only the banner-wrap edge case does, and only if the render shows it.

---

## 8. Build checklist for Cat

1. `:root` — add `--page-gutter:16px`; add `@media (min-width:1600px){:root{--page-gutter:32px}}`.
2. `.container` (line 21) — `padding:var(--gutter) var(--page-gutter); max-width:2000px; margin-inline:auto`; drop `padding-right:0`.
3. `#buildStamp` (line 1198) — swap `var(--gutter)` → `var(--page-gutter)` in the `right:calc(...)`.
4. Leave: `--gutter` (16px), `#eq.oz-mixcheck` grid `gap`, `--mc-rail-w`, `--hope-w`, the `≤1023px` `.container{padding:12px}` rule, every bottom-align rule.
5. Render 1920×1080 `main` vs branch, worst-case banner → apply the §7 analyser claw-back only if the banner wraps an extra line.
6. CSS-only, `index.html` only. Own branch off `main`, rendered before/after desktop + one mobile width, → Kevin's sign-off.
