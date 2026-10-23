**Overall: PARTIAL.** At `fff0f24`, the commit closes most of what the re-review file flagged. Finding 3 and new finding B are still open. The re-review file itself is stale: it was written against `f898abf`, and `fff0f24` changed 19 lines in the architecture doc and 6 in the ownership map. I used `fff0f24` line numbers throughout.

## Verdicts

| Item | Verdict | Evidence at fff0f24 |
|---|---|---|
| **Finding 3** (mapped workflows) | **PARTIAL** | Action kinds are now enumerated (`ARCHITECTURE.md:111`) and `pinned` has a backing field (`:76`). Still open: no route writes `duplicate_analysis` (see gap 3a). |
| **Finding 8** (folder access) | **PASS** | `:48` decides it: non-sandboxed Developer ID app, roots persisted as path plus volume/file identity plus bookmark data, re-resolved every scan, allowlist enforced by companion code. The "where appropriate" wording is gone. Nit: the role of bookmark data in a non-sandboxed app is not explained. |
| **A. Hope cannot confirm** | **PASS** (design) | `:70`, `:104`, `:125`: confirm requires the owner session, CSRF token and a fresh WebAuthn user-verification assertion whose challenge includes `operation_id`, digest and expiry. The assertion is consumed once, and the Hope executor has no confirm route. Residuals: the confirm-per-kind mapping is never stated (`:111` says each kind has a "declared risk class" but none are assigned). Also specify `userVerification: required`, and make the confirm UI show the preview before the assertion, since the OS prompt displays no digest. |
| **B. Exact-path preview delivery** | **PARTIAL** | The route now exists: `GET /v1/actions/{id}/owner-preview` (`:104`). Payload is encrypted, deleted on confirm/cancel/expiry, and capped at 10 minutes (`:125`). Gaps below. |
| **C. Installer source binding** | **PASS** (binding) | `:125` binds adapter ID/version, artifact product/version/platform, Mac-derived URL, redirect policy, size limit, expected digest/signature, destination and hub identity, and says the Mac derives URLs from its own adapter table. Residuals: "expected digest/signature or explicit absence" allows unsigned installers with no stated policy (`:125`, and `:129` "available signature or hash"). The final post-redirect host is not bound. Nothing requires re-hashing the downloaded file before `open_installer` (TOCTOU). |
| **D. Read-only expiry** | **PASS** | `:104` and `:125` both say 24 hours. The remaining "short" uses (`:59`, `:84`, `:125`) refer to pairing URLs and previews. |

## Material contradictions and gaps

**B. Exact-path delivery (PARTIAL)**
1. **Conflicts with the data boundary.** `docs/PLUGINHUB_DATA_BOUNDARY.md:7` makes paths "Mac companion only" and allows the website to show a path in a preview. It does not allow the server to hold paths. The architecture now stores an encrypted payload server-side (`:125`). Either amend the boundary doc or keep the preview on the Mac.
2. **"Hope cannot receive exact paths" is not server-enforced** (`:104`, `:139`). The owner-preview route uses the same browser session and CSRF token that Hope shares (`:61`), so the server cannot tell Hope's fetch from the owner's. This is the same gap as A, moved to a different route. It needs a per-request WebAuthn assertion or an equivalent gesture-bound token.
3. `:104` says `GET /v1/actions/{id}` returns a "prepared preview", while `:84` says generic reads never include exact paths. Clarify which fields that route returns.

**Device write scope vs routes.** `:61` says a device uploads only inventory, claims commands and posts receipts. But the routes also let a device write `prepared-preview` and `events` (`:105`), `project-requirements` (`:107`) and `samples` (`:109`). The scope spec the server enforces is incomplete.

**Finding 3 gaps, duplicate and Samples contracts**
- **3a.** No write route for `duplicate_analysis`. Only `GET /v1/duplicates` exists (`:109`). The POST list (`:98`–`:109`) has no duplicates writer.
- **3b.** Duplicate removal is "`trash_plugin_copy` applied only to a reviewed duplicate-analysis item" (`:111`). "Reviewed" is undefined. Action items are opaque IDs with no link to an analysis record (`:104`, `:125`). The re-validation list at `:125` omits "still an extra copy", which ParityOwnership P17 (`:25`) requires ("never an active copy by name guess").
- **3c.** `POST /v1/devices/{id}/samples` (`:109`) has no generation/chunk/finalize atomicity, unlike inventory (`:90`, `:100`). `GET /v1/samples` has no generation parameter. `sample_asset`'s "optional user tag" (`:82`) has no write route.
- **3d.** P16 "retry" (ParityOwnership `:24`) relies on idempotent replay (`:127`), but no retry route or request shape is defined.

**Confirmation scope.** `:104` says "user-verified confirmation" generally, `:125` speaks of "file mutation", and `:70` of "destructive action". Which kinds need WebAuthn (`download_installer`, `open_installer`, `reveal`, `open_vendor_hub`) is never stated.

## Not verified
Read-only only: `git show fff0f24:<path>`, `git diff f898abf fff0f24`, and grep for line numbers. I did not run the bridge, the site, PluginHub or any vendor endpoint. Vendor, OIDC and Apple claims remain the open gates the docs themselves list.

I wrote the review to `/Users/admin/.claude/plans/read-only-review-docs-pluginhub-phase2-a-precious-pond.md`, the only file plan mode allowed. `ExitPlanMode` is not available in this session, so I'm ending the turn here with the answer rather than requesting plan approval.
