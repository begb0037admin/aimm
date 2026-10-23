**Verdict: not ALL PASS at `7792c59`.** Retry and device write scope are closed. The sample-tag blocker is not closed across the doc set, and the path-boundary blocker has one unenumerated clause. I found no new high or medium safety contradiction.

Line numbers below are at HEAD. The prior review's numbers were taken at `6c729b1` and are off by about two lines now.

| Blocker | Status | Evidence at `7792c59` |
|---|---|---|
| Retry eligibility and request shape | **PASS** | `ARCHITECTURE.md:106` takes `{item_ids, idempotency_key}` for `failed`/`skipped`/`needs_permission` only and rejects `cancelled`. `:135` gives the same set, the receipt enum, and idempotent replay returning the same child. `PARITY_OWNERSHIP.md:24` (P16) matches. |
| Sample tag route | **NOT CLOSED** | The architecture now picks a separate route: `:84` (sample-tag record) and `:111` (`PATCH /v1/samples/{id}/tag` with `If-Match`). But `PARITY_OWNERSHIP.md:39` (P31) still says "user tags use account preferences", the option the architecture rejected. Preference scope is only `vendor`/`product` (`:78`). The "sample-tag record" has no row in the canonical data model (`:70-88`). |
| Path data boundary and purge | **MOSTLY CLOSED** | `:131` enumerates the exact-path payload, excludes file size, binary hash, raw plist, folder grants and unrelated files, and stores it encrypted in a D1 preview table. It denies reads at `expires_at = created_at + 10 min`, deletes on confirm or cancel, and runs a scheduled purge within one hour, matching `DATA_BOUNDARY.md:7`. **Gap:** `:131` includes "the bound installer route fields where relevant", and `:129` defines those as size limit, expected digest or trusted signer. The exclusion list doesn't say whether those are in or out. `DATA_BOUNDARY.md:7` repeats the same phrase. |
| Device write scope | **PASS** | `:64` is a capability matrix that now includes `contributions:write` (route `:110`) and `diagnostics:write` (route `:113`). `GET /v1/diagnostics` is an owner read. I checked each device-side route in the table against a capability. |

**No new high or medium safety contradiction.** Hope cannot unlock paths, confirm, or retry (`:106`, `:131`, `:133`). Duplicate removal requires a current verified analysis ID (`:115`, P17). The retry child and any file action need a fresh preview and confirmation (`:135`).

**Non-blocking nits:**
- `:61` still lists device writes without contributions or diagnostics. It should point to the matrix at `:64`.
- The purge job isn't named (for example, which scheduled trigger runs it). That can wait for the build gate.
- `:131` says "private preview UI module scope", but `index.html` is a single non-module script. The separation needs to be stated as a code requirement.

**To reach ALL PASS:** (1) change P31 to the separate sample-tag record and add that record to the data model with its revision field; (2) name the installer-route fields in the exact-path payload and state whether expected digest and size limit are included. Both fixes are doc-only.

**Scope and limits:** I only read the docs and ran read-only git and grep. I changed no files, ran nothing, and contacted no vendors. I did not write a plan file because you asked for no writes, and `ExitPlanMode` isn't available in this session. This report is the deliverable.
