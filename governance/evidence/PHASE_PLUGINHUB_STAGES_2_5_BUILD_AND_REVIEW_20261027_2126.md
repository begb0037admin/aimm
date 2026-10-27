# Stages 2–5 build evidence and independent review — 2026-10-27 21:26 UTC

## Source and scope

- Repository: `begb0037admin/aimm`
- Branch: `codex/pluginhub-foundation`
- Latest verified branch commit reviewed: `246e7bc9fcec835833c80193c285d8c7ed178537`. Its diff changes only the continuation handover; the implementation source under review remains the source from the preceding branch update.
- Sources were retrieved from connected GitHub. Builds and tests used disposable copies under `/private/tmp`; the stale/dirty checkout at `/Users/admin/aimm-pluginhub-stage2-5` was not modified.
- This report records additional build/test evidence and an independent review. It does not claim that Stages 2–5 or Foundation exit are complete.

## Build and synthetic scanner checks

The current-branch companion source compiled successfully in a disposable copy:

- `swift build --package-path …/companion --product aimm-scan` — passed.
- `swift build --package-path …/companion --product aimm-companion` — passed.
- `python3 -m unittest discover -s tests -p test_scanner.py -v` — 3/3 passed. Coverage was synthetic: traversal rejection, supported metadata/formats with AAX exclusion and symlink handling, and explicit scan-root validation.

The first sandboxed Swift build attempt was blocked by `sandbox-exec: sandbox_apply: Operation not permitted`. The same compile-only commands succeeded when run with the permitted elevated build path. No app was installed or launched by these builds.

The previously recorded focused JavaScript tests passed 12/12 in disposable copies from the connected branch: `library-account.test.js`, `pair-remote-test.test.js`, and `pages-proxy.test.js`. This was not the full API suite.

## Live account and browser comparison

The approved non-production browser preview shows 1,958 readable local rows compared against account generation `902ed619-3a9a-48d6-b24e-c513ceffea3b`: 1,641 matching, 317 browser-only, 0 account-only, and 2 version differences. The browser scan was not uploaded. Account-backed Library and count-only Hope previously read 1,641 records from that generation. This is partial evidence only; the 317 unmatched rows and two version differences are unresolved.

A read-only refresh of the status-observation panel was attempted during this checkpoint. The panel remained at “Loading current observations”; the visible account observation timestamps were still from 21:08 UTC. The fresh vendor submissions therefore still lack a verified account-side readback.

The paired companion previously reported successful non-production submissions for four vendor checks: FabFilter 9 supported, Valhalla DSP 6 supported, Voxengo 0 supported, and u-he 0 supported. These acknowledgements do not establish fresh account readback or completion of the 31-row Stage 4 mapping. No product names or local paths are included here.

## Independent review

A fresh read-only independent review of branch head `246e7bc9fcec835833c80193c285d8c7ed178537` returned **PARTIAL**. The reviewer accepted the descriptor-anchored installer-staging slice only within its same-UID threat boundary. The review did not independently reproduce the live browser/account counts or perform end-to-end runtime validation.

Review findings and remaining work:

- Reconcile the 317 browser-only records and two version differences, then demonstrate parity against one current generation.
- Confirm vendor observations by account-side readback and complete the approved 31-row Stage 4 mapping.
- Complete a live Stage 5 preview/confirmation/receipt/recovery walk; do not execute an unconfirmed local file action.
- Run a real paired-credential wrong-device request and verify HTTP 401 without disclosing or logging the credential.
- After those results, obtain fresh independent end-to-end Foundation validation.

## Gate state and boundaries

- Stage 2: **PARTIAL** — builds and synthetic scanner tests pass; inventory parity remains unresolved.
- Stage 3: **PARTIAL** — account-backed Library/Hope use the same recorded generation; browser parity is not established.
- Stage 4: **PARTIAL** — companion checks submitted; current account readback and full 31-row evidence are outstanding.
- Stage 5: **PARTIAL** — installer-staging review is narrow; live preview/confirmation/receipt/recovery and wrong-device runtime evidence are outstanding.
- Isolated synthetic D1 recovery: **MET** under the existing recovery evidence.
- Foundation exit: **NOT MET**. Stage 6 remains gated.

Preserve the 22:47 D1 creation authorization as resolved and separate from the 22:51 retention chronology. No migration, credential change, production deployment, production cutover, provider-terms acceptance, or plug-in file action occurred in this checkpoint. No changes were made to remote account data during this checkpoint.

