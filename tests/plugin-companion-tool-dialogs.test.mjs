import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const tools=readFileSync(new URL('../standalone/assets/standalone-tools.js',import.meta.url),'utf8');
const init=html.slice(html.indexOf('function invInit(){'),html.indexOf('function invInit(){')+500);

function clickTool(tool,connected){
  const dialogs=[];
  const button={dataset:{},listeners:[],getAttribute:name=>name==='data-inv-local-tool'?tool:null,addEventListener(type,listener){if(type==='click')this.listeners.push(listener);},click(){this.listeners.forEach(listener=>listener());}};
  const document={readyState:'complete',activeElement:null,head:{appendChild(){}},body:{appendChild(element){if(element.id==='aimmLocalToolOverlay')dialogs.push({kind:'local',tool});}},createElement:()=>({addEventListener(){},querySelector:selector=>selector==='[data-tool-close]'?{focus(){}}:{innerHTML:''}}),querySelectorAll:selector=>selector==='[data-inv-local-tool]'?[button]:[]};
  const context={document,window:{},pcCompanionConnected:connected,pcCompanionActions:connected,INV_SYNTHETIC_PREVIEW:false,INV_SCAN_ROWS:[],
    pcCompanionDialog:(title,body)=>{dialogs.push({kind:'companion',title,body});return {remove(){}};},
    pcCompanionOpenDuplicates:()=>dialogs.push({kind:'companion',title:'Duplicates'}),
    pcCompanionOpenUnused:()=>dialogs.push({kind:'companion',title:'Unused'}),
  };
  vm.runInNewContext(tools,context);
  button.click();
  return dialogs;
}

test('each Tools click opens one dialog with and without the actions-capable companion',()=>{
  assert.doesNotMatch(init,/data-inv-local-tool="(?:unused|duplicates)"/);
  for(const tool of ['unused','duplicates']){
    const connected=clickTool(tool,true);
    assert.equal(connected.length,1,tool+' connected');
    assert.equal(connected[0].kind,'companion');
    const disconnected=clickTool(tool,false);
    assert.equal(disconnected.length,1,tool+' disconnected');
    assert.equal(disconnected[0].kind,tool==='unused'?'companion':'local');
    if(tool==='unused')assert.match(disconnected[0].body,/Connect the Plugin Companion in Settings to see plug-ins moved to Unused\./);
    else assert.equal(disconnected[0].tool,'duplicates');
  }
});
