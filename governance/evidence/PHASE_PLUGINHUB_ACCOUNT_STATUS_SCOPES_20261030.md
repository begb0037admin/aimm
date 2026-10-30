# Live account status scopes — ready for review — 2026-10-30

## Source and preview

The Library status scope connection is implemented on `codex/pluginhub-foundation`.

- Latest source commit: [aa4c38cbc0e380283dd6f613b438bdd15f27a631](https://github.com/begb0037admin/aimm/commit/aa4c38cbc0e380283dd6f613b438bdd15f27a631)
- Relevant source: `library-api/library-status-view.js`, `library-api/library-account.js`, and `index.html`
- Successful Cloudflare Pages preview: [062ec0f2](https://062ec0f2.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic)
- Signed-in account review route: [Library status view](https://codex-pluginhub-foundation.aimm-pluginhub-foundation-dev.pages.dev/?review=aa4c38c)

The synthetic preview remains sample-only. The signed-in review route reads the authenticated status summary and keeps it separate from browser folder scans.

## Behavior

Selecting a status scope loads the account's saved `GET /v1/status-summary` snapshot. Records retain their device, generation and record identifiers; the Library does not guess-join them to folder scan rows. Updates, Up to date, Manual check, Unchecked, Stale results and Check errors show the matching account rows, matching counts and scope guidance. Empty states explicitly say that no saved observations exist for that scope and warn that zero updates does not mean everything is current.

The status load is read-only. It does not initiate vendor checks, downloads, installs, or local file actions. The account panel was signed in through the existing development sign-in flow; the separate Hope Library-tools access toggle was not enabled.

## Account snapshot observed during review

The signed-in account returned 3,285 format records across three devices and three inventory generations:

| Scope | Records |
|---|---:|
| Updates available | 0 |
| Up to date | 0 |
| Manual check | 0 |
| Unchecked | 1,644 |
| Stale results | 1,641 |
| Check errors | 0 |

The counts are disjoint in this snapshot. The zero update and up-to-date counts mean no fresh observations in those states were saved. They do not confirm that plug-ins are current. The stale records are outside the API's two-hour freshness window; the remaining records have no current vendor observation. No vendor status check was run during this review.

## Verification and limits

- Manually opened each synthetic scope and confirmed the 3/4/3/4 sample records and per-format colors remained visible.
- In the signed-in view, confirmed account counts, the selected Updates scope, and the empty-state guidance. Confirmed the Stale scope returns its 1,641 matching records without displaying account rows in this evidence.
- Cloudflare Pages deployment for commit `aa4c38cbc0e380283dd6f613b438bdd15f27a631` completed successfully as preview `062ec0f2`.
- No automated tests were run.
- No production site, Worker, D1 migration, or vendor check was changed or triggered.

## Next

This status-scope implementation is ready for Kevin to review. The account presently has no fresh update, up-to-date or manual-check observations; refreshing those observations is a separate workflow. Continue with AIMM-owned Tools one at a time after this review, as recorded in the user parity register.
