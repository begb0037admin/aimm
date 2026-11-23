import re
P='dry/index.html'
L=open(P,encoding='utf8').read().split('\n')   # L[i] = line i+1
def rng(a,b): return set(range(a,b+1))
DEL=set()
for a,b in [(49,109),(1341,1352),(2110,2110),(2112,2119),(2221,2222),(2875,2884),(2914,2918),(3120,3120),(3122,3122),(3126,3126),(3129,3129),(3139,3142),(3144,3146),(3148,3150),(3152,3160),(4752,4753),(4755,4765),(4770,4771),(28121,28121),(28127,28128)]:
    DEL|=rng(a,b)
# sanity: show first/last of every range
for a,b in [(49,109),(1341,1352),(2110,2110),(2112,2119),(2221,2222),(2875,2884),(2914,2918),(3120,3120),(3122,3122),(3126,3126),(3129,3129),(3139,3142),(3144,3146),(3148,3150),(3152,3160),(4752,4753),(4755,4765),(4770,4771),(28121,28121),(28127,28128)]:
    print(a,b,'|',L[a-1][:70].replace('\n',' '),'||',L[b-1][:50])
# inline edits (shared selector lists)
ED={28062:('.aimm-btn,.tab.oz-tab,.inv-side-row','.aimm-btn,.inv-side-row'),
28068:(',.tab.oz-tab:not(.active):hover',''),
28072:(',.tab.oz-tab:active',''),
28075:('.tab.oz-tab.active,.tab.oz-tab[aria-selected="true"],',''),
28076:('.tab.oz-tab.active:hover,',''),
28080:(',.tabs.oz-tabstrip .tab.oz-tab:focus-visible',''),
28122:(':is(.tabs.oz-tabstrip .tab.oz-tab,.btn,',':is(.btn,'),
28124:(':is(.tabs.oz-tabstrip .tab.oz-tab,.btn,',':is(.btn,'),
28126:('.tabs.oz-tabstrip .tab.oz-tab:is(.active,[aria-selected="true"]),','')}
for ln,(a,b) in ED.items():
    assert a in L[ln-1],(ln,L[ln-1][:120]); L[ln-1]=L[ln-1].replace(a,b,1)
css=open('/Users/admin/github/aimm/docs/handover-assets/jules-tabbar/tabbar.css').read()
out=[]
for i,l in enumerate(L,1):
    if i in DEL: continue
    out.append(l)
t='\n'.join(out)
k=t.rindex('</style>'); t=t[:k]+css+'\n'+t[k:]
open(P,'w',encoding='utf8').write(t)
print('deleted',len(DEL),'lines')
