# AIMM stable base build

**Stable base: build 2026-11-23.69** (declared by Kevin, 26 Nov 2026, after live tests). Treat this as the known-good starting point. Anything new is built on top of it, and if something breaks we can return to it. The previous stable base, build .65, is kept below.

## What is pinned (build .69)

| Part | Pinned to |
|---|---|
| Git tag | `stable-2026-11-23.69` (commit 7d660ba7 on main) |
| Worker `aimm` (the site) | version e59324e7-42c8-4d6e-8f6f-d4605f4eaef3 |
| Worker `aimm-proxy` (search and Hope relay) | version 696ce5e2-cd2a-4d89-ac2f-7d5c5023274c |
| Hope Primary agent_9001m42hnyrwedts40en5a5npapp | published version agtvrsn_4701m8bxhhane90s0ry1zhpagmst |
| Hope Backup agent_2601kqm4g7txfsvv0pkvpe02389p (other ElevenLabs account) | same prompt as Primary (15,812 chars), 85 tools; reachable only through the relay |
| Secrets | HOPE_INTERNAL_TOKEN on both Workers, YOUTUBE_API_KEY on aimm-proxy (values never stored in the repo) |
| Tests | 295 Node tests pass |

## What .66 to .69 added
Channels through the official YouTube Data API (spoken names, right-channel choice, Library-first), Hope opens a channel in the Playlist, shows her picks and adds several videos, the Deepgram (Luna) route now sends every tool (was cut at 39), token-free same-origin Hope routes, backup Hope brain matched to the primary.

## Tested live on .69 (26 Nov 2026)
Open a channel by spoken name on Deepgram, ElevenLabs Primary and ElevenLabs Backup; her picks; add several videos; paste a channel into the Playlist search bar. Not yet tested: Fix Queue walkthrough on Deepgram.

## Known limits
Hope can only browse a channel's newest 22 videos; she cannot read the Library herself to confirm an add.

## How to go back to it
1. Site: `git checkout stable-2026-11-23.69` then `cd standalone && npx -y wrangler@4.161.0 deploy`, or `npx -y wrangler@4.161.0 rollback <version id>`.
2. Relay: same from `worker/`.
3. Hope: restore the pinned version of the Primary in ElevenLabs. The Backup's old state is saved only in the session scratchpad.

---

# Previous stable base: build .65

**Stable base: build 2026-11-23.65** (declared by Kevin, 26 Nov 2026). Treat this as the known-good starting point. Anything new is built on top of it, and if something breaks we can return to it.

## What is pinned

| Part | Pinned to |
|---|---|
| Git tag | `stable-2026-11-23.65` (commit bd49ba03 on main) |
| Worker `aimm` (the site) | version e6ce7eab-3fbd-4451-b163-71e9619534cc |
| Worker `aimm-proxy` (search and Hope relay) | version c3d127cc-7f33-4b04-9d26-40b498644160 |
| ElevenLabs Hope agent_9001m42hnyrwedts40en5a5npapp | published version agtvrsn_3801m89zt4h5f19r3np4gma2dhqs |
| Secrets | HOPE_INTERNAL_TOKEN set on both Workers (values never stored in the repo) |
| Tests | 277 Node tests pass |

## What is in it (builds .48 to .65)
Hope as a conversation (Fix Queue walkthrough, personality, undo and skip tools), icon-only chat actions (star, play and stop, copy), Notes Play and one Favourites panel, Fix Queue redesign (list left, "Analysis" text right, tick and cross per row), Stem mix redesign, one shared play and pause transporter in both places, stem auto-labelling (Vocals, Drums, Bass, Guitar, Keys, Other), the token-free Analysis route (`/api/hope-explain`).

## How to go back to it
1. Site: `git checkout stable-2026-11-23.65` then `cd standalone && npx -y wrangler@4.161.0 deploy`. Or roll the Worker back to the pinned version id with `npx -y wrangler@4.161.0 rollback <version id>`.
2. Relay: same for `worker/` and aimm-proxy.
3. Hope: in ElevenLabs, restore the pinned version of the agent (agents version history on the main branch).

## Rules for changes on top of the base
- Work on a branch from the tag, ask Kevin before anything goes live, and re-run the 277 tests.
- When a newer build is declared stable, add a new tag and update this file; do not delete old tags.
