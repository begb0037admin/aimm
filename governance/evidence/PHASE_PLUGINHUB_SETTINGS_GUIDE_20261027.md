# PluginHub Settings guide — 2026-10-27

## Change

Added a collapsed, keyboard- and touch-accessible “What do these settings do?” guide below the Settings section navigation. It explains Library account access, API keys and Agent access, Models, Session safety, Voice routes, and Reset in plain language. The guide uses the existing charcoal cards, subtle borders, and blue-purple accent, with responsive two-column and single-column layouts. It does not rely on hover and does not change settings behavior.

## Verification and limits

- Source inspection confirmed one guide with six section explanations and matching responsive styles.
- Both inline application JavaScript blocks parsed successfully after the edit.
- The connected branch preview still served the previous Settings revision when inspected, so the new guide itself has not been visually verified in the browser.
- No tests or builds were run. No deployment was performed.
- No provider controls were activated; no credentials, account data, or D1 state were read or changed.

## Source

- Branch: `codex/pluginhub-foundation`
- Source commit: `d20d482c9dc1eaaaf6226406403d709ce426d97a`
- Updated `index.html` blob: `ca34b091f455bd20e932c9aaf9b627f6829db89a`

This Settings usability change does not close any Foundation gate. Foundation remains **NOT MET**; Stage 6 remains gated.