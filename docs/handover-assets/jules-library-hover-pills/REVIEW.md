# Library tab design review (Jules, 23 Nov 2026)

Build reviewed: 2026-11-23.4, `standalone/assets/index.html` on branch `library-bars` (uncommitted), served at http://127.0.0.1:8768/ with the real 739 videos. Specs: `jules-library-hover-pills/SPEC.md`, `jules-library-tab/SPEC.md`. Nothing in `index.html` was edited.

## Verdict
FAIL, 4 defects (none is in the bars or the pill hovers). Bars, flush fit, outlines, folded state, pill spacing, hover colours, no-shift and rest ink are all correct. What is wrong: (D1) disabled buttons are almost invisible (1.96:1), (D2) the results heading is uppercase, (D3) the tip edit row is broken at wide width (Cancel/Save in the wrong columns, Save touching the textarea), (D4) wrapped action rows sit 4px apart in stacked mode. D1 is the likely source of "text invisible at rest". Fixes are exact below; Codex applies them, then re-run the audit (method at the end).

## How it was checked (real build, not a description)
Headless Chrome (CDP) against the served build at 1900, 1300 and 560 wide; tab forced to Library. Six states per width: a default and empty, b seeded (2 tips in review, 3 results incl. an Added one, 3 notes, 4 chats with 2 favourites), c Videos open (real data, first row opened, Show more), d everything folded, e tip in edit, f tips kept (Undo). Every control (about 400 per width) was measured at rest, then with a real mouse move onto it (hover), then after a real Tab key press plus focus (keyboard :focus-visible): ink colour and contrast against the composited background, fill, ring, size/position of every control (shift), gap to the nearest neighbour, distance to card edge and to hairlines. I then viewed the full-page shots and contact sheets of rest, hover, focus crops at all three widths.

## Pills and buttons, every control by state
Rule used: pill rest = transparent, ink contrast 4.5 or more; hover = section colour fill with black ink (teal outside a section, white for solid buttons); keyboard focus = same fill plus 2px black inset ring; no size or position change of anything; neighbour gap 8 or more (12 in footers/ends), 14 or more from card edge and hairline; no underline. Figures are the worst case over 1900, 1300, 560 and all states.

| Section | Kind | Control | Rest ink contrast (min) | Hover fill (expected) | Hover ink contrast | Focus (keyboard) | Shift on hover/focus | Min gap / card edge / hairline (px, pills) | Verdict | Screenshot (1900) |
|---|---|---|---|---|---|---|---|---|---|---|
| Add to Hope's library (blue) | field | YouTube link | 11.0 | grey field (white) | 11.0 | grey field, ring yes | 0 | - | PASS | crops/1900-add-YouTube_link-field-{rest,hover,focus}.png |
| Add to Hope's library (blue) | btn | Add | 8.0 | white (white) | 21.0 | white, ring yes | 0 | - | PASS | crops/1900-add-Add-btn_pri-{rest,hover,focus}.png |
| Add to Hope's library (blue) | field | e.g. 808s in hip hop | 11.0 | grey field (white) | 11.0 | grey field, ring yes | 0 | - | PASS | crops/1900-add-e_g_808s_in_hip_hop-field-{rest,hover,focus}.png |
| Add to Hope's library (blue) | btn | Find | 8.0 | white (white) | 21.0 | white, ring yes | 0 | - | PASS | crops/1900-add-Find-btn_pri-{rest,hover,focus}.png |
| Add to Hope's library (blue) | btn | Write a note | 9.5 | white (white) | 21.0 | white, ring yes | 0 | - | PASS | crops/1900-add-Write_a_note-btn-{rest,hover,focus}.png |
| Add to Hope's library (blue) | btn | Import a file | 9.5 | white (white) | 21.0 | white, ring yes | 0 | - | PASS | crops/1900-add-Import_a_file-btn-{rest,hover,focus}.png |
| Browse row (teal) | field | Search videos, notes a | 11.0 | grey field (white) | 11.0 | grey field, ring yes | 0 | - | PASS | crops/1900-none-Search_videos_notes_and_sav-field-{rest,hover,focus}.png |
| Browse row (teal) | field | All channelsMix With T | 11.0 | grey field (white) | 11.0 | grey field, ring yes | 0 | - | PASS | crops/1900-none-All_channelsMix_With_The_Mas-field-{rest,hover,focus}.png |
| Browse row (teal) | pill | Expand all | 12.7 | teal (teal) | 11.3 | teal, ring yes | 0 | 12 / - / - | PASS | crops/1900-none-Expand_all-tx-{rest,hover,focus}.png |
| Browse row (teal) | pill | Collapse all | 12.7 | teal (teal) | 11.3 | teal, ring yes | 0 | 12 / - / - | PASS | crops/1900-none-Collapse_all-tx-{rest,hover,focus}.png |
| Notes (orange) | pill | Export notes | 10.3 | orange (orange) | 7.5 | orange, ring yes | 0 | 28 / 14 / 15 | PASS | crops/1900-notes-Export_notes-tx_-{rest,hover,focus}.png |
| Saved chats (yellow) | grp | Favourites N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-chats-Favourites_0-grp-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Export all | 10.3 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 12 / 14 / 15 | PASS | crops/1900-chats-Export_all-tx_-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Clear all | 10.3 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 12 / 14 / 15 | PASS | crops/1900-chats-Clear_all-tx_-{rest,hover,focus}.png |
| Add to Hope's library (blue) | btn | Add all | 8.0 | white (white) | 21.0 | white, ring yes | 0 | - | PASS | crops/1900-add-Add_all-btn_pri-{rest,hover,focus}.png |
| Add to Hope's library (blue) | pill | Clear | 10.3 | blue (blue) | 8.0 | blue, ring yes | 0 | 12 / 16 / 25 | PASS | crops/1900-add-Clear-tx_-{rest,hover,focus}.png |
| Add to Hope's library (blue) | pill | Open video | 13.7 | blue (blue) | 8.0 | blue, ring yes | 0 | 8 / 14 / 28 | PASS | crops/1900-add-Open_video-tx_hi-{rest,hover,focus}.png |
| Add to Hope's library (blue) | pill | Dismiss | 6.4 | blue (blue) | 8.0 | blue, ring yes | 0 | 8 / 28 / 28 | PASS | crops/1900-add-Dismiss-tx_dim-{rest,hover,focus}.png |
| Hope's review (purple) | pill | Edit | 10.3 | purple (purple) | 6.8 | purple, ring yes | 0 | 8 / 14 / 28 | PASS | crops/1900-review-Edit-tx_-{rest,hover,focus}.png |
| Hope's review (purple) | pill | Delete | 6.4 | purple (purple) | 6.8 | purple, ring yes | 0 | 8 / 28 / 28 | PASS | crops/1900-review-Delete-tx_dim-{rest,hover,focus}.png |
| Hope's review (purple) | btn | Keep | 6.8 | white (white) | 21.0 | white, ring yes | 0 | - | PASS | crops/1900-review-Keep-btn_pri-{rest,hover,focus}.png |
| Notes (orange) | grp | Mastering N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-notes-Mastering_2-grp-{rest,hover,focus}.png |
| Notes (orange) | pill | Edit | 10.3 | orange (orange) | 7.5 | orange, ring yes | 0 | 8 / 14 / 22 | PASS | crops/1900-notes-Edit-tx_-{rest,hover,focus}.png |
| Notes (orange) | pill | View | 13.7 | orange (orange) | 7.5 | orange, ring yes | 0 | 8 / 74.34375 / 22 | PASS | crops/1900-notes-View-tx_hi-{rest,hover,focus}.png |
| Notes (orange) | pill | Delete | 6.4 | orange (orange) | 7.5 | orange, ring yes | 0 | 8 / 26.96875 / 22 | PASS | crops/1900-notes-Delete-tx_dim-{rest,hover,focus}.png |
| Notes (orange) | pill | Raw | 13.7 | orange (orange) | 7.5 | orange, ring yes | 0 | 8 / - / 22 | PASS | crops/1900-notes-Raw-tx_hi-{rest,hover,focus}.png |
| Notes (orange) | grp | Vocal techniques N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-notes-Vocal_techniques_1-grp-{rest,hover,focus}.png |
| Notes (orange) | pill | Summary | 13.7 | orange (orange) | 7.5 | orange, ring yes | 0 | 8 / 83 / 22 | PASS | crops/1900-notes-Summary-tx_hi-{rest,hover,focus}.png |
| Saved chats (yellow) | fav | Why does my kick disappear i | 11.0 | none (white) | 21.0 | none, ring n/a | 0 | - | PASS | crops/1900-chats-Why_does_my_kick_disappear_i-main-{rest,hover,focus}.png |
| Saved chats (yellow) | fav | ★ | 5.2 | none (white) | 21.0 | none, ring n/a | 0 | - | PASS | crops/1900-chats-_-star-{rest,hover,focus}.png |
| Saved chats (yellow) | fav | Reference track comparison | 11.0 | none (white) | 21.0 | none, ring n/a | 0 | - | PASS | crops/1900-chats-Reference_track_comparison-main-{rest,hover,focus}.png |
| Saved chats (yellow) | grp | Sessions N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-chats-Sessions_4-grp-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Edit | 10.3 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 4 / 14 / 22 | FAIL | crops/1900-chats-Edit-tx_-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | View | 13.7 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 4 / 74.34375 / 22 | FAIL | crops/1900-chats-View-tx_hi-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Apply to MixBus | 13.7 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 8 / - / 22 | PASS | crops/1900-chats-Apply_to_MixBus-tx_hi-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Unfavourite | 10.3 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 8 / - / 22 | PASS | crops/1900-chats-Unfavourite-tx_-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Copy | 10.3 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 8 / 67.375 / 22 | PASS | crops/1900-chats-Copy-tx_-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Delete | 6.4 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 4 / 14 / 22 | FAIL | crops/1900-chats-Delete-tx_dim-{rest,hover,focus}.png |
| Saved chats (yellow) | pill | Favourite | 10.3 | yellow (yellow) | 11.1 | yellow, ring yes | 0 | 8 / 83 / 22 | PASS | crops/1900-chats-Favourite-tx_-{rest,hover,focus}.png |
| Videos (pink) | grp | Mixing techniques N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-videos-Mixing_techniques_470-grp-{rest,hover,focus}.png |
| Videos (pink) | pill | Edit | 10.3 | pink (pink) | 7.9 | pink, ring yes | 0 | 8 / 14 / 22 | PASS | crops/1900-videos-Edit-tx_-{rest,hover,focus}.png |
| Videos (pink) | pill | Hide | 13.7 | pink (pink) | 7.9 | pink, ring yes | 0 | 8 / 74.34375 / 22 | PASS | crops/1900-videos-Hide-tx_hi-{rest,hover,focus}.png |
| Videos (pink) | pill | Open video | 13.7 | pink (pink) | 7.9 | pink, ring yes | 0 | 8 / 18.3125 / 22 | PASS | crops/1900-videos-Open_video-tx_hi-{rest,hover,focus}.png |
| Videos (pink) | pill | View | 13.7 | pink (pink) | 7.9 | pink, ring yes | 0 | 8 / 74.34375 / 22 | PASS | crops/1900-videos-View-tx_hi-{rest,hover,focus}.png |
| Videos (pink) | pill | Show 12 more | 10.3 | pink (pink) | 7.9 | pink, ring yes | 0 | 14 / - / 14 | PASS | crops/1900-videos-Show_12_more-more-{rest,hover,focus}.png |
| Videos (pink) | grp | Producer interviews / chains | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-videos-Producer_interviews_chains-grp-{rest,hover,focus}.png |
| Videos (pink) | pill | Show 6 more | 10.3 | pink (pink) | 7.9 | pink, ring yes | 0 | 14 / - / 14 | PASS | crops/-{rest,hover,focus}.png |
| Videos (pink) | grp | Mastering N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-videos-Mastering_64-grp-{rest,hover,focus}.png |
| Videos (pink) | grp | Vocal techniques N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-videos-Vocal_techniques_166-grp-{rest,hover,focus}.png |
| Videos (pink) | grp | Workflow N | 16.9 | none (white) | 16.9 | none, ring yes | 0 | - | PASS | crops/1900-videos-Workflow_21-grp-{rest,hover,focus}.png |
| Videos (pink) | pill | Show 9 more | 10.3 | pink (pink) | 7.9 | pink, ring yes | 0 | 28 / 14 / 15 | PASS | crops/-{rest,hover,focus}.png |
| Hope's review (purple) | field | Tip title | 11.0 | grey field (white) | 11.0 | grey field, ring yes | 0 | - | PASS | crops/1900-review-Tip_title-field-{rest,hover,focus}.png |
| Hope's review (purple) | field | Mixing techniquesProdu | 11.0 | grey field (white) | 11.0 | grey field, ring yes | 0 | - | PASS | crops/1900-review-Mixing_techniquesProducer_in-field-{rest,hover,focus}.png |
| Hope's review (purple) | field | When a vocal sounds bo | 11.0 | grey field (white) | 11.0 | grey field, ring yes | 0 | - | PASS | crops/1900-review-When_a_vocal_sounds_boxy_cu-field-{rest,hover,focus}.png |
| Hope's review (purple) | pill | Cancel | 10.3 | purple (purple) | 6.8 | purple, ring yes | 0 | 6 / 2 / 28 | FAIL | crops/1900-review-Cancel-tx_-{rest,hover,focus}.png |
| Hope's review (purple) | btn | Save | 6.8 | white (white) | 21.0 | white, ring yes | 0 | - | FAIL | crops/1900-review-Save-btn_pri-{rest,hover,focus}.png |
| Hope's review (purple) | pill | Undo | 10.3 | purple (purple) | 6.8 | purple, ring yes | 0 | 18.1 / 17 / - | PASS | crops/1900-review-Undo-tx_-{rest,hover,focus}.png |

Rows marked FAIL: Edit, Delete, View in Saved chats (only at 560, wrapped rows 4px apart, D4); Cancel and Save in Hope's review (only in the 1900 edit state, D3). Disabled buttons are not in this table because they are excluded from hover/focus; they fail separately (D1).

### Additional states
| State | Control | Result | Evidence |
|---|---|---|---|
| Disabled | Added (result row), Adding, Adding all, Find in flight | FAIL, effective ink about 1.96:1 (opacity .4 stacked on grey) | D1, `{1900,1300,560}-b-seeded.png` |
| Disabled | Favourite when 24 are full | Not rendered (needs 24 favourites). `.tx:disabled` uses dim ink, no opacity, looks fine by CSS | not viewed |
| Rest | Results heading | FAIL, rendered UPPERCASE with letter spacing | D2 |
| Edit | Tip edit row 1900 | FAIL | D3, `1900-e-tip-edit.png` |
| Edit | Tip edit row 1300 and 560 | PASS (stacked; Cancel left, Save beside it) | `1300-e-tip-edit.png`, `560-e-tip-edit.png` |
| Hover and focus | Group rows (Mastering, Favourites, Sessions, video groups) | PASS no change on hover, 2px white inset ring on focus | sheets |
| Hover and focus | Favourite pills (main, star) | PASS white fill, black ink, black ring on keyboard | `sheet-560-3.png` |
| Hover and focus | Fields, select | PASS 2px white ring | sheets |
| Hover | Bars | PASS no change; focus is a 2px white outline inset 3px | sheets |

## Bars and cards (flush, outline all round, folded too)
Measured as: bar left, right and top equal card edge plus the 1px border; border 1px in the section colour on all four sides; bar spans card width minus 2; section order and colours blue, purple, pink, orange, yellow. Folded = bar alone, bottom gap 1px (the border), also flush. Ink on bar 6.8 to 11.1 (all 4.5 or more).

| Card | State | Flush to card edge (L/R/T) | Outline 1px section colour, all four sides | Full width | Ink contrast on bar | Hover change | Focus ring | Verdict | Screenshot |
|---|---|---|---|---|---|---|---|---|---|
| Add to Hope's library (blue) | open @1900 | yes | yes | yes | 7.98 | none | 2px white inset ring | PASS | 1900-a-default.png (a-default) |
| Hope's review (purple) | open @1900 | yes | yes | yes | 6.82 | none | 2px white inset ring | PASS | 1900-a-default.png (a-default) |
| Videos (pink) | folded @1900 | yes | yes | yes | 7.93 | none | 2px white inset ring | PASS | 1900-a-default.png (d-all-folded) |
| Notes (orange) | open @1900 | yes | yes | yes | 7.49 | none | 2px white inset ring | PASS | 1900-a-default.png (a-default) |
| Saved chats (yellow) | open @1900 | yes | yes | yes | 11.11 | none | 2px white inset ring | PASS | 1900-a-default.png (a-default) |
| Videos (pink) | open @1900 | yes | yes | yes | 7.93 | none | 2px white inset ring | PASS | 1900-c-videos-open.png (c-videos-open) |
| Add to Hope's library (blue) | folded @1900 | yes | yes | yes | 7.98 | none | 2px white inset ring | PASS | 1900-d-all-folded.png (d-all-folded) |
| Hope's review (purple) | folded @1900 | yes | yes | yes | 6.82 | none | 2px white inset ring | PASS | 1900-d-all-folded.png (d-all-folded) |
| Notes (orange) | folded @1900 | yes | yes | yes | 7.49 | none | 2px white inset ring | PASS | 1900-d-all-folded.png (d-all-folded) |
| Saved chats (yellow) | folded @1900 | yes | yes | yes | 11.11 | none | 2px white inset ring | PASS | 1900-d-all-folded.png (d-all-folded) |
| Add to Hope's library (blue) | open @1300 | yes | yes | yes | 7.98 | none | 2px white inset ring | PASS | 1300-a-default.png (a-default) |
| Hope's review (purple) | open @1300 | yes | yes | yes | 6.82 | none | 2px white inset ring | PASS | 1300-a-default.png (a-default) |
| Videos (pink) | folded @1300 | yes | yes | yes | 7.93 | none | 2px white inset ring | PASS | 1300-a-default.png (d-all-folded) |
| Notes (orange) | open @1300 | yes | yes | yes | 7.49 | none | 2px white inset ring | PASS | 1300-a-default.png (a-default) |
| Saved chats (yellow) | open @1300 | yes | yes | yes | 11.11 | none | 2px white inset ring | PASS | 1300-a-default.png (a-default) |
| Videos (pink) | open @1300 | yes | yes | yes | 7.93 | none | 2px white inset ring | PASS | 1300-c-videos-open.png (c-videos-open) |
| Add to Hope's library (blue) | folded @1300 | yes | yes | yes | 7.98 | none | 2px white inset ring | PASS | 1300-d-all-folded.png (d-all-folded) |
| Hope's review (purple) | folded @1300 | yes | yes | yes | 6.82 | none | 2px white inset ring | PASS | 1300-d-all-folded.png (d-all-folded) |
| Notes (orange) | folded @1300 | yes | yes | yes | 7.49 | none | 2px white inset ring | PASS | 1300-d-all-folded.png (d-all-folded) |
| Saved chats (yellow) | folded @1300 | yes | yes | yes | 11.11 | none | 2px white inset ring | PASS | 1300-d-all-folded.png (d-all-folded) |
| Add to Hope's library (blue) | open @560 | yes | yes | yes | 7.98 | none | 2px white inset ring | PASS | 560-a-default.png (a-default) |
| Hope's review (purple) | open @560 | yes | yes | yes | 6.82 | none | 2px white inset ring | PASS | 560-a-default.png (a-default) |
| Videos (pink) | folded @560 | yes | yes | yes | 7.93 | none | 2px white inset ring | PASS | 560-a-default.png (d-all-folded) |
| Notes (orange) | open @560 | yes | yes | yes | 7.49 | none | 2px white inset ring | PASS | 560-a-default.png (a-default) |
| Saved chats (yellow) | open @560 | yes | yes | yes | 11.11 | none | 2px white inset ring | PASS | 560-a-default.png (a-default) |
| Videos (pink) | open @560 | yes | yes | yes | 7.93 | none | 2px white inset ring | PASS | 560-c-videos-open.png (c-videos-open) |
| Add to Hope's library (blue) | folded @560 | yes | yes | yes | 7.98 | none | 2px white inset ring | PASS | 560-d-all-folded.png (d-all-folded) |
| Hope's review (purple) | folded @560 | yes | yes | yes | 6.82 | none | 2px white inset ring | PASS | 560-d-all-folded.png (d-all-folded) |
| Notes (orange) | folded @560 | yes | yes | yes | 7.49 | none | 2px white inset ring | PASS | 560-d-all-folded.png (d-all-folded) |
| Saved chats (yellow) | folded @560 | yes | yes | yes | 11.11 | none | 2px white inset ring | PASS | 560-d-all-folded.png (d-all-folded) |

Section order in the page: Add to Hope's library, Hope's review, then Browse, Videos, Notes, Saved chats: PASS.

## Defects, exact fixes (file `standalone/assets/index.html`)
**D1. Disabled buttons nearly invisible (FAIL, high).** Cause: global `.btn:disabled{opacity:.4}` at line 50 is not reset by `#library .btn:disabled` at line 3278, so ink #9aa0a6 on #2a2e35 is dimmed twice (about 1.96:1). Fix: line 3278 becomes `#library .btn:disabled{background:var(--track);color:var(--dim);opacity:1;cursor:default}`. Expect 5.2:1. Covers Added, Adding, Adding all, Find in flight.

**D2. Results heading uppercase (FAIL).** Cause: global `.card h3{text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}` at line 339 beats `#library .rhead h3` (line 3309) on the properties it does not set. Spec is sentence case 16/700 white. Fix: line 3309 `#library .rhead h3{margin:0;text-transform:none;letter-spacing:0;font:700 calc(16*var(--u))/1.3 Inter,sans-serif;color:#fff}`.

**D3. Tip edit row broken at card 1300 and wider (FAIL).** Cancel and Save are direct grid children (markup line 22468), so they auto-place into columns 1 and 2: Cancel becomes a full-width pill in the Title column (its hover pill stretches the whole column, box 2px from the card edge), Save sits in the Files-under column with 0px gap under the textarea. Spec: Cancel under Delete, Save under Keep, 12 below the textarea. Fix, add after line 3409:
```
@container card (min-width:1300px){
  #library .ent.nk .acts>.tx{grid-column:5;justify-self:start;margin-top:calc(12*var(--u))}
  #library .ent.nk .acts>.btn{grid-column:6;margin-top:calc(12*var(--u))}
}
```
(Do not touch `margin-left/right`; the table-mode rule `.ent .acts .tx{margin:0 -12px}` stays.) Stacked mode is already correct.

**D4. Wrapped action rows 4px apart in stacked mode (FAIL, 1300 and 560).** Line 3441 `gap:calc(4*var(--u)) calc(8*var(--u))` makes pill boxes on a wrapped second line (Sessions: Delete under Edit/View/Apply) touch-close: 4px. Spec: 8. Fix: `#library .ent .acts{gap:calc(8*var(--u));margin-top:calc(12*var(--u))}`.

**Minor, no fix required, tell Kevin if he asks.** (a) Add card, Open video and Dismiss boxes are 18px apart at 1900 (spec said 28 or more; they do not touch). Optional: add grid `--grid` at line 3319 Link 116 and Dismiss 92. (b) At 560 the fixed Hope "Chat" button sits over the Saved chats footer "Clear all" when scrolled to the bottom (Markey's element). Optional: `@media (max-width:700px){#library{padding-bottom:calc(88*var(--u))}}`. (c) Tab labels truncate at 560 ("Mi...", "Pl...") outside the Library; not part of this review.

**Not design defects, route to Codex through Jacob.** (i) Opening a video row shows the raw transcript chunk with front matter ("--- title: ... source: ...") rather than a summary. (ii) Videos table has 6 columns: correct. Kevin removed Re-summarise, Remove and the Hope reads tick, and the Library spec now says six. (iii) With my seeded result data `views` as text rendered "NaN views"; confirm the Worker returns a number, or the row will show NaN.

## Evidence files (`docs/handover-assets/jules-library-hover-pills/review-shots/`)
Full pages: `{1900,1300,560}-{a-default,b-seeded,c-videos-open,d-all-folded,e-tip-edit,f-kept}.png` (screenshots of c, d, e, f are padded with black below the content, the page height was not shrunk). Contact sheets (rest | hover | focus per unique control): `sheet-{1900,1300,560}-{1..5}.png`; single crops in `crops/` named `<width>-<section>-<text>-<class>-{rest,hover,focus}.png`. The harness is in `review-tools/`. A rest crop that shows a faded pill on the previous neighbour is a transition caught mid-fade by the capture, not a defect.

## Not viewed or not verifiable
Chrome MCP was not used; headless Chrome only, so no real trackpad or touch. I viewed the full pages and a selection of contact sheets (1900 sheets 1 and 4, 560 sheet 3, full 1300 and 560 pages, tip-edit crops); the other sheets were checked numerically only, not by eye. Not rendered: 24 favourites full (disabled Favourite), Adding and Failed message lines and the sweep line, Add all progress meter, Undo after Keep (rendered, measured, not eyeballed at 560), reduced-motion, and a text scale other than 1. The build is uncommitted working-tree code; I did not check it against what is deployed on aimixmasters.com.

## Re-run after Codex fixes
Same harness (`review-tools/run.mjs 1900|1300|560` (needs the preview on 127.0.0.1:8768), then `chk.py`). Pass condition: zero FAIL rows, D1 to D4 visually confirmed in `a/b/e` shots at all three widths.
