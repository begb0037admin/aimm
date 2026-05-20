# AIMM HANDOVER archive index

Archived session handovers from `CLAUDE.md`. Active sessions live in CLAUDE.md HANDOVER POINT (latest two only); everything older lives here.

**Don't read this folder on session start.** The active CLAUDE.md HANDOVER POINT + operational sections are sufficient for picking the project up. Reach into the archive only when investigating a specific past decision, shipped feature, or design rationale.

Sorted newest-first. Each file preserves the original CLAUDE.md ordering (newest entries top of each file).

| File | Period covered | What's inside |
| --- | --- | --- |
| [`2026-05-12-ui-stabilisation-and-snapshots.md`](2026-05-12-ui-stabilisation-and-snapshots.md) | 2026-05-12 (older same-day sessions) | Hope→Adam Backlog #4 spec **(SUPERSEDED)**, KB categorisation on Insight tab, Snapshots tab + tab reorder + drag-to-reorder + browser-tab style (Adam clone on top of Kev's dashboard-intelligence batch). |
| [`2026-05-11-capture-and-dashboard-phase.md`](2026-05-11-capture-and-dashboard-phase.md) | 2026-05-11 | `capture_to_roadmap` tool (30th client tool) + dashboard inbox + 5 polish entries + Continue-here modal + Phase 2 KILLED kill-record. |
| [`2026-05-08_to_2026-05-10-persona-and-oracle-evolution.md`](2026-05-08_to_2026-05-10-persona-and-oracle-evolution.md) | 2026-05-08 → 2026-05-10 | KB import upgrade (drag-drop + Haiku auto-extract), NotebookLM workflow + voice consistency, oracle batch shipped (inspect_app + read_doc + project-history digest), Hope-as-oracle queued spec **(SUPERSEDED)**, mid-call tab awareness, cross-call continuity hardening, Hope-only baseline + KB note seed, Markey↔Matthew role swap. |
| [`2026-05-03_to_2026-05-06-foundation-batches.md`](2026-05-03_to_2026-05-06-foundation-batches.md) | 2026-05-03 → 2026-05-06 | Voice-migration batches 1–5 (OpenAI Realtime → ElevenLabs Conversational AI), persona system + UI overhaul, post-Batch-5 polish (17-item UI re-shape), batch retrospective specs, items 10–15 of "What's already done" (batch implementation retros). |

## Related reference

- [`../persona-system-prompt-template.md`](../persona-system-prompt-template.md) — operational reference recipe for v3 conversational persona prompts. Personas are dormant baseline but the recipe stays current for any future revival.

## Conventions in this archive

- **Chronology preserved.** Within each file, sessions appear in the same newest-first order they had in CLAUDE.md.
- **No content deletion.** Every line that was in CLAUDE.md HANDOVER POINT has been moved here verbatim or relocated to the persona-system-prompt-template.md file. Phase 1 of the context-architecture refactor is information-preserving by design.
- **Superseded specs flagged.** Where a spec was queued for the next session and then shipped, the spec entry carries a `STATUS: SUPERSEDED` header pointing at the ship entry.
- **Cross-references.** "See entry above / below" pointers refer to entries within the same archive file unless otherwise noted. Cross-archive references use the full filename path.
- **Items 10–15 of "What's already done".** The original CLAUDE.md had a 15-item "What's already done (don't redo this)" list interleaving stable operational facts (1–9) with batch-by-batch implementation retros (10–15). Items 1–9 remain in CLAUDE.md under "Operational invariants". Items 10–15 live in `2026-05-03_to_2026-05-06-foundation-batches.md` for the audit trail.
