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

1. EchoJay / DAW Bridge epic — Kevin wants to review ideas and plan integration into AIMM (scoped last session, not started)
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
