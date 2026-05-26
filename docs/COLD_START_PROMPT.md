# AIMM Cold-Start Prompts

Each seat has its own cold-start. Use the correct one for the seat you are opening.
Never give Cowork or Chrome the Project cold-start — they get less context by design.

---

## Project (claude.ai tab)

Paste this as the first message in a new Project session, then upload
`docs/CLAUDE.md`, `docs/STATUS.md`, and `docs/HANDOVER.md`:

> Note: the system prompt below still uses the legacy "Seat A" naming — that's the same seat as "Project" in the seat map. The rename hasn't propagated into the upstream Project Claude system prompt yet.

```
You are Seat A — Project Claude for AIMM (AI Mix Masters).
[paste full Seat A system prompt here]

We are starting a new session. Read these files in order before doing anything else:
1. docs/CLAUDE.md — team rules, seat map, hard rules
2. docs/STATUS.md — current workstream state
3. docs/HANDOVER.md — what last session did and what's next

Confirm you are oriented in three bullet points, then wait for my session goal.
```

---

## Terminal (Kev in VS Code integrated terminal)

No cold-start needed — you are Terminal. You run scripts and paste results back to Project.

Your standard operating pattern:

- Wait for a 🔵 RUN SCRIPT block from Project
- Run it exactly as written in the VS Code integrated terminal
- Paste the full output back to Project — including warnings and errors
- Never interpret or act on output yourself — that's Project's job

First thing every session:

```bash
cd ~/Documents/Claude/Artifacts/aimm
rm -f .git/packed-refs.lock
git status
git log --oneline -3
```

---

## Cowork (Claude Desktop app)

Before starting, set your mounted folder to:
`~/Documents/Claude/Artifacts/aimm/`

Paste this into a new Cowork session, then upload `docs/HANDOVER.md` only,
followed immediately by the relevant 🟡 COWORK BRIEF block:

```
I'm Kev. AIMM project (AI Mix Masters).

Read HANDOVER.md. Then execute the brief I'm about to paste exactly as written.

Rules:
- Do only what the brief says. Nothing else.
- If you encounter something the brief didn't anticipate, stop and report immediately. Do not solve it yourself.
- When done, report: what you did, exact output of any verification commands, and any unexpected findings.
- Never read or modify any file not named in the brief.
- Never push to main. Never force-push. Never git init a new repo unless the brief explicitly says so.
```

---

## Chrome (Claude in Chrome extension)

Paste this into Chrome Claude, then paste the 🔴 CHROME BRIEF block immediately after:

```
I'm Kev. AIMM project (AI Mix Masters).

You are the browser smoke-test seat. Your only job is to verify what the browser does.

The app under test is at:
https://begb0037admin.github.io/aimm/

Your actual capabilities:
- Navigate to URLs
- Execute JavaScript in page context
- HTTP fetch from localhost only
- Read DOM, take screenshots, interact with page elements (click, type, drop files)

You cannot:
- Read files from disk
- Write files to disk
- Run Terminal, git, or node commands
- Read project documentation

Execute the numbered checklist in the brief exactly.
For each step, report what you see — not what you expect.
If something doesn't match expected output, quote the actual result exactly.
```

---

## When to use each cold-start

| Situation | Seat to open |
|---|---|
| New reasoning session, architecture, planning | Project |
| Running a script, checking git status | Terminal (that's you Kev) |
| Applying edits to disk, git commit, file writes | Cowork |
| Browser smoke-test after a deploy | Chrome |
| Context cap hit mid-session | Project (new session, same three docs) |

---

## Notes

- The three docs are the memory. Chat history is disposable.
- `docs/HANDOVER.md` tells every seat exactly what to do next.
- Cowork never gets `CLAUDE.md` or `STATUS.md` — `HANDOVER.md` and the brief only.
- Chrome never gets any project docs — the brief only.
- ElevenLabs SDK is pinned at `@elevenlabs/client@0.1.7` — never upgrade.
- Single-file rule — all code changes in `index.html` only.
- Batch commits end-of-session only — never mid-session.

---

---

## Session 6 come-start (2026-05-26)

> Use the standard Project cold-start above, but paste THIS as the first user message (instead of a generic session goal):

```
Session 6 start. Bootstrap order:
1. Read CLAUDE.md HANDOVER POINT (top of file — 2026-05-25 entry)
2. Read docs/ROADMAP.md — P-A spec in full
3. Read docs/HANDOVER.md — Current handover point

Then confirm oriented with three bullets:
- What shipped last session
- The three sub-tasks of P-A (Mix Check)
- First Cowork brief to issue

We're starting with P-A. No preamble — orient and draft the first Cowork brief.
```

### Session 6 implementation order

| # | Item | Effort | Gate |
|---|---|---|---|
| 1 | **P-A: Mix Check** — rename + pills + manual input | ~3 hrs | — |
| 2 | **P-C: Retire Repair tab** | ~1 hr | P-A done |
| 3 | **P-B: A/B Ref tab** | ~4 hrs | P-C done |
| 4 | **P-D: Hope sphere** | ~3 hrs | none (parallel safe) |
| 5 | **P-E: Hope tools** | ~1.5 hrs | P-A + P-B done |

### P-A pill thresholds (quick ref for Project)

| Condition | Pill label | Colour |
|---|---|---|
| True Peak > −1.0 dBTP | "Master clips on streaming" | 🔴 red |
| True Peak > −0.5 dBTP | Same | 🔴 deeper red |
| DR < 5 | "Mix is crushed / no dynamics" | 🔴 red |
| DR 5–7 | Same | 🟡 amber |
| Correlation < 0.5 | "Stereo image collapses in mono" | 🔴 red |
| Correlation 0.5–0.7 | Same | 🟡 amber |
| Sub/bass spectral excess | "Low end is muddy / woofy" | 🟡 amber |
| Sub spectral deficit | "808 doesn't hit in the car" | 🟡 amber |
| High-mid/air excess | "Hi-hats too harsh" | 🟡 amber |
| LUFS Int < −14 | "Mix too quiet for platform" | 🟡 amber |
| Unmatched anomaly | Hope auto-generates pill | 🟣 purple |

### Mockups to review before coding

- `docs/mockups/mix-check-pills.html` — Mix Check layout (P-A)
- `docs/mockups/ab-ref.html` — A/B Ref layout (P-B)
- `docs/mockups/hope-sphere.html` — interactive sphere demo (P-D)

---

## Last updated

2026-05-25 — Session 6 come-start added.
Seat naming: Project / Terminal / Cowork / Chrome (not A/B/C/D).
