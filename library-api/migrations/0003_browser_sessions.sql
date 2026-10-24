-- Browser sessions are short-lived, opaque and separate from device credentials.
-- CSRF values are hashed; raw tokens exist only in the browser cookie/memory.
CREATE TABLE browser_sessions (
  session_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  csrf_hash TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  auth_time INTEGER,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  CHECK (
    julianday(expires_at) IS NOT NULL AND
    julianday(expires_at) > julianday(created_at) AND
    julianday(expires_at) <= julianday(created_at, '+8 hours')
  )
);
CREATE INDEX browser_sessions_by_account
  ON browser_sessions(account_id, revoked_at);
CREATE INDEX browser_sessions_expiry
  ON browser_sessions(expires_at);
