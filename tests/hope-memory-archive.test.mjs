import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const section=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
function setup(facts, reply='{"merges":[],"core_ids":[]}'){
  const data=new Map(); let calls=0, saves=0;
  data.set('token','yes');
  const ctx=vm.createContext({
    STATE:{profileFacts:facts,profile:''},PROFILE_CORE_MAX_FACTS:15,PROFILE_MAX_LEN:1500,
    PROFILE_MIGRATION_KEY:'migration',PROFILE_BACKUP_KEY:'backup',HOPE_STT_TOKEN_STORAGE:'token',
    PROFILE_CATEGORIES:[{id:'misc',label:'Misc'}],TextEncoder,Date,console,
    localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},
    isMeaningfulFactText:t=>typeof t==='string' && t.length>=3,
    newFactId:()=>`merged-${Math.random()}`,saveState:async()=>{saves++;return true},
    renderHopeMemory(){},setProfileStatus(){},aimmAiText:async()=>{calls++;return reply}
  });
  vm.runInContext(section('function profileCoreFacts(', '// ----- Status pill'),ctx);
  return {ctx,data,get calls(){return calls},get saves(){return saves}};
}
const fact=(id,text,pinned=false)=>({id,text,category:'misc',tier:'core',active:true,pinned,ts:100});
test('consolidation preserves every fact, merges originals into archive, and protects pins',async()=>{
  const facts=Array.from({length:17},(_,i)=>fact('f'+i,'Durable preference '+i,i===0));
  const env=setup(facts,JSON.stringify({merges:[{ids:['f1','f2'],text:'Combined durable preference',category:'misc'}],core_ids:['f0',...Array.from({length:13},(_,i)=>'f'+(i+3))]}));
  await env.ctx.consolidateProfileFacts();
  assert.equal(env.calls,1);
  assert.equal(env.ctx.STATE.profileFacts.length,18);
  assert.equal(env.ctx.profileCoreFacts().length,15);
  assert.equal(env.ctx.STATE.profileFacts.find(f=>f.id==='f0').tier,'core');
  const merged=env.ctx.STATE.profileFacts.find(f=>f.id==='f1').merged_into;
  assert.equal(env.ctx.STATE.profileFacts.find(f=>f.id==='f2').merged_into,merged);
  assert.equal(env.ctx.STATE.profileFacts.find(f=>f.id===merged).tier,'core');
  assert.ok(env.ctx.buildProfileDigest().length>0);
});
test('migration backs up once, retries without a token, and sets version after save',async()=>{
  const env=setup([fact('a','Durable preference')]);
  env.data.delete('token');
  await env.ctx.migrateProfileFacts();
  assert.equal(env.data.has('backup'),false);
  env.data.set('token','yes');
  await env.ctx.migrateProfileFacts();
  assert.deepEqual(JSON.parse(env.data.get('backup')).facts.map(f=>f.id),['a']);
  assert.equal(env.data.get('migration'),'1');
  const saves=env.saves;
  await env.ctx.migrateProfileFacts();
  assert.equal(env.saves,saves);
});
test('archive search ranks terms and marks returned facts as used',()=>{
  const env=setup([
    {...fact('a','Prefers dry vocals'),tier:'archive'},
    {...fact('b','Prefers deep 808 bass'),tier:'archive'},
    {...fact('c','Prefers soft vocal reverb'),tier:'archive'}
  ]);
  const hits=env.ctx.memorySearch('dry vocal',2);
  assert.equal(hits[0].text,'Prefers dry vocals');
  assert.equal(hits.length,2);
  assert.ok(env.ctx.STATE.profileFacts[0].lastUsed);
  assert.equal(env.ctx.profileArchiveCount(),3);
});
test('core digest is capped by count and UTF-8 bytes',()=>{
  const env=setup(Array.from({length:20},(_,i)=>fact('f'+i,'Preference '+i+' '+ 'é'.repeat(100))));
  const digest=env.ctx.buildProfileDigest();
  assert.ok(new TextEncoder().encode(digest).length<=1500);
  assert.ok((digest.match(/^- /gm)||[]).length<=15);
});
test('bad consolidation output leaves facts unmerged',async()=>{
  const env=setup(Array.from({length:16},(_,i)=>fact('f'+i,'Preference '+i)),'not JSON');
  await assert.rejects(env.ctx.consolidateProfileFacts());
  assert.equal(env.ctx.STATE.profileFacts.length,16);
  assert.equal(env.ctx.STATE.profileFacts.filter(f=>f.merged_into).length,0);
});
