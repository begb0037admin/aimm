import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const licence=require('../standalone/assets/uad-licence.js');
const data=JSON.parse(readFileSync(new URL('../standalone/assets/uad-licence.json',import.meta.url),'utf8'));
const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const scan=JSON.parse(readFileSync('/Users/admin/aimm-previews/inventory-scan.json','utf8'));

test('account map contains only public product fields and keeps all 62 accounts',()=>{
  assert.equal(data.version,1);
  assert.equal(data.accounts.length,62);
  for(const entry of data.accounts){
    assert.deepEqual(Object.keys(entry).sort(),['account_name','confidence','scanned_names']);
    assert.ok(['certain','probable','unsure'].includes(entry.confidence));
    assert.ok(Array.isArray(entry.scanned_names));
  }
  assert.doesNotMatch(JSON.stringify(data),/@|email|address|Kevin|Lelitte/i);
});

test('normalised UAD names classify licensed and unlicensed while unsure candidates stay visible',()=>{
  const owned=data.accounts.find(entry=>entry.scanned_names.length>0);
  assert.equal(licence.licensed('  '+owned.scanned_names[0].toUpperCase()+'  ','Universal Audio',data),true);
  assert.equal(licence.licensed('UAD Some Unowned Product','Universal Audio',data),false);
  assert.equal(licence.licensed('Other Product','Other Vendor',data),true);
  const unsure={accounts:[{account_name:'Candidate',scanned_names:['UAD Maybe Mine'],confidence:'unsure'}]};
  assert.equal(licence.licensed('uad maybe mine','Universal Audio',unsure),true);
  assert.equal(licence.licensed('UAD Something Else','Universal Audio',unsure),false);
});

test('scan product split excludes unlicensed from owned counts and local override restores it',()=>{
  const groups=[...new Map(scan.rows.filter(row=>row.vendor==='Universal Audio').map(row=>[row.name,{name:row.name,vendor:row.vendor}])).values()];
  const result=licence.split(groups,data);
  assert.equal(result.owned.length,56);
  assert.equal(result.notLicensed.length,169);
  const item=result.notLicensed[0];
  const corrected=licence.split(groups,data,group=>group.name===item.name);
  assert.equal(corrected.owned.length,57);
  assert.equal(corrected.notLicensed.length,168);
  assert.match(html,/treatAsLicensed:true/);
  assert.match(html,/invWriteProductActions\(actions\)/);
  assert.match(html,/function hopeInventoryGroups\(\)\{\s*return invUadSplit\(invBuildGroups\(INV_SCAN_ROWS\)\)\.owned/);
  assert.match(html,/uad_installed_not_licensed:/);
});

test('not-licensed view and sidebar derive products from the full grouped scan',()=>{
  const mockScan=[
    {name:'UAD Unknown Compressor',vendor:'Universal Audio',format:'AU'},
    {name:'UAD Unknown Compressor',vendor:'Universal Audio',format:'VST3'},
    {name:'UAD Unknown Reverb',vendor:'Universal Audio',format:'AU'},
    {name:'Other Compressor',vendor:'Other Vendor',format:'AU'}
  ];
  const groups=[...new Map(mockScan.map(row=>[licence.norm(row.vendor)+'|'+licence.norm(row.name),{name:row.name,vendor:row.vendor}])).values()];
  const view=licence.split(groups,{accounts:[]}).notLicensed;
  assert.equal(view.length,2);
  assert.deepEqual(view.map(group=>group.name),['UAD Unknown Compressor','UAD Unknown Reverb']);
  assert.match(html,/const allGroups=invBuildGroups\(rows\);[\s\S]*?invRenderSidebar\(allGroups,stageMap\);/);
  assert.match(html,/const split=invUadSplit\(groups\);groups=split\.owned;\s*const notLicensedCount=split\.notLicensed\.length;/);
  assert.match(html,/const items=split\.notLicensed\.filter\(/);
  assert.match(html,/data-uad-override/);
});
