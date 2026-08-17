# Cross-Domain Code Brief — MixCheck R3, round 2: computed-style diff

**From:** Kevin
**To:** Hope
**Date:** 2026-08-17
**Project:** aimm — MixCheck (Ozone reskin, Revision 3)

## Context

Static HTML mockups + live embedded builds, served via GitHub Pages from
`begb0037admin/aimm`. Reference: `docs/mockups/ozone-redesign-v1.dc.html`.
Build target: `aimm/index.html` (MixCheck panel + header/Hope-rail chrome).
Two review rounds so far, both self-graded by Cat and both incomplete on
independent check: v1 review (`mixcheck-r3-review.html`) disclosed 4 gaps,
Kevin's independent pass found 7 more plus one inaccurate disclosure. v2
(`mixcheck-r3-review-v2.html`) closed those 7. Still not signed off — Kevin
flagged that the v2 build still doesn't read as matching the reference at a
glance, and screenshot-based visual review has now missed real gaps twice.
Nothing pushed to `main`; still local scratch per both review pages.

## Goal

R3 gets explicit sign-off (or a scoped punch list) once it matches the
reference — including spacing/gutters and table/row/column layout, not just
colour and rendering technique — or gaps are accepted as known/deliberate
deviations.

## Done

v1 → v2 closed: spectral curve shape, extra stereo/correlation row, tab
strip membership + order, header genre/platform selectors relocated, Mix
Issues pill list (missing chip + wording + highlight-count fixture bug),
Platform Targets icon tolerance bug, composer bar chrome. Corrected one
inaccurate v1 disclosure (tab active-state was never actually an
underline-vs-pill mismatch). Kevin independently re-verified the tab strip
fix (confirmed correct) and the Hope panel icon row (NOT fixed — see Next).

## Status

Not signed off. v2 still open on at least two fronts: Hope panel icon set is
still wrong (not a v1/v2 scope item — separate finding), and Kevin cannot
confirm guttering/table-column layout matches from visual review —
screenshot comparison has proven unreliable for this class of issue twice
already.

## Next

Build a computed-style diff script instead of a third visual review round.

1. Headless-render both `ozone-redesign-v1.dc.html` and `aimm/index.html`,
   same viewport (1700px, matching the existing review pages).
2. Hand-map matched element pairs between the two DOMs — no shared
   IDs/classes exist yet, so this mapping is real work, not boilerplate.
   Scope: left-rail meter cards, Platform Targets rows, Spectral Balance
   container, the 3 summary boxes, Hope column, tab strip, composer.
3. For each pair, diff `getBoundingClientRect()` + computed
   margin/padding/gap/width/border-radius/font-size/line-height.
4. Output a mismatch-only table (element, property, ref value, build
   value, delta) — not screenshots, not another prose write-up.
5. Also fix the Hope panel icon set while in there: reference uses
   bookmark/save, download, image, search (4 icons). Build currently shows
   document, sparkle, trash (3 icons) — none of which match the
   reference's icons, not just a count gap.

Done condition: mismatch table comes back empty, or every remaining row is
something Kevin has explicitly accepted (e.g. the `AIMM_BUILD` watermark
rule already flagged as out-of-scope in v1).

## Watch

(a) Two rounds of screenshot-based self-review have both missed real gaps
and, once, asserted something false in the write-up — don't accept a third
"looks close, sign off?" round without the numeric diff.
(b) Ownership drift — dispatch table lists Cat as aimm's owner marked "not
yet built," but real R3 work has been in flight two rounds now; reconcile
the table.
(c) The review pages embed live iframes, not static images — re-verify
current state before acting on any specific number, only structural/content
gaps are stable.

## Files

- `docs/mockups/ozone-redesign-v1.dc.html` (reference)
- `aimm/index.html` (build target)
- `docs/mockups/mixcheck-r3-review.html` (v1 review)
- `docs/mockups/mixcheck-r3-review-v2.html` (v2 review)
- repo: github-proxy.lelitte.co.uk/aimm/

## Roadmap

1. Build + run the computed-style diff script.
2. Close whatever it surfaces, including the Hope icon set.
3. Separately, action the Hope→Amy persona rename (deferred from the
   original brief, still untouched).
4. Re-render review page, Kevin gives final sign-off.
5. Push to `main`.
6. Reconcile the dispatch-table ownership note for aimm.
