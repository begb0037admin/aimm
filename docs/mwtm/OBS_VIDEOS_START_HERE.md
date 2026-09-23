# OBS videos — cold start

Use this note when beginning a new code session with no conversation context.

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

Keep this scope separate from transcript generation and AIMM knowledge-base
import. Those are later steps and need an explicit request.

A code session can discuss the workflow and prepare notes without the external
disk being mounted. To inspect or split an MP4, the session must be able to read
the source path; if it cannot, report that specific blocker and continue with
the notes and manifest rather than guessing.

Suggested opening message:

```text
Let's work on OBS videos and just notes.
Read docs/mwtm/OBS_TO_TUTORIALS_PROCESS.md first. Do not transcribe or import
anything into AIMM unless I ask. I will provide the source path and lesson
metadata when media inspection is needed.
```
