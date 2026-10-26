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
  }`, context);
  vm.runInContext(`
    KB_SEARCH_CHUNKS = kbIndex.map(c => ({ ...c, _tk: kbSearchTok(c.x) }));
    KB_SEARCH_DF = {};
    let total = 0;
    KB_SEARCH_CHUNKS.forEach(c => { total += c._tk.length; new Set(c._tk).forEach(w => { KB_SEARCH_DF[w] = (KB_SEARCH_DF[w] || 0) + 1; }); });
    KB_SEARCH_AVGDL = total / KB_SEARCH_CHUNKS.length;
  `, context);
  vm.runInContext(decisionSource, context);
  return context;
}

function sharedSearch(question) {
  const context = makeContext();
  context.HOPE_KB_DECISION = { question, usable: false, searched: false, results: [], garbled: false };
  const query = vm.runInContext(`kbBuildHopeRetrievalQuery(HOPE_KB_DECISION.question, '')`, context);
  const results = vm.runInContext(`kbSearchRetrieve(${JSON.stringify(query)}, 25)`, context)
    .map(c => ({ video_id: c.video_id, title: c.title, channel: c.channel, chunk: c.chunk, text: c.x }))
    .slice(0, 6);
  context.rankedHits = results;
  const promoted = vm.runInContext(`kbPromoteNamedVideo(HOPE_KB_DECISION.question, ${JSON.stringify(query)}, rankedHits, 6)`, context);
  context.hits = { results: promoted };
  const decision = vm.runInContext(`hopeKnowledgeDecision({tool:'search_yt_knowledge',result:hits})`, context);
  return { context, query, results, decision };
}

const liveQuestion = "What's the main EQ mistake in the video?";
const singleVideoQuestion = 'What does the video say about locators?';
const namedQuestion = "What's the main EQ mistake in the video 'The #1 EQ Mistake Ruining Your Sound'?";
const noMatchQuestion = 'What does the video say about zzqx?';
const howToQuestion = 'How do I tighten the low end on a kick drum?';

test('V1 live vague EQ question lists distinct real-index videos and recommends one with a reason', () => {
  const run = sharedSearch(liveQuestion);
  assert.match(run.query, /main EQ mistake in the video/i, 'retrieval query includes the full live question');
  const vague = run.decision.vagueVideo;
  assert.ok(vague, 'shared path detects the vague video reference');
  assert.ok(vague.candidates.length >= 2, 'at least two clear candidates are surfaced');
  assert.ok(vague.candidates.every(c => kbIndex.some(row => row.video_id === c.video_id && row.title === c.title && row.channel === c.channel)), 'titles and channels come from the real index');
  assert.match(vague.spokenList, /^I found \d+ videos that could be it:/);
  assert.match(vague.spokenRecommendation, /^I'd go with '.+' because .+\.$/);
  assert.equal(vague.chosen, vague.candidates[0].video_id);
});

test('V2 one clear vague video falls back safely until the model gives its recommendation', () => {
  const run = sharedSearch(singleVideoQuestion);
  const vague = run.decision.vagueVideo;
  assert.ok(vague, 'shared path detects the vague video reference');
  assert.equal(vague.candidates.length, 1, 'exactly one clear video matches');
  assert.match(vague.spokenAnswer, new RegExp(vague.candidates[0].title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.ok(vague.spokenAnswer.includes(vague.reason), 'answer uses the shared path reason');
  assert.equal(vague.reason, "it's the closest match to your question.", 'no model reply uses the exact closest-match fallback');
  assert.doesNotMatch(vague.reason, /excerpt says|“|”|"/i, 'fallback does not quote transcript text');
});

test('V3 exact named title uses that video without a vague-reference list', () => {
  const run = sharedSearch(namedQuestion);
  assert.equal(run.decision.vagueVideo, null);
  assert.equal(run.decision.results[0]?.video_id, '5QDXc8s6GgM');
});

test('V4 vague question with no matching content has no list and no selected video', () => {
  const run = sharedSearch(noMatchQuestion);
  assert.ok(run.decision.vagueVideo);
  assert.equal(run.decision.vagueVideo.candidates.length, 0);
  assert.equal(run.decision.vagueVideo.spokenList, '');
  assert.equal(run.decision.vagueVideo.spokenRecommendation, '');
  assert.equal(run.decision.usable, false);
  assert.equal(run.decision.action, 'web_or_clarify');
});

test('V5 a direct how-to question does not produce a vague-video list', () => {
  const run = sharedSearch(howToQuestion);
  assert.equal(run.decision.vagueVideo, null);
  assert.notEqual(run.decision.action, 'answer_vague_video');
});

test('shared search handler attaches the same decision payload used by Luna, Agent, and typed chat', () => {
  const prompt = html.match(/const HOPE_USAGE_SYSTEM = `([^`]+)`;/)?.[1] || '';
  assert.match(prompt, /choose one candidate based on its title, channel, and transcript content/);
  assert.match(prompt, /never quote or copy the transcript/);
  const searchStart = html.indexOf("case 'search_yt_knowledge':{");
  const searchEnd = html.indexOf("case 'read_yt_knowledge':{", searchStart);
  assert.match(html.slice(searchStart, searchEnd), /hopeKnowledgeDecision\(\{tool:'search_yt_knowledge',result:\{results\},route:'typed'\}\)/);
  assert.match(html.slice(searchStart, searchEnd), /const vagueVideoResult=knowledgeDecision\.vagueVideo\?\{/);
  assert.match(html.slice(searchStart, searchEnd), /candidates:knowledgeDecision\.vagueVideo\.candidates\.map\(\(\{text,\.\.\.candidate\}\)=>candidate\)/);
  assert.match(html.slice(searchStart, searchEnd), /const returnedResults=knowledgeDecision\.vagueVideo\?knowledgeDecision\.vagueVideo\.candidates:results/);
  assert.match(html.slice(searchStart, searchEnd), /No clear knowledge-base video matched this vague reference/);
  assert.match(html.slice(searchStart, searchEnd), /hopeVagueVideoReference\(HOPE_KB_DECISION\.question\)\) n = Math\.max\(n, HOPE_VAGUE_VIDEO_TOP_RESULTS\)/);
  assert.match(html, /const HOPE_VAGUE_VIDEO_TOP_RESULTS = 6;/);
  assert.match(html, /const HOPE_VAGUE_VIDEO_MIN_SCORE_RATIO = 0\.5;/);
  assert.match(html, /const HOPE_VAGUE_VIDEO_CONTENT_CAP = 480;/);
  assert.match(html, /const HOPE_VAGUE_VIDEO_QUOTED_MIN_WORDS = 6;/);
});
