# Mac pairing, credential delivery and inventory sync — 2026-10-27

## Result

The specific development pairing shown in the browser was approved after the browser and Companion displayed the same verification phrase. The browser reported “Device approved.” D1 confirms that this pairing row has approval and delivery timestamps, an active device credential, and the complete inventory head. The Companion had reported secure pairing and sync during the live flow. The earlier unapproved request in the older handover was a separate attempt.

A bounded, read-only query against the authorized non-production D1 database `aimm-library-foundation-dev` (ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`) found one active `Mac mini` device, one active credential, one current inventory head, and a complete generation with 1,641 records. The query returned aggregate counts and generation state only; no account ID, device ID, credential, inventory row or local path was disclosed. The generation's recorded completion time is `2026-10-25T10:25:07Z`; its subsequent account sync was confirmed by the live Companion and D1 state on 2026-10-27. The existing D1 secret binding was not read or changed.

## Current Companion display check — 2026-10-27 15:02 UTC

A fresh read of the open Companion window still showed “Too many pairing polls. Try again shortly” and the old verification phrase; it did not show “Paired securely.” The exact pairing row in D1 is approved and delivered, and the device has one active credential, one inventory head, and 1,641 complete records. This establishes server-side delivery and authenticated sync, but the visible app state is inconsistent and requires reconciliation (for example, verify the current app instance or relaunch and confirm it loads the saved credential). Do not create another pairing while resolving this mismatch.

## Device credential isolation probe

A read-only wrong-device identity probe was prepared to use the paired credential directly from Keychain, send it only in memory to the development API, and request `GET /v1/devices/{different-UUID}/identity`. The macOS Keychain API returned status `-50` before the HTTP request. No credential was printed, copied into project files, or sent; no network request was made. This probe therefore has **no pass/fail result** and remains an open gate. Do not treat the prior synthetic D1 foreign-key rejection as proof of this real credential's remote account isolation.

## Fresh independent review — 2026-10-27

Disposition: **PARTIAL**. The reviewer confirmed record-pin consistency and treated the live D1/pairing observations as operator evidence, not independently reproduced. It confirmed that the real credential isolation probe is inconclusive and identified the need to resolve the report chronology and obtain fresh end-to-end acceptance.

## Foundation exit

**Foundation remains NOT MET; Stage 6 remains gated.** Remaining evidence includes:

- Reconcile the Companion's visible stale polling error with the server-side delivered credential and authenticated sync.
- Real paired-device credential cross-account rejection using a supported app-authorized harness.
- Account-backed browser/Mac/Hope inventory parity.
- Populated-data recovery evidence through a safe non-production recovery path, without rewinding shared D1.
- Remaining approved Stage 2–5 evidence.
- Fresh independent end-to-end Foundation review that reproduces the provider, D1, client-state and isolation evidence; the current review is PARTIAL.

No production deployment, cutover, production data access, D1 write or credential rotation occurred in this checkpoint. The 22:47 D1 creation authorization remains resolved; keep its chronology distinct from the 22:51 retention event. No tests or builds were run in this checkpoint.

## Evidence basis

- Live browser result: device approved after the displayed phrase matched the Companion.
- Live Companion result: secure pairing and complete 1,641-entry generation sync.
- Bounded D1 aggregate query: 1 active Mac mini device, 1 active credential, 1 current inventory head, latest generation complete with 1,641 records.
- Keychain isolation probe: blocked before HTTP by OS status `-50`; not a passing check.

