# Auth0 pairing redirect fix and live phrase recovery — 2026-10-27

**Verified at:** 2026-10-27 14:55 UTC  
**Source branch:** `codex/pluginhub-foundation`  
**Source fix commit:** `4a4594ef78e83c9f0f837308654846bb408cee70`  
**Regression test commit:** `b938f40234ba8d8b775f0f03cb0564bb074ebd32`

## Defect and fix

The Auth0 authorization-code redirect returned to `/pairing-preview` with code and state but without the original `pairing` query parameter. The page then rejected the callback before it could exchange the code or restore the pairing details. The preview now saves the pairing ID alongside the PKCE verifier, state and nonce in session storage; on a validated state-matching callback it restores and validates that pairing ID before loading details.

The targeted Worker/API suite passes **20/20**. Wrangler 4.152.0 dry-run passes (888.25 KiB / 159.42 KiB gzip). The fix is deployed to development Worker `aimm-library-api-dev`: deployment `75630f62-31f0-4971-b154-6a6ca7f51eaa`, version `a04b897b-986d-46e5-9822-21926c804769`, created `2026-10-27T14:54:56.14923Z`.

## Live pairing state

The existing development request was resumed successfully. Auth0 sign-in returned to the Worker, the pairing ID was restored, and the approval page now displays the device **Mac mini** and a verification phrase that matches the running Companion. This confirms the callback and request read path. The browser page is still awaiting the owner to enter the matching phrase and approve the device. No approval has occurred yet; no remote device credential or inventory generation has been delivered, and no D1 write from pairing has occurred.

Kevin must compare the phrase visible in both Companion and browser, type it into the browser field, choose **Approve this device**, and confirm the browser prompt. This final action grants the development Mac access to the account inventory and enables Keychain credential delivery plus the disclosed 1,641-entry metadata sync. Stop if Auth0 presents a new `manage:devices` grant. After the owner approval, verify Companion credential receipt, sync completion, and remote account-isolation behavior before proceeding.

**Foundation remains NOT MET; Stage 6 remains gated.** Device-credential isolation, browser/Mac/Hope parity, populated-data recovery without shared-D1 rewind, remaining approved Stage 2–5 evidence and fresh independent end-to-end review are still open. No production deployment, production data access or cutover occurred.
