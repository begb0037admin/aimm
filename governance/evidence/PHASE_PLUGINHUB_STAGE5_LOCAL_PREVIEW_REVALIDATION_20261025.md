# Stage 5 local preview revalidation — 2026-10-25

## Result

The companion now revalidates an accepted action preview immediately before a local action can run. It binds the preview to the account, device, operation, kind, nonce, record ID, exact local journal record, scan generation and preview expiry. It also checks the operation expiry, current local generation, presence of the same record in the current in-memory journal, the device-scoped opaque record ID, filesystem presence, and symlink status.

If any bound value changes, the local action is cleared and the user is told to scan again and request a fresh action. Receipt retry remains available after a completed local action, because receipt retry must not repeat the action.

## Verification

- `swift build` — passed.
- `sh scripts/pluginhub-nonprod-check.sh` — passed.
- API/browser tests: 34/34 passed.
- Scanner integration: 3/3 passed.
- Local Worker/D1 integration accepted the actual Swift command claim, signed and encrypted preview submission, and signed reveal receipt.
- The integration check confirms an unchanged current item passes, while a changed scan generation, changed journal record, and expired preview fail.
- Local migrations were exercised through 0017. The suite used disposable local Worker/D1 state.

## Limits and project status

This is non-production source and local fixture evidence. The test does not open Finder, a vendor page, or a hub app, and it does not prove a real Mac/browser/Auth0/passkey walkthrough, remote account isolation, or remote D1 recovery. No deployment, cutover, or remote D1 write occurred. Preserve the 22:47 D1 authorization chronology unchanged.

Foundation exit remains **NOT MET**. Stages 2–5 and fresh independent validation remain in progress; Stage 6 remains gated.

## Source pins

Branch: `codex/pluginhub-foundation`.

- Device preview binding and revalidation: commit `c08fe8fb6d76d40c92c20fe8801f2dad5e5a4bd3`, blob `bc480d5291f167bb3e59876640a251a0822596c5`.
- Mac action execution checks: commit `f01d95a9dcfaf4113f3b302c973f9d016dd4ca03`, blob `aa2d0ddb462ea9fad9e657f245c51f0c47ca4268`.
- Local Worker/D1 integration checks: commit `e47ec791261fcbbde3a6de118bdbf87ca73ead51`, blob `600ce38b74d263d46055bafe6025cba04e12c30e`.

The tested source is those three blobs plus the already pinned Worker/API, migrations, and test runner. No remote provider configuration or production key was changed.
