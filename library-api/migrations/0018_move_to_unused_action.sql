-- Add the locally confirmed, journaled one-item move-to-Unused action.
-- Preserve queued items and encrypted exact previews while replacing the
-- operation kind constraint. Existing action receipts have no operation FK.
CREATE TABLE operation_items_backup AS
SELECT operation_id, device_id, generation_id, record_id FROM operation_items;

CREATE TABLE action_preview_payloads_backup AS
SELECT operation_id, account_id, device_id, preview_digest, iv, ciphertext, created_at, expires_at
FROM action_preview_payloads;

DROP TABLE operation_items;
DROP TABLE action_preview_payloads;

CREATE TABLE operations_v3 (
  operation_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('reveal', 'open_vendor_site', 'launch_hub', 'move_to_unused')),
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
  preview_digest TEXT,
  preview_expires_at TEXT,
  owner_confirmed_at TEXT,
  preview_unlocked_at TEXT,
  owner_preview_viewed_at TEXT,
  owner_preview_capability_hash TEXT,
  owner_preview_capability_expires_at TEXT,
  owner_preview_capability_session_id TEXT REFERENCES browser_sessions(session_id) ON DELETE SET NULL,
  UNIQUE (account_id, idempotency_key),
  FOREIGN KEY (device_id, generation_id)
    REFERENCES scan_generations(device_id, generation_id) ON DELETE CASCADE
);

INSERT INTO operations_v3 (
  operation_id, account_id, device_id, generation_id, kind, nonce,
  idempotency_key, request_hash, state, created_at, expires_at, claimed_at,
  terminal_at, retry_parent_operation_id, retry_record_id, preview_digest,
  preview_expires_at, owner_confirmed_at, preview_unlocked_at,
  owner_preview_viewed_at, owner_preview_capability_hash,
  owner_preview_capability_expires_at, owner_preview_capability_session_id
)
SELECT operation_id, account_id, device_id, generation_id, kind, nonce,
       idempotency_key, request_hash, state, created_at, expires_at, claimed_at,
       terminal_at, retry_parent_operation_id, retry_record_id, preview_digest,
       preview_expires_at, owner_confirmed_at, preview_unlocked_at,
       owner_preview_viewed_at, owner_preview_capability_hash,
       owner_preview_capability_expires_at, owner_preview_capability_session_id
FROM operations;

DROP TABLE operations;
ALTER TABLE operations_v3 RENAME TO operations;

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
INSERT INTO action_preview_payloads
  (operation_id, account_id, device_id, preview_digest, iv, ciphertext, created_at, expires_at)
SELECT operation_id, account_id, device_id, preview_digest, iv, ciphertext, created_at, expires_at
FROM action_preview_payloads_backup;
DROP TABLE action_preview_payloads_backup;
CREATE INDEX action_preview_payloads_expiry ON action_preview_payloads(expires_at);
