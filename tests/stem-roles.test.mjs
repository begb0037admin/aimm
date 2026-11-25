import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const detector = html.slice(html.indexOf('  function detectStemRole('), html.indexOf('  function stemValidFile('));

test('stem roles use the last matching token in the filename suffix', () => {
  const detectStemRole = vm.runInNewContext(detector + '\ndetectStemRole;');
  const filenames = [
    ['switchin beatz_Vocals.wav', 'Vocals'],
    ['switchin beatz_Drums.wav', 'Drums'],
    ['switchin beatz_Bass.wav', 'Bass'],
    ['switchin beatz_Guitar.wav', 'Guitar'],
    ['switchin beatz_Keys.wav', 'Keys'],
    ['switchin beatz_Other.wav', 'Other'],
    ['Bassline Beatz_Drums.wav', 'Drums'],
    ['Submarine_Vocals.wav', 'Vocals'],
    ['Song (Drums).wav', 'Drums'],
    ['Song (live) (Lead Vocal).WAV', 'Vocals'],
    ['Drum Song - Electric Guitar.wav', 'Guitar'],
    ['Song – AcOuStIc.wav', 'Guitar'],
    ['Track_Kick 808.wav', 'Bass'],
    ['Track_808 Snare take 2.wav', 'Drums'],
    ['Song_Piano (Rhodes).wav', 'Keys'],
    ['Vocal Song_Strings.wav', 'Other'],
    ['Drums - Sound Design.wav', 'Other'],
    ['Bass (Other).wav', 'Other'],
    ['Organically Bassline Submarine.wav', 'Other'],
    ['Song_not808.wav', 'Other'],
  ];
  const aliases = [
    ['Vocals', ['vocals', 'vocal', 'vox', 'voice', 'lead vocal', 'acapella', 'bv', 'backing']],
    ['Drums', ['drums', 'drum', 'kick', 'snare', 'hat', 'hihat', 'perc', 'percussion', 'cymbal']],
    ['Bass', ['bass', '808', 'sub']],
    ['Guitar', ['guitar', 'gtr', 'acoustic', 'electric guitar']],
    ['Keys', ['keys', 'piano', 'keyboard', 'rhodes', 'organ', 'synth', 'pad']],
  ];
  for (const [label, synonyms] of aliases) {
    for (const synonym of synonyms) filenames.push([synonym + '.wav', label]);
  }
  for (const [fileName, label] of filenames) {
    assert.deepEqual({ ...detectStemRole(fileName) }, { role: label.toLowerCase(), label }, fileName);
  }
});

test('uploads assign unique labels immediately and keep file keys and existing labels stable', async () => {
  const source = html.slice(html.indexOf('  function stemFileKey('), html.indexOf('  function stemShowInputNotice('));
  const upload = html.slice(html.indexOf('  async function stemAddFiles('), html.indexOf('  function stemRemoveAt('));
  const renderings = [];
  const context = vm.createContext({
    stemSession: [],
    stemShowInputNotice() {},
    stemRenderRows() {
      renderings.push(Array.from(context.stemSession, ({ key, role, label }) => ({ key, role, label })));
    },
    MC_SPECS: { show() {} },
    stemEnqueue() {},
  });
  const stemAddFiles = vm.runInContext(source + upload + '\nstemAddFiles;', context);
  const file = name => ({ name, size: 100, lastModified: 123 });
  const drums = file('Track_Drums.wav');
  await stemAddFiles([drums, drums, file('Track_Snare.wav')]);
  await stemAddFiles([file('Track_Hat.wav')]);
  assert.deepEqual(renderings[0], [
    { key: 'Track_Drums.wav|100|123', role: 'drums', label: 'Drums' },
    { key: 'Track_Snare.wav|100|123', role: 'drums', label: 'Drums 2' },
  ]);
  assert.deepEqual(renderings[1], [
    ...renderings[0],
    { key: 'Track_Hat.wav|100|123', role: 'drums', label: 'Drums 3' },
  ]);
});
