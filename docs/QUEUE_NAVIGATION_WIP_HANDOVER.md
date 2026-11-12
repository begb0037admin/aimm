# Fix Queue navigation — paused 12 Nov 2026

Kevin reports the full-mix Fix Queue is stuck at `2 / 2 done` and wants to move back and forth through completed items. He asked for Jules to review because recent UI changes have needed repeated corrections, then asked to stop and leave a handover for a new session.

## Current live state

- `main` and the live `aimm` Worker remain on build `2026-11-12.16`. No queue-navigation code was merged or deployed.
- The unfinished implementation is saved on branch `fix/revisitable-fix-queue`, commit `965ec5ca`, in worktree `/Users/admin/github/aimm-revisitable-fix-queue`. The branch was pushed to origin.
- That worktree intentionally still has build stamp `.16`; bump it only when implementation is ready for review.

## Root cause and review

`MC_FIXQUEUE.current()` returns only the first pending item. Once both fixes are applied, `pending()` is empty, the centre renderer replaces the card with a terminal “queue clear” message, and Hope does the same. There is no selected-item cursor, Previous/Next navigation, or Undo done.

An independent Jules-style design review recommended: keep the item being viewed separate from completion state; retain the existing `current()` first-pending contract; add `selected()`, `select(id)`, Previous/Next, status and undo/restore methods; keep completed items visible; show `Item 1 of 2` apart from `2 / 2 done`; sync Hope to the viewed item without moving the chat card or triggering a voice nudge on navigation; persist selection per mix; reset on a new mix. Stem queue has its own terminal state and needs the same reviewability. This was an agent review, not a claim that the real Jules approved the implementation.

## WIP implementation

The branch adds a selected id and additive queue methods while preserving `current()` for existing tools; centre and Hope cards gain Previous/Next and Mark done/Undo done; completed and dismissed items remain selectable; selection is persisted per file signature. The stem queue gains a selected id, navigation, undo/restore and item list. A queue transition test was added.

Checks already passed on the WIP branch: inline page script syntax, `git diff --check`, all seven `tests/hope-web-search.test.mjs` cases, and the new `tests/fix-queue-navigation.test.mjs` case (eight total). Local preview screenshots: `/private/tmp/aimm-queue-nav-2of2.png` and `/private/tmp/aimm-queue-nav-1of2.png`. They show the completed second item and Previous returning to the first item in the centre and Hope cards. `/private/tmp/aimm-queue-nav-phone.png` shows only the upper page at phone width, so **phone-width queue layout is not yet reviewed**.

## Before merge or deployment

1. Review the WIP code, especially stem queue transitions, Hope selected-item behaviour, persistence, and accessibility. Fix any issues found. The stem flow has not had a runtime interaction test.
2. Render a populated queue at desktop and phone widths, including the final 2/2 state, Previous, Undo done, and Hope synchronisation. The preview HTML `/private/tmp/aimm-queue-navigation-preview.html` contains test-only fixture injection; never ship it.
3. Have Jules review the final screenshots against the spec. Show Kevin the result and get his approval in his own words, as required by `docs/UI_CHANGE_PROCESS.md` for UI changes.
4. Bump the build stamp, update dashboard/status/roadmap/handover, rerun syntax and both test files, then merge/push/deploy and verify the live build. Do not deploy the current WIP commit.

The separate `aimmastersx.com` hostname/cross-device issue remains unresolved and is outside this queue fix.
