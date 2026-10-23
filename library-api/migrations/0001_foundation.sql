-- AIMM Library API Foundation: identity, device ownership, and retention-ready records.
-- Applied only to the isolated aimm-library-foundation-dev D1 database.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS accounts (
  account_id TEXT PRIMARY KEY NOT NULL,
  oidc_issuer TEXT NOT NULL,
  oidc_subject TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (oidc_issuer, oidc_subject)
);

CREATE TABLE IF NOT EXISTS devices (
  device_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  companion_version TEXT,
  capabilities_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  last_seen_at TEXT,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS devices_by_account
  ON devices(account_id, created_at);

-- Device credentials are stored by hash only. Raw credentials are returned once
-- to the paired companion and live in its Keychain.
CREATE TABLE IF NOT EXISTS device_credentials (
  credential_id TEXT PRIMARY KEY NOT NULL,
  device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  issued_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS device_credentials_by_device
  ON device_credentials(device_id, revoked_at);

-- Server-side summaries contain no paths or raw local journal details.
-- expires_at is set to terminal_at + 90 days by the API retention policy.
CREATE TABLE IF NOT EXISTS action_receipts (
  receipt_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  operation_id TEXT NOT NULL,
  terminal_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  summary_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (device_id, operation_id)
);
CREATE INDEX IF NOT EXISTS action_receipts_expiry
  ON action_receipts(expires_at);

-- Public projections use only opaque, hashed tokens. API creation must enforce
-- expiry <= created_at + 30 days; revocation removes the active projection.
CREATE TABLE IF NOT EXISTS shares (
  share_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  projection_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS shares_expiry
  ON shares(expires_at, revoked_at);

CREATE TABLE IF NOT EXISTS profile_comparisons (
  profile_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS profile_comparisons_expiry
  ON profile_comparisons(expires_at, revoked_at);
