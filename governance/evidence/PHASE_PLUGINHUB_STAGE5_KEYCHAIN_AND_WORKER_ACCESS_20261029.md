# Stage 5 synthetic action and development Worker checkpoint — 2026-10-29

## Verified branch and development deployment

GitHub branch `codex/pluginhub-foundation` was checked at source commit `00b07d037fae2f665ba90895a6e2ae3e9a323b5e`. That source corrects the synthetic record ID to the paired local fixture; Jules reviewed the exact source change. The connected Pages branch preview reflects the source commit at `https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/`, deployment `c6dd0988-00b6-4f72-be36-24705fd0f573`.

The current development Worker is built from branch source with Wrangler 4.152.0. Bundle SHA-256: `fc0ddd0a46edde56f8aff14b7ddc6fb59d50e663d45c1e7693607d60f7a7f102`. Worker version `6d360126-d613-407d-a4de-be4498743618`, deployment `ccb7a9bd-3ac9-442b-9095-c9e0791ad48b`, serving at 100%. The owner approved this exact development deployment. It replaces the earlier surgical-bundle-only provenance limitation for the current development runtime. No production deployment or other separately gated external action occurred.

## Synthetic operation state

The signed-in development preview returned the paired development device list and the device-scoped synthetic record. One request was sent for the one synthetic fixture, operation `caebb13c-1f6b-4422-b23c-570b4d8a0e9f`. No other inventory records were requested for this action. The owner selected the isolated `Unused` folder in the diagnostic Companion. Companion prepared a current signed exact-path preview for the synthetic fixture. The source and destination shown locally were reviewed and match the intended fixture-to-`Unused` move. This report intentionally omits local paths and device metadata.

The browser passkey-gated exact-path reveal/confirmation has not completed. Companion’s local **Move to Unused** control remains disabled pending that browser confirmation. No file has moved, no successful passkey assertion is recorded, and the pending operation must be resumed rather than duplicated. Once the browser confirmation succeeds, review the same operation in Companion and use its separate local confirmation; then restore the synthetic fixture and remove diagnostic-only credentials/state. Fresh independent Stage 5 review remains required.

### Passkey prompt follow-up

The existing operation was resumed in the same development preview, and **View exact paths with passkey** was attempted. No Chrome, macOS, or 1Password approval prompt appeared. The 1Password extension showed the saved development passkey entry and a generic sign-in-options notice, but no pending request; its main app remained on All Items. The page’s passkey control is now disabled while its status still requests passkey path review. No assertion succeeded and no file moved. Do not ask the owner to accept a prompt that is not present, repeat passkey enrollment, or create another operation. Diagnose the stalled browser/API/passkey path, then resume this same operation.

## Status and remaining gates

Stage 5 remains **PARTIAL**. Foundation remains **NOT MET**; Stage 6 remains gated. Other Foundation exit evidence and fresh independent end-to-end review remain open. Development-only work used synthetic data; no production deployment or separately gated external action occurred.
