import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const sidebar=html.slice(html.indexOf('<aside id="invSidebar"'),html.indexOf('</aside>',html.indexOf('<aside id="invSidebar"')));
const sections=[...sidebar.matchAll(/data-inv-section-toggle="([^"]+)"/g)].map(match=>match[1]);

test('Browse has five sections and keeps existing item hooks in their intended section',()=>{
  assert.deepEqual(sections,['status','tools','library','video-chain-picks','categories']);
  const library=sidebar.slice(sidebar.indexOf('data-inv-section-toggle="library"'),sidebar.indexOf('data-inv-section-toggle="video-chain-picks"'));
  const picks=sidebar.slice(sidebar.indexOf('data-inv-section-toggle="video-chain-picks"'),sidebar.indexOf('data-inv-section-toggle="categories"'));
  assert.match(library,/data-inv-scope="favorites"/);
  assert.doesNotMatch(library,/data-vocal-view=/);
  assert.deepEqual([...picks.matchAll(/data-vocal-view="([^"]+)"/g)].map(match=>match[1]),['owned','stock','missing']);
  assert.match(picks,/>Video chain picks<\/button>/);
  assert.match(picks,/data-vocal-view="stock" aria-label="Logic Pro stock" title="Logic Pro stock"><span class="inv-side-icon"/);
  assert.equal([...picks.matchAll(/data-vocal-view="[^"]+"[^>]*><span class="inv-side-icon"/g)].length,3);
  assert.doesNotMatch(sidebar,/Plugin Compatibility|Not licensed \(UAD\)|Counts are products|inv-tools-note|inv-folder-summary|BROWSE/);
  assert.match(html,/<div class="settings-scan-folders"><strong>Scan folders<\/strong><span id="invSidebarFolderMeta">No folders connected<\/span><\/div>/);
  assert.match(html,/<h2>Video chain picks<\/h2>.*?starred on /);
});

test('accordion preserves state and has one visual selection with accessible focus and reduced motion',()=>{
  assert.match(html,/const INV_BROWSE_SECTIONS_KEY="aimmPluginBrowseSections_v1"/);
  assert.match(html,/content\.classList\.toggle\("is-closed",!expanded\);content\.inert=!expanded/);
  assert.match(html,/selected\.forEach\(button=>\{if\(button!==preferred\)button\.classList\.remove\("active"\)/);
  assert.match(html,/const preferred=INV_SIDEBAR_TOOL_ACTIVE\?.*?:INV_VOCAL_VIEW\?/);
  assert.doesNotMatch(html,/inv-sidebar-selected-dot/);
  assert.doesNotMatch(html,/inv-sidebar-pill|invSidebarPlacePill|invSidebarTrackPill|inv-sidebar-heading-count|inv-sidebar-subgroup/);
  assert.match(html,/#plugins #invSidebar \.inv-side-button\.active/);
  assert.match(html,/#plugins #invSidebar \.inv-sidebar-card\{[^}]*background:#1b1d20;border:1px solid #2c3034;border-radius:10px/);
  assert.doesNotMatch(html,/#plugins #invSidebar \.inv-sidebar-card\[data-inv-section=/);
  assert.match(html,/chevron\.innerHTML=.*inv-fold-plus/);
  assert.match(html,/#plugins #invSidebar \[aria-expanded="true"\] \.inv-fold-plus\{opacity:0;transform:rotate\(90deg\)\}/);
  assert.match(html,/grid-template-columns:clamp\(280px,calc\(280px \* var\(--inv-text-scale,1\)\),32vw\)/);
  assert.match(html,/grid-template-columns:clamp\(72px,calc\(80px \* var\(--inv-text-scale,1\)\),104px\)/);
  assert.match(html,/#plugins #invSidebar \.inv-side-icon\{[^}]*width:calc\(28px \* var\(--inv-text-scale,1\)\)/);
  assert.match(html,/#plugins #invSidebar\.is-collapsed \.inv-side-count\{display:none!important\}/);
  assert.match(html,/\.inv-sidebar-section-toggle:focus-visible,#plugins #invSidebar \.inv-side-button:focus-visible\{outline:2px solid var\(--aimm-teal\)!important/);
  assert.match(html,/@media\(prefers-reduced-motion:reduce\).*animation:none!important/);
  assert.match(html,/--aimm-hover-bg:var\(--aimm-teal\)/);
  assert.doesNotMatch(html,/background:var\(--section-colour,#36a8ed\)!important/);
  assert.doesNotMatch(html,/color-mix\(in srgb,var\(--section-colour,#36a8ed\) 18%,transparent\)/);
  assert.match(html,/const AIMM_BUILD = '2026-11-23\.69'/);
});

test('sidebar header stays above scrolling rows in every sidebar mode',()=>{
  assert.match(html,/#plugins #invSidebar\{[^}]*overflow-y:auto/);
  assert.match(html,/#plugins #invSidebar \.inv-sidebar-head\{[^}]*position:sticky;top:0;z-index:1;[^}]*background:#17191c;box-shadow:0 8px 0 #17191c/);
});
