# Insight tab in the Plugins v3 / MixBus design language - spec (Jules, 22 Nov 2026, preview only)

Scope: `#knowledge` (tab "Insight") in standalone/assets/index.html, base build 2026-11-21.9. Design only; nothing built. Codex builds after Kevin approves `preview.html` (same folder; add `?scale=1.4` to test text size). Rules: UI_DESIGN_STANDARD.md (no boxes behind counts/arrows/icons, no emoji, sentence case), SPEC-section-colours.md, jules-mixbus-sidebar-style/SPEC.md, feedback_aimm_primary_palette.md. No new colours.

Checked against the real tab (headless Chrome, 1440 wide, seeded notes and facts): block-capital headings, boxed count "(0)", boxed chevrons, pill tags and pill buttons, emoji/glyph icons (⊕ ⬇ ⬆ ⚡ ✎ ↻ ⌄), an empty boxed delete button, eight tall "No notes here yet" cards, dashed outlines, Luna named in the blurbs.

## 1. What the tab is for (drives the layout)
Two jobs, both kept: (1) Knowledge base: research notes; active notes are injected into Hope's prompt every session (8000-byte budget). (2) Hope's memory: facts Hope extracts after calls; Kevin edits, pins, disables, deletes, drags between categories (2000-byte budget). The question the tab answers: what does Hope know right now, and how full is it. So: active/inactive is the main state on every row, and each job shows its byte budget in its own header.

## 2. Sections and colours
| Section | Colour | Why |
|---|---|---|
| Knowledge base | #b970ff Library purple | It is the stored library (same as Library in the sidebar) |
| Hope's memory | #36a8ed Status blue | What Hope currently holds about Kevin: a status of Hope, same as Status |
Categories inside each are NOT given their own colours (eight colours for eight folders carries no meaning and the palette has five). They are fold rows in the parent's colour. Video pink, Tools yellow and Categories orange are not used as section colours; yellow and orange appear only as the budget warning (below).

## 3. Structure
- Page head unchanged (existing title + subtitle).
- Each job = one card, 1px border in its colour, radius 12, #1a1d21 fill, 12-16px gap. Header bar: section colour, black ink, 16px bold sentence case "Knowledge base" / "Hope's memory". Right of the title, black ink 14px 600: "2 of 3 active · 873 / 8000 bytes" (replaces the stats pill, the bytes pill and the long blurb). Far right: plain minus/plus fold, 22px, black, no box; the whole bar toggles.
- Under the bar a 4px budget line: track #2a2e35, fill section colour, width = bytes/cap. At 6000+/1800+ fill turns Tools yellow #e8b45a; at the 8000/2000 cap Categories orange #f97316 (existing thresholds; palette colours only). This is a meter, not a box behind a number.
- Toolbar (inside the card, 12px padding): "Add note" / "Add fact" solid teal, black ink; Import and Export neutral #2a2e35 with #d5d8dc ink and plain stroke glyphs (down/up arrow); all 44px high, radius 10, 15px bold (identical to MixBus toolbar). Hover = solid white, black ink. Right side: "Expand all", "Collapse all" (and "Clear all" in Memory) as plain bold 14px #9aa0a6 text; hover = section-colour fill, black ink. Clear all keeps its confirm; no red (not in palette).
- Category fold row: 46px min, 15px bold, plus/minus glyph in section colour (left), bare count right (no parentheses, no box). Hover = solid section colour, black ink. Empty categories (0) are closed by default, label dimmed #9aa0a6, and still accept drops. Their "No notes here yet - drag one in." text is removed.
- Last row in every open category: "Add note" / "Add to Vocals" row (plain plus, 20px, same hover) replacing the dashed "+ Add to X" button.

## 4. Rows
Note row (grid: grip | text | state): grip = plain six-dot glyph #9aa0a6. Title 15px 600 #e5e7ea (wraps, never ellipsis). Meta 13px #9aa0a6: "date · source" (link shows as host only, blue underline link colour dropped; hover shows full URL in title). Tags = plain muted text "808, sub, sidechain", no pills. Actions line, plain bold 14px text, no pills: Summary/Raw (the inject mode, one word; "Raw only" dimmed when no summary), View/Hide, Edit, Re-summarise, Delete (dim). No emoji, no leading glyphs. Right: state glyph and token count ("19 tok") as bare text. The "raw 570/sum 73" counter is removed (the active mode's token figure is the one that matters).
State glyph (plain, no box): Active = check, #e5e7ea. Inactive = dash, dimmed; title struck through, grip/meta at 70%. Click on the glyph toggles (aria-pressed, title "Active, click to turn off"). Replaces the "⚡ Active / ○ Inactive" pill.
Fact row: star slot (pinned only: plain purple #b970ff star with soft glow, per UI standard; unpinned slot empty) | text 15px | four plain 18px glyphs always visible, muted: pin, edit, active (check/dash), delete (today they only appear on hover, which hides them). Inactive fact = struck through and dimmed, as notes.

## 5. States
| State | Look |
|---|---|
| Rest | transparent on #1a1d21, grey glyphs, #c4cad3/#e5e7ea text |
| Hover / keyboard focus | solid section colour (purple in Knowledge base, blue in Memory), black ink on every glyph and word, as sidebar v3 and MixBus |
| Selected (note opened to read its text) | solid teal #2dd4bf, black ink, same as the selected plugin in MixBus; its text shows below under a hairline #2a2e35, 13px mono #c4cad3, no inner box. Teal keeps teal on hover. Only the opened note is teal, so teal never means "active" and the page is not a wall of teal |
| Inactive | dimmed, struck-through, dash glyph |
| Dragging | ghost 40% of section colour, dragged row solid section colour, black ink (as MixBus); drop target category row takes the section colour fill |
| File drag over the tab | the overlay becomes one solid teal card "Drop files to import. PDF, DOCX, TXT, MD or JSON", black ink 16px bold; indigo dashed outline removed |
| Focus ring | 2px #36a8ed, unchanged |

## 6. Remove
Both blurbs (one is wrong: says Luna; also explanatory). The section icons beside headings. The boxed (n) counts, boxed chevrons and tag pills, the stats pill and bytes pill (moved to the bar), all emoji/glyph labels, dashed borders everywhere, empty-category placeholder text, the empty delete button box, the long onboarding paragraph in the empty state (replace with a single "Add note" row; the Luna/NotebookLM workflow text is already covered by Import tooltip). Colour overrides block 4904-4984 ("PREVIEW ONLY ... purple gradient hover") is replaced by this spec. Tooltips keep guidance (title attributes unchanged except "Luna" -> "Hope").
Open for Kevin: does the Luna wording in tooltips/summarise status ("Summarising with Luna…") get changed to Hope? Recommend yes; it is copy only, Codex to confirm no behaviour is tied to it. Hope voice/chat markup is untouched (Markey's).

## 7. Scaling and resize
Every size is multiplied by `--inv-text-scale` (preview verified at 1.4: toolbar wraps, meta wraps, nothing clips). Layout is a single fluid column filling the app column; no fixed widths; toolbars `flex-wrap`; row title and meta wrap. App is desktop only; the same rules hold at 760.

## 8. CSS draft (all scoped under `#knowledge`; take the structure from preview.html)
```css
#knowledge{--c:var(--library)}                       /* per card; memory card: --c:#36a8ed */
#knowledge .insight-sec{margin:0 0 16px;background:#1a1d21;border:1px solid var(--c);border-radius:12px;overflow:hidden}
#knowledge .insight-sec[data-sec="memory"]{--c:#36a8ed}
#knowledge .insight-sec[data-sec="kb"]{--c:#b970ff}
#knowledge .sec-bar{display:flex;align-items:center;gap:calc(14px*var(--inv-text-scale,1));width:100%;min-height:calc(48px*var(--inv-text-scale,1));padding:calc(8px*var(--inv-text-scale,1)) calc(12px*var(--inv-text-scale,1)) calc(8px*var(--inv-text-scale,1)) calc(14px*var(--inv-text-scale,1));background:var(--c);color:#0b0d10;font:700 calc(16px*var(--inv-text-scale,1))/1.25 Inter,sans-serif;border:0}
#knowledge .meter{height:4px;background:#2a2e35}#knowledge .meter i{display:block;height:100%;width:var(--p);background:var(--c)}
#knowledge .meter.warn i{background:#e8b45a}#knowledge .meter.full i{background:#f97316}
#knowledge .row-fold:hover,#knowledge .row:hover:not(.open),#knowledge .fact:hover,#knowledge .add:hover{background:var(--c);color:#0b0d10}
#knowledge .row.open{background:#2dd4bf;color:#0b0d10}
#knowledge .tb.primary{background:#2dd4bf;color:#0b0d10}#knowledge .tb:hover{background:#fff;color:#0b0d10}
#knowledge .row.off .title,#knowledge .fact.off .txt{color:#9aa0a6;text-decoration:line-through}
```
`.fact-cat-card`, `.kb-card`, `.fact-chip`, `.kb-tag`, `.kb-mode-pill`, `.kb-active-toggle` markup is generated in knowledgeRender / kbRenderCard / renderHopeMemory: Codex changes those templates (header bar, meter, fold glyph, state glyph, tag text, actions text) and sets the `.cat` closed when count is 0. Class names and onclick handlers (toggleCollapse, kbToggleActive, kbToggleSummary, kbToggleExpand, kbEdit, kbDelete, toggleFactPin, startEditFact, toggleFactActive, deleteFact, Sortable lists) must stay so behaviour does not change.

## 9. Contrast
Black on purple 5.3, blue 6.0, teal about 10, white 21; #9aa0a6 on #1a1d21 about 6:1; yellow 9.2 and orange 6.9 as meter fill vs #2a2e35 above 3:1.

## 10. Not shown / for later
Add/Edit note dialog `#kbModal` (restyle the same way: purple header bar "Add note", neutral #2a2e35 fields, Save solid teal, Cancel plain text, no outlines); Memory inline edit form; over-budget meter states; drag in motion; empty-state of a brand-new user; 760px width. Flag: a Memory fact pinned/disabled is behaviour-neutral; no JS change beyond templates and the fold toggle.
