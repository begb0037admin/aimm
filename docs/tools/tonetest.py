import sys,json,uuid,time,subprocess,struct,urllib.request,numpy as np
tone=sys.argv[1]; B="http://127.0.0.1:41735"; H={"Origin":"https://aimixmasters.com","Content-Type":"application/json"}
def call(m,p,body=None):
    r=urllib.request.Request(B+p,data=(json.dumps(body).encode() if body is not None else None),headers=H,method=m)
    with urllib.request.urlopen(r,timeout=20) as f: return f.read()
sid=str(uuid.uuid4())
print("status:",json.loads(call("GET","/status")).get("status"))
call("POST","/capture/start",{"sessionId":sid})
time.sleep(1.0)
p=subprocess.Popen(["afplay",tone]); time.sleep(8); p.terminate()
call("POST","/capture/stop",{"sessionId":sid})
w=call("GET","/capture.wav?sessionId="+sid)
fmt=struct.unpack('<H',w[20:22])[0]; ch=struct.unpack('<H',w[22:24])[0]; sr=struct.unpack('<I',w[24:28])[0]; bits=struct.unpack('<H',w[34:36])[0]
i=12
while i<len(w)-8:
    cid=w[i:i+4]; sz=struct.unpack('<I',w[i+4:i+8])[0]
    if cid==b'data': d=w[i+8:i+8+sz]; break
    i+=8+sz
x=np.frombuffer(d,dtype='<f4' if fmt==3 else '<i2').astype(np.float64)
if fmt!=3: x/=32768
x=x.reshape(-1,ch); print("wav: fmt",fmt,"ch",ch,"sr",sr,"bits",bits,"seconds",round(len(x)/sr,1))
m=x.mean(axis=1); seg=m[int(sr*2):int(sr*7)]
pk=20*np.log10(np.max(np.abs(seg))+1e-12); rms=20*np.log10(np.sqrt(np.mean(seg**2))+1e-12)
f=np.abs(np.fft.rfft(seg*np.hanning(len(seg)))); k=np.argmax(f); freq=k*sr/len(seg)
amp=2*f[k]/np.sum(np.hanning(len(seg))); tonedb=20*np.log10(amp+1e-12)
print(f"measured peak {pk:.2f} dBFS | rms {rms:.2f} dBFS | dominant {freq:.0f} Hz at {tonedb:.2f} dBFS (expected -20.00 / -23.01 / 1000 Hz at -20.00)")
