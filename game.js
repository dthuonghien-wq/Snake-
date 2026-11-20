const $=id=>document.getElementById(id);
const wrap=$('wrap'),ov=$('ov'),msg=$('msg'),stB=$('st'),sc=$('sc'),bs=$('bs'),lvE=$('lv'),lvB=$('lvb'),mu=$('mu');
let best=0,muted=false;try{best=+localStorage.getItem('snakeBest')||0;muted=localStorage.getItem('snakeMute')==='1'}catch(e){}
bs.textContent=best;mu.textContent=muted?'🔇':'🔊';
mu.addEventListener('pointerdown',e=>{e.preventDefault();muted=!muted;mu.textContent=muted?'🔇':'🔊';try{localStorage.setItem('snakeMute',muted?'1':'0')}catch(e){}});
let AC=null;
function snd(f1,f2,d,type,vol){if(muted||!AC)return;const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d)}
const sEat=()=>snd(440,880,0.12,'square',0.1),sTurn=()=>snd(320,300,0.04,'triangle',0.05),sDie=()=>snd(400,50,0.7,'sawtooth',0.14);
const seq=(fs,vol)=>fs.forEach((f,i)=>setTimeout(()=>snd(f,f*1.01,0.12,'square',vol),i*90));
const sLevel=()=>seq([523,659,784,1047],0.09),sGold=()=>seq([880,1175,1568],0.09);
if(typeof THREE==='undefined'){msg.textContent='Không tải được đồ hoạ 3D, hãy mở lại khi có mạng';stB.style.display='none';throw new Error('THREE missing')}
const N=17,H=(N-1)/2,W=wrap.clientWidth||340;
const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(W,W);R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;wrap.prepend(R.domElement);
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(42,1,0.1,100);cam.position.set(0,19,13);cam.lookAt(0,0,0.8);
S.add(new THREE.HemisphereLight(0xffffff,0x445533,0.75));
const L=new THREE.DirectionalLight(0xffffff,0.85);L.position.set(6,14,8);L.castShadow=true;L.shadow.mapSize.set(1024,1024);Object.assign(L.shadow.camera,{left:-11,right:11,top:11,bottom:-11});S.add(L);
const tc=document.createElement('canvas');tc.width=tc.height=N*16;const g=tc.getContext('2d');
for(let x=0;x<N;x++)for(let y=0;y<N;y++){g.fillStyle=(x+y)%2?'#9BCB5E':'#8BBE4E';g.fillRect(x*16,y*16,16,16)}
const tex=new THREE.CanvasTexture(tc);tex.magFilter=THREE.NearestFilter;
const base=new THREE.Mesh(new THREE.BoxGeometry(N+1,1,N+1),new THREE.MeshStandardMaterial({color:0x6b4a2b,roughness:0.9}));base.position.y=-0.5;S.add(base);
const grass=new THREE.Mesh(new THREE.PlaneGeometry(N,N),new THREE.MeshStandardMaterial({map:tex,roughness:1}));grass.rotation.x=-Math.PI/2;grass.position.y=0.001;grass.receiveShadow=true;S.add(grass);
const rimM=new THREE.MeshStandardMaterial({color:0x8a6239,roughness:0.8});
[[0,-(H+0.75),N+1,0.5],[0,H+0.75,N+1,0.5],[-(H+0.75),0,0.5,N+1],[H+0.75,0,0.5,N+1]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,0.5,d),rimM);m.position.set(x,0.25,z);m.castShadow=m.receiveShadow=true;S.add(m)});
const head=new THREE.Group(),headM=new THREE.MeshStandardMaterial({color:0x0F6E56,roughness:0.35});
const hs=new THREE.Mesh(new THREE.SphereGeometry(0.52,24,18),headM);hs.scale.y=0.85;hs.castShadow=true;head.add(hs);
const wM=new THREE.MeshStandardMaterial({color:0xffffff}),pM=new THREE.MeshStandardMaterial({color:0x111111});
[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(0.14,12,10),wM);e.position.set(s*0.2,0.22,0.32);head.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,8),pM);p.position.set(s*0.2,0.25,0.44);head.add(p)});
S.add(head);
const segG=new THREE.SphereGeometry(0.46,20,14),body=[];
const food=new THREE.Group();
const ap=new THREE.Mesh(new THREE.SphereGeometry(0.38,24,18),new THREE.MeshStandardMaterial({color:0xE24B4A,roughness:0.3,emissive:0x3a0a0a}));ap.castShadow=true;food.add(ap);
const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.2),new THREE.MeshStandardMaterial({color:0x5a3a1a}));stem.position.y=0.42;food.add(stem);
const leaf=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.03,0.12),new THREE.MeshStandardMaterial({color:0x639922}));leaf.position.set(0.1,0.45,0);leaf.rotation.z=0.4;food.add(leaf);S.add(food);
const gold=new THREE.Mesh(new THREE.SphereGeometry(0.34,20,16),new THREE.MeshStandardMaterial({color:0xEF9F27,roughness:0.2,metalness:0.4,emissive:0x5a3a00}));gold.castShadow=true;gold.visible=false;S.add(gold);
const rockG=new THREE.DodecahedronGeometry(0.48),rockM=new THREE.MeshStandardMaterial({color:0x888780,roughness:0.95,flatShading:true});
const parts=[],pG=new THREE.BoxGeometry(0.13,0.13,0.13);
function burst(x,z,c){for(let i=0;i<20;i++){const m=new THREE.Mesh(pG,new THREE.MeshStandardMaterial({color:c||(i%2?0xEF9F27:0xE24B4A)}));m.position.set(x,0.5,z);const a=Math.random()*Math.PI*2,sp=2+Math.random()*3;m.v=new THREE.Vector3(Math.cos(a)*sp,3+Math.random()*3,Math.sin(a)*sp);m.life=1;S.add(m);parts.push(m)}}
let cells=[],prev,dir,next,score=0,speed,acc=0,running=false,fpos=null,gpos=null,gT=0,rocks=[],level=1,eaten=0,shake=0;
function occ(x,y){return cells.some(c=>c.x===x&&c.y===y)||rocks.some(r=>r.x===x&&r.y===y)||(fpos&&fpos.x===x&&fpos.y===y)||(gpos&&gpos.x===x&&gpos.y===y)}
function free(far){for(let k=0;k<500;k++){const x=Math.floor(Math.random()*N),y=Math.floor(Math.random()*N);if(occ(x,y))continue;if(far&&Math.abs(x-cells[0].x)+Math.abs(y-cells[0].y)<4)continue;return{x,y}}return null}
function place(){fpos=null;fpos=free(false)||{x:0,y:0}}
function addRocks(n){for(let i=0;i<n&&rocks.length<30;i++){const p=free(true);if(!p)return;const m=new THREE.Mesh(rockG,rockM);m.castShadow=m.receiveShadow=true;m.rotation.set(Math.random()*3,Math.random()*3,0);m.position.set(p.x-H,0.38,p.y-H);m.scale.setScalar(0.01);m.grow=0;S.add(m);rocks.push({x:p.x,y:p.y,m})}}
function syncBody(){while(body.length<cells.length-1){const m=new THREE.Mesh(segG,new THREE.MeshStandardMaterial({roughness:0.35}));m.castShadow=true;S.add(m);body.push(m)}
while(body.length>cells.length-1)S.remove(body.pop());body.forEach((m,i)=>m.material.color.setHSL(0.45,0.7,i%2?0.34:0.42))}
function showLv(t){lvB.textContent=t;lvB.style.opacity=1;lvB.style.transform='scale(1)';clearTimeout(showLv.t);showLv.t=setTimeout(()=>{lvB.style.opacity=0;lvB.style.transform='scale(0.8)'},1200)}
function save(){sc.textContent=score;if(score>best){best=score;bs.textContent=best;try{localStorage.setItem('snakeBest',best)}catch(e){}}}
function reset(){rocks.forEach(r=>S.remove(r.m));rocks=[];gpos=null;gold.visible=false;cells=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];prev=cells.map(c=>({...c}));dir={x:1,y:0};next=dir;score=0;eaten=0;level=1;lvE.textContent=1;speed=170;acc=0;sc.textContent=0;headM.color.set(0x0F6E56);place();addRocks(2);syncBody()}
function step(){dir=next;const h={x:cells[0].x+dir.x,y:cells[0].y+dir.y};
if(h.x<0||h.y<0||h.x>=N||h.y>=N||cells.slice(0,-1).some(c=>c.x===h.x&&c.y===h.y)||rocks.some(r=>r.x===h.x&&r.y===h.y))return die();
const old=cells,eat=h.x===fpos.x&&h.y===fpos.y,gEat=gpos&&h.x===gpos.x&&h.y===gpos.y;cells=[h,...old];if(!eat&&!gEat)cells.pop();
prev=cells.map((c,i)=>({...(old[i]||old[old.length-1])}));
if(gEat){score+=3;sGold();burst(gpos.x-H,gpos.y-H,0xEF9F27);gpos=null;gold.visible=false;save()}
if(eat){score++;eaten++;sEat();burst(fpos.x-H,fpos.y-H);place();speed=Math.max(80,speed-4);save();
if(eaten%5===0){level++;lvE.textContent=level;addRocks(2+level);sLevel();showLv('Màn '+level)}
if(!gpos&&Math.random()<0.3){gpos=free(true);if(gpos){gT=6;gold.visible=true}}}
syncBody()}
function die(){running=false;acc=speed;shake=0.6;headM.color.set(0xA32D2D);sDie();msg.textContent='Thua rồi! '+score+' điểm, tới màn '+level;stB.textContent='Chơi lại';ov.style.display='flex'}
function start(){if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(A)AC=new A()}if(AC&&AC.state==='suspended')AC.resume();reset();ov.style.display='none';running=true;showLv('Màn 1')}
function turn(x,y){if(!running)return;if((x===-dir.x&&y===-dir.y)||(x===dir.x&&y===dir.y))return;next={x,y};sTurn()}
stB.onclick=start;
document.querySelectorAll('[data-d]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();const[x,y]=b.dataset.d.split(',').map(Number);turn(x,y)}));
document.addEventListener('keydown',e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(m){e.preventDefault();turn(...m)}});
let tx,ty;wrap.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
wrap.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
wrap.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;Math.abs(dx)>Math.abs(dy)?turn(Math.sign(dx),0):turn(0,Math.sign(dy))});
reset();
let last=performance.now(),T=0;
function loop(now){const dt=Math.min((now-last)/1000,0.05);last=now;T+=dt;
if(running){acc+=dt*1000;while(running&&acc>=speed){acc-=speed;step()}
if(gpos){gT-=dt;if(gT<=0){gpos=null;gold.visible=false}}}
const k=running?Math.min(acc/speed,1):1;
const pos=i=>{const p=prev[i],c=cells[i];return[p.x+(c.x-p.x)*k-H,p.y+(c.y-p.y)*k-H]};
const[hx,hz]=pos(0);head.position.set(hx,0.45+Math.sin(T*6)*0.04,hz);
const ta=Math.atan2(dir.x,dir.y);let da=ta-head.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));head.rotation.y+=da*Math.min(1,dt*18);
body.forEach((m,i)=>{const[x,z]=pos(i+1);const s=0.9+0.07*Math.sin(T*8-i*0.7);m.position.set(x,0.4,z);m.scale.set(s,s*0.85,s)});
food.position.set(fpos.x-H,0.45+Math.sin(T*3)*0.12,fpos.y-H);food.rotation.y+=dt*2;
if(gpos){gold.position.set(gpos.x-H,0.5+Math.sin(T*5)*0.15,gpos.y-H);gold.rotation.y+=dt*4;gold.visible=gT>2||Math.sin(T*20)>0}
rocks.forEach(r=>{if(r.m.grow<1){r.m.grow=Math.min(1,r.m.grow+dt*3);r.m.scale.setScalar(Math.max(0.01,r.m.grow))}});
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.v.y-=12*dt;p.position.addScaledVector(p.v,dt);p.rotation.x+=dt*6;p.life-=dt*1.4;p.scale.setScalar(Math.max(p.life,0.01));if(p.life<=0){S.remove(p);parts.splice(i,1)}}
if(shake>0)shake=Math.max(0,shake-dt);
cam.position.set(Math.sin(T*0.3)*0.6+(Math.random()-0.5)*shake,19+(Math.random()-0.5)*shake,13);cam.lookAt(0,0,0.8);
R.render(S,cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
// HET GAME
