import { DurableObject } from 'cloudflare:workers';

const EVENT_TYPES = new Set([
  'observation', 'recommendation', 'action_attempted', 'action_verified',
  'measurement', 'listening_feedback', 'next_action', 'audio_export',
  'analysis_completed', 'mapping_confirmed'
]);
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const SHA256 = /^[a-f0-9]{64}$/i;

function fail(status, code, message){
  const error = new Error(message);
  error.status = status;
  error.code = code;
  throw error;
}
function requireId(value, label){
  if (typeof value !== 'string' || !SAFE_ID.test(value)) fail(400, 'invalid_id', `${label} must be an explicit stable ID`);
  return value;
}
function requireText(value, label, max = 500){
  if (typeof value !== 'string' || !value.trim() || value.length > max) fail(400, 'invalid_text', `${label} is required`);
  return value.trim();
}
function jsonObject(value, label){
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'invalid_object', `${label} must be an object`);
  return value;
}
function parseJson(value, fallback = null){
  try { return value == null ? fallback : JSON.parse(value); } catch { return fallback; }
}
function rows(cursor){ return cursor.toArray(); }
function one(cursor){ return cursor.toArray()[0] || null; }

export class HopeState extends DurableObject {
  constructor(ctx, env){
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS hope_projects (
          project_id TEXT PRIMARY KEY,
          display_name TEXT NOT NULL,
          source_song_name TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          version INTEGER NOT NULL DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS hope_tracks (
          project_id TEXT NOT NULL,
          track_id TEXT NOT NULL,
          logic_track_id TEXT,
          original_name TEXT NOT NULL,
          created_at TEXT NOT NULL,
          PRIMARY KEY (project_id, track_id),
          UNIQUE (project_id, logic_track_id),
          FOREIGN KEY (project_id) REFERENCES hope_projects(project_id)
        );
        CREATE TABLE IF NOT EXISTS hope_exports (
          export_id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          track_id TEXT NOT NULL,
          song_folder TEXT NOT NULL,
          original_filename TEXT NOT NULL,
          content_hash TEXT NOT NULL,
          export_version TEXT NOT NULL,
          exported_at TEXT NOT NULL,
          analysis_json TEXT,
          analysis_revision INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (project_id, track_id) REFERENCES hope_tracks(project_id, track_id)
        );
        CREATE INDEX IF NOT EXISTS hope_exports_project_track ON hope_exports(project_id, track_id, exported_at);
        CREATE TABLE IF NOT EXISTS hope_events (
          event_id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          event_type TEXT NOT NULL,
          occurred_at TEXT NOT NULL,
          source TEXT NOT NULL,
          persona_version TEXT NOT NULL,
          payload_json TEXT NOT NULL,
          project_version INTEGER NOT NULL,
          FOREIGN KEY (project_id) REFERENCES hope_projects(project_id)
        );
        CREATE INDEX IF NOT EXISTS hope_events_project_time ON hope_events(project_id, occurred_at DESC);
        CREATE TABLE IF NOT EXISTS hope_preferences (
          profile_id TEXT PRIMARY KEY,
          value_json TEXT NOT NULL,
          version INTEGER NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS hope_inventory (
          item_id TEXT PRIMARY KEY,
          value_json TEXT NOT NULL,
          source_migration_id TEXT,
          version INTEGER NOT NULL DEFAULT 1,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS hope_inventory_migrations (
          migration_id TEXT PRIMARY KEY,
          source_fingerprint TEXT NOT NULL,
          source_version TEXT NOT NULL,
          source_snapshot_json TEXT NOT NULL,
          receipt_json TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    });
  }

  async dispatch(method, args = []){
    const allowed = new Set(['getContext','listProjects','createProject','createTrack','recordExport','saveAnalysis','appendEvent','setPreferences','updateInventoryItem','migrateInventory','rollbackInventoryMigration']);
    if (!allowed.has(method)) return {ok:false,status:404,code:'unknown_operation',message:'Unknown shared-state operation'};
    try { return {ok:true,value:await this[method](...args)}; }
    catch (error){ return {ok:false,status:error.status || 500,code:error.code || 'state_error',message:error.message || String(error)}; }
  }

  getProject(projectId){
    requireId(projectId, 'projectId');
    const project = one(this.ctx.storage.sql.exec('SELECT * FROM hope_projects WHERE project_id = ?', projectId));
    if (!project) return null;
    const tracks = rows(this.ctx.storage.sql.exec('SELECT * FROM hope_tracks WHERE project_id = ? ORDER BY created_at, track_id', projectId));
    const exports = rows(this.ctx.storage.sql.exec('SELECT * FROM hope_exports WHERE project_id = ? ORDER BY exported_at DESC, export_id', projectId)).map(row => ({...row, analysis: parseJson(row.analysis_json)}));
    return {...project, tracks, exports};
  }

  listProjects(name){
    const query = typeof name === 'string' ? name.trim().toLocaleLowerCase() : '';
    const all = rows(this.ctx.storage.sql.exec('SELECT project_id, display_name, source_song_name, created_at, updated_at, version FROM hope_projects ORDER BY updated_at DESC'));
    return query ? all.filter(item => item.display_name.toLocaleLowerCase() === query || item.source_song_name.toLocaleLowerCase() === query) : all;
  }

  getContext(projectId, limit = 30){
    const profile = one(this.ctx.storage.sql.exec('SELECT value_json, version, updated_at FROM hope_preferences WHERE profile_id = ?', 'kevin'));
    const inventory = rows(this.ctx.storage.sql.exec('SELECT item_id, value_json, version, updated_at FROM hope_inventory ORDER BY item_id')).map(row => ({...parseJson(row.value_json, {}), id:row.item_id, version:row.version, updated_at:row.updated_at}));
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 30));
    const project = projectId ? this.getProject(projectId) : null;
    const events = projectId ? rows(this.ctx.storage.sql.exec('SELECT * FROM hope_events WHERE project_id = ? ORDER BY occurred_at DESC, event_id DESC LIMIT ?', projectId, safeLimit)).map(row => ({...row, payload:parseJson(row.payload_json, {})})) : [];
    return {persona_version:'1.0.0', preferences:profile ? {...parseJson(profile.value_json, {}), version:profile.version, updated_at:profile.updated_at} : null, inventory, projects:this.listProjects(), project, events};
  }

  createProject(input){
    const projectId = requireId(input.projectId, 'projectId');
    const displayName = requireText(input.displayName, 'displayName');
    const sourceSongName = requireText(input.sourceSongName || input.displayName, 'sourceSongName');
    const now = new Date().toISOString();
    const existing = one(this.ctx.storage.sql.exec('SELECT * FROM hope_projects WHERE project_id = ?', projectId));
    if (existing){
      if (existing.display_name !== displayName || existing.source_song_name !== sourceSongName) fail(409, 'project_id_conflict', 'projectId already belongs to a different project');
      return {project:existing, created:false};
    }
    this.ctx.storage.sql.exec('INSERT INTO hope_projects (project_id, display_name, source_song_name, created_at, updated_at, version) VALUES (?, ?, ?, ?, ?, 1)', projectId, displayName, sourceSongName, now, now);
    return {project:this.getProject(projectId), created:true};
  }

  createTrack(input){
    const projectId = requireId(input.projectId, 'projectId');
    const trackId = requireId(input.trackId, 'trackId');
    const originalName = requireText(input.originalName, 'originalName');
    const logicTrackId = input.logicTrackId == null ? null : requireId(input.logicTrackId, 'logicTrackId');
    if (!one(this.ctx.storage.sql.exec('SELECT project_id FROM hope_projects WHERE project_id = ?', projectId))) fail(404, 'project_not_found', 'Project not found; create or explicitly map it first');
    const existing = one(this.ctx.storage.sql.exec('SELECT * FROM hope_tracks WHERE project_id = ? AND track_id = ?', projectId, trackId));
    if (existing){
      if (existing.original_name !== originalName || existing.logic_track_id !== logicTrackId) fail(409, 'track_id_conflict', 'trackId already belongs to a different track mapping');
      return {track:existing, created:false};
    }
    if (logicTrackId){
      const mapped = one(this.ctx.storage.sql.exec('SELECT * FROM hope_tracks WHERE project_id = ? AND logic_track_id = ?', projectId, logicTrackId));
      if (mapped) fail(409, 'logic_track_already_mapped', 'Logic track ID is already mapped in this project');
    }
    const now = new Date().toISOString();
    this.ctx.storage.sql.exec('INSERT INTO hope_tracks (project_id, track_id, logic_track_id, original_name, created_at) VALUES (?, ?, ?, ?, ?)', projectId, trackId, logicTrackId, originalName, now);
    this.ctx.storage.sql.exec('UPDATE hope_projects SET updated_at = ?, version = version + 1 WHERE project_id = ?', now, projectId);
    return {track:one(this.ctx.storage.sql.exec('SELECT * FROM hope_tracks WHERE project_id = ? AND track_id = ?', projectId, trackId)), created:true};
  }

  recordExport(input){
    const exportId = requireId(input.exportId, 'exportId');
    const projectId = requireId(input.projectId, 'projectId');
    const trackId = requireId(input.trackId, 'trackId');
    const contentHash = requireText(input.contentHash, 'contentHash').toLowerCase();
    if (!SHA256.test(contentHash)) fail(400, 'invalid_hash', 'contentHash must be a SHA-256 hex digest');
    const existing = one(this.ctx.storage.sql.exec('SELECT * FROM hope_exports WHERE export_id = ?', exportId));
    if (existing){
      if (existing.project_id !== projectId || existing.track_id !== trackId || existing.content_hash !== contentHash) fail(409, 'export_id_conflict', 'exportId already refers to different audio or mapping');
      return {export:{...existing, analysis:parseJson(existing.analysis_json)}, created:false};
    }
    if (!one(this.ctx.storage.sql.exec('SELECT track_id FROM hope_tracks WHERE project_id = ? AND track_id = ?', projectId, trackId))) fail(409, 'explicit_mapping_required', 'Map this export to an existing project and track before recording it');
    const songFolder = requireText(input.songFolder, 'songFolder');
    const originalFilename = requireText(input.originalFilename, 'originalFilename');
    const exportVersion = requireText(input.exportVersion, 'exportVersion');
    const exportedAt = input.exportedAt ? requireText(input.exportedAt, 'exportedAt', 64) : new Date().toISOString();
    this.ctx.storage.sql.exec('INSERT INTO hope_exports (export_id, project_id, track_id, song_folder, original_filename, content_hash, export_version, exported_at, analysis_json, analysis_revision) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 0)', exportId, projectId, trackId, songFolder, originalFilename, contentHash, exportVersion, exportedAt);
    this.ctx.storage.sql.exec('UPDATE hope_projects SET updated_at = ?, version = version + 1 WHERE project_id = ?', exportedAt, projectId);
    const version = one(this.ctx.storage.sql.exec('SELECT version FROM hope_projects WHERE project_id = ?', projectId)).version;
    const eventId = `${exportId}:audio-export`;
    this.ctx.storage.sql.exec('INSERT OR IGNORE INTO hope_events (event_id, project_id, event_type, occurred_at, source, persona_version, payload_json, project_version) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', eventId, projectId, 'audio_export', exportedAt, 'aimm', '1.0.0', JSON.stringify({exportId, trackId, contentHash, analysisRequired:true}), version);
    return {export:one(this.ctx.storage.sql.exec('SELECT * FROM hope_exports WHERE export_id = ?', exportId)), created:true};
  }

  saveAnalysis(input){
    const exportId = requireId(input.exportId, 'exportId');
    const contentHash = requireText(input.contentHash, 'contentHash').toLowerCase();
    if (!SHA256.test(contentHash)) fail(400, 'invalid_hash', 'contentHash must be a SHA-256 hex digest');
    const analysis = jsonObject(input.analysis, 'analysis');
    const existing = one(this.ctx.storage.sql.exec('SELECT * FROM hope_exports WHERE export_id = ?', exportId));
    if (!existing) fail(404, 'export_not_found', 'Export not found');
    if (existing.content_hash !== contentHash) fail(409, 'audio_changed', 'Export hash changed; record the new export and run fresh analysis');
    const nextRevision = existing.analysis_revision + 1;
    const now = new Date().toISOString();
    this.ctx.storage.sql.exec('UPDATE hope_exports SET analysis_json = ?, analysis_revision = ? WHERE export_id = ?', JSON.stringify(analysis), nextRevision, exportId);
    this.ctx.storage.sql.exec('UPDATE hope_projects SET updated_at = ?, version = version + 1 WHERE project_id = ?', now, existing.project_id);
    return {export:one(this.ctx.storage.sql.exec('SELECT * FROM hope_exports WHERE export_id = ?', exportId)), analysisRevision:nextRevision};
  }

  appendEvent(input){
    const eventId = requireId(input.eventId, 'eventId');
    const projectId = requireId(input.projectId, 'projectId');
    const eventType = requireText(input.eventType, 'eventType', 48);
    if (!EVENT_TYPES.has(eventType)) fail(400, 'invalid_event_type', 'Unsupported project event type');
    const payload = jsonObject(input.payload, 'payload');
    const source = requireText(input.source, 'source', 80);
    const personaVersion = requireText(input.personaVersion, 'personaVersion', 40);
    const prior = one(this.ctx.storage.sql.exec('SELECT * FROM hope_events WHERE event_id = ?', eventId));
    const payloadJson = JSON.stringify(payload);
    if (prior){
      if (prior.project_id !== projectId || prior.event_type !== eventType || prior.source !== source || prior.persona_version !== personaVersion || prior.payload_json !== payloadJson) fail(409, 'event_id_conflict', 'eventId was already used for different content');
      return {event:{...prior, payload:parseJson(prior.payload_json)}, duplicate:true};
    }
    if (!one(this.ctx.storage.sql.exec('SELECT project_id FROM hope_projects WHERE project_id = ?', projectId))) fail(404, 'project_not_found', 'Project not found; no filename-based project matching is performed');
    const occurredAt = input.occurredAt ? requireText(input.occurredAt, 'occurredAt', 64) : new Date().toISOString();
    this.ctx.storage.sql.exec('UPDATE hope_projects SET updated_at = ?, version = version + 1 WHERE project_id = ?', occurredAt, projectId);
    const projectVersion = one(this.ctx.storage.sql.exec('SELECT version FROM hope_projects WHERE project_id = ?', projectId)).version;
    this.ctx.storage.sql.exec('INSERT INTO hope_events (event_id, project_id, event_type, occurred_at, source, persona_version, payload_json, project_version) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', eventId, projectId, eventType, occurredAt, source, personaVersion, payloadJson, projectVersion);
    const event = one(this.ctx.storage.sql.exec('SELECT * FROM hope_events WHERE event_id = ?', eventId));
    return {event:{...event, payload}, duplicate:false};
  }

  setPreferences(input){
    const expectedVersion = Number(input.expectedVersion);
    if (!Number.isInteger(expectedVersion) || expectedVersion < 0) fail(400, 'version_required', 'expectedVersion is required for preference updates');
    const value = jsonObject(input.value, 'value');
    const current = one(this.ctx.storage.sql.exec('SELECT * FROM hope_preferences WHERE profile_id = ?', 'kevin'));
    const actualVersion = current ? current.version : 0;
    if (actualVersion !== expectedVersion) fail(409, 'version_conflict', `Preferences changed; expected version ${expectedVersion}, current version ${actualVersion}`);
    const nextVersion = actualVersion + 1;
    const updatedAt = new Date().toISOString();
    this.ctx.storage.sql.exec('INSERT INTO hope_preferences (profile_id, value_json, version, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(profile_id) DO UPDATE SET value_json = excluded.value_json, version = excluded.version, updated_at = excluded.updated_at', 'kevin', JSON.stringify(value), nextVersion, updatedAt);
    return {value, version:nextVersion, updatedAt};
  }

  updateInventoryItem(input){
    const itemId = requireId(input.itemId, 'itemId');
    const expectedVersion = Number(input.expectedVersion);
    if (!Number.isInteger(expectedVersion) || expectedVersion < 0) fail(400, 'version_required', 'expectedVersion is required for inventory updates');
    const value = jsonObject(input.value, 'value');
    const current = one(this.ctx.storage.sql.exec('SELECT * FROM hope_inventory WHERE item_id = ?', itemId));
    const actualVersion = current ? current.version : 0;
    if (actualVersion !== expectedVersion) fail(409, 'version_conflict', `Inventory changed; expected version ${expectedVersion}, current version ${actualVersion}`);
    const version = actualVersion + 1;
    const updatedAt = new Date().toISOString();
    this.ctx.storage.sql.exec('INSERT INTO hope_inventory (item_id, value_json, source_migration_id, version, updated_at) VALUES (?, ?, NULL, ?, ?) ON CONFLICT(item_id) DO UPDATE SET value_json = excluded.value_json, source_migration_id = NULL, version = excluded.version, updated_at = excluded.updated_at', itemId, JSON.stringify(value), version, updatedAt);
    return {id:itemId, value, version, updatedAt};
  }

  migrateInventory(input){
    const migrationId = requireId(input.migrationId, 'migrationId');
    const sourceFingerprint = requireText(input.sourceFingerprint, 'sourceFingerprint', 64).toLowerCase();
    if (!SHA256.test(sourceFingerprint)) fail(400, 'invalid_fingerprint', 'sourceFingerprint must be a SHA-256 hex digest');
    const sourceVersion = requireText(input.sourceVersion, 'sourceVersion', 80);
    if (!Array.isArray(input.items) || input.items.length > 2000) fail(400, 'invalid_inventory', 'items must be an array of at most 2000 entries');
    const prior = one(this.ctx.storage.sql.exec('SELECT * FROM hope_inventory_migrations WHERE migration_id = ?', migrationId));
    if (prior){
      if (prior.source_fingerprint !== sourceFingerprint) fail(409, 'migration_id_conflict', 'migrationId already refers to a different local snapshot');
      return {...parseJson(prior.receipt_json, {}), duplicate:true};
    }
    const snapshot = input.items.map(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) fail(400, 'invalid_inventory_item', 'Every inventory item must be an object');
      return {id:requireId(item.id, 'inventory item id'), value:jsonObject(item.value, 'inventory item value')};
    });
    const conflicts = [];
    const added = [];
    const now = new Date().toISOString();
    for (const item of snapshot){
      const existing = one(this.ctx.storage.sql.exec('SELECT item_id, value_json FROM hope_inventory WHERE item_id = ?', item.id));
      if (existing){
        if (existing.value_json !== JSON.stringify(item.value)) conflicts.push(item.id);
        continue;
      }
      this.ctx.storage.sql.exec('INSERT INTO hope_inventory (item_id, value_json, source_migration_id, version, updated_at) VALUES (?, ?, ?, 1, ?)', item.id, JSON.stringify(item.value), migrationId, now);
      added.push(item.id);
    }
    const receipt = {migrationId, sourceFingerprint, sourceVersion, added, conflicts, duplicate:false, recoverable:true};
    this.ctx.storage.sql.exec('INSERT INTO hope_inventory_migrations (migration_id, source_fingerprint, source_version, source_snapshot_json, receipt_json, created_at) VALUES (?, ?, ?, ?, ?, ?)', migrationId, sourceFingerprint, sourceVersion, JSON.stringify(snapshot), JSON.stringify(receipt), now);
    return receipt;
  }

  rollbackInventoryMigration(input){
    const migrationId = requireId(input.migrationId, 'migrationId');
    const migration = one(this.ctx.storage.sql.exec('SELECT * FROM hope_inventory_migrations WHERE migration_id = ?', migrationId));
    if (!migration) fail(404, 'migration_not_found', 'Inventory migration not found');
    const priorReceipt = parseJson(migration.receipt_json, {});
    if (priorReceipt.rolledBack) return {...priorReceipt, duplicate:true};
    const removed = [];
    const retained = [];
    for (const itemId of priorReceipt.added || []){
      const row = one(this.ctx.storage.sql.exec('SELECT version, source_migration_id FROM hope_inventory WHERE item_id = ?', itemId));
      if (row && row.source_migration_id === migrationId && row.version === 1){
        this.ctx.storage.sql.exec('DELETE FROM hope_inventory WHERE item_id = ?', itemId);
        removed.push(itemId);
      } else if (row) retained.push(itemId);
    }
    const receipt = {...priorReceipt, rolledBack:true, removed, retained};
    this.ctx.storage.sql.exec('UPDATE hope_inventory_migrations SET receipt_json = ? WHERE migration_id = ?', JSON.stringify(receipt), migrationId);
    return receipt;
  }
}

export { EVENT_TYPES, fail };
