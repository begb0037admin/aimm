PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE accounts (account_id TEXT PRIMARY KEY NOT NULL, oidc_issuer TEXT NOT NULL, oidc_subject TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE (oidc_issuer, oidc_subject));
INSERT INTO "accounts" ("account_id","oidc_issuer","oidc_subject","created_at") VALUES('ph-recovery-fixture-20261024-a','https://fixture.invalid','ph-recovery-fixture-20261024-subject','2026-10-24 09:23:01');
CREATE TABLE devices (device_id TEXT PRIMARY KEY NOT NULL, account_id TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE, display_name TEXT NOT NULL, companion_version TEXT, capabilities_json TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL, last_seen_at TEXT, revoked_at TEXT);
INSERT INTO "devices" ("device_id","account_id","display_name","companion_version","capabilities_json","created_at","last_seen_at","revoked_at") VALUES('ph-recovery-fixture-20261024-device','ph-recovery-fixture-20261024-a','synthetic recovery fixture','test','[]','2026-10-24 09:23:02',NULL,NULL);
CREATE TABLE IF NOT EXISTS "d1_migrations" (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_foundation.sql','2026-10-23 23:11:56');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0002_enforce_ownership_and_retention.sql','2026-10-23 23:12:24');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(3,'0003_browser_sessions.sql','2026-10-24 09:18:11');
