import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const section = (start, end) => {
  const from = html.indexOf(start), to = html.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `missing ${start}`);
  return html.slice(from, to);
};
const source = section('const INV_VENDOR_APP_VENDORS=', 'function invVendorStatusIdentityKeys(')
  + section('function invComputedRowStatus(', 'function invGroupStatusSummary(')
  + section('function invPrimaryProductStatus(', 'function invFormatStatusDots(')
  + section('function invStatusScope(', 'function invProductTileHeaderVersion(');

function harness() {
  const data = new Map();
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const context = vm.createContext({
    localStorage: storage, INV_SYNTHETIC_PREVIEW: false, INV_USER_STATUS_MAX_AGE_DAYS: 30,
    invNorm: value => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim(),
    invReadProductActions: () => ({}), invGetProductActions: () => ({}),
    invSavedVendorStatus: () => null, invKnownVendorRelease: () => null,
    INV_SCOPE: 'up-to-date', invEsc: value => String(value ?? ''),
    invActionKey: (vendor, name) => `${String(vendor).toLowerCase()}|${String(name).toLowerCase()}`,
    invRenderInventory: () => {}, invStatus: () => {},
  });
  vm.runInContext(source, context);
  const run = expression => vm.runInContext(expression, context);
  return { run, data };
}

const rows = [
  { vendor: 'uaudio', name: 'One', version: '1.0', format: 'AU' },
  { vendor: 'uaudio', name: 'Two', version: '2.0', format: 'VST3' },
  { vendor: 'Other', name: 'Three', version: '1.0', format: 'AU' },
];

function counts(run, values = rows) {
  run(`globalThis.testRows=${JSON.stringify(values)}`);
  return run(`(() => { const groups=invBuildGroups(testRows), counts={updates:0,'up-to-date':0,'manual-check':0,'vendor-app':0,unchecked:0};groups.forEach(group=>counts[invPrimaryProductStatus(group.statusCounts)]++);return {groups,counts};})()`);
}

test('mark moves vendor app products to up to date with a local record; undo restores counts', () => {
  const { run, data } = harness();
  let state = counts(run);
  assert.equal(state.counts['vendor-app'], 2);
  assert.equal(Object.values(state.counts).reduce((sum, value) => sum + value, 0), state.groups.length);
  assert.equal(run('invMarkVendorChecks(invBuildGroups(testRows).filter(group=>invPrimaryProductStatus(group.statusCounts)==="vendor-app"))'), true);
  state = counts(run);
  assert.equal(state.counts['vendor-app'], 0);
  assert.equal(state.counts['up-to-date'], 2);
  assert.equal(Object.values(state.counts).reduce((sum, value) => sum + value, 0), state.groups.length);
  const records = JSON.parse(data.get('aimm.pluginInventory.vendorAppChecks.v1'));
  assert.deepEqual(Object.keys(records).sort(), ['uaudio|one', 'uaudio|two']);
  assert.equal(records['uaudio|one'].installedVersion, 'AU:1.0');
  assert.ok(records['uaudio|one'].checkedAt);
  assert.match(run('invProductStatusDetailHTML(invBuildGroups(testRows)[0])'), /Checked in vendor app, /);
  assert.equal(run('invUndoVendorChecks()'), true);
  assert.equal(counts(run).counts['vendor-app'], 2);
});

test('check expires after 121 days or an installed version change', () => {
  const { run, data } = harness();
  counts(run);
  run('invMarkVendorChecks([invBuildGroups(testRows)[0]])');
  assert.equal(counts(run).counts['up-to-date'], 1);
  const changed = rows.map((row, index) => index === 0 ? { ...row, version: '1.1' } : row);
  assert.equal(counts(run, changed).counts['vendor-app'], 2);
  counts(run);
  const saved = JSON.parse(data.get('aimm.pluginInventory.vendorAppChecks.v1'));
  saved['uaudio|one'].checkedAt = new Date(Date.now() - 121 * 86400000).toISOString();
  data.set('aimm.pluginInventory.vendorAppChecks.v1', JSON.stringify(saved));
  run('INV_VENDOR_CHECKS=invReadVendorChecks()');
  assert.equal(counts(run).counts['vendor-app'], 2);
});

test('one product can be unmarked later', () => {
  const { run, data } = harness();
  counts(run);
  run('invMarkVendorChecks([invBuildGroups(testRows)[0]])');
  run('invUnmarkVendorCheck("uaudio|one")');
  assert.equal(counts(run).counts['vendor-app'], 2);
  assert.equal(JSON.parse(data.get('aimm.pluginInventory.vendorAppChecks.v1'))['uaudio|one'], undefined);
});
