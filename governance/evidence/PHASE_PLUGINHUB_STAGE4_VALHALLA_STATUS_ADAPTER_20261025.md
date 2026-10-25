# PluginHub Stage 4 Valhalla version adapter — 2026-10-25 07:54 UTC

**Tested source head:** `92410d023148665128949a204a00e54d6868a60c` on `codex/pluginhub-foundation`.

## Change

Added an allowlisted Valhalla DSP public-version adapter for VintageVerb, Room, Delay and Supermassive. The companion reads only fixed product pages over HTTPS, restricts redirects to Valhalla's host, bounds response size, isolates a failed product page from successful peers, and caches complete and partial catalog results for different periods. It compares numeric version components, reports unsupported products as Manual Check, and reports supported products as errors when their page cannot be read. The vendor-site action uses the same fixed official product page.

This is a status check only. It does not download or install software. The automated fixture tests are offline and make no request to Valhalla.

## Verification

- `swift run aimm-journal-check` — PASS. Includes supported page parsing, update comparison, fixed vendor URL, catalog-client behavior and unavailable-source semantics.
- `sh scripts/pluginhub-nonprod-check.sh` — PASS. Swift companion build and journal checks; scanner 3/3; API/browser tests 30/30; JavaScript syntax; isolated local D1 migrations and Worker HTTP checks; synthetic Swift pairing and inventory sync; Manual Check submission; and signed synthetic reveal receipt readback.
- The repository source files published after the run were checked to have the same blob IDs as the tested local files.

## Source pins

| File | Commit | Blob |
|---|---|---|
| `companion/Sources/AIMMCompanionCore/VendorStatus.swift` | `9752b42a28981959dd3f3028641a86bdd8338a2c` | `17d4f4ce60c316f0518b367eeb040f1118b696e6` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `d6b35dc60b0c806b0c1f7b576e834238c767fa9e` | `9f4a00671bad8ac7144b55805316954e2c316073` |
| `companion/Sources/aimm-journal-check/main.swift` | `92410d023148665128949a204a00e54d6868a60c` | `cfb5f8a20943ae17bebcc9bb23df2c5807a356b5` |

The adapter's product pages are fixed in source: VintageVerb, Room, Delay and Supermassive on `valhalladsp.com`. No live vendor request was made by verification.

## Limits and gate state

This adds one vendor adapter; it does not complete Stage 4's 31-row preference/status parity. Live vendor behavior and live Mac/browser parity remain unverified. Stages 2–5 remain in progress. Foundation exit remains **NOT MET**, the historical independent Stage 5 review remains **PARTIAL**, and Stage 6 remains gated. The 22:47 D1 authorization chronology is unchanged. No project D1 write, deployment or cutover occurred.
