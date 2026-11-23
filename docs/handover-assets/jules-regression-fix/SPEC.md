# AIMM regression fix: collateral damage in build 2026-11-23.22 (Jules, 23 Nov 2026)

Design review only. `standalone/assets/index.html` was not edited and no git write was made. Everything below was measured on real pages in headless Chrome 1900x1000 with a real mouse (puppeteer `mouse.move`, 320 ms settle), comparing three builds served from copies in the scratchpad: checkpoint `HEAD` (3058de7b, build .18, the last approved state), the working tree (build .22), and the working tree plus my in-place fix (`preview-fix.diff`).

Kevin's four reports, one root cause: while removing the 4C highlights (fills, glows, gradients, rings) the builds deleted or neutered the `background` declarations of selected and hover rules but **left the dark-ink `color` declarations behind** (`#000`, `var(--pv-black)`). Text is now black on a dark or empty surface, or white on teal. The shared hover rule in `aimm-state.css` (index.html ~27985) cannot repair them: it is outranked by older ID-heavy selectors and by `!important` colour rules.

Kevin correction on the Plugins sidebar (relayed, 23 Nov): no colour there. Match the dashboard. The old blue/yellow bars are NOT to be restored.

## 1. Kevin's reports, reproduced

| # | Report | Real-page evidence (build .22) | Cause | Fix |
|---|---|---|---|---|
| 1 | Plugins sidebar "all white" | `button.inv-sidebar-section-toggle` background `rgb(239,239,239)` (browser default button grey; was `#36a8ed` / `#e8b45a` / `#b970ff` / `#f472b6` / `#f97316`), ink `#0b0d10`; card still has a 1px section-colour border and an 18px glow on the current card; counts red/green/amber | `background:var(--section-colour)!important` and `border:0!important` deleted from the toggle rule, but `color:var(--pv-black)!important` kept; border, glow and count colours kept | 2.1 |
| 2 | MixBus Add plugin "white + should be black" | On hover the row becomes solid teal `rgb(45,212,191)` and the row text turns `#0b0d10`, but `span.add-icon` stays `#fff`: white "+" on teal, contrast **1.86** (`contrast-build-.22.json`, 5 buses) | `.chain-add:hover .add-icon{color:#fff}` (line 390) and `.chain-add:hover{color:#fff}` (388) are leftovers from the old neutral-hover design | 2.2 |
| 3 | MixBus selected row "error" | `.chain-item.selected`: background `rgb(32,38,43)`, 2px teal inset ring, and **name, meta text, row icon and remove x are `rgb(0,0,0)` on that dark surface: contrast 1.37** | The checkpoint rules `.selected,.selected:hover{background:var(--mb-teal);box-shadow:none;outline:0}` are gone; an older dead-layer rule (line 301) now wins; the `#000` ink rule (381) stayed | 2.3 |
| 4 | "When I populate the plugin the text is not visible" | Same as 3 for any populated MixBus chain (selected row text 1.37:1). Also Clear, Edit, Save, Cancel, Restore, Load preset hover: `#000` on a transparent/dark surface (1.24:1). Plugins inventory (cards, list, ledger) populated with 9 seeded products: no new failures in product rows, cards, chips; sidebar rows invisible on hover (1.15:1, below) | see 2.3, 2.4, 2.1 | |

## 2. Damage list with exact corrective rules

All edits are **in place** (edit or delete the existing rule), none appended, no new `!important`. Line numbers are the working tree (build .22). The complete machine-applied version of every edit below is `preview-fix.diff` (apply with `patch -p1`; it was applied to a copy and re-measured, section 4).

### 2.1 Plugins sidebar: neutral, match the dashboard (Kevin's correction)

Target: card = neutral surface `#1b1d20`, border `1px #2c3034`, radius 10, flush bar (same surface, hairline `#2c3034` under it when open), title Inter 20px / 500 / `#f3f7fb` (already token `--aimm-section-title-size` and `--aimm-page-heading-color`), grey counts `#9aa0a6` (4.6:1; the old `#8993a2` is 4.3:1), selected row solid teal `#2dd4bf` with black ink, hover row solid teal with black ink, no coloured fill, border, glow or count.

| Rule (line) | Edit |
|---|---|
| `#plugins #invSidebar .inv-sidebar-card` (4948 in the file) | replace with `{position:relative;margin:0 0 12px;background:#1b1d20;border:1px solid #2c3034;border-radius:10px;overflow:hidden}` (drops `--section-colour`, `border:...!important`, radius 12) |
| the five `.inv-sidebar-card[data-inv-section=...]` colour rules and `.inv-sidebar-card.is-current` (4949-4953) | **delete** (the 18px glow ring around Status) |
| `#plugins #invSidebar .inv-sidebar-section-toggle,...:hover:not(:disabled)` (4954) | replace `color:var(--pv-black)!important` with `border:0;background:transparent;color:var(--aimm-page-heading-color)` (the missing `background` is why the browser painted it `#efefef`) |
| new line directly after it | `#plugins #invSidebar .inv-sidebar-section-toggle[aria-expanded="true"]{border-bottom:1px solid #2c3034}` |
| `#plugins #invSidebar .inv-side-count` (4972) | `color:#8993a2` to `color:#9aa0a6` |
| the four `[data-inv-scope=...] .inv-side-count{color:var(--st-...)!important}` rules (4973-4976) | **delete** (status meaning is carried by the text label) |
| `#plugins #invSidebar .inv-side-button:hover:not(.active):not(:disabled), ...:focus-visible...` (4993-4994) | `{color:var(--pv-black)!important}` becomes `{background:#2dd4bf;color:#0b0d10}`. This rule has ID specificity (2,3,0) so it beats `.inv-side-button{background:transparent}` (4965); the shared hover rule (1,6,0) never could. This is why sidebar hover was invisible (below). Keep the child rule at 4995-4996, drop its `!important`. |
| `#plugins :is(.inv-btn,.inv-format,.inv-action,.inv-more,.inv-side-button,...,.inv-view-menu>summary):hover...{color:#fff!important}` (2981) | remove `.inv-btn`, `.inv-format`, `.inv-side-button`, `.inv-view-menu>summary` from the selector list. Their hover ink now comes from the shared rule (`#0b0d10` on teal). This rule is what turned Manage AIMM scan folders, All formats/AU/VST/CLAP, My Tags and View **white on teal (1.86:1)** on hover. |
| `.inv-side-button.active` | no change needed: selected stays teal/black via 3385 |

Evidence, real mouse hover over every sidebar row, build .22: background `rgba(0,0,0,0)` (so the dark card shows) with ink `rgb(11,13,16)`: **174 failing text/icon elements at 1.15:1** across Status, Tools, Library, Video chain picks and Categories rows, in cards, list and ledger views. Checkpoint .18 showed the section colour with the same black ink (readable); the colour was removed, the black ink was not.

### 2.2 MixBus Add plugin hover

Edit 388 and 390 in place:
```
#mixbus .chain-list>.chain-add:hover,#mixbus .chain-list>.chain-add:focus-visible{background:var(--mb-teal);color:var(--mb-ink)}
#mixbus .chain-list>.chain-add:hover .add-icon,#mixbus .chain-list>.chain-add:focus-visible .add-icon{color:var(--mb-ink)}
```
Rest state (grey `#c4cad3` label, `#aab2bd` plus) is unchanged. Hover = solid teal row, black plus, black label. I read "white + should be black" as exactly this (the one computed white-on-teal in MixBus). If Kevin meant the rest-state plus, it is `#aab2bd` by the approved design and I did not change it; flagged below.

### 2.3 MixBus selected row, populated chains

Edit 301 in place (this line is the dead earlier layer that is winning):
```
#mixbus .chain-item.selected,#mixbus .chain-item.selected:hover{background:var(--mb-teal);box-shadow:none;outline:0}
```
This restores the approved design (`jules-mixbus-minimal/shots/after-1900.png`): solid teal row, black ink on name, meta, icon and x (rule 381, already present, becomes correct). Hover on the selected row does not change it. Line 247 `.selected::after` (connector line, 2px teal) belongs to the same dead layer: delete 244-247 and 301-304 duplicates when touching this.

Same family, edit in place (all currently `color:#000` with no background):
- 363 `.clear-bus-btn:hover,:focus-visible`: `{background:var(--mb-teal);color:var(--mb-ink);opacity:1}`
- 397 `.chain-panel-edit:hover,:focus-visible` (Edit): `{background:var(--mb-teal);color:var(--mb-ink)}`
- 401 `.chain-edit-actions button:hover,:focus-visible` (Save, Cancel, Restore): same two declarations
- 408 `.chain-toolbar button:hover,:focus-visible` (Load preset, Auto-fill, Revert): same two declarations
- 471 `.replacement-option[aria-checked="true"],...:hover,...:focus-visible`: `{background:var(--mb-teal);box-shadow:none;color:var(--mb-ink)}` (selected replacement was black text with no fill)

### 2.4 Settings: white ink on teal, hover fill blocked

Real-mouse hover, build .22: Save and Connect buttons hover = teal `#2dd4bf` with `#fff` ink (**1.86:1**); ghost buttons (Show, Remove, Top up, Update balance, Reset MixBus) and the six nav links get no hover change at all (the approved design is teal with black ink). Cause: the Settings v-system block (5206-5256 in the file) declares rest `background` and `color` with `!important` and ID specificity, so the shared hover rule loses, and its own hover rules force `color:#fff!important`.

In place, in that block:
- remove `!important` from the rest backgrounds on `.settings-nav a,.settings-guide,.settings-section,#aimm-account-preview` (5206), `.settings-companion-connect-row button,#settingsReset #resetBtn` (`--g2`), `.rt-key-inputs input,.rt-key-inputs button,...` (`--g1`);
- remove `!important` from rest colours on `.settings-nav a`, `.rt-key-inputs button,.rt-cost-card .actions button,#aimm-account-preview .account-row button`, `#elKeyClear,...,#resetBtn`;
- the hover rule at 5236 (`:is(:hover,:focus-visible):not(:disabled),` followed by the settings-guide summary on the next line): split it. Buttons and links: `{background:var(--aimm-hover-bg);color:var(--aimm-hover-ink)}`. The `.settings-guide summary` stays white ink, no fill;
- 5246 `#elKeyClear,...:hover{color:#fff!important}` and 5252 `#elKeySave,...{color:#fff!important}`: `color:var(--aimm-hover-ink)`, no `!important`.

### 2.5 Library text buttons lost their approved hover

`.tx` buttons (Expand all, Collapse all, Export notes, Export all, Clear all): checkpoint hover = solid teal, black ink (`BRIEF-library-text-buttons-hover`, approved). Build .22: no hover at all (background `rgba(0,0,0,0)`, ink `rgb(196,202,211)`), because `#library .tx` is not in the shared hover selector list. Add `#library .tx` to **both** shared lists (the `transition` rule at ~27984 and the `@media (hover:hover) and (pointer:fine)` hover rule at ~27985, immediately after `.chain-add,.empty-add`). `#library .more` stays colour-only.

### 2.6 Small items (not collateral, fix while there)
- `.inv-menu-row.disabled` text `#7b8190` on `#202329` is 4.04:1: set `--pm-off` to `#8a909a` (4.9:1).
- Existing in checkpoint and build, not regressions, but under 4.5:1: `.inv-stat small` `#69737d` 3.5:1, `.inv-search .inv-small` "Find" 4.46:1, `#invScanBtn` (disabled) 4.33:1, zero counts `#7b8190` 4.34:1. Raise the first two to `#9aa0a6`.

## 3. Classification of every removed or changed rule

Method: parsed every `<style>` rule in `HEAD` and the working tree (3,510 vs 3,399 rules), compared normalised bodies: **565 rule bodies removed, 453 added; 179 selectors removed outright, 386 changed; 108 change a visual property** (`evidence/css-property-diff-HEAD-vs-build22.txt`, per-property removed/changed list; `evidence/css-rules-removed-selectors-gone.txt`, the 179). Tab strip rules (`.tab*`, `.tabs.oz-tabstrip*`) excluded per brief.

**Intended (match an approved spec), the large majority of the 108 (my manual split, not machine-counted).** Removal of hover fills, borders, rings, glows and gradients on content rows, headers and icon-only controls (motion-fix spec section 4C): Knowledge/Insight (`.kb-card`, `.fact-chip`, `.fact-cat-head`, `.fact-action-btn`, `.insight-add`, `#kbModal .btn`), Snapshots (`.rt-pill*`, `.journal-entry-head`, `#snapshots` gradients), Voice/AI chat (`.aichat-*`, `.rt-cost-card`, `.voice-mode-toggle`), Mix Check (`.mcq-select`, `.mcs-all`, Spotify controls, `.mc-saved-target-*`, `.mc-input-*`, stem-mode hover, `#mcTempoTile`), Library `.bar:hover` fill, MixBus `h4:hover` and `.chain-item:hover` grey fills, Plugins `.inv-more`, `.inv-action`, `.inv-product-actions`, `#invProductMetaOverlay button`, `#pickerModal .plugin-option` purple gradient, `#invTagManagerOverlay` hovers; lighter-teal hover variants (`.btn.primary` `#5eead4` now `#2dd4bf`); `font`/`var(--aimm-font)` swaps; `.chain-item` icon rule changes; the section-title tokens. Those hovers are now deliberately absent (verified: no contrast failure on any of them).

**Collateral damage, roughly two dozen rules (counted by hand from the list), numbered above:**
`#plugins #invSidebar .inv-sidebar-section-toggle` (2.1), `.inv-sidebar-card` border and `.is-current` glow, `[data-inv-scope] .inv-side-count` (4 rules, colour kept against Kevin's request), `.inv-side-button:hover:not(.active)` ink-without-fill (2.1), `#plugins :is(.inv-btn,.inv-format,...)` white ink (2.1), `#mixbus .chain-item.selected` (2.3), `.clear-bus-btn:hover`, `.chain-panel-edit:hover`, `.chain-edit-actions button:hover`, `.chain-toolbar button:hover`, `.replacement-option[aria-checked]`, `.chain-add:hover` + `.add-icon` (2.2/2.3), five Settings hover/colour rules (2.4), `#library .tx` hover list membership (2.5).

**Which build did it:** I could not attribute each removal to .19, .20 or .22. Only two points exist on disk (the committed checkpoint .18 and the working tree .22); intermediate builds are not in git or in `docs/handover-assets`. What the evidence does show: the Plugins sidebar colours were still present in .19 (`jules-font-icons/built/plugins-1900.png`, blue and yellow bars), so the sidebar fill was removed in .20 or .22. The selected MixBus row cannot be dated: no .19 screenshot has a populated chain, which is itself why this went unseen. Ask Codex for `git reflog` or its per-build commits if attribution matters.

**Other tabs, same pass:** Mix Check, Library, Marketing, Community have no selected-row or hover regressions in the 8, 18, 0 and 0 stateful elements my harness reached (Mix Check is thin: most of it needs a loaded track). Library `.bar:hover` and `.tx` covered above. Plugins main area (cards, list, ledger, product menu, picker) shows no new contrast failures after seeding nine products.

## 4. Before / after, measured

`contrast-*.json` holds every text or icon element under 4.5:1 (3:1 for icons and large text), walking up to the first opaque ancestor, per populated state: Plugins cards, list, ledger, selected Updates, product menu, MixBus rest, MixBus hover of every row/Add/Clear/Edit/toolbar, MixBus edit mode with replacement list, Add plugin picker.

| Build | Flags | New vs checkpoint |
|---|---|---|
| checkpoint .18 | 112 | n/a (pre-existing small greys, section 2.6) |
| working tree .22 | 304 | **213 new**: 174 sidebar hover at 1.15, MixBus selected row 1.37 (x3 states), Clear/Edit 1.24, Add plus 1.86 |
| .22 + `preview-fix.diff` | 83 | **0 new** except the disabled product-menu rows (2.6) |

Computed hover audit (`hover-audit-*.json`, real mouse over 7 tabs, 137 stateful or interactive elements, rest and hover): sidebar section bars `rgb(239,239,239)` (build .22) become transparent on the `#1b1d20` card with ink `rgb(243,247,251)` (fix); sidebar rows hover `rgb(45,212,191)` / `rgb(11,13,16)`; Settings buttons hover teal / `rgb(11,13,16)`; MixBus selected, Clear, Edit, Add plus all black ink on teal. Screenshots: `shots/popnew-*.png` (broken), `shots/popfix-*.png` (fixed), `shots/popold-*.png` (checkpoint). The seeded MixBus plugin names read "undefined" in my screenshots because my harness fed minimal objects; the contrast numbers are unaffected.

## 5. Verification list Codex must pass (real mouse, 1900 wide and 560 wide)

Use puppeteer or Playwright `page.mouse.move` over the element centre, wait 300 ms, read `getComputedStyle`. Scripts: `tools/audit.mjs` (hover audit), `tools/pop.mjs` (populated contrast). Seed Plugins with `INV_SCAN_ROWS` and MixBus with `STATE.chain` as in `pop.mjs`.

1. Plugins sidebar, all five groups, rest: toggle background not `rgb(239,239,239)` (must be transparent over card `rgb(27,29,32)`); title ink `rgb(243,247,251)`, 20px, weight 500; card border `rgb(44,48,52)` radius 10; no `box-shadow` on any card; every count colour `rgb(154,160,166)`.
2. Hover every `.inv-side-button` that is not active: background `rgb(45,212,191)`, text, icon and count `rgb(11,13,16)`, contrast at least 9:1. Active row: same colours at rest and on hover.
3. Hover All formats, AU, VST, CLAP, Manage AIMM scan folders, My Tags, View: ink `rgb(11,13,16)` on `rgb(45,212,191)`, never `rgb(255,255,255)`.
4. MixBus with 3 plugins on a bus: selected row background `rgb(45,212,191)`, no inset ring, name, meta, row icon and x all `rgb(0,0,0)` or `rgb(11,13,16)`; hover on it changes nothing. Unselected rows: ink at least 4.5:1, no fill on hover (content row), x visible.
5. Hover Add plugin: row `rgb(45,212,191)`, label and `.add-icon` both black. Move off: transparent, grey plus.
6. Hover Clear, Edit, Save, Cancel, Restore, Load preset, Auto-fill, Revert: teal fill, black ink. Replacement list: selected option solid teal with black ink.
7. Settings: hover each of the six nav links and Show, Remove, Top up, Update balance, Reset MixBus, Save, Connect: background `rgb(45,212,191)`, ink `rgb(11,13,16)`.
8. Library: hover Expand all, Collapse all, Export notes, Export all, Clear all: teal fill, black ink; `.more` colour only.
9. Contrast scan (`pop.mjs`): zero elements under 4.5:1 (3:1 icons, large text) in Plugins cards, list, ledger, product menu, MixBus rest, hover and edit mode, and the picker; disabled rows included once `--pm-off` is raised.
10. Regression guard: `grep -c "color:#fff!important" ` must not list any selector that also appears in the shared hover list (`.btn,.pill,.video-pill,.lib-pub-pill,.eq-tool-btn,...,#library .tx`); every `:hover` rule that sets a dark ink must also set a `background` (a script that flags a `:hover` rule with `color:#000|#0b0d10|var(--pv-black)` and no `background` should return nothing).
11. Rebuild screenshots at 1900 and 560 of Plugins (cards, list, a hovered row, the Status group), MixBus (populated, one hovered Add plugin, one selected row) and Settings (one hovered nav link and button), then send to Jules before Kevin sees anything.

## 6. Coloured fills and group bars still on other tabs (for Kevin)

Scanned every visible element's computed background, gradient, saturated border and glow, per tab, build .22:
- **Plugins:** sidebar card borders in blue, yellow, purple, pink, orange plus a blue 18px glow on the current card (fixed in 2.1). Format chips `.inv-chip.vst3` purple fill (and AU blue, CLAP etc.): data tags, not group bars; say if they should go neutral.
- **Mix Check:** workspace mode strip is a navy tint `rgba(7,13,23,.74)` with a blue-grey border `#303b4a`; small blue-grey borders on three labels; Saved Targets card has a gradient; `.is-idle` button has a gradient; Spotify mark has an 18px blue glow; Audio Specs canvas has a gradient (the locked waveform area is exempt). All differ from the neutral `#1b1d20` / `#2c3034` standard.
- **Marketing and Community:** `.tip-box.alt` is a solid purple `#581c87`.
- **Settings:** the cost-card "Backup" button is slate `rgb(55,65,81)`.
- **Library, MixBus:** clean (neutral surfaces, teal only).
These are design differences, not text-visibility bugs. I have not changed them; a neutral pass for Mix Check, Marketing, Community and Settings can follow if Kevin wants it.

## 7. What I checked and could not check

Checked on real rendered pages, real mouse: all seven tabs at 1900x1000, rest and hover for every button, link, summary, row, header, selected and active element I could enumerate (137 across tabs); populated Plugins in cards, list and ledger, with Updates selected, and the product-actions menu open; populated MixBus with three and two plugins, edit mode with the replacement list, the Add plugin picker. Fix measured on a patched copy.
Not checked: the product-meta overlay `#invProductMetaOverlay` (my script could not open it, no menu row matched; Codex must include it in item 9); Plugins at 560 wide and any 560 state; real scan data (I seeded nine synthetic rows, not Kevin's inventory); Mix Check after a track is loaded (selected stems, Spotify results, saved targets); press and keyboard-focus states; drag state; Kevin's own browser (he may have different zoom or `--inv-text-scale`); which build removed each rule (section 3). The selected MixBus row is shown with a 2px inset ring in Kevin's screenshot, which matches build .22 exactly (`2026-11-23.22`).

## 8. Process note
Three shipped builds changed state rules without a populated-state check; every earlier screenshot was of empty buses or an empty inventory. Add a populated-state contrast check (item 9) to Codex's pre-hand-off test run so this stops.
