/* LIVART Wear — content renderer (content/site.json) */
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nl=s=>esc(s).replace(/\n/g,"<br>");
const PAGE=document.body.dataset.page;
const V="?v=1";
const NAV=[["company.html","COMPANY","회사소개"],["reference.html","REFERENCE","레퍼런스"],["portfolio.html","PORTFOLIO","포트폴리오"],["contact.html","CONTACT","견적문의"]];
let S;

function chrome(){
  const cur=location.pathname.split("/").pop()||"index.html";
  $("#top").innerHTML=`${S.notice?`<div class="notice">${esc(S.notice)}</div>`:""}
  <header class="hd"><div class="wrap">
    <a class="logo" href="index.html" aria-label="LIVART Wear 홈"><img src="images/brand/logo-h.png" alt="LIVART Wear"></a>
    <nav class="gnb">${NAV.map(([h,e])=>`<a href="${h}" class="${cur===h?"on":""}">${e}</a>`).join("")}</nav>
    <a class="hd-cta" href="contact.html">견적 문의</a>
    <button class="menu-btn" aria-label="메뉴 열기" aria-expanded="false"><span></span></button>
  </div></header>
  <div class="mnav">${NAV.map(([h,e,k])=>`<a href="${h}">${e}<small>${k}</small></a>`).join("")}</div>`;
  const b=$(".menu-btn"), m=$(".mnav");
  b.onclick=()=>{const o=m.classList.toggle("open"); b.setAttribute("aria-expanded",o); document.documentElement.style.setProperty("--nt",(document.querySelector(".notice")?.offsetHeight||0)+"px"); document.body.style.overflow=o?"hidden":"";};
  const f=S.footer||{};
  $("#foot").innerHTML=`<footer class="ft"><div class="wrap">
    <div class="top"><img src="images/brand/logo-slogan-white.png" alt="LIVART Everywhere, Every wear"><nav>${NAV.map(([h,e])=>`<a href="${h}">${e}</a>`).join("")}</nav></div>
    <div class="info"><span><b>${esc(f.company)}</b></span><span><em>대표이사</em>${esc(f.ceo)}</span><span><em>본사</em>${esc(f.hq)}</span><span><em>서울사무소</em>${esc(f.seoul)}</span><span><em>사업자등록번호</em>${esc(f.bizNo)}</span><span><em>개인정보보호책임자</em>${esc(f.privacyOfficer)}</span><span><em>Email</em>${esc(f.email)}</span></div>
    <div class="cp">${esc(f.copyright)}</div></div></footer>`;
}

/* lightbox */
let LB=[],LI=0;
function lbInit(){
  const el=document.createElement("div"); el.className="lb"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true");
  el.innerHTML=`<button class="x" aria-label="닫기">×</button><button class="nav prev" aria-label="이전">‹</button><div class="stage"><img alt=""></div><div class="cap"></div><button class="nav next" aria-label="다음">›</button>`;
  document.body.appendChild(el);
  const close=()=>{el.classList.remove("open");document.body.style.overflow="";};
  el.querySelector(".x").onclick=close; el.onclick=e=>{if(e.target===el||e.target.classList.contains("stage"))close();};
  el.querySelector(".prev").onclick=e=>{e.stopPropagation();show(LI-1)}; el.querySelector(".next").onclick=e=>{e.stopPropagation();show(LI+1)};
  document.addEventListener("keydown",e=>{if(!el.classList.contains("open"))return; if(e.key==="Escape")close(); if(e.key==="ArrowLeft")show(LI-1); if(e.key==="ArrowRight")show(LI+1);});
  let sx=0; el.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true}); el.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-sx; if(Math.abs(d)>50)show(LI+(d<0?1:-1));});
  function show(i){LI=(i+LB.length)%LB.length; el.querySelector("img").src=LB[LI].src; el.querySelector(".cap").textContent=`${LB[LI].cap||""}  ${LI+1} / ${LB.length}`; el.querySelectorAll(".nav").forEach(n=>n.style.display=LB.length>1?"":"none");}
  window.openLB=(list,i)=>{LB=list;show(i||0);el.classList.add("open");document.body.style.overflow="hidden";};
}
const MODELS=["P01_00","P02_04","P02_05","P03_06","P03_07","P04_09","P05_10","P06_12"];
const isGarment=src=>!MODELS.some(m=>src.includes(m));

function projCard(p){
  const main=p.images[0], th=p.images.slice(1,5);
  return `<button class="proj" data-no="${esc(p.no)}"><div class="main"><img loading="lazy" class="${isGarment(main)?"garment":""}" src="${esc(main)}${V}" alt="PROJECT ${esc(p.no)} ${esc(p.industry)}"></div>
  ${th.length?`<div class="thumbs">${th.map(s=>`<img loading="lazy" src="${esc(s)}${V}" alt="">`).join("")}</div>`:""}
  <div class="meta"><div class="no">PROJECT ${esc(p.no)} · ${esc(p.year)}</div><h3>${esc(p.industry)}</h3><p>${esc(p.scope)}</p></div></button>`;
}
function bindProj(root){
  root.querySelectorAll(".proj").forEach(b=>b.onclick=()=>{const p=S.projects.find(x=>x.no===b.dataset.no); openLB(p.images.map(s=>({src:s+V,cap:`PROJECT ${p.no} · ${p.industry}`})),0);});
}
const capIcons=[
 '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 38l4-12L34 6l8 8-20 20z"/><path d="M30 10l8 8M10 38l12-4"/></svg>',
 '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 14h36v24H6z"/><path d="M6 20h36M14 14V8h20v6"/><path d="M14 28h8M14 32h14"/></svg>',
 '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="24" cy="24" r="16"/><path d="M16 24l6 6 11-12"/></svg>',
 '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 14h24v20H4zM28 20h9l7 7v7H28z"/><circle cx="12" cy="36" r="3.5"/><circle cx="36" cy="36" r="3.5"/></svg>'];

/* pages */
function home(){
  const h=S.home;
  $("#main").innerHTML=`
  <section class="hero"><div class="txt grid-bg"><span class="eyebrow">CORPORATE UNIFORM SPECIALIST</span>
    <h1>Everywhere,<br><em>Every wear.</em></h1><p>${esc(h.heroSub)}</p>
    <div class="acts"><a class="btn primary" href="reference.html">레퍼런스 보기</a><a class="btn line" href="contact.html">견적 문의</a></div></div>
    <div class="ph" style="background-image:url('${esc(h.hero)}${V}')" role="img" aria-label="현장 근무복 착용 이미지"><span class="tag">CORPORATE UNIFORM SOLUTION</span></div></section>
  <section class="caps wrap">${S.capabilities.map((c,i)=>`<div class="cap"><div class="n">0${i+1}</div><h3>${esc(c.en)}<small>${esc(c.ko)}</small></h3><p>${esc(c.text)}</p></div>`).join("")}</section>
  <section class="sec wrap"><div class="sec-head"><div><span class="eyebrow">Everywhere</span><h2>For Every Workplace<span class="ko">근무 공간별 기업 유니폼</span></h2></div><a class="more" href="reference.html">VIEW ALL</a></div>
    <div class="spaces">${S.spaces.map((c,i)=>`<a class="space" href="reference.html?space=${c.id}"><div class="bg" style="background-image:url('${esc(c.image)}${V}')"></div><div class="tx"><b>0${i+1} · ${esc(c.en)}</b><strong>${esc(c.ko)}</strong><span>${esc(c.desc)}</span><em>${S.items.filter(x=>x.spaces.includes(c.id)).length} ITEMS →</em></div></a>`).join("")}</div></section>
  <section class="sec" style="background:var(--mist)"><div class="wrap split"><div class="im"><img loading="lazy" src="images/visual/process.jpg${V}" alt="디자인부터 봉제까지 제작 과정"></div>
    <div><span class="eyebrow">How we work</span><h2>기획부터 납품까지,<br>전 과정을 직접 관리합니다.</h2>
    <p>고객사의 근무 환경과 요구 사양 분석에서 출발합니다. 샘플 미팅, 디자인 디벨롭, 원부자재 소싱, 생산·품질 관리, 패키징과 납품까지 유니폼 전문 인력이 단계별로 책임지고 관리합니다.</p>
    <ul>${S.guide.slice(0,4).map((g,i)=>`<li><b>0${i+1}</b>${esc(g.ko)}</li>`).join("")}</ul><a class="btn dark" href="company.html">회사 소개</a></div></div></section>
  <section class="sec band grid-bg"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Reference</span><h2>Selected Projects<span class="ko">주요 기업 유니폼 수행 실적</span></h2></div><p>고객사 보호를 위해 상호와 로고는 비공개 처리했습니다.</p></div>
    <div class="projects" id="hp">${S.projects.slice(0,3).map(projCard).join("")}</div>
    <div style="margin-top:36px"><a class="more" style="color:var(--sky)" href="portfolio.html">VIEW PORTFOLIO</a></div></div></section>
  <section class="sec wrap"><div class="sec-head"><div><span class="eyebrow">Buyer's guide</span><h2>Order Process<span class="ko">상담부터 납품까지 6단계</span></h2></div><a class="more" href="contact.html#process">진행 과정 자세히</a></div>
    <div class="steps-line">${S.guide.map((g,i)=>`<div><b>0${i+1}</b><strong>${esc(g.en)}</strong><span>${esc(g.ko)}</span></div>`).join("")}</div></section>
  ${ctaBand()}`;
  $("#hp").querySelectorAll(".proj").forEach(b=>b.onclick=()=>location.href="portfolio.html?p="+b.dataset.no);
}
const ctaBand=()=>`<section class="cta-band"><div class="wrap"><div><h2>기업 유니폼 기획·제작, 전문 담당자와 상담하세요.</h2><p>견적 문의를 남겨주시면 영업일 기준 1~2일 내 메일 또는 유선으로 연락드립니다.</p></div><a class="btn" href="contact.html">견적 문의하기</a></div></section>`;

function company(){
  $("#main").innerHTML=`
  <section class="phead grid-bg"><div class="bgimg" style="background-image:url('images/visual/factory-duo.jpg${V}')"></div><div class="wrap"><span class="eyebrow">Company</span><h1>LIVART Wear<small>현대리바트 기업 유니폼 전문 사업</small></h1></div></section>
  <section class="sec wrap"><span class="eyebrow">Who we are</span>
    <p class="statement" style="margin-top:22px">리바트웨어는 <em>기업 유니폼 전문 기업</em>입니다. 고객사의 근무 환경과 요구 사양을 분석해 근무복·작업복·안전복부터 비즈니스 캐주얼까지 기획·디자인하고, 생산·품질 관리와 납품까지 전 과정을 직접 수행합니다.</p>
    <div class="scope">${S.spaces.map(c=>`<span>${esc(c.en)} · ${esc(c.ko)}</span>`).join("")}${S.filters.item.map(x=>`<span>${esc(x)}</span>`).join("")}</div></section>
  <section class="sec" style="background:var(--mist);padding-top:90px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">What we do</span><h2>Capabilities<span class="ko">기획·생산·품질·물류 원스톱 수행 역량</span></h2></div></div>
    <div class="capgrid">${S.capabilities.map((c,i)=>`<div>${capIcons[i]}<div class="n">0${i+1}</div><h3>${esc(c.en)}<small>${esc(c.ko)}</small></h3><p>${esc(c.text)}</p></div>`).join("")}</div></div></section>
  <section class="sec wrap split"><div class="im"><img loading="lazy" src="images/visual/process.jpg${V}" alt="디자인, 패턴, 봉제 과정"></div>
    <div><span class="eyebrow">Our process</span><h2>체계화된 생산 프로세스</h2><p>근무 환경과 소재를 분석해 디자인을 기획하고, 샘플 개발과 고객사 리뷰를 거쳐 사양을 확정합니다. 확정된 사양은 공정별 생산 관리와 인라인·파이널 2단계 품질 검수를 거쳐 일정한 품질로 납품됩니다.</p><a class="btn dark" href="contact.html#process">진행 과정 보기</a></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Field ready</span><h2>Built for every field<span class="ko">조선·건설·제조·서비스 현장별 기능 설계</span></h2></div></div>
    <div class="mosaic3"><div style="background-image:url('images/visual/jackets.jpg${V}')"></div><div style="background-image:url('images/visual/vest-model.jpg${V}')"></div><div style="background-image:url('images/visual/cooling.jpg${V}')"></div></div>
    <p class="note">착용 이미지는 생성형 AI로 제작한 연출 이미지입니다.</p></div></section>
  ${ctaBand()}`;
}

function reference(){
  const SP=S.spaces, F=S.filters, q=new URLSearchParams(location.search);
  let st={space:SP.some(x=>x.id===q.get("space"))?q.get("space"):"all",season:"all",item:"all"};
  $("#main").innerHTML=`
  <section class="phead grid-bg"><div class="bgimg" style="background-image:url('images/visual/jackets.jpg${V}')"></div><div class="wrap"><span class="eyebrow">Reference</span><h1>Our Work<small>근무 공간별 제작 실적</small></h1><p>리바트웨어가 기획·생산한 기업 유니폼 실적을 근무 공간별로 소개합니다.\n시즌과 아이템으로 걸러 보고, 사진을 누르면 크게 볼 수 있습니다.</p></div></section>
  <nav class="tabs" aria-label="근무 공간"><div class="wrap" id="sp-tabs"><a href="#" data-sp="all">ALL<small>전체</small></a>${SP.map(c=>`<a href="#" data-sp="${c.id}">${esc(c.en)}<small>${esc(c.ko)}</small></a>`).join("")}</div></nav>
  <section class="wrap catsec" id="works">
    <div class="sp-intro" id="sp-intro"></div>
    <div class="filters" role="group" aria-label="필터">
      <div class="fg"><span>SEASON</span>${["all",...F.season].map(v=>`<button data-k="season" data-v="${esc(v)}">${v==="all"?"전체":esc(v)}</button>`).join("")}</div>
      <div class="fg"><span>ITEM</span>${["all",...F.item].map(v=>`<button data-k="item" data-v="${esc(v)}">${v==="all"?"전체":esc(v)}</button>`).join("")}</div>
      <div class="cnt" id="cnt" aria-live="polite"></div>
    </div>
    <div class="pgrid" id="grid"></div>
  </section>
  <section class="sec wrap" style="padding-top:72px"><a class="pf-link" href="portfolio.html"><span class="eyebrow">Portfolio</span><strong>주요 기업 유니폼 수행 실적 보기</strong><em>→</em></a></section>
  ${ctaBand()}`;
  const spName=id=>{const c=SP.find(x=>x.id===id);return c?c.ko:"";};
  function render(){
    const list=S.items.filter(x=>(st.space==="all"||x.spaces.includes(st.space))&&(st.season==="all"||x.season===st.season)&&(st.item==="all"||x.item===st.item));
    document.querySelectorAll("#sp-tabs a[data-sp]").forEach(a=>a.classList.toggle("on",a.dataset.sp===st.space));
    document.querySelectorAll(".filters button").forEach(b=>b.classList.toggle("on",st[b.dataset.k]===b.dataset.v));
    const on=document.querySelector("#sp-tabs a.on"); if(on){const w=on.parentElement; w.scrollLeft=on.offsetLeft-(w.clientWidth-on.offsetWidth)/2;}
    const c=SP.find(x=>x.id===st.space);
    $("#sp-intro").innerHTML=c?`<span class="eyebrow">${esc(c.en)}</span><h2>${esc(c.ko)}</h2><p>${esc(c.desc)}</p>`:`<span class="eyebrow">ALL WORKPLACES</span><h2>전체 제작 실적</h2><p>사무 공간부터 생산 현장, 안전 특화 현장까지 리바트웨어의 기업 유니폼입니다.</p>`;
    $("#cnt").textContent=`${list.length} ITEMS`;
    $("#grid").innerHTML=list.length?list.map((x,i)=>`<button data-i="${i}" aria-label="${esc(x.item)} ${esc(x.season)} 크게 보기"><img loading="lazy" src="${esc(x.image)}${V}" alt="${esc(x.item)} ${esc(x.season)}"><span class="badge">${esc(x.season)} · ${esc(x.item)}</span></button>`).join(""):`<p class="empty">조건에 맞는 제작 사례가 없습니다. 필터를 바꿔 보세요.</p>`;
    $("#grid").querySelectorAll("button").forEach(b=>b.onclick=()=>openLB(list.map(x=>({src:x.image+V,cap:`${x.spaces.map(spName).join(" / ")} · ${x.season} · ${x.item}`})),+b.dataset.i));
    const u=st.space==="all"?"reference.html":`reference.html?space=${st.space}`; history.replaceState(null,"",u);
  }
  document.querySelectorAll("#sp-tabs a[data-sp]").forEach(a=>a.onclick=e=>{e.preventDefault();st.space=a.dataset.sp;render();const y=$("#works").getBoundingClientRect().top+scrollY-130; if(scrollY>y) scrollTo({top:y,behavior:"smooth"});});
  document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{st[b.dataset.k]=b.dataset.v;render();});
  render();
}

function portfolio(){
  const G=S.portfolioGroups, P=S.projects, q=new URLSearchParams(location.search);
  let g="all";
  $("#main").innerHTML=`
  <section class="pf-head wrap"><span class="eyebrow">Our Work</span><h1>Portfolio</h1>
    <p>업종과 근무 환경에 맞춰 기획·생산한 주요 기업 유니폼 수행 실적입니다.<br>고객사 보호를 위해 상호와 로고는 비공개 처리했습니다.</p></section>
  <section class="wrap"><div class="pf-filter" role="tablist" aria-label="업종">${[{id:"all",ko:"전체"},...G].map(x=>`<button role="tab" data-g="${x.id}">${esc(x.ko)}<i>${x.id==="all"?P.length:P.filter(p=>p.group===x.id).length}</i></button>`).join("")}</div>
    <div class="pf-grid" id="pfg"></div></section>
  <section class="pf-work grid-bg"><div class="wrap"><div><span class="eyebrow">Work with us</span><h2>우리 회사에 맞는 유니폼,<br>리바트웨어의 수행 경험으로 제안합니다.</h2></div><a class="btn primary" href="contact.html">견적 문의</a></div></section>
  <div class="pf-modal" id="pfm" role="dialog" aria-modal="true" aria-labelledby="pfm-t" hidden><div class="pf-box"><button class="pf-x" aria-label="닫기">×</button><div class="pf-gal"><div class="pf-main"><img alt=""></div><div class="pf-th"></div></div><div class="pf-info"></div></div></div>`;
  const gname=id=>(G.find(x=>x.id===id)||{}).ko||"";
  function grid(){
    document.querySelectorAll(".pf-filter button").forEach(b=>{const on=b.dataset.g===g;b.classList.toggle("on",on);b.setAttribute("aria-selected",on);});
    const list=P.filter(p=>g==="all"||p.group===g);
    $("#pfg").innerHTML=list.map(p=>`<button class="pf-card" data-no="${p.no}"><div class="im"><img loading="lazy" class="${isGarment(p.images[0])?"garment":""}" src="${esc(p.images[0])}${V}" alt=""></div>
      <div class="tx"><span class="en">${esc(p.en)}</span><strong>PROJECT ${esc(p.no)}</strong><span class="ko">${esc(gname(p.group))} · ${esc(p.industry)}</span></div></button>`).join("");
    $("#pfg").querySelectorAll(".pf-card").forEach(b=>b.onclick=()=>open(b.dataset.no));
  }
  const m=$("#pfm");
  function open(no){
    const p=P.find(x=>x.no===no); if(!p) return;
    const show=i=>{m.querySelector(".pf-main img").src=p.images[i]+V; m.querySelector(".pf-main img").className=isGarment(p.images[i])?"garment":""; m.querySelectorAll(".pf-th button").forEach((t,k)=>t.classList.toggle("on",k===i));};
    m.querySelector(".pf-th").innerHTML=p.images.length>1?p.images.map((s,i)=>`<button aria-label="이미지 ${i+1}"><img src="${esc(s)}${V}" alt=""></button>`).join(""):"";
    m.querySelectorAll(".pf-th button").forEach((t,i)=>t.onclick=()=>show(i));
    m.querySelector(".pf-info").innerHTML=`<span class="eyebrow">${esc(p.en)}</span><h2 id="pfm-t">PROJECT ${esc(p.no)}</h2>
      <dl><dt>업종</dt><dd>${esc(gname(p.group))} · ${esc(p.industry)}</dd><dt>수행 연도</dt><dd>${esc(p.year)}</dd><dt>제작 품목</dt><dd>${esc(p.scope)}</dd></dl>
      <p class="note">고객사 보호를 위해 상호와 로고는 비공개 처리했으며, 착용 이미지는 생성형 AI로 제작한 연출 이미지입니다.</p>
      <a class="btn primary" href="contact.html" style="margin-top:20px">비슷한 유니폼 견적 문의</a>`;
    show(0); m.hidden=false; document.body.style.overflow="hidden"; m.querySelector(".pf-x").focus();
    history.replaceState(null,"","portfolio.html?p="+no);
  }
  const close=()=>{m.hidden=true;document.body.style.overflow="";history.replaceState(null,"","portfolio.html");};
  m.querySelector(".pf-x").onclick=close; m.onclick=e=>{if(e.target===m)close();};
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m.hidden)close();});
  document.querySelectorAll(".pf-filter button").forEach(b=>b.onclick=()=>{g=b.dataset.g;grid();});
  grid(); if(q.get("p")) open(q.get("p"));
}

function guide(){
  $("#main").innerHTML=`
  <section class="phead grid-bg"><div class="bgimg" style="background-image:url('images/visual/vest-model.jpg${V}')"></div><div class="wrap"><span class="eyebrow">Buyer's guide</span><h1>Order Guide<small>기업 유니폼 발주 가이드</small></h1><p>희망 품목과 수량을 확인하신 후, 샘플 제작 및 본 생산 일정을 확인하세요.\n견적 문의를 남겨주시면 영업일 기준 1~2일 내 메일 및 유선으로 상담이 진행됩니다.</p></div></section>
  <section class="sec wrap">
    <div class="intro-box"><div class="ic">START</div><div><h3>견적 문의 접수</h3><p>관심 품목과 예상 수량, 희망 납기를 남겨주시면 담당자가 영업일 기준 1~2일 내 연락드립니다.</p></div><a class="btn primary" href="contact.html">견적 문의하기</a></div>
    <div class="timeline">${S.guide.map((g,i)=>`<div class="step"><div class="no">0${i+1}</div><span class="en">${esc(g.en)}</span><h3>${esc(g.ko)}</h3><ul>${g.pts.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}</div>
  </section>
  ${ctaBand()}`;
}

function contact(){
  const c=S.contact;
  $("#main").innerHTML=`
  <section class="phead grid-bg"><div class="wrap"><span class="eyebrow">Contact</span><h1>Request a Quote<small>견적 문의</small></h1><p>필요 품목과 수량, 납기를 알려주시면 전문 담당자가 사양 검토 후 맞춤 견적과 생산 일정을 안내해 드립니다.</p></div></section>
  <section class="wrap proc" id="process"><div class="sec-head" style="margin-bottom:26px"><div><span class="eyebrow">Process</span><h2>Order Process<span class="ko">상담부터 납품까지 6단계 · 단계를 누르면 세부 내용을 볼 수 있습니다</span></h2></div></div>
    <ol class="ptl">${S.guide.map((g,i)=>`<li><button aria-expanded="${i===0}" aria-controls="pd${i}"><b>0${i+1}</b><span class="en">${esc(g.en)}</span><strong>${esc(g.ko)}</strong></button></li>`).join("")}</ol>
    <div class="pdet">${S.guide.map((g,i)=>`<div id="pd${i}" ${i===0?"":"hidden"}><b>0${i+1} · ${esc(g.en)}</b><h3>${esc(g.ko)}</h3><ul>${g.pts.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`).join("")}</div>
  </section>
  <section class="sec wrap qgrid" id="form" style="padding-top:72px"><div class="qtitle"><span class="eyebrow">Quote form</span><h2>견적 문의서 작성</h2></div>
    <form class="q" id="qf" novalidate>
      <div class="row2"><div class="f"><label class="t" for="q-co">회사명 <i>*</i></label><input type="text" id="q-co" name="company" autocomplete="organization" maxlength="60" placeholder="회사명을 입력해 주세요."></div>
      <div class="f"><label class="t" for="q-nm">담당자명 <i>*</i></label><input type="text" id="q-nm" name="name" autocomplete="name" maxlength="30" placeholder="이름 / 직함"></div></div>
      <div class="row2"><div class="f"><label class="t" for="q-tel">연락처 <i>*</i></label><input type="tel" id="q-tel" name="tel" inputmode="numeric" autocomplete="tel" maxlength="13" placeholder="'-' 없이 숫자만 입력"></div>
      <div class="f"><label class="t" for="q-em">이메일 <i>*</i></label><input type="email" id="q-em" name="email" autocomplete="email" maxlength="80" placeholder="example@company.com"></div></div>
      <div class="f"><span class="t" style="display:block;font-weight:600;margin-bottom:8px">관심 품목 <small style="color:var(--muted);font-weight:400">(복수 선택)</small></span><div class="chips">${c.types.map(t=>`<label><input type="checkbox" name="types" value="${esc(t)}"><span>${esc(t)}</span></label>`).join("")}</div></div>
      <div class="row2"><div class="f"><label class="t" for="q-qty">예상 수량</label><select id="q-qty" name="qty"><option value="">선택해 주세요</option>${c.qty.map(q=>`<option>${esc(q)}</option>`).join("")}</select></div>
      <div class="f"><label class="t" for="q-due">희망 납기</label><input type="month" id="q-due" name="due"></div></div>
      <div class="f"><label class="t" for="q-msg">문의 내용 <i>*</i></label><textarea id="q-msg" name="msg" maxlength="3000" placeholder="착용 인원·근무 환경, 원하는 디자인 방향, 로고 적용 여부 등 자유롭게 작성해 주세요."></textarea></div>
      <label class="agree"><input type="checkbox" id="q-ag"><span>[필수] 개인정보 수집·이용에 동의합니다. ${esc(c.privacy)}</span></label>
      <button class="btn primary" type="submit" id="q-sub" style="width:100%;margin-top:22px;min-height:58px;font-size:16px">견적 문의 등록</button>
      <div class="msg" id="q-msg-box" role="status"></div>
    </form>
    <aside class="qside"><h3>AFTER SUBMIT</h3><ol><li>견적 문의 접수</li><li>담당자 연락 (영업일 1~2일)</li><li>1:1 샘플 리뷰 미팅</li><li>디자인 확정 · 생산</li><li>품질 검수 · 납품</li></ol>
      <p class="mail">메일 문의 <a href="mailto:${esc(S.footer.email)}">${esc(S.footer.email)}</a></p></aside>
  </section>`;
  const bs=[...document.querySelectorAll(".ptl button")];
  bs.forEach((b,i)=>b.onclick=()=>{bs.forEach((x,k)=>{x.setAttribute("aria-expanded",k===i);document.getElementById("pd"+k).hidden=k!==i;});});
  if(location.hash) setTimeout(()=>{const t=document.querySelector(location.hash); t&&t.scrollIntoView();},50);
  const f=$("#qf"), box=$("#q-msg-box");
  const say=(t,err)=>{box.textContent=t;box.className="msg show"+(err?" err":"");};
  f.onsubmit=async e=>{e.preventDefault();
    const d=Object.fromEntries(new FormData(f)); d.types=[...f.querySelectorAll('input[name=types]:checked')].map(x=>x.value).join(", ");
    d.tel=(d.tel||"").replace(/\D/g,"");
    if(!d.company.trim()) {$("#q-co").focus();return say("회사명을 입력해 주세요.",1);}
    if(!d.name.trim()) {$("#q-nm").focus();return say("담당자명을 입력해 주세요.",1);}
    if(!/^\d{9,11}$/.test(d.tel)) {$("#q-tel").focus();return say("연락처를 숫자 9~11자리로 입력해 주세요.",1);}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {$("#q-em").focus();return say("이메일 주소를 확인해 주세요.",1);}
    if(!d.msg.trim()) {$("#q-msg").focus();return say("문의 내용을 입력해 주세요.",1);}
    if(!$("#q-ag").checked) return say("개인정보 수집·이용에 동의해 주세요.",1);
    if(!S.contact.endpoint) return say("테스트 기간에는 견적 문의가 접수되지 않습니다. 정식 오픈 후 이용해 주세요.");
    const btn=$("#q-sub"); btn.disabled=true; btn.textContent="등록 중…";
    try{ const r=await fetch(S.contact.endpoint,{method:"POST",body:JSON.stringify(d)}); const j=await r.json(); if(!j.ok) throw 0; f.reset(); say("견적 문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다."); }
    catch(_){ say("전송 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 메일로 문의해 주세요.",1); }
    finally{ btn.disabled=false; btn.textContent="견적 문의 등록"; }
  };
}

fetch("content/site.json?v="+Math.floor(Date.now()/60000)).then(r=>r.json()).then(j=>{S=j; chrome(); lbInit(); ({home,company,reference,portfolio,guide,contact})[PAGE]();})
 .catch(()=>{$("#main").innerHTML='<p class="wrap" style="padding:80px 0">콘텐츠를 불러오지 못했습니다. 새로고침해 주세요.</p>';});
})();
