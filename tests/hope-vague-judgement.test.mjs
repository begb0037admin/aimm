import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const kbIndex = JSON.parse(await readFile(new URL('../docs/knowledge/kb-search-index.json', import.meta.url), 'utf8'));
const helperStart = html.indexOf('const KB_SEARCH_STOP =');
const helperEnd = html.indexOf('function kbFetchJsonWithTimeout(', helperStart);
const decisionStart = html.indexOf('function hopeWebSearchRequested(');
const decisionEnd = html.indexOf('function hopeShowGarbledRepeat(', decisionStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'KB retrieval helpers are present');
assert.ok(decisionStart >= 0 && decisionEnd > decisionStart, 'shared Hope decision path is present');
const helperSource = html.slice(helperStart, helperEnd);
const decisionSource = html.slice(decisionStart, decisionEnd);
const question = "What's the main EQ mistake in the video?";
function makeContext() {
  const context = vm.createContext({ kbIndex, HOPE_KB_STATE:'unchecked', HOPE_WEB_REQUESTED:false, HOPE_KB_DECISION:{question:'',usable:false,searched:false,results:[],garbled:false} });
  vm.runInContext(helperSource, context);
  vm.runInContext(`function normalizeKbCandidate(c, semanticOnly = false) { return {video_id:c.video_id,title:c.title,channel:c.channel,chunk:Number(c.chunk),text:String(c.x||c.text||''),_semanticOnly:semanticOnly}; }`, context);
  vm.runInContext(`KB_SEARCH_CHUNKS=kbIndex.map(c=>({...c,_tk:kbSearchTok(c.x)})); KB_SEARCH_DF={}; let total=0; KB_SEARCH_CHUNKS.forEach(c=>{total+=c._tk.length;new Set(c._tk).forEach(w=>{KB_SEARCH_DF[w]=(KB_SEARCH_DF[w]||0)+1;});}); KB_SEARCH_AVGDL=total/KB_SEARCH_CHUNKS.length;`, context);
  vm.runInContext(decisionSource, context); return context;
}
function sharedSearch() {
  const context=makeContext(); context.HOPE_KB_DECISION={question,usable:false,searched:false,results:[],garbled:false};
  const query=vm.runInContext(`kbBuildHopeRetrievalQuery(HOPE_KB_DECISION.question,'')`,context);
  const results=vm.runInContext(`kbSearchRetrieve(${JSON.stringify(query)},25)`,context).map(c=>({video_id:c.video_id,title:c.title,channel:c.channel,chunk:c.chunk,text:c.x})).slice(0,6);
  context.rankedHits=results;
  const promoted=vm.runInContext(`kbPromoteNamedVideo(HOPE_KB_DECISION.question,${JSON.stringify(query)},rankedHits,6)`,context);
  context.hits={results:promoted}; const decision=vm.runInContext(`hopeKnowledgeDecision({tool:'search_yt_knowledge',result:hits})`,context);
 return {context,decision,query};
}
function stubReply(run,reply) { run.context.stubReply=reply; return vm.runInContext(`typeof hopeVagueVideoApplyModelReply==='function' ? hopeVagueVideoApplyModelReply(HOPE_KB_DECISION.vagueVideo,stubReply) : HOPE_KB_DECISION.vagueVideo`,run.context); }
function quoteSixWords(text) { return (String(text||'').match(/[A-Za-z0-9']+/g)||[]).slice(0,6).join(' '); }
test('J1 model recommendation selects a listed real-index candidate through the shared path',()=>{
 const run=sharedSearch(),vague=run.decision.vagueVideo; assert.ok(vague&&vague.candidates.length>=2,'candidate list came from shared search path');
 assert.ok(vague.candidates.every(c=>kbIndex.some(row=>row.video_id===c.video_id&&row.title===c.title&&row.channel===c.channel)),'candidate titles and channels come from real index');
 assert.ok(vague.candidates.every(c=>c.text.length<=480),'each candidate transcript is capped');
 const compactVague={...vague,candidates:vague.candidates.map(({text,...candidate})=>candidate)};
 const queryEcho=run.query.length>300?run.query.slice(0,299)+'…':run.query;
 assert.ok(JSON.stringify({query:queryEcho,results_returned:vague.candidates.length,results:vague.candidates,vague_video:compactVague}).length<=4000,'full shared tool result stays within the existing 4000-character budget');
 const pick=vague.candidates[1],resolved=stubReply(run,`I'd go with '${pick.title}' because it explains how the EQ mistake affects a mix.`);
 assert.ok(vague.candidates.some(c=>c.video_id===resolved.chosen),'model pick is one of the listed candidates'); assert.equal(resolved.chosen,pick.video_id);
 assert.match(resolved.spokenRecommendation,new RegExp(pick.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
});
test('J2 stub reason is an original explanation, not a quoted transcript excerpt',()=>{
 const run=sharedSearch(),vague=run.decision.vagueVideo,pick=vague.candidates[0]; const reply=`I'd go with '${pick.title}' because it explains how to find and cut the frequencies that muddy a mix.`;
 const resolved=stubReply(run,reply); assert.equal(resolved.spokenRecommendation,reply); assert.equal(resolved.reason,'it explains how to find and cut the frequencies that muddy a mix');
});
test('J3 transcript quote is rejected and replaced with the exact fallback reason',()=>{
 const run=sharedSearch(),vague=run.decision.vagueVideo,pick=vague.candidates[0],phrase=quoteSixWords(pick.text);
 assert.equal((phrase.match(/[A-Za-z0-9']+/g)||[]).length,6,'stub phrase has six words');
 const resolved=stubReply(run,`I'd go with '${pick.title}' because the transcript says, “${phrase}”.`);
 assert.equal(resolved.reason,"it's the closest match to your question.");
 assert.equal(resolved.spokenRecommendation,`I'd go with '${vague.candidates[0].title}' because it's the closest match to your question.`);
});
test('J4 no candidate named uses closest score and exact fallback reason',()=>{
 const run=sharedSearch(),resolved=stubReply(run,'This video covers useful EQ ideas.'); assert.equal(resolved.chosen,run.decision.vagueVideo.candidates[0].video_id); assert.equal(resolved.reason,"it's the closest match to your question.");
});
test('J5 non-vague question has no list or recommendation',()=>{
 const context=makeContext(); context.HOPE_KB_DECISION={question:'How do I tighten the low end on a kick drum?',usable:false,searched:false,results:[],garbled:false};
 const query=vm.runInContext(`kbBuildHopeRetrievalQuery(HOPE_KB_DECISION.question,'')`,context),results=vm.runInContext(`kbSearchRetrieve(${JSON.stringify(query)},25)`,context).slice(0,6).map(c=>({video_id:c.video_id,title:c.title,channel:c.channel,chunk:c.chunk,text:c.x}));
 context.hits={results}; const decision=vm.runInContext(`hopeKnowledgeDecision({tool:'search_yt_knowledge',result:hits})`,context); assert.equal(decision.vagueVideo,null); assert.equal(decision.action,'answer_from_kb');
});
test('J6 named-title question uses the named video with no vague list',()=>{
 const context=makeContext(); context.HOPE_KB_DECISION={question:"What's the main EQ mistake in the video 'The #1 EQ Mistake Ruining Your Sound'?",usable:false,searched:false,results:[],garbled:false};
 const query=vm.runInContext(`kbBuildHopeRetrievalQuery(HOPE_KB_DECISION.question,'')`,context),ranked=vm.runInContext(`kbSearchRetrieve(${JSON.stringify(query)},25)`,context).slice(0,6).map(c=>({video_id:c.video_id,title:c.title,channel:c.channel,chunk:c.chunk,text:c.x}));
 context.ranked=ranked; const results=vm.runInContext(`kbPromoteNamedVideo(HOPE_KB_DECISION.question,${JSON.stringify(query)},ranked,6)`,context); context.hits={results}; const decision=vm.runInContext(`hopeKnowledgeDecision({tool:'search_yt_knowledge',result:hits})`,context); assert.equal(decision.vagueVideo,null); assert.equal(decision.results[0]?.video_id,'5QDXc8s6GgM');
});
