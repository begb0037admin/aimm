# PluginHub local non-production rerun — 2026-10-25 20:36 UTC

**Repository:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Published source tree checked:** `722625b8e41340b2b36fff49237ca849acd9508b`  
**Local commit:** `cf83effaedfaa027d1528d3f3bdfc0ad3dfdd902` (same tree as published GitHub head `5fd122020cea91611fb7ab70531c2a05f5c3ad56`)  
**Command:** `sh scripts/pluginhub-nonprod-check.sh`  
**Result:** PASS after using the already approved local SwiftPM build scope.

## Results

- Local companion preview packaged and its ad-hoc signature and `Info.plist` verified.
- Swift journal, installer staging, real redirect-delegate rejection, streaming limits, DMG structure and digest checks passed. No live installer was downloaded.
- Scanner fixtures passed 3/3.
- API and browser tests passed 38/38, including OIDC/session, origin and CSRF rejection, WebAuthn challenge binding, one-time pairing, cross-account isolation, deletion cleanup and capability-gated exact-path preview.
- Disposable local D1 migrations and Worker health, unauthenticated rejection, CORS and synthetic two-account rejection passed.
- Actual Swift client pairing, inventory sync, Manual Check, reveal, move and restore completed against the local Worker and disposable D1 with signed receipts.
- Cross-volume recovery and interrupted restore fixtures passed.

The default sandbox invocation stopped during SwiftPM manifest planning with `sandbox_apply: Operation not permitted`, before tests ran. The same suite was rerun with the existing approved local build permission and passed. This was local synthetic validation only. No Auth0 login/token exchange, remote D1 request/write, production data, deployment or cutover occurred.

## Open gates

Foundation remains **NOT MET**; Stage 6 remains gated. Auth0-backed browser session and two-account remote isolation, real remote pairing, current browser-to-Mac parity, remote recovery, remaining Stage 5 action wiring, distribution signing and fresh independent end-to-end validation still require evidence. The 22:47 D1 authorization gate remains open. No test identity or credential was created; creating those credentials remains separately gated.
