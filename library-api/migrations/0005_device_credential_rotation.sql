-- Bind a credential revocation to the exact one-time replacement created by its rotation.
ALTER TABLE device_credentials ADD COLUMN rotated_to_credential_id TEXT;
