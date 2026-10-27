import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const helperStart = html.indexOf('const KB_SEARCH_STOP =');
const helperEnd = html.indexOf('function kbFetchJsonWithTimeout(', helperStart);
const helpers = html.slice(helperStart, helperEnd);
assert.ok(helperStart >= 0 && helperEnd > helperStart);

function contextFor(chunks) {
  const context = vm.createContext();
  vm.runInContext(helpers, context);
  context.chunks = chunks;
  vm.runInContext(`
    KB_SEARCH_CHUNKS = chunks.map(c => ({ ...c, _tk: kbSearchTok(c.x) }));
    KB_SEARCH_DF = {};
    KB_SEARCH_META_DF = {};
    let total = 0;
    const byVideo = new Map();
    KB_SEARCH_CHUNKS.forEach(c => {
      total += c._tk.length;
      new Set(c._tk).forEach(w => { KB_SEARCH_DF[w] = (KB_SEARCH_DF[w] || 0) + 1; });
      const id = String(c.video_id);
      if (!byVideo.has(id)) byVideo.set(id, new Set(kbSearchTok(c.title + ' ' + c.channel)));
    });
    KB_SEARCH_AVGDL = total / KB_SEARCH_CHUNKS.length;
    let metaTotal = 0;
    byVideo.forEach(tokens => {
      metaTotal += tokens.size;
      tokens.forEach(w => { KB_SEARCH_META_DF[w] = (KB_SEARCH_META_DF[w] || 0) + 1; });
    });
    KB_SEARCH_META_AVGDL = metaTotal / byVideo.size;
  `, context);
  return context;
}

test('video grouping keeps one candidate per video and attaches up to three evidence chunks', () => {
  const context = contextFor([]);
  const groups = vm.runInContext(`kbGroupCandidatesByVideo([
    {video_id:'v1', title:'First', channel:'A', chunk:1, text:'one'},
    {video_id:'v1', title:'First', channel:'A', chunk:2, text:'two'},
    {video_id:'v2', title:'Second', channel:'B', chunk:1, text:'other'},
    {video_id:'v1', title:'First', channel:'A', chunk:3, text:'three'},
    {video_id:'v1', title:'First', channel:'A', chunk:4, text:'four'}
  ])`, context);
  assert.equal(groups.length, 2);
  assert.deepEqual(Array.from(groups, c => c.video_id), ['v1', 'v2']);
  assert.equal(groups[0].chunk, 1);
  assert.equal(groups[0]._passages.length, 3);
  assert.match(vm.runInContext('kbBuildVideoRerankDocument(candidates[0])', Object.assign(context, { candidates: groups })), /Title: First[\s\S]*Passage \(chunk 3\): three/);
});

test('BM25 title metadata can retrieve a video when its transcript omits title wording', () => {
  const context = contextFor([
    {video_id:'target', title:'Parallel Compression on the Drum Bus', channel:'Producer One', chunk:1, x:'A quiet passage about balancing the mix.'},
    {video_id:'decoy', title:'General Mixing Advice', channel:'Producer Two', chunk:1, x:'Compression can change the drum bus and parallel compression can help a drum bus.'},
  ]);
  const results = vm.runInContext("kbSearchRetrieve('parallel compression drum bus', 2)", context);
  assert.equal(results[0].video_id, 'target');
});

test('reranker order is fused with retrieval order so it cannot erase strong first-stage matches', () => {
  const context = contextFor([]);
  const ranked = vm.runInContext(`kbFuseVideoRanks(
    [
      {video_id:'a', title:'A'},
      {video_id:'b', title:'B'},
      {video_id:'c', title:'C'},
      {video_id:'d', title:'D'}
    ],
    [
      {video_id:'c', title:'C'},
      {video_id:'a', title:'A'},
      {video_id:'d', title:'D'}
    ],
    10
  )`, context);
  assert.deepEqual(Array.from(ranked, c => c.video_id), ['a', 'c', 'd', 'b']);
});
