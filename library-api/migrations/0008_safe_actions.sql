-- Stage 5 begins with a single safe local action: reveal a current installed copy.
CREATE TABLE operations (
  operation_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('reveal')),
  nonce TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('requested', 'claimed', 'completed', 'partial', 'failed', 'cancelled', 'expired')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  claimed_at TEXT,
  terminal_at TEXT,
  UNIQUE (account_id, idempotency_key),
  FOREIGN KEY (device_id, generation_id)
    REFERENCES scan_generations(device_id, generation_id) ON DELETE CASCADE
);
CREATE INDEX operations_device_queue
  ON operations(device_id, state, created_at);

CREATE TABLE operation_items (
  operation_id TEXT NOT NULL REFERENCES operations(operation_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  generation_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  PRIMARY KEY (operation_id, record_id),
  FOREIGN KEY (device_id, generation_id, record_id)
    REFERENCES published_inventory_records(device_id, generation_id, record_id) ON DELETE CASCADE
);
