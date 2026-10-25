-- Short-lived exact-path previews are encrypted separately from redacted operations.
ALTER TABLE operations ADD COLUMN owner_preview_viewed_at TEXT;
ALTER TABLE operations ADD COLUMN owner_preview_capability_hash TEXT;
ALTER TABLE operations ADD COLUMN owner_preview_capability_expires_at TEXT;

CREATE TABLE action_preview_payloads (
  operation_id TEXT PRIMARY KEY NOT NULL REFERENCES operations(operation_id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  preview_digest TEXT NOT NULL CHECK (length(preview_digest) = 64),
  iv TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  CHECK (julianday(expires_at) IS NOT NULL AND julianday(expires_at) > julianday(created_at)),
  CHECK (julianday(expires_at) <= julianday(created_at, '+10 minutes'))
);
CREATE INDEX action_preview_payloads_expiry ON action_preview_payloads(expires_at);
