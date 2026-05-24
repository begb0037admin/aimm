
# AIMM Context Architecture Refactor Plan
## Prepared for next-session implementation

Date: 2026-05-12

---

# OBJECTIVE

Reduce:
- Claude context reread cost
- operational entropy
- duplicated truth
- handover bloat
- dashboard drift
- monolithic index.html pressure

WITHOUT:
- framework rewrites
- React migration
- architecture replacement
- large-scale refactors
- destabilising the working AIMM system

The strategy is:
incremental stabilisation and context architecture improvement.

---

# CURRENT ASSESSMENT

The project architecture is strong.

The main bottleneck is now:
AI context entropy.

Symptoms:
- CLAUDE.md reread overhead
- repeated grounding
- duplicated operational truth
- dashboard maintenance burden
- large monolithic context windows
- growing handover history

Priority is now:
context architecture rather than UI architecture.

---

# IMPLEMENTATION STRATEGY

## PHASE 1 — CONTEXT SLIMMING
(HIGHEST ROI / LOWEST RISK)

### Goal
Reduce Claude session startup burden.

### Tasks
1. Split historical handovers out of CLAUDE.md
2. Keep CLAUDE.md focused on:
   - current state
   - active branch
   - operational rules
   - maintenance protocol
   - current pickup
   - current risks

### Create
/docs/HANDOVERS/

### Move into HANDOVERS
- shipped-session logs
- historical implementation notes
- old smoke-test summaries
- completed feature handovers

### Keep in CLAUDE.md
- maintenance protocol
- branch status
- current project state
- current focus
- stable conventions
- critical operational rules

### IMPORTANT
Do NOT break current workflow assumptions.

CLAUDE.md must remain:
- lightweight
- stable
- operational

---

# PHASE 2 — DASHBOARD / ROADMAP TRUTH CONSOLIDATION

## PRIORITY
HIGH

Backlog #5 should now become a strategic priority.

### Goal
ROADMAP.md becomes the canonical source.
DASHBOARD.html becomes generated output.

### Approach
DO NOT convert the whole dashboard at once.

Instead:
- prototype ONE section first
- verify pattern
- expand gradually

### Recommended first section
Backlog

Reason:
- highly structured
- easiest parser target
- lowest rendering complexity

### Expected Benefits
- less drift
- less duplicated editing
- lower maintenance burden
- reduced Claude confusion
- simplified updates

---

# PHASE 3 — INDEX.HTML PRESSURE RELIEF

## Goal
Reduce monolithic file pressure WITHOUT framework migration.

### DO NOT:
- migrate to React
- rewrite architecture
- introduce build tooling
- convert to TypeScript
- redesign state management

### Instead:
Extract stable config/data only.

---

# FIRST EXTRACTION TARGETS

Create:
/data/

Recommended extraction order:

1. personas.js
   - TAB_PERSONA_MAP
   - TAB_PURPOSES
   - TAB_DISPLAY_NAMES

2. kb-config.js
   - KB_CATEGORIES
   - KB_CAT_PATTERNS

3. tool-defs.js
   - TOOL_DEFS

4. icons.js
   - shared SVG/icon constants

Keep runtime orchestration inside index.html.

---

# TOMORROW'S EXECUTION ORDER

## STEP 1
Slim CLAUDE.md

## STEP 2
Verify Claude grounding still works

## STEP 3
Prototype Backlog #5
(dynamic dashboard generation for ONE section only)

## STEP 4
Extract first config module
(personas.js recommended)

## STEP 5
Run smoke tests

---

# IMPORTANT RULES

## DO NOT:
- refactor everything at once
- change working architecture unnecessarily
- redesign UI systems
- touch unrelated runtime logic
- over-abstract

## DO:
- keep changes isolated
- keep changes reversible
- keep diffs small
- preserve working AIMM behaviour
- preserve current workflow velocity

---

# CLAUDE PROMPTING STRATEGY

Tomorrow's prompts should remain:
- surgical
- isolated
- implementation-focused

Avoid:
"refactor the project"

Prefer:
- "extract historical handovers from CLAUDE.md"
- "prototype dynamic Backlog rendering from ROADMAP.md"
- "extract TAB_PERSONA_MAP into data/personas.js"

Each task should be:
- testable
- low-risk
- independently verifiable

---

# SUCCESS CONDITION

AIMM remains:
- operational
- stable
- fast to iterate
- low-friction for Claude sessions

while reducing:
- reread overhead
- maintenance duplication
- context drift
- operational entropy

