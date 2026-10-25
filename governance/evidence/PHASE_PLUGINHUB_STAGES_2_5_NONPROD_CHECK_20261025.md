# PluginHub Stages 2–5 — non-production verification

**Date:** 2026-10-25 07:42 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Tested source head:** `c35cb4d13fe057e10428a812589f6466583bb676`  
**Result:** Local non-production check passed  
**Deployment/cutover:** None

## Source identity

Before recording the run, the tested local mirror's Git blob hashes were compared with the latest GitHub branch files. They match:

| File | Blob |
|---|---|
| `library-api/src/index.js` | `e77eb7814cd45fd6dcd45b0e66c9cf077769da33` |
| `library-api/library-account.js` | `144ae953474dd56029f77fd83e15dd5fbbb2f423` |
| `companion/Sources/AIMMCompanionCore/DeviceSync.swift` | `281e0a63db5ede96248b6f56f1bc8d49165ff0ec` |
| `companion/Sources/aimm-companion/AIMMCompanionApp.swift` | `59fd0c0b7272009c6c927917b2390410c67536ca` |

## Checks performed

`sh scripts/pluginhub-nonprod-check.sh` passed:

- Swift companion build and journal/API checks.
- Scanner integration tests: **3/3**.
- Library API and browser tests: **30/30**.
- Isolated local D1 migrations and Worker HTTP health/auth/CORS checks.
- Real Swift pairing and inventory generation sync against the isolated local Worker/D1.
- Manual Check fallback stored with an explicit manual source.
- Local action command claim and signed Finder-reveal receipt accepted by the Worker; the fixture did not reveal a real user file.

The only initial attempt failed because macOS sandboxing blocked Swift package-manifest compilation. The same previously authorized local verification command then ran with its granted execution access and passed.

## Scope of this evidence

This proves the tested non-production code paths above on the stated source head. It does **not** prove provider-backed remote runtime, website/Hope parity against a live Mac scan, automated vendor coverage completeness, installer download/verification, move/restore/Trash/vault/sharing workflows, or fresh independent validation. Foundation exit remains **NOT MET**; Stages 2–5 and the independent review are still in progress; Stage 6 remains gated.

No remote D1 write, provider terms acceptance, credential creation, deployment, merge, or cutover occurred.
