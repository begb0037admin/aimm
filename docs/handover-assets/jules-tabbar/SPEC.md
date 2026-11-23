# AIMM main tab strip, rebuilt from scratch (Jules, 23 Nov 2026)

Scope: ONLY the row of 7 pills `.tabs.oz-tabstrip .tab.oz-tab` (Mix Check, Library, MixBus, Plugins, Settings, Marketing, Community).
Nothing else changes: panels, tab intro, cards, Library, MixBus, Plugins sidebar, Hope rail, Mix Check waveform.
Source inventoried: `standalone/assets/index.html`, build 2026-11-23.21 (line numbers below are for that build; re-grep if the file moves).
Codex builds this through Jacob. Jules does not edit `index.html`.

Files in this folder
- `tabbar.css` the complete new rule set (also in section 3)
- `preview.html` interactive preview (real Inter, real tab sprite, production CSS inlined, A/B against live current build)
- `shots/` rendered evidence; `computed-proof.json` 70-row computed-style proof; `dry-run-patch.py` the exact inventory applied to a scratch copy

## 0. What I found (corrections to the brief)
1. In build .21 the old rules do NOT fill the icons. Computed `fill` on the tab svg is already `none` and the two `!important` rules only force `color` (line 2916, 3160). The "blob" Kevin saw is therefore most likely a stale build/cache or the 1.8 stroke override (`svg *{stroke-width:1.8 !important}`, line 3120, fighting `stroke-width:1.5` at 3150 and 28128). Either way the new set removes every one of those layers, so it cannot recur. I could not reproduce a blob on the live page (viewed at 3x).
2. The Mix Check blue-to-gold gradient border is NOT on the tab in .21. Line 4753 is a leftover rule whose comment still says "blue-gold ring" but sets plain teal; computed `background-image` is `none`. The blue/gold gradients near 4776-4780 belong to the Mixing mode pills and Hope Send (out of scope). Proposal below (section 7).
3. Real defect also found: at window 1300 the current strip already truncates 5 of 7 labels (strip is only 872px wide because the Hope rail takes the rest), and at 560 all seven read "M...", "Li...".
4. `aria-selected` and `aria-current` are never set by any JS or markup. Every `:is(.active,[aria-selected],[aria-current])` selector is dead weight. New CSS keys on `.active` only (the class the JS toggles).

## 1. Decisions (all measured against the live .21 look)
| Item | Value | Basis |
|---|---|---|
| Font | Inter via `var(--aimm-font)`, 15px, weight 650 at all states, letter-spacing 0 | measured live: 15px / 650 rest, 700 selected. One weight for all states so selecting never changes a pill's width |
| Pill | 54px high, radius 999px, 1px border, padding 0 14px, icon-to-label gap 9px | measured live (54px, 14px, 9px) |
| Strip | 7 columns, gap 8px, 72px block height (54 + 9px margin top and bottom) | measured live; strip height unchanged so nothing below moves |
| Pill ends | flush with the column edges (live pills are inset 11px) | aligns with the cards below; the only intentional geometry change; flagged in section 7 |
| Icon | stroke only, 24x24, 1.5 stroke, round caps, `fill:none`, `currentColor`, never filled | approved sprite `#i-tab-*` |
| Rest | surface `#1b1d20`, border `#2c3034`, ink `#9ca3af` (token `--aimm-ink-rest`) | brief; ink is brighter than live `#71787e`, see section 7 |
| Hover and selected | solid teal `#2dd4bf`, border same teal, ink `#0b0d10` | Kevin approved |
| Pressed | teal `#26b9a7` (12 percent darker), ink black | colour only |
| Focus | `outline:2px solid #2dd4bf; outline-offset:2px`, keyboard only | brief |
| Motion | background-color, border-color, color at 120ms (`--aimm-t-colour`); nothing else; the global `html:not(.aimm-ready)` rule already blocks load-time motion; `prefers-reduced-motion` sets `transition:none` | brief |
| Banned | scale, lift, glow, drop-shadow, filter, icon fill, persona colours, gradients, `!important` | brief |

### Hover versus selected
They look identical on purpose (Kevin: hover on an unselected pill equals selected, and a selected pill must not change on hover). The difference is behavioural and cheap: (a) a hover only exists while the pointer is on that pill and vanishes on leave, the selected pill is the one that stays teal when the pointer is elsewhere; (b) the selected pill has `cursor:default` (clicking it does nothing), hover pills have the pointer cursor; (c) only one pill is ever selected, so a second teal pill is always "where I'm pointing". I recommend accepting this. If Kevin wants a persistent cue, the one option I would offer is weight 700 on the selected label, but that changes pill widths on selection, so I recommend against.

### Narrow widths (answer: icon-only, no scroll)
The strip is a container, so tiers follow the strip width, not the window (the Hope rail eats width).
| Strip width | Look | Fits at |
|---|---|---|
| 980 and up | icon + label 15px, columns equal width | window 1900 (strip 1440) |
| 840 to 979 | icon + label 14px, padding 8, gap 7, columns equal where possible | window 1300 (strip 872) |
| 839 and below | icon only, 48px pills, label visually hidden but kept as the accessible name, tooltip via `title` | window 560 (strip 536, pills 69.7px) |
Why icon-only and not scroll: R3 round 15 rule is that the strip never scrolls; a scroll hides destinations; icon-only keeps all 7 one tap away and removes truncation. Sweep: strip widths 360 to 1500 in 2px steps, 571 widths, 0 truncated or overflowing.

## 2. Inventory: everything to delete (build .21 line numbers)
Delete the line range, or for a "shared" row edit only the named selector out of the list, because the rule also serves other components.
| # | Lines | What it is | Action |
|---|---|---|---|
| 1 | 49-109 | Legacy `.tabs`/`.tab` block: wrap/underline `.tabs` (56-57), `.tab` base (58-59), `.active-section`/`.voice-tab` (65-66), purple `.active` (67, 76), `data-persona-label` colours (73-74), hover purple (75), folder-tab style + `::after` divider (87-90), dormant persona comment (95-107), `.tab-ico`/`.tab-ico svg` (108-109), all their comments | delete 49-109 |
| 2 | 1341-1352 | R5 "graphite rack" strip, column pill, blue active top border + glow `0 0 14px`, `.tab-ico` blue, Hope persona override | delete |
| 3 | 2110 | label 14px inside `@media(max-width:1023px)` | delete this one line |
| 4 | 2112-2119 | R3 round 15: `overflow-x:hidden`, `flex:1 1 0`, `padding:7px 8px`, label ellipsis (this is what makes "M...") | delete |
| 5 | 2221-2222 | `--send-blue` active + glow `0 0 16px` | delete |
| 6 | 2875-2884 | pill-capsule strip (`999px`, gradient `#0b141f`), pill base, `::after` none, `.tab-ico`, `.tab-label`, mixing-state active with double ring `0 0 0 5px`, icon `#c5eaf2`, `@media(max-width:1023px)` | delete |
| 7 | 2914-2918 | "Tabs" palette v2: teal active, `* {color:... !important}` (2916), neutral rest (2917), `* {color:inherit}` (2918) | delete |
| 8 | 3120, 3122 | `.tab svg *` heavier stroke `!important` (3120 shares a list with the mode pills: delete only line 3120, keep 3121), and `svg{stroke:currentColor}` (3122) | delete the two lines |
| 9 | 3126, 3129 | tab selector heads of two shared hover rules (mode pills keep their lines 3127-3128, 3130) | delete these two lines only |
| 10 | 3139-3142 | "no ring" selected top tab `!important` | delete |
| 11 | 3144-3146 | strip `border:0 !important`, `background:transparent !important` | delete |
| 12 | 3148-3150 | icon `stroke-width:1.5` | delete |
| 13 | 3152-3160 | "selected must not change on hover" block incl. `.active:hover *{color !important}` (3160) | delete |
| 14 | 4752-4753 | stale "blue-gold ring" comment + Mix Check special rule | delete |
| 15 | 4755-4765 | "Top navigation states" rest rule, `hover:#d6e2eb`, reduced-motion | delete |
| 16 | 4770-4771 | "Selected-state finish" for tabs (the comment at 4768-4769 also mentions tabs; reword to "the active Mixing mode and the enabled Hope Send action") | delete 2 lines |
| 17 | 28062 | shared list: remove `.tab.oz-tab,` | edit |
| 18 | 28068 | shared hover rule: remove `,.tab.oz-tab:not(.active):hover` | edit |
| 19 | 28072 | remove `,.tab.oz-tab:active` (opacity .8 press, replaced by colour press) | edit |
| 20 | 28075, 28076 | remove `.tab.oz-tab.active,.tab.oz-tab[aria-selected="true"],` and `.tab.oz-tab.active:hover,` | edit |
| 21 | 28080 | focus-visible list: remove `,.tabs.oz-tabstrip .tab.oz-tab:focus-visible` | edit |
| 22 | 28121 | `--rest-bg`/`--rest-bd` for the tab | delete |
| 23 | 28122, 28124 | transition and hover lists: remove `.tabs.oz-tabstrip .tab.oz-tab,` | edit |
| 24 | 28126 | remove `.tabs.oz-tabstrip .tab.oz-tab:is(.active,[aria-selected="true"]),` (rule stays for the others) | edit |
| 25 | 28127-28128 | `.tab-ico`/svg `transform/filter/box-shadow:none` and `width/height/stroke-width` | delete |
Not tab rules, leave alone: 28021 `--aimm-ico-hover-scale:1.08` token (no tab rule uses it; the old "scale 1.08" was removed earlier), `.ic`/`.ic-*` (28052-28054, shared), `.tab-intro*` (2856-2870), 1450 mixcheck `.ic`.
Out-of-scope stale text, flag only: Hope system-prompt copy at lines 13809-13811 and 13951 still describes purple tab states and drag-reorder (Markey's, do not touch).
Verified: `dry-run-patch.py` applies exactly this table to a scratch copy of the real file (140 lines removed, 9 shared lists edited, new CSS appended before the last `</style>`); results in section 6.

## 3. New CSS (place once at the END of the last `<style>`; `tabbar.css` is the same text)
```css
/* AIMM TAB STRIP v3 - Jules, 23 Nov 2026. Scope: .tabs.oz-tabstrip and its 7 .tab.oz-tab buttons only. No !important. */
.tabs.oz-tabstrip{
  --tab-bg:#1b1d20; --tab-bd:#2c3034; --tab-ink:var(--aimm-ink-rest,#9ca3af);
  --tab-on:var(--aimm-teal,#2dd4bf); --tab-on-ink:var(--aimm-black,#0b0d10); --tab-press:#26b9a7;
  --tab-h:54px; --tab-gap:8px;
  container-type:inline-size;
  display:grid; grid-auto-flow:column; grid-auto-columns:minmax(max-content,1fr);
  gap:var(--tab-gap); align-items:center; grid-column:1;
  margin:0; padding:0; border:0; background:none; overflow:visible;
}
.tabs.oz-tabstrip .tab{
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  height:var(--tab-h);margin:9px 0;padding:0 14px;
  border:1px solid var(--tab-bd);border-radius:999px;background:var(--tab-bg);color:var(--tab-ink);
  font:650 calc(var(--inv-text-scale,1) * 15px)/1 var(--aimm-font,Inter,system-ui,sans-serif);
  letter-spacing:0;white-space:nowrap;cursor:pointer;
  -webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent;
  transition:background-color var(--aimm-t-colour,120ms) var(--aimm-ease,ease),
             border-color var(--aimm-t-colour,120ms) var(--aimm-ease,ease),
             color var(--aimm-t-colour,120ms) var(--aimm-ease,ease);
}
.tabs.oz-tabstrip .tab-ico{display:inline-flex;flex:none;width:24px;height:24px}
.tabs.oz-tabstrip .tab-ico svg{display:block;width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.tabs.oz-tabstrip .tab-label{color:inherit}
@media (hover:hover) and (pointer:fine){
  .tabs.oz-tabstrip .tab:not(.active):hover{background:var(--tab-on);border-color:var(--tab-on);color:var(--tab-on-ink)}
}
.tabs.oz-tabstrip .tab:not(.active):active{background:var(--tab-press);border-color:var(--tab-press);color:var(--tab-on-ink)}
.tabs.oz-tabstrip .tab.active{background:var(--tab-on);border-color:var(--tab-on);color:var(--tab-on-ink);cursor:default}
.tabs.oz-tabstrip .tab:focus-visible{outline:2px solid var(--tab-on);outline-offset:2px}
@container (max-width:979px){ .tabs.oz-tabstrip .tab{gap:7px;padding:0 8px;font-size:calc(var(--inv-text-scale,1) * 14px)} }
@container (max-width:839px){
  .tabs.oz-tabstrip .tab{--tab-h:48px;margin:7px 0;padding:0;gap:0}
  .tabs.oz-tabstrip .tab-label{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
}
@media (prefers-reduced-motion:reduce){ .tabs.oz-tabstrip .tab{transition:none} }
```
Note: a container query cannot style the container itself, so the strip gap stays 8px in all tiers (tested). Requires Chrome 105 / Safari 16 or newer.

## 4. Markup changes (small, 7 buttons)
Keep every attribute JS reads: `class="tab oz-tab"`, `data-tab`, `data-label`, `data-persona-label`, `.tab-ico`, `.tab-label` (updateTabLabels rewrites its text), `.active`.
1. Add `title="<label>"` on each button (tooltip for the icon-only tier). Label text stays in the DOM so the accessible name is unchanged.
2. svg class `ic ic-20` becomes `ic ic-24` (matches the sprite size classes; the new CSS sets 24 itself, so this is hygiene not a dependency).
3. Optional, recommended: in the click handler (line 11688) also set `aria-current="page"` on the active tab and remove it from the others. CSS does not depend on it.

## 5. States table (production rules, computed in the preview, identical for all 7 tabs)
| State | Surface | Border | Ink (label + icon) | Other |
|---|---|---|---|---|
| Rest | `#1b1d20` | `#2c3034` | `#9ca3af` | pointer cursor |
| Hover (unselected, real pointer only) | `#2dd4bf` | `#2dd4bf` | `#0b0d10` | 120ms colour tween |
| Selected (`.active`) | `#2dd4bf` | `#2dd4bf` | `#0b0d10` | `cursor:default`; hover and press change nothing |
| Pressed (unselected) | `#26b9a7` | `#26b9a7` | `#0b0d10` | colour only |
| Focus-visible | as rest (or as hover/selected if also those) | | | `2px solid #2dd4bf`, offset 2px, no transition on the ring |
| Disabled | none exist (no JS disables a tab), so no rule is shipped | | | |

## 6. Verification
Computed-style proof, preview, 7 tabs x 5 states x 2 widths (1900 strip 1440, 560 strip 536) = 70 rows, `computed-proof.json`. Violations 0 of 70.
| State | background | border | color | svg fill / use fill | svg size | stroke-width | transform / box-shadow / filter | outline | transition |
|---|---|---|---|---|---|---|---|---|---|
| Rest | rgb(27,29,32) | rgb(44,48,52) | rgb(156,163,175) | none / none | 24x24 | 1.5px | none / none / none | none | 3 properties, 0.12s |
| Hover | rgb(45,212,191) | rgb(45,212,191) | rgb(11,13,16) | none / none | 24x24 | 1.5px | none / none / none | none | same |
| Selected | rgb(45,212,191) | rgb(45,212,191) | rgb(11,13,16) | none / none | 24x24 | 1.5px | none / none / none | none | same |
| Pressed | rgb(38,185,167) | rgb(38,185,167) | rgb(11,13,16) | none / none | 24x24 | 1.5px | none / none / none | none | same |
| Focus | rgb(27,29,32) | rgb(44,48,52) | rgb(156,163,175) | none / none | 24x24 | 1.5px | none / none / none | 2px solid rgb(45,212,191), offset 2px | same |
Pill size: 198.8 to 198.9 x 54 at 1900; 69.7 x 48 at 560. Inter loaded (`document.fonts` reports Inter loaded).

Dry run on the real page: the inventory plus new CSS applied to a scratch copy of `standalone/assets/index.html` (original untouched), served separately, compared with the live .21 build.
- Strip box identical at 1900, 1300, 560: y 129.3 / 129.3 / 109.5, height 72 / 72 / 62; tab intro Y and page height identical.
- Pixel diff of the whole page outside the strip band: 0 pixels differ at 1900, 1300 and 560.
- All 7 tabs click through: exactly one `.active`, matching panel gets `.active`, no page errors.
- Tabs: no truncated label at 1900 or 1300; 560 is icon-only; svg 24 and fill none everywhere; no shadow, no transform.
- Width sweep 360-1500: 0 truncations or overflows.

## 7. For Kevin to decide (flagged, not assumed)
1. Mix Check special treatment: recommend none. All 7 pills use one rule set; Mix Check is just the default-selected tab. The blue-gold tab border does not exist in .21 (section 0 item 2); the dead rule is deleted (inventory row 14). If Kevin wants Mix Check to look different when selected, that is a new decision.
2. Rest ink `#9ca3af` instead of the live `#71787e`. `#71787e` on `#1b1d20` is about 3.7:1 (fails 4.5:1 for 15px text); `#9ca3af` is about 6.6:1 and is already the app's `--aimm-ink-rest` token. Brighter than what Kevin has seen; one token (`--tab-ink`) if he prefers the old grey.
3. Pills now sit flush with the column edges (live is inset 11px by the old strip padding). Aligns with cards; one-line revert is `padding:0 11px` on the strip.
4. Hover equals selected look (section 1). Accept, or pick a cue.

## 8. JS touchpoints to PRESERVE (nothing to change)
- Click handler, line 11688: removes `.active` from all `.tab` and `.panel`, adds to the clicked tab and `#<data-tab>`, calls `updateTabLabels`, `invScheduleFrameFit` (plugins), `applyFloatMicVisibility`, `notifyTabChangeIfActive`.
- `updateTabLabels` 11655: reads `.tab-label` and `data-label` (rewrites the label text), `dataset.personaLabel` and `PERSONA_COLOURS` (11637) for the panel title bar; the `data-persona-label` attribute must stay, no tab CSS uses it any more.
- Programmatic activation: 10348-10350 and 10835-10837 (add `.active` to `.tab[data-tab="mixbus"]`), 17931 (Hope switch_tab via `.tab[data-tab=...]` click), 17954 plugins, 18087 mixbus, 18148 / 22099 / 22342 mixcheck, 18400 library, 22374 plugins preview, 8029 settings click listener, 24705 / 24711 mixcheck `.tab.active`, 21401 `activeTabId()` reads `.tab.active`.
- Order: `aimmTabOrder_v2` / `_v1` read and migrated at 11700-11727 (`appendChild` reorders the 7 buttons; the grid follows DOM order, so no `nth-child` dependence); `aimmWireTabSortable` 11735 returns early (drag disabled), leave as is.
- Initial state 11754: `.tab.active` found, `updateTabLabels` run.
- Nothing sets `aria-selected`, `.pop`, or classes on `.tab-ico`; none of that is needed.

## 9. Not checked
Not on Kevin's own screen (his reported blob could not be reproduced on .21). Not tested in Safari or Firefox (container queries and `:focus-visible` are standard in both). Real touch hover not tested (hover is gated to `(hover:hover) and (pointer:fine)`). Live-app keyboard Tab ring viewed only in the preview state sheet, not on the real page. Hope rail and other tabs' interior were not reviewed beyond the 0-pixel diff of the Mix Check page (the active tab at capture time).
