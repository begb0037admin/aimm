-- One-time companion pairing. Polling secrets are stored by hash only.
ALTER TABLE devices ADD COLUMN public_key_jwk TEXT;

CREATE TABLE pairings (
  pairing_id TEXT PRIMARY KEY NOT NULL,
  polling_secret_hash TEXT NOT NULL,
  device_name TEXT NOT NULL CHECK (length(device_name) BETWEEN 1 AND 80),
  public_key_jwk TEXT NOT NULL,
  public_key_fingerprint TEXT NOT NULL,
  server_nonce TEXT NOT NULL,
  verification_phrase TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  approved_account_id TEXT REFERENCES accounts(account_id) ON DELETE CASCADE,
  approved_at TEXT,
  device_id TEXT,
  delivered_at TEXT,
  poll_attempts INTEGER NOT NULL DEFAULT 0 CHECK (poll_attempts BETWEEN 0 AND 60),
  CHECK (
    julianday(expires_at) IS NOT NULL AND
    julianday(expires_at) > julianday(created_at) AND
    julianday(expires_at) <= julianday(created_at, '+10 minutes')
  )
);
CREATE INDEX pairings_expiry ON pairings(expires_at, delivered_at);

CREATE TABLE pairing_rate_limits (
  source_hash TEXT PRIMARY KEY NOT NULL,
  window_start INTEGER NOT NULL,
  create_count INTEGER NOT NULL DEFAULT 0,
  poll_count INTEGER NOT NULL DEFAULT 0,
  CHECK (create_count BETWEEN 0 AND 5),
  CHECK (poll_count BETWEEN 0 AND 30)
);
