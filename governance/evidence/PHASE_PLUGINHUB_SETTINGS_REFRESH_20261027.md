# PluginHub Settings refresh and preview verification — 2026-10-27

## Change

Made **Library Settings** a visible section on the Settings page, ahead of the API controls. Its account preview controls stay closed until explicitly opened; account reads still require the user to sign in.

Updated the stale Hope settings to match the current routes:

- **Auto:** ElevenLabs Live Agent, with Fallback preferred and Default used for one retry only after clear quota or credit exhaustion. Network and unrelated errors do not trigger retry, and Auto does not switch to Deepgram.
- **Deepgram:** Flux transcribes, GPT-6 Luna replies and can use AIMM tools, and ElevenLabs Flash speaks. The browser token requests a short-lived speech ticket; provider API credentials remain in the Worker.
- **Models:** the visible Anthropic selector is for optional research only. The Auto model is set on the ElevenLabs Agent; Deepgram uses GPT-6 Luna through the Worker.
- **Agent IDs and tools:** both read-only Agent IDs now show their roles. The tool-registration control is labelled to update both Agents, but was not run.
- **Session safety:** retained the Auto call reminder and idle-call stop, explicitly excluding Deepgram. Removed stale cost and session-breakdown tiles and clarified that Reset clears local workbench state without clearing Library settings or provider access.
- **Provider key status:** the page states that the AIMM relay supplies Anthropic and ElevenLabs credentials from the Worker. In relay mode, the browser does not load or save provider API keys as local direct keys.

## Verification

- Account preview UI and authorization-scope suites: **10/10 passed** in a disposable temporary test copy.
- The updated inline application script passed `node --check`.
- Cloudflare Pages preview for branch commit `9d02cbb8ad519b2602a2f0c0e55ab55c57fa95b2` completed successfully: [preview](https://f1c15cee.aimm-pluginhub-foundation-dev.pages.dev/), deployment `f1c15cee-59ee-433f-a60d-552f59ad1738`.
- Browser inspection showed Library Settings, API keys, both Agent IDs, current route guidance, and only the applicable safety controls in Settings. The account controls remained closed. No sign-in or account API request was made.
- No provider tool registration, credential change, D1 operation, production deployment, or cutover occurred.

## Source pins at the verified preview commit

- `index.html`: blob `6cebd8760e514e63a7e709c33cd6c3ca4b323ca4`
- `library-api/library-account.js`: blob `57ea839289c4322df54b64a593e1a597d8ab2d32`
- `library-api/test/library-account.test.js`: blob `3470d46c1af5ba33e24419a14e9c4ec2295024ff`
- `library-api/test/library-account-auth-scope.test.js`: blob `ad205aa10fdc7970dd8b810548c94307b8c81448`

This is Settings UI and copy evidence only. It does not close account-backed browser/Mac/Hope parity, remote isolation, or Foundation exit. Foundation remains **NOT MET**; Stage 6 remains gated.
