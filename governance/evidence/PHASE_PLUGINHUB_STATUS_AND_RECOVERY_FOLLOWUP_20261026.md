# Stage 3–5 status paging, snapshot integrity and recovery follow-up — 2026-10-26

## Recovery review follow-up — 2026-10-26 09:39 UTC

The independent reviewer found two additional recovery gaps after the first fixes: expired file actions could disappear from the companion queue, and a Keychain write failure could leave a claimed preview unusable. Both now have bounded recovery behavior:

- The companion sends only operation IDs present in its local move/restore journal when requesting recovery. The API returns an expired action only to its active paired device, and only for a claimed move/restore with a stored exact preview, prior owner confirmation, and no receipt. Before the companion resumes file work it rechecks the active credential, server action binding, exact preview digest/expiry and local journal paths/content. The API accepts a signed receipt after expiry only for the same claimed, owner-confirmed move/restore action.
- If secure Keychain storage rejects a newly accepted preview, the companion submits the exact digest to a discard endpoint. The API clears that preview only while the operation is claimed, unexpired and not owner-confirmed, then deletes the encrypted preview payload. The companion reports whether discard succeeded; no file action runs on this path.
- If the recovery journal is missing or unreadable, the app stops queue refresh, preserves stored previews, and reports the journal error instead of claiming that no actions are pending.

Regression coverage verifies preview discard/re-preparation and rejects discard after owner confirmation; the existing local suite exercises expired, journal-backed file-action recovery. The final targeted independent review **ACCEPTED** the journal-read fail-closed fix. That reviewer did not run tests; the local test result below was independently executed by the implementation session.

The full local `sh scripts/pluginhub-nonprod-check.sh` passed after these changes: local ad-hoc app packaging/signature, Swift journal and recovery checks, scanner 3/3, API/browser 38/38, disposable local D1 and loopback Worker, synthetic cross-account rejection, and actual Swift pairing/sync/Manual Check/reveal/move/restore with signed receipts. `git diff --check` passed. This verifies local synthetic behavior only; it does not prove remote provider behavior, current-Mac browser parity, or Foundation exit.

Implementation checkpoint: GitHub commit `2d1adc4230f79d886443e95dadc5f477edba3963`, tree `04595b74b12b921115885890f5e0cd38124e2abf`, parent `917c9b541d0d5a9293c1c01bcf843328adaa10c1`. The implementation blob pins are recorded in the synchronized Foundation evidence package.

No provider request, remote D1 query/write, deployment or cutover occurred. Keep remote D1 validation/write hold **OPEN**, Foundation **NOT MET**, Stages 2–5 in progress, Stage 6 gated. Provider-backed browser session/CSRF and pairing, remote two-account isolation/recovery, current-Mac parity, remaining Stage 5 paths, and fresh end-to-end independent Foundation validation remain open.

## Scope

This follow-up addresses a fresh independent review of the branch at `917c9b541d0d5a9293c1c01bcf843328adaa10c1`. The review was read-only and did not run tests or contact providers. It identified two implementation gaps:

1. Move and restore error handling consulted the restore journal for move operations, so a durable move recovery entry could be missed and a terminal failure receipt could be sent.
2. The account client fetched every inventory cursor but did not compare the collected row count with the generation's declared `record_count`.

## Changes

- Added a journal query that checks `needs_recovery` in the table corresponding to the operation kind. Move errors now inspect file-action records; restore errors inspect restore-action records. If the journal itself cannot be read, the companion retains the pending action and does not send a terminal failure receipt.
- Added synthetic regression assertions that distinguish move and restore recovery records and confirm that a recovered restore no longer reports recovery pending.
- Added fail-closed account snapshot checks for invalid record counts, count changes between pages, and a collected row count that differs from the generation count.
- Added a 225-observation synthetic status test. The account page now renders all returned status observations in 100-row pages with product/identifier search and status filtering; later-page preference writes and search reset are covered. The status tool's existing default response remains capped at 100 records.

## Verification

- `npm test`: **PASS**, 38/38.
- `git diff --check`: **PASS**.
- `sh scripts/pluginhub-nonprod-check.sh`: **PASS**. It built and locally signed the preview app; built and ran the Swift journal checker; passed scanner tests 3/3 and API/browser tests 38/38; migrated disposable local D1; started a loopback Worker; rejected synthetic cross-account credentials in both directions; and exercised actual Swift pairing, inventory sync, Manual Check, reveal receipt, move and restore with post-action sync and signed receipt verification.
- The suite used synthetic fixtures, temporary local D1 and loopback only. No Auth0/provider request, shared/remote D1 query or write, production data, deployment or cutover occurred.

## Independent validation and gates

The first fresh Stage 5 review returned **PARTIAL** and identified the move/restore journal mismatch and missing complete-snapshot count validation. Those defects were fixed and covered by the local suite. A later targeted independent re-review **ACCEPTED** the journal-read fail-closed error-path correction. That targeted acceptance does not replace a fresh end-to-end Foundation review, which remains outstanding. The reviewer did not run tests and did not establish live provider behavior or current-Mac browser parity.

Keep the remote D1 validation/write hold **OPEN**, Foundation **NOT MET**, Stages 2–5 in progress, and Stage 6 gated. Outstanding evidence includes provider-backed browser session/CSRF and pairing, remote two-account isolation, remote recovery, current-Mac/browser parity, remaining Stage 5 paths, and fresh end-to-end independent Foundation validation.
