# BRIEF — Settings: four equal key tiles, remove Update-tools tile and empty Models (repo /Users/admin/github/aimm, branch luna-everything)

Kevin approved this preview: /Users/admin/aimm-previews/preview-keys.html (CSS in keys-grid.css). Build it exactly like the preview, but as real source, not an appended override.

1. API keys & Agent access = exactly four equal tiles in a 2x2 grid: ElevenLabs API key, AIMM Deepgram route access token, Preferred ElevenLabs Agent (Fallback), Backup ElevenLabs Agent (Default). Remove the rule that makes the Deepgram tile span the full row (~line 2447, also the #regInboxToolBtn part). Equal heights; agent ID fields top-aligned across both agent tiles (see keys-grid.css last two rules).
2. Remove the "Hope Agent Tools / Update tools on both Agents" tile (#regInboxToolBtn, #regInboxToolStatus) from Settings. Keep the registerInboxTool() function in the script for now (unused by UI) — do not delete it. Kevin runs tool syncs through the ElevenLabs connector.
3. Remove the now-empty Models section (#settingsModels) and its "Models" link in .settings-nav, and the Models article in the "What do these settings do?" guide. Keep any DOM ids other code still reads (e.g. hidden dormant OpenAI fields) — move them into a hidden container if needed so nothing throws.
4. Update the guide text and any copy that mentions "Update tools" so it is true.
5. Colours/fonts unchanged. No changes to Hope chat panel. Bump AIMM_BUILD to the next .N, add a STATUS entry, run all tests, commit on this branch. No push, no deploy.
