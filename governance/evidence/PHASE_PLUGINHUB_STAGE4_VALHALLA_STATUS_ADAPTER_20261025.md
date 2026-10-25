# PluginHub Stage 4 Valhalla version adapter — 2026-10-25 07:58 UTC

**Tested source head:** `2334bab111f4ee4c3aaa7cd70f3374f06437646c` on `codex/pluginhub-foundation`.

## Change

Added an allowlisted Valhalla DSP public-version adapter for VintageVerb, Room, Delay and Supermassive. The companion reads only fixed product pages over HTTPS, restricts redirects to Valhalla's host, bounds response size, isolates a failed product page from successful peers, and caches complete and partial catalog results for different periods. It compares numeric version components, reports unsupported products as Manual Check, and reports supported products as errors when their page cannot be read. The vendor-site action uses the same fixed official product page.

This is a status check only. It does not download or install software. The offline fixture tests do not make a network request.

## Verification

- `swift run aimm-journal-check --live-valhalla` — PASS. The adapter fetched its four fixed public product pages and parsed a version for each. This is a read-only GET; it did not download software or submit inventory/status to the account API.
- `swift run aimm-journal-check` — PASS. Offline fixture and journal checks.
- `sh scripts/pluginhub-nonprod-check.sh` — PASS after adding the live-check option. Swift companion build and journal checks; scanner 3/3; API/browser tests 30/30; JavaScript syntax; isolated local D1 migrations and Worker HTTP checks; synthetic Swift pairing and inventory sync; Manual Check submission; and signed synthetic reveal receipt readback.
- The tested checker file was published with the exact blob that was built and run. The local-only suite continues to use fixtures and makes no live vendor requests.

## Source pins

| File | Commit | Blob |
|---|---|---|
| `companion/Sources/AIMMCompanionCore/VendorStatus.swift` | `9752b42a28981959dd3f3028641a86bdd8338a2c` | `17d4f4ce60c316f0518b367eeb040f1118b696e6` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `d6b35dc60b0c806b0c1f7b576e834238c767fa9e` | `9f4a00671bad8ac7144b55805316954e2c316073` |
| `companion/Sources/aimm-journal-check/main.swift` | `2334bab111f4ee4c3aaa7cd70f3374f06437646c` | `edcc4c48594f218e61b9c10c5e64af89ea08ded5` |

## Limits and gate state

This verifies the four allowlisted Valhalla pages from this run's network and the adapter parsing behavior. It does not establish ongoing availability or prove another device's result. It adds one vendor adapter; it does not complete Stage 4's 31-row preference/status parity. Live browser-to-Mac parity and provider-backed remote runtime remain unverified. Stages 2–5 remain in progress. Foundation exit remains **NOT MET**, the historical independent Stage 5 review remains **PARTIAL**, and Stage 6 remains gated. The 22:47 D1 authorization chronology is unchanged. No project D1 write, deployment or cutover occurred.
