# ROADMAP → Dashboard single-source-of-truth plan

## Recommendation

Do not attempt to make the dashboard infer its current cards from the whole
existing `docs/ROADMAP.md` immediately. The file is the authoritative active
planning record, but it is deliberately a long, chronological narrative with
active work, superseded alternatives, cross-references and historical records
mixed together. It needs a small, explicit dashboard-facing format tightening
pass first. That is a documentation-only change, not a second source of truth:
the canonical title, description, status, effort and action prompt would live
beside each roadmap item in `docs/ROADMAP.md` and `DASHBOARD.html` would render
only that data.

The preferred end state is:

```text
DASHBOARD.html --fetches--> docs/ROADMAP.md --parses dashboard metadata + Markdown--> cards
Hope -----------------------> docs/ROADMAP.md --------------------------------------> digest
```

That gives Kevin and Hope the same underlying status text, rather than merely
two systems which happen to be refreshed at the same time.

## 1. What the actual roadmap looks like now

### It has useful structure, but not a dashboard-safe schema

`docs/ROADMAP.md` is 1,932 lines of prose. It has Markdown headings, but their
levels express document/narrative structure rather than a uniform backlog data
model:

- Level-two headings are used for very different things: a shipped R3 release
  at line 5; the open Mix Check queue at line 55; the unnumbered `Multi-stem
  Mix Check` record at line 199; numbered items 23–41; `Shipped` at line 1651;
  `In progress` at line 1733; and the old `Planned — Session 6 priorities` and
  platform-architecture history at lines 1739 and 1892.
- Level-three headings are sometimes real queue entries—items 9–14 at lines
  70–142—but also subheadings such as `Backlog — from the R3 Mix Check redesign`
  (line 37), `37b. ...` (line 1403), old `P-A`–`P-E` records (lines 1741–1827),
  and architecture stages (lines 1898–1925). A rule such as “every `###` is a
  card” would create false cards.
- Numbering is not continuous or universal. The live feedback list begins at
  9; Multi-stem is intentionally unnumbered even though the dashboard calls it
  “Backlog 22”; the newer document items run 23–41; older items use `P-A`,
  `P-B`, etc.; and the dashboard still contains cards 1–8. The roadmap itself
  explicitly records the 22/unnumbered mismatch in item 31.
- There is no top-level `Now` group. The dashboard’s current `Now` is a manual
  projection: three feedback cards (9, 11, 10), four legacy P1 cards and eight
  P2 cards. It even contains prose saying nothing is in active development.
  That grouping cannot be recovered reliably from heading position or number.
- There is a `## Shipped` heading, but shipped material also appears much
  earlier: the heading at line 5 begins `✅ ... PROMOTED & LIVE`; line 154 is a
  shipped feedback-round heading; and items 12, 13, 33, 35, 37b, 38 and 40
  carry completion wording in their own headings. Conversely, the line-881
  item 33 heading says both `SHIPPED` and `awaiting merge`, which is precisely
  why prose matching cannot decide its display state.

### Status and presentation markers are human-readable, not normalised

The file uses several valid human conventions, none reliably equivalent:

- `### 9. ... · **Confirmed not started, 2026-10-08**`
- `### 10. ... · **Status unclear, 2026-10-08 — re-verify before acting**`
- `### 12. ... · ✅ **SHIPPED & MERGED, confirmed 2026-10-08**`
- `## ✅ 33. ... SHIPPED ... awaiting merge`
- `## 34. ... — APPROVED, Kevin committed to build`
- body-only language such as `**Effort:** L`, `**Done.**`, `Not yet scoped or
  built`, and `Backlog capture only — not build authorization`.

The dashboard has a different status vocabulary again: e.g. its item-9 badge
is `Confirmed not started`, item 11 is `Confirmed: built, button hidden`, and
item 10 is `Status unclear — re-verify before acting`. Those are currently
hand-written transformations, not fields available to a parser.

Effort is also inconsistent: the live queue uses a dedicated `**Effort:** L/M/S`
paragraph, historical P-A/P-B use `**Effort:** ~3 hours/~4 hours`, many newer
items express effort only in prose, and several dashboard cards substitute an
editorial explanation. Owner, priority, date grouping and “continue” prompt
have the same problem.

### Conclusion: tighten only the dashboard-facing records first

Do not rewrite 1,932 lines or erase the historical narrative. Add an explicit
metadata block immediately before every item that should appear as a dashboard
card, and add three explicit dashboard grouping headings. Existing prose stays
where it is and remains the full evidence/history for Hope.

Use a deliberately small, line-oriented HTML comment block so it is invisible
in rendered Markdown and easy to parse without shipping a Markdown library:

```md
<!-- dashboard-card
id: mixcheck-feedback-21
section: now
priority: p2
status: not_started
badge: Confirmed not started
effort: L
owner: Cat builds; Jules specs
continue: Read item 9 in docs/ROADMAP.md. Scope the real section detection and issue-marker overlay; do not implement yet.
-->
### 9. Mix Check feedback #21 — Real section detection + issue markers ...

Existing canonical roadmap prose, including **Effort:** L, remains below.
```

Allowed `section` values should be finite: `now`, `backlog`, `polish`, and
`shipped`. Allowed status values should likewise be finite (`not_started`,
`in_progress`, `needs_decision`, `needs_verification`, `blocked`, `approved`,
`shipped`, `parked`). The human-facing `badge` is explicit rather than derived
from prose. `id` is stable and unique; it is not inferred from a number, since
the document already has historic numbering collisions and an unnumbered item.

If keeping metadata next to every record proves visually noisy, a single
`## Dashboard index` near the start of the same file can contain these blocks
and reference the canonical item IDs. That is still one file, but it creates a
manual index which can drift from the adjacent item text. The adjacent-block
option is therefore preferable.

## 2. Proposed browser parsing and what can be derived

### Fetch and parse boundary

At page load, fetch the relative URL `docs/ROADMAP.md` as text. Use a same-origin
relative path rather than a GitHub raw URL so GitHub Pages and the app use the
checked-in file from the same deployed revision. Render a clear “Roadmap could
not be loaded” state on a failed fetch; do not silently show old hand-maintained
cards as if current.

The parser should be a small constrained parser, not a general Markdown parser:

1. Normalise `\r\n` to `\n`.
2. Locate `<!-- dashboard-card` through the following `-->` with a non-greedy
   block rule. Reject malformed blocks, duplicate IDs, unknown keys/values and
   missing required fields (`id`, `section`, `status`). Report those as visible
   per-card/dashboard load errors in development rather than inventing a state.
3. Parse metadata one `key: value` line at a time. Values are single-line;
   prompt text must stay single-line. This avoids trying to implement YAML in
   the browser.
4. Require the next non-blank line to match `^(#{2,3})\s+(.+)$`. Its heading
   becomes the title after removing only the Markdown heading marker—not a
   guessed status badge or item number.
5. The description is the source text from after that heading up to the next
   dashboard block or a heading of the same/higher level. Render a bounded
   preview (for example the first two paragraphs or 500–700 characters), plus
   a `Read in roadmap` link/anchor. Do not treat nested lists, quoted evidence
   or old headings as new cards unless they have a metadata block.
6. Escape all fetched text before adding optional minimal inline treatment
   (code, emphasis and links), or initially render plain text with DOM
   `textContent`. Never assign fetched Markdown directly to `innerHTML`.

The metadata is the contract; regex identifies that limited contract. A full
Markdown parser would make heading and paragraph extraction nicer, but it would
not solve classification, status, numbering or action-prompt ambiguity. It is
unnecessary for the first safe version and adds a dependency/bundling question
to a standalone HTML dashboard.

### Derivable dashboard UI

With those blocks, the following are reliable:

| Dashboard feature | Source field/rule |
| --- | --- |
| Card title and stable anchor | adjacent Markdown heading; `id` |
| Description | bounded canonical prose immediately below it |
| Now / Backlog / Polish / Shipped placement | `section` |
| Border colour and badge style | `section`, `priority`, `status` |
| Badge text | explicit `badge` |
| Effort and owner | explicit metadata, with existing `**Effort:**` retained as prose evidence |
| Section counts and P1/P2 tile totals | count parsed cards by `section`/`priority` |
| Shipped date groups | add optional normalised `shipped: YYYY-MM-DD` metadata, then group/sort it |
| Continue button | explicit `continue` text copied from the roadmap metadata |
| Deep link | `docs/ROADMAP.md#...` only if the corresponding heading has a stable Markdown slug; otherwise an ID-based in-page “source” indication rather than a fragile generated anchor |

These cannot be safely derived from current free prose alone and must either be
metadata or omitted in phase one: precise current priority, a display badge,
the “Continue here” clipboard instruction, whether an older record is
historical versus actionable, and shipped grouping date. In particular, body
phrases such as “not build authorization”, “awaiting Kevin”, “not started”,
and “closed” do not establish a single current state.

## 3. Existing-functionality risks and protections

### Collapsible sections and state persistence

The existing controls depend on stable IDs and classes: `sec-now`, `sec-backlog`,
`sec-polish`, `recently-shipped`, `sec-p2`, date-group IDs and
`.collapsible-sec`. Their collapsed state is persisted in
`aimmDashboardSectionState_v1`; tile click handlers also target those IDs.

Keep the section shells and IDs static. Replace only their card-list children
after parsing, then run count calculation and attach any card-local listeners.
Do not replace the entire `body`, section elements or global controls. Keep the
existing initial collapse choices and let `restoreSectionStates()` run after
the shells exist. Generated shipped date groups need deterministic IDs based on
the normalised ISO date (`dg-YYYY-MM-DD`) so saved behaviour remains sensible.

The Priority-2 tile currently has no target/click handler while the hard-coded
P2 inner section uses `sec-p2`; decide explicitly whether the generated version
preserves that interaction or makes the tile open/scroll to it. It should not
silently lose the nested P2 grouping during the first migration.

### `continueInCowork()` clipboard behaviour

Today every card embeds a curated inline `onclick` string and
`continueInCowork(prompt)` calls `navigator.clipboard.writeText`; the successful
button-state update uses the browser-global `event.currentTarget`. A generic
button can be rendered only when its roadmap block supplies `continue`.

Do not derive these prompts from title/body—the existing prompts contain real
constraints that are not reliably recoverable, such as “do not start coding”,
approval gates and cross-references. Retain the same function and visual
feedback initially, but bind generated buttons via an event listener and pass
the button/current target explicitly. That avoids depending on a global event
when cards are created after load. Preserve the existing clipboard failure
fallback (`alert` showing the prompt), which matters on restricted/local
origins.

### Captures inbox is independent data, not roadmap content

`#captures-section` is populated from Worker `/captures`, falling back to
`localStorage` key `hopeRoadmapCaptures_v1`; promotion only copies a Markdown
snippet and dismissal updates local storage/Worker. It must remain outside the
roadmap renderer. Do not clear it while replacing card containers, rename its
ID, change `CAPTURES_KEY`, or treat inbox entries as parsed roadmap cards.

There is one adjacent bug worth preserving in the plan: `promoteCapture(i)`
currently reads localStorage even when the screen was populated from Worker
results, so its index can differ from the displayed Worker list. That is out of
scope for the sync change; do not accidentally alter it while refactoring the
dashboard. A later dedicated fix can reconcile the client state.

### Fetch, caching and safe failure

- A dashboard opened as `file://` cannot reliably fetch a sibling Markdown file
  because of browser origin rules. The supported mode must be the Pages/app
  origin; an error message should say so rather than treating an empty response
  as an empty roadmap.
- A relative fetch normally tracks the deploy, but browser/CDN caching can
  briefly pair a new dashboard with an old roadmap. Make the renderer tolerate
  a schema mismatch and expose the fetched document’s first-line title and a
  load timestamp/source status. Do not use a permanently stale static fallback.
- The fetched document is trusted repository content, but text must still be
  escaped. A Markdown-to-HTML shortcut would turn a future accidental raw HTML
  addition into executable dashboard content.
- A parse error should leave the fixed section shell in place with one explicit
  error card and console diagnostics; it must not render a partial set and
  quietly report misleading tile counts.

## 4. Phased implementation plan

### Phase 0 — agree the data contract and classify current displayed cards

1. Decide the small metadata schema above, finite status/section vocabulary,
   preview length, and whether shipped cards need date groups in v1.
2. Make an inventory of every card currently shown in Now, Backlog, Polish and
   Recently shipped. For each one, locate the canonical roadmap record or mark
   it as intentionally retired/absent.
3. Resolve mismatches rather than encoding them: notably the dashboard’s
   Backlog 22 versus the unnumbered Multi-stem heading; the stale historical
   P-C card still shown under Now; and records whose heading/body gives mixed
   statuses (for example item 33).
4. Add the metadata blocks and, where needed, the exact canonical dashboard
   wording to `docs/ROADMAP.md`. Do not create a separately maintained JSON,
   JS object or copied summary.

Acceptance: every currently intended card has exactly one unique `id`, an
explicit section/state, and a source record; the parser design has no heuristic
classification rules beyond its declared metadata contract.

Rough effort: 0.5–1 day of editorial reconciliation and decisions. This is the
smallest safe first step and should happen before application code.

### Phase 1 — additive parser proof, without removing the existing dashboard

1. Add a pure parsing function and fixture-style checks against the real
   `docs/ROADMAP.md`: required fields, unique IDs, valid values, valid adjacent
   heading and expected section counts.
2. Fetch and parse at page load in a development-only/source-preview area, or
   log/compare the generated model against the existing hard-coded dashboard.
3. Test fetch success, malformed block, duplicate ID, bad enum, offline/404,
   Pages serving and a local-file open. Verify that Hope’s existing digest is
   unaffected because the source stays `docs/ROADMAP.md`.

Acceptance: the parsed model matches the reconciled inventory, and a malformed
roadmap fails visibly rather than changing live cards silently.

Rough effort: 0.5–1 day.

### Phase 2 — switch one contained section to rendered cards

1. Keep header, tiles, global controls, captures inbox and all section shells
   static.
2. Render one low-risk group first—Backlog is the best candidate because it is
   already a single collapsed card list and its count is currently calculated
   from DOM cards.
3. Generate safe title/body/meta/badge/continue elements with DOM APIs; update
   that section’s count from parsed records, not `querySelectorAll`.
4. Regression-test collapse/expand, keyboard tile navigation, clipboard success
   and failure, captures loading/promoting/dismissing, persisted collapse state,
   and fetch failure.

Acceptance: deleting or changing a Backlog card’s dashboard metadata/content in
`docs/ROADMAP.md` is reflected on reload; no matching card text remains in the
dashboard source.

Rough effort: 0.5–1 day including browser regression testing.

### Phase 3 — migrate Now, Polish and Shipped; remove duplicates

1. Migrate Now and its P1/P2 presentation only once metadata supplies priority
   and the agreed grouping. Make both priority tile values computed.
2. Migrate Polish after deciding whether it is still a real roadmap grouping or
   a dashboard-only presentation category; if it is dashboard-only, encode it
   as the explicit `section` field rather than guess from wording.
3. Add optional shipped-date metadata, render deterministic date groups, and
   convert the Shipped tile from a fixed tick to a truthful computed summary if
   desired.
4. Remove the old hard-coded card markup and its duplicated prose only after a
   side-by-side verification against the source model. Preserve captures and
   static section wrappers.

Acceptance: `DASHBOARD.html` contains styling, stable controls and the generic
renderer only—no business-status card bodies, badge strings, hand-counted
priority totals or per-card Cowork prompts.

Rough effort: 1–2 days, dominated by reconciling semantics rather than code.

### Phase 4 — harden the editorial workflow

1. Add a lightweight validation command/CI check that reads
   `docs/ROADMAP.md` and fails on malformed/duplicate dashboard blocks,
   invalid enum values and a dashboard block not followed by a heading.
2. Document the one rule for roadmap edits: edit the canonical prose and its
   adjacent dashboard fields in the same change; never edit dashboard cards.
3. Add an on-page source-load/schema diagnostic in development, and a compact
   normal user-facing load error in production.
4. In a real browser, verify a status change in the Markdown immediately makes
   both dashboard reload output and Hope’s roadmap answer align. This is the
   success criterion for the incident described here.

Rough effort: 0.5 day.

## Total estimate

Approximately 2.5–5 days end-to-end: 0.5–1 day of source reconciliation,
0.5–1 day parser/validation proof, 0.5–1 day for the first section, 1–2 days
for full migration and regression coverage, and about 0.5 day for workflow
hardening. The uncertainty is editorial: deciding the true current state of
the cards will take longer than the client-side parser.

## Explicit non-goals for this change

- Do not change Hope’s current digest/read path; it already reads the right
  active document. The win is making the dashboard consume that same file.
- Do not turn captures into roadmap records or alter the Worker/KV/localStorage
  integration.
- Do not infer deployment/merge truth from prose, commits or badge emojis at
  render time. Editors state it explicitly in the canonical roadmap record.
- Do not ship a second generated JSON/JS source alongside the Markdown. That
  would recreate the drift problem in a different format.
