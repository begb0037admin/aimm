# Independent Stage 2–5 implementation review — 2026-10-25

**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Reviewed commit:** `981f52c37ddad344f1eaf1c390ad9d4e2d30d364`  
**Review type:** independent, read-only source/evidence review; no tests or writes by the reviewer  
**Foundation:** NOT MET  
**Stage 6:** gated  
**22:47 D1 gate:** open

## Findings by stage

### Stage 2 — PARTIAL

The API implements pairing proof, rate limiting, owner approval and device credential delivery. The local report records that Auth0 rejected the loopback callback before sign-in. No credentials were entered; real Auth0-to-Mac pairing and two-account isolation were not demonstrated. The local ad-hoc signature does not establish Developer ID signing or notarization.

### Stage 3 — PARTIAL

The account preview and Hope tools are behind an opt-in feature flag. Local fixtures exercise shared snapshot reads, device/observation labels, path redaction, malformed device ID rejection and UUID normalisation. The reviewer found and independently rechecked fixes for malformed UUID shape, uppercase IDs and a trailing-newline edge. These fixtures do not prove remote account isolation or live browser-to-Mac parity.

### Stage 4 — PARTIAL

The API implements check observations, freshness/status summaries and revision-checked preferences. Local tests cover the implemented semantics. The 31-row UI/status parity and live vendor data have not been fully demonstrated; the review found no clear defect in the inspected status code but did not independently verify live vendor sources.

### Stage 5 — PARTIAL

The API binds supported actions to account, active device and inventory generation and supports signed previews, passkey-bound owner confirmation and signed receipts. Current implemented actions are reveal, vendor-site open, hub launch and move to Unused. The approved architecture also specifies direct download, installer queue/open, restore/Trash, duplicate and old-installer cleanup, vault and sharing action classes. Local move/recovery fixtures do not prove a real paired-Mac action or recovery.

## Overall disposition and limits

**Overall: Stages 2–5 PARTIAL; Foundation NOT MET; Stage 6 gated.** Remaining evidence includes real Auth0 pairing, remote two-account isolation and recovery, live browser-to-Mac parity, broader Stage 5 action coverage and fresh end-to-end validation. The reviewer did not independently access Auth0, the browser, Cloudflare or remote D1, and ran no tests. No remote runtime claim is made here.

The architecture document was found to contain stale status text saying it was a draft and that no companion/account inventory had been built. That status text should be aligned with the current approved design and partial implementation without changing the approved architecture or closing any gate.

No deployment, cutover or remote D1 write occurred.
