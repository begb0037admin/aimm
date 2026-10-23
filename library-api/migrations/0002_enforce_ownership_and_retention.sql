-- Enforce account/device ownership pairs and maximum server retention.
-- Safe to apply after 0001: the development database currently contains zero
-- application rows, but this migration preserves any compatible existing rows.
PRAGMA defer_foreign_keys = ON;

CREATE UNIQUE INDEX IF NOT EXISTS devices_id_account_unique
  ON devices(device_id, account_id);

CREATE TABLE device_credentials_v2 (
  credential_id TEXT PRIMARY KEY NOT NULL,
  device_id TEXT NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  issued_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT,
  FOREIGN KEY (device_id, account_id)
    REFERENCES devices(device_id, account_id) ON DELETE CASCADE
);

INSERT INTO device_credentials_v2
  (credential_id, device_id, account_id, token_hash, issued_at, expires_at, revoked_at)
SELECT credential_id, device_id, account_id, token_hash, issued_at, expires_at, revoked_at
FROM device_credentials;

DROP TABLE device_credentials;
ALTER TABLE device_credentials_v2 RENAME TO device_credentials;

CREATE INDEX device_credentials_by_device
  ON device_credentials(device_id, revoked_at);

CREATE TABLE action_receipts_v2 (
  receipt_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  terminal_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  summary_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (device_id, operation_id),
  FOREIGN KEY (device_id, account_id)
    REFERENCES devices(device_id, account_id) ON DELETE CASCADE,
  CHECK (
    julianday(expires_at) IS NOT NULL AND
    julianday(expires_at) >= julianday(terminal_at) AND
    julianday(expires_at) <= julianday(terminal_at, '+90 days')
  )
);

INSERT INTO action_receipts_v2
  (receipt_id, account_id, device_id, operation_id, terminal_at, expires_at, summary_json, created_at)
SELECT receipt_id, account_id, device_id, operation_id, terminal_at, expires_at, summary_json, created_at
FROM action_receipts;

DROP TABLE action_receipts;
ALTER TABLE action_receipts_v2 RENAME TO action_receipts;

CREATE INDEX action_receipts_expiry
  ON action_receipts(expires_at);

CREATE TABLE shares_v2 (
  share_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  projection_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  CHECK (
    julianday(expires_at) IS NOT NULL AND
    julianday(expires_at) > julianday(created_at) AND
    julianday(expires_at) <= julianday(created_at, '+30 days')
  )
);

INSERT INTO shares_v2
  (share_id, account_id, token_hash, projection_json, created_at, expires_at, revoked_at)
SELECT share_id, account_id, token_hash, projection_json, created_at, expires_at, revoked_at
FROM shares;

DROP TABLE shares;
ALTER TABLE shares_v2 RENAME TO shares;

CREATE INDEX shares_expiry
  ON shares(expires_at, revoked_at);

CREATE TABLE profile_comparisons_v2 (
  profile_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  CHECK (
    julianday(expires_at) IS NOT NULL AND
    julianday(expires_at) > julianday(created_at) AND
    julianday(expires_at) <= julianday(created_at, '+30 days')
  )
);

INSERT INTO profile_comparisons_v2
  (profile_id, account_id, snapshot_json, created_at, expires_at, revoked_at)
SELECT profile_id, account_id, snapshot_json, created_at, expires_at, revoked_at
FROM profile_comparisons;

DROP TABLE profile_comparisons;
ALTER TABLE profile_comparisons_v2 RENAME TO profile_comparisons;

CREATE INDEX profile_comparisons_expiry
  ON profile_comparisons(expires_at, revoked_at);
