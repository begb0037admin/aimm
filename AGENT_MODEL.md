# AGENT_MODEL.md
# Runtime Operating Model — Personal Domain

Version : 1.0
Status  : Ratified
Updated : 2026-06-29
Author  : Kevin Lelitte

Governed by: CONSTITUTION.md
Scope      : AIMM personal domain — begb0037admin personal repositories

---

## Preamble

This document defines the current implementation of the four-role
model established in CONSTITUTION.md Section 1 for the personal
domain. It assigns tools to roles, defines execution mechanics,
and records platform context.

Claude Code holds the reasoning, execution, and verification seats.
Kevin holds the human seat as approval authority. The constitutional
role boundaries survive as approval gates.

If this document conflicts with CONSTITUTION.md, the constitution
wins. See CONSTITUTION.md Section 6.

---

## Section 1 — Platform Context

**Personal machine (Kevin)**
Operator : Kevin Lelitte
OS       : macOS
Runs     : Claude Code (primary agent), browser (Hedra, CapCut,
           ElevenLabs dashboard, Cloudflare dashboard)

**GitHub is the sole authoritative source of truth and the only
working surface.** All reads and writes go through the GitHub API
or the gh CLI. No local clone is the authoritative copy.

---

## Section 2 — Role Assignments

**Seat A — Reasoning Seat → Claude Code**
Thinks, plans, architects, and routes. All sessions begin here.

**Seat B — Human Seat → Kevin (personal capacity)**
Holds approval authority and oversight. May intervene at any point;
when invoked, supersedes all in-flight decisions.

**Seat C — Execution Seat → Claude Code (GitHub API)**
Implements all GitHub API writes. Claude Code produces and executes.
Tasks requiring local browser execution (Cloudflare dashboard,
ElevenLabs dashboard, Hedra) are briefed to Kevin; Kevin executes.

**Seat D — Verification Seat → Claude Code**
Verifies live behaviour by fetching deployed pages and API state.
Kevin remains the final visual check on UI changes.

**Approval gates — Kevin's explicit confirmation is required
before:**

1. Any destructive or hard-to-reverse operation — file deletions,
   branch deletions, repository settings changes
2. Any write to a production file during a governed phase before
   the relevant gate is cleared
3. Any amendment to CONSTITUTION.md
4. Deploying to a custom domain or changing DNS/CDN configuration
5. Any cross-domain action (personal ↔ work) without a
   Cross-Domain Code Brief

Everything else — reads, reversible writes under the backup rules,
verification — Claude Code executes without asking.

---

## Section 3 — Execution Protocol

Claude Code reasons and executes GitHub operations in one loop.
Browser-side tasks (Cloudflare Workers setup, ElevenLabs agent
configuration, Hedra clip generation) are briefed to Kevin.

The constitutional sequencing rules apply:

1. **One change at a time.** Verify the result of a write before
   making the next. No parallel writes to the same file.
2. **Restore point before change** (CONSTITUTION.md Section 4).
   Every API write is a commit — the prior commit SHA is the
   restore point. Governed data files additionally require a
   datestamped Archive/ backup before any write.
3. **Stop and report** (CONSTITUTION.md Section 2). If a task
   requires a decision outside the approved scope or hits an
   approval gate, Claude Code stops and asks Kevin. It does not
   improvise past a gate.

---

## Section 4 — Write and Delivery Standards

All GitHub writes follow these rules:

- **Contents API only** — GET fresh SHA immediately before PUT.
  On 409 conflict, re-fetch and retry once; on second failure,
  stop and report.
- **Archive/ backup first** for governed files during named phases.
  One datestamped backup per file per day; skip if today's exists.
- **Byte-level edits for non-ASCII content.** Files containing
  multi-byte characters are edited as bytes (base64 in, targeted
  byte replacement, base64 out). Never decode/re-encode whole
  files through a text layer.
- **Cache-bust all raw reads.** Every raw.githubusercontent.com
  fetch carries `?t=<timestamp>`.
- **No secrets in any committed file.** API keys and PATs live in
  the gh CLI keyring or environment variables only.
- **Large outputs** are written to files in the repo, not pasted
  into chat.
- **Executable files** (.sh, scripts) delivered via SendUserFile
  — never as code blocks in chat.

---

## Section 5 — Session Discipline

1. Claude Code holds persistent memory across sessions and the
   repositories hold the documentation. Together these replace
   handover briefs for same-operator continuation.
2. No session closes without documentation updated to reflect
   current state (CONSTITUTION.md Section 5). HANDOVER.md and
   STATUS.md are updated at the end of every working session.
3. Decisions live in documentation, not in chat history. Anything
   worth keeping gets committed.
4. `AIMM_BUILD` const in index.html must be bumped in every commit
   that touches index.html. Format `YYYY-MM-DD.N`.

---

## Section 6 — Domain

**Personal domain only.** This model covers AIMM and personal
repositories. Work repositories (Oxford HR Systems) are governed
by a separate AGENT_MODEL.md in the command-centre repository.

Domain boundaries are strict. Work context is never carried into
personal sessions and vice versa. Mixed-domain work requires a
Cross-Domain Code Brief.

---

## Section 7 — GitHub Access

All repositories are hosted under the begb0037admin GitHub account.
Claude Code authenticates via the gh CLI (keyring; repo, workflow
scopes).

Repositories are currently public — required for GitHub Pages
hosting. Cloudflare Workers deployment does not require public
repos but the current plan keeps them public.

Authentication secrets are never committed.

---

## Section 8 — Repository Scope

| Repository           | Status  | Notes                              |
|----------------------|---------|------------------------------------|
| aimm                 | Active  | Primary — AI Mix Masters           |
| ai-news-channel      | Active  | The AI Deep Dive YouTube channel   |
| personal-finance     | Active  | Personal finance tracking          |

---

## Version History

| Version | Date       | Change                              |
|---------|------------|-------------------------------------|
| 1.0     | 2026-06-29 | Initial ratification. Personal      |
|         |            | domain operating model established. |
|         |            | AIMM brought under governance as    |
|         |            | part of AIMM_SPLIT_MIGRATE phase    |
|         |            | pre-requisite (Stage 0).            |
