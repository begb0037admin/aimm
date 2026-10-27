# Account preview enable control fix — 2026-10-27

## Change

On `codex/pluginhub-foundation`, the account-preview shell was styled with `display:none` while its only enable button was inside that shell. With the feature flag unset, visitors could not reach the button through the page UI.

The shell now remains visible. Its API controls stay hidden until the user selects “Enable account preview”; the existing explicit enable handler still gates account tools, and account reads still require sign-in. This fixes access to the preview toggle without turning the feature on automatically.

## Verification

- Added a regression assertion covering the visible off-state shell, hidden account controls, and visible enable button.
- Ran `node --test library-api/test/library-account.test.js` against isolated copies of the branch-matched module and test. Result: 6 tests passed, 0 failed.
- No deployment, account/API request, database query or write, credential access, or live browser parity claim was made by this check.

## Gate effect

This is a UI availability fix only. It does not prove account-backed browser/Mac/Hope parity. The live paired-credential wrong-device HTTP 401 probe and fresh independent end-to-end acceptance also remain outstanding. Foundation remains **NOT MET** and Stage 6 remains gated.

## Source pins

- Source commit: `f747b109c0a3db93f5c2cafaba3fd917e59e7fb6`
- `library-api/library-account.js`: blob `7cd3d9277f20aa0c16249b11208e12d535b9478b`
- `library-api/test/library-account.test.js`: blob `e009146d2dcfd9f97dce39e12570df4552e2f7c7`
