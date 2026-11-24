# Centre controls, exact values (Jules, 24 Nov 2026)

Measured in real Chrome on the live YouTube embed (dQw4w9WgXcQ) at 560, 1000 and 1500 wide, desktop and touch. Build target: `#libPlayerFrame .lpl` in `standalone/assets/index.html`. Codex builds. Reference build is `local-player.css` / `local-player.js` in this folder (verified at 1500 and 560 with a real mouse).

## Main finding
YouTube does NOT scale the centre controls with width. Same size at 560, 1000 and 1500. Our old big button was a 68x48 (up to 92x65) rounded box with a red hover. That is the old YouTube look. Replace it.

## Measured on YouTube
| Part | Value |
|---|---|
| Play/pause circle | 56 x 56, border-radius 50%, background rgba(0,0,0,.3), padding 10 |
| Play/pause icon | 36 x 36 (24 viewBox), white, no stroke, no red hover |
| Margin each side of circle | 34px |
| Skip 10 buttons | 48 x 48 hit area, 36 x 36 circle rgba(0,0,0,.3), icon 24 x 24 (padding 6) |
| Centre to centre | 86px each side of the middle |
| Icon shadow | drop-shadow(0 0 1px rgba(0,0,0,.8)) |
| Fade | dark top-to-bottom scrim fades in 0.2s; buttons switch on/off with it (no slide) |
| Controls hide | about 4.7s after the last input while playing; always shown while paused |
| Seek flash (double-tap) | arrow + "10 seconds" 24px bold, 48px from the frame edge, scrim-free |
| Embed title / channel | 20px bold at 1000+, 18px at 560 |

Note: in the live embed the +/-10 buttons are hidden helper buttons (12px, no icon). YouTube's own sibling (prev/next) uses exactly the 48/36/24 box above, so the skip-10 buttons use that. If Kevin's screenshot shows a different size for the skip buttons, send it and this one row changes.

## Bottom and top bars in the live embed (for the later bar pass)
- No bottom play button, no bottom volume. Top right: mute 48 hit / 24 icon, CC 48/24, settings 48/24, no backgrounds.
- Bottom left: time pill, 24 high, 14px/500, rgba(0,0,0,.3), radius 16, left 28px.
- Bottom right: full screen 48 hit, 36 circle rgba(0,0,0,.3), 24 icon.
- Progress bar 44 high hit area at 30px side margin, red dot 12px (#ff0033), dot grows over 0.1s.
- Our player still has the classic bottom bar (play, volume, time). Not changed here. Decision for Kevin: keep classic bar, or switch to the new layout.

## Corrected CSS (centre only)
```css
.lpl .lpl-mid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;z-index:3;pointer-events:none;opacity:0;visibility:hidden;transition:visibility 0s}
.lpl:not(.lpl-idle):not(.lpl-scrub):not(.lpl-is-fail):not(.lpl-menu-open):not(.lpl-is-loading) .lpl-mid{opacity:1;visibility:visible}
.lpl .lpl-big,.lpl .lpl-sk{flex:none;border:0;color:#fff;cursor:pointer;outline:none;pointer-events:auto;display:flex;align-items:center;justify-content:center}
.lpl .lpl-big{width:56px;height:56px;margin:0 34px;padding:10px;border-radius:50%;background:rgba(0,0,0,.3);font-size:36px}
.lpl .lpl-sk{width:48px;height:48px;padding:6px;background:none;font-size:24px}
.lpl .lpl-sk span{display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:36px;height:36px;padding:6px;border-radius:50%;background:rgba(0,0,0,.3);filter:drop-shadow(0 0 1px rgba(0,0,0,.8))}
.lpl .lpl-big svg.lpl-i{fill:currentColor;stroke:none;filter:drop-shadow(0 0 1px rgba(0,0,0,.8))}
.lpl .lpl-sk svg.lpl-i{fill:none;stroke-width:1.8}
```
Remove `--bw`/`--bh` from the three size tiers. Hide timer `HIDE_MS=4700`. Markup: `.lpl-mid` holds `.lpl-sk-b` (seekBy -10), `.lpl-big` (play/pause/replay icons), `.lpl-sk-f` (seekBy +10). Full markup, icons and handlers: `local-player.js`.
