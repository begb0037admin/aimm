# PluginHub — bounded remote D1 validation

**Observed:** 2026-10-26 15:06 UTC  
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`  
**Branch head before this evidence update:** `7137bddc35aa54f0e6cec5bb08f991cfe7c57339`  
**Authorization:** Kevin approved clearing the current D1 validation hold for the agreed synthetic, non-production checks at 2026-10-26 15:06 UTC.  
**Cloudflare profile:** `kevin@lelitte.com`  
**Account:** `f1896a0ef4e88f1f90abcc2cbbdd87f1`  
**Database:** `aimm-library-foundation-dev` / `66c91fd6-fae8-43a1-8e3b-372274acd7dc`

## Identity and migration state

Read-only Cloudflare metadata and exact-name listing both returned the approved database UUID and name in the approved account. Metadata records creation at `2026-10-23T22:47:13.736Z`, region `WEUR`, replication disabled, and 25 tables. The exact-name list returned one match. This confirms the historical 22:47 creation chronology; it does not change the separate 22:51 retention record.

A bounded read of `d1_migrations` returned all 21 entries, from `0001_foundation.sql` through `0021_restore_actions.sql`. In particular, `0003_browser_sessions.sql` is applied. No migration was needed or run. The ledger query reported 21 rows read, zero written, and `changed_db: false`.

## Synthetic two-account ownership probe

The probe used newly named synthetic accounts A and B, a synthetic device owned by A, and non-secret synthetic credential-hash placeholders. No existing account or user row was read or changed.

- Control: a credential associated with A's device and A's account was accepted.
- Isolation case: a credential associated with A's device but B's account was rejected with Cloudflare error 7500 / `SQLITE_CONSTRAINT_FOREIGNKEY`.
- Cleanup: deleting the synthetic accounts removed four rows including cascaded device and credential records.
- Post-cleanup marker query: zero synthetic accounts, devices, or credentials remained; zero rows were written by this verification query.

## Recovery

Remote D1 recovery already passed on a separate temporary synthetic-only database using migrations 0001–0021, synthetic account/device/credential/browser-session rows, and a captured Cloudflare time-travel bookmark. The deleted synthetic rows were restored from the bookmark, and the temporary database was deleted afterward. See [isolated D1 recovery evidence](PHASE_PLUGINHUB_D1_TIME_TRAVEL_RECOVERY_20261025.md), blob `6d3d3f881bc6d861744d9bd72dfbaec6074b75f3`.

The shared project D1 was not rewound: it contains pre-existing non-synthetic records, so restoring it would affect unrelated data. Recovery evidence is therefore the separate synthetic-only remote restore, not a restore of the shared project database.

## Disposition

- Exact non-production database identity: **PASS**.
- Migration ledger through 0021, including 0003: **PASS**; no migration write required.
- Synthetic cross-account credential/device ownership rejection: **PASS**.
- Synthetic row cleanup: **PASS**; no markers remain.
- Remote synthetic-only recovery: **PASS**, per linked recovery evidence.
- Provider-backed Auth0 browser/session/CSRF, authenticated API isolation, live device pairing, current-Mac/browser parity, remaining Stage 2–5 actions, and fresh independent end-to-end Foundation review: **OPEN**.
- Foundation exit: **NOT MET**. Stage 6 remains gated.
- No production data, deployment, cutover, provider terms acceptance, or credentials were used or changed.

The current D1 validation hold is cleared for this bounded synthetic non-production validation scope. This does not clear separate provider, deployment, production, or Stage 6 gates.
