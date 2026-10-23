# PluginHub replica — Foundation retention decision

**Date:** 2026-10-23  
**Decision authority:** Kevin Lelitte  
**Phase:** Foundation  
**Status:** Approved for Foundation implementation  
**Architecture:** `docs/PLUGINHUB_PHASE2_ARCHITECTURE.md`

Kevin's message, “yes approved go ahead … please continue until completion, use automation,” followed the proposed default retention schedule. It is recorded as approval of that recommendation.

## Retention policy

| Data | Retention |
|---|---|
| Server-side action receipts and operation summaries | Retain for 90 days after the operation reaches a terminal state, then delete from the active Library database. |
| Public shares and profile comparisons | Every share/profile must expire no later than 30 days after creation. The owner may choose a shorter expiry. Revocation deletes the active public projection immediately. |
| Account deletion | Remove serving account data, inventory, device credentials and active shares immediately when deletion is confirmed. Any retained backup copy must expire or be purged within 30 days. Keep no user-data export outside that window. |

The companion's full local operation journal remains local as specified by the architecture; this decision sets server retention. Short-lived action previews and one-use authorization material are purged at expiry, independently of the receipt period.

## Backup implementation constraint

The development D1 database uses Cloudflare's Free limits. Cloudflare documents a 500 MB maximum per database, 5 GB total account storage, and seven days of Time Travel retention on Workers Free. The approved 30-day deleted-account backup ceiling is a maximum retention period, not a requirement to preserve deleted content for 30 days. Production backup and deletion behavior must be rechecked against the selected plan before launch; any separate export or backup pipeline must enforce the same 30-day purge ceiling.

## Scope

This resolves the architecture's Foundation entry gate for retention. It does not authorize paid service, production deployment, legal acceptance, a production identity tenant, cutover, release, or any later phase. The remaining stages and their gates stay as prepared in the architecture.

## Primary sources checked

- Cloudflare D1 limits: https://developers.cloudflare.com/d1/platform/limits/
- Cloudflare D1 Time Travel and backups: https://developers.cloudflare.com/d1/reference/time-travel/
