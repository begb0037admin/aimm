# PluginHub Stages 2–5 — u-he status and vendor action increment

**Recorded:** 2026-10-24 22:22 UTC  
**Branch:** `codex/pluginhub-foundation`  
**Result:** Source increment verified in the isolated non-production harness; no deployment.

## Change

Added bounded public version checks for three explicitly supported u-he products: Diva, Hive 2 and Zebra 3. The adapter accepts only version text in the supported format from official u-he product pages that also identify macOS support. Unsupported u-he products remain Manual Check; page or format failures remain errors and do not become “current”.

Added fixed official vendor-page routing for those three products in the Mac companion and account action API. The browser now maps the API’s snake-case bundle identifier into the same safe product allowlist. This action only opens the fixed official product page after the normal Mac confirmation; it does not download or install software.

## Source pins

| File | Commit | Blob |
|---|---|---|
| `companion/Sources/AIMMCompanionCore/VendorStatus.swift` | `9b9a26e2331fc76b4f8dd802e65e0efcf25f0d46` | `2bfc7cd21d905a46a2125a9118c9b958ff754c1e` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `9969ca41d6819335c091cf087fc860217aa40021` | `59fd0c0b7272009c6c927917b2390410c67536ca` |
| `companion/Sources/aimm-journal-check/main.swift` | `9178920aa8f70d98c71dab778081156fda0930fb` | `998fbdd986d578ed135d1831cb0a681f9ea6debf` |
| `library-api/src/index.js` | `7ea499140937553370d5dbae15556df712cc0ce5` | `e77eb7814cd45fd6dcd45b0e66c9cf077769da33` |
| `library-api/library-account.js` | `2c0b61762f6d5d01cb9c25f74c42f5d46a671923` | `144ae953474dd56029f77fd83e15dd5fbbb2f423` |
| `library-api/test/foundation.test.js` | `66b031d370cfcbb962fa6df7a5de2e1f59ae9164` | `b29b1a4cb7795612ba6ae03667b7bc340f7dc2bc` |
| `library-api/test/library-account.test.js` | `4287f7f3309c024fc24e5e3d43d2b6786d6dce23` | `53cbc0962cf3406feec2b22b59a436d934902a7c` |

## Verification

`sh scripts/pluginhub-nonprod-check.sh` passed on 2026-10-24. Evidence included the Swift companion build and journal checks, 3 scanner tests, 30 API/browser tests, isolated local D1 migrations and Worker runtime, and local Swift pairing, inventory sync, manual-check and signed-action flows. The first run exposed a browser/API bundle-identifier casing mismatch; the field mapping was corrected and the full check then passed.

## Limits and gates

This proves local non-production behavior only. No remote Worker deployment, remote project D1 write, live filesystem action, installer download, Auth0 change or account cutover occurred. This increment does not complete Stages 2–5 or Foundation. The companion is not signed/notarized; remote pairing/runtime, account-isolation/recovery evidence and fresh independent review remain outstanding. Foundation remains **NOT MET** and Stage 6 remains gated.
