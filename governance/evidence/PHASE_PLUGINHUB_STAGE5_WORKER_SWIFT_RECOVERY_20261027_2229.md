# Stage 5 local Worker/Swift synthetic action and recovery — 2026-10-27 22:29 UTC

Branch: `codex/pluginhub-foundation`. Current-branch sources were retrieved from connected GitHub and staged in an isolated temporary tree. The local project checkout was not modified. Exact Worker source blob: `5cbca27f58cd5816ab77d0206397782f8f1edb10`; Wrangler config blob: `c77601aab375cfd25901b25958e234f05bdac6cb`; fixture script blob: `786a161d457b22f00cb413fe964477174a64084b`; integration script blob: `72522aa8d2f84359a0e9f8ffb77f2f916638f5c8`. The 21 current branch D1 migration blobs were checked against the local copies and all matched.

## Passed local synthetic checks

Ran the isolated Worker/D1 action segment from `scripts/pluginhub-nonprod-check.sh` with Wrangler `--local`, disposable local D1 state, synthetic account/device credentials, and files under `/private/tmp/pluginhub-local-worker.*`. The script trap removed the fixture and temporary state on exit.

Observed passing checks:
- Local migrations, Worker health, unauthenticated rejection, and allowed/hostile CORS.
- Both directions of cross-account device-credential rejection (HTTP 401).
- Actual Swift pairing and inventory sync against the local Worker/D1.
- Manual Check status remained explicit and supported status observations remained separate.
- Actual Swift action claim, signed/encrypted preview, and signed reveal receipt.
- Synthetic move to Unused, exact preview confirmation, filesystem move, full post-move sync, and signed receipt.
- Synthetic restore bound to the parent move, exact preview confirmation, filesystem restore, full post-restore sync, and signed parent-bound receipt.
- Local D1 readback confirmed the restore was completed with the signed receipt, and one complete post-restore generation was stored.
- Journal/recovery helpers passed: interrupted cross-volume restore retained its source, verified staged recovery resumed, and two-copy recovery resumed.
- Temporary ad-hoc companion bundle packaging/signature, Swift build, and three scanner integration tests passed.

No installed plug-in files were touched, no remote D1 was accessed, no live installer was downloaded, and nothing was deployed.

## Verification limitation

The full wrapper `sh scripts/pluginhub-nonprod-check.sh` was attempted in a deliberately minimal temporary branch tree. It stopped at the API test step because four unrelated test prerequisites were missing or stale in that partial copy: the DOM test stub lacked `insertBefore`, and the temporary root omitted `index.html` and the pinned D1 export fixture. The Worker/Swift synthetic integration segment was then run separately from the exact current-branch Worker/config/fixture/script and completed successfully. This report does not claim the full wrapper passed.

## Scope

This is local non-production synthetic integration evidence, not a fresh remote Worker/D1 move-restore run or independent Foundation acceptance. The paired-Mac reveal remains read-only evidence. Browser/account parity remains open (317 browser-only, 2 version differences); the 31-row Stage 4 mapping and real paired-credential wrong-device 401 remain open. Foundation exit remains NOT MET; Stage 6 remains gated. Preserve the 22:47 D1 authorization chronology. No production deployment or cutover.
