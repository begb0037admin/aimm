// Shared by the Library cue handler and scripts/check-mwtm-cue-map.mjs.
(function(root){
  function normalise(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
  function parts(id){
    const match=String(id||'').match(/^mwtm-(.+?)-(?:p)?(\d+)$/i);
    return match?{set:normalise(match[1]),part:Number(match[2])}:null;
  }
  function resolve(id,recordings,kbTitle=''){
    const rows=(recordings||[]).filter(row=>row&&typeof row.video_id==='string');
    const direct=rows.find(row=>row.video_id===id);
    if(direct)return direct;
    const requested=parts(id);
    if(!requested)return null;
    const candidates=rows.filter(row=>parts(row.video_id)?.part===requested.part);
    const sameSet=candidates.filter(row=>{
      const set=parts(row.video_id).set;
      return set===requested.set||set.replace(/(?:mixing|mastering|production|interview)$/,'')===requested.set;
    });
    if(sameSet.length===1)return sameSet[0];
    // Titles can identify a set when its folder name differs from the KB slug.
    // Never guess if more than one recording has the same title and part.
    const heading=normalise(String(kbTitle).split(/\s+[—–-]\s+Part\s+\d+/i)[0]);
    if(!heading)return null;
    const titleMatches=candidates.filter(row=>normalise(String(row.title||'').split(/\s+-\s+Part\s+\d+/i)[0]).endsWith(heading));
    return titleMatches.length===1?titleMatches[0]:null;
  }
  root.MwtmCueMap={resolve,parts};
})(globalThis);
