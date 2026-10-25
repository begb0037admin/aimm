# UI change process (Hope and AIMM repos) — approved 25 Oct 2026

Applies to any change to index.html that affects how the page looks or lays out.

1. **Request.** Kevin describes the change in plain words. No agent starts work from a vague request.
2. **Design (Jules).** Jules reviews the change and writes a short spec: which elements, the order, widths, label fit, and alignment. Jules does not implement it.
3. **Implement (Codex only).** Codex works from a fresh clone of origin/main on a new branch. Codex makes the change, bumps the build stamp, and runs the checks below. No Claude agent edits the code.
4. **Render check (Codex).** Codex renders the Hope panel at desktop and phone widths and saves screenshots. Each label must fit with no overflow, equal sizes must match the spec, and edges must line up with the textarea.
5. **Automated checks (Codex).** The page syntax check and node --test tests/hope-web-search.test.mjs must both pass.
6. **Design review (Jules).** Jules checks the screenshots against the spec and records pass or fail. A fail sends it back to step 3.
7. **Show Kevin (Jules).** Jules shows Kevin the screenshots in chat, with the spec and its pass or fail. Kevin must see them before he is asked to approve.
8. **Approval (Kevin).** Kevin approves the merge in his own words in chat.
9. **Merge (Codex).** Codex fast-forwards main and pushes. No Claude agent pushes or merges to these repos.
10. **Report.** Codex reports the commit hash, the screenshots, and the test output. If any git write is blocked, Codex stops and reports the exact error.

Rules: no Claude agent runs git writes, ElevenLabs writes, or Worker changes in these repos. If a step is blocked, stop and report; do not work around it.
