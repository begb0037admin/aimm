# Hope Backup agent: rollback and match record (26 Nov 2026)

Backup = agent_2601kqm4g7txfsvv0pkvpe02389p (second ElevenLabs account, reachable only through the aimm-proxy relay with an Origin header and a non-python User-Agent).

On 26 Nov 2026 Kevin asked for it to be identical to the Primary (agent_9001m42hnyrwedts40en5a5npapp) because it had lost the video and channel tools. It now has the Primary's exact prompt (15,812 characters) and 85 tools.

| File | What it is |
|---|---|
| backup-agent-BEFORE.json | the Backup agent exactly as it was before the change (roll back with a PATCH of its conversation_config) |
| backup-tools-BEFORE.json | the Backup's tool list before the change |
| backup-prompt-BEFORE.txt | its old prompt text |
| backup-agent-AFTER.json | the Backup read back after the change |
| primary-prompt.txt | the Primary's prompt that was copied across |

No keys are stored here. Known difference: Backup has four extra tools (web_search_fallback, pluginhub_add_to_bus, pluginhub_navigate, pluginhub_search_inventory) and lacks `research`. A full tool-by-tool comparison with the Primary needs the ElevenLabs connector reconnected.
