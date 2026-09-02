# Corridor re-tune spec — `REF_CORRIDORS` per-genre target curves

**Author:** Jules (AIMM design) · **Date:** 2026-09-02 · **Branch:** `r3-mixcheck-fixes`
**Status:** SPEC v2.1 — awaiting Kevin's approval. Cat implements the tables into `index.html`; Jules does not edit `index.html`.
**Supersedes:** v1 (`a177315`), then v2 (`d1023cb`). v2 is the source-grounded rebuild Kevin asked for ("Get your information from iZotope… go and do your research") — every value traces to a published measurement, not an ear estimate. **v2.1 (2026-09-02)** keeps v2's curve shape and every predicted meter shift byte-for-byte, and only restores the purple corridor **band thickness** to the pre-R3 width (v2 had unintentionally halved it — a visual regression Kevin flagged). See §0.1.
**Addresses:** POST-SHIP FIX LIST item **#1** — "Target / reference corridor is inaccurate".
**Build impact:** data-values only inside one `const`. No structure change, no new function, no DSP change. This docs commit bumps nothing; Cat bumps `AIMM_BUILD` on the implementing commit.

---

## 0. What changed from v1

| | v1 (`a177315`) | v2 (this doc) |
|---|---|---|
| Backbone of the curve | ear estimate "~−4 dB/oct" from forum practice | **computed from Elowsson & Friberg 2017's published quadratic fit** to the LTAS of 12,345 loudness-normalised commercial masters |
| Band maths in the worked example | approximated (mean of two anchors) | **exact reproduction of `ozBandDelta()`** — real `corridorAt()` log-interp, real 150–3000 Hz normalisation, real 24/48-step band sweeps, read out of `index.html` at `r3-mixcheck-fixes` |
| Open ear-only questions | 5 | **1** (low-band elevation) + 2 minor aesthetic notes |
| Predicted effect on Kevin's screenshot master | "≈ −10 high, still needs ear" | **HIGH −13.2 → +1.2, MID −1.9 → −0.1, LOW +8.9 → +6.7** (computed exactly) |

---

## 0.1 v2.1 — band thickness restored (2026-09-02)

**What Kevin flagged** after rendering the v2 corridor: v2 didn't only re-shape the curve, it also **halved the purple corridor band thickness**. Old `trap` mid-band spread was ~7 dB (`[300,-13,-6]`, `[1200,-17,-10]` → half-width 3.5); v2 was ~3 dB (`[300,-8,-5]`, `[1200,-16,-13]` → half-width 1.5). The thin, tapering band read as a near-line at the extremes — a visual regression he does not want. The curve shape + the numbers were the wanted improvement; the width change was not.

**What v2.1 does — mechanical rule, applied to all 7 genres × 12 anchors:**

> For each anchor: **keep the v2 midpoint `(lo+hi)/2` exactly**, and **set the half-width back to the pre-R3 (`dbc793d`) genre's half-width at that anchor**.
> `lo = v2_midpoint − old_halfWidth`, `hi = v2_midpoint + old_halfWidth`.
> Pre-R3 `REF_CORRIDORS` = `dbc793d:index.html` lines 15160–15168.

**Floor handling ("the original thickness, capped" — Kevin's words).** Where `v2_midpoint − old_halfWidth` would fall below **−46 dB** (v2's own established floor, 2 dB clear of the `MIN_DB −48` canvas bottom), `lo` is clamped to −46 and `hi` is set to `2·midpoint − lo` so the **midpoint is still preserved exactly** — the band just becomes vertically asymmetric (extends upward only) at those anchors. This affects only the extreme-HF anchors that the steep v2 curve pushes near the canvas floor: **20 kHz on every genre**, plus 16 kHz on hip-hop/lo-fi and 10 kHz on hip-hop/lo-fi. Everywhere in the audible/visible range (20 Hz – ~10 kHz) the full pre-R3 thickness is restored. At the clamped anchors the band stays at roughly v2's floored width — it can't be widened downward without plotting off-canvas.

**Why this is safe — re-confirmed against the source read in §1.1 / §1.2:**

- `ozBandDelta()` (the LOW / MID / HIGH deviation meters), `breakdownData().tonalBalanceDeltas` (Hope's card), and `MC_FIXQUEUE` `band-*` items **all read the corridor centre `(lo+hi)/2` only** — never `lo` or `hi` individually, never the width (§1, reader table; §1.2 consequence 2: *"Corridor width changes NO meter reading."*).
- v2.1 preserves every anchor's `(lo+hi)/2` **exactly** (verified: all 84 midpoints identical to v2, 0.0 dB delta). `corridorAt()`'s log-interpolated centre is therefore identical at every frequency → the `offset` term is identical → every LOW/MID/HIGH reading, every §5.1 corridor tilt, the §5.2 Paypadream prediction, and the Fix Queue band ranking are **unchanged**.
- The **only** consumer affected is `refDrawCanvas()` — the purple zone is drawn thicker (back to pre-R3 width). That is exactly the change requested.
- Values now land on a 0.25 dB grid at anchors where the v2 midpoint sits on an x.25/x.75 boundary (a v2 `lo`/`hi` pair summing to an odd multiple of 0.5, combined with an integer-or-x.5 old half-width). `corridorAt()` linearly interpolates — there is no grid constraint. This is cosmetic precision only.

The v2.1 `pts` arrays are in §4 (drop-in block) and per-genre in §4.1–4.7 (each block now shows `OLD` → `v2 (curve)` → `v2.1 (ship)`).

---

## 1. How the corridor is consumed — verified live in `index.html` @ `r3-mixcheck-fixes`

`REF_CORRIDORS[genre] = { label, pts:[[freqHz, loDb, hiDb], … 12 anchors] }`, relative dB, **log10-frequency** interpolated by `corridorAt()` (line 15201). Anchor frequencies are fixed: **20, 40, 90, 160, 300, 600, 1200, 2500, 5000, 10000, 16000, 20000 Hz**. Keep all 12, keep the exact `[f, lo, hi]` triple shape, keep `label` strings and object keys.

Three readers, all confirmed by reading the source:

| Reader | Line | Uses | Sensitive to |
|---|---|---|---|
| `refDrawCanvas()` — purple corridor zone | 15250 | `lo` and `hi` at 150 sample points, feathered fill | corridor **centre** = vertical position; **width** (`hi−lo`) = zone thickness |
| `ozBandDelta(fLo,fHi)` — the LOW / MID / HIGH deviation meters (`ozPopulateBands`, line 15594) + `breakdownData().tonalBalanceDeltas` (Hope's card) | 15579 | corridor **centre** `(lo+hi)/2` only, sampled 24× log-swept across the band | corridor **centre shape**, nothing else |
| `MC_FIXQUEUE` `band-*` items (`over = |delta|−1.5`, `score = over × weight`) | ~16139 / 16263 / 16384 | same `ozBandDelta()` | same |

### 1.1 The exact `ozBandDelta` mechanic (line 15579–15592, quoted)

```
offset  = mean(corridorCentre, 48 log-steps 150→3000 Hz) − mean(mixPts where 150≤f≤3000)
reading = mean(mixPts+offset where fLo≤f≤fHi) − mean(corridorCentre, 24 log-steps fLo→fHi)
```

The three meter bands (`ozPopulateBands`, line 15595) are:

| Meter | Band |
|---|---|
| **LOW** | 20 – 250 Hz |
| **MID** | 250 – 4000 Hz |
| **HIGH** | 4000 – 20000 Hz |

Full-scale on each meter is **±6 dB** (`Math.abs(d)/6*50`, clamped 2.5–50 %); `|d| ≤ 1.5` prints "✓ ON TARGET".

### 1.2 Four consequences that shape the whole spec

1. **Absolute corridor level is irrelevant to every readout.** The `offset` term gain-matches the mix to the corridor over 150–3000 Hz before any band is compared. Shift a whole corridor up/down by a constant → every reading is identical. **Only the corridor's shape relative to its own 150–3000 Hz mean matters.** (I still hold that centre-mean near **−11 dB** for every genre so the drawn zone doesn't jump vertically on the canvas — but that number carries no meaning for the meters.)
2. **Corridor width changes NO meter reading.** `ozBandDelta` reads `(lo+hi)/2` only. Width paints the purple zone thicker/thinner and nothing else. So width is a *visual tolerance hint*: wide where the genre genuinely varies (sub, air), tight through 300 Hz–1.2 kHz so that region reads as "the reference".
3. **The reading for a band is exactly `mixTilt_band − corridorTilt_band`**, where `tilt = (band mean) − (150–3000 Hz mean)`. `mixTilt` is a fixed property of the uploaded master; `corridorTilt` is a fixed property of the corridor table. This makes the effect of any table change computable in closed form — Section 5.
4. **The MID meter band (250–4000 Hz) is wider than the normalisation window (150–3000 Hz).** A perfectly-matched master still reads MID ≈ −2 to −3 dB against a realistic steep curve, because the band catches the 3–4 kHz roll-off that the normalisation window doesn't. This is a pre-existing structural quirk, not something this re-tune introduces — but the steeper (correct) curve makes it ~2 dB more visible. See Section 7, flagged for a **separate 1-line Cat change** (narrow the MID meter band to 250–3000 Hz).

### 1.3 The actual bug (unchanged finding from v1, now quantified)

The mix curve fed to the comparison (`refPtsFromDbBins` → `refFileSpectrum` / float analyser, line 15288 / 15325) is a **raw power LTAS** converted to dB — no pink/tilt compensation. Published measurement (Section 3) puts a real full-range commercial master's raw LTAS at a slope that **starts near −2.3 dB/oct at 200 Hz and steepens to roughly −6 to −9 dB/oct through the upper mids and highs** (mean linear slope 94 Hz–15.7 kHz ≈ **−5.8 dB/oct**).

The current `REF_CORRIDORS` centres fall at only about **−1.5 dB/oct** from 300 Hz to 10 kHz (measured off the shipped tables). Against a real master's raw LTAS the current corridor therefore reads **every properly-balanced master as deficient in the highs** — exactly Kevin's screenshot: `Paypadream$ (mastered).wav` reading **"−13.2 dB high vs the corridor."** Computed against the current `trap` table (Section 5), the corridor's own HIGH-vs-mid tilt is only −8.2 dB where the published data says it should be about −22.5 dB — a **14 dB shortfall**, which is the −13.2 the screenshot shows, near-exactly.

**Primary fix:** steepen every corridor's mid/high slope to the published LTAS shape. **Secondary:** genre-shape the low band and low-mid region from the published per-genre findings + practitioner references. **The one parameter published data cannot pin down** is the absolute low-band elevation for bass-forward genres — Section 6.

---

## 2. Method — how v2's numbers were derived

1. **Flat/reference centre curve** = Elowsson & Friberg 2017's two published quadratic fittings, evaluated at the 12 anchor frequencies, then normalised so the 160–2500 Hz anchors mean −11 dB.
   - Their log-frequency axis: bin `x = 1 + 60·log2(f/30)` (60 bins/octave from 30 Hz).
   - Mid/high fitting (valid ~94 Hz – 15.7 kHz): `y = −0.000183·x² + 0.0213·x − 16.735`.
   - Bass fitting is dominated by its linear term and returns a ~30 dB rise 30→94 Hz — an artefact of their folk-pop-skewed dataset (many tracks with almost no sub) and not usable as a *target* for a bass-forward app. So the 20 Hz and 40 Hz anchors are set as a sub-shelf relative to the 90 Hz value (Section 6), not taken from the fit.
   - Above ~5 kHz their quadratic keeps steepening without bound (−7.6 dB/oct at 3.2 kHz, −8.9 at 6.4 kHz). They attribute the sharp ~4.5 kHz fall to vocal piriform-fossa antiresonance + un-distorted electric-guitar roll-off — both **specific to their dataset**. Modern trap / pop / Afrobeats masters carry hyped air and will not fall that steeply. v2 therefore **eases the slope above 5 kHz** to ~−5 dB/oct (5→10 kHz) and ~−4.5 dB/oct (10→16 kHz), with a faster limiter/LPF roll 16→20 kHz. This is the one place v2 deliberately departs from E&F17, and toward *more* accuracy for AIMM's genres, not less.
2. **Per-genre centre deltas** (mid-anchored) from:
   - E&F17's core finding — *LTAS variation between genres is primarily a side-effect of percussive prominence*; more percussion raises the LTAS in **both** the bass and the highs together, mids anchored. So the bass genres get a coupled low-shelf + slight top lift; genres defined by a darker aesthetic (hip-hop boom-bap, R&B, lo-fi) override the coupling downward in the top (E&F17 explicitly allow stylistic deviation — "heavy bass in reggae" is their example).
   - Pestana et al. 2013 — hip-hop / rock / pop / electronic carry louder LF (to ~150 Hz) and louder HF (5 kHz+) than jazz / folk; jazz and hip-hop are the two genre extremes.
   - Practitioner references (Section 3) for the finer genre character: trap 200–400 Hz scoop, hip-hop low-mid body, R&B warm low-mid + silky pulled-back presence, pop vocal-forward presence + brightest air, Afrobeats tight mid-bass + lively percussive top, lo-fi HPF'd sub + boxy mid-forward warmth + deliberate HF roll.
3. **Per-genre widths** from E&F17's standard-deviation curve — highest at LF and HF, lowest 200 Hz–1 kHz, low 1–4 kHz — plus "for [low] frequencies, deviations of up to around 10 dB are not uncommon."
4. **Every table was then run back through an exact Python reimplementation of `ozBandDelta()`** to confirm the LOW/MID/HIGH tilts land where the published data says, and to compute the effect on Kevin's screenshot master (Section 5).

---

## 3. Sources

**Primary — published LTAS measurement of commercial masters:**

- **Elowsson, A. & Friberg, A. (2017). "Long-term Average Spectrum in Popular Music and its Relation to the Level of the Percussion." AES 142nd Convention, Berlin, Convention Paper 9762.** LTAS of **12,345** popular-music tracks, loudness-normalised to ITU-R BS.1770-4 (the same standard AIMM's own loudness engine uses). Key published numbers used here:
  - Mean LTAS rises to ~94 Hz, then falls with a slope that **steepens with frequency**.
  - Quadratic fit, mid/high: `y = −0.000183·x² + 0.0213·x − 16.735` (x = log-freq bin, 60/oct from 30 Hz). Bass fit: `y = 0.000907·x² + 0.256·x − 32.942`.
  - Slope table (dB/oct): **200 Hz −2.35 · 400 Hz −3.67 · 800 Hz −4.99 · 1.6 kHz −6.30 · 3.2 kHz −7.62 · 6.4 kHz −8.94.**
  - Linear slope 94 Hz–15.7 kHz: **−5.79 dB/oct.**
  - Percussion-invariant slope 89 Hz–4.5 kHz: **−4.53 dB/oct** (holds across all 11 percussion-level groups).
  - Small dip at ~150 Hz; relatively sharp fall at ~4.5 kHz.
  - Low frequencies (below ~150 Hz): variance is highest here, "deviations of up to around 10 dB are not uncommon," and "deviations below the mean are generally less alarming" (many tracks lack LF instruments).
  - Genre: "variation in LTAS between genres … is primarily a side-effect of variations in the amount of percussion between genres." More percussion → higher LTAS in bass **and** highs. Automatic-EQ targets improve when LF (<100 Hz) and HF (>2 kHz) are adjusted for percussive prominence; mids barely move. `http://www.diva-portal.org/smash/get/diva2:1108529/FULLTEXT02`
- **Pestana, P. D., Ma, Z., Reiss, J. D., Barbosa, Á. & Black, D. (2013). "Spectral Characteristics of Popular Commercial Recordings 1950-2010." AES 135th Convention, New York.** LTAS of **772** #1 singles. "A consistent trend towards a linear decay of about **5 dB per octave from 100 to 4000 Hz**"; "a consistent leaning towards a target equalization curve that stems from practices in the music production industry, but also to some extent mimics natural, acoustic spectra of ensembles"; low-frequency energy rose over the decades (digital era); jazz and hip-hop were the genre extremes. `https://www.researchgate.net/publication/274511175` · `https://www.academia.edu/31481041`

**Corroborating — spectral tilt / "pink-ish" reference of commercial masters:**

- Pink noise falls **−3 dB/oct** on a log axis; commercial "radio-ready" masters follow "a steady downward slope … often referred to as a 3 dB or 4.5 dB per octave tilt," with modern "lush" productions closer to **−4.5 dB/oct**. `https://medium.com/ai-music/spectrum-analyzer-slopes-in-audio-mixing-d6df8892ea3` · `https://www.brownnoiseradio.com/resources/understanding-the-pink-noise-curve:-what-it-should-look-like`
- **iZotope Tonal Balance Control** — genre target curves "created by analyzing the spectral characteristics of numerous tracks across different genres/styles"; TBC 3 ships "30+ genre and subgenre" targets from "analyzing hundreds of professional masters"; broad-view bands **Low 20–250 Hz, Low-Mid 250 Hz–2 kHz, Mid 2–8 kHz, High-Mid 8–20 kHz**; Ozone's three factory references are **Modern / Bass-Heavy / Orchestral**. iZotope publishes **no numeric curve** (proprietary) — used here only to corroborate that per-genre corridors built from LTAS analysis is the correct model, and for the broadband band split. `https://s3.amazonaws.com/izotopedownloads/docs/tonal-balance-control/meters-and-target-curves/index.html` · `https://www.izotope.com/en/products/tonal-balance-control-2/features/tonal-balance-curves.html`

**Corroborating — genre spectral character:**

- Hip-hop / trap: energy peak has moved to **20–50 Hz** (was ~70 Hz pre-2010); 808 fundamental ~50–60 Hz; sub regions "boom" ~30 Hz / "thump" ~50 Hz / "punch" ~80 Hz; typical sub boost **+4 to +6 dB** in 20–50 Hz; 200–400 Hz "mud" cut; sub near-mono below ~150 Hz. `https://gearspace.com/board/mastering-forum/1248356-low-frequency-extension-modern-rap-records.html` · `https://arxiv.org/pdf/2502.07524` · `https://beatstorapon.com/blog/rap-mastering-settings-2025-professional-targets-presets-and-platform-delivery-for-rap-trap-rb/`
- Afrobeats: "log drum" = layered pure sine sub + short percussive transient, "controlled heavy sub-bass decay," lively percussion top. `https://beatstorapon.com/blog/afrobeats-production-guide-rhythm-chords-mixing/` · `https://www.tandfonline.com/doi/full/10.1080/00064246.2024.2370204`
- Lo-fi: HPF'd / vinyl-emulated sub, "boxy" mid-forward warmth (300 Hz–1.2 kHz), deliberate HF roll from tape / vinyl / bit-reduction. `https://www.sonible.com/blog/history-of-spectral-balance/`
- Modern spectral balance overall: increased low-end presence driven by hip-hop/trap/drill influence; bass below ~150 Hz "almost completely mono" in current productions. `https://www.sonible.com/blog/history-of-spectral-balance/`

**Adjacent (loudness/dynamics — Section 7, NOT part of `REF_CORRIDORS`):**

- Streaming reference −14 LUFS-I (Spotify / YouTube / Amazon / Tidal), Apple −16; 808-heavy trap −14…−8 LUFS-I, melodic trap −13…−9, R&B −12…−7, lo-fi / boom-bap −12…−14; true-peak ceiling −1.0 dBTP; crest factor general 8–12 dB, trap/drill 6–9, R&B/soul 9–14. `https://beatstorapon.com/blog/rap-mastering-settings-2025-professional-targets-presets-and-platform-delivery-for-rap-trap-rb/` · `https://www.edmprod.com/lufs/` · `https://veniamastering.studio/blog/how-loud-should-your-master-be-in-2026/`

---

## 4. Proposed tables — drop-in replacement for the `REF_CORRIDORS` object body

Structure, keys, `label` strings and anchor frequencies unchanged. Relative dB. Cat replaces **only the 7 `pts` arrays**. **These are the v2.1 arrays** (v2 curve/midpoints + pre-R3 band thickness — see §0.1).

```js
const REF_CORRIDORS={
  trap:     {label:'Trap / 808-heavy', pts:[[20,-18.5,-8.5],[40,-5.5,2.5],[90,-1.5,6.5],[160,-6.25,0.75],[300,-10,-3],[600,-13.5,-6.5],[1200,-18,-11],[2500,-25.25,-18.25],[5000,-33.5,-25.5],[10000,-39,-30],[16000,-45,-34],[20000,-46,-41]]},
  hiphop:   {label:'Hip-Hop',          pts:[[20,-21.25,-11.25],[40,-7.75,0.25],[90,-2.5,5.5],[160,-6.75,0.25],[300,-8.5,-1.5],[600,-13,-6],[1200,-18.5,-11.5],[2500,-25.75,-18.75],[5000,-34.5,-26.5],[10000,-40.5,-31.5],[16000,-46,-36],[20000,-46,-42.5]]},
  rnb:      {label:'R&B',              pts:[[20,-23,-13],[40,-9.5,-1.5],[90,-4.25,3.75],[160,-6.5,0.5],[300,-7.75,-0.75],[600,-12.75,-5.75],[1200,-18.75,-11.75],[2500,-27,-20],[5000,-34.75,-26.75],[10000,-40,-31],[16000,-45.25,-34.25],[20000,-46,-41]]},
  pop:      {label:'Pop',              pts:[[20,-24,-14],[40,-10,-2],[90,-5,3],[160,-8,-1],[300,-9.75,-2.75],[600,-13.25,-6.25],[1200,-18.25,-11.25],[2500,-23.5,-16.5],[5000,-31.25,-24.25],[10000,-36.25,-28.25],[16000,-41.25,-31.25],[20000,-46,-34]]},
  afrobeats:{label:'Afrobeats',        pts:[[20,-22.5,-12.5],[40,-8,0],[90,-3.25,4.75],[160,-6.75,0.25],[300,-9.5,-2.5],[600,-13.5,-6.5],[1200,-18,-11],[2500,-24.75,-17.75],[5000,-31.5,-24.5],[10000,-37.25,-29.25],[16000,-42.75,-32.75],[20000,-46,-37]]},
  lofi:     {label:'Lo-Fi',            pts:[[20,-26.5,-16.5],[40,-12.5,-4.5],[90,-7.5,0.5],[160,-8,-1],[300,-7.25,-0.25],[600,-11.25,-4.25],[1200,-17.25,-10.25],[2500,-28,-21],[5000,-39.25,-30.25],[10000,-46,-37],[16000,-46,-43.5],[20000,-46,-43.5]]},
  flat:     {label:'Flat / reference', pts:[[20,-24,-14],[40,-11,-3],[90,-6.25,1.75],[160,-8,-1],[300,-9.25,-2.25],[600,-12.75,-5.75],[1200,-17.75,-10.75],[2500,-25,-18],[5000,-32.75,-25.75],[10000,-38.25,-30.25],[16000,-43.75,-33.75],[20000,-46,-39]]}
};
```

<details><summary>v2 arrays (curve only — superseded by v2.1 above; kept for traceability)</summary>

```js
  trap:     pts:[[20,-17.5,-9.5],[40,-5,2],[90,0,5],[160,-4.5,-1],[300,-8,-5],[600,-11.5,-8.5],[1200,-16,-13],[2500,-23.5,-20],[5000,-31.5,-27.5],[10000,-37,-32],[16000,-42.5,-36.5],[20000,-46,-41]]
  hiphop:   pts:[[20,-20,-12.5],[40,-7,-0.5],[90,-1,4],[160,-5,-1.5],[300,-6.5,-3.5],[600,-11,-8],[1200,-16.5,-13.5],[2500,-24,-20.5],[5000,-32.5,-28.5],[10000,-38.5,-33.5],[16000,-44,-38],[20000,-46,-42.5]]
  rnb:      pts:[[20,-22,-14],[40,-9,-2],[90,-3,2.5],[160,-5,-1],[300,-6,-2.5],[600,-11,-7.5],[1200,-17,-13.5],[2500,-25.5,-21.5],[5000,-33,-28.5],[10000,-38,-33],[16000,-42.5,-37],[20000,-46,-41]]
  pop:      pts:[[20,-22,-16],[40,-8.5,-3.5],[90,-3,1],[160,-6,-3],[300,-7.5,-5],[600,-11,-8.5],[1200,-16,-13.5],[2500,-21.5,-18.5],[5000,-29.5,-26],[10000,-34.5,-30],[16000,-39,-33.5],[20000,-43,-37]]
  afrobeats:pts:[[20,-21,-14],[40,-7,-1],[90,-1.5,3],[160,-5,-1.5],[300,-7.5,-4.5],[600,-11.5,-8.5],[1200,-16,-13],[2500,-23,-19.5],[5000,-30,-26],[10000,-35.5,-31],[16000,-40.5,-35],[20000,-44.5,-38.5]]
  lofi:     pts:[[20,-24.5,-18.5],[40,-11,-6],[90,-5.5,-1.5],[160,-6,-3],[300,-5,-2.5],[600,-9,-6.5],[1200,-15,-12.5],[2500,-26,-23],[5000,-36.5,-33],[10000,-43.5,-39.5],[16000,-46,-43.5],[20000,-46,-43.5]]
  flat:     pts:[[20,-22.5,-15.5],[40,-10,-4],[90,-4.5,0],[160,-6,-3],[300,-7,-4.5],[600,-10.5,-8],[1200,-15.5,-13],[2500,-23,-20],[5000,-31,-27.5],[10000,-36.5,-32],[16000,-41.5,-36],[20000,-45.5,-39.5]]
```
</details>

### 4.1 `flat` — "Flat / reference" (also the `auto` fallback when `STATE.genre` is unset)
```
OLD   pts:[[20,-20,-10],[40,-14,-6],[90,-11,-3],[160,-11,-4],[300,-12,-5],[600,-13,-6],[1200,-14,-7],[2500,-15,-8],[5000,-17,-10],[10000,-20,-12],[16000,-26,-16],[20000,-35,-22]]
v2    pts:[[20,-22.5,-15.5],[40,-10,-4],[90,-4.5,0],[160,-6,-3],[300,-7,-4.5],[600,-10.5,-8],[1200,-15.5,-13],[2500,-23,-20],[5000,-31,-27.5],[10000,-36.5,-32],[16000,-41.5,-36],[20000,-45.5,-39.5]]
v2.1  pts:[[20,-24,-14],[40,-11,-3],[90,-6.25,1.75],[160,-8,-1],[300,-9.25,-2.25],[600,-12.75,-5.75],[1200,-17.75,-10.75],[2500,-25,-18],[5000,-32.75,-25.75],[10000,-38.25,-30.25],[16000,-43.75,-33.75],[20000,-46,-39]]
```
_v2.1 = v2 midpoints, pre-R3 half-widths (§0.1). 20 kHz `lo` clamped at −46 (midpoint held)._
Direct evaluation of **Elowsson & Friberg 2017's mean-LTAS quadratic** at the 12 anchors, normalised to a −11 dB mid-mean, with the ~150 Hz dip applied, a sub-shelf below 90 Hz, and the >5 kHz slope eased from their (dataset-specific) quadratic to ~−5 dB/oct. Centre slope 300 Hz→10 kHz = **−5.6 dB/oct** (was ≈ −1.5). This is the neutral backbone every genre is shaped from.

### 4.2 `trap` — "Trap / 808-heavy"
```
OLD   pts:[[20,-14,-4],[40,-7,1],[90,-6,2],[160,-10,-3],[300,-13,-6],[600,-15,-8],[1200,-17,-10],[2500,-18,-11],[5000,-20,-12],[10000,-23,-14],[16000,-29,-18],[20000,-38,-24]]
v2    pts:[[20,-17.5,-9.5],[40,-5,2],[90,0,5],[160,-4.5,-1],[300,-8,-5],[600,-11.5,-8.5],[1200,-16,-13],[2500,-23.5,-20],[5000,-31.5,-27.5],[10000,-37,-32],[16000,-42.5,-36.5],[20000,-46,-41]]
v2.1  pts:[[20,-18.5,-8.5],[40,-5.5,2.5],[90,-1.5,6.5],[160,-6.25,0.75],[300,-10,-3],[600,-13.5,-6.5],[1200,-18,-11],[2500,-25.25,-18.25],[5000,-33.5,-25.5],[10000,-39,-30],[16000,-45,-34],[20000,-46,-41]]
```
_v2.1 = v2 midpoints, pre-R3 half-widths (§0.1). 20 kHz `lo` clamped at −46 (midpoint held; band asymmetric there only)._
Flat backbone + a **low-shelf lift of +4 to +5 dB** across 20–90 Hz (808 fundamental, "sub peak has moved to 20–50 Hz"), widened at the extremes; a **modest 200–400 Hz scoop** (`160`/`300` sit below the shelf and the smooth mid line); a small rounding of 2.5–10 kHz (−1 dB) but hats/air kept present. Centre low-vs-mid tilt = **+8.7 dB** (was +6.5). Centre slope 300 Hz→10 kHz = **−5.5 dB/oct**. The +4–5 low-shelf lift is near the top of what's defensible without Kevin's ear check — see Section 6.

### 4.3 `hiphop` — "Hip-Hop"
```
OLD   pts:[[20,-16,-6],[40,-9,-1],[90,-7,1],[160,-10,-3],[300,-12,-5],[600,-14,-7],[1200,-16,-9],[2500,-17,-10],[5000,-19,-11],[10000,-22,-13],[16000,-28,-17],[20000,-37,-23]]
v2    pts:[[20,-20,-12.5],[40,-7,-0.5],[90,-1,4],[160,-5,-1.5],[300,-6.5,-3.5],[600,-11,-8],[1200,-16.5,-13.5],[2500,-24,-20.5],[5000,-32.5,-28.5],[10000,-38.5,-33.5],[16000,-44,-38],[20000,-46,-42.5]]
v2.1  pts:[[20,-21.25,-11.25],[40,-7.75,0.25],[90,-2.5,5.5],[160,-6.75,0.25],[300,-8.5,-1.5],[600,-13,-6],[1200,-18.5,-11.5],[2500,-25.75,-18.75],[5000,-34.5,-26.5],[10000,-40.5,-31.5],[16000,-46,-36],[20000,-46,-42.5]]
```
_v2.1 = v2 midpoints, pre-R3 half-widths (§0.1). 16 kHz + 20 kHz `lo` clamped at −46 (midpoint held; band asymmetric there)._
Bass-forward but ~1.5 dB less sub-shelf than trap, with **more low-mid body** (`300` sits fuller than trap/pop — less scoop; boom-bap ↔ modern blend) and a **darker, rounder top** (−1.5 to −3 dB above 5 kHz vs flat). Centre low-vs-mid tilt = **+7.2 dB**.

### 4.4 `rnb` — "R&B"
```
OLD   pts:[[20,-18,-8],[40,-11,-3],[90,-8,0],[160,-10,-3],[300,-12,-5],[600,-13,-6],[1200,-15,-8],[2500,-16,-9],[5000,-18,-10],[10000,-21,-12],[16000,-27,-16],[20000,-36,-22]]
v2    pts:[[20,-22,-14],[40,-9,-2],[90,-3,2.5],[160,-5,-1],[300,-6,-2.5],[600,-11,-7.5],[1200,-17,-13.5],[2500,-25.5,-21.5],[5000,-33,-28.5],[10000,-38,-33],[16000,-42.5,-37],[20000,-46,-41]]
v2.1  pts:[[20,-23,-13],[40,-9.5,-1.5],[90,-4.25,3.75],[160,-6.5,0.5],[300,-7.75,-0.75],[600,-12.75,-5.75],[1200,-18.75,-11.75],[2500,-27,-20],[5000,-34.75,-26.75],[10000,-40,-31],[16000,-45.25,-34.25],[20000,-46,-41]]
```
_v2.1 = v2 midpoints, pre-R3 half-widths (§0.1). 20 kHz `lo` clamped at −46 (midpoint held)._
**Warm, full low-mid body** (`160`–`600` sit fuller than any other genre here) and a **smooth, pulled-back presence** (`2500` cut ~2 dB more than flat). Air extends but stays silky. (In v2 this was also drawn as the widest corridor; v2.1 restores the uniform pre-R3 thickness across all genres — see §0.1 — so R&B's "spans retro-soul to modern alt-R&B" latitude now reads through the centre placement, not a wider band.)

### 4.5 `pop` — "Pop"
```
OLD   pts:[[20,-22,-12],[40,-14,-6],[90,-10,-2],[160,-11,-4],[300,-12,-5],[600,-13,-6],[1200,-14,-7],[2500,-15,-8],[5000,-16,-9],[10000,-19,-11],[16000,-25,-15],[20000,-34,-21]]
v2    pts:[[20,-22,-16],[40,-8.5,-3.5],[90,-3,1],[160,-6,-3],[300,-7.5,-5],[600,-11,-8.5],[1200,-16,-13.5],[2500,-21.5,-18.5],[5000,-29.5,-26],[10000,-34.5,-30],[16000,-39,-33.5],[20000,-43,-37]]
v2.1  pts:[[20,-24,-14],[40,-10,-2],[90,-5,3],[160,-8,-1],[300,-9.75,-2.75],[600,-13.25,-6.25],[1200,-18.25,-11.25],[2500,-23.5,-16.5],[5000,-31.25,-24.25],[10000,-36.25,-28.25],[16000,-41.25,-31.25],[20000,-46,-34]]
```
_v2.1 = v2 midpoints, pre-R3 half-widths (§0.1). 20 kHz `lo` clamped at −46 (midpoint held)._
**Tightest, most controlled low end** (narrowest widths, least sub-shelf lift, steepest sub roll-off below 40 Hz), clean low-mids, **vocal-forward presence** (`2500`/`5000` sit up ~1.5 dB vs flat) and the **brightest extended air** (`10000`–`20000` +2 to +2.5 dB vs flat, widest air corridor). Centre slope 300 Hz→10 kHz = **−5.1 dB/oct** (shallowest of the set — the brightest target).

### 4.6 `afrobeats` — "Afrobeats"
```
OLD   pts:[[20,-16,-6],[40,-10,-2],[90,-7,1],[160,-9,-2],[300,-11,-4],[600,-13,-6],[1200,-15,-8],[2500,-15,-8],[5000,-17,-10],[10000,-20,-12],[16000,-26,-16],[20000,-35,-22]]
v2    pts:[[20,-21,-14],[40,-7,-1],[90,-1.5,3],[160,-5,-1.5],[300,-7.5,-4.5],[600,-11.5,-8.5],[1200,-16,-13],[2500,-23,-19.5],[5000,-30,-26],[10000,-35.5,-31],[16000,-40.5,-35],[20000,-44.5,-38.5]]
v2.1  pts:[[20,-22.5,-12.5],[40,-8,0],[90,-3.25,4.75],[160,-6.75,0.25],[300,-9.5,-2.5],[600,-13.5,-6.5],[1200,-18,-11],[2500,-24.75,-17.75],[5000,-31.5,-24.5],[10000,-37.25,-29.25],[16000,-42.75,-32.75],[20000,-46,-37]]
```
_v2.1 = v2 midpoints, pre-R3 half-widths (§0.1). 20 kHz `lo` clamped at −46 (midpoint held)._
Strong but **tight mid-bass** (log drum + kick around 60–120 Hz — `40`/`90` lifted, `20` rolled off faster than trap), present mids, and a **lively percussive top** (`5000`–`16000` +1 dB vs flat — shakers, log-drum transient). Sits between hip-hop and pop overall.

### 4.7 `lofi` — "Lo-Fi"
```
OLD   pts:[[20,-16,-6],[40,-10,-2],[90,-8,0],[160,-9,-2],[300,-11,-4],[600,-13,-6],[1200,-16,-9],[2500,-19,-12],[5000,-24,-15],[10000,-30,-20],[16000,-38,-27],[20000,-46,-34]]
v2    pts:[[20,-24.5,-18.5],[40,-11,-6],[90,-5.5,-1.5],[160,-6,-3],[300,-5,-2.5],[600,-9,-6.5],[1200,-15,-12.5],[2500,-26,-23],[5000,-36.5,-33],[10000,-43.5,-39.5],[16000,-46,-43.5],[20000,-46,-43.5]]
v2.1  pts:[[20,-26.5,-16.5],[40,-12.5,-4.5],[90,-7.5,0.5],[160,-8,-1],[300,-7.25,-0.25],[600,-11.25,-4.25],[1200,-17.25,-10.25],[2500,-28,-21],[5000,-39.25,-30.25],[10000,-46,-37],[16000,-46,-43.5],[20000,-46,-43.5]]
```
**Reduced sub** (`20`–`90` pulled ~1–2 dB below flat — HPF / vinyl), **midrange-forward "boxy" warmth** (`300`–`1200` sit up 1–2 dB, the defining lo-fi colour — this is the only genre where `300` is *higher* than `160`), presence pulled back, and a **deliberate, deep HF roll** (`2500`–`16000` 3–8 dB darker than flat — tape, vinyl, bit-reduction). Narrowest mid/air corridor — lo-fi is a defined aesthetic, not a wide target. Centre slope 300 Hz→10 kHz = **−7.5 dB/oct** (steepest of the set). `10000`–`20000` sit near the `MIN_DB −48` floor; `lo` is clamped at −46 there with the v2 midpoint held (band asymmetric at those three anchors) — `2500` and below carry the full pre-R3 thickness.

---

## 5. Effect on the readouts — exact, computed from `ozBandDelta()`

`corridorTilt_band = mean(centre, 24 log-steps fLo→fHi) − mean(centre, 48 log-steps 150→3000)`. Meter reading `= mixTilt_band − corridorTilt_band`.

**Everything in this section is identical for v2 and v2.1.** `corridorTilt` is a function of the corridor **centre** `(lo+hi)/2` only (§1.1). v2.1 preserves every anchor's centre exactly, so every number below — every tilt, every reading, the Paypadream prediction — is unchanged by the band-thickness restore. Read "NEW" below as "v2 = v2.1".

### 5.1 Corridor tilt, OLD → NEW (= v2 = v2.1), all 7 genres

| Genre | LOW tilt (20–250 Hz) | MID tilt (250–4 kHz) | HIGH tilt (4–20 kHz) |
|---|---|---|---|
| trap | +6.5 → **+8.7** | −1.1 → **−2.9** | −8.2 → **−22.7** |
| hiphop | +4.6 → **+7.2** | −1.0 → **−3.0** | −8.1 → **−24.1** |
| rnb | +2.8 → **+6.1** | −0.9 → **−3.1** | −7.8 → **−23.7** |
| pop | +0.3 → **+5.1** | −0.6 → **−2.5** | −6.6 → **−20.4** |
| afrobeats | +3.4 → **+6.7** | −0.9 → **−2.7** | −7.8 → **−21.3** |
| lofi | +4.2 → **+3.2** | −1.5 → **−3.2** | −15.4 → **−28.6** |
| flat | +0.3 → **+4.5** | −0.6 → **−2.7** | −7.5 → **−22.5** |

The HIGH tilt moves ~14–15 dB more negative across the board — that is the fix. The LOW tilt barely moves (deliberate — the uncertain parameter). The MID tilt drifts ~2 dB more negative — the structural band-vs-window quirk (Section 1.2 #4 / Section 7).

### 5.2 Kevin's screenshot master (`Paypadream$ (mastered).wav`, genre = trap)

Screenshot read **LOW +8.9 / MID −1.9 / HIGH −13.2** against the OLD `trap` corridor. Working back through §5.1: this master's own tilts are **LOW +15.4 / MID −3.0 / HIGH −21.4**. Against the NEW `trap` corridor:

| Band | Was | **Now** | Reading |
|---|---|---|---|
| LOW | +8.9 | **+6.7** | still bass-hot |
| MID | −1.9 | **−0.1** | on target |
| HIGH | −13.2 | **+1.2** | on target, a hair bright |

**The −13.2 HIGH error was entirely corridor-shape error and is now resolved** — this master's actual HIGH tilt (−21.4) is close to the E&F17 commercial-master mean (−22.5), i.e. its top end is fine. The MID reading also cleans up. The LOW reading stays at +6.7: this master genuinely carries a +15.4 dB low-vs-mid tilt, which is very bass-forward even for trap. Whether that +6.7 is "the corridor should come up" or "this particular master is bass-hot" is the one open question — Section 6.

### 5.3 Constraints confirmed — nothing else breaks

- **Deviation-meter scale (`ozPopulateBands`, ±6 dB).** Meter maths untouched. HIGH-band readings for typical masters shrink from ~−13 to ~0–3, so the HIGH bar pegs its edge far less often. LOW readings are essentially held. MID readings shift ~−2 (see Section 7).
- **Fix Queue `derive()` / `build()`.** `band-*` items still come from `ozBandDelta()` via `over = |delta|−1.5`, `score = over × weight`, `impact high if over>3`. Item shape, dedupe, the `MOVE_PENDING` placeholder, `breakdownData()` and the `aimm:analysis-complete` event all untouched. Magnitudes get smaller and more believable (HF `over` ~11.5 → ~1–3); ranking between spectral bands can shift where two were previously both pegged — the intended outcome.
- **Canvas draw (`refDrawCanvas` / `dbToY` / `MAX_DB` / `Y_TOP_PAD`).** 150–3000 Hz centre-mean held near −11 dB for every genre, so the purple zone's vertical position doesn't jump. **v2.1: the drawn band is back to the pre-R3 thickness** (half-width 3.5 dB through 300 Hz–1.2 kHz, 4–7 dB at the extremes) — v2 had halved it, which Kevin flagged; §0.1. The steeper corridor tops stay inside the canvas; at the few extreme-HF anchors where the v2 curve sits near the `MIN_DB −48` floor (20 kHz all genres; 16 kHz + 10 kHz on hip-hop / lo-fi) the band's lower edge is clamped at −46 with the midpoint held, so it's drawn slightly asymmetric there and no thinner than v2 was.

---

## 6. The one parameter that still needs Kevin's ear — low-band elevation

**What's uncertain:** how far above the 150–3000 Hz mean the corridor's 20–90 Hz shelf should sit, for the bass-forward genres (trap / hip-hop / Afrobeats most).

**Why sources can't close it:**
- E&F17's bass quadratic is unusable as a target (folk-pop-skewed dataset → understates modern rap sub), and the paper itself says LF is the highest-variance region, "deviations of up to around 10 dB are not uncommon," and "deviations below the mean are generally less alarming."
- Practitioner sources agree the sub peak is now 20–50 Hz and a +4–6 dB sub boost is normal, but none give a defensible "raw-LTAS dB above the mids" figure.

**What v2 does:** sets the NEW `trap` low-vs-mid corridor tilt to **+8.7 dB** (up only +2.2 from OLD; flat is +4.5, hiphop +7.2, afrobeats +6.7). This is a *conservative* correction — it does not chase Kevin's one screenshot master to zero (that master would need the trap tilt at ~+15, which would make every normal trap master read several dB light in the bass).

**The crisp question for Kevin — one concrete test:**
> Load 3–5 of your own trusted, finished 808/trap masters through Mix Check with Target = Trap / 808-heavy. Read the **LOW** meter for each and average it.
> - If they average **roughly 0 to +3 dB** → the proposed `trap` low shelf is right, ship as-is.
> - If they average **around +4 to +8 dB "hot"** and you consider those masters correct → raise the `trap` (and by ~2 dB less, `hiphop` / `afrobeats`) `20` / `40` / `90` anchors by that average, and I'll reissue the three tables.
> - If they average **negative** → lower the same anchors.

Everything else in v2 is source-grounded and does not need an ear pass before shipping.

**Minor aesthetic latitude (not blocking — ship, adjust later if wanted):**
1. **Lo-fi HF roll depth** — v2 puts lo-fi ~6 dB darker than flat at 5–10 kHz. Kevin may want it darker still (toward −40 at 10 kHz) or lighter.
2. **R&B corridor width** — v2.1 draws all genres at the uniform pre-R3 thickness (§0.1). If Kevin later wants a *visibly* tighter modern-alt-R&B target, narrow that genre's mid half-widths below 3.5 and lift `2500` ~1.5 dB — cosmetic only, no meter effect.

**Recommended follow-up (post-ship, no code change):** the iZotope-TBC-style "custom target from reference" calibration — run 3–5 trusted references per genre through the analyser, average the LOW/MID/HIGH deviations, shift that genre's anchor groups by the negative of the average. Turns "computed from published data" into "measured from Kevin's references." Worth doing once v2 is in.

---

## 7. Adjacent items — NOT part of this spec, flagged for separate Cat changes

1. **MID meter band vs normalisation window mismatch.** `ozPopulateBands` defines MID as **250–4000 Hz** while `ozBandDelta`'s normalisation window is **150–3000 Hz**. With the correct (steeper) curve, a well-balanced master now reads MID ≈ −2 to −3 dB ("↓ LOW VS TARGET") purely because the band catches the 3–4 kHz roll-off the window doesn't. **1-line fix:** change the MID band in `ozPopulateBands` from `['ozBandMid',250,4000]` to `['ozBandMid',250,3000]` (or widen the norm window to 4000). Not in this spec because it's a `ozPopulateBands` change, not a `REF_CORRIDORS` change — but it's the same class of complaint as #1 and should be queued with it.
2. **`refPopulate()` hard-codes a −8 LUFS / PLR≥7 target regardless of genre** — re-confirmed live at `index.html` `r3-mixcheck-fixes` lines 15612 (`const ld=li-(-8)` → "✓ AT TRAP TARGET") and 15615 (`dr>=7` → "over-compressed" otherwise). A lo-fi or R&B master (published crest 9–14 dB, comfortable at −12…−13 LUFS-I) gets a misleading "over-compressed" / "short" flag. Making these meter targets genre-aware is a separate Cat change. `MC_FIXQUEUE.targetLufsFor()` already maps `{trap:-8, hiphop:-8, rnb:-9, pop:-8, afrobeats:-8, lofi:-12, flat:-14}` — `refPopulate` should read from the same map.
3. **Deviation-meter ±6 dB full-scale.** Very bass-hot masters (like Kevin's screenshot, LOW ~+7 after the re-tune) still sit inside ±6 so this is not urgent, but a genuinely extreme master will peg the LOW bar. Widening to ±9 or ±12 is a `ozPopulateBands` change, out of scope, noted.

---

## 8. Hand-off

- **Owner to implement:** Cat, into `REF_CORRIDORS` in `index.html` on `r3-mixcheck-fixes`, gated on Kevin's approval of this spec (at minimum, his answer to the Section 6 test — but v2.1 can also ship as-is and be trimmed after, since the low shelf is deliberately conservative).
- **Change:** replace only the 7 `pts` arrays with the **v2.1** block (Section 4 code block — v2 curve/midpoints + pre-R3 band thickness, per §0.1). Keep `label` strings and object keys exactly. Bump `AIMM_BUILD`.
- **Delta-math is untouched by v2.1.** If v2 was already implemented and rendered, the swap to v2.1 changes only the drawn purple-zone thickness — every LOW/MID/HIGH reading, `breakdownData().tonalBalanceDeltas`, and the Fix Queue band ranking stay bit-identical (all read the centre only; every centre preserved — §0.1). Cat can verify with a CDP probe: the `ozBandDelta` LOW/MID/HIGH values before vs after the array swap must match to 0.0.
- **Then:** re-render the Mix Check analyser + the 3 deviation meters + a Fix Queue with a WAV loaded, at desktop and mobile width, for Kevin's before/after review (standing rule — rendered, not described). The review point for v2.1 specifically: **the purple corridor band is back to the pre-R3 thickness** (not the thin tapering v2 band). If Kevin still has `Paypadream$ (mastered).wav`, render that one so the numbers can be checked against Section 5.2.
- **Queue separately (Section 7):** the MID-band edge 1-liner, the `refPopulate` genre-aware LUFS/PLR targets, (optionally) the ±6 dB meter scale.
- **Not in this spec:** any `index.html` structural or DSP change; anything in the Hope rail (Markey's).
