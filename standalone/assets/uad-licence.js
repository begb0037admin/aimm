(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.UadLicence=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const norm=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const licenceName=value=>norm(String(value||'').replace(/^\s*universal\s+audio\s*:\s*/i,''));
  const isUad=(name,vendor)=>/^uad(?:x)?\b/i.test(String(name||''))||/^\s*universal\s+audio\s*:/i.test(String(name||''))||['universal audio','uaudio'].includes(norm(vendor));
  const names=data=>new Set((data?.accounts||[]).filter(entry=>['certain','probable','unsure'].includes(entry.confidence)).flatMap(entry=>entry.scanned_names||[]).map(licenceName));
  const licensed=(name,vendor,data,override=false)=>!isUad(name,vendor)||override||Boolean(data&&names(data).has(licenceName(name)));
  const split=(groups,data,override=()=>false)=>{
    const owned=[],notLicensed=[];
    for(const group of groups)(licensed(group.name,group.vendor,data,override(group))?owned:notLicensed).push(group);
    return {owned,notLicensed};
  };
  return {norm,isUad,names,licensed,split};
});
