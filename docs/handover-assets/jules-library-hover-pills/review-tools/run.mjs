import {open} from './drv.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const OUT='/Users/admin/github/aimm/docs/handover-assets/jules-library-hover-pills/review-shots';
mkdirSync(OUT+'/crops',{recursive:true});
const W=+process.argv[2];
const b=await open('http://127.0.0.1:8768/',W,1000);
const pagejs=readFileSync('/private/tmp/claude-501/-Users-admin/4cafa38d-7fc9-40a3-adf8-57b3affa9715/scratchpad/rv/page.js','utf8');
await b.ev(pagejs);
await b.ev(`document.querySelector('.tab[data-tab="library"]').click()`);
await b.sleep(1200);
const scen={
 'a-default':`__seed('none');__fold('add',true);__fold('review',true);__fold('videos',false);__fold('notes',true);__fold('chats',true)`,
 'b-seeded':`__seed('full');LIB_UI.editTip=null;LIB_UI.kept=null;__results();__fold('add',true);__fold('review',true);__fold('videos',false);__fold('notes',true);__fold('chats',true)`,
 'c-videos-open':`__seed('full');__results();__fold('videos',true);document.querySelector('#libVideoRows .ent .tx.hi').click()`,
 'd-all-folded':`__seed('full');__results();__openAll(false)`,
 'e-tip-edit':`__seed('full');LIB_UI.editTip='t1';libraryRender();__fold('review',true);__fold('videos',false)`,
 'f-kept':`__seed('full');libKeepTip('t1');libKeepTip('t2');__fold('review',true);__fold('videos',false)`,
};
const report={};
const seen=new Set();
for(const [name,js] of Object.entries(scen)){
  await b.ev(`(()=>{LIB_UI.editTip=null;LIB_UI.kept=null;LIB_UI.results=null;libRenderResults();})()`);
  await b.ev(`${js};0`);
  await b.sleep(500);
  const H=await b.ev(`Math.ceil(Math.max(document.documentElement.scrollHeight,document.body.scrollHeight))`);
  await b.resize(W,H);
  await b.mouse(5,5);
  await b.sleep(300);
  await b.shot(`${OUT}/${W}-${name}.png`);
  const n=await b.ev(`__ctls().length`);
  const cards=await b.ev(`JSON.stringify([...document.querySelectorAll('#library .card')].map(c=>{const r=c.getBoundingClientRect(),bar=c.querySelector(':scope>.bar'),br=bar.getBoundingClientRect(),cs=getComputedStyle(c),bs=getComputedStyle(bar);return {sec:c.dataset.sec,open:bar.getAttribute('aria-expanded'),cl:r.left,cr:r.right,ct:r.top,cb:r.bottom,bl:br.left,brr:br.right,bt:br.top,bb:br.bottom,bw:cs.borderTopWidth+'/'+cs.borderRightWidth+'/'+cs.borderBottomWidth+'/'+cs.borderLeftWidth,bc:cs.borderTopColor+'|'+cs.borderRightColor+'|'+cs.borderBottomColor+'|'+cs.borderLeftColor,rad:cs.borderRadius,barbg:bs.backgroundColor,barfg:bs.color,barcr:Math.round(__cr(__col(bs.color),__col(bs.backgroundColor))*100)/100,barh:br.height,fold:getComputedStyle(bar.querySelector('.fold'),'::before').content}}))`);
  const ov=await b.ev(`JSON.stringify({sw:document.documentElement.scrollWidth,iw:innerWidth,lib:document.querySelector('#library').getBoundingClientRect().width,over:[...document.querySelectorAll('#library *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>document.querySelector('#library').getBoundingClientRect().right+0.5||e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow==='visible'&&e.children.length===0&&getComputedStyle(e).display!=='inline')}).slice(0,8).map(e=>e.tagName+'.'+e.className+':'+(e.textContent||'').slice(0,20))})`);
  const rows=[];
  for(let i=0;i<n;i++){
    const info=await b.ev(`(()=>{const e=__ctls()[${i}];const r=e.getBoundingClientRect();window.scrollTo(0,0);return JSON.stringify({tag:e.tagName,cls:e.className,text:(e.textContent||e.placeholder||e.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,28),sec:__secOf(e),x:r.left+r.width/2,y:r.top+r.height/2,r:[r.left,r.top,r.width,r.height],rest:__style(e),geom:__geom(e,__ctls()),snap:__snap(),fold:!!e.closest('.g[data-open=false]')})})()`);
    const o=JSON.parse(info);
    const key=`${o.sec}|${o.cls.replace(/\s+/g,'.')}|${o.text.replace(/\d+/g,'N')}`;
    const crop=!seen.has(key);if(crop)seen.add(key);
    const clip={x:Math.max(0,o.r[0]-70),y:Math.max(0,o.r[1]-34),width:o.r[2]+140,height:o.r[3]+68};
    const slug=`${W}-${o.sec}-${o.text.replace(/[^a-z0-9]+/gi,'_')}-${o.cls.replace(/[^a-z0-9]+/gi,'_')}`.slice(0,90);
    if(crop)await b.shot(`${OUT}/crops/${slug}-rest.png`,clip);
    await b.mouse(o.x,o.y);await b.sleep(220);
    const hv=JSON.parse(await b.ev(`(()=>{const e=__ctls()[${i}];return JSON.stringify({hov:e.matches(':hover'),st:__style(e),snap:__snap()})})()`));
    if(crop)await b.shot(`${OUT}/crops/${slug}-hover.png`,clip);
    await b.mouse(5,5);await b.sleep(120);
    await b.key('Tab');
    await b.ev(`__ctls()[${i}].focus({focusVisible:true})`);await b.sleep(260);
    const fc=JSON.parse(await b.ev(`(()=>{const e=__ctls()[${i}];return JSON.stringify({fv:e.matches(':focus-visible'),st:__style(e),snap:__snap()})})()`));
    if(crop)await b.shot(`${OUT}/crops/${slug}-focus.png`,clip);
    await b.ev(`document.activeElement&&document.activeElement.blur()`);
    const shift=s=>{let m=0;s.forEach((q,k)=>{o.snap[k]&&q.forEach((v,j)=>{m=Math.max(m,Math.abs(v-o.snap[k][j]))})});return Math.round(m*10)/10};
    rows.push({i,tag:o.tag,cls:o.cls,text:o.text,sec:o.sec,fold:o.fold,slug:crop?slug:null,rest:o.rest,geom:o.geom,hov:hv.hov,hover:hv.st,hshift:shift(hv.snap),fv:fc.fv,focus:fc.st,fshift:shift(fc.snap)});
  }
  report[name]={cards:JSON.parse(cards),ov:JSON.parse(ov),rows,H};
}
writeFileSync(`/private/tmp/claude-501/-Users-admin/4cafa38d-7fc9-40a3-adf8-57b3affa9715/scratchpad/rv/report-${W}.json`,JSON.stringify(report));
console.log('done',W,Object.entries(report).map(([k,v])=>k+':'+v.rows.length).join(' '));
b.close();
