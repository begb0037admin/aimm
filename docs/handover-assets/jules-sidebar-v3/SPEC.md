# Library sidebar v3 - design spec (Jules, 21 Nov 2026)

Rules followed: UI_DESIGN_STANDARD.md (no boxes behind counts, arrows, icons, markers; no emoji; natural case headings; Inter).

## The green dot beside Status
It is `.inv-sidebar-selected-dot` (teal, #2dd4bf). Meaning: "the row you picked lives in this section, but the section is folded shut." It shows only when a section is collapsed AND holds the selected row. Keep it. Make it a plain dot in the heading ink (black) so it reads on the coloured bar. It is not a status light.

## Decisions
1. Header. DECIDED (Kevin, 21 Nov): no title word. One slim row (28px) holding only the collapse arrow, right-aligned. No divider, no fill, plain glyph, tap area 36x28. Codex deletes the BROWSE/title `<span>` in `.inv-sidebar-head` (markup) and the CSS that styles it.
2. Section heading: five coloured bars stay. Label only (Status, Tools, Library, Video chain picks, Categories), sentence case, 14px/700, black ink, wraps. No number. Arrow plain at the right edge. Selected-here dot sits before the arrow.
3. Subheadings: remove all five. They repeat the heading, and the blue squares break the no-boxes rule. Each section has one list, so a subheading adds nothing.
4. Notes: remove "Counts are products" AND the Tools note "AIMM tools run from this browser..." (Kevin: noise, 21 Nov). Preview hides both with display:none; Codex deletes the markup.
5. Row: icon 20px | label (wraps to 2 lines, never ellipsis) | count at the right, plain number, tabular digits, 14px. Row min-height 38px but grows with text. Padding 7px 10px. Selected row has its OWN teal background (see "Selected row" below). Per-row counts stay, coloured by status as now.
6. Scan folders: REMOVED from the sidebar (Kevin, 21 Nov), moves to Settings (see below). The sidebar ends after the Categories section.

## Responsive rules
- Width 761px and up: `clamp(236px, 236px x text-scale, 34vw)`. Wider text = wider sidebar, capped at a third of the screen.
- Collapsed rail stays 64px (icons only). At 760px and below it is the 64px rail automatically (unchanged).
- No `white-space:nowrap`, no ellipsis, no fixed heights anywhere in the sidebar. Labels use `overflow-wrap:break-word` and wrap.
- Everything sized with `calc(var(--inv-text-scale,1) * Npx)` so the sidebar follows the View text-size setting.
- Test: 1280, 1440, 1728 wide; text size 80%, 100%, 130%; every Tools label ("Batch Plug-in Management", "Compare Plug-in Profiles") visible in full.

## Consolidation for Codex (the "patches")
Delete and rewrite as one block (about 40 rules), not another layer:
- Head: lines 4064-4066, 4252-4254, 4412-4414, 4424 (media), 4727 (hover bg), 4738 (colour !important).
- Section toggle: 4067-4071 (old mono 10px heading + CSS chevron) vs 4854-4881 (new bar). 4070-4071 `::after` chevron is killed by 4856 `display:none!important`. 4857 re-sets gap/padding already set at 4854. Chevron is restyled FOUR times (4864-4870, 4874-4875, 4878-4881): boxed, then black box, then none. Keep only the last intent.
- Heading fill: 4854/4855 (dark bar), 4858 (is-current fill), 4872 (always filled), 4876 (border always colour) - 4852/4853 border-on-expanded and glow are overridden by 4876.
- Heading count: 4860-4861, 4873, 4883, 4885 (box added, then removed). Remove count element in JS (line ~9467) rather than hide.
- Row count: 4090 (box+border), 4096-4097 (re-adds box when active), 4752, 4882, 4885 (removes box again). Colour set four times: 4091-4094, 4748-4751, 4800-4803, 4820.
- Row: 4080-4089 vs 4894-4896; 4082 active border vs 4895 `border:0`; 4089 ellipsis/nowrap vs wrap needed.
- Layout width: 4055 `236px` fixed, 4056, 4424.
- Notes: 4073-4074, 4078-4079, 4906.
- Subgroup: 4890-4892 and JS labels at ~9466 - delete both.
- Markup: remove `<div class="inv-status-note">`, remove "BROWSE", change `STATUS/TOOLS/...` to sentence case in HTML instead of uppercasing by CSS.
- JS invInitSidebarSections (~9450): stop building subgroup and heading count.

## Selected row - no JS overlay (21 Nov, fixes dark-on-dark bug)
Cause: line 4895 made the active row transparent and relied on the JS pill (.inv-sidebar-pill) sitting behind it. If the pill did not place, the row showed dark text on the dark card.
Fix: the active row paints itself. One rule, `.inv-side-button.active` = background var(--pv-teal) (#2dd4bf), radius 9px, no border, bold, label + icon + count all var(--pv-black) (about 10:1 contrast). Hover keeps teal. It is the row's own box, so it always lines up and grows with wrapped text and the text-size setting. Same rule in every section, and in the 64px rail.
Checked in the live preview at 1440 wide: Status (All plugins), Video chain picks (Stock Plugins, wraps to 2 lines), Categories (Delay): all readable. Not checked: Tools/Library selected, collapsed rail, 760px and below.
Codex must DELETE:
- Markup/JS: the pill element creation (line ~9476 `pill=document.createElement...appendChild(pill)`), function invSidebarPlacePill (~8258-8267), invSidebarTrackPill (~8269-8273) and every call: ~8280 (invSidebarSyncSelection), ~9474 (transitionend listener), ~9478 (resize), ~9479 (scroll listener); the `.filter(... "inv-sidebar-pill")` at ~8980.
- CSS: 4897, 4898, the invPillBreathe keyframes (4899), the pill parts of 4905-4907, and the transparent override at 4895-4896. Replace with the one teal rule in override.css.
- Dropped: the "breathing" brightness pulse (motion noise). Slide animation between rows is gone too; optional later with a CSS-only transition, not needed.

## Removed rows and notes (Codex removes in markup)
- `.inv-tools-note` element (line ~5184) and its JS rewrite at ~7410 (invInitStandaloneToolButtons note text). Delete both CSS rules (4078-4079, 4738, 4906).
- "Plugin Compatibility" disabled row (line ~5188). Remove until the feature exists. Note: inventory_navigate (~17522) lists disabled items; check nothing depends on this row.

## Other helper text in the sidebar (NOT removed in the preview)
1. (Moved to Settings, see below) Scan folders card, value text "No folders connected" / "N connected - N bundles inspected" (line 5215, JS 8323). Recommend: KEEP but shrink to one line, e.g. "2 folders" or "No folders". "bundles inspected" is jargon; the main panel already shows scan info. Hope's tools read this text (17524), so keep the element.
2. Tooltips (title attributes) on rows, e.g. "Review AIMM's vendor-verified updates...", "No vendor update observations are connected...". Not visible text, only on hover. Recommend KEEP the short ones; the long "no observations connected" ones on Updates / Up to date / Manual check are really status messages, better shown in the main panel empty state. Low priority.
3. Long aria-labels ("Unchecked - no vendor status result is connected"). Not visible. Keep for screen readers.
4. DONE in preview: "Stock Plugins (Logic Pro 13)" is now "Logic Pro stock" (CSS). Codex: change the markup text at ~line 5199 (and any JS/Hope text that matches the old label).
5. "Not licensed (UAD)": REMOVED by Kevin (see below).
6. (Done, see "Video chain picks icons" below.)

## Found while testing (bug, for Codex)
(Resolved: the Scan folders block leaves the sidebar, so it no longer nests inside the Categories card.)

## Wrap and alignment sweep (21 Nov, headless Chrome, live preview)
Tested: window 1440 and 2560; sidebar 236px, 283px (text 120%, the largest setting; range is 80-120%), text 80/100/120%; all rows forced bold (worst case for the selected state). Checked every row, heading, Filters, Scan folders.
Found and fixed in preview (CSS):
- "Multi-" / "FX" split on a hyphen (Channel Strips & Multi-FX at 283px). Now hyphens:manual.
- "Channel Strips &" ending a line with the ampersand; "Compare Plugin / Profiles" and "Instruments & / MIDI" unbalanced. Now text-wrap:balance on rows and headings, text-wrap:pretty on the Scan folders text. Result: "Channel Strips / & Multi-FX", "Compare / Plugin Profiles".
- No clipped text and no ellipsis at any width. Icons and counts stay centred on the row (checked at 120%).
Still left (two-word breaks, acceptable): "Batch Plugin / Management", "Remove Old / Installers" and similar at 236px + 120% text.
Codex markup hardening (cannot be fixed in CSS): use a non-breaking space after "&" in "Pitch & Modulation", "Instruments & MIDI", "Distortion & Amps", "Utility & Metering", "Channel Strips & Multi-FX", and a non-breaking hyphen (U+2011) in "Multi-FX". Otherwise "Pitch &" can still end a line at 236px + 120%.
Needs Kevin's call:
- (Resolved, row removed) "Not licensed (UAD)" breaks as "Not licensed / (UAD)" at 236px, leaving "(UAD)" alone. Resolved: Kevin removed the row (below).
- Fixed 236px width: at 120% text, 10 rows wrap at 236px. The fluid width (283px at 120%) removes almost all. Recommend keeping the fluid width.
Selected state checked: Tools (Batch Plugin Management, two lines, readable), Library, and the 64px rail (teal square, black icon, readable). Not exercised: the manual collapse button (headless click did not collapse it); I used the 700px width, which gives the same rail.
Bug (Codex): in the rail, the Video chain picks rows have no icon and the label is hidden, so they show as empty buttons. Needs icons (design follow-up: Owned, Logic Pro stock, Not installed).

## Remove "Not licensed (UAD)" row (Kevin, 21 Nov)
Preview: hidden with CSS. Codex removes ONLY the button markup (`data-inv-scope="not-licensed-uad"`, ~line 5192 in standalone/assets/index.html). Do NOT touch the UAD licence logic: unlicensed UAD stays hidden from the Plugins tab; docs/handover-assets/uad-owned.json and standalone/assets/uad-licence.js unchanged.
Dependency check (grep of index.html and tests/):
- KEEP line ~8287 `const notLicensedCount=split.notLicensed.length;` and the `const split=invUadSplit(groups);groups=split.owned;` line: tests/uad-licence.test.mjs:59 matches that exact text.
- KEEP the `INV_SCOPE==="not-licensed-uad"` branch (~9036-9041) with `split.notLicensed.filter(` and `data-uad-override`: tests/uad-licence.test.mjs:60-61 assert them. It becomes unreachable from the sidebar; leave it.
- `setStatusCount("invSidebarNotLicensedCount",...)` (~8322) is null-safe (checks the node), so removing the button breaks nothing. Optional to drop, but not needed.
- Hope tool inventory_summary (~17543) reports `uad_installed_not_licensed`; unaffected. inventory_navigate lists sidebar buttons, so it simply stops listing this one.
- tests/hope-inventory and hope-favorites only stub invUadSplit: unaffected.
- Side effect to tell Kevin: the not-licensed view held the only "treat as licensed" override button (`data-uad-override`). With the row gone, a user cannot reach that override from the UI. Needs Kevin's call if that matters (UAD plug-ins wrongly marked unlicensed would stay hidden with no way to fix them).

## Scan folders moves to Settings (Kevin, 21 Nov)
Sidebar: block hidden in preview (CSS). Codex deletes the markup (`.inv-folder-summary`, ~5215) and its CSS (4098-4099, the `.inv-folder-summary` entries in 4414, 4424, 4699). The sidebar ends after the last section.

Where in Settings: inside the existing "Plugin companion" card (#settingsPluginCompanion, ~5472), under the Connect row, as a sub-block. Reason: both answer "how does the Plugins tab get its list of plug-ins", and no new card or nav link is needed. Do not make a new boxed card for two lines of text.
Shows (no box, no emoji, no divider):
- Sub-title "Scan folders" (15px bold, same as card text, sentence case).
- One line below, 13px muted (#9aa0a6): "No folders connected" or "2 connected - 1,204 bundles inspected" (the existing string from JS ~8323). Keep the middle dot already used by the JS.
- Optional second muted line: last scan time, the text from #invLastScan.
Buttons: STAY on the Plugins tab. "Manage AIMM scan folders" (#invAddRootBtn) is the first-run call to action in the Plugins empty state, and the folder chips (#invRoots, with remove buttons) live next to it. Moving them would split one task across two tabs and break the focus handoff (JS ~7542). Settings is read-only status. Optional small text link under the line, "Manage in Plugins", that switches to the Plugins tab (plain text, no box). Codex's choice.
How: MOVE the existing element `<span id="invSidebarFolderMeta">` into the Settings card with the same id. Nothing in JS changes.

Dependencies (checked, grep of index.html and tests/):
- JS ~8323 `document.getElementById("invSidebarFolderMeta")` then `if(folder)folder.textContent=...`: null-safe; works wherever the element lives as long as the id stays. It runs inside invRenderSidebar, which runs whenever the Plugins view renders; Settings text will be current after the first Plugins render. If Settings is opened first, it shows the default "No folders connected": Codex should call the same update from the Settings open path or from invRenderRoots (~7519) so it is right on first view.
- Hope tool inventory_navigate (~17524) returns `scan_folders` from `document.getElementById('invSidebarFolderMeta')?.textContent`: document-wide, so keep the id and it keeps working.
- tests/: none reference invSidebarFolderMeta or inv-folder-summary. tests/plugin-companion-page.test.mjs stubs #invScanBtn only (unaffected, as the buttons stay).
- #invAddRootBtn / #invScanBtn / #invRoots / #invLastScan: NOT moved. No change to ~7485-7558, 8613, 9374, 9483, 9635, 17578.
- CSS: the Settings card styles (#settings .settings-companion-copy etc.) already match; add one rule for the sub-title and one for the muted line, using the existing Settings text sizes.

Preview of Settings (CSS only, mock): open Settings, the Plugin companion card shows "Scan folders / No folders connected" under Connect. Built from pseudo-elements, so it shows only the default text.
NOT shown: live folder names or counts, the last-scan line, the optional "Manage in Plugins" link, behaviour on first open.

## Header collapse button: icon (Kevin, 21 Nov)
Replaces the "<" chevron. Glyph: a panel (rounded rectangle, 17x15 in a 24 grid) with a vertical bar near the left. Same line style as the row icons: 24px viewBox, stroke 1.6, round caps and joins, currentColor, shown at 20px. No box, tile or fill behind the button.
- Expanded (sidebar open, button = collapse): the left pane is tinted (45% fill) to say "panel is open".
- Collapsed rail (button = expand): outline only, no tint.
- Colour: #aab2bd at rest, #eef2f6 on hover and keyboard focus. Focus: 2px #36a8ed outline, 1px offset, 6px radius (visible). Tap area 36x28 unchanged.
- Keep `aria-label` and `title` ("Collapse filters" / "Expand filters", set by JS ~8327-8333, line 5161). Keep `aria-expanded`; the two states are chosen by it.
Codex: put an inline SVG inside #invSidebarToggle (open version with the tint path; swap or toggle the tint path by aria-expanded, or ship two `<svg>` and show one by CSS). Delete the `::before` chevron CSS at ~4253-4254 (and the `--inv-chevron-*` use there) and the "‹"/"›" text set by JS ~8329 (`toggle.textContent=...`): the glyph must not change by text any more.
Preview: CSS mask (same two SVGs as data URIs) on the button's ::before; the real build uses inline SVG so it needs no mask. Both states checked in the live preview (expanded at 1440, collapsed state forced by setting aria-expanded=false at 700px). Not shown: hover and focus rings in a screenshot (rules are in override.css, not captured), and the real click animation.

## Section fold icons (Kevin, 21 Nov)
Replaces the chevron on the five heading bars. Choice: MINUS when the section is open, PLUS when it is closed.
Why: it is the standard accordion mark, so the meaning is read at a glance, and it cannot be confused with the header's panel icon (a rounded rectangle with a bar). A chevron or arrow would look like the "<" it replaces and suggest navigation, not folding. The plus also says "more is inside".
Spec: 24 viewBox, stroke 1.8, round caps, shown at 18px. Minus = `M5 12h14`; plus = minus plus `M12 5v14`. currentColour = black (var(--pv-black)) on the heading colour. Plain glyph, no box, no tile (UI_DESIGN_STANDARD). Stays at the right edge of the bar, after the selected-here dot. Chosen by `aria-expanded` on the heading button (true = minus, false = plus); no animation needed (optional 120ms cross-fade).
Codex: put an inline SVG in `.inv-sidebar-chevron` (JS ~9473 creates the element; it can create the SVG instead), delete the `::after` chevron CSS (~4864-4881 and the rotate rules on `[aria-expanded]`) and the `.inv-sidebar-chevron` box rules. Keep aria-hidden on it; the button keeps aria-expanded and its label.
Preview: CSS mask on `.inv-sidebar-chevron::after` with the same two SVGs. Checked in the live preview: all five closed (plus on each bar) and open (minus). The preview's click test is flaky for mixed states, but the icon follows aria-expanded.
Header vs sections: header = panel glyph, grey, on the dark card; sections = plus/minus, black, on the colour bar. Different shape, colour and place.

## Video chain picks icons (Kevin approved, 21 Nov)
Three rows (`data-vocal-view` ~5197-5199) get an icon like every other row. Same style: 24 viewBox, stroke 1.6, round caps/joins, no fill, currentColor, 18px in the 20px `.inv-side-icon` slot.
- Owned: circle with a check (`<circle cx="12" cy="12" r="8"/><path d="m8.5 12.3 2.4 2.4 4.6-5"/>`).
- Logic Pro stock: box/cube (`<path d="M12 3.5 19.5 7.5v9L12 20.5l-7.5-4v-9Z"/><path d="M4.8 7.7 12 11.8l7.2-4.1M12 11.8v8.4"/>`).
- Not installed: dashed circle (`<circle cx="12" cy="12" r="8" stroke-dasharray="3 3"/>`), "empty slot".
Codex: add `<span class="inv-side-icon" aria-hidden="true"><svg viewBox="0 0 24 24">...</svg></span>` before the `.inv-side-label` span in each button, exactly like the Status rows, and add `aria-label`/`title` like the others. Then delete the preview `::before` block. CSS needed for the rail: none. The existing rail rules (label hidden, button centred, gap 0) already show `.inv-side-icon`. Selected state needs none either: the teal rule forces icon black.
Checked live at 700px (rail): all three icons show and align with the icons above and below; "Logic Pro stock" selected = teal square with black icon. At 1440 the labels now line up with the other sections.
