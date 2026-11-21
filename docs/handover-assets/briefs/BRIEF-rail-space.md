# Brief: give Hope's chat rail more room (MixBus tab)
Kevin approved the mock (rail-mock-after.png / rail-mock-preview.html in /Users/admin/aimm-previews). Current live build 2026-11-15.4.
Problem: on MixBus the rail is only as tall as the bus tiles, so chat gets ~400px of ~1115.
Approved changes (desktop >=1024px only, CSS only, no JS, no Hope voice/chat logic touched):
1. Rail fills window height: sticky, align-self:start, height calc(100vh - 32px).
2. Tighter header (name 20px, status 12px) and waveform 76px -> 40px.
3. The four buttons in ONE row (Send, Clear chat, route, Backup), 38px tall, no 2x2 divider lines.
4. Typing box 56px tall, still growable to 150px.
5. Transcript gap 14 -> 8.
Reference CSS (the override block used in the mock):
<style id="railMock">
@media (min-width:1024px){
.container > #hopeRail{align-self:start !important;height:calc(100vh - 32px) !important;min-height:calc(100vh - 32px) !important}
#hopeRail .aichat-transcript{gap:8px !important;padding-top:6px !important}
#hopeRail .rail-head{padding-top:10px !important;padding-bottom:4px !important}
#hopeRail .rail-head .oz-rail-name{font-size:calc(var(--inv-text-scale,1)*20px) !important}
#hopeRail .rail-head .oz-rail-status{font-size:calc(var(--inv-text-scale,1)*12px) !important}
#hopeRail #hopeWave{flex:0 0 40px !important;height:40px !important;margin-top:2px !important;padding:4px 12px !important}
#hopeRail .aichat-compose{padding-top:8px !important}
#hopeRail #aiChatInput{height:56px !important;min-height:56px !important;max-height:150px !important}
#hopeRail .aichat-compose .send-col{grid-template-columns:repeat(4,minmax(0,1fr)) !important;grid-template-rows:38px !important;margin:10px 0 2px !important}
#hopeRail .aichat-compose .send-col button{height:38px !important;font-size:11px !important}
#hopeRail .aichat-compose .send-col::after{display:none !important}
#hopeRail .aichat-compose .send-col::before{display:none !important}
}
</style>
Rules: no pills (7px radius rectangular buttons), palette v2, bump AIMM_BUILD, STATUS.md entry in same commit.
Check that Mix Check, Plugins and other tabs still look right (rail height rule applies to all tabs) and that the empty-chat and long-chat states work.

## Jules review (APPROVE WITH CHANGES) - include all
1. Buttons must be 7px-radius rectangles: border-radius:7px !important on .send-col button.
2. Narrow rail: white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding:0 6px. Below ~340px rail width fall back to 2x2 at 38px rows.
3. Sticky: add top:16px; make sure no ancestor overflow:hidden kills sticky; transcript min-height:0, overflow-y:auto.
4. Check Mix Check and Plugins tabs: rail must not overlap the footer.
5. Empty chat (.aichat-empty): vertically centre it in the taller transcript.
6. Button labels stay as in the live app (Send, Clear chat, route toggle, Backup). The mock's "ElevenLabs/Auto" were just the preview's defaults.

## Codex instructions
Work on a NEW BRANCH in /Users/admin/github/aimm (rail-space). Do NOT push to main, do NOT deploy. Bump AIMM_BUILD to 2026-11-16.1... use the next free number, add the docs/STATUS.md entry in the same commit, commit on the branch. Then screenshot MixBus, Mix Check and Plugins tabs (headless Chrome, 2000x1216 and 1280x800) to /Users/admin/aimm-previews/rail-build-*.png and report.

## Added by Kevin (16 Nov): remove the two dropdowns top-right of the page header
The genre dropdown (Hip-Hop) and the target dropdown (Trap -8 LUFS) are not needed any more. HIDE them with CSS (display:none), do NOT delete the elements or their JS, because other code may read their values. Check nothing breaks (Mix Check, Hope context) and say in your report where they live and whether anything depends on them. Include in the same branch/build.
