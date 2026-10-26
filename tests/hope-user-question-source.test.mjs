import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const kbIndex = JSON.parse(await readFile(new URL('../docs/knowledge/kb-search-index.json', import.meta.url), 'utf8'));
const helperStart = html.indexOf('const KB_SEARCH_STOP =');
const helperEnd = html.indexOf('function kbFetchJsonWithTimeout(', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'KB retrieval helpers are present');
const kbSource = html.slice(helperStart, helperEnd);
const searchStart = html.indexOf("case 'search_yt_knowledge':{");
const searchEnd = html.indexOf("case 'read_yt_knowledge':{", searchStart);
const searchSource = html.slice(searchStart, searchEnd);

function makeContext() {
  const context = vm.createContext({ kbIndex });
  vm.runInContext(kbSource, context);
  vm.runInContext(`function normalizeKbCandidate(c, semanticOnly = false) {
    return { video_id:c.video_id, title:c.title, channel:c.channel, chunk:Number(c.chunk), text:String(c.x || c.text || ''), _semanticOnly:semanticOnly };
  }
  KB_SEARCH_CHUNKS = kbIndex.map(c => ({ ...c, _tk: kbSearchTok(c.x) }));
  KB_SEARCH_DF = {};
  let total = 0;
  KB_SEARCH_CHUNKS.forEach(c => { total += c._tk.length; new Set(c._tk).forEach(w => { KB_SEARCH_DF[w] = (KB_SEARCH_DF[w] || 0) + 1; }); });
  KB_SEARCH_AVGDL = total / KB_SEARCH_CHUNKS.length;`, context);
  return context;
}

function sharedSearch(liveQuestion, modelQuery, context) {
  context.HOPE_KB_DECISION = { question: liveQuestion };
  context.retrievalInput = '';
  return vm.runInContext(`(() => {
    const query = kbBuildHopeRetrievalQuery(HOPE_KB_DECISION.question, ${JSON.stringify(modelQuery)});
    retrievalInput = query;
    const bm25 = kbSearchRetrieve(query, 25).map(c => normalizeKbCandidate(c, false));
    return kbPromoteNamedVideo(HOPE_KB_DECISION.question, query, bm25, 6);
  })()`, context);
}

const eqQuestion = "What's the main EQ mistake in the video 'The #1 EQ Mistake Ruining Your Sound'?";
const eqCurlyQuestion = 'What’s the main EQ mistake in the video “The #1 EQ Mistake Ruining Your Sound”?';

for (const [label, question] of [['straight quotes', eqQuestion], ['curly quotes', eqCurlyQuestion]]) {
  test(`T1 ${label}: named video is first and is the read choice`, () => {
    const context = makeContext();
    const results = sharedSearch(question, 'EQ mistake', context);
    assert.equal(results[0]?.video_id, '5QDXc8s6GgM');
    const readChoice = results[0]?.video_id;
    assert.equal(readChoice, '5QDXc8s6GgM');
  });
}

test('T2 a second real KB title from another channel is promoted', () => {
  const namedChannel = kbIndex.find(c => c.video_id === '5QDXc8s6GgM')?.channel;
  const first = kbIndex.find(c => c.title && c.video_id !== '5QDXc8s6GgM' && c.channel !== namedChannel);
  assert.ok(first);
  const term = String(first.x || '').match(/[a-z]{5,}/i)?.[0];
  assert.ok(term);
  const question = `What does the video '${first.title}' say about ${term}?`;
  const context = makeContext();
  const results = sharedSearch(question, 'mixing video', context);
  assert.equal(results[0]?.video_id, first.video_id);
});

test('T3 how-to retrieval includes the live question and returns a real indexed result', () => {
  const question = 'How do I tighten the low end on a kick drum?';
  const context = makeContext();
  const results = sharedSearch(question, 'kick', context);
  assert.match(context.retrievalInput, /tighten/i);
  assert.match(context.retrievalInput, /low end/i);
  assert.ok(kbIndex.some(c => c.video_id === results[0]?.video_id), 'top result comes from the real KB index');
});

test('T4 factual retrieval includes live terms and does not promote a named video', () => {
  const question = 'What does sidechain compression actually do to the bass?';
  const context = makeContext();
  const results = sharedSearch(question, 'sidechain', context);
  assert.match(context.retrievalInput, /actually/i);
  assert.match(context.retrievalInput, /bass/i);
  assert.equal(vm.runInContext('kbNamedTitleMatch(HOPE_KB_DECISION.question)', context), null);
  assert.ok(kbIndex.some(c => c.video_id === results[0]?.video_id));
});

test('T5 retrieval preserves a name dropped from the model query', () => {
  const context = makeContext();
  sharedSearch('What does Jaycen Joshua do on the vocal bus?', 'vocal bus', context);
  assert.match(context.retrievalInput, /Jaycen Joshua/i);
});

test('T6 Luna prompt follows the shared decision for named and vague video references', () => {
  const prompt = html.match(/const HOPE_USAGE_SYSTEM = `([^`]+)`;/)?.[1] || '';
  assert.match(prompt, /If Kev names a video title, read that video; for an unnamed video reference, use the shared vague-video candidate list, choose one candidate based on its title, channel, and transcript content, and explain in one sentence in your own words what that video covers; never quote or copy the transcript/);
});

test('T7 Luna, typed and Agent routes use the same handler and one query builder', () => {
  assert.equal((html.match(/function kbBuildHopeRetrievalQuery\(/g) || []).length, 1);
  assert.match(searchSource, /kbBuildHopeRetrievalQuery\(HOPE_KB_DECISION\.question, args\.query\)/);
  assert.match(searchSource, /kbSearchRetrieve\(query, 25\)/);
  assert.match(searchSource, /kbRerank\(\s*query,/);
  assert.match(searchSource, /kbPromoteNamedVideo\(HOPE_KB_DECISION\.question, query,/);
  assert.match(html, /const result=await handleToolCall\(call\.name,args\)/);
  assert.match(html, /let result;try\{result=await handleToolCall\(name,args\);/);
  assert.match(html, /clientTools\[toolName\] = async \(args\) =>[\s\S]{0,1000}handleToolCall\(toolName, args \|\| \{\}\)/);
});

test('B1 named title match requires word boundaries', () => {
  const context = makeContext();
  vm.runInContext(`KB_SEARCH_CHUNKS = ${JSON.stringify([{ video_id: 'synthetic', title: 'Reverb Tricks Pros Use' }])};`, context);
  vm.runInContext(`HOPE_KB_DECISION = ${JSON.stringify({ question: 'What are the reverb tricks pros users rely on?' })};`, context);
  assert.equal(vm.runInContext('kbNamedTitleMatch(HOPE_KB_DECISION.question)', context), null);
});

for (const [label, question] of [['straight quotes', eqQuestion], ['curly quotes', eqCurlyQuestion]]) {
  test(`B2 ${label} exact live question matches the real KB title`, () => {
    const context = makeContext();
    context.HOPE_KB_DECISION = { question };
    assert.equal(vm.runInContext('kbNamedTitleMatch(HOPE_KB_DECISION.question)', context)?.video_id, '5QDXc8s6GgM');
  });
}
