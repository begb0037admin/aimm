-- Stage 4 raw check observations and revision-checked owner preferences.
CREATE TABLE check_observations (
  observation_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  generation_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  installed_version TEXT,
  latest_version TEXT,
  result TEXT NOT NULL CHECK (result IN ('update', 'up_to_date', 'manual', 'unchecked', 'error')),
  source_type TEXT NOT NULL CHECK (source_type IN ('public_vendor', 'local_hub', 'manual')),
  checked_at TEXT NOT NULL,
  last_good_at TEXT,
  error_code TEXT,
  paid_upgrade INTEGER NOT NULL DEFAULT 0 CHECK (paid_upgrade IN (0, 1)),
  route TEXT CHECK (route IN ('hub', 'vendor_site', 'direct_verified', 'manual')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (device_id, generation_id, record_id)
    REFERENCES published_inventory_records(device_id, generation_id, record_id) ON DELETE CASCADE
);
CREATE INDEX check_observations_latest
  ON check_observations(account_id, device_id, record_id, checked_at DESC);
CREATE INDEX check_observations_expiry
  ON check_observations(expires_at);

CREATE TABLE account_settings (
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL CHECK (setting_key IN ('check_cadence', 'notifications', 'appearance', 'category_display')),
  value_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (account_id, setting_key)
);

CREATE TABLE library_marks (
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('vendor', 'product')),
  target_key TEXT NOT NULL CHECK (length(target_key) BETWEEN 1 AND 255),
  favorite INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
  pinned INTEGER NOT NULL DEFAULT 0 CHECK (pinned IN (0, 1)),
  hidden INTEGER NOT NULL DEFAULT 0 CHECK (hidden IN (0, 1)),
  tags_json TEXT NOT NULL DEFAULT '[]',
  snooze_until TEXT,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (account_id, scope, target_key)
);
