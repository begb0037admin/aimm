// ─── HOPE SPHERE INTEGRATION ─────────────────────────────────
(function(){
  // ── SHADER SOURCE — ASCII array join, no backticks ──────────
  var VERT = [
    'uniform float uT;',
    'uniform float uAmp;',
    'uniform float uSpd;',
    'uniform float uRotY;',
    'uniform float uRotX;',
    'uniform float uRotZ;',
    'uniform float uScale;',
    'uniform vec3 uLightDir;',
    'attribute float aT;',
    'varying float vBright;',
    'void main() {',
    '  float cy = cos(uRotY);',
    '  float sy = sin(uRotY);',
    '  vec3 pos = vec3(',
    '    position.x * cy - position.z * sy,',
    '    position.y,',
    '    position.x * sy + position.z * cy',
    '  );',
    '  float cx = cos(uRotX);',
    '  float sx = sin(uRotX);',
    '  pos = vec3(',
    '    pos.x,',
    '    pos.y * cx - pos.z * sx,',
    '    pos.y * sx + pos.z * cx',
    '  );',
    '  float cz = cos(uRotZ);',
    '  float sz = sin(uRotZ);',
    '  pos = vec3(',
    '    pos.x * cz - pos.y * sz,',
    '    pos.x * sz + pos.y * cz,',
    '    pos.z',
    '  );',
    '  float n1 = sin(pos.x * 3.1 + uT * uSpd) *',
    '             cos(pos.y * 2.7 + uT * uSpd * 0.8);',
    '  float n2 = sin(pos.y * 3.7 + uT * uSpd * 1.2) *',
    '             cos(pos.z * 2.3 + uT * uSpd * 0.6);',
    '  float n3 = sin(pos.z * 2.9 + aT * 6.28 + uT * uSpd * 0.9) *',
    '             cos(pos.x * 3.3 + uT * uSpd * 1.1);',
    '  float noise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);',
    '  pos = pos + normalize(position) * noise * uAmp;',
    '  pos = pos * uScale;',
    '  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);',
    '  float depth = (-mvPos.z - 1.5) / 3.0;',
    '  vec3 norm = normalize(pos);',
    '  float diff = clamp(dot(norm, normalize(uLightDir)), 0.0, 1.0);',
    '  float rim  = pow(1.0 - clamp(dot(norm, vec3(0.0,0.0,1.0)), 0.0, 1.0), 2.5);',
    '  float fill = clamp(dot(norm, normalize(vec3(0.0, -0.6, 0.4))), 0.0, 1.0);',
    '  vBright = clamp(diff * 0.75 + fill * 0.3 + rim * 0.5 + 0.28, 0.0, 1.0);',
    '  gl_PointSize = clamp(2.5 * vBright + 0.8, 0.8, 3.5);',
    '  gl_Position = projectionMatrix * mvPos;',
    '}'
  ].join('\n');
  var FRAG = [
    'uniform vec3 uColor;',
    'uniform vec3 uColor2;',
    'uniform vec3 uColor3;',
    'uniform float uColorBlend;',
    'varying float vBright;',
    'void main() {',
    '  vec2 uv = gl_PointCoord - 0.5;',
    '  if (length(uv) * 2.0 > 1.0) discard;',
    '  vec3 col;',
    '  float b = uColorBlend;',
    '  if (b < 0.5) {',
    '    col = mix(uColor, uColor2, b * 2.0);',
    '  } else {',
    '    col = mix(uColor2, uColor3, (b - 0.5) * 2.0);',
    '  }',
    '  gl_FragColor = vec4(col * vBright, vBright);',
    '}'
  ].join('\n');
  // ── STATES ───────────────────────────────────────────────────
  var ANIM = { amp: 0.38, spd: 2.5, rotSpd: 1.10, scaleSpd: 0.0 };
  var STATES = {
    idle:     { amp: ANIM.amp, spd: ANIM.spd, rotSpd: ANIM.rotSpd, scaleSpd: 0.0, color: [0.60, 0.00, 1.00], color2: [0.80, 0.84, 0.88], color3: [0.60, 0.00, 1.00], blendSpd: 0.4 },
    speaking: { amp: ANIM.amp, spd: ANIM.spd, rotSpd: ANIM.rotSpd, scaleSpd: 0.0, color: [0.00, 1.00, 0.40], color2: [0.80, 0.84, 0.88], color3: [0.00, 1.00, 0.40], blendSpd: 0.8 },
    thinking: { amp: ANIM.amp, spd: ANIM.spd, rotSpd: ANIM.rotSpd, scaleSpd: 0.0, color: [0.80, 0.84, 0.88], color2: [0.80, 0.84, 0.88], color3: [0.80, 0.84, 0.88], blendSpd: 0.0 }
  };
  // EL voice state → sphere state map
  var STATE_MAP = {
    'idle':       'idle',
    'connecting': 'thinking',
    'recording':  'listening',
    'responding': 'speaking',
    'waiting':    'emphatic'
  };
  // ── GEOMETRY — fibonacci sphere 12000 points ─────────────────
  var N      = 12000;
  var golden = Math.PI * (3.0 - Math.sqrt(5.0));
  var positions = new Float32Array(N * 3);
  var aTArr     = new Float32Array(N);
  for (var i = 0; i < N; i++) {
    var y     = 1.0 - (i / (N - 1)) * 2.0;
    var r     = Math.sqrt(Math.max(0.0, 1.0 - y * y));
    var theta = golden * i;
    positions[i*3]   = Math.cos(theta) * r;
    positions[i*3+1] = y;
    positions[i*3+2] = Math.sin(theta) * r;
    aTArr[i] = i / N;
  }
  // ── RENDERER ─────────────────────────────────────────────────
  var SIZE = 420;
  var canvas = document.getElementById('hopeSphereCanvas');
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas, alpha: true, antialias: false
  });
  renderer.setSize(SIZE, SIZE);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 2.8;
  var geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('aT',       new THREE.BufferAttribute(aTArr, 1));
  var uniforms = {
    uT:          { value: 0.0 },
    uAmp:        { value: STATES.idle.amp },
    uSpd:        { value: STATES.idle.spd },
    uRotY:       { value: 0.0 },
    uRotX:       { value: 0.0 },
    uRotZ:       { value: 0.0 },
    uScale:      { value: 1.0 },
    uLightDir:   { value: new THREE.Vector3(0.6, 0.8, 1.0) },
    uColor:      { value: new THREE.Vector3(0.49, 0.23, 0.93) },
    uColor2:     { value: new THREE.Vector3(0.80, 0.84, 0.88) },
    uColor3:     { value: new THREE.Vector3(0.49, 0.23, 0.93) },
    uColorBlend: { value: 0.0 }
  };
  var mat = new THREE.ShaderMaterial({
    uniforms:       uniforms,
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
    depthWrite:     false
  });
  scene.add(new THREE.Points(geom, mat));
  // ── ANIMATION STATE ──────────────────────────────────────────
  var cur = {
    amp: STATES.idle.amp, spd: STATES.idle.spd,
    rotSpd: STATES.idle.rotSpd, scaleSpd: STATES.idle.scaleSpd,
    blendSpd: STATES.idle.blendSpd,
    c1: STATES.idle.color.slice(),
    c2: STATES.idle.color2.slice(),
    c3: STATES.idle.color3.slice()
  };
  var tgt = {
    amp: STATES.idle.amp, spd: STATES.idle.spd,
    rotSpd: STATES.idle.rotSpd, scaleSpd: STATES.idle.scaleSpd,
    blendSpd: STATES.idle.blendSpd,
    c1: STATES.idle.color, c2: STATES.idle.color2, c3: STATES.idle.color3
  };
  var rotY = 0, rotX = 0, rotZ = 0;
  var clock = new THREE.Clock();
  function lerp(a, b, k){ return a + (b - a) * k; }
  function sphereSetState(name) {
    var s = STATES[name];
    if (!s) return;
    tgt.amp      = s.amp;
    tgt.spd      = s.spd;
    tgt.rotSpd   = s.rotSpd;
    tgt.scaleSpd = s.scaleSpd;
    tgt.blendSpd = s.blendSpd;
    tgt.c1 = s.color;
    tgt.c2 = s.color2;
    tgt.c3 = s.color3;
  }
  // ── ANIMATE LOOP ─────────────────────────────────────────────
  (function loop(){
    requestAnimationFrame(loop);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t  = clock.getElapsedTime();
    var k  = 1.0 - Math.pow(0.05, dt);
    cur.amp      = lerp(cur.amp,      tgt.amp,      k);
    cur.spd      = lerp(cur.spd,      tgt.spd,      k);
    cur.rotSpd   = lerp(cur.rotSpd,   tgt.rotSpd,   k);
    cur.scaleSpd = lerp(cur.scaleSpd, tgt.scaleSpd, k);
    cur.blendSpd  = lerp(cur.blendSpd, tgt.blendSpd, k);
    var kc = 1.0 - Math.pow(0.003, dt);
    cur.c1[0] = lerp(cur.c1[0], tgt.c1[0], kc);
    cur.c1[1] = lerp(cur.c1[1], tgt.c1[1], kc);
    cur.c1[2] = lerp(cur.c1[2], tgt.c1[2], kc);
    cur.c2[0] = lerp(cur.c2[0], tgt.c2[0], kc);
    cur.c2[1] = lerp(cur.c2[1], tgt.c2[1], kc);
    cur.c2[2] = lerp(cur.c2[2], tgt.c2[2], kc);
    cur.c3[0] = lerp(cur.c3[0], tgt.c3[0], kc);
    cur.c3[1] = lerp(cur.c3[1], tgt.c3[1], kc);
    cur.c3[2] = lerp(cur.c3[2], tgt.c3[2], kc);
    uniforms.uColor.value.set(cur.c1[0],  cur.c1[1],  cur.c1[2]);
    uniforms.uColor2.value.set(cur.c2[0], cur.c2[1],  cur.c2[2]);
    uniforms.uColor3.value.set(cur.c3[0], cur.c3[1],  cur.c3[2]);
    rotY += cur.rotSpd * dt;
    rotX += cur.rotSpd * 0.37 * dt;
    rotZ += cur.rotSpd * 0.61 * dt;
    uniforms.uT.value    = t;
    uniforms.uAmp.value  = cur.amp;
    uniforms.uSpd.value  = cur.spd;
    uniforms.uRotY.value = rotY;
    uniforms.uRotX.value = rotX;
    uniforms.uRotZ.value = rotZ;
    uniforms.uScale.value = tgt.scaleSpd > 0.01
      ? 0.55 + 0.20 * Math.sin(t * cur.scaleSpd * 2.0)
      : lerp(uniforms.uScale.value, 1.0, 0.05);
    uniforms.uLightDir.value.set(
      Math.sin(t * 0.41),
      Math.cos(t * 0.29),
      0.7
    );
    var blendTarget = cur.blendSpd > 0.01
      ? 0.5 + 0.5 * Math.sin(t * cur.blendSpd)
      : 0.0;
    uniforms.uColorBlend.value = lerp(uniforms.uColorBlend.value, blendTarget, 0.04);
    renderer.render(scene, camera);
  })();
  // ── STATE BRIDGE — polls floatMic className every 200ms ───────
  // More reliable than MutationObserver for rapid class cycling.
  // Never goes idle while in-call class is present.
  var floatMic = document.getElementById('floatMic');
  var sphereLastState = 'idle';
  setInterval(function(){
    if (!floatMic) return;
    var cls = floatMic.className;
    var inCall = cls.indexOf('in-call') > -1;
    var mapped;
    if (cls.indexOf('state-waiting') > -1) {
      mapped = 'thinking';
    } else if (cls.indexOf('state-responding') > -1) {
      mapped = 'speaking';
    } else if (cls.indexOf('state-connecting') > -1) {
      mapped = 'speaking';
    } else if (inCall) {
      mapped = 'speaking';
    } else {
      mapped = 'idle';
    }
    if (mapped !== sphereLastState) {
      sphereLastState = mapped;
      sphereSetState(mapped);
    }
  }, 200);
})();
