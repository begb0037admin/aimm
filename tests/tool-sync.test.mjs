import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {pageTools,agentToolNames,newToolNames,sourceText} from '../scripts/hope-tool-catalog.mjs';
const manifest=JSON.parse(readFileSync(new URL('../standalone/assets/hope-tools-manifest.json',import.meta.url),'utf8'));
const names=pageTools.map(t=>t.name);
test('manifest exactly tracks page tool names and schemas',()=>{
  assert.equal(new Set(names).size,names.length);
  assert.deepEqual(manifest,pageTools);
});
test('typed and Luna routes derive their catalogues from page tools',()=>{
  assert.match(sourceText,/const AICHAT_TOOL_DEFS = TOOL_DEFS\.map/);
  assert.match(sourceText,/return AICHAT_TOOL_DEFS\.filter/);
  assert.match(sourceText,/for \(const def of TOOL_DEFS\)/);
  assert.match(sourceText,/tools:TOOL_DEFS/);
});
test('agent tool list and shared handler cover every non-retired page tool',()=>{
  assert.deepEqual(agentToolNames,names.filter(n=>n!=='research'));
  assert.match(sourceText,/const AIMM_AGENT_TOOL_NAMES = TOOL_DEFS\.filter/);
  const start=sourceText.indexOf('async function handleToolCall(name,args)'),end=sourceText.indexOf('const RT_INSTRUCTIONS=',start);
  const handler=sourceText.slice(start,end);
  for(const name of names){
    if(['list_symptom_tiles','add_symptom_tile','delete_symptom_tile'].includes(name))assert.ok(handler.includes("name === '"+name+"'"),name);
    else assert.ok(handler.includes("case '"+name+"':"),name+' missing from handleToolCall');
  }
  const list=sourceText.slice(sourceText.indexOf('const AIMM_NEW_AGENT_TOOLS ='),sourceText.indexOf(';',sourceText.indexOf('const AIMM_NEW_AGENT_TOOLS =')));
  for(const name of newToolNames)assert.ok(list.includes("'"+name+"'"),name+' missing from registration list');
});
test('Playlist tool definitions agree across the page and all exports',()=>{
  const names=['open_library_channel','show_library_picks','add_videos_to_library','add_video_to_library'];
  const docs=readFileSync(new URL('../docs/HOPE_PLUGIN_TOOLS.md',import.meta.url),'utf8');
  for(const path of ['../elevenlabs-client-tools.json','../new-hope-tools.json']){
    const catalog=JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
    for(const name of names){
      const {type,...tool}=catalog.find(tool=>tool.name===name);
      assert.deepEqual(tool,pageTools.find(tool=>tool.name===name));
      assert.ok(docs.includes('`'+name+'('),name);
    }
  }
  const description=pageTools.find(tool=>tool.name==='add_video_to_library').description;
  assert.match(description,/clear instruction to add it is enough/);
  assert.match(description,/unprompted offer.*read_video_transcript and sharing the findings/);
});

test('channel guidance and metadata stay aligned',()=>{
  const tool=pageTools.find(t=>t.name==='open_library_channel');
  assert.match(tool.description,/spoken name/);
  assert.match(sourceText,/Never ask for a link or handle/);
  assert.match(sourceText,/mentioning an alternative if confidence is not high/);
  for(const field of ['resolved_channel','confidence','alternatives','source','complete','total_videos','note']) assert.ok(sourceText.includes(field),field);
});
