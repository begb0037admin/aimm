# OBS → MWTM Tutorials process

This is the canonical process for turning a Mix With The Masters OBS recording
into a labelled tutorial set. It starts after OBS has produced the recording;
the phone/browser playback and OBS controls remain manual because they depend on
the signed-in MWTM session.

**Process lock (updated 2026-09-28, Kevin's explicit decision).** The production
path is one continuous OBS recording followed by a **copy-cut**: the recording's
existing H.264/AAC streams are cut into parts with `ffmpeg -c copy`, with **no
re-encoding**, using `docs/mwtm/mwtm_copycut.py`. It keeps the original OBS
quality and takes seconds instead of an hour, and it keeps the MWTM divider
screens (see section 3). The old re-encode command (section 4, "Fallback") is now
a fallback only, used if a copy-cut cannot be made cleanly. Do not introduce
parallel exports, hardware-encoder settings or a new capture method unless the
user explicitly asks for a process change. `split_mwtm_recording.py` is retained
as history/reference only.

## Desk-to-output checklist

When you are sitting at the desk, use this order:

1. Mount the external disk and set OBS's recording directory to
   `/Volumes/MacStore/AIMM_MWTM_Tutorials/`.
2. Open the signed-in MWTM lesson, turn subtitles off, and put Part 1 at
   `00:00`.
3. In OBS, confirm that the MWTM player is visible, playback audio is being
   captured, and the microphone is muted.
4. Press **Start Recording** in OBS first. Wait for the recording timer, then
   press **Play** on Part 1.
5. Leave the recording running through every part. Let the MWTM divider screen
   (white logo card and/or black) appear between parts; it is the marker used
   for the later split and it is kept in the output. Stop OBS after the final
   part has finished. If you are away from the keyboard and the recording keeps
   running on a blank or logo screen, that is fine: the dead end is trimmed
   afterwards (about 5 seconds are kept).
6. Confirm the timestamped MP4 exists and is no longer growing. Start a code
   session in the AIMM repository and tell it to process the newest OBS
   recording. It should discover the source and inspect existing set records
   before asking you for anything.
7. The session runs `docs/mwtm/mwtm_copycut.py` (dry run first, review the
   divider plan, then `--go`), which cuts the parts without re-encoding, keeps
   the dividers, trims blank ends and writes `FULL.mp4` and the manifest. It then
   verifies every file and reports the output folder. This takes about a minute.

The canonical capture is one continuous OBS take for the complete set. Splitting
happens afterward, so a missed auto-play or a menu screen can be corrected from
the source timeline without recording the lesson again.

## 1. Capture

Save the OBS recording to:

```text
/Volumes/MacStore/AIMM_MWTM_Tutorials/
```

Use a timestamped filename such as `2026-09-22 22-16-45.mp4`. Before recording:

- turn subtitles off;
- open the first lesson part at its beginning;
- keep the MWTM player visible in the OBS source;
- capture playback audio, not the microphone;
- leave enough device power and screen-timeout headroom for the complete set.

The recording must begin before playback starts. Do not rely on auto-playing the
next part unless the continuous take has been checked: MWTM can return to its
Downloads/menu screen between parts.

## 2. Identify the set

Before splitting, record these fields from the MWTM page or the user's metadata:

| Field | Example |
|---|---|
| Kind | `Mixing` or `Production` |
| Track | `Take Me Back To London` |
| Artist | `Ed Sheeran` |
| Engineer | `Jaycen Joshua` |
| Source filename | `2026-09-20 13-14-22.mp4` |
| Part count | `5` |

The canonical folder slug is:

```text
<Engineer>_<Artist>_<Track>_<Kind>
```

Create it under `/Volumes/MacStore/AIMM_MWTM_Tutorials/`. **Every set folder must
contain `FULL.mp4`**: the whole recording with only the dead ends trimmed (about
5 seconds of blank/logo screen kept at each very end), stream-copied, sitting
beside the labelled parts. The original timestamped OBS file is left alone until
Kevin says it can go (he may move it into the set folder himself); the script
never deletes or moves it. Existing sets must never be overwritten or silently
renamed. If a lesson is recorded in two sittings (for example Parts 1 to 3, then
Parts 4 and 5), add the new parts to the same folder and rebuild `FULL.mp4` as one
joined file with a stream-copy concat, not a re-encode.

## 3. Review and mark boundaries

**The MWTM divider screens are kept, not removed** (Kevin, 2026-09-28): they give
a clean visual break instead of a part ending mid-scene. Each cut lands in the
middle of the divider between two parts, so one part ends on it and the next
starts on it. A divider can be the white MWTM logo card, a black screen, or a
white card followed by black; treat both as dividers.

`mwtm_copycut.py` finds them by looking at keyframes only (about one every 2
seconds, so a scan takes seconds): a keyframe with mean luma above about 195
(the logo card measures about 204) or below about 20 (black) is a divider frame,
and nearby divider frames are merged into one run. It then:

- cuts each interior divider at the keyframe nearest its middle;
- keeps a blank/logo lead-in only if it is short, otherwise trims it to about 5
  seconds;
- keeps only about 5 seconds of any trailing blank/logo screen (OBS often keeps
  recording after the last part, or Kevin is away; the trailing card ran 35
  minutes on 2026-09-28);
- refuses to continue if the number of interior dividers is not parts minus one.

Always run the dry run first, read the plan, and check it against the MWTM part
lengths. Do not guess boundaries from the displayed minute labels; they are for
orientation only.

Limits to know: a copy-cut can only start on a keyframe, so a cut can be up to
about 2 seconds off (irrelevant inside a 13 to 20 second divider). If a divider
is shorter than about 4 seconds there may be no keyframe inside it; cut at the
nearest one and tell Kevin.

## 4. Cut labelled parts (copy-cut, no re-encode)

```bash
python3 docs/mwtm/mwtm_copycut.py "/Volumes/MacStore/AIMM_MWTM_Tutorials/<timestamp>.mp4" \
  --parts N --labels "Label_One,Label_Two,..." \
  --kind Mixing --engineer "Full Name" --artist "Artist" --track "Track" \
  --out "/Volumes/MacStore/AIMM_MWTM_Tutorials/<Engineer>_<Artist>_<Track>_<Kind>"
# review the printed plan, then run the same command again with --go
```

**Second recording of the same lesson** (for example Parts 4 and 5 recorded after
Parts 1 to 3): run the same command with `--append --first-part 4` and `--out`
pointing at the EXISTING set folder, with `--parts` and `--labels` for the new parts
only. It adds `Part_04_...` and `Part_05_...`, appends them to `set_manifest.json`,
leaves the existing `FULL.mp4` untouched and writes `FULL_joined.mp4` (the old FULL
plus the new recording, joined by stream copy, no re-encode) beside it. Verify
`FULL_joined.mp4` (duration = old FULL + new segment, playable across the join, first
and last frames), then swap it in for `FULL.mp4` and move the old FULL to the Trash,
only with Kevin's yes. Update `SET_INFO.md` and the set record to list all parts (append mode does not
write those; do it by hand). `nice` may print "setpriority: Operation not permitted"
inside a sandboxed Codex run; it is harmless and the command still runs.
Tested 2026-09-28: a fresh Codex run followed this section from the doc alone (Money
Parts 4 and 5, dry run then `--go`), and Jacob's independent check passed.

It writes `Part_NN_<label>.mp4`, `FULL.mp4` and `set_manifest.json`, refuses to
touch an existing folder, and never deletes or moves the source. Speed on this Mac:
about a minute for a whole set (measured: set of 3 parts, 50 minutes, 56 seconds),
against roughly 1.5 to 1.9 times the content length per part when re-encoding.
Output is the original OBS quality; a re-encode at crf 18 only made files about 2.8
times larger (822 MB vs 297 MB for the same part).

### Fallback: re-encode (only if a copy-cut cannot be made cleanly)

This is the old locked command, one part at a time in the foreground. It is now a
fallback, used only on Kevin's say-so or if the source streams cannot be copied:

```bash
ffmpeg -hide_banner -loglevel error -nostdin -y \
  -ss START -i SOURCE -t DURATION \
  -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -preset fast -crf 18 -threads 4 \
  -pix_fmt yuv420p -c:a aac -b:a 192k \
  -movflags +faststart OUTPUT
```

Replace `START`, `DURATION` and `OUTPUT` for each reviewed part, then wait for
that export to finish and verify it before starting the next one. This keeps
the source audio and video together and produces broadly compatible H.264/AAC
MP4 files. Copy the original OBS recording into the set folder as `FULL.mp4`
after the parts are complete. Do not overwrite an existing good part silently;
use a new filename or explicitly remove the bad output after checking it.

Output names follow:

```text
Part_01_<topic>.mp4
Part_02_<topic>.mp4
```

Use short factual topic labels taken from the MWTM description or the user's
screen capture. Do not invent content from an unreviewed transcript.

## 5. Verify

For every part, verify that:

1. `ffprobe` can read the file;
2. both the video and audio streams are present (H.264 3504x1970 + AAC);
3. the duration equals the planned range, and the parts add up to the size of
   `FULL.mp4`;
4. the first and last frame of each part are lesson content or a divider screen
   (white logo card / black), never a cut-off scene;
5. the first frame of Part 1 and the last frame of the last part are not a long
   blank: only about 5 seconds of dead end are kept;
6. `FULL.mp4` exists in the folder and the original recording is untouched.

Look at the frames (extract them and view them); do not rely on the durations
alone. If a part is wrong, re-run into a new folder or explicitly remove the bad
output after checking it. Never replace a good capture automatically. The old
`split_mwtm_recording.py` helper remains for reference only.

## 6. Transcript/AIMM handoff

Splitting is complete when the labelled MP4 set and manifest verify. The later
knowledge-base stage is separate:

```text
set manifest + MP4 parts
→ speech-to-text transcript with timestamps
→ cleaned AIMM Markdown chunks
→ AIMM docs/knowledge index and search index
→ Hope can search the lesson
```

Keep the raw timestamped transcript beside the set. The AIMM import must use the
same metadata and chunk format as the YouTube ingestion path; local MP4s should
not become a parallel knowledge system.

## Code-session handoff

The normal cold start is one sentence:

```text
Process the newest OBS recording using the AIMM MWTM workflow. Read
docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md first. Preserve existing work and do not
transcribe or import into AIMM unless I ask.
```

The session must then:

1. find the newest `.mp4` under `/Volumes/MacStore/AIMM_MWTM_Tutorials/`;
2. confirm that the file is complete and readable with `ffprobe`;
3. check existing manifests and set folders for a matching source before doing
   any work;
4. recover the lesson title, engineer, artist, kind and part labels from the
   recording, existing notes and the current session context where possible;
5. ask one concise question containing only the metadata that genuinely cannot
   be recovered;
6. run `mwtm_copycut.py` (dry run, review the divider plan, then `--go`) and verify
   the outputs by looking at the frames.

Do not make the operator fill in a template or repeat metadata already visible
in the recording, notes or conversation. If a source is missing or ambiguous,
stop before exporting and explain the single blocker.

For a session that already has the details, these are the available fields:

1. the source MP4 path;
2. the engineer, artist, track and kind;
3. the part count and topic labels;
4. reviewed source-time boundaries, if already known;
5. whether the source has already been split.

The session should read this file first, inspect existing outputs, preserve all
good work, and report any missing metadata instead of guessing. For media work,
the session should use `mwtm_copycut.py` (section 4); the re-encode command is a
fallback only, and no overlapping exports are ever run.

## Jacob-coordinated route (standing since 2026-09-28)

Kevin's normal entry point is Jacob (his coordinator), not a bare code session.
Kevin says something like "let's do our Mix with the Masters recordings", pastes
the lesson title/URL and a screenshot of the part list, and Jacob runs the
`mwtm-recordings` skill (global, `~/.claude/skills/mwtm-recordings/SKILL.md`).
The split of work:

| Who | Does |
|---|---|
| Kevin | Records in OBS; pastes the MWTM title/URL and part-list screenshot. Nothing else. |
| Jacob | Pre-flight checks, turns the screenshot into **text**, runs `mwtm_copycut.py` (dry run, review, `--go`), verifies the result by looking at the frames, writes the set record, reports. |
| Codex | Not needed for the normal path (the copy-cut takes about a minute). Used only for the re-encode fallback, or when Kevin asks for it, with a **text-only** brief. |

Rules for this route:

1. **Text in, never screenshots forwarded.** Jacob reads the engineer, artist,
   track, kind and the *full* description of every part off Kevin's screenshot/URL
   and works from text. Part labels come from those descriptions.
2. **Never guess truncated descriptions.** MWTM's part list cuts long
   descriptions with an ellipsis. If cut off, get the full text from Kevin before
   cutting; the labels go into filenames.
3. **The MWTM site is behind a Cloudflare bot check.** Scripted fetches return 403
   and must not be worked around. Kevin's own browser reads it; the screenshot
   text is the reliable source.
4. **Newest *finished* recording only.** Check OBS is no longer writing the file
   (`lsof`, stable size/mtime; OBS may still be open, which is fine). Kevin often
   starts the next recording straight away; never touch the in-progress file.
5. **Check the recording matches the page.** Add up the MWTM part lengths and
   compare with the recording. If the recording holds fewer parts than the page
   lists (Money on 2026-09-28: Parts 1 to 3 of 5), say so before cutting and ask
   whether the rest will be recorded separately. Do not guess.
6. **Dividers are kept; dead ends are trimmed** (section 3). White logo card and
   black screens both count. About 5 seconds of a blank/logo lead-in or trailing
   card is kept, no more.
7. **Every set folder has `FULL.mp4`** (section 2). A lesson recorded in two
   sittings gets one joined `FULL.mp4` by stream-copy concat.
8. **Never overwrite or delete.** The script refuses an existing folder. Replacing
   a set (for example swapping an old re-encoded set for a copy-cut one) needs
   Kevin's explicit yes, and the old folder goes to the Trash, not `rm`.
   Originals are only moved or deleted when Kevin says so.
9. **Jacob verifies by looking.** `ffprobe` each file and view the first and last
   frame of every part (section 5). Do not rely on durations alone.
10. **No stray background work.** If a Codex fallback re-encode is used, only one
    export runs at a time and leftover helper loops are killed (they compete for
    CPU). Recording the next lesson in OBS at the same time slows an encode.
11. **Records.** Each finished set gets `SET_INFO.md` and `set_manifest.json` in
    its folder and a record in `docs/mwtm/sets/<slug>.md` (same shape as the
    Teezio one), and the docs change is committed to this repo.

History worth knowing (2026-09-28, first runs): the re-encode path took 1.5 to
1.9 times the content length per part (46 minutes for one 21-minute part), and two
Part 2 start estimates were 5 to 7 seconds early and each cost a wasted full
encode. Copy-cut removed both problems. The set records under `docs/mwtm/sets/`
carry the per-set detail.

Still out of scope unless Kevin asks: transcript generation and AIMM
knowledge-base import.

## Cold-start trigger

If the user says:

> Let's work on OBS videos and just notes.

Treat that as a request to load this process and work in **OBS tutorial notes
mode**. In this mode:

- read this process before taking action;
- inspect any supplied recording path, screenshot or metadata;
- maintain the set notes, manifest and part labels;
- do not start transcription or AIMM knowledge-base import unless the user asks;
- do not claim a recording was split when the source file is not accessible;
- ask only for the missing source path or metadata needed for the next concrete
  step.

The process document can be read from the AIMM repository at
`docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md`, so discussing the workflow does not
require mounting the external tutorials disk. The disk (or another accessible
copy of the MP4) is required only when inspecting or exporting media.
