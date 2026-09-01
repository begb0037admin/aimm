# Corridor re-tune spec — `REF_CORRIDORS` per-genre target curves

**Author:** Jules (AIMM design) · **Date:** 2026-09-01 · **Branch:** `r3-mixcheck-fixes`
**Status:** SPEC — awaiting Kevin's approval. Cat implements the tables into `index.html`; Jules does not edit `index.html`.
**Addresses:** POST-SHIP FIX LIST item **#1** — "Target / reference corridor is inaccurate" (`docs/HANDOVER.md`, HANDOVER POINT 2026-09-01).
**Build impact:** data-values only inside one `const`. No structure change, no new function, no DSP change → Cat bumps `AIMM_BUILD` on the implementing commit as normal; this docs commit bumps nothing.

---

## 1. What this is and is NOT

Cat's pre-R3 diff (branch `r3-mixcheck-fixes`, against pre-redesign tip `68a3ffa`) is confirmed: `REF_CORRIDORS`, `corridorAt`, `refActiveCorridor`, `ozBandDelta`, `refPtsFromDbBins`, `refFileSpectrum`, `fftMag` and the BS.1770-4 `li`/`tp`/`dr` engine are **byte-identical** to pre-R3. The only R3 change in that region is cosmetic (`MAX_DB` 6→18 + `Y_TOP_PAD`, Gate-1 "analyser headroom", commit `86b4910`) and touches only the canvas Y-axis, not any "vs target" number.

So item #1 is **not a regression to restore.** There is nothing pre-R3 to go back to. The corridor tables have been house-made approximations since build `.10` (2026-06-11) and were never validated against reference data. This spec is a **deliberate first-pass tuning** of those tables against published commercial-master spectral data, plus a procedure for Kevin to finish the calibration by ear + reference measurement.

---

## 2. How the corridor is actually consumed (the mechanic Cat must preserve)

`REF_CORRIDORS[genre] = { label, pts:[[freqHz, loDb, hiDb], … 12 anchors] }`, relative dB, log-frequency interpolated by `corridorAt()`. Anchor frequencies are fixed: **20, 40, 90, 160, 300, 600, 1200, 2500, 5000, 10000, 16000, 20000 Hz**. Keep all 12, keep the exact `[f, lo, hi]` triple shape.

Three things read it:

| Reader | Uses | Sensitive to |
|---|---|---|
| `refDrawCanvas()` — the purple corridor zone on the analyser | `lo` and `hi` at 150 sample points; feathered fill between them | corridor **centre** = vertical position; corridor **width** (`hi−lo`) = zone thickness |
| `ozBandDelta(fLo,fHi)` — the 3 LOW/MID/HIGH deviation meters + `breakdownData().tonalBalanceDeltas` (Hope's card) | corridor **centre** `(lo+hi)/2` only, sampled across the band | corridor **centre shape**, nothing else |
| `MC_FIXQUEUE.build()` — the `band-*` Fix Queue items (`over = |delta|−1.5`, `score = over × weight`) | same `ozBandDelta()` | same |

### Two consequences that shape this whole spec

1. **Absolute corridor level is irrelevant to every readout.** `ozBandDelta()` and `refDrawCanvas()` both gain-normalise the mix curve to the corridor centre over **150 Hz–3 kHz** before comparing. Shift a whole corridor up or down by a constant and every deviation number is identical. Only the corridor's **shape relative to its own 150 Hz–3 kHz mean** matters. (I still keep the 150 Hz–3 kHz centre-mean near **−11 dB** for every genre so the drawn zone doesn't jump vertically on the canvas — but that number carries no meaning for the meters.)

2. **Corridor width changes NO readout.** `ozBandDelta()`, the deviation meters and the Fix Queue all compare against the **centre**, never the edges. Width only paints the purple zone thicker/thinner. So width is a *visual tolerance hint* — set it wide where genres genuinely vary (sub, air) and tight through the 150 Hz–3 kHz anchor region so that band reads as "the reference".

### The actual bug

The mix curve fed to the comparison (`refPtsFromDbBins` → from `refFileSpectrum` / the float analyser) is a **raw power LTAS** — no pink / tilt compensation. A real full-range commercial master, measured raw like this, falls at roughly **−3.5 to −4.5 dB/octave** through the upper mids and highs (slightly relieved in the 8–12 kHz "air" region, then a faster roll above ~15 kHz from limiting / LPF / codec-safety).

The current corridors fall at only about **−1.5 to −1.8 dB/octave** from 300 Hz to 10 kHz. That is far too shallow. Against a real master's raw LTAS the current corridor therefore reads **every properly-balanced master as deficient in the highs and hot in the lows** — which is exactly Kevin's screenshot: a finished master (`Paypadream$ (mastered).wav`) reading **"+8.9 dB low, −1.9 dB mid, −13.2 dB high vs the corridor."** The −13.2 dB high is the unambiguous error.

**Primary fix:** steepen every corridor's HF slope to match published raw-LTAS behaviour of commercial masters (~−4 dB/oct upper-mid/high, air relief 8–12 kHz, fast roll above 16 kHz). **Secondary:** genre-shape the low band and low-mid scoop from published per-genre guidance. The low-band absolute elevation is the one parameter published data does not pin down well — it needs Kevin's ear + a reference-track measurement (Section 6).

---

## 3. Sources

- **iZotope Tonal Balance Control** — target curves "drawn from analysis of decades of recorded audio across… genres"; TBC 3 ships "30+ genre and subgenre" targets "built from analyzing hundreds of professional masters"; Broad-view bands **Low 20–250 Hz, Low-Mid 250 Hz–2 kHz, Mid 2–8 kHz, High-Mid 8–20 kHz**; Ozone's three built-in references are **Modern / Bass-Heavy / Orchestral**. https://www.izotope.com/en/products/tonal-balance-control-2/features/tonal-balance-curves.html , https://futuremusic.com/2026/03/izotope-tonal-balance-control-3-review/ , https://www.iconcollective.edu/tonal-balance-control
- **Spectral tilt of commercial masters** — pink noise falls 3 dB/oct; a "musically balanced" master sits parallel to pink or a little steeper; practitioners describe a "4 dB/oct slope should read about flat 40 Hz–3 kHz with a gradual treble slope from 3 kHz on", i.e. natural slope ≈ −4 dB/oct to 3 kHz and steeper above; modern pop mastered as bright as effectively +3 dB/oct relative to that. https://gearspace.com/threads/18-grey-noise-average-audio-spectrum.1225254/ , https://www.pgmusic.com/forums/ubbthreads.php?ubb=showflat&Number=346891 , https://www.daqarta.com/dw_0c33.htm
- **Hip-hop / trap tonal character** — hip-hop carries "significantly more energy below 80 Hz" than most genres; bass-heavy music's low band "naturally consumes a significant amount of energy"; typical moves: lift 60–80 Hz, cut 250–400 Hz mud; sub below ~150 Hz near-mono. https://beatstorapon.com/blog/rap-mastering-settings-2025-professional-targets-presets-and-platform-delivery-for-rap-trap-rb/ , https://mysticalankar.com/blogs/blog/mastering-trap-music-a-comprehensive-guide , https://mixinggpt.com/blog/how-to-use-reference-tracks-mixing
- **Loudness / dynamics norms by genre (adjacent context — see Section 7, not part of `REF_CORRIDORS`)** — streaming reference −14 LUFS-I (Spotify/YouTube/Amazon/Tidal), Apple −16; 808-heavy trap −14…−8 LUFS-I, melodic trap −13…−9, contemporary-pop R&B −12…−8, soulful R&B −11…−7, UK/NY drill −14…−8; lo-fi / boom-bap comfortable −12…−14; true-peak ceiling −1.0 dBTP (−2.0 for very loud masters); crest factor general 8–12 dB, trap/drill 6–9, R&B/soul 9–14. https://beatstorapon.com/blog/rap-mastering-settings-2025-professional-targets-presets-and-platform-delivery-for-rap-trap-rb/ , https://www.edmprod.com/lufs/ , https://veniamastering.studio/blog/how-loud-should-your-master-be-in-2026/ , https://luvlang.studio/blog/how-loud-should-my-master-be

No single public source publishes a numeric 12-point per-genre target curve (iZotope's are proprietary). The tables below are my synthesis of the slope data + the genre-character data, expressed in the app's existing structure.

---

## 4. Proposed tables — old → new, side by side

Drop-in replacement for the `REF_CORRIDORS` object body. Structure, keys, `label` strings and anchor frequencies unchanged. Relative dB.

### 4.1 `trap` — "Trap / 808-heavy"
```
OLD  pts:[[20,-14,-4],[40,-7,1],[90,-6,2],[160,-10,-3],[300,-13,-6],[600,-15,-8],[1200,-17,-10],[2500,-18,-11],[5000,-20,-12],[10000,-23,-14],[16000,-29,-18],[20000,-38,-24]]
NEW  pts:[[20,-13,2],[40,-7,6],[90,-7,5],[160,-9,1],[300,-13,-5],[600,-14,-8],[1200,-16,-10],[2500,-20,-13],[5000,-24,-15],[10000,-27,-16],[16000,-32,-20],[20000,-38,-23]]
```
Sub/low band lifted ~2 dB and widened (huge production variance in 808 tuning/extension). Modest 200–400 Hz scoop kept (`300` centre −9). **HF decisively steepened:** 10 kHz centre −18.5 → −21.5, 16 kHz −23.5 → −26, and the drop is now monotonic and ~−4 dB/oct through 1.2–5 kHz with a small hat/air relief 8–12 kHz. 150 Hz–3 kHz centre-mean held at −10.9.

### 4.2 `hiphop` — "Hip-Hop"
```
OLD  pts:[[20,-16,-6],[40,-9,-1],[90,-7,1],[160,-10,-3],[300,-12,-5],[600,-14,-7],[1200,-16,-9],[2500,-17,-10],[5000,-19,-11],[10000,-22,-13],[16000,-28,-17],[20000,-37,-23]]
NEW  pts:[[20,-15,-2],[40,-8,3],[90,-8,2],[160,-9,-1],[300,-11,-4],[600,-14,-8],[1200,-16,-10],[2500,-21,-14],[5000,-26,-17],[10000,-31,-20],[16000,-36,-24],[20000,-41,-26]]
```
Bass-forward but ~2 dB less sub than trap, with more low-mid body (200–500 Hz sits a little fuller — less scoop than trap/pop). Top rolls slightly darker/rounder than pop (boom-bap ↔ modern blend). Same steep HF fix.

### 4.3 `rnb` — "R&B"
```
OLD  pts:[[20,-18,-8],[40,-11,-3],[90,-8,0],[160,-10,-3],[300,-12,-5],[600,-13,-6],[1200,-15,-8],[2500,-16,-9],[5000,-18,-10],[10000,-21,-12],[16000,-27,-16],[20000,-36,-22]]
NEW  pts:[[20,-17,-2],[40,-10,3],[90,-9,2],[160,-9,0],[300,-11,-2],[600,-14,-5],[1200,-17,-8],[2500,-23,-14],[5000,-28,-18],[10000,-31,-20],[16000,-36,-23],[20000,-40,-25]]
```
Warm, rich **low-mid body** (160–600 Hz sits fuller than every other genre here) and a smooth, pulled-back presence region (2.5–5 kHz). Air extends but stays silky, not hyped. **Widest corridor of the set** (±4.5 through the mids vs ±3 elsewhere) — R&B legitimately spans retro-soul to modern alt-R&B.

### 4.4 `pop` — "Pop"
```
OLD  pts:[[20,-22,-12],[40,-14,-6],[90,-10,-2],[160,-11,-4],[300,-12,-5],[600,-13,-6],[1200,-14,-7],[2500,-15,-8],[5000,-16,-9],[10000,-19,-11],[16000,-25,-15],[20000,-34,-21]]
NEW  pts:[[20,-16,-8],[40,-9,-2],[90,-9,-2],[160,-11,-4],[300,-12,-6],[600,-14,-9],[1200,-15,-11],[2500,-19,-13],[5000,-23,-15],[10000,-27,-16],[16000,-32,-21],[20000,-37,-24]]
```
**Tightest, most controlled low end** (narrow ±3–4, least sub elevation), clean low-mids, **vocal-forward presence** (2–5 kHz sits up relative to the other genres) and the **brightest extended air** — but "brightest" here still means the HF is only ~2–3 dB above the other genres' new (steep) curves, not the old shallow slope. Air band widened (±5.5).

### 4.5 `afrobeats` — "Afrobeats"
```
OLD  pts:[[20,-16,-6],[40,-10,-2],[90,-7,1],[160,-9,-2],[300,-11,-4],[600,-13,-6],[1200,-15,-8],[2500,-15,-8],[5000,-17,-10],[10000,-20,-12],[16000,-26,-16],[20000,-35,-22]]
NEW  pts:[[20,-15,-3],[40,-8,3],[90,-8,2],[160,-10,-1],[300,-12,-4],[600,-14,-8],[1200,-16,-10],[2500,-20,-13],[5000,-25,-16],[10000,-28,-17],[16000,-33,-22],[20000,-38,-24]]
```
Strong but **tight mid-bass** (kick + bass + low percussion punch around 60–120 Hz), present mids, and a **lively percussive top** (shakers, log drums) so 5–12 kHz sits a shade above hip-hop. Between hip-hop and pop overall.

### 4.6 `lofi` — "Lo-Fi"
```
OLD  pts:[[20,-16,-6],[40,-10,-2],[90,-8,0],[160,-9,-2],[300,-11,-4],[600,-13,-6],[1200,-16,-9],[2500,-19,-12],[5000,-24,-15],[10000,-30,-20],[16000,-38,-27],[20000,-46,-34]]
NEW  pts:[[20,-19,-7],[40,-11,-2],[90,-10,-2],[160,-10,-2],[300,-10,-3],[600,-13,-6],[1200,-15,-10],[2500,-22,-15],[5000,-29,-21],[10000,-35,-27],[16000,-43,-35],[20000,-47,-39]]
```
The current lo-fi curve was already the closest to right (it already had a steep top). Changes: **reduced sub** (HPF'd / vinyl — 20–40 Hz pulled down ~2–3 dB), **midrange-forward "boxy" warmth** (300–1200 Hz sits up, the defining lo-fi colour), presence pulled back, and the **deliberate HF roll kept/slightly deepened** (tape, vinyl, bit-reduction). Narrowest mid/air corridor (±2.5–4) — lo-fi is a defined aesthetic, not a wide target. `20000` low edge held at −47 (just off the `MIN_DB −48` floor).

### 4.7 `flat` — "Flat / reference" (also the `auto` fallback when `STATE.genre` is unset/unknown)
```
OLD  pts:[[20,-20,-10],[40,-14,-6],[90,-11,-3],[160,-11,-4],[300,-12,-5],[600,-13,-6],[1200,-14,-7],[2500,-15,-8],[5000,-17,-10],[10000,-20,-12],[16000,-26,-16],[20000,-35,-22]]
NEW  pts:[[20,-16,-4],[40,-10,1],[90,-9,-1],[160,-10,-3],[300,-12,-5],[600,-14,-8],[1200,-16,-10],[2500,-21,-14],[5000,-26,-17],[10000,-30,-19],[16000,-35,-23],[20000,-40,-25]]
```
The neutral backbone every other genre is derived from: a smooth raw-LTAS of a well-balanced, full-range, moderately-dynamic master. Gentle sub shelf (40–90 Hz plateau, roll below 30 Hz), ~−2.5 dB/oct 200 Hz–1.2 kHz, ~−4 dB/oct 1.2–5 kHz, air relief 5–10 kHz, fast roll 16–20 kHz. 150 Hz–3 kHz centre-mean −11.0. Overall slope 300 Hz→10 kHz ≈ **−3.3 dB/oct** (was ≈ −1.5).

---

## 5. Effect on the readouts — worked example (`trap`, using Kevin's screenshot figures)

`ozBandDelta` shape offsets (corridor **centre relative to its own 150 Hz–3 kHz mean**; this is the number that drives the meters):

| Band | OLD trap corridor | NEW trap corridor | Change |
|---|---|---|---|
| LOW (≈40–90 Hz) | +8.6 dB above mid-ref | +9.7 dB above mid-ref | +1.1 (target low raised slightly) |
| MID (150 Hz–3 kHz) | 0 (definition) | 0 (definition) | — |
| HIGH (≈5–16 kHz) | −8.2 dB below mid-ref | −11.4 dB below mid-ref | **−3.2 (target top steepened)** |

Kevin's master read **+8.9 low / −1.9 mid / −13.2 high** against OLD. Against NEW, holding his measured mix constant, the same track reads approximately **+7.8 low / −1.9 mid / −10.0 high**. The high-band error shrinks by ~3 dB purely from the corridor; the low barely moves (deliberate — see Section 6). The mid is unchanged by construction.

**This does not get his master to "on target" on its own.** It removes the ~3 dB of HF error that came from the shallow-slope bug. The rest is either (a) his master genuinely being a little dark up top / bass-forward, or (b) needing the reference-track calibration in Section 6. My recommendation is to ship this table, let Kevin drive it with real audio, then trim ±2 dB.

---

## 6. What needs Kevin's ear, not a reference number

1. **Low-band absolute elevation (every bass genre — trap/hiphop/afrobeats most).** Published data confirms hip-hop/trap carry much more sub energy than other genres but does **not** give a defensible dB figure for "how much above the mids on a raw LTAS." I set trap ≈ +9.7 dB, hiphop/afrobeats ≈ +8, R&B ≈ +6.5, pop ≈ +4, lo-fi ≈ +3 above each genre's 150 Hz–3 kHz mean. If Kevin's finished 808 masters still read "+6 to +9 low" against this and he considers them correct, raise the trap/hiphop/afrobeats `20/40/90` anchors a further 2–4 dB. **This is the single most ear-dependent parameter.**
2. **Overall HF target darkness.** I've calibrated to a ~−4 dB/oct raw-LTAS slope from published practice. Whether Kevin wants the *target* to represent "a bright modern master" (shallower, ~−3.3 dB/oct → raise 5–16 kHz anchors ~2–3 dB) or "a neutral reference master" (as speced) is a taste call about what the corridor should represent.
3. **Lo-fi HF roll depth.** How aggressively lo-fi should roll above 5 kHz is aesthetic. I kept it close to the current (already-steep) values with a small deepening. Kevin may want it darker still (10 kHz to −33/−35) or lighter.
4. **R&B corridor width.** I made R&B the widest target. If Kevin wants R&B to be a tighter, more specific modern-alt-R&B target, narrow the mids to ±3 and lift presence ~1.5 dB.
5. **Recommended calibration procedure (the correct long-term fix, mirrors iZotope TBC's "custom target from reference"):** for each genre, load 3–5 of Kevin's own trusted reference masters through the Mix Check analyser, read the LOW / MID / HIGH deviation values against the proposed corridor, average them per band, and shift that genre's low / mid / high anchor groups by the negative of the average. That turns "house-made approximation" into "measured from Kevin's references" without any code change — just new numbers in `REF_CORRIDORS`. Worth doing as a follow-up pass once this first-pass table is in.

---

## 7. Adjacent — per-genre LUFS-I / PLR (NOT part of `REF_CORRIDORS`, flagged for completeness)

`REF_CORRIDORS` is spectral only. Loudness/dynamics targets live elsewhere and are only partly genre-aware today:

- `MC_FIXQUEUE.targetLufsFor()` already maps `{trap:-8, hiphop:-8, rnb:-9, pop:-8, afrobeats:-8, lofi:-12, flat:-14}` for Hope's breakdown card. Published norms broadly support this; possible small tweaks: `rnb −9→−10`, `lofi −12→−13`, `hiphop −8→−9`. Low-confidence, Kevin's call.
- `refPopulate()` hard-codes a **"−8 LUFS trap target"** tag and a **DR ≥ 7 / PLR ≥ 7** floor for the LUFS and PLR meters **regardless of selected genre**. Published crest-factor ranges differ by genre (trap/drill 6–9 dB, R&B/soul 9–14 dB), so a lo-fi or R&B master gets a misleading "over-compressed" flag. Making that meter's target genre-aware is a **separate Cat change**, not this spec, but it's the same class of "the target doesn't reflect the genre" complaint as #1 — worth queuing.

---

## 8. Constraints confirmed — this re-tune breaks nothing

- **Deviation-meter scale (`ozPopulateBands`).** Meter maths unchanged: `pct = clamp(|d|/6·50, 2.5, 50)`, ±6 dB full-scale. The re-tune changes the *values* `d`, not the scale. HIGH-band deltas for typical masters shrink (~−13 → ~−10) so the HIGH bar pegs its edge **less** often. LOW-band deltas are roughly held, so **residual B** (very hot LOW bands pegging at the ±6 dB edge, signed value carries the truth) is **not fixed by this spec** and not worsened. If Kevin wants residual B addressed, widen the meter to ±9 or ±12 dB full-scale — that's a `ozPopulateBands` change, out of scope here, noted.
- **Fix Queue `derive()` / `build()` magnitude maths.** `band-*` items still come from `ozBandDelta()` via `over = |delta|−1.5`, `score = over × BANDS[bk].w`, `impact high if over>3`. Item shape `{id,key,title,why,move,focusBand,freqRange,impact,confidence,playFromSec}`, the dedupe, the `MOVE_PENDING` placeholder, `breakdownData()` and the `aimm:analysis-complete` event are all untouched. Magnitudes get **smaller and more believable** (HF `over` ~11.5 → ~8.5); ranking order between spectral bands can shift slightly where two bands were previously both pegged — that is the intended outcome ("the numbers mean something").
- **Canvas draw (`refDrawCanvas`).** 150 Hz–3 kHz centre-mean held near −11 dB for every genre, so the purple zone's vertical position on the analyser does not jump. Zones are a little thinner through the mids (tighter width there) and wider at the extremes — intentional, reads as "reference in the middle, latitude at the edges." `dbToY` / `MAX_DB` / `Y_TOP_PAD` untouched; the steeper corridor tops stay well inside the canvas.

---

## 9. Hand-off

- **Owner to implement:** Cat, into `REF_CORRIDORS` in `index.html` on `r3-mixcheck-fixes`, gated on Kevin's approval of this spec. Replace only the 7 `pts` arrays (Section 4); keep `label` strings and object keys exactly.
- **Then:** re-render the Mix Check analyser + the 3 deviation meters + a Fix Queue with a WAV loaded, at desktop and mobile width, for Kevin's before/after review (standing rule — rendered, not described).
- **Then (optional follow-up pass):** the Section 6.5 reference-track calibration to replace the first-pass numbers with values measured from Kevin's own references.
- **Not in this spec:** the deviation-meter ±6 dB scale (residual B), the genre-aware LUFS/PLR meter targets in `refPopulate` (Section 7) — both flagged for separate queuing.
