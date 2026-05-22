# HANDOVER.md — AIMM

## Current handover point
**Date:** 2026-05-22 (evening session)
**Session:** ingest_yt.py fix + SEIDS back catalogue ingestion

### What was done this session
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

### What is NOT done — first thing tomorrow
Continue channel ingestion — next priority is **Mixing, Mastering & Production** tier.

Process established:
1. Find channel ID via `yt-dlp "ytsearch5:<channel name>" --print "%(channel)s|%(channel_url)s"`
2. Pull video list via `yt-dlp --flat-playlist --print "%(id)s|%(title)s" "<channel_url>/videos"`
3. Seat A curates top 20, Kev confirms
4. Run ingest batch, confirm index count at end

Channels remaining (52 total, 1 done):

**Mixing, Mastering & Production** (do first):
Help Me Devvon, In The Mix, Big Z, Mastering.com, Sean Divine, Hardcore Music Studio, Alex Rome, Nathan James Larsen, Adam Lewis Mixing, Try Karra, Underdog Music Academy, Bthelick, Wayne.wav, London Rain, Arsiney Music, Yaahn Hunter Jr., Produce Like A Pro (Warren Huart)

**Logic Pro & DAW Training** (SEIDS done — remaining):
MusicTechHelpGuy, Why Logic Pro Rules, Jono Buchanan, Sun Dog, imamusicmogul, Logic Pro Life, SF Logic Ninja, KC Sounds, Make Your Music, Constantine_music, Valentina Bilancieri, Charles Cleyn, Beat Making Basics, Busy Works Beats

**Trap/Hip-Hop Specific:**
Jewel Kane, ProducerGrind, Cymatics

**Plugin & Sound Design:**
Streaky, Kush Audio

**Music Business & Marketing** (do last — trim weak ones first):
Smart Music Business, Curtiss King TV, Smart Rapper, BrandMan, Adam Ivy, Music Industry How To, Baywood Media, Bandzoogle, Music Millionaires, Paradym Music Group, Full Stack Creative, JamMob, Pay Us No Mind, K Felon, View Maniac

### Context window cap — still unresolved
`buildYtKbDigest` will need a cap before index gets large. Design this before passing ~100 videos. Flag for Seat A at start of session when index exceeds 50 videos.

### Tomorrow's bootstrap order
1. Read root `CLAUDE.md`
2. Read root `ROADMAP.md`
3. Read this file (`docs/HANDOVER.md`)
4. Confirm oriented with three-bullet summary
5. Begin Mixing/Mastering tier ingestion — Help Me Devvon or In The Mix first
