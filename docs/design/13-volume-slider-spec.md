# Design spec — board item 13: Mix Check transport playback-volume slider

**Owner:** Jules (spec) → Cat (implement + wire). Docs only — no `index.html` change in this commit.
**Target:** one Cat batch off `main`, next build after `2026-09-02.6`.
**Scope:** a new compact horizontal volume slider in the Mix Check transport control row
(`.ref-transport.tp-row`, inside `#refDzLoaded`). Controls the loaded track's **playback
monitoring level only**. Does not touch `#mcWave` (LOCKED), the meters, the analyser, LUFS/TP/PLR,
or the Fix Queue.

---

## 1. Where the row is today

`#refDzLoaded` (shown only when a WAV is loaded; `display:flex;flex-direction:column;gap:12px`) has
two flex-column children:

1. `.ref-transport.tp-row` — the control row. `display:flex;align-items:center;gap:14px;`
   **`flex-wrap:wrap;row-gap:12px`** (Mix-Check-scoped override at `#eq.oz-mixcheck #mcTransport
   .ref-transport`). Current children, left → right:
   - `#refFileName` `.tp-file` — filename, `max-width:170px`, ellipsis, `flex-shrink:0`
   - `#refFileMeta` — `display:none`
   - `.tp-btns` — 5 transport buttons (skip-start · −10 · play/pause · +10 · stop), each `32×32`,
     `gap:6px`, `flex-shrink:0` (cluster ≈ 184px)
   - `#refTimeElapsed` `.tp-time` — current time, `flex-shrink:0`
   - `#refTimeDuration` `.tp-time` — total time, **`margin-left:auto`** (pushed to the right edge)
   - `#mcInput` — the WAV loader, moved in by `placeMcInput()`, `margin-left:8px;flex-shrink:0`
     (right end). *Note: board item 10-REVISED is changing this element's size/position in the same
     Cat batch — the slider spec below is anchored to `.tp-btns` and the timecodes, which are
     stable, not to the loader.*
2. `.mc-wave-box.wave` — **a separate sibling**, `height:104px` fixed, holding
   `<canvas id="mcWave">` at `position:absolute;inset:0`. The LOCKED waveform. It is **not** in the
   control row.

---

## 2. Placement — decision

**Insert a new `.tp-vol` wrapper into `.ref-transport`, immediately after `.tp-btns` (after the
stop button), before `#refTimeElapsed`.**

- Satisfies Kevin's ask literally — it sits next to play / rewind / forward / stop, in the
  left-hand control cluster.
- It is left of `#refTimeDuration`'s `margin-left:auto`, so the elapsed/total timecodes and the
  loader stay pinned right exactly as now; the slider does not disturb that anchor.
- If Cat finds "elapsed time, then slider" reads better on screen, the slider may instead go
  directly after `#refTimeElapsed` — the hard requirement is only that it stays **left of the
  `margin-left:auto` element** so it groups with the transport buttons, not with the loader.

**Empty / no-WAV state:** nothing to build. `.tp-vol` lives inside `#refDzLoaded`, which is
`display:none` until a WAV is loaded (`.visible` toggles it). No separate hidden/disabled variant,
no placeholder. On clear/unload the slider disappears with the rest of `#refDzLoaded`. If a future
state ever keeps the control row visible with no track, `.tp-vol` should take the same disabled
treatment the transport buttons take (reduced opacity, `pointer-events:none`) — but that is not in
scope now.

**Wrap behaviour:** `.ref-transport` is `flex-wrap:wrap`. `.tp-vol` is a single `flex-shrink:0`
unit with `white-space:nowrap`, so the glyph and track never separate. At the default centre-column
width the control row has ample room (used ≈ 600–750px of ≈ 990px) and stays single-line with the
slider added. If the user narrows the resizable centre column far enough, `.tp-vol` wraps to a
second line as one block — same graceful degradation the compact loader already shows. See §6.

---

## 3. Form — tokens and values

All tokens below are the existing Mix-Check-scoped custom properties
(`#eq.oz-mixcheck { --card:#1b1d20; --card-bd:#2c3034; --inset2:#101214; --ink:#e8ebed;
--muted:#9aa0a6; --accent-a:#2fa1e6; --accent-b:#a557f4; --grad:linear-gradient(90deg,#2fa1e6,#a557f4) }`).
The slider deliberately reuses the app's established track language —
`.mc-sw-track` / `.mcq-prog .track` (`height:6px; border-radius:3px; background:var(--inset2)`;
fill `background:var(--grad); border-radius:3px`).

### 3.1 Wrapper `.tp-vol`
| Property | Value |
|---|---|
| layout | `display:inline-flex; align-items:center; gap:8px` |
| flex | `flex-shrink:0` |
| height | cap at **32px** (matches `.tp-btns` height so the row's line-height is unchanged) |
| `white-space` | `nowrap` |

### 3.2 Speaker glyph (left end)
| Property | Value |
|---|---|
| element | inline `<svg>`, **14×14**, `aria-hidden="true"` |
| style | `stroke:var(--muted); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; fill:none` — same icon language as the transport-button SVGs |
| shape | a small speaker cone + **one** short arc (low-volume speaker). No 3-arc "loud" icon, no emoji, no `content:` pseudo. |
| interactivity | **none** in MVP (decorative). Optional later enhancement: click to mute/unmute (restore previous value) — not required for this build. |
| hover/focus | when the wrapper or the range has `:hover` / `:focus-visible`, glyph `stroke:var(--ink)` |

### 3.3 Track — `<input type="range">` styled
| Part | Value |
|---|---|
| element | `<input type="range" min="0" max="100" step="1">` — a real range input (native keyboard + a11y for free) |
| groove length | **88px** (`width:88px`) — compact; wrapper total ≈ 110px |
| groove height | **6px**, `border-radius:3px` |
| groove unfilled | `background:var(--inset2)` (`#101214`) |
| groove filled portion | `var(--grad)` — the **full** `linear-gradient(90deg,#2fa1e6,#a557f4)` laid across the whole 88px track, revealed left→right to the thumb position (identical approach to `#mcWave`'s played wash and `.mcq-prog .track i`). At the 100% default the whole groove shows the complete blue→purple gradient. |
| fill mapping | **linear** in the slider fraction (`fillWidth = (value/100) * 88px`). The fader *scale* is linear even though the *gain* it produces is tapered (§4) — this is standard fader behaviour. |
| thumb | **12px** circle, `background:#f2f4f5` (same near-white as `.mc-sw-mark`), `border:0`, `box-shadow:0 1px 2px rgba(0,0,0,.5)` for contrast over the bright gradient |
| thumb hover | add ring `box-shadow:0 1px 2px rgba(0,0,0,.5), 0 0 0 3px rgba(47,161,230,.22)` |
| thumb `:focus-visible` (on the input) | `outline:2px solid var(--accent-a); outline-offset:2px` — the app has no strong existing range-focus convention; this is an explicit, clearly visible ring and is on-palette. **Focus must be obviously visible** (a11y requirement). |
| cursor | `pointer` on the track, `grab` / `grabbing` on the thumb if cheap |
| value readout | **none.** No `%` and no `dB` text — keep the row minimal (matches the brief). Expose the value to assistive tech only: `aria-label="Playback volume"`, `title="Playback volume"`, and keep `aria-valuetext` as `"<n>%"`. |

Cross-browser: style `::-webkit-slider-runnable-track` / `::-webkit-slider-thumb` and
`::-moz-range-track` / `::-moz-range-progress` / `::-moz-range-thumb`. `-moz-range-progress` gives
the filled portion for free on Firefox; on WebKit/Blink paint the fill with a
`linear-gradient(...) 0/ <fillWidth>` background on the track updated from the input event, or an
overlaid `<span>` — Cat's call, visual result must match the table above.

---

## 4. Behaviour

| Aspect | Decision |
|---|---|
| Range | **0–100 (%)**, representing silence → unity gain (1.0). |
| Default | **100** (unity) when nothing is stored. |
| Keyboard | native range: `←/↓` −1, `→/↑` +1, `PageDown/PageUp` ±10, `Home` 0, `End` 100. |
| Taper (value → linear gain) | **Logarithmic / dB taper** (recommended over linear — a linear map sounds like nothing changes from 100→50 then collapses near the bottom). With `x = value/100`: `gain = (x <= 0) ? 0 : 10^(-2 * (1 - x))`. That is 0 dB at 100%, ≈ −10 dB at 75%, −20 dB at 50%, −30 dB at 25%, hard **0 (silence)** at 0%. ≈ 40 dB usable range. |
| Applying gain | ramp, don't jump — `gainNode.gain.setTargetAtTime(target, ctx.currentTime, 0.02)` (avoids zipper noise on drag). |
| Persistence | **Persist across the session** in `localStorage`. Suggested constant `MC_PLAYBACK_VOL_KEY = 'aimm_mc_playback_vol_v1'`, integer 0–100. Restore on app load; apply to the gain node as soon as a track is loaded so the first playback already respects it. Rationale: a user who pulls playback down to protect their ears should not have it snap back to 100% on every new file — consistent with how the app already persists compose height / chat history. |
| Independence | volume is orthogonal to transport state — `refTogglePlay()`, `refSeek()`, `refStopAudio()` are unaffected; changing volume mid-playback just re-ramps the gain. |

---

## 5. Wiring note for Cat

- The slider drives **playback monitoring gain only**. There is a WebAudio graph feeding `#mcWave`
  playback — locate the playback path's `GainNode` (or, if playback is via an `<audio>` element,
  its `.volume`, though a `GainNode` is preferred so the dB taper + ramp apply cleanly). Set
  `gain.gain` from §4's computed linear value.
- This gain node must sit on the **monitor/output path, downstream of every analysis tap.** The
  Spectral Balance `AnalyserNode`, the loudness/true-peak/PLR measurement, the per-band energy, and
  the `#mcWave` peak rendering all read the **decoded file buffer / a pre-gain tap** — moving this
  slider must not move any meter, any analyser curve, or the waveform. Confirm the analysis nodes
  are tapped **before** this gain node; if any currently sit after it, re-tap them before it.
- On load of a new track, read `MC_PLAYBACK_VOL_KEY` and apply it to the gain node immediately.
- `#mcWave` rendering, seeking and the playhead are unaffected — they are geometry off the decoded
  buffer, not level.

---

## 6. Reflow check — does this disturb the transport layout or `#mcWave`?

**`#mcWave` canvas: not affected.** The canvas lives in `.mc-wave-box` (`height:104px` fixed), a
**separate flex-column sibling** of `.ref-transport`, with the canvas at
`position:absolute;inset:0`. Adding a child to `.ref-transport` cannot change the canvas's width or
height and cannot trigger `MC_WAVE.draw()` (which keys off the canvas pixel size / container width,
neither of which changes). The LOCKED rendering is safe. No horizontal reflow into or across the
canvas is possible by construction.

**Transport row at default width: no change.** `.ref-transport` currently uses ≈ 600–750px of the
≈ 990px transport-card content width. Adding `.tp-vol` (≈ 110px + one 14px gap) keeps it
single-line — no new wrap, `.mc-wave-box` stays at its current Y.

**Transport row at narrow width: one extra wrapped line, vertical only.** `.ref-transport` is
`flex-wrap:wrap`. If the user shrinks the resizable centre column far enough, `.tp-vol` wraps to a
second line as one `flex-shrink:0` unit, adding ≈ 32px + 12px `row-gap` of height to
`#refDzLoaded`, which pushes `.mc-wave-box` **down** by that amount. The canvas is not resized and
not redrawn — only repositioned. This is the same graceful-degradation the compact loader already
exhibits and is acceptable.

**Flag:** minor, expected, no action needed — at normal widths there is zero layout disturbance; at
very narrow widths one additional wrapped row shifts the (unchanged, un-redrawn) waveform box
downward. Nothing here risks the LOCKED `#mcWave` rendering.

---

## 7. Considered and rejected

- **Flat single-colour fill (`#2fa1e6` only), no gradient** — rejected. Every "filled track" in
  this tab (`.mc-sw-fill`, `.mcq-prog .track i`, `#mcWave` played span) uses `var(--grad)`; a flat
  fill would read as a different, older control language and would clash with the gradient waveform
  directly below it.
- **Showing a `%` or `dB` value next to the slider** — rejected for MVP. The row is already dense
  and the brief calls for minimal. Value is exposed to assistive tech via `aria-valuetext`.
- **Placing the slider on the right, after the timecodes / next to the loader** — rejected. Kevin's
  ask is explicit that it belongs next to the transport buttons; grouping it with the loader on the
  right would read as an input-source control, not a monitor control.
- **Vertical slider / pop-over on a speaker button** — rejected. The brief specifies a horizontal
  slider inline in the row; a pop-over adds a click to a control that should be a direct, always-
  visible trim.
- **Reset to 100% on every track load (no persistence)** — rejected. See §4 rationale.
- **Linear taper** — rejected. See §4; a dB taper matches how a physical fader behaves.
