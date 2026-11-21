(function(root){
  'use strict';
  const norm=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const key=item=>norm(item.publisher)+'|'+norm(item.name);
  const chains=data=>data.chains||{vocal:data};
  function getChain(data,chain='vocal'){
    const result=chains(data)[chain];
    if(!result)throw Error('Unknown chain: '+chain);
    return result;
  }
  function targets(data){
    const unique=new Map();
    for(const item of data.owned||[])unique.set(key(item),item);
    for(const row of data.missing||[])for(const item of row.equivalents||[])if(!unique.has(key(item)))unique.set(key(item),item);
    return [...unique.values()];
  }
  function selections(data,names){
    const installed=targets(data),stock=(data.stock?.logic||[]);
    if(names===undefined)return {installed,stock,unknown:[]};
    if(!Array.isArray(names)||names.some(name=>typeof name!=='string'))throw Error('names must be an array of exact item names.');
    const wanted=new Set(names);
    const found=new Set();
    const chosenInstalled=installed.filter(item=>{if(wanted.has(item.name)){found.add(item.name);return true}return false});
    const chosenStock=stock.filter(item=>{if(wanted.has(item.name)){found.add(item.name);return true}return false});
    return {installed:chosenInstalled,stock:chosenStock,unknown:[...wanted].filter(name=>!found.has(name))};
  }
  function resolve(data,rows,names){
    const scan=new Map();
    for(const row of rows||[])if(row.name&&row.vendor){const k=norm(row.vendor)+'|'+norm(row.name);if(!scan.has(k))scan.set(k,{name:row.name,publisher:row.vendor});}
    const resolved=[],unresolved=[];
    for(const item of selections(data,names).installed){const found=scan.get(key(item));(found?resolved:unresolved).push(found||item);}
    return {resolved,unresolved};
  }
  async function apply(data,rows,{setFavorite,isFavorite,saveStock,readStock},names){
    const selected=selections(data,names);
    const {resolved,unresolved}=resolve(data,rows,names);
    let starred=0,already=0;const failed=[];
    for(const item of resolved){
      if(isFavorite(item)){already++;continue;}
      const result=await setFavorite(item);
      if(result?.ok&&isFavorite(item))starred++;else failed.push(item);
    }
    const wanted=selected.stock.map(item=>item.name);
    const before=new Set(readStock());
    if(wanted.some(name=>!before.has(name)))await saveStock([...new Set([...before,...wanted])]);
    const stored=new Set(readStock());
    for(const name of wanted){
      if(!stored.has(name)){failed.push({name,publisher:'Logic Pro 13 stock'});continue;}
      if(before.has(name))already++;else starred++;
    }
    return {ok:failed.length===0&&unresolved.length===0&&selected.unknown.length===0,starred,already,unresolved:unresolved.length+selected.unknown.length,unresolved_items:[...unresolved,...selected.unknown.map(name=>({name}))],not_saved:failed};
  }
  root.VocalFavs={norm,chains,getChain,targets,selections,resolve,apply};
  if(typeof module!=='undefined')module.exports=root.VocalFavs;
})(typeof window!=='undefined'?window:globalThis);
