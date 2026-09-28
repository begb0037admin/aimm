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
   session in the AIMM repository and tell it to process the newest OBS
   recording. It should discover the source and inspect existing set records
   before asking you for anything.
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
6. review the slate boundaries, export sequentially and verify the outputs.

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
the session should use the direct sequential `ffmpeg` command in section 4 and
must not substitute a new tool or run overlapping exports.

## Jacob-coordinated route (standing since 2026-09-28)

Kevin's normal entry point is Jacob (his coordinator), not a bare code session.
Kevin says something like "let's do our Mix with the Masters recordings", pastes
the lesson title/URL and a screenshot of the part list, and Jacob runs the
`mwtm-recordings` skill (global, `~/.claude/skills/mwtm-recordings/SKILL.md`).
The split of work:

| Who | Does |
|---|---|
| Kevin | Records in OBS; pastes the MWTM title/URL and part-list screenshot. Nothing else. |
| Jacob | Pre-flight checks, turns the screenshot into **text**, dispatches Codex, monitors, verifies the result independently, reports. |
| Codex (`codex exec`) | Reviews slate boundaries, exports each part sequentially with the locked `ffmpeg` command in section 4, writes the manifest, `SET_INFO.md` and the set record. |

Rules for this route:

1. **Text only to Codex.** Jacob extracts the engineer, artist, track, kind and
   the *full* description of every part from Kevin's screenshot/URL and sends
   plain text. No images. Codex builds the `Part_NN_<Topic_Words>.mp4` labels from
   those descriptions.
2. **Never guess truncated descriptions.** MWTM's part list cuts long
   descriptions with an ellipsis. If cut off, get the full text from Kevin
   before dispatching; do not dispatch with partial text.
3. **The MWTM site is behind a Cloudflare bot check.** Scripted fetches return
   403 and must not be worked around. Kevin's own browser reads it; the
   screenshot text is the reliable source.
4. **Newest *finished* recording only.** Check OBS is no longer writing the
   file (`lsof`, `pgrep -x OBS`, stable size/mtime). Kevin often starts the next
   recording while a set exports; never touch the in-progress file.
5. **Slates are white.** The MWTM logo card is white, not black, so
   `blackdetect` finds nothing. Review boundaries by brightness or contact
   sheets. OBS usually keeps recording after the last part, leaving a long
   trailing logo card (35 minutes on 2026-09-28); the final part ends at the last
   content frame. **Check the first frame BEFORE encoding.** On 2026-09-28 the
   first two Part 2 start estimates were 5 to 7 seconds early and each cost a
   wasted full encode. Before starting any part's encode, grab single frames from
   the source at the proposed start (+0.1 s and +1 s) and just before the end,
   using fast input seeking (`-ss` before `-i`), and confirm they are content.
6. **No stray scans.** Frame-grab or scan loops left running from the boundary
   review compete with the export for CPU. Only the one locked export should be
   running. Kill leftover helper loops (they only write temp images).
7. **Timing.** The locked export runs at about 1.5x to 1.9x the content length
   per part (measured on the Teezio set; a 15-minute part took about 22 minutes).
   Budget roughly 40 to 45 minutes for a 27-minute lesson. Recording the next
   lesson at the same time slows it further.
8. **Jacob verifies, not Codex's word.** For every part: `ffprobe` shows video
   and audio, duration matches the manifest range, and the first and last frames
   are content, not the logo slate. Existing sets and the original timestamped
   file must be untouched.
9. **Records.** Each finished set gets a record in `docs/mwtm/sets/<slug>.md`
   (same shape as the Teezio one), and the change is committed to this repo.

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
