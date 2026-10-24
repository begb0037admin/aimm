-- Add the explicitly owner-confirmed local hub-app launch action.
-- Preserve queued operations/items while expanding the operation-kind check.
CREATE TABLE operation_items_backup AS
SELECT operation_id, device_id, generation_id, record_id FROM operation_items;

DROP TABLE operation_items;

CREATE TABLE operations_v2 (
  operation_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('reveal', 'open_vendor_site', 'launch_hub')),
  nonce TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('requested', 'claimed', 'completed', 'partial', 'failed', 'cancelled', 'expired')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  claimed_at TEXT,
  terminal_at TEXT,
  retry_parent_operation_id TEXT,
  retry_record_id TEXT,
  UNIQUE (account_id, idempotency_key),
  FOREIGN KEY (device_id, generation_id)
    REFERENCES scan_generations(device_id, generation_id) ON DELETE CASCADE
);

INSERT INTO operations_v2 (
  operation_id, account_id, device_id, generation_id, kind, nonce,
  idempotency_key, request_hash, state, created_at, expires_at,
  claimed_at, terminal_at, retry_parent_operation_id, retry_record_id
)
SELECT operation_id, account_id, device_id, generation_id, kind, nonce,
       idempotency_key, request_hash, state, created_at, expires_at,
       claimed_at, terminal_at, retry_parent_operation_id, retry_record_id
FROM operations;

DROP TABLE operations;
ALTER TABLE operations_v2 RENAME TO operations;

CREATE INDEX operations_device_queue
  ON operations(device_id, state, created_at);
CREATE INDEX operations_retry_parent
  ON operations(retry_parent_operation_id, retry_record_id);

CREATE TABLE operation_items (
  operation_id TEXT NOT NULL REFERENCES operations(operation_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  generation_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  PRIMARY KEY (operation_id, record_id),
  FOREIGN KEY (device_id, generation_id, record_id)
    REFERENCES published_inventory_records(device_id, generation_id, record_id) ON DELETE CASCADE
);

INSERT INTO operation_items (operation_id, device_id, generation_id, record_id)
SELECT operation_id, device_id, generation_id, record_id FROM operation_items_backup;
DROP TABLE operation_items_backup;
