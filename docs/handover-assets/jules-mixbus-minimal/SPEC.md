# MixBus, minimal neutral pass - design spec (Jules, 23 Nov 2026, design only)

Same language as the approved Library. Nothing is built; `index.html` untouched.
Files: `fix.css` (override CSS, tested on the real page), `shots/before-{1900,1300,560}.png`, `shots/after-{1900,1300,560}.png`, plus `before-1900-edit.png` and `after-1900-edit.png` (a bus in edit mode).
Checked: a copy of build 2026-11-23.10 (taken from the working tree before Codex's Library edits landed) served over http, headless Chrome, with the real `renderChain()` fed sample chains from the app's own presets (Master 4, Vocal 4, 808 5, Drum 3, FX empty). I viewed before-1900 and all four after shots (1900, 1300, 560, 1900-edit); the other before shots were taken but not opened. Hover, focus and drag are CSS only and not screenshotted.

## 1. What MixBus was
It already had the old Library system: a solid colour-filled flush bar per bus with black text, a bus-colour card border, bus-colour row hover, a bus-colour "Edit" link, a purple Load preset button, purple hover on the replacement list. All driven by `--bus` (index.html 426-430).

## 2. Decisions
| Element | Now | Minimal |
|---|---|---|
| Card | 1px bus-colour border, radius 12, `#1a1d21` | 1px `#2c3034`, radius 10, `#1b1d20`, no shadow |
| Bar | solid bus colour, black 16/700, 48px | same neutral surface, title text in the bus colour, **22px / 700 / 1.25**, **64px** high, flush, hairline `#2c3034` under it when open, hover `#202327` |
| Fold glyph | black | grey `#9aa0a6` (`#e8ebed` on bar hover), glyph unchanged |
| Count | none | optional grey count beside the title (16/600), needs one small markup addition (section 4) |
| Clear (in bar) | black text on colour | grey text, teal hover pill with black ink, no box at rest |
| Plugin row | bus-colour hover, teal when selected | hover neutral `#202327` with white ink; **selected stays solid teal, black ink**; teal focus ring |
| Add plugin row | bus-colour hover | neutral hover, teal focus ring |
| Drag and drop | ghost and dragged row in bus colour | ghost `#202327`, dragged row `#2c3034`; behaviour untouched |
| Settings panel | hairline `#2a2e35`, Edit in bus colour | hairline `#2c3034`, white 16/700 title, Edit white with teal hover pill |
| Edit inputs, replacement search and stage select | white-ish borders | Mix Check inset `#16181b` + 1px `#2c3034`, teal focus |
| Save / Cancel / Back to Hope's suggestion | Save teal; others grey; hover white | Save teal (hover `#5eead4`); others grey `#2c3034`; hover teal black ink; teal focus ring |
| Replacement list (edit mode) | cyan stage text and group titles, purple gradient hover, teal-tint selected | grey stage text, group titles white 16/700, neutral hover, **selected = solid teal row, black ink** |
| Toolbar | Load preset purple, Auto-fill teal, Revert grey | Auto-fill teal (the one primary), Load preset and Revert grey `#2c3034` with `#e8ebed` text, teal hover |

### Colour per bus (title text only; unchanged mapping, so nothing is relearned)
| Bus | Title colour |
|---|---|
| Master Bus | orange `#f97316` |
| Vocal Bus | yellow `#e8b45a` |
| 808 / Bass | blue `#36a8ed` |
| Drum Bus | pink `#f472b6` |
| FX Returns | purple `#b970ff` |
Colour is identity only. Nothing in the UI standard gives a bus colour a meaning, so none is required to survive anywhere except the title text. No fills, bars, borders, hovers or links in a bus colour. Teal `#2dd4bf` with black ink is the only accent.

### Rules held
Flush bars, full width, 12px between cards, room to breathe (bar 64px, rows 46px unchanged), no boxes behind counts, folds, icons or the row remove glyph, no emoji, no arrows added, no highlights or glows. Row remove glyph stays the plain `×`.

## 3. Check against docs/UI_DESIGN_STANDARD.md
Mix Check surfaces and radius: pass. No boxes behind small elements: pass (counts and folds are bare text on the surface; hover pills appear only on hover). Heading size: 22px/700, Inter, title case, matches the single section-title size agreed for Library. Legibility of hover and selected states: black on teal about 11.6:1; light ink on `#2c3034` about 10:1. 1900, 1300 and 560 viewed, no overflow.

## 3b. Flags for Kevin and Codex
1. **Five teal rows at once.** Every bus keeps its own selected row, so five rows are solid teal together. That is existing behaviour and it is how Library marks selection, so I kept it; if it feels loud, the option is to show the teal row only in the bus you last touched (a behaviour change, so Codex's call).
2. **Add plugin picker (`#pickerModal`, lines 528-541) is shared with other tabs.** Its purple gradient hover and cyan stage text clash with this language. `fix.css` only fixes the in-panel replacement list. The modal needs its own pass across all tabs; not done here.
3. **560 window:** Hope's floating Chat button sits on top of the FX Returns fold glyph. Pre-existing, not caused by this design; worth a z-index or offset fix when Codex is there.
4. **Dead styles, safe to delete:** `.recipe-card` indigo/uppercase (lines 928-931) and `.recipes-strip`: the later `renderRecipes()` at 11723 writes to `#recipesOutput`, so `#recipesStrip` is never filled.

## 4. Old colours, selectors and JS: change vs keep
File `standalone/assets/index.html`, line numbers at build 2026-11-23.10. MixBus has three stacked CSS layers; the last one (425-484) is what renders. `--bus` now drives ONE thing: the title text colour.

KEEP
- 426-430 `.bus-col[data-bus=...]{--bus:...}` (the five title colours: master orange, vocal yellow, 808 blue, drums pink, fx purple).
- All JS: `renderChain` (7410), `renderChainItem`, `renderChainPanel`, `toggleChainBus`, `initChainDragDrop` (Sortable), `data-bus` attributes. No colour is applied from JS in MixBus; colours come only from CSS `--bus`.
- Teal for the selected row (455-457), `.chain-edit-actions .save` teal (473), `#autoFillBtn` teal (478), teal focus on inputs (405).
- 359, 367, 371-372, 395-408 layout and spacing; the plain `×`.

CHANGE (the effective layer, lines 425-484 and 538-541)
- 431 `.bus-col`: border `1px solid var(--bus)` to `1px solid #2c3034`, radius 12 to 10, background `#1a1d21` to `#1b1d20`.
- 432 `h4`: `background:var(--bus);color:#000;min-height:48px;font:700 16px` to `background:#1b1d20;color:var(--bus);min-height:64px;padding:12px 12px 12px 14px;font:700 22px/1.25`; add `.bus-col:not(.is-closed) h4{border-bottom:1px solid #2c3034}` and a `#202327` hover.
- 433 focus ring white to teal (inset).
- 435 `.bus-fold{color:#000}` to `#9aa0a6`.
- 436-437 `.clear-bus-btn` black text, opacity .75, underline hover: to grey text, 32px high, radius 999, teal background with black ink on hover and focus.
- 453-454 row hover `background:var(--bus)` and black ink: to `#202327` and white ink. 455-457 selected unchanged.
- 458-460 drag ghost and drag clone `var(--bus)`: to `#202327` / `#2c3034` with light ink.
- 463-464 Add plugin hover `var(--bus)` black: to `#202327` white.
- 465 panel hairline `#2a2e35` to `#2c3034`.
- 470-471 `.chain-panel-edit{color:var(--bus)}` and underline hover: to white text, teal hover pill.
- 474-475 Cancel/Restore grey, white hover: hover to teal with black ink; teal focus ring.
- 477 `#presetsBtn{background:#b970ff}` to grey `#2c3034`, `#e8ebed` text. 479 Revert already grey. 480-481 white hover to teal; Auto-fill hover `#5eead4`.
- 538-541 replacement: `[aria-checked=true]` tint `#173b3a` + ring to solid `#2dd4bf` black ink; 540 purple gradient hover to `#202327`; 531 `.stage` `#68d3e6` and 528 `.replacement-group-title` `#68d3e6` 20px to grey and white 16/700. (Lines 528-540 also style `#pickerModal`; apply the `#mixbus .replacement-*` selectors only, see flag 2.)
- 547 replacement list border to `#2c3034`; inputs 404 and 543-545 to inset `#16181b` with `#2c3034` hairline, teal focus.
- Optional count: in `renderChain` (7418) add `<span class="n">${items.length}</span>` after `.bus-title` when `items.length`; CSS `.bus-col h4 .n`.

DEAD LAYERS, safe to delete (overridden by 425-484, never visible)
- 361 purple gradient `#presetsBtn`, 363 `#revertFillBtn` ring, 368 cyan inset ring on `.bus-col`, 373-377 teal-ringed tile styling and connector lines, 380-381 ghost and drag (`#b970ff` ring), 383 `.stage{color:#68d3e6}`, 390 purple hover on `.chain-add`, 409-413 old button boxes.
- 928-931 `.recipes-strip` and `.recipe-card` indigo gradient with `#a78bfa` uppercase title; 589-597 `.recipe-card`/`.recipe-step` (`#a78bfa` numbers) belong to the Mix Check troubleshooter, leave alone.

NOT MixBus, leave alone: Library rules, Mix Check orange/pink (26017, 27691, 28072), the `#pickerModal` selectors (flag 2).

## 5. Hand-off
Spec: this file plus `fix.css`, branch as Codex is using for the Library build. Codex edits the originals in place (not append `fix.css`), then Jules reviews the rendered build at 1900 and 560 before Kevin sees it.
