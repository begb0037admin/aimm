# New session brief — AIMM deployment visibility, 12 Nov 2026

Read this before continuing. The current user goal is **not resolved**: Kevin needs the latest AIMM changes visible on other devices at `aimmastersx.com`.

## Current source and deployment

- Repo: `/Users/admin/github/aimm`, branch `main`, remote `origin/main`.
- Current source commit: `2999b93` (`Match Mix Check actions to neutral pill style`).
- App build in `standalone/assets/index.html`: `2026-11-12.11`.
- The Worker `aimm` was deployed as version `20d05ce8-c51b-47be-98b3-eec3e3383f67`. Build `.11` was fetched and verified at `https://aimixmasters.com/` and `https://aimm.kevinlelitte.workers.dev/`.
- The `.11` change styles Fix Queue and Hope action-card controls as neutral capsule pills, matching the current Copy/Speak and composer pills. Hope action-card status labels also use that capsule treatment. Source contains the CSS, but Kevin says the changes are still not visible on other devices. **Do not report the pill update as visually fixed.**
- Build `.11` also reverted the unrelated empty-state grid change from `.10`; no layout adjustment from that attempt remains in `.11`.

## Domain issue — unresolved

Kevin says the intended site domain is `aimmastersx.com` and that other devices show the correct build number but not the changes. Previous deployments targeted `aimixmasters.com` (different spelling) and the `workers.dev` URL.

On 12 Nov 2026, `aimmastersx.com` did not resolve locally; a public Cloudflare DNS-over-HTTPS query returned `Status: 3` (NXDOMAIN), and Verisign RDAP returned HTTP 404. Browser web access to both the apex and `www` hostname also failed. Kevin says this is his domain, so **recheck current DNS and the Cloudflare zone before concluding it is unregistered**; the status could have changed or there may be an account/hostname mismatch.

Relevant configuration:

- `standalone/wrangler.toml` declares Worker `aimm` and static assets, with no custom domain or route.
- `standalone/src/index.js` CORS `ALLOWED_ORIGINS` currently contains `https://aimixmasters.com` and `https://www.aimixmasters.com`, not `aimmastersx.com`.
- The app CSS is inline in the single HTML asset. A correct `.11` stamp with old styling is not explained by a separately cached CSS file. Check the exact hostname, response body, and live DOM/CSS cascade on the device before changing styling again.

## Next steps

1. Ask Kevin for the exact URL shown in the address bar on an affected device if it is not already clear. Preserve his stated target: `aimmastersx.com`.
2. Recheck public DNS/RDAP and inspect the Cloudflare account/zone for that exact domain. Do not silently substitute `aimixmasters.com`.
3. If the domain is active and controlled in Cloudflare, attach the `aimm` Worker to the apex (and `www` if intended), add the exact HTTPS origins to the proxy CORS allowlist, then deploy and verify build `.11` plus the visible pill styles from the requested host.
4. If the domain is not connected/available, tell Kevin the precise DNS/zone action needed. Keep the current Worker URL as a temporary diagnostic only; it does not satisfy the requested hostname.
5. Do not mark this complete until Kevin can see the changes at the intended domain on another device.

## Recent commits

- `98358fe` — remove duplicate Mix Check summary banner (build `.08`).
- `0c1fd56` — add Mark done to Hope fix card (build `.09`).
- `2b94299` — attempted empty-grid spacing change (build `.10`); reverted in `.11` after Kevin said the screenshots reflected an old layout.
- `2999b93` — match Mix Check actions to current neutral pill style (build `.11`).

There are pre-existing untracked paths `.wrangler/`, `standalone/.wrangler/`, and `audio-reference-companion.ARCHIVED-20261104T174319Z/`. Do not clean them up as part of this task.
