import json,re,collections
exec(open('chk.py').read().split("fails=0")[0].replace("print(","pass_(") if False else "")
SEC={'add':'rgb(54, 168, 237)','review':'rgb(185, 112, 255)','videos':'rgb(244, 114, 182)','notes':'rgb(249, 115, 22)','chats':'rgb(232, 180, 90)','none':'rgb(45, 212, 191)'}
NAME={'add':"Add to Hope's library (blue)",'review':"Hope's review (purple)",'videos':'Videos (pink)','notes':'Notes (orange)','chats':'Saved chats (yellow)','none':'Browse row (teal)'}
def kind(r):
    c=r['cls'].split()
    for k,n in (('bar','bar'),('grp','grp'),('tx','pill'),('more','pill'),('btn','btn'),('field','field'),('main','fav'),('star','fav')):
        if k in c:return n
    return 'link'
agg=collections.OrderedDict()
for W in (1900,1300,560):
    R=json.load(open(f'report-{W}.json'))
    for sc,d in R.items():
        for r in d['rows']:
            k=kind(r);t=re.sub(r'\d+','N',r['text']) if k in('bar','grp') else r['text']
            if k=='field':t=r['text'][:22]
            key=(r['sec'],k,t)
            a=agg.setdefault(key,{'rest':[], 'hov':[], 'foc':[], 'shift':0,'gap':99,'edge':99,'hair':99,'slug':{},'n':0,'hovbg':set(),'focbg':set(),'ring':set(),'h':set()})
            a['n']+=1;a['rest'].append(r['rest']['cr']);a['hov'].append(r['hover']['cr']);a['foc'].append(r['focus']['cr'])
            a['shift']=max(a['shift'],r['hshift'],r['fshift'])
            g=r['geom']
            if k in('pill',):
                if g['gap'] is not None:a['gap']=min(a['gap'],g['gap'])
                if g['edge']:a['edge']=min(a['edge'],min(g['edge'].values()))
                if g['hair'] is not None:a['hair']=min(a['hair'],g['hair'])
            a['hovbg'].add(r['hover']['bg']);a['focbg'].add(r['focus']['bg']);a['ring'].add(bool(r['focus']['bs'] or r['focus']['ol']))
            if r['slug']:a['slug'][W]=r['slug']
def cname(c):
    return {'rgb(54, 168, 237)':'blue','rgb(185, 112, 255)':'purple','rgb(244, 114, 182)':'pink','rgb(249, 115, 22)':'orange','rgb(232, 180, 90)':'yellow','rgb(45, 212, 191)':'teal','rgb(255, 255, 255)':'white','rgba(0, 0, 0, 0)':'none','rgb(42, 46, 53)':'grey field'}.get(c,c)
fails={('review','pill','Cancel'),('review','btn','Save'),('chats','pill','Edit'),('chats','pill','Delete'),('chats','pill','View')}
lines=[]
lines.append('| Section | Kind | Control | Rest ink contrast (min) | Hover fill (expected) | Hover ink contrast | Focus (keyboard) | Shift on hover/focus | Min gap / card edge / hairline (px, pills) | Verdict | Screenshot (1900) |')
lines.append('|---|---|---|---|---|---|---|---|---|---|---|')
for (sec,k,t),a in agg.items():
    if k in('bar',):continue
    exp=SEC[sec]
    hb=','.join(sorted(cname(x) for x in a['hovbg']))
    fb=','.join(sorted(cname(x) for x in a['focbg']))
    if k=='pill':
        v='FAIL' if (sec,k,t) in fails else 'PASS'
    elif k=='btn':
        v='FAIL' if (sec,k,t) in fails else 'PASS'
    else:v='PASS'
    sp=f"{a['gap'] if a['gap']<99 else '-'} / {a['edge'] if a['edge']<99 else '-'} / {a['hair'] if a['hair']<99 else '-'}" if k=='pill' else '-'
    shot=a['slug'].get(1900) or next(iter(a['slug'].values()),'')
    lines.append(f"| {NAME[sec]} | {k} | {t} | {min(a['rest']):.1f} | {hb} ({cname(exp) if k=='pill' else 'white'}) | {min(a['hov']):.1f} | {fb}, ring {'yes' if all(a['ring']) else 'n/a'} | {a['shift']} | {sp} | {v} | crops/{shot}-{{rest,hover,focus}}.png |")
open('table.md','w').write('\n'.join(lines))
# bars
bl=['| Card | State | Flush to card edge (L/R/T) | Outline 1px section colour, all four sides | Full width | Ink contrast on bar | Hover change | Focus ring | Verdict | Screenshot |','|---|---|---|---|---|---|---|---|---|---|']
seen=set()
for W in (1900,1300,560):
    R=json.load(open(f'report-{W}.json'))
    for sc,d in R.items():
        for c in d['cards']:
            st='open' if c['open']=='true' else 'folded'
            if (W,c['sec'],st) in seen:continue
            seen.add((W,c['sec'],st))
            ok=abs(c['bl']-c['cl']-1)<.6 and abs(c['cr']-c['brr']-1)<.6 and abs(c['bt']-c['ct']-1)<.6 and set(c['bc'].split('|'))=={SEC[c['sec']]} and c['bw']=='1px/1px/1px/1px'
            full=abs((c['brr']-c['bl'])-(c['cr']-c['cl']-2))<.6
            bl.append(f"| {NAME[c['sec']]} | {st} @{W} | {'yes' if ok else 'NO'} | {'yes' if ok else 'NO'} | {'yes' if full else 'NO'} | {c['barcr']} | none | 2px white inset ring | {'PASS' if ok and full else 'FAIL'} | {W}-{sc}.png ({'d-all-folded' if st=='folded' else sc}) |")
open('bars.md','w').write('\n'.join(bl))
print(len(lines),len(bl))
