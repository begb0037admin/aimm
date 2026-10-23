**Verdict: both blockers PASS at c54ef19.** Nothing was edited or written, and I did not create the plan file, since you asked for no writes. All checks were read-only (`git show` and `grep` against the commit).

**1. Sample-tag model, route and P31 agreement: PASS**
- **Model:** `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md:85` defines a separate `sample_tag` record with account/device/asset ID, tag values and a `revision` field.
- **Asset link:** `:84` (`sample_asset`) points tag edits to that separate revision-checked record.
- **Route:** `:112` has `PATCH /v1/samples/{id}/tag` with `If-Match`, and a revision mismatch returns a conflict. This matches the record.
- **P31:** `docs/PLUGINHUB_PHASE2_PARITY_OWNERSHIP.md:39` now reads "separate tag record" and "user tags use the revision-checked `sample_tag` route". The old "account preferences" wording is gone.
- **No stale scope:** the preference scope at `:78` is still only `vendor` or `product`. A search of all `docs/*.md` found no remaining "sample tags use account preferences" wording.

**2. Installer fields in the exact-path payload vs. the data boundary: PASS**
- The exact-path payload is at `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md:132`. It now lists AIMM adapter ID/version, artifact product/version/platform, Mac-derived official URL, allowed redirect/final hosts, maximum download size, expected artifact digest or reviewed signing identity, local destination and installed hub identity.
- `docs/PLUGINHUB_DATA_BOUNDARY.md:7` lists the same installer fields and the same exclusions: installed file size and binary hash, raw plist, folder grants and unrelated files.
- Both documents state that the size limit and digest are route policy, not installed-file properties.
- The 10-minute access window and the one-hour purge also agree (`:132`, data boundary `:7`).

**Stale line numbers in the validation file:** the sample_tag row shifted the lines below it by one. At c54ef19 the exact-path payload is `:132`, not `:131`, and the preview paragraph is `:130`.

**Non-blocking nits (not blockers):**
- The signer wording differs across three places: "trusted signer" (`ARCHITECTURE.md:130`), "reviewed signing identity" (`:132`), and "reviewed signer" (`DATA_BOUNDARY.md:7`). The meaning matches, but one term would be clearer.
- `:132` includes envelope fields (account/device/operation/nonce, kind, generation) that the data boundary's "only" list doesn't name. They are protocol metadata, not file data, but a strict reader could flag them.
- P31 calls `sample_tag` a "route", but the endpoint is `PATCH /v1/samples/{id}/tag`.

Plan mode is still on in this session. I wrote nothing, so there is no plan file to approve.
