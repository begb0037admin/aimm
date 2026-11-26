# AIMM stable base build

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
