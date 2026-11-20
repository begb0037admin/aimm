import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../standalone/assets/index.html', import.meta.url), 'utf8');
const vendors = html.slice(html.indexOf('const INV_VENDOR_APP_VENDORS='), html.indexOf('function invVendorStatusIdentityKeys('));
const statuses = html.slice(html.indexOf('function invComputedRowStatus('), html.indexOf('function invGroupStatusSummary('));
const primary = html.slice(html.indexOf('function invPrimaryProductStatus('), html.indexOf('function invFormatStatusDots('));
assert.ok(vendors.startsWith('const INV_VENDOR_APP_VENDORS='));
assert.ok(statuses.startsWith('function invComputedRowStatus('));
assert.ok(primary.startsWith('function invPrimaryProductStatus('));

function harness() {
  const context = vm.createContext({
    INV_SYNTHETIC_PREVIEW: false,
    INV_USER_STATUS_MAX_AGE_DAYS: 30,
    invNorm: value => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim(),
    invReadProductActions: () => ({}),
    invGetProductActions: () => ({}),
    invSavedVendorStatus: () => null,
    invKnownVendorRelease: () => null,
  });
  vm.runInContext(vendors + statuses + primary, context);
  return {
    effective: vm.runInContext('invEffectiveRowStatus', context),
    build: vm.runInContext('invBuildGroups', context),
    primary: vm.runInContext('invPrimaryProductStatus', context),
    label: vm.runInContext('invStatusLabel', context),
  };
}

test('vendor app bucket only takes manual results, and product counts sum to the total', () => {
  const { effective, build, primary, label } = harness();
  const rows = [
    { vendor: 'uaudio', name: 'UA One', version: '1.0', format: 'AU' },
    { vendor: 'Universal Audio (UADx)', name: 'UA Two', version: '1.0', format: 'VST3' },
    { vendor: 'IK-Multimedia', name: 'IK One', version: '1.0', format: 'AU' },
    { vendor: 'ValhallaDSP', name: 'Valhalla One', version: '1.0', format: 'AU' },
    { vendor: 'AconDigital', name: 'Acon One', version: '1.0', format: 'AU' },
    { vendor: 'slatedigital', name: 'Slate One', version: '1.0', format: 'AU' },
    { vendor: 'UJAM', name: 'UJAM One', version: '1.0', format: 'AU' },
    { vendor: 'Waves', name: 'Waves One', version: '1.0', format: 'AU', status: 'updates' },
    { vendor: 'Waves', name: 'Waves Current', version: '1.0', format: 'AU', status: 'up-to-date' },
    { vendor: 'Waves', name: 'Waves Manual', version: '1.0', format: 'AU' },
    { vendor: 'Other Publisher', name: 'Other One', version: '1.0', format: 'AU' },
    { vendor: 'uaudio', name: 'UA No Version', format: 'AU' },
  ];
  assert.equal(effective(rows[0]), 'vendor-app');
  assert.equal(effective(rows[7]), 'updates');
  assert.equal(effective(rows[8]), 'up-to-date');
  assert.equal(effective(rows[9]), 'vendor-app');
  assert.equal(effective(rows[10]), 'manual-check');
  assert.equal(effective(rows[11]), 'unchecked');
  const groups = build(rows);
  const counts = Object.fromEntries(['updates', 'up-to-date', 'manual-check', 'vendor-app', 'unchecked'].map(status => [status, 0]));
  for (const group of groups) counts[primary(group.statusCounts)]++;
  assert.deepEqual(counts, { updates: 1, 'up-to-date': 1, 'manual-check': 1, 'vendor-app': 8, unchecked: 1 });
  assert.equal(Object.values(counts).reduce((sum, count) => sum + count, 0), groups.length);
  assert.equal(label(primary(groups[0].statusCounts)), 'Vendor app');
});
