# Stage 4 version-bound update marks — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Source checkpoint:** `fd45edbd1fff8c142d61aa76a588998f3187cdf9`  
**Foundation exit:** **NOT MET**  
**Stages 2–5:** in progress  
**Stage 6:** gated  
**Deployment / cutover:** none

## Change

Added D1 migration 0020 and version-bound “Mark this version up to date” support. The API accepts a mark only for a version present in a current successful observation for the current inventory generation. The status summary leaves the vendor result and raw update count unchanged, while suppressing the actionable prompt only when the marked version equals the effective latest version. A newer vendor version makes the old mark inactive. The account Library shows the version and time marked and allows clearing or resetting the mark. Saving other account preferences preserves the mark.

Recovery coverage verifies migration 0020 adds nullable mark fields without changing existing saved preference data.

Source blobs:
- Migration 0020: `8fa91a4be653bbf2dbfca816a43e1a29a68b4e17`
- Worker API: `1e22c7839e153dfbec348112f605e919e74093fd`
- Account Library UI: `1388fb15a0a543905a3f432275894ff8dc518d3d`
- API behaviour tests: `3cac8b56e570ddabfc0915122319e3c694bde761`
- Recovery migration test: `a384c246380ea2a3a388c43b0dae6113f2ad3297`
- Browser UI test: `79a31e0c62797308b7da8bb915388cf7067eac54`

## Verification

The focused API, recovery, and browser UI tests passed: 26/26.

The full local `sh scripts/pluginhub-nonprod-check.sh` passed:
- Swift companion build and journal/recovery checks, including mounted cross-volume fallback.
- Scanner integration: 3/3.
- Library API/browser suite: 34/34.
- Local D1 migrations through 0020, isolated local Worker HTTP runtime, CORS and unauthenticated rejection.
- Pairing, inventory sync, Manual Check, signed encrypted-preview submission, and signed reveal receipt against local Worker/D1.

These checks use local disposable state. They do not establish live Auth0/passkey/browser/Mac evidence, provider-backed remote runtime, remote two-account isolation, or remote backup recovery. No project D1 was written, and no service was deployed or cut over.

## Remaining gates

Continue the approved non-production Stages 2–5 work. Complete the outstanding provider/runtime work and remote isolation/recovery evidence, remaining Stage 2–5 parity and action workflows, real browser/Mac evidence, and fresh independent review. Keep Foundation exit **NOT MET**, Stage 6 gated, and the 22:47 D1 authorization gate open.
