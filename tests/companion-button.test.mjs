import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const section=id=>html.split(`<div class="settings-section" id="${id}">`)[1].split('<div class="settings-section"')[0];
const element=()=>({hidden:false,disabled:false,textContent:'',attributes:{},setAttribute(k,v){this.attributes[k]=v;}});

test('each companion card has one button and a hidden live status',()=>{
  for(const [card,status] of [['settingsAudioReference','mcSpotifyCompanionConnectionStatus'],['settingsPluginCompanion','pcCompanionConnectionStatus']]){
    const markup=section(card);
    assert.equal((markup.match(/<button\b/g)||[]).length,1);
    assert.match(markup,new RegExp(`id="${status}" hidden role="status" aria-live="polite"`));
  }
  assert.match(html, /button\[data-connected="true"\]\{background:var\(--gteal\)/);
  assert.doesNotMatch(html, /#elKeySave,#rtKeySave,\.settings-companion-connect-row button/);
});

test('audio button follows connection and busy states',()=>{
  const code=html.split('function mcSpotifyRenderCompanionAccess(){')[1].split('function mcSpotifyStartCompanionPolling()')[0];
  const row=element(),button=element(),status=element();
  const context={document:{getElementById:id=>({mcSpotifyCompanionConnectRow:row,mcSpotifyCompanionConnect:button,mcSpotifyCompanionConnectionStatus:status})[id]},mcSpotifyCompanionConnected:false,mcSpotifyCompanionConnectBusy:false};
  vm.runInNewContext('function render(){'+code+';globalThis.render=render;',context);
  for(const connected of [false,true]){
    context.mcSpotifyCompanionConnected=connected;context.mcSpotifyCompanionConnectBusy=connected;context.render();
    assert.equal(row.hidden,false);assert.equal(button.textContent,connected?'Connected':'Connect');
    assert.equal(button.attributes['data-connected'],String(connected));assert.equal(button.disabled,connected);
    assert.equal(button.attributes['aria-label'],`Audio reference companion ${connected?'connected':'disconnected'}`);
  }
});

test('plugin button follows connection and busy states',()=>{
  const code=html.split('function pcCompanionRender(state,message){')[1].split('function pcCompanionAdopt(')[0];
  const button=element(),status=element(),label=element(),scan=element();
  const context={document:{getElementById:id=>({pcCompanionConnect:button,pcCompanionSettingsStatus:status,pcCompanionConnectionStatus:label,invScanBtn:scan})[id]},pcCompanionBusy:false,pcCompanionConnected:false,INV_SCAN_ACTIVE:false,INV_ROOTS:[]};
  vm.runInNewContext('function render(state,message){'+code+';globalThis.render=render;',context);
  for(const connected of [false,true]){
    context.pcCompanionConnected=connected;context.pcCompanionBusy=connected;context.render(connected?'Connected':'Disconnected','');
    assert.equal(button.textContent,connected?'Connected':'Connect');assert.equal(button.attributes['data-connected'],String(connected));assert.equal(button.disabled,connected);
    assert.equal(button.attributes['aria-label'],`Plugin companion ${connected?'connected':'disconnected'}`);
  }
});
