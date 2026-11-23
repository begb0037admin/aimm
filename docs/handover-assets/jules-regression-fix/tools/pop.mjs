import puppeteer from 'puppeteer-core';import fs from 'fs';
const [,, port, out] = process.argv;
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
const page=await br.newPage();await page.setViewport({width:1900,height:1100});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'domcontentloaded'});await sleep(4000);
const CHECK=`(root,scn)=>{
 const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
 const P=s=>{const m=s.match(/rgba?\\(([^)]+)\\)/);if(!m)return[0,0,0,0];const a=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return[a[0],a[1],a[2],a.length>3?a[3]:1]};
 const over=(t,b)=>{const a=t[3];return[t[0]*a+b[0]*(1-a),t[1]*a+b[1]*(1-a),t[2]*a+b[2]*(1-a),1]};
 const bgOf=el=>{const stack=[];let e=el,grad=false;while(e&&e.nodeType===1){const cs=getComputedStyle(e);if(cs.backgroundImage&&cs.backgroundImage!=='none')grad=true;const c=P(cs.backgroundColor);stack.push(c);if(c[3]>=1&&!grad)break;if(grad&&c[3]>=1)break;e=e.parentElement}
   let base=[0,0,0,1];for(let i=stack.length-1;i>=0;i--)base=over(stack[i],base);return{c:base,grad}};
 const out=[];const els=[root,...root.querySelectorAll('*')];
 for(const el of els){if(el.closest('#hopeRail'))continue;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)continue;
  let own=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
  const isIcon=el.matches('svg')&&cs.stroke!=='none'&&cs.stroke.startsWith('rgb');
  if(!own&&!isIcon)continue; if(el.tagName==='STYLE'||el.tagName==='SCRIPT'||el.tagName==='OPTION')continue;
  const fg=isIcon?P(cs.stroke):P(cs.color);const b=bgOf(el);const f=over(fg,b.c);
  const L1=lum(f),L2=lum(b.c);const ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
  const fs=parseFloat(cs.fontSize),fw=+cs.fontWeight;const large=fs>=24||(fs>=18.66&&fw>=700);
  const need=isIcon?3:(large?3:4.5);
  if(ratio<need){const path=(e=>{let p=[];while(e&&p.length<4&&e.nodeType===1){p.push(e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+[...e.classList].filter(c=>!/^ic/.test(c)).slice(0,2).map(c=>'.'+c).join(''));e=e.parentElement}return p.join('<')})(el);
   out.push({scn,path,text:isIcon?'[icon]':own.slice(0,34),fg:cs.color,bg:'rgb('+b.c.slice(0,3).map(Math.round)+')',grad:b.grad,ratio:+ratio.toFixed(2)})}}
 return out}`;
const res={};
async function chk(sel,scn){const r=await page.evaluate(`(${CHECK})(document.querySelector(${JSON.stringify(sel)})||document.body,${JSON.stringify(scn)})`);(res.flags=res.flags||[]).push(...r);return r.length}
async function hoverAll(sel,scn,max=40){
  const hs=await page.$$(sel);let n=0;
  for(const h of hs.slice(0,max)){const b=await h.boundingBox();if(!b)continue;
    await h.evaluate(e=>e.scrollIntoView({block:'center'}));const bb=await h.boundingBox();
    await page.mouse.move(bb.x+Math.min(bb.width/2,50),bb.y+bb.height/2);await sleep(260);
    const key=await h.evaluate(e=>(e.getAttribute('class')||e.tagName)+'|'+(e.textContent||'').trim().slice(0,20));
    const r=await page.evaluate(`(${CHECK})(document.elementFromPoint(${bb.x+Math.min(bb.width/2,50)},${bb.y+bb.height/2}).closest('button,a,.chain-item,.inv-product-card,tr,li,[role=button],summary')||document.body,${JSON.stringify(scn+' HOVER '+'')})`);
    r.forEach(x=>x.scn=scn+' HOVER '+key);(res.flags=res.flags||[]).push(...r);n+=r.length}
  await page.mouse.move(2,2);return n}
// --- Plugins
const rows=[];const V=[['Waves','updates','1.2.4','AU'],['Waves','up-to-date','14.0','VST3'],['FabFilter','up-to-date','3.1','VST3'],['FabFilter','updates','3.2','AU'],['Soundtoys','manual-check','5.4','AU'],['iZotope','unchecked','11.0','VST3'],['Plugin Alliance','up-to-date','2.0','CLAP'],['Native Instruments','unchecked','1.0','VST2'],['Universal Audio','manual-check','9.1','AU']];
const NAMES=['Pro-Q 3','Pro-L 2','Decapitator','CLA-76','Ozone 11','bx_digital V3','Neutron 5','Kontakt 7','LA-2A'];
V.forEach((v,i)=>rows.push({name:NAMES[i],vendor:v[0],format:v[3],version:v[2],bundleId:'x.'+i,rootId:'r1',category:i%3?'Effect':'Instrument',bundleName:NAMES[i]+'.vst3',status:v[1],latestVersion:v[1]==='updates'?'99.0':undefined,manualReason:v[1]==='manual-check'?'Check vendor notes':undefined}));
await page.evaluate(r=>{INV_SCAN_ROWS=r;INV_SCAN_INFO={generatedAt:new Date().toISOString(),bundles:r.length,folders:1,unreadable:0,truncated:false,partial:false,needsRefresh:false,rootIds:['r1'],configuredRootIds:['r1']};},rows);
await page.evaluate(()=>document.querySelector('.tab[data-tab="plugins"]').click());await sleep(900);
for(const view of ['cards','list','ledger']){
  await page.evaluate(v=>{INV_VIEW=v;invRenderInventory();if(typeof invRenderSidebar==='function'){}},view);await sleep(700);
  await page.mouse.move(2,2);
  await page.screenshot({path:out.replace('.json','')+'-plugins-'+view+'.png'});
  await chk('#plugins','PLUGINS '+view+' rest');
  await hoverAll('#invInventory button, #invInventory .inv-product-card, #invInventory tr, #invSidebar .inv-side-button, #invSidebar .inv-sidebar-section-toggle','PLUGINS '+view,30);
}
// select sidebar item + product actions menu
await page.evaluate(()=>{INV_VIEW='cards';invRenderInventory()});await sleep(500);
const upd=await page.$('#invSidebar [data-inv-scope="updates"]');if(upd){await upd.click();await sleep(500);await chk('#plugins','PLUGINS cards selected Updates');await page.screenshot({path:out.replace('.json','')+'-plugins-selected.png'});}
const pa=await page.$('#invInventory .inv-product-actions');
if(pa){await pa.evaluate(e=>e.scrollIntoView({block:'center'}));await pa.click();await sleep(400);await chk('#invProductMenu','PRODUCT MENU rest');
  await hoverAll('#invProductMenu .inv-menu-row','PRODUCT MENU',12);
  const rowsM=await page.$$('#invProductMenu .inv-menu-row');
  for(const rm of rowsM){const t=await rm.evaluate(e=>e.textContent);if(/note|detail|metadata|edit/i.test(t)){await rm.click();await sleep(600);break}}
  if(await page.$('#invProductMetaOverlay')){await chk('#invProductMetaOverlay','META OVERLAY rest');await hoverAll('#invProductMetaOverlay button','META OVERLAY',10);await page.screenshot({path:out.replace('.json','')+'-meta.png'});await page.evaluate(()=>document.getElementById('invProductMetaOverlay')?.remove())}
  else res.metaOpened=false;
}
// --- MixBus
await page.keyboard.press('Escape');await page.evaluate(()=>document.querySelector('.tab[data-tab="mixbus"]').click());await sleep(700);
await page.evaluate(()=>{const P=(n,p,s)=>({id:n.toLowerCase().replace(/\W+/g,'-'),name:n,publisher:p,stage:s,type:s,category:s});
 STATE.chain.master=[P('Insight 2','iZotope','Metering'),P('Sonnox Oxford EQ','Sonnox','Clean EQ'),P('Shadow Hills Comp','Plugin Alliance','Bus Comp')];STATE.chain.vocal=[P('Waves WLM Plus','Waves','Metering'),P('CLA-76','Waves','Character Comp')];renderChain();});await sleep(500);
await page.mouse.move(2,2);await page.screenshot({path:out.replace('.json','')+'-mixbus.png',fullPage:false});
await chk('#mixbus','MIXBUS rest');
await hoverAll('#busGrid .chain-item, #busGrid .chain-add, #busGrid h4, #busGrid .clear-bus-btn, #busGrid .chain-panel-edit, #mixbus .chain-toolbar button','MIXBUS',30);
// edit mode
await page.evaluate(()=>{const e=document.querySelector('#busGrid .chain-panel-edit');e&&e.click()});await sleep(700);
await page.screenshot({path:out.replace('.json','')+'-mixbus-edit.png'});
await chk('#mixbus','MIXBUS edit rest');
await hoverAll('#busGrid .chain-edit-actions button, #busGrid .replacement-option, #busGrid .replacement-filters select','MIXBUS edit',14);
// picker
await page.evaluate(()=>{document.querySelector('#busGrid .chain-add')?.click()});await sleep(800);
if(await page.$('#pickerModal.open, #pickerModal:not([hidden])')){}
await page.screenshot({path:out.replace('.json','')+'-picker.png'});
await chk('#pickerModal','PICKER rest');
await hoverAll('#pickerModal .plugin-option, #pickerModal button','PICKER',12);
fs.writeFileSync(out,JSON.stringify(res));
console.log('flags',res.flags.length,'meta',res.metaOpened);await br.close();
