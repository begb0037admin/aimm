import re,sys,json
def styles(p):
    h=open(p,encoding='utf8').read()
    return re.findall(r'<style[^>]*>(.*?)</style>',h,re.S)
def parse(css,ctx=''):
    out=[];i=0;n=len(css)
    css=re.sub(r'/\*.*?\*/','',css,flags=re.S);n=len(css)
    while i<n:
        j=css.find('{',i)
        if j<0:break
        sel=css[i:j].strip()
        d=1;k=j+1
        while k<n and d:
            if css[k]=='{':d+=1
            elif css[k]=='}':d-=1
            k+=1
        body=css[j+1:k-1]
        if sel.startswith('@media') or sel.startswith('@supports') or sel.startswith('@layer'):
            out+=parse(body,ctx+sel+' ')
        elif sel.startswith('@'):
            out.append((ctx+sel,re.sub(r'\s+',' ',body).strip()))
        else:
            out.append((ctx+re.sub(r'\s+',' ',sel),re.sub(r'\s+',' ',body).strip()))
        i=k
    return out
def allrules(p):
    r=[]
    for s in styles(p): r+=parse(s)
    return r
if __name__=='__main__':
    o=allrules('old.html');n=allrules('new.html')
    print(len(o),len(n))
    json.dump({'old':o,'new':n},open('rules.json','w'))
    so=set(o);sn=set(n)
    rem=[r for r in o if r not in sn];add=[r for r in n if r not in so]
    print(len(rem),len(add))
    json.dump({'rem':rem,'add':add},open('delta.json','w'),indent=0)
