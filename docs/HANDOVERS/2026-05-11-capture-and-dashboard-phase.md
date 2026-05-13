# 2026-05-11 — capture-to-roadmap tool, dashboard inbox + Phase 2 kill record

Archived from CLAUDE.md HANDOVER POINT. Two pieces from 2026-05-11:

1. The `capture_to_roadmap` tool + dashboard inbox + 5 polish entries + Continue-here modal session.
2. The Phase 2 — KILLED kill-record (placed at end so future Claude doesn't re-litigate).

A one-line pointer at the killed decision lives in CLAUDE.md under "Known killed/won't-fix decisions" so the anti-re-litigation safeguard remains visible without bloating the operational file.

---

## Session of 2026-05-11 (capture_to_roadmap tool + dashboard inbox + 5 new polish entries + Continue-here modal)

Killed the "Hope says she added it to the roadmap but didn't" hallucination class. New 30th client tool `capture_to_roadmap` writes structured entries to localStorage; DASHBOARD.html renders a "📥 Captured from voice" section at the top with Promote / Edit / Dismiss buttons. Hope can now genuinely capture from voice — verbal acknowledgement becomes literal persistence. Tool count 29 → 30. Also late in the session: replaced the fire-and-forget toast + auto-redirect in `continueInCowork` with a persistent modal so Kev sees explicit Cmd-V steps after Cowork takes focus (was the #1 confusion class for the Continue here buttons).

**What shipped this session:**

1. **`capture_to_roadmap` client tool (30th).** TOOL_DEFS entry (~line 5997). Handler in `handleToolCall` right before the `emit_notebooklm_prompt` case (~line 9187). JSON schema entry in `elevenlabs-client-tools.json`. Validates `type` against `bug` / `backlog` / `polish` / `followup` / `idea` enum (defaults to `idea` if unknown). Writes a structured entry `{id, ts, type, title, body, effort, status:'captured'}` to `localStorage['hopeRoadmapCaptures_v1']`. Caps the array at 200 entries (most-recent-first via `unshift` + `slice(0,200)`) to keep localStorage healthy.

2. **`CAPTURE TO ROADMAP` directive in RT_INSTRUCTIONS** (right after the NOTEBOOKLM ESCAPE HATCH block). Strict framing: "NEVER say 'I will add it to the roadmap' verbally WITHOUT calling the tool — saying it without calling the tool is confabulation. The tool is the only mechanism." Tells Hope to confirm in 5-7 words after the call ("Captured — it will land in your dashboard under Captured from voice") and not narrate the entry's body. **Includes a `PROACTIVELY OFFER to capture` subsection** so Hope spots roadmap-shaped moments mid-conversation (UX complaints / feature wishes / bug observations / improvement ideas / recurring frustrations) and offers a one-sentence "want me to flag it for the roadmap?" — covers the natural flow where Kev wasn't going to ask but the idea is worth keeping. Includes explicit when-to-offer and when-NOT-to-offer examples so she doesn't push capture on casual chat / venting / mid-explanation half-thoughts.

3. **DASHBOARD.html "📥 Captured from voice" section** at the top (between status tiles and Now). Hidden by default; reveals when `localStorage['hopeRoadmapCaptures_v1']` has entries. Each entry renders as a card with type label (colour-coded: red=bug, purple=backlog, amber=polish, blue=followup, gray=idea), title, body (white-space:pre-wrap), effort + capture timestamp, and three action buttons:
    - **📋 Promote** — copies a markdown snippet to clipboard formatted for ROADMAP.md paste, with a section hint based on type (e.g. polish → "Polish + smaller ideas (P?)"). Falls back to `window.prompt` if clipboard API blocked.
    - **✏ Edit** — `window.prompt` for title + body inline tweaks. Writes back to localStorage + re-renders.
    - **× Dismiss** — removes from the queue. No confirm — clean undo path is to ask Hope to re-capture.
    
    Helpers: `loadCaptures()`, `saveCaptures(list)`, `renderCaptures()`, `promoteCapture(id)`, `editCapture(id)`, `dismissCapture(id)`, `continueFromCapture(id)`, `escapeHtml(s)`. `renderCaptures` fires on page load + on `window.focus` (so Kev sees fresh captures after returning from a call).
    
    **Post-promote state swap:** once Kev clicks Promote on a capture, the entry's `promoted:true` flag persists in localStorage and the action row swaps from `[Promote / Edit / Dismiss]` to `[✓ Promoted badge / ▶ Continue here / × Done — remove]`. The Continue here button calls `continueFromCapture(id)` which builds a tailored prompt (capture title + body + suggested ROADMAP.md section based on type) and fires `continueInCowork(prompt)`. This way the natural next move after Promote — "switch to Cowork and let the next Claude session paste this into ROADMAP.md" — is one-click resumable. Done — remove dismisses the capture once Kev's confirmed it's safely in ROADMAP.md.

4. **Five new polish entries added to ROADMAP.md + DASHBOARD.html** with Continue buttons:
    - **P5** — Hope engages with Settings tab (extend TAB_PURPOSES + APP KNOWLEDGE digest) — ~30 min
    - **P6** — Insight terminology (Hope says "Insight tab" or "knowledge base in the Insight tab", not bare "knowledge base") — ~15 min
    - **P7** — Anthropic balance helper (open billing page on Update click since Anthropic has no public balance API) — ~10 min
    - **P8** — capture_to_roadmap tool itself (now shipped, will be moved to Shipped log)
    - **P9** — Profile-aware Continue button investigation (Kev has 5 profiles; needs empirical test to confirm whether `claude://` jumps profiles) — ~5 min test, ~30 min fix if needed

5. **Dashboard Continue-button audit + fix.** Three cards on DASHBOARD.html were missing the ▶ Continue here button: Phase 2 decision, Hope-only baseline, F0 voice difference. All three now have item-specific Continue buttons matching the rest of the dashboard.

6. **Continue-here UX overhaul in DASHBOARD.html — persistent modal replaces fire-and-forget toast + auto-redirect, then cleaned further to drop `claude://` entirely.** The old `continueInCowork()` did clipboard-write → `showToast('Prompt copied — paste into Cowork')` → `setTimeout(() => location.href='claude://', 80)`. Problem #1: as soon as Cowork took focus the toast vanished mid-fade, Kev clicked Open Claude on the permission dialog, then nothing visible happened because he didn't know to Cmd-V. First fix: clipboard copies first, then a persistent modal renders centered with `[✓ Prompt copied to clipboard]` header + numbered step list `(1) Switch to your Claude profile of choice  (2) Cmd V into the chat input  (3) Hit Enter` + `[Cancel]` and `[Open Cowork now ↗]` buttons. Cancel / Escape / backdrop click all dismiss. Problem #2 (discovered live during smoke test): clicking Open Cowork now still fired the macOS permission dialog, which then produced no visible app-switch on Kev's machine — three clicks for zero visible payoff. Cleaner fix: drop the Open Cowork button + the green header CTA at top-right entirely. Modal is now `[✓ Prompt copied to clipboard]` + 3 steps + single `[Got it]` button (Cowork-green, primary). Header CTA replaced with a small `.head-tip` line pointing at the per-card Continue buttons. Workflow: click Continue here → modal confirms clipboard + shows steps → Kev Cmd-Tabs to Cowork (always open beside the dashboard) and pastes. Modal DOM still built once via `ensureCwModal()` (idempotent). CSS retained: `#cw-modal`, `.cw-modal-box`, `.cw-modal-steps` with `<kbd>` chips, `.cw-btn-primary`. Removed: `.cta-cowork` class + its `:hover` rule + `.cw-btn-secondary` (no secondary action remaining). Affects every Continue button across the dashboard (25 per-card buttons + the post-Promote button on captures via `continueFromCapture`) — they all funnel through the shared helper.

7. **Cross-profile bootstrap header on every Continue-here prompt.** Kev's failover chain across 5 Claude profiles (Kevin Lead → Hope Builder → Adam Dev → Work Uni → Admin Org) means a Continue paste might land in a profile that has zero AIMM context — folder not mounted, never read CLAUDE.md. The old task prompts assumed the receiving agent was already in the working dir (true for Hope Builder, false for the others). New `COWORK_BOOTSTRAP_HEADER` constant declared just above `continueInCowork`, prepended automatically to every prompt before clipboard write. Three labelled blocks: `PROJECT LOCATION: ~/Documents/Claude/Artifacts/trap-master-reference` (tilde path so it expands per OS user) + a directive to call `request_cowork_directory` if the agent doesn't already have file access; `READ FIRST: CLAUDE.md "## ⚠️ HANDOVER POINT"` so the receiving agent knows where canonical state lives; then `TASK:` followed by the original per-card prompt. Funnels through every existing Continue caller (25 per-card buttons + `continueFromCapture` for promoted captures) without touching the call sites.

8. **P9 resolved as "won't fix — `claude://` is a registered handler but provides no visible app-switch on Kev's machine."** During smoke test, clicking the header CTA fired the macOS permission dialog ("localhost:8000 wants to open this application"), proving the protocol handler IS registered. But after clicking Open Claude, no visible app-switch happened — Claude.app stayed wherever it was. Likely cause: Cowork already running in foreground or on a different macOS Space, so the activate signal lands silently. Net effect: three clicks for zero visible payoff, worse than no button. Decision: strip the `claude://` paths entirely (header CTA + Open Cowork now button). Modal becomes clipboard-confirm + steps + single dismiss. Kev's workflow (Cowork always open alongside the dashboard, manual Cmd-Tab) is unaffected. P9 closed.

9. **Phase 2 (auto-stub KB note from `emit_notebooklm_prompt`) — KILLED.** Made redundant by the KB import upgrade's auto-extract-on-drop. The purple `📋 NotebookLM Prompt` bubble in chat is sufficient as a "research in progress" reminder. Phase 2 card removed from DASHBOARD.html; ROADMAP.md "Now" section rewritten as a one-paragraph kill-record so future Claude doesn't re-litigate the decision. CLAUDE.md "🌅 First thing tomorrow morning" section rewritten as "Phase 2 — KILLED." (Full kill record below.)

**Apply drill:** `EL_API_KEY=<key> python3 register_elevenlabs_tools.py` then hard-refresh `localhost:8000` to pick up the 30th tool. No Publish click needed (script writes via API). DASHBOARD.html change is pure HTML/CSS/JS — just reload the dashboard.

**Smoke test:** start a call → ask Hope to capture something ("Hope, capture an idea for the roadmap: bigger send button on the conversation toolbar"). Watch DevTools console for `[EL tool] capture_to_roadmap` log. Then reload DASHBOARD.html — the "📥 Captured from voice" section should appear at the top with the new entry. Click Promote → markdown snippet should land in clipboard.

**Where to resume:** P9 (profile-aware Continue test) is a 5-min thing Kev can do anytime — open one of his 5 profiles' chats, tab to dashboard, click any Continue button, report which profile he lands in. P5 + P6 + P7 are all small enough to batch into a future session.

---

## Phase 2 — KILLED (2026-05-11)

Kev called it: kill. Reasoning: the KB import upgrade already auto-extracts the title from any dropped synthesis (Haiku does it on drop), and the purple `📋 NotebookLM Prompt` bubble in the chat already serves as a "research in progress" reminder. Adding placeholder cards to the Insight tab would have been extra state to manage (mark complete? auto-clean on synthesis arrival? expire?) with no real win. Workflow stays unchanged: Hope drops the bubble → Kev runs NotebookLM externally → drops the synthesis PDF on Knowledge tab → Haiku extracts title/tags/summary → note saves Active.

ROADMAP.md "Now" entry rewritten as a one-paragraph kill-record so future Claude doesn't re-litigate. DASHBOARD.html Phase 2 card removed. No code touched in `index.html` — the change is purely documentation + dashboard.

**Other context worth keeping in mind on pickup:**
- NotebookLM workflow verified live today (Metro Boomin smoke test passed: purple bubble lands, Copy works, Hope speaks ~10s)
- KB import upgrade shipped today — drag PDF/DOCX/TXT/MD onto Knowledge tab, Haiku auto-extracts title/tags/summary, saves Active with undo toast. Closes the NotebookLM round-trip.
- Open bug B1 (mic-click page-jump) still unfixed
- Dashboard TODOs D1/D2/D3 in ElevenLabs still pending (greeting variable + system-prompt edit)
- Original 2026-05-08 follow-ups untouched (F1 slow Hope voice, F2 elFetchConversationCost simplification, F3 history bars tile)
