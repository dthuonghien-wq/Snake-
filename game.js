const $=id=>document.getElementById(id);
const wrap=$('wrap'),ov=$('ov'),msg=$('msg'),stB=$('st'),sc=$('sc'),bs=$('bs'),lvE=$('lv'),lfE=$('lf'),lvB=$('lvb'),mu=$('mu'),psB=$('ps'),fl=$('fl'),vg=$('vg'),pwE=$('pw'),skE=$('skins');
let best=0,muted=false;try{best=+localStorage.getItem('snakeBest')||0;muted=localStorage.getItem('snakeMute')==='1'}catch(e){}
bs.textContent=best;mu.textContent=muted?'🔇':'🔊';
mu.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();muted=!muted;mu.textContent=muted?'🔇':'🔊';try{localStorage.setItem('snakeMute',muted?'1':'0')}catch(e){}});

// ================= ÂM THANH =================
let AC=null,NB=null;
function snd(f1,f2,d,type,vol){if(muted||!AC)return;const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d)}
const seq=(fs,vol,gap)=>fs.forEach((f,i)=>setTimeout(()=>snd(f,f*1.01,0.12,'square',vol),i*(gap||80)));
function noise(t,d,vol,hp){if(!NB)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);s.stop(t+d+0.02)}
const sTurn=()=>snd(700,650,0.03,'triangle',0.03);
const sEat=c=>{const b=520*Math.pow(1.06,Math.min(c,14));snd(b,b*2,0.12,'square',0.08);snd(b*1.5,b*3,0.1,'triangle',0.05)};
const sGold=()=>seq([880,1175,1568,2093],0.08,60),sGem=()=>seq([1319,1760,2349,2637,3136],0.07,50);
const sPower=()=>seq([523,784,1047,1568,2093],0.08),sShield=()=>seq([1568,1175,880],0.07),sLife=()=>seq([659,880,1319],0.08);
const sHit=()=>{snd(320,55,0.45,'sawtooth',0.14);if(AC&&!muted)noise(AC.currentTime,0.3,0.25,200)},sDie=()=>snd(400,45,0.9,'sawtooth',0.15);
const sLevel=()=>seq([523,659,784,1047,1319,1568],0.08,90),sSmash=()=>{snd(240,60,0.28,'sawtooth',0.09);if(AC&&!muted)noise(AC.currentTime,0.18,0.18,800)};
const sPortal=()=>{snd(200,1600,0.3,'sine',0.1);snd(1600,200,0.3,'triangle',0.05)},sDash=()=>{snd(150,900,0.25,'sawtooth',0.08);if(AC&&!muted)noise(AC.currentTime,0.25,0.15,2000)};
const sCut=()=>seq([1200,900,600],0.06,50);
// Nhạc nền: mỗi màn một bài, càng lên càng nhanh và nhiều nhạc cụ hơn
const mtof=m=>440*Math.pow(2,(m-69)/12);
const SONGS=[
 {ch:[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],arp:[0,1,2,1,0,2,1,2]},
 {ch:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],arp:[0,2,1,2,0,1,2,1]},
 {ch:[[62,65,69],[58,62,65],[53,57,60],[60,64,67]],arp:[0,1,2,0,2,1,0,2]},
 {ch:[[64,67,71],[60,64,67],[55,59,62],[62,66,69]],arp:[2,1,0,1,2,0,1,0]},
 {ch:[[57,60,64],[62,65,69],[64,68,71],[57,60,64]],arp:[0,1,2,1,2,1,0,1]}];
let nextNote=0,step16=0;
function note(f,t,d,type,vol){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.02)}
function kick(t){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(40,t+0.15);g.gain.setValueAtTime(0.22,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.18);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+0.2)}
setInterval(()=>{if(!AC||muted||!running||paused){nextNote=0;return}const lv=level,song=SONGS[(lv-1)%SONGS.length],spb=60/(104+Math.min(lv-1,10)*5)/2;
if(nextNote<AC.currentTime)nextNote=AC.currentTime+0.05;
while(nextNote<AC.currentTime+0.25){const i=step16%16,ch=song.ch[Math.floor(step16/16)%4],t=nextNote;
if(i%4===0){note(mtof(ch[0]-24),t,spb*3.5,'triangle',0.1);kick(t)}
note(mtof(ch[song.arp[i%8]]+(i%8>=4?12:0)),t,spb*0.8,'square',0.016);
if(lv>=2&&i%2===1)noise(t,0.04,0.05,7000);
if(lv>=3&&(i===4||i===12))noise(t,0.12,0.12,1500);
if(lv>=4&&i%4===2)note(mtof(ch[(i>>2)%3]+24),t,spb*1.5,'sine',0.025);
if(lv>=6&&i%8===7)note(mtof(ch[2]+19),t,spb*0.6,'triangle',0.02);
step16++;nextNote+=spb}},60);
if(typeof THREE==='undefined'){msg.textContent='Không tải được đồ hoạ 3D, hãy mở lại khi có mạng';stB.style.display='none';throw new Error('THREE missing')}

// ================= KHUNG CẢNH =================
const N=17,H=(N-1)/2;
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;wrap.prepend(R.domElement);
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,0.1,300);let camD=26;
function fit(){const w=wrap.clientWidth||340,h=Math.min(wrap.clientHeight||w*1.25,w*1.9);R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();
const vf=25*Math.PI/180,hf=Math.atan(Math.tan(vf)*cam.aspect);camD=Math.max(10.4/Math.tan(hf),9.5/Math.tan(vf))}
fit();window.addEventListener('resize',fit);
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)}
S.background=canvasTex(2,256,(g)=>{const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#2a1460');gr.addColorStop(0.5,'#101a45');gr.addColorStop(1,'#050815');g.fillStyle=gr;g.fillRect(0,0,2,256)});
S.add(new THREE.HemisphereLight(0xffffff,0x2a2266,0.8));
const L=new THREE.DirectionalLight(0xffffff,0.9);L.position.set(6,16,9);L.castShadow=true;L.shadow.mapSize.set(1024,1024);Object.assign(L.shadow.camera,{left:-11,right:11,top:11,bottom:-11,near:1,far:50});S.add(L);
// Sao
let starM;{const n=1200,p=new Float32Array(n*3),col=new Float32Array(n*3),pal=[[1,1,1],[0.8,0.85,1],[1,0.9,0.7],[0.9,0.7,1]];for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,e=Math.random()*1.4-0.35,r=120+Math.random()*30;p[i*3]=Math.cos(a)*Math.cos(e)*r;p[i*3+1]=Math.sin(e)*r;p[i*3+2]=Math.sin(a)*Math.cos(e)*r;col.set(pal[i%4],i*3)}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));starM=new THREE.PointsMaterial({size:0.8,vertexColors:true});S.add(new THREE.Points(g,starM))}
const radT=canvasTex(128,128,(g)=>{const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.4,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)});
const gsC={};function glowSp(c,s,op){const k=c+'_'+(op||0.7);const m=gsC[k]||(gsC[k]=new THREE.SpriteMaterial({map:radT,color:c,transparent:true,opacity:op||0.7,blending:THREE.AdditiveBlending,depthWrite:false}));const sp=new THREE.Sprite(m);sp.scale.set(s,s,1);return sp}
// Tinh vân
[[0xA05AD8,-70,30,-140,140],[0xE070C0,70,10,-150,110],[0x378ADD,0,60,-160,170],[0x3FC1C9,-110,-10,-120,100]].forEach(([c,x,y,z,s])=>{const sp=glowSp(c,1,0.3);sp.position.set(x,y,z);sp.scale.set(s,s*0.6,1);S.add(sp)});
// Cực quang
const aurT=canvasTex(64,64,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(0.55,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
const auroras=[];[[0x5CFFC0,-40,40,-130,-0.08],[0xC08BFF,50,48,-140,0.12],[0x5CC8FF,0,58,-150,0]].forEach(([c,x,y,z,r],i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(170,24,30,1),new THREE.MeshBasicMaterial({map:aurT,color:c,transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.z=r;m.base=m.geometry.attributes.position.array.slice();m.k=i*2;S.add(m);auroras.push(m)});
// Hành tinh
const planets=[];
function makePlanet(r,cols,ring,pos){const t=canvasTex(128,64,(g,w,h)=>{for(let y=0;y<h;y+=4){g.fillStyle=cols[Math.floor(Math.random()*cols.length)];g.fillRect(0,y,w,4+Math.random()*6)}});
const m=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),new THREE.MeshStandardMaterial({map:t,roughness:0.9,emissive:0x221133}));m.position.set(...pos);m.rotation.z=0.3;
if(ring){const rg=new THREE.Mesh(new THREE.RingGeometry(r*1.4,r*2.1,64),new THREE.MeshBasicMaterial({color:ring,side:THREE.DoubleSide,transparent:true,opacity:0.55}));rg.rotation.x=Math.PI/2.4;m.add(rg)}S.add(m);planets.push(m)}
makePlanet(12,['#E8A15A','#D9874A','#F2C38B','#C9703C'],0xF4D9A8,[-45,22,-95]);
makePlanet(7,['#5FA8E8','#3D7FC9','#8CC8F0','#2E5E9E'],0,[50,30,-110]);
makePlanet(3.5,['#E070C0','#C050A0','#F0A0D8'],0xF0A0D8,[26,10,-70]);
const shoot=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.25,9),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0}));S.add(shoot);let shootT=2;const shootV=new THREE.Vector3();

// ================= VẬT LIỆU & MÔ HÌNH =================
const matC={};const mat=(c,o)=>{const k=c+JSON.stringify(o||'');return matC[k]||(matC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.35},o||{})))};
const addC={};const addM=c=>addC[c]||(addC[c]=new THREE.MeshBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
const pinG=new THREE.LatheGeometry([[0,0],[0.18,0],[0.26,0.25],[0.3,0.5],[0.25,0.8],[0.13,1.05],[0.12,1.15],[0.17,1.3],[0.16,1.45],[0.08,1.55],[0,1.57]].map(([x,y])=>new THREE.Vector2(x,y)),18);
const appleG=new THREE.SphereGeometry(0.38,20,16),stemG=new THREE.CylinderGeometry(0.03,0.03,0.2),leafG=new THREE.BoxGeometry(0.2,0.03,0.12),banG=new THREE.TorusGeometry(0.42,0.12,10,20,Math.PI*0.8);
const FR=[0xE24B4A,0xF08A24,0xF4D03F];
function makeFruit(k){const g=new THREE.Group();
if(k===2){const b=new THREE.Mesh(banG,mat(0xF4D03F));b.rotation.z=Math.PI*1.1;b.castShadow=true;g.add(b)}
else{const a=new THREE.Mesh(appleG,mat(FR[k],{emissive:k?0x3a1a00:0x3a0a0a}));a.castShadow=true;g.add(a);const s=new THREE.Mesh(stemG,mat(0x5a3a1a));s.position.y=0.42;g.add(s);const l=new THREE.Mesh(leafG,mat(0x639922));l.position.set(0.1,0.45,0);l.rotation.z=0.4;g.add(l)}
g.add(glowSp(FR[k],1.6,0.35));return g}
// Trang trí bay quanh
const decor=[];
for(let i=0;i<16;i++){const k=i%3;let m;if(k<2){m=new THREE.Group();const p=new THREE.Mesh(pinG,mat([0xffffff,0xF4D03F,0x2ECC71,0xA05AD8,0xE24B4A][i%5]));m.add(p);m.scale.setScalar(1.6+Math.random())}else{m=makeFruit(i%3);m.scale.setScalar(2+Math.random())}
const a=Math.random()*Math.PI*2,r=15+Math.random()*12;m.position.set(Math.cos(a)*r,-6+Math.random()*12,Math.sin(a)*r-6);m.rotation.set(Math.random(),Math.random()*3,Math.random());S.add(m);decor.push({m,a,r,by:m.position.y,sp:(Math.random()-0.5)*0.08,spin:(Math.random()-0.5)*0.8,ph:Math.random()*6})}

// Chủ đề bàn chơi theo màn
const THEMES=[
{n:'Rừng xanh',a:'#9BCB5E',b:'#86BC48',rim:0x4E8F2A,rock:0x7a6a5a,crys:0x7CF3FF},
{n:'Sa mạc vàng',a:'#F7C04A',b:'#EEAA35',rim:0xB85C1A,rock:0x8a4a1c,crys:0xFFE066},
{n:'Băng ngọc',a:'#8EE3E8',b:'#6ED2DA',rim:0x1D7C82,rock:0x3a6a7a,crys:0xB8FFF5},
{n:'Kẹo hồng',a:'#F9B4D5',b:'#F290BF',rim:0xA8336A,rock:0x7a3a60,crys:0xFFD1EC},
{n:'Thiên hà tím',a:'#B9A6F0',b:'#9F88E4',rim:0x5B3A9A,rock:0x4a3a7a,crys:0xffffff}];
THEMES.forEach(t=>{t.tex=canvasTex(N*16,N*16,(g)=>{for(let x=0;x<N;x++)for(let y=0;y<N;y++){g.fillStyle=(x+y)%2?t.a:t.b;g.fillRect(x*16,y*16,16,16)}
const d=g.getImageData(0,0,N*16,N*16);for(let i=0;i<d.data.length;i+=4){const n=(Math.random()-0.5)*18;d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n}g.putImageData(d,0,0)});t.tex.magFilter=THREE.NearestFilter});
const boardM=new THREE.MeshStandardMaterial({map:THEMES[0].tex,roughness:1});
const grass=new THREE.Mesh(new THREE.PlaneGeometry(N,N),boardM);grass.rotation.x=-Math.PI/2;grass.position.y=0.001;grass.receiveShadow=true;S.add(grass);
const islandM=new THREE.MeshStandardMaterial({color:0x6b4a2b,roughness:0.95,flatShading:true});
const base=new THREE.Mesh(new THREE.BoxGeometry(N+1,1,N+1),islandM);base.position.y=-0.5;base.receiveShadow=true;S.add(base);
const isl=new THREE.Mesh(new THREE.ConeGeometry(13,9,9),islandM);isl.rotation.x=Math.PI;isl.position.y=-5.5;S.add(isl);
const rimM=new THREE.MeshStandardMaterial({color:0x4E8F2A,emissive:0x4E8F2A,emissiveIntensity:0.25,roughness:0.6});
[[0,-(H+0.75),N+1,0.5],[0,H+0.75,N+1,0.5],[-(H+0.75),0,0.5,N+1],[H+0.75,0,0.5,N+1]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,0.5,d),rimM);m.position.set(x,0.25,z);m.castShadow=m.receiveShadow=true;S.add(m)});
const crysM=new THREE.MeshStandardMaterial({color:0x7CF3FF,emissive:0x7CF3FF,emissiveIntensity:0.6,roughness:0.2}),crysG=new THREE.OctahedronGeometry(0.3),crysGlow=[];
for(let i=0;i<12;i++){const s=i<6?-1:1,c=new THREE.Mesh(crysG,crysM),ax=i%2;const t=-H+((i%6)/5)*N*0.95;const x=ax?s*(H+0.75):t,z=ax?t:s*(H+0.75);c.position.set(x,0.85,z);c.scale.set(1,1.8,1);S.add(c);const gl=glowSp(0x7CF3FF,1.6,0.5);gl.position.copy(c.position);S.add(gl);crysGlow.push(gl)}
function setTheme(lv){const t=THEMES[(lv-1)%THEMES.length];boardM.map=t.tex;boardM.needsUpdate=true;rimM.color.setHex(t.rim);rimM.emissive.setHex(t.rim);islandM.color.setHex(t.rock);crysM.color.setHex(t.crys);crysM.emissive.setHex(t.crys);crysGlow.forEach(g=>g.material=new THREE.SpriteMaterial({map:radT,color:t.crys,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false}))}

// ---- Rắn ----
const headM=new THREE.MeshStandardMaterial({color:0x22c08e,roughness:0.3});
const head=new THREE.Group(),hs=new THREE.Mesh(new THREE.SphereGeometry(0.52,28,20),headM);hs.scale.y=0.85;hs.castShadow=true;head.add(hs);
const wM=new THREE.MeshStandardMaterial({color:0xffffff}),pM=new THREE.MeshStandardMaterial({color:0x111111});
[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(0.15,12,10),wM);e.position.set(s*0.2,0.22,0.3);head.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(0.075,10,8),pM);p.position.set(s*0.2,0.25,0.43);head.add(p)});
const tongue=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.02,0.3),mat(0xE24B4A));tongue.position.set(0,-0.05,0.55);head.add(tongue);
// Tiến hoá: sừng, vây, vương miện
const hornM=mat(0xFFF2C0,{emissive:0x5a4a10}),horns=new THREE.Group();[-1,1].forEach(s=>{const h=new THREE.Mesh(new THREE.ConeGeometry(0.09,0.42,10),hornM);h.position.set(s*0.24,0.55,-0.05);h.rotation.set(-0.5,0,s*-0.35);horns.add(h)});head.add(horns);
const finM=new THREE.MeshStandardMaterial({color:0x7FDBFF,emissive:0x2a6a9a,transparent:true,opacity:0.85,side:THREE.DoubleSide}),fins=new THREE.Group();
[-1,1].forEach(s=>{const f=new THREE.Mesh(new THREE.ConeGeometry(0.28,0.7,3),finM);f.scale.z=0.25;f.position.set(s*0.55,0.1,-0.15);f.rotation.set(Math.PI/2,0,s*1.2);fins.add(f)});head.add(fins);
const crown=new THREE.Group(),goldM=mat(0xFFD700,{metalness:0.6,roughness:0.2,emissive:0x5a4000});crown.add(new THREE.Mesh(new THREE.TorusGeometry(0.22,0.05,8,24),goldM));crown.children[0].rotation.x=Math.PI/2;
for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.2,6),goldM),a=i/5*Math.PI*2;c.position.set(Math.cos(a)*0.22,0.1,Math.sin(a)*0.22);crown.add(c)}crown.position.y=0.5;head.add(crown);
S.add(head);
const segG=new THREE.SphereGeometry(0.46,20,14),body=[];
const glow=glowSp(0x22c08e,2.4,0.45);S.add(glow);
const bubble=new THREE.Mesh(new THREE.SphereGeometry(0.95,24,18),new THREE.MeshBasicMaterial({color:0x6fd8ff,transparent:true,opacity:0.2,depthWrite:false}));
const bubbleW=new THREE.Mesh(new THREE.IcosahedronGeometry(0.99,1),new THREE.MeshBasicMaterial({color:0xaef0ff,wireframe:true,transparent:true,opacity:0.55}));bubble.add(bubbleW);bubble.visible=false;S.add(bubble);
const magR=new THREE.Group(),magG=new THREE.TorusGeometry(1.05,0.05,8,40);[0xE24B4A,0x378ADD,0xffffff].forEach((c,i)=>{const t=new THREE.Mesh(magG,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.8}));t.rotation.set(i*1.1,i*0.7,0);magR.add(t)});magR.visible=false;S.add(magR);
const halo2=new THREE.Mesh(new THREE.TorusGeometry(0.4,0.07,10,36),new THREE.MeshBasicMaterial({color:0xFFD700}));halo2.rotation.x=Math.PI/2;halo2.visible=false;S.add(halo2);
const aura=new THREE.Mesh(new THREE.RingGeometry(0.85,1.2,40),new THREE.MeshBasicMaterial({color:0xFF7A1A,transparent:true,opacity:0.5,side:THREE.DoubleSide,depthWrite:false}));aura.rotation.x=-Math.PI/2;aura.visible=false;S.add(aura);
const fireL=new THREE.PointLight(0xff6a00,0,7);S.add(fireL);

// ---- Vật phẩm ----
const goldG=new THREE.SphereGeometry(0.36,20,16),gemG=new THREE.OctahedronGeometry(0.4);
function makeGold(){const g=new THREE.Group(),m=new THREE.Mesh(goldG,mat(0xFFC81E,{metalness:0.6,roughness:0.15,emissive:0x6a4a00}));m.castShadow=true;g.add(m);g.add(glowSp(0xFFD700,2,0.6));return g}
function makeGem(){const g=new THREE.Group(),m=new THREE.Mesh(gemG,mat(0x7FF6FF,{metalness:0.3,roughness:0.05,emissive:0x1a6a8a,flatShading:true}));m.scale.y=1.4;m.castShadow=true;g.add(m);g.add(glowSp(0x7FF6FF,2.2,0.7));return g}
const PW={shield:{c:0x4FC3F7,e:'🛡️',n:'Khiên!'},fire:{c:0xFF7A1A,e:'🔥',n:'Lửa phá đá!',t:6},ghost:{c:0xC8B8FF,e:'👻',n:'Xuyên tường!',t:6},magnet:{c:0xE24B4A,e:'🧲',n:'Nam châm!',t:8},
slow:{c:0x7FDBFF,e:'⏳',n:'Chậm thời gian!',t:6},double:{c:0xF4C430,e:'x2',n:'Nhân đôi điểm!',t:10},star:{c:0xFFD700,e:'⭐',n:'Siêu sao!',t:5},cut:{c:0xFF8FB1,e:'✂️',n:'Thu gọn!'},heart:{c:0xFF4F7B,e:'❤️',n:'+1 Mạng!'}};
const POOL=['shield','fire','ghost','magnet','slow','double','star','cut','shield','fire','magnet','double','ghost','heart'];
const orbBig=new THREE.SphereGeometry(0.45,24,18),haloG=new THREE.TorusGeometry(0.6,0.05,8,40);
Object.keys(PW).forEach(k=>{const p=PW[k];p.tex=canvasTex(128,128,g=>{g.font=(p.e==='x2'?'bold 78px':'86px')+' sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#FFE36B';g.lineWidth=8;g.strokeStyle='#7a4a00';if(p.e==='x2')g.strokeText(p.e,64,68);g.fillText(p.e,64,70)});p.om=new THREE.MeshBasicMaterial({color:p.c,transparent:true,opacity:0.35,depthWrite:false});p.hm=new THREE.MeshBasicMaterial({color:p.c})});
function makePower(k){const p=PW[k],g=new THREE.Group();g.add(new THREE.Mesh(orbBig,p.om));const s=new THREE.Sprite(new THREE.SpriteMaterial({map:p.tex,depthWrite:false}));s.scale.set(0.75,0.75,1);g.add(s);const h=new THREE.Mesh(haloG,p.hm);g.add(h);g.halo=h;g.add(glowSp(p.c,2.2,0.55));return g}
// ---- Chướng ngại ----
const rockG=new THREE.DodecahedronGeometry(0.46);
const spikeG=new THREE.ConeGeometry(0.1,0.3,6),patM=new THREE.MeshStandardMaterial({color:0x2a1a3a,roughness:0.2,metalness:0.5}),coreM=new THREE.MeshBasicMaterial({color:0xff3344});
function makePatrol(){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.SphereGeometry(0.32,18,14),patM);b.castShadow=true;g.add(b);
[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[0.7,0.7,0],[-0.7,0.7,0],[0,0.7,0.7],[0,0.7,-0.7]].forEach(([x,y,z])=>{const s=new THREE.Mesh(spikeG,patM);s.position.set(x*0.36,y*0.36,z*0.36);s.lookAt(x*2,y*2,z*2);s.rotateX(Math.PI/2);b.add(s)});
const r=new THREE.Mesh(new THREE.TorusGeometry(0.36,0.04,8,30),coreM);r.rotation.x=Math.PI/2;g.add(r);g.add(glowSp(0xff3344,1.8,0.5));g.ball=b;return g}
const PCOL=[0x4DC3FF,0xFF9F1C];
function makePortal(i){const g=new THREE.Group(),c=PCOL[i];const t=new THREE.Mesh(new THREE.TorusGeometry(0.42,0.08,10,36),new THREE.MeshBasicMaterial({color:c}));t.rotation.x=Math.PI/2;g.add(t);
const d=new THREE.Mesh(new THREE.CircleGeometry(0.4,32),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false}));d.rotation.x=-Math.PI/2;d.position.y=0.02;g.add(d);g.add(glowSp(c,2.4,0.6));g.ring=t;return g}

// ================= HIỆU ỨNG =================
const pG=new THREE.BoxGeometry(0.13,0.13,0.13),parts=[],fx=[];
function part(x,y,z,m,v,s,decay,grav){const p=new THREE.Mesh(pG,m);p.position.set(x,y,z);p.v=v;p.s0=s;p.decay=decay;p.grav=grav===undefined?12:grav;p.life=1;p.scale.setScalar(s);S.add(p);parts.push(p)}
function burst(x,z,c,n,pw){pw=pw||1;for(let i=0;i<(n||20);i++){const a=Math.random()*Math.PI*2,sp=(2+Math.random()*3)*pw;part(x,0.5,z,mat(c),new THREE.Vector3(Math.cos(a)*sp,(3+Math.random()*3)*pw,Math.sin(a)*sp),0.7+Math.random()*1.1,1.3)}}
function sparkle(x,y,z,c,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,e=Math.random()*Math.PI-Math.PI/2,sp=2.5+Math.random()*3.5;part(x,y,z,addM(c),new THREE.Vector3(Math.cos(a)*Math.cos(e)*sp,Math.sin(e)*sp+2,Math.sin(a)*Math.cos(e)*sp),0.5+Math.random()*0.7,1.6,4)}}
const ringG=new THREE.RingGeometry(0.55,0.8,40),dustG=new THREE.SphereGeometry(0.5,10,8);
function addFx(geo,c,x,y,z,life,g0,g1,op,flat){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op,depthWrite:false,side:THREE.DoubleSide}));if(flat)m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.scale.setScalar(g0);S.add(m);fx.push({m,life,max:life,g0,g1,op})}
function ring(x,z,c,size,y){addFx(ringG,c,x,y||0.05,z,0.55,0.6,size||3,0.85,true)}
function flash(c,op){fl.style.transition='none';fl.style.background=c;fl.style.opacity=op;requestAnimationFrame(()=>requestAnimationFrame(()=>{fl.style.transition='opacity .45s';fl.style.opacity=0}))}
const pv=new THREE.Vector3();
function pop(txt,x,y,z,col,size){pv.set(x,y,z).project(cam);const d=document.createElement('div');d.className='pp';d.textContent=txt;d.style.left=((pv.x+1)/2*100)+'%';d.style.top=((1-pv.y)/2*100)+'%';if(col)d.style.color=col;if(size)d.style.fontSize=size+'px';wrap.appendChild(d);setTimeout(()=>d.remove(),1000)}
const HEX=c=>'#'+c.toString(16).padStart(6,'0');
const RB=[0xFF4D4D,0xFF9F1C,0xFFE14D,0x4DFF88,0x4DC3FF,0xB04DFF];
function firework(){const c=RB[rnd(6)],c2=RB[rnd(6)],x=(Math.random()-0.5)*20,y=8+Math.random()*6,z=-6-Math.random()*8;for(let i=0;i<48;i++){const a=Math.random()*Math.PI*2,e=Math.acos(2*Math.random()-1),sp=5+Math.random()*3;part(x,y,z,addM(i%3?c:c2),new THREE.Vector3(Math.sin(e)*Math.cos(a)*sp,Math.cos(e)*sp,Math.sin(e)*Math.sin(a)*sp),1.5,0.9,2.5)}snd(900,150,0.35,'triangle',0.05)}

// ================= SKIN RẮN =================
const SKINS=[{n:'Rừng xanh',need:0},{n:'Sọc hổ',need:1000},{n:'Ngọc bích',need:2000},{n:'Thiên hà',need:4000},{n:'Kim cương',need:6000},{n:'Cầu vồng',need:8000}];
let skin=0;try{skin=+localStorage.getItem('snakeSkin')||0}catch(e){}if(!SKINS[skin]||best<SKINS[skin].need)skin=0;
const tmpC=new THREE.Color();
function segColor(i,out){const t=T;switch(skin){
case 1:return out.setHex(i%3===0?0x2a1a10:(i%3===1?0xF08A24:0xF5A623));
case 2:return out.setHSL(0.45,0.65,0.42+0.08*Math.sin(i*0.8));
case 3:return out.setHSL(0.72+0.06*Math.sin(i*0.5+t),0.65,0.38);
case 4:return out.setHSL(0.53,0.35,0.82-(i%2)*0.1);
case 5:return out.setHSL((i*0.06+t*0.3)%1,0.85,0.55);
default:return out.setHSL(0.42,0.7,i%2?0.34:0.44)}}
function skinMat(m){m.roughness=skin===4?0.08:skin===2?0.15:0.35;m.metalness=skin===4?0.45:skin===2?0.3:0.05;m.flatShading=skin===2;m.needsUpdate=true}
function renderSkins(){skE.innerHTML='<small>Chọn rắn (mở khoá bằng kỷ lục)</small>';SKINS.forEach((k,i)=>{const b=document.createElement('button'),ok=best>=k.need;b.textContent=ok?k.n:'🔒 '+k.need;if(i===skin)b.className='on';
b.addEventListener('click',e=>{e.stopPropagation();if(!ok)return;skin=i;try{localStorage.setItem('snakeSkin',i)}catch(e){}applySkin();renderSkins()});skE.appendChild(b)})}
function applySkin(){skinMat(headM);body.forEach(m=>skinMat(m.material))}

// ================= TRẠNG THÁI =================
const rnd=n=>Math.floor(Math.random()*n);
let cells=[],prev=[],dir={x:1,y:0},dirQ=[],grow=0,apple=null,items=[],rocks=[],patrols=[],portals=[],gulps=[];
let score=0,pts=0,level=1,eatLv=0,lives=3,running=false,paused=false,acc=0,T=0,shake=0,inv=0,combo=0,comboT=0,nextLife=2000,annBest=0,startBest=0,recAnn=false;
let shield=false,fireT=0,ghostT=0,magT=0,slowT=0,dblT=0,starT=0,dashT=0,dashCD=0,patAcc=0,hudT=0,hudS='',fxT=0,st={};
const EVO={2:'⚡ Mở kỹ năng LƯỚT!<br><small>Chạm màn hình để lướt</small>',3:'🦄 Tiến hoá: Mọc sừng!',4:'🐉 Tiến hoá: Có vây!<br><small>Lướt phá được đá</small>',5:'🔥 Tiến hoá: Hào quang lửa!',6:'👑 Tiến hoá: Vương miện!<br><small>Lướt hút trái cây</small>',7:'🐲 RỒNG VŨ TRỤ!'};
const evo=()=>Math.min(level,7);
const wx=x=>x-H,wz=y=>y-H,same=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y;
function occ(x,y,ignoreSnake){return(!ignoreSnake&&cells.some(c=>c.x===x&&c.y===y))||rocks.some(r=>r.x===x&&r.y===y)||patrols.some(p=>p.x===x&&p.y===y)||portals.some(p=>p.x===x&&p.y===y)||(apple&&apple.x===x&&apple.y===y)||items.some(i=>i.x===x&&i.y===y)}
function free(far){const hd=cells[0];for(let k=0;k<600;k++){const x=rnd(N),y=rnd(N);if(occ(x,y))continue;if(far&&hd){if(Math.abs(x-hd.x)+Math.abs(y-hd.y)<4)continue;if((dir.x&&y===hd.y&&Math.sign(x-hd.x)===dir.x)||(dir.y&&x===hd.x&&Math.sign(y-hd.y)===dir.y))continue}return{x,y}}return null}
function spawnApple(){const p=free(false)||{x:0,y:0},k=rnd(3),m=makeFruit(k);S.add(m);m.scale.setScalar(0.01);apple={x:p.x,y:p.y,k,m,grow:0};ring(wx(p.x),wz(p.y),FR[k],1.6)}
function spawnItem(){if(items.length>=3)return;const p=free(true);if(!p)return;const r=Math.random();let type,k,m;
if(r<0.33){type='gold';m=makeGold()}else if(r<0.43){type='gem';m=makeGem()}else{type='power';k=POOL[rnd(POOL.length)];m=makePower(k)}
m.scale.setScalar(0.01);S.add(m);items.push({x:p.x,y:p.y,type,k,m,t:9,grow:0});ring(wx(p.x),wz(p.y),0xffffff,2)}
function addRocks(n){for(let i=0;i<n&&rocks.length<26;i++){const p=free(true);if(!p)return;const m=new THREE.Mesh(rockG,mat(THEMES[(level-1)%THEMES.length].rock,{roughness:0.95,flatShading:true}));m.castShadow=m.receiveShadow=true;m.rotation.set(Math.random()*3,Math.random()*3,0);m.position.set(wx(p.x),0.36,wz(p.y));m.scale.setScalar(0.01);m.grow=0;S.add(m);rocks.push({x:p.x,y:p.y,m})}}
function setPatrols(n){while(patrols.length<n){const p=free(true);if(!p)return;const m=makePatrol();S.add(m);const h=Math.random()<0.5;patrols.push({x:p.x,y:p.y,px:p.x,py:p.y,dx:h?1:0,dy:h?0:1,m})}}
function setPortals(){portals.forEach(p=>S.remove(p.m));portals=[];for(let i=0;i<2;i++){const p=free(true);if(!p)return;const m=makePortal(i);m.position.set(wx(p.x),0.05,wz(p.y));S.add(m);portals.push({x:p.x,y:p.y,m})}}
function clearAll(){[apple,...items,...rocks,...patrols,...portals].forEach(o=>o&&S.remove(o.m));items=[];rocks=[];patrols=[];portals=[];apple=null;parts.forEach(p=>S.remove(p));parts.length=0;fx.forEach(f=>S.remove(f.m));fx.length=0}
function syncBody(){while(body.length<cells.length-1){const m=new THREE.Mesh(segG,new THREE.MeshStandardMaterial({roughness:0.35,transparent:true}));skinMat(m.material);m.castShadow=true;S.add(m);body.push(m)}while(body.length>cells.length-1)S.remove(body.pop())}
function showLv(t){lvB.innerHTML=t;lvB.style.opacity=1;lvB.style.transform='scale(1)';clearTimeout(showLv.t);showLv.t=setTimeout(()=>{lvB.style.opacity=0;lvB.style.transform='scale(0.8)'},1600)}
const gain=n=>{n*=dblT>0?2:1;pts+=n;return n};
function interval(){return Math.max(68,175-(level-1)*11)*(slowT>0?1.7:1)*(starT>0?0.75:1)*(dashT>0?0.5:1)}
function clearPowers(){shield=false;fireT=ghostT=magT=slowT=dblT=starT=dashT=0;vg.style.opacity=0}
function reset(){clearAll();clearPowers();cells=[{x:6,y:8},{x:5,y:8},{x:4,y:8}];prev=cells.map(c=>({...c}));dir={x:1,y:0};dirQ=[];grow=0;gulps=[];
pts=0;score=0;level=1;eatLv=0;lives=3;acc=0;inv=0;combo=0;comboT=0;dashCD=0;nextLife=2000;startBest=best;annBest=best;recAnn=false;st={apples:0,gold:0,gems:0,rocks:0,maxC:0,maxLen:3,pw:0};
sc.textContent=0;lvE.textContent=1;lfE.textContent='❤️3';pwE.innerHTML='';hudS='';setTheme(1);spawnApple();addRocks(2);syncBody()}
function start(){if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(A){AC=new A();NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}}if(AC&&AC.state==='suspended')AC.resume();
reset();paused=false;ov.style.display='none';psB.style.display='block';running=true;showLv('Màn 1 · '+THEMES[0].n)}
function saveBest(){try{localStorage.setItem('snakeBest',best)}catch(e){}}

// ================= LUẬT CHƠI =================
const canPass=()=>ghostT>0||starT>0||inv>0;
const canSmash=()=>fireT>0||starT>0||(dashT>0&&evo()>=4);
function breakShield(){shield=false;inv=0.6;sShield();shake=0.35;flash('#4FC3F7',0.4);const h=cells[0];sparkle(wx(h.x),0.6,wz(h.y),0x6fd8ff,40);pop('Khiên vỡ!',wx(h.x),1.5,wz(h.y),'#9fe8ff',22)}
function smashAt(o,list,c){list.splice(list.indexOf(o),1);S.remove(o.m);burst(wx(o.x),wz(o.y),c,30,1.2);sparkle(wx(o.x),0.6,wz(o.y),0xFF9F1C,14);ring(wx(o.x),wz(o.y),c,3);sSmash();shake=Math.max(shake,0.25);st.rocks++;const g=gain(30);pop('+'+g,wx(o.x),1.4,wz(o.y),'#ffd28a')}
function step(){if(dirQ.length)dir=dirQ.shift();
const old=cells;let h={x:old[0].x+dir.x,y:old[0].y+dir.y},jumped=false;
if(h.x<0||h.y<0||h.x>=N||h.y>=N){if(canPass()){}else if(shield)breakShield();else return hit();h={x:(h.x+N)%N,y:(h.y+N)%N};jumped=true;const o=cells[0];sparkle(wx(o.x),0.5,wz(o.y),0xC8B8FF,10)}
const pi=portals.findIndex(p=>same(p,h));if(pi>=0&&portals.length===2){const o=portals[1-pi];h={x:o.x,y:o.y};jumped=true;sPortal();ring(wx(portals[pi].x),wz(portals[pi].y),PCOL[pi],3);ring(wx(o.x),wz(o.y),PCOL[1-pi],3);sparkle(wx(o.x),0.5,wz(o.y),PCOL[1-pi],18)}
const rk=rocks.find(r=>same(r,h));if(rk){if(canSmash())smashAt(rk,rocks,THEMES[(level-1)%THEMES.length].rock);else if(canPass()){}else if(shield){breakShield();smashAt(rk,rocks,0x888888)}else return hit()}
const pt=patrols.find(p=>same(p,h));if(pt&&!patHit(pt))return;
const tailMoves=grow===0;if(old.slice(0,tailMoves?-1:old.length).some(c=>same(c,h))&&!same(old[0],h)){if(canPass()){}else if(shield)breakShield();else return hit()}
cells=[h,...old];if(grow>0)grow--;else cells.pop();
prev=cells.map((c,i)=>({...(old[i]||old[old.length-1])}));if(jumped)prev[0]={...h};
gulps=gulps.map(g=>g+1).filter(g=>g<cells.length);
if(same(h,apple))eatApple();
const it=items.find(i=>same(i,h));if(it)collect(it);
if(magT>0||(dashT>0&&evo()>=6))magnetPull();
st.maxLen=Math.max(st.maxLen,cells.length);syncBody();
if(evo()>=2&&Math.random()<0.5){const t=cells[cells.length-1];part(wx(t.x),0.3,wz(t.y),addM(segColor(cells.length,tmpC).getHex()),new THREE.Vector3((Math.random()-0.5),1+Math.random(),(Math.random()-0.5)),0.5,2,0)}}
function patHit(p){if(canSmash()){smashAt(p,patrols,0x2a1a3a);return true}if(canPass())return true;if(shield){breakShield();smashAt(p,patrols,0x2a1a3a);return true}hit();return false}
function magnetPull(){const h=cells[0];[apple,...items].forEach(o=>{if(!o)return;const d=Math.abs(o.x-h.x)+Math.abs(o.y-h.y);if(d<1||d>7)return;const sx=Math.sign(h.x-o.x),sy=Math.sign(h.y-o.y);const cand=Math.abs(h.x-o.x)>=Math.abs(h.y-o.y)?{x:o.x+sx,y:o.y}:{x:o.x,y:o.y+sy};
if(same(cand,h)){if(o===apple){o.x=cand.x;o.y=cand.y;eatApple()}else{o.x=cand.x;o.y=cand.y;collect(o)}return}
if(!occ(cand.x,cand.y)){o.x=cand.x;o.y=cand.y;part(wx(o.x),0.6,wz(o.y),addM(0xffe680),new THREE.Vector3(0,1,0),0.5,3,0)}})}
function eatApple(){const a=apple,x=wx(a.x),z=wz(a.y);combo=comboT>0?combo+1:1;comboT=3;st.apples++;st.maxC=Math.max(st.maxC,combo);
const g=gain(10*level*combo);grow++;gulps.push(0);sEat(combo);burst(x,z,FR[a.k],22);ring(x,z,FR[a.k],3);sparkle(x,0.6,z,FR[a.k],10);pop('+'+g,x,1.4,z,dblT>0?'#FFD700':'#fff');
if(combo>=2)pop('Combo x'+combo+'!',x,2.4,z,'#7FF',combo>4?28:22);
const ms={5:['TUYỆT VỜI!','#F4C430'],10:['SIÊU ĐỈNH!','#FF7AD9'],15:['HUYỀN THOẠI!','#7FF']}[combo];if(ms){pop(ms[0],0,3,-2,ms[1],34);flash(ms[1],0.22);firework()}
S.remove(a.m);apple=null;spawnApple();eatLv++;
if(Math.random()<0.42)spawnItem();
if(eatLv>=5+level)levelUp()}
function collect(o){items.splice(items.indexOf(o),1);S.remove(o.m);const x=wx(o.x),z=wz(o.y);
if(o.type==='gold'){st.gold++;const g=gain(50*level);sGold();burst(x,z,0xFFD700,26);sparkle(x,0.6,z,0xFFD700,20);ring(x,z,0xFFD700,3.5);pop('🌟 +'+g,x,1.5,z,'#FFD700',26);return}
if(o.type==='gem'){st.gems++;const g=gain(150*level);sGem();sparkle(x,0.6,z,0x7FF6FF,40);ring(x,z,0x7FF6FF,4.5);flash('#7FF6FF',0.25);pop('💎 +'+g,x,1.5,z,'#7FF6FF',28);return}
const k=o.k,p=PW[k];st.pw++;gain(20);
if(k==='heart'){gainLife('❤️ +1 Mạng!');return}
if(k==='cut'){const n=Math.max(0,Math.floor((cells.length-3)/2));if(n>0){for(let i=0;i<n;i++){const c=cells.pop();burst(wx(c.x),wz(c.y),0xFF8FB1,4)}prev.length=cells.length;grow=0;syncBody();const g=gain(8*n);pop('✂️ Thu gọn +'+g,x,1.5,z,'#FF8FB1',24)}else pop('✂️ Đã gọn!',x,1.5,z,'#FF8FB1',22);sCut();ring(x,z,p.c,4);return}
if(k==='shield')shield=true;else if(k==='fire')fireT=p.t;else if(k==='ghost')ghostT=p.t;else if(k==='magnet')magT=p.t;else if(k==='slow')slowT=p.t;else if(k==='double')dblT=p.t;else if(k==='star')starT=p.t;
sPower();flash(HEX(p.c),0.35);ring(x,z,p.c,4);ring(x,z,0xffffff,2.5);sparkle(x,0.6,z,p.c,32);if(k==='star')for(let i=0;i<6;i++)sparkle(x,0.6,z,RB[i],6);pop(p.e+' '+p.n,x,1.8,z,HEX(p.c),24)}
function gainLife(txt){lives=Math.min(9,lives+1);lfE.textContent='❤️'+lives;sLife();flash('#FF4F7B',0.3);const h=cells[0];pop(txt,wx(h.x),2.2,wz(h.y),'#FF8FB1',24);sparkle(wx(h.x),0.6,wz(h.y),0xFF4F7B,30);ring(wx(h.x),wz(h.y),0xFF4F7B,4)}
function levelUp(){level++;eatLv=0;lvE.textContent=level;setTheme(level);sLevel();flash('#ffffff',0.35);for(let i=0;i<4;i++)setTimeout(firework,i*220);
addRocks(2);if(level>=2)setPortals();if(level>=3)setPatrols(Math.min(level-2,4));
const h=cells[0];ring(wx(h.x),wz(h.y),0xffffff,8);for(let i=0;i<4;i++)burst(wx(h.x),wz(h.y),RB[i],8,1.2);
showLv('Màn '+level+' · '+THEMES[(level-1)%THEMES.length].n+(EVO[level]?'<br><span style="font-size:22px">'+EVO[level]+'</span>':''))}
function hit(){if(inv>0)return;lives--;lfE.textContent='❤️'+Math.max(lives,0);shake=0.6;combo=0;sHit();flash('#E24B4A',0.45);const h=cells[0];burst(wx(h.x),wz(h.y),0xE24B4A,30,1.2);
if(lives<=0){die();return}pop('-1 ❤️',wx(h.x),1.8,wz(h.y),'#ff8080',26);respawn()}
function respawn(){cells.forEach(c=>burst(wx(c.x),wz(c.y),0xffffff,2));
for(let k=0;k<800;k++){const x=4+rnd(N-9),y=1+rnd(N-2);let ok=true;for(let d=-3;d<=4;d++)if(occ(x+d,y,true)){ok=false;break}if(!ok)continue;
cells=[{x,y},{x:x-1,y},{x:x-2,y},{x:x-3,y}];break}
prev=cells.map(c=>({...c}));dir={x:1,y:0};dirQ=[];grow=0;gulps=[];inv=2.5;acc=0;syncBody();const h=cells[0];ring(wx(h.x),wz(h.y),0xffffff,4);sparkle(wx(h.x),0.6,wz(h.y),0xffffff,20)}
function die(){running=false;clearPowers();shake=0.7;sDie();saveBest();
const nb=score>startBest&&score>0,un=SKINS.filter(k=>k.need>startBest&&k.need<=best).map(k=>k.n);
msg.innerHTML=(nb?'🎉 KỶ LỤC MỚI! 🎉':'Hết mạng!')+'<br><b style="font-size:32px">'+score+'</b> điểm · tới màn '+level+'<br><small>🍎 '+st.apples+' trái · 🌟 '+st.gold+' táo vàng · 💎 '+st.gems+' kim cương · 🪨 '+st.rocks+' phá<br>Dài nhất: '+st.maxLen+' đốt · Combo cao nhất: x'+st.maxC+' · ⚡ '+st.pw+' vật phẩm'+(un.length?'<br>🔓 Mở khoá rắn mới: <b>'+un.join(', ')+'</b>':'')+'</small>';
if(nb){setTimeout(()=>{sLevel();flash('#F4C430',0.45)},600);for(let i=0;i<3;i++)setTimeout(firework,i*250)}
renderSkins();skE.style.display='flex';psB.style.display='none';stB.textContent='Chơi lại';ov.style.display='flex'}
function pause(){if(!running||paused)return;paused=true;msg.innerHTML='Tạm dừng ⏸';skE.style.display='none';stB.textContent='Tiếp tục';ov.style.display='flex';psB.style.display='none'}
function resume(){paused=false;ov.style.display='none';psB.style.display='block';last=performance.now()}
function dash(){if(!running||paused||evo()<2||dashCD>0)return;dashT=1.6;dashCD=7;sDash();const h=cells[0];ring(wx(h.x),wz(h.y),0x7FF,4);sparkle(wx(h.x),0.6,wz(h.y),0x7FF,20);pop('⚡ LƯỚT!',wx(h.x),1.8,wz(h.y),'#7FF',24)}
function turn(x,y){if(!running||paused)return;const l=dirQ.length?dirQ[dirQ.length-1]:dir;if((x===-l.x&&y===-l.y)||(x===l.x&&y===l.y))return;if(dirQ.length<3){dirQ.push({x,y});sTurn()}}

// ================= ĐIỀU KHIỂN: VUỐT 4 HƯỚNG =================
stB.onclick=e=>{e.stopPropagation();if(paused)resume();else start()};
psB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
document.addEventListener('keydown',e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(m){e.preventDefault();turn(...m)}else if(e.key===' '){e.preventDefault();dash()}});
let tx=0,ty=0,t0=0,moved=false,tracking=false;
document.addEventListener('touchstart',e=>{if(e.target.closest('button'))return;tracking=true;moved=false;tx=e.touches[0].clientX;ty=e.touches[0].clientY;t0=performance.now()},{passive:true});
document.addEventListener('touchmove',e=>{if(!tracking){return}e.preventDefault();const x=e.touches[0].clientX,y=e.touches[0].clientY,dx=x-tx,dy=y-ty;
if(Math.max(Math.abs(dx),Math.abs(dy))>=22){Math.abs(dx)>Math.abs(dy)?turn(Math.sign(dx),0):turn(0,Math.sign(dy));tx=x;ty=y;moved=true}},{passive:false});
document.addEventListener('touchend',e=>{if(!tracking)return;tracking=false;if(!moved&&performance.now()-t0<300&&running&&!paused)dash()});
reset();applySkin();renderSkins();

// ================= VÒNG LẶP =================
let last=performance.now();
function loop(now){const dt=Math.min((now-last)/1000,0.05);last=now;T+=dt;const act=running&&!paused;
if(act){acc+=dt*1000;let iv=interval();while(running&&acc>=iv){acc-=iv;step();iv=interval()}
// Quả cầu gai di chuyển
patAcc+=dt*1000;const piv=520*(slowT>0?1.7:1);if(patAcc>=piv){patAcc-=piv;patrols.slice().forEach(p=>{p.px=p.x;p.py=p.y;for(let tr=0;tr<2;tr++){const nx=p.x+p.dx,ny=p.y+p.dy;
const bad=nx<0||ny<0||nx>=N||ny>=N||rocks.some(r=>r.x===nx&&r.y===ny)||portals.some(q=>q.x===nx&&q.y===ny)||patrols.some(q=>q!==p&&q.x===nx&&q.y===ny)||cells.slice(1).some(c=>c.x===nx&&c.y===ny)||items.some(i=>i.x===nx&&i.y===ny)||same(apple,{x:nx,y:ny});
if(bad){p.dx=-p.dx;p.dy=-p.dy;continue}p.x=nx;p.y=ny;break}if(running&&same(p,cells[0]))patHit(p)})}
if(fireT>0)fireT-=dt;if(ghostT>0)ghostT-=dt;if(magT>0)magT-=dt;if(slowT>0)slowT-=dt;if(dblT>0)dblT-=dt;if(starT>0)starT-=dt;if(dashT>0)dashT-=dt;if(dashCD>0)dashCD-=dt;if(inv>0)inv-=dt;
if(comboT>0){comboT-=dt;if(comboT<=0)combo=0}
items.slice().forEach(o=>{o.t-=dt;if(o.t<=0){items.splice(items.indexOf(o),1);S.remove(o.m);sparkle(wx(o.x),0.5,wz(o.y),0xffffff,8)}});
score=pts;if(+sc.textContent!==score){sc.textContent=score;if(score>best){best=score;bs.textContent=best;
if(!recAnn&&startBest>0){recAnn=true;pop('🏆 KỶ LỤC MỚI!',0,3,-3,'#FFD700',30);for(let i=0;i<3;i++)setTimeout(firework,i*200)}
SKINS.forEach(k=>{if(k.need>annBest&&k.need<=best)setTimeout(()=>{pop('🔓 Mở khoá rắn '+k.n+'!',0,2.5,-1,'#7FF',24);sPower();firework()},700)});annBest=best}
if(score>=nextLife){nextLife+=2000;gainLife('🎁 +1 ❤️ ('+(nextLife-2000)+' điểm)')}}}
// ---- Vẽ rắn ----
const k=act?Math.min(acc/interval(),1):1,ev=evo();
const pos=i=>{const c=cells[i]||cells[cells.length-1],p=prev[i]||c;if(Math.abs(p.x-c.x)+Math.abs(p.y-c.y)>1)return[wx(c.x),wz(c.y)];return[wx(p.x+(c.x-p.x)*k),wz(p.y+(c.y-p.y)*k)]};
const hsz=1+(ev>=7?0.18:0)+(starT>0?0.1:0);const[hx,hz]=pos(0);head.position.set(hx,0.45+Math.sin(T*6)*0.04,hz);head.scale.setScalar(hsz);
const ta=Math.atan2(dir.x,dir.y);let da=ta-head.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));head.rotation.y+=da*Math.min(1,dt*18);
tongue.scale.z=Math.max(0,Math.sin(T*9))>0.7?1:0.01;
horns.visible=ev>=3;fins.visible=ev>=4;crown.visible=ev>=6;fins.children.forEach((f,i)=>f.rotation.y=Math.sin(T*8)*0.3*(i?1:-1));
const ghost=ghostT>0,star=starT>0,blink=inv>0&&Math.sin(T*30)<0;
segColor(-1,headM.color);if(star)headM.color.setHSL((T*1.3)%1,0.95,0.6);headM.emissive.setHex(fireT>0?0xff3300:ev>=7?0x224422:0);headM.emissiveIntensity=fireT>0?0.5+Math.sin(T*18)*0.25:0.6;
headM.transparent=true;headM.opacity=ghost?0.5:1;head.visible=!blink;
const n=body.length;body.forEach((m,i)=>{const[x,z]=pos(i+1);let s=(1-i/Math.max(n,1)*0.35)*(0.92+0.07*Math.sin(T*8-i*0.7));if(gulps.some(g=>Math.abs(g-(i+1))<1))s*=1.3;
m.position.set(x,0.38+Math.sin(T*6-i*0.5)*0.03,z);m.scale.set(s,s*0.85,s);m.visible=!blink;const mm=m.material;
if(star)mm.color.setHSL((i*0.07+T*1.5)%1,0.9,0.58);else segColor(i,mm.color);
mm.opacity=ghost?0.45:1;let e=0;if(fireT>0)e=0.25+Math.sin(T*15+i)*0.1;else if(ev>=7)e=0.25;else if(ev>=2&&i%3===0)e=Math.max(0,Math.sin(T*5-i*0.4))*0.6;mm.emissive.copy(fireT>0?tmpC.setHex(0xff4400):mm.color);mm.emissiveIntensity=e});
// Hào quang & kỹ năng
glow.position.set(hx,0.15,hz);glow.material.color.copy(star?tmpC.setHSL((T*1.3+0.5)%1,1,0.6):fireT>0?tmpC.setHex(0xFF7A1A):dashT>0?tmpC.setHex(0x77ffff):headM.color);glow.scale.setScalar(2.4+(dashT>0||star?1.2:0)+Math.sin(T*6)*0.2);
fireL.intensity=fireT>0?2+Math.sin(T*23)*0.6:0;fireL.position.set(hx,1,hz);
bubble.visible=shield;if(shield){bubble.position.set(hx,0.45,hz);bubbleW.rotation.y+=dt*1.2;bubbleW.rotation.x+=dt*0.7;bubble.material.opacity=0.16+Math.sin(T*4)*0.06}
magR.visible=magT>0;if(magT>0){magR.position.set(hx,0.45,hz);magR.children.forEach((t,i)=>{t.rotation.x+=dt*(2+i);t.rotation.y+=dt*(3-i)})}
halo2.visible=dblT>0;if(dblT>0){halo2.position.set(hx,1.15,hz);halo2.rotation.z+=dt*3}
aura.visible=ev>=5||fireT>0;if(aura.visible){aura.position.set(hx,0.06,hz);aura.material.color.setHex(fireT>0?0xFF3B1F:ev>=7?0xB04DFF:0xFF7A1A);aura.scale.setScalar(1+Math.sin(T*8)*0.12);aura.material.opacity=0.35+Math.sin(T*8)*0.15}
vg.style.opacity=slowT>0?0.8:0;
if(act){fxT-=dt;if(fxT<=0){fxT=0.03;
if(fireT>0||ev>=5){const tl=cells[cells.length-1],c=Math.random()<0.5?0xFF7A1A:0xFFD23F;if(fireT>0)part(hx+(Math.random()-0.5)*0.5,0.6,hz+(Math.random()-0.5)*0.5,addM(c),new THREE.Vector3((Math.random()-0.5),2+Math.random()*2,(Math.random()-0.5)),0.8+Math.random()*0.6,2.6,-3);
if(ev>=5)part(wx(tl.x)+(Math.random()-0.5)*0.3,0.35,wz(tl.y)+(Math.random()-0.5)*0.3,addM(ev>=7?RB[rnd(6)]:c),new THREE.Vector3(0,1.5+Math.random(),0),0.5+Math.random()*0.4,2.8,-2)}
if(star||dashT>0)part(hx+(Math.random()-0.5)*0.7,0.5,hz+(Math.random()-0.5)*0.7,addM(star?RB[rnd(6)]:0x99ffff),new THREE.Vector3(0,1,0),0.6,2.4,0);
if(skin>=3&&Math.random()<0.5){const b=body[rnd(Math.max(1,n))]||head;part(b.position.x+(Math.random()-0.5)*0.6,0.7,b.position.z+(Math.random()-0.5)*0.6,addM(skin===5?RB[rnd(6)]:skin===4?0xffffff:0xd0d0ff),new THREE.Vector3(0,0.6,0),0.4,2.2,0)}}}
// ---- Vật thể ----
const bob=(o,y,sp)=>{o.m.position.set(wx(o.x),y+Math.sin(T*sp+o.x)*0.12,wz(o.y));if(o.m.scale.x<1)o.m.scale.setScalar(Math.min(1,o.m.scale.x+dt*4))};
if(apple){bob(apple,0.45,3);apple.m.rotation.y+=dt*2}
items.forEach(o=>{bob(o,0.55,4);o.m.rotation.y+=dt*(o.type==='gem'?3:2);if(o.m.halo){o.m.halo.rotation.x+=dt*2;o.m.halo.rotation.y+=dt*3}o.m.visible=o.t>2||Math.sin(T*20)>0});
rocks.forEach(r=>{if(r.m.grow<1){r.m.grow=Math.min(1,r.m.grow+dt*3);r.m.scale.setScalar(Math.max(0.01,r.m.grow))}});
const pk=Math.min(patAcc/(520*(slowT>0?1.7:1)),1);patrols.forEach(p=>{p.m.position.set(wx(p.px+(p.x-p.px)*pk),0.42,wz(p.py+(p.y-p.py)*pk));p.m.ball.rotation.x+=dt*4*p.dy;p.m.ball.rotation.z-=dt*4*p.dx;p.m.ball.rotation.y+=dt;coreM.color.setHSL(0,1,0.45+Math.sin(T*8)*0.15)});
portals.forEach((p,i)=>{p.m.rotation.y+=dt*(i?-2:2);p.m.ring.scale.setScalar(1+Math.sin(T*5)*0.08);if(act&&Math.random()<dt*10){const a=Math.random()*6.28;part(wx(p.x)+Math.cos(a)*0.5,0.1,wz(p.y)+Math.sin(a)*0.5,addM(PCOL[i]),new THREE.Vector3(-Math.cos(a)*0.8,1.2,-Math.sin(a)*0.8),0.4,2,0)}});
// HUD
hudT-=dt;if(hudT<=0){hudT=0.1;let h='';if(evo()>=2)h+='<span>⚡ '+(dashCD>0?Math.ceil(dashCD)+'s':'Sẵn sàng')+'</span>';if(shield)h+='<span>🛡️</span>';
[['🔥',fireT],['👻',ghostT],['🧲',magT],['⏳',slowT],['x2',dblT],['⭐',starT]].forEach(([e,t])=>{if(t>0)h+='<span>'+e+' '+Math.ceil(t)+'s</span>'});if(h!==hudS){hudS=h;pwE.innerHTML=h}}
// ---- Thế giới ----
decor.forEach(d=>{d.a+=d.sp*dt;d.m.position.x=Math.cos(d.a)*d.r;d.m.position.z=Math.sin(d.a)*d.r-6;d.m.position.y=d.by+Math.sin(T*0.8+d.ph)*0.6;d.m.rotation.y+=d.spin*dt});
planets.forEach((p,i)=>p.rotation.y+=dt*0.05*(i+1));
auroras.forEach(m=>{const a=m.geometry.attributes.position,b=m.base;for(let i=0;i<a.count;i++)a.array[i*3+1]=b[i*3+1]+Math.sin(b[i*3]*0.045+T*0.7+m.k)*5;a.needsUpdate=true;m.material.opacity=0.22+Math.sin(T*0.5+m.k)*0.1});
starM.size=0.8+Math.sin(T*2.2)*0.2;rimM.emissiveIntensity=0.2+Math.sin(T*3)*0.15;crysM.emissiveIntensity=0.5+Math.sin(T*3)*0.2;
shootT-=dt;if(shootT<=0){shootT=3+Math.random()*5;shoot.position.set(-60+Math.random()*120,40+Math.random()*20,-100);shootV.set((Math.random()<0.5?-1:1)*(50+Math.random()*30),-22,0);shoot.lookAt(shoot.position.clone().add(shootV));shoot.material.opacity=1}
if(shoot.material.opacity>0){shoot.position.addScaledVector(shootV,dt);shoot.material.opacity=Math.max(0,shoot.material.opacity-dt*0.9)}
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.v.y-=p.grav*dt;p.position.addScaledVector(p.v,dt);if(p.grav>0&&p.position.y<0.07&&p.v.y<0){p.position.y=0.07;p.v.y*=-0.3;p.v.x*=0.6;p.v.z*=0.6}p.rotation.x+=dt*6;p.life-=dt*p.decay;p.scale.setScalar(Math.max(p.life*p.s0,0.01));if(p.life<=0){S.remove(p);parts.splice(i,1)}}
for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.life-=dt;const q=1-f.life/f.max;f.m.scale.setScalar(f.g0+(f.g1-f.g0)*q);f.m.material.opacity=f.op*(1-q);if(f.life<=0){S.remove(f.m);f.m.material.dispose();fx.splice(i,1)}}
if(shake>0)shake=Math.max(0,shake-dt);
const ang=58*Math.PI/180,sw=Math.sin(T*0.3)*0.6;cam.position.set(sw+(Math.random()-0.5)*shake,Math.sin(ang)*camD+(Math.random()-0.5)*shake,Math.cos(ang)*camD+0.6);cam.lookAt(0,0,0.6);
R.render(S,cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
// HET GAME
