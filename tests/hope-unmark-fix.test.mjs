import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const catalogs=['../standalone/assets/hope-tools-manifest.json','../new-hope-tools.json','../elevenlabs-client-tools.json'].map(path=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8')));
const start=html.indexOf("      case 'unmark_fix_applied':{");
const end=html.indexOf("      default:throw new Error('Unknown tool: '+name);",start);
assert.ok(start>0&&end>start);
const source=`async function run(name,args){switch(name){${html.slice(start,end)}}}`;

test('undo tool schema and walkthrough are present in each catalogue',()=>{
  for(const catalog of catalogs){
    const tool=catalog.find(x=>x.name==='unmark_fix_applied');
    assert.ok(tool);
    assert.deepEqual(tool.parameters,{type:'object',properties:{id:{type:'string',description:'Optional Fix Queue id such as "#01". Omit to reopen the most recently marked-done fix.'}},required:[]});
  }
  assert.equal((html.match(/UNDO: When Kev says 'undo that'/g)||[]).length,2);
  assert.match(html,/remove_plugin_from_bus, or use clear_plugin_settings[\s\S]*?call unmark_fix_applied/);
  assert.match(html,/Never undo without Kev asking/);
});

test('undo tool reopens the latest done fix through the queue API',async()=>{
  const items=[{id:'#01',title:'First'},{id:'#02',title:'Second'}];
  const done=new Set(['#02','#01']);
  const calls=[];
  const queue={
    list:()=>items,
    status:id=>done.has(id)?'done':'pending',
    mostRecentlyApplied:()=>items.find(it=>it.id===[...done].at(-1))||null,
    unmarkApplied:id=>{calls.push(id);return done.delete(id);}
  };
  const context={window:{mcFixQueue:queue},buildSelectedStemAnalysisState:()=>false};
  vm.runInNewContext(`${source}\nglobalThis.run=run;`,context);
  const latest=await context.run('unmark_fix_applied',{});
  assert.equal(latest.ok,true);
  assert.equal(latest.reopened_fix.id,'#01');
  assert.equal(latest.reopened_fix.title,'First');
  assert.deepEqual(calls,['#01']);
  const explicit=await context.run('unmark_fix_applied',{id:'#02'});
  assert.equal(explicit.reopened_fix.id,'#02');
  await assert.rejects(context.run('unmark_fix_applied',{}),/No fix is marked done/);
  await assert.rejects(context.run('unmark_fix_applied',{id:'#01'}),/not marked done/);
});
