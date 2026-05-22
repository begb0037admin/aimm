# AIMM Morning Checklist

---

## 1. Terminal — cleanup and status check

Open VS Code integrated terminal and run:

```bash
cd ~/Documents/Claude/Artifacts/aimm
rm -f .git/packed-refs.lock
git status
git log --oneline -3
```

Expected: clean working tree or known uncommitted files. Note the last 3 commits.

---

## 2. Project — cold-start

Open a new claude.ai conversation in the AIMM project. Paste the full Seat A system prompt (in project instructions). Then upload these three files from the `docs/` folder:

- `docs/CLAUDE.md`
- `docs/STATUS.md`
- `docs/HANDOVER.md`

Then say:

> New session. Read the docs in order, confirm oriented, then wait for my session goal.

Project will confirm with a three-bullet summary. Then state your goal.

---

## 3. Cowork — only when Project issues a brief

- Mount point: `~/Documents/Claude/Artifacts/aimm/`
- Upload `docs/HANDOVER.md` only
- Paste the 🟡 COWORK BRIEF block immediately after the cold-start prompt
- If something unexpected happens, Cowork stops and reports — it does not solve

---

## 4. Chrome — only when Project issues a brief

- No project docs
- Paste the 🔴 CHROME BRIEF block only
- Reports what it sees, not what it expects

---

## Reference

Full cold-start prompts for all seats: `docs/COLD_START_PROMPT.md`
Last session summary: `docs/HANDOVER.md`

---

Last updated: 2026-05-20
