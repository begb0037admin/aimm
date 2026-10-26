# PluginHub Foundation independent review — 2026-10-26 22:40 UTC

## Disposition

**PARTIAL. Foundation remains NOT MET; Stage 6 remains gated.**

The independent reviewer accepted that the current branch evidence package, dashboard, roadmap, status, closeout, and handover pins are internally consistent. The review did not independently reproduce live Auth0 or D1 checks. It treated the recorded remote results as operator evidence.

## Evidence accepted within scope

- Test User A's session exchange, restore, authenticated account read, and CSRF-protected logout are documented in the 22:37 report.
- The new A-to-B synthetic preference-marker probe found no B-only marker in A's response and cleaned up the marker.
- Together with the earlier B-to-A report, synthetic preference-marker read isolation is supported in both directions.
- The local non-production suite is recorded as passing API/browser 38/38, scanner 3/3, companion packaging/build/journal/recovery, disposable local D1/Worker/auth/CORS checks, synthetic cross-account rejection, and local pairing/sync/action-recovery flows.
- The extra non-production account row created during the wrong Google-linked sign-in is disclosed and remains undeleted.
- The first pairing request is disclosed as unapproved and undelivered; no remote device credential or Mac inventory sync is evidenced.

## Limits and remaining Foundation gates

The A-to-B remote probe covered `/v1/preferences` only. It does not prove isolation across every account endpoint, nor device-credential isolation. The reviewer did not independently reproduce the remote provider/D1 claims.

Foundation exit still needs:
1. approved pairing of the current Mac and evidence of Keychain credential delivery plus inventory sync;
2. a remote cross-account rejection probe for the paired device credential;
3. live browser/Mac/Hope inventory parity;
4. project-appropriate populated-data recovery evidence (without rewinding the shared project D1);
5. evidence for all remaining approved Stage 2–5 gates; and
6. fresh independent end-to-end Foundation validation after those gates are evidenced.

The isolated synthetic D1 time-travel recovery recorded previously is useful, but does not by itself satisfy the project-appropriate populated-data recovery gate.

The updated Mac disclosure is open in the app. Action-time confirmation for sending its disclosed 1,641-entry metadata inventory to the non-production API and creating a remote device credential has not been received. Do not continue that pairing action until confirmed. If Auth0 separately asks for a new `manage:devices` grant, that grant also needs action-time confirmation.

## Safety and D1 chronology

The owner-confirmed 22:47 database-creation authorization remains resolved. The distinct 22:51 retention timestamp remains separate. The approved database is the non-production `aimm-library-foundation-dev` (ID `66c91fd6-fae8-43a1-8e3b-372274acd7dc`). No shared-D1 rewind, deployment, cutover, or production-data use occurred for this review.

## Reviewer statement

> Disposition: PARTIAL. The record and pin synchronization is consistent; the remote test results are documented operator evidence that I did not independently reproduce.

This report records the independent review outcome; it does not promote operator evidence to independently reproduced evidence or close any unproved gate.
