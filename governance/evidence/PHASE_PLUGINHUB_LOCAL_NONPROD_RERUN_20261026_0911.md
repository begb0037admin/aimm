# PluginHub local non-production rerun — 2026-10-26 09:11 UTC

## Scope and source

Ran `sh scripts/pluginhub-nonprod-check.sh` against the PluginHub branch source at verification follow-up commit `6bd1c770816ce1d9bf6a3d6dddc28fc7b2e2d5a4` (tree `dcd4130a35b6191f87907f769b5451ba79958015`). The script packages a local ad-hoc signed companion preview, runs Swift/Python/Node checks, and creates disposable local D1 state plus a loopback-only Worker. Its fixture data is synthetic.

## Results

- Companion preview package created and its ad-hoc signature verified.
- Swift companion build and journal/sync check passed.
- Scanner tests passed 3/3.
- API/browser tests passed 38/38; JavaScript syntax checks passed.
- Disposable local D1 migrations and loopback Worker checks passed: health, unauthenticated rejection, allowed/hostile CORS, and credential rejection in both cross-account directions.
- The real Swift pairing client completed local pairing and one-time credential delivery; Swift inventory sync and Manual Check observation were accepted by the local Worker/D1.
- The real Swift client claimed a synthetic reveal operation, submitted the encrypted preview and signed receipt, then completed synthetic move and restore operations with post-action inventory sync and signed receipts. The local D1 stored the completed restore and its parent-move-bound receipt.
- `git diff --check` passed for the accompanying source and record changes.

The previous sandboxed attempt stopped during SwiftPM manifest planning with `sandbox_apply: Operation not permitted`; rerunning the repository-authorized local-only script with host permissions completed successfully. This script did not launch the app UI.

## Limits and gates

This is local-only verification. It does not establish Auth0/provider login, access to the old Auth0 tenant, remote account isolation, shared project-D1 recovery, browser-to-live-Mac parity, or production behavior. No provider call, remote D1 read/write, deployment, or cutover occurred. The remote D1 validation/write hold remains **OPEN**; Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 remains gated. Fresh independent end-to-end Foundation validation remains outstanding.
