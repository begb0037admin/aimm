# PluginHub synthetic status tiles and version comparison — 2026-10-30

## Source and review

Branch source commit [`762aeb81737a29b896a95097001c849b26d1911a`](https://github.com/begb0037admin/aimm/commit/762aeb81737a29b896a95097001c849b26d1911a) updates `index.html` (blob `83b0df4f3222b3daa110e0ddea8cf6ed7615f0dc`). It retains the synthetic status counts and per-format status dots and adds a prominent, per-format version-comparison row directly below each card’s name/actions line in status views. For Updates, installed versions remain muted and the available sample version is red, following PluginHub’s visible old → new convention. Up-to-date rows are green; Manual check and Unchecked rows are distinguished. Missing update comparisons say “comparison unavailable,” not “unchecked.” The original colored dots remain beside each format chip as a supplemental signal.

Jules passed the exact source review and final deployed visual review. The source adds no folder scan, vendor/API request, inventory persistence, or live update action. Every sample version is explicitly labelled “sample”; the page states that no vendor checks ran and that real vendor links are not connected.

## Development preview

Cloudflare Pages development preview deployment [`c0215f2e-b4ae-417a-9675-1ac3efad05b5`](https://c0215f2e.aimm-pluginhub-foundation-dev.pages.dev/?pluginhub-preview=synthetic) was triggered by source commit `762aeb81737a29b896a95097001c849b26d1911a`; its deploy stage succeeded at 2026-10-30T15:46:06Z.

At 1920×1052, the Updates view showed 3 matching format records across 3 products. Jules also checked the other status scopes on this deployment: Up to date 4/4, Manual check 3/3 and Unchecked 4/4, with matching per-format dots, versions and scope-specific guidance. Tapeform showed CLAP v3.1.0 → sample v3.2.0 while VST3 remained up to date; Comet Dynamics showed VST3 v2.0.1 → sample v2.1.0; Halo Equalizer showed AU v1.4.2 → sample v1.5.0 while VST3 remained up to date. Red sample versions and the mixed-format dots were visible on the cards. The product-name and action row retained its space.

Jules also reviewed 390×844. The status banner uses a single column at widths ≤680px; its measured height was 198.5px compared with 566px before the fix, with document scrollWidth equal to the 390px viewport. The three Updates tiles stayed identifiable, their comparison lines wrapped below the name/action row, and the dots remained readable. Desktop retains the banner’s three-column layout.

## Boundary and remaining work

This is synthetic UI evidence only. The 3/4/3/4 status counts across 14 format records and every displayed product/version are in-memory examples; they are not sourced from the account status endpoint, local folders, installed inventory, or vendor checks. Live generation/record joins, vendor-backed observations, and functional install/update workflows remain incomplete. Tools without a connected workflow remain unavailable in this preview.

Foundation remains **NOT MET** and Stage 6 remains gated until all exit evidence is complete and fresh independent review accepts it. The development Worker passkey RP correction remains a surgical patch and is not reproducible from branch source. Production, Worker, D1 and real inventory were not changed.

## Checks

- App JavaScript syntax parse: passed for both non-empty application scripts.
- Synthetic status fixture: 14 format records / 12 products / 3 Updates / 4 Up to date / 3 Manual check / 4 Unchecked.
- Browser: Updates filter rendered 3 products; mixed-format Tapeform and Halo retained separate format versions/states.
- Jules source review: PASS.
- Jules visual review of deployment `c0215f2e`: PASS at desktop 1920×1052 and narrow 390×844; all four status scopes and their counts/copy were checked on desktop.
