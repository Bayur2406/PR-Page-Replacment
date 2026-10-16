
/* ── LENIS ── */
const lenis=new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});
function raf(t){lenis.raf(t);requestAnimationFrame(raf);}requestAnimationFrame(raf);
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(t=>{lenis.raf(t*1000);});gsap.ticker.lagSmoothing(0);
gsap.registerPlugin(ScrollTrigger);

/* Reveal */
document.querySelectorAll('.reveal-word span').forEach((sp,i)=>{
  const p=sp.closest('.reveal-block')||sp.closest('h1,h2');
  gsap.to(sp,{y:0,opacity:1,filter:'blur(0px)',duration:.9,ease:'power4.out',delay:i*.08,
    scrollTrigger:{trigger:p||sp,start:'top 88%',toggleActions:'play none none none'}});
});
document.querySelectorAll('.frame-section,.metric-card,.arch-card').forEach(el=>{
  gsap.fromTo(el,{y:28,opacity:0},{y:0,opacity:1,duration:.8,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}});
});
const svgC=document.querySelector('.svg-connector');
if(svgC)ScrollTrigger.create({trigger:svgC,start:'top 80%',onEnter:()=>svgC.classList.add('animated')});

/* ═══════════════════════════════════════════
   THREE.JS — HERO CANVAS
═══════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('heroCanvas');
  if(!canvas)return;
  const rend=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  rend.setPixelRatio(Math.min(devicePixelRatio,2));rend.setClearColor(0,0);
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(43,1,.1,100);cam.position.set(6,4,8);cam.lookAt(0,0,0);
  const ms=[];
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){
    const m=new THREE.Mesh(new THREE.BoxGeometry(1.5,.35,1,4,1,3),
      new THREE.MeshBasicMaterial({color:[0x6366f1,0x818cf8,0x4f46e5,0xa5b4fc][Math.floor(Math.random()*4)],wireframe:true,transparent:true,opacity:.25+Math.random()*.15}));
    m.position.set(c*1.7-2.55,-r*.68+.68,0);m.rotation.x=-.3;m.rotation.y=.4;
    scene.add(m);ms.push({m,by:m.position.y,ph:(r+c)*.5});
  }
  const t1=new THREE.Mesh(new THREE.TorusGeometry(3.8,.02,8,80),new THREE.MeshBasicMaterial({color:0x6366f1,transparent:true,opacity:.12}));
  t1.rotation.x=Math.PI/3;scene.add(t1);
  const t2=new THREE.Mesh(new THREE.TorusGeometry(5.2,.015,6,80),new THREE.MeshBasicMaterial({color:0x4f46e5,transparent:true,opacity:.07}));
  t2.rotation.z=Math.PI/4;scene.add(t2);
  for(let i=0;i<8;i++){
    const a=(i/8)*Math.PI*2,r=3.3;
    const d=new THREE.Mesh(new THREE.SphereGeometry(.07,8,8),new THREE.MeshBasicMaterial({color:0xa5b4fc,transparent:true,opacity:.4}));
    d.position.set(Math.cos(a)*r,Math.sin(a)*.8,Math.sin(a)*r*.5);
    scene.add(d);ms.push({m:d,by:d.position.y,ph:i*.8});
  }
  scene.fog=new THREE.FogExp2(0x070707,.05);
  let t=0;
  function res(){const w=canvas.clientWidth,h=canvas.clientHeight;rend.setSize(w,h,false);cam.aspect=w/h;
    cam.fov=2*Math.atan(Math.tan(43*Math.PI/360)/Math.min(1,cam.aspect))*180/Math.PI;cam.updateProjectionMatrix();}
  res();window.addEventListener('resize',res);
  (function anim(){requestAnimationFrame(anim);t+=.008;
    ms.forEach(m=>{m.m.position.y=m.by+Math.sin(t*.9+m.ph)*.08;});
    t1.rotation.y+=.004;t2.rotation.y-=.003;
    cam.position.x=6*Math.cos(t*.04);cam.position.z=8*Math.sin(t*.04)+4;cam.lookAt(0,0,0);
    rend.render(scene,cam);})();
})();

/* ═══════════════════════════════════════════
   THREE.JS — ALGO CARD CANVASES
═══════════════════════════════════════════ */
function mkScene(id,type){
  const canvas=document.getElementById(id);if(!canvas)return;
  const rend=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  rend.setPixelRatio(Math.min(devicePixelRatio,2));rend.setClearColor(0,0);
  const scene=new THREE.Scene();
  const asp=canvas.clientWidth/canvas.clientHeight,fz=5;
  const cam=new THREE.OrthographicCamera(-fz*asp/2,fz*asp/2,fz/2,-fz/2,.1,100);
  cam.position.set(5,5,5);cam.lookAt(0,0,0);
  const items=[];let time=0;
  if(type==='fifo'){
    for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(3,.4,1,5,1,2),
      new THREE.MeshBasicMaterial({color:i===0?0xef4444:0x6366f1,wireframe:true,transparent:true,opacity:.4-i*.05}));
      m.position.set(0,i*.65-1.3,0);scene.add(m);items.push({m,by:m.position.y,ph:i*.6});}
  }else if(type==='lru'){
    for(let i=0;i<4;i++){const s=1.2-i*.15;
      const m=new THREE.Mesh(new THREE.BoxGeometry(s*2,s*.5,s,4,1,2),
        new THREE.MeshBasicMaterial({color:0x818cf8,wireframe:true,transparent:true,opacity:.5-i*.08}));
      m.position.set(0,i*.7-1,0);scene.add(m);items.push({m,by:m.position.y,ph:i*.5,rot:true});}
  }else if(type==='opt'){
    const c=new THREE.Mesh(new THREE.OctahedronGeometry(.8,1),
      new THREE.MeshBasicMaterial({color:0xfbbf24,wireframe:true,transparent:true,opacity:.5}));
    scene.add(c);items.push({m:c,by:0,ph:0,rot:true});
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2;
      const m=new THREE.Mesh(new THREE.TetrahedronGeometry(.22,0),
        new THREE.MeshBasicMaterial({color:0xe8c382,wireframe:true,transparent:true,opacity:.3}));
      m.position.set(Math.cos(a)*2,Math.sin(a)*.5,Math.sin(a)*2);
      scene.add(m);items.push({m,by:m.position.y,ph:i*.8,rot:true});}
  }else if(type==='clock'){
    for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2;
      const m=new THREE.Mesh(new THREE.SphereGeometry(i%3===0?.18:.1,8,8),
        new THREE.MeshBasicMaterial({color:i===0?0x4ade80:0x6366f1,wireframe:true,transparent:true,opacity:.5}));
      m.position.set(Math.cos(a)*2,0,Math.sin(a)*2);scene.add(m);items.push({m,by:m.position.y,ph:i*.7});}
    const ring=new THREE.Mesh(new THREE.TorusGeometry(2,.02,6,8),
      new THREE.MeshBasicMaterial({color:0x6366f1,transparent:true,opacity:.2}));
    ring.rotation.x=Math.PI/2;scene.add(ring);items.push({m:ring,by:0,ph:0,rot:true});
  }
  function res(){const w=canvas.clientWidth,h=canvas.clientHeight;rend.setSize(w,h,false);
    const a=w/h;cam.left=-fz*a/2;cam.right=fz*a/2;cam.top=fz/2;cam.bottom=-fz/2;cam.updateProjectionMatrix();}
  res();window.addEventListener('resize',res);
  (function anim(){requestAnimationFrame(anim);time+=.012;
    items.forEach(it=>{if(it.rot)it.m.rotation.y+=.007;
      it.m.position.y=(it.by||0)+Math.sin(time+it.ph)*.07;});
    rend.render(scene,cam);})();
}
mkScene('c-fifo','fifo');mkScene('c-lru','lru');mkScene('c-opt','opt');mkScene('c-clock','clock');

/* ═══════════════════════════════════════════
   ALGORITHMS
═══════════════════════════════════════════ */
function parseRef(s){
  return s.trim().replace(/,/g,' ').split(/\s+/).filter(x=>x!=='').map(x=>x.trim());
}

function fifo(ref,n){
  let q=[],faults=0,hits=0,st=[];
  for(const pg of ref){
    const inM=q.includes(pg);let rep=null;
    if(inM){hits++;}else{faults++;if(q.length>=n)rep=q.shift();q.push(pg);}
    st.push({page:pg,frames:[...q].concat(Array(n-q.length).fill(null)),fault:!inM,replaced:rep,
      note:inM?`HIT — halaman ${pg} ada di posisi frame ${q.indexOf(pg)}`
              :`FAULT — halaman ${pg} tidak ditemukan${rep?` → ganti frame berisi [${rep}]`:' → frame kosong tersedia'}`,
      faultsSoFar:faults,hitsSoFar:hits});
  }return{steps:st,faults,hits,name:'FIFO'};
}

function lru(ref,n){
  let stack=[],faults=0,hits=0,st=[];
  for(const pg of ref){
    const idx=stack.indexOf(pg),inM=idx!==-1;let rep=null;
    if(inM){hits++;stack.splice(idx,1);stack.push(pg);}
    else{faults++;if(stack.length>=n)rep=stack.shift();stack.push(pg);}
    st.push({page:pg,frames:[...stack].concat(Array(n-stack.length).fill(null)),fault:!inM,replaced:rep,
      note:inM?`HIT — halaman ${pg} ditemukan, dipindah ke posisi terbaru (MRU)`
              :`FAULT — halaman ${pg} tidak ditemukan${rep?` → ganti [${rep}] (LRU, paling lama tidak diakses)`:' → frame kosong tersedia'}`,
      faultsSoFar:faults,hitsSoFar:hits});
  }return{steps:st,faults,hits,name:'LRU'};
}

function optimal(ref,n){
  let frames=[],faults=0,hits=0,st=[];
  for(let i=0;i<ref.length;i++){
    const pg=ref[i],inM=frames.includes(pg);let rep=null;
    if(inM){hits++;}else{
      faults++;
      if(frames.length>=n){
        let far=-1,vi=0;
        for(let j=0;j<frames.length;j++){
          const nx=ref.indexOf(frames[j],i+1);
          if(nx===-1){vi=j;break;}if(nx>far){far=nx;vi=j;}
        }
        rep=frames[vi];frames.splice(vi,1);
      }frames.push(pg);
    }
    st.push({page:pg,frames:[...frames].concat(Array(n-frames.length).fill(null)),fault:!inM,replaced:rep,
      note:inM?`HIT — halaman ${pg} ada di memori`
              :`FAULT — ${rep?`ganti [${rep}] (dipakai paling jauh: ${ref.indexOf(rep,i+1)===-1?'tidak pernah lagi':('step '+(ref.indexOf(rep,i+1)+1))})`:' frame kosong tersedia'}`,
      faultsSoFar:faults,hitsSoFar:hits});
  }return{steps:st,faults,hits,name:'Optimal'};
}

function clockAlgo(ref,n){
  let pages=new Array(n).fill(null),bits=new Array(n).fill(0);
  let ptr=0,faults=0,hits=0,st=[];
  for(const pg of ref){
    const idx=pages.indexOf(pg),inM=idx!==-1;let rep=null,ptrAt=ptr;
    if(inM){hits++;bits[idx]=1;}
    else{
      faults++;let sweeps=0;
      while(bits[ptr]===1){bits[ptr]=0;ptr=(ptr+1)%n;sweeps++;}
      rep=pages[ptr];pages[ptr]=pg;bits[ptr]=1;ptrAt=ptr;ptr=(ptr+1)%n;
    }
    const filled=pages.filter(p=>p!==null);
    st.push({page:pg,frames:[...pages],allBits:[...bits],fault:!inM,replaced:rep,clockPtr:ptrAt,
      note:inM?`HIT — halaman ${pg} di slot ${idx}, set reference bit = 1`
              :`FAULT — ${rep?`pointer di slot ${ptrAt}, ganti [${rep}] (bit=0)`:' frame kosong tersedia'}`,
      faultsSoFar:faults,hitsSoFar:hits,isClock:true});
  }return{steps:st,faults,hits,name:'Clock'};
}

/* ═══════════════════════════════════════════
   SIMULATOR STATE
═══════════════════════════════════════════ */
let SIM=null,CUR=0,autoTmr=null,isAuto=false,selectedAlgo='fifo',nFrames=3;

function selectAlgo(a){
  selectedAlgo=a;
  ['fifo','lru','optimal','clock'].forEach(x=>{
    document.getElementById('tab-'+x).classList.toggle('active',x===a);
  });
}

function previewTokens(){
  const raw=document.getElementById('refInput').value;
  const tokens=parseRef(raw);
  const prev=document.getElementById('tokenPreview');
  prev.innerHTML='';
  tokens.forEach(t=>{
    const chip=document.createElement('span');
    chip.className='token-chip';chip.textContent=t;
    prev.appendChild(chip);
  });
  const errEl=document.getElementById('inputError');
  const inp=document.getElementById('refInput');
  if(tokens.length===0&&raw.trim()!==''){
    inp.classList.add('input-error');errEl.classList.remove('hidden');
    document.getElementById('inputErrorMsg').textContent='Reference string tidak valid.';
  }else{inp.classList.remove('input-error');errEl.classList.add('hidden');}
}

function setPreset(str,frames){
  document.getElementById('refInput').value=str;
  document.getElementById('frameCount').value=frames;
  previewTokens();
}

function renderFaultChart(results,bar,legend){
  const minF=Math.min(...results.map(r=>r.faults));
  const maxF=Math.max(...results.map(r=>r.faults));
  const colors=['rgba(99,102,241,.7)','rgba(139,92,246,.7)','rgba(234,179,8,.7)','rgba(59,130,246,.7)'];
  const pct=f=>maxF>0?(f/maxF*100):0;
  bar.innerHTML='';
  results.forEach((r,i)=>{
    const col=document.createElement('div');
    col.className='flex-1 flex flex-col items-center gap-1';
    col.innerHTML=`<span class="font-bebas text-2xl ${r.faults===minF?'text-gradient-green':'text-white'}">${r.faults}</span>
      <div class="w-full flex flex-col justify-end" style="height:80px;">
        <div class="comp-bar" style="height:${pct(r.faults)}%;background:${colors[i]};"></div>
      </div>
      <span class="font-manrope text-[10px] text-white/40 uppercase tracking-widest">${r.name}</span>
      <span class="font-manrope text-[10px] text-white/20">${(r.faults/(r.hits+r.faults)*100).toFixed(1)}% fault</span>`;
    bar.appendChild(col);
  });
  legend.innerHTML=results.map((r,i)=>`<div class="flex items-center gap-1.5">
    <div class="w-3 h-3 rounded" style="background:${colors[i]}"></div>
    <span class="font-manrope text-[10px] text-white/30">${r.name}: ${r.faults} faults</span>
  </div>`).join('');
}

function runSimulator(){
  const raw=document.getElementById('refInput').value;
  nFrames=parseInt(document.getElementById('frameCount').value);
  const ref=parseRef(raw);
  if(!ref.length){
    document.getElementById('refInput').classList.add('input-error');
    document.getElementById('inputError').classList.remove('hidden');
    document.getElementById('inputErrorMsg').textContent='Reference string tidak boleh kosong!';
    return;
  }
  let result;
  if(selectedAlgo==='fifo')result=fifo(ref,nFrames);
  else if(selectedAlgo==='lru')result=lru(ref,nFrames);
  else if(selectedAlgo==='optimal')result=optimal(ref,nFrames);
  else result=clockAlgo(ref,nFrames);

  SIM=result;CUR=0;
  isAuto=false;clearInterval(autoTmr);
  resetAutoBtn();

  // Show output
  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('outputPanel').classList.remove('hidden');

  // Stats
  const tot=ref.length;
  document.getElementById('s-total').textContent=tot;
  document.getElementById('s-faults').textContent=result.faults;
  document.getElementById('s-hits').textContent=result.hits;
  document.getElementById('s-frate').textContent=(result.faults/tot*100).toFixed(1)+'%';
  document.getElementById('s-hrate').textContent=(result.hits/tot*100).toFixed(1)+'%';
  document.getElementById('s-fault-bar').style.width=(result.faults/tot*100)+'%';
  document.getElementById('s-hit-bar').style.width=(result.hits/tot*100)+'%';
  document.getElementById('out-algo-label').textContent=result.name;

  // Scrubber
  const scr=document.getElementById('scrubber');
  scr.max=result.steps.length-1;scr.value=0;

  // Build table
  buildTable(result,nFrames);
  buildFullLog(result);
  buildSummaryText(result,ref,nFrames);

  // Render first step
  renderStep(0);

  // Hero pill update
  document.getElementById('heroPill').textContent=result.faults+' Faults';
  document.getElementById('heroPillRef').textContent=ref.slice(0,10).join(' ')+(ref.length>10?' …':'');

  // Scroll to output smoothly
  setTimeout(()=>document.getElementById('outputPanel').scrollIntoView({behavior:'smooth',block:'start'}),200);
}

/* Build textbook table */
function buildTable(result,n){
  const body=document.getElementById('tableBody');
  body.innerHTML='';
  const steps=result.steps;
  const isClock=steps[0]&&steps[0].isClock;

  // ROW 0: Reference page header
  let tr=document.createElement('tr');
  tr.innerHTML=`<th class="th-page row-label">Halaman Ref</th>`;
  steps.forEach((s,i)=>{
    const td=document.createElement('td');
    td.id=`hdr-${i}`;td.className='font-bebas text-base text-white/60';
    td.textContent=s.page;tr.appendChild(td);
  });
  body.appendChild(tr);

  // ROWS 1..n: Frame slots
  for(let f=0;f<n;f++){
    tr=document.createElement('tr');
    tr.innerHTML=`<th class="row-label">Frame ${f}</th>`;
    steps.forEach((s,i)=>{
      const td=document.createElement('td');
      td.id=`cell-${i}-${f}`;
      const val=s.frames[f];
      if(val===null||val===undefined){
        td.className='cell-empty';td.textContent='—';
      }else{
        td.textContent=val;
        td.className=s.replaced===val&&s.fault?'cell-replaced':'';
      }
      tr.appendChild(td);
    });
    body.appendChild(tr);
  }

  // ROW: Clock bits (if clock)
  if(isClock){
    tr=document.createElement('tr');
    tr.innerHTML=`<th class="row-label">Ref Bit</th>`;
    steps.forEach((s,i)=>{
      const td=document.createElement('td');
      td.id=`bit-row-${i}`;
      td.innerHTML=`<span class="font-manrope text-[10px]">[${(s.allBits||[]).join(',')}]</span>`;
      tr.appendChild(td);
    });
    body.appendChild(tr);
  }

  // ROW: H/F
  tr=document.createElement('tr');
  tr.innerHTML=`<th class="row-label">H / F</th>`;
  steps.forEach((s,i)=>{
    const td=document.createElement('td');
    td.id=`hf-${i}`;td.className='cell-hf '+(s.fault?'cell-fault':'cell-hit');
    td.textContent=s.fault?'F':'H';
    tr.appendChild(td);
  });
  body.appendChild(tr);

  // ROW: Running Faults
  tr=document.createElement('tr');
  tr.innerHTML=`<th class="row-label">Faults ∑</th>`;
  steps.forEach((s,i)=>{
    const td=document.createElement('td');
    td.id=`cumf-${i}`;
    td.className='font-manrope text-[10px] '+(s.fault?'text-red-400/60':'text-white/20');
    td.textContent=s.faultsSoFar;
    tr.appendChild(td);
  });
  body.appendChild(tr);
}

/* Build full log */
function buildFullLog(result){
  const el=document.getElementById('fullLog');
  el.innerHTML='';
  result.steps.forEach((s,i)=>{
    const row=document.createElement('div');
    row.className='flex items-start gap-2 px-2 py-1.5 rounded text-[10px] font-manrope '+(s.fault?'text-red-400/70':'text-emerald-400/70');
    row.innerHTML=`<span class="font-bebas text-xs w-6 flex-shrink-0 text-white/20">${i+1}</span>
      <span class="font-bebas text-sm w-6 flex-shrink-0 ${s.fault?'text-red-400':'text-white/40'}">${s.page}</span>
      <span class="text-white/30 flex-shrink-0 w-5">${s.fault?'F':'H'}</span>
      <span class="text-white/25 leading-relaxed">${s.note}</span>`;
    el.appendChild(row);
  });
}

/* Build summary text */
function buildSummaryText(result,ref,n){
  const el=document.getElementById('summaryOutput');
  el.innerHTML='';

  const overview=document.createElement('div');
  overview.className='summary-overview';
  [
    ['Algoritma',result.name],
    ['Jumlah Frame',n],
    ['Total Referensi',ref.length],
    ['Page Faults',`${result.faults} (${(result.faults/ref.length*100).toFixed(1)}%)`],
    ['Page Hits',`${result.hits} (${(result.hits/ref.length*100).toFixed(1)}%)`]
  ].forEach(([label,value])=>{
    const item=document.createElement('div');
    item.className='summary-overview-item';
    const title=document.createElement('span');
    title.textContent=label;
    const data=document.createElement('strong');
    data.textContent=value;
    item.append(title,data);
    overview.appendChild(item);
  });
  el.appendChild(overview);

  const flowWrap=document.createElement('div');
  flowWrap.className='summary-flow-wrap';
  flowWrap.setAttribute('aria-label','Diagram langkah demi langkah hasil simulasi');
  const flow=document.createElement('div');
  flow.className='summary-flow';
  result.steps.forEach((step,i)=>{
    const card=document.createElement('article');
    card.className=`summary-step ${step.fault?'summary-step-fault':'summary-step-hit'}`;

    const header=document.createElement('div');
    header.className='summary-step-header';
    const stepNumber=document.createElement('span');
    stepNumber.textContent=`STEP ${i+1}`;
    const status=document.createElement('span');
    status.className='summary-step-status';
    status.textContent=step.fault?'FAULT':'HIT';
    header.append(stepNumber,status);

    const requested=document.createElement('div');
    requested.className='summary-request';
    const requestLabel=document.createElement('span');
    requestLabel.textContent='Halaman diminta';
    const page=document.createElement('strong');
    page.textContent=step.page;
    requested.append(requestLabel,page);

    const frameLabel=document.createElement('span');
    frameLabel.className='summary-frame-label';
    frameLabel.textContent='Isi frame';
    const frames=document.createElement('div');
    frames.className='summary-frames';
    step.frames.forEach((value,frameIndex)=>{
      const slot=document.createElement('span');
      slot.className='summary-frame';
      const label=document.createElement('small');
      label.textContent=`F${frameIndex}`;
      const frameValue=document.createElement('strong');
      frameValue.textContent=value===null||value===undefined?'—':value;
      slot.append(label,frameValue);
      frames.appendChild(slot);
    });

    card.append(header,requested,frameLabel,frames);
    if(step.replaced!==null&&step.replaced!==undefined){
      const replaced=document.createElement('div');
      replaced.className='summary-replaced';
      replaced.textContent=`Diganti: halaman ${step.replaced}`;
      card.appendChild(replaced);
    }
    const runningFaults=document.createElement('div');
    runningFaults.className='summary-running-faults';
    runningFaults.textContent=`Total fault: ${step.faultsSoFar}`;
    card.appendChild(runningFaults);
    flow.appendChild(card);
  });
  flowWrap.appendChild(flow);
  el.appendChild(flowWrap);
}

/* ── RENDER STEP ── */
function renderStep(idx){
  if(!SIM)return;
  const steps=SIM.steps,total=steps.length;
  CUR=Math.max(0,Math.min(total-1,idx));
  const s=steps[CUR];
  const isClock=s.isClock;

  // Indicator
  document.getElementById('step-indicator').textContent=`${CUR+1} / ${total}`;
  document.getElementById('scrubber').value=CUR;
  document.getElementById('scrub-label').textContent=CUR+1;

  // Update all table cells
  steps.forEach((step,i)=>{
    // Header highlight
    const hdr=document.getElementById(`hdr-${i}`);
    if(hdr)hdr.className=i===CUR?'cell-current font-bebas text-base':i<CUR?'font-bebas text-sm text-white/40':'font-bebas text-sm text-white/20';

    // Frame cells
    for(let f=0;f<nFrames;f++){
      const cell=document.getElementById(`cell-${i}-${f}`);
      if(!cell)continue;
      const val=step.frames[f];
      let cls='';
      if(val===null||val===undefined){cls='cell-empty';cell.textContent='—';}
      else{
        cell.textContent=val;
        if(i===CUR){
          if(!step.fault)cls='cell-hit';
          else if(step.replaced===val)cls='cell-replaced';
          else cls='cell-fault';
          cls+=' cell-current';
        }else if(i<CUR){
          cls=step.replaced===val&&step.fault?'cell-replaced':step.fault?'cell-fault':'cell-hit';
        }else{cls='';}
      }
      cell.className=cls;
    }

    // HF
    const hf=document.getElementById(`hf-${i}`);
    if(hf){hf.className='cell-hf '+(step.fault?'cell-fault':'cell-hit');
      if(i===CUR)hf.classList.add('cell-current');}

    // Cumulative faults
    const cf=document.getElementById(`cumf-${i}`);
    if(cf){cf.className='font-manrope text-[10px] '+(i===CUR?(step.fault?'text-red-400':'text-white/40'):step.fault?'text-red-400/40':'text-white/15');
      cf.textContent=step.faultsSoFar;}
  });

  // Token chips
  document.querySelectorAll('#tokenPreview .token-chip').forEach((c,i)=>{
    c.classList.toggle('active',i===CUR);
  });

  // Detail: requested page + status
  document.getElementById('detail-page').textContent=s.page;
  const statusEl=document.getElementById('detail-status');
  statusEl.textContent=s.fault?'PAGE FAULT':'PAGE HIT';
  statusEl.className='ui-pill rounded-full px-3 py-1.5 '+(s.fault?'text-red-400':'text-emerald-400');

  // Frame slots visual
  const fsEl=document.getElementById('frameSlots');
  fsEl.innerHTML='';
  const isCk=s.isClock;
  for(let f=0;f<nFrames;f++){
    const val=s.frames[f];
    const box=document.createElement('div');
    box.className='slot-box';
    box.setAttribute('data-label','Frame '+f);
    const valSpan=document.createElement('div');valSpan.className='slot-val';
    const refSpan=document.createElement('div');refSpan.className='slot-ref';
    if(val===null||val===undefined){
      box.classList.add('s-empty');valSpan.textContent='—';refSpan.textContent='EMPTY';
    }else if(!s.fault){
      box.classList.add('s-hit');valSpan.textContent=val;refSpan.textContent='HIT';
    }else if(s.replaced===val||(!s.replaced&&val===s.page&&s.fault)){
      box.classList.add('s-fault-new');valSpan.textContent=val;refSpan.textContent='NEW';
    }else{
      box.classList.add('s-occupied');valSpan.textContent=val;refSpan.textContent='HELD';
    }
    if(isCk&&s.allBits){
      const bit=s.allBits[f];
      const bb=document.createElement('div');
      bb.className='bit-badge '+(bit===1?'b1':'b0');bb.textContent='R='+bit;
      box.appendChild(bb);
    }
    box.appendChild(valSpan);box.appendChild(refSpan);
    box.classList.add('cell-pop');
    fsEl.appendChild(box);
  }

  // Clock pointer
  const ckInfoEl=document.getElementById('clockInfo');
  if(isClock){
    ckInfoEl.classList.remove('hidden');
    document.getElementById('clockPtr').textContent=`Slot ${s.clockPtr} (setelah operasi ini: pointer → ${s.isClock?(s.clockPtr+1)%nFrames:0})`;
  }else{ckInfoEl.classList.add('hidden');}

  // Running counters
  document.getElementById('detail-faults-so-far').textContent=s.faultsSoFar;
  document.getElementById('detail-hits-so-far').textContent=s.hitsSoFar;

  // Step log
  const logEl=document.getElementById('stepLog');
  logEl.innerHTML='';
  const logEntries=[
    {icon:'solar:cpu-bold',color:'text-indigo-400',text:`Halaman yang diminta: <span class="font-bebas text-white text-base">${s.page}</span>`},
    {icon:s.fault?'solar:close-circle-linear':'solar:check-circle-linear',
     color:s.fault?'text-red-400':'text-emerald-400',
     text:s.fault?`<span class="font-700 text-red-400">PAGE FAULT</span> — halaman <span class="font-bebas text-sm">${s.page}</span> tidak ada di memori`
                 :`<span class="font-700 text-emerald-400">PAGE HIT</span> — halaman <span class="font-bebas text-sm">${s.page}</span> ditemukan di memori`},
    {icon:'solar:document-text-linear',color:'text-white/30',text:`<span class="text-white/40">${s.note}</span>`},
  ];
  if(s.replaced)logEntries.push({icon:'solar:refresh-linear',color:'text-yellow-400',
    text:`Halaman digantikan: <span class="font-bebas text-yellow-300 text-base">${s.replaced}</span>`});
  logEntries.push({icon:'solar:layers-linear',color:'text-white/25',
    text:`Isi frame setelah operasi: <span class="font-bebas text-indigo-300">[${s.frames.map(v=>v===null?'—':v).join(', ')}]</span>`});
  logEntries.push({icon:'solar:chart-square-linear',color:'text-white/20',
    text:`Faults s.d. step ini: <span class="text-red-400 font-700">${s.faultsSoFar}</span> &nbsp; Hits: <span class="text-emerald-400 font-700">${s.hitsSoFar}</span>`});

  logEntries.forEach(e=>{
    const row=document.createElement('div');row.className='log-row';
    row.innerHTML=`<iconify-icon icon="${e.icon}" class="${e.color} mt-0.5 flex-shrink-0" width="13"></iconify-icon>
      <span class="font-manrope text-[11px] text-white/40 leading-snug">${e.text}</span>`;
    logEl.appendChild(row);
  });

  // Btn states
  document.getElementById('btn-prev').disabled=CUR===0;
  document.getElementById('btn-first').disabled=CUR===0;
  document.getElementById('btn-next').disabled=CUR===total-1;
  document.getElementById('btn-last').disabled=CUR===total-1;
}

function nextStep(){if(SIM&&CUR<SIM.steps.length-1)renderStep(CUR+1);}
function prevStep(){if(SIM&&CUR>0)renderStep(CUR-1);}
function goStep(i){if(SIM)renderStep(i);}

function toggleAuto(){
  isAuto=!isAuto;
  const btn=document.getElementById('btn-auto');
  const ico=document.getElementById('auto-icon');
  if(isAuto){
    btn.classList.add('btn-primary');btn.classList.remove('btn-etched');
    ico.setAttribute('icon','solar:pause-linear');
    autoTmr=setInterval(()=>{
      if(CUR>=SIM.steps.length-1){toggleAuto();return;}
      nextStep();
    },700);
  }else{clearInterval(autoTmr);resetAutoBtn();}
}
function resetAutoBtn(){
  const btn=document.getElementById('btn-auto');
  const ico=document.getElementById('auto-icon');
  btn.classList.remove('btn-primary');btn.classList.add('btn-etched');
  ico&&ico.setAttribute('icon','solar:play-linear');
}

function resetSim(){
  SIM=null;CUR=0;isAuto=false;clearInterval(autoTmr);resetAutoBtn();
  document.getElementById('outputPanel').classList.add('hidden');
  document.getElementById('emptyState').classList.remove('hidden');
  document.getElementById('inputError').classList.add('hidden');
  document.getElementById('refInput').classList.remove('input-error');
}

function toggleFullLog(){
  const el=document.getElementById('fullLog');
  const lbl=document.getElementById('fullLogToggleLabel');
  el.classList.toggle('hidden');
  lbl.textContent=el.classList.contains('hidden')?'Tampilkan Semua Log':'Sembunyikan Log';
}

/* ═══════════════════════════════════════════
   RUN ALL — Comparison
═══════════════════════════════════════════ */
function runAll(){
  const raw=document.getElementById('refInput').value;
  nFrames=parseInt(document.getElementById('frameCount').value);
  const ref=parseRef(raw);
  if(!ref.length){alert('Masukkan reference string terlebih dahulu!');return;}

  const results=[fifo(ref,nFrames),lru(ref,nFrames),optimal(ref,nFrames),clockAlgo(ref,nFrames)];
  const minF=Math.min(...results.map(r=>r.faults));
  const maxF=Math.max(...results.map(r=>r.faults));

  // Table
  const wrap=document.getElementById('compTableWrap');
  wrap.innerHTML=`<div class="overflow-x-auto"><table class="cmp-table w-full">
    <thead><tr>
      <th class="text-left">Algoritma</th>
      <th>Faults</th><th>Hits</th>
      <th>Fault Rate</th><th>Hit Rate</th><th>Status</th>
    </tr></thead>
    <tbody>${results.map(r=>`<tr>
      <td><span class="font-manrope font-700 text-white text-xs">${r.name}</span></td>
      <td class="text-center"><span class="font-bebas text-xl ${r.faults===minF?'text-gradient-green':'text-gradient-red'}">${r.faults}</span></td>
      <td class="text-center"><span class="font-bebas text-xl text-white">${r.hits}</span></td>
      <td class="text-center text-xs">${(r.faults/ref.length*100).toFixed(1)}%</td>
      <td class="text-center text-xs">${(r.hits/ref.length*100).toFixed(1)}%</td>
      <td class="text-center">${r.faults===minF?'<span class="ui-pill rounded px-2 py-1 text-emerald-400">Terbaik ✓</span>':r.faults===maxF?'<span class="ui-pill rounded px-2 py-1 text-red-400/60">Terburuk</span>':'<span class="ui-pill rounded px-2 py-1 text-white/25">—</span>'}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;

  renderFaultChart(results,document.getElementById('barChart'),document.getElementById('barLegend'));
}

/* ── Initial token preview ── */
previewTokens();
