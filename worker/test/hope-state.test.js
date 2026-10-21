import { env } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';
import worker from '../src/index.js';

let sequence=0;
async function state(path, {method='GET',body,auth='test-only-hope-token'}={}){
  const request=new Request(`https://aimm-proxy.test/hope/state/${path}`,{
    method,
    headers:{...(auth?{Authorization:`Bearer ${auth}`} : {}),...(body?{'Content-Type':'application/json'}:{})},
    body:body?JSON.stringify(body):undefined,
  });
  const response=await worker.fetch(request,env);
  return {status:response.status,body:await response.json()};
}
async function call(path, options){
  const result=await state(path,options);
  if(result.status>=400)throw Object.assign(new Error(result.body.error),{code:result.body.code,status:result.status});
  return result.body;
}
async function createProject(displayName){
  const id=`project-${++sequence}`;
  await call('projects',{method:'POST',body:{projectId:id,displayName,sourceSongName:displayName}});
  return id;
}
async function createTrack(projectId, trackId, logicTrackId, originalName){
  return call('tracks',{method:'POST',body:{projectId,trackId,logicTrackId,originalName}});
}
function exportInput(exportId, projectId, trackId, contentHash){
  return {exportId,projectId,trackId,songFolder:'Song',originalFilename:'stem.wav',contentHash,exportVersion:'v1'};
}

describe('Hope shared state',()=>{
  it('requires bearer authentication before exposing the state service',async()=>{
    const response=await state('context',{auth:''});
    expect(response.status).toBe(401);
    expect(response.body.code).toBe('unauthorized');
  });

  it('keeps similarly named projects separate and requires an explicit mapping',async()=>{
    const a=await createProject('Same Song'), b=await createProject('Same Song');
    const found=await call('projects?name=Same%20Song');
    expect(found.projects).toHaveLength(2);
    expect(found.ambiguous).toBe(true);
    const unmapped=await state('exports',{method:'POST',body:exportInput('unmapped',a,'track-x','a'.repeat(64))});
    expect(unmapped.status).toBe(409);
    expect(unmapped.body.code).toBe('explicit_mapping_required');
    await createTrack(a,'track-a','logic-1','Vocals');
    await createTrack(b,'track-b','logic-1','Vocals');
    const [projectA,projectB]=await Promise.all([call(`context?project_id=${a}`),call(`context?project_id=${b}`)]);
    expect(projectA.project.tracks[0].track_id).toBe('track-a');
    expect(projectB.project.tracks[0].track_id).toBe('track-b');
  });

  it('keeps append-only events idempotent and serializes concurrent project versions',async()=>{
    const id=await createProject('Event project');
    const event=(eventId)=>({eventId,projectId:id,eventType:'observation',source:'codex',personaVersion:'1.0.0',payload:{eventId}});
    expect((await call('events',{method:'POST',body:event('same')})).duplicate).toBe(false);
    expect((await call('events',{method:'POST',body:event('same')})).duplicate).toBe(true);
    await Promise.all(Array.from({length:12},(_,i)=>call('events',{method:'POST',body:event(`evt-${i}`)})));
    const result=await call(`context?project_id=${id}`);
    expect(result.project.version).toBe(14);
    expect(result.events).toHaveLength(13);
  });

  it('keeps analysis attached to its exact export hash',async()=>{
    const projectId=await createProject('Audio project');
    await createTrack(projectId,'vox','logic-v','Vocals');
    const oldHash='a'.repeat(64), newHash='b'.repeat(64);
    await call('exports',{method:'POST',body:exportInput('exp-old',projectId,'vox',oldHash)});
    await call('analysis',{method:'POST',body:{exportId:'exp-old',contentHash:oldHash,analysis:{lufs:-18}}});
    await call('exports',{method:'POST',body:exportInput('exp-new',projectId,'vox',newHash)});
    const stale=await state('analysis',{method:'POST',body:{exportId:'exp-old',contentHash:newHash,analysis:{lufs:-10}}});
    expect(stale.status).toBe(409);
    expect(stale.body.code).toBe('audio_changed');
    const project=await call(`context?project_id=${projectId}`);
    expect(project.project.exports.find(item=>item.export_id==='exp-old').analysis).toEqual({lufs:-18});
    expect(project.project.exports.find(item=>item.export_id==='exp-new').analysis).toBeNull();
  });

  it('makes inventory import idempotent and rollback keeps later edits',async()=>{
    const fingerprint='c'.repeat(64);
    const input={migrationId:`migration-${++sequence}`,sourceFingerprint:fingerprint,sourceVersion:'build-1',items:[{id:`plugins-${sequence}`,value:{names:['A']}}]};
    const first=await call('inventory/migrate',{method:'POST',body:input});
    expect(first.added).toEqual([`plugins-${sequence}`]);
    expect((await call('inventory/migrate',{method:'POST',body:input})).duplicate).toBe(true);
    await call('inventory/item',{method:'PUT',body:{itemId:`plugins-${sequence}`,expectedVersion:1,value:{names:['A','B']}}});
    const rollback=await call('inventory/rollback',{method:'POST',body:{migrationId:input.migrationId}});
    expect(rollback.retained).toEqual([`plugins-${sequence}`]);
    const context=await call('context');
    expect(context.inventory.find(item=>item.id===`plugins-${sequence}`).names).toEqual(['A','B']);
    const stale=await state('inventory/item',{method:'PUT',body:{itemId:`plugins-${sequence}`,expectedVersion:1,value:{names:[]}}});
    expect(stale.status).toBe(409);
    expect(stale.body.code).toBe('version_conflict');
  });

  it('rejects stale shared preference writes',async()=>{
    await call('preferences',{method:'PUT',body:{expectedVersion:0,value:{tone:'concise'}}});
    const stale=await state('preferences',{method:'PUT',body:{expectedVersion:0,value:{tone:'verbose'}}});
    expect(stale.status).toBe(409);
    expect(stale.body.code).toBe('version_conflict');
  });

  it('keeps Logic control unavailable unless a verified provider exists',async()=>{
    const {hopeLogicControlStatus}=await import('../../tools/hope-mcp/logic-control-status.mjs');
    expect(hopeLogicControlStatus()).toMatchObject({available:false});
  });
});
