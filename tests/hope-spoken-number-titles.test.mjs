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

const spokenQuestion = "What's the main EQ mistake in the video, the number one EQ mistake ruining your sound?";
const digitQuestion = "What's the main EQ mistake in the video, the number 1 EQ mistake ruining your sound?";

function makeContext() {
  const context = vm.createContext({
    kbIndex,
    HOPE_KB_STATE: 'unchecked',
    HOPE_WEB_REQUESTED: false,
    HOPE_KB_DECISION: { question: '', usable: false, searched: false, results: [], garbled: false }
  });
  vm.runInContext(helperSource, context);
  vm.runInContext(`function normalizeKbCandidate(c, semanticOnly = false) {
    return { video_id:c.video_id, title:c.title, channel:c.channel, chunk:Number(c.chunk), text:String(c.x || c.text || ''), _semanticOnly:semanticOnly };
  }
  KB_SEARCH_CHUNKS = kbIndex.map(c => ({ ...c, _tk: kbSearchTok(c.x) }));
  KB_SEARCH_DF = {};
  let total = 0;
  KB_SEARCH_CHUNKS.forEach(c => { total += c._tk.length; new Set(c._tk).forEach(w => { KB_SEARCH_DF[w] = (KB_SEARCH_DF[w] || 0) + 1; }); });
  KB_SEARCH_AVGDL = total / KB_SEARCH_CHUNKS.length;`, context);
  vm.runInContext(decisionSource, context);
  return context;
}

test('N1 spoken number in the exact live question matches the real #1 EQ title', () => {
  const context = makeContext();
  context.HOPE_KB_DECISION = { question: spokenQuestion };
  assert.equal(vm.runInContext('kbNamedTitleMatch(HOPE_KB_DECISION.question)', context)?.video_id, '5QDXc8s6GgM');
});

test('N2 digit number in the live question still matches the real #1 EQ title', () => {
  const context = makeContext();
  context.HOPE_KB_DECISION = { question: digitQuestion };
  assert.equal(vm.runInContext('kbNamedTitleMatch(HOPE_KB_DECISION.question)', context)?.video_id, '5QDXc8s6GgM');
});

test('N3 title words must not match inside longer words', () => {
  const context = makeContext();
  vm.runInContext(`KB_SEARCH_CHUNKS = ${JSON.stringify([{ video_id: 'synthetic', title: 'Reverb Tricks Pros Use' }])};`, context);
  vm.runInContext(`HOPE_KB_DECISION = ${JSON.stringify({ question: 'reverb tricks pros users' })};`, context);
  assert.equal(vm.runInContext('kbNamedTitleMatch(HOPE_KB_DECISION.question)', context), null);
});

test('N4 ordinal word matches a digit title when the title is in the index', () => {
  const context = makeContext();
  vm.runInContext(`KB_SEARCH_CHUNKS = ${JSON.stringify([{ video_id: 'synthetic-first-tip', title: 'The 1 Tip Every Mixer Needs' }])};`, context);
  vm.runInContext(`HOPE_KB_DECISION = ${JSON.stringify({ question: 'What does the video The first tip every mixer needs say?' })};`, context);
  assert.equal(vm.runInContext('kbNamedTitleMatch(HOPE_KB_DECISION.question)', context)?.video_id, 'synthetic-first-tip');
});

test('N6 all supported cardinal and ordinal words normalize to their digits', () => {
  const context = makeContext();
  assert.equal(
    vm.runInContext(`kbNormalizeTitleText('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty first second third fourth fifth sixth seventh eighth ninth tenth number 1')`, context),
    '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 1 2 3 4 5 6 7 8 9 10 1'
  );
});

test('N5 spoken-number live question selects the named video through the decision path', () => {
  const context = makeContext();
  context.HOPE_KB_DECISION = { question: spokenQuestion, usable: false, searched: false, results: [], garbled: false };
  const query = vm.runInContext('kbBuildHopeRetrievalQuery(HOPE_KB_DECISION.question, "")', context);
  const hits = vm.runInContext(`kbSearchRetrieve(${JSON.stringify(query)}, 25)`, context)
    .map(c => ({ video_id: c.video_id, title: c.title, channel: c.channel, chunk: c.chunk, text: c.x }))
    .slice(0, 6);
  context.rankedHits = hits;
  const promoted = vm.runInContext(`kbPromoteNamedVideo(HOPE_KB_DECISION.question, ${JSON.stringify(query)}, rankedHits, 6)`, context);
  context.hits = { results: promoted };
  const decision = vm.runInContext(`hopeKnowledgeDecision({tool:'search_yt_knowledge',result:hits})`, context);
  assert.equal(decision.vagueVideo, null);
  assert.equal(decision.results[0]?.video_id, '5QDXc8s6GgM');
});
