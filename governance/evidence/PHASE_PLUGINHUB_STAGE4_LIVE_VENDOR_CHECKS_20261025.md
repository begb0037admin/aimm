# Stage 4 live vendor status and route checks — 2026-10-25

## Results

Ran the source's opt-in live diagnostics from the tested companion:

- `swift run aimm-journal-check --live-vendor-status` passed. Current public vendor pages yielded FabFilter 14, Voxengo 46, u-he 3, and Valhalla DSP 4 supported product versions.
- `swift run aimm-journal-check --live-fabfilter-route` passed. FabFilter Pro-Q 4 resolved to version 4.13 and an HTTPS macOS DMG route on the adapter's allowlisted official CDN.

No installer was downloaded or opened. The checks did not access remote project D1 or Auth0.

## Limits

This proves those public status pages and one installer route were parseable at check time. It does not prove all 31 parity rows, reliable scheduled cache refresh, signed/digest-verified download, owner-authorized installer execution, complete install verification, browser-to-Mac status parity, or provider-backed account runtime. Foundation remains **NOT MET**; Stages 2–5 partial; Stage 6 gated; 22:47 D1 authorization gate open.

## Source pin

Tested companion source commit: `946ad71df470bf3d4c5ada00de5d9a7ab9ff3f15`.
