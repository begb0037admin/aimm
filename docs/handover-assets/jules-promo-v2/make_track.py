# Generates an original synthetic test loop "Midnight Drive" (no samples, royalty-free).
import numpy as np, wave
sr=44100; bpm=118; beat=60/bpm; bars=14; n=int(sr*beat*4*bars)
t=np.arange(n)/sr; out=np.zeros((2,n))
rng=np.random.default_rng(7)
def add(ch,start,sig,g=1.0):
    s=int(start*sr); e=min(n,s+len(sig))
    if s<n:
        for c in ch: out[c,s:e]+=sig[:e-s]*g
for i in range(int(bars*4)):
    b0=i*beat
    k=np.arange(int(sr*.35))/sr
    kick=np.sin(2*np.pi*(45*k+110*(1-np.exp(-k*30))/30))*np.exp(-k*9)
    add([0,1],b0,kick,.95)
    for h in (0.5,1.0):
        k2=np.arange(int(sr*.06))/sr
        hat=rng.standard_normal(len(k2))*np.exp(-k2*70)
        hat=np.diff(hat,prepend=0)
        add([0],b0+beat*.5,hat,.28); add([1],b0+beat*.5+.011,np.diff(rng.standard_normal(len(k2))*np.exp(-k2*70),prepend=0),.28)
    if i%4 in (1,3):
        k3=np.arange(int(sr*.25))/sr
        sn=(rng.standard_normal(len(k3))*.6+np.sin(2*np.pi*190*k3)*.5)*np.exp(-k3*22)
        add([0,1],b0,sn,.55)
roots=[110,87.31,130.81,98.0]
for bar in range(bars):
    f=roots[bar%4]; s0=bar*4*beat
    for st in range(8):
        k=np.arange(int(sr*beat*.5))/sr
        bass=np.sin(2*np.pi*f*k)*np.exp(-k*3)+.4*np.sin(2*np.pi*2*f*k)*np.exp(-k*5)
        add([0,1],s0+st*beat*.5,bass,.7)
    for j,m in enumerate((1,1.2599,1.4983,1.8877)):
        k=np.arange(int(sr*beat*4))/sr
        pad=sum(np.sin(2*np.pi*f*4*m*k*(1+d))for d in(-.004,0,.004))/3
        pad*=np.minimum(k*6,1)*np.exp(-k*.5)
        add([0],s0,pad,.10); add([1],s0+.013+j*.002,pad[::1],.10)
    if bar>=2:
        for st in range(16):
            k=np.arange(int(sr*beat*.25))/sr
            note=f*8*(1.5 if st%4==2 else 1)
            pl=np.sign(np.sin(2*np.pi*note*k))*np.exp(-k*18)
            add([0,1] if st%2 else [1,0],s0+st*beat*.25,pl,.07)
out/=np.max(np.abs(out)); out*=.89
out=np.tanh(out*1.6)/np.tanh(1.6)*.93
pcm=(out.T*32767).astype('<i2')
w=wave.open('Midnight-Drive.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(pcm.tobytes());w.close()
