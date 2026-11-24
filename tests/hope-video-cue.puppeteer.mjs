import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

// Run separately: node tests/hope-video-cue.puppeteer.mjs
// Puppeteer and Chrome are required for this real-browser smoke check.
const require=createRequire(import.meta.url);
const puppeteer=require('puppeteer');
const browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox','--allow-file-access-from-files']});
try{
  const page=await browser.newPage();
  await page.goto(new URL('../standalone/assets/index.html',import.meta.url).href,{waitUntil:'domcontentloaded',timeout:30000});
  const result=await page.evaluate(async()=>{
    YT_KB.videos.push({video_id:'AbCdEfGhI12',title:'Browser cue check',channel:'Studio'});
    document.querySelector('.tab[data-tab="mixbus"]').click();
    const before=document.querySelector('.tab.active')?.dataset.tab;
    const defaultCue=await handleToolCall('cue_video',{video_id:'AbCdEfGhI12'});
    const after=document.querySelector('.tab.active')?.dataset.tab;
    const frame=document.getElementById('libPlayerIframe').getAttribute('src');
    const explicitCue=await handleToolCall('cue_video',{video_id:'AbCdEfGhI12',switch_to_library:true});
    return {before,after,defaultCue,frame,explicitCue,finalTab:document.querySelector('.tab.active')?.dataset.tab};
  });
  assert.equal(result.before,'mixbus');
  assert.equal(result.after,'mixbus');
  assert.equal(result.defaultCue.tab_switched,false);
  assert.equal(result.defaultCue.transcript_status,'in_library');
  assert.match(result.frame,/youtube\.com\/embed\/AbCdEfGhI12/);
  assert.doesNotMatch(result.frame,/autoplay=1/);
  assert.equal(result.explicitCue.tab_switched,true);
  assert.equal(result.finalTab,'library');
  console.log('Puppeteer cue_video tab check passed');
}finally{await browser.close();}
