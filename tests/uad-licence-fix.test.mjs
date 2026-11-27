import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const licence=createRequire(import.meta.url)('../standalone/assets/uad-licence.js');
const data=JSON.parse(readFileSync(new URL('../standalone/assets/uad-licence.json',import.meta.url),'utf8'));
const forms=name=>[
  {name, vendor:'Universal Audio',format:'AU'},
  {name:'Universal Audio: '+name,vendor:'uaudio',format:'VST2'},
  {name:'Universal Audio: '+name,vendor:'uaudio',format:'VST2'},
  {name,vendor:'uaudio',format:'VST3'}
];
const fixture=[...forms('UAD Little Labs VOG'),...forms('UAD Little Labs IBP')];

test('all real VOG and IBP scan forms are not licensed',()=>{
  for(const row of fixture) assert.equal(licence.licensed(row.name,row.vendor,data),false,JSON.stringify(row));
});
test('owned product remains licensed in every scan form and with prefix spacing',()=>{
  for(const row of forms('UAD API 2500')) assert.equal(licence.licensed(row.name,row.vendor,data),true,JSON.stringify(row));
  assert.equal(licence.licensed('  universal   AUDIO :  UAD API 2500','Other',data),true);
  assert.equal(licence.licensed(' Universal Audio : UAD Unknown','Other',data),false);
});
test('missing licence data fails safe and manual override still works',()=>{
  for(const row of fixture) {
    assert.equal(licence.licensed(row.name,row.vendor,null),false);
    assert.equal(licence.licensed(row.name,row.vendor,null,true),true);
    assert.equal(licence.licensed(row.name,row.vendor,data,true),true);
  }
  assert.equal(licence.licensed('Other plug-in','Other vendor',null),true);
  assert.equal(licence.split(fixture,null).notLicensed.length,8);
});
test('real scan keeps previously licensed UAD rows and excludes unmatched uaudio rows', {skip:!existsSync('/tmp/inv.json')},()=>{
  const rows=JSON.parse(readFileSync('/tmp/inv.json','utf8')).rows;
  const oldNorm=licence.norm;
  const oldNames=new Set(data.accounts.filter(x=>['certain','probable','unsure'].includes(x.confidence)).flatMap(x=>x.scanned_names).map(oldNorm));
  const names=licence.names(data);
  let priorOwned=0, checkedNewForms=0;
  for(const row of rows){
    const oldUad=/^uad(?:x)?\b/i.test(String(row.name||''))||oldNorm(row.vendor)==='universal audio';
    if(oldUad&&oldNames.has(oldNorm(row.name))) {
      priorOwned++;
      assert.equal(licence.licensed(row.name,row.vendor,data),true,JSON.stringify(row));
    }
    if(oldNorm(row.vendor)==='uaudio'||/^\s*universal\s+audio\s*:/i.test(row.name||'')){
      checkedNewForms++;
      const stripped=oldNorm(String(row.name||'').replace(/^\s*universal\s+audio\s*:\s*/i,''));
      assert.equal(licence.licensed(row.name,row.vendor,data),names.has(stripped),JSON.stringify(row));
    }
  }
  assert.ok(priorOwned>0, 'scan contains previously licensed UAD rows');
  assert.ok(checkedNewForms>0, 'scan contains uaudio or prefixed rows');
});

test('Hope and Luna prompts include the installed and licence rules',()=>{
  const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
  const rule="Only say Kev has an installed plug-in if inventory_search returned it. UAD plug-ins that are installed but not licensed are not his: say 'installed but not licensed', never recommend them, and offer an owned alternative.";
  for(const name of ['HOPE_INVENTORY_RULES','HOPE_COVERAGE_RULES']){
    const text=html.match(new RegExp('const '+name+' = `([^`]*)`'))?.[1];
    assert.ok(text?.includes(rule),name);
  }
  assert.match(html,/UAD_LICENCE_DATA=await response\.json\(\);invRenderInventory\(\)/);
});
