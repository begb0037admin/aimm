import json,sys,collections
SEC={'add':'rgb(54, 168, 237)','review':'rgb(185, 112, 255)','videos':'rgb(244, 114, 182)','notes':'rgb(249, 115, 22)','chats':'rgb(232, 180, 90)','none':'rgb(45, 212, 191)'}
out={}
def kind(r):
    c=r['cls'].split()
    if 'bar' in c:return 'bar'
    if 'grp' in c:return 'grp'
    if 'tx' in c or 'more' in c:return 'pillbtn'
    if 'btn' in c:return 'btn'
    if 'field' in c:return 'field'
    if 'main' in c or 'star' in c:return 'favpill'
    return r['tag']
for W in (1900,1300,560):
    R=json.load(open(f'report-{W}.json'))
    for sc,d in R.items():
        for c in d['cards']:
            ok=abs(c['bl']-c['cl']-1)<.6 and abs(c['cr']-c['brr']-1)<.6 and abs(c['bt']-c['ct']-1)<.6 and set(c['bc'].split('|'))=={SEC[c['sec']]} and c['bw']=='1px/1px/1px/1px'
            out.setdefault(('card',c['sec'],'open' if c['open']=='true' else 'folded'),[]).append((W,sc,ok,f"flush+border {ok} contrast {c['barcr']}"))
        for r in d['rows']:
            k=kind(r);rs,hs,fs=r['rest'],r['hover'],r['focus'];g=r['geom'];issues=[]
            exp=SEC[r['sec']]
            if k=='pillbtn':
                if rs['cr']<4.5:issues.append(f"rest contrast {rs['cr']}")
                if rs['bg']!='rgba(0, 0, 0, 0)':issues.append('rest bg '+rs['bg'])
                if not r['hov']:issues.append('hover not matched')
                if hs['bg']!=exp:issues.append(f"hover bg {hs['bg']} want {exp}")
                if hs['cr']<4.5:issues.append(f"hover contrast {hs['cr']}")
                if fs['bg']!=exp or 'inset' not in fs['bs'] or not r['fv']:issues.append(f"focus bg {fs['bg']} ring {bool(fs['bs'])} fv {r['fv']}")
                if g['gap'] is not None and g['gap']<8:issues.append(f"pill gap {g['gap']} to {g['nb']}")
                e=g['edge']
                if e and min(e.values())<14:issues.append(f"edge {e}")
                if g['hair'] is not None and g['hair']<14:issues.append(f"hairline {g['hair']}")
                if rs['h']!=hs['h'] or rs['w']!=hs['w']:issues.append('size change')
            elif k=='btn':
                if rs['cr']<4.5 and 'disabled' not in r['cls']:issues.append(f"rest contrast {rs['cr']}")
                if hs['bg']!='rgb(255, 255, 255)' or hs['color']!='rgb(0, 0, 0)':issues.append(f"hover {hs['bg']}/{hs['color']}")
                if 'inset' not in fs['bs'] or fs['bg']!='rgb(255, 255, 255)':issues.append(f"focus {fs['bg']} {fs['bs'][:30]}")
                if g['gap'] is not None and g['gap']<8:issues.append(f"gap {g['gap']} {g['nb']}")
                if g['edge'] and min(g['edge'].values())<8:issues.append(f"edge {g['edge']}")
            elif k=='bar':
                if hs['bg']!=rs['bg'] or hs['color']!=rs['color']:issues.append('hover changes')
                if not fs['ol'] or fs['ol'].split()[0]!='2px':issues.append('focus ring '+fs['ol'])
            elif k=='grp':
                if hs['bg']!=rs['bg']:issues.append('hover changes '+hs['bg'])
                if 'rgb(255, 255, 255)' not in fs['bs']:issues.append('focus ring '+fs['bs'])
            elif k=='field':
                if 'rgb(255, 255, 255)' not in fs['bs']:issues.append('focus ring '+fs['bs'][:30])
            elif k=='favpill':
                pass
            if r['hshift']>0.5:issues.append(f"hover shift {r['hshift']}")
            if r['fshift']>0.5:issues.append(f"focus shift {r['fshift']}")
            out.setdefault((k,r['sec'],r['text'] if k!='field' else r['text'][:20]),[]).append((W,sc,not issues,'; '.join(issues),r))
fails=0
for key,v in sorted(out.items(),key=lambda x:str(x[0])):
    if key[0]=='card':continue
    bad=[x for x in v if not x[2]]
    # compress digits in text
    if bad:
        fails+=1
        print('FAIL',key,len(bad),'/',len(v))
        seen=set()
        for x in bad:
            m=(x[0],x[3])
            if m in seen:continue
            seen.add(m);print('    ',x[0],x[1],x[3][:230])
    else:print('PASS',key,len(v))
