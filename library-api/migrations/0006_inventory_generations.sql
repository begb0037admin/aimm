-- Stage 2 inventory snapshots are staged and become visible only after finalize.
CREATE TABLE scan_generations (
  device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  root_count INTEGER NOT NULL CHECK (root_count BETWEEN 0 AND 100),
  record_count INTEGER NOT NULL CHECK (record_count BETWEEN 0 AND 100000),
  chunk_count INTEGER NOT NULL CHECK (chunk_count BETWEEN 0 AND 1000),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  state TEXT NOT NULL CHECK (state IN ('staging', 'complete', 'partial')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (device_id, generation_id)
);
CREATE INDEX scan_generations_complete
  ON scan_generations(device_id, state, completed_at);

CREATE TABLE inventory_chunks (
  device_id TEXT NOT NULL,
  generation_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL CHECK (chunk_index BETWEEN 0 AND 999),
  payload_hash TEXT NOT NULL,
  records_json TEXT NOT NULL,
  record_count INTEGER NOT NULL CHECK (record_count BETWEEN 0 AND 250),
  created_at TEXT NOT NULL,
  PRIMARY KEY (device_id, generation_id, chunk_index),
  FOREIGN KEY (device_id, generation_id)
    REFERENCES scan_generations(device_id, generation_id) ON DELETE CASCADE
);

CREATE TABLE device_inventory_heads (
  device_id TEXT PRIMARY KEY NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (device_id, generation_id)
    REFERENCES scan_generations(device_id, generation_id)
);
