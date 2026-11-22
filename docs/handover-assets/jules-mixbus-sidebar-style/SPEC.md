# MixBus in the Library sidebar v3 design language - spec (Jules, 22 Nov 2026, preview only)

Kevin approved the look 22 Nov with changes: Vocal yellow; then FX Returns purple, then 808 / Bass blue, then Master orange (applied below).
Base: main build 2026-11-21.7. Rules: UI_DESIGN_STANDARD.md (no boxes behind icons, counts, arrows, markers; no emoji; sentence case), SPEC.md and SPEC-section-colours.md in jules-sidebar-v3. Nothing here is built; Codex builds after Kevin approves the preview.
Preview: scratchpad `mixbus-preview.html` (origin/main copy + CSS overrides + sample chains). Real markup is kept; the only added element is the per-row stage icon.

## 1. Colour map (existing app colours, no new ones)
| Bus | Colour | Same as |
|---|---|---|
| Master Bus | #f97316 orange | Mix Check accent (Fix Queue, waveform markers, line ~1396/1400); existing token, not a sidebar section colour |
| Vocal Bus | #e8b45a yellow | Tools |
| 808 / Bass | #36a8ed blue | Status |
| Drum Bus | #f472b6 pink | Video chain picks |
| FX Returns | #b970ff purple | Library |
Set as `--bus` on each `.bus-col` (Codex: add `data-bus` to `.bus-col`; preview uses nth-child).

## 2. Structure (per bus = one card like a sidebar section)
- Card: 1px border in bus colour, radius 12, neutral #1a1d21 fill, header bar full-bleed (overflow hidden), 12px gap between cards.
- Header bar: bus colour fill, black ink, 16px bold sentence case, min 48px, padding 8 12 8 14. Right edge: plain "Clear" text (14px, 600, black at 75%, underline on hover; only when the bus has plugins, no border) then the fold glyph. Fold = the sidebar's plain minus (open) / plus (closed), 22px, black, no box, chosen by aria-expanded. The whole bar toggles open/closed. The teal circle plus is removed everywhere.
- Open bus: plugin chain as rows, top to bottom = signal order (replaces the horizontal tiles and teal connector lines).
- Row: icon 28px slot / 24px glyph (the app's existing stage icon, stroke currentColor, #aab2bd) | plugin name 15px, #c4cad3, wraps balanced | right-aligned muted "Stage · Maker" 13px #9aa0a6 | plain x (20px, #9aa0a6, 28px target, removes). Min 46px, grows when text wraps, padding 8 12, radius 10, 3px between rows. Never ellipsis.
- Last row in every open bus: "Add plugin" row (plain plus glyph in the icon slot, same size/hover as plugin rows). Replaces the circle button. Same openPicker action.
- Selected plugin (its settings show below): row paints itself teal #2dd4bf, black ink, bold. Settings block under the list: hairline #2a2e35 above, no inner box, plugin title bold, "Edit" as plain bold text in the bus colour (no border).
- Sizes all multiplied by `--inv-text-scale`, as the sidebar.

## 3. States
| State | Plugin row / Add plugin row |
|---|---|
| Rest | transparent, grey icon, #c4cad3 name |
| Hover / keyboard focus | solid bus colour fill, black icon, name, stage, maker and x (identical to sidebar v3 hover). Selected row keeps teal on hover |
| Selected | teal, black ink |
| Dragging (existing Sortable ghost/drag classes) | keep behaviour; restyle ghost as 40% bus colour, dragged row solid bus colour with black ink. Not shown in preview |
| Closed bus | bar only with plus glyph; if the selected plugin lives in it, no dot needed (rows are hidden, the plugin count is not shown) |
| Empty bus | bar only (plus glyph) when closed; when opened it holds only the Add plugin row |

## 4. Toolbar buttons (same colour system)
Load preset = solid #b970ff, Auto-fill settings = solid teal #2dd4bf, both black ink, 15px bold, 44px high, radius 10 (was 48px pills with gradient). Hover = white fill with black ink. "Revert last fill" (appears after an auto-fill) should use the same shape in a neutral #1a1d21 with #d5d8dc ink. The "?" hint loses its ring and is a plain glyph; its hover text carries the guidance.

## 5. Text removed
- The whole "How to use" note at the bottom. The "?" hover title already says "Drag plugins to reorder within a bus. Hope can read and edit the chain during a live call." Add to it: "x removes."
- Lost with the note, needs Kevin's call: the line about bringing the chain into a chat and saving it with Snapshot. It names Luna (stale persona) so I recommend it is not carried over; if wanted, move it to Snapshots.
- Per-row: stage and maker become one muted line segment instead of two stacked lines.

## 6. Contrast
Black on #f97316 6.9 (orange, 3:1 UI min and 4.5:1 text both met), #36a8ed 6.0, #b970ff 5.3, #e8b45a 9.2, #f472b6 6.7, #68d3e6 10.1, teal about 10 (all pass 4.5:1). Muted #9aa0a6 on #1a1d21 about 6:1.

## 7. Not shown in the preview / open points
- Closed state and the fold click (preview is all open per Preview in Place). Fold glyph minus/plus is specced, not wired.
- Empty bus, drag-and-drop appearance, Edit mode (replacement picker, Save/Cancel/Restore buttons; those still use the old bordered buttons and should be restyled to solid or plain text in the same pass), the "Revert last fill" button, mobile width (app is desktop-only), text scale other than 100%.
- The icon per row is injected by preview script; Codex builds it from STAGES[].icon into a span before .chain-head.
- Behaviour kept: drag to reorder, add plugin, remove, presets, auto-fill, Hope tools. Nothing in JS changes except the fold toggle and the icon span.
- Flag: today the first plugin of every bus is auto-selected, so five teal rows show at once. Honest to current behaviour, but noisy. Option for Kevin: only highlight teal on the bus you last touched. That is a behaviour change, so Codex's call.
- Purple Load preset now echoes the purple FX Returns bus (last card); far apart, acceptable.
