# PluginHub Stage 4 — live vendor adapter validation

**Verified:** 2026-10-25 08:01 UTC  
**Tested source head:** `3a1034526716b981634ff15523a30874f2e90a2e` on `codex/pluginhub-foundation`.

## Live check

Added an opt-in `swift run aimm-journal-check --live-vendor-status` diagnostic. It called the existing bounded, host-restricted public-page clients and verified:

- FabFilter: 14 supported product versions parsed; Pro-Q 4 was present.
- Voxengo: 46 versions parsed; at least one supported Mac product was present.
- u-he: 3 product versions parsed.
- Valhalla DSP: all 4 allowlisted product versions parsed.

The check reads public vendor HTML only. It sends no account data, does not write observations to D1, and does not download or open installers. The regular test suite remains offline and fixture-backed.

## Verification

- `swift run aimm-journal-check --live-vendor-status` — PASS, all four adapters returned the expected data.
- `sh scripts/pluginhub-nonprod-check.sh` — PASS after the diagnostic was added: Swift companion build/journal, scanner 3/3, API/browser 30/30, syntax, isolated local D1 migrations and Worker HTTP runtime, pairing, inventory sync, Manual Check, and signed synthetic reveal receipt.

## Source pin

- Live diagnostic and fixture checker: commit `3a1034526716b981634ff15523a30874f2e90a2e`, blob `f7a7253042c436a958a75e0ed5214c21e2d04388`.

## Limits

This is a one-time public-source verification of four adapters, not complete 31-row status parity or live account/Mac-to-browser parity. It does not establish ongoing availability or enable any direct installer. Stages 2–5 remain in progress; Foundation remains **NOT MET**; Stage 6 remains gated. No project D1 write, deployment or cutover occurred.
