# Stages 2–5 live local scan and non-production revalidation — 2026-10-25

**Repository/branch:** begb0037admin/aimm / codex/pluginhub-foundation  
**Starting branch head checked:** c20fc185f7ef7a63320910d1ffd7da42a78f002f  
**Foundation exit:** NOT MET  
**Stages 2–5:** PARTIAL / in progress  
**Stage 6:** gated  
**22:47 D1 authorization gate:** open  
**Deployment/cutover:** none

## Live companion scan

The installed local preview app completed its explicit standard-folder scan on the Mac at 2026-10-25T10:03:37Z. The UI reported 1,641 plug-in format entries across two selected standard folders:

- AU: 538
- VST2: 563
- VST3: 538
- CLAP: 2

The app visibly reported “Nothing was uploaded” and remained unpaired. These are format-entry counts from this one Mac, not canonical unique products and not a browser/Hope parity result. No custom folders were selected and no files were changed.

The status-check buttons correctly required pairing and a complete scan before use. No Auth0 login or account pairing was attempted in this scan.

## Local non-production revalidation

Ran `sh scripts/pluginhub-nonprod-check.sh` from the isolated source mirror. The default managed sandbox stopped at SwiftPM manifest compilation with `sandbox_apply: Operation not permitted`; rerunning the same local command with the previously authorized build scope passed.

Verified:

- Ad-hoc preview bundle and strict code signature.
- Swift companion build and journal checks, including interrupted and cross-volume recovery fixtures.
- Scanner fixtures: 3/3.
- API/browser suite: 38/38.
- Local D1 migrations through 0020 and local Worker health, authentication rejection, and allowed/hostile CORS.
- Local pairing and inventory sync, explicit Manual Check fallback, signed preview and signed reveal receipt.

The fixture run used disposable local D1 state only. It did not read or write remote project D1.

## Remaining Stage 2–5 gates

Real Auth0-to-Mac pairing still needs the development SPA's exact loopback callback `http://127.0.0.1:4173/pair-remote-test.html`. The local companion's vendor-status controls are unavailable until pairing. Remote two-account isolation and recovery remain blocked by the open 22:47 D1 gate. Developer ID signing/notarization, full browser-to-Mac/Hope parity, broader Stage 5 action classes, and fresh independent end-to-end validation remain outstanding.

This evidence advances local Stage 2 scanner/runtime and Stage 3 local inventory evidence. It does not complete any stage or Foundation exit. Preserve **Foundation NOT MET**, **Stage 6 gated**, the open 22:47 gate, and no deployment/cutover.
