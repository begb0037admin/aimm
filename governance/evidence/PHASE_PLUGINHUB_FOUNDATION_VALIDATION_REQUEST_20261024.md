# PluginHub Foundation — Stage 5 Revalidation Request

**Date:** 2026-10-24  
**Repository/branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Stage:** 5 — revalidate follow-up to the PARTIAL Stage 5 report  
**Status:** Revalidation requested; Foundation exit criteria are not met unless the independent report says otherwise.

## Prior review

The initial [Stage 5 validation report](https://github.com/begb0037admin/aimm/blob/46c5712ce083ce1cada6f3d911bb96392acdd50c/docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_VALIDATION_REPORT_20261024.md) is pinned at commit `46c5712ce083ce1cada6f3d911bb96392acdd50c`, blob `7f06a40b6cc4e029e85932057da8b0c9023d5fe6`. It returned VT-07 PASS and VT-01/02/03/04/05/06/08 PARTIAL, with Foundation exit criteria NOT MET.

## Current pinned evidence

- [Current evidence package](https://github.com/begb0037admin/aimm/blob/c7b7325c3a7349ee55f6a51b8002d9c243cadbff/governance/evidence/PHASE_PLUGINHUB_FOUNDATION_EVIDENCE_PACKAGE_20261024.md), commit `6e331f94c38c016d99026e9ea391e66478d672ac`, blob `808285f434487ae56f885bb9628ddd4eb4cf2bbf`.
- [Stage 3 challenge](https://github.com/begb0037admin/aimm/blob/ec9452caf4bd704a2364e427a0e33f7d8f964efe/docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_CHALLENGE_REPORT_20261024.md), commit `ec9452caf4bd704a2364e427a0e33f7d8f964efe`, blob `cc6e81424564a15bdef0f6cab79675f94b189060`.
- [Stage 4 remediation request](https://github.com/begb0037admin/aimm/blob/87cccd242b7f58c58f6d8e8a985bbd42ae51e74e/docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_REMEDIATION_REQUEST_20261024.md), commit `87cccd242b7f58c58f6d8e8a985bbd42ae51e74e`, blob `caf002e46cc5a68ed7b24fd6cd30a8ffaecad2d0`.
- [Authorization chronology addendum](https://github.com/begb0037admin/aimm/blob/codex/pluginhub-foundation/governance/evidence/PHASE_PLUGINHUB_FOUNDATION_AUTHORIZATION_ADDENDUM_20261024.md), blob `e6ea7c61ad240a9582c4d1d85f260d05e8f9ccb9`.
- Worker `library-api/src/index.js`: commit `b5b623968d4cb05b21ce9eaf69ae26182de325e3`, blob `46421d7d020d7492991be40e4a2617dcb6d6e0ff`.
- Migration `0002_enforce_ownership_and_retention.sql`: blob `374781b9ded5dfa7d07993ceaf05f65095ae617a`; Wrangler config: `ca9667df8b047fda7c89cc1e643a55899c1d594e`; README: `38918e7e3848af0695da82e09760513eee0c7a79`.
- Status surfaces (GET-verified content SHAs): Dashboard `0b0ca12f3a7dfbdd22689c8570b58ea69161deb4`; Roadmap `5443b8f5b0ec08db2ac5289cafb741b218f2efb6`; Status `45428451697fb7e20c211aa25d12581a1c735fb7`; Handover `633c022b04c22876d55a7816dcfaff235bf731b6`; dated handover `de35cedbcfcdac0f9765dc92c66539fa11ffd14e`; project brief `f91efe1b7e51ec1e238c6107589d8d4030e9d3e5`.

## Follow-up changes to check

1. The Worker now requires a string `scope` claim and checks `read:library` on `GET /v1/me` and `GET /v1/devices`, `manage:devices` on device revocation, and `delete:account` on `DELETE /v1/me` before loading/creating an account. Unknown routes return 404 before identity provisioning.
2. The Worker restricts legacy Auth0 `gty` to `authorization_code` and `refresh_token`. If `gty` is absent it accepts only an RFC 9068 `at+jwt` header. It also requires `azp` in `OIDC_ALLOWED_CLIENT_IDS`, rejects `@clients` subjects and still checks signature, issuer, API audience, expiry and `nbf`. README now documents these rules, the route scopes, and the required environment variable. Determine whether this makes the source contract sufficiently explicit; there is no configured Auth0 tenant or runtime proof.
3. The Stage 5 request/package pin now uses the actual evidence package commit SHA, not the content blob SHA.
4. The package rollback table now uses Dashboard's latest current blob `0b0ca12f3a7dfbdd22689c8570b58ea69161deb4`.
5. The authorization addendum now explicitly labels the conversation excerpt and resource-timing authority as executor-reported/unverified. The Stage 5 report found the owner authorization chronology cannot be independently verified from repository GETs.
6. Dashboard, Roadmap, Status, Handover and project brief now record Stage 5 PARTIAL and exit criteria unmet, with revalidation pending.

## Review request

GET the request, package, Stage 5 report, Worker, migration, README, authorization addendum, backup files and all six status surfaces at the pinned commit/branch. Re-evaluate VT-01 through VT-08 with direct evidence. Confirm the actual package commit/blob pair and Dashboard rollback target. Inspect scope enforcement and token-profile logic for source-level gaps; verify the README and status records match. Independently re-query D1 only if the existing authorized Console session permits it without switching accounts or entering terms; otherwise keep D1 migration/schema findings PARTIAL. Do not run tests or builds.

Limitations are unchanged unless new direct evidence exists: no Auth0 tenant, credentials or configured client/scope values; no Worker deployment or runtime token/account checks; no cross-account rejected D1 insert; no D1 restore test; no independent D1 re-query in the first Stage 5 review; no backup expiry/purge proof; no browser session/CSRF or pairing. The authorization chronology remains owner-reported.

## Boundary and expected output

This request authorizes only Stage 5 source/evidence revalidation. It does not authorize provider legal acceptance, paid services, credentials, deployment, merge, cutover, release, or a Kevin governance decision. Do not mark Foundation complete unless its required exit criteria are evidenced.

Write the result to `docs/project/generated/PHASE_PLUGINHUB_FOUNDATION_REVALIDATION_REPORT_20261024.md`, preserving the prior Stage 5 report. Include model/effort, exact request/package commit/blob pins, findings, unresolved risks, and whether Foundation exit criteria are met.
