# Site-wide title consistency — design spec

Author: Jules (design). Date: 23 Nov 2026. Build audited: 2026-11-23.17, branch `library-bars`, served at http://127.0.0.1:8768/ (source `standalone/assets/index.html`). For Codex, via Jacob. Design only: `index.html` was not edited.

Kevin, 23 Nov: "every tab will use this font and size", "I want consistency over the entire site", and (correction) the tab intro title also becomes the 20px style, so there is no 30px title any more.

## 1. The one title token

Inter, `--aimm-section-title-size` (20px desktop, 18px at max-width 560), weight 500, colour `#f3f7fb` (`--aimm-page-heading-color`), letter-spacing `-.035em` (-0.7px at 20px, -0.63px at 18px), line-height 1.2, natural title case, no text-transform.

Shorthand used everywhere below ("TITLE"):

```
font:500 var(--aimm-section-title-size)/var(--aimm-heading-line-height) var(--aimm-font-display);
letter-spacing:var(--aimm-heading-letter-spacing);color:var(--aimm-page-heading-color);
```

## 2. Role system (revised for Kevin's correction)

| Role | Rule | Size |
|---|---|---|
| (a) Tab intro title (`#tabIntroTitle`, one per tab) and Mix Check "Drop your mix here" | TITLE | 20 / 18 |
| (b) Every card, panel, section, bar, dialog title | TITLE | 20 / 18 |
| (c) Sub-headings and labels | Unchanged, listed per tab below | 9.5 to 16 |
| Data values (Mix Check metrics 26/700, 19/700, Settings credit values 22/700, plugin stat numbers) | Unchanged, not titles | n/a |

Size no longer separates the page title from card titles. Hierarchy for the intro now comes from four things, all already in the build, none needing extra weight or size:

1. Position: it is the first text under the tab bar, and the only title with no surface behind it (card titles sit inside a card or a flush bar).
2. The muted description directly under it (`#tabIntroDescription`, 14px / 450 / `#b8c4d1`), which no card title has.
3. A larger gap below the intro than any gap between a title and its own content: intro to first card 28 to 50px against title-to-content gaps of 8 to 14px.
4. Same weight (500), no bold, no accent colour. Do not add a rule, icon or box to the intro.

Because the intro line is now 24px tall instead of 36px, the block shrinks 12px. Keep the rhythm by changing `.tab-intro` margin from `0 0 4px` to `0 0 16px` (viewed at 1900 and 560: tab bar to title and title to description both stay comfortable, first card position is unchanged on Mix Check, Library and Plugins).

## 3. Per-tab tables

"Now" values are computed in a real Chrome (puppeteer-core, headless) at 1900 after clicking each tab; raw dump in `audit-computed-1900.json`. Tracking in px at 1900. Selectors are the live ones.

### 3.1 Every tab: intro

| Element | Selector | Now | New | Notes |
|---|---|---|---|---|
| Tab intro title (all 7 tabs) | `#tabIntro h2#tabIntroTitle` (`.tab-intro h2`) | Inter 30/500, -1.05px, `#f3f7fb`; 24px under 720 | TITLE (20 / 18) | Drive it by the variable: `--aimm-page-heading-size:var(--aimm-section-title-size)`. Remove the 720px `--page-title-size` override from use here. Between 561 and 720 it is 20px (was 24). |
| Intro description | `#tabIntroDescription` | 14/450 `#b8c4d1` | unchanged | Stays the subordinate line. |

### 3.2 Mix Check

| Element | Selector | Now | New | Notes |
|---|---|---|---|---|
| Drop your mix here | `#mixcheck.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) .mc-drop-title` (`strong.mc-drop-title`) | Inter 30/500, -1.05px, `#e7f1fb` | TITLE | Uses `--aimm-page-heading-size`, so the variable change does it; I also repeated the rule. Colour moves `#e7f1fb` to `#f3f7fb`. Hint line under it (teal, 12px) unchanged. Viewed: sits centred in the drop zone with the icon above, still reads as the primary prompt through position and the teal hint. |
| Audio Specs | `#mixcheck.oz-mixcheck #mcSpecsTitle` | Inter 28/700, -0.98px, `#f1f4f8` | TITLE | Delete the weight 700 rules at the two places that force it (`#mcSpecsTitle{font-weight:700}`, `.oz-spec-title{font-weight:700}`). Stays centred in its narrow column. |
| Spectral Balance | `#mixcheck.oz-mixcheck .oz-spec-title` | Inter 28/700, -0.98px, `#f1f4f8` | TITLE | Same two rules. Subtitle (14/400 `#a5b1c0`) unchanged; the 5px stack gap stays. |
| Saved Targets | `.mc-saved-targets-label` | 15/700 teal `#68d3e6` | unchanged (c) | Control label inside a row. Teal is the accent. |
| Spotify Reference | `strong` in the Spotify card | 18/750 `#f2f8f4` | unchanged (c), flag | Source name beside a logo, not a section title. 18/750 is close to the new 20/500; if Kevin wants it quieter, drop to 16/600. Left alone. |
| Metric labels and values | `.mc-core-label` 13/500, `.mc-core-value` and `.mc-measure-value` 26/700, `.mc-tile-v` 19/700, `.oz-band-label` 11/700 UC | n/a | MUST NOT change | These are data, not titles. Applying TITLE here would shrink the readouts. |
| Legacy hidden headings | `.ref-spec-head h3`, `.oz-input-title`, `.section-head h2` ("Troubleshooter"), `h2.section-head` ("Platform Loudness Comparison", 24/700) | various | none | All `display:none` or inside `.oz-legacy-hide`. If they are ever re-shown they must take TITLE. Better: Codex removes dead markup. |

### 3.3 Library

| Element | Selector | Now | New | Notes |
|---|---|---|---|---|
| Section bars (Add to Hope's library, Hope's review, Browse, Videos, Notes, Saved chats) | `#library .bar` | Inter 20/500, `#f3f7fb`, -0.4px (-.02em) | TITLE (tracking only) | Size already right. Tracking is -.02em, not the documented -.035em. Decision for Kevin: I recommend moving to -.035em so one token governs everything; the change is 0.3px. |
| Player title | `.lp .title` (`h3#libPlayerTitle`) | Inter 28/500, -0.42px, `#fff`; set via `--t-title` 28/24/22 | TITLE | Long video titles wrap fine at 20px (overflow-wrap already `anywhere`). Margin-top 22px kept. |
| Playlist | `.lp .phead h2` | Inter 22/500, -0.22px, `#fff`; `--t-head` 22/20 | TITLE | Count beside it (`.count`, 18/500 grey) unchanged. |
| Video error title | `.lp .fail h3` | Inter 20 to 26 clamp/500 | TITLE | Hidden unless a video fails. |
| Results header | `#library .rhead h3` | Inter 16/500, `#fff` | TITLE | "Results for ..." heads the search results block, so it is a section title. Rows below stay 16. |
| Channel name | `.lp #libPlayerChannel` (`--t-chan` 17 to 18) | Inter 18/500 `#fff` | 16/500 `#c9ced6` | Forced by the change: 18 white under a 20 white title loses hierarchy. Lowered one step and greyed to the colour already used for the playlist count. |
| Playlist row titles | `span.rt` 18/500 white | unchanged (c), flag | Row titles are list content, one step under the 20px panel title. Close, but they sit in a list, so I left them. If Kevin wants stronger separation, set `--t-row` to 16. |
| Group buttons, field labels, buttons | `button.grp` 16/500, `label.lbl` 16/500, `.btn` 15/500, `.n` counts 16/500 grey | unchanged (c) | |
| Entry titles in lists | `.ent .t h4` 16/500 | unchanged (c) | |

### 3.4 MixBus

| Element | Selector | Now | New | Notes |
|---|---|---|---|---|
| Bus titles (Master, Vocal, 808 / Bass, Drum, FX Returns) | `#mixbus .bus-col h4`, `.bus-title` | Inter 20/500 `#f3f7fb`, -0.4px | TITLE (tracking only) | Same -.02em vs -.035em note as the Library bars. |
| Fold glyph, "Add plugin", toolbar buttons, `?` hint | `.bus-fold`, `Add plugin` 15/500, `.btn.sm` 15/500, `.chain-toolbar-hint` 18/500 | unchanged (c) | |
| Hidden stage and recipe card headings | `.stage-card h4`, `.recipe-card h4/h5` | n/a | none | Not shown in the current build. If shown they take TITLE for h4 card titles. |

### 3.5 Plugins

| Element | Selector | Now | New | Notes |
|---|---|---|---|---|
| Plugin inventory | `#plugins .inv-title` (`h2`) | -apple-system 24/700, -0.48px, `#f2f4f5` | TITLE | Beside the new 20px intro "Find the right tools for your sound" it is the same size. Separation is the card surface, the 13px grey subtitle and its position inside the panel. Viewed at 1900: reads clearly as the panel title. Subtitle `.inv-subtitle` 13/400 unchanged. |
| Sidebar group bars (Status, Tools, Library, Video, Categories) | `#plugins #invSidebar .inv-sidebar-section-toggle` (also the `:hover:not(:disabled)` rule, which outranks it) | Inter 16/700, ink `#0b0d10` on palette fill, 48px bar | 20/500, -.035em, line-height 1.2; keep dark ink | These are collapsible bars, the same role as Library bars and MixBus buses, so they take the size and weight. Ink stays dark: `#f3f7fb` on the yellow and blue fills would fail contrast. Longest label "Categories" fits the 253px sidebar with room. At 560 the sidebar collapses to an icon rail, so no bars show there. |
| Sidebar items and counts | `.inv-side-label` 15/700 or 500, `.inv-side-count` 15/700 coloured | unchanged (c) | Counts are numbers, no boxes. |
| Stat labels and values | mono 9 to 11px caps, 22px values | unchanged (c) | Data. |
| Video chain picks | `#plugins .vocal-fav-head h2` | 20px (inherits bold from `h2`) | TITLE | Weight fix only. Item names `.fav-card-top h3` 14px are card item names, unchanged (c). |
| Dialogs opened from Plugins | `#invProductMetaOverlay h3`, `#invNoteOverlay h3`, `#invTagManagerOverlay .inv-tag-manager-head h2` | 17 to 18px / 700, `#e6e9ed` | TITLE | See Dialogs. |

### 3.6 Settings

| Element | Selector | Now | New | Notes |
|---|---|---|---|---|
| Card titles: Costs, API keys & Agent access, Session safety, How Hope's voice routes work, Reset | `#settings .settings-section > h3` (`#settingsCosts`, `#settingsKeys`, `#settingsSafety`, `#settingsNotes`, `#settingsReset`) | -apple-system 15/700, -0.15px, `#f3f4f6` | TITLE | Viewed at 1900 and 560: fits, card padding unchanged, "Costs" now sits with the same weight as the Library bars. Heading to first control gap was about 18px; keep it (the line is 1.5px taller). |
| Audio reference companion, Plugin companion | `#settings .settings-companion-title` | -apple-system 20/700, -0.2px, with 16px gap to its icon | TITLE | Size already 20; change family, weight and tracking. Has `font-size ... !important`; the replacement must remove or match it. |
| "What do these settings do?" | `.settings-guide-heading strong` | -apple-system 15/700 | TITLE | Disclosure card title. Its small description line (12px) stays. Question-mark glyph circle at left is existing and untouched. |
| Provider name | `#costCardEleven > h5` ("ELEVENLABS") | 14/700 caps, +0.5px | unchanged (c) | Provider label inside the Costs card, not a section title. Note: it still breaks the "no block capitals" rule in UI_DESIGN_STANDARD. Out of scope here; separate cleanup. |
| Hope voice safeguards | `.rt-tools-panel > h4` | 12/700 caps | unchanged (c) | Collapsing it to 20px would put a section title inside a card that already has one. |
| Route cards | `.settings-route-card > h4` | 13/700 | unchanged (c) | Sub-headings in a 3-up grid; 20px would wrap and outweigh the body. |
| Guide articles | `.settings-guide article h4` | 13/700 | unchanged (c) | |
| Field labels | `.label` 10/700 caps, `.rt-keylabel-hint` 11/400 | unchanged (c) | |
| Jump chips | "API keys & agents" etc. | unchanged | Controls. |
| Credit values | `#elBalance` etc. SF Mono 22/700 | MUST NOT change | Data. |
| Hidden panel head | `#settings > .section-head h2` ("Settings", 24/700 caps) | `display:none` | none | Hidden; delete from markup when convenient. |

### 3.7 Marketing and Community

| Element | Selector | Now | New | Notes |
|---|---|---|---|---|
| Intro title | `#tabIntroTitle` | 30/500 | TITLE | The only title on each tab. |
| Hidden panel heads | `#marketing > .section-head h2`, `#community > .section-head h2` | 15/700 caps, `display:none` | none | Not visible. Do not re-show them; the intro already names the tab. |
| "Coming soon." | `.tip-box strong` | 14/700 inline | unchanged | Inline emphasis in a notice, not a heading. |

Both tabs have no other headings (verified: audit found 0 visible headings beyond the intro). With the intro at 20px, these tabs are a one-line title, grey line and a purple notice; viewed at 1900 and 560, nothing is lost and nothing wraps (Community description wraps to two lines at 560, as before).

### 3.8 Hope / Coach panel (read-only, Markey)

No change. `.rail-head` holds a brand wordmark ("AIMM COACH" lockup, 13 to 26px bold, logo treatment) and a tagline ("chat and voice assistant"). There is no section title in the rail (`.rail-body .section-head` is already `display:none`). The page `h1` AIMIX MASTERS is the logo lockup, not a heading style. Nothing here collides with the 20px token, and I propose nothing that touches the rail's markup or styling.

### 3.9 Shared modals and dialogs

All modal titles take TITLE. Dialog surfaces and close buttons unchanged. Light-surface dialogs keep their ink colour.

| Dialog | Selector | Now | New |
|---|---|---|---|
| Add plugin to bus | `#pickerModal .modal-header h3` | Inter 22/600 `#e8ebed` | TITLE |
| Copy manually | `#copyModal .modal-header h3` | 15/600 | TITLE |
| Edit snapshot pill, Restore MixBus from snapshot | `#editPillModal`, `#applyPillModal` `.modal-header h3` | 15/600, colour `var(--sink)` !important | TITLE size/weight/tracking; keep `var(--sink)` colour |
| Load a chain preset | `#presetModal .modal-header h3` | 15/600 | TITLE |
| Load presets into MixBus? | `#genrePickerTitle` | 15/600 | TITLE |
| Bulk-import plugins via Luna | `#importModal .modal-header h3` | 15/600 | TITLE (also remove the sparkle emoji in the markup: no emoji rule) |
| Add note | `#kbModalTitle` | 15/600 `#0b0d10` on light surface | TITLE size/weight/tracking; keep ink `#0b0d10` |
| JS-built dialogs (categories, tags, note and rating, mark version, vendor status, keep, tag manager) | `#invProductMetaOverlay h3`, `#invNoteOverlay h3`, `#invTagManagerOverlay .inv-tag-manager-head h2` | 17 to 18/700 `#e6e9ed` | TITLE |

Risk: some dialog titles are long ("Mark all visible plugins as up to date?"). At 430px dialog width minus 40px padding, 20px Inter 500 wraps to two lines, which is fine because `h3` has `margin:0 0 6px` and no fixed height. Copy-manually at 560 fits on one line (viewed).

## 4. Collision and hierarchy flags

1. Intro vs card titles: same size now. Mitigated by section 2. Not mitigated if someone adds a box, rule or colour to the intro; do not.
2. Plugins: intro (20) directly above "Plugin inventory" (20). Only the card surface and subtitle separate them. Acceptable in the viewed render.
3. Library: channel name lowered to 16/grey (forced). Row titles 18 left.
4. Mix Check: do not touch the 26/19px metrics or `.oz-band-label`. Spotify Reference (18/750) left, flagged.
5. Settings: three small caps headings (h5 14, h4 12, `.label` 10) stay; they are not titles. Applying 20px would wrap in the 3-up route grid.
6. Plugins sidebar: only bar size and weight change; ink colour stays dark for contrast on the palette fills.
7. Tracking drift: Library and MixBus bars are -.02em; token and intro are -.035em. Pick -.035em everywhere (recommended) and update the two rules.
8. Source order: older rules later in the file outrank new ones (for example `#plugins #invSidebar .inv-sidebar-section-toggle:hover:not(:disabled)`, `#invProductMetaOverlay h3`). Codex should edit the rules in place or add them after, matching specificity. My injected test needed that.
9. Emoji and boxes: no emoji, arrows, highlights or boxes were added. Existing sparkle in the bulk-import dialog title and the gear in a hidden Settings head should go.

## 5. CSS draft

Tested as an injected stylesheet (`override-test.css`). Preferred implementation is editing the existing rules in place, since several need their old `font-weight:700` and size lines deleted.

```css
:root{
  --aimm-page-heading-size:var(--aimm-section-title-size);   /* intro title + drop title */
  --aimm-panel-heading-size:var(--aimm-section-title-size);  /* Audio Specs, Spectral Balance */
  --aimm-mixcheck-title-color:var(--aimm-page-heading-color);
  --aimm-panel-heading-color:var(--aimm-page-heading-color);
}
.tab-intro{margin:0 0 16px}
.tab-intro h2{font-weight:500}

/* TITLE group: font + tracking + colour */
#mixcheck.oz-mixcheck #mcSpecsTitle,
#mixcheck.oz-mixcheck .oz-spec-title,
#mixcheck.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) .mc-drop-title,
.lp .title,.lp .phead h2,.lp .fail h3,#library .rhead h3,
#plugins .inv-title,#plugins .vocal-fav-head h2,
.modal-header h3,#pickerModal .modal-header h3,
.inv-product-meta-dialog h3,.inv-note-dialog h3,
#invProductMetaOverlay h3,#invNoteOverlay h3,
#invTagManagerOverlay .inv-tag-manager-head h2{
  font:500 var(--aimm-section-title-size)/var(--aimm-heading-line-height) var(--aimm-font-display);
  letter-spacing:var(--aimm-heading-letter-spacing);
  color:var(--aimm-page-heading-color);
}
/* settings: the existing rules use !important on size */
#settings .settings-section>h3,#settings .settings-companion-title,.settings-guide-heading strong{
  font:500 var(--aimm-section-title-size)/var(--aimm-heading-line-height) var(--aimm-font-display)!important;
  letter-spacing:var(--aimm-heading-letter-spacing);color:var(--aimm-page-heading-color);
}
/* bars that are already the token: tracking only */
#library .bar,#mixbus .bus-col h4,#mixbus .bus-col.is-empty h4{letter-spacing:var(--aimm-heading-letter-spacing)}
/* plugins sidebar group bars: keep dark ink */
#plugins #invSidebar .inv-sidebar-section-toggle,
#plugins #invSidebar .inv-sidebar-section-toggle:hover:not(:disabled){
  font:500 var(--aimm-section-title-size)/var(--aimm-heading-line-height) var(--aimm-font-display);
  letter-spacing:var(--aimm-heading-letter-spacing);
}
/* library hierarchy fix forced by the 20px title */
.lp #libPlayerChannel{font-size:16px;color:#c9ced6}
/* light-surface dialogs keep their ink */
#kbModal .modal-header h3{color:#0b0d10}
#editPillModal .modal-header h3,#applyPillModal .modal-header h3{color:var(--sink)!important}
```

## 6. Selectors to change (checklist for Codex)

Variable and intro: `:root` (`--aimm-page-heading-size`, `--aimm-panel-heading-size`, `--aimm-mixcheck-title-color`, `--aimm-panel-heading-color`); `.tab-intro` (margin); `.tab-intro h2`.
Mix Check: `#mixcheck.oz-mixcheck #mcSpecsTitle`; `#mixcheck.oz-mixcheck .oz-spec-title`; `#mixcheck.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)) .mc-drop-title`; remove the two `font-weight:700` rules for them.
Library: `.lp .title`; `.lp .phead h2`; `.lp .fail h3`; `#library .rhead h3`; `.lp #libPlayerChannel` (size, colour); `#library .bar` (tracking). Container-query `--t-title` and `--t-head` values become unused for these.
MixBus: `#mixbus .bus-col h4`, `#mixbus .bus-col.is-empty h4` (tracking).
Plugins: `#plugins .inv-title`; `#plugins .vocal-fav-head h2`; `#plugins #invSidebar .inv-sidebar-section-toggle` and its `:hover:not(:disabled)` twin; `#invProductMetaOverlay h3`; `#invNoteOverlay h3`; `#invTagManagerOverlay .inv-tag-manager-head h2`.
Settings: `#settings .settings-section > h3` (covers settingsCosts, Keys, Safety, Notes, Reset); `#settings .settings-companion-title`; `.settings-guide-heading strong`.
Modals: `.modal-header h3`; `#pickerModal .modal-header h3`; keep colour rules for `#kbModal`, `#editPillModal`, `#applyPillModal`.
Marketing, Community: nothing beyond the intro.

## 7. Screenshots (real, in `shots/`)

Naming: `<tab>-<1900|560>-<before|after>.png` for mixcheck, library, mixbus, plugins, settings, marketing, community (28 files). Also `modal-<id>-<width>-<before|after>.png` for the real modals (picker, copy, preset, import, kb, edit pill, apply pill, genre picker) and `dyn-<product|note|tags>-<width>-<state>.png` for the JS-built dialogs.

Method: Chrome headless via puppeteer-core against the live build, tab clicked, "after" = `override-test.css` appended to the end of `<body>` in the page (the served file is untouched).

What I looked at myself:
- Viewed: before at 1900 for Marketing, Settings, Mix Check, Plugins, Library; after at 1900 for Mix Check, Settings, Plugins, Library, MixBus, Marketing; before at 560 for Mix Check; after at 560 for Settings and as a 7-tab contact sheet; after at 560 for the Copy-manually modal; after at 1900 for the tag-manager harness.
- Captured but not individually opened: before at 1900 for MixBus and Community; before and after at 560 for Library, MixBus, Plugins, Marketing, Community (seen only in the small contact sheet); Community at 1900; most modal and dyn shots. Computed styles were read for all of them.

Limits: the JS-built Plugins dialogs are a harness with the real class names and sample text, not opened through the app, and the tag-manager harness lacks its real inner content so it renders oversized. Computed values there are real; layout is not. Library list behaviour at long video titles and the Plugins tab with real inventory data (empty here) were not seen.
