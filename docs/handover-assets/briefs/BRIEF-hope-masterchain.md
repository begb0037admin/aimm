# BRIEF: Hope loads a master bus chain, visibly, without stopping
For Codex (gpt-6-sol, medium). Edit ONLY /Users/admin/github/aimm/standalone/assets/index.html (build 2026-11-16.1; lines below verified 16 Nov).
Rules: no layout, button or header changes to the Hope panel. @elevenlabs/client stays pinned 0.1.7. No emoji in UI text. Bump AIMM_BUILD (L5220) and add a docs/STATUS.md entry in the same commit. Do NOT edit the ElevenLabs agent (agent_9001m42hnyrwedts40en5a5npapp). Show Kevin the diff before any push.

## THE GOAL (the only thing that matters)
Kevin says: "Hope, load a master bus chain from a trap video."
Plugins then APPEAR on the MixBus master bus one by one, while she works. She never stops on an error, never asks him about ownership, silently swaps any plugin he does not own for the closest owned one in the same job, and afterwards says so in ONE short line ("Loaded 6 plugins, swapped 2 for ones you own: Pusher to Saturn 2, X to Y.").

Everything below serves this. Today it fails because the only tool is `add_plugin_to_bus` (L17202): one plugin per call, and it throws if the plugin is not found (L17205-17210). Hope proposed "Infected Mushroom Pusher", got the error, stopped, and said "nothing changed". `save_preset` (L17182) and `inventory_add_to_bus` (L17096) do not help (save current chain / one scanned plugin).

## 1. CORE: new tool `set_bus_chain` with visible one-by-one loading
Add to TOOL_DEFS (L12183) and `handleToolCall` (near L17202) so Luna and ElevenLabs both get it. Input: {bus, plugins:[{plugin, settings?}], clear_first (default true)}.
Behaviour, in code, inside the one tool call:
- Switch to the MixBus tab first (same trick as L17120: `EL.suppressNextTabChange=true; tab.click()`), clear the bus (renderChain), then loop the list IN ORDER.
- For each item: resolve to an owned plugin (below), push the entry, call `renderChain()` AND `saveState()` immediately, set the status line with `aichatStatus('Adding '+name+'…','busy')`, pin its settings with the existing set_plugin_settings logic (L17295) if given, then `await` about 400 ms so each plugin visibly lands before the next. Highlight the new row if the chain already supports it (reuse, do not build new UI).
- One failure never stops the loop. No throw reaches Hope; unresolvable items go in `skipped`.
- Return {ok:true, bus, added:[...], swapped:[{asked, used}], skipped:[{asked, why}], chain:[...]} so Hope can say the one-line summary from real data.

Owned-plugin resolver `resolveOwnedPlugin(name, stage)`: exact name first; then startsWith/includes; then the closest owned plugin in the SAME stage (compressor for compressor, limiter for limiter); never the loose any-word match in `fuzzyFindPlugin` (L12286), which can pick a wrong plugin. Pool = `allPlugins()` (L5805) plus the local scan (`INV_SCAN_ROWS`, as in `inventory_add_to_bus`) when scan rows exist. No question goes to Kevin; no decision is needed.

Prompt wording (Luna prompt is in this file: `HOPE_CHAIN_BUILD_RULES` L15852, `HOPE_USAGE_SYSTEM` L15854; rewrite step 2-3 of the rules): find the video, state its creator and the bus it is really about, call `set_bus_chain` ONCE with the full list in the video's order, do not ask about ownership, then give ONE line on swaps and skips taken from the tool result. Also write the same text as a block at the end of your report so Kevin can paste it into the ElevenLabs agent later; do not edit that agent.

## 2. ENABLERS (small, required so the core can run)
a) Loop cap: Luna loop is `while(loops++<4)` (L16200) with a throw at L16225. Raise to 8; keep the throw but say what was already loaded.
b) False "garbled" flag: `hopeTranscriptLooksGarbled` (L15678) splits on `/[a-z]+/`, so "I'm" and "Let's" leave a lone "m"/"s" with no vowel and the request is rejected with "I heard ... Could you repeat that?" (L15765, L15803). On the ElevenLabs route the same flag makes every client tool return that error (L19074). Fix: match `/[a-z]+(?:['’][a-z]+)*/gi`, never flag text of 4+ words, add the cue verbs load, build, make, give, need, want, looking, get, put, create. Keep the confidence<0.45 rule.

## 3. LAST / OPTIONAL
c) Context after a failure: L16255 saves the error as Hope's own reply and history is `slice(-5)` (L16176), so the next turn forgets the request. Save it as `{role:'ai', failed:true}` with a note containing Kevin's original request and "nothing was loaded"; keep that note out of the 5-message trim. On-screen wording unchanged.
d) "Thinking" on the ElevenLabs route: follow /Users/admin/aimm-previews/BRIEF-el-thinking.md exactly; do not redo it.

## Order
1 (core) with 2a and 2b together, then test, then 3c, then 3d.

## Codex checks before it says done
- node-extracted test: "I'm looking for a master chain from a trap video" is not garbled; "asdf qwrt" still is.
- `set_bus_chain` with 6 names, 2 unowned: 6 entries land in order, 2 reported as swapped, nothing thrown, an unresolvable name goes to `skipped` and the rest still load.
- `renderChain` is called once per plugin, with an await between (visible stagger), and the tab is the MixBus tab.
- A Luna turn with search, read, set_bus_chain and a spoken summary finishes inside the cap.
- Grep: client version unchanged, no emoji, no CSS or markup changes.

## Kevin's test (three spoken lines, MixBus tab)
1. "Hope, load a master bus chain from a trap video." (watch plugins appear one by one; she gives one line on swaps)
2. "I'm happy with that, what did you swap?" (answers from the real result, no "could you repeat that")
3. "Now do the same from a drill video." (master bus replaced, same one-line report)

## Jules review changes (mandatory, APPROVED once included)
1. No new-row highlight, no new CSS or class. renderChain rebuilds busGrid each add; that is fine.
2. Pace 350-400 ms between adds, no animation, no wait after the last plugin.
3. Clearing the bus inside the tool: no confirm prompt (do not call clearBusFromUI); call renderChain directly.
4. Status line: aichatStatus writes innerHTML, so escape the plugin name with escapeHtml. Use "Adding X…". Wrap loop in try/finally and reset status to idle at the end or on failure.
5. Scope guard: Hope panel markup, header and buttons unchanged. No CSS edits. Check with a diff grep before finishing.
6. Render check on MixBus with 6 and 10 plugins; save screenshots to /Users/admin/aimm-previews/ and open the 10-plugin one. Desktop only.

## Process
Work on a new branch (hope-masterchain) from origin/main. Do NOT merge, push to main or deploy. Bump AIMM_BUILD, add the STATUS.md entry. Final report: build number, files changed, screenshots, and the ElevenLabs prompt block needed (do not edit the agent).
