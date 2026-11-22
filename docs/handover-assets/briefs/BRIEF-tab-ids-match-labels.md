# BRIEF: internal tab ids must equal the visible tab labels

Kevin (22 Nov 2026): "Tabs must be the same as they are labeled otherwise it creates confusion. Mix check is mix check, mix bus is mix bus, plugins is plugins, library is library." Rename the INTERNAL tab identifiers to match the visible labels.

Repo ~/github/aimm (work in the git worktree you are started in, branch tab-ids-match-labels from main, live build 2026-11-22.3). Read docs/CLAUDE.md first.

## Mapping (this round)
- chain (label MixBus)  -> mixbus
- eq (label Mix Check)  -> mixcheck
- library (label Plugins) -> plugins
- UNCHANGED this round: knowledge (Insight), snapshots, settings, marketing, community, voice (they merge into a new "library" tab in a later build; the id `library` is freed by this rename for that). Do NOT create a new library tab now.

## What counts as a tab identifier (rename these)
- panel ids `<div class="panel" id="chain|eq|library">`, `data-tab="..."` on tab buttons, CSS selectors that target those panel ids (#chain ..., #eq ..., #library ... incl. oz-mixcheck scoping), document.getElementById / querySelector of those panels, JS tab-name strings (switchTab/activate calls, AIMM_TAB_INTROS keys, tab order lists, Hope's switch_tab tool: its enum/description, hope-tools-manifest.json, scripts/hope-tool-catalog.mjs, hopeCoverage text mentioning tab ids), any tab id in tests, DASHBOARD.html/docs that refer to tab ids.
- Persisted data: localStorage `aimmTabOrder_v2` stores a JSON array of data-tab ids. Add a one-time idempotent migration that maps old ids to new ids and keeps the user's order (do not reset their custom order). Check every other storage key or saved state that embeds a tab id and migrate the same way.
- Hope's switch_tab handler must ACCEPT the old ids as aliases (chain, eq, library) and map them to the new ones, because Hope's live ElevenLabs tool schema still has the old enum until Jacob refreshes it. Update the tool description wording so tab names equal labels (mixbus=MixBus, mixcheck=Mix Check, plugins=Plugins, knowledge=Insight, snapshots=Snapshots...).

## What is NOT a tab identifier (DO NOT TOUCH)
The word eq/library/chain used for other things: EQ plugin stage ids such as eq-clean, EQ/frequency tiles and list_eq_tiles, the Reference frequency map, chain-item/chain-actions/bus-chain CSS classes and variables for plugin chains, 'library' meaning the plugin library concept in text or function names, docs/knowledge. Rename only identifiers that select or name a TAB/PANEL. Do not blanket sed. Produce a short list in your report of every category of occurrence you changed and the categories you deliberately left.

## Verification
- Tests: update tests that assert old tab ids; add tests for the localStorage migration (old order -> new order, idempotent, unknown ids kept) and for the switch_tab alias map (old and new ids both work).
- Headless Chrome check (the repo has scripts/hope-smoke.mjs as an example): load the page, activate EVERY tab by its new id and confirm the right panel is visible and no console errors; check switch_tab with old and new ids.
- Bump AIMM_BUILD to 2026-11-22.4 and update the 3 build-stamp tests. Run all tests (163 before).
- Do NOT commit, push, deploy, or change the live ElevenLabs agent. Report diff summary, test results and the list above.
