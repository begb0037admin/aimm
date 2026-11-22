# Insight: add a YouTube link (Jules, 22 Nov 2026, design only)

Scope: Knowledge base card toolbar (`.kb-toolbar`) in `#knowledge`, base build 2026-11-22.1. Preview: `preview-youtube-link.html` (add `?scale=1.4` for text size). Rules: UI_DESIGN_STANDARD.md, SPEC.md (this folder), approved palette only. No new colours, no boxes behind icons, no emoji.

## 1. Placement
- New toolbar button after Import: label **Add YouTube link**. Neutral style, same as Import/Export (`.btn.ghost.sm`, #2a2e35, #d5d8dc, 44px, radius 10, 15px bold). No icon, no emoji. id `kbYt`.
- Clicking it opens a field row **directly under the toolbar, full width of the card** (`.kb-yt`, id `kbYtRow`, hidden until opened) and focuses the field. Clicking the button again, or Escape in the field, closes it (only when idle). Row stays open while working and showing a result. Row is the same 12px padding as the toolbar.
- Why a row not an inline field: the toolbar already holds six items and wraps; a full-width row keeps the link readable at any text size and narrow width.

## 2. The row
`[ field (flex 1, min 220px) ] [ Add ]` then the status line underneath (own line, full width).
- Field `#kbYtInput` (`.kb-yt-in`): fill #2a2e35, no border, radius 10, 44px min height x scale, 15px Inter, ink #e5e7ea, placeholder "Paste a YouTube link" in #9aa0a6. `type=url`, `inputmode=url`, `autocomplete=off`, `aria-label="YouTube link"`.
- Button `#kbYtGo`: solid teal (reuse `.btn.amber.sm`, the same primary as Add note), label **Add**. Enter in the field = click Add. Disabled while empty or working (dimmed #9aa0a6 ink on #2a2e35, no hover).
- Accepts youtu.be/ID, youtube.com/watch?v=, /shorts/, /live/, with extra query text; trims spaces. A pasted valid link does not auto-submit; Kevin presses Enter or Add (one deliberate action).

| State | Look |
|---|---|
| Rest | #2a2e35 fill, grey placeholder |
| Hover (field) | no change (a lighter fill would be a new colour); text cursor |
| Focus | 2px #b970ff Library purple ring (the card's section colour; the app's blue focus ring stays for everything else), ink stays #e5e7ea |
| Button hover / focus | solid white, black ink (as every toolbar button) |
| Working | field read-only at 70%, button disabled with label **Adding...** |

## 3. Status line (`.kb-yt-msg`, role=status, aria-live=polite)
Plain text, 14px x scale, no box, no icon, wraps, never truncates. Sits under the field, 8px gap. Neutral lines use #c4cad3; the title in the success line is #e5e7ea 600.
| State | Text | Colour |
|---|---|---|
| Progress | Getting the transcript... then Filing it in Hope's library... then Writing the summary note... (the line is replaced as each step starts) | #9aa0a6, plus a 2px indeterminate line under the row in #b970ff over track #2a2e35 (reuse `.meter`; animated width, honours reduced motion: static half-width) |
| Success | Added: <title>, N chunks. Summary note added. | #c4cad3, title #e5e7ea; the field clears, row stays so another link can be pasted |
| Already there | Already in the library: <title>. No new note added. | #c4cad3 |
| No captions | This video has no captions, so there is no transcript to add. | #e8b45a Tools yellow |
| Service unavailable | The transcript service is not available right now. Try again in a minute. | #e8b45a |
| Not a YouTube link | That is not a YouTube link. Paste a link from the Share button. | #e8b45a |
| Monthly limit | The monthly limit for adding videos has been reached. It resets next month. | #f97316 Categories orange |
Yellow = problem you can retry or fix; orange = stopped until a limit resets (same meaning as the budget meter: 6000 yellow, cap orange). No red (not in palette). Colour is never the only signal: every line says what happened in words. If the transcript is filed but the summary note fails: "Added: <title>, N chunks. The summary note could not be written." (yellow).
Contrast on #1a1d21: yellow 9.2, orange 6.9, #c4cad3 and #9aa0a6 above 6.
Errors leave the pasted link in the field so it can be corrected. Success also appears in the existing import toast host (`#kbImportToastHost`) with the same Undo as file import (Active-with-undo); the status line stays as the record.

## 4. Scaling and narrow
Every size is `calc(Npx*var(--inv-text-scale,1))`. Row is `display:flex;flex-wrap:wrap;gap:8px`; at narrow widths (below about 480 px of card) the Add button drops under the field at full width; the status line wraps. Checked in preview at 1000 wide, scale 1.4 (headless Chrome); the 380 render was clipped by Chrome minimum window width, so the narrow stacking rule is stated, not yet seen.

## 5. Reuse (no new component styles beyond these four)
- Button: `.btn.ghost.sm` (open), `.btn.amber.sm` (Add), both inside `#knowledge .kb-toolbar`-style rules (copy the three .btn rules to `.kb-yt .btn`).
- `.kb-toolbar` for the row's flex/padding; `.meter` + `i` for progress; `.hope-status` for the 13px grey base of the status line (raise to 14px); `#kbImportToastHost` for the toast; kbImportFile pipeline unchanged.
- New: `.kb-yt`, `.kb-yt-in`, `.kb-yt-msg` (+ `.is-warn`, `.is-stop` colour modifiers). CSS in `preview-youtube-link.html`.
- Copy: no "Luna", no "transcript chunk" jargon beyond "chunks" (Kevin's wording).
