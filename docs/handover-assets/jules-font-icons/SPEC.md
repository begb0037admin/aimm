# One font, one icon set, one motion system: design spec

Author: Jules (design). Date: 23 Nov 2026. Build audited: 2026-11-23.18, branch `library-bars`, working tree of `standalone/assets/index.html` (served at http://127.0.0.1:8768/). For Codex, via Jacob. Design only: `index.html` was not edited, nothing committed or pushed.

Kevin, 23 Nov: "use the same default font in every tab and replace all icons with high quality replacements, let's redesign these and their behaviour in terms of animation." Plan approved in chat.

Files in this folder:

| File | What |
|---|---|
| `preview.html` | Icon sheet at 16/20/24, in-context demos, interactive states, number comparison, token table. Serve over http (`python3 -m http.server` in this folder; it was served on 8771 during design). |
| `aimm-icons-motion.css` | Reference CSS for font, tokens, icon base, every state. Codex lifts it into the main `<style>`. Also the single source the preview inlines. |
| `aimm-icons-sprite.svg` | 89-symbol sprite (17.9 KB raw), ready to paste as the first child of `<body>`. |
| `fonts/inter-latin-wght.woff2` | The font file to place at `standalone/assets/fonts/`. `fonts/OFL-Inter.txt` is its licence. |
| `icons-src/` | The 90 source SVGs the sprite was built from, plus `LICENSE-lucide-ISC.txt`. |
| `shots/` | `preview-1900/560.png`, `states-1900.png`, `real-{mixcheck,settings,plugins}-{1900,560}.png`. |

---

## PART 1. Font

### 1.1 Finding

Inter is not shipped. `index.html` has zero `@font-face`; the title token `--aimm-font-display: Inter,-apple-system,sans-serif` only renders Inter because it is installed on Kevin's Mac. Any other machine, and Cloudflare-served visitors, get `-apple-system` / Segoe UI. Body (line 16) is a different stack again (`-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto`). Measured in the file: 35 `font-family:inherit`, 53 `'SF Mono'`/`"SF Mono"` declarations, 2 `var(--mono)` plus about 30 `font:` shorthands using `var(--mono)` or `ui-monospace,Menlo`, 1 `JetBrains Mono` (also not packaged, only named in `--mono`), 3 explicit Inter stacks, 2 bare `-apple-system,sans-serif`, 1 `!important` Apple stack, 12 canvas `ctx.font` strings (9 SF Mono, 3 Inter). So the app today shows at least five different stacks.

### 1.2 Bundling plan (self-hosted, no CDN)

| Item | Decision |
|---|---|
| Source | Inter variable, Latin subset, from the `@fontsource-variable/inter` build (SIL OFL 1.1, free to embed and redistribute). Downloaded at design time only; nothing loads from a CDN at runtime. |
| File | `fonts/inter-latin-wght.woff2`, **48,256 bytes (47 KB)**, measured. One file covers weights 100 to 900 (wght axis, no italics, no opsz). |
| Coverage | Basic Latin, Latin-1, general punctuation (dashes, curly quotes, bullet, ellipsis), minus sign U+2212, times, up/down arrows U+2191/2193. 230 glyphs, 518 glyph IDs. |
| Features present | `tnum`, `pnum`, `frac`, `calt`, `ccmp`. Verified with fontTools. `zero` and `ss01` are not in this build, so no slashed zero; not needed. |
| Not included | latin-ext (85 KB, not needed for UK English copy). Do not add it unless Hope's content needs it. |
| Weights needed | 400, 500, 600, 700 are what the UI uses. Existing 300 (Mix Check tile values) and 450 (descriptions) also render because the axis is continuous. No extra files per weight. |
| Placement | `standalone/assets/fonts/inter-latin-wght.woff2` (Worker assets serve it from `/fonts/...`; no Worker code change, `env.ASSETS.fetch` already handles it). Add the licence as `standalone/assets/fonts/OFL-Inter.txt`. |
| Caching | Add `standalone/assets/_headers`: `/fonts/*` then `  Cache-Control: public, max-age=31536000, immutable`. File name carries the version; a new font means a new file name. |
| Preload | In `<head>` before the style: `<link rel="preload" href="/fonts/inter-latin-wght.woff2" as="font" type="font/woff2" crossorigin>`. `crossorigin` is required even same-origin or the preload is wasted. |
| `font-display` | `swap`. Text shows at once, then swaps. With preload on a 47 KB file the swap is normally under one frame on repeat visits. |
| Layout shift guard | Add a metric-matched fallback so the swap does not reflow: `@font-face{font-family:"Inter Fallback";src:local("Arial");size-adjust:107.4%;ascent-override:90.2%;descent-override:22.5%;line-gap-override:0%}` and put `"Inter Fallback"` after Inter in the stack. Values are the standard Inter-over-Arial metrics; Codex verifies by toggling cache off and watching the title row at 1900 and 560. |
| Do not use | `local("Inter")` in `src`. A locally installed Inter can be a different version and would make Kevin's Mac and everyone else differ. |

Stack, used everywhere:

```
--aimm-font: Inter,"Inter Fallback",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--aimm-font-display: var(--aimm-font);          /* existing token kept, now an alias */
--aimm-font-mono: ui-monospace,"SF Mono",Menlo,Consolas,monospace;   /* code and keys only */
```

Set once: `html,body,button,input,select,textarea,summary,table,th,td,label,option,optgroup{font-family:var(--aimm-font)}`. Then delete the per-component `font-family` declarations listed below so nothing can drift again. `font-family:inherit` (35) can stay, it now inherits Inter.

### 1.3 Numbers: Inter with tabular figures, not monospace

Rule: every numeric readout uses the same Inter at the weight and size it has today, plus `font-variant-numeric:tabular-nums` (`font-feature-settings:"tnum" 1`). Columns stay aligned because every digit has the same advance width; the preview shows both side by side (`preview.html`, "Numbers"). Letter-spaced uppercase labels such as `CONVERSATIONAL AI` are untouched.

Role table (selectors from the file; "mono today" means it currently resolves to SF Mono / `--mono`):

| Role | Selectors (grep targets) | New |
|---|---|---|
| Body, labels, buttons, descriptions, modals, tables | `body`, `button`, `.modal*`, `.kb-card .kb-body`, `.kb-stats`, `.kb-counts`, `.recipe-step .setting`, `.journal-time`, `.hope-bytes-meter`, `.kb-bytes-meter`, `.mm-move`, `.mm-settings` | Inter, weight unchanged. These are prose or labels that happened to be mono. |
| Settings numbers | `.settings-cost-row .rt-cost-card .rt-cost-metrics .row .v`, `.rt-cost-card .row`, `.rt-tool-card .v`, `.rt-status-strip .rt-timer/.rt-cost`, `.rt-timer`, `.rt-cost`, `.aichat-cost`, `.rt-tool` | Inter, `tnum`. |
| MixBus setting values | `#mixbus .chain-setting-value`, `#mixbus .chain-setting-input`, `.recipe-step .num`, `.meter-card .target`, `.meter-card input[type=number]`, `.meter-override input`, `.card .freq` | Inter, `tnum`. Number inputs keep right alignment. |
| Mix Check meters and tiles | `.oz-meter-big`, `.mc-tile-v`, `.tile .v`, `.mc-row .mc-rv`, `.mc-core-value`, `.mc-measure-value`, `.mcs-note/.mcs-metrics`, `.oz-pt-table .oz-pt-val`, `.oz-band-val`, `.mc-sw-scale`, `.mc-sub`, `.mc-cta-sub`, `.tp-time`, `.tp-file`, `.mc-stem-clock`, `.mc-stem-status/-ref/-source`, `.mcq-prog/-rk/-tk/-meta`, `.ref-scrub-times`, `.ref-spec-*`, `.ref-pt-*`, `.ref-live-status`, `.ref-dz-sub`, `.ref-dz-file-meta`, `.ref-t-label*`, `.fa-tk`, `.mc-spotify-capture-state time`, `.stem-target-unavailable`, `#mcCtaSub` | Inter, `tnum`. |
| Plugins stats and lists | `#plugins .inv-root`, `.inv-status`, `.inv-stat span/strong`, `.inv-tag-filter-count`, `.inv-view-range output`, `.inv-list-head`, `.inv-vendor-count`, `.inv-version`, `.inv-chip`, `.inv-more`, `.lib-count-badge`, `.lib-pub-pill .ct`, `.lib-search-count`, `.genre-pick-count`, `.genre-pick-bus-count` | Inter, `tnum`. Version strings such as `2.4.1` are numbers, not code. |
| Build stamp | `#buildStamp`, `#hopeRail #buildStamp` | Inter, `tnum`. |
| Canvas text | `refDrawCanvas` (9 `ctx.font` SF Mono, 3 Inter) | All 12 become `Npx Inter`. Canvas cannot do `tnum`; axis labels are right-aligned so this is fine. Call `document.fonts.load('10px Inter')` before the first draw and redraw once on `document.fonts.ready`, otherwise the first frame uses the fallback. |
| **Monospace stays** | `code`, `pre`, `kbd`, `.aichat-msg .body code/pre`, `.journal-body pre` (Hope and journal output, can contain real code); API key and token inputs `.rt-key-inputs input` plus the licence-vault key fields (placeholders like `paste your key`, long unbroken secrets need equal-width glyphs to be checked by eye); any future file path or URL displayed as a path | `var(--aimm-font-mono)`. Drop `JetBrains Mono`. |

Everything else mono today and not in the table is a number or a label: convert. Codex's check: after the change `grep -c "SF Mono\|ui-monospace\|monospace\|var(--mono)"` should return only the stack definition, the `code/pre/kbd/samp` rule, and the key-input rule (plus the unchanged `RT_INSTRUCTIONS` text, which mentions code in prose).

### 1.4 Must NOT change

1. Hope's spoken and generated content: `RT_INSTRUCTIONS`, the ElevenLabs prompt, anything in `buildAppKnowledgeDigest`. No text edits.
2. `#mcWave` (locked canvas). It draws no text; do not touch its code. The font change cannot reach it.
3. Hope/Coach rail internals (Markey's): only the family changes, via inheritance from `body`. No size, weight, spacing or markup change in `#hopeRail`, `.aichat-*`. Markey confirms `.aichat-msg .body code/pre` keeps monospace. The "Send / Clear chat / ElevenLabs / Auto" buttons in the real shots already render Inter once the stack is applied.
4. Title token values (Inter 20/18, 500, -0.035em) are unchanged; only the stack behind them now actually ships.
5. Brand marks (the `AIMIX MASTERS` / `AIMM COACH` wordmarks) are images or custom styling; do not apply the stack to them. They did not change in the injected shots.

### 1.5 Evidence

Injected the real font (base64 into the live 8768 page) and `*{font-family:Inter…!important}`, with the former-mono elements (138 of them) given `tabular-nums`. Viewed at 1900 and 560: Mix Check, Settings, Plugins. All text rendered in Inter (computed `font-family` confirmed starts with `Inter`; `document.fonts.check('500 16px Inter')` true). Settings key field stayed monospace as designed. Nothing wrapped or overflowed at 1900; at 560 the tab labels already truncate to `M…` in the current build (existing issue, not caused by the font; the 560 tab strip needs its own pass).

---

## PART 2. Icons

### 2.1 Inventory

114 `<svg>` in the file (includes templates in JS strings), plus text-character icons. Rendered sizes today are 11, 13, 14, 18, 20, 22, 24, 28, 34 px and stroke widths 1.4, 1.6, 1.8, 2, 2.4, 3, plus filled variants and hard-coded `stroke="#fff"`. That is the inconsistency to remove.

| # | Group | Where (line) | Role | Look today | Size today | Count |
|---|---|---|---|---|---|---|
| 1 | Tab icons | 3675 to 3722 | Mix Check (sparkle, filled), Library (bulb), MixBus (faders), Plugins (hybrid wrench/plug, filled 32 grid), Settings (gear), Marketing (pulse), Community (people) | Mixed: 2 filled, 5 stroked, 3 different stroke widths, `#fff` hard-coded in 2 | 20 / 22 | 7 |
| 2 | Select caret | 3634, 3646 + `url(data:image/svg…)` in CSS | dropdown arrow | 12x8 chevron, 2 stroke | 12 | 2 + CSS |
| 3 | Section heading icons | 3851, 3966, 3983, 4415, 5842, 5853 | Conversation, Snapshot pills, Session Snapshots, Troubleshooter, Marketing, Community | 1.6 stroke, white | 22 | 6 |
| 4 | Mix Check mode switch | 4165 to 4167 | Mixing / Mastering / Stem Splitter | stroked, unsized | about 18 | 3 |
| 5 | Drop zone and input | 4170, 4176 | download arrow | stroked | 24 / 18 | 2 |
| 6 | Transport | 4192 to 4196 | skip start, back 10, play, pause, forward 10, stop | mixed filled/outline | 20 | 6 |
| 7 | Volume | 4204 | volume | outline | 14 | 1 |
| 8 | Stem big play | 4224 | play | filled rounded triangle | 20 / 34 | 1 |
| 9 | Spotify mark | 4299 | brand circle, white fill, **teal glow box-shadow (line 2825)** | brand | 44 | 1 |
| 10 | Eq tool buttons | 4423, 4427 | Customise pills, Reset | stroked | 14 | 2 |
| 11 | Plugins sidebar toggle | 5515 | collapse | outline | 24 | 1 |
| 12 | Plugins sidebar rows | 5518 to 5564 | Status (6), Tools (10), Favourites group (5), Library source (3), Categories (11) | stroked, 24 grid | 24 / 28 collapsed | 35 |
| 13 | Expand/collapse all | 5596, 5600 | pill-btn | stroked | 11 | 2 |
| 14 | Library search | 5605 | magnifier | 1.8 stroke | 16 | 1 |
| 15 | Stage icons | 6166 to 6184 (`STAGES`) | Metering ... Creative FX | 1.6 stroke, hand-drawn, inconsistent | 22 | 19 |
| 16 | Fact actions | 7152 to 7163 | pin, edit, toggle on/off, delete | stroke 2 | 13 / 18 | 5 |
| 17 | Collapse chevron | 7809, 9968 | section/group chevron | 2.4 stroke | 14 | 2 (templates, many instances) |
| 18 | Pill actions | 11270 to 11274 | apply (check), star, edit, copy, trash | stroke 3 / 1.4 / 2 mixed | 14 | 5 |
| 19 | Hope rail call icons | 3830, 12186, 12188 | mic, mic float, spinner | stroke 1.6 to 2 | 20 to 44 | 3 (**Markey**) |
| 20 | Drag grip | 14765 | reorder | dots | 16 | 1 |
| 21 | New tile | 22275 | add | stroked | 14 | 1 |
| 22 | Genre pickers | 22826 to 22831 | Hip-Hop, R&B, Pop, Afrobeats, Trap, Lo-Fi | 48 grid, 2.4 stroke, hand-drawn | 48 | 6 |
| 23 | Platform logos | 22838 | Spotify, Apple, etc. | brand marks | n/a | brand, **keep as is** |
| 24 | Stem player symbols | 27298 | stem type | stroked | 20 | 1 |

Glyph and text-character icons (counts are occurrences in the file, including comments; the UI ones are the ones to convert):

| Glyph | Where used in UI | Replace with |
|---|---|---|
| `×` (64), `✕` (7) | `.close-btn` on pickerClose, copyModalClose, editPillClose, libSearchClear, override clears (`refManualClear`), tile delete | `close` icon, 16 px |
| `✓` (37) | `✓ in range`, `Added ✓`, selected-menu tick `"✓  "`, Apply pill | `check` icon; pass/fail status text keeps words, drops the glyph |
| `★` `☆` (24) | favourites in Plugins (`fav?'★':'☆'`), fact pin star, pill unfavourite | `star` icon; on = filled plain purple, off = outline. No glow, no box. |
| `✏` (17), `✎` (1) | edit buttons, tag rename | `edit` |
| `＋` (11), `➕` (7 mostly docs) | Add note, Add fact, Add to category, "+ N more plug-ins", saved-targets plus | `plus` (fold glyph rules in 2.4) |
| `▶` (6) | Hope rail quick prompts | **Markey**; recommend `chevron-right` 16 or none. Flag only. |
| `▾` `⌄` `⌃` `›` (9) | menus, publisher group toggle | `chevron-down/up/right` |
| `↺` (4), `↶`(5), `↗` (9) | Revert last fill, Reset stages/stars, Undo, Top up / Account / source links | `refresh` / `undo` / `external` |
| `↑` `↓` (7) | Export/Import buttons, tag reorder, `HOT VS TARGET` tags | `upload` / `download`; tag-reorder keeps `chevron-up/down`; target tags drop the arrow and use words plus `alert` or `check` |
| `▲` `▸` `●` `■` `⚙` (9) | warn tags, Play from, live dot, stop, settings hint | status icons or plain words; `●` live dot is a 8 px circle in CSS (colour only) |
| `→` (228, mostly comments) | copy such as `Developers → API Key` | Reword to "then" or ">" in visible copy; leave comments. `→ ← ≥ ≤ ≈ ⌘` are not in the Inter subset and would fall back, another reason to avoid them in UI text. |
| `—` `–` `•` `…` `·` | typography | Stay as text; all are in the Inter subset. |

Emoji: only one hit (line 19400), inside Hope's `RT_INSTRUCTIONS`, out of scope by rule.

### 2.2 The set

Shown at 16, 20, 24 on `preview.html` (viewed at 1900 and 560): **89 symbols**, 8 groups (tabs, transport, actions, chevrons and fold, status, plugins sidebar, stages and categories, Mix Check and genre).

Base: **Lucide**, ISC licence (permissive, allows modification and embedding, requires keeping the copyright and licence notice). Chosen over hand-drawing because it is one author-consistent family at the exact grid we want (24 viewBox, round caps and joins, `currentColor`), it already underlies several icons Kevin has (Activity, Users, Trash, Bookmark are Feather ancestors), and it covers every role above. Inlined as one `<svg style="display:none">` sprite of `<symbol id="i-NAME">`, referenced with `<use href="#i-NAME">`. No CDN, no npm at runtime, no JS. The sprite is 17.9 KB raw (about 5 KB gzip). Source: `lucide-static` 1.77.0, copied once at design time; keep `LICENSE-lucide-ISC.txt` in the repo and a one-line `<!-- Icons: Lucide, ISC licence -->` above the sprite. Hand-drawn only if a symbol is missing; none was.

Chosen mapping highlights (full table is the sheet in the preview, ids are `i-<name>`): tabs `audio-waveform` (Mix Check), `library`, `sliders-vertical`, `plug`, `settings`, `megaphone`, `users`; transport `play pause square skip-back rotate-ccw rotate-cw volume-2`; actions `pencil copy trash-2 share-2 external-link undo-2 refresh-cw save grip-vertical ellipsis-vertical search x check star bookmark tag eye eye-off`; status `info triangle-alert circle-alert circle-check circle-dashed circle-off clock loader-circle`; plugins `layout-grid download app-window package list-checks key-round lock-keyhole badge-check columns-2 tags piano`; stages share symbols with plugin categories (EQ `sliders-horizontal`, dynamics `activity`, reverb `waves`, delay `repeat`, distortion `flame`, utility `gauge`, imaging `expand`, restoration `wrench`, vocal `mic-vocal`, bass `drum`, fx `wand-sparkles`, and so on). Genre icons reuse the same set (`mic-vocal`, `heart`, `sparkles`, `drum`, `coffee`) so the 48-grid hand drawings go away; Trap keeps `flame`.

### 2.3 Rules (the design contract)

1. One grid: `viewBox="0 0 24 24"`, rendered only at **16, 20, 24 px**. 16 for inline and row actions, 20 for sidebar rows, tabs, buttons, 24 for transport and the largest section markers. No other sizes (retire 11, 13, 14, 18, 22, 28, 34, 44, 48; collapsed sidebar 28 becomes 24; the Mix Check big play at 34 becomes 24 plus a layout margin, it is a control not an icon size).
2. One stroke, optical width about 1.5 px: stroke-width 2 at 16, 1.75 at 20, 1.6 at 24 (tokens `--ic-sw`). Round caps and joins. Never set `stroke-width` per icon.
3. `fill:none; stroke:currentColor`. Colour comes only from CSS `color`. Delete every `stroke="#fff"` / `fill="#fff"` attribute and the `.tab-ico svg{color:#fff}` rule.
4. Solid fill is allowed for exactly four things: play, pause, stop, and star-on (purple). Everything else is outline.
5. No emoji, no arrows as decoration (arrows only where they are a function: external link, import/export, undo, chevrons), no boxes, pills, tiles or borders behind an icon, no glow or drop shadow. This closes the Spotify mark finding: the `box-shadow:0 0 18px` teal glow at line 2825 breaks the rule; remove it when the mark is next touched (brand logo itself stays).
6. Interactive icon controls have a hit area of at least 32 px made with invisible padding (`padding:6px; margin:-6px`), never a visible box.
7. Colours: resting `#9aa0a6`, hover `#e8ebed`, selected teal `#2dd4bf`, favourite star `#b970ff` (existing rule), error `#f87171` only on a failed action. Palette colours (Status blue, Tools yellow, and so on) apply to headings and rows as today, not to icon fills.
8. `aria-hidden="true"` on every decorative icon; an icon-only button carries `aria-label`.

### 2.4 Fold glyph

Plus and minus fold glyphs stay as plain strokes with no box, same as today. They are drawn as two lines in a 24 grid (`<line>` horizontal always, `<line class="fold-v">` vertical), so they can animate and still read as the plain glyph. This replaces `＋`/`−` characters in `.sec-fold` (4003, 4034), `.mc-more-measurements summary::after` (2725, 2726), `.mc-saved-targets-plus` (4286) and the Insight fold headers.

---

## PART 3. Animation

Restrained. No bounce, no overshoot, no glow, no highlight fill, teal is the only accent. Only `opacity` and `transform` are animated (GPU, no layout, no paint of large areas). Exceptions: none.

### 3.1 Tokens (in `aimm-icons-motion.css`)

| Token | Value | Use |
|---|---|---|
| `--aimm-dur-instant` | 90 ms | press, focus ring |
| `--aimm-dur-fast` | 140 ms | hover, row reveal, icon swap, content fade |
| `--aimm-dur-base` | 200 ms | fold, chevron rotation, selected settle |
| `--aimm-dur-slow` | 280 ms | tab surface crossfade, fail nudge |
| `--aimm-dur-spin` | 800 ms | one spinner revolution (linear, never scaled) |
| `--aimm-ease-out` | `cubic-bezier(.22,1,.36,1)` | things arriving |
| `--aimm-ease-inout` | `cubic-bezier(.65,0,.35,1)` | things changing shape or rotating |
| `--aimm-ease-in` | `cubic-bezier(.5,0,.75,0)` | things leaving fast (reserved) |
| `--aimm-ico-rest` | .72 | resting icon opacity in a control |
| `--aimm-ico-hover-scale` / `-press-scale` | 1.08 / .92 | hover and press scale |
| `--aimm-motion-scale` | 1 | preview slow-motion only (x4); production never changes it |

These replace the current mix: `transition:all .12s` (11 places), `.15s`, `.18s ease`, `180ms ease`, `200ms ease`, and the two `cubic-bezier(.4,0,.2,1)`. `transition:all` is banned, it animates layout properties.

### 3.2 States

| State | Behaviour | Properties and values |
|---|---|---|
| Rest | Icon quiet. | `opacity .72`, colour `#9aa0a6`. |
| Hover | Icon brightens and lifts slightly. Label colour goes to `#e8ebed` instantly (colour is a swap, not a tween). | `opacity .72 to 1`, `transform scale(1.08)`, 140 ms `ease-out`. The icon moves, never the button or its row. |
| Press | Icon sinks. | `scale(.92)`, 90 ms `ease-out`; release returns at 140 ms. Full buttons use `scale(.98)`, 90 ms. |
| Keyboard focus (`:focus-visible` only) | 2 px teal ring, 8 px radius, `inset:-1px`, drawn on a `::after` so there is no layout shift and a mouse click shows nothing. | ring `opacity 0 to 1`, 90 ms linear. |
| Selected (teal) | Colour changes to `#2dd4bf` at once; the icon settles in. | keyframe `aimm-settle`: `opacity .5 to 1`, `scale(.88) to 1`, 200 ms `ease-out`, runs once on becoming selected. |
| Busy | Icon crossfades to `loader-circle`, which turns. Button keeps its label and width; set `aria-busy="true"`. | swap 140 ms (`opacity`, `scale .8 to 1`); `rotate 0 to 360deg`, 800 ms linear infinite. |
| Success | Busy icon crossfades to teal `check`, holds 1200 ms, returns to idle icon. | swap 140 ms; colour `#2dd4bf`. No pop, no confetti. |
| Fail | Crossfades to `circle-alert` in `#f87171`, one small nudge, holds 1600 ms, returns. Error text still appears in the normal status line. | `translateX(0, -2px, 2px, 0)` over 280 ms `ease-in-out`, once. |
| Fold open/close (plus becomes minus) | The vertical stroke rotates 90 degrees onto the horizontal one and fades out; reverse on close. Content: opacity only, height changes at once (no layout animation, so no jank at 2 MB DOM size). | `.fold-v`: `rotate(0 to 90deg)` and `opacity 1 to 0`, 200 ms `ease-in-out`, `transform-box:fill-box; transform-origin:center`. Content `opacity 0 to 1`, 140 ms `ease-out`, started on the next frame after `display` is set. |
| Chevron | Dropdown and group chevrons rotate. | `chevron-down`: `rotate(0 to 180deg)`; `chevron-right`: `rotate(0 to 90deg)`; 200 ms `ease-in-out`. |
| Tab selection | The new tab's surface fades in and the old one fades out (crossfade, no sliding bar, so it works with the existing tab shapes); the new tab icon settles. | surface `::before` `opacity 0 to 1`, 280 ms `ease-out`; icon `aimm-settle` 200 ms; label colour swaps at once. Tab hover uses the same icon hover as above. |
| Row actions (edit, copy, delete) | Revealed on row hover or `:focus-within`; each icon slides in 4 px with a 20 ms stagger. On `(hover:none)` they are always visible. | `opacity 0 to 1`, `translateX(4px to 0)`, 140 ms `ease-out`, delay `i * 20ms`. |
| Play and pause | Crossfade swap in place, same swap mechanism as busy. | 140 ms. |

### 3.3 Reduced motion

`@media (prefers-reduced-motion:reduce)`: all scale and translate removed (hover and press scale 1, no nudge, no row slide, no settle, no fold rotation, chevrons switch without transition). Opacity changes stay (they carry the state change) at the same durations. The spinner becomes a slow opacity pulse (1 to .4, 1.2 s) so busy is still visible with no movement. Success and fail keep their crossfade only. The existing app has 21 reduced-motion blocks; these join them, they do not replace them. The preview has a "Simulate reduced motion" switch and a "Slow motion x4" switch so Kevin can see the curves.

### 3.4 Reference CSS

See `aimm-icons-motion.css` (about 130 lines): font-face and stack, tokens, `.ic` and the three size classes, `.aimm-ic` control (hover/press/focus/selected), `.aimm-swap` (idle/busy/ok/fail), `.aimm-fold` and chevrons, `.aimm-tab`, `.aimm-row .aimm-actions`, `(hover:none)` and reduced-motion blocks. Class names carry the `aimm-` prefix so they cannot collide with the 2 MB of existing selectors; Codex may keep or alias them to existing classes (for example `.tab.oz-tab`) as long as the property values are identical.

---

## Selectors and markup Codex must change

1. `<head>`: add preload link, `@font-face` and `Inter Fallback`, the `:root` font and motion tokens (line 2904 `--aimm-font-display` becomes an alias; body at line 16 uses `var(--aimm-font)`).
2. Delete per-component font families: all `font-family:'SF Mono'…`, `"SF Mono"…`, `var(--mono)`, `ui-monospace,Menlo…`, the two bare `-apple-system,sans-serif`, the `!important` Apple stack, `JetBrains Mono`, and `--mono` in `#mixcheck.oz-mixcheck` (line 1397; redefine as alias of `--aimm-font` for numerics or remove and use `.num`). Put `font-variant-numeric:tabular-nums` on the numeric selectors in the 1.3 table. Keep mono only for `code,pre,kbd,samp` and `.rt-key-inputs input` / vault key fields.
3. Canvas: the 12 `ctx.font` strings in `refDrawCanvas` (lines 23330 to 23600).
4. Add the sprite once after `<body>`. Replace all 114 inline `<svg>` (table 2.1) with `<svg class="ic ic-20"><use href="#i-NAME"/></svg>`: tab strip (3675 to 3722), `.tab-ico`, `.sec-ico`, `.inv-side-icon` (35), transport buttons (`.ref-t-btn`), `.fact-action-btn`, `.pill-btn`, `.eq-tool-btn`, `.lib-search-wrap`, `.collapse-chev`, `.cs-caret`, `STAGES[].icon`, `ICONS_GENRE`, SVG_APPLY/STAR/EDIT/COPY/TRASH (11270 to 11274), `#invSidebarToggle`, `.kb-grip`, `.mc-workspace-mode-icon`, `.mc-dz-ico`, `.mc-stem-big-play`. Update the CSS that sizes them (`.tab-ico svg` 20/22, `.sec-ico svg` 22, `.inv-side-icon svg` 24/28, `.fact-action-btn svg` 13/18, `.collapse-chev svg` 14, `.pill-btn svg` 11, `.eq-tool-btn svg` 14, `.tp-vol-ico` 14) to the three size classes and remove their stroke settings.
5. Replace text glyph icons with icon markup: `.close-btn`, `#libSearchClear`, `.ov-clear` (`✕`), `.inv-fav` (`★/☆`), `.inv-tag-icon` (`✎`, `↑`, `↓`), `.fact-star`, `kbAdd`, `kbExport/kbImport`, `invViewPanel` `⌄`, publisher `›/⌃` toggles (9822, 9843), `+ N more plug-ins` (9821), `↺` buttons (3786, 5591, 5593, 15156), `↗` links (5764, 5765, 8663, 8665, 9072), the `✓` button text (9151, 9239), `mcq-showall ▾` (26003), `▲` / `↑` target tags (24918 to 24931), `■ Stop & lock readings` (26640), `▸ Play from` (26036), `●` live status text.
6. Fold glyphs: `.sec-fold` (4003, 4034 and siblings), `#mcSpecs .mc-more-measurements summary::after` (2725, 2726), `.mc-saved-targets-plus` (4286): two-line svg per 2.4; toggle `aria-expanded` on the button.
7. Motion: replace `transition:all …`, `transition:… .12s/.15s/.18s` on icon controls with the tokens; add the states from 3.2 to `.tab.oz-tab`, `.ref-t-btn`, `.fact-action-btn`, `.rt-pill-act`, `.inv-side-row`, `.collapse-chev`, `.close-btn`.
8. Plugins sidebar rows: hover and selected states on the icon follow rule 7 of 2.3 (the 24 px collapsed rail becomes 24, not 28).
9. Hope rail items for **Markey, not Codex**: `MIC_SVG_FLOAT`, `SPIN_SVG_FLOAT`, `.rt-call-icon`, the Conversation `.sec-ico`, `▶` quick-prompt chips. Jules hands the same sprite and rules to Markey via Jacob; Codex does not edit these.
10. Add `_headers` and `fonts/` to `standalone/assets`; add the ISC and OFL licence files.

## Risks and decisions for Kevin

1. **Active tab styling conflicts with "teal only".** Line 4848 gives Mix Check a blue-to-gold gradient border and radial washes when active; the real shots show filled teal pills for the active tab (Settings, Plugins) and filled dark pills for the rest. This spec only adds icon motion and a surface crossfade; it does not recolour tabs. Say if you want the per-tab gradients retired for plain teal.
2. **560 wide tabs** truncate to `M…`, `Li…` in the real build (seen in the injected shots). Icons stay visible at 20 px so the strip still works, but it needs its own layout decision; not part of this change.
3. **Other boxed small elements remain** in the live build and are outside this change: `Coming soon` pills, the `?` circle in "What do these settings do?", `Primary / Backup` pills, count chips. They break the no-boxes rule; list for a later pass.
4. **Spotify mark glow** (line 2825) breaks the no-glow rule; remove when touched.
5. **Fallback glyphs.** `→ ← ≥ ≤ ≈ ⌘` are outside the shipped subset; avoid in UI copy or accept system-font fallback.
6. **Canvas first paint.** If the canvas draws before Inter is loaded it uses the fallback until the redraw; wire the `document.fonts.ready` redraw.
7. **Sprite size on DOM weight.** The file is already 2.2 MB; the sprite adds 18 KB but removes about 114 inline SVGs, a net reduction.
8. **Hover scale on dense lists.** 1.08 on 16 px icons moves them 0.6 px; deliberate, subtle. If it reads as noise on the plugin list, set `--aimm-ico-hover-scale:1` for `.inv-side-icon` only.
9. **Licence.** Lucide (ISC) and Inter (OFL 1.1) both allow this use; both licence texts must ship in the repo.
10. **Process.** Per `UI_CHANGE_PROCESS.md`, Kevin approves after seeing the preview and the screenshots before Codex builds; Codex should send the first built branch back to Jules for design review against this file at 1900 and 560.
