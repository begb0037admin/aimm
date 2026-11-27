(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PublisherNames=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const key=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const overrides={uaudio:'Universal Audio',universalaudio:'Universal Audio',ikmultimedia:'IK Multimedia',izotope:'iZotope',pluginalliance:'Plugin Alliance',nativeinstruments:'Native Instruments',bettermaker:'BetterMaker',hitnmix:"Hit'n'Mix",lindellplugins:'Lindell Plugins',meldaproduction:'MeldaProduction',oeksound:'Oeksound',sonible:'Sonible',wavesfactory:'Wavesfactory',fabfilter:'FabFilter',imageline:'Image-Line',harrisonaudio:'Harrison Audio',pluginsthatknock:'Plugins That Knock',acondigital:'Acon Digital',aurallysound:'Aurally Sound',siraudiotools:'SIR Audio Tools',scalermusic:'Scaler Music',liquidsonics:'LiquidSonics',ujam:'UJAM',navied:'Navie D',streakyaudio:'Streaky Audio'};
  const seen=new Map();
  function observe(rows){for(const row of rows||[]){const raw=String(row.rawVendor||row.vendor||'').trim(),k=key(raw);if(!k)continue;const list=seen.get(k)||new Set();list.add(raw);seen.set(k,list);}}
  function canonicalVendor(raw){const value=String(raw||'').trim(),k=key(value);if(overrides[k])return overrides[k];const candidates=[...(seen.get(k)||[]),value].filter(Boolean);candidates.sort((a,b)=>score(b)-score(a)||a.localeCompare(b));const best=candidates[0]||'';if(/^[a-z0-9]+([-_][a-z0-9]+)+$/.test(best))return best.split(/[-_]/).map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');return /^[a-z]/.test(best)?best[0].toUpperCase()+best.slice(1):best;}
  function score(value){return (/[A-Z]/.test(value)?10:0)+(/[\s-]/.test(value)?2:0)+( /[a-z][A-Z]/.test(value)?1:0);}
  function cleanProductName(name,vendor){const value=String(name||'').trim(),match=value.match(/^([^:]+):\s+(.+)$/);return match&&key(canonicalVendor(match[1]))===key(canonicalVendor(vendor))?match[2].trim():value;}
  function normalizeRows(rows){observe(rows);return (rows||[]).map(row=>{const rawVendor=row.rawVendor||row.vendor||'',rawName=row.rawName||row.name||'',vendor=canonicalVendor(rawVendor);return {...row,rawVendor,rawName,vendor,name:cleanProductName(rawName,vendor)};});}
  function identity(vendor,name){const v=canonicalVendor(vendor);return {vendor:v,name:cleanProductName(name,v)};}
  return {key,observe,canonicalVendor,cleanProductName,normalizeRows,identity};
});
