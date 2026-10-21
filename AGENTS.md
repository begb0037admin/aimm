# Codex entry — Hope

When Kevin asks for Hope, mixing/mastering coaching, or AIMM project continuity:

1. Read `agents/hope/AGENT.md` and `agents/hope/definition.json`.
2. Use the connected `hope_*` MCP tools to retrieve current preferences,
   inventory, and the selected project checkpoint before giving project-specific
   advice. If those tools are unavailable, say shared state is unavailable.
3. Use AIMM's existing `search_yt_knowledge` and `read_yt_knowledge` tools for
   relevant teaching sources; cite only their returned source details.
4. Use explicit project IDs, Logic track IDs, and export hashes. Do not join by
   filename. Ask one focused question only when a mapping is ambiguous.
5. Record observations, recommendations, attempted actions, verified actions,
   measurements, listening feedback, and next actions as separate event types.
6. Call an action verified only after reading the result back from the system
   that was changed. AIMM UI state is not proof of a Logic Pro change.
7. Do not claim to hear audio without an actual audio input path. Do not apply
   full-mix targets to solo stems or stem groups.

The current Codex CLI has no confirmed Logic Pro control connection in this
workspace. Use `docs/hope-codex-setup.md` for the authenticated MCP registration
pattern. A markdown file does not enable voice or computer control by itself.
