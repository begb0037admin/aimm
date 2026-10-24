# PluginHub Foundation — remote pairing and scheduled cleanup checkpoint

**Recorded:** 2026-10-24 17:43 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Branch head before this checkpoint:** `36867ccbd9620629790973a496320a4e3303e8a3`  
**Implementation target:** `ad76677a805275711ace40e52a5b1ffc25cad020`  
**Foundation exit:** **NOT MET. Stage 5 remains PARTIAL. Stage 6 is not ready. No production deployment.**

## New verified development evidence

- Auth0 Test User A held the development `read:library` and `manage:devices` scopes. Through the existing development Worker and D1, the browser harness completed signed pairing proof, owner phrase verification and approval, one-time device credential delivery, and repeat-poll rejection (HTTP 410). Credential material and tokens were not recorded.
- The owner revoked the temporary test devices. Reuse of the revoked device credential returned HTTP 401. A subsequent read-only D1 count showed **0 active devices and 0 active device credentials**.
- Scheduled retention cleanup was exercised on the isolated development Worker. The cron was temporarily changed to every minute at 2026-10-24 17:31:53 UTC. Before cleanup, D1 held four expired pairing rows, including one undelivered pairing. By 17:42 UTC, all four rows were gone without direct D1 mutation. The daily `0 3 * * *` schedule was restored at 17:42:41 UTC and was re-read from the Cloudflare API.
- Final read-only counts at 17:43 UTC: **2 accounts; 20 browser-session rows (20 currently active); 0 active devices; 0 active device credentials; 0 pairings; 1 pairing rate-limit row; 0 action receipts.** The active session rows are development test sessions and have not been cleared. No direct remote D1 write was made.
- The local API suite passed **14/14** in `/private/tmp/pluginhub-foundation-current/library-api`. This is local test evidence, not an independent review.

## Remaining Foundation gates

- **Cross-account remote rejection remains unproven.** Test User B's saved 1Password entry filled the Auth0 form, but the form kept Continue disabled and no User B API token was established. No cross-account device request is claimed.
- **Recovery:** the pinned post-0005 export-copy restore remains empty-data recovery evidence. No populated-state or D1-to-D1 recovery was performed in this checkpoint.
- **Account deletion:** no account was deleted. Obtain the separate action-time owner confirmation recorded in the closeout immediately before deleting a disposable test account.
- **Independent validation:** the existing Stage 5 decision is PARTIAL. Request a fresh read-only Stage 5 review against the updated evidence before changing that status.
- **Authorization chronology:** the 22:47 authorization gate is resolved by the owner's explicit confirmation; no new D1 creation or direct D1 mutation occurred in this checkpoint. This checkpoint made no database creation and no direct D1 mutation. Keep the separate 22:51 retention decision distinct.

## Method and safety

All D1 observations used read-only SQL queries. Pairing, device revocation and credential rejection used the development API. Only the existing development Worker schedule was temporarily changed, then restored to its daily schedule. No Worker code was deployed, no production resource was touched, and no provider terms were accepted.

