// Records the REAL AIMM app (http://127.0.0.1:8768/) being driven with real mouse/keyboard events,
// inside host.html (virtual camera + callouts). Output: frames + timestamps in OUT dir.
const p=require('puppeteer-core'),fs=require('fs'),path=require('path');
const OUT=process.argv[2],WAV=path.join(__dirname,'Midnight-Drive.wav');
const sl=ms=>new Promise(r=>setTimeout(r,ms));
const ICON={drop:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>',
 wave:'<svg viewBox="0 0 24 24"><path d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"/></svg>',
 check:'<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
 chat:'<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
 plug:'<svg viewBox="0 0 24 24"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>',
 lib:'<svg viewBox="0 0 24 24"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>',
 play:'<svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>'};
(async()=>{
fs.mkdirSync(OUT,{recursive:true});
const b=await p.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',
 args:['--no-sandbox','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1','--disable-background-timer-throttling']});
const pg=await b.newPage();await pg.setViewport({width:1920,height:1080});
await pg.setRequestInterception(true);
pg.on('request',r=>{const u=new URL(r.url());
 if(u.pathname==='/__host.html')return r.respond({status:200,contentType:'text/html',body:fs.readFileSync(path.join(__dirname,'host.html'))});
 if(u.pathname==='/__logo.png')return r.respond({status:200,contentType:'image/png',body:fs.readFileSync(path.join(__dirname,'logo.png'))});
 r.continue()});
await pg.goto('http://127.0.0.1:8768/__host.html',{waitUntil:'load'});
const app=()=>pg.frames().find(f=>f!==pg.mainFrame());
let fr;for(let i=0;i<40&&!(fr=app())?.url?.().startsWith('http');i++)await sl(250);
await sl(3500);fr=app();
// in-app: blur third-party library imagery + video (privacy); hide update toasts
await fr.evaluate(()=>{const s=document.createElement('style');s.textContent='img[src*="ytimg"],img[src*="youtube"],#libPlayer iframe,iframe[src*="youtube"],.video-frame iframe{filter:blur(14px) brightness(.8)!important}';document.head.appendChild(s)});
const H=(fn,...a)=>pg.evaluate(fn,...a);
const rect=async sel=>fr.evaluate(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}},sel);
const frames=[];let n=0;
const cdp=await pg.createCDPSession();
cdp.on('Page.screencastFrame',async f=>{const i=n++;fs.writeFileSync(path.join(OUT,String(i).padStart(5,'0')+'.jpg'),Buffer.from(f.data,'base64'));frames.push([i,f.metadata.timestamp]);cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}).catch(()=>{})});
const mark=(name)=>console.log('MARK',name,(Date.now()-T0)/1000);
let T0;
// move my cursor + real mouse onto element, then click for real
async function clickEl(sel,{ox=0,oy=0,cam,dur=1.0,wait=250,noClick}={}){
 const r=await rect(sel);if(!r)throw new Error('missing '+sel);
 const x=r.x+r.w/2+ox,y=r.y+r.h/2+oy;
 if(cam)await H((c,d)=>H.camTo(c[0],c[1],c[2],d),cam,dur+.4);
 await H((x,y,d)=>H.curTo(x,y,d),x,y,dur);await sl(dur*1000+80);
 const s=await H((x,y)=>H.toScreen(x,y),x,y);
 await pg.mouse.move(s.x,s.y,{steps:2});await sl(wait);
 if(!noClick){await H(()=>H.click());await pg.mouse.down();await sl(60);await pg.mouse.up()}
 return {x,y,r};
}
const cam=(cx,cy,z,d)=>H((a,b,c,d)=>H.camTo(a,b,c,d),cx,cy,z,d);
const co=(id,ic,html,wx,wy,ox,oy)=>H((a)=>H.callout(...a),[id,ICON[ic],html,wx,wy,ox,oy]);
const coOff=id=>H(id=>H.coOff(id),id);

await cdp.send('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:1920,maxHeight:1080,everyNthFrame:1});
T0=Date.now();
await H(()=>{document.getElementById('hero').classList.add('in');document.getElementById('brand').style.opacity=1});
// ---- S0 hero (0-4.6s)
await sl(4300);mark('hero-out');
await H(()=>{document.getElementById('hero').classList.add('out');document.getElementById('app').classList.remove('dim')});
await cam(760,430,1.0,1.4);await H(()=>{H.curShow(1);H.cur.x=1500;H.cur.y=900});
await sl(900);
// ---- S1 drop mix (real file chooser)
await cam(760,440,1.45,1.5);
await co(1,'drop','<b>Drop</b> your mix',760,505,-60,-140);
await fr.evaluate(()=>{document.addEventListener('mousedown',e=>console.log('MD',e.clientX,e.clientY,e.target.id||e.target.className))});pg.on('console',m=>{if(m.text().startsWith('MD'))console.log(m.text())});
const fcp=pg.waitForFileChooser({timeout:8000});
const cl=await clickEl('#refDzEmpty',{dur:1.3});console.log('clicked',JSON.stringify(cl));
let fc;try{fc=await fcp}catch(e){await pg.screenshot({path:path.join(OUT,'_fail.png')});throw e}
await H(()=>H.coOff(1));
await fc.accept([WAV]);mark('file-accepted');
for(let i=0;i<60;i++){const v=await fr.evaluate(()=>document.getElementById('refLufsInt').textContent);if(!/–/.test(v))break;await sl(150)}
mark('analysed');
await cam(760,470,1.3,1.4);await sl(500);
await co(2,'wave','Waveform, key and tempo — <b>measured live</b>',760,490,40,-210);
await sl(1700);await coOff(2);
await cam(190,790,1.75,1.5);await sl(900);
await co(3,'check','<b>LUFS</b> · <b>True peak</b> · <b>DR</b>',200,790,150,0);
await sl(2200);await coOff(3);
// ---- S2 play + spectrum
await fr.evaluate(()=>window.scrollTo(0,0));
const pl=await clickEl('#mcTransport button.primary, #mcTransport .mc-play, #mcPlay',{cam:[420,430,1.6],dur:1.1}).catch(async()=>clickEl('#mcTransport button:nth-of-type(3)',{dur:1}));
mark('play');
await sl(500);
await H(()=>H.scrollTo(430,1.3));await cam(920,560,1.22,1.6);await sl(1500);
await co(4,'wave','Live <b>tonal balance</b>',920,420,60,-10);
await sl(3000);await coOff(4);
// fix queue
const fq=await rect('#mcActions');console.log('fixq',JSON.stringify(fq));
await H(()=>H.scrollTo(980,1.4));await cam(760,500,1.15,1.4);await sl(1500);
await co(5,'check','Analysis ready — <b>your fix list</b>',760,330,60,0);
await sl(2200);await coOff(5);
// ---- S3 Hope
await H(()=>H.scrollTo(0,.8));
await cam(1700,520,1.5,1.5);
await clickEl('#aiChatInput',{dur:1.2,oy:0});
await co(6,'chat','Ask <b>Hope</b>, your AI coach',1700,420,-60,0);
await pg.keyboard.type('How loud should this be for streaming?',{delay:38});
await sl(250);await clickEl('#aiChatSend',{dur:.8});
mark('sent');
await sl(3500);
await fr.evaluate(()=>{const t=document.getElementById('aiChatTranscript');console.log;return t.innerText.slice(-300)}).then(t=>console.log('TRANSCRIPT',JSON.stringify(t)));
await coOff(6);
// ---- S4 MixBus
await cam(760,300,1.1,1.4);
await clickEl('.oz-tab:nth-child(3)',{dur:1.2});
await sl(700);
await clickEl('.chain-add',{dur:1.0,cam:[760,300,1.25]});
await sl(900);
await pg.keyboard.type('limiter',{delay:70});await sl(500);
mark('picker-typed');
await fr.evaluate(()=>{const e=document.querySelector('.chain-add');});
fs.writeFileSync(path.join(OUT,'_frames.json'),JSON.stringify(frames));
await pg.screenshot({path:path.join(OUT,'_picker.png')});
console.log('PARTIAL DONE',n);
await cdp.send('Page.stopScreencast');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
