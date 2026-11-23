# AIMM state and motion fix: corrected model (Jules, 23 Nov 2026)

Replaces the state and motion parts of `docs/handover-assets/jules-font-icons/SPEC.md` (section 3 and the "apply to existing controls" list). Fonts, icon set and sizes from that spec stand. Build audited: real page build 2026-11-23.19 (`standalone/assets/index.html`, served at 127.0.0.1:8768), headless Chrome, 1900 wide.
Files here: `aimm-state.css` (the one block to add, with the A/B hover switch), `preview.html` (live), `audit/hover-rules-by-line.tsv` (every state rule in the build, with line and action), `audit/tab-hover-proof.json` and `audit/tab-hover-proof-after.json` (sampled values), `shots/`.

## 1. What is wrong, proven on the real build

Kevin's case, "hover over the tabs, icons are distorted": **reproduced and proven for all 7 tabs.** Sampled on hover, every tab: icon svg 24 x 24 at rest becomes **27.99 x 27.99** and shifts left 2px (e.g. Library x 302.25 to 300.25). Cause is a double scale: legacy `.tab:hover .tab-ico{transform:scale(1.08)}` (line 114) times Codex's `:is(.oz-tab,...):hover .ic{transform:scale(1.08)}` (line 28263) = 1.1664. Fractional size means blurred, thin strokes. Frames: `shots/tabs-before-after.png` (columns 1-2 before, 3-4 after).

The coordinator's other claims, checked: the tab lift and blue/gold glow at line 4853 **exist in the CSS but never show**, because a later `!important` rule (lines 3152-3162, "Hover = SOLID TEAL FILL") overrides them. What actually happens on hover, all 6 unselected tabs: **background becomes solid teal #2dd4bf with black ink, the same as the selected tab**, so hover looks selected (before frames, column 2). The line 80/104 `drop-shadow` glows are on `.tab.active .tab-ico` but line 1382 sets `filter:none`, so computed filter was `none` on every tab (no visible glow today). `tab-pop` (line 120-122) does not run on the 7 tabs (computed animation `none`). Icon size rules disagree (22px line 1383, 18px 2152, 20px 2933, 24px `!important` 3208); the live size is 24px because of 3208, stroke 1.5.

Other places a highlight shows on hover (computed fill/ring/glow change, from `audit/hover-audit.json` and `hover-rules-by-line.tsv`):
- Inactive tabs, Hope-rail quick prompts, send/clear/route buttons, copy/speak: solid teal fill flood.
- Library: playlist `.row` fills #202327 (line 3542); `.video-pill` Copy link grey to teal (3502); "Read more" underline (3513).
- Plugins: `.inv-side-button` fills section colour, blue in the Updates frame (5236); `.inv-list-row`, `.inv-format`, `summary.inv-btn` gradient fill (4585 and others).
- Settings: `.settings-nav a` and account/key buttons fill purple/blue-grey (2505).
- MixBus: `h4` bus header fills (430), `.chain-add` (466), `.chain-item` (454).
- Mix Check: Saved Targets toggle tint (2806), Spotify block glow 22px + radial wash (2827, 4791), Spotify mark glow (2835), Capture lifts 2px and goes gradient (2855), Audio Specs and drop zone radial wash and shadow (4791), Hope rail whole-panel radial wash (4796, Markey's), stop/clear 4px ring (4896, 4905).
- Knowledge/Snapshots: kb-card, fact-chip, rt-pill, preset-card, symptom fills and border colours (320, 1053, 963, 200, 5297).
- Total: 240 `:hover` rules in the build, **225 set only fill, ring, glow, border, filter or transform** (action DELETE in the tsv), 11 mix colour with those (REWRITE).

Motion defects found (sampled):
1. Hover on tab: scale 1.1664 (above), plus tab background and border colours transition at 180ms while the page content swaps instantly with no transition. Tab chrome animates, content does not: inconsistent.
2. First load: transitions run during load (`opacity` on `.ic-20`, `filter` on `#mcSpotifyClear`, wave-bar background/box-shadow/height). Motion on first load.
3. Selected icon "settle" (scale .88 to 1) and fold content opacity fade re-fire on every state change.
4. Plugins sidebar section animates `grid-template-rows` 280ms with a different curve (`cubic-bezier(.4,0,.2,1)`), unlike every other fold.
5. Eleven `transition:all` rules (lines 39, 138, 155, 172, 292, 317, 319, 329, 513, 582, 645, 749, 751 start with background/all) animate layout properties.
6. Eight different durations and four easings across the file.

## 2. Spec errors versus build errors

| # | Problem | Whose |
|---|---|---|
| 1 | The spec was additive. It never said to delete the legacy hover rules, so Codex added the new ones beside them. | **Spec** |
| 2 | Icon hover as scale 1.08 plus opacity .72 to 1 on every icon. A fractional scale blurs 1.5px strokes. | **Spec** |
| 3 | Tab selected "surface" `#1b1d20` crossfade 280ms: a tinted fill animating in. | **Spec** |
| 4 | Row action slide and stagger, `aimm-settle` pop, fail nudge, swap `scale(.8)`, fold content fade. Decoration. | **Spec** |
| 5 | Double scale (legacy line 114 and Codex line 28263), giving 27.99px and a 2px shift. | **Build** (old rule not removed) |
| 6 | New rules left on top of older `!important` rules; nothing deleted; 13 `transition:all`; four competing icon sizes. | **Build** |
| 7 | Hope-rail and tab hover fills transition in 180ms and lift/glow rules still exist (hidden only by an `!important` override). | **Build** (legacy not deleted) |

**Revision (Kevin, 23 Nov: "I didn't ask for the teal to be removed").** The teal hover with black ink is kept exactly as approved, on tabs, buttons and pills, including the Library pills. It was never the cause. The distortion and the unapproved highlights are. My earlier neutral-hover proposal is now switch B (below), not the default.

## 3. State model v2

**The hover switch (one token).** `aimm-state.css` defines `--aimm-hover-bg`, `--aimm-hover-ink`, `--aimm-hover-bd`.
- **A (default, approved):** hover = solid teal `#2dd4bf`, black ink `#0b0d10`, border transparent.
- **B (neutral):** set `<html data-aimm-hover="neutral">` (or change the three token lines): same resting surface, ink brightens to `#e8ebed`, nothing else.
Either way: the only motion is the surface and ink tween, 120ms. Preview has the A/B radio.

| State | Change | Never |
|---|---|---|
| Rest | existing surface and `#9ca3af` ink | |
| Hover, controls with a surface at rest (tabs, buttons, pills, sidebar nav buttons, settings links, segmented modes, Hope-rail chips) | switch A or B; `background-color`, `border-color`, `color` tween 120ms `cubic-bezier(.22,1,.36,1)` | scale, lift, glow, ring, shadow, filter, gradient, underline, any change to icon size |
| Hover, icon-only controls (no surface at rest) | colour only, `#9ca3af` to `#e8ebed` | a box or fill behind a small icon |
| Hover, content rows and blocks (playlist and plugin rows, cards, chips, headers, Audio Specs, drop zone, Spotify block) | **none** (row actions fade in by opacity 120ms) | fill, border change, glow, wash |
| Press | opacity .8 for 80ms | scale |
| Keyboard focus (`:focus-visible` only) | solid 2px teal outline, offset 2px, instant | mouse-click ring |
| Selected | solid teal, black ink, border transparent, applied at once; hover leaves it unchanged | glow, tint, animation, gradient |

Note for Kevin: because hover and selected are both solid teal, a hovered tab and the selected tab look alike (as in the build today). The selected one is the one that does not change when you move off it. Say if you want a visible difference; switch B is the neutral answer.

Tab icons: exactly 24 x 24, stroke 1.5, one declaration, never transformed, so no fractional size and no shift (sampled: all 7 tabs 24 x 24, dx 0, dy 0, transform none, shadow none, in `audit/tab-hover-proof-after.json`).

Allowed transitions, complete list:
| Property | Duration | Easing | Where |
|---|---|---|---|
| `background-color`, `border-color`, `color` | 120ms | `cubic-bezier(.22,1,.36,1)` | hover on surfaced controls (one declaration, three properties) |
| `color` | 120ms | same | icon-only hover |
| `opacity` | 120ms | same | row actions, status icon crossfade |
| `opacity` | 80ms | linear | press |
| `transform` (rotate only) and fold bar `opacity` | 180ms | `cubic-bezier(.65,0,.35,1)` | fold glyph and chevron |
| spin keyframe | 800ms | linear, infinite | busy |
Everything else `transition:none`. No `transition:all`, no `scale`, `translate`, `filter`, `box-shadow` in a transition. First paint: `html:not(.aimm-ready) *{transition:none!important;animation:none!important}`; JS adds `.aimm-ready` after two animation frames. Tab and panel: selected tab changes instantly and the panel swaps instantly (both instant, so no 180ms chrome against an instant panel); the previous tab releases with the same 120ms tween as any hover-out.

## 4. Selector-level change list for Codex (edit in place, delete the offenders)

Lines are `standalone/assets/index.html` build .19. Full rule inventory with line and action: `audit/hover-rules-by-line.tsv`.

**A. Distortion (Kevin's case), delete**
- 114 `.tab:hover .tab-ico{transform:scale(1.08)}`; 112 the `transition:transform` on `.tab-ico`.
- 28262-28266 (Codex): the `:is(.oz-tab,.inv-side-row,.ref-t-btn,.fact-action-btn,.eq-tool-btn):hover .ic` scale and opacity, the `:active .ic` scale, the `aimm-settle` animation, the `.ic` rest opacity .72. Also in the same block 28148-28210 and 28228-28245: `.aimm-ic`/`.aimm-tab` hover and press scale, `.aimm-tab::before` surface crossfade, `@keyframes aimm-settle`, row `translateX(4px)` and stagger, `.aimm-fold-body` fade, `aimm-nudge`, `.aimm-swap` `scale(.8)`.
- 120-122 `.tab-ico.pop` and `@keyframes tab-pop` (not running on the tabs but dead and dangerous); 80 and 104 `.tab.active .tab-ico{filter:drop-shadow}`; 70, 77, 93 `translateY(1px)` on `.tab.active`.
- Size rules 1383 (22px), 2152 (18px), 2933 (20px): delete. Keep one 24px rule (line 3208) without `!important`, stroke 1.5.
- 4853-4860: the tab `translateY(-2px)` lift and blue/gold glow hover (and its reduced-motion twin). They are masked by 3152-3162 today but must go.

**B. Keep, but as one rule (approved teal hover)**
Replace the scattered teal-hover rules with the single `.aimm-btn`/tab rule in `aimm-state.css` (surface and ink via the switch). The rules this replaces and keeps as approved teal: 3152-3162 (tabs, workspace modes, stem modes, Hope-rail chips and buttons: Hope-rail selectors are Markey's), 2969-2975 selected-state `!important` rules (drop `!important`), `.lp .video-pill:hover` 3502/3557 and `.video-pill.teal:hover` 3503/3558 (Library pills, keep teal, drop the lighter-teal variant), `#library .btn:hover` and `.pill:hover`, `#mixcheck .mcq-acts/.mcq-nav button` 4966/5034, `.settings-nav a` 2505 and the Settings account/key buttons (currently purple/blue-grey fill: **change to teal**, they are buttons), `#plugins .inv-side-button:hover` 5236 (currently section-colour blue fill: **change to teal**), `.btn`, `.btn.secondary`, `.btn.green/red/amber/purple` 39-45, `.eq-tool-btn` 155, `.collapse-bar .pill-btn` 292, `.lib-pub-pill` 645, `.ref-dz-btn`, `.ref-t-btn` 1235 (surfaced), `.aichat-quick-prompt`, copy/speak chips. Their hover is `background-color` + `border-color` + `color` from the tokens; delete each rule's own gradient, shadow, filter, translate, lighter/darker variants.

**C. Remove: highlights that are not the approved teal (rule, and what to do)**
| Rule (line) | Today | Action |
|---|---|---|
| `#mixcheck .mc-saved-targets-toggle:hover` 2806, `.mc-spotify-artist-fallback > summary:hover` | faint cyan tint wash | delete (it is a row/header: no hover) |
| `#mcSpecs:hover/:focus-within`, `#mcTransport ... #refDropZone:hover` 4791 | radial wash + glow shadow | delete |
| `.mc-spotify-reference:hover/:focus-within` 2827, 4791 | 22px glow + radial wash | delete |
| `#mcSpotifyReference .mc-spotify-mark:hover` 2835 | 22px glow | delete |
| `#mcSpotifyCapture:hover` 2855 | lifts 2px + gradient | delete lift and gradient; becomes teal via B |
| `#mcSpotifyConnect/#mcSpotifyRefMatch:hover` 2857, 4869-4887 | blue 18% tint, gradient border | teal via B |
| `#mcSpotifyRefStop:hover`, `#mcSpotifyClear:hover` 4896, 4905 | 4px purple ring + brightness filter | delete ring and filter; icon-only: colour only |
| `.tp-vol-range:hover::-webkit-slider-thumb` 1940 | 3px blue ring | delete ring |
| `#mcSpecs #mcTempoTile.is-awaiting-tap:hover` 2781 | teal fill | keep (genuine action prompt, approved teal) |
| `#hopeRail:hover/:focus-within` 4796 | whole-rail radial wash (Markey) | delete |
| `.lp .row:hover` 3542, `#library .bar:hover` 3275 | grey fill on playlist/bar row | delete (content row) |
| `.lp .desc .more:hover` 3513/3561, `#library :is(.tx,.more)` 3412 | underline, tint | colour only |
| `#mixbus .bus-col h4:hover` 430, `.chain-item:hover` 454, `.chain-add:hover` 466, `.empty-add:hover` | grey fills | delete (rows/headers); `.chain-add`, `.empty-add` are dashed add-buttons: teal via B |
| `#plugins .inv-list-row:hover` 4585, `.inv-vst-option`, `.inv-tag-filter-option`, `.inv-menu-row`, `.inv-view-option` | grey/gradient fills | delete (list rows) |
| `#plugins .inv-format:hover`, `summary.inv-btn:hover` | gradient fill | teal via B (they are pills) |
| `.fact-chip:hover` 320, `.kb-card:hover` 5297, `.rt-pill:hover` 1053, `.preset-card:hover` 963, `.symptom:hover` 200/587/588, `.journal-entry-head:hover`, `.fact-cat-head:hover`, `.genre-pick-opt:hover` | fills + border colours | delete (content rows/cards) |
| `.fact-action-btn:hover`, `.rt-pill-act:hover`, `.preset-card-*:hover`, `.close-btn`, `.inv-fav`, `.inv-product-actions` | box fills behind small icons | delete; colour only |
| `.mic-btn:hover` 877 | orange glow + scale 1.03 | delete (Hope voice button is Markey's) |
| `.tab:hover` 62 and `.tab:not(.active):hover` 92, `[data-persona-label]` hovers 103-109 | legacy fills/purple/rose | delete (superseded by the one rule) |
| Selected variants 1385, 2266, 2936, 1387 (blue gradient, `--send-blue`, `box-shadow` 16px) | glow and gradient on selected tab | delete; one selected rule (teal, black ink) |
| `:focus-visible` rings of other colours (`#mcSpotifyRefStop`, `.inv-vst-option`, etc.) | blue/purple rings | one rule: 2px teal outline |

**D. Motion**
Delete all `transition:all` (lines 39 start of `.btn` list, 138, 155, 172, 292, 317, 319, 329, 513, 582, 645, 749, 751 and the 11 that begin `transition:all .12s`). Any `transition:` naming `box-shadow`, `transform` (other than fold rotate), `filter`, `background` on content blocks: remove. 5203-5204 (`grid-template-rows .28s`): delete so every fold is instant-content. 2804, 2588, 284: durations to `--aimm-t-rotate`. 15191: `card.style.transition='opacity .2s'` becomes 120ms. Add `aimm-ready` guard and script (first-paint motion currently runs on `.ic-20` opacity and `#mcSpotifyClear` filter).

**E. Add** `aimm-state.css` once at the end of the main `<style>`. Class `.aimm-btn` on surfaced controls (or attach the same selector list); set each control's `--rest-bg` and `--rest-bd` to its own resting values.

## 5. What to verify after the build (Jules re-checks with this)
On the real page, for each of the 7 tabs on hover: svg exactly 24 x 24 with unchanged x and y, `transform: none`, `box-shadow: none`, `filter: none`; under switch A only background (#2dd4bf), border (transparent) and ink (#0b0d10) change; under B only ink changes (`audit/tab-hover-proof-after.json` has the target). No `:hover` rule outside the one shared rule declares `background`, `box-shadow`, `filter`, `transform`, `outline` (regenerate `audit/hover-rules-by-line.tsv`; DELETE count must be 0). `document.getAnimations()` empty for 1.5s after load apart from Hope's wave and spinners. No `transition:all`. Plugins side button, settings links, Library pills teal on hover; content rows no fill.

## 6. What I viewed and what I could not check
Viewed (images opened): `shots/tabs-before-after.png` (7 tabs x before rest, before hover with 28px icon, after rest, after hover A teal, after hover B neutral; revised and viewed); `shots/preview-1900.png` and `shots/preview-560.png` (revised preview, A selected); `shots/states-after.png` (button, row with actions, sidebar row, settings link, fold: rest/hover/press, revised A); `shots/fold-focus-after.png` (fold rotation frames and teal focus ring); `audit/sheet-A.png`, `audit/sheet-B.png` (before frames from the real build). Sampled values: all 7 tabs before (27.99px, dx -2) and after A and B (24 x 24, dx 0, dy 0, transform none, shadow none); transition string on the tab after hover (`background-color, border-color, color` 0.12s); tab-switch (instant panel swap); first-load animations.
Not checked: the real page at 560 wide (only the preview at 560); Saved Targets, Spotify block and Audio Specs glow frames (taken from computed CSS, the crops did not show them); press frames of real controls; touch; Kevin's screenshots (never arrived); the rebuilt app (not built, so "after" is the preview).
