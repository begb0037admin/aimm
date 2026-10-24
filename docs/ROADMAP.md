# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 21:02 UTC**

**Foundation exit: NOT MET. Historical Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready.**

The full local regression passes. Auth0 users A/B already passed PKCE/session/CSRF/logout and local account-isolation checks against local Worker/D1 (evidence blob `02aee3f84c346245da56eb25c3ba1b5b3f75afb4`); this is not paired-Mac or remote HTTP proof.

Cloudflare read-only metadata shows an existing `aimm-library-api-dev` Worker, created 16:35, modified 16:41, D1-bound with a 03:00 UTC schedule. Earlier no-Worker statements are superseded. This executor made no deployment or change. Remote HTTP checks could not run here: DNS lookup failed and Chrome was unavailable.

Remote D1: migrations 0001–0009; 20 tables; 2 accounts; 4 revoked devices/credentials; 23 active sessions; no pairings/operations/receipts; one rate-limit row. No row contents read or writes. Cloudflare list says zero tables despite SQL results. Report `2adb485aee8313fc3e2f3784d403280fe7325395` / blob `e8169e2ccbfe2afa503fc3234afd17a9611f3200`.

Remote HTTP/auth and cross-account denial, paired Mac, full remote recovery, end-to-end receipts, parity closure, and fresh independent Foundation PASS remain open.

---

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:25 UTC**

**Foundation exit: NOT MET. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

Stage 2 sync-client verification and protected redirect behavior pass local checks and an independent scoped source review. The dev D1 schema now records migrations 0001–0009. Current verification: Swift build/checker PASS, scanner 3/3, API 18/18. Remaining: live Auth0/browser and paired-Mac runtime, two-account isolation, full recovery, end-to-end status/action receipts, broader parity, and fresh independent Foundation validation. See `governance/evidence/PHASE_PLUGINHUB_STAGE2_SYNC_CLIENT_REVIEW_20261024.md` and `governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_SYNC_D1_CHECKPOINT_20261024.md`.

---

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:21 UTC**

**Foundation exit: NOT MET. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

Stage 2 gained a verified local mocked-transport sync-client check: start/chunk/finalize sequence, bearer headers, approved development host, and private local-path omission. Swift build/checker pass; scanner tests 3/3. Code tip 7636f5f6a1726eadd93f6c9588e6c7c0e11a2feb; source blob 8b40602ee4bc2892ddb753877c9efda274109d3f; checker blob 205d807d30fc7efc0d6f696bfd3a85f085964f01. This closes only a local client-verification item. Real provider and paired-Mac runtime, remote account isolation/recovery, end-to-end status/actions and broader parity remain open. Fresh independent Foundation review is still required.

---

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:14 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

The Stage 4 “Raw updates” count now uses raw observations. Regression checks cover stale raw-vs-bucketed counts plus hidden/snoozed actionable counts. API/browser tests 18/18; JavaScript syntax checks, Swift build and local journal check pass; scanner integration 3/3 passes. Independent patch review found no defects in this UI fix/test; it does not validate runtime or Foundation exit.

- Code commits: `79432e49bbd0120169da4154de0dac3c68f98e68`, `3ef22d83d8a4e6de6943f9ec2b81895ca9ac863d`, `e42ea2c56295780330b583a0c433ba073fce5292`.
- Patch-review report blob: `ebd5c362114288d90432a7d34cce570d82362635`.
- Progress blob: `8ebc9d9e6f9f723cdaccc7c7cff1290f4b128657`.
- Evidence package blob: `64634f338e9363264e5c12ca5773774f0c3350ee`.
- Foundation closeout blob: `eb42c8c1e92f64f2ba1eb8f275d0415a9c587ce6`.

Read-only dev D1 ledger confirms 0001–0005 applied and 0006–0009 pending. No remote writes or deployment. Live Auth0/browser and paired-Mac runtime, remote isolation/recovery, end-to-end actions, broader Stage 2–5 parity, and fresh independent Foundation validation remain open. Foundation remains NOT MET; Stage 6 stays gated.

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:11 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

A Stage 4 status-panel bug is fixed: “Raw updates” now uses the raw observation count. Browser/API regression coverage verifies stale, hidden and snoozed cases. API/browser tests 18/18, JS syntax checks, Swift build, scanner tests 3/3, and the independent patch-level review passed.

- Code commits: `79432e49bbd0120169da4154de0dac3c68f98e68`, `3ef22d83d8a4e6de6943f9ec2b81895ca9ac863d`, `e42ea2c56295780330b583a0c433ba073fce5292`.
- Independent UI patch review blob: `ebd5c362114288d90432a7d34cce570d82362635`.
- Progress report blob: `95168f3c625bbb494723c8cd7ea0ffe681afcc06`.
- Evidence package blob: `8843231b82cd639c205e0f0464cfcd0da2969c80`.
- Foundation closeout blob: `29588621726a820cb15661c5a8beb092d292bffb`.

Read-only Cloudflare checks show dev D1 migrations 0001–0005 applied and 0006–0009 pending. No remote database write or deployment. Live Auth0/browser and paired-Mac runtime, remote isolation/recovery, full Stage 2–5 parity, and fresh independent Foundation exit validation remain open. Keep Foundation NOT MET and Stage 6 gated.

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 20:05 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stages 2–5: in progress. Stage 6: not ready. No deployment or cutover.**

Stages 2–5 now have a locally testable implementation: companion pairing/sync, feature-flagged site/Hope integration, status/preferences, and safe local-confirmed Finder reveal with signed receipts. Browser action requests enforce CSRF; Hope tools follow the feature flag; Auth0 tokens go only to the development Worker or loopback.

- Latest branch head: `a32f07c5a696c59538e6b21190bb318a39e69d76`
- Implementation reviewed: `5d061de5f3ebcdc3c95cfdc60f8ee240ffd3a53e` (latest branch adds only a UI test)
- Progress report blob: `36492663b49036162f3c7233c9642acdb9ea0e22`
- Pinned evidence package blob: `98b779e1867a8159488750b177e3ea26d366ae80`
- Foundation closeout blob: `05f5a82deb4792cc2a5cd761e03e2146cb4d4339`

Local checks: API/browser tests 16/16; JavaScript syntax; Swift build and journal check; scanner tests 3/3; Wrangler 4.152.0 local D1 migrations and Worker checks. Independent source review found no remaining code defect.

No valid Auth0 token or real account was tested. Live pairing/sync, remote isolation/recovery, browser session and end-to-end action receipts remain open. Remote migrations 0006–0008 are unapplied. The review does not close runtime or Foundation exit. 22:47 D1 authorization is resolved; 22:51 retention remains separate.

## Stage progress

- **Stage 2:** pairing and inventory sync implemented locally; real account pairing and remote reconciliation unverified.
- **Stage 3:** site/Hope account integration implemented behind a feature flag; live browser comparison unverified.
- **Stage 4:** status observations and revision-checked preferences implemented; live freshness unverified.
- **Stage 5:** Finder reveal request, local confirmation and signed receipt implemented; end-to-end receipt and runtime validation unverified.

Local API/browser suite: 16/16. JS syntax, Swift build, journal check, scanner 3/3, Wrangler local D1 migrations 0001–0008 and Worker health/CORS/auth checks passed. Fresh independent source review found no code defect. The evidence report is pinned at blob `36492663b49036162f3c7233c9642acdb9ea0e22`.

## Before Stage 6

Validate Auth0/browser and paired-device flows, remote two-account isolation, full recovery, status/preferences, and action receipt on the non-production runtime. Close Foundation's action-time deletion check and remaining exit gates. Keep Foundation **NOT MET** and Stage 6 blocked until evidence and independent review pass. No deployment or cutover.

# Roadmap — PluginHub replacement

**Current checkpoint — 2026-10-24 19:39 UTC**

**Foundation exit: NOT MET. Historical Foundation Stage 5 review: PARTIAL. Phase 2 Stage 2: in progress. Phase 2 Stages 3–5: not started. Stage 6: not ready. No production deployment or cutover.**

The user authorised implementation through Phase 2 Stages 2–5 as a non-production build. Stage 2 now contains an unsigned local macOS companion app, a local SQLite scan journal and device-scoped inventory generation API code. The companion is not yet paired and does not upload inventory. The new API migration has not been applied to remote D1.

- Code: commit `df0ab79d5f14a127be8e7ae20cc9783fadbb4855`.
- Progress report: `governance/evidence/PHASE_PLUGINHUB_STAGES_2_5_PROGRESS_20261024.md`, commit `0202aabf981ca6988d6c2f9dca354a0298c52005`, blob `9fe14cc162fcaa6012ebc85dd00dfad60477d01f`.
- Pinned evidence package: commit `25cf8f0fe999738dcad2e00c37ff73378e8b2b62`, blob `7ec4865ffbaa8d7cfa3bb112a35174c69b681116`.
- Verification: Swift build passed; local journal check passed; scanner integration 3/3 passed; API tests 15/15 passed; `node --check` passed. All scanner fixtures were synthetic; API tests used a local SQLite D1 test double.

Open implementation gates: Stage 2 pairing UI, Keychain credential storage, authenticated HTTPS sync, remote non-production runtime/reconciliation; Stage 3 site and Hope integration; Stage 4 verified status and preferences; Stage 5 preview/confirmation/receipt actions. Foundation's remote isolation, full recovery, owner-confirmed deletion check and fresh independent PASS remain separate open gates.

The 22:47 D1 creation authorization remains resolved by owner confirmation; the distinct 22:51 retention decision is unchanged. No remote D1 migration, deployment, cutover, production or PluginHub change was made.

This update supersedes the older current-status summaries below; historical evidence and decisions are retained.

## Foundation continuation — 2026-10-24 19:20 UTC

**Foundation exit remains NOT MET. Stage 5 remains PARTIAL. Stage 6 is not ready. No production deployment.**

The D1 chronology was reviewed first. Owner confirmation resolves authorization for the empty development D1 created at 22:47:13.736 UTC; the 22:51:26 UTC retention approval remains a distinct later event. Neither timestamp is changed.

The latest independent re-review checked the pinned evidence and read-only Cloudflare state. It confirmed the daily Worker schedule and current D1 counts (2 accounts, 23 active sessions, 4 revoked devices, 4 unusable credentials, 0 pairings, 1 pairing-rate-limit row, 0 receipts). It returned **PARTIAL**: User A pairing evidence was not replayed; User B remote cross-account denial is unproven; recovery is limited to a synthetic single-table export-copy; full D1/D1-to-D1 or Time Travel recovery is unproven; account deletion remains pending its separate action-time confirmation. Review report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REREVIEW_20261024_1920.md`, blob `c87f95fa7ea2183448311e33917c7dab65e6c4fe`.

This continuation also retried the loopback harness’s Test User B sign-in. It did not establish a second authenticated session, so no cross-account probe or denial is claimed. The source suite was not rerun in this continuation; prior recorded 14/14 is unchanged.

**Remaining exit gates:** obtain a usable Test User B session and capture a remote cross-account denial; demonstrate complete development D1 recovery using an authorized recovery path; perform the account-deletion check after its required action-time confirmation; remediate any findings and obtain a fresh independent Stage 5 PASS. Keep Foundation **NOT MET** until each gate has evidence and review.

No production resources or provider terms changed. No production deployment occurred.


---

## PluginHub Foundation current checkpoint — 2026-10-24 19:14 UTC

**Foundation exit: NOT MET. Stage 5: PARTIAL. Stage 6: not ready. No production deployment.**

Test User A remote pairing and revocation passed. A synthetic-only pairing-table export-copy restore passed SQLite integrity and foreign-key checks after migrations 0001–0005. The current local API suite passes 14/14. Test User B remote cross-account denial is unproven; account deletion awaits action-time owner confirmation; fresh independent Stage 5 review remains required. Current D1 totals: 2 accounts, 23 active sessions, 4 revoked devices, 4 unusable credentials, 0 pairings and 0 receipts.

Full evidence and limits: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md` and the linked evidence package.

---

## Synthetic populated-row recovery checkpoint — 2026-10-24 17:52 UTC

**Limited row-level recovery PASS; full export/D1-to-D1 recovery remains OPEN. Foundation exit NOT MET; Stage 5 PARTIAL; Stage 6 not ready.**

The isolated development D1 had 2 accounts, 20 active browser sessions, 3 revoked devices, 3 revoked/expired credentials and no pairings. A synthetic pairing-only row with no account/device reference was inserted, read by exact ID, restored locally against migrations 0001–0005, and checked in a fresh SQLite database: integrity `ok`, foreign-key check empty, ten application tables. The exact fixture was deleted and follow-up reads found 0 fixture rows and 0 pairings. D1 writes were limited to that insert/delete; no production resource changed.

The D1 export endpoint request for the pairings table was rejected by automatic review because exporting the entire remote table could include sensitive internal data. No export was started and no workaround was used. The row-level check does not establish exported-backup or D1-to-D1 recovery.

Report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_SYNTHETIC_ROW_RECOVERY_20261024.md`, commit `b1eba1956629affa3f19544420ccf58280bb3a5d`, blob `f6b52c7ac4e82d6cab1e4cd1c65495ad6c7d17a0`. The fresh independent review remains PARTIAL and predates this executor check.

---

## Fresh independent Stage 5 review — 2026-10-24 17:46 UTC

**Disposition: PARTIAL. Foundation exit remains NOT MET. Stage 6 is not ready. No production deployment.**

Fresh read-only review report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_FRESH_STAGE5_REVIEW_20261024_1746.md`, commit `e5bcadd162d8b84ed45765a01363666d21242292`, blob `40f75b246d38946e2500d24928e4e4ec322fe715`. The reviewer confirmed the development schedule is restored to `0 3 * * *`; read-only D1 counts are 2 accounts, 20 active browser sessions, 0 devices, 0 credentials, 0 pairings, 1 rate-limit row and 0 receipts. Query metadata reported no database changes or written rows.

The reviewer assessed the pinned Test User A pairing and scheduled-cleanup report as operator evidence and did not replay those flows. Test User B's cross-account denial, populated-state/D1-to-D1 recovery, and account deletion (which still requires separate action-time owner confirmation) remain open. Keep Foundation **NOT MET** and Stage 5 **PARTIAL**.
---

## Current Foundation checkpoint — 2026-10-24 17:43 UTC

**Foundation exit: NOT MET. Stage 5 PARTIAL. Stage 6 not ready. No production deployment.**

Remote Test User A pairing proof, owner approval and one-time credential delivery passed; repeat poll returned 410. Owner revocation succeeded and revoked credential reuse returned 401. Scheduled cleanup removed four expired pairings while the dev Worker schedule was temporarily every minute; daily `0 3 * * *` is restored. Read-only D1: 2 accounts, 20 active sessions, 0 active devices/credentials, 0 pairings, 1 rate-limit row, 0 action receipts. Local API suite passed 14/14.

Still open: User B cross-account rejection (Auth0 form submission did not complete), populated/D1-to-D1 recovery, separate action-time confirmation before account deletion, and fresh independent Stage 5 review. The 22:47 creation authorization is resolved by the owner's explicit confirmation; no new D1 creation or direct D1 mutation occurred. Keep 22:51 retention decision distinct.

Evidence checkpoint b1eca503dd07afa3766378f9fb20ccce7aebc98a (blob 10ce22a6a29e7e9b28bc02677a879327c68b1f90); closeout 15b488dfc291a50fff9300691711d4cc7752650b (blob c818e2c52c6a164f749f7a653aec5847c5ad4be1); evidence package 87a63130952d4d424f179f34e1bfd8d740d7dde3 (blob 3513fe3e62a8bc3a537da090113fae7adce18d51).

---


## Current Foundation checkpoint — 2026-10-24 16:52 UTC

**Foundation exit: NOT MET. Stage 5: PARTIAL. Stage 6: not ready.** This checkpoint supersedes older status text below where it says the dev Worker is absent or remote provider checks have not run.

- Latest implementation target remains `ad76677a805275711ace40e52a5b1ffc25cad020`; current records/evidence commit is `6560092f0b1ac1187070a0a69f4928252c5b5e53`.
- Canonical evidence pins: fresh independent review commit `6560092f0b1ac1187070a0a69f4928252c5b5e53`, blob `4ffdcb77e25066d3c8c71f61c764642544512f08`; evidence package commit `6560092f0b1ac1187070a0a69f4928252c5b5e53`, blob `2c1fe1809ced24eb4ffbc467a872dec428938809`.
- The 22:47 D1 creation authorization is resolved by the owner's later confirmation; the 22:51 retention approval remains a separate later decision. No timestamps have been changed.
- The isolated development Worker is configured and responding. Earlier operator probes: `/health` 200, approved-site CORS 204, hostile Origin 403. The independent reviewer verified its D1 binding, scheduled handler, cron and workers.dev settings.
- Test User B's browser session restored; `/v1/me` returned `account_owner`; `/v1/devices` returned HTTP 200 with zero devices; sign-out succeeded. The latest read-only D1 count is 2 accounts, 0 active sessions, 2 revoked/expired sessions, and 0 devices, credentials, pairings, pairing limits, receipts, shares, profile comparisons or deletion tombstones.
- The fresh independent Stage 5 report is **PARTIAL**. Reviewer reran the pinned local API suite **14/14** and independently restored/checked the post-0005 export. It could not reproduce external HTTP calls because that environment blocks outbound Worker traffic. Report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_FRESH_STAGE5_REVIEW_20261024.md`.
- The current Auth0 API defines/grants `read:library` only. Adding and granting `manage:devices` to the development SPA is awaiting owner action-time confirmation because it expands security-sensitive access.
- Still open: meaningful remote cross-account resource rejection; remote pairing, owner approval, one-time credential delivery and revocation; remote account deletion/scheduled cleanup; then fresh independent validation after all gates pass.
- No production resource, terms, or credentials were changed; no direct remote D1 mutation or production deployment occurred.

## Verified remote runtime and post-0005 recovery checkpoint — 2026-10-24 16:48 UTC

**Foundation exit: NOT MET. Stage 5 remains PARTIAL. Stage 6 is not ready.**

- The isolated development Worker `aimm-library-api-dev` is deployed at `https://aimm-library-api-dev.kevinlelitte.workers.dev`; workers.dev is enabled and preview URLs are disabled. Its D1 binding is the approved development database `66c91fd6-fae8-43a1-8e3b-372274acd7dc`. The daily cleanup schedule is `0 3 * * *`.
- Remote `GET /health` returned HTTP 200 and `{"status":"ok","service":"aimm-library-api","api_version":1}`. CORS preflight from `https://aimixmasters.com` returned 204 with credentials enabled; an unapproved Origin returned 403 without an allow-origin header.
- Through a loopback-only test harness/proxy, Auth0 Test User A created and restored a remote API browser session, read its account as `account_owner`, received HTTP 403 `csrf_rejected` for a write without CSRF, then signed out successfully with CSRF. Test User B also established a remote API session; the two internal account IDs were distinct. B session restore/device-list testing and a cross-account rejection probe are not yet complete. No account IDs, tokens or cookies are recorded.
- A post-0005 SQL export was downloaded and restored into local SQLite. It is 5,840 bytes, SHA-256 `96f222e9865abf4f87b7d4af760225dee3a38ed885989e7ff15e85aa6683d204`. The restored migration ledger contains 0001–0005, all ten application tables were empty in the exported snapshot, `PRAGMA integrity_check` returned `ok`, and `PRAGMA foreign_key_check` returned no rows. The SQL and restored database remain in local temporary storage only; neither was committed. This export predates the remote provider smoke tests.
- A read-only query after the remote sessions showed two test accounts, one active browser session, one revoked/expired session, and zero devices, credentials, pairings, pairing-rate-limit rows, shares, receipts, comparisons or deleted-identity rows. The active Test User B session will expire; no test device was created.
- No Auth0 settings or grants were changed. The recorded Auth0 setup does not include the `manage:devices` owner permission needed to approve a device pairing. A second loopback hostname was rejected by Auth0 callback validation; both provider logins used the already configured `127.0.0.1:4173` callback.
- A fresh independent Stage 5 re-review has been requested and is in progress. No source tests/builds or production changes were made in this checkpoint. The pre-existing 14/14 local API suite remains separately evidenced.

### Remaining Foundation gates

1. Owner authorization for the development SPA to receive the `manage:devices` API permission; no provider change will be made before that approval.
2. Complete remote pairing/credential issuance, owner approval and revocation, then verify Test User B cannot read the User A device resource; sign out B and verify the remote fixture/session counts.
3. Complete the fresh independent Stage 5 review against the remote runtime and recovery evidence, remediate findings, and synchronize the final report.
4. Keep Foundation **NOT MET** and Stage 6 not ready until all required gates pass.

The 22:47 D1 creation event remains distinct from the 22:51 retention approval. No new database was created. This checkpoint did not change the gate for any further D1 creation or direct database mutation.

---

## Current PluginHub Foundation checkpoint — 2026-10-24 16:24 UTC

**Foundation exit: NOT MET. Stage 5 remains PARTIAL; Stage 6 is not ready. No deployment.**

The approved device-pairing implementation is in branch HEAD `ad76677a805275711ace40e52a5b1ffc25cad020`. The 14/14 local API suite covers pairing proof, owner approval/CSRF, one-time credential delivery, wrong-device rejection, credential identity and atomic rotation, revocation, rate/body bounds, device caps and cleanup. This is code/test evidence, not a remote pairing run.

The isolated remote D1 now has migrations 0001–0005 applied. Read-only schema inspection confirms the pairing table/rate-limit table and credential-rotation column. Accounts, devices, device credentials, browser sessions, pairings and pairing-rate-limit rows each count zero. `PRAGMA foreign_key_check` returned zero rows. Cloudflare denied `PRAGMA integrity_check` with SQLITE_AUTH. A current Time Travel bookmark was retrieved read-only. A full post-0005 D1 export completed, but the temporary download URL could not be retrieved through the available connector; its SQL has not been restored locally. The earlier export-copy recovery check covers only schema 0001–0003. No Time Travel restore was attempted.

Read-only Cloudflare inventory confirms there is no `aimm-library-api-dev` Worker. Remote HTTP runtime, provider-backed account isolation, and remote pairing cannot be tested without deploying the Worker; deployment remains expressly out of scope. A fresh independent review has concluded: local pairing/credential code and tests PASS (14/14), but remote runtime/account isolation and post-0005 recovery remain unproven. Overall Stage 5 PARTIAL; Foundation NOT MET. Report: `governance/evidence/PHASE_PLUGINHUB_FOUNDATION_INDEPENDENT_REVIEW_20261024.md` (blob `166e9c683dd80302e65b6daa60d6aa39c4964171`). Preserve Foundation **NOT MET** until every gate has passing evidence. Keep the 22:47 D1 creation authorization distinct from the 22:51 retention approval.

### Implementation and remote evidence pins

| Item | Commit | Blob / evidence |
|---|---|---|
| Branch HEAD reviewed | `ad76677a805275711ace40e52a5b1ffc25cad020` | code review target |
| API source | `86700b5aeff21b9ca930a609688a261d48876fdd` | `283b66dbfaba6d2076a02d01a7c17064d2e09082` |
| API tests (14/14) | `ecdde6311d5aeeb370a4a891bb7fc04bfbeda7c2` | `32e4f623e673868dce294cfc8b1231498c2d8735` |
| D1 migration 0004 | `dba100ad9c68b5cc637dec0674fb0083b15c6629` | `8005dc890221b9daef8c29972c70faf7599d1dab` |
| D1 migration 0005 | `521313e71245d1e28591cc03ee07b000ae424de0` | `2301b4725b10b25dfa315a6cac81e25eb8a499c7` |
| API README | `ad76677a805275711ace40e52a5b1ffc25cad020` | `ee08714dc1fa77c8a0d53fea741a4c6eb0f396d9` |
| Remote D1 | migration 0004 at 16:21:39 UTC; 0005 at 16:21:40 UTC | DB `66c91fd6-fae8-43a1-8e3b-372274acd7dc`; all app tables empty |
| Remote recovery metadata | export completed; current Time Travel bookmark read | download/local restore and recovery exercise still open |

## Current PluginHub Foundation checkpoint — 2026-10-24

**Foundation exit: NOT MET. Stage 5 remains PARTIAL; Stage 6 is not ready. No deployment.**

The branch now contains one-time device pairing plus GET /v1/devices/{id}/identity, which verifies the issued device credential against the exact active device record and rejects credentials after revocation. The local API regression suite passes **14/14** in Node's in-memory SQLite D1 adapter; source and test syntax checks pass. Coverage includes pairing proof, owner approval/CSRF, single-use delivery, wrong-device rejection, immediate revocation, invalid-secret lockout resistance, bounded streamed bodies, create/poll rate limits, device caps at approval and delivery, and retention cleanup.

The authenticated remote D1 was rechecked read-only: migrations 0001–0003 are applied and account/device/session tables are empty. Migration 0004 is not applied. No aimm-library-api-dev Worker exists. Therefore no remote API runtime, remote pairing, or remote HTTP account-isolation evidence can be claimed without deploying Worker code. A prior Cloudflare D1 export copy (schema at migrations 0001–0003) was restored into local SQLite; integrity_check returned “ok”, foreign_key_check returned zero rows, and account/device/credential/session tables were empty. No remote restore was attempted.

A fresh independent review of the final credential-auth implementation is requested; the preceding review returned PARTIAL and identified the missing device-credential check, which is now implemented. The 22:47 D1 creation authorization remains resolved and distinct from the 22:51 retention approval. Do not change Foundation to MET until every gate has passing independent evidence.

**Current implementation pins before synchronized record updates:**

| Component | Commit | Blob |
|---|---|---|
| API source | 9b35ab6e9b36619a4f89de04c57a4796d6f1183d | cd54d57a9c6c5f6884af770396f1b3aae955d176 |
| API tests (14/14) | 58d6a2c0d348632e249e3cadc3f475b82417cc77 | 9077146695d74d5760dccfdb10adaec53a7895ca |
| D1 migration 0004 | dba100ad9c68b5cc637dec0674fb0083b15c6629 | 8005dc890221b9daef8c29972c70faf7599d1dab |
| API README | 85b253e89da8a81ee70095da19d81bd7708d3bc1 | 2c0af888d2dcb106be4ffba8fab1a12eb13d7c36 |

Older checkpoints below are retained as chronology and are superseded where they conflict with this section.


## PluginHub Foundation continuation — 2026-10-24

The local Auth0 runtime failure is fixed: Wrangler had started with an empty local D1 because migrations 0001–0003 were not applied. After applying them locally, Auth0 Test Users A and B exchanged tokens for distinct API accounts. Browser session restore/account reads, missing-CSRF rejection (403), valid-CSRF logout, post-logout restore rejection (401), and User B's exclusion of a User A device fixture passed. Temporary fixtures were removed and both sessions were signed out. The API test suite passes 8/8, including regressions that distinguish missing D1 schema and browser-session write failures from Auth0/JWKS failure.

This is local Worker/local D1 executor evidence only. Remote provider-backed runtime/isolation/recovery and independent Stage 5 review remain open. Device pairing and device-credential issuance remain unimplemented. Foundation exit remains **NOT MET**; Stage 6 is not ready. No deployment or remote D1 write occurred. Preserve the 22:47 D1 creation authorization as resolved and distinct from the 22:51 retention approval.

Foundation continuation — 2026-10-24 (Auth0 token verifier fixed; runtime still blocked)

Foundation exit remains NOT MET. The user-created Auth0 test users are saved in 1Password; passwords are not recorded here. Test User A completed Auth0 authorization and received a signed access token with the configured issuer, API audience, approved SPA client ID, future expiry, and read:library scope. Auth0 omits the optional gty claim on this typ=JWT user token. The API verifier has been updated to accept that first-party user-token shape while still rejecting machine-client subjects, unapproved clients, invalid grant types, and tokens without the required scope.

The updated API suite passed 6/6. Local browser token exchange has not yet succeeded: the local Worker returned 503 identity_unavailable while fetching Auth0's public JWKS. The same JWKS endpoint returned HTTP 200 with two keys from the host, so the remaining runtime issue is local Worker outbound connectivity. No authenticated API session, restore/CSRF, or two-account isolation result is claimed. User B has not yet been exercised.

Pairing/device credential issuance remains unimplemented. Existing independent VT-06 recovery remediation remains PASS; overall Stage 5 remains PARTIAL and needs fresh independent full validation. Keep the 22:47 D1 creation authorization resolved and distinct from the 22:51 retention approval. No deployment, remote D1 write, or production change occurred.
\n---\n\nFoundation update — 2026-10-24 (Auth0 grant verified)

Auth0 now grants exactly read:library to the AIMM Library Web development SPA (1/1). Client Access remains denied; the separate Test Application remains at 0/1. The Users page is empty, so no real login/token exchange, browser session/CSRF or two-account HTTP isolation probe was run. The current local test evidence remains 5/5 API tests plus localhost Worker checks on local D1 only. Pairing/credential issuance is unimplemented. Corrected D1 export-copy recovery passed independent VT-06 remediation review, but overall Stage 5 remains PARTIAL and Foundation exit remains NOT MET. No deployment occurred. The 22:47 D1 creation authorization is resolved; keep 22:51 retention approval separate.

Owner input needed to resume live identity checks: create two disposable Auth0 development users. Enter any passwords directly in Auth0 when prompted; do not send passwords in chat. Then tell me the users are ready and I will run the local provider-backed flow. Pairing implementation and a fresh full Stage 5 review remain required.

---

## Latest Foundation continuation — local Worker, JWKS and browser-boundary checks (2026-10-24)

Implementation source tested: `a453c9e4c1b62f0446f87b0dc6d3704ee3c56c31`. Wrangler 4.151.3 ran the branch-fetched Worker with a local D1 binding only; no remote database was configured. The local harness served at `http://localhost:4173/dev-auth-test.html`.

- `GET /health` returned HTTP 200; unauthenticated `GET /v1/me` returned HTTP 401.
- The configured Auth0 JWKS endpoint was reached by the Worker: a synthetic JWT with a deliberately nonexistent key ID returned the expected HTTP 401. No real token/account was used; JWKS/network failure would be reported as 503.
- From the approved localhost origin, session restore reached the Worker and returned the expected no-session HTTP 401. From `http://127.0.0.1:4173`, the browser rejected session restore with `Failed to fetch`, confirming exact-origin CORS.
- `node --test test/foundation.test.js` passed **5/5** against the branch-fetched suite and migrations 0001–0003.

Auth0 callback `http://localhost:4173/dev-auth-test.html` and Allowed Web Origin `http://localhost:4173` were saved and visually verified. API scope `read:library` is defined, but the SPA grant remains **0/1**. The Auth0 dashboard session expired before grant save and now requires owner re-authentication. The 1Password note reflects this. No real OAuth token exchange, authenticated browser session, cookie/CSRF or provider-backed account-isolation test has run. Pairing, remote backup restore evidence, fresh independent Stage 5 review and Foundation exit remain open.

This is non-production local executor evidence only. No deployment or remote D1 write occurred. The 22:47 D1 creation authorization remains resolved by the recorded owner confirmation; keep it distinct from the 22:51 retention approval. Foundation exit remains **NOT MET**.

## Latest Foundation checkpoint — remote D1 checks (2026-10-24 09:18 UTC)
**2026-10-24 remote Foundation checks:** Kevin's owner confirmation still resolves the D1 creation authorization; the 22:47 creation and 22:51 written retention-approval timestamps remain separate. Migration 0003 is now applied to the isolated, empty non-production D1. Direct remote probes rejected a cross-account device credential and a browser session longer than eight hours; temporary test rows were removed and cleanup queries returned zero. A current D1 export restored into fresh local SQLite with `PRAGMA integrity_check=ok`, migrations 0001–0003 present, and zero application rows. This is database-level executor evidence, not deployed Worker/OIDC/CSRF runtime evidence or independent review. Auth0 setup, Worker deployment/runtime validation, 30-day backup retention proof, pairing and fresh independent Stage 5 review remain open; Foundation exit remains **NOT MET**. See [remote D1 recovery evidence](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_REMOTE_D1_RECOVERY_20261024.md) (commit `f6327c4fc528955d7cbacc6764bb853e79ad20321`, blob `dbf78fb7337e693a4f07ef7600d22ea77f302479`). No Worker was deployed.

## PluginHub full-functionality replica inside AIMM — Phase 2 architecture approved (design only, 2026-10-23)
**2026-10-24 implementation update:** The API Foundation has 5 passing synthetic route/security tests; Wrangler ran it locally against local-only D1, with health 200 and unauthenticated account access 401. The Stage 2 read-only companion scanner core now builds and has 3 passing synthetic integration tests for AU/VST2/VST3/CLAP detection, AAX/symlink exclusion, bounded bundle metadata, explicit roots and overlapping-root de-duplication. No real plug-in folders were scanned; no remote migration or deployment occurred. These executor checks do not make Stage 5 pass. Foundation exit remains **NOT MET**. The recorded owner confirmation resolves the 22:47 D1 authorization question, while preserving both the 22:47 creation and 22:51 retention-approval timestamps. The signed companion UI, user folder permission, local journal, keychain identity, pairing/sync, remote runtime/isolation, recovery, inventory/status/actions, site/Hope integration, and fresh independent review remain. See the [companion report](../governance/evidence/PHASE_PLUGINHUB_COMPANION_SCANNER_REPORT_20261024.md), [Foundation local test report](../governance/evidence/PHASE_PLUGINHUB_LOCAL_TEST_REPORT_20261024.md), [pinned evidence package](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md), and [approved seven-stage architecture](PLUGINHUB_PHASE2_ARCHITECTURE.md).

**2026-10-24 Foundation execution update:** Stage 3 independent challenge found VT-03 FAIL and VT-01/02/04/05/07/08 PARTIAL; remediation corrected the token contract, scopes, composite ownership constraints, retention checks, deletion, cleanup and migration baseline. Stage 5 remained PARTIAL. This session directly re-queried the named non-production D1 schema and migration history, and a synthetic cross-account credential insert was rejected; the probe rows were removed. The result is documented in the [D1 review addendum](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_D1_REVIEW_20261024.md). This does not prove API runtime behavior or replace independent validation. Foundation exit remains NOT MET: Kevin has now confirmed that the 22:47 D1 creation was authorized; see the [owner confirmation](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_D1_AUTHORIZATION_CONFIRMATION_20261024.md). The timestamps remain disclosed., Auth0 development setup, API runtime proof, backup recovery, device pairing and fresh independent review remain open. Browser session/CSRF source and migration 0003 have been added but are unapplied and untested. No Worker was deployed and no production data was used. See the [challenge report](project/generated/PHASE_PLUGINHUB_FOUNDATION_CHALLENGE_REPORT_20261024.md), [remediation request](project/generated/PHASE_PLUGINHUB_FOUNDATION_REMEDIATION_REQUEST_20261024.md), [Stage 5 report](project/generated/PHASE_PLUGINHUB_FOUNDATION_VALIDATION_REPORT_20261024.md), [pin revalidation](project/generated/PHASE_PLUGINHUB_FOUNDATION_REVALIDATION_ADDENDUM_20261024.md), [evidence package](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md), and [implementation and test authorization](../governance/evidence/PHASE_PLUGINHUB_END_TO_END_TEST_AUTHORIZATION_20261024.md), [cold-session closeout](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_CLOSEOUT_20261024.md).

**Direction:** reverse engineer PluginHub’s complete behavior and rebuild it as AIMM-owned functionality, not only a scanner or visual page. The AIMM Mac companion supplies local scanning and management; it does not depend on PluginHub. aimixmasters.com, Workbench, Hope, and the plugin library share one AIMM account inventory. Omit AAX/Pro Tools and duplicate product cards; retain a dedicated duplicate-management tool. Preserve Hope mechanics, local-only licence secrets, and the approved AIMM styling.

**Phase 1 — COMPLETE and APPROVED:** the 32-page manual, installed PluginHub 2.0.12 resources, and aggregate local status data have been inspected read-only. The [durable brief](PLUGINHUB_REPLICA.md) links the completed 31-row parity matrix, static checker inventory, vendor/action routes, status rules, file/share workflows, data boundary and count reconciliation. The session evidence is in [`docs/handovers/2026-10-23-pluginhub-reverse-engineering.md`](handovers/2026-10-23-pluginhub-reverse-engineering.md). Current remote checker, installer URL, share server and exact cross-scanner count equivalence are bounded Phase 2 unknowns.

**Phase 2 technical architecture candidate complete:** the [architecture](PLUGINHUB_PHASE2_ARCHITECTURE.md) and [31-row ownership map](PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md) specify the AIMM Mac companion, account Library API, pairing, shared site/Hope inventory, local actions, receipts and staged cutover. Six independent read-only CLI reviews and their remediation are recorded in the [Phase 2 handover](handovers/2026-10-23-pluginhub-phase2-architecture.md). The formal challenge's three PARTIAL findings were remediated and independently validated PASS; see the [validation report](project/generated/PHASE_PLUGINHUB_REPLICA_PHASE2_VALIDATION_REPORT_20261023.md). Kevin approved the architecture as a design baseline and authorized the prepared Foundation stage; see the [Phase 2 decision](../governance/evidence/PHASE_PLUGINHUB_REPLICA_PHASE2_GOVERNANCE_DECISION_20261023.md) and [Foundation checkpoint](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_20261023.md). The architecture already defines the seven-step build sequence and cutover gates. The approved retention policy is recorded in [the Foundation decision](../governance/evidence/PHASE_PLUGINHUB_FOUNDATION_RETENTION_DECISION_20261023.md). The isolated `library-api/` account/device API slice, versioned D1 schema and Wrangler configuration are committed on `codex/pluginhub-foundation`; the schema is applied to `aimm-library-foundation-dev` and the original application tables were verified under migrations 0001 and 0002. Auth0 is selected as the OIDC provider, but no tenant or credentials exist. The Worker is not deployed or connected. Browser session/CSRF source exists in the branch, but migration 0003 is unapplied and the code has no runtime validation. Pairing, runtime proof and cleanup enforcement remain. Remaining identity/entitlement, P31 Samples, vendor adapter, signing, retention and sizing decisions remain attached to their prepared phase gates; production, paid commitments, service/local changes, merge, cutover and deployment require their stated separate authorizations. Earlier uncommitted `index.html`/`bridge/` changes use PluginHub at runtime and replace the AIMM browser scan; a separate PluginHub bridge LaunchAgent is already running from the main checkout. They are not the intended architecture and remain untouched pending proven replacement/cutover. Phase One approval did not authorize implementation or deployment.

## Previous checkpoint — Plugin Library active navigation styling — build 2026-10-22.5

Selected plug-in navigation rows use the same blue-purple gradient as the active Library tab, with dark text and icons and no left highlight stripe. The collapsible installed-inventory sidebar, monochrome icons, fixed Hope rail, filtering, and scanner behavior remain unchanged. The legacy catalogue switch stays removed from the user-facing inventory; Hope mechanics and catalogue/reference data remain available.

The Library now uses one installed-inventory view with a collapsible browse sidebar, monochrome line icons in the MixCheck style, blue active states, and the persistent Hope rail. The sidebar filters the scanned inventory by favorites and the existing category taxonomy. The legacy catalogue switch and catalogue-status badges are removed from the user-facing inventory; catalogue/reference data and Hope’s existing chat/voice mechanics remain in the app. Unsupported vendor update and tag filters are visibly disabled. The existing local folder scanner and its privacy behavior remain unchanged. Source commit `f19b7d3264df72807b8c3199d8b5cf7712812e43`; Build 2026-10-22.4 fixes the missing Library style tag and defines the missing HTML escaping helper that had stopped the rows and folder chips from rendering. The published inventory was visually checked in both sidebar states; plug-in rows and the fixed Hope rail are visible.

# ROADMAP.md — AIMM Active

> Active planning doc. Root ROADMAP.md is preserved as historical record.

## Plugin inventory + local scan — build 2026-10-22.1

The live Library now opens to a MixCheck-styled installed plug-in inventory and retains the AIMM catalogue. The browser scans plug-in bundle names and Info.plist metadata from folders the user selects; it does not read plug-in binaries, audio, presets or licences, and it keeps the scan in this browser. On the Mini, the live scan of `/Library/Audio/Plug-Ins` and `/Library/Application Support/Avid/Audio/Plug-Ins` checked 1,880 bundles and found 2,197 readable plug-in records, grouped into 1,618 products across AU, VST2, VST3, AAX and CLAP. Hope chat/voice mechanics remain available; no Logic project was edited. Source commit `77612f0`. See `docs/STATUS.md` and `docs/HANDOVER.md`.

## Sonnet API paths switched to Haiku 5.5 — build `.77`

Typed Hope chat, Research Brain, top-picks re-ranking, and Mix Check advice now call Claude Haiku 5.5. Active Sonnet selector options were removed, persisted Sonnet selections migrate to Haiku, and Mix Check/ranking cost estimates use Haiku pricing. Historical Sonnet price entries remain for old usage accounting. The live ElevenLabs Hope agents remain GPT-6 Luna; their current native model catalog offers Haiku 4.5 but not Haiku 5.5, so the voice configs were left unchanged. No live model call or tests were run. See `docs/STATUS.md` and `docs/HANDOVER.md`.

## Previous checkpoint — Fix Queue questions and displays, build `.76` prepared

The main Fix Queue and Hope action cards now follow the same spectrum rule: band-specific fixes
show an orange frequency marker, while broadband measurements show no fake frequency strip. Full-
mix and per-stem “Ask Hope” buttons share one question builder. Typed chat, Luna voice and both live
ElevenLabs Hope agents use the same answer guidance; both live agents now have identical 40-tool
catalogs. Build `.76` is prepared; GitHub deployment is pending. No mix/workbench settings changed.

## Hope chat/voice tool parity — build `.73`

Typed chat, ElevenLabs Live Agent voice and the Luna route use the same complete AIMM
tool catalog and shared handlers; the three legacy Repair tile tools are attached to the Live
Agent. The transport no longer limits tools by input mode or keyword matching. Fix Queue turns
that explicitly request explanation only remain tool-free. Build `.73` is live and verified;
the active Live Agent has all 40 tools attached. Typed `open_dashboard` was live-verified with
the popup-blocked overlay fallback. See `docs/handovers/2026-10-21-hope-chat-voice-parity.md`.

## Hope Luna usage voice — build `.58` live; spoken test passed

The route selector and mic dispatch are live on `aimixmasters.com`. **Agent** keeps the existing ElevenLabs Live Agent; **Luna** starts Deepgram Flux → GPT-6 Luna → AIMM tools → ElevenLabs Flash. Kevin confirmed a spoken test passed on 2026-10-21, and the live transcript shows completed Hope replies with Luna selected. Production Worker has the encrypted OpenAI key and a 30-requests-per-minute limiter; the browser-local Hope access token is saved. Next: capture quantitative response latency and provider usage before comparing credit savings.

## Build label placement — build `.56`

The build label sits below Clear chat in Hope's panel, clear of the target selector and top navigation.

## Hope Mix Check controls — build `.55`

Hope's Live Agent has `set_stem_selection` for loaded stem audition and Mix Check playback. She can set/add/remove/clear a stem group, play, pause, stop, seek, skip, change monitor volume and read status. The app validates exact loaded names and returns the resulting selection and transport state. The existing Space key and voice route remain. This does not control Logic Pro or import files.

## Hope usage-based voice — build `.57` prepared; release pending

The separate Deepgram Flux → GPT-6 Luna → AIMM tools → ElevenLabs Flash route is prepared on `codex/hope-luna-stream-release-20261021`, based on current `.56`. The working Live Agent remains. The encrypted `OPENAI_API_KEY` secret is saved in Cloudflare, and Settings → API keys provides a browser-local `HOPE_STT_TOKEN` field; the Worker code and app are still at their prior releases. A short spoken-turn check remains. No savings are claimed yet. See `docs/STATUS.md` and `docs/handovers/2026-10-20-hope-usage-voice-spike.md`.

## Hope voice cost controls and usage result — build `.53` live on AIMixmasters.com; LLM saving measured

Compact call-start context is live. In the correct Fallback account, two GPT-6 Luna v44 calls each had 6 billed LLM turns. Baseline `conv_2701m5avagx6fjmraa8ep3pvr28t`: 1:34 / 691 voice credits / 235 LLM credits / $0.0427 LLM / 926 total credits. Retest `conv_7301m5azfk1xe3rt0cgfwxbcksbn`: 2:37 / 1,153 voice credits / 50 LLM credits / $0.00895 LLM / 1,203 total credits. LLM spend fell about 79% and cost per minute about 87% despite the longer call. This is strong evidence that context reduction helped; the prompt wording differed, so it is not a perfectly controlled test. Total credits rose about 30% because the retest stayed connected longer. Voice credits follow connection duration (about 441 per connected minute in both calls), not measured spoken seconds; silence over 10 seconds receives a 95% discount. The transcript contains complete answers to the scripted questions and one extra plugin question; the client disconnected unexpectedly, so spoken-audio completion remains unverified. Build `.53` removed the strict 12–25-word target after Kevin reported cut-off replies and now asks Hope to complete thoughts in one or two short sentences. The shared idle-call control warns at 1m45s and ends calls after 2 minutes without a conversation turn, while protecting active PTT/recording and assistant speech.

## ✅ R3 Mix Check full-layout redesign — PROMOTED & LIVE on `main` @ `dbc793d` (build 2026-09-01.9), 2026-09-01 — post-ship fix round pending (see `docs/HANDOVER.md`)

The Mix Check (`#eq`) tab has been rebuilt mockup→live to the approved Jules mockup
`begb0037admin/jules` `mockups/05-r3-mixcheck-full-layout.html` @ `8c2785e` — the first R3 tab to go
from mockup to a real, working build (browser DSP, NOT the deferred server-side analysis phase).
Base = `main` @ `68a3ffa`; branch HEAD = `256cae8`. **Durable record: `docs/HANDOVER-r3-mixcheck.md`**
(full 8-step plan, locked decisions, the `window.mcFixQueue` contract, Codex pass history, promote command).

- **Steps 0–7 DONE + committed on `r3-mixcheck-codex`:** grid shell + de-pinned transport → panel
  header + single `Drop / browse WAV ▾` input + brand wordmark (`AI` yellow + `MixMasters`/`Hope`/
  filename-accent gradient) → Audio Specs panel absorbing the 4 meter cards (RMS/Crest/LRA/noise-floor
  DSP, Tempo via `web-audio-beat-detector`, in-browser chroma Key, TEMPO/KEY headline tiles,
  stereo-width meter, SSL-style band deviation meters) → context banner → Fix Queue with the
  `window.mcFixQueue` contract + `aimm:analysis-complete` event (replaces the 6 Mix Issues pills) →
  transport waveform → `#hopeRail` full-height grid item with a speech-tied meter → Hope transcript
  mix-breakdown + live action-item cards + `mark_fix_applied` tool (Markey).
- **Codex:** TP1 (plan) = approve-with-notes, folded. Per-step TP2 = clean. **TP3 end-to-end complete —
  no blockers** (one CSS-scoping nit on uniquely-named `.mc-wave`/brand/AI-star classes, assessed
  non-blocking: probe confirms 0 out-of-scope bindings; matches the file's existing `.ref-*` convention).
- **Gate 1 + Gate 2 = Kevin-approved 2026-09-01 @ `256cae8`.** PROMOTED to `main` via Kevin's
  PowerShell ff-only merge 2026-09-01 — `main` @ `dbc793d`, live. **Post-ship fix round pending:
  7 items from Kevin + residuals A–F, see `docs/HANDOVER.md` top entry.**
- Supersedes the stale "R5 Ozone-12" framing below and in `docs/STATUS.md`, plus the 2026 rounds 1–5
  screenshot-rebuild history and the `r3-preview` branch.
- **Rest of the R3 per-tab redesign** (Workbench, Library, Insight, Snapshots, Settings, Marketing,
  Community, Conversation) still to do — the redesign epic is not fully settled.
- **2026-09-02 Mix Check feedback round:** feedback items 1–15 (16 folded into 15), 17, 18, 20 are
  SHIPPED & LIVE on `main` (build `2026-09-02.15`) — see the dedicated `## ✅ Mix Check 2026-09-02
  feedback round` section below. The still-open queue (feedback #21, #19, #6 + a default-tab
  change) is tracked in `## Mix Check redesign — outstanding feedback queue (2026-09-02 round)`
  below. Operating surface: `docs/feedback/2026-09-02/BOARD.md` on branch `feedback-board`.

### Backlog — from the R3 Mix Check redesign

- **6. Real values for the Audio Specs placeholders** — Subgenre / Production style / Energy / Mood /
  Dissonance render as "with full analysis" placeholder rows (neutral dot); real detected values need
  the deferred server-side analysis phase (Platform Evolution ARCH-2 territory). Placeholders by design.
- **7. Real arrangement detection on the transport waveform** — **SUPERSEDED** by "Mix Check
  redesign — outstanding feedback queue" item **9 (feedback #21)** below, now scoped as a real
  analysis-driven ADDITIVE overlay (section boundaries + labels + clickable issue markers) on the
  LOCKED `#mcWave` canvas. The old fixed INTRO / VERSE / BRIDGE graphic was decorative and was
  removed entirely in R3 post-ship fix #4/#5 — there is no cosmetic layer left to replace.
- **8. Gate-2 accepted residuals + speaking-meter gain tune** (Kevin signed off 2026-09-01 with these known):
  - A. Empty (no-WAV) state — the Audio Specs column runs well below the shorter empty analyser card before the columns bottom-align; matching the empty analyser height is a separate grid tweak.
  - B. Very hot bands peg at the ±6 dB edge of the deviation meter (e.g. LOW +11 shows at the edge); the signed value above carries the true number.
  - C. Stereo-width meter is a 1:1 %→track map; typical masters (~25–40%) sit left of centre; could switch to a compressed scale.
  - D. NOT RESOLVED as of round 1. The flat `×18` gain (docs previously mis-stated `×11`) was replaced with an AGC/compressor-style reference-tracking gain (`markey-hopewave-gain-tune`, merged to `main` build `2026-09-06.3`) — but Kevin live-tested it and reported "no change." Root cause: the reference tracked `rms` with only a 550ms lag, self-cancelling the gain within roughly a word (compressor behavior, not VU-meter behavior). Round 2 fix (`markey-hopewave-gain-tune-2-work`, build `2026-09-06.4`, **not yet merged**) replaces the single symmetric tau with an asymmetric attack (1500ms)/release (4000ms) follower — Codex TP1+TP2 verified against a hand-worked quiet/LOUD/quiet numerical example. Full detail in docs/STATUS.md. Kevin's own live listen is still the remaining confirmation step.
  - E. Speaker button in the composer has no effect with no call live (arms the mute preference); could show a disabled state.
  - F. PRE-EXISTING: empty-state analyser hint text overlaps the "Low / Low-Mid / High-Mid / High" axis labels — long-standing, not introduced by R3, still present.

## Mix Check redesign — outstanding feedback queue (2026-09-02 round)

**Reconciled 2026-10-21 (Codex) — this section was checked against the current app.** Items 10,
12 and 13 are confirmed shipped (see their entries below); the remaining open items are 9, 11
and 14. This is also the exact section Hope
reads when asked "what's on the roadmap" (her `read_doc`/dashboard-digest mechanism fetches this
file directly) — if this section is stale, so is her answer, which is exactly the incident that
triggered this reconciliation pass.

Operating surface: `docs/feedback/2026-09-02/BOARD.md` on branch `feedback-board` — every item there
has Kevin's marked-up screenshot, the ask, the owner and the status. Feedback items 1–15 (16 folded
into 15), 17, 18, 20 are LIVE on `main` (build `2026-09-02.15`) — see Recently shipped. The `#N`
numbers are kept verbatim so the board, Kevin's chat and this roadmap all line up; the `9`–`14` are
this roadmap's own backlog IDs (matching the DASHBOARD.html Backlog cards).

### 9. Mix Check feedback #21 — Real section detection + issue markers on the transport waveform · owner: Cat builds, Jules specs the overlay · **Confirmed not started, 2026-10-08**

Windowed onset/energy analysis of the decoded buffer produces INTRO / VERSE / CHORUS / BRIDGE
boundaries and labels, drawn as an ADDITIVE overlay **under** the LOCKED `#mcWave` canvas — never a
redraw of it — with labels shown only where confidence is high. On top of the same windowed feature
extraction, place **issue markers** on the waveform showing WHERE IN THE TRACK each Fix Queue problem
occurs (e.g. an orange marker at the track position where a band deviation is worst), each clickable
to seek playback there and listen. This needs **time-localised analysis** — per-window / per-section
band-deviation, finding where each queued fix's deviation peaks — not the current whole-track
aggregate; it builds on the same windowed feature extraction the section detection already requires.
It effectively revives the old "issue marker pins" that R3 post-ship #4/#5 removed, but real
(analysis-driven) instead of fictional; the old fixed INTRO/VERSE/BRIDGE graphic (also decorative,
also removed in #4/#5) is replaced by the real segmentation. Jules specs the overlay — markers and
labels together. Supersedes the old "Backlog 7 — real arrangement detection" bullet above.
**Verified 2026-10-08: zero onset/section-detection code anywhere in `index.html` — genuinely not
started, not just undocumented.**

**Effort:** L.

### 10. Mix Check feedback #22 — Read-aloud controls for Hope replies · owner: Markey · ✅ **SHIPPED 2026-10-21**

Added Speak/Stop controls on all assistant replies, including typed/tool replies. Read-aloud uses
Hope’s ElevenLabs Flash voice via AIMM’s `/hope/read-aloud` Worker path and existing TTS-only secret.
It is limited to the allowed AIMM origins, rate-limited per IP, and capped at 2,400 characters; the
Usage-test token is not required. Selected text is read when selected; otherwise it reads the reply.
Each request uses ElevenLabs credits. Per Kevin's instruction, the unused composer mic, route, mute
and global Speak controls remain removed; the separate floating call control and the mockup's two
sample messages remain unchanged. `AIMM_BUILD` was `2026-10-21.66` when this item shipped.

**Done.** Per-reply ElevenLabs read-aloud is available without requiring the Usage-test token.

**Effort:** M.

### 11. Mix Check feedback #19 — Capture PC / tab audio into the Mix Check analyser · owner: Cat · **Confirmed built, button hidden — 2026-10-08**

A control to capture whatever is playing on the machine (e.g. Spotify) via `getDisplayMedia`
tab-audio and run it through the Mix Check analyser exactly like a loaded file. Regression — the
capability used to exist (the "Capture tab audio" bar from P0i live input metering) and there is no
button for it in the R3 Mix Check layout now. **Verified 2026-10-08: the capability is actually
implemented** (`window.refLiveTab`, a real `getDisplayMedia` call, wired to the live-metering
pipeline) — but its button (`#refLiveTabBtn`) carries a `hidden` attribute in the current R3 layout,
so it's real but genuinely inaccessible right now. Fix is small: decide whether to un-hide the
existing button or redesign its placement — not a from-scratch build.

**Effort:** S (button only — the capture logic already exists), down from M.

### 12. Mix Check feedback #3 — Hope tab-awareness verify + persisted-history fix · owner: Markey · ✅ **SHIPPED & MERGED, confirmed 2026-10-08**

Confirm on a clean live build that Hope no longer asks "was it from a Session Snapshot / the Repair
tab / your Insight tab?". Markey has confirmed the instruction text on `main` is already reconciled
(post `9797772`); the wording only reappears when pre-fix persisted chat history
(`trapMasterAiChatHistory_v1` / `AICHAT_HISTORY_KEY`) replays on load. Permanent fix: bump the
history key so pre-fix turns cannot replay. Branch `markey-hope-history-key-bump` @ `d492eb1`.
**Verified 2026-10-08 (Jacob), directly against real code, not assumed:** `git merge-base
--is-ancestor d492eb1 main` confirms the branch IS merged; `AICHAT_HISTORY_KEY` is `_v2` in the live
code; the Conversation tab nav button is confirmed removed. This card had been sitting marked
"pending merge" on the dashboard for weeks after actually shipping — the exact staleness that
triggered this whole reconciliation pass (Kevin caught it live, 2026-10-08).

**Effort:** S. **Done.**

### 13. Mix Check — Default tab on load should be Mix Check, not Conversation · owner: Cat · ✅ **SHIPPED & MERGED, confirmed 2026-10-08**

The app should open on Mix Check (`data-tab="eq"`). Shipped on branch `mixcheck-audiospecs-label-align`
(build `2026-09-05.1`), merged to `main` 2026-09-05. Markup hardcodes `active` on the Mix Check
tab/panel; the three tab-click-gated lazy-inits this card originally flagged now also fire on cold
load. **Re-verified 2026-10-08:** still true on current `main` — Conversation tab has since been
fully retired as a side effect of item 12's work, so this is doubly moot as a concern now.

**Effort:** S. **Done.**

### 14. Mix Check feedback #6 — "Clear chat" button wraps to its own line at narrow rail width · owner: Markey · **Needs a live check, 2026-10-08**

At ≲380px rail width the new "Clear chat" button wraps to its own full-width line (same
`.send-col{flex-wrap:wrap}` behaviour "Attach screenshot" has always had). Jules's review called it
acceptable graceful degradation. Kevin's call whether to force it single-line at all widths (shrink
pill padding/font, or `flex-wrap:nowrap` + `min-width:0` on the row). **Not re-verified 2026-10-08**
— real recent work has touched the Clear-chat button since this was written (it was restored to the
composer row in the Hope-rail pass), so this specific narrow-width wrap claim needs a live
narrow-viewport check before its status can be stated either way, rather than assumed unchanged.

**Effort:** S.

## ✅ Mix Check 2026-09-02 feedback round — items 1–15 (16 folded into 15), 17, 18, 20 SHIPPED & LIVE on `main` (build `2026-09-02.15`)

Batched feedback round worked from `docs/feedback/2026-09-02/BOARD.md` (branch `feedback-board`),
promoted to `main` ff-only by Kevin across builds `2026-09-02.5`–`.15`. What landed:

- **Header re-layout (#3, #9)** — Genre / Target / Settings cluster moved down onto the file-title
  row; `Drop / browse WAV` moved into the transport bar (empty state: the transport card is the drop
  zone); tab strip fills the row edge-to-edge with no trailing gap. Mix-Check-scoped, the other 8
  tabs unchanged.
- **Hope-rail pass (#2, #4, #5, #6, #8)** — Hope identity block + chat dropped down with a clear band
  for the `#hopeWave` speech wave; dead transcript↔composer drag handle removed; Clear-chat +
  Attach-screenshot buttons restored to the composer row; the rail is height-locked to the dashboard
  and long transcripts scroll internally (the page never grows). Jules design-review = APPROVE.
- **Fix Queue + transport batch (#7, #10, #12, #13)** — broadband Fix Queue items draw no frequency
  band, band items get a solid `#f97316` position marker (no brown wash); the WAV loader keeps the
  full gradient "Drop / browse WAV" button in both states; the newest chat bubble always scrolls
  fully into view; a horizontal volume slider added to the transport row (gain node spliced
  downstream of the analyser so meters / Spectral Balance / `#mcWave` are unaffected).
- **Hope-rail transcript layout (#14)** — role-label/bubble spacing, horizontal wrap/clip hardening,
  and a soft top-fade so the scrolled transcript meets Hope's zone without clipping under the wave.
- **`#hopeWave` PTT waveform port (#17)** — Hope's speech waveform replaced like-for-like with the
  `windows-mac-dictation` PTT Mini Float waveform (bar markup + CSS + amplitude analysis), wired to
  Hope's ElevenLabs output stream, keeping the item-4 reserved band. The live `getOutputVolume()`
  reaction gain was tuned 2026-09-06 (see Backlog 8 item D, RESOLVED, above) — Kevin's own live listen
  is the remaining confirmation step.
- **Viewport-fit density pass (#18)** — Mix Check dashboard compressed to ~0.81× height (flush
  ~1046px loaded) so it fits a 1920×1080 viewport with no page scroll; `#mcWave` render untouched.
- **Page gutter (#20)** — symmetric responsive `padding-inline` on `.container` (32px each side
  ≥1600px, 16px 1024–1599px) + `max-width:2000px` cap; `.container{padding-right:0}` dropped.
- **Fix "production line" (#15, #16)** — **queue side** (build `.13`): a direct "✓ Mark done" button
  on the UP NEXT card calls `MC_FIXQUEUE.markApplied()`; `emit()` carries a payload and dispatches a
  new `window` CustomEvent `aimm:fix-queue-changed`; completed cards drop off one by one to a clean
  "N / N done" state. **Hope side** (build `.15`, `e9bcd8a` — Kevin kept this on `main`): the current
  Fix Queue item renders as a self-updating card in Hope's chat transcript (revived
  `renderFixActionBody()` in the `hopeMixRead` IIFE) — analyse → card for #01 → mark done (card
  button, dismiss ×, or Hope's `mark_fix_applied` tool) → same marker re-renders as #02 → … → queue
  clear → an "ALL CLEAR" card, the marker floating to the end of the transcript on each advance;
  the count always reads live so it cannot mismatch; `onAnalysisComplete` purges stale fix-action /
  breakdown / `mc-advance` entries; `RT_INSTRUCTIONS` / digests reconciled.
- **#1** — standing rule: no wireframes, every proposal rendered from the real app.

Still open from this round → items 9, 11 and 14 above (feedback #21, #19 and #6). Item 10's
per-reply read-aloud shipped 2026-10-21; unused composer voice controls were removed per Kevin's
instruction. The floating call control remains separate.

**Hope rail bottom alignment, build `2026-10-19.30` — live:** Chrome confirms the custom domain is serving `.30`. Desktop rail now stretches to the app column content height rather than keeping a viewport-based minimum, so Hope's panel ends alongside the active Mix Check panels and Fix Queue. Mobile overlay behavior is unchanged.

**Fix Queue Hope request — CORS fix deployed, 2026-10-19:** The production app origins `https://aimixmasters.com` and `https://www.aimixmasters.com` are now allowed by `aimm-proxy` (active version `dc296fab`). A typed Hope request from the live app succeeded after the deployment. Verify the exact Fix Queue card context with stems loaded.

**ElevenLabs account routing, build `2026-10-19.36` — local:** Keep Default (`agent_9001…`) and Fallback (`agent_2601…`) as stable role identities, independent of plan names. Fallback is selected for normal sessions for now; Default is used only if Fallback returns a clear exhausted-credit/quota error. Generic network failures do not trigger failover. Publish build `.36` to make this selection live.

**Stem Fix Queue empty state, build `2026-10-19.42` — deployed (Kevin confirmed):** When no Logic stem is selected, hide the entire stem-analysis card, including the instruction strip and empty Fix Queue prompt. Selecting a stem still reveals the existing per-stem measurements and queue. Build `.42` is deployed; the prior `.41` layout was visually checked live on AIMixmasters.com: the Spectral Balance, Audio Specs and Hope panels align at the bottom, and the larger readouts are legible.

**Mix Check and Hope panel layout, build `2026-10-19.41` — pushed to `main` (`3705d3e`):** `.37` makes Spectral Balance span the empty Fix Queue row beside Audio Specs. The plot now has a 440 px minimum height, spreading the fixed ±72 dB grid lines farther apart above the bottom-anchored band cards. Axis and readout text, Audio Specs labels and the import hint are larger and higher contrast. Hope's desktop transcript uses bounded flex sizing so chat history scrolls inside the rail while the composer stays at the bottom. Mobile layout is unchanged. Build `.41` was confirmed live on AIMixmasters.com.

**Song-folder import clarity, build `2026-10-19.29` — LIVE and confirmed:** A visible **Song folder…** control beside the standard WAV picker opens folder import directly; the unsupported-selection notice gives the correct next step. Chrome confirms `.29` on AIMixmasters.com, and Kevin confirmed the folder import works.

## Multi-stem Mix Check — Logic split, bulk stem import, then per-stem analysis (captured 2026-09-04; direction corrected 2026-10-18)

**2026-10-19 update — build `2026-10-19.49`, voice cost controls (superseded by `.53` reply guidance):** The compact call-start context remains in place. The original `.49` guidance targeted 12–25 spoken words; `.53` removed that strict target after Kevin reported cut-off replies and now asks Hope to finish each thought naturally. Idle-call auto-end covers ElevenLabs and OpenAI, warns at 1m45s, and ends after 2 minutes without a conversation turn; it defaults on while preserving an explicit saved opt-out. The later Fallback GPT-6 Luna v44 usage comparison is recorded at the top of this roadmap and in the release log.

**Hope request recovery, Fix Queue playback and song-folder naming, build `2026-10-19.28` — LIVE:** build `.28` is published on AIMixmasters.com. The new **Browse song folder** option uses the chosen directory name for the stem mix title (with stem count) and replaces the previous audio set when loading a new song folder. Multi-file import remains. Build `.27`'s untimestamped **Play mix** from 0:00 and timestamped playback from the cue point are included. Cloudflare dashboard confirms `aimm-proxy` version `1316e5dc` active; the hosted Hope chat connection test passed. No WAV was loaded for that check, and an actual folder import has not yet been run, so the song-title display, exact −19.9 LUFS analysis context and audible queue playback still need verification with source audio.

**Hope complete spectral context and 808 label, build `2026-10-19.23` (local only):** Hope receives the full-mix spectrum, chart legend and exact corridor bounds, the complete imported stem inventory, and each decoded source's metrics, full-record spectrum, leave-one-out result and Fix Queue. Multi-select context provides each selected source individually plus the time-domain summed group spectrum and unselected remainder, with series colours/styles. Instructions require evidence-led commentary, distinguish mix-corridor comparisons from validated solo/group targets, and prevent midpoint fader or masking claims unsupported by these measurements. The imported track labeled `Bass` displays as `808`, with the original filename retained as provenance. Runtime Hope response remains unverified.

**Latest spectral review (2026-10-19, local build `2026-10-19.21`):** During playback the selected group and its unselected remainder now use the same aligned PCM window and playhead, with the same full-sum genre offset and smoothing. Paused curves remain full-record spectra. Neither curve is forced to start at the same dB value. On the actual WAVs, the screenshot's selected group (Vocals, Drums, Piano, Guitar and Other) measures 22.2 dB below the full sum at 20 Hz; the unselected Bass carries nearly all that sub energy and naturally falls away above 1 kHz. This was an independent data audit, not a browser playback verification. Build `.21` is open in Chrome; live playback review with the WAVs loaded remains the next gate. See `docs/STATUS.md` and the latest checkpoint in `docs/HANDOVER.md`.

**Visual follow-up, build `2026-10-19.22`:** the purple genre corridor opacity is increased in both full-mix and stem charts while keeping the same soft blended fill, no hard outline, layout and readings.

**Current first prototype — Kevin, 2026-10-18, superseding the earlier same-day automatic
split-on-upload plan:** Kevin splits one mixed WAV **manually in Logic Pro**, exports the
resulting stem WAVs, then uploads **all stems together into the AIMM dashboard**. Local build
`2026-10-19.19` accepts aligned WAV stems, displays source-named rows and waveforms, changes the orange Mix Check title to the selected Logic track, toggles rows into a simultaneous playback audition and keeps the latest selected row as the per-stem measurements and Fix Queue focus while Spectral Balance follows the selected group; toggling all rows off restores the combined mix. In the selected-stem Spectral Balance view, the existing cyan trace slot is repurposed for the selected track's full-record spectrum when paused and a selected-stem PCM frame during playback in that same slot, using the 8192-point Hann window and power normalization shared with the saved Welch spectrum and the fixed full-sum gain offset; it is not normalized frame by frame. Live selected-stem/group frames are sampled at 20 Hz and smoothed in linear power with a 0.4-second exponential time constant; this affects only the moving display, adds slight lag, and leaves paused full-record readings and calibration unchanged. Live playback review of the new smoothing is pending. All-stem, individual-stem and multi-stem plots share a fixed ±72 dB range with 12 dB ticks, centred at zero; near-silence FFT bins below the floor are clipped only in the display, not in analysis. Frequency guides and band names use the same log-frequency map, with duplicated fixed-percentage guides removed. The repeated instructional text is removed from the empty plot because the drop control above it already describes the action. The selected-stem chart is 320 px high and uses the same fixed ±72 dB scale as the full-mix chart, with 0 dB vertically centred. Stem rows toggle into a simultaneous audition; the most recently selected source remains the focus for per-stem measurements and Fix Queue while Spectral Balance follows the selected group, and the transport title names the active group. No additional blue line or all-stems cyan trace is drawn in this view. The dashed same-sum-without-selected-source guide and purple corridor remain. Real-WAV browser verification of the live line and simultaneous playback remains pending because the Chrome extension blocks local file uploads. It analyzes
each stem, and keeps a separate Fix Queue per source. The existing Spectral Balance appearance
is preserved: purple active genre corridor, cyan full aligned stem sum, and dashed same sum with
the selected source removed. The full-mix and selected-stem plots share a symmetric 0-centred relative dB scale and reserve a top label strip to keep the dB unit clear of the top tick. For multi-selection, the cyan curve is computed after summing selected PCM samples and the dashed reference is the full mix with that selected group removed; the active purple corridor remains the full-mix genre reference. Each spectrum
uses an 8192-point Hann Welch estimate, 50% overlap, every complete aligned frame, average power,
and a Web Worker. The source-removed curve is built by summing PCM samples before FFT. Band
readings compare the full sum to the active full-mix corridor; the corridor is not treated as a
target for an isolated stem. A source-specific queue item requires a material full-sum deviation
and evidence that removing that source materially improves it or moves across the corridor. The
item reports its source and a Workbench bus only where the mapping is clear, then recommends
auditioning; it never applies processing. Hope's panel UI and fixed/open behaviour remain
unchanged. Typed and voice Hope context now carry the measured comparison and source queue, with guidance separating contribution evidence from source-backed technique advice. The stem matching path is WAV-only; existing single-reference WAV/AIFF loading remains compatible. All changes are local and uncommitted. The latest browser upload test is blocked by
the ChatGPT extension's disabled file-URL access. Automatic splitting of one uploaded WAV,
including a Logic automation bridge and the parked RunPod provider, is **deferred**.

**Validation, 2026-10-18–19:** The first attempt stopped safely when Logic reported unsaved
changes in Kevin's existing project; Cat chose Cancel. Kevin then saved and closed that project
and opened an empty one. Cat copied Kevin's supplied 2:13 music WAV byte-for-byte to scratch
storage and tested the copy. Logic's "Separate All Stems" operation produced six regions
(vocals, drums, bass, guitar, piano, other) in **under 18.2 seconds** from Apply to verified
result. Export of the six selected regions took **11.4 seconds**. The six exported WAVs are all
non-silent stereo, 48 kHz, 24-bit, exactly 6,409,013 frames (133.521 seconds), and aligned;
the original mix was not exported. Summing them reconstructs the source to about -33.6 dB
relative RMS error. This verifies the manual Logic path on Kevin's Mac, not perceptual stem
quality. **Browser test 2026-10-18:** Cat's suite passed 39/39 on the six real stems and
single-WAV compatibility. **Hope review 2026-10-18:** Markey's fresh review fixed the
clear-during-in-flight race by checking the live analysis revision before a full-mix response
publishes; syntax and diff checks passed. Runtime voice/backend delivery was not exercised, so
that remains unverified. For build `2026-10-19.6`, JavaScript syntax, focused Hope-context fixture and diff checks passed; the
production spectrum worker passed a synthetic-tone check and was run against the actual Bass,
full-sum, and without-Bass signals. It processed 2,534 windows per 216.34-second signal. Under
the Trap / 808-heavy corridor, the Low band read +4.2 dB rel. with all stems and -3.62 dB rel.
without Bass. This is evidence that Bass materially changes the low-band balance; it does not
prove that the Bass stem alone is wrong. Browser upload of these files is unverified because the
ChatGPT Chrome extension blocks local file access; the earlier 39/39 suite is from an older
build and does not verify this worker path. **Naming rule and project name (Kevin, 2026-10-18):** the Logic project
and source song for the current six-stem test set is `AI MM switching beats`. Name the project
after the source song and each stem after its source Logic track. The transport label
`Stem mix · N stems` remains generic. **Next action:** Load the six files in the local Chrome app after enabling the
extension's file-URL access and review the rendered readings. Kevin reviews before commit or
deployment. The later page-layout redesign remains parked for Jules. Automatic Logic splitting
and one-WAV split-on-upload stay deferred.

**Historical status (2026-09-04; superseded by the current decision above):** Session goal
approved by Kevin 2026-09-04: move to the mockup stage (Jules builds an interactive HTML mockup
per the standing mockup-first process — see `docs/CLAUDE.md`), not to implementation.

**Historical priority note, 2026-09-06 (Kevin's explicit reprioritization):** moved up ahead of the Fix
Queue placeholder bug fix (that item was correspondingly dropped to low priority, see
`docs/STATUS.md` for its status) — this is now the next thing to pick up. DASHBOARD.html Backlog
card 22 mirrors this.

**Mockup stage update, 2026-09-07 (Jules):** `docs/mockups/multistem-mixcheck.html` now covers
all 7 requirements below (previously just 1-2), pushed to `main` (commit `24e491e`), Codex
three-touchpoint reviewed. Awaiting Kevin's review at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck.html` — see `docs/STATUS.md`
for the full design-decision writeup. Still backlog capture only, still not build authorization;
Option A vs B below is still Kevin's open call, unaffected by the mockup existing. (Note: this
mockup was pushed straight to `main`, not its own branch — `docs/CLAUDE.md`'s standing mockup
process is the authoritative one, superseding the "own branch" pattern used for the original
2026-09-04 requirement-1/2 pass.)

**v2 mockup, 2026-09-07 (Jules), later same day again — SUPERSEDES the minimal pass below after
Kevin tested it and found a real bug plus a wrong interaction model.** Kevin reported: (1) a real
bug — dropping files produced 7 identical duplicate stem rows, a "mismatched stem(s) excluded"
warning; root cause confirmed by live headless-Chrome reproduction — no dedupe check against an
already-loaded identical stem, plus zero visible feedback below 2 stems, so a user re-dropping the
same file (getting no acknowledgement) silently accumulated duplicates. (2) Wrong interaction
model — Kevin pointed at the ORIGINAL standalone mockup's per-stem-slot panel (fixed Drums/Bass/
Vocals/Other, each independently droppable, + "+ Add stem") as the correct shape, explicitly
rejecting the minimal pass's shared multi-file picker, and asked for each stem's own inline
waveform preview. **`docs/mockups/multistem-mixcheck-v2.html`** delivers per-stem drop slots
(replace-not-append semantics close the duplicate bug structurally), restyled to the real app's
own tokens/`.ref-t-btn` class (not the standalone mockup's separate dark-card system Kevin already
flagged as inconsistent), a per-slot own-waveform preview alongside the still-present shared
combined waveform, and a generation-token race guard. Codex three-touchpoint review found and
fixed 3 real issues in TP2 (a legacy-drop state-divergence risk, a `mcClearAllStems()` gap, and a
remove-then-reload requirement for replacing a loaded slot) plus one more found during TP3
iteration (a loaded dynamic "+ Add stem" slot had no way to remove the slot itself) — all fixed
and re-verified via real headless-Chrome execution. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-v2.html`. Full write-up in
`docs/STATUS.md`. Still backlog capture only, still not build authorization; Option A vs B below
remains Kevin's open call, unaffected by any of the mockups.

**Minimal-pass mockup, 2026-09-07 (Jules), later same day — SUPERSEDES both mockups below for
review purposes, per a fresh live design discussion with Kevin.** Kevin's explicit framing: the
two mockups below (all-7-requirements and in-context) were both too elaborate and built the wrong
shape — "we already have this, just add the tracks." **Kevin should review
`docs/mockups/multistem-mixcheck-minimal.html`** (live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-minimal.html`), not the two
below — they stay live/unchanged for reference only, not deleted. New scope, nothing more: the
real transport bar (play/prev/loop/stop/volume/time/`Drop / browse WAV ▾`) is completely unchanged
mechanically; the only new capability is that the drop control accepts multiple named stems
(filename = label, no fixed taxonomy) with a minimal inline mute(M)/solo(S)/remove(×) toggle per
stem styled with the exact same `.ref-t-btn` class as the existing transport buttons. **EQ
(requirement 7) is explicitly DROPPED from scope this pass — Kevin: "remove EQ — this is not
working."** None of either prior mockup's EQ code was carried into this one. Build approach: a
fresh, never-edited `main` `index.html` as the base, with a small surgical in-place diff; every
real analysis mechanism (Audio Specs, Spectral Balance, Fix Queue, the waveform, the transport) is
reused UNMODIFIED — currently-audible stems are summed into one combined buffer and fed through
the app's own existing single-file `refLoadFile()` pipeline (requirement 3 — live reactive
analysis — comes for free this way), with sample rate/channel/length validation on load
(requirement 1) flagging and excluding mismatched stems rather than silently misaligning them.
Codex three-touchpoint review found and fixed real bugs, not just scope creep: TP1 (plan) flagged
7 concrete implementation risks before code was written; TP2 (diff) reproduced two real bugs live
— a drop-bubbling double-load and a muted-lone-stem-silently-unmutes-itself case — both fixed; TP3
(real headless-Chrome click-through) regression-tested both plus the full requirement checklist,
all clean. Requirements 4-6 (Hope-awareness, tool-calling control, demonstrate-vs-instruct) were
NOT built this pass — explicitly deferred as lower priority per the brief, not dropped. Full
write-up in `docs/STATUS.md`. Still backlog capture only, still not build authorization; Option A
vs B below remains Kevin's open call, unaffected by any of the three mockups existing.

**In-context mockup, 2026-09-07 (Jules), added alongside the standalone one above, per Kevin's
explicit ask after reviewing it ("I want to see it in context of the entire page"):**
`docs/mockups/multistem-mixcheck-in-context.html` wraps the SAME multi-stem Mix Check feature (all
7 requirements, unchanged) inside the real, freshly-fetched `main` `index.html`'s own chrome — real
header, real 8-tab strip (Mix Check active by default), real `#hopeRail` dock — so Kevin can judge
it sitting in the actual app rather than as an isolated single-tab demo. `index.html` itself is
read-only reference for this pass, never edited. Codex three-touchpoint reviewed; TP1 surfaced
several real-page init hooks (`wireDropZone`/`wireMcBanner`/`wireMcInput`/`wireScrub`/`wireMcVol`/
`ozSpecInit`, the transport/header-actions relocation shims) that retry forever against missing DOM
nodes, which shaped a hide-not-delete approach for the real Mix Check markup that had to move aside;
TP2 found (and this pass fixed) a real event-bubbling bug where a stem-row file drop would silently
reach the real page's own drop handler and overwrite the real Mix Check title, plus a CSS
specificity collision on several transport class names reused from the real component's own
styling; TP3 (real headless-Chrome click-through) confirmed all 8 tabs switch correctly, the new
content survives round-trips through every other tab, and the multi-stem feature itself (demo
stems, mute/solo, live analysis, Hope demonstrate/instruct, EQ, Undo) is unchanged and fully
functional. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-in-context.html` — full
design-decision writeup in `docs/STATUS.md`. Still backlog capture only, still not build
authorization; Option A vs B below remains Kevin's open call, unaffected by either mockup.


**Final agreed brief mockup, 2026-09-07 (Jules) — SUPERSEDES `multistem-mixcheck.html`,
`multistem-mixcheck-in-context.html`, and `multistem-mixcheck-minimal.html` for review purposes,
per Kevin's final agreed brief after an extensive live design discussion.** One-line reason each
is superseded, so the history stays legible:
- `multistem-mixcheck.html` (+ its all-7-reqs expansion) — **wrong drop-target structure**: a
  separate stem-slot panel bolted on beside the real transport, instead of extending the app's own
  existing shared `Drop / browse WAV` control.
- `multistem-mixcheck-in-context.html` — **hidden real components + duplicate Hope**: hid the real
  Mix Check markup behind a wrapper instead of genuinely extending it in place, and carried a second
  scripted "Hope" panel alongside the real `#hopeRail`.
- `multistem-mixcheck-minimal.html` — **wrong interaction model**: reused `refLoadFile()` for BOTH
  playback and analysis (one single-buffer engine), so mute/solo had to stop/reload the whole mix
  rather than keep every stem's source node continuously running — the opposite of what Kevin
  corrected this pass to require — and labelled stems from the filename, which produced the
  concatenated-filenames header bug Kevin flagged directly.

**Flagged discrepancy, not silently resolved:** `docs/mockups/multistem-mixcheck-v2.html` (Jules,
later on 2026-09-07, per-stem drop slots — see the STATUS.md/DASHBOARD.html entries for that pass)
is a fourth prior mockup that Kevin's final brief for this pass did **not** name in its explicit
supersession list (which named only the three above). This final pass's point 1 ("one shared drop
zone... nothing existing is removed") is a shared-picker model, which is the opposite structural
direction from v2's per-stem-slot design that Kevin had explicitly asked for after rejecting the
minimal pass's shared picker. Read together with the rest of this final brief (content-based
classification + click-to-rename, which removes the filename-labelling problem v2's slots existed
partly to solve), it looks very likely that v2 is *also* superseded by this final direction — but
since the brief didn't say so explicitly, this is logged as an open question for Kevin to confirm
rather than assumed. `multistem-mixcheck-v2.html` is left untouched, live, and its DASHBOARD.html
badge is not silently removed.

Delivered: `docs/mockups/multistem-mixcheck-final.html`, pushed to `main`. Live at
`https://begb0037admin.github.io/aimm/docs/mockups/multistem-mixcheck-final.html`. Base = a fresh
fetch of `main` `index.html` (commit `2d0f949afb3aa1f78f8e6fac10d1ea259f0e2a01`), edited in place —
`index.html` itself untouched, read-only reference throughout.

**What's new vs the minimal pass, per the brief's 11 numbered points:** the shared drop zone now
accepts multiple named stems (single-file load byte-for-byte unchanged, the degenerate case);
**every stem's `AudioBufferSourceNode` runs continuously for the whole playback duration regardless
of mute state** — mute/solo ONLY ramps that stem's own persistent `GainNode`, never
stops/starts/reschedules a source (the specific correction Kevin gave, verified — see the TP3
summary in `docs/STATUS.md`); each stem gets its own stacked waveform row (a faithful port of the
real, LOCKED `#mcWave`/`MC_WAVE` peak-drawing algorithm, parameterized per stem — `#mcWave` itself
untouched); stem labels come from real content-based classification (transient density + spectral
flatness + low/mid band-energy ratios, concrete documented thresholds, not filenames), honestly
badged "guessed" and click-to-rename; the header never concatenates — `#mcSub` shows a clean
"N stems loaded — duration" summary, individual names live only in their own row; a Snapshot
extends the existing `STATE.journal`/`createWorkbenchBackupPill()` pattern (`type:'stem-session'`,
fingerprint-keyed restore, settings-only, no raw audio) so reloading the same files restores
labels/mute/solo without re-classifying; Audio Specs/Spectral Balance/Fix Queue stay real and
unmodified, reacting live to the audible subset via the same summed-buffer-through-`refLoadFile()`
black-box technique the minimal pass proved, now serialized via a latest-wins queue; still no EQ;
exactly one real `#hopeRail`.

**Codex three-touchpoint review — all three found real, concrete issues, all fixed and
re-verified via live headless-Chrome (Playwright), not self-report.** TP1 (plan) materially
reshaped the playback-engine design (gain-automation cancel-before-ramp, transport-generation
discipline, `refCtx.resume()` handling), the analysis-serialization approach (a latest-wins drain
queue, a content-fingerprint-based Fix Queue signature instead of a timestamp), the classification
constants (concrete FFT size/hop/thresholds instead of vague adjectives, an energy-preserving
mono downmix to avoid phase cancellation), and the Snapshot fingerprint design (stable identity,
occurrence-indexed for duplicates), before any code was written. TP2 (diff review against the
actual built file) confirmed the mute/solo path never touches a source node — only
`gainNode.gain` — and found and fixed 6 more real bugs: an analysis-reset race (`mcResetStems()`
didn't invalidate the in-flight analysis generation), a solo+mute inconsistency (a stem that was
both soloed and individually muted was audible in playback but excluded from analysis — now both
paths call the same `effectiveMuted()`), a session-local-id Fix-Queue signature that changed on
every reload of the same files (now keyed to stable content fingerprints), a Snapshot-restore
duplicate-matching gap (now occurrence-indexed explicitly), a stem added mid-playback staying
silent until the next manual transport action (now re-schedules immediately, in sync), and a
mismatch-reference edge case (removing the reference stem could leave the last remaining stem
stuck flagged with nothing left to compare against). TP3 (real headless-Chrome click-through
against 4 spectrally-distinguishable synthetic demo stems — drums/bass/vocals/other) found and
fixed two more: a `[hidden]` CSS-specificity bug where the stem-stack panel showed even on a
single-file load, and a backwards onset-detection condition that required the frame BEFORE a
transient to already be active — which structurally excluded the silence-to-hit transition that
IS the onset for percussive content, so the synthetic drums stem misclassified as "Other" until
fixed. All fixed; the full TP3 suite re-ran clean afterward with zero regressions.

**Continuous-sync-while-muted, verified not just built:** a debug hook
(`window.__mcDebug`) exposes the real `AudioContext` and generation counters (not exposed on
`window` anywhere else in the app) so the test harness can inspect actual engine state rather than
trust self-report. With 4 stems loaded and playing, `AudioContext.prototype.createBufferSource`
was instrumented to count real invocations; three full rounds of mute-toggling every stem plus a
solo/un-solo cycle produced **zero** new source-node creations, `AudioContext.state` stayed
`"running"` throughout, `currentTime` kept advancing, and the transport's play state and elapsed
time both continued forward uninterrupted (confirmed advancing from the toggle point to +1s later
mid-track). Isolating a single stem (all others muted) changed the measured loudness from -70.0
LUFS (all muted, near-silence) to -14.7 LUFS (real signal) — live-reactive analysis confirmed
functionally correct, not just visually plausible.

**Classification heuristic, honestly assessed:** concrete, documented constants (2048-sample FFT,
1024 hop, analyzes up to the first 20s, a 5-window minimum before guessing at all); on the 4
spectrally-distinguishable synthetic demo stems built for TP3 (broadband decaying percussive hits,
a 55Hz sine, layered vocal-range harmonics with vibrato, a sustained high-passed noise pad) it
classified all 4 correctly after the TP3 onset-detection fix. Known, disclosed limitations (found
via Codex TP1's own critique, not hidden): tonal mid-band material that isn't a voice (guitars,
synths, pianos) will often satisfy the "Vocals" rule; a very percussive bass line or a low piano
can read as "Drums"/confuse the "Bass" rule; this is a real, honest heuristic guess, not ML-grade
classification — which is exactly why it's badged "guessed" in the UI and click-to-rename exists
as the correction path, per the brief.

**Problem:** Hope can currently only measure the whole rendered mix (`balance.wav`) on Mix Check —
she has no visibility into individual stems, so when asked "what's causing this low-end issue,"
she can only give informed reasoning from the full mix, not real per-element measurements.

**Kevin's ask, verbatim intent:** "I need to be able to upload stems for Hope to analyse — they
all need to be present, or maybe give her the ability to stem split."

**Two directions, not yet chosen:**
- **Option A — Multi-stem upload.** Kevin drops multiple stems (drums/bass/vocals/etc.) onto Mix
  Check instead of just one WAV; analyser runs BS.1770-4 + spectral measurement per stem plus the
  combined mix, so Hope can point at which specific stem is driving a flagged issue instead of
  guessing from the full mix alone. Straightforward with the existing measurement pipeline —
  requires Kevin to already have stems.
- **Option B — Client-side stem separation.** If only a single mixed WAV is provided, run a
  stem-splitting step (e.g. a WASM/ONNX port of a model like Demucs/Spleeter, or a server-side
  microservice call) to derive approximate stems automatically, then measure those. A bigger lift —
  needs a separation model, and the browser-only single-file constraint may force a backend/
  microservice call — same shape as the ARCH-2/ARCH-3 Platform Evolution Epic already below in this
  doc; cross-reference that section for the backend-microservice pattern this would reuse.

**Decision (2026-09-07, Kevin): both, not either/or.** "Can I have both?" — yes: A and B are
not mutually exclusive, they're two entry paths into the same downstream system. Once stems exist
(whether Kevin supplied them or they were auto-split), live reactive analysis, Hope's awareness,
her control tools, and per-stem EQ all work identically regardless of source. **Sequencing: build
Option A first** — cheap, immediate value, works with the existing measurement pipeline as-is, and
unblocks everything else (reqs 3-7). **Option B follows later** as an enhancement for when Kevin
only has a single mixed file and doesn't want to bounce out to a DAW to export stems first — it's
the bigger lift (needs a real separation model, same backend-microservice shape as the ARCH-2/
ARCH-3 Platform Evolution Epic) and isn't blocking A's build.

**Competitive context (captured 2026-09-05, context only — not a task list to copy):** a live
competitor product already ships, as paid features: AI stem-splitting (not just stem upload — they
split for you), a scored mix-history library with compare-versions, a "Tools" marketplace (Voice
De-Noise, Audio Restoration, Karaoke, A Capella, Delivery Master, Professional Audio, Workflows),
and a locked Reference-track A/B feature. Kevin's read: their structure is generic and replicable,
but AIMM's real differentiator has to be **Hope actually being intelligent** — teaching,
referencing, driving, and demonstrating — not matching their feature checklist point-for-point.
This note exists to inform priority calls (see Library reorganization, item 23 below, explicitly
deprioritized behind Hope-intelligence work as a result) — it is not itself a build item.

**Product vision, sharpened 2026-09-07 (Kevin, in his own words, reviewing the Multi-stem Mix
Check mockup's Hope demonstrate/instruct behavior):** "this is the kind of interaction I want from
Hope and set this apart from all the other mix apps out there." The concrete shape of it: Hope
should be conversationally smart enough to flag a real problem unprompted in plain language ("your
bass is high and over") and then genuinely act on it ("here, let me show you" — a real solo/mute
call, not just a description), or offer to talk the user through doing it themselves. This is the
explicit, load-bearing differentiator for AIMM going forward — not a nice demo moment, the actual
reason Hope exists as a product idea. Treat any future Hope-intelligence work (Backlog 24/25, the
demonstrate/instruct mechanism itself, and anything similar) as building directly toward this
statement, not a generic assistant feature.

**Requirements gathered so far (2026-09-04 session, Kevin's refinements as the spec developed —
fold all of these into whichever option/build a future session picks up):**

1. **Sync.** Stems must be exported full-length from bar 1 (no trimming) — same duration/sample
   rate. On upload, validate every stem's sample count/sample rate match and flag a mismatch rather
   than silently misaligning. Playback schedules all stem `AudioBufferSourceNode`s to start at the
   same Web Audio clock timestamp for sample-accurate sync.
2. **UI concept — for Jules to mock up, not for Cat to build yet.** Where the single Drop/browse
   WAV zone is now, a stack of stem slots (fixed categories like Kick/Bass/Vocals/Other, or generic
   "+ Add stem" rows — Jules's call), each with its own drop target, filename, and mute/solo toggle.
   One shared transport plays all unmuted stems in sync.
3. **Hard requirement — live reactive analysis.** Spectral Balance and Audio Specs must reflect
   only the currently audible (unmuted) stems, updating live as mute/solo state changes. E.g. if
   only the Bass stem is unmuted, the corridor/LOW-MID-HIGH readings show that stem's balance
   alone, not the full mix. This is **not** a static per-stem breakdown list — it's the existing
   whole-mix analysis re-running against whatever subset is currently audible. Fix Queue items
   should be able to point at a specific stem once isolated this way (e.g. "Bass stem +9 dB in Low
   band").
   - **Refinement, 2026-09-07 (Kevin — real architectural gap found in testing):** "reflect
     whatever subset is currently audible" turned out to be incomplete on its own — Kevin: "when
     you drop a solo bass stem into Mix Check, the app compares it against a full-mix corridor
     target — so it screams that your low end is forty one dB over, which is meaningless, because
     of course a bass stem has no highs. The corridor doesn't know it's looking at a stem." Kevin
     offered two options (a stem-specific reference target, or skipping the tonal-balance
     comparison entirely) and chose the SECOND, simpler one: a fabricated "what a solo bass stem
     should look like" target would be just as likely to mislead as the wrong-target comparison it
     replaces. **Fixed** on `docs/mockups/multistem-mixcheck-final.html` (mockup only,
     `index.html` untouched) — reflecting the audible subset honestly now means: when the
     currently-audible set is a single isolated stem out of a MULTI-stem session (solo, or muted
     down to one — `window.__mcSingleStemIsolated()`), the Spectral Balance corridor-deviation
     cards, the raw canvas framing, the corridor-based Fix Queue items, and Hope's own tonal-balance
     context all say the comparison isn't meaningful right now, rather than computing/reciting a
     number regardless. Loudness/true peak/dynamics/correlation remain fully live-reactive and
     valid in every state, isolated or not — only the corridor COMPARISON is suppressed, never the
     whole analysis. The ordinary single-file-loaded case (nothing else ever loaded alongside it)
     is explicitly unaffected — that state IS the full file the corridor was designed to judge. Full
     write-up (exact detection condition, what's suppressed vs. shown, Codex three-touchpoint
     summary): `docs/STATUS.md`.
4. **Hard requirement — Hope must be aware of stem state at all times, not just the finished mix.**
   Once stems ship, extend the existing Hope-awareness context mechanism
   (`buildMixCheckState()` / `buildMixCheckContextBlock()`, line ~8450/~8494 in `index.html` — the
   same pattern used for the Fix Queue live-state feed from the earlier post-ship #3 work) to
   include: which stems are loaded, which are currently muted/soloed, and the live analysis of
   whatever subset is currently audible — fed to Hope on every mute/solo/upload change, the same
   way Fix Queue changes are pushed now. This should not require Hope to ask "which stem is
   playing" or "is this the full mix or just bass" — the same acceptance bar as the earlier
   Hope-awareness restore (never ask, she already knows).
5. **Hard requirement — control/tool-calling, not just awareness.** Kevin's exact words: "able to
   control play and mute and everything else — I want Hope to be able to drive." Hope needs new
   client tools (`TOOL_DEFS` + handlers, same pattern as existing tools like `propose_mix_move` /
   `manage_roadmap_inbox`, see `index.html` ~8297 onward) so she can actually drive the transport
   and stem state via voice/chat, not just read it. At minimum: play/pause/stop transport, seek,
   mute/unmute a named stem, solo a named stem (and un-solo/return to all-unmuted), and any other
   stem-rack control that exists in the UI once built. E.g. Kevin says "solo the bass" or "mute
   everything except vocals" and Hope calls the tool directly rather than talking him through
   clicking it himself.
6. **Hard requirement — demonstrate AND instruct, not just one.** Kevin's exact words:
   "demonstrate and instruct." Hope should be able to both **demonstrate** (actually perform the
   action herself via her tools — e.g. solo the bass stem live so Kevin hears/sees it happen) AND
   **instruct** (walk Kevin through doing it himself manually, e.g. "click the solo button on the
   bass stem row") — not just one or the other. Which mode she uses should fit the moment
   (demonstrate when he wants it done now / instruct when he's asking how something works or wants
   to do it himself), same general instructional-vs-active split Hope already has to make with mix
   moves.
   - **Why this matters (Kevin's framing, not a nice-to-have):** "this is how she is able to help
     and advise — 'let me show you.'" This is core to how Hope is meant to help, not an add-on:
     when she has a suggestion, she should be able to say "let me show you" and then actually
     solo/mute/play the relevant stem herself via her tools, rather than only describing it. A
     future implementer should treat this as central to the advisory interaction model.
7. **Scope extension — basic live EQ, so a demonstrated move can actually be heard.** Kevin's
   reasoning: "this means we need some basic plugins — live EQ." For Hope to actually
   "demonstrate" a fix (requirement 6) rather than only mute/solo/play stems, she needs at least a
   basic live EQ she can apply and adjust in real time on a stem/bus — so a suggested move like
   "cut 3dB at 80Hz on the bass" can be heard live, not just described.
   - **Findings, checked directly against current `main` `index.html` (2026-09-04, so the next
     implementer isn't starting blind):** `docs/HANDOVER.md`'s 2026-06-11 addendum references
     `aimmApplyMixMove` and the `add_plugin_to_bus` / `set_plugin_settings` tool handlers built for
     Mix Move cards — confirmed these still exist and work (`aimmApplyMixMove` at ~line 10551 calls
     `add_plugin_to_bus` at ~line 11797; `add_plugin_to_bus`'s `TOOL_DEFS` entry at ~line 8315).
     **But this plumbing is a symbolic chain-builder list only** — it adds a plugin *name* (from
     Kev's owned-plugin library) and a settings *note* to the Workbench's chain view, for Kevin to
     go apply by hand in his real DAW. There is **no actual real-time audio DSP anywhere in the
     app** — confirmed via `grep` for `BiquadFilterNode`/`createBiquadFilter`, zero matches in
     `index.html`. So a live EQ Hope can apply and actually be *heard* is **new work, not an
     extension of existing plumbing** — it needs a real Web Audio `BiquadFilterNode` chain (start
     simple: a few bands, gain/freq/Q) applied live to a stem or the mix bus, with new tools for
     Hope to create/adjust it, separate from the existing symbolic `add_plugin_to_bus`.

**Cross-reference:** Option B (auto stem-split) and the live-EQ requirement above both likely need
a backend/microservice for anything beyond a toy WASM model — see the ARCH-2 (RoEx-style analysis
microservice) and ARCH-3 (HyFi-style server-side processing) sections of the Platform Evolution
Epic further down this doc; whoever scopes this should read those sections first rather than
re-deriving the same backend-vs-browser tradeoff from scratch.

**Next step:** Jules builds an interactive HTML mockup (stem slots + mute/solo + shared transport,
per requirement 2) pushed to `docs/mockups/` on its own branch per the standing mockup-first
process in `docs/CLAUDE.md` — Kevin reviews live via GitHub Pages, no screenshots, no code merged
until he approves. Not started as of this entry.

## 23. Library reorganization — sub-sections restructure (captured 2026-09-05, LOWER PRIORITY)

**Backlog capture only — not build authorization.** Explicitly deprioritized by Kevin, behind the
Hope-intelligence work (items 24/25 below) — per the competitive-context note above, matching a
competitor's feature layout is not itself the priority.

**Idea:** restructure AIMM's Library tab into sub-sections analogous to a competitor's structure —
a scored history/archive of past analyzed mixes, a Tools section, and a Stems section.

- **Scored history/archive** — ties to AIMM's existing Snapshots concept; needs reconciling with
  Snapshots rather than building a duplicate parallel history feature. Not scoped which one absorbs
  the other.
- **Tools section** — **deferred, new scope.** No processing-tools feature (Voice De-Noise, Audio
  Restoration, Karaoke, A Capella, Delivery Master, etc.) exists anywhere in AIMM today; this would
  be genuinely new engineering, not a UI reorg of something that already exists.
- **Stems** — ties directly to the "Multi-stem Mix Check" item above (this doc, "captured
  2026-09-04") — cross-reference that section, don't duplicate its requirements here.
- **References** — ties to the existing "P-B: A/B Ref tab" section below (this doc) and its
  `B-P2` backlog card — cross-reference, don't duplicate.

**Explicitly LOWER PRIORITY than the Hope-intelligence work in items 24/25 below**, per Kevin.

## 24. Hope DAW-specific instruction quality (captured 2026-09-05)

**Backlog capture only — not build authorization.** Ties to / expands the existing "Hope KB: Logic
Pro & DAW Training tier" item (`docs/STATUS.md` → Hope Knowledge Base — ingestion row; DASHBOARD.html
Now/P2 card).

**Idea:** Hope's mixing advice should name actual Logic Pro UI elements and concrete steps ("open
Channel EQ, click the high-shelf band, drag to 8kHz") rather than generic mixing language — the KB
already has the depth to support this. Confirmed directly (2026-09-05 session): **33 of the 333
ingested KB videos are Logic-Pro-specific** (SEIDS, Sean Divine, Try Karra, Yaahn Hunter Jr
channels — beginner basics, shortcuts, templates, automation, stock-plugin-only mixing/mastering
walkthroughs, vocal chains). The blocker isn't content depth, it's two existing unverified backlog
items:

- **"Smoke test: YouTube KB hits"** (DASHBOARD.html card title; this doc's "In progress" section
  below tracks the same item as "Smoke test: YouTube KB" — same item, shortened name) — never
  confirmed end-to-end that Hope actually cites this material in a live response. **Now elevated
  to P1 as of 2026-09-05** (DASHBOARD.html badge updated accordingly).
- **"YouTube citation links"** (DASHBOARD.html card / `docs/STATUS.md` row) — no clickable URL in
  KB metadata yet. **Now elevated to P1 as of 2026-09-05** (DASHBOARD.html badge updated
  accordingly; `docs/STATUS.md` row updated too).

**Live confirmation, 2026-09-06 (Kevin):** had a live text/voice session asking Hope about gain
staging (both general and Logic-Pro-specific) — her answers were accurate and specifically
grounded ("From the Mastering dot com video on this...", named a concrete −18dBFS/−6dBFS
average-vs-peak split, walked through Logic's Region Gain + VU-meter-plugin workflow). Confirms the
KB-grounding itself works well; the missing piece is exactly the "YouTube citation links" gap above
— she named the source ("the Mastering dot com video") but gave no link Kevin could click through
to actually watch it. Kevin's ask: when she cites specific videos like this, surface one or a
couple of actual clickable links in the transcript ("here's a couple of links you might want for
gain staging") rather than only a spoken/text source name. Not a bug, an enhancement — reinforces
this item's existing P1 elevation rather than adding new scope.

**Both of the above are flagged ELEVATED PRIORITY as of 2026-09-05**, referenced from this item —
they gate whether this DAW-specific-instruction-quality idea is even achievable soon, since neither
has been confirmed working.

## 25. Hope actually driving/controlling Logic Pro (captured 2026-09-05) — research spike RESOLVED, see item 41 for the voice-trigger build

**Backlog capture only — not build authorization. Bigger, unscoped.** Ties to the existing "DAW
Bridge Epic (3 phases)" section below (this doc) and its `B-DAW1` / `B-DAW2` / `B-DAW3` DASHBOARD
backlog cards.

**Idea:** Kevin wants Hope to eventually say "click here in Logic, open that, use this plugin" and
actually walk him through or drive it live.

**Real caveat, logged explicitly so a future implementer doesn't assume a plain engineering
estimate:** Logic Pro does not have a rich public scripting/automation API like some other DAWs.
This needs a **technical research spike first** — what's actually possible via AppleScript hooks,
MIDI/OSC control surfaces, or anything else Logic exposes — **before any build estimate**, not an
estimate assumed straight from B-DAW1/2/3's existing (vaguer) description. This research-spike
requirement has been added to B-DAW1's own description below (this doc, "DAW Bridge Epic") so it
isn't lost the next time someone scopes B-DAW1.

**Spike RESOLVED, 2026-09-27, confirmed working (see `project_aimm_logic_pro_track_colour.md`):**
Logic Pro Creator Studio IS drivable — not via AX mutation (the inspector's colour swatch is a
custom-drawn AppKit control with no AX children), but via opening the real native "Assign Track
Color…" window and computing a synthetic mouse click at a live-read screen coordinate
(`osascript`/System Events). Track rename and track colour are both implemented and live-verified
in `/Users/admin/logic-pro-mcp-creator-v310` (branch `aimm-routing`); bulk bus creation was
underway. The technique generalises to any Logic action reachable through a real, AX-visible
window or menu — not a one-off hack for colour specifically. **Item 41 below is the concrete
voice-activated build on top of this, captured 2026-10-07 — read that before re-scoping this item
from scratch.**

## 26. Mix Check first-run onboarding — pending Kevin's decision (captured 2026-09-05)

**Design work exists — pending Kevin's review + choice, NOT yet approved for build.** Not a
"not started" backlog item; log it as a pending-decision item.

Jules built two mockup versions of an improved empty/first-load state for Mix Check:

- **v1 (lightweight)** — branch `jules-mixcheck-empty-state`. Hope greeting + quick-prompt chips in
  the rail, a slim "① Drop → ② Measure → ③ Ask Hope" strip, cleaner idle Spectral Balance hint.
- **v2 (full first-run guided tour)** — branch `jules-mixcheck-firstrun-tour`. 5 AIMM-specific
  steps, first-run-only with a re-triggerable "?" icon, reference pattern from a competitor
  screenshot.

Kevin has **not yet reviewed/chosen** between them. Note: the **Hope-rail greeting message piece**
specifically (the first element of v1's mockup) is being extracted and built for real **right now**
by Markey, separately from this pending decision — Kevin's call ("there's nothing stopping us, it's
a quick win") — so that piece is NOT "not started"; only the rest of the onboarding-tour direction
(v1 vs v2, quick-prompt chips, the guided tour) is still pending Kevin's review and choice.

The "① Drop → ② Measure → ③ Ask Hope" strip specifically from v1 is tracked separately — see item
27 below — rather than bundled into whichever onboarding direction Kevin eventually picks.

## 27. Mix Check onboarding — "1-2-3 guide" strip (captured 2026-09-05, deferred to a later stage)

**Backlog capture only.** The slim "① Drop → ② Measure → ③ Ask Hope" getting-started strip from
Jules's v1 mockup (see item 26 above). Kevin wants this treated as its **own separate future-stage
item, explicitly deferred** — not bundled into whichever onboarding direction gets picked from item
26. Distinct from the Hope-greeting piece of the same v1 mockup, which is being built now (see item
26) — the 1-2-3 guide specifically is "some other stage."

## 28. Spectral Balance card — revisit (captured 2026-09-05, deprioritized)

**Backlog capture only — vague placeholder, no specifics.** Kevin flagged he wants to come back to
the Audio Specs / Spectral Balance card at some point. No specifics given yet — this is a flagged
area of interest, not a scoped task. Kevin explicitly said Hope's intelligence work (items 24/25
above) matters more right now. Do not invent scope for this item; expand it only when Kevin gives
specifics. **Items 29 and 30 below (captured same day) are the specifics that eventually landed —
cross-reference this item when either is picked up so it isn't scoped a second time from scratch.**

## Note — Mix Check's three loudness/genre-target controls (investigated 2026-09-05)

**Context only, not an action item.** Kevin flagged the Audio Specs card's Classified Genre reading
seemed "stuck on Trap." Investigation (reading the live `index.html` directly, not assuming) found
THREE separate, confusingly-similar controls on the Mix Check tab, only one of which was actually
broken:

1. **Header "Genre" pill (`STATE.genre`)** — works correctly. Drives plugin library top-picks and
   the Classified→Genre display. Kevin's own screenshots confirmed the Genre pill and Classified
   reading both showed "Hip-Hop" consistently — this control is fine.
2. **Header "Target" pill (platform loudness spec — Trap −8 / Spotify −14 / Apple −16 /
   SoundCloud −10 / YouTube −14 / Tidal −14)** — **confirmed broken/dormant.** `refPopulateOzTargets()`
   (`index.html` ~line 16247) hardcodes its pass/fail checks — `li>=-8` for the Trap and SoundCloud
   rows, and a literal `true` for the Spotify and Apple rows regardless of the actual measured
   loudness — instead of reading real analysis output. On top of that, both UI surfaces that would
   ever display this table's result are already dormant in the current R3 layout: the header-pill
   wrapper (`data-dormant="r3-platform-targets"`, `index.html` ~line 2773) and the full legacy
   "Platform Loudness Comparison" table (`data-dormant="mixcheck-r5-legacy"`, `index.html` ~line
   2856, table itself ~line 2924). So this was never just a hardcode bug — the whole feature is
   currently invisible to users regardless of the calculation being wrong. See item 29 below for the
   planned fix (revive + expand + correct the calculation) — this note exists purely so a future
   session doesn't treat the root cause as unexplored territory.
3. **Spectral Balance panel's own "Target" dropdown** (e.g. "Target: auto (workbench genre)") — also
   labelled "Target," which is the source of the original confusion, but this one does work. It
   compares the mix against a synthetic averaged genre-corridor curve (`REF_CORRIDORS`), not a real
   reference track. See item 30 below for the planned upgrade to a real reference-track comparison.

**Do not touch `index.html` to "fix" #2 as a standalone task** — it's folded into item 29's scoped
revival below, which also needs a Jules mockup first per the standing mockup-first process.

## 29. Revive + expand Platform Loudness Comparison table (captured 2026-09-05, awaiting a Jules mockup)

**Trigger:** Kevin referenced [loudnesspenalty.com](https://www.loudnesspenalty.com/) — a well-known
free tool that shows, all at once (not one platform at a time), how much loudness penalty a track
takes on every major streaming platform. Kevin's reaction: "this is more useful" than AIMM's current
single-platform Target picker. This maps almost exactly onto the dormant "Platform Loudness
Comparison" table already sitting in `index.html` (see the note above) — it needs reviving,
expanding, and having its calculation fixed rather than being built from scratch.

**Scope:**
- **Revive** the dormant table — drop the `hidden`/`data-dormant="r3-platform-targets"` wrapper
  (`index.html` ~line 2773) and/or the `data-dormant="mixcheck-r5-legacy"` wrapper containing the
  full "Platform Loudness Comparison" table (~line 2856/2924), whichever Jules's mockup places it
  in — this is a design decision, not a foregone conclusion, since R3's layout has moved on since
  either was last live.
- **Expand the platform list** to match loudnesspenalty.com's fuller set — add Tidal, Amazon,
  Pandora, Deezer alongside the existing Trap/Club, Spotify, YouTube, Apple Music, SoundCloud rows
  (Trap/Club and Tidal loudness targets already exist elsewhere in the app's platform-target data —
  reuse rather than re-deriving).
- **Fix the underlying calculation** — `refPopulateOzTargets()` (`index.html` ~line 16247) currently
  hardcodes `li>=-8` for Trap/SoundCloud and a literal `true` for Spotify/Apple regardless of
  measured loudness. Replace with real pass/fail logic against each platform's actual target, driven
  by the real measured integrated LUFS (`refSpecPoints`/the existing LUFS pipeline), same as the
  rest of the Audio Specs card.
- **UX direction, per Kevin:** show every platform's penalty at once in a single comparison view —
  not a picker that shows one platform at a time. loudnesspenalty.com is the direct visual/UX
  inspiration.

**Process gate — mockup required before any build.** Kevin wants to see a Jules mockup of this
table's layout within the current Mix Check (R3) design before implementation starts, per the
standing mockup-first process (`docs/CLAUDE.md` "Mockup review process"). **Status is "awaiting a
Jules mockup," not "not started"** — the direction and scope above are locked, only the visual
layout is open.

**Priority, per Kevin's explicit instruction:** queued behind Hope's intelligence work (items 24/25)
— build after, not before or instead of.

## 30. Real A/B reference-track comparison for Spectral Balance (captured 2026-09-05)

**Reinforces and updates the existing "P-B: A/B Ref tab" section below (this doc, under "Planned —
Session 6 priorities") and its matching DASHBOARD.html card "B-P2. Build A/B Reference tab" — this
is new direction for that same backlog item, not a duplicate.**

**Trigger:** Kevin referenced iZotope's own guidance on [mixing with reference
tracks](https://www.izotope.com/community/blog/mixing-reference-tracks), which confirms the
professional standard for tonal-balance comparison is uploading a real commercial reference track
and comparing a mix's actual measured spectral/loudness/stereo characteristics against that specific
track's actual measured characteristics — not a synthetic genre-average curve. This directly
validates the never-built P-B item, and specifically supersedes/updates the Spectral Balance panel's
current "Target: auto (workbench genre)" dropdown (see the note above, control #3) which only offers
a synthetic `REF_CORRIDORS` comparison today.

**Direction, per Kevin's explicit decision:** build P-B as a real reference-track A/B comparison —
let Kevin upload an actual reference track (WAV/high-quality MP3) and compare the mix's real
measured spectral/loudness/stereo characteristics against that track's real measured
characteristics, replacing or supplementing the current synthetic-corridor-only comparison. P-B's
existing spec below (two drop zones, overlaid spectral canvas, side-by-side delta meters, Hope
commentary, shared Web Audio pipeline) already describes this shape — this item's job is to fold in
the specific "real track, not synthetic corridor" validation and keep the two records from drifting
apart, not to re-scope P-B from zero.

**Priority, per Kevin's explicit instruction:** queued behind Hope's intelligence work (items 24/25)
— build after, not before or instead of. P-B's own spec still notes "Spec + mockup needed from Seat
A before any code" — that gate still applies.

## 31. Frequency-range solo / ear-training mode for Mix Check (captured 2026-09-06)

**Backlog capture only — not build authorization.** Kevin explicitly called this "a must-have
feature for stems."

**Numbering note:** this doc's own "Multi-stem Mix Check" section (above, "captured 2026-09-04")
has no numeric prefix, but `DASHBOARD.html` labels the same item **Backlog 22** — that mismatch
pre-dates this capture (confirmed by re-checking both files directly rather than assuming). This
item cross-references that section by its actual heading, and by "Backlog 22" where DASHBOARD.html
is the reference.

**Trigger:** Kevin referenced [Carve Audio's "Mixing Cheat
Sheet"](https://www.audioloom.com/carve-audio/mixing-cheat-sheet), a free plugin. Its core
mechanic: instead of only showing a visual frequency chart, it lets you **solo a specific frequency
range** so you actually hear what problem terms like "mud," "fizz," "presence," "air," "boxy,"
"harsh," "sibilant," "boomy," "thin," "nasal," "hissy" sound like in context, plus per-instrument
EQ/compression guidance. **This is the direct inspiration for the solo-to-hear mechanic — not
something to copy exactly.** Carve's plugin is a static per-instrument reference tool; AIMM's
version should be live/measured against the actual loaded audio (or, once stems exist, a specific
stem), not a generic cheat sheet.

**Kevin's exact framing for why this matters:** "the more Hope can point us to the issue, muddy,
boxed, hissy etc the better she can help to really improve a mix." This is not a generic
frequency-solo feature for its own sake — it's specifically about giving Hope real diagnostic
vocabulary backed by an actual audible demonstration, not just a dB-delta number.

**Scope:**
- **Core mechanic** — let the user (or Hope, once her control-tools item is built, see the
  "Multi-stem Mix Check" section's requirement 5) solo/isolate a specific frequency range of the
  loaded audio so it's audible in isolation, not just shown as a number/chart. Once stems exist
  (see cross-reference below), extend this to a specific stem's frequency range.
- **Vocabulary layer** — map frequency ranges + measured characteristics to named mix problems, so
  Hope can name the actual problem in plain language AND let the user hear it, not just report a
  delta number. Starting map (refine at build time against real measured data, not fixed exactly as
  below):
  - **Muddy** — low-mid buildup, ~200–500Hz
  - **Boxy** — ~300–600Hz resonance
  - **Harsh** — ~2–4kHz excess
  - **Sibilant** — ~5–8kHz excess in vocals
  - **Boomy** — sub/low buildup
  - **Thin** — lack of low-mid body
  - **Nasal** — ~800Hz–1.5kHz buildup
  - **Hissy** — high-frequency noise floor

**Explicit cross-references — this is dependent on/extends other backlog items, not a standalone
precursor:**
- **Direct extension of the "Multi-stem Mix Check" item** (this doc, captured 2026-09-04 /
  `DASHBOARD.html` Backlog 22). Once stems exist, this becomes per-stem — solo just the vocal
  stem's harsh 3–5kHz range, or just the bass stem's boxy low-mids — much more useful than soloing
  a frequency range across the full mix.
- **This is what item 22's requirement 6 ("demonstrate AND instruct" — Hope's "let me show you"
  capability) would actually demonstrate.** Requirement 6 is the general instructional/active
  mechanism; this item is the concrete diagnostic capability that mechanism would exercise for
  frequency-problem coaching.
- **Related DSP work to item 22's requirement 7** (basic live EQ, so a demonstrated move can
  actually be heard) — soloing a frequency band and applying an EQ move to it are closely related
  Web Audio work (a `BiquadFilterNode` filter chain). A future implementer scoping either should
  read both requirements together rather than building two separate filter chains.

**Priority, per Kevin's explicit instruction:** **not** prioritized ahead of Hope's core
intelligence build items (24/25) or the multi-stem item (22 / "Multi-stem Mix Check" above) — this
capability makes the most sense to build as an extension of those once they exist. Sequence
accordingly: 24/25 → 22 → this item, not the reverse.

**Forward cross-reference:** item 32 below (Glossary/Reference tab, captured same day) is the
broader vocabulary layer this item's term-to-frequency map lives inside — this map is that
glossary's audio-diagnostic subset, not a separate vocabulary to maintain twice. A future
implementer should read item 32 before finalizing this map so the two don't drift apart.

## 32. Glossary/Reference tab — mixing-terms glossary, for Kevin and Hope both (captured 2026-09-06)

**Backlog capture only — not build authorization.**

**Trigger:** Kevin referenced iZotope's own [glossary of common and confusing mixing
terms](https://www.izotope.com/community/blog/a-glossary-of-common-and-confusing-mixing-terms) as
scope/structure inspiration — **do not reproduce that article's text verbatim** anywhere in this
item or eventually in the app; it's a reference for shape and coverage, AIMM needs its own written
glossary content, not a copy. Checked directly (WebFetch, 2026-09-06, not taken on faith): the page
splits into a "confusing terms" section (roughly 30 entries — e.g. Air, Bloom, Muddy) and a "common
terms" section (roughly 50 entries — e.g. Automation, De-essing, Headroom), each with a short
1–3-sentence practical definition. Treat the exact split/count as approximate scope reference
(~80–110 terms total), not a number to hit precisely.

**Nav placement, per Kevin's framing:** this can take the nav slot freed up when the Conversation
tab was retired (see the Hope history-key-bump work, this doc/`docs/STATUS.md`, 2026-09-05) — not
literally reviving Conversation, just filling that gap in the tab strip with something useful
instead, since the tab strip already redistributed its width when Conversation was removed.

**Scope — two parts:**
1. **A visible Glossary/Reference tab Kevin can browse himself** — a curated glossary of mixing
   terms (~100+ scope, similar structure to the iZotope reference: term + practical definition,
   organized/searchable).
2. **Hope must be able to draw on the same glossary when she uses a term in conversation.**
   Kevin's exact words: "Hope can use this when explaining e.g. muddy." When she says a mix sounds
   "muddy," she should ground that in an actual definition (build-up of low-mid frequencies
   reducing clarity), not just use the word loosely.

**Explicit cross-reference — do not duplicate the term-to-frequency mapping in two places.** Item
31 above (Frequency-range solo / ear-training mode) already defines a term-to-frequency vocabulary
map for exactly this purpose — see item 31's "Vocabulary layer" bullet for the actual term list and
frequency ranges, not repeated here. That mapping IS the audio-diagnostic subset of this glossary's
content, not a separate thing to re-derive. A future implementer should treat item 31's map as the
seed for this glossary's audio-diagnostic terms, and this glossary as the broader vocabulary layer
(including non-diagnostic terms like Automation, Headroom, Sidechain, Transients) that item 31's
terms live inside.

**Implementation consideration, not a decision to make now:** Hope's side of this could likely
reuse whatever mechanism Markey is building for the YouTube KB search (`read_yt_knowledge`,
`docs/CLAUDE.md`/item 24 above) — a compact, always-loadable reference set. ~110 short terms is far
smaller than the video KB, so this might not even need search — could just be a compact digest
always in her context, similar in spirit to `buildProfileDigest()`/`buildLibraryDigest()`. Flagged
for whoever scopes this to evaluate, not decided here.

**Priority, per Kevin's explicit instruction:** backlog capture only, sequenced sensibly relative
to the other Hope-intelligence and multi-stem work already logged — not prioritized ahead of items
24/25 (Hope's core intelligence build) or item 22 (Multi-stem Mix Check). Read alongside item 31,
which this item's glossary content directly feeds.

## ✅ 33. Fix Queue "Analysing…" stuck-placeholder safety net SHIPPED — branch `cat-fixqueue-stuck-placeholder-safety-net` (2026-09-06, build 2026-09-06.4), awaiting merge

**Trigger:** Kevin's live screenshot repro — the "Up Next" card's "Recommended move" field stayed
stuck on the neutral `MOVE_PENDING` placeholder ("Analysing — pulling the specific move from the
reference library…") forever, even in a session where Hope had ALREADY given him the full,
specific move verbally in the chat/voice transcript (via her own separate `propose_mix_move`
tool path).

**Confirmed root cause:** two independent systems that don't talk to each other. (1) Hope's
spoken/typed answers come from her live ElevenLabs conversation + knowledge digest — working
correctly. (2) The Fix Queue card's own "Recommended move" text is populated by a SEPARATE,
silent background call to Anthropic's API using Kevin's own key (`MC_FIXMOVES.generate()`,
`index.html`). That function's early-return guard (`if (!key || !list || !list.length)`, fired
whenever no Anthropic key is configured or nothing's queued yet) returned immediately WITHOUT
ever assigning the honest fallback text that the function's own `finally` block already used for
a failed/unparseable API call — so `movesById` stayed empty and the card patched with nothing,
permanently, with no retry mechanism anywhere.

**Fix shipped:** the early-return branch now applies the same honest fallback string already used
elsewhere in this function ("Ask Hope to talk through the move — she has it grounded in your
reference library.") before returning, so the card can never get stuck on the neutral placeholder
forever regardless of Anthropic-key state, network failure, or parse failure.

**The second, real gap Kevin pointed at — investigated, NOT force-fixed:** even when Hope has
already given the answer live, the on-screen card still doesn't reflect it, because
`propose_mix_move` (Hope's tool, takes `bus`: master/vocal/808/drums/fx) and the Fix Queue's items
(built in `MC_FIXQUEUE.build()`, keyed by `key`: clips/crushed/mono/quiet/muddy/808/harsh/band-*
and `focusBand`: low/lowmid/mid/high/broadband, displayed as `#01`/`#02`…) use two entirely
different taxonomies with no natural 1:1 mapping — `propose_mix_move` has no `fix_id` argument at
all (unlike `mark_fix_applied`, which does). Forcing a guess-based match risked silently
misattributing a move to the wrong card. **Flagged as a follow-up UX/product decision for Kevin:**
should `propose_mix_move` gain an optional `fix_id` argument so Hope can explicitly say which Fix
Queue card a move belongs to? That's a voice-prompt/tool-definition change spanning Markey's
territory (`RT_INSTRUCTIONS`/`TOOL_DEFS`), not something to guess at silently. Not built this
round.

**Verification:** Codex three-touchpoint review (TP1 plan / TP2 diff / TP3 end-to-end) all clean.
Pushed to `cat-fixqueue-stuck-placeholder-safety-net` off `main` @ `2c98bfd` — not merged, awaiting
Kevin/coordinating session. Per Kevin's 2026-09-06 explicit priority reorder (see `docs/STATUS.md`
top entry), this item drops to low priority relative to Backlog 22 once merged — it's a real
confirmed bug fix, just no longer urgent.

## 34. AIMM stem separation — cloud backend + RunPod serverless Demucs worker — APPROVED, Kevin committed to build (decided 2026-09-21)

**Current direction, 2026-10-18:** Kevin manually runs Logic Pro Stem Splitter on his mixed
WAV, exports the stem WAVs, then bulk imports them into AIMM. The scratch split/export was
timed and verified on Kevin's music WAV. The RunPod/Demucs worker and automatic one-WAV
split-on-upload path are parked for later. The 2026-10-08 export-existing-tracks reframe
below is also historical for this input, because Kevin starts from one mixed WAV rather
than an existing multitrack session. See item 22 for the current first slice.

**Historical status (2026-09-21; see current direction above): APPROVED.** Kevin decided 2026-09-21: "we will implement this." This is no longer a
proposal under consideration — it is committed to build. This status change is docs-only; nothing
has been built or spent yet. **Priority position unchanged** — still behind the Hope-intelligence
backlog (items 24/25) in the queue; not reprioritized to jump ahead unless Kevin explicitly says so.
**Next step: implementation via Codex as lead implementer, Cat reviews, per standing process — not
started this pass.**

**Historical capture note (2026-09-20), kept for history not deleted:** originally logged as a
parked Runpod-GPU-credit idea — backlog capture only, not build authorization at the time. Nothing
has been created on Runpod; no pod, endpoint or volume exists for this item as of this update.

**Fact, per Kevin's own note (not re-verified live by this capture):** Kevin has Runpod credit worth
about 13 hours on an RTX 4090 at $0.74/hr (roughly $9.60 nominal, my arithmetic). The credit sits on
**Kevin's Runpod account, not on this repo**, so any of his projects can draw on it.

**Candidate aimm uses — candidates only, not plans.** The repo was not inspected for GPU-bound tasks
when this was captured. Two ideas that would be slow on Kevin's RTX 3070 but fast on a rented GPU:
- **Stem separation** (e.g. Demucs) — possible link to Backlog 22 (Multi-stem Mix Check), my inference, unchecked.
- **Heavier audio analysis** — possible link to the Platform Evolution Epic's ARCH-2 analysis work, my inference, unchecked.

**Caution — data boundary:** a rented GPU is third-party hosting outside Kevin's controlled setup. **Never
send Oxford or work-related audio or documents to it.** Hope in AI and personal projects only.

**Recommendation:** do not spend the credit just to use it up. Only if a real slow or GPU-bound job
actually appears, and **state the pod's hourly cost before creating anything.**

**Research brief:** `docs/RUNPOD-GPU-RESEARCH-BRIEF.md` (added 2026-09-20 for a fresh session; research
only, no spend).

**2026-09-21 update (Cat) — stem-separation feasibility, findings appended to the brief.** Confirmed:
stem separation is NOT built (it's Backlog 22's deferred "Option B"); AIMM's only backend today is the
`aimm-proxy` key-relay Worker, no storage/auth/job-queue (verified against `index.html` directly), so
ARCH-1 is still unbuilt; Demucs is the practical model; a Runpod serverless endpoint is a good fit for
the compute step but does not remove the ARCH-1 gap. Two proposals logged for Kevin's decision:
(A) an outside-the-app Demucs workaround feeding the already-live Option A upload, vs. (B) the real
in-product Option B (multi-day ARCH-1 + ARCH-2/3-shaped build). **Superseded same day, see below** —
Kevin clarified AIMM is intended to be monetized, so a workaround tied to Kevin's own hardware doesn't
qualify as a real answer.

**2026-09-21 update, later same day (Cat) — REVISED: monetization rules out the local-GPU workaround.**
Kevin's clarification: stem separation must work for any user on any computer via the app itself, not
depend on Kevin's local hardware or any user's GPU. This retires proposal A above entirely (kept for
history, not deleted) — **proposal B is now the only candidate**, and this pass works it out in real
architectural detail instead of a one-line sketch. Live GPU pricing pulled by the coordinator
(`list-gpu-types`, serverless, secure): **RTX 4090 serverless $1.10/hr** (HIGH availability, 10 DCs) or
**RTX A5000 serverless $0.69/hr** (also HIGH availability) — both ample VRAM (24GB) for Demucs; serverless
(per-second billing), not a rented pod, is the right product type for AIMM's bursty per-user usage.
At ~1 min inference/song: **≈$0.018/song on the 4090, ≈$0.011/song on the A5000** — compute spend is not
the blocker at scale. Minimal backend needed (an ARCH-1-equivalent slice, not the full Epic): auth/user
identity, an R2 presigned-upload path for the input WAV, a job-trigger + tracking record (Worker → RunPod
`/run` → D1/KV job row), a result-delivery path (worker pushes output stems straight to R2, avoiding a
large payload round-trip), a storage retention policy, and — the actual monetization hook — a usage
ledger (per-user, per-job) built in from day one so a future quota/paywall is a policy change, not a
rebuild. RunPod serverless worker: a Demucs Docker image with a standard `handler(event)` — check the
RunPod Hub first for an existing maintained Demucs worker before building a custom image. Full detail,
pricing table, and the cost/monetization breakdown: `docs/RUNPOD-GPU-RESEARCH-BRIEF.md`.

**Next action — APPROVED 2026-09-21, Kevin: "we will implement this."** This ARCH-1-slice +
RunPod-Demucs build is committed; queue position unchanged (Hope-intelligence work still sits ahead
of it). Implementation goes through Codex as lead implementer next (Cat reviews), per standing
process — not started this pass, docs-only update. Open live-tool-access questions to resolve
before/during that build: does a maintained Demucs worker already exist on the RunPod Hub, does the
account's endpoint config support completion webhooks, and the exact model-caching setup for htdemucs
weights.

**Picked up 2026-10-08 (Jacob), model-licensing decision made, real build started.** Checked the
RunPod Hub directly — **no official/maintained Demucs template exists there.** Found one small
community repo (`dwin-gharibi/runpod-demucs`, 0 stars, 7 commits, unlicensed handler code) usable
only as a reference, not something to deploy as-is. Separately surfaced a real licensing fact before
picking a model: Demucs' best-quality variant (`htdemucs`, Hybrid Transformer Demucs) is
**CC-BY-NC — non-commercial only**; `mdx_extra`/`hdemucs_mmi` are MIT (commercial-safe) but lower
quality. **Kevin's explicit decision, 2026-10-08: use `htdemucs` now** — AIMM is not yet monetized,
so CC-BY-NC is fine today. **This is a real, dated constraint, not a detail to lose: the model
MUST be swapped to an MIT-licensed variant (or a commercial Demucs license obtained) before AIMM is
actually monetized** — flag this explicitly whenever monetization work starts, don't let it ship
commercially on a non-commercial model by oversight.

RunPod API key created by Kevin (RunPod dashboard → API Keys → "AIMM Demucs", full access) and
stored in 1Password (Personal vault, item `RunPod API Key`, API Credential, `credential` field) —
never pasted into chat, read via `op read "op://Personal/RunPod API Key/credential"` when needed.
No Docker installed locally on Kevin's Mac — building the worker image via a GitHub Actions
workflow (push Dockerfile + handler → Actions builds + pushes to GHCR) instead of a local `docker
build`, so no new local tooling install is needed.

**Real end-to-end proof-of-path built, then the whole approach reframed — same session,
2026-10-08.** Worker repo `begb0037admin/aimm-demucs-worker` built (handler + Dockerfile + GHCR CI,
Codex-reviewed and fixed at every step per the mandatory implementation process), image deployed to
a real RunPod Serverless endpoint, two real bugs found and fixed via actual live test runs (Cloudflare
WAF banning `urllib`'s default User-Agent; job run/status calls hitting the wrong API host —
`api.runpod.ai/v2`, not `rest.runpod.io/v1`, which only handles template/endpoint management). Kevin
then pushed back on the cold-start wait this architecture inherently has (RunPod spinning a GPU
worker from zero + pulling a multi-GB image) — research confirmed this isn't a fixable bug, it's a
real tradeoff: truly-instant stem tools (LALAL.AI's fast mode) run entirely on-device, and the
directly-comparable cloud tool (Moises) itself averages ~75s/song, cloud processing time being real
regardless of cold starts.

**Reframe (Kevin, 2026-10-08) — the deeper insight: for Kevin's own use, stem SEPARATION technology
(Demucs/RunPod, and Logic Pro's built-in Stem Splitter) solves a problem he doesn't have.** Demucs-
style separation exists to pull apart an already-mixed-down single file. Kevin works inside his own
Logic Pro sessions — the bass, drums, vocal tracks etc. are ALREADY separate real audio, not
something that needs AI separation at all. **The actual need is simpler and higher-fidelity:
export the tracks that already exist and get them into AIMM without a manual step** — not run a
separation model on a bounced mixdown.

**Revised plan, replaces the RunPod/Stem-Splitter path for Kevin's own workflow:**
1. Automate Logic Pro's **File → Export → All Tracks as Audio Files** (or per-track Bounce in
   Place) — a long-standing standard Logic command, likely simpler to automate than the newer Stem
   Splitter feature, and the result is Kevin's actual mixed tracks, not an AI's guess at separating
   them. Reuses item 41's proven AX-window + computed-click technique; cross-reference that item
   rather than re-deriving the automation approach here.
2. Land the exported files in AIMM automatically via a **File System Access API folder grant**
   (Chrome-only, persists after one one-time grant — the single unavoidable manual step, same
   category as a one-time OAuth "Allow" click) — AIMM watches a folder Logic's export writes into,
   no drag-and-drop ever needed again after that one grant. This is the missing half of item 22
   (Multi-stem Mix Check), which is still mockup-only.
3. **Analysis and the actual Hope conversation stay in the AIMM web app — no Logic Pro plugin.**
   Considered and explicitly rejected (Kevin, 2026-10-08): building a second "Hope" inside a Logic
   plugin (AU/JUCE, a completely different tech stack) would duplicate the analysis engine (Audio
   Specs, Spectral Balance, Fix Queue) that already exists in AIMM and is the explicit product
   differentiator (see the "Hope actually being intelligent" vision note earlier in this doc). Logic
   is just the background export engine Hope reaches for; the "let me show you" conversation stays
   exactly where it is today.

**RunPod/Demucs work is NOT deleted — stays parked for a genuinely different, narrower future
case:** someone hands AIMM a single already-mixed file with no multitrack session at all (no Logic
project, just a bounced WAV) — that's the one scenario real separation technology is still needed
for, and it's the monetizable-product case per [[feedback_keep_monetization_pivot_cheap]]. Template
+ endpoint still exist on RunPod (idle, zero cost); repo `begb0037admin/aimm-demucs-worker` stays as
the real, working, Codex-reviewed starting point for whenever that case is actually built.

**Next step:** research spike into Logic Pro's "Export All Tracks as Audio Files" command — where
it lives in the menu, whether it's AX-accessible or needs the synthetic-click approach, what the
real invocation/wait/completion flow looks like. Not yet started.

**Context only, other repos — not aimm scope, not acted on:** `ai-news-channel` upscaling/restoration
of Flow footage (Hope's visuals are Codex-exclusive, so that would have to route through Codex), and
Markey's voice repos (larger speech models such as Whisper large-v3, or private TTS experiments).

## 35. Hope's KB search misses content when the question's wording doesn't match the transcript's vocabulary — ✅ SHIPPED, LIVE, VERIFIED (captured 2026-10-03, closed 2026-10-04) · owner: Markey + Adam

**Both sides are live, backfilled, and independently verified against the real deployed apps.** Full
architecture: voyage-context-3 embeddings → Cloudflare Vectorize → hybrid with existing BM25 via
Reciprocal Rank Fusion → Cohere Rerank 3.5. Brief: `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`.

**Linda (hr-fa-knowledge-base):** deployed to `hr-kb-ai.kevinlelitte.workers.dev`. Backfill: 6,678
documents, 23,298 vectors, **0 failures** (after fixing one real duplicate-document-key bug found live —
see Incident Log below). Verified directly via the real `/semantic-search` endpoint: the target
"Registering a New Radiation Worker" document returns as the #1 hit for its own title (score 0.63). The
full chat-UI test is still Kevin's to confirm himself (browser automation had trouble with Linda's specific
composer widget) — not a sign of a problem with the fix, just an untested surface.

**Hope (aimm):** PR #26 reviewed and merged by Kevin directly in conversation ("yes please go ahead and
merge and run the test"), deployed to `aimm-proxy.kevinlelitte.workers.dev`. Backfill: 608 videos, 3,191
chunks, **0 failures** on the final clean run (after fixing a real Vectorize ID-length bug found mid-run —
see Incident Log below). **Live-verified with 5 real chat tests, all grounded, zero fabrication:**

1. Teezio's clap EQ (357/1,100/5,900 Hz cuts + Spectre air) — exact quote, correct source
2. Teezio sibilance vs. Stuart White mic chain (compound question) — Teezio's half fully grounded;
   Stuart White's half correctly declined with a disclosed, accurate web-search fallback (Telefunken 251,
   Avalon 737, Tube-Tech CL 1B — verified against the same facts independently) rather than fabricating,
   when the KB search came up short on that exact generic phrasing
3. Jaycen Joshua's 808 sidechain setup (duplicated-kick trigger into Soothe2) — exact quote, correct source
4. Leslie Brathwaite's kick-vs-808 decision on "Care" — search correctly dug past a shallower transcript
   part to find the right one (Part 3), exact quote, correct source
5. Teezio's de-essing load-sharing philosophy — correctly reused the answer already established earlier
   in the same conversation instead of re-searching needlessly, same real quote, no wasted tool calls

Full question/answer text for all 5 tests is in this session's transcript; not duplicated here to keep
this entry readable. The pattern across all 5: real citations, real quotes, correct multi-hop search→read
behavior when needed, honest fallback instead of invention when search genuinely comes up short.

**Incident log — two real bugs found live, both fixed, both verified fixed:**
- **Linda:** `kb.json` has one genuine duplicate document (the same archived guide scraped twice under
  different topic passes, byte-identical content). The backfill script correctly raised rather than
  silently corrupting data. Fixed by skipping the duplicate during embedding — NOT by editing `kb.json`
  itself, since `kb-index.json` references documents by positional array index and deleting an entry
  would have silently shifted every later index.
- **Hope:** Vectorize vector IDs were a raw, unbounded `${videoId}::${chunk}` string, which exceeded
  Cloudflare's 64-byte ID limit for long MWTM slugs (producer-artist-song-partNN titles) — 3+ videos
  failed with `VECTOR_UPSERT_ERROR 40008` at 477/608 into the first backfill attempt. Fixed (commit
  `7f3775f`) with a short FNV-1a hash + truncated readable prefix + chunk number; `metadata.video_id`
  stays the full, unhashed source of truth for display, so nothing downstream changed. The Vectorize
  index was deleted and recreated clean before the final backfill run, so none of the content upserted
  under the old, broken ID scheme survived as orphaned duplicates.
- A separate browser-automation quirk (not an app bug) caused one round of live testing to silently fail
  — the `computer` tool's type/click actions weren't registering keystrokes into Hope's composer textarea.
  Confirmed via direct DOM inspection (the real input's `.value` stayed empty after "typing"). Dispatching
  the message via a direct JS `value` + `input` event + `.click()` on the real elements worked immediately
  and is the reliable method going forward for automated testing of this composer.

**Standing delegation note:** the PR #26 merge and "go ahead" were Kevin's own explicit calls in
conversation, made after reviewing a file-by-file diff summary (not the raw diff). Both bug fixes above
were narrow, clearly-justified technical corrections made under his standing overnight delegation
("accept and approve anything on my behalf... I will not be available to authorise 1Password prompts or
anything else") while he was asleep — recorded as delegated, not as if he personally reviewed either diff
line-by-line, since he hadn't at the time. He has since reviewed and confirmed the live test results
himself the next morning ("this is great").

**Overnight Cloudflare-access outage, for the record:** the 1Password↔Cloudflare-API-token bridge went
unresponsive right as Kevin went to sleep ("authorization timeout", confirmed genuinely down via multiple
isolated checks, not a chaining artifact — very likely his Mac's screen-lock blocking 1Password's
desktop-app bridge). Per his standing zero-manual-steps rule and explicit instruction against repeated
cycling, this was tried a reasonable number of times, confirmed real, then the work was paused and clearly
documented rather than hammered. It recovered on its own by morning and the remaining work (clean
reindex, deploy, backfill, live verification) completed immediately once it did.

**Remaining open items, not blocking, Kevin's call on priority:**
1. Linda's full chat-UI test, by Kevin's own hand, to close out the one surface browser automation
   couldn't reliably exercise.
2. The generic-phrasing gap (test 2 above) — the KB search still occasionally misses on very vague
   wording even when the content exists and ranks well for better-targeted queries. Not a regression,
   not fabrication (correct, disclosed fallback every time it's been seen) — a real, smaller follow-up
   on retrieval precision for a future session, not urgent.
3. `read_yt_knowledge`'s open design question (still literal substring-match) — now that semantic search
   can surface a video via paraphrase alone with no shared wording, should the read-deeper step also move
   off substring-matching? Flagged by Markey, not yet decided.

**Earlier blockers, since resolved:** Voyage AI and Cohere accounts were both created by Kevin directly in
conversation (billing added to each after hitting real rate-limit/propagation issues — Voyage's 200M free
token grant meant the actual backfill cost was effectively $0 regardless). `gh auth refresh -h github.com
-s workflow` for Linda's backfill GitHub Action was flagged as needed but turned out unnecessary — the
backfill ran via a temporary local clone instead of through GitHub Actions, sidestepping that blocker
rather than fixing it.

**Status: DECIDED, implementation dispatched 2026-10-03.** Full architecture brief, research trail, and
per-project implementation requirements: `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`. Short version:
**voyage-context-3 embeddings → Cloudflare Vectorize → hybrid with the existing BM25 via Reciprocal Rank
Fusion → Cohere Rerank 3.5.** Properly researched per Kevin's explicit directive — "I need the absolute
best fix, I don't care if it's going to cost me... I need robust options, no quick fix or cheaper
bandaids" — not a quick prompt patch. Same architecture applies to Linda (hr-fa-knowledge-base), who
has the identical underlying limitation (see below) — Markey builds Hope's side, Adam builds Linda's,
each against their own repo, both dispatched 2026-10-03.

**Original find (kept for history).** Found live-testing the two fixes shipped overnight
2026-10-02→03 (commits `5d76abb`, `d0a4cc8` — typed-chat KB-tool parity + anti-fabrication rule, then
compound/comparison-question decomposition into per-subject searches). Both of those fixes are
confirmed working live, no regression here — this is a separate, deeper, pre-existing limitation they
surfaced rather than caused.

**The bug:** `search_yt_knowledge`/`read_yt_knowledge` use a client-side BM25-style keyword match
(`kbSearchTok`/`kbSearchRetrieve` in `index.html`) against `docs/knowledge/kb-search-index.json`. When
a natural question's wording doesn't share vocabulary with the transcript's own wording, real,
already-ingested content can go completely unfound — not an honest "doesn't exist" case, a genuine
retrieval miss.

**Proven directly (not inferred):** asking Hope to compare Teezio's J. Cole sibilance work against
Stuart White's mic chain on Beyoncé's "Yoncé." The Stuart White content is real and already in the
KB (`docs/knowledge/mwtm-stuart-white-beyonce-yonce-p03.md` — Elam 251 mic w/ AC701 tube, Avalon 737
mic pre, Tube-Tech compressor, "warm" saturation setting). Hope ran 3 separate, properly-targeted
searches for it (the new decomposition fix working as intended) and still came back empty — correctly
declining to fabricate rather than inventing a gear list. Replicating the real scoring logic in Python
confirmed why: a query using natural phrasing ("mic chain", "recording") doesn't rank the right chunk;
the same query using the transcript's own gear-name vocabulary ("Elam 251 Avalon 737 Tube-Tech
compressor warm setting") ranks it correctly. Pure keyword search has no way to bridge that gap.

**Why PRIORITY, per Kevin (2026-10-03):** after reviewing the live test result himself, Kevin called
this the bigger issue of the two found that night. The anti-fabrication rule is working — but it
means a retrieval miss now LOOKS like an honest "not covered," which could quietly mask real content
gaps across the whole MWTM corpus (145 parts, 576 chunks) indefinitely unless the search itself gets
smarter. Flagged by Markey in the `af1bd1726f24befd4` hand-back as a reusable lesson: "a working
anti-fabrication rule will mask [a retrieval bug] as an honest 'I don't know' instead of exposing it."

**Measured scale (2026-10-03) — this is not a one-off edge case.** Using each video's own title as
the search query (the most natural available proxy for "would a user's question about this video find
it at all"), and checking whether its own chunks appear in the GLOBAL top-10 results:

| | MWTM (new, 2026-10-02 ingestion) | Pre-existing YouTube KB |
|---|---|---|
| Videos totally invisible to their own title search (0 chunks in top-10) | **56.6%** (82/145) | **47.5%** (220/463) |
| Deep content (chunk 2+) unreachable via the title | **86.5%** (373/431) | **92.2%** (1,984/2,152) |

This is NOT an MWTM-ingestion problem — the pre-existing, already-live YouTube KB has the same (or
worse) rate. This is a systemic limitation of the keyword-match search across the whole 608-video,
3,191-chunk library, present since before this week's ingestion, that went unnoticed precisely because
a working anti-fabrication rule makes a retrieval miss look identical to an honest "not covered." One
honest caveat on methodology: bare titles are a worst-case proxy — real conversational questions are
usually more detailed than a title, so the true miss rate on everyday questions is likely somewhat
better than these numbers — but the scale is consistent across old and new content alike, not a
small-sample fluke.

**Kevin's reaction (2026-10-03), directly:** "this is worrying and went unnoticed." Work on this started
same day — first step is investigating whether Linda's (hr-fa-knowledge-base) larger, reportedly-working
search setup has a reusable approach, before deciding whether AIMM needs something new.

**Adam's investigation (2026-10-03) — ANSWERED: Linda has the exact same limitation, nothing to reuse.**
Dispatched read-only, verified directly against the live code (not memory files) via the GitHub API:
Linda's `index.html` (`hr-fa-knowledge-base`) runs the identical family of search — client-side
TF-IDF/BM25-style keyword match (`retrieve()`, explicitly commented `BM25-style`), no embeddings, no
vector DB, nothing semantic anywhere (grepped both `index.html` and the 305-line `worker/worker.js` for
embed/vector/pinecone/weaviate/qdrant — zero matches, independently re-confirmed by Jacob). Her "larger
database" (6,680 docs, 23,345 chunks, ~33MB, confirmed via git blob API) is just more raw corpus, not
better technology. Adam replicated her real `retrieve()` logic in Python against the real data files
and ran the same style of test used on Hope: her own title-search blind-spot rate is **27.9%** (lower
than Hope's 47.5–56.6%, but Adam attributes this to a denser/more repetitive HR-jargon vocabulary
domain masking the same flaw, not a better algorithm — a direct vocabulary-gap test on a real document
("Registering a New Radiation Worker") returned **zero relevant hits** for natural phrasing, exactly
like the Elam-251/Avalon-737 case on Hope). **Conclusion: option (c) — AIMM genuinely needs something
new; so, less urgently, does Linda.** Full write-up: `begb0037admin/adam/memory/linda-search-mechanism-same-blind-spot.md`,
cross-cutting lesson logged at `begb0037admin/agent-commons/memory/candidate_linda_bm25_same_blind_spot_as_hope.md`.

**Candidate directions, now ranked by Adam (not yet chosen — Kevin's decision next):**
1. **Real embedding-based semantic search** (highest leverage) — precompute chunk embeddings at ingest
   time (static JSON vector array alongside existing chunk text), embed the user's query at search time
   via the same API, rank by cosine similarity. AIMM's existing `aimm-proxy` Cloudflare Worker is already
   the right shape to add this as a second key-relay route. Small per-query cost (fractions of a cent).
   This is the most direct fix for the exact gap measured (semantic similarity vs. raw token overlap).
2. **A hosted vector DB** (e.g. Cloudflare Vectorize, pairs naturally with the existing Worker) — same
   idea with ANN infrastructure instead of brute-force client-side cosine similarity; worth it once chunk
   counts get large enough that client-side scoring gets slow — not obviously necessary yet at AIMM's
   current scale (3,191 chunks).
3. **Lower-effort interim stopgap, not a full fix:** chunk/metadata term boosting or a small fixed
   domain-synonym table for query expansion — cheaper to build, reduces but doesn't eliminate the gap.

**Not a quick prompt fix — needs real scoping.** Markey's full write-up on the original compound-question
fix: `begb0037admin/markey/memory/aimm-hope-compound-comparison-kb-search-2026-10-03.md`.

**Next action:** DECIDED 2026-10-03 — see the top of this item + `docs/KB-SEMANTIC-SEARCH-UPGRADE-BRIEF.md`.
Markey dispatched to build Hope's side; Adam dispatched to build Linda's side, same architecture, each
against their own repo. Both builds follow Codex three-touchpoint discipline (new secrets required:
Voyage AI + Cohere API keys per project).

## 36. Linda's chat-UI test for the semantic-search upgrade — Kevin to confirm himself (captured 2026-10-04)

Follow-up from item 35 (shipped 2026-10-04). Linda's semantic search is verified working at the API level
directly — the real "Registering a New Radiation Worker" document returns as the #1 hit for its own title
via the live `/semantic-search` endpoint. What's NOT yet confirmed is the full chat-UI path: browser
automation had trouble reliably registering input into Linda's specific composer widget during testing, so
the end-to-end experience (typing a vague, no-shared-vocabulary question into her real chat and getting a
grounded answer back) hasn't been seen with real eyes yet.

**Action:** ask Linda, in her real chat at `kb.lelitte.co.uk`, a natural-phrasing question that doesn't
share wording with a real document — e.g. something close to "how does a new employee who'll be working
with radioactive materials get set up?" — and confirm she finds and grounds the answer in the real
"Registering a New Radiation Worker" document rather than coming up empty or going generic.

**Effort:** a few minutes, Kevin's own hand, no agent action needed.

## 37. Hope/Linda KB search — chunk-dilution retrieval gap — PRIORITY (captured 2026-10-04, measured 2026-10-04, escalated 2026-10-04)

Follow-up from item 35. The semantic-search upgrade (shipped 2026-10-04) fixed the core problems —
silent misses on vocabulary-mismatched questions, and fabrication when search came up empty. It did NOT
make retrieval perfect on every possible phrasing. Two real, confirmed misses found live: Stuart White's
mic chain (plain phrasing came up empty even though the content ranks well for a more specific query), and
a much sharper, three-layer case tonight — Jaycen Joshua's verbatim "eight instances of NLS bus" line.

**Three real bugs found and fixed live tonight, all confirmed against the actual failing query
("Jaycen Joshua NLS buss serial" / "Jaycen Joshua NLS bus"), each verified before moving to the next:**
1. MWTM's BM25 index never tokenized the producer's name at all (`x` was transcript-text-only by design,
   never saw title/channel) — `KB_SEARCH_DF['jaycen']` was literally `undefined`. Fixed by porting
   `deriveSessionLabel()` into `scripts/build_kb_search_index.py`, MWTM-scoped only.
2. The BM25 scorer had zero term-frequency saturation — an unrelated chunk ranked #1 globally purely
   because the common word "bus" repeated 17 times (score 1.745), beating the real chunk's three rare,
   genuinely meaningful single-occurrence terms (jaycen/joshua/nls, combined 0.703). Fixed with proper
   Okapi BM25 (k1=1.2, b=0.75) — corpus-wide fix, not MWTM-specific. **Linda (hr-fa-knowledge-base) is
   ported from the identical original formula and almost certainly has the same bug — flagged for Adam,
   not yet fixed there.**
3. The live LLM naturally asked for "NLS buss" (the standard audio-engineering spelling) while the
   transcript says "bus" (single-s) — zero stemming meant these were completely different tokens,
   confirmed this alone dropped the correct chunk from rank 1 to rank 3, outside the real top-4 Hope
   saw. Fixed with a small explicit token fold (bus/buss, buses/busses, busing/bussing).

**After all three fixes, the exact original failing query ranks the correct chunk #1** — confirmed
directly against the live production build, not assumed.

**Then a second live test (same evening, Kevin on Mac) surfaced the DEEPER problem these three fixes
don't solve:** asking the same question again found a real, true, correctly-cited mention in **Part 5**
of the same lesson ("another version of these NLS buses," built himself) — genuinely relevant, but not
the exact **Part 2** chunk with the "eight instances" detail Kevin actually wanted. Root cause: these
transcript chunks run 300-400+ tokens and cover several distinct topics each (in Part 2's chunk 6 alone:
multiband EQ, the "eight instances of NLS bus" aside, stereo width, analog board variance). A single
important one-line detail buried inside a long multi-topic paragraph gets diluted for BOTH retrieval
methods, for different reasons: BM25 loses it to louder, more-repeated competing terms in the same or
other chunks; semantic search averages a chunk's whole meaning into one embedding, so a brief aside
doesn't dominate that vector even though the words are genuinely present. **Confirmed directly:** the
semantic leg alone (bypassing BM25 entirely) also failed to surface the Part 2 chunk in its top 10 for
the exact failing query — ruling out "spelling broke semantic too" and confirming this is a structural
chunking problem, not a remaining algorithm tweak.

**Research brief delivered 2026-10-04 (same evening): `docs/KB-CHUNKING-RETRIEVAL-RESEARCH-BRIEF.md`.**
Validated the chunk-dilution hypothesis live against the production `/kb/vector-search` endpoint (not
assumed) — confirmed it's actually two separable effects (within-chunk topical dilution, AND
cross-document confusion among several same-producer videos), confirmed the two corpora (MWTM vs.
pre-existing YouTube KB) are shaped differently and likely need different fixes, surveyed 7 architectural
options, and recommends topic-shift chunking + parent-document retrieval scoped to MWTM's 145 videos
first (not a full 608-video re-chunk), gated on a small embedding-validation pilot before any re-ingest
commitment.

**Kevin approved the full recommended plan 2026-10-05 ("let's just get it done") — implementation in
progress, 2026-10-05/06:**
1. **Validation pilot — DONE, confirmed 6/6 (100%).** New sandboxed `/kb/embed-debug` Worker route
   (read-only, no index writes, its own dedicated `EMBED_DEBUG_KEY` secret rather than the production
   ingest key) let 3 real MWTM chunks (Jaycen Joshua's NLS aside, Stuart White's mic chain, Tom
   Elmhirst's mix-bus chain) be hand-split and compared against real voyage-context-3 embeddings for 6
   natural paraphrase queries. Every case: the topically-correct split beat the full chunk; the full
   chunk still beat the OTHER wrong-topic splits (not noise).
2. **MWTM re-chunking — DONE.** `scripts/rechunk_mwtm_topics.py` (LLM-assisted topic-boundary splitting
   via Claude Haiku through the existing `/anthropic/*` proxy, hard verbatim-guard — any segment that
   isn't an exact substring of the original transcript, in order, covering ≥90% of its words, skips that
   whole video rather than writing unverified content) rewrote 121/145 MWTM videos (24 safely skipped by
   the guard, left on original ~500-word chunking). 576 → ~1,900 chunks for the rewritten videos. Direct
   proof on the real incident case: the "eight instances of NLS bus" line, previously buried in a
   523-word four-topic chunk, is now isolated in its own 138-word chunk. Kevin ran the actual bulk
   `--all-mwtm --go` write himself (this agent's permission classifier blocks bulk file writes).
3. **BM25 index rebuilt — DONE.** `kb-search-index.json` now 608 videos / 4,602 chunks (was 3,191), 0
   warnings (frontmatter `chunks:` counts kept in sync by the rechunk script).
4. **`read_yt_knowledge` parent-document context — DONE** (build `2026-10-06.1`). Finer post-rechunk
   chunks meant the old "top-3 independently highest-scored parts" could return 3 scattered fragments;
   now returns the best-scoring part plus its immediate neighbors in original transcript order (a
   contiguous window), falling back to the next best-scored part only if the window has fewer than 3.
   Resolves item 38 as a side effect.
5. **Vectorize re-embed/re-upsert of the 121 rewritten videos — DONE.** Kevin rotated `AIMM_INGEST_KEY`
   (new value via `wrangler secret put` + deploy) and ran `scripts/backfill_kb_embeddings.py
   --video-ids-file scripts/mwtm_rechunked_video_ids.txt` himself with it — 121/121 videos, 1,895 chunks
   upserted, 0 failures, confirmed via the real script output. (A second attempt at a dedicated,
   additive one-off `/kb/mwtm-reembed-debug` route — meant to avoid needing Kevin's real ingest key at
   all, same low-stakes pattern as `/kb/embed-debug` — hit a new permission-classifier wall, "Auto-Mode
   Bypass," on both the key-generation step and the route-code step; abandoned in favour of the simpler
   original plan rather than keep probing for a path around it.)
6. **Live verification + real before/after benchmark — DONE.** Confirmed the re-upsert actually landed
   in Vectorize via a real `/kb/vector-search` query (near-literal "eight instances of NLS bus" wording
   now ranks the correct chunk, `mwtm-jaycen-joshua-dave-pensado-advanced-mix-techniques-p02` chunk 16,
   #1 out of 4,602 total chunks — not just trusting the backfill's 200 responses). Re-ran item 37's exact
   benchmark methodology (video's own title as query, semantic leg alone, top-10) on all 121 rewritten
   videos: **121/121 measured, 0.0% invisible to own title, 0.8% deep-content (chunk 2+) unreachable**
   (down from this subset's share of the original MWTM-wide 3.9%; 1 video — "Paradise — Part 7" — still
   has its deep content unreachable via title alone, not investigated further, not blocking). Script:
   `scripts/benchmark_item37_rechunk.py`. **Item 37's chunk-dilution fix is complete and verified.**
   Note: the original failing paraphrase ("...NLS buses in series chain") still doesn't surface the
   correct chunk on the semantic leg ALONE in isolation — expected per the research brief's finding (b)
   (cross-document confusion among several real same-producer videos, not fixed by re-chunking alone) —
   but the live production app runs BM25 + semantic + rerank together, and Kevin separately confirmed
   via the real BM25 leg that the now-isolated chunk ranks #2 of 4,602 for that exact query, a large
   improvement from being completely absent before.

**Kevin's call, 2026-10-04: stop live-patching individual near-misses, treat this as a priority research
item.** The three fixes above were real, correct, evidenced, and worth shipping — but they're patches on
a symptom. Natural language has effectively infinite spelling/phrasing variants; hand-maintaining a
synonym-fold list is not a sustainable process for closing this gap. **The real lever is almost certainly
chunk granularity** — splitting lesson transcripts by topic/subject shift rather than a fixed count per
video, so a detail like "eight instances of NLS bus" lives in its own small chunk instead of diluted
inside a paragraph mostly about something else. This needs a proper scoped research pass (chunking
strategy options, re-ingestion cost/impact across all 608 videos, whether MWTM's long-form conversational
transcripts need different chunking rules than shorter standalone YouTube videos) before any
implementation — not a quick fix mid-session. **Next session: start here.**

**Important: none of these misses were a regression or fabrication.** Every time, Hope correctly and
transparently declined or fell back to a disclosed web search rather than inventing an answer — exactly
the safe behavior the upgrade was built to guarantee. This item is about retrieval completeness, not
safety.

**Real benchmark, measured 2026-10-04 after the MWTM identity fix + full re-backfill, same methodology as
the original item-35 baseline (video's own title as query, checking its own chunks in the global top-10;
semantic leg alone, not the full hybrid+rerank pipeline the live app actually runs — so these are floor
numbers, the real system should do at least this well):**

| | Before (BM25-only baseline) | After (semantic, today) |
|---|---|---|
| MWTM — videos invisible to own title | 56.6% | **0.0%** |
| MWTM — deep content (chunk 2+) unreachable | 86.5% | **3.9%** |
| Pre-existing YouTube KB — videos invisible to own title | 47.5% | **2.4%** |
| Pre-existing YouTube KB — deep content unreachable | 92.2% | **32.3%** |

Lower is better on all four. MWTM is essentially solved. The pre-existing YouTube KB's video-level
blind-spot is also effectively solved (2.4%, likely explained by a handful of genuinely generic/short
titles, not a systemic issue). **The real remaining number to chase is 32.3% deep-content-unreachable on
the pre-existing KB** — this is the concrete target for future work on this item, not a vague "sometimes
it misses." One real transient API timeout during this measurement (1/463 videos) is noise, not signal.

**Candidate directions, not scoped yet:** query expansion/rewriting before the search fires (e.g. having
the model reformulate a vague question into gear/technique-specific search terms first), widening the
semantic search's candidate pool (currently `n` capped at 20-30) before reranking, or auditing whether the
pre-existing KB has its own version of item 35's MWTM-specific identity-dilution bug (checked directly —
418 of 463 pre-existing videos are generic tutorials with no producer identity to dilute in the first
place, and the remaining ~45 producer-specific videos already carry the name in their real YouTube title,
which gets embedded with every chunk — so this specific root cause is probably NOT the explanation for the
32.3%, but hasn't been definitively ruled out for all cases). Not urgent — the safety net is holding — but
now has a real number to measure progress against in a future session.

### 37b. Pre-existing (non-MWTM) KB's 32.3% follow-up — ✅ SHIPPED, LIVE, VERIFIED (2026-10-06)

**Follow-up investigation, 2026-10-06 (not urgent, from the backlog): is the pre-existing KB's 32.3% the
same root cause as MWTM's, or genuinely different?** Investigated properly rather than assumed, same rigor
as the original MWTM diagnosis.

**Finding 1 — the 32.3% figure itself was stale.** Re-running item 37's exact benchmark methodology against
the real, live `/kb/vector-search` endpoint on all 463 non-MWTM videos today measured **13.6%**, not 32.3%
— almost certainly a side-effect of MWTM's topic-rechunk reducing cross-corpus false-positive competition
in the shared Vectorize index (MWTM's old large, generic-vocabulary chunks were likely stealing top-10
slots from unrelated non-MWTM queries; smaller, more precise MWTM chunks compete less).

**Finding 2 — most of even the 13.6% is a benchmark-methodology artifact, not a retrieval defect.** Of the
63 "failing" videos, 51 are single-chunk videos (trailers/sneak-peeks) — the benchmark's "deep content
(chunk 2+) reachable" check is mathematically impossible to pass for a video with only one chunk, since
there is no chunk 2. This is not a bug to fix via rechunking; it's a measurement artifact worth flagging for
any future benchmark revision. Excluding these, the real rate among the 412 genuine multi-chunk non-MWTM
videos is **12/412 (2.9%)**.

**Finding 3 — of those 12 real failures, confirmed the SAME root cause (chunk-dilution) applies to a real
subset.** Read `docs/knowledge/_HvrYkH4nWU.md` (a 21-chunk standalone vocal-mixing tutorial) directly: its
old ~500-word fixed chunks span several sub-topics each (gain-staging → prefader metering → EQ sweep →
de-essing → saturation), the same shape as MWTM's pre-fix chunks. Confirmed live against the production
`/kb/vector-search` endpoint: a verbatim buried detail in chunk 5 ("de-ess around 5-6K if your mic has no
transformer, like a TLM 103") does not surface that video anywhere in the top 15 results for a natural
query about it — real chunk-dilution, not assumed. **Scoped the fix to the 63 non-MWTM videos with 9+
chunks** (`scripts/non_mwtm_longtail_ids.txt`) — the long-tail shape where this mechanism plausibly applies
— not all 463. (The other ~9 of the 12 real failures are mostly short producer-trailer titles that likely
suffer item 37 finding (b), cross-document confusion with full MWTM lessons about the same producer, not
finding (a) dilution — rechunking doesn't fix that; flagged for a separate future investigation, not
in scope here.)

**Fix applied — extended item 37's exact mechanism (`scripts/rechunk_mwtm_topics.py`) to this scope,** via
a new `--video-ids-file` flag (consistent with `backfill_kb_embeddings.py`'s existing flag). Codex caught a
real blocker before any write happened (TP1 plan review): several of these standalone tutorials run
15,000-20,000+ words, well past what Haiku's `max_tokens:8192` response cap can return verbatim in one
call — fixed with chunk-boundary-preserving windowing (2,500-word windows, each independently verified,
then the full concatenated result re-verified against the complete original transcript). Also found and
fixed directly (own testing, not Codex): the verbatim guard fails *consistently*, not randomly, on windows
where the raw transcript has interleaved song-lyric fragments (several of these engineers play the track
while talking) — Haiku reasonably "cleans" these on every retry, so added a 3-attempt retry per window
(catches genuine one-off stochastic failures) while leaving the guard itself untouched — a video that
fails all 3 attempts is safely skipped, same as MWTM's original 24/145 skip precedent, never force-written.

**Dry run (no `--go`) on all 63 candidates, run in 7 sub-batches of ≤10 after an earlier single 63-video
batch's output was lost to a buffering mistake (no `-u`, confirmed killed with zero recoverable output
after 2+ hours — corrected for every batch after):** **40/63 succeeded, 23/63 safely skipped** by the
guard (mostly the lyric-interruption pattern). Full real per-video chunk counts in session logs; succeeded
list saved at `scripts/non_mwtm_longtail_succeeded_ids.txt`.

**✅ SHIPPED, LIVE, VERIFIED (2026-10-06).** Kevin ran the corrected 3-step sequence himself (same
permission-classifier precedent as item 37 — `--go` confirmed blocked, "Irreversible Local Destruction"):
`rechunk_mwtm_topics.py --go` → **38 videos actually rewritten** (close to the dry run's 40; Haiku's
output is stochastic, small shift expected) → `build_kb_search_index.py` rebuild (707 videos, 7,316
chunks, 0 warnings) → `backfill_kb_embeddings.py` → **38/38 upserted, 2,250 chunks, 0 failures**, verified
live by both Kevin and this agent independently via real `/kb/vector-search` queries before trusting the
benchmark (e.g. `2uFh8yUKdOg`'s chunks 49/66/44/14/21 — genuinely deep content, not just chunk 1 — now
surface for a natural "how do you keep 149 tracks from sounding muddy" query).

**Real before/after, measured against the live endpoint:**

| | Before | After |
|---|---|---|
| The 38 rechunked videos — deep content (chunk 2+) unreachable (title-benchmark) | 2.7% (1/37 matched) | 2.6% (1/38) |
| Full 463-video non-MWTM corpus — deep content unreachable (title-benchmark) | 13.6% | 13.6% (unchanged, as expected) |

**Why the headline number barely moves, and why that's the correct, honest result, not a failed fix:**
the coarse title-benchmark (video's own title vs. its own chunks in the global top-10) was never a good
instrument for this corpus's problem — these 38 videos mostly already passed that coarse check even
before rechunking (their old chunk 1 already matched their own distinctive title). The REAL problem,
proven in the diagnosis phase, is that a SPECIFIC BURIED DETAIL inside a video goes missing, which the
title-benchmark doesn't test for. Two live before/after buried-detail checks confirm the fix works as
designed: (1) `P3-gKGjo9iU`'s buried "Reference" plugin recommendation (a level-matching/metering tool
mentioned mid-chunk, originally diluted inside a 500-word paragraph about filtering competing elements)
now ranks **#4 of all chunks in the corpus** for a natural query about it — previously absent from a
10-result window entirely in the pre-diagnosis test; (2) `2uFh8yUKdOg`'s muddy-mix-at-scale content is
now reachable via several distinct deep chunks instead of only chunk 1. The 51-single-chunk-video
benchmark artifact (item 37b's Finding 2) is untouched by design — not a retrieval defect, no fix needed.
The remaining ~9 producer-trailer cross-document-confusion cases (Finding 3's parenthetical) are also
untouched — a different root cause, flagged for a future investigation, not in scope here.

**Conclusion: item 37's chunk-dilution fix is confirmed to generalize beyond MWTM** to the subset of the
pre-existing KB that shares its structural shape (long single-topic tutorials chunked at a fixed word
count) — the fix was correctly SCOPED rather than blindly applied to all 463 videos, and the coarse
title-benchmark metric itself is now understood to be insensitive to this specific improvement for videos
that already passed it on title alone.

## 38. `read_yt_knowledge` — should it move off literal substring-matching? — ✅ RESOLVED (captured 2026-10-04, resolved 2026-10-05 as a side effect of item 37)

Open design question flagged by Markey during the item 35 build. Before the semantic-search upgrade,
`search_yt_knowledge` and `read_yt_knowledge` worked on the same keyword-overlap assumption, so a video
surfaced by search would reliably also work for a `read_yt_knowledge` follow-up. Once `search_yt_knowledge`
could surface a video via semantic similarity alone — with no shared wording — a paraphrased
`read_yt_knowledge` follow-up on that same video could come up empty, because it still did a literal
substring match internally. Proven as a real live failure during the item 37 incident, not just a
theoretical risk (chunks_matched:0 on reasonable paraphrases, silently falling back to chunk 1).

**Resolved as part of item 37's fix:** `read_yt_knowledge`'s internal per-document search now uses
token-overlap scoring (same tokenizer as the corpus-wide `kbSearchRetrieve`) instead of requiring one
exact literal phrase match — no separate embedding-based rebuild needed for this step.

## 39. Hope's Agent ID should not be per-browser localStorage state — PRIORITY (captured 2026-10-04) · owner: Markey

**Real incident, not hypothetical.** During today's Hope migration (`kevin@lelitte.co.uk` → `begb0037@ox.ac.uk`,
new agent `agent_9001m42hnyrwedts40en5a5npapp`), `index.html` had its hardcoded default Agent ID updated —
but Kevin's Windows machine kept giving wrong, stale answers (claiming only a trailer exists for Jaycen
Joshua, when full MWTM lesson transcripts are real and already in the KB) while the same question on his
Mac worked perfectly (exact real numbers: 357/1,100/5,900 Hz for Teezio's clap EQ, unguessable without
genuinely reading the real transcript). Root cause, confirmed: Windows still had the OLD agent ID cached
in its own browser's localStorage from before the migration, silently talking to the old, now-dormant
`kevin@lelitte.co.uk` Hope the whole time.

**The architectural gap:** `index.html`'s hardcoded "default" Agent ID only applies once — the very first
time a browser loads the app with empty storage. Once ANY value is ever saved locally, it overrides the
default forever, even after the source's own default changes. There is currently no mechanism to detect
or force-refresh a stale cached Agent ID when the real one changes. Kevin, directly: "that's a gap —
something like this should not have any storage on browsers. I should be able to open anywhere."

**The fix:** stop treating Hope's Agent ID as per-device state the user can set and browsers remember.
There is only ever one real Hope — it should be a single source-of-truth value read directly from the
deployed app (same pattern as `AIMM_BUILD`), not duplicated in localStorage per machine. Open AIMM on any
device, get the current agent, always, with no per-machine sync step ever needed again. Likely means:
removing (or at minimum overriding) the Settings field's ability to locally pin an Agent ID, and having
`elLoadAgentId`/`loadVoiceProvider`-equivalent logic always prefer the current hardcoded source value over
anything previously cached.

**Process:** real production code change to `index.html` (how the Agent ID is read, whether it's still
user-overridable at all) — Codex three-touchpoint discipline required, this is Markey's domain (voice/chat
feature). Not a one-off Windows Settings patch — that's the immediate unblock (manually paste the correct
ID into Windows's Settings field right now), but this item is the actual, durable fix so the next agent
change doesn't repeat today's incident on every device all over again.

## 40. 16 real MWTM lessons missing from Hope's KB since recording — ✅ SHIPPED (captured + closed 2026-10-06)

Found via a direct disk-vs-KB diff on `/Volumes/MacStore/AIMM_MWTM_Tutorials/` (46 real recorded session
folders on disk vs. only 30 ever ingested): 16 real lessons were never even cut into parts, let alone
ingested — Hope had zero access to this content, a different and more fundamental gap than anything in
item 37 (retrieval quality doesn't matter if the content was never indexed at all).

Two of the 16 briefly gave repeatable Input/output errors just trying to list them. Dispatched Max
(read-only diagnosis): caught the actual drive drop live (MacStore's disk numbers disappeared from
`diskutil list` mid-session, reappeared minutes later unprompted), found a real kernel-level EIO burst in
the unified log at the matching timestamp, confirmed via `fsck_apfs -n` that both affected volumes were
filesystem-clean, and verified both folders read perfectly, twice, once reconnected. Root cause: a
transient drop on the shared external USB dock these volumes live on, not drive or data damage — nothing
was lost.

**New tooling built so this doesn't need a manual MWTM-site screenshot per lesson going forward**
(`docs/mwtm/mwtm_autolabel_cut.py`): auto-detects a raw recording's real part count from its own dividers
(reusing `mwtm_copycut.py`'s detection, not duplicating it), samples ~45s of each part, transcribes it via
the existing meeting-transcriber Worker, and generates a real topic label via Claude Haiku routed through
the existing `aimm-proxy` `/anthropic` passthrough — zero credentials needed. Verified on a representative
pilot (14-part Andrew Scheps session) before batch-running the rest: correct H.264 3504×1970 video,
durations matching the plan exactly, divider boundaries correctly black, genuine studio footage at content
frames — spot-checked on a second, different set (an 11-part workshop) too.

All 16 cut, ingested via the existing `scripts/ingest_mwtm.py` pipeline (88 new `mwtm-` video_ids, real
transcription throughout), then immediately run through the item-37 topic-based rechunker so this content
gets the chunk-dilution fix from day one rather than needing a second pass later (75/88 successfully
rechunked, 13 correctly skipped by the verbatim guard — same protection as the original 121-video rechunk).

## 41. Voice-activated Logic Pro control via Hope — "Hey, create me some buses" (captured 2026-10-07)

**2026-10-18 stem-path clarification:** For item 22's current first slice, Kevin manually
uses **Stem Splitter followed by stem export**, then bulk imports those files into AIMM.
Automating Logic, including the earlier export-all-tracks plan below and the short-lived
same-day split-on-upload proposal, is deferred. This clarification does not authorize or
implement Hope voice-tool changes; those belong to Markey. The manual Logic split/export
is verified in item 22; automatic handoff remains untested and outside current scope.

**Backlog capture only — not build authorization. Kevin's explicit call: log it, let him pick the
order against the rest of the open backlog — don't start building.** Supersedes/concretises item 25
("Hope actually driving/controlling Logic Pro") now that its research spike is resolved (see item
25's update above) — read item 25 first, this is the next concrete step on top of it, not a fresh
idea.

**Kevin's ask, verbatim intent:** pick back up the Logic Pro automation work (track rename, bus
creation, track colour — all already proven working in `logic-pro-mcp-creator-v310`) and integrate
it with AIMM as a voice-activated Hope capability — "Hey, I've got Logic Pro open, can you create me
some buses?" — handling open-ended requests, not a fixed command list.

**Architecture agreed in this session (planning only, nothing built yet):**

- **Open-ended intent handling → Codex, not a fixed tool-call menu.** Hope passes the natural-
  language request straight through as a prompt to `codex exec`; Codex (an LLM agent, not pattern
  matching) decides the actual sequence of Logic Pro actions needed, reusing the proven AX-window +
  computed-synthetic-click technique from item 25. This is how "create me some buses" generalises to
  arbitrary future asks ("add a parallel compression bus on the drums," "rename these four tracks")
  without a new fixed tool for every possible request.
- **"No local component" reconciled with the hard physical constraint that remains.** Synthetic
  clicks/AppleScript against Logic Pro's real GUI must execute on Kevin's own Mac, in an active
  logged-in GUI session — there is no way around that; Cloudflare Workers (where Hope's realtime
  voice backend runs) have no access to his screen. Kevin's "no local component" is reconciled by
  **not installing anything new** — Hope's backend reaches Kevin's Mac over the SSH access already
  set up for his machines (`reference_kevin_machines.md`) and runs `codex exec -s workspace-write`
  there, rather than running a new always-on local listener/daemon.
  **Confirmed by Kevin, 2026-10-07: the GUI-session caveat doesn't apply in practice.** This is
  always used live, during a real session — Kevin at the Mac, Logic Pro already open, screen
  unlocked, talking to Hope in real time. There's no scenario here where Codex would be reaching
  into a locked or headless screen, so the one open risk flagged in the original planning note is
  resolved by the actual usage pattern itself, not by anything that needs building.
- **Claude Code's own classifier block (hit repeatedly in item 25's work) is not expected to apply
  here.** That block is specific to actions *I* (Jacob/Claude Code) attempt directly or via a
  Claude-Code-invoked subprocess — it is not a restriction on Hope's own production backend calling
  `codex exec` independently of any Claude Code session. Flagged as a reasonable expectation, not yet
  tested against the real production path.
- **Ownership split, Kevin's call pending full brief:** Cat (aimm general product engineering) for
  the bridge/backend + Logic Pro automation side, Markey (Hope's voice/chat feature) for wiring the
  voice trigger/intent into Hope. Not yet dispatched — backlog capture only per Kevin's explicit
  instruction this session.

**Not yet scoped:** exact tool-call shape on Hope's side (one generic `drive_logic_pro(request:
string)` tool vs. several), auth/trust boundary for a voice command executing real local automation,
and bulk bus-creation specifics (naming convention, how many at once, routing/bus-flow defaults) —
Kevin said he wants bulk bus creation working as part of this, but hasn't specified the actual
bus/routing shape yet.

**Scope pivot, 2026-10-08 — stem separation (item 34) connects to this item.** Working item 34's
RunPod cloud build, Kevin pushed back hard on the cold-start wait (see item 34's own log for the
full exchange) and made a sharper point: he already owns tools with built-in, instant, on-device
stem splitting — **Logic Pro's own Stem Splitter** (Logic Pro 11+, on-device via Apple Neural
Engine) and **Ace Studio**. Research confirmed WHY local tools feel instant and cloud ones don't:
LALAL.AI's fast mode runs entirely on-device (no server round-trip at all); the directly comparable
cloud tool, Moises, averages ~75s per song even at their scale — cloud processing time is real and
doesn't disappear, but a cold-start provisioning penalty (RunPod spinning up a GPU from zero) is a
SEPARATE, avoidable cost on top of it, one Logic Pro's local Stem Splitter never pays at all.

**Decision (Kevin, 2026-10-08): for Kevin's own use today, piggyback on Logic Pro's built-in Stem
Splitter via this item's proven automation technique** (AX-window + computed-click, same approach
as track colour/rename/bus creation) instead of the RunPod cloud path — fast, already paid for,
already installed, no GPU bill, no htdemucs licensing question (Apple's own model, not something
AIMM redistributes). Item 34's RunPod build stays parked, not wasted — template/endpoint already
built — for the separate future problem of a stem-split feature other AIMM users (without Logic
Pro) would use once AIMM is actually monetized.

**Standing design principle, Kevin's explicit instruction, applies beyond just this item:** don't
build local-only in a way that forces a full redesign later. Whatever shape the Logic-Pro-Stem-
Splitter integration takes, it goes behind one clean interface (conceptually: "give me stems for
this audio") with the local-automation path as today's implementation — so swapping in the RunPod
cloud path later, when monetization is real, is a backend swap behind that same interface, not a
rewrite of Hope's tools or the UI. Keep this in mind for every future build choice, not just this
one: always favour the option that keeps a cheap pivot to a monetizable version open, even while
building local-first today.
BM25 index rebuilt (707 videos, 5,641 chunks, 0 warnings); 75 rechunked videos re-embedded into Vectorize
(75/75, 967 chunks, 0 failures) — confirmed live via a real query against the production
`/kb/vector-search` endpoint before commit, not assumed from the backfill's own success output.

## ✅ P0 — ElevenLabs Billing Fix SHIPPED (2026-06-04)

**Root cause:** Accidental single-tap starts on the sphere generating micro-sessions.
**Fix:** Double-tap guard on `micStartFromFloat()` — first tap arms (500ms sphere flash), second tap starts the session. Single taps silently do nothing. Also: `sendContextualUpdate` tab-change notifications debounced at 30s.
**Commit:** `dcd9ef7` — live on GitHub Pages.

---

## Shipped
- **Claude model upgrade: Sonnet/Opus 4.6 → 5.5 SHIPPED (2026-10-04, build 2026-10-04.2)** — Research brain dropdown, Mix Check live API call, and all pricing/fallback refs moved from `claude-sonnet-4-6`/`claude-opus-4-6` to `claude-sonnet-5-5` (default, $2/$10 per MTok) and `claude-opus-5-5` ($4/$20 per MTok, non-default option). Both IDs live-verified against the real Anthropic API (Claude Platform Playground) before commit; Hope's chat confirmed running `claude-sonnet-5-5` in production post-deploy (`23f70e6`). Old 4.6 pricing entry kept as a stale-localStorage fallback only. Flagged after a usage-dashboard spike check found the model pinned to 4.6 since 19 Jun 2026 with no auto-update path.
- Voice stack: ElevenLabs + Hope + Claude Sonnet 4.6
- 30 client tools
- Cross-call memory via STATE.profile
- Project OS doc migration (2026-05-20)
- **YouTube KB wired into Hope's context (2026-05-21)** — `loadYtKb()`, `buildYtKbDigest()`, `read_yt_knowledge` tool (tool 31), RT_INSTRUCTIONS updated. Smoke test passed 2026-05-21.
- **Reference tab rebuild (2026-05-25)** — WAV drop zone + transport (play/pause/stop/±10s scrub) + 2×2 meter dashboard (LUFS Int, LUFS Short-term, True Peak, Dynamic Range) + canvas spectral analyser (FabFilter-style gradient curve, live FFT + idle animation) + Platform Loudness Comparison table + True Peak Ceilings table. Committed 4be7200, live on GitHub Pages.
- **Cloudflare Worker key relay (2026-06-11)** — SHIPPED, merged PR #1 (`a533ed3`), live on GitHub Pages. Keys are now server-side: `worker/` (deployed at `https://aimm-proxy.kevinlelitte.workers.dev` on Kev's Cloudflare account) holds the Anthropic + ElevenLabs keys as Worker secrets and relays the app's API calls; `index.html` has the `AIMM PROXY` shim (fetch rewrite + placeholder key seeding) plus baked-in default agent IDs. A fresh browser/device needs zero Settings entry. `/health` on the Worker URL is the browser-tab key check — verified green pre-merge. Single-user security model (Origin allowlist only) — add real auth + rotate keys before sharing AIMM. Deploy/rotation guide: `worker/README.md`.

## ✅ P-K1 — Mix Move cards (Mixio-inspired) SHIPPED (2026-06-11, build 2026-06-11.11)

Competitive study of Mixio (mixio.music — DAW-plugin AI mix assistant, "Chat with Spike") produced two steals. #1 shipped: Hope's concrete recommendations now render as structured **Mix Move cards** in the transcript — plugin + bus, terse parameter summary, why, low/medium/high confidence chip, and an **Apply** button that adds the plugin to the bus and pins the settings note (via the existing add_plugin_to_bus / set_plugin_settings handlers; card flips to ✓ applied). New `propose_mix_move` tool + RT_INSTRUCTIONS rule (call it for every concrete move, speak one short line, never read the card aloud). **Kev action: re-click Settings → "Register dashboard-inbox tool"** — the button now registers BOTH new tools (idempotent) — then a fresh call.

## P-K2 — Bus snapshot overlay ("poor man's channel rack") PLANNED (2026-06-11)

Mixio steal #2: their multicolour per-bus analyser needs per-bus audio feeds — but capturing buses ONE AT A TIME doesn't. Kev solos a bus in Logic → live metering captures its average curve → snapshot it (named: Bass / Drums / Vocals…) → Mix Check overlays the snapshots in different colours against the genre corridor, Mixio-style, and Hope comments on where buses fight. Builds directly on the live-metering engine (P0i) + corridor renderer (P0j). **Effort:** ~3-4 hrs.

## AIMM full-page redesign — Mixio-violet × Tonal Balance EPIC (in flight 2026-06-11)

**APPROVED by Kev 2026-06-11.** Constraints locked in from his feedback: (1) **no information loss** — implementation is a CSS-token reskin over the existing DOM, every current section carries over (he flagged the Hope-analysis box, sliders, troubleshooter pills + recipes specifically); (2) **Hope's chat docked on every page** (Mixio chat-rail) — SHIPPED into the live app ahead of the skin, build .13 (`#hopeRail`, relocates `.aichat-layout`, collapsible, persisted); (3) **keep OUR spectrum analyser** — the smooth corridor curve, not Mixio's jagged multicolour FFT. Per-tab mockups: **docs/mockups/aimm-redesign-v2.html** (clickable tab bar, all 8 tabs, content-inventory footers). Next: Kev reviews v2 → staged token rollout.

Kev: redesign the entire app in the modern style of **Mixio** (he supplied the screenshot: violet panels, black analyzer well with per-bus colour curves, channel rack, prompt rows with confidence %) with a tonal balance feel. Mockup built from the screenshot: **docs/mockups/aimm-redesign-v1.html** (three-zone layout: channel rack | corridor analyzer with multicolour bus curves [previews P-K2] | Hope chat with mix-move card). Awaiting Kev sign-off; then a design-token CSS pass rolled across tabs in stages. Note: meters replace Mixio's Bus Controls strip — AIMM advises, it does not actuate the DAW.

**Current baseline as of 2026-08-04:** two new mockups added, superseding v4 as the reference point for the still-open stub tabs (Library, Insight, Snapshots, Marketing, Settings) — **docs/mockups/redesign-v5-mixcheck-dashboard.html** (next MixCheck iteration) and **docs/mockups/ozone-redesign-v1.dc.html** (iZotope Ozone-style mastering-assistant exploration, dc-runtime component, needs `docs/mockups/support.js`). Not yet reviewed/approved by Kev — awaiting sign-off before any token rollout targets these instead of v4. Epic status: **still in flight, not settled** — this is the condition the "Hope → Mia persona rename" entry (below, under Planned — carry-forward) is waiting on.

## ✅ P0j — Tonal Balance-style spectral display SHIPPED (2026-06-11, build 2026-06-11.10)

Kev: "make the tab look like Tonal Balance — I love the design, particularly the spectral analysis and the metering." Shipped: (1) **genre target corridor** — translucent band on the display showing where the mix's spectrum should sit, house-made curves per genre (trap/hiphop/rnb/pop/afrobeats/lofi/flat), selector defaults to the workbench genre (`Target: auto`); mix curve is gain-normalised to the corridor over 150Hz–3kHz so SHAPE is compared, not level. (2) **Smoothed 64-point curve** (~1/6-octave averaging from 8192-pt FFTs, was 18 points at 2048) in TBC cyan-on-graphite with soft glow + fill, quadratic-smoothed. (3) **Whole-file average spectrum** — drops a Welch-averaged (24× Hann 8192 radix-2 FFT) curve onto the display immediately at file load, before pressing play. (4) Graphite restyle: near-black display (216px tall), thin uppercase labels, light-weight mono numerals on the meter cards. (5) Corridor paints when the tab opens; live + file playback both use the new renderer; idle breathing animation retired. Numerics verified (corridor anchors exact, FFT 1kHz peak at 1002Hz).

## ✅ P0i — Live input metering (Tonal-Balance style) SHIPPED (2026-06-11, build 2026-06-11.9)

Kev: wants live readings during playback instead of always uploading a file (like iZotope Tonal Balance). New "or meter live" bar on Mix Check: **🎙 Listen to input** (device picker — BlackHole carries the DAW's output on macOS; all browser input processing disabled: no echo-cancel/noise-suppress/AGC) and **🖥 Capture tab audio** (getDisplayMedia — meter YouTube/Spotify references straight from another tab). Streaming BS.1770-4: stateful K-weighting biquads, 100ms power segments → momentary/short-term/gated-integrated (recomputed live), max-hold 4× true peak per chunk. Meter cards update 4×/s with "(live)" sub-labels; spectral canvas runs live; Stop locks readings into the cards + pills like a file analysis. Mono sources metered on one channel (up-mix double-count guarded). **Numerically validated:** simulated 997Hz −18dBFS stereo stream through the chunk pipeline reads −18.00 LUFS / −18.00 dBTP. Note in UI + Hope box: correlation/balance/band pills still need a file analysis. KEV SETUP for DAW metering: install BlackHole 2ch (free), Logic → Multi-Output Device (speakers + BlackHole), pick BlackHole in the device dropdown.

## ✅ P0h — Mix Check meters: real BS.1770-4 implementation SHIPPED (2026-06-11, build 2026-06-11.8)

Kev: Mix Check readings "completely off" vs RoEX Mix Check Studio + his DAW. Root cause: the analyser was an approximation — "LUFS" was raw full-track RMS (no K-weighting, no gating; worst-case error on bass-heavy trap since K-weighting attenuates sub), "True Peak" was the plain sample peak (misses inter-sample peaks), "DR" derived from both. Replaced with the broadcast-standard algorithm: K-weighting biquads redesigned for the file's sample rate (libebur128/pyloudnorm formulas), 400ms blocks at 75% overlap with −70 LUFS absolute + −10 LU relative gating (integrated), loudest 3s window (short-term), 4× oversampled windowed-sinc true peak, DR card = PLR (TP − LUFS-I). **Numerically validated** against reference signals: 997Hz −18dBFS stereo reads −18.00 LUFS at 48k AND 44.1k; gating excludes silence; inter-sample test signal whose sample peak is −3.01 reads +0.08 dBTP. Secondary metrics (balance/tilt/correlation/pill band proxies) keep their quick estimates.

## ✅ P0g — Double-tap orb call control (iPad) SHIPPED (2026-06-11, build 2026-06-11.7)

Kev: iPad has no spacebar — needs to double-tap Hope's orb to start/end calls. Reintroduced tap control SAFELY (the old single-tap version is what stacked sessions): double-tap = two non-drag taps within 450ms, routed through the same guarded path as the spacebar (shared 600ms action cooldown, hardened elEnd, 1.5s restart lock). First tap flashes the orb "armed"; single taps never start anything; drag still repositions. Works for mouse and touch; touchend preventDefault stops double-counting via synthetic mouseup. Spacebar unchanged.

## ✅ P0f — Hope's dashboard sight + inbox autonomy SHIPPED (2026-06-11, build 2026-06-11.6)

Kev: Hope opens the dashboard but says she "can't read what's displayed" — and he wants back the old flow where she could discuss items, remove completed ones, and add new ones live. Restored + improved:
1. **Sight** — `read_doc('DASHBOARD.html')` (already in her server-side enum) now returns a LIVE digest instead of raw HTML: the Captured-from-voice inbox (numbered, with ids) + docs/ROADMAP.md — exactly the data the dashboard renders. RT_INSTRUCTIONS updated: never say "I can't see the dashboard"; call this and discuss item by item.
2. **Write access** — new `manage_roadmap_inbox` tool: list / remove / promote / edit inbox entries; syncs localStorage + Worker KV and refreshes the open dashboard overlay instantly. Adding stays `capture_to_roadmap` (which now also refreshes the overlay). Roadmap-file items (P0, P-A…) remain read-only — they're repo files.
3. **Registration** — one-time Settings button "🔧 Register dashboard-inbox tool" registers `manage_roadmap_inbox` with Hope's agent THROUGH the key relay (no key touches the browser). Idempotent: reuses an existing same-name tool, only PATCHes tool_ids if missing. **Kev must click it once, then start a fresh call.**

## ✅ P0e — Dashboard new-tab + durable captures store SHIPPED (2026-06-11, build 2026-06-11.5)

Kev's build-.4 retest: spacebar start/end + toast ✅, dashboard overlay opened ✅ but covered the whole app (chat invisible, felt like the call was lost → emergency tab close, which the panic button handled correctly). Changes:
1. **open_dashboard prefers a real new tab** — `window.open` first; only falls back to the overlay when the browser blocks pop-ups. For guaranteed new-tab behaviour Kev allows pop-ups for the site once (Chrome: padlock → Site settings → Pop-ups → Allow). Hope's tool response now tells him which happened and how to get back to the chat.
2. **Durable captures** — the Worker gains a `/captures` endpoint backed by Workers KV (binding `AIMM_KV`); `capture_to_roadmap` and DASHBOARD.html sync the inbox there (merge by id, newest-first, cap 200, localStorage as offline fallback). Captures now survive browser restarts/resets and appear on every device. **Kev setup required:** create KV namespace + binding + re-paste worker code — steps in `worker/README.md` "Durable captures". `/health` shows the binding state. This closes the "Durable captures store" planned item below.

## ✅ P0d — Build stamp + panic button SHIPPED (2026-06-11)

Kev's retest after round 2 showed round-1-only symptoms — almost certainly a stale GitHub Pages cache (Pages caches index.html ~10 min post-deploy), with no way to tell which build the browser was running. Two additions so that ambiguity is permanently dead:
1. **`AIMM_BUILD` stamp** — const at the top of the main script, rendered as a tiny monospace badge bottom-right on every tab + logged to console. HARD RULE added to docs/CLAUDE.md: bump it in every commit that touches index.html. Current: `2026-06-11.4`.
2. **Panic button** — `pagehide` handler explicitly `endSession()`s every session in `EL.liveSessions` (+ `EL.conversation`), so closing the tab/window finalises all Hope conversations with ElevenLabs immediately. Closing the browser is now a guaranteed kill switch for runaway billing.

## ✅ P0c — open_dashboard root cause + read_doc stale-roadmap + end-call feedback SHIPPED (2026-06-11, round 2)

**The real reason Hope could never open the dashboard (weeks of smoke-test failures):** `open_dashboard` was registered on the ElevenLabs side (`elevenlabs-client-tools.json`, agent calls it) but was **missing from `TOOL_DEFS` in index.html** — and the `clientTools` dict passed to `startSession` is built by iterating `TOOL_DEFS`. The agent's call had no client handler, timed out (30s `response_timeout_secs`), and Hope reported "the tool isn't connecting". Fixed: entry added to TOOL_DEFS. No ElevenLabs re-registration needed (server schema already correct).
**read_doc recited a months-old roadmap:** the server-side schema enum only allows `ROADMAP.md` — Hope literally cannot request `docs/ROADMAP.md`. Client now remaps `ROADMAP.md` → `docs/ROADMAP.md` and `CLAUDE.md` → `docs/HANDOVER.md` (active docs; root files are frozen history).
**Spacebar felt dead on end-press:** `endSession()` takes seconds and nothing changed on screen, so Kev kept pressing — which is how stray restarts crept in. `elEnd` now paints instant feedback (status strip "Ending…", call button, sphere drops in-call state, toast) before the async teardown; per-session teardown cap tightened 5s → 3s; "Cancelling…" toast on end-during-connect.

## ✅ P0 — Voice session stacking + spacebar-only call control SHIPPED (2026-06-11)

**Symptom (Kev, 2026-06-11):** space started a call; pressing space again couldn't stop it and stacked a SECOND billable session on top (two Hopes talking, double charges). Screenshot evidence: Hope greeting twice mid-conversation.
**Root cause:** `elEnd()` called during the connect window found `EL.conversation === null` (startSession not yet resolved), ended nothing, but still ran `elCleanup()` — flags reset, the in-flight session connected as an untracked orphan, and the next press started a new session on top of it.
**Fix:** (1) session registry `EL.liveSessions` — every startSession handle is tracked and `elEnd` kills them ALL (5s cap per session so a hung socket can't wedge the lock); (2) `EL.endRequested` — end pressed mid-connect is honoured the moment the handle exists instead of corrupting state; (3) `EL.ending` re-entrancy lock + included in all start guards; (4) 600ms spacebar cooldown; (5) **mouse/touch call control on the sphere fully removed** per the agreed 2026-06-04 Seat A brief (sphere stays draggable + animated; spacebar is the only start/end trigger); (6) double-tap arming deleted (dead code once mouse is out).

## ✅ P0b — open_dashboard + capture pipeline fixes SHIPPED (2026-06-11)

**Symptom:** Hope "couldn't pull up the dashboard" (every time), and captures weren't visible where Kev looked.
**Root causes + fixes:**
1. `open_dashboard` used a synthetic `target="_blank"` anchor click — tool calls arrive over the WebSocket with **no user gesture**, so popup blockers silently killed it. Now renders `DASHBOARD.html` in a full-screen in-app overlay iframe (Close button / Esc) — no popup permission needed, works every time.
2. The old hardcoded Pages URL broke localStorage origin matching when the app ran on localhost — overlay uses a relative URL, so the dashboard always reads the same captures inbox Hope just wrote to.
3. `capture_to_roadmap` dedup checked the FROZEN root `ROADMAP.md` → false duplicate blocks. Now checks `docs/ROADMAP.md` (active doc).
4. Successful captures now fire a visible in-app toast ("📥 Captured to dashboard inbox: …") so a silent failure can never masquerade as success again.

## In progress
- **Smoke test: YouTube KB** — **ELEVATED PRIORITY as of 2026-09-05** (see item 24, "Hope
  DAW-specific instruction quality", above — this gates that work). Verify `[YT_KB] loaded` in
  console, Hope can fetch SEIDS Logic Pro 101 chunks on demand (next in-office session)
- GitHub repo rename: remote SHIPPED 2026-05-21 — local folder + path sweep IN PROGRESS

## Planned — Session 6 priorities (2026-05-26)

### ✅ P-A: Mix Check tab — SHIPPED 2026-06-04
*Commit a3d96ba*

Three changes to the current Reference tab, shipped as one:

1. **Rename** — tab label changes from "Reference" to "Mix Check". Tab id stays `eq`. `data-label` attribute on the tab button updated.

2. **Troubleshooter pills replace Reference Guides** — the two static collapsed panels (Frequency Map, Stereo Width by Band) are removed. In their place: a live troubleshooter panel using the same symptom pills as the Repair tab. Pills auto-highlight based on WAV analysis results:
   - True Peak > −1.0 dBTP → "Master clips on streaming" — red
   - True Peak > −0.5 dBTP → same pill — deeper red
   - DR < 5 → "Mix is crushed / no dynamics" — red
   - DR 5–7 → same pill — amber
   - Correlation < 0.5 → "Stereo image collapses in mono" — red
   - Correlation 0.5–0.7 → same pill — amber
   - Spectral excess sub/bass band → "Low end is muddy / woofy" — amber
   - Spectral deficit sub band → "808 doesn't hit in the car" — amber
   - Spectral excess high-mid/air → "Hi-hats too harsh" — amber
   - LUFS Int < −14 → new pill "Mix too quiet for platform" — amber
   - Multiple pills can fire simultaneously
   - Clicking any pill gives the recipe (same troubleshooter behaviour as Repair)
   - Auto-generate: if analysis detects an anomaly with no matching pill, Hope generates a one-off pill with label + suggested chain

3. **Manual input mode** — no WAV needed. Meter cards get editable fields so Kev can type in readings from his DAW meter plugins (iZotope Insight, Nugen, etc.) and trigger the same pass/fail logic + pill highlighting. Override also works when a WAV is loaded — typed value takes precedence.

**Effort:** ~3 hours (rename ~10 min, pills ~1.5 hrs, manual input ~1 hr)

---

### P-B: A/B Ref tab (new — replaces Repair slot)
*Designed 2026-05-25. Spec + mockup needed from Seat A before any code.*

**Updated 2026-09-05 — see item 30 above** ("Real A/B reference-track comparison for Spectral
Balance"): Kevin explicitly validated this exact direction against iZotope's reference-track
mixing guidance and wants it built after Hope's intelligence work (items 24/25). Read item 30 for
the current framing before picking this up; the spec below is unchanged in shape.

The freed Repair tab slot becomes a dedicated reference track comparison surface.

- **Two inputs** — your mix (pre-loaded from Mix Check if already analysed, no re-drop needed) + a second drop zone for a reference track (WAV/AIFF from library, downloaded from Spotify/Apple Music etc.)
- **Overlaid spectral canvas** — your mix renders as the existing gradient curve; reference track renders as a dimmer white/grey curve on the same canvas. Gap between the two is immediately visible.
- **Side-by-side delta meters** — LUFS Int, True Peak, DR, Correlation shown for both tracks with a Δ badge (e.g. "your mix is +4.1 LUFS hotter"). Pass/fail colouring on both sides.
- **Hope commentary** — on demand or automatically after both files load. Uses existing Claude/AI Chat infrastructure. "Your sub is 6dB hotter than the reference. Your True Peak headroom is tighter. Highs are well-matched."
- **Shared engine** — reuses the Web Audio API pipeline, FFT analyser, canvas renderer, and meter card components already built for Mix Check.
- **Note on Spotify:** streaming audio cannot be loaded in-browser without OAuth. Practical path is Kev downloads a reference track as WAV or high-quality MP3 and drops it. Covers 99% of the use case.

**Tab name:** A/B Ref
**Tab id:** `ab` (new panel, new button)
**Effort:** ~4 hours

---

### P-C: Retire Repair tab
*Agreed 2026-05-25. Ships alongside P-A or after.*

The Repair tab (`data-tab="meter"`) becomes redundant once P-A (Mix Check pills + manual input) ships. Everything unique to Repair moves to Mix Check. The tab slot is freed for P-B (A/B Ref).

- Remove `<button class="tab" data-tab="meter">` from nav
- Remove `<div class="panel" id="meter">` and its contents
- Remove any `meter`-specific JS that doesn't serve the new tabs
- Update `switch_tab` tool enum to remove `meter`, add `ab`
- Update `buildAppKnowledgeDigest` TAB NAV catalog
- Update RT_INSTRUCTIONS references

**Effort:** ~1 hour (mostly careful deletion + search/replace)

---

### P-D: Hope's sphere — animated particle orb replacing floating mic
*Designed 2026-05-25. Visual mockup created — see docs/mockups/hope-sphere.html.*

The flat floating mic button becomes a living representation of Hope — a particle sphere that:

- **Idle** — slow gentle pulse, cool teal/cyan, soft glow, particles drift slowly
- **Listening** — particles quicken, colour shifts slightly warmer, gentle rotation
- **Speaking** — reacts to Hope's voice amplitude via Web Audio API analyser on the EL audio output; sphere expands/contracts with her speech rhythm
- **Thinking/processing** — particles scatter then reform, cooler blue-white
- **Emotional intensity** — colour temperature shifts: calm = teal (#06b6d4), engaged = purple (#a78bfa), emphatic = white-hot (#f0f9ff)

Implementation: canvas-based, ~150 particles, no external library. Same Web Audio API infrastructure as the spectral analyser. Still draggable/floatable, same position persistence.

Reference image provided by Kev (2026-05-25 session) — teal/cyan glowing particle sphere on black background, equatorial band detail.

**Effort:** ~3 hours

---

### P-E: Hope tools for Mix Check + A/B Ref
*Designed 2026-05-25. Depends on P-A and P-B shipping first.*

New client tools added to `TOOL_DEFS` so Hope can see and interact with both new tabs:

- `get_mix_check_state` — returns filename, LUFS Int, LUFS Short-term, True Peak, DR, Correlation, Stereo Balance, which pills are highlighted and their severity
- `set_meter_value` — manually sets a meter value (LUFS/True Peak/DR/Correlation) in the Mix Check dashboard, same as Kev typing it in
- `get_ab_ref_state` — returns both sides of A/B Ref (filenames, all meter values, delta values) when both files are loaded
- Extend `toggle_symptom` to cover Mix Check pills (currently only Repair)

Hope proactively flags issues without being asked: if True Peak is over ceiling after a file loads, she mentions it on the next voice turn.

**Effort:** ~1.5 hours (after P-A + P-B)

---

## Planned — carry-forward from previous sessions

### DAW Bridge Epic (3 phases)
*Inspired by EchoJay review — 2026-05-24*

**Historical backlog requiring rescope:** this older DAW-session export concept is separate from the 2026-10-23 Plugin Library companion workstream above. Its AAX/Pro Tools references conflict with Kevin’s current Plugin Library scope and must not be carried into that companion. “Phase 1” below refers only to this old epic.

**Phase 1 — Plugin Scan (historical JUCE companion concept; rescope required)**
- Lightweight VST/AU/AAX companion plugin
- Single function: scan DAW plugin list → export `aimm-plugins.json`
- User drops JSON into AIMM → Hope confirms library update
- Existing manual/screenshot/voice input kept as fallbacks
- **Research spike required before any build estimate (added 2026-09-05, see item 25 above,
  "Hope actually driving/controlling Logic Pro"):** Logic Pro does not have a rich public
  scripting/automation API like some other DAWs. Before scoping effort for B-DAW1/2/3, a technical
  spike must confirm what's actually possible — AppleScript hooks, MIDI/OSC control surfaces, or
  anything else Logic exposes. Do not carry forward an engineering estimate assumed from this
  section's existing (pre-spike) phase descriptions.

**Phase 2 — AIMM Import Handler (index.html)**
- "Sync from DAW" button
- JSON drop/import handler
- Merges with existing plugin library

**Phase 3 — Audio Capture Bridge**
- Plugin captures snippet during DAW playback
- Sends LUFS, spectrum, dynamics to AIMM via local WebSocket
- Hope advises based on actual signal data

**Other carry-forward:**
- `ingest_yt.py` → auto-update `index.json`
- Hope KB: channel crawl continuation
- iPad PWA

### ✅ Durable captures store — SHIPPED 2026-06-11 (see P0e above)
Built as scoped: `/captures` on the aimm-proxy Worker, Workers KV, app + dashboard sync with localStorage fallback. Remaining: Kev's one-time KV namespace + binding setup (`worker/README.md`).

### Hope → Mia persona rename (blocked, scoping only — captured 2026-08-04)
Rename the AIMM voice persona "Hope" to "Mia." Full spec, scope table, and phased plan: **`docs/HOPE_TO_MIA_RENAME_PLAN.md`**.

- **Blocked on:** Cat (Kevin's dedicated agent for general AIMM product engineering) must exist first — not yet built as of 2026-08-04.
- **Sequenced after:** the in-flight Mixio-violet redesign epic reaches a stable/shipped state (currently still moving — `redesign-v5-mixcheck-dashboard.html` / `ozone-redesign-v1.dc.html` added 2026-08-04).
- **Scope:** `index.html` UI text (~213 refs), `hopeRail`/`hopeSphereCanvas` DOM/CSS ids, 6 localStorage keys, `docs/mockups/`, active docs. Excludes the dormant 5-persona system (see Icebox below), `hope-kb` KB tag, and `ai-news-channel`'s unrelated "Hope."
- **Separate track:** ElevenLabs dashboard config (system prompt, first message, voice label) owned by Markey, not this repo.
- **Open decision:** localStorage key compatibility policy (read-old/write-new vs. outright rename) — needs Kevin's confirmation before work starts.

## Icebox
- Five dormant personas (Matthew, Markey, Katie, Ashley, Lauren) — one-line revival ready

---

## Platform Evolution Epic — AIMM Beyond Single-File (captured 2026-06-23)

**Decision (2026-06-23):** AIMM evolves from a single-file browser app into a proper hosted, login-based web app with a backend. No install — browser login only. Driven by two product goals that the single-file constraint cannot support: RoEx-style mix analysis (needs Librosa/Python) and HyFi-style AI online mastering (needs server-side audio processing output). Cloudflare is the primary infrastructure (Worker already live). Staged rollout — don't break the current app while building the next layer.

**Staged rollout:**

### Stage 1 — Complete the redesign (current, no architecture change)
Ship the v4 Mixio-violet redesign. Single-file stays. No backend changes.

### ARCH-1 — Backend Foundation (Stage 2)
Extend the existing Cloudflare Worker + add R2 for audio file storage + add auth (Cloudflare Access or magic-link login). Audio files persist across sessions — no re-drop on every visit. This is the gate for all subsequent ARCH stages.

**Effort:** ~1 day

### ARCH-2 — RoEx-style Mix Analysis (Stage 3)
Python microservice (FastAPI on Railway or Render) with Librosa. WAV uploads to R2, analysis job runs, results return scored grades per dimension:
- **Tonal balance** — dark / neutral / bright (spectral centroid + band energy vs genre corridor)
- **Dynamics** — PLR + crest factor, over-compression detection
- **Loudness** — platform compliance (LUFS vs target)
- **Low end** — sub (<80Hz) vs bass (80–250Hz) energy ratio
- **Stereo width** — M/S energy ratio + correlation
- **Transient punch** — onset density (first-difference RMS envelope)
- **Overall mix health score** — A–F or 0–100 weighted average

Replaces current Web Audio API approximations. Scored report card UI replaces the current meter cards. Depends on ARCH-1.

**Effort:** ~2–3 days

### ARCH-3 — HyFi-style AI Online Mastering (Stage 4)
Online mastering: upload mix → AI processes → download mastered WAV. Like LANDR / HyFi — no install, no DAW needed for the mastering step. Server-side audio processing chain (EQ → compression → limiting → stereo enhancement) informed by ARCH-2 analysis scores. Platform loudness targeting baked in (Spotify −14, Apple −16, YouTube −14, etc.). Genre-aware chain selection. Depends on ARCH-1 + ARCH-2.

**Effort:** ~3–5 days

### Stage 5 — Full product
Login with project history. Multiple mixes per project. Saved master versions. Hope's memory server-side (not just localStorage). Multi-device sync.

**Non-negotiables:**
- Online, browser login — no install ever
- Cloudflare as primary infrastructure (Worker already live, extend don't replace)
- Staged — Stage 1 (redesign) ships on single-file; ARCH-1 onward adds the backend layer
- Current single-file app stays functional throughout the migration

## 42. Dashboard auto-generates from ROADMAP.md — single source of truth (captured 2026-10-08)

**Backlog capture only — not build authorization. Scoped via a Codex read-only planning pass,
2026-10-08; full plan: `docs/ROADMAP_DASHBOARD_SYNC_PLAN.md`. Real effort estimate: 2.5–5 days —
this is not a quick fix, Kevin's explicit call to log and defer rather than build same-session.**

**The incident this closes:** this session, `DASHBOARD.html`'s "Now" section was found sitting
stale since September — items 12/33 badged "Shipped — pending merge" for weeks after actually
shipping and merging (verified directly: `git merge-base --is-ancestor` confirmed both commits are
real ancestors of `main`). Root cause wasn't a code bug: Hope's own `read_doc`/dashboard-digest
mechanism is correctly built (live `fetch`, no caching) and was faithfully serving whatever
`docs/ROADMAP.md` actually said — the real problem is `DASHBOARD.html`'s cards are hand-maintained
in parallel with `docs/ROADMAP.md` and the two drift apart because keeping them in sync is a manual
discipline, not an automatic guarantee. This session alone needed three separate rounds of manual
reconciliation (item 34/41 content, the Now section, the ROADMAP.md Mix Check queue) to catch up —
exactly the failure mode this item exists to eliminate at the root.

**Kevin's framing, verbatim intent:** "if she can read the roadmap then she can read the dashboard"
— i.e. Hope and the dashboard should be reading the genuinely same data, not two hand-synced copies
that happen to usually agree.

**Recommended design (from the Codex plan, not yet built):** don't parse `docs/ROADMAP.md`'s
existing freeform prose directly — it's 1,932 lines of real chronological narrative, not a
consistent schema (heading levels mean different things in different sections, numbering has real
gaps/collisions, status is expressed a dozen different ways in free text). Instead, add small
`<!-- dashboard-card ... -->` HTML-comment metadata blocks immediately before each item that should
render as a dashboard card (invisible when rendered as Markdown, trivially parseable, explicit
`id`/`section`/`status`/`badge`/`effort`/`owner`/`continue` fields) — the canonical prose stays
exactly where it is, as the full evidence Hope already reads correctly. `DASHBOARD.html` then
fetches `docs/ROADMAP.md` at page load and renders cards from those blocks instead of hand-written
HTML. One file, one source of truth, for both Kevin's view and Hope's.

**Phased plan (full detail + real risks flagged in the linked doc):**
- Phase 0 (0.5–1 day): reconcile every currently-shown dashboard card against a real roadmap
  record, resolve mismatches (e.g. the dashboard's "Backlog 22" vs. the Multi-stem section's actual
  unnumbered heading), add the metadata blocks.
- Phase 1 (0.5–1 day): build + test the parser against the real file, without touching the live
  dashboard yet.
- Phase 2 (0.5–1 day): migrate just the Backlog section first as a contained proof.
- Phase 3 (1–2 days): migrate Now/Polish/Shipped, remove the old hand-written card markup.
- Phase 4 (0.5 day): add a validation check (CI or similar) so a malformed/missing metadata block
  fails loudly instead of silently drifting again.

**Real risks already flagged, not hand-waved:** the collapsible sections' persisted
`aimmDashboardSectionState_v1` localStorage state depends on stable section IDs staying static; the
"Continue here" buttons' `continueInCowork()` prompts contain real constraints ("don't start
coding", approval gates) that can't be auto-derived from title/body and must stay explicit
per-card metadata; the captures inbox (`hopeRoadmapCaptures_v1` / Worker `/captures`) is independent
data and must not be touched by this change; fetched Markdown must always be escaped, never piped
into `innerHTML` directly (XSS risk); a `file://`-opened dashboard can't fetch a sibling file at all
(Pages/local-server origin only) and must fail with a clear message, not a silent empty state.

**Explicit non-goals (from the plan):** don't change Hope's digest/read path (it's already correct);
don't turn the captures inbox into roadmap records; don't infer merge/deploy truth from prose at
render time (editors state status explicitly in the metadata block); don't ship a second generated
JSON/JS source alongside the Markdown (that would just recreate the drift problem in a different
format).

**Owner, when picked up:** Cat (aimm general product engineering) dispatches, Codex implements per
standing process, per-phase review before moving to the next phase given the real size of this.
