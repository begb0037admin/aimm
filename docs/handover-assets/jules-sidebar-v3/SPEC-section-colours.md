# Sidebar v3 - section hover colours (Jules, 21 Nov 2026, build 2026-11-21.4)

Scope (Kevin, 21 Nov, supersedes earlier draft): ONLY the hover colour follows the section colour, in both the expanded sidebar and the collapsed rail. Nothing at rest changes: icons stay #aab2bd, labels #c4cad3, counts as now. No tooltips, no coloured rest icons. Rules: UI_DESIGN_STANDARD.md (no box/pill behind icons or counts; no emoji). The hover tint is on the full-width row (a full-size control), as the purple one is today.

## 1. Section-to-colour map (already in the app, no new colours)
Source: `--section-colour` on `.inv-sidebar-card`, index.html lines 4787-4791. It is the same value that fills each heading bar and its card border.

| Section (data-inv-section) | Colour | Source line |
|---|---|---|
| Status (default, no override) | #36a8ed blue | 4787 |
| Tools | #e8b45a yellow | 4788 |
| Library | #b970ff purple | 4789 |
| Video chain picks | #f472b6 pink | 4790 |
| Categories | #68d3e6 cyan-blue | 4791 |

Note: Kevin said "Categories blue"; the Categories heading is #68d3e6 (light cyan-blue), distinct from Status #36a8ed. Spec follows the heading colour so row hover matches its header. If Kevin wants the stronger #36a8ed instead, change line 4791 (heading changes too).

No markup change needed: in the rail `.inv-sidebar-card` is `display:contents` (line 4822) and still passes the inherited custom property to its rows, so one rule covers rail and expanded.

## 2. States
| State | Expanded sidebar | Collapsed rail (and mobile <=760) |
|---|---|---|
| Rest | unchanged | unchanged |
| Hover / keyboard focus (not active, not disabled) | row background = 18% tint of section colour (replaces purple `--pm-grad`), label white, icon in full section colour, count white (existing) | row (56px square, radius 12 as now) background = 18% tint, icon in full section colour |
| Selected (.active) | unchanged, teal #2dd4bf with black ink | unchanged |
| Disabled | unchanged (no hover tint) | unchanged |
| Focus ring | unchanged, 2px #36a8ed | unchanged |

The icon turning to the section colour on hover is the cue that tells Kevin where he is; the tint alone at 18% is subtle on #17191c.

## 3. Contrast (WCAG)
Icon/text on the hovered row, worst case (colour over its own 18% tint, approx #2a2236 for purple). Section colour vs sidebar #17191c: blue 6.0, yellow 9.2, purple 5.3, pink 6.7, cyan 10.1 (all above 4.5:1; UI minimum is 3:1). White label on the tint: above 12:1 in all five. Purple is the weakest, still passes; do not lower the tint opacity below the 18% or raise it above about 24% (white-on-tint stays above 9:1).

## 4. CSS draft (append after line 4832, replaces the hover colour only)
```css
/* Hover follows the section colour. Same specificity and !important as the rule at line 4805; placed after it. */
#library #invSidebar .inv-side-button:hover:not(.active):not(:disabled),
#library #invSidebar .inv-side-button:focus-visible:not(.active):not(:disabled){
  background:color-mix(in srgb,var(--section-colour,#36a8ed) 18%,transparent)!important;
  color:#fff!important}
#library #invSidebar .inv-side-button:hover:not(.active):not(:disabled) .inv-side-icon,
#library #invSidebar .inv-side-button:focus-visible:not(.active):not(:disabled) .inv-side-icon{
  color:var(--section-colour,#36a8ed)}
/* Selected rows keep teal/black via the existing rules at 4807-4808, which exclude :not(.active) above. */
```
Hover must beat the existing rule at 4805 and `.inv-side-icon{color:#aab2bd}` (line ~4809, specificity (1,2,0)); the icon selector above is (1,4,1) so it wins. Remove the `--pm-grad` hover rule at 4805 when applying, to avoid a dead rule. `color-mix` is supported in current Chrome/Safari/Firefox; fallback for older browsers is not needed for this desktop-only app.

## 5. Acceptance (Jules reviews on the live branch build, desktop and 760px)
1. Hover a Status row: blue tint, blue icon. Tools: yellow. Library: purple. Video chain picks: pink. Categories: cyan-blue. No purple on any non-Library section.
2. Same in the collapsed rail (icon turns section colour, tinted square behind the row).
3. Rest state pixel-identical to 2026-11-21.4 (grey icons).
4. Selected teal row unchanged when hovered. 100% and 150% text scale fine. No boxes behind icons or counts.
