import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const code=html.slice(html.indexOf('function pcCompanionRows('),html.indexOf('function invOpenProductActionMenu('));
const rows=[
  {id:'au-id',name:'FabFilter Pro-Q 3',vendor:'FabFilter',format:'AU',version:'3.22',path:'/Library/Audio/Plug-Ins/Components/Pro-Q.component',source:'companion'},
  {id:'vst-id',name:'FabFilter Pro-Q 3',vendor:'FabFilter',format:'VST3',version:'3.22',path:'/Users/kev/Library/Audio/Plug-Ins/VST3/Pro-Q.vst3',source:'companion'},
];
function harness(reply={}){
  const calls=[],dialogs=[],statuses=[];
  const context={
    INV_SCAN_ROWS:rows,pcCompanionConnected:true,pcCompanionActions:true,pcCompanionMoveNames:new Map(),
    invNorm:s=>String(s||'').toLowerCase(),invEsc:s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;'),
    pcCompanionFetch:async(path,options)=>{calls.push({path,options});return {ok:true,json:async()=>reply[path]??{}}},
    pcCompanionAdopt:inventory=>{context.INV_SCAN_ROWS=inventory.rows},
    invStatus:(message,kind)=>statuses.push({message,kind}),pcCompanionRender:()=>{},
    document:{getElementById:()=>null,createElement:()=>({}),body:{appendChild:()=>{}}},
    invTrapDialogFocus:()=>{},Date,Set,Map,JSON,
  };
  vm.runInNewContext(code+'\npcCompanionDialog=(title,body,actions,kind)=>{globalThis.dialogs.push({title,body,actions,kind});return {querySelectorAll:()=>[]}};globalThis.api={rows:pcCompanionRows,confirm:pcCompanionConfirm,action:pcCompanionAction,duplicates:pcCompanionOpenDuplicates,unused:pcCompanionOpenUnused};',Object.assign(context,{dialogs}));
  return {api:context.api,calls,dialogs,statuses,context};
}
test('menu actions require the explicit status capability and companion row IDs',()=>{
  assert.match(html,/pcCompanionActions=capability\?\.actions===true/);
  assert.match(html,/pcCompanionConnected&&pcCompanionActions&&pcCompanionRows\(context.vendor,context.name\).length\?row\('unuse'/);
  assert.match(html,/row\('trash','Move to Trash…'\)/);
  assert.match(html,/row\('reveal','Reveal in Finder'\)/);
  const h=harness();assert.deepEqual([...h.api.rows('FabFilter','FabFilter Pro-Q 3')].map(r=>r.id),['au-id','vst-id']);
});
test('menu enables action rows only when the companion advertises actions',()=>{
  const source=html.slice(html.indexOf('function invOpenProductActionMenu('),html.indexOf('function invTrapDialogFocus('));
  function menu(actions){
    let markup='';
    const element={style:{},set id(v){},setAttribute(){},getBoundingClientRect:()=>({width:272,height:580}),querySelector:()=>({focus(){},addEventListener(){}}),addEventListener(){},set innerHTML(value){markup=value}};
    const button={getAttribute:()=>JSON.stringify({name:'FabFilter Pro-Q 3',vendor:'FabFilter',version:'3.22',versions:['3.22']}),setAttribute(){},getBoundingClientRect:()=>({right:590,bottom:300,top:276})};
    const scope={pcCompanionConnected:true,pcCompanionActions:actions,INV_SCAN_ROWS:rows,pcCompanionRows:()=>rows,invCloseProductActionMenu(){},invGetProductActions:()=>({}),invSafeExternalUrl:()=>'',invEsc:s=>String(s??''),invNorm:s=>String(s||'').toLowerCase(),invProductMenu:null,invProductMenuTrigger:null,invActionKey:()=>'',document:{createElement:()=>element,body:{appendChild(){}},addEventListener(){}},window:{innerWidth:1100,innerHeight:900},setTimeout:()=>{}};
    vm.runInNewContext(source+';invOpenProductActionMenu(globalThis.trigger)',Object.assign(scope,{trigger:button}));
    return markup;
  }
  assert.match(menu(true),/data-inv-action="unuse"/);
  assert.match(menu(true),/data-inv-action="trash"/);
  assert.doesNotMatch(menu(false),/data-inv-action="unuse"/);
  assert.match(menu(false),/Requires native Companion actions/);
});
test('confirmation uses system admin wording only for system plug-in paths',()=>{
  const h=harness();h.api.confirm('unuse',rows);assert.match(h.dialogs[0].title,/Move 2 plug-ins to Unused/);assert.match(h.dialogs[0].body,/administrator password/);
  h.api.confirm('trash',[rows[1]]);assert.equal(h.dialogs[1].title,'Move 1 plug-in to Trash?');assert.doesNotMatch(h.dialogs[1].body,/administrator password/);assert.match(h.dialogs[1].body,/macOS Trash/);
  h.api.confirm('unuse',[rows[1]]);assert.equal(h.dialogs[2].title,'Move 1 plug-in to Unused?');
  h.api.confirm('trash',rows);assert.equal(h.dialogs[3].title,'Move 2 plug-ins to Trash?');
});
test('action posts IDs only and shows individual failure reasons',async()=>{
  const h=harness({'/action/unuse':{results:[{id:'au-id',ok:false,reason:'administrator approval cancelled'}],inventory:{rows:[]}}});
  await h.api.action('unuse',['au-id','au-id']);
  assert.deepEqual(JSON.parse(h.calls[0].options.body),{ids:['au-id']});assert.equal(h.calls[0].options.targetAddressSpace,undefined);
  assert.match(h.statuses[0].message,/administrator approval cancelled/);
});
test('duplicates renders actionable and review groups, plus empty side-by-side note',async()=>{
  const group={name:'Pro-Q',format:'VST3',needsReview:false,items:[{path:'/new',version:'3.0',keep:true,rowIds:['new']},{path:'/old',version:'2.0',keep:false,rowIds:['old']}]};
  const review={name:'Tie',format:'AU',needsReview:true,items:[{path:'/tie',version:'1.0',keep:false,rowIds:['tie']}]};
  const h=harness({'/duplicates':{groups:[group,review],sideBySideVersions:[]}});await h.api.duplicates();
  assert.match(h.dialogs[0].body,/Move to Unused/);assert.match(h.dialogs[0].body,/Check manually/);
  assert.equal(h.dialogs[0].actions[1].label,'Keep newest, move 1 others to Unused');
  const empty=harness({'/duplicates':{groups:[],sideBySideVersions:[{family:'WaveShell',items:[]}]}});await empty.api.duplicates();
  assert.match(empty.dialogs[0].body,/No duplicates found on this Mac/);assert.match(empty.dialogs[0].body,/Installed side by side on purpose/);assert.match(empty.dialogs[0].body,/WaveShell/);
});
test('unused renders entries and restores with moveIds',async()=>{
  const h=harness({'/unused':[{moveId:'move-1',name:'Pro-Q',format:'AU',version:'3.22',originalPath:'/Library/Audio/Plug-Ins/Components',movedAt:'2026-11-20T10:00:00Z'}],'/action/restore':{results:[{id:'move-1',ok:true}],inventory:{rows:[]}}});
  await h.api.unused();assert.match(h.dialogs[0].body,/from \/Library\/Audio\/Plug-Ins\/Components/);
  await h.dialogs[0].actions[1].run({remove:()=>{}});
  assert.deepEqual(JSON.parse(h.calls.find(c=>c.path==='/action/restore').options.body),{moveIds:['move-1']});
});
