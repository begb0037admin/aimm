# PluginHub Test User A session and reverse isolation — 2026-10-26 22:37 UTC

Repository `begb0037admin/aimm`, branch `codex/pluginhub-foundation`. This report records live non-production checks against Worker `aimm-library-api-dev` and D1 `aimm-library-foundation-dev` (`66c91fd6-fae8-43a1-8e3b-372274acd7dc`).

## Authenticated session

Test User A was first selected through Google federation. That login created a new account mapping (`78ef9029-d61b-4e52-b569-57217def2476`) instead of the previously verified Test User A account. No active session for that mapping remains; the additional account row is still present in the non-production D1. It has not been deleted.

The saved Auth0 database Test User A credential was then used for the same development SPA and API audience. The API correctly resolved the existing Test User A mapping `958d0ea1-47c8-4862-999b-614740440ee8`. Browser session exchange, session restore, authenticated `/v1/me`, and CSRF-protected logout succeeded. No token or password was recorded.

## Two-account read isolation

The prior Test User B report proves B-to-A read isolation for a synthetic A-only preference marker. This run proves the reverse direction: a unique synthetic marker was inserted under B; authenticated A requested `/v1/preferences` while supplying B's account ID; the response contained zero B-only markers. The exact marker was deleted afterward.

Final targeted D1 reads found zero leftover isolation markers and zero active browser sessions for A, B, or the extra mapping. The database migration ledger remains current through 0021. The checks were bounded; no broad export was performed.

## Mac pairing checkpoint

The current Mac Companion Preview identifies itself as **Mac mini** and has a saved local scan of 1,641 plug-in format entries. A previous app binary did not contain the new disclosure and began one pairing request when the pairing button was selected. The pending request was not approved or delivered; a bounded D1 count found one unapproved, undelivered request with expiry `2026-10-26T22:44:54.214Z`. No device credential was created and no inventory was synced.

The current local source was rebuilt and ad-hoc signature verification passed. The updated app displays the exact disclosure: destination `https://aimm-library-api-dev.kevinlelitte.workers.dev`; device name and public signing key; 1,641 inventory entries; product names, bundle identifiers, versions, formats, metadata sources and opaque IDs; full paths and folder bookmarks remain local. The action is waiting for the owner's action-time confirmation. The older pending request will expire without approval.

## Local non-production verification

`sh scripts/pluginhub-nonprod-check.sh` passed: signed preview package, Swift build and journal checks, scanner 3/3, API/browser 38/38, disposable local D1/Worker and CORS/auth checks, synthetic cross-account rejection, and Swift pairing, inventory sync, Manual Check, signed reveal receipt, move, restore and recovery receipts. It used disposable local state only and did not deploy. The temporary loopback proxy was stopped, and the temporary Auth0 test-page edits were restored to their exact pre-check local copy.

## Gate

This adds authenticated two-direction preference read-isolation and A session/CSRF evidence, but does not prove remote device-credential isolation or current-Mac inventory parity. The unexpected extra account row also needs owner disposition before any deletion. Pairing approval, remote device credential and sync, remaining Stage 2–5 gates, and a fresh independent end-to-end review remain outstanding.

**Foundation remains NOT MET. Stage 6 remains gated.** No production data, deployment or cutover was used.
