# usage: build.py FRAMES_DIR OUT.mp4 [music.wav]  -- resamples variable-rate screencast frames to CFR 30fps H.264
import json,sys,subprocess,os
d,out=sys.argv[1],sys.argv[2]
fr=json.load(open(os.path.join(d,'_frames.json')))
L=['ffconcat version 1.0']
for k,(i,t) in enumerate(fr):
    dur=(fr[k+1][1]-t) if k+1<len(fr) else 0.04
    L+= [f"file '{i:05d}.jpg'",f"duration {max(dur,0.001):.5f}"]
L.append(f"file '{fr[-1][0]:05d}.jpg'")
open(os.path.join(d,'list.txt'),'w').write('\n'.join(L))
total=fr[-1][1]-fr[0][1]
print('seconds',round(total,2))
cmd=['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',os.path.join(d,'list.txt')]
if len(sys.argv)>3: cmd+=['-ss','0','-i',sys.argv[3]]
cmd+=['-vf','fps=30,format=yuv420p','-c:v','libx264','-crf','17','-preset','medium','-movflags','+faststart']
if len(sys.argv)>3: cmd+=['-af',f'afade=t=in:d=1,afade=t=out:st={total-2.5:.2f}:d=2.5','-c:a','aac','-b:a','192k','-t',f'{total:.2f}']
cmd.append(out)
subprocess.run(cmd,check=True)
