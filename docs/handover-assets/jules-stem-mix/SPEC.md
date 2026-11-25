# Mix Check "Stem mix" block: transporter restyle (Jules, 2026-11-25)

Target: `#mcStemStack` (`.mc-stem-player-head`, `.mc-stem-big-play`, `.mc-stem-track-meta`, `.mc-stem-clock`, `.mc-stem-modes`) in `standalone/assets/index.html`.
Reference: `preview.html` (copy its CSS, `.stem-*` classes map to the live `.mc-stem-*` ones), `preview-1000.png`, `preview-1500.png`.
Same design language as the approved Fix Queue transporter (`../jules-fq-align/SPEC.md`). Codex builds. Jules specs. Do not change the substance without telling Jules.
Scope: restyle only. Same markup, same ids, same behaviour (`refTogglePlay()`, `data-stem-mode`, `aria-pressed`, clock sync). Card (`#mcStemStack` surface, border, 18px padding) and everything below the stem row (status, `#mcStemRows`) are untouched.

## What is removed or changed

| Thing | Now | New |
|---|---|---|
| Play button | 46px teal filled circle, black solid triangle | 24px line icon, no circle, no fill |
| Position | circle left of the title | play sits on the row under the title |
| Title | Inter 700 20px | Inter 500, `var(--aimm-section-title-size)` (20px, 18px at 560), -0.035em, `#f1f2f4` |
| Meta line | 12px `#9aa0a6` | 13.5px 400 `#7b8190`, tabular numbers |
| Stem choice | 4 outlined pills, selected = teal filled | 4 plain words, 36px apart; selected teal 600, others grey 500 |
| Clock | 20px bold elapsed | 14px 500, elapsed `#e8ebee`, "/" and total `#7b8190` |

## Layout (top to bottom, all left edge = card content edge)

1. Head row: `.mc-stem-player-head{display:flex;align-items:flex-start;gap:24px}`. Left: title, then meta line (6px under title). Right: clock, `padding-top:3px` so its baseline sits with the title.
2. Transporter row: `margin-top:24px`, `display:flex;align-items:center;flex-wrap:wrap;column-gap:36px;row-gap:12px;white-space:nowrap`. Play, then the four stem words.
3. Everything under that unchanged.

Title ink left, meta left and play ink left are all the card content left edge. No indent anywhere.

## Play / pause

- 24x24 box, no background, no border. SVG 24x24, stroke 1.5, line style (sprite `#i-play` and `#i-pause`; both already in the live sprite sheet), colour `#e8ebee`; hover/focus-visible teal `#2dd4bf`. No focus ring box (colour change is the focus cue).
- Left alignment trick (same as Fix Queue, required): `.stem-play{display:grid;justify-items:start;align-items:center}` and `.stem-play svg{margin-left:-3.5px}`. The triangle's ink starts about 4.25px inside its box; this pulls it to the title edge. Do not use `place-items:center`, it halves the negative margin.
- Both transporters show the play triangle when idle and `#i-pause` when playing. Their title and `aria-label` both switch between “Play stem mix” and “Pause stem mix”.
- The current JS swaps in a solid filled path; replace it with `<use href="#i-play">` / `<use href="#i-pause">` so the line style holds. Remove `ic-solid` on this svg.

## Stem words

- Inter 13.5px / 500, `#7b8190`, no box, no border, no padding, no background.
- Selected, hover, focus-visible: teal `#2dd4bf`, weight 600.
- Gap between words 36px; play to first word 36px (the transporter `column-gap`).
- Measured one-line width: 24 (play) + 36 + 302.7 (words, 2px reserve for the 600 weight) + 108 (3 gaps) = 470.7px.
- Remove the live `!important` pill overrides (lines ~2893-2895, 3033-3080, 27802-27803, 27953 for `.mc-stem-modes`); they would fight this.

## Behaviour by width (content box of `#mcStemStack`, i.e. card width minus 18px padding and border)

| Content width | Result |
|---|---|
| 472 and up (all normal desktop: card 1000 gives about 906, card 1500 gives about 1406) | One line, 36px gaps. Measured last word ends about 516px from page left at 1000 and 1500. |
| 412 to 471 | One line, gaps 20px, play to words 24px. |
| below 412 | Words move to a second row under play, same left edge, `margin-top:12px`, `gap:12px 20px`, wrap allowed between words only. |

```css
@container (max-width:471px){.stem-modes{gap:20px}.stem-transport{column-gap:24px}}
@container (max-width:411px){.stem-transport{display:block}.stem-modes{margin-top:12px;flex-wrap:wrap;gap:12px 20px}}
```
`#mcStemStack` needs `container-type:inline-size`. Every stem word `white-space:nowrap`. Meta line may wrap between its facts at narrow widths (`flex-wrap:wrap`); never inside one fact. Title: one line, ellipsis. Clock stays top right.

## States

| State | Play icon | Words | Clock |
|---|---|---|---|
| Stopped, stems loaded | play, `#e8ebee` | selected teal 600, rest grey | 0:00 / total |
| Playing | pause, `#e8ebee` | same | live elapsed / total |
| Selected stem | n/a | only that word teal 600; hover on others also teal | n/a |
| All stems (Full song) | n/a | "Full song" is the default selected word | n/a |
| Disabled (no stems, "0 aligned stems") | play, opacity .4 | all grey, opacity .4, selected word NOT teal, `cursor:default`, no hover | 0:00 / 0:00 |

Disabled: set `aria-disabled="true"` and `tabindex="-1"` and ignore clicks. Use `[data-empty="true"]` on the stack or the existing no-stems condition.

## Verified in Chrome (puppeteer-core, preview.html)

Play ink left vs title left (card content edge, x=47): 47.75 vs 47.00, difference 0.75px, at 1500, 1000, 700, 480 and 380 page widths. All four stem words share one top at 1500, 1000, 700 and 480 (480 uses the 20px gap), and wrap to a second row only at 380 (by design). Screens: `preview-1000.png`, `preview-1500.png`.

## Open questions for Kevin
1. Keep the card surface (grey rounded box with border) around the block? I left it untouched because you asked only for the title, transport, stems and meta. Your "no boxes" rule would suggest flat on black like the Fix Queue.
