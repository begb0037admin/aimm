# Hope chat/voice tool parity — release record — 2026-10-21

## Decision

Typed chat, ElevenLabs Live Agent voice, and the Luna voice route are all Hope. The input/output
mode changes; the AIMM capabilities and tool handlers are shared. Typed chat uses its Anthropic
`tool_use` loop, the Live Agent uses ElevenLabs `clientTools`, and Luna uses its Responses loop;
all three dispatch to AIMM's shared `handleToolCall` implementation. The model/API protocol differs
by route, but the workbench tool capability set does not.

## Shipped

- Build `.72` removed typed chat's Repair-only tool list and Luna's keyword-based tool filtering.
  All routes receive the complete `TOOL_DEFS` catalog. Explicit Fix Queue “explain only” turns
  continue to send no tools for that turn.
- The three legacy Repair tile helpers (`list_symptom_tiles`, `add_symptom_tile`,
  `delete_symptom_tile`) were added to the shared catalog and attached to the active Live Agent.
- Build `.73` accepts the `add_symptom_tile` chain as either an array (typed chat / AIMM registrar)
  or JSON text (ElevenLabs tool schema). Both forms use the same validation and tile-creation code.
- No workbench chain, plugin setting, target, or Repair tile was changed as part of this release.

## Live verification

- `aimixmasters.com` loaded build `2026-10-21.73`.
- The connected ElevenLabs agent `agent_2601kqm4g7txfsvv0pkvpe02389p` has 40 attached client tools;
  `list_symptom_tiles`, `add_symptom_tile`, and `delete_symptom_tile` are present.
- A typed chat request to open the dashboard invoked `open_dashboard` and rendered the current
  project dashboard in AIMM's overlay. Chrome blocked the attempted popup, so the tool surfaced the
  documented “Open in new tab” link as the fallback. No roadmap test capture was created because
  Kevin did not specify an item to add.
- The dashboard's **Captured from voice** section is the writable roadmap-capture inbox, shared by
  voice and typed Hope. **Promote** copies a snippet for `ROADMAP.md`; it does not directly write to
  the canonical Markdown file.

## Registration note

AIMM's Settings registration button returned HTTP 401 `invalid_api_key` from the key relay during
this release. The three tools were created/reused and attached through the connected ElevenLabs
account instead. Existing active agent configuration is correct; future tool additions through the
Settings button may still need the relay credential corrected.

## Commits

- `d13fe0e` — Unify Hope chat and voice tools
- `1b757b7` — Support voice Repair tile tool schema
The two source commits are on `main`; this documentation and verification record is being committed to the same branch.

## Follow-up — Fix Queue display and answer parity — builds `.74`–`.76`

Build `.74` made Hope's broadband orange strip fully opaque, which looked like a 100% level; `.75`
reduced opacity but still drew an unnecessary full-range bar. Build `.76` aligns Hope's transcript
card with the main Fix Queue: frequency-specific fixes show an orange position marker, while
broadband measurements show no spectrum strip. The numeric broadband reading remains in the card
title and measured-reason text.

The full-mix and per-stem Ask Hope buttons now share one question builder, which flags an unfinished
“Analysing” move as pending instead of passing it off as a recommendation. Typed chat, Luna voice,
and both live ElevenLabs Hope agents share the same Fix Queue answer rules. The Primary and Fallback
agents now have identical 40-tool catalogs; Primary previously lacked six tools present on
Fallback. Both live agents' Fix Queue prompt guidance was updated on their production Main
branches (Primary `agtvrsn_5501m5g6wk2pebbtwzceqz20xvgr`; Fallback
`agtvrsn_5701m5g6t0c6evaabvkcbqfv6p9k`). JavaScript syntax and question-builder smoke checks
passed. Build `.76` and docs are prepared for GitHub deployment. No workbench state was changed.
