import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
function arrayAfter(marker){
  const start=source.indexOf(marker);
  if(start<0)throw Error('Missing '+marker);
  const first=source.indexOf('[',start+marker.length-1),last=source.indexOf('\n];',first);
  if(first<0||last<0)throw Error('Unterminated '+marker);
  return vm.runInNewContext(source.slice(first,last+2));
}
export const pageTools=[...arrayAfter('const TOOL_DEFS='),...arrayAfter('const AICHAT_TOOLS =').filter(t=>!arrayAfter('const TOOL_DEFS=').some(x=>x.name===t.name)).map(t=>({name:t.name,description:t.description,parameters:t.input_schema}))].map(t=>({name:t.name,description:t.description,parameters:JSON.parse(JSON.stringify(t.parameters))}));
export const agentToolNames=pageTools.filter(t=>t.name!=='research').map(t=>t.name);
export const newToolNames=['snapshots_list','snapshots_read','snapshots_apply','snapshots_add_note','plugin_tags_read','plugin_tag_set','hidden_list','plugin_hide','reference_status','saved_targets_list','saved_target_apply','mixbus_load_preset','mixbus_auto_fill','settings_status'];
export const sourceText=source;
