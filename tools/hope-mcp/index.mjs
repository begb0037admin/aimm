import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { hopeLogicControlStatus } from './logic-control-status.mjs';

const API_BASE = (process.env.AIMM_PROXY_URL || 'https://aimm-proxy.kevinlelitte.workers.dev').replace(/\/+$/, '');

async function api(path, {method='GET', body} = {}){
  const token = process.env.HOPE_STT_TOKEN;
  if (!token) throw new Error('HOPE_STT_TOKEN is unavailable in the MCP process environment.');
  const response = await fetch(API_BASE + path, {
    method,
    headers: {'Authorization':`Bearer ${token}`, ...(body ? {'Content-Type':'application/json'} : {})},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; }
  catch { data = {error:text || `HTTP ${response.status}`}; }
  if (!response.ok) throw new Error(`${data.error || 'Hope state request failed'} (${response.status}${data.code ? `, ${data.code}` : ''})`);
  return data;
}

function result(value){
  return {content:[{type:'text', text:JSON.stringify(value, null, 2)}]};
}
function guarded(work){
  return async args => {
    try { return result(await work(args)); }
    catch (error){ return {isError:true, content:[{type:'text', text:error instanceof Error ? error.message : String(error)}]}; }
  };
}

const server = new McpServer({name:'hope-aimm', version:'1.0.0'});
const id = z.string().min(1).max(128);
const payload = z.record(z.string(), z.unknown());

server.tool('hope_get_context', 'Read Hope preferences, owned-plugin inventory, project summaries, and the selected project checkpoint.', {
  project_id:id.optional(), limit:z.number().int().min(1).max(100).optional(),
}, guarded(({project_id, limit}) => {
  const query = new URLSearchParams();
  if (project_id) query.set('project_id', project_id);
  if (limit) query.set('limit', String(limit));
  return api('/hope/state/context' + (query.size ? `?${query}` : ''));
}));

server.tool('hope_list_projects', 'Find project summaries by exact display or source-song name. Multiple matches are returned as ambiguous; choose an explicit project ID.', {
  name:z.string().max(500).optional(),
}, guarded(({name}) => {
  const query = new URLSearchParams();
  if (name) query.set('name', name);
  return api('/hope/state/projects' + (query.size ? `?${query}` : ''));
}));

server.tool('hope_create_project', 'Create an explicitly identified Logic/AIMM project. Never use a filename as the project ID.', {
  project_id:id, display_name:z.string().min(1).max(500), source_song_name:z.string().min(1).max(500),
}, guarded(({project_id, display_name, source_song_name}) => api('/hope/state/projects', {
  method:'POST', body:{projectId:project_id, displayName:display_name, sourceSongName:source_song_name},
})));

server.tool('hope_map_track', 'Map a source Logic track to an explicit track ID within an explicit project.', {
  project_id:id, track_id:id, logic_track_id:id.optional(), original_name:z.string().min(1).max(500),
}, guarded(({project_id, track_id, logic_track_id, original_name}) => api('/hope/state/tracks', {
  method:'POST', body:{projectId:project_id, trackId:track_id, logicTrackId:logic_track_id, originalName:original_name},
})));

server.tool('hope_record_stem_export', 'Record an exported stem with explicit project/track mapping, source filename, export version, and SHA-256. A changed hash creates a new export and requires fresh analysis.', {
  export_id:id, project_id:id, track_id:id, song_folder:z.string().min(1).max(500),
  original_filename:z.string().min(1).max(1000), content_hash:z.string().regex(/^[a-f0-9]{64}$/i),
  export_version:z.string().min(1).max(80), exported_at:z.string().max(64).optional(),
}, guarded(({export_id, project_id, track_id, song_folder, original_filename, content_hash, export_version, exported_at}) => api('/hope/state/exports', {
  method:'POST', body:{exportId:export_id, projectId:project_id, trackId:track_id, songFolder:song_folder, originalFilename:original_filename, contentHash:content_hash, exportVersion:export_version, exportedAt:exported_at},
})));

server.tool('hope_record_analysis', 'Attach fresh AIMM stem analysis to the exact export hash. The service rejects stale analysis when the audio hash has changed.', {
  export_id:id, content_hash:z.string().regex(/^[a-f0-9]{64}$/i), analysis:payload,
}, guarded(({export_id, content_hash, analysis}) => api('/hope/state/analysis', {
  method:'POST', body:{exportId:export_id, contentHash:content_hash, analysis},
})));

server.tool('hope_record_event', 'Append an idempotent project event. Keep observations, recommendations, attempted and verified actions, measurements, listening feedback, and next actions distinct.', {
  event_id:id, project_id:id,
  event_type:z.enum(['observation','recommendation','action_attempted','action_verified','measurement','listening_feedback','next_action','audio_export','analysis_completed','mapping_confirmed']),
  source:z.enum(['codex','aimm_typed','aimm_voice','logic_control','user']),
  persona_version:z.string().min(1).max(40), payload, occurred_at:z.string().max(64).optional(),
}, guarded(({event_id, project_id, event_type, source, persona_version, payload, occurred_at}) => api('/hope/state/events', {
  method:'POST', body:{eventId:event_id, projectId:project_id, eventType:event_type, source, personaVersion:persona_version, payload, occurredAt:occurred_at},
})));

server.tool('hope_set_preferences', 'Update shared Hope preferences with optimistic version checking. Read the current version first; on conflict, reload and merge instead of overwriting.', {
  expected_version:z.number().int().min(0), value:payload,
}, guarded(({expected_version, value}) => api('/hope/state/preferences', {
  method:'PUT', body:{expectedVersion:expected_version, value},
})));

server.tool('hope_update_inventory_item', 'Create or update one shared inventory item using optimistic version checking. A successful edit detaches it from any older import, so rolling back that migration preserves the edit.', {
  item_id:id, expected_version:z.number().int().min(0), value:payload,
}, guarded(({item_id, expected_version, value}) => api('/hope/state/inventory/item', {
  method:'PUT', body:{itemId:item_id, expectedVersion:expected_version, value},
})));

server.tool('hope_migrate_local_inventory', 'Explicitly import a snapshot of custom local plugin inventory. The migration is idempotent, preserves existing shared edits, and stores a recoverable snapshot.', {
  migration_id:id, source_fingerprint:z.string().regex(/^[a-f0-9]{64}$/i), source_version:z.string().min(1).max(80),
  items:z.array(z.object({id, value:payload})).max(2000),
}, guarded(({migration_id, source_fingerprint, source_version, items}) => api('/hope/state/inventory/migrate', {
  method:'POST', body:{migrationId:migration_id, sourceFingerprint:source_fingerprint, sourceVersion:source_version, items},
})));

server.tool('hope_rollback_inventory_migration', 'Roll back an inventory migration while retaining any imported entries that have since been edited.', {
  migration_id:id,
}, guarded(({migration_id}) => api('/hope/state/inventory/rollback', {
  method:'POST', body:{migrationId:migration_id},
})));

server.tool('hope_logic_control_status', 'Check whether this environment has a verified Logic Pro control provider. This tool never simulates a Logic action.', {}, async () => result(hopeLogicControlStatus()));

await server.connect(new StdioServerTransport());
