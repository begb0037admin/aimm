# Cross-Domain Code Brief — MixCheck Revision 3 independent review

**From:** Kevin
**To:** Hope
**Date:** 2026-08-17
**Project:** aimm — MixCheck (Ozone reskin, Revision 3)

> AIMM is Hope's personal domain per `command-centre/CLAUDE.md`'s Domain
> Boundary rule ("PERSONAL (Hope's domain): AIMM ... Never mix domains
> unless a Cross-Domain Code Brief has been issued"). This brief is that
> mechanism — filed here because the coordinator session had been running
> Cat directly against this domain without one. See the WATCH section below
> for the reconciliation this surfaced.

## Context

Static HTML mockups + live embedded builds, served via GitHub Pages from
`begb0037admin/aimm`. Two source files: `docs/mockups/ozone-redesign-v1.dc.html`
(the approved reference) and `aimm/index.html` (the MixCheck panel +
header/Hope-rail chrome being reskinned against it). The review page
(`mixcheck-r3-review.html`) embeds both as live iframes side by side, not
static screenshots — a couple of displayed values shift between page loads
(mock audio data cycling), so exact-number diffs aren't fully stable, only
structural/content ones are. Nothing from this round has been pushed to
`main`. The dispatch table lists Cat as aimm's owner but marked "not yet
built" — that's stale; real R3 work is in flight under this domain, worth
reconciling. `CLAUDE.md` for this project was not updated before this brief
— sourced from live inspection instead.

## Goal

R3 gets explicit sign-off (or a scoped punch list) and merges to `main`
once it visually matches the approved mockup, or the gaps are accepted as
known/deliberate deviations.

## Done

Cat's R3 rebuild — header/tab chrome, Hope panel rebuilt into a real
conversation thread (bubbles, Mix Move card, composer), Spectral Balance
switched to the glow-ribbon rendering technique Kevin specifically flagged
(was a flat area fill). Section order fixed to Hope analysis → Spectral
Balance → Mix Issues. Troubleshooter + data tables hidden via CSS (not
deleted) since the mockup omits them. Self-review disclosed 4 known gaps
(app title, meter sub-labels, 3-vs-4 Hope action buttons, tab active-state
style) and asked for sign-off — sign-off was not given. An independent
visual comparison was run instead (see Next/Watch).

## Status

Not signed off. Sitting in local scratch files per Cat's note, unpushed.
The independent review found real gaps beyond the 4 Cat disclosed —
including one disclosed gap (tab active-state: "underline vs filled pill")
that appears inaccurate on inspection — both reference and R3 use a filled
box treatment, just different accent colours.

## Next

Have Cat address the undisclosed gaps below against `aimm/index.html`'s
MixCheck panel before re-requesting sign-off. Done condition: R3 rendered
in the same review page with these closed, re-flagged to Kevin for final
yes/no.

1. **Spectral Balance curve shape** — R3 renders sharp jagged spikes; the
   reference is one smooth continuous wave. Rendering technique (glow
   ribbon) is right; the underlying curve/data shape is wrong.
2. **Extra Stereo Balance / Overall Balance / Correlation row** under the
   LOW/MID/HIGH summary boxes — not present in the reference at all.
3. **Tab strip membership differs, not just active-state styling**:
   reference = MixCheck, Workbench, Library, Insight, Snapshots, Settings.
   R3 = Conversation, Library, Workbench, Insight, Snapshots, Mix Check,
   Marketing, Community. Settings demoted from tab to header button;
   Conversation/Marketing/Community are new with no mockup counterpart.
4. **Header row gained a genre/platform selector** ("Hip-Hop" /
   "Trap · -8 LUFS" dropdowns) not in the reference header at all.
5. **Mix Issues list is short one chip** ("Vocal sits behind the beat"
   missing entirely), one chip reworded ("Mono collapse" → "Stereo image
   collapses in mono"), and R3 highlights 3 chips across two colours
   (red + orange) vs the reference's single orange highlight.
6. **Platform Targets row icon changed** from checkmark (✓, reference) to
   "✕" (R3) — flips the implied meaning of that row (met/valid →
   remove/invalid).
7. **Composer bar gained chrome not in the reference**: camera + paintbrush
   icon buttons, a session-cost/message-count footer line, an
   Anthropic-credits/ElevenLabs billing disclaimer, and a build-number
   watermark. Reference composer is just the text field + Send.
8. **Separately (not a mockup-fidelity issue):** Kevin wants the "Hope"
   persona renamed to "Amy" throughout the MixCheck UI — avatar/name
   header, chat-bubble speaker tags, composer placeholder ("Ask Hope
   anything..."), and R3's billing disclaimer line. Not yet actioned
   anywhere.

## Watch

(a) **Ownership drift** — the dispatch table says Cat owns aimm and marks
it "not yet built," but this recap and the live review page show active R3
work. Reconcile before the next planning pass so the table isn't stale.
(b) **Don't take Cat's "what now matches" self-review at face value** —
cross-check against the live iframes directly; one of its own disclosed
items didn't hold up under inspection. (c) The review page's two embeds are
live, not static — re-verify current state before acting on any specific
number in this brief, only the structural/content gaps are stable.

## Files

- https://begb0037admin.github.io/aimm/docs/mockups/mixcheck-r3-review.html
  (review page, live)
- `docs/mockups/ozone-redesign-v1.dc.html` (reference source)
- `aimm/index.html` (MixCheck panel + header/Hope-rail chrome, R3 target)
- repo: github-proxy.lelitte.co.uk/aimm/

## Roadmap

1. Cat closes items 1–7 above.
2. Hope/Cat action the Hope→Amy rename (item 8) as a separate, scoped pass.
3. Re-render review page, Kevin gives final sign-off.
4. Push to `main`.
5. Reconcile the dispatch-table ownership note for aimm.
