import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const inventoryNames=[...new Set([...html.slice(html.indexOf('const TOOL_DEFS=['),html.indexOf('function buildContextSummary()')).matchAll(/name:'(inventory_[^']+)'/g)].map(match=>match[1]))];
const expected=['inventory_set_favorite','inventory_summary','inventory_status','inventory_duplicates','inventory_unused','inventory_reveal','inventory_move_to_unused','inventory_restore','inventory_move_to_trash','inventory_rescan','inventory_mark_vendor_app_checked','inventory_unmark_vendor_check','inventory_keep_newest_duplicates','inventory_navigate','inventory_search','inventory_add_to_bus'];

function sourceBetween(start,end){
  const from=html.indexOf(start),to=html.indexOf(end,from);
  assert.ok(from>=0&&to>from,`missing source: ${start}`);
  return html.slice(from,to);
}

test('both Hope routes expose and dispatch every inventory tool from the shared catalogue',async()=>{
  assert.deepEqual([...inventoryNames].sort(),[...expected].sort());
  const mapping=sourceBetween('const AICHAT_TOOL_DEFS =','async function executeAichatTool(');
  const selection=sourceBetween('function hopeUsageSelectTools(','function hopeUsageLunaSearchFee(');
  const executor=sourceBetween('async function hopeUsageExecuteLunaCall(','function hopeUsageStatus(');
  const calls=[];
  const ctx=vm.createContext({
    TOOL_DEFS:inventoryNames.map(name=>({name,description:name,parameters:{type:'object',properties:{}}})),
    HOPE_KB_DECISION:{question:'how many plug-ins do I have?'},
    hopeKnowledgeDecision:()=>({allow:true}),
    handleToolCall:async(name,args)=>{calls.push({name,args});return {ok:true,name};},
  });
  vm.runInContext(mapping+selection+executor,ctx);
  const chat=vm.runInContext('AICHAT_TOOL_DEFS.map(tool=>tool.name)',ctx);
  const luna=vm.runInContext('hopeUsageSelectTools("how many plug-ins do I have?").map(tool=>tool.name)',ctx);
  for(const name of expected){
    assert.ok(chat.includes(name),`typed chat missing ${name}`);
    assert.ok(luna.includes(name),`Luna route missing ${name}`);
    const response=await vm.runInContext(`hopeUsageExecuteLunaCall({name:${JSON.stringify(name)},arguments:'{}'})`,ctx);
    assert.equal(response.result.name,name);
  }
  assert.deepEqual(calls.map(call=>call.name),expected);
});

test('installed scan guidance cannot use MixBus counts and requires confirmation',()=>{
  const inventory=sourceBetween('const HOPE_INVENTORY_RULES =','const HOPE_USAGE_SYSTEM =');
  const rt=sourceBetween('AIMM PLUG-IN INVENTORY:','\n',);
  for(const rules of [inventory,rt]){
    assert.match(rules,/MixBus library\/catalogue/);
    assert.match(rules,/Plugin Companion scan/);
    assert.match(rules,/how many plug-ins/);
    assert.match(rules,/Never answer these questions from MixBus catalogue numbers and never guess a number/);
    assert.match(rules,/Plugins tab has no scan loaded and the companion may not be connected/);
    assert.match(rules,/confirmed false first/);
    assert.match(rules,/clear yes/);
    assert.match(rules,/confirmed true/);
    assert.match(rules,/Trash needs a separate yes/);
  }
  assert.match(sourceBetween('const HOPE_USAGE_SYSTEM =','function hopeUsageSelectTools('),/For installed-plug-in questions, use the inventory tools/);
  assert.match(html,/=== MIXBUS CATALOGUE \(\$\{all.length\} recommendations — NOT AN INSTALLED COUNT\) ===/);
  assert.match(html,/mixbus_catalogue_size:allPlugins\(\)\.length/);
  assert.match(html,/const AIMM_BUILD = '2026-11-23\.54'/);
});
