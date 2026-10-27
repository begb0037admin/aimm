# Mac pairing, credential delivery and inventory sync — 2026-10-27

## Result

The development Mac pairing completed after the browser and Companion displayed the same verification phrase and the owner approved it. The browser reported “Device approved”; the Companion reported “Paired securely” and that the complete inventory generation synced.

A bounded, read-only query against the authorized non-production D1 database `aimm-library-foundation-dev` (ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`) found one active `Mac mini` device, one active credential, one current inventory head, and a complete generation with 1,641 records. The query returned aggregate counts and generation state only; no account ID, device ID, credential, inventory row or local path was disclosed. The generation's recorded completion time is `2026-10-25T10:25:07Z`; its subsequent account sync was confirmed by the live Companion and D1 state on 2026-10-27. The existing D1 secret binding was not read or changed.

## Device credential isolation probe

A read-only wrong-device identity probe was prepared to use the paired credential directly from Keychain, send it only in memory to the development API, and request `GET /v1/devices/{different-UUID}/identity`. The macOS Keychain API returned status `-50` before the HTTP request. No credential was printed, copied into project files, or sent; no network request was made. This probe therefore has **no pass/fail result** and remains an open gate. Do not treat the prior synthetic D1 foreign-key rejection as proof of this real credential's remote account isolation.

## Foundation exit

**Foundation remains NOT MET; Stage 6 remains gated.** Remaining evidence includes:

- Real paired-device credential cross-account rejection using a supported app-authorized harness.
- Account-backed browser/Mac/Hope inventory parity.
- Populated-data recovery evidence through a safe non-production recovery path, without rewinding shared D1.
- Remaining approved Stage 2–5 evidence.
- Fresh independent end-to-end Foundation review; the previous independent result was PARTIAL.

No production deployment, cutover, production data access, D1 write or credential rotation occurred in this checkpoint. The 22:47 D1 creation authorization remains resolved; keep its chronology distinct from the 22:51 retention event. No tests or builds were run in this checkpoint.

## Evidence basis

- Live browser result: device approved after the displayed phrase matched the Companion.
- Live Companion result: secure pairing and complete 1,641-entry generation sync.
- Bounded D1 aggregate query: 1 active Mac mini device, 1 active credential, 1 current inventory head, latest generation complete with 1,641 records.
- Keychain isolation probe: blocked before HTTP by OS status `-50`; not a passing check.

