# OBS videos — cold start

Use this note when beginning a new code session with no conversation context.

**Normal route (from 2026-09-28): go through Jacob.** Say "let's do our Mix with
the Masters recordings" to Jacob and paste the lesson title/URL plus a
screenshot of the part list. Jacob runs the `mwtm-recordings` skill, dispatches
Codex with a text-only brief, and verifies the result. See "Jacob-coordinated
route" in `docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md`. The rest of this note is for a
bare code session with no Jacob.

The trigger phrase is:

> Let's work on OBS videos and just notes.

Then read `docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md` in the AIMM repository.

The working scope is the OBS tutorial workflow:

```text
OBS continuous recording
→ source MP4 and lesson metadata
→ engineer/artist/track set folder
→ reviewed black-screen boundaries
→ labelled parts and FULL.mp4
→ manifest, notes and verification report
```

For the media step, keep the established production path: review the slate
boundaries and run the direct H.264/AAC `ffmpeg` export from the process
document once per part, in the foreground. Wait for each export to finish and
verify it before starting the next. Do not introduce a new splitter or parallel
exports without an explicit request to change the process.

Keep this scope separate from transcript generation and AIMM knowledge-base
import. Those are later steps and need an explicit request.

A code session can discuss the workflow and prepare notes without the external
disk being mounted. To inspect or split an MP4, the session must be able to read
the source path; if it cannot, report that specific blocker and continue with
the notes and manifest rather than guessing.

Suggested opening message:

```text
Process the newest OBS recording using the AIMM MWTM workflow.
Read docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md first. Preserve existing work and do
not transcribe or import anything into AIMM unless I ask. Ask me only for a
metadata item that cannot be recovered from the recording, notes or session.
```
