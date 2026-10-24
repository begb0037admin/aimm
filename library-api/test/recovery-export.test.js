import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

test("pinned D1 export restores cleanly, preserves actions, and rolls forward through migrations 0004–0011", () => {
  const database = new DatabaseSync(":memory:");
  try {
    database.exec("PRAGMA foreign_keys = ON");
    const exportSQL = readFileSync(new URL("../../governance/evidence/artifacts/PHASE_PLUGINHUB_FOUNDATION_D1_FULL_RECOVERY_EXPORT_20261024.sql", import.meta.url), "utf8");
    database.exec(exportSQL);
    for (const migration of [
      "0004_device_pairing.sql",
      "0005_device_credential_rotation.sql",
      "0006_inventory_generations.sql",
      "0007_status_preferences.sql",
      "0008_safe_actions.sql",
      "0009_check_comparison_reason.sql",
      "0010_action_retries.sql"
    ]) {
      database.exec(readFileSync(new URL("../migrations/" + migration, import.meta.url), "utf8"));
    }

    const device = database.prepare("SELECT device_id, account_id FROM devices LIMIT 1").get();
    assert.ok(device, "the recovery fixture should contain one device");
    const generationID = "77777777-7777-4777-8777-777777777777";
    const recordID = "88888888-8888-4888-8888-888888888888";
    database.prepare("INSERT INTO scan_generations (device_id, generation_id, started_at, completed_at, root_count, record_count, chunk_count, schema_version, state, created_at) VALUES (?, ?, ?, ?, 0, 1, 0, 1, 'complete', ?)")
      .run(device.device_id, generationID, "2026-10-24T21:00:00.000Z", "2026-10-24T21:00:01.000Z", "2026-10-24T21:00:01.000Z");
    database.prepare("INSERT INTO published_inventory_records (device_id, generation_id, record_id, name, bundle_identifier, version, format, metadata_source) VALUES (?, ?, ?, 'Fixture', 'com.example.fixture', '1.0', 'AU', 'infoPlist')")
      .run(device.device_id, generationID, recordID);
    database.prepare("INSERT INTO operations (operation_id, account_id, device_id, generation_id, kind, nonce, idempotency_key, request_hash, state, created_at, expires_at) VALUES (?, ?, ?, ?, 'reveal', 'fixture-nonce', 'fixture-preserved-operation', 'fixture-hash', 'requested', ?, ?)")
      .run("99999999-9999-4999-8999-999999999999", device.account_id, device.device_id, generationID,
        "2026-10-24T21:01:00.000Z", "2026-10-25T21:01:00.000Z");
    database.prepare("INSERT INTO operation_items (operation_id, device_id, generation_id, record_id) VALUES (?, ?, ?, ?)")
      .run("99999999-9999-4999-8999-999999999999", device.device_id, generationID, recordID);

    database.exec(readFileSync(new URL("../migrations/0011_vendor_site_action.sql", import.meta.url), "utf8"));
    assert.equal(database.prepare("SELECT kind FROM operations WHERE operation_id = ?").get("99999999-9999-4999-8999-999999999999").kind, "reveal");
    assert.equal(database.prepare("SELECT COUNT(*) AS count FROM operation_items WHERE operation_id = ?").get("99999999-9999-4999-8999-999999999999").count, 1);
    database.prepare("INSERT INTO operations (operation_id, account_id, device_id, generation_id, kind, nonce, idempotency_key, request_hash, state, created_at, expires_at) VALUES (?, ?, ?, ?, 'open_vendor_site', 'fixture-site-nonce', 'fixture-vendor-site-operation', 'fixture-site-hash', 'requested', ?, ?)")
      .run("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", device.account_id, device.device_id, generationID,
        "2026-10-24T21:02:00.000Z", "2026-10-25T21:02:00.000Z");

    assert.equal(database.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
    assert.equal(database.prepare("PRAGMA foreign_key_check").all().length, 0);
    assert.equal(database.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").get().count, 20);
    for (const table of ["accounts", "devices", "browser_sessions"]) {
      assert.equal(database.prepare("SELECT COUNT(*) AS count FROM " + table).get().count, 1);
    }
  } finally {
    database.close();
  }
});
