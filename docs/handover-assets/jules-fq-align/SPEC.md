# Fix Queue: transporter alignment spec (Jules, 2026-11-25)

Target: `.mcq-*` rules in `standalone/assets/index.html`.
Working reference is `preview.html`. The PNGs record the original alignment.
Codex builds. Jules specs. Do not change the design without telling Jules.

"Container width" below = content box of the Fix Queue card (the `@container` host), not the viewport.

## (a) Left edge: align by structure, not pixel offsets

Define the left inset ONCE, on `.mcq-left`, as shared custom properties. Both the list rows and the transporter read them.

```css
.mcq-left{--mcq-pad:20px;--mcq-rank:28px;--mcq-rank-gap:14px;--mcq-act:20px;--mcq-act-gap:14px;--mcq-end:16px;min-width:0}
.mcq-item{padding:8px var(--mcq-end) 8px var(--mcq-pad);gap:var(--mcq-rank-gap)}
.mcq-rank{width:var(--mcq-rank);flex:none}
.mcq-transport{padding:0 var(--mcq-end) 0 var(--mcq-pad)}   /* replaces the old padding-inline-start:20px on both */
```

- Number column = starts at `--mcq-pad` (20px) from the left edge of `.mcq-left`, 28px wide.
- The play button starts at the same `--mcq-pad`. So play box left == number box left, by the same variable.
- Optical fix (one line, keep it): the play triangle's ink starts about 4.5px inside its 24px box, so pull it back:
  `.mcq-play{justify-items:start}  .mcq-play svg{margin-left:-3.5px}`
  `justify-items:start` is required. With `place-items:center` the negative margin is halved and the icon lands in the wrong place (this is what broke the live build).
- Remove any other left indent on `.mcq-transport` or `.mcq-modes`.
- Result in the browser (pixels): "01" ink left 49.0, play ink left 49.5. Difference 0.5px.

## (b) Sizes and gaps (13.5px stems)

| Thing | Value |
|---|---|
| Play/pause icon | 24x24 svg, stroke 1.5, line style, colour `#e8ebee` (teal on hover/focus) |
| Button box | 24x24, no background, no border, no pill |
| Play button to first stem label | 36px |
| Between stem words | 36px |
| Stem font | Inter 13.5px / 500, `#7b8190`; active or hover/focus: teal `#2dd4bf`, 600 |
| Vertical | transporter 24px under the last row; items centred on one line |

Do NOT use `clamp()` or `cqw` for the gaps. They are fixed steps (below).

Chrome measured a maximum combined label width of 301.625px with the bundled Inter font and selection, focus and hover on three different labels. With 20px left padding, a 24px toggle, the 36px gap to the labels, three 36px label gaps and 16px right padding, the row needs 505.625px. The grid uses `minmax(506px,524px) minmax(0,1fr)`.

Below 506px, the three gaps between the labels shrink to 20px. Below 458px, the labels start on a second row aligned with the play button. Each individual stem label stays on one line.

```css
@container (width < 506px){.mcq-modes{gap:20px}}
@container (width < 458px){.mcq-transport{display:block}.mcq-modes{margin-top:12px;flex-wrap:wrap;gap:12px 20px}}
```

## (c) Tick and cross columns

- Each row: `.mcq-row-actions` is flex, `gap:var(--mcq-act-gap)` (14px), pinned to the row's right padding (`--mcq-end` 16px).
- Each action button is a fixed 20x24 box (`--mcq-act`), icon 18px, line style, grey `#7b8190`, teal on hover/focus. No boxes.
- Fixed widths mean every tick lines up in one column and every cross in another, whatever the fix name length. Measured: tick left 518, cross left 552, identical on every row.
- The last stem label fits inside the row’s 16px right inset.

## (d) Behaviour by container width

| Card content width | Layout | Left column | Label gap |
|---|---|---|---|
| 900px and above | Two columns | 506–524px | 36px |
| 506px to below 900px | Stacked | Full width | 36px |
| 458px to below 506px | Stacked | Full width | 20px |
| Below 458px | Stacked with labels below the toggle | Full width | 12px row / 20px column |

Chrome confirmed a 0.5px difference between number and play ink and a single row of stem labels at 1280px, 1500px and 1728px with the Hope rail open.
