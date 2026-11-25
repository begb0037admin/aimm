import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html=readFileSync(new URL('../standalone/assets/index.html',import.meta.url),'utf8');
const section=html.slice(html.indexOf('function libNoteTitleKey('),html.indexOf('function libraryRender(){'));
const source=html.slice(html.indexOf("const nh=document.getElementById('libNoteRows')"),html.indexOf('// Favourites use the existing recallFavourite path'));
const videos=[{video_id:'mwtm-lesson-1',title:'The Producer’s Guide: Vocal Mixing',local:true}];
const ctx={STATE:{knowledge:[]},libYouTubeIdFromLink:value=>{
  try{const url=new URL(value),id=url.hostname==='youtu.be'?url.pathname.slice(1):url.pathname==='/watch'?url.searchParams.get('v'):url.pathname.split('/')[2];
    return /^(?:www\.)?(youtube\.com|youtu\.be)$/.test(url.hostname)&&/^[\w-]{11}$/.test(id)?id:null;
  }catch{return null;}
},libPlayerVideos:()=>videos,libAction:(label,code)=>`<button onclick="${code}">${label}</button>`,escapeJs:s=>s,escapeHtml:s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;'),
  document:{querySelector:()=>({classList:{contains:()=>true}}),getElementById:()=>({scrollIntoView(){}})},libPlayerSelect:()=>{}};
vm.runInNewContext(section,ctx);

test('note source links take priority over a matching library title',()=>{
  const note={title:'The Producers Guide Vocal Mixing',source:'Watch https://www.youtube.com/watch?v=AbCdEfGhI12 now'};
  assert.equal(ctx.libNoteVideo(note).video_id,'AbCdEfGhI12');
});
test('standalone ids resolve without treating ordinary note text as an id',()=>{
  assert.equal(ctx.libNoteVideo({title:'Unknown',url:'AbCdEfGhI12'}).video_id,'AbCdEfGhI12');
  assert.equal(ctx.libNoteVideo({title:'Unknown',raw:'Try compression on the bus'}),null);
});
test('curly quotes and punctuation normalise for private library title matches',()=>{
  assert.equal(ctx.libNoteVideo({title:"The Producer's Guide — Vocal Mixing"}).video_id,'mwtm-lesson-1');
});
test('Play selects a matching private recording with playback enabled',()=>{
  let selected;
  ctx.STATE.knowledge=[{id:'private-note',title:"The Producer's Guide — Vocal Mixing"}];
  ctx.libPlayerSelect=(...args)=>{selected=args;};
  ctx.libNotePlay('private-note');
  assert.deepEqual(Array.from(selected),['mwtm-lesson-1',true]);
});
test('Notes Play buttons use the shared icon and accessible labels',()=>{
  const html=ctx.libNotePlayButton({id:'private-note',title:'The Producer’s Guide: Vocal Mixing'});
  assert.match(html,/class="tx note-icon" aria-label="Play The Producer’s Guide: Vocal Mixing" title="Play The Producer’s Guide: Vocal Mixing" onclick="libNotePlay\('private-note'\)"/);
  assert.match(html,/<svg class="ic ic-16" aria-hidden="true" viewBox="0 0 24 24"><use href="#i-play"\/><\/svg>/);
  assert.doesNotMatch(html,/>Play<\/button>/);
});
test('unmatched notes have an inert, dimmed icon button',()=>{
  const note={id:'missing',title:'A unique unmatched note'};
  assert.equal(ctx.libNoteVideo(note),null);
  assert.match(ctx.libNotePlayButton(note),/aria-label="Play A unique unmatched note" title="No video linked to this note" aria-disabled="true"/);
  assert.match(ctx.libNotePlayButton(note),/<use href="#i-play"\/>/);
  assert.doesNotMatch(ctx.libNotePlayButton(note),/onclick/);
});
test('Notes row actions use named sprite glyphs with accessible labels',()=>{
  const note={id:'private-note',title:'The Producer’s Guide: Vocal Mixing'};
  for(const [action,icon] of [['Edit','i-edit'],['View','i-show'],['Hide','i-hide'],['Delete','i-delete']]){
    const button=ctx.libNoteIcon(action,note,`do${action}()`);
    assert.match(button,new RegExp(`aria-label="${action} The Producer’s Guide: Vocal Mixing" title="${action} The Producer’s Guide: Vocal Mixing"`));
    assert.match(button,new RegExp(`href="#${icon}"`));
    assert.doesNotMatch(button,new RegExp(`>${action}<\\/button>`));
  }
  assert.match(ctx.libNoteIcon('Delete',note,'doDelete()'),/class="tx note-icon dim"/);
});
test('Notes list shows Play and has no Mode or Summary Raw action',()=>{
  assert.match(source,/\['Title','Source','Added','Edit','Show','Play','Remove'\]/);
  assert.doesNotMatch(source,/\bMode\b|kbToggleSummary|n\.useSummary\?'Summary':'Raw'/);
  assert.match(source,/libNotePlayButton\(n\)/);
  assert.match(source,/libNoteIcon\('Edit',n/);
  assert.match(source,/libNoteIcon\(open\?'Hide':'View',n/);
  assert.match(source,/libNoteIcon\('Delete',n/);
});
