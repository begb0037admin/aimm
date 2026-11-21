import {readFileSync} from 'node:fs';
import {agentToolNames} from './hope-tool-catalog.mjs';
const path=process.argv[2];
if(!path){console.error('Usage: node scripts/hope-tool-sync.mjs live-agent-tools.json');process.exit(2);}
const value=JSON.parse(readFileSync(path,'utf8'));
const items=Array.isArray(value)?value:Array.isArray(value.tools)?value.tools:[];
const live=new Set(items.map(x=>typeof x==='string'?x:x?.tool_config?.name||x?.name).filter(Boolean));
const expected=new Set(agentToolNames);
const missing=[...expected].filter(x=>!live.has(x)).sort();
const extra=[...live].filter(x=>!expected.has(x)).sort();
console.log(JSON.stringify({expected:expected.size,live:live.size,missing,extra},null,2));
if(missing.length||extra.length)process.exitCode=1;
