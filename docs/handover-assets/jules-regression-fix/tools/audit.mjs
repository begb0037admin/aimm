import puppeteer from 'puppeteer-core';
import fs from 'fs';
const [,, port, out] = process.argv;
const TABS=['mixcheck','library','plugins','mixbus','settings','marketing','community'];
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
const page=await br.newPage();await page.setViewport({width:1900,height:1000});
await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'domcontentloaded'});
await new Promise(r=>setTimeout(r,4000));
await page.evaluate(()=>{try{
 const P=(n,p,s)=>({id:n.toLowerCase().replace(/\W+/g,'-'),name:n,publisher:p,stage:s,type:s,category:s});
 STATE.chain.master=[P('Insight 2','iZotope','Metering'),P('Sonnox Oxford EQ','Sonnox','Clean EQ')];
 STATE.chain.vocal=[P('Waves WLM Plus','Waves','Metering'),P('CLA-76','Waves','Character Comp')];
 renderChain();}catch(e){window.__err=String(e)}});
const res={};
const CSSP=['backgroundColor','color','borderTopColor','borderTopWidth','boxShadow','outlineStyle','outlineColor','fill','opacity','textDecorationLine','transform','filter','backgroundImage'];
async function snapEl(h){return h.evaluate((el,CSSP)=>{const g=(e)=>{const c=getComputedStyle(e);const o={};for(const k of CSSP)o[k]=c[k];return o};
 const o={self:g(el)};const kids=[...el.querySelectorAll('*')].filter(k=>k.children.length===0||k.matches('svg,.n,.count,.num')).slice(0,6);
 o.kids=kids.map(k=>({k:(k.tagName+'.'+(k.getAttribute('class')||'')).slice(0,40),...g(k)}));return o},CSSP)}
for(const t of TABS){
  await page.evaluate(t=>{document.querySelector(`.tab[data-tab="${t}"]`).click()},t);
  await new Promise(r=>setTimeout(r,900));
  await page.mouse.move(5,5);
  const list=await page.evaluateHandle((t)=>{
    const root=document.getElementById(t)||document;
    const sel='button,a[href],[role=button],summary,h4,h3,[tabindex="0"],.row,.chain-item,.inv-side-row,.inv-side-button,.settings-nav a,[aria-selected],[aria-pressed],[aria-checked],.selected,.active,.is-selected,#invSidebar [class*=head],#invSidebar [class*=group],#invSidebar [class*=title]';
    const seen=new Set();const out=[];
    for(const el of root.querySelectorAll(sel)){
      if(el.closest('#hopeRail,.tabs'))continue;const r=el.getBoundingClientRect();if(r.width<8||r.height<8)continue;
      const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')continue;
      const key=el.tagName+'.'+[...el.classList].filter(c=>!/^ic/.test(c)).join('.')+'|'+(el.id||'')+'|'+(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,28);
      if(seen.has(key))continue;seen.add(key);out.push(el);if(out.length>140)break;}
    return out;},t);
  const props=await list.getProperties();const items=[...props.values()].map(p=>p.asElement()).filter(Boolean);
  res[t]={};
  for(const h of items){
    const key=await h.evaluate(el=>el.tagName+'.'+[...el.classList].filter(c=>!/^ic/.test(c)).join('.')+'|'+(el.id||'')+'|'+(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,28));
    try{await h.evaluate(e=>e.scrollIntoView({block:'center'}));}catch{}
    await page.mouse.move(2,2);await new Promise(r=>setTimeout(r,60));
    const rest=await snapEl(h);
    const box=await h.boundingBox();if(!box){res[t][key]={rest};continue}
    await page.mouse.move(box.x+Math.min(box.width/2,60),box.y+box.height/2);await new Promise(r=>setTimeout(r,320));
    const hov=await snapEl(h);
    await page.mouse.move(2,2);
    const meta=await h.evaluate(el=>({sel:el.matches('.selected,.active,[aria-selected="true"],[aria-pressed="true"],[aria-checked="true"],.is-selected'),cls:el.className&&el.className.baseVal===undefined?el.className:''}));
    res[t][key]={rest,hov,meta};
  }
  await page.mouse.move(2,2);
}
fs.writeFileSync(out,JSON.stringify(res));
console.log(Object.entries(res).map(([k,v])=>k+':'+Object.keys(v).length).join(' '),await page.evaluate(()=>window.__err));
await br.close();
