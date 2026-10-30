# Publisher provenance source review — 2026-10-30

## Reviewed change

Branch source commit [`8101fdaf364524407a4bc0432f1d1f90bc2773f0`](https://github.com/begb0037admin/aimm/commit/8101fdaf364524407a4bc0432f1d1f90bc2773f0), parent `1f6c206325a5b0e62fff0bd5ae0656ee3dfe542f`, adds bounded, explicit publisher provenance to Companion inventory records and Library API projections.

The Companion reads only the `Manufacturer` or `Vendor` values explicitly present in bundle Info.plist metadata. The source label identifies which key supplied the value. It does not infer publisher from a path, filename, or bundle identifier. Publisher fields are length-bounded and reject C0/DEL control characters. Existing opaque record IDs are unchanged; local paths remain excluded from uploaded records.

The API accepts only `infoPlistManufacturer` and `infoPlistVendor`, requires publisher name/source together and requires Info.plist metadata, and rejects any non-null `canonicalProductId` until a reviewed mapping exists. New nullable columns preserve existing records as unresolved. Finalization writes the fields; inventory pagination and `/v1/status-summary` return them.

## Independent review

Jules reviewed the exact candidate `8101fdaf364524407a4bc0432f1d1f90bc2773f0` and returned **PASS**. Review confirmed the provenance boundary, API validation, migration and read projections, local-path exclusion, and unchanged opaque IDs. Synthetic API assertions cover accepted explicit provenance, unsupported source rejection, filename-only rejection, canonical-ID rejection, path exclusion, and inventory/status responses.

Automated tests were **not run**. The available local checkout was dirty and at a different commit; Jules and I did not use it as a substitute for the reviewed source.

## Limits and next work

This is contract groundwork only. It does not connect the visible Library UI to the authenticated status endpoint, create vendor observations, or activate the Install Manager or other unfinished tools. The displayed 0/0/0/14 status counts remain synthetic fixture values. No real folders were scanned, no inventory was uploaded, no remote D1 migration was applied, no Worker was deployed, and no production action occurred.

The development Worker passkey RP fix remains a surgical patch rather than a reproducible build from branch source. Foundation remains **NOT MET** and Stage 6 remains gated.

Next: verify the exact source in an isolated clean checkout, then complete the authenticated generation/record join and UI status rendering. Review and obtain required authorization before any remote migration or deployment.
