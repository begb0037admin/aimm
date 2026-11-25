import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const start=html.indexOf("      case 'skip_fix':{");
const end=html.indexOf("      case 'unmark_fix_applied':{",start);
const source=`async function run(args){switch('skip_fix'){${html.slice(start,end)}}}`;
test('skip_fix schema matches every catalogue',()=>{
  for(const path of ['../standalone/assets/hope-tools-manifest.json','../elevenlabs-client-tools.json','../new-hope-tools.json']){
    const catalog=JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
    const tool=catalog.find(x=>x.name==='skip_fix');assert.ok(tool,path);
    assert.deepEqual(tool.parameters,{type:'object',properties:{id:{type:'string',description:'Optional Fix Queue id such as #01. Omit to skip the current fix or restore the most recently skipped fix.'},restore:{type:'boolean',description:'True to restore a skipped fix to waiting.'}},required:[]});
  }
  assert.match(html,/if he still declines, call skip_fix/);
  assert.match(html,/restore:true to reopen it/);
});
test('skip_fix dismisses current and restores a named skipped fix',async()=>{
  const items=[{id:'#01',title:'First'},{id:'#02',title:'Second'}],states=new Map(items.map(x=>[x.id,'pending']));
  const queue={list:()=>items,current:()=>items.find(x=>states.get(x.id)==='pending')||null,selected:()=>items[1],mostRecentlyDismissed:()=>items.find(x=>states.get(x.id)==='dismissed')||null,status:id=>states.get(id),dismiss:id=>{states.set(id,'dismissed');return true},restore:id=>{states.set(id,'pending');return true}};
  const ctx={window:{mcFixQueue:queue},buildSelectedStemAnalysisState:()=>false};vm.runInNewContext(`${source}\nglobalThis.run=run;`,ctx);
  const skipped=await ctx.run({});assert.equal(skipped.skipped_fix.id,'#01');assert.equal(skipped.next_fix.id,'#02');
  const restored=await ctx.run({restore:true});assert.equal(restored.restored_fix.id,'#01');assert.equal(states.get('#01'),'pending');
  await assert.rejects(ctx.run({id:'#02',restore:true}),/not skipped/);
});
