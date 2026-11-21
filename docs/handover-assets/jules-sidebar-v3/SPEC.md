# Library sidebar v3 - design spec (Jules, 21 Nov 2026)

Rules followed: UI_DESIGN_STANDARD.md (no boxes behind counts, arrows, icons, markers; no emoji; natural case headings; Inter).

## The green dot beside Status
It is `.inv-sidebar-selected-dot` (teal, #2dd4bf). Meaning: "the row you picked lives in this section, but the section is folded shut." It shows only when a section is collapsed AND holds the selected row. Keep it. Make it a plain dot in the heading ink (black) so it reads on the coloured bar. It is not a status light.

## Decisions
1. Header. Drop the empty block. One slim row (32px): title "Filters" left, collapse arrow right. No divider line, no fill. Arrow is a plain glyph, no box. Needs Kevin's yes on the word "Filters" (BROWSE was removed; the arrow needs something beside it). Fallback: arrow only, right-aligned, 28px row.
2. Section heading: five coloured bars stay. Label only (Status, Tools, Library, Video chain picks, Categories), sentence case, 14px/700, black ink, wraps. No number. Arrow plain at the right edge. Selected-here dot sits before the arrow.
3. Subheadings: remove all five. They repeat the heading, and the blue squares break the no-boxes rule. Each section has one list, so a subheading adds nothing.
4. Notes: remove "Counts are products". The Tools note stays for now (muted, 12px, wraps); recommend Kevin decides whether to drop it too.
5. Row: icon 20px | label (wraps to 2 lines, never ellipsis) | count at the right, plain number, tabular digits, 14px. Row min-height 38px but grows with text. Padding 7px 10px. Selected row keeps the teal fill. Per-row counts stay, coloured by status as now.
6. Scan folders card: same card style as the sections (neutral bg, 1px border, 12px radius), title case "Scan folders", text wraps anywhere.

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
