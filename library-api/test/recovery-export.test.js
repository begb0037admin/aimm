import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

test("pinned D1 export restores cleanly and rolls forward through migrations 0004–0010", () => {
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
