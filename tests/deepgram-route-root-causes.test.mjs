import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const normalizerStart = html.indexOf('function kbNormalizeTitleText(');
const normalizerEnd = html.indexOf('function kbBuildHopeRetrievalQuery(', normalizerStart);
assert.ok(normalizerStart >= 0 && normalizerEnd > normalizerStart, 'shared KB title normalizer exists');
const decisionStart = html.indexOf('function hopeWebSearchRequested(');
const decisionEnd = html.indexOf('function hopeShowGarbledRepeat(', decisionStart);
const helperStart = html.indexOf('function hopeUsageSelectTools(');
const helperEnd = html.indexOf('function hopeUsageStatus(', helperStart);
const streamStart = html.indexOf('async function hopeUsageReadLunaStream(');
const streamEnd = html.indexOf('async function hopeUsageExecuteLunaCall(', streamStart);
assert.ok(decisionStart >= 0 && decisionEnd > decisionStart && helperStart >= 0 && helperEnd > helperStart && streamEnd > streamStart, 'shared Hope decision and Luna stream helpers exist');
const sharedSource = `let HOPE_KB_STATE='unchecked';let HOPE_WEB_REQUESTED=false;let HOPE_KB_DECISION={question:'',usable:false,searched:false,results:[],garbled:false};const HOPE_USAGE_VOICE={};\n${html.slice(normalizerStart, normalizerEnd)}\n${html.slice(decisionStart, decisionEnd)}\n${html.slice(streamStart,streamEnd)}\n${html.slice(helperStart,helperEnd)}`;

function context(extra = {}) {
  const ctx = vm.createContext({
    HOPE_KB_STATE: 'unchecked', HOPE_WEB_REQUESTED: false,
    AICHAT_TOOL_DEFS: [
      { name: 'search_yt_knowledge' }, { name: 'read_yt_knowledge' }, { name: 'research' }, { name: 'get_context' }
    ], TOOL_DEFS: [{ name: 'search_yt_knowledge' }, { name: 'research' }, { name: 'get_context' }],
    toolCalls: [], handleToolCall: async (name, args) => { ctx.toolCalls.push({ name, args }); return { results: [] }; },
    fetch: async () => ({ ok: true, json: async () => ({ answer: 'Stubbed web answer' }) }),
    ...extra
  });
  vm.runInContext(sharedSource, ctx);
  return ctx;
}

function assertNoLegacyGarbleWordList() {
  const start = html.indexOf('function hopeTranscriptLooksGarbled(');
  const end = html.indexOf('\nfunction hopeQuestionNeedsKnowledge', start);
  assert.ok(start >= 0 && end > start, 'garble rule exists');
  assert.doesNotMatch(html.slice(start, end), /commutexac|mini/i, 'garble rule must not use special-case vocabulary');
}

function runSharedDecision(question, kbResult, { explicitWeb = false, answer = 'Stubbed model answer', source = 'chat', confidence } = {}) {
  const calls = [];
  const kb = [
    { title: 'The #1 EQ Mistake Ruining Your Sound', text: 'EQ decisions should follow masking and context. Avoid cutting without listening.', video_id: 'eq-1' },
    { title: 'A Guide to Mastering Prices', text: 'Rates vary by scope and deliverables.', video_id: 'price-1' },
    { title: 'Logic Pro Drum Loop to MIDI', text: 'Right click the audio region, choose Convert, then Convert to MIDI Region. Quantize and make a groove template.', video_id: 'drums-1' },
    { title: 'Best EQ Mistakes', text: 'Most EQ problems come from skipping this step.', video_id: 'eq-2' }
  ];
  const ctx = context({
    HOPE_KB_STATE: 'unchecked',
    handleToolCall: async name => { calls.push(name); return name === 'search_yt_knowledge' ? (kbResult ?? { results: kb }) : {}; }
  });
  vm.runInContext(`hopeWebSearchBeginTurn(${JSON.stringify(question)},${confidence === undefined ? 'undefined' : JSON.stringify(confidence)},${JSON.stringify(source)})`, ctx);
  if (explicitWeb) vm.runInContext('HOPE_WEB_REQUESTED=true', ctx);
  // Stub model searches the KB for substantive questions, then follows the shared fallback decision.
  calls.push('model');
  if (vm.runInContext(`hopeQuestionNeedsKnowledge(${JSON.stringify(question)})`, ctx)) calls.push('search_yt_knowledge');
  const decision = calls.at(-1)==='search_yt_knowledge'
    ? vm.runInContext('hopeKnowledgeDecision({tool:"search_yt_knowledge",result:windowResult})', Object.assign(ctx, { windowResult: kbResult ?? { results: kb } }))
    : { usable:false, results:[], action:'answer_directly' };
  const web = vm.runInContext('hopeKnowledgeDecision({tool:"web_search_fallback",route:"typed"})', ctx);
  if (web.allow && (explicitWeb || !decision.usable)) calls.push('web_search_fallback');
  calls.push('show:' + (decision.action === 'repeat' ? decision.message : decision.usable ? (decision.results[0]?.text || answer) : explicitWeb || web.allow ? 'Stubbed web answer' : answer));
  return { calls, decision, web };
}

test('Failure 3: standard EQ question uses its relevant KB result and shows KB guidance', () => {
  const run = runSharedDecision('What is the #1 EQ mistake ruining your sound?', { results: [{ title: 'The #1 EQ Mistake Ruining Your Sound', text: 'EQ decisions should follow masking and context.', video_id: 'eq-1' }] });
  assert.deepEqual(run.calls, ['model', 'search_yt_knowledge', 'show:EQ decisions should follow masking and context.']);
  assert.equal(run.decision.usable, true);
  assert.equal(run.web.allow, false);
});

test('Failure 3: standard price question falls back to web when KB text is off topic', () => {
  const run = runSharedDecision('What does a mastering engineer charge?', { results: [{ title: 'Drum Mixing', text: 'Use parallel compression on the kick and snare.' }] });
  assert.deepEqual(run.calls, ['model', 'search_yt_knowledge', 'web_search_fallback', 'show:Stubbed web answer']);
  assert.equal(run.decision.usable, false);
  assert.equal(run.web.allow, true);
});

test('Failure 3: explicit web request overrides a usable KB answer', () => {
  const run = runSharedDecision('Search the web for current mastering prices.', { results: [{ title: 'Mastering', text: 'Mastering prices depend on scope.' }] }, { explicitWeb: true });
  assert.deepEqual(run.calls, ['model', 'search_yt_knowledge', 'web_search_fallback', 'show:Mastering prices depend on scope.']);
  assert.equal(run.web.allow, true);
});

test('Failure 5: standard drum how-to returns KB steps without a clarifier or web call', () => {
  const run = runSharedDecision('How do I convert a Logic Pro drum loop to MIDI?', { results: [{ title: 'Logic Pro Drum Loop to MIDI', text: 'Right click the audio region, choose Convert, then Convert to MIDI Region. Quantize and make a groove template.' }] });
  assert.deepEqual(run.calls, ['model', 'search_yt_knowledge', 'show:Right click the audio region, choose Convert, then Convert to MIDI Region. Quantize and make a groove template.']);
  assert.match(run.decision.results[0].text, /Convert to MIDI Region/);
  assert.equal(run.decision.action, 'answer_from_kb');
});

test('Failure 5: Are you there skips retrieval and gets a direct conversational reply', () => {
  const run = runSharedDecision('Are you there?', { results: [{ title: 'Drum Mixing', text: 'Use parallel compression.' }] }, { answer: 'Yep, I’m here.' });
  assert.deepEqual(run.calls, ['model', 'show:Yep, I’m here.']);
  assert.equal(run.decision.usable, false);
});

test('Failure 4: named EQ title wins over another ranked title', () => {
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("The #1 EQ Mistake Ruining Your Sound")', ctx);
  ctx.hits = { results: [
    { title: 'Best EQ Mistakes', text: 'Most EQ problems come from skipping this step.', video_id: 'ranked' },
    { title: 'The #1 EQ Mistake Ruining Your Sound', text: 'Use context before cutting.', video_id: 'named' }
  ] };
  const got = vm.runInContext('hopeKnowledgeDecision({tool:"search_yt_knowledge",result:hits})', ctx);
  assert.equal(got.results[0].video_id, 'named');
});

test('Failure 4: another explicitly named KB video title is selected', () => {
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("Logic Pro Drum Loop to MIDI")', ctx);
  ctx.hits = { results: [
    { title: 'Best EQ Mistakes', text: 'EQ decisions should follow context.', video_id: 'eq' },
    { title: 'Logic Pro Drum Loop to MIDI', text: 'Convert the region to MIDI.', video_id: 'drums' }
  ] };
  const got = vm.runInContext('hopeKnowledgeDecision({tool:"search_yt_knowledge",result:hits})', ctx);
  assert.equal(got.results[0].video_id, 'drums');
});

test('Failure 1: mini EQ question with no confidence gets an answer through the shared path', () => {
  assertNoLegacyGarbleWordList();
  const run = runSharedDecision('What is a mini EQ chain?', { results: [{ title: 'EQ chain', text: 'A mini EQ chain shapes tone with a small number of filters.' }] }, { source: 'voice' });
  assert.equal(run.decision.action, 'answer_from_kb');
  assert.match(run.calls.at(-1), /^show:(?!I heard)/);
  assert.equal(run.web.allow, false);
});

test('Failure 1: mini-mix bus phrase with normal confidence is not garbled', () => {
  assertNoLegacyGarbleWordList();
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("mini-mix bus",0.9,"voice")', ctx);
  assert.equal(vm.runInContext('HOPE_KB_DECISION.garbled', ctx), false);
});

test('Failure 1: low-confidence nonsense transcript takes shared repeat request path', () => {
  assertNoLegacyGarbleWordList();
  const run = runSharedDecision('qwrtyplkj zxcvbnm', { results: [] }, { source: 'voice', confidence: 0.2 });
  assert.equal(run.decision.action, 'repeat');
  assert.match(run.calls.at(-1), /^show:I heard “qwrtyplkj zxcvbnm”\. Could you repeat that\?$/);
});

test('Failure 1: transcript with no recognisable question, request, or readable phrase gets repeated', () => {
  assertNoLegacyGarbleWordList();
  const run = runSharedDecision('qwrtyplkj zxcvbnm', { results: [] }, { source: 'voice' });
  assert.equal(run.decision.action, 'repeat');
  assert.match(run.calls.at(-1), /^show:I heard “qwrtyplkj zxcvbnm”\. Could you repeat that\?$/);
});

test('Failure 1: confidence below threshold deterministically marks a transcript garbled', () => {
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("Can you explain MIDI?", 0.2)', ctx);
  assert.equal(vm.runInContext('HOPE_KB_DECISION.garbled', ctx), true);
});

async function readEvents(events) {
  const encoded = new TextEncoder().encode(events.map(e => `data: ${JSON.stringify(e)}\n\n`).join(''));
  const reader = new ReadableStream({ start(controller) { controller.enqueue(encoded); controller.close(); } }).getReader();
  const ctx = context();
  ctx.reader = reader;
  ctx.decoder = new TextDecoder();
  return vm.runInContext('hopeUsageReadLunaStream(reader,decoder)', ctx);
}

test('Failure 1: completed stream returns received text', async () => {
  const result = await readEvents([{ type: 'response.output_text.delta', delta: 'Done.' }, { type: 'response.completed', response: { output: [], usage: { output_tokens: 2 } } }]);
  assert.equal(result.text, 'Done.'); assert.equal(result.terminal, 'response.completed');
});
test('Failure 1: incomplete stream keeps partial text', async () => {
  const result = await readEvents([{ type: 'response.output_text.delta', delta: 'Partial' }, { type: 'response.incomplete', response: {} }]);
  assert.equal(result.text, 'Partial'); assert.equal(result.terminal, 'response.incomplete');
});
test('Failure 1: failed stream returns its readable error message', async () => {
  const result = await readEvents([{ type: 'response.failed', message: 'Provider rejected the request.' }]);
  assert.equal(result.errorMessage, 'Provider rejected the request.');
});
test('Failure 1: empty stream completes with no text and no throw', async () => {
  const result = await readEvents([]);
  assert.equal(result.text, ''); assert.equal(result.errorMessage, '');
});
test('Failure 1: cut-off stream retains text without a completion event', async () => {
  const result = await readEvents([{ type: 'response.output_text.delta', delta: 'Cut off' }]);
  assert.equal(result.text, 'Cut off'); assert.equal(result.terminal, '');
});

test('Failure 2: direct Luna executor refuses research despite a direct call', async () => {
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("Find this on the web")', ctx);
  vm.runInContext('HOPE_WEB_REQUESTED=true', ctx);
  const result = await vm.runInContext(`hopeUsageExecuteLunaCall({name:'research',arguments:'{"question":"direct"}'},{})`, ctx);
  assert.match(result.result.error, /not available on the Luna route/);
  assert.equal(ctx.toolCalls.length, 0);
});

test('Failure 3: relevant KB answer blocks web but irrelevant results allow it', () => {
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("What is the EQ mistake?")', ctx);
  ctx.result = { results: [{ title: 'EQ mistake', text: 'The main EQ mistake is cutting before listening in context.' }] };
  vm.runInContext('hopeKnowledgeDecision({tool:"search_yt_knowledge",result})', ctx);
  assert.equal(vm.runInContext('hopeKnowledgeDecision({tool:"web_search_fallback"}).allow', ctx), false);
  vm.runInContext('hopeWebSearchBeginTurn("What does mastering cost?")', ctx);
  ctx.result = { results: [{ title: 'Drum mixing', text: 'Parallel compression can add punch to drums.' }] };
  vm.runInContext('hopeKnowledgeDecision({tool:"search_yt_knowledge",result})', ctx);
  assert.equal(vm.runInContext('hopeKnowledgeDecision({tool:"web_search_fallback"}).allow', ctx), true);
});

test('Failure 3: a relevant read transcript keeps web search behind the KB', () => {
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("How do I convert a drum loop to MIDI?")', ctx);
  ctx.result = { video: 'Logic Pro Drum Loop to MIDI', result: 'Right click the region and choose Convert to MIDI Region.' };
  const read = vm.runInContext('hopeKnowledgeDecision({tool:"read_yt_knowledge",result})', ctx);
  assert.equal(read.usable, true);
  assert.equal(vm.runInContext('hopeKnowledgeDecision({tool:"web_search_fallback"}).allow', ctx), false);
});

test('Failure 5: clarification is reserved for a KB search with no usable result', () => {
  const ctx = context();
  vm.runInContext('hopeWebSearchBeginTurn("How do I set up sidechain compression?")', ctx);
  ctx.result = { results: [{ title: 'Sidechain compression setup', text: 'Route the kick to the compressor sidechain input and set the desired release.' }] };
  const useful = vm.runInContext('hopeKnowledgeDecision({tool:"search_yt_knowledge",result})', ctx);
  assert.equal(useful.action, 'answer_from_kb');
  vm.runInContext('hopeWebSearchBeginTurn("How do I set up sidechain compression?")', ctx);
  ctx.result = { results: [] };
  const empty = vm.runInContext('hopeKnowledgeDecision({tool:"search_yt_knowledge",result})', ctx);
  assert.equal(empty.action, 'web_or_clarify');
  assert.equal(empty.usable, false);
});
