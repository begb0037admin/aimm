# Cross-Domain Code Brief — MixCheck R3, round 4: a live build, not another screenshot

**From:** Kevin
**To:** Hope
**Date:** 2026-08-17
**Project:** aimm — MixCheck (Ozone reskin, Revision 3)

## Context

Static HTML mockups + review pages served via GitHub Pages from
`begb0037admin/aimm`. Reference: `docs/mockups/ozone-redesign-v1.dc.html` —
confirmed real, live, committed HTML (242 DOM elements), originally built
via Claude Design (Anthropic Labs), which outputs genuine deployable
HTML/CSS/JS, not images. Build target: `aimm/index.html` (MixCheck panel +
header/Hope-rail chrome) — **not committed**. Three review rounds so far
(`mixcheck-r3-review.html`, `-v2.html`, `-v3.html`), all self-graded by Cat,
all incomplete on independent check.

**Critical finding from round 4 of independent review:** none of the three
review pages contain a live, interactive build — every "reference" and
"build" panel on all three is a static baked-in screenshot (data-URI image),
confirmed by inspecting the page DOM directly (zero iframes present).
Because `aimm/index.html` has never been committed, there has never been a
live, independently-loadable version of the R3 build anywhere — only
screenshots Cat selected and embedded. Kevin and Hope have both been trying
to visually verify Cat's own pictures of Cat's own unpushed work, with no
way to check underneath them. This is the root cause of three rounds of
"looks close, sign off?" not converging — it isn't a spotting-the-difference
skill problem on either side, the live artifact needed to check has never
existed outside Cat's own process.

## Goal

R3 gets a real, verifiable sign-off — build exists as a live URL, gets
diffed against the reference with actual computed styles (not screenshots,
not self-report), and either matches or the gaps are explicitly accepted
as known deviations.

## Done

v1 → v2 → v3 rounds closed (per Cat's self-report, partially independently
spot-checked): spectral curve rendering technique and smoothing, extra
stereo/correlation row hidden, tab strip membership + order, header
genre/platform selectors relocated, Mix Issues pill list (missing chip +
wording + highlight-count fixture bug), Platform Targets icon tolerance
bug, composer bar chrome, header grid-column template, tab-button padding,
meter-card manual-override row height, Platform Targets table border, a
leaking global line-height, and the Hope panel icon set (was 3 wrong icons,
now the reference's real 4: bookmark/save, download, image, search).
Independently spot-checked and confirmed: Hope icon set fix, header logo
box width fix, tab strip order. **Not independently verifiable:** the
"computed-style diff, ~30 element pairs, 3 iterations clean" claim in round
3 — no live build exists to re-run it against.

## Status

Not signed off, and cannot be meaningfully signed off in its current form.
The reference (`ozone-redesign-v1.dc.html`) is real and live — confirmed by
opening it directly and querying its DOM. The build has never existed as
anything other than screenshots.

## Next (blocking — supersedes all prior R3 rounds, do this instead of another reskin pass)

Kevin has the exact, ground-truth source of the approved design — confirmed
to match `docs/mockups/ozone-redesign-v1.dc.html` already in the repo. Stop
treating the reference as something to visually approximate. Copy it
directly.

1. Use `ozone-redesign-v1.dc.html`'s actual DOM structure, inline styles,
   colours, spacing, and exact values as the literal template for the
   MixCheck panel — not a target to re-derive from screenshots. Every value
   in that file (236px/1.7fr/320px grid, exact hex colours, exact
   padding/font-size numbers, the 6-tab strip in its exact order, the 4
   Hope icons, the 8 Mix Issues chips with exact wording, the 5-row
   Platform Targets table) is real and copyable as-is.
2. There is also a dependency-free standalone version already in the repo:
   `docs/mockups/redesign-v5-mixcheck-dashboard.html` (self-contained
   bundled/compiled export, confirmed same design as `ozone-redesign-v1.dc.html`
   in an earlier round). Evaluate whether this is cleaner to start from than
   the `.dc.html` file if it doesn't carry a runtime dependency the real app
   doesn't use — confirm which file is cleaner to start from before
   beginning.
3. The Spectral Balance canvas animation (the JS inside `componentDidMount`
   in the `.dc.html` file) is portable close to verbatim — it's plain
   canvas drawing code keyed to element width/height and a time value. Port
   it directly rather than re-implementing the curve shape from a
   screenshot, which is what produced the jagged-curve bug in round 1.
4. Wire in real functionality (audio analysis, Hope chat, live Platform
   Targets checks) as data feeding this exact structure — the structure and
   styling are not up for reinterpretation, only the data binding is new
   work.
5. Once built, **host it live** (a non-`main` GitHub Pages branch, or
   Netlify Drop) so it can be checked directly, not screenshotted.
6. No further "does this match" review rounds accepted until the build
   exists as a URL that demonstrably reuses this exact structure — not a
   fresh visual attempt at it.

## Watch

(a) Three rounds of screenshot-based review, self-graded by Cat, have
missed real gaps and at least once asserted something false in the
write-up — don't accept a fourth round without the live URL and independent
diff.
(b) Ownership drift — dispatch table lists Cat as aimm's owner marked "not
yet built," but real R3 work has been in flight four rounds now; reconcile
the table.
(c) Watch for the review pages themselves ballooning in size (v3 is ~800KB,
almost entirely baked image data) — that's a symptom of the underlying
problem, not a documentation style choice.

## Files

- `docs/mockups/ozone-redesign-v1.dc.html` (reference, real, live, committed)
- `aimm/index.html` (build target, **NOT committed**)
- `docs/mockups/mixcheck-r3-review.html` / `-v2.html` / `-v3.html` (review
  pages, all screenshot-only, all committed)
- repo: github-proxy.lelitte.co.uk/aimm/

## Roadmap

1. Host the build live (blocking).
2. Run the real computed-style diff.
3. Close whatever it surfaces, including anything beyond the Hope icon fix
   already done.
4. Separately, action the Hope→Amy persona rename (deferred from the
   original brief, still untouched — not part of this round).
5. Kevin gives final sign-off against the live diff, not a screenshot.
6. Push to `main`.
7. Reconcile the dispatch-table ownership note for aimm.
