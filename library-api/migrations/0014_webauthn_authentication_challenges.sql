-- Short-lived, browser-session-bound passkey assertions. These assertions
-- authenticate the owner session; they do not authorise a file action.
CREATE TABLE webauthn_auth_challenges (
  challenge_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES browser_sessions(session_id) ON DELETE CASCADE,
  challenge TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  CHECK (julianday(expires_at) IS NOT NULL AND julianday(expires_at) > julianday(created_at)),
  CHECK (julianday(expires_at) <= julianday(created_at, '+5 minutes'))
);
CREATE INDEX webauthn_auth_challenges_session_expiry
  ON webauthn_auth_challenges(session_id, expires_at, consumed_at);
