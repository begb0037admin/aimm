import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const between = (start, end) => html.slice(html.indexOf(start), html.indexOf(end, html.indexOf(start)));
const implementation = between('  function stemModeIncludes(', '  function stemApplySelection(');
const detector = between('  function detectStemRole(', '  function stemValidFile(');

function createHost() {
  const button = (mode, text) => ({
    dataset: { stemMode: mode },
    text,
    attributes: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    getAttribute(key) { return this.attributes[key]; },
    querySelector: () => ({ setAttribute() {} }),
    closest() { return this; },
  });
  return {
    mounts: 0,
    set innerHTML(markup) {
      this.mounts++;
      this.firstElementChild = button();
      this.modes = [...markup.matchAll(/data-stem-mode="([^"]+)">([^<]+)/g)]
        .map(([, mode, label]) => button(mode, label));
    },
    querySelectorAll: () => [],
    addEventListener(type, handler) {
      assert.equal(type, 'click');
      assert.equal(this.handleClick, undefined);
      this.handleClick = handler;
    },
  };
}

function setup() {
  const hosts = [createHost(), createHost()];
  hosts.forEach(host => { host.querySelectorAll = () => host.modes; });
  const gainTargets = new Map();
  const context = vm.createContext({
    document: { querySelectorAll: () => hosts },
    window: {},
    refCtx: { currentTime: 5 },
    refAnalyser: null,
    refPlaying: false,
    refStemGainNodes: new Map(),
    stemSession: null,
    stemPlaybackMode: 'full',
    stemSoloKeys: new Set(),
    stemMutedKeys: new Set(),
    stemAuditionKeys: [],
    stemLiveSpectrumCache: new Map(),
    stemPlaybackSpectrumBuild() {},
  });
  vm.runInContext(detector + implementation + `
    const refActivePlaybackBuffers = () => stemSession ? stemControlPlaybackBuffers() : fullMix;
    const refRetargetPlayback = stemApplyLiveGains;
    const stemRenderRows = syncStemTransports;
    let fullMix = [], refAvg, refAvgLastPlayhead;
    window.refTogglePlay = () => {
      refPlaying = !refPlaying;
      if (refPlaying) stemApplyLiveGains();
      syncStemTransports();
    };
  `, context);
  const run = code => vm.runInContext(code, context);
  function load(names) {
    context.stemSession = names.map(name => ({
      key: name, role: context.detectStemRole(name + '.wav').role, status: 'ok', buffer: {},
    }));
    context.refAnalyser = {};
    context.refStemGainNodes = new Map(names.map(name => [name, {
      gain: { setTargetAtTime(value, time, fade) {
        assert.equal(time, 5);
        assert.equal(fade, .012);
        gainTargets.set(name, value);
      } },
    }]));
    context.stemPlaybackMode = 'full';
    context.stemSoloKeys.clear();
    context.stemMutedKeys.clear();
    context.stemAuditionKeys = [];
    context.syncStemTransports();
  }
  return { hosts, gainTargets, context, run, load };
}

function state(host) {
  return [host.firstElementChild, ...host.modes].map(button =>
    [button.text, button.attributes, button.tabIndex, button.title]);
}

test('Stem mix and Fix Queue both mount the shared transport component', () => {
  assert.equal([...html.matchAll(/class="(?:mc-stem|mcq)-transport" data-stem-transport><\/div>/g)].length, 2);
  assert.match(html, /renderStemTransport\(transport\);/);
  assert.match(implementation, /querySelectorAll\('\[data-stem-transport\]'\)\.forEach\(renderStemTransport\)/);
  assert.equal([...html.matchAll(/host\.addEventListener\('click',handleStemTransportClick\)/g)].length, 1);
});

test('Both transport placements produce identical transitions through the same click handler', () => {
  const all = ['Vocals', 'Drums', 'Bass', 'Guitar', 'Keys', 'Other'];
  const table = [
    ['vocals', 'vocals', false, ['Vocals']],
    ['play', 'vocals', true, ['Vocals']],
    ['instrumental', 'instrumental', true, all.slice(1)],
    ['drums-bass', 'drums-bass', true, ['Drums', 'Bass']],
    ['full', 'full', true, all],
    ['play', 'full', false, all],
    ['mute', 'full', false, all.filter(name => name !== 'Bass')],
    ['solo', 'full', false, ['Keys']],
    ['drums-bass', 'drums-bass', false, ['Drums']],
    ['play', 'drums-bass', true, ['Drums']],
    ['vocals', 'vocals', true, ['Vocals']],
    ['play', 'vocals', false, ['Vocals']],
  ];
  const traces = [0, 1].map(index => {
    const { hosts, gainTargets, context, run, load } = setup();
    load(all);
    context.stemAuditionKeys = ['Guitar'];
    const host = hosts[index];
    assert.equal(hosts[0].handleClick, hosts[1].handleClick);
    assert.deepEqual(host.modes.map(button => button.text), ['Full song', 'Vocals only', 'Instrumental', 'Drums + Bass']);
    const trace = table.map(([action, mode, playing, audible]) => {
      if (action === 'solo') run("stemToggleAudioControl('Keys','solo')");
      else if (action === 'mute') run("stemToggleAudioControl('Bass','mute')");
      else {
        const button = action === 'play' ? host.firstElementChild : host.modes.find(button => button.dataset.stemMode === action);
        host.handleClick({ target: button });
      }
      assert.equal(context.stemPlaybackMode, mode);
      assert.equal(context.refPlaying, playing);
      assert.deepEqual(Array.from(run('stemPlaybackRows().map(stem => stem.key)'), String), audible);
      if (playing) assert.deepEqual(all.filter(name => gainTargets.get(name) === 1), audible);
      assert.deepEqual(context.stemAuditionKeys, ['Guitar']);
      assert.deepEqual(state(hosts[0]), state(hosts[1]));
      return structuredClone(state(host));
    });
    load(all);
    assert.equal(context.stemPlaybackMode, 'full');
    assert.equal(context.stemMutedKeys.size + context.stemSoloKeys.size + context.stemAuditionKeys.length, 0);
    assert.deepEqual(state(hosts[0]), state(hosts[1]));
    assert.deepEqual(hosts.map(host => host.mounts), [1, 1]);
    return trace;
  });
  assert.deepEqual(traces[0], traces[1]);
});

test('Both placements disable mode choices without stems and can play a standalone mix', () => {
  const { hosts, context, run, load } = setup();
  context.syncStemTransports();
  for (const host of hosts) {
    for (const button of [host.firstElementChild, ...host.modes]) {
      assert.equal(button.getAttribute('aria-disabled'), 'true');
      assert.equal(button.tabIndex, -1);
      assert.match(button.title, /No playable/);
      host.handleClick({ target: button });
    }
  }
  assert.equal(context.stemPlaybackMode, 'full');
  assert.equal(context.refPlaying, false);
  run('fullMix = [{}]; refAnalyser = {}; syncStemTransports()');
  for (const host of hosts) {
    assert.equal(host.firstElementChild.getAttribute('aria-disabled'), 'false');
    host.handleClick({ target: host.firstElementChild });
    assert.equal(context.refPlaying, true);
    host.handleClick({ target: host.firstElementChild });
    assert.equal(context.refPlaying, false);
    assert.deepEqual(state(hosts[0]), state(hosts[1]));
  }
  load(['Vocals']);
  const host = hosts[0];
  host.handleClick({ target: host.firstElementChild });
  host.handleClick({ target: host.modes[2] });
  assert.equal(context.refPlaying, true);
  assert.equal(hosts[1].firstElementChild.getAttribute('aria-disabled'), 'false');
  hosts[1].handleClick({ target: hosts[1].firstElementChild });
  assert.equal(context.refPlaying, false);
});
