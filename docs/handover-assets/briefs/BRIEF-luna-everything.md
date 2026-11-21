# BRIEF — Move every Anthropic/Haiku job to GPT-6 Luna (repo: /Users/admin/github/aimm)

Kevin decision (2026-11-18): option 1 — everything runs on Luna. No Anthropic left in AIMM.

## Why
Hope voice already uses Luna. Six page features and one Worker route still call Anthropic Haiku 5.5. Most page calls need an Anthropic key saved in the browser, which Kevin does not use (keys live in the Worker). The Settings model picker (`rtClaudeModel`) is mostly ignored.

## What calls Anthropic today
Worker (`worker/src/index.js`, the aimm-proxy Worker):
- `/hope/web-search` (~line 575) — Haiku + Anthropic `web_search_20250305` tool.
- generic `/anthropic/*` pass-through (~line 776) and `anthropic` upstream entry (line 14), vendor-check probe (~232).

Page (`standalone/assets/index.html`):
- `extractProfile` ~6629 (facts after a call)
- `autoFillChainSettings` ~6963
- `rerankTopPicksWithClaude` ~11018
- `kbCallHaikuSummary` ~14110
- `kbExtractMetadata` ~14295
- `parseImportWithClaude` ~14704
- `research()` ~15005 (Hope tool; reads `rtClaudeModel`)
- Pricing/cost code `ANT_PRICING` ~12118, fetch rewrite ~11570.

## Do exactly this
1. **Worker:** add `POST /hope/ai` — same auth, rate limit and CORS as `/hope/luna` (HOPE_STT_TOKEN bearer, HOPE_STT_LIMIT). Non-streaming. Body `{system, user, max_output_tokens}` (cap 2000, input cap 100000 chars). Calls OpenAI Responses API, model `gpt-6-luna`, `reasoning:{effort:'low'}`, `store:false`. Returns `{text, usage}`.
2. **Worker:** rewrite `/hope/web-search` to use Luna with OpenAI's built-in web search tool. Keep the response shape `{answer, sources[], web_search_requests}` so callers don't change. **Verify the tool name against current OpenAI docs and with one real test call after deploy.** If Luna cannot do web search, STOP and report — do not invent a workaround.
3. **Page:** replace each Haiku call above with one shared helper `aimmAiText(system,user,max)` that posts to `/hope/ai` with the existing saved AIMM token (`HOPE_STT_TOKEN_STORAGE`). Keep each feature's prompt and parsing exactly as is. Errors must say "Luna", not "Haiku", and tell Kevin to add the access token if missing (same wording style as the TTS error).
4. **Page:** remove the Anthropic API key field + status, the "Optional Anthropic research model" picker, the Anthropic cost card, `rtClaudeModel` reads/saves (keep loading old saved prefs harmlessly), `ANT_PRICING` use, and text that says Anthropic/Haiku/Claude in Settings, the guide, help text, and the in-app notes (~13100–13330). Keep every DOM id other code still reads, or guard those reads. Cost: show Luna spend only if it can be computed from `usage` simply; otherwise leave cost out and say so in STATUS.
5. **Worker:** remove the `/anthropic/*` proxy route and the ANTHROPIC_API_KEY use only if nothing else reads it (grep first). Do NOT delete secrets.
6. Do not change Hope chat panel layout, buttons or header. Do not change colours or layout of Settings (redesign is a separate step).
7. Bump `AIMM_BUILD`, add a STATUS entry in the same commit.

## Tests to run and report
- Worker: node syntax check; with a stub, `/hope/ai` rejects missing/bad token (401), accepts good request shape.
- Page: no remaining `api.anthropic.com`, `claude-haiku`, `rtAntKey`, `ANT_PRICING` in index.html (list any left and why).
- Each of the 7 page functions still builds a valid request (call them with a mocked fetch).

## Deploy (NOT part of this brief)
Kevin approves a preview first. Two deploys later: aimm-proxy Worker first, then the aimm page. Rollback = previous build 2026-11-18.1.
