-- Account-owned WebAuthn credentials and short-lived browser/session challenges.
-- Credential IDs/public keys are verification material; no authenticator secret is stored.
CREATE TABLE webauthn_credentials (
  credential_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,
  sign_count INTEGER NOT NULL DEFAULT 0 CHECK (sign_count >= 0),
  transports_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  revoked_at TEXT
);
CREATE INDEX webauthn_credentials_account_active
  ON webauthn_credentials(account_id, revoked_at, created_at);

CREATE TABLE webauthn_challenges (
  challenge_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES browser_sessions(session_id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('registration')),
  challenge TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  CHECK (julianday(expires_at) IS NOT NULL AND julianday(expires_at) > julianday(created_at)),
  CHECK (julianday(expires_at) <= julianday(created_at, '+5 minutes'))
);
CREATE INDEX webauthn_challenges_session_expiry
  ON webauthn_challenges(session_id, expires_at, consumed_at);
