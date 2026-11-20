(function(root){
  'use strict';
  const norm=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const key=item=>norm(item.publisher)+'|'+norm(item.name);
  function targets(data){
    const unique=new Map();
    for(const item of data.owned||[])unique.set(key(item),item);
    for(const row of data.missing||[])for(const item of row.equivalents||[])if(!unique.has(key(item)))unique.set(key(item),item);
    return [...unique.values()];
  }
  function resolve(data,rows){
    const scan=new Map();
    for(const row of rows||[])if(row.name&&row.vendor){const k=norm(row.vendor)+'|'+norm(row.name);if(!scan.has(k))scan.set(k,{name:row.name,publisher:row.vendor});}
    const resolved=[],unresolved=[];
    for(const item of targets(data)){const found=scan.get(key(item));(found?resolved:unresolved).push(found||item);}
    return {resolved,unresolved};
  }
  async function apply(data,rows,{setFavorite,isFavorite,saveStock,readStock}){
    const {resolved,unresolved}=resolve(data,rows);
    let starred=0,already=0,failed=[];
    for(const item of resolved){
      if(isFavorite(item)){already++;continue;}
      const result=await setFavorite(item);
      if(result&&result.ok&&isFavorite(item))starred++;else failed.push(item);
    }
    const wanted=(data.stock&&data.stock.logic||[]).map(item=>item.name);
    const before=new Set(readStock());
    const after=[...new Set([...before,...wanted])];
    const saved=await saveStock(after);
    const stored=new Set(readStock());
    for(const name of wanted){
      if(!saved||!stored.has(name)){failed.push({name,publisher:'Logic Pro 13 stock'});continue;}
      if(before.has(name))already++;else starred++;
    }
    return {ok:failed.length===0&&unresolved.length===0,starred,already,unresolved:unresolved.length,unresolved_items:unresolved,not_saved:failed};
  }
  root.VocalFavs={norm,targets,resolve,apply};
  if(typeof module!=='undefined')module.exports=root.VocalFavs;
})(typeof window!=='undefined'?window:globalThis);
