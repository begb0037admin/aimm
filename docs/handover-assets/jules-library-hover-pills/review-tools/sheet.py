import glob,os,sys
from PIL import Image,ImageDraw
W=sys.argv[1]
names=sorted({f.rsplit('-',1)[0] for f in glob.glob(f'{W}-*-rest.png')+glob.glob(f'{W}-*-hover.png')})
names=sorted({n[:-0] if False else n for n in [os.path.basename(f)[:-len('-rest.png')] for f in glob.glob(f'{W}-*-rest.png')]})
out='..'
per=12
CW=430
sheets=[]
for s in range(0,len(names),per):
    rows=[]
    for n in names[s:s+per]:
        ims=[]
        for st in ('rest','hover','focus'):
            p=f'{n}-{st}.png'
            im=Image.open(p).convert('RGB') if os.path.exists(p) else Image.new('RGB',(100,60),(80,0,0))
            if im.width>CW:im=im.resize((CW,max(1,int(im.height*CW/im.width))))
            ims.append(im)
        rows.append((n,ims))
    H=sum(max(i.height for i in ims)+22 for n,ims in rows)+6
    sh=Image.new('RGB',(CW*3+40,H),(0,0,0));d=ImageDraw.Draw(sh);y=0
    for n,ims in rows:
        d.text((4,y+4),n[len(W)+1:],fill=(255,255,0));y+=18
        x=0
        for im in ims:
            sh.paste(im,(x,y));x+=CW+10
        y+=max(i.height for i in ims)+4
    fn=f'{out}/sheet-{W}-{s//per+1}.png';sh.save(fn);sheets.append(fn)
print(len(names),sheets)
