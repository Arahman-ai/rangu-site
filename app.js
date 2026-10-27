
/* ---------- catalog ---------- */
const PRODUCTS=[
 {c:'thermal',code:'RG-T120',name:'RTD Temperature Probe',d:'Pt100 class A probe for bearings, windings and process lines.',spec:[['Range','−50 to 400 °C'],['Accuracy','±0.15 °C at 0 °C'],['Output','4–20 mA · IO-Link'],['Housing','316L SS, IP67']],t:['Bearings','Motors','Ovens']},
 {c:'thermal',code:'RG-T450',name:'Thermal Imaging Camera',d:'Fixed LWIR camera that watches panels, kilns and conveyors for hot spots.',spec:[['Resolution','320 × 240 LWIR'],['Range','−20 to 650 °C'],['Accuracy','±2 °C or 2 %'],['Interface','PoE · MQTT · RTSP']],t:['Electrical panels','Refractory']},
 {c:'vib',code:'RG-V310',name:'Triaxial Vibration Sensor',d:'Wireless MEMS sensor with on-board velocity RMS and FFT.',spec:[['Bandwidth','2 Hz – 6 kHz'],['Range','±50 g, 3-axis'],['Link','LoRaWAN · BLE'],['Battery','Up to 5 years']],t:['Pumps','Fans','Gearboxes']},
 {c:'vib',code:'RG-V340',name:'IEPE Accelerometer',d:'Wired piezo accelerometer for high-speed spindles and bearing defects.',spec:[['Bandwidth','0.5 Hz – 15 kHz'],['Sensitivity','100 mV/g'],['Output','IEPE, M12'],['Housing','IP68']],t:['Spindles','Turbines']},
 {c:'vib',code:'RG-A520',name:'Acoustic Emission Sensor',d:'Hears crack growth, arc instability and early bearing wear long before vibration does.',spec:[['Band','100 – 900 kHz'],['Preamp','40 dB integrated'],['Output','Analog · gateway'],['Temp','−40 to 120 °C']],t:['Welding','AM','Bearings']},
 {c:'vib',code:'RG-A610',name:'Ultrasonic Microphone Array',d:'16-microphone array that locates compressed-air leaks and partial discharge.',spec:[['Band','2 – 100 kHz'],['Channels','16 MEMS mics'],['Output','Ethernet · MQTT'],['Detects','Leaks ≥ 0.2 L/min']],t:['Air systems','Switchgear']},
 {c:'vision',code:'RG-M700',name:'AI Vision Camera',d:'Global-shutter camera that runs AI defect-inspection and part-counting models on the device itself.',spec:[['Sensor','5 MP global shutter'],['Speed','60 fps'],['Inference','On-device, 8 TOPS'],['Interface','GigE · PROFINET']],t:['Inspection','Counting']},
 {c:'vision',code:'RG-M760',name:'AI Safety Camera',d:'Wide-angle camera that detects safety events on the floor: missing hard hats or vests, people entering forklift zones, blocked exits. It flags events, not identities.',spec:[['Sensor','4 MP, 120° field of view'],['Detects','PPE, zone entry, blocked exits'],['Privacy','On-device, no face recognition'],['Interface','PoE · MQTT · RTSP']],t:['Safety','PPE','Forklift zones']},
 {c:'vision',code:'RG-M740',name:'3D Laser Profile Sensor',d:'Laser triangulation for bead geometry, gaps, flush and part dimensions.',spec:[['Profile rate','4 kHz'],['Repeatability','±10 µm'],['Width','Up to 120 mm FOV'],['Interface','GigE Vision']],t:['Weld beads','Metrology']},
 {c:'process',code:'RG-E210',name:'Power & Current Monitor',d:'Three-phase monitor that spots motor faults and wasted energy from current alone.',spec:[['Current','CT clamps to 600 A'],['Harmonics','To 50th order'],['Sample','12.8 kHz/channel'],['Interface','Modbus TCP · MQTT']],t:['Motors','Energy']},
 {c:'process',code:'RG-P330',name:'Pressure Transmitter',d:'Hydraulic and process pressure with HART diagnostics.',spec:[['Range','0 – 400 bar'],['Accuracy','±0.1 % FS'],['Output','4–20 mA HART'],['Process','G½, 316L']],t:['Hydraulics','Pumps']},
 {c:'edge',code:'RG-L150',name:'UWB Asset Tag',d:'Tracks forklifts, carts and WIP bins to map how material really moves.',spec:[['Accuracy','±10 cm indoor'],['Update','Up to 10 Hz'],['Battery','2 years at 1 Hz'],['Mount','Magnet or screw']],t:['Forklifts','WIP','Layout']},
 {c:'edge',code:'RG-X900',name:'Edge Gateway',d:'Rugged gateway that samples, computes features and runs models at the machine.',spec:[['Inputs','8 analog + 4 IEPE'],['Sample','Up to 51.2 kHz'],['Protocols','OPC UA · MQTT · Modbus'],['Operating','−20 to 60 °C, DIN rail']],t:['Edge AI','Integration']}
];
const cat=document.getElementById('catalog');
if(cat){cat.innerHTML=PRODUCTS.map(p=>`<article class="card" data-c="${p.c}">
  <div class="code"><b>${p.code}</b><span>${{thermal:'Thermal',vib:'Vibration & acoustic',vision:'Machine vision',process:'Electrical & process',edge:'Location & edge'}[p.c]}</span></div>
  <h3>${p.name}</h3><p>${p.d}</p>
  <dl class="spec">${p.spec.map(s=>`<dt>${s[0]}</dt><dd>${s[1]}</dd>`).join('')}</dl>
  <div class="tags">${p.t.map(x=>`<span>${x}</span>`).join('')}</div></article>`).join('');
document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const f=b.dataset.f;
  cat.querySelectorAll('.card').forEach(c=>c.hidden=!(f==='all'||c.dataset.c===f));
}));}

/* ---------- hero readout ---------- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const CH=[{base:61.4,amp:.6,dec:1},{base:3.8,amp:.35,dec:2},{base:48,amp:2.2,dec:1},{base:37.6,amp:1.1,dec:1}];
const hist=CH.map((c,i)=>Array.from({length:40},(_,k)=>c.base+c.amp*Math.sin(k*.5+i*2)*Math.cos(k*.17+i)));
function renderReadout(){
  document.querySelectorAll('.ch').forEach((el,i)=>{
    const h=hist[i],mn=Math.min(...h),mx=Math.max(...h),r=(mx-mn)||1;
    el.querySelector('polyline').setAttribute('points',h.map((v,k)=>`${(k/(h.length-1)*200).toFixed(1)},${(25-(v-mn)/r*22).toFixed(1)}`).join(' '));
    const v=el.querySelector('.v');v.firstChild.nodeValue=h[h.length-1].toFixed(CH[i].dec);
  });
}
renderReadout();
if(!reduce){let k=40;setInterval(()=>{k++;hist.forEach((h,i)=>{const c=CH[i];h.shift();h.push(c.base+c.amp*(Math.sin(k*.5+i*2)*Math.cos(k*.17+i)+(Math.random()-.5)*.6)+(i===1?.004*(k-40):0));});renderReadout();},800);}

/* ---------- copy + form ---------- */
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
  const t=b.dataset.copy,val=b.parentElement.querySelector('.val');
  const sel=()=>{const r=document.createRange();r.selectNodeContents(val);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected';};
  try{navigator.clipboard.writeText(t).then(()=>b.textContent='Copied',sel);}catch(_){sel();}
}));
document.getElementById('f')?.addEventListener('submit',e=>{
  e.preventDefault();const ok=document.getElementById('f-ok');
  const n=document.getElementById('f-name').value.trim(),m=document.getElementById('f-mail').value.trim();
  if(!n||!/^\S+@\S+\.\S+$/.test(m)){ok.hidden=false;ok.textContent='Add your name and a valid work email so we can reply.';return;}
  ok.hidden=false;ok.textContent=`Thanks, ${n}. This form doesn't send messages yet, so please email sales@rangu.us or WhatsApp +1 (404) 203-7674 with your note about ${document.getElementById('f-int').value.toLowerCase()}.`;
});

/* ---------- explainer engine ---------- */
const W=960,H=540;
const MONO="'IBM Plex Mono', ui-monospace, monospace", SANS="'IBM Plex Sans', system-ui, sans-serif", DISP="'Barlow Condensed', 'Arial Narrow', sans-serif";
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), lerp=(a,b,k)=>a+(b-a)*k;
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const nz=x=>Math.sin(x*1.7)*.5+Math.sin(x*4.3+1)*.3+Math.sin(x*9.1+2)*.2;
function colors(){const s=getComputedStyle(document.documentElement),g=n=>s.getPropertyValue(n).trim();
  return{bg:g('--canvas'),surface:g('--surface'),ink:g('--ink'),muted:g('--muted'),line:g('--line'),grid:g('--grid'),accent:g('--accent'),soft:g('--accent-soft'),warn:g('--warn'),alarm:g('--alarm')};}
function T(g,s,x,y,o={}){g.font=`${o.w||500} ${o.s||14}px ${o.f||MONO}`;g.fillStyle=o.c;g.textAlign=o.a||'left';g.textBaseline=o.b||'alphabetic';g.fillText(s,x,y);}
function rr(g,x,y,w,h,r){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);}
function poly(g,pts,col,w=2,dash=[]){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash);g.stroke();g.setLineDash([]);}
function axes(g,c,x0,x1,y0,y1,yt,ymin,ymax,unit){
  yt.forEach(v=>{const y=lerp(y1,y0,(v-ymin)/(ymax-ymin));g.strokeStyle=c.grid;g.lineWidth=1;g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();T(g,String(v),x0-10,y+4,{c:c.muted,s:12,a:'right'});});
  g.strokeStyle=c.line;g.beginPath();g.moveTo(x0,y1);g.lineTo(x1,y1);g.stroke();
  T(g,unit,x0-10,y0-14,{c:c.muted,s:12,a:'right'});
}
function bar(g,c,x,y,w,h,col,label,val){g.fillStyle=col;g.fillRect(x,y,w,h);}

/* ===== 1. Asset health ===== */
const vib=d=>2.0+.22*nz(d*.9)+(d>34?.0035*Math.pow(d-34,2.2):0);
let FLAG=0,ALARM=0;for(let d=0;d<=60;d+=.1){if(!FLAG&&d>34&&.0035*Math.pow(d-34,2.2)>.35)FLAG=Math.ceil(d);if(!ALARM&&vib(d)>4.5)ALARM=Math.ceil(d);}
const HI=d=>100-.165*Math.pow(Math.max(0,d-34),2);
const FAIL=34+Math.sqrt(80/.165), RUL=Math.round(FAIL-FLAG);
function qpt(a,b,c2,u){const v=1-u;return[v*v*a[0]+2*v*u*b[0]+u*u*c2[0],v*v*a[1]+2*v*u*b[1]+u*u*c2[1]];}
const ASSET={still:9.6,chapters:[
 {t:'Sense',cap:'Three Rangu sensors go on a critical pump train: triaxial vibration on the motor, acoustic emission at the bearing housing, and an RTD on the pump casing. The edge gateway collects all three continuously.',draw(g,lt,c){
   g.strokeStyle=c.line;g.lineWidth=2;g.beginPath();g.moveTo(90,400);g.lineTo(640,400);g.stroke();
   rr(g,140,260,230,130,8);g.fillStyle=c.surface;g.fill();g.strokeStyle=c.ink;g.lineWidth=2;g.stroke();
   for(let i=0;i<7;i++){g.strokeStyle=c.line;g.beginPath();g.moveTo(160+i*30,275);g.lineTo(160+i*30,375);g.stroke();}
   g.fillStyle=c.ink;g.fillRect(370,316,70,16);
   g.beginPath();g.arc(510,324,66,0,7);g.fillStyle=c.surface;g.fill();g.stroke();
   g.beginPath();g.arc(510,324,22,0,7);g.strokeStyle=c.muted;g.stroke();
   g.fillStyle=c.surface;g.fillRect(500,200,22,60);g.strokeStyle=c.ink;g.strokeRect(500,200,22,60);
   T(g,'MOTOR M-204 · 75 kW',255,425,{c:c.muted,s:13,a:'center'});T(g,'PUMP P-204',510,425,{c:c.muted,s:13,a:'center'});
   const S=[{x:200,y:260,l:'VIB',col:c.accent},{x:345,y:300,l:'AE',col:c.accent},{x:470,y:262,l:'TEMP',col:c.accent}];
   const GW=[790,170];
   g.fillStyle=c.surface;rr(g,720,130,150,80,6);g.fill();g.strokeStyle=c.ink;g.lineWidth=2;g.stroke();
   T(g,'EDGE GATEWAY',795,165,{c:c.ink,s:13,a:'center',w:600});T(g,'RG-X900',795,187,{c:c.muted,s:12,a:'center'});
   S.forEach((s,i)=>{const on=seg(lt,.3+i*.5,.8+i*.5);if(!on)return;g.globalAlpha*=1;
     const ctrl=[(s.x+GW[0])/2,Math.min(s.y,GW[1])-90];
     g.beginPath();g.moveTo(s.x,s.y);g.quadraticCurveTo(ctrl[0],ctrl[1],720,170+i*12-12);g.strokeStyle=c.line;g.lineWidth=1.5;g.setLineDash([5,5]);g.stroke();g.setLineDash([]);
     for(let k=0;k<3;k++){const u=((lt*.45+k/3+i*.13)%1);const p=qpt([s.x,s.y],ctrl,[720,170+i*12-12],u);g.beginPath();g.arc(p[0],p[1],3.5,0,7);g.fillStyle=c.accent;g.fill();}
     g.fillStyle=s.col;g.fillRect(s.x-9,s.y-9,18,18);T(g,s.l,s.x,s.y-16,{c:c.ink,s:12,a:'center',w:600});
   });
   const tr=[['VIB mm/s',c.accent,3],['AE dB',c.accent,7],['TEMP °C',c.accent,.6]];
   tr.forEach((r,i)=>{const y=270+i*62,a=seg(lt,1.8+i*.4,2.6+i*.4);if(!a)return;T(g,r[0],720,y-18,{c:c.muted,s:12});
     const pts=[];for(let x=0;x<=150;x+=3)pts.push([720+x,y+Math.sin((x+lt*120)*.08*(i+1))*r[2]*1.6*(i==2?4:1)/ (i==1?2.2:1)]);poly(g,pts,r[1],1.6);});
 }},
 {t:'Detect',cap:`The model learns this pump's normal vibration, then flags drift on day ${FLAG}. A fixed 4.5 mm/s alarm would not trip until day ${ALARM}, giving the team ${ALARM-FLAG} extra days of warning.`,draw(g,lt,c){
   const x0=110,x1=880,y0=120,y1=440,xm=d=>lerp(x0,x1,d/60),ym=v=>lerp(y1,y0,v/8);
   axes(g,c,x0,x1,y0,y1,[0,2,4,6,8],0,8,'mm/s');
   [0,15,30,45,60].forEach(d=>T(g,'day '+d,xm(d),y1+22,{c:c.muted,s:12,a:'center'}));
   g.strokeStyle=c.alarm;g.setLineDash([6,5]);g.beginPath();g.moveTo(x0,ym(4.5));g.lineTo(x1,ym(4.5));g.stroke();g.setLineDash([]);
   T(g,'Fixed alarm limit 4.5 mm/s',x1,ym(4.5)-8,{c:c.alarm,s:12,a:'right'});
   g.fillStyle=c.soft;g.fillRect(x0,ym(2.45),x1-x0,ym(1.55)-ym(2.45));T(g,'learned normal band',x0+8,ym(2.45)-6,{c:c.muted,s:12});
   const dEnd=ease(seg(lt,0,4.3))*60,pts=[];for(let d=0;d<=dEnd;d+=.25)pts.push([xm(d),ym(vib(d))]);poly(g,pts,c.ink,2);
   if(dEnd>=FLAG){const x=xm(FLAG),y=ym(vib(FLAG));g.beginPath();g.arc(x,y,7,0,7);g.fillStyle=c.warn;g.fill();
     g.strokeStyle=c.warn;g.beginPath();g.moveTo(x,y-10);g.lineTo(x,y0+40);g.stroke();
     rr(g,x-170,y0+6,170,48,4);g.fillStyle=c.surface;g.fill();g.strokeStyle=c.warn;g.stroke();
     T(g,`Rangu flags drift · day ${FLAG}`,x-160,y0+26,{c:c.ink,s:12,w:600});T(g,'outer-race tone rising',x-160,y0+44,{c:c.muted,s:12});}
   if(dEnd>=ALARM){const x=xm(ALARM),y=ym(4.5);g.beginPath();g.arc(x,y,6,0,7);g.fillStyle=c.alarm;g.fill();
     T(g,`alarm · day ${ALARM}`,x-10,y+24,{c:c.alarm,s:12,a:'right'});
     const xa=xm(FLAG);g.strokeStyle=c.accent;g.lineWidth=2;g.beginPath();g.moveTo(xa,y1-30);g.lineTo(x,y1-30);g.stroke();
     T(g,`${ALARM-FLAG} days earlier`,(xa+x)/2,y1-38,{c:c.accent,s:13,a:'center',w:600});}
 }},
 {t:'Predict',cap:`A health index tracks bearing condition. Projecting its decline gives a remaining useful life of about ${RUL} days from the first flag, enough time to order the bearing and plan the swap.`,draw(g,lt,c){
   const x0=110,x1=880,y0=120,y1=440,d0=25,d1=62,xm=d=>lerp(x0,x1,(d-d0)/(d1-d0)),ym=v=>lerp(y1,y0,v/100);
   axes(g,c,x0,x1,y0,y1,[0,20,40,60,80,100],0,100,'health');
   [30,40,50,60].forEach(d=>T(g,'day '+d,xm(d),y1+22,{c:c.muted,s:12,a:'center'}));
   g.strokeStyle=c.alarm;g.setLineDash([6,5]);g.beginPath();g.moveTo(x0,ym(20));g.lineTo(x1,ym(20));g.stroke();g.setLineDash([]);
   T(g,'replace by this level',x1,ym(20)+18,{c:c.alarm,s:12,a:'right'});
   const k1=ease(seg(lt,0,2)),dObs=lerp(d0,FLAG,k1),pts=[];for(let d=d0;d<=dObs;d+=.25)pts.push([xm(d),ym(HI(d)+1.2*nz(d))]);poly(g,pts,c.ink,2.2);
   const k2=ease(seg(lt,2,4.2));
   if(k2>0){const dF=lerp(FLAG,FAIL,k2);g.beginPath();for(let d=FLAG;d<=dF;d+=.25){const s=(d-FLAG)*.9;g.lineTo(xm(d),ym(HI(d)+s));}
     for(let d=dF;d>=FLAG;d-=.25){const s=(d-FLAG)*.9;g.lineTo(xm(d),ym(HI(d)-s));}g.closePath();g.fillStyle=c.soft;g.fill();
     const fp=[];for(let d=FLAG;d<=dF;d+=.25)fp.push([xm(d),ym(HI(d))]);poly(g,fp,c.accent,2.2,[7,5]);}
   g.strokeStyle=c.muted;g.beginPath();g.moveTo(xm(FLAG),y0);g.lineTo(xm(FLAG),y1);g.stroke();T(g,'today',xm(FLAG)+6,y0+14,{c:c.muted,s:12});
   if(lt>4.2){const xa=xm(FLAG),xb=xm(FAIL),y=ym(20)-34;g.strokeStyle=c.accent;g.lineWidth=2;g.beginPath();g.moveTo(xa,y);g.lineTo(xb,y);g.moveTo(xa,y-6);g.lineTo(xa,y+6);g.moveTo(xb,y-6);g.lineTo(xb,y+6);g.stroke();
     T(g,`RUL ≈ ${RUL} days`,(xa+xb)/2,y-10,{c:c.accent,s:20,f:DISP,a:'center',w:600});}
 }},
 {t:'Act',cap:'Instead of a surprise failure mid-shift, the bearing is swapped during a planned stop. In this example that turns roughly 14 hours of unplanned downtime into a 2-hour scheduled job.',draw(g,lt,c){
   const k=ease(seg(lt,.2,2.6)),sc=40;
   T(g,'Downtime for one bearing failure (hours)',110,150,{c:c.muted,s:14});
   const rows=[['Run to failure',14,c.alarm,'unplanned stop, seal damage, expedited parts'],['Rangu planned swap',2,c.accent,'done during weekend changeover']];
   rows.forEach((r,i)=>{const y=200+i*120;T(g,r[0],110,y,{c:c.ink,s:26,f:DISP,w:600});
     g.fillStyle=r[2];g.fillRect(110,y+16,r[1]*sc*k,40);T(g,(r[1]*k).toFixed(0)+' h',110+r[1]*sc*k+12,y+44,{c:c.ink,s:18,w:600});
     T(g,r[3],110,y+80,{c:c.muted,s:13});});
   if(lt>3)T(g,'Illustrative scenario · single pump train',850,470,{c:c.muted,s:12,a:'right'});
 }}]};

/* ===== 2. Layout ===== */
const NAMES=['RECEIVE','CUT','WELD','PAINT','ASSEMBLE','SHIP'];
const BAD=[[150,175],[790,420],[210,420],[800,175],[480,300],[170,300]];
const GOOD=[[170,190],[370,190],[570,190],[770,190],[570,400],[370,400]];
const mpx=.1,TRIPS=24;
function route(P){const pts=[P[0]];let L=0;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i];pts.push([b[0],a[1]],b);L+=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]);}return{pts,L};}
const RB=route(BAD),RG=route(GOOD);
function along(pts,dist){const out=[pts[0]];let left=dist;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(left>=l){out.push(b);left-=l;}else{const k=l?left/l:0;out.push([lerp(a[0],b[0],k),lerp(a[1],b[1],k)]);return out;}}return out;}
function floor(g,c){rr(g,70,100,820,390,4);g.fillStyle=c.surface;g.fill();g.strokeStyle=c.line;g.lineWidth=2;g.stroke();
  for(let x=90;x<890;x+=40)for(let y=120;y<490;y+=40){g.fillStyle=c.grid;g.fillRect(x,y,2,2);}
  [[275,245],[685,245],[275,355],[685,355]].forEach(p=>{g.fillStyle=c.line;g.fillRect(p[0]-6,p[1]-6,12,12);});
  g.fillStyle=c.accent;g.fillRect(66,150,8,60);g.fillRect(66,370,8,60);T(g,'DOCK',82,140,{c:c.muted,s:11});}
function stations(g,c,P,hi){P.forEach((p,i)=>{rr(g,p[0]-50,p[1]-28,100,56,4);g.fillStyle=c.bg;g.fill();g.strokeStyle=hi===i?c.accent:c.ink;g.lineWidth=2;g.stroke();
  T(g,String(i+1),p[0]-40,p[1]-8,{c:c.accent,s:12,w:600});T(g,NAMES[i],p[0],p[1]+12,{c:c.ink,s:13,a:'center',w:600});});}
function odo(g,c,label,m,col){rr(g,640,22,250,62,4);g.fillStyle=c.surface;g.fill();g.strokeStyle=c.line;g.lineWidth=1;g.stroke();
  T(g,label,656,44,{c:c.muted,s:12});T(g,`${Math.round(m)} m`,656,74,{c:col,s:28,f:DISP,w:600});}
const LAYOUT={still:21,chapters:[
 {t:'Track',cap:'UWB tags on forklifts and carts record every move. On this floor, one job travels the full route from receiving to shipping, crossing the building again and again.',draw(g,lt,c){
   floor(g,c);const k=ease(seg(lt,.3,5.4)),pts=along(RB.pts,RB.L*k);
   poly(g,pts,c.alarm,3);stations(g,c,BAD);const p=pts[pts.length-1];g.beginPath();g.arc(p[0],p[1],8,0,7);g.fillStyle=c.warn;g.fill();
   odo(g,c,'Forklift travel per job',RB.L*k*mpx,c.alarm);
 }},
 {t:'Map',cap:'Pallet counts from vision sensors show how much material moves between each pair of stations. Thick lines are heavy flows, and here the heaviest flows are also the longest trips.',draw(g,lt,c){
   floor(g,c);const F=[[0,1,24],[1,2,24],[2,3,22],[3,4,22],[4,5,20],[2,1,4]],k=ease(seg(lt,.2,2.4));
   F.forEach((f,i)=>{const a=BAD[f[0]],b=BAD[f[1]];g.globalAlpha=k;g.strokeStyle=f[2]<10?c.warn:c.accent;g.lineWidth=f[2]/2.4;g.beginPath();g.moveTo(a[0],a[1]+(i==5?14:0));g.lineTo(b[0],b[1]+(i==5?14:0));g.stroke();
     T(g,f[2]+'/shift',(a[0]+b[0])/2+8,(a[1]+b[1])/2-8+(i==5?24:0),{c:c.ink,s:12,w:600});g.globalAlpha=1;});
   stations(g,c,BAD);
   rr(g,640,22,250,62,4);g.fillStyle=c.surface;g.fill();g.strokeStyle=c.line;g.stroke();T(g,'Pallets moved per shift',656,44,{c:c.muted,s:12});T(g,'136 · incl. 4 rework',656,74,{c:c.ink,s:24,f:DISP,w:600});
 }},
 {t:'Optimize',cap:'An optimizer tests thousands of arrangements against the measured flows, aisle rules and fixed columns. It settles on a U-shaped cell that keeps every handoff short and puts shipping back near the dock.',draw(g,lt,c){
   floor(g,c);const k=ease(seg(lt,.4,4.6)),P=BAD.map((b,i)=>[lerp(b[0],GOOD[i][0],k),lerp(b[1],GOOD[i][1],k)]);
   g.globalAlpha=1-k*.6;poly(g,route(P).pts,c.muted,2,[5,5]);g.globalAlpha=1;
   stations(g,c,P,Math.floor(lt*2)%6);
   const L=route(P).L;odo(g,c,'Travel per job (candidate)',L*mpx,k>.95?c.accent:c.ink);
 }},
 {t:'Result',cap:`The new layout cuts forklift travel from ${Math.round(RB.L*mpx)} m to ${Math.round(RG.L*mpx)} m per job. At ${TRIPS} jobs a shift that is about ${((RB.L-RG.L)*mpx*TRIPS/1000).toFixed(1)} km less driving, with fewer crossings and less congestion.`,draw(g,lt,c){
   floor(g,c);const k=ease(seg(lt,.2,3.2)),pts=along(RG.pts,RG.L*k);poly(g,pts,c.accent,3.5);stations(g,c,GOOD);
   const p=pts[pts.length-1];g.beginPath();g.arc(p[0],p[1],8,0,7);g.fillStyle=c.accent;g.fill();
   const b=seg(lt,2.6,4.4);rr(g,650,285,225,180,4);g.fillStyle=c.bg;g.fill();g.strokeStyle=c.line;g.lineWidth=1;g.stroke();
   T(g,'Travel per shift',666,310,{c:c.muted,s:12});
   const mx=RB.L*mpx*TRIPS/1000,sc=190/mx;
   [['Before',RB.L*mpx*TRIPS/1000,c.alarm],['After',RG.L*mpx*TRIPS/1000,c.accent]].forEach((r,i)=>{const y=335+i*56;T(g,r[0],666,y,{c:c.ink,s:12,w:600});g.fillStyle=r[2];g.fillRect(666,y+8,r[1]*sc*b,18);T(g,(r[1]).toFixed(1)+' km',666,y+44,{c:c.muted,s:12});});
   if(b>=1)T(g,`−${Math.round((1-RG.L/RB.L)*100)}%`,860,320,{c:c.accent,s:26,f:DISP,w:700,a:'right'});
 }}]};

/* ===== 3. Operations ===== */
const SX=[170,370,570,770],SN=['S1 PRESS','S2 MACHINE','S3 INSPECT','S4 PACK'],CT0=[40,45,62,42],CT1=[44,47,49,49],TAKT=52;
const UPH0=3600/Math.max(...CT0),UPH1=3600/Math.max(...CT1);
function line(g,c,lt,q,hi,ct){
  g.strokeStyle=c.line;g.lineWidth=10;g.beginPath();g.moveTo(60,200);g.lineTo(900,200);g.stroke();
  const qx=515,qEnd=qx-q*16;
  for(let i=0;i<10;i++){const x=60+((lt*70+i*48)%470);if(x>qEnd-10)continue;g.fillStyle=c.ink;g.fillRect(x-6,194,12,12);}
  for(let i=0;i<q;i++){g.fillStyle=c.warn;g.fillRect(qx-8-i*16-6,194,12,12);}
  for(let i=0;i<3;i++){const x=625+((lt*70+i*95)%275);g.fillStyle=c.accent;g.fillRect(x-6,194,12,12);}
  SX.forEach((x,i)=>{rr(g,x-55,162,110,76,4);g.fillStyle=c.surface;g.fill();g.strokeStyle=hi===i?c.alarm:c.ink;g.lineWidth=hi===i?3:2;g.stroke();
    T(g,SN[i],x,192,{c:c.ink,s:13,a:'center',w:600});T(g,ct[i].toFixed(0)+' s cycle',x,214,{c:c.muted,s:12,a:'center'});});
  if(q>0)T(g,`queue ${q}`,qx-8,150,{c:c.warn,s:12,a:'right',w:600});
}
function ctChart(g,c,ct,title){const y1=470,y0=305,sc=(y1-y0)/70;T(g,title,110,292,{c:c.muted,s:12});
  g.strokeStyle=c.line;g.lineWidth=1;g.beginPath();g.moveTo(100,y1);g.lineTo(860,y1);g.stroke();
  const mx=Math.max(...ct);SX.forEach((x,i)=>{const h=ct[i]*sc;g.fillStyle=ct[i]>TAKT?c.alarm:ct[i]===mx?c.warn:c.accent;g.fillRect(x-30,y1-h,60,h);T(g,ct[i].toFixed(0)+' s',x,y1-h-8,{c:c.ink,s:12,a:'center',w:600});});
  const ty=y1-TAKT*sc;g.strokeStyle=c.ink;g.setLineDash([6,5]);g.beginPath();g.moveTo(100,ty);g.lineTo(860,ty);g.stroke();g.setLineDash([]);T(g,`takt ${TAKT} s`,860,ty-6,{c:c.ink,s:12,a:'right'});}
const OPS={still:21,chapters:[
 {t:'Observe',cap:'Vision cameras count parts at each station and acoustic sensors pick up each press stroke and tool cycle, so every cycle on the line is timed automatically. Work is piling up in front of S3.',draw(g,lt,c){
   const q=Math.floor(2+seg(lt,0,5.5)*7);line(g,c,lt,q,-1,CT0);
   const y1=470,y0=305;T(g,'Utilization',110,292,{c:c.muted,s:12});g.strokeStyle=c.line;g.beginPath();g.moveTo(100,y1);g.lineTo(860,y1);g.stroke();
   SX.forEach((x,i)=>{const u=CT0[i]/62,h=u*(y1-y0)*ease(seg(lt,.5,2.5));g.fillStyle=u>.97?c.alarm:c.accent;g.fillRect(x-30,y1-h,60,h);if(h>4)T(g,Math.round(u*100)+'%',x,y1-h-8,{c:c.ink,s:12,a:'center',w:600});});
 }},
 {t:'Diagnose',cap:`S3 inspection takes ${CT0[2]} s per part against a takt time of ${TAKT} s. It is the constraint: S1 and S2 starve it with work, and S4 sits idle a third of the time waiting for parts.`,draw(g,lt,c){
   line(g,c,lt,9,2,CT0);const pulse=(Math.sin(lt*5)+1)/2;g.strokeStyle=c.alarm;g.globalAlpha=.3+.5*pulse;g.lineWidth=2;rr(g,570-68,150,136,100,8);g.stroke();g.globalAlpha=1;
   T(g,'CONSTRAINT',570,140,{c:c.alarm,s:12,a:'center',w:600});ctChart(g,c,CT0,'Cycle time by station');
 }},
 {t:'Rebalance',cap:'The optimizer moves a visual check from S3 into the camera at S4 and shifts one fixture step to S1 and S2. Total work stays the same, but now every station finishes under takt and the queue drains.',draw(g,lt,c){
   const k=ease(seg(lt,.5,4)),ct=CT0.map((v,i)=>lerp(v,CT1[i],k)),q=Math.round(lerp(9,1,k));
   line(g,c,lt,q,k<.8?2:-1,ct);ctChart(g,c,ct,'Cycle time by station');
 }},
 {t:'Result',cap:`Throughput rises from about ${UPH0.toFixed(0)} to ${UPH1.toFixed(0)} units per hour, a ${Math.round((UPH1/UPH0-1)*100)}% gain from the same people and machines. The change goes live at hour 3 of the shift.`,draw(g,lt,c){
   const x0=110,x1=870,y0=130,y1=440,xm=h=>lerp(x0,x1,h/8),ym=v=>lerp(y1,y0,(v-40)/45);
   axes(g,c,x0,x1,y0,y1,[40,55,70,85],40,85,'units/h');for(let h=0;h<=8;h+=2)T(g,'hour '+h,xm(h),y1+22,{c:c.muted,s:12,a:'center'});
   const u=h=>(h<3?UPH0:h<3.75?lerp(UPH0,UPH1,(h-3)/.75):UPH1)+1.4*nz(h*3);
   const hEnd=ease(seg(lt,0,4))*8,pts=[];for(let h=0;h<=hEnd;h+=.05)pts.push([xm(h),ym(u(h))]);poly(g,pts,c.accent,2.4);
   g.strokeStyle=c.muted;g.setLineDash([4,4]);g.beginPath();g.moveTo(xm(3),y0);g.lineTo(xm(3),y1);g.stroke();g.setLineDash([]);T(g,'rebalance live',xm(3)+6,y0+14,{c:c.muted,s:12});
   T(g,`${UPH0.toFixed(0)}/h`,xm(1.5),ym(UPH0)+30,{c:c.ink,s:22,f:DISP,a:'center',w:600});
   if(hEnd>5){T(g,`${UPH1.toFixed(0)}/h`,xm(6),ym(UPH1)-18,{c:c.accent,s:22,f:DISP,a:'center',w:600});T(g,`+${Math.round((UPH1/UPH0-1)*100)}% throughput`,x1,y0-10,{c:c.accent,s:16,a:'right',w:600});}
 }}]};

/* ---------- solutions markup ---------- */
const SOLS=[
 {id:'asset',spec:ASSET,title:'Asset health, performance & reliability',
  p:'Continuous condition monitoring for motors, pumps, gearboxes and presses. Models learn each machine’s normal signature, flag drift weeks before fixed alarms, and estimate remaining useful life so maintenance happens on your schedule.',
  kv:[['Sensors','<code>RG-V310</code> <code>RG-A520</code> <code>RG-T120</code> <code>RG-E210</code>'],['Models','Anomaly detection, fault classification, RUL forecasting'],['Outputs','Ranked work orders in your CMMS, asset health scores']]},
 {id:'layout',spec:LAYOUT,title:'Industrial layout optimization',
  p:'Measure how material and people actually move, then test new floor plans before anything is bolted down. The optimizer respects columns, aisles, safety zones and utility drops while minimizing flow-weighted travel.',
  kv:[['Sensors','<code>RG-L150</code> <code>RG-M700</code>'],['Models','Flow mapping, facility layout optimization, discrete-event simulation'],['Outputs','Ranked layout scenarios with travel and congestion estimates']]},
 {id:'ops',spec:OPS,title:'Operations optimization',
  p:'Find the true constraint on a line from real cycle data, not stopwatch studies. Rangu balances work across stations, sequences changeovers and recommends shift schedules that lift throughput without new equipment.',
  kv:[['Sensors','<code>RG-M700</code> <code>RG-A610</code> <code>RG-E210</code> <code>RG-X900</code>'],['Models','Bottleneck detection, line balancing, scheduling optimization'],['Outputs','Shift-level recommendations, OEE and throughput tracking']]}
];
const list=document.getElementById('sol-list');
if(list)list.innerHTML=SOLS.map((s,i)=>`<article class="solution" id="${s.id}">
  <div class="copy"><span class="num">SOLUTION ${String(i+1).padStart(2,'0')}</span><h3>${s.title}</h3><p>${s.p}</p>
  <dl class="kv">${s.kv.map(k=>`<dt>${k[0]}</dt><dd>${k[1]}</dd>`).join('')}</dl></div>
  <div class="player" data-i="${i}">
    <canvas role="img" aria-label="Animated explainer: ${s.title}"></canvas>
    <div class="controls"><button class="pp" type="button" aria-label="Play"></button><input type="range" min="0" max="24" step="0.05" aria-label="Seek"><span class="time">0:00 / 0:24</span></div>
    <div class="chapters">${s.spec.chapters.map((c,k)=>`<button type="button" data-k="${k}"><b>0${k+1}</b>${c.t}</button>`).join('')}</div>
    <p class="caption" aria-live="polite"></p>
  </div></article>`).join('');

const PLAY='<svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>',PAUSE='<svg width="14" height="14" viewBox="0 0 14 14"><rect x="2.5" y="1.5" width="3" height="11" fill="currentColor"/><rect x="8.5" y="1.5" width="3" height="11" fill="currentColor"/></svg>';
const players=[];
document.querySelectorAll('.player').forEach(el=>{
  const spec=SOLS[+el.dataset.i].spec,cv=el.querySelector('canvas'),g=cv.getContext('2d'),pp=el.querySelector('.pp'),rng=el.querySelector('input'),tm=el.querySelector('.time'),cap=el.querySelector('.caption'),chs=[...el.querySelectorAll('.chapters button')];
  const DUR=6,TOT=24;const st={t:spec.still,playing:false,user:false,last:0,raf:0,ch:-1};
  function draw(){
    const c=colors(),sx=cv.width/W;g.setTransform(sx,0,0,sx,0,0);g.globalAlpha=1;g.fillStyle=c.bg;g.fillRect(0,0,W,H);
    const i=Math.min(3,Math.floor(st.t/DUR)),lt=st.t-i*DUR,a=Math.min(1,lt/.35,i<3?(DUR-lt)/.35:1);
    g.save();g.globalAlpha=Math.max(0,a);spec.chapters[i].draw(g,lt,c);g.restore();
    T(g,`0${i+1}`,32,52,{c:c.accent,s:13,w:600});T(g,spec.chapters[i].t.toUpperCase(),60,54,{c:c.ink,s:26,f:DISP,w:700});
    g.fillStyle=c.grid;g.fillRect(0,H-4,W,4);g.fillStyle=c.accent;g.fillRect(0,H-4,W*st.t/TOT,4);
    rng.value=st.t;const s=Math.floor(st.t);tm.textContent=`0:${String(s).padStart(2,'0')} / 0:24`;
    if(st.ch!==i){st.ch=i;cap.textContent=spec.chapters[i].cap;chs.forEach((b,k)=>b.setAttribute('aria-current',k===i));}
  }
  function frame(ts){if(!st.playing)return;const dt=Math.min(.1,(ts-(st.last||ts))/1000);st.last=ts;st.t+=dt;if(st.t>=TOT)st.t=0;draw();st.raf=requestAnimationFrame(frame);}
  function play(){if(st.playing)return;st.playing=true;st.last=0;pp.innerHTML=PAUSE;pp.setAttribute('aria-label','Pause');st.raf=requestAnimationFrame(frame);}
  function pause(){st.playing=false;cancelAnimationFrame(st.raf);pp.innerHTML=PLAY;pp.setAttribute('aria-label','Play');}
  pp.innerHTML=PLAY;
  pp.addEventListener('click',()=>{st.user=true;st.playing?pause():play();});
  rng.addEventListener('input',()=>{st.t=+rng.value;draw();});
  chs.forEach((b,k)=>b.addEventListener('click',()=>{st.t=k*DUR+.01;draw();if(!st.playing){st.user=true;play();}}));
  function size(){const w=cv.clientWidth,d=Math.min(2,devicePixelRatio||1);cv.width=Math.round(w*d);cv.height=Math.round(w*d*H/W);draw();}
  new ResizeObserver(size).observe(cv);
  players.push({el,st,play,pause,draw});
});
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{const p=players.find(x=>x.el===e.target);if(!p)return;
  if(e.isIntersecting&&e.intersectionRatio>.55){if(!reduce&&!p.st.user)p.play();}else if(p.st.playing&&!p.st.user)p.pause();}),{threshold:[0,.55]});players.forEach(p=>io.observe(p.el));}
const redraw=()=>players.forEach(p=>p.draw());
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',redraw);
new MutationObserver(redraw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
if(document.fonts)document.fonts.ready.then(redraw);
