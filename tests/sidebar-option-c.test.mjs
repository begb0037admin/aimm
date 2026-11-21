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
  assert.match(picks,/VIDEO CHAIN PICKS/);
  assert.match(html,/<h2>Video chain picks<\/h2>.*?starred on /);
});

test('accordion preserves state and has one visual selection with accessible focus and reduced motion',()=>{
  assert.match(html,/const INV_BROWSE_SECTIONS_KEY="aimmPluginBrowseSections_v1"/);
  assert.match(html,/content\.classList\.toggle\("is-closed",!expanded\);content\.inert=!expanded/);
  assert.match(html,/selected\.forEach\(button=>\{if\(button!==preferred\)button\.classList\.remove\("active"\)/);
  assert.match(html,/const preferred=INV_SIDEBAR_TOOL_ACTIVE\?.*?:INV_VOCAL_VIEW\?/);
  assert.match(html,/\.inv-sidebar-card\.is-current:has\(\.inv-sidebar-section-toggle\[aria-expanded="false"\]\) \.inv-sidebar-selected-dot/);
  assert.match(html,/\.inv-sidebar-pill\.is-visible\{opacity:1;animation:invPillBreathe/);
  assert.match(html,/\.inv-sidebar-section-toggle:focus-visible,#library #invSidebar \.inv-side-button:focus-visible\{outline:2px solid #36a8ed!important/);
  assert.match(html,/@media\(prefers-reduced-motion:reduce\).*animation:none!important/);
  assert.match(html,/const AIMM_BUILD = '2026-11-20\.26'/);
});
