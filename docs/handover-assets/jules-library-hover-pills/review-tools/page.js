window.__SEC={add:'rgb(54, 168, 237)',review:'rgb(185, 112, 255)',videos:'rgb(244, 114, 182)',notes:'rgb(249, 115, 22)',chats:'rgb(232, 180, 90)',none:'rgb(45, 212, 191)'};
window.__seed=function(kind){
  const cat=KB_CATEGORIES.map(c=>c.id);
  const now=Date.now();
  if(kind==='full'||kind==='tips'){
    STATE.knowledge=[
      {id:'t1',title:'Cut 300 Hz before boosting presence',raw:'When a vocal sounds boxy, cut around 300 Hz with a narrow Q before adding any presence boost.',category:cat[0],ts:now-86400000,toReview:true,active:false,tags:[]},
      {id:'t2',title:'Parallel compress the drum bus',raw:'Blend a heavily compressed copy under the dry drum bus, around 20 percent.',category:cat[1]||cat[0],ts:now-3*86400000,toReview:true,active:false,tags:[]},
    ];
  }
  if(kind==='full'){
    STATE.knowledge.push(
      {id:'n1',title:'Vocal chain notes',raw:'High pass at 90 Hz, gentle compression, de-ess around 6 kHz.',summary:'Vocal chain: HPF, gentle comp, de-ess.',useSummary:true,category:cat[4]||cat[0],ts:now-5*86400000,tags:['vocal','chain'],active:true,origin:'hope'},
      {id:'n2',title:'Mastering loudness targets for streaming',raw:'Aim for about minus 14 LUFS integrated with true peak under minus 1 dB for streaming platforms.',category:cat[3]||cat[0],ts:now-9*86400000,tags:['loudness'],active:true,source:'file.pdf'},
      {id:'n3',title:'Low end checks',raw:'Check mono below 120 Hz.',summary:'Mono the low end.',useSummary:false,category:cat[3]||cat[0],ts:now-12*86400000,tags:[],active:true}
    );
    STATE.journal=[
      {id:'j1',subject:'Why does my kick disappear in the chorus',text:'You: kick vanishes\nHope: check the sidechain.',tldr:'sidechain',ts:now-86400000,favourite:true,workbenchSnapshot:{chain:{a:[1]}}},
      {id:'j2',subject:'Reference track comparison',text:'You: compare\nHope: brighter top end.',tldr:'ref',ts:now-2*86400000,favourite:true},
      {id:'j3',subject:'Vocal harshness around 3 kHz',text:'You: harsh\nHope: dynamic EQ.',tldr:'harsh',ts:now-4*86400000,favourite:false,workbenchSnapshot:{chain:{a:[1]}}},
      {id:'j4',subject:'Master bus glue',text:'You: glue\nHope: 2 dB comp.',tldr:'glue',ts:now-6*86400000,favourite:false}
    ];
  }
  libraryRender();
};
window.__results=function(){
  LIB_UI.query='808s in hip hop';LIB_UI.excluded=5;LIB_UI.hopeSearch=true;
  LIB_UI.results=[{video_id:'a1',title:'How to mix 808s so they hit hard',channel:'Mix With The Masters',duration:'11:42',views:'312K views',url:'https://youtu.be/a1',reason:'Direct walkthrough of low end for 808s.'},
  {video_id:'a2',title:'808 and kick layering explained',channel:'Produce Like A Pro',duration:'8:10',views:'90K views',url:'https://youtu.be/a2',reason:'Covers kick and sub relationship.'},
  {video_id:'a3',title:'Sidechain your 808',channel:'Some Channel',duration:'6:01',views:'40K views',url:'https://youtu.be/a3',reason:'Short practical tip.',status:'added',message:'Added. Summary saved under Mixing techniques.'}];
  libRenderResults();
};
window.__openAll=function(open){document.querySelectorAll('#library .card').forEach(c=>{const b=c.querySelector(':scope>.bar');const o=b.getAttribute('aria-expanded')==='true';if(o!==open)b.click();});};
window.__fold=function(sec,open){const c=document.querySelector('#library .card[data-sec='+sec+']');const b=c.querySelector(':scope>.bar');if((b.getAttribute('aria-expanded')==='true')!==open)b.click();};
// colour helpers
function pc(s){const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return[0,0,0,0];const p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return[p[0],p[1],p[2],p.length>3?p[3]:1];}
function blend(f,b){const a=f[3];return[f[0]*a+b[0]*(1-a),f[1]*a+b[1]*(1-a),f[2]*a+b[2]*(1-a),1];}
window.__effbg=function(el){const chain=[];let e=el;while(e){chain.push(getComputedStyle(e).backgroundColor);e=e.parentElement;}let c=[0,0,0,1];for(let i=chain.length-1;i>=0;i--){const x=pc(chain[i]);if(x[3]>0)c=blend(x,c);}return c;};
function lum(c){const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]);}
window.__cr=function(a,b){const l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);};
window.__col=pc;
window.__ctls=function(){
  const sel='#library .bar,#library .grp,#library button:not(.bar):not(.grp),#library a[href],#library select,#library input,#library textarea';
  return [...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!e.closest('[hidden]')&&!e.disabled});
};
window.__secOf=function(e){const c=e.closest('.card');return c?c.dataset.sec:'none';};
window.__snap=function(){return __ctls().map(e=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.width,r.height]});};
window.__lines=function(card){const out=[];card.querySelectorAll('*').forEach(e=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();if(r.width===0)return;if(parseFloat(cs.borderTopWidth)>0&&cs.borderTopStyle!=='none')out.push({y:r.top,l:r.left,r:r.right});if(parseFloat(cs.borderBottomWidth)>0&&cs.borderBottomStyle!=='none')out.push({y:r.bottom,l:r.left,r:r.right});});return out;};
window.__geom=function(el,all){
  const r=el.getBoundingClientRect(),card=el.closest('.card');
  let gap=1e9,nb='';
  for(const o of all){if(o===el||o.contains(el)||el.contains(o))continue;const q=o.getBoundingClientRect();
    // only neighbours that are visually near
    const dx=Math.max(q.left-r.right,r.left-q.right),dy=Math.max(q.top-r.bottom,r.top-q.bottom);
    const d=(dx<0&&dy<0)?Math.max(dx,dy):Math.max(dx,dy);
    if(d<gap&&d<300){gap=d;nb=(o.textContent||o.placeholder||o.tagName).trim().slice(0,20);} }
  let edge={},hair=null;
  if(card){const c=card.getBoundingClientRect();edge={l:r.left-(c.left+1),r:(c.right-1)-r.right,t:r.top-(c.top+1),b:(c.bottom-1)-r.bottom};
    for(const L of __lines(card)){if(L.r<=r.left||L.l>=r.right)continue;const d1=r.top-L.y,d2=L.y-r.bottom;let d;if(d1>=0)d=d1;else if(d2>=0)d=d2;else d=-1;if(hair===null||d<hair)hair=d;}}
  return {gap:gap===1e9?null:Math.round(gap*10)/10,nb,edge,hair:hair===null?null:Math.round(hair*10)/10};
};
window.__style=function(el){const cs=getComputedStyle(el);const bg=__effbg(el);const fg=pc(cs.color);const fgb=blend(fg,bg);return {color:cs.color,bg:cs.backgroundColor,ebg:'rgb('+bg.slice(0,3).map(Math.round)+')',cr:Math.round(__cr(fgb,bg)*100)/100,fs:cs.fontSize,fw:cs.fontWeight,bs:cs.boxShadow==='none'?'':cs.boxShadow,ol:cs.outlineStyle==='none'?'':cs.outlineWidth+' '+cs.outlineColor,td:cs.textDecorationLine,h:Math.round(el.getBoundingClientRect().height*10)/10,w:Math.round(el.getBoundingClientRect().width*10)/10};};
