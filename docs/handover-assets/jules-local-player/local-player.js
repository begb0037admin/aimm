/* AIMM Library local video player (Jules, 24 Nov 2026). Design preview code, not built into index.html.
   Usage:  const lp = AimmLocalPlayer.attach(document.getElementById('libPlayerFrame'));
           lp.show({id, title, channel, src, autoplay});   // switches the frame to local mode
           lp.hide();                                      // back to the YouTube iframe (pauses and clears the video)
   The YouTube iframe code is never touched: this only adds/removes class "is-local" on the frame. */
(function(){
const SPR='<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">'
+'<symbol id="lpi-play" viewBox="0 0 24 24"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></symbol>'
+'<symbol id="lpi-pause" viewBox="0 0 24 24"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></symbol>'
+'<symbol id="lpi-sk-back" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><text x="12" y="15.4" text-anchor="middle" font-size="8.2" font-weight="700" font-family="Roboto,Arial,sans-serif" fill="currentColor" stroke="none">10</text></symbol>'
+'<symbol id="lpi-sk-fwd" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><text x="12" y="15.4" text-anchor="middle" font-size="8.2" font-weight="700" font-family="Roboto,Arial,sans-serif" fill="currentColor" stroke="none">10</text></symbol>'
+'<symbol id="lpi-volume" viewBox="0 0 24 24"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></symbol>'
+'<symbol id="lpi-volume-x" viewBox="0 0 24 24"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></symbol>'
+'<symbol id="lpi-back-10" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></symbol>'
+'<symbol id="lpi-fwd-10" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></symbol>'
+'<symbol id="lpi-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>'
+'<symbol id="lpi-chev" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>'
+'<symbol id="lpi-refresh" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></symbol>'
+'<symbol id="lpi-gear" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></symbol>'
+'<symbol id="lpi-maximize" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></symbol>'
+'<symbol id="lpi-minimize" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></symbol>'
+'<symbol id="lpi-pip" viewBox="0 0 24 24"><path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4"/><rect width="10" height="7" x="12" y="13" rx="2"/></symbol>'
+'<symbol id="lpi-loader" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></symbol></svg>';
const ic=(id,cls)=>'<svg class="lpl-i'+(cls?' '+cls.split(' ').map(x=>'lpl-'+x).join(' '):'')+'"><use href="#lpi-'+id+'"/></svg>';
const HTML=''
+'<div class="lpl-in"><video playsinline preload="metadata"></video><div class="lpl-mini" aria-hidden="true"><i></i></div>'
+'<div class="lpl-ctl"><div class="lpl-gtop"></div><div class="lpl-gbot"></div>'
+'<div class="lpl-head"><div class="lpl-t"></div><div class="lpl-c"></div></div>'
+'<div class="lpl-bar"><div class="lpl-prog" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0" aria-valuetext="0:00">'
+'<div class="lpl-track"><b class="lpl-buf"></b><b class="lpl-hov"></b><b class="lpl-played"></b></div><i class="lpl-dot"></i><div class="lpl-tip">0:00</div></div>'
+'<div class="lpl-row">'
+'<button class="lpl-cb lpl-fill lpl-b-play" type="button" data-tip="Play (k)" aria-label="Play">'+ic('play','ic-play')+ic('pause','ia ic-pause')+'</button>'
+'<div class="lpl-vol"><button class="lpl-cb lpl-b-mute" type="button" data-tip="Mute (m)" aria-label="Mute">'+ic('volume','ic-vol')+ic('volume-x','ia ic-mute')+'</button>'
+'<div class="lpl-slide"><input class="lpl-vrange" type="range" min="0" max="100" step="1" value="100" aria-label="Volume"></div></div>'
+'<span class="lpl-time" aria-hidden="true">0:00 / 0:00</span><span class="lpl-sp"></span>'
+'<button class="lpl-cb lpl-b-gear" type="button" data-tip="Settings" aria-label="Settings" aria-haspopup="menu" aria-expanded="false">'+ic('gear','gear')+'</button>'
+'<button class="lpl-cb lpl-b-pip" type="button" data-tip="Picture-in-picture" aria-label="Picture-in-picture">'+ic('pip')+'</button>'
+'<button class="lpl-cb lpl-b-full" type="button" data-tip="Full screen (f)" aria-label="Full screen">'+ic('maximize','ic-max')+ic('minimize','ia ic-min')+'</button>'
+'</div></div>'
+'<div class="lpl-menu" role="menu" aria-label="Settings"></div><div class="lpl-btip" aria-hidden="true"></div>'
+'<div class="lpl-mid"><button class="lpl-sk lpl-sk-b" type="button" aria-label="Rewind 10 seconds"><span>'+ic('sk-back')+'</span></button>'
+'<button class="lpl-big lpl-fill" type="button" aria-label="Play">'+ic('play','ic-playmain')+ic('pause','ia ic-bigpause')+ic('refresh','ia ic-replay')+'</button>'
+'<button class="lpl-sk lpl-sk-f" type="button" aria-label="Fast-forward 10 seconds"><span>'+ic('sk-fwd')+'</span></button></div>'
+'<div class="lpl-osd" aria-hidden="true"><svg class="lpl-i"><use href="#lpi-play"/></svg><span></span></div>'
+'<div class="lpl-spin" aria-hidden="true">'+ic('loader')+'</div>'
+'<div class="lpl-failbox"><h3>This recording can\'t be played here</h3><button type="button" class="lpl-retry">Try again</button></div>'
+'<div class="lpl-sr" aria-live="polite"></div></div>';

const SPEEDS=[.5,.75,1,1.25,1.5,1.75,2],HIDE_MS=4700,FPS=30;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const fmt=s=>{s=Math.max(0,Math.floor(s||0));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=s%60;return h?h+':'+String(m).padStart(2,'0')+':'+String(r).padStart(2,'0'):m+':'+String(r).padStart(2,'0')};
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,x)=>{try{localStorage.setItem(k,x)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};

function attach(frame){
  if(frame.__lpl)return frame.__lpl;
  if(!document.getElementById('lpi-play'))document.body.insertAdjacentHTML('afterbegin',SPR);
  const L=document.createElement('div');L.className='lpl lpl-is-paused';L.tabIndex=-1;L.setAttribute('role','region');L.setAttribute('aria-label','Video player');L.innerHTML=HTML;frame.appendChild(L);
  const q=s=>L.querySelector(s),v=q('video'),ctl=q('.lpl-ctl'),bar=q('.lpl-bar'),prog=q('.lpl-prog'),track=q('.lpl-track'),buf=q('.lpl-buf'),hovEl=q('.lpl-hov'),played=q('.lpl-played'),dot=q('.lpl-dot'),tip=q('.lpl-tip'),
        mini=q('.lpl-mini i'),timeEl=q('.lpl-time'),menu=q('.lpl-menu'),btip=q('.lpl-btip'),osd=q('.lpl-osd'),live=q('.lpl-sr'),bPlay=q('.lpl-b-play'),bMute=q('.lpl-b-mute'),bGear=q('.lpl-b-gear'),bPip=q('.lpl-b-pip'),bFull=q('.lpl-b-full'),bBig=q('.lpl-big'),bSkB=q('.lpl-sk-b'),bSkF=q('.lpl-sk-f'),vol=q('.lpl-vrange'),
        hT=q('.lpl-head .lpl-t'),hC=q('.lpl-head .lpl-c');
  let vid='',hideT,menuOpen=false,dragging=false,barHover=false,active=false,rafId=0,pw=1,lastSave=0,spinT=0,view='main',tw=0,osdT,tipT,touchShown=false,lx=-1,ly=-1;
  const KEY=()=>'aimm.mwtm.resume.'+vid,dur=()=>isFinite(v.duration)?v.duration:0,shown=()=>frame.classList.contains('is-local');

  function sync(){const ended=v.ended,playing=!v.paused&&!ended;
    L.classList.toggle('lpl-is-playing',playing);L.classList.toggle('lpl-is-paused',!playing);L.classList.toggle('lpl-is-ended',ended);
    bPlay.setAttribute('aria-label',playing?'Pause':ended?'Replay':'Play');bPlay.dataset.tip=playing?'Pause (k)':ended?'Replay':'Play (k)';bBig.setAttribute('aria-label',playing?'Pause video':ended?'Replay':'Play video');showCtl()}
  function syncVol(){const m=v.muted||v.volume===0;L.classList.toggle('lpl-is-muted',m);bMute.setAttribute('aria-label',m?'Unmute':'Mute');bMute.dataset.tip=m?'Unmute (m)':'Mute (m)';
    const p=Math.round((m?0:v.volume)*100);vol.value=p;vol.style.setProperty('--v',p+'%')}

  const canHide=()=>!v.paused&&!v.ended&&!menuOpen&&!dragging&&!barHover&&!bar.matches(':has(:focus-visible)');
  function showCtl(){L.classList.remove('lpl-idle');clearTimeout(hideT);hideT=setTimeout(()=>{if(canHide())L.classList.add('lpl-idle')},HIDE_MS)}
  L.addEventListener('pointermove',e=>{if(e.clientX===lx&&e.clientY===ly)return;lx=e.clientX;ly=e.clientY;showCtl()});
  L.addEventListener('pointerleave',()=>{barHover=false;showCtl()});
  bar.addEventListener('pointerenter',()=>{barHover=true});bar.addEventListener('pointerleave',()=>{barHover=false;showCtl()});
  L.addEventListener('focusin',showCtl);

  function showOsd(icon,label){const svg=osd.querySelector('svg');svg.style.display=icon?'':'none';if(icon)osd.querySelector('use').setAttribute('href','#lpi-'+icon);
    osd.querySelector('span').textContent=label||'';osd.classList.remove('lpl-out');osd.classList.add('lpl-show');clearTimeout(osdT);
    osdT=setTimeout(()=>{osd.classList.add('lpl-out');osd.classList.remove('lpl-show')},700);live.textContent=label||''}

  function toggle(){if(v.ended)v.currentTime=0;v.paused||v.ended?v.play().catch(()=>{}):v.pause()}
  function seekTo(t,i,txt){const d=dur();v.currentTime=clamp(t,0,d||t);paint();if(txt!==undefined)showOsd(i,txt);showCtl()}
  function seekBy(dt){seekTo(v.currentTime+dt,dt<0?'back-10':'fwd-10',(dt<0?'-':'+')+Math.abs(dt)+' s')}
  function setVol(x,flash){x=clamp(x,0,1);v.volume=x;v.muted=x===0;ls.set('aimm.mwtm.vol',x);if(flash)showOsd(x===0?'volume-x':'volume',Math.round(x*100)+'%')}
  function toggleMute(flash){v.muted=!v.muted;if(!v.muted&&v.volume===0)v.volume=.5;if(flash)showOsd(v.muted?'volume-x':'volume',v.muted?'Muted':Math.round(v.volume*100)+'%')}
  const spLabel=r=>r===1?'Normal':String(r);
  function setSpeed(r,flash){r=clamp(r,.5,2);v.playbackRate=r;pw=r;ls.set('aimm.mwtm.speed',r);if(flash)showOsd(null,r===1?'Normal speed':r+'x');buildMenu()}
  async function toggleFull(){const el=document.fullscreenElement||document.webkitFullscreenElement;
    try{if(el){await(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{await(L.requestFullscreen||L.webkitRequestFullscreen).call(L)}}catch(e){}}
  document.addEventListener('fullscreenchange',()=>{const f=document.fullscreenElement===L;L.classList.toggle('lpl-is-full',f);bFull.setAttribute('aria-label',f?'Exit full screen':'Full screen');bFull.dataset.tip=f?'Exit full screen (f)':'Full screen (f)';paint();showCtl()});
  bPip.hidden=!document.pictureInPictureEnabled;
  bPip.addEventListener('click',async()=>{try{document.pictureInPictureElement?await document.exitPictureInPicture():await v.requestPictureInPicture()}catch(e){}});

  const measure=()=>{tw=track.clientWidth};new ResizeObserver(()=>{measure();paint()}).observe(track);
  function paint(){const d=dur(),t=v.currentTime||0,p=d?t/d:0;played.style.transform='scaleX('+p+')';mini.style.transform='scaleX('+p+')';dot.style.setProperty('--dx',(p*tw)+'px');timeEl.textContent=fmt(t)+' / '+fmt(d)}
  function paintBuf(){const d=dur();if(!d)return;const b=v.buffered,t=v.currentTime;let s=0,e=0;for(let i=0;i<b.length;i++){if(b.start(i)<=t+.25&&b.end(i)>=t){s=b.start(i);e=b.end(i);break}}buf.style.transform='translateX('+(s/d*100)+'%) scaleX('+((e-s)/d)+')'}
  function aria(){prog.setAttribute('aria-valuemax',Math.floor(dur()));prog.setAttribute('aria-valuenow',Math.floor(v.currentTime));prog.setAttribute('aria-valuetext',fmt(v.currentTime)+' of '+fmt(dur()))}
  function loop(){paint();rafId=(!v.paused&&!v.ended)?requestAnimationFrame(loop):0}
  const startLoop=()=>{if(!rafId)rafId=requestAnimationFrame(loop)};

  const pct=e=>{const r=track.getBoundingClientRect();return clamp((e.clientX-r.left)/r.width,0,1)};
  function hoverAt(e){const p=pct(e);hovEl.style.transform='scaleX('+p+')';tip.textContent=fmt(p*dur());const w=tip.offsetWidth;tip.style.setProperty('--tx',clamp(p*tw-w/2,-4,tw-w+4)+'px')}
  prog.addEventListener('pointermove',e=>{hoverAt(e);if(dragging){v.currentTime=pct(e)*dur();paint()}});
  prog.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;prog.classList.add('lpl-drag');L.classList.add('lpl-scrub');prog.setPointerCapture(e.pointerId);hoverAt(e);v.currentTime=pct(e)*dur();paint();showCtl();closeMenu()});
  const endDrag=()=>{if(!dragging)return;dragging=false;prog.classList.remove('lpl-drag');L.classList.remove('lpl-scrub');showCtl();aria()};
  prog.addEventListener('pointerup',e=>{endDrag();if(e.pointerType==='mouse')prog.blur()});prog.addEventListener('pointercancel',endDrag);

  function mk(cls,html,attrs){const b=document.createElement('button');b.type='button';b.className='lpl-mi '+(cls?cls.split(' ').map(x=>'lpl-'+x).join(' '):'');b.innerHTML=html;b.setAttribute('role',(attrs&&attrs.role)||'menuitem');if(attrs)Object.keys(attrs).forEach(k=>k!=='role'&&b.setAttribute(k,attrs[k]));return b}
  function buildMenu(){menu.replaceChildren();
    if(view==='main'){const b=mk('','<span class="lpl-lbl">Playback speed</span><span class="lpl-val">'+spLabel(pw)+'</span>'+ic('chev'));b.onclick=()=>{view='speed';buildMenu();focusFirst(true)};menu.append(b)}
    else{const h=mk('head2',ic('chev','back')+'<span class="lpl-lbl">Playback speed</span>');h.onclick=()=>{view='main';buildMenu();focusFirst()};menu.append(h);
      SPEEDS.forEach(r=>{const b=mk('',ic('check','ck')+'<span class="lpl-lbl">'+spLabel(r)+'</span>',{role:'menuitemradio','aria-checked':String(r===pw)});b.dataset.r=r;b.onclick=()=>{setSpeed(r);closeMenu(true)};menu.append(b)})}}
  function focusFirst(sel){const items=[...menu.querySelectorAll('.lpl-mi')],t=(sel&&menu.querySelector('[aria-checked=true]'))||items[0];if(t){t.focus();t.scrollIntoView({block:'nearest'})}}
  function openMenu(kbd){view='main';buildMenu();menuOpen=true;L.classList.add('lpl-menu-open');menu.classList.add('lpl-open');bGear.classList.add('lpl-open');bGear.setAttribute('aria-expanded','true');showCtl();if(kbd)focusFirst()}
  function closeMenu(refocus){if(!menuOpen)return;menuOpen=false;L.classList.remove('lpl-menu-open');menu.classList.remove('lpl-open');bGear.classList.remove('lpl-open');bGear.setAttribute('aria-expanded','false');if(refocus)bGear.focus({focusVisible:true});showCtl()}
  bGear.addEventListener('click',e=>{menuOpen?closeMenu():openMenu(e.detail===0)});
  menu.addEventListener('keydown',e=>{const items=[...menu.querySelectorAll('.lpl-mi')],i=items.indexOf(document.activeElement),k=e.key,stop=()=>{e.preventDefault();e.stopPropagation()};
    if(k==='ArrowDown'){items[(i+1)%items.length].focus();stop()}else if(k==='ArrowUp'){items[(i-1+items.length)%items.length].focus();stop()}
    else if(k==='ArrowLeft'&&view==='speed'){view='main';buildMenu();focusFirst();stop()}else if(k==='ArrowRight'&&view==='main'){items[0].click();stop()}
    else if(k==='Escape'){closeMenu(true);stop()}else if(k==='Tab')closeMenu()});
  document.addEventListener('pointerdown',e=>{active=L.contains(e.target);if(menuOpen&&!menu.contains(e.target)&&!bGear.contains(e.target))closeMenu()});
  L.addEventListener('pointerenter',()=>{active=true});

  function showBtip(b){clearTimeout(tipT);tipT=setTimeout(()=>{if(!b.dataset.tip||(menuOpen&&b===bGear))return;btip.textContent=b.dataset.tip;
    const fr=L.getBoundingClientRect(),br=b.getBoundingClientRect(),w=btip.offsetWidth;btip.style.transform='translateX('+clamp(br.left-fr.left+br.width/2-w/2,8,fr.width-w-8)+'px)';btip.classList.add('lpl-on')},b===document.activeElement?0:450)}
  const hideBtip=()=>{clearTimeout(tipT);btip.classList.remove('lpl-on')};
  bar.querySelectorAll('.lpl-cb').forEach(b=>{b.addEventListener('pointerenter',()=>showBtip(b));b.addEventListener('pointerleave',hideBtip);
    b.addEventListener('focus',()=>{if(b.matches(':focus-visible'))showBtip(b)});b.addEventListener('blur',hideBtip);b.addEventListener('click',e=>{hideBtip();if(e.detail>0)b.blur()})});

  v.addEventListener('pointerdown',e=>{touchShown=(e.pointerType==='touch'&&L.classList.contains('lpl-idle'))});
  v.addEventListener('click',()=>{if(menuOpen){closeMenu();return}if(touchShown){touchShown=false;showCtl();return}toggle();L.focus({preventScroll:true})});
  v.addEventListener('dblclick',e=>{e.preventDefault();toggleFull()});
  bBig.addEventListener('click',()=>toggle());bSkB.addEventListener('click',()=>seekBy(-10));bSkF.addEventListener('click',()=>seekBy(10));bPlay.addEventListener('click',()=>toggle());bMute.addEventListener('click',()=>toggleMute());bFull.addEventListener('click',()=>toggleFull());
  vol.addEventListener('input',()=>setVol(vol.value/100));
  q('.lpl-retry').addEventListener('click',()=>{L.classList.remove('lpl-is-fail');v.load()});

  /* capture phase on window so the page's own shortcuts (for example the spacebar push-to-talk) do not also fire */
  window.addEventListener('keydown',e=>{
    if(!shown()||e.ctrlKey||e.metaKey||e.altKey)return;
    const t=e.target;if(!(active||L.contains(t)||document.fullscreenElement===L))return;
    if(t.matches&&t.matches('input:not([type=range]),textarea,select,[contenteditable]'))return;
    const k=e.key,onBtn=t.tagName==='BUTTON',onRange=t.type==='range';
    if((k===' '||k==='Enter')&&onBtn){e.stopPropagation();return}
    if(onRange&&k.startsWith('Arrow'))return;
    if(menu.contains(t))return;
    let used=true;
    switch(k){
      case' ':case'k':case'K':toggle();showOsd(v.paused?'pause':'play','');break;
      case'j':case'J':seekBy(-10);break;case'l':case'L':seekBy(10);break;
      case'ArrowLeft':seekBy(-5);break;case'ArrowRight':seekBy(5);break;
      case'ArrowUp':setVol((v.muted?0:v.volume)+.05,true);break;case'ArrowDown':setVol((v.muted?0:v.volume)-.05,true);break;
      case'm':case'M':toggleMute(true);break;case'f':case'F':toggleFull();break;
      case'Home':seekTo(0,'back-10','0:00');break;case'End':seekTo(dur(),null,fmt(dur()));break;
      case',':if(v.paused){seekTo(v.currentTime-1/FPS);showOsd(null,'Previous frame')}else used=false;break;
      case'.':if(v.paused){seekTo(v.currentTime+1/FPS);showOsd(null,'Next frame')}else used=false;break;
      case'<':setSpeed(SPEEDS[Math.max(0,SPEEDS.indexOf(pw)-1)],true);break;
      case'>':setSpeed(SPEEDS[Math.min(SPEEDS.length-1,SPEEDS.indexOf(pw)+1)],true);break;
      case'Escape':if(menuOpen)closeMenu(true);else used=false;break;
      default:if(/^[0-9]$/.test(k)&&dur())seekTo(dur()*Number(k)/10,null,k*10+'%');else used=false}
    if(used){e.preventDefault();e.stopPropagation();showCtl()}
  },true);

  const spinOn=()=>{clearTimeout(spinT);spinT=setTimeout(()=>L.classList.add('lpl-is-loading'),250)},spinOff=()=>{clearTimeout(spinT);L.classList.remove('lpl-is-loading')};
  ['waiting','seeking','loadstart','stalled'].forEach(n=>v.addEventListener(n,spinOn));
  ['canplay','playing','seeked','loadeddata'].forEach(n=>v.addEventListener(n,()=>{if(v.readyState>=3||(n==='loadeddata'&&v.readyState>=2))spinOff()}));
  v.addEventListener('play',()=>{sync();startLoop()});v.addEventListener('pause',()=>{sync();paint();save(true)});
  v.addEventListener('ended',()=>{sync();paint();ls.del(KEY())});v.addEventListener('volumechange',syncVol);v.addEventListener('ratechange',()=>{pw=v.playbackRate});
  v.addEventListener('progress',paintBuf);v.addEventListener('timeupdate',()=>{paintBuf();aria();save()});v.addEventListener('durationchange',()=>{measure();paint();paintBuf();aria()});
  v.addEventListener('error',()=>{if(!v.getAttribute('src'))return;spinOff();L.classList.add('lpl-is-fail')});
  v.addEventListener('loadedmetadata',()=>{measure();const s=parseFloat(ls.get(KEY())),d=dur();if(s>5&&d&&s<d-10){v.currentTime=s;showOsd(null,'Resumed at '+fmt(s))}paint()});
  function save(force){const now=Date.now();if(!force&&now-lastSave<3000)return;lastSave=now;if(!vid||!shown())return;const t=v.currentTime,d=dur();if(!d||v.ended)return;if(t>5&&t<d-10)ls.set(KEY(),String(t));else ls.del(KEY())}
  addEventListener('pagehide',()=>save(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)save(true)});

  const sv=parseFloat(ls.get('aimm.mwtm.vol'));if(!isNaN(sv))v.volume=clamp(sv,0,1);
  const ss=parseFloat(ls.get('aimm.mwtm.speed'));if(SPEEDS.indexOf(ss)>-1){v.playbackRate=ss;pw=ss}
  syncVol();sync();buildMenu();

  const api={el:L,video:v,
    show(o){ /* o: {id,title,channel,src,autoplay} */
      if(vid&&vid!==o.id)save(true);
      vid=o.id;hT.textContent=o.title||'';hC.textContent=o.channel||'';L.classList.remove('lpl-is-fail','lpl-is-ended','lpl-scrub','lpl-menu-open');closeMenu();
      frame.classList.add('is-local');
      v.pause();v.src=o.src+(o.src.indexOf('#')<0?'#t=0.1':'');v.load();v.playbackRate=pw;
      if(o.autoplay)v.play().catch(()=>{});sync();measure();paint();L.classList.remove('lpl-idle');spinOn()},
    hide(){save(true);v.pause();v.removeAttribute('src');v.load();vid='';closeMenu();frame.classList.remove('is-local');
      if(document.fullscreenElement===L)document.exitFullscreen().catch(()=>{})}};
  frame.__lpl=api;return api;
}
window.AimmLocalPlayer={attach};
})();
