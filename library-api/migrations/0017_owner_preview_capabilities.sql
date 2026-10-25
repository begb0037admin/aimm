-- One-use exact-preview access is tied to the browser session that passed WebAuthn.
ALTER TABLE operations ADD COLUMN owner_preview_capability_session_id TEXT REFERENCES browser_sessions(session_id) ON DELETE SET NULL;
