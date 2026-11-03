# AIMM UI Design Standard

**Owner reference:** Kevin, 3 November 2026  
**Status:** Approved baseline for the remaining AIMM tabs  
**Visual source:** the current Mix Check page in `standalone/assets/index.html`

## Core rule

Mix Check is the visual template for the other tabs. Keep its established page shell, columns, tile layout, typography, spacing, dark surfaces, and blue-to-teal accents. Extend the existing components and shared CSS tokens instead of inventing new patterns for each tab.

## Typography

- Use Inter and natural title case for section headings. Do not render headings in block capitals or widely tracked uppercase.
- “Drop your mix here” is the display reference: 30px desktop, 24px narrow layout, weight 500, 1.2 line height, and `-.035em` letter spacing.
- Panel headings such as “Audio Specs” and “Spectral Balance” use the same face, weight, line height, tracking, and colour at a slightly smaller size: 28px desktop and 22px narrow layout.
- Supporting descriptions stay subordinate and muted. The Spectral Balance subtitle uses 14px text with 1.45 line height.
- Metric labels such as “Key” use the existing 13px, weight 500 style. Do not add a redundant standalone “Mix” label beneath Audio Specs; the Mix source control remains.
- Audio Specs uses “LUFS” and “LUFS short-term” as the loudness labels, with bare numeric readings so the unit is not repeated. Keep colored status dots hidden throughout Audio Specs.
- “DR” is the app’s PLR reading: true peak minus integrated LUFS, shown in dB.
- Spotify saved targets display the track title and artist by default. Keep a separate, clearly labelled Remove action on each target, and preserve a user’s manual rename.

## Alignment and spacing

- Align neighbouring panel headings to the same top baseline. Both Mix Check panels use the same 14px top inset.
- Reuse the existing column widths, tile columns, and gutter values (`--mc-rail-w`, `--gutter`, and `--page-gutter`). Keep the current two-column app and Hope rail scaffold.
- Keep the current heading-to-description gap and comfortable space between headings, controls, and tiles. Preserve the established card padding at each breakpoint.
- Check the page at desktop and narrow widths. Fix alignment at the layout level instead of adding isolated offsets to individual words or cards.

## Shared implementation tokens

The canonical values are implemented in the `:root` visual-stage block of `standalone/assets/index.html` as `--aimm-*` custom properties. Current Mix Check headings, card insets, heading stack gaps, and subtitles consume those tokens. Use these properties when styling other tabs so future adjustments stay consistent.

The existing shell and mixing-state tokens remain the foundation: `--gutter`, `--page-gutter`, `--mixing-state-fill`, `--mixing-state-outline`, and `--mixing-state-ink`. Keep the working Wrangler configuration and runtime scaffolding intact when applying this standard.

## Review checklist

Before moving a tab into the shared design, compare it with Mix Check and confirm:

1. Heading type, case, size, and hierarchy match the standard.
2. Adjacent panel headings and tile columns align.
3. Insets and gaps preserve the same breathing room.
4. Existing controls remain legible on hover and selected states.
5. The page shell, working feature behavior, and deployment configuration remain intact.
