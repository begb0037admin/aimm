-- Retry links retain parentage without exposing local paths or receipt payloads.
ALTER TABLE operations ADD COLUMN retry_parent_operation_id TEXT;
ALTER TABLE operations ADD COLUMN retry_record_id TEXT;
CREATE INDEX operations_retry_parent
  ON operations(retry_parent_operation_id, retry_record_id);
