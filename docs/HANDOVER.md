# HANDOVER.md — AIMM

---

## ⚠️ SEAT ROLES — READ THIS FIRST, EVERY SESSION

This project uses three Claude seats. Each has a defined role. Do not skip this.

| Seat | Where | Role |
|---|---|---|
| **Seat A (Project)** | claude.ai Project conversation | Research, curation, planning, decisions. Reads all docs on cold-start. Issues briefs to other seats. |
| **Cowork** | Claude desktop app, Cowork mode | File execution only. Runs scripts, edits files, commits. Acts when issued a 🟡 COWORK BRIEF by Seat A. |
| **Chrome** | Claude in Chrome | Browser tasks only. Acts when issued a 🔴 CHROME BRIEF by Seat A. |

**Seat A is the conductor.** Cowork and Chrome do not self-direct — they wait for a brief.

**Failover chain:** If Seat A (Project) hits its usage cap mid-session, Kev moves to Adam (Work2) in Cowork mode, which covers the full session. Cowork will flag when it's operating in failover mode.

**How to hand off to Cowork:** At the end of your curation work, issue a 🟡 COWORK BRIEF in this format:

```
🟡 COWORK BRIEF

Task: [what to do]
Files to edit: [list]
Commands to run: [exact commands]
Expected outcome: [what success looks like]
```

Cowork has the AIMM folder mounted at `~/Documents/Claude/Artifacts/aimm` and can run bash commands. It will confirm completion and report any errors back to you.

---

## Current handover point

**Date:** 2026-06-04 (Seat C: Cowork — P0 billing fix shipped, dashboard tile parser in progress)**
**Status:** P0 SHIPPED. Dashboard tile parser fix next.

### What shipped this session

- **P0 billing fix** — root cause was accidental single-tap starts on the sphere. Double-tap guard added to `micStartFromFloat()`: first tap arms sphere (500ms visual flash), second tap within 500ms starts the session. Single taps silently do nothing. `sendContextualUpdate` tab-change notifications also debounced at 30s. Committed `dcd9ef7`.

### Next task — dashboard tile parser fix

`DASHBOARD.html` tile counts (Backlog, Dashboard TODOs, Open Bugs, Shipped) are wrong because the JS `parseRoadmapCounts()` function looks for section headings from the old root `ROADMAP.md` format, not the active `docs/ROADMAP.md`. Fix: update section name strings in `parseRoadmapCounts()` to match actual headings in `docs/ROADMAP.md`. Only edit `DASHBOARD.html`. Effort: ~20 mins.

---

## Previous handover point

**Date:** 2026-05-26 evening (Seat C: Cowork — Hope sphere v3 Three.js, NOT YET CONFIRMED)**
**Session:** Hope sphere v3 mockup build — Three.js WebGL particle orb

**Date:** 2026-05-27 evening
**Status:** Hope sphere v3 THREE.js — LIVE on GitHub Pages (https://begb0037admin.github.io/aimm/)

### Working practice — PERMANENT

Kev works against the live GitHub Pages URL at all times:
https://begb0037admin.github.io/aimm/

Never direct Chrome to local `file://` paths or `docs/mockups/` paths.
All smoke testing and verification uses the live URL only.
Mockup files in `docs/mockups/` are design references for Seat A — they are never opened directly for testing.

### What the current v3 contains

- **Three.js r128** from cdnjs — WebGLRenderer, alpha:true, 300×300 canvas
- **5000 fibonacci sphere particles** (surface, radius 1.0) + **800 inner glow** (radius 0.40) — both ShaderMaterial + AdditiveBlending
- **Fresnel atmosphere**: BackSide SphereGeometry(1.22), rim = `pow(1-dot(N,V), 2.2) * uGlow`
- **Core bead**: MeshBasicMaterial + AdditiveBlending, r=0.055, pulses in speaking state
- **6 animated states** (idle/listening/speaking/thinking/emphatic/happy) with smooth lerp transitions
- **State buttons + reference cards** (CSS gradient orbs, not extra WebGL contexts)
- **GLSL is strictly ASCII** — all shader source is `['line',...].join('\n')` arrays. This was the root cause of every black-screen failure in v1/v2.

### Visual upgrades to apply next session (before showing Kevin)

Adobe Stock reference search confirmed the target aesthetic. These are the improvements to make before asking Kevin for sign-off:

1. Canvas `SIZE` 300 → 420px
2. Surface particles 5000 → 12000
3. Add spray layer: 500 particles at radius 1.06–1.14, `uPx: 80`
4. Fragment shader: `pow(vBr, 1.3)` on the alpha for sharper bright/dark band contrast
5. `.stage` CSS: `background: radial-gradient(ellipse 60% 50% at 50% 50%, #00e5ff0a 0%, transparent 70%)`
6. Idle state: very slow heartbeat pulse (0.08Hz) on core opacity

### NOT committed

Nothing was committed this session. When Kevin approves the sphere mockup, the end-of-session commit should cover everything outstanding from the prior session too:

```bash
cd ~/Documents/Claude/Artifacts/aimm
git add index.html docs/HANDOVER.md docs/mockups/ CLAUDE.md
git commit -m "feat(hope-sphere): Three.js WebGL particle orb mockup v3 + prior session mix-check tab rename"
git push origin main
```

### Smoke test results (2026-05-27 evening)
1. **open_dashboard** — FAIL. Hope says "still not connecting — that tool isn't connecting right now." Switch level fix committed but not yet confirmed working. First task tomorrow: verify the fix landed correctly and re-test.
2. **read_doc docs/ROADMAP.md** — FAIL. Hope still falling back to root ROADMAP.md or offering read_doc as alternative. Enum and whitelist updated and re-registered but not yet smoke tested clean.
3. **Hope/You label colours** — PARTIAL. Changes applied and committed, live app not yet verified.
4. **User bubble purple** — PARTIAL. Applied and committed, live app not yet verified.
5. **Sphere flash** — PASS. Confirmed fixed during session.
6. **Sphere colours** — PASS. Confirmed electric violet idle, emerald green speaking.

### First tasks tomorrow (in order)
1. Hard refresh live app, verify Hope/You labels and user bubble colour
2. Ask Hope "Can we look at the roadmap together?" — verify open_dashboard fires and opens tab
3. Ask Hope "What's in the P1 backlog?" — verify read_doc hits docs/ROADMAP.md
4. If open_dashboard still fails — Seat A to inspect switch structure again before any further briefs
5. Once smoke tests pass — move to remaining P-A work (threshold pills + manual override)

---

## Previous handover point (2026-05-26 session start)

**Date:** 2026-05-26 (session 6 — Seat C: Cowork)**
**Session:** P-A partial + Hope sphere design sprint

### What shipped this session (committed to main)

- **Tab rename:** `data-label="Reference"` → `data-label="Mix Check"`, span text updated in `index.html`
- **Reference Guides removed:** Frequency Map card + Stereo Width by Band card deleted from `#eq` in `index.html`
- **Seat map updated:** `docs/CLAUDE.md` seat map rewritten to Seat A/B/C/D naming; `CLAUDE.md` session headers updated to match
- **Mockups updated:**
  - `docs/mockups/mix-check-pills.html` — FabFilter gaussian island spectral renderer applied (replaces old simple gradient fill); canvas height 140px, background #0d1117
  - `docs/mockups/ab-ref-v2.html` — New file. Side-by-side A and B layout; separate spectral canvas per side with FabFilter gaussian island renderer; four independent metric cards per side; getDisplayMedia tab-audio capture for B slot; ACRCloud fingerprinting noted for auto-track-name; Hope commentary section
  - `docs/mockups/hope-sphere-v2.html` — **REJECTED** (see below). Do not use as reference.

### Commit state

`index.html` tab rename + Reference Guides removal are committed. All mockup files above are written to disk but **not yet committed**. End-of-session commit should include:

```bash
cd ~/Documents/Claude/Artifacts/aimm
git add index.html docs/HANDOVER.md docs/mockups/
git commit -m "feat(mix-check): rename tab, remove Reference Guides, update mockups (FabFilter spectral + A/B Ref v2)"
git push origin main
```

---

### ⚠️ SINGLE TASK FOR NEXT SESSION — Hope sphere mockup (GLSL WebGL)

**Previous mockup `hope-sphere-v2.html` was rejected.** It used Canvas 2D Lissajous parametric ribbon curves — too stylised, not realistic enough. Kevin explicitly said "This is nothing like the screenshot I gave you."

**Visual reference:** Adobe Stock asset ID `1883051794` — *"Glowing red plasma sphere forming from darkness and fading out, dynamic flowing light surface, futuristic energy orb animation, seamless loop, 4K 60fps."* The sphere IS the plasma — the surface churns organically, emerges from black space, has deep volumetric glow. No solid boundary. Ultra-realistic.

**Agreed approach: GLSL WebGL volumetric plasma shader** — single HTML file, no library needed.

**Technical spec:**

```
Canvas: <canvas> with WebGL context { alpha: true }
Clear colour: (0, 0, 0, 0) — fully transparent
Position: fixed, draggable (same principle as current floating mic button)
Size: ~200×200px canvas

Vertex shader:
  - Full-screen quad (two triangles)
  - Passes UV coordinates to fragment shader

Fragment shader:
  1. Compute ray direction from UV (simple ortho or slight perspective)
  2. Ray-sphere intersection test (sphere at origin, radius 0.9)
  3. If miss → discard (transparent pixel)
  4. If hit → raymarch inside sphere (12–16 steps along ray)
     - At each step: sample FBM noise at (worldPos + uTime * uSpeed)
     - FBM = 4 octaves, each octave: value noise or hash-based gradient noise
     - Domain-warp the noise (warp input pos by another noise pass first)
     - Accumulate emission density: density += fbm(pos) * stepSize
  5. Fresnel rim glow: pow(1.0 - dot(normal, viewDir), 3.0)
     - Normal = point on sphere surface at ray entry
     - Adds bright rim that fades to transparent at edge
  6. Final colour: mix(uColor1, uColor2, fbmValue) * density + fresnel * uColor1
  7. Alpha: clamp(density * 2.0 + fresnel * 0.6, 0.0, 1.0)
  8. Simple reinhard tone-map: col / (col + 1.0)

Uniforms:
  - uTime (float) — updated each rAF
  - uResolution (vec2)
  - uColor1 (vec3) — primary plasma colour
  - uColor2 (vec3) — secondary/accent colour
  - uSpeed (float) — noise animation speed
  - uAmplitude (float) — 0.0–1.0, scales plasma churn for speaking state
  - uRainbow (float) — 0.0 or 1.0, enables hue-cycle for happy state
```

**State configs (buttons in mockup, uniforms only — no shader recompile):**

| State | uColor1 | uColor2 | uSpeed | Notes |
|---|---|---|---|---|
| idle | `#00e5ff` (teal) | `#7c3aed` (purple) | 0.3 | slow drift |
| listening | `#22d3ee` (cyan) | `#3b82f6` (blue) | 0.6 | medium pulse |
| speaking | `#a855f7` (purple) | `#ec4899` (pink) | 1.2 | uAmplitude oscillates via sin(time) |
| thinking | `#1d4ed8` (deep blue) | `#e2e8f0` (near-white) | 0.2 | slow, compressed warp |
| emphatic | `#f59e0b` (amber) | `#f97316` (orange) | 0.7 | grounded warm pulse |
| happy | rainbow | rainbow | 1.5 | uRainbow=1 → hsl(uTime*55, 100%, 70%) in shader |

**Mockup requirements:**
- Save as `docs/mockups/hope-sphere-v3.html` (v2 is the rejected one)
- Dark panel background behind the canvas so Kevin can judge transparency (e.g. a dark gradient div)
- State switcher buttons below the canvas
- Canvas itself transparent — the dark background shows through it
- Draggable canvas (mousedown + mousemove + mouseup)
- Static label showing current state name

**Do NOT touch `index.html`** — mockup only. Integration happens in a later session once Kevin approves the visual.

---

### Remaining P-A work (after sphere mockup approved)

Two sub-tasks of P-A not yet done:
1. Mix Issues symptom pills section — auto-highlight from WAV analysis thresholds (spec in `docs/ROADMAP.md` P-A)
2. Editable manual override input on each meter card

### P-C, P-B, P-E

Not started. Order: P-C (retire Repair tab) → P-B (build A/B Ref tab) → P-E (new Hope tools).
Specs in `docs/ROADMAP.md`. Mockup for P-B: `docs/mockups/ab-ref-v2.html` (approved).
Mockup for P-D: pending approval of `hope-sphere-v3.html` this session.

---

## Previous handover point

**Date:** 2026-05-24 (session 5)
**Session:** Smoke test + KB pipeline fixes + TheCosmicAcademy ingestion

### What was done this session

- Full 15-question smoke test run against Hope — identified KB never firing (0/15 hits)
- Root cause 1: buildResearchDigest() early-exit when no active KB notes — YT digest never reached Hope
- Root cause 2: .nojekyll missing — GitHub Pages was 404ing all .md transcript files via Jekyll processing
- Root cause 3: KB trigger language too conservative — "clearly relevant" causing Hope to skip KB
- All three fixed and verified — retest showed 6/6 KB hits, Hope citing video titles and channels unprompted
- Added 28-topic YouTube topic index to RT_INSTRUCTIONS
- Ingested 18 TheCosmicAcademy videos — KB now at 241 videos
- ~/bin/ingest wrapper script installed and on PATH
- Ingest Video.command double-click launcher created at repo root
- docs/INGEST.md created — full two-path ingestion protocol
- Both branches at 952a37d, GitHub Pages live

### ⚠️ IMMEDIATE NEXT SESSION TASKS

1. DAW Bridge Epic — first priority next session. Three phases scoped 2026-05-24, inspired by EchoJay plugin review:
   PHASE 1 — Plugin Scan (companion JUCE plugin, Cowork builds)
   - Lightweight VST/AU/AAX companion plugin
   - Single function: scan DAW plugin list → export aimm-plugins.json
   - User drops JSON into AIMM → Hope confirms library update
   - Existing manual/screenshot/voice input kept as fallbacks
   PHASE 2 — AIMM Import Handler (index.html)
   - "Sync from DAW" button on Library or Settings tab
   - JSON drop/import handler
   - Merges with existing plugin library, no duplicates
   PHASE 3 — Audio Capture Bridge
   - Plugin captures snippet during DAW playback
   - Sends LUFS, spectrum, dynamics to AIMM via local WebSocket
   - Hope advises based on actual signal data
   - Reference track comparison (à la EchoJay compare feature)
   SESSION 6 START: assess whether Cowork can build the JUCE
   plugin for Phase 1, or if an alternative approach is needed
   (e.g. Logic Pro script, DAW export workaround). Scope Phase 1
   fully before touching index.html.
2. Add TheCosmicAcademy videos to the YOUTUBE TOPIC INDEX in RT_INSTRUCTIONS (18 new videos not yet in the topic map)
3. YouTube citation links — Hope should surface clickable YouTube URLs when citing a video, not just title and channel
4. Branch strategy — stop working on voice-elevenlabs separately, consolidate to main only
5. Continue KB ingestion — Logic Pro & DAW Training tier (14 channels remaining)

### ⚠️ Commit reminder

index.html has no uncommitted changes. All clean.

### Remaining Mixing/Mastering channels (12 of 15) — superseded

### Remaining Mixing/Mastering channels (12 of 15)

| Channel | URL | Notes |
|---|---|---|
| ~~Alex Rome~~ | ~~`https://www.youtube.com/@AlexRome`~~ | ~~Hip-hop/beat mixing — skip EDM~~ — ✅ 12 ingested (index 116→127) |
| ~~Nathan James Larsen~~ | ~~`https://www.youtube.com/channel/UC3JgLB0Jw2KwXg0OAXS4rng`~~ | ~~Home studio mixing~~ — ✅ 12 ingested (index 127→139) |
| ~~Adam Lewis Mixing~~ | ~~`https://www.youtube.com/channel/UCSA5LGpNaob5kajkhaBTbrQ`~~ | ~~Hip-hop before/afters — high value~~ — ✅ 20 ingested (index 139→159) |
| ~~Try Karra~~ | ~~`https://www.youtube.com/channel/UCLwDLGL3Ejqu-xJp57CptRg`~~ | ~~Pop vocal — evaluate carefully~~ — ✅ 8 ingested (index 159→167) |
| ~~Underdog Music Academy~~ | ~~`https://www.youtube.com/channel/UC1sxbxdkwQKWV5YUzDVftcA`~~ | ~~Verify content first~~ — ⛔ Skipped — techno/modular/eurorack only, zero hip-hop relevance |
| ~~Bthelick~~ | ~~(search YouTube)~~ | ~~House/EDM — likely skip~~ — ⛔ Skipped |
| ~~Wayne.wav~~ | ~~(search YouTube)~~ | ~~High value — pick freely~~ — ⏸ Deferred (needs evaluation) |
| ~~London Rain~~ | ~~(search YouTube)~~ | ~~Likely artist — verify then likely skip~~ — ⛔ Confirmed artist, skipped |
| ~~Arsiney Music~~ | ~~(search YouTube)~~ | ~~Artist not tutor — skip~~ — ⛔ Skipped |
| ~~Yaahn Hunter Jr.~~ | ~~(search YouTube)~~ | ~~High value — pick freely~~ — ✅ 15 ingested |
| ~~Produce Like A Pro~~ | ~~`https://www.youtube.com/@ProduceLikeAPro`~~ | ~~Warren Huart — pick mixing-specific only~~ — ✅ 20 ingested |
| ~~Hardcore Music Studio~~ | ~~`https://www.youtube.com/channel/UCb-ISKOACgJCOtQ9vO_99QQ`~~ | ~~Rock/metal — trim to mixing principles only~~ — ⏸ Deferred |

### ⚠️ Commit reminder — index.html still uncommitted

`index.html` (buildYtKbDigest 6000-char cap) remains in working tree. Commit alongside next batch.

### ⚠️ Ingestion process — ALWAYS follow this going forward

**Pre-flight checklist (Kev must do before every batch):**
1. Connect VPN (fresh IP — home IP may still be rate-limited)
2. Have `cookies.txt` present at `~/Documents/Claude/Artifacts/aimm/cookies.txt`
3. Test a single video first before running the full batch

**Command template for every future ingestion run:**

Single video:
```bash
cd ~/Documents/Claude/Artifacts/aimm
python3 scripts/ingest_yt.py "https://www.youtube.com/watch?v=<VIDEO_ID>" \
  --channel "Channel Name" \
  --cookies cookies.txt \
  --delay 5
```

Batch (multiple videos — ALWAYS use this for 2+ videos):
```bash
cd ~/Documents/Claude/Artifacts/aimm && for vid in ID1 ID2 ID3 ID4; do python3 scripts/ingest_yt.py "https://www.youtube.com/watch?v=$vid" --channel "Channel Name" --cookies cookies.txt --delay 5; done
```

Replace `ID1 ID2 ID3` etc with the video IDs to ingest. Seat A always issues the batch command — never a list of individual commands. This is the default ingestion method for all future sessions.

**Important**: Always pass full YouTube URLs, not raw video IDs. Always include `--channel`, `--cookies`, `--delay 5`.

### Cowork sandbox constraint — permanent

Cowork **cannot** run `ingest_yt.py` against YouTube (sandbox proxy blocks all YouTube traffic — 403 Forbidden). This is permanent.

**Full ingestion process:**

1. **Seat A** finds channel URL via web search
2. **Kev** runs in his terminal: `yt-dlp --flat-playlist --print "%(id)s|%(title)s" "<channel_url>/videos" 2>/dev/null` — pastes output to Seat A
3. **Seat A** curates top 20, Kev confirms
4. **Seat A** issues ingest commands for Kev to run in his terminal (VPN on, cookies.txt present)
5. **Cowork** updates HANDOVER.md + STATUS.md after Kev confirms success

> ℹ️ **Failover mode (Seat A capped):** Cowork acts as conductor. Kev still runs ingestion commands in his own terminal. Cowork updates docs after Kev pastes success output. If Cowork also caps, move to next seat in chain.

### Remaining channels after this batch (42 total — Mixing/Mastering 12 + others):

**Mixing/Mastering** (12 remaining — see Current handover point above)

**Logic Pro & DAW Training** (SEIDS done — 14 remaining):
MusicTechHelpGuy, Why Logic Pro Rules, Jono Buchanan, Sun Dog, imamusicmogul, Logic Pro Life, SF Logic Ninja, KC Sounds, Make Your Music, Constantine_music, Valentina Bilancieri, Charles Cleyn, Beat Making Basics, Busy Works Beats

**Trap/Hip-Hop Specific:**
Jewel Kane, ProducerGrind, Cymatics

**Plugin & Sound Design:**
Streaky, Kush Audio

**Music Business & Marketing** (do last — trim weak ones first):
Smart Music Business, Curtiss King TV, Smart Rapper, BrandMan, Adam Ivy, Music Industry How To, Baywood Media, Bandzoogle, Music Millionaires, Paradym Music Group, Full Stack Creative, JamMob, Pay Us No Mind, K Felon, View Maniac

---

## Bootstrap order for Seat A (every session)

1. Read root `CLAUDE.md`
2. Read root `ROADMAP.md`
3. Read this file (`docs/HANDOVER.md`) — especially the ⚠️ SEAT ROLES section at the top
4. Read `docs/STATUS.md`
5. Confirm oriented with three-bullet summary
6. Check: is index.json over 50 videos? If yes, flag context window cap issue before starting ingestion.
7. Begin work — ask Kev to run terminal commands where needed

---

## Previous handover — 2026-05-22 (evening)

**Session:** ingest_yt.py fix + SEIDS back catalogue ingestion

### What was done
- Rename sweep: confirmed complete by Kev — all phases done
- `ingest_yt.py` fix: `update_index()` function added — now auto-upserts entry into `docs/knowledge/index.json` after every ingestion. Idempotent re-ingestion confirmed working.
- `today` pulled up to `main()` and passed into both `write_markdown()` and `update_index()`
- index.json structure confirmed as `{"videos": [...]}` — update_index() reads/writes `data["videos"]` correctly
- SEIDS back catalogue: 20 videos ingested, index at 20 videos, zero errors
- yt-dlp PATH fix: added `$HOME/Library/Python/3.9/bin` to `~/.zshrc` — permanent

### SEIDS — 20 videos ingested

| Video ID | Title |
|---|---|
| 6WPtHxWkY2k | Logic Pro 101: Beginner's Guide (previously ingested) |
| 86BqtxsJWnI | Melodyne in Logic Pro 101: Beginner Guide |
| VZtH4_Z7gos | 3 Easy Ways to Create Bass In Logic Pro |
| K6fC7VBBj_o | Create a Stutter Effect in Logic (Using ONLY Stock Plugins) |
| JPKUpYrnXQs | Melodyne Is $99–$700… Logic Pro Has This Free |
| 0ITnE9QmgKs | How to Produce a Demo in Logic Pro |
| YRvSLQwVG7g | Free Logic Pro Plugins You're Sleeping On |
| gQ2dTLPbOks | 5 Logic Pro Automation Tricks You NEED to Try |
| RfR-0M7YoFM | How to Write Beautiful Chord Progressions in Logic Pro |
| YljiLCUs4Kc | How I Turned a 4-Bar Loop Into a Full Song |
| jBJh9Sn2RSE | Make INSANE Sounds in Logic Pro (No Plugins Needed) |
| phuwWWSWrDY | Most Producers Have NO Idea These Logic Pro Features Exist |
| zpyJFmx9NAU | You're Not Using Logic Pro Correctly |
| sxvAhaqQ5Ew | Every Producer Should Try THIS Daily Exercise |
| 8C837VYG1ws | 3 Ways to Create Chords in Logic Pro |
| p0bnk53H5hc | Secret Logic Pro Shortcuts That Will Save You HOURS |
| Nsn_koz9tVI | Logic Pro Tricks EVERY User Should Know NOW! |
| iAXC61dcGBg | Set Up the Ultimate Logic Pro Template |
| T9cjd8EElKs | This Logic Pro Workflow Changed My Life! |
| ccnq0qay7Fs | Writer's Block? Use These Logic Pro Song Starters |
