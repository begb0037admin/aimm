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

## Owner-confirmation handoff follow-up

The owner browser now offers passkey confirmation for high-risk action kinds only after the owner views the exact preview. The WebAuthn verify response must echo the same operation ID and preview digest. The paired-device command feed now includes the preview digest, preview expiry, and owner-confirmed timestamp; the Swift client decodes them and has a guard that accepts confirmation only when its operation/account/generation/kind and exact digest/expiry match the local prepared preview.

The complete local suite passed again after this follow-up: API/browser 34/34, scanner 3/3, Swift companion/journal, and isolated Worker/D1 pairing, inventory sync, Manual Check, exact signed preview and receipt. It additionally checked that the Worker returns the exact preview digest/expiry to the device, that owner confirmation matches only that digest, and that altered digest is rejected. The browser confirmation interaction was fixture-tested with a high-risk action response.

This wires the authorization boundary but does not mean a high-risk installer or file operation is enabled: the current API action allowlist still exposes only the existing low-risk actions. A real passkey assertion and device receipt of a real confirmed high-risk action remain untested. Remote Auth0 runtime, account isolation/recovery, live Mac/browser parity, remaining action classes, and fresh independent review remain open. Foundation remains **NOT MET**; Stages 2–5 remain in progress; Stage 6 gated. No remote D1 write, deployment or cutover occurred.

Follow-up source pins:

- Device command authorization decoding and digest guard: commit `a51306df3de50e6c1bb4a6ec2028520b428b5057`, blob `309babc4c49f291a55f9c0c744c44c38c0817be4`.
- Worker command feed metadata: commit `b7198b620bb52ee8c68f2cf40632772577c414f8`, blob `3e7db13dc9f7617611f1545602038ee97e6513f7`.
- Browser exact-preview/passkey confirmation: commit `13c10f8e08d7c38c3403bef7efb398211ae40cd7`, blob `77fd191058161c7f160d1f1373d8d60cdaa4f3cd`.
- Worker/API regression: commit `1f3dafe975f41cf3db66dc1fc415d5d8a6a957cf`, blob `ae3ac957ab0f00025f1cf77552cb400c5c5796bd`.
- Browser confirmation regression: commit `cf2f777b549b2c32e1a15d2ed6c67f0b9042e492`, blob `2abc19f0bac86acac2cf1fe399ec9ecc5d1efbe7`.
- End-to-end local Swift/Worker/D1 check: commit `02880e7a84231442294b0a709aaa7066c16e5b08`, blob `ee6918a07b546436f423f8c17d0002a4a37a6dc3`.

## Companion enforcement follow-up

The companion now records the digest/expiry returned by the Worker beside the in-memory action. On refresh, it compares the command feed's digest and expiry with that local preview instead of submitting the same preview again. The local execution gate also checks those exact fields. For the architecture's high-risk kinds, the shared gate additionally requires an owner-confirmed timestamp bound to the same operation, account, generation, kind, digest and expiry. If a confirmed operation is encountered after the app has lost its local preview, the companion fails closed and asks for a fresh action.

The full local suite passed again after this change (Swift build; API/browser 34/34; scanner 3/3; local Worker/D1 pairing, sync, preview submission and signed receipt). The Swift integration fixture verifies the Worker-provided digest/expiry, rejects stale generation, changed record, altered owner-confirmation digest and expired preview, blocks an unconfirmed synthetic file-changing action, and accepts a matching synthetic owner approval.

The high-risk actions are still **not available**: the API allowlist and companion dispatcher continue to expose only current low-risk actions. The owner-confirmation control is fixture-tested, and the shared authorization guard is ready for these classes, but a real passkey action through to a Mac execution remains unproven. No remote D1 write, deployment or cutover occurred. Foundation remains **NOT MET**; Stages 2–5 and fresh independent review remain in progress; Stage 6 remains gated.

Latest companion enforcement pins:

- Digest/expiry and owner-confirmation guard: commit `33bc522d07888fe8e89f427665199f1d1a8527e6`, blob `397e8f05d8baf9a7f15f23bc40c0ecb66b41cf2f`.
- Mac UI refresh and fail-closed handling: commit `2e9dc538624a3c5d13938736f465c0c5f2ac8360`, blob `b40c77db9fde2933f730dcf7c735282e7dfb3ade`.
- Swift local integration cases: commit `aeeac170cbc33d2fe6cb933e057e5cb9bd5de493`, blob `21b204de37b33bdc00dcc3f06c3d99e25d858ca0`.
