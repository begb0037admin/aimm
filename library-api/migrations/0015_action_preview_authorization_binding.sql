-- Bind future owner WebAuthn assertions to the exact device-signed preview.
-- The preview digest is metadata only; full path payload encryption is added
-- by the action-preview storage migration before any path is exposed.
ALTER TABLE operations ADD COLUMN preview_digest TEXT;
ALTER TABLE operations ADD COLUMN preview_expires_at TEXT;
ALTER TABLE operations ADD COLUMN owner_confirmed_at TEXT;
ALTER TABLE operations ADD COLUMN preview_unlocked_at TEXT;

ALTER TABLE webauthn_auth_challenges ADD COLUMN purpose TEXT NOT NULL DEFAULT 'session_reauth';
ALTER TABLE webauthn_auth_challenges ADD COLUMN operation_id TEXT;
ALTER TABLE webauthn_auth_challenges ADD COLUMN preview_digest TEXT;
ALTER TABLE webauthn_auth_challenges ADD COLUMN preview_expires_at TEXT;
