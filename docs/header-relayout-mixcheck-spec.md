# Mix Check header re-layout — implementation spec

**Author:** Jules (design) · **Date:** 2026-09-02
**For:** Cat (implementation)
**Branch:** `r3-mixcheck-fixes` · **Base:** `index.html` build `2026-09-02.3` (tip `117a0d4`)
**Mockup:** `docs/mockups/header-relayout-mixcheck.html`
→ https://raw.githack.com/begb0037admin/aimm/r3-mixcheck-fixes/docs/mockups/header-relayout-mixcheck.html
**Status:** awaiting Kevin's sign-off on the mockup. Do not implement until Kevin approves the mockup (per `docs/CLAUDE.md` "Mockup review process").

Line numbers below are for build `2026-09-02.3`. Prefer the selectors — the file shifts by a few lines per commit.

---

## Hard stops

- **`#mcWave` is LOCKED.** This change adds a sibling control (`.mc-input`) into the transport control row and an empty-state block into `#mcTransport`. The canvas, `MC_WAVE.draw()`, and the seek handlers are not touched. The empty state must not mount `#mcWave` — it stays inside `#refDzLoaded`, which stays `display:none` until `.visible`.
- **Hope rail** untouched.
- **No emoji.** The caret stays the existing `&#9662;` (U+25BE) glyph.
- Bump `AIMM_BUILD`. Batch-commit, push to `origin/r3-mixcheck-fixes` only.

---

## Scope decision (Kevin's point 5)

**Mix-Check-scoped relayout.** `.header-actions` (Genre / Target / Settings) is shared shell chrome — Genre and Target drive plugin starring and the master target used on Workbench/Library; `#settingsShortcutBtn` is a global shortcut. It must **not** be removed from the other 8 tabs.

**Mechanism: a relocation shim**, same pattern as the existing `#refDzLoaded → #mcTransport` shim (`index.html` ~line 17533) and the `.aichat-layout` rail move:

- When `#eq` (Mix Check) becomes the active panel, move the `.header-actions` node into `.mc-head` (after `.mc-head-titles`).
- When any other tab becomes active, move `.header-actions` back into `.header-top` (as the last child, its current position).
- All ids/handlers travel with the node (`#csGenre`, `#csPlatform` custom-selects, `#settingsShortcutBtn` onclick). The `.cs-pop` popups are `position:absolute` relative to `.cs` — they follow the node.
- Hook point: the existing tab-click path / whatever toggles `.panel.active`. A `MutationObserver` on `#eq`'s `class` attribute is a safe fallback. Run once on load in case Mix Check is the initial tab.

**Implication for the other 8 tabs: none.** They still show `Genre ▾  Target ▾  Settings` at the top-right of `.header-top` exactly as today. Only Mix Check moves the cluster to its title row and leaves `.header-top` as a brand-only bar.

**Fallback** (if adding a shim to shared chrome is judged too risky this round): make it global — move `.header-actions` into the tab-strip row as a right-aligned flex sibling of `.tabs.oz-tabstrip` on every tab. No JS. Costs: changes all 8 other tabs; sits one row above the "level with the title" placement Kevin asked for. Flag to Kevin before taking this path.

---

## Change 1 — Tab strip: full-width + taller

**CSS**

1. **Remove the Mix-Check indent.** `index.html:1702`
   ```css
   body:has(#eq.oz-mixcheck.active) .container .tabs.oz-tabstrip{margin-left:calc(var(--mc-rail-w) + var(--gutter))}
   ```
   Delete this rule (it lives in the `@media (min-width:1024px)` block, ~1699–1703). This is a deliberate reversal of R3 round 13. The strip is a block child of `.app-col` (flex column) → it then spans the full content column, flush-left with `.header-top` and flush-right with the `#eq.oz-mixcheck` grid.
   The mobile counterpart `.container .tabs.oz-tabstrip{margin-left:0}` (~1711) becomes redundant; harmless to leave, fine to delete.

2. **Taller tabs + no truncation.** `index.html:1719`
   ```css
   .tabs.oz-tabstrip .tab.oz-tab{flex:1 1 0;min-width:0;padding:6px 3px}
   ```
   →
   ```css
   .tabs.oz-tabstrip .tab.oz-tab{flex:1 1 0;min-width:0;padding:11px 8px}
   ```
   Keep `flex:1 1 0` (equal-width tabs filling the strip). Keep `.tabs.oz-tabstrip{overflow-x:hidden}` (~1718) as a safety.

3. **Label size.** `index.html:1724`
   ```css
   .tabs.oz-tabstrip .tab.oz-tab .tab-label{font-size:9px;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
   ```
   → bump `font-size:9px` → `font-size:10.5px`. Keep the `nowrap`/`ellipsis`/`max-width` as a fallback — at full content width (~1100px / 9 tabs ≈ 122px each, ~16px padding) "Conversation" at 10.5px (~72px) fits with margin, so the ellipsis won't trigger.

4. The base `.tab.oz-tab{... padding:6px 16px}` (~1216) is overridden by rule 2 — no edit needed there. Optional cleanup: the stale `grid-column:1` on `.tabs.oz-tabstrip` (~1215) is inert inside `.app-col`.

**Result:** ~64px-tall strip, full content-column width, 9 full labels, no ellipsis. Verify at desktop (≥1024) and one mobile width (`@media (max-width:1023px)` already zeroes the indent and shrinks icons — should be unaffected).

---

## Change 2 — Genre / Target / Settings → the title row

**DOM:** no static markup move. The relocation shim (see Scope decision) moves the existing `.header-actions` node (`index.html:1891–1929`) into `.mc-head` when Mix Check is active.

**CSS**

- `.mc-head` — `index.html:1243`
  ```css
  #eq.oz-mixcheck .mc-head{grid-area:head;display:flex;align-items:flex-end;justify-content:space-between;gap:14px;padding:2px 0;min-width:0}
  ```
  Change `align-items:flex-end` → `align-items:center` so the `.cs-btn` cluster (~34px tall) centres against the 24px title. Keep `justify-content:space-between` (title left, cluster right).

- When `.header-actions` is inside `.mc-head`, it should not wrap oddly:
  ```css
  #eq.oz-mixcheck .mc-head .header-actions{flex-wrap:wrap;justify-content:flex-end;flex-shrink:0}
  ```

- Mobile: `@media (max-width:1023px)` already sets `#eq.oz-mixcheck .mc-head{flex-direction:column;align-items:flex-start;gap:10px}` (~1301). Add `#eq.oz-mixcheck .mc-head .header-actions{width:100%}` so the three controls stack full-width under the title. `.header-actions` is already `flex-wrap:wrap`.

- `.header-top` on Mix Check ends up with just the `<h1>` + `justify-content:space-between` — the wordmark sits left, the rest of the row is empty. No rule needed. If Kevin wants the bar visually tightened on Mix Check, add `body:has(#eq.oz-mixcheck.active) .header-top{padding-bottom:2px}` or similar — optional, get his call.

**Styling of the cluster is unchanged** — `.cs-btn`, `.cs.open .cs-btn`, `#settingsShortcutBtn` and the R3 `--send-blue` hover/selected rules (~1798–1808) all still apply since the nodes are the same.

---

## Change 3 — Drop / browse WAV → the transport bar (incl. empty state)

### 3a. The transport card is always shown on Mix Check

- **Remove** `index.html:1252`
  ```css
  #eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)){display:none}
  ```
  `#mcTransport` now always renders on the Mix Check tab. It needs real empty-state content (3c) or it is an empty box.

- `#eq.oz-mixcheck #mcTransport{grid-area:transport;padding:14px;...}` (~1245) — keep. In the empty state, set `padding:0` so the dashed drop panel controls its own padding:
  ```css
  #eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)){padding:0}
  ```

### 3b. Relocate the drop zone, not just the loaded view

- Extend the existing shim (`index.html` ~17533, `function move()`): relocate **`#refDropZone`** (the parent of both `#refDzEmpty` and `#refDzLoaded`, `index.html:2424`) into `#mcTransport`, instead of only `#refDzLoaded`. This keeps `wireDropZone()` (which targets `#refDropZone`) intact and makes the whole transport card the drop target in the empty state.
- `#refDropZone` has inline `border:1px dashed #2c3034;padding:12px;...`. Once it is the transport card's content, restyle via a scoped rule (don't fight the inline styles more than needed):
  ```css
  #eq.oz-mixcheck #mcTransport > #refDropZone{border:0;padding:0;background:transparent}
  #eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) > #refDropZone{
    border:1px dashed #333a44;border-radius:9px;padding:26px 20px;text-align:center}
  ```

### 3c. Empty state — `#refDzEmpty` becomes the loader CTA

`#refDzEmpty` (`index.html:2425`) currently reads *"Drop a WAV here — or use Drop / browse WAV in the header."* Replace its contents with the empty-state CTA (see mockup State B `.dz`):

- a down-arrow icon (reuse the `.ic` upload glyph already in `#mcInputMain`)
- text **"Drop a WAV here"**
- the **`.mc-input` split-button** (see 3d) at full size
- the caption **"▾ browse file · live input · capture tab"** (this is the existing `.mc-cta-sub` copy — move it here)

Layout:
```css
#eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) #refDzEmpty{
  display:flex;flex-direction:column;align-items:center;gap:10px;font-size:13px;color:#9ca3af;cursor:default}
```

### 3d. The `.mc-input` split-button — one instance, two forms

Move `.mc-input` (`#mcInput`, `index.html:2296–2302`, currently inside `.mc-head .mc-cta`) so it lives inside `#refDropZone` / `#mcTransport`. Simplest: make it a child of `#refDzEmpty` for the empty state, and have the shim (or a tiny bit of CSS with `:has`) also expose it in the loaded control row. Cleanest single-home option: keep **one** `.mc-input` as a direct child of `#refDropZone` (sibling of `#refDzEmpty` and `#refDzLoaded`) and place it per state with CSS:

```css
/* empty: big primary CTA, centred (visually inside #refDzEmpty's column) */
#eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) .mc-input{order:3;align-self:center}
#eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) .mc-input-main{
  background:var(--grad);color:var(--grad-ink);border:0;border-radius:8px;padding:10px 18px;font:700 12px Inter,sans-serif}

/* loaded: compact secondary button at the end of the control row */
#eq.oz-mixcheck #mcTransport:has(#refDzLoaded.visible) .mc-input{margin-left:8px;flex-shrink:0}
#eq.oz-mixcheck #mcTransport:has(#refDzLoaded.visible) .mc-input-main{
  background:var(--inset2);color:#c7ccd0;border:1px solid var(--card-bd);border-radius:7px;padding:6px 11px;font:600 11px Inter,sans-serif}
#eq.oz-mixcheck #mcTransport:has(#refDzLoaded.visible) .mc-input-main:hover{color:#f2f4f5;border-color:#4b5563}
```

- **Loaded-state label:** change the button text from "Drop / browse WAV" to **"Load WAV"** when compact (via a `<span>` swap in `mcSetHeader()`/`refLoadFile()`, or two spans toggled by the `:has` state). Keep the `&#9662;` caret and the `#mcInputMenu` (browse / live input / capture tab) unchanged — the menu is `position:absolute; right:0` so it opens below-right of the compact button; fine.
- **Empty-state menu position:** the menu's `right:0` can clip when the button is centred. Add:
  ```css
  #eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) .mc-input-menu{right:auto;left:50%;transform:translateX(-50%)}
  ```

### 3e. The loaded transport control row

`.ref-transport` (relocated `#refDzLoaded > .ref-transport`, styled at `index.html:1745` + `~1519–1523`) currently: `#refFileName` (`.tp-file`), `.tp-btns` (5 buttons), `#refTimeElapsed`, `#refTimeDuration` (`margin-left:auto`). Add `.mc-input` as the final child, after `#refTimeDuration`. `.ref-transport` is already `flex-wrap:wrap; row-gap:12px` — on a narrow column the loader wraps to a second line before the wave; acceptable.

The existing `.tp-clear` eject affordance (styled `~1740`, restored in an earlier post-ship fix so `refClearFile()` stays reachable) — leave it. Loaded state then has both "swap to a different WAV" (`.mc-input`) and "clear" (`.tp-clear`).

### 3f. `.mc-head` after the loader leaves

`.mc-cta` / `.mc-cta-sub` (`index.html:1270`, `1267`) are now empty on the head row — the head row's right side is the relocated `.header-actions` (Change 2). Remove the empty `.mc-cta` wrapper from `.mc-head` markup (~2295–2304) or leave it empty and `display:none` it:
```css
#eq.oz-mixcheck .mc-head .mc-cta:empty{display:none}
```
Keep the `.mc-cta` / `.mc-input` / `.mc-cta-sub` CSS rules — they're now consumed by the transport-bar states above (mostly overridden per 3d).

---

## Change 4 — vacated top-right / `.container` relationship

- **Vacated space:** nothing fills it. On Mix Check, `.header-top` is a brand-only bar → more breathing room above the taller full-width tab strip. Matches Kevin's stated layout preference. No new markup.
- **`.container` / `.app-col`:** no structural change. The tab strip stays a block child of `.app-col` (flex column, `gap:var(--gutter)`), so removing the indent (Change 1.1) is all that is needed for full-width alignment. The R3 round-13 comment block at ~1698 can be updated/removed since the indent rule is gone.

---

## Feasibility notes / grid interactions

1. **`grid-area:head` spans both columns** (`"head head"`). The relocated cluster (~148+148+90px + gaps ≈ 400px) against a 24px title fits the ~1100px content row on desktop. On the 240px-rail + `minmax(0,1fr)` split it's the full head row width, not the right sub-column — fine.
2. **Always-visible transport card:** implicit grid rows are auto-sized, so the empty state (short) and loaded state (tall, with canvas) both flow without touching `grid-template-areas`. Mobile areas already include `"transport"`.
3. **`#mcActions:empty{display:none}`** (~1251) is an independent pattern — unaffected.
4. **`#mcWave` premature mount:** guarded — the canvas stays inside `#refDzLoaded` (`display:none` until `.visible`). The empty state only shows `#refDzEmpty` + `.mc-input`. Confirm `MC_WAVE` init is triggered by `refLoadFile()`/`.visible`, not by `#mcTransport` becoming visible.
5. **Drag-drop:** must confirm `wireDropZone()` binds to `#refDropZone` (relocating the whole node, per 3b, keeps this working) and not to a now-hidden ancestor. `#mcInputCard` stays `oz-legacy-hide`; only `#refDropZone` moves out of it.
6. **Relocation shim on shared chrome:** the `.header-actions` move runs on every Mix-Check enter/leave. Keep it idempotent (check current parent before moving). The `.cs` custom-selects must not be mid-open during the move — close any open `.cs-pop` first, or accept it snaps shut.
7. **`body:has(#eq.oz-mixcheck.active)`** is already in use (the indent rule being removed) so the selector is safe for any remaining scoped rule.

---

## Acceptance (for the render review)

- Desktop ≥1024 and one mobile width (~390).
- Tab strip: flush-left with the wordmark, flush-right with the transport/specs grid, taller, 9 full labels, no ellipsis, on Mix Check and unchanged on another tab.
- `.mc-head`: `Mix Check` title left, `Genre ▾ Target ▾ Settings` right, vertically centred.
- Other 8 tabs: `Genre ▾ Target ▾ Settings` still top-right of `.header-top`.
- Empty state: no WAV → transport card visible with the dashed drop panel + big `Drop / browse WAV ▾` + caption; loader reachable; menu opens without clipping.
- Loaded state: filename + transport controls + timecodes + compact `Load WAV ▾` + eject; `#mcWave` visually identical to build `2026-09-02.3` (LOCKED).
- 3-column bottom alignment (`#mcSpecs` = `#mcActions` = `#hopeRail` bottom) still holds — CDP probe.
- Console clean on load, WAV load, analysis, and tab switching.
