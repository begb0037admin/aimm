import {spawn} from 'node:child_process';
import {readFileSync,existsSync,mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
export async function open(url,w,h){
 const dir=mkdtempSync(join(tmpdir(),'rv-'));
 const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--disable-gpu','--hide-scrollbars','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});
 const pf=join(dir,'DevToolsActivePort');for(let i=0;i<100&&!existsSync(pf);i++)await new Promise(r=>setTimeout(r,100));
 const port=Number(readFileSync(pf,'utf8').split('\n')[0]);
 const t=await (await fetch(`http://127.0.0.1:${port}/json/new?${url}`,{method:'PUT'})).json();
 const s=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>s.addEventListener('open',r,{once:true}));
 let id=0;const p=new Map();s.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id)}});
 const send=(method,params={})=>new Promise(r=>{const n=++id;p.set(n,r);s.send(JSON.stringify({id:n,method,params}))});
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
 await sleep(3000);
 const ev=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails).slice(0,400));return r.result?.result?.value};
 const shot=async(out,clip)=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,...(clip?{clip:{...clip,scale:1}}:{})});writeFileSync(out,Buffer.from(r.result.data,'base64'))};
 const mouse=async(x,y)=>{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y})};
 const key=async(k)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key:k,code:k==='Tab'?'Tab':k,windowsVirtualKeyCode:k==='Tab'?9:0});await send('Input.dispatchKeyEvent',{type:'keyUp',key:k,code:k==='Tab'?'Tab':k,windowsVirtualKeyCode:k==='Tab'?9:0})};
 const resize=async(w2,h2)=>{await send('Emulation.setDeviceMetricsOverride',{width:w2,height:h2,deviceScaleFactor:1,mobile:false});await sleep(400)};
 return {send,ev,shot,mouse,key,sleep,resize,close:()=>{s.close();child.kill()}};
}
