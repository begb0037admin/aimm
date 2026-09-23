# OBS → MWTM Tutorials process

This is the canonical process for turning a Mix With The Masters OBS recording
into a labelled tutorial set. It starts after OBS has produced the recording;
the phone/browser playback and OBS controls remain manual because they depend on
the signed-in MWTM session.

**Process lock.** Keep this workflow stable. The working production path is one
continuous OBS recording followed by a reviewed, sequential set of direct
`ffmpeg` exports. Do not introduce a new splitter, parallel exports, background
scans, hardware-encoder settings or a new capture method unless the user
explicitly asks for a process change. The existing helper script is retained as
history/reference, but it is not the canonical production path.

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
5. Leave the recording running through every part. Let the black MWTM
   transition/menu screen appear between parts; it is the marker used for the
   later split. Stop OBS after the final part has finished.
6. Confirm the timestamped MP4 exists and is no longer growing. Start a code
   session in the AIMM repository, read this document, and give the session the
   MP4 path plus the engineer, artist, track, kind, part count and topic labels.
7. The code session reviews the transition times, creates the manifest, exports
   the parts one at a time with the established command below, verifies them,
   and reports the output folder.

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

Create it under `/Volumes/MacStore/AIMM_MWTM_Tutorials/`. Preserve the original
timestamped OBS file at the tutorials root and copy it into the set folder as
`FULL.mp4`, which is the canonical source beside the labelled parts. Existing
sets must never be overwritten or silently renamed.

## 3. Review and mark boundaries

Review the source video around every transition. A new part begins after the
black/blank MWTM transition screen and its slate; the slate itself is not part
of the tutorial content. Record source-time `start` and `end` values in a JSON
manifest. The first part normally starts after the opening slate; the final
`end` is the last content frame before the trailing slate.

Do not guess boundaries from the displayed minute labels. They are useful for
orientation only. Use the actual source timeline and check the first and last
frames of every exported part.

## 4. Export labelled parts

Use the established direct `ffmpeg` export, one part at a time in the
foreground. Use the reviewed source-time ranges from the manifest. The gaps
between ranges are deliberate: they remove the MWTM menu/slate screens.

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
2. both the video and audio streams are present;
3. the duration is plausible against the marked boundary;
4. the first frame is the part's opening content, not the menu/slate;
5. the last frame is content, not the next transition slate.

If a part is wrong, adjust its manifest boundary and export it to a new
filename or after explicitly removing the bad output. Never replace a good
capture automatically. The old `split_mwtm_recording.py` helper remains in the
repository for reference only; do not switch the production path back to it
without an explicit process decision.

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

When starting a new code session, provide:

1. the source MP4 path;
2. the engineer, artist, track and kind;
3. the part count and topic labels;
4. reviewed source-time boundaries, if already known;
5. whether the source has already been split.

The session should read this file first, inspect existing outputs, preserve all
good work, and report any missing metadata instead of guessing. For media work,
the session should use the direct sequential `ffmpeg` command in section 4 and
must not substitute a new tool or run overlapping exports.

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
