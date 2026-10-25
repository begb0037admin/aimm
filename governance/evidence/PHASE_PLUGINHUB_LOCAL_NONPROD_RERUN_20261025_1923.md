# PluginHub local non-production rerun and Auth0 access checkpoint

**Observed:** 2026-10-25 19:23 UTC
**Repository / branch:** `begb0037admin/aimm` / `codex/pluginhub-foundation`
**Source checkpoint:** `b15076babed34bf2dab8e83b96b043cdf57ad9de`

## Local verification

`sh scripts/pluginhub-nonprod-check.sh` passed after the managed sandbox initially blocked SwiftPM manifest compilation. The same user-authorized local command was rerun with the established local SwiftPM build scope and exited 0.

Verified: ad-hoc preview bundle and strict signature; Swift build, journal/recovery and descriptor-anchored installer/redirect checks; scanner 3/3; API/browser 38/38; JavaScript syntax; disposable local D1 migrations and Worker health/auth/CORS; synthetic two-account token rejection; Swift pairing, inventory sync, Manual Check, reveal, move and restore with signed receipts. All D1 and file fixtures were disposable synthetic local state. The suite did not access the remote project D1.

## Auth0 access observation

The authenticated dashboard session's tenant switcher lists only `dev-4zlw1s642szi48ve`. The team's **Link Existing Tenants** dialog reports “No tenants to link.” Navigating to the configured PluginHub SPA settings URL resolved back to the currently visible `dev-4zlw1s642szi48ve` dashboard; its tenant switcher still lists only that tenant. The project configuration in the repository/1Password points to tenant `dev-cxmqjc40zltqlx7l` and SPA client `3EbH8eIpW9FxYvKoXIeYtRvhcGWGtwPA`. No Auth0 application setting was changed. The approved callback `http://127.0.0.1:4173/pair-remote-test.html` remains unconfigured on the project SPA, so real Auth0 pairing remains blocked.

## Disposition

- Local non-production suite: **PASS**.
- Remote project D1: not accessed by the suite and not changed.
- Auth0 project tenant/application callback: **OPEN**; not visible in the authenticated dashboard session.
- Isolated synthetic D1 restore evidence: **PASS** in the separately recorded report; restoration of original project D1 rows was intentionally not attempted.
- Foundation exit: **NOT MET**; Stage 6 remains gated.
- No production data, deployment, cutover, provider terms acceptance, or new credential creation occurred.

