PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE accounts (account_id TEXT PRIMARY KEY NOT NULL, oidc_issuer TEXT NOT NULL, oidc_subject TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE (oidc_issuer, oidc_subject));
INSERT INTO "accounts" ("account_id","oidc_issuer","oidc_subject","created_at") VALUES('synthetic-recovery-20261024-1159','https://recovery.invalid/','synthetic-subject-20261024-1159','2026-10-24T11:59:00.000Z');
CREATE TABLE devices (device_id TEXT PRIMARY KEY NOT NULL, account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE, display_name TEXT NOT NULL, companion_version TEXT, capabilities_json TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL, last_seen_at TEXT, revoked_at TEXT);
INSERT INTO "devices" ("device_id","account_id","display_name","companion_version","capabilities_json","created_at","last_seen_at","revoked_at") VALUES('00000000-0000-4000-8000-000000000024','synthetic-recovery-20261024-1159','Recovery Probe','synthetic-test','[]','2026-10-24T11:59:00.000Z','2026-10-24T11:59:00.000Z',NULL);
CREATE TABLE IF NOT EXISTS "d1_migrations" (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_foundation.sql','2026-10-23 23:11:56');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0002_enforce_ownership_and_retention.sql','2026-10-23 23:12:24');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(3,'0003_browser_sessions.sql','2026-10-24 09:18:11');
CREATE TABLE IF NOT EXISTS "device_credentials" (credential_id TEXT PRIMARY KEY NOT NULL, device_id TEXT NOT NULL, account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, issued_at TEXT NOT NULL, expires_at TEXT, revoked_at TEXT, FOREIGN KEY (device_id, account_id) REFERENCES devices(device_id, account_id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS "action_receipts" (receipt_id TEXT PRIMARY KEY NOT NULL, account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE, device_id TEXT NOT NULL, operation_id TEXT NOT NULL, terminal_at TEXT NOT NULL, expires_at TEXT NOT NULL, summary_json TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE (device_id, operation_id), FOREIGN KEY (device_id, account_id) REFERENCES devices(device_id, account_id) ON DELETE CASCADE, CHECK (julianday(expires_at) IS NOT NULL AND julianday(expires_at) >= julianday(terminal_at) AND julianday(expires_at) <= julianday(terminal_at, '+90 days')));
CREATE TABLE IF NOT EXISTS "shares" (share_id TEXT PRIMARY KEY NOT NULL, account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, projection_json TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, revoked_at TEXT, CHECK (julianday(expires_at) IS NOT NULL AND julianday(expires_at) > julianday(created_at) AND julianday(expires_at) <= julianday(created_at, '+30 days')));
CREATE TABLE IF NOT EXISTS "profile_comparisons" (profile_id TEXT PRIMARY KEY NOT NULL, account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE, snapshot_json TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, revoked_at TEXT, CHECK (julianday(expires_at) IS NOT NULL AND julianday(expires_at) > julianday(created_at) AND julianday(expires_at) <= julianday(created_at, '+30 days')));
CREATE TABLE deleted_identities (oidc_issuer TEXT NOT NULL, oidc_subject TEXT NOT NULL, deleted_at TEXT NOT NULL, purge_at TEXT NOT NULL, PRIMARY KEY (oidc_issuer, oidc_subject), CHECK (julianday(purge_at) IS NOT NULL AND julianday(purge_at) > julianday(deleted_at) AND julianday(purge_at) <= julianday(deleted_at, '+30 days')));
CREATE TABLE browser_sessions (
  session_id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  csrf_hash TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  auth_time INTEGER,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  CHECK (
    julianday(expires_at) IS NOT NULL AND
    julianday(expires_at) > julianday(created_at) AND
    julianday(expires_at) <= julianday(created_at, '+8 hours')
  )
);
INSERT INTO "browser_sessions" ("session_id","account_id","token_hash","csrf_hash","scopes_json","auth_time","created_at","expires_at","revoked_at") VALUES('00000000-0000-4000-8000-000000000025','synthetic-recovery-20261024-1159','0000000000000000000000000000000000000000000000000000000000000000','0000000000000000000000000000000000000000000000000000000000000001','[]',NULL,'2026-10-24T11:59:00.000Z','2026-10-24T19:59:00.000Z',NULL);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',3);
CREATE INDEX devices_by_account ON devices(account_id, created_at);
CREATE UNIQUE INDEX devices_id_account_unique ON devices(device_id, account_id);
CREATE INDEX device_credentials_by_device ON device_credentials(device_id, revoked_at);
CREATE INDEX action_receipts_expiry ON action_receipts(expires_at);
CREATE INDEX shares_expiry ON shares(expires_at, revoked_at);
CREATE INDEX profile_comparisons_expiry ON profile_comparisons(expires_at, revoked_at);
CREATE INDEX deleted_identities_purge ON deleted_identities(purge_at);
CREATE INDEX browser_sessions_by_account ON browser_sessions(account_id, revoked_at);
CREATE INDEX browser_sessions_expiry ON browser_sessions(expires_at);
