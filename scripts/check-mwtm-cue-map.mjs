import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(import.meta.dirname,'..');
const manifestPath=process.argv[2]||'/private/tmp/claude-501/-Users-admin/4cafa38d-7fc9-40a3-adf8-57b3affa9715/scratchpad/ingest/manifest.json';
const kb=JSON.parse(readFileSync(resolve(root,'docs/knowledge/index.json'),'utf8')).videos.filter(row=>row.video_id?.startsWith('mwtm-'));
const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
const context=vm.createContext({});
vm.runInContext(readFileSync(resolve(root,'standalone/assets/mwtm-cue-map.js'),'utf8'),context);
const recordings=manifest.map(row=>({...row,video_id:row.id}));
const missing=kb.filter(row=>!context.MwtmCueMap.resolve(row.video_id,recordings,row.title));
console.log(`MWTM KB IDs: ${kb.length}; private recordings: ${manifest.length}; mapped: ${kb.length-missing.length}; unmapped: ${missing.length}`);
for(const row of missing)console.log(`UNMAPPED ${row.video_id} | ${row.title}`);
if(missing.length)process.exitCode=1;
