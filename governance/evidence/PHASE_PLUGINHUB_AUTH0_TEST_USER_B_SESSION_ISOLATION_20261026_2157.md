# Auth0 Test User B session and synthetic account-scope check — 2026-10-26 21:57 UTC

**Repository:** `begb0037admin/aimm`  
**Branch:** `codex/pluginhub-foundation`  
**Verified branch head before this evidence update:** `fa343323bc3cb1ad7e02197589728a2e205330c0`  
**Environment:** Auth0 development tenant and Cloudflare development Worker/D1 only.

## Runtime session

Test User B (`kevin@lelitte.co.uk`) completed the approved Auth0 Google sign-in and development SPA/API grant. The access token remained in page memory; no token or client secret was recorded.

The development Worker returned B's account ID `a518a090-0965-4796-b8e9-86b3ac3468b1`. Browser session exchange returned 200, session restoration returned 200 for the same account, and logout returned 200 with the session's CSRF token. A D1 check after logout found zero active B sessions.

The first attempt exposed a defect in the temporary loopback test proxy: it combined the two `Set-Cookie` headers. The proxy was changed to forward each cookie separately. The credentialed cross-origin flow between loopback ports then passed. The proxy was allowlisted to health, session, account, preferences, library and device read routes; it forwarded to the fixed development Worker, set the canonical configured site Origin, and emitted no headers or bodies to logs. It was stopped after the check.

## D1 identity and migration state

Cloudflare's read-only metadata call confirmed `aimm-library-foundation-dev`, database UUID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`, created at `2026-10-23T22:47:13.736Z`, in account `f1896a0ef4e88f1f90abcc2cbbdd87f1`.

A read-only query returned all 21 migration names from `0001_foundation.sql` through `0021_restore_actions.sql`, including `0003_browser_sessions.sql`: 21 rows read, zero rows written, `changed_db: false`. No migration was applied.

## Synthetic read-isolation probe and cleanup

Before the probe, both test accounts had zero active devices, settings and marks. A single synthetic hidden vendor mark was inserted directly for Test User A (`958d0ea1-47c8-4862-999b-614740440ee8`) under target key `synthetic-isolation-20261026`. The authenticated B browser then supplied A's account ID to `/v1/me`, `/v1/preferences`, `/v1/library` and `/v1/devices`.

The API still identified the session as B; the A-only marker was not visible; library and device lists were empty. This demonstrates the tested B-side account-scoped read behavior. It does not establish the reverse A-to-B direction or device-credential cross-account behavior. There are no remote devices for either account, and Test User A was not authenticated in this check.

The synthetic A marker was deleted. The orphaned B session from the failed first proxy attempt was revoked by exact account/creation/expiry match. The successful B session was logged out through the CSRF-protected Worker endpoint. Final D1 checks found zero synthetic marker rows and zero active sessions for B. No real Mac inventory or path was sent.

## Limits and disposition

This is partial remote evidence for Auth0-backed Test User B session/CSRF and one-direction account-scoped reads. Remote device pairing, bidirectional authenticated A/B isolation, project recovery, browser-to-Mac parity and fresh independent end-to-end validation remain outstanding. No code was deployed, no production data was used, and no test/build suite was run in this checkpoint.

**Foundation remains NOT MET. Stage 6 remains gated.** The previously owner-confirmed 22:47 database-creation authorization chronology and separate 22:51 retention timestamp remain distinct.
