/* H.FIT site — 공통 스크립트: 내용 파일(content/*.json)을 읽어 각 페이지를 그림 */
(function(){
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const V = "?v=" + Math.floor(Date.now()/60000);
const PAGE = document.body.dataset.page;
const sloganHTML = () => THEME_B ? esc(SITE.brand.slogan).split(/,\s*/).map((t,i,a)=>`<span class="ln">${t}${i<a.length-1?",":""}</span>`).join("") : esc(SITE.brand.slogan);
const PFX = document.body.dataset.prefix || "";   // B안 페이지는 "b-" 접두어
const THEME_B = PFX === "b-";
const params = new URLSearchParams(location.search);
const ICON = {
  prev:'<svg viewBox="0 0 20 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2L3 20l14 18"/></svg>',
  next:'<svg viewBox="0 0 20 40" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2l14 18L3 38"/></svg>',
  down:'<svg viewBox="0 0 40 22" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 2l18 18L38 2"/></svg>',
  insta:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="#fff" stroke="none"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
};
let SITE = null, PROD = null;
function toast(t){ let el=$(".toast"); if(!el){ el=document.createElement("div"); el.className="toast"; document.body.appendChild(el); } el.textContent=t; el.hidden=false; clearTimeout(el._t); el._t=setTimeout(()=>el.hidden=true,2600); }
const detailUrl = it => `${PFX}detail.html?id=${encodeURIComponent(it.id)}`;
const inqUrl = it => `${PFX}support.html?product=${encodeURIComponent(it.code)}`;
const visible = () => PROD.items.filter(i => i.show !== false);

/* ---------- header / footer ---------- */
function chrome(){
  const nav = [["brand.html","BRAND","brand"],["product.html","PRODUCT","product"],...(THEME_B?[["technology.html","TECHNOLOGY","technology"]]:[]),["lookbook.html","LOOKBOOK","lookbook"],["support.html","SUPPORT","support"]];
  const cur = PAGE==="detail" ? "product" : PAGE;
  const insta = SITE.brand.instagram ? `<a class="insta" href="${esc(SITE.brand.instagram)}" target="_blank" rel="noopener" aria-label="인스타그램">${ICON.insta}</a>` : "";
  $("#chrome-top").innerHTML = (SITE.notice?`<div class="notice">${esc(SITE.notice)}</div>`:"") + `<div class="topbar"></div>
  <header class="site"><div class="wrap">
    <a class="logo" href="${PFX}index.html" aria-label="H.FIT 홈"><img src="images/brand/logo-color.png" alt="H.FIT"></a>
    <nav class="gnb" id="gnb">${nav.map(([h,t,k])=>`<a href="${PFX}${h}"${k===cur?' aria-current="page"':''}>${t}</a>`).join("")}</nav>
    ${insta}<button class="menu-btn" id="menu" aria-label="메뉴 열기" aria-expanded="false">${ICON.menu}</button>
  </div></header>`;
  if(THEME_B){ const fab=document.createElement("a"); fab.className="fab-cta"; fab.href=`${PFX}support.html`; fab.textContent="문의하기"; if(PAGE!=="support") document.body.appendChild(fab);
    if(PAGE==="home"){ document.body.classList.add("over-hero"); const hd=$("header.site"), nt=$(".notice"); const onS=()=>{ hd.classList.toggle("solid", scrollY>60); hd.style.setProperty("--hd-top", Math.max(0,(nt?nt.offsetHeight:0)-scrollY)+"px"); }; addEventListener("scroll",onS,{passive:true}); onS(); } }
  $("#menu").onclick = () => { const o=$("#gnb").classList.toggle("open"); $("#menu").setAttribute("aria-expanded",String(o)); };
  const f = SITE.footer||{};
  const kv = (k,v) => v ? `<span><b>${esc(k)}</b>${esc(v)}</span>` : "";
  $("#chrome-foot").innerHTML = `<footer class="site"><div class="wrap flogo"><img src="images/brand/logo-color.png" alt="H.FIT"></div>
  <div class="fbody"><div class="wrap">
    <div class="row">${kv("Email.",f.email)}</div>
    <div class="row"><span><b>${esc(f.company||"")}</b></span>${kv("대표이사",f.ceo)}${kv("본사",f.hq)}${kv("서울사무소",f.seoul)}${kv("개인정보관리 책임자",f.privacyOfficer)}</div>
    <div class="row">${kv("사업자등록번호",f.bizNo)}${kv("통신판매업신고",f.ecommerce)}</div>
    <div class="copy">${esc(f.copyright||"")}</div>
  </div></div></footer>`;
}

/* ---------- product card ---------- */
const card = it => `<div class="pcard"><a href="${detailUrl(it)}" class="ph"><img loading="lazy" src="${esc(it.thumb)}" alt="${esc(it.name)}">${it.images && it.images[1] && it.images[1].image!==it.thumb ? `<img class="alt" loading="lazy" src="${esc(it.images[1].image)}" alt="">` : ""}</a>
  <a href="${detailUrl(it)}" class="nm">${esc(it.name)}</a><br><a class="link-inq inq" href="${inqUrl(it)}">제품문의</a></div>`;

/* ---------- generic carousel (index-based) ---------- */
function carousel(root, perView){
  const track = root.querySelector(".track"), cells = track.children, n = cells.length;
  let i = 0;
  const pv = () => typeof perView==="function" ? perView() : perView;
  const go = k => { const max=Math.max(0,n-pv()); i = k<0 ? max : (k>max ? 0 : k); const vp=root.querySelector('.viewport'); if(vp){ vp.scrollTo({left:i*cells[0].getBoundingClientRect().width,behavior:'smooth'}); } else { track.style.transform=`translateX(-${i*100/pv()}%)`; } root.dispatchEvent(new CustomEvent("moved",{detail:i})); };
  root.querySelector(".prev").onclick = () => go(i-1);
  root.querySelector(".next").onclick = () => go(i+1);
  let sx=0; root.addEventListener("touchstart",e=>{sx=e.touches[0].clientX},{passive:true});
  root.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40) go(i+(dx<0?1:-1));});
  addEventListener("resize",()=>go(Math.min(i,Math.max(0,n-pv()))));
  return {go, get i(){return i}};
}
const narrow = () => matchMedia("(max-width:820px)").matches;

/* ---------- pages ---------- */
function home(){
  const h = SITE.home;
  const CB = THEME_B ? (SITE.copyB||{}) : {};
  const lookB = THEME_B ? `<section class="look-fade"><div class="lf-head wrap"><span class="eyebrow">${esc(CB.lookTitle||"LOOKBOOK")}</span><p>${esc(CB.lookText||"")}</p></div>
    <div class="lf-grid"><div class="lf-col" id="lfA"></div><div class="lf-col" id="lfB"></div></div><div class="lf-bar wrap"><span id="lfCount"></span><span class="lf-prog"><i id="lfProg"></i></span></div></section>` : "";
  $("#main").innerHTML = `
  <section class="hero" style="background-image:url('${esc(h.heroImage)}')"><div class="in"><h1>${sloganHTML()}</h1><p>${esc(THEME_B && CB.heroSub ? CB.heroSub : SITE.brand.quote)}</p></div></section>
  ${lookB}<section class="slider"${THEME_B?" hidden":""} id="slider" aria-label="화보"><div class="track">${h.slides.map(s=>`<div class="slide"><img src="${esc(s.image)}" alt="${esc(s.alt)}"></div>`).join("")}</div>
    <button class="arrow prev" aria-label="이전">${ICON.prev}</button><button class="arrow next" aria-label="다음">${ICON.next}</button><div class="count" id="count"></div></section>
  ${h.sections.map((s,k)=>{ const list=visible().filter(i=>i.season===s.season && i.featured!==false); return `
  <section class="season"><div class="season-title"><span class="eyebrow">COLLECTION</span><h2>${esc(s.title)}</h2><a class="see-all" href="${PFX}product.html">전체 보기</a></div>
    <div class="band"><div class="wrap"><div class="carousel" id="car${k}"><div class="viewport"><div class="track">${list.map(it=>`<div class="cell">${card(it)}</div>`).join("")}</div></div>
    <button class="arrow prev" aria-label="이전 제품">${ICON.prev}</button><button class="arrow next" aria-label="다음 제품">${ICON.next}</button></div></div></div></section>`; }).join("")}`;
  if(THEME_B){ lookFade(h.slides); h.sections.forEach((s,k)=>carousel($("#car"+k), () => narrow()?2:5)); return; }
  const sl = $("#slider"), total = h.slides.length;
  const c = carousel(sl, () => narrow()?2:4);
  const upd = () => $("#count").textContent = `${c.i+1} / ${total}`;
  sl.addEventListener("moved", upd); upd();
  setInterval(()=>{ if(!document.hidden) c.go(c.i+1); }, 5000);
  h.sections.forEach((s,k)=>carousel($("#car"+k), () => narrow()?2:5));
}

function lookFade(slides){
  const half = Math.ceil(slides.length/2), A = slides.slice(0,half), B = slides.slice(half);
  const fill = (el,list) => el.innerHTML = list.map((s,k)=>`<figure class="${k===0?'on':''}"><img ${k<2?'':'loading="lazy"'} src="${esc(s.image)}" alt="${esc(s.alt)}"></figure>`).join("");
  fill($("#lfA"),A); fill($("#lfB"),B.length?B:A);
  let i = 0; const n = half, DUR = 6000;
  const show = () => { [$("#lfA"),$("#lfB")].forEach(col => col.querySelectorAll("figure").forEach((f,k)=>f.classList.toggle("on", k===i % col.children.length)));
    $("#lfCount").textContent = `${String(i+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`;
    const p=$("#lfProg"); p.style.transition="none"; p.style.width="0"; requestAnimationFrame(()=>requestAnimationFrame(()=>{ p.style.transition=`width ${DUR}ms linear`; p.style.width="100%"; })); };
  show();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduce) setInterval(()=>{ if(!document.hidden){ i=(i+1)%n; show(); } }, DUR);
}

function brand(){
  const b = SITE.brandPage;
  const CB = THEME_B ? (SITE.copyB||{}) : {};
  $("#main").innerHTML = `
  <section class="hero light" style="background-image:url('${esc(THEME_B && CB.brandHeroImage ? CB.brandHeroImage : b.heroImage)}')"><div class="in"><h1>${sloganHTML()}</h1><p>${esc(THEME_B && CB.brandHeroSub ? CB.brandHeroSub : SITE.brand.quote)}</p></div></section>
  <section class="b-intro wrap"><img src="images/brand/${THEME_B?"symbol-color":"logo-color"}.png" alt="H.FIT"><p>${esc(THEME_B && CB.brandIntro ? CB.brandIntro : b.intro)}</p></section>
  ${b.stories.map((s,k)=>{ const c = THEME_B && CB.stories && CB.stories[k]; return `<section class="story${k%2?' rev':''}"><div class="img"><img loading="lazy" src="${esc(s.image)}" alt=""></div><div class="txt">${c?`<span class="eyebrow">${esc(c.eyebrow)}</span><h2>${esc(c.title)}</h2><p>${esc(c.text)}</p>`:`<p>${esc(s.text)}</p>`}${s.en?`<small>${esc(s.en)}</small>`:""}</div></section>`; }).join("")}
  <section class="mosaic">${b.mosaic.map(m=> /^LOGO/.test(m.image) ? `<div class="logo"><img src="images/brand/logo-color.png" alt="H.FIT"></div>` : `<div class="${/products\//.test(m.image)?'prod':''}"><img loading="lazy" src="${esc(m.image)}" alt=""></div>`).join("")}</section>
  <p class="closing wrap">${esc(THEME_B && CB.closing ? CB.closing : b.closing)}</p>`;
}

function product(){
  const cats = ["전체", ...(PROD.categories||[])];
  let cat = params.get("cat") && cats.includes(params.get("cat")) ? params.get("cat") : "전체";
  let shown = 16;
  $("#main").innerHTML = `<div class="wrap"><div class="plist-head"><h1 id="ptitle"></h1><div class="filters" id="filters"></div></div>
    <div class="pgrid" id="pgrid"></div><button class="more" id="more" aria-label="더 보기">${ICON.down}</button></div>`;
  const render = () => {
    $("#ptitle").textContent = cat;
    $("#filters").innerHTML = cats.map(c=>`<button aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    const list = visible().filter(i => (cat==="전체"||i.category===cat) && true);
    $("#pgrid").innerHTML = list.slice(0,shown).map(card).join("") || `<div class="empty">${cat==="하의"?"하의 제품은 준비 중입니다.":"등록된 제품이 없습니다."}</div>`;
    $("#more").hidden = list.length <= shown;
    document.querySelectorAll("#filters button").forEach(b=>b.onclick=()=>{ cat=b.dataset.c; shown=16; history.replaceState(null,"",cat==="전체"?`${PFX}product.html`:`${PFX}product.html?cat=${encodeURIComponent(cat)}`); render(); });
  };
  $("#more").onclick = () => { shown += 16; render(); };
  render();
}

function detail(){
  const it = visible().find(i=>i.id===params.get("id")) || visible()[0];
  document.title = `${it.name} · H.FIT`;
  const imgs = it.images || [];
  const big = [imgs[0], imgs[1] || imgs[0]].filter(Boolean);
  const sz = it.sizes && it.sizes.rows && it.sizes.rows.length ? it.sizes : null;
  $("#main").innerHTML = `<div class="wrap">
  <section class="d-top">
    <div>
      <div class="d-main">${big.map((m,k)=>`<div class="zoom" id="z${k}"><img src="${esc(m.image)}" alt="${esc(it.name)} ${esc(m.caption)}"></div>`).join("")}</div>
      <div class="thumbs" id="thumbs">${imgs.slice(0,8).map((m,k)=>`<button data-k="${k}" aria-current="${k===0}" aria-label="${esc(m.caption)} 보기"><img src="${esc(m.image)}" alt=""></button>`).join("")}</div>
    </div>
    <aside class="d-info">
      <img class="brandmark" src="images/brand/logo-color.png" alt="H.FIT">
      <h1>${esc(it.name)}</h1><div class="code">${esc(it.code)} · ${esc(it.season)}</div>
      <a class="btn-line cta" href="${inqUrl(it)}">상담신청</a>
      ${THEME_B && window.HFIT_ICONS && (it.icons||[]).length ? `<ul class="icon-set">${it.icons.map(n=>{ const ic=HFIT_ICONS.get(n); return ic?`<li>${ic.svg}<b>${esc(n)}</b><span>${esc(ic.ko)}</span></li>`:""; }).join("")}</ul>` : (it.iconImage?`<img class="icons" src="${esc(it.iconImage)}" alt="${esc((it.icons||[]).join(", "))}">`:"")}
      ${(it.badges||[]).length?`<div class="badges">${it.badges.map(b=>`<span>${esc(b)}</span>`).join("")}</div>`:""}
      ${(it.fabrics||[]).map(f=>`<div class="fab"><div class="sw">${f.image?`<img src="${esc(f.image)}" alt="">`:""}</div><div><h3>FABRIC</h3><div class="ty">${esc(f.type)}</div><ul>${(f.points||[]).map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div><div class="mc">MATERIAL : ${esc(f.material)}<br>COLOR : ${esc(f.color)}</div></div>`).join("")}
      ${!(it.fabrics||[]).length && it.colors?`<div class="colors">COLOR : ${esc(it.colors)}</div>`:""}
    </aside>
  </section>
  <section class="d-desc"><h2>${esc(it.name)}</h2>${it.description?`<p>${esc(it.description)}</p>`:""}</section>
  <section class="d-imgs">${[...imgs.slice(0,2), ...(it.detailImages||[])].map(m=>`<img loading="lazy" src="${esc(m.image)}" alt="${esc(it.name)} ${esc(m.caption)}">`).join("")}</section>
  ${sz?`<section class="sizes"><table><caption>단위: cm · 실측 사이즈는 추후 등록 예정입니다.</caption><thead><tr><th>사이즈</th>${sz.columns.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${sz.rows.map(r=>`<tr><th>${esc(r.label)}</th>${sz.columns.map((c,k)=>`<td>${esc(r.values[k]||"-")}</td>`).join("")}</tr>`).join("")}</tbody></table></section>`:""}
  </div>`;
  // thumbs → replace first big image
  document.querySelectorAll("#thumbs button").forEach(b=>b.onclick=()=>{ const m=imgs[+b.dataset.k]; const z=$("#z0 img"); z.removeAttribute("srcset"); z.removeAttribute("sizes"); z.src=m.image; z.alt=`${it.name} ${m.caption}`; document.querySelectorAll("#thumbs button").forEach(x=>x.setAttribute("aria-current",String(x===b))); });
  // hover zoom (mouse) / tap toggle (touch)
  document.querySelectorAll(".zoom").forEach(z=>{
    const img=z.querySelector("img");
    z.addEventListener("mousemove",e=>{ const r=z.getBoundingClientRect(); img.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`; z.classList.add("on"); });
    z.addEventListener("mouseleave",()=>z.classList.remove("on"));
    z.addEventListener("click",e=>{ if(matchMedia("(hover:none)").matches){ const r=z.getBoundingClientRect(); img.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`; z.classList.toggle("on"); } });
  });
}

function lookbook(){
  $("#main").innerHTML = `<h1 class="sr-only">H.FIT 룩북</h1><div class="wrap"><div class="lgrid">${SITE.lookbook.map((c,k)=>`<div class="lcard">
    <button class="cover" data-k="${k}" aria-label="${esc(c.title)} 보기"><img loading="lazy" src="${esc(c.cover)}" alt=""><div class="t"><b>${esc(c.title)}</b><span>${esc(c.en)}</span></div></button>
    <div class="acts"><button class="btn-line view" data-k="${k}">VIEW</button>${c.pdf?`<a class="btn-line" href="${esc(c.pdf)}" target="_blank" rel="noopener">카탈로그 다운받기</a>`:`<button class="btn-line nopdf">카탈로그 다운받기</button>`}</div></div>`).join("")}</div></div>`;
  document.querySelectorAll(".cover,.view").forEach(b=>b.onclick=()=>gallery(SITE.lookbook[+b.dataset.k]));
  document.querySelectorAll(".nopdf").forEach(b=>b.onclick=()=>toast("카탈로그 PDF는 준비 중입니다."));
}
function gallery(c){
  let i=0; const imgs=c.images&&c.images.length?c.images:[c.cover];
  const g=document.createElement("div"); g.className="gal"; g.setAttribute("role","dialog"); g.setAttribute("aria-modal","true");
  g.innerHTML=`<div class="bar"><b>${esc(c.title)}</b><button class="x" aria-label="닫기">✕</button></div><div class="st"><img alt=""><button class="nav p" aria-label="이전">${ICON.prev}</button><button class="nav n" aria-label="다음">${ICON.next}</button></div><div class="cnt"></div>`;
  document.body.appendChild(g); document.body.style.overflow="hidden";
  const show=()=>{ g.querySelector(".st img").src=imgs[i]; g.querySelector(".cnt").textContent=`${i+1} / ${imgs.length}`; };
  const close=()=>{ g.remove(); document.body.style.overflow=""; removeEventListener("keydown",key); };
  const key=e=>{ if(e.key==="Escape") close(); if(e.key==="ArrowRight"){i=(i+1)%imgs.length;show();} if(e.key==="ArrowLeft"){i=(i-1+imgs.length)%imgs.length;show();} };
  g.querySelector(".x").onclick=close; g.querySelector(".p").onclick=()=>{i=(i-1+imgs.length)%imgs.length;show();}; g.querySelector(".n").onclick=()=>{i=(i+1)%imgs.length;show();};
  let sx=0; g.addEventListener("touchstart",e=>{sx=e.touches[0].clientX},{passive:true}); g.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40){ i=(i+(dx<0?1:-1)+imgs.length)%imgs.length; show(); }});
  addEventListener("keydown",key); show(); g.querySelector(".x").focus();
}

function technology(){
  const T=SITE.technology, items=visible();
  const has=(it,keys)=>(it.icons||[]).some(n=>keys.includes(String(n).toUpperCase()));
  const ic=k=>window.HFIT_ICONS&&HFIT_ICONS.get(k);
  $("#main").innerHTML=`<div class="wrap"><div class="plist-head tech-head"><h1>기능과 소재</h1></div>
    <p class="tech-intro">${esc(T.intro).replace(/\n/g,"<br>")}</p>
    <nav class="tech-jump" aria-label="기능 분류">${T.groups.map(g=>`<a href="#tg-${g.en.replace(/\W+/g,'')}">${esc(g.en)}<small>${esc(g.ko)}</small></a>`).join("")}</nav>
    ${T.groups.map(g=>`<section class="tg" id="tg-${g.en.replace(/\W+/g,'')}"><div class="tg-h"><span class="eyebrow">${esc(g.en)}</span><h2>${esc(g.ko)}</h2></div>
      <div class="tcards">${g.items.map(x=>{const i=ic(x.keys[0]); const n=items.filter(it=>has(it,x.keys)).length; return `<button class="tcard" data-k="${esc(x.keys.join("|"))}" ${n?"":"disabled"}>
        <span class="ti">${i?i.svg:""}</span><b>${esc(x.keys[0])}</b><strong>${esc(i?i.ko:"")}</strong><p>${esc(x.d)}</p><em>${n?`적용 제품 ${n}종 →`:"적용 제품 준비 중"}</em></button>`;}).join("")}</div></section>`).join("")}
    <div class="tech-panel" id="tp" hidden></div></div>`;
  const tp=$("#tp");
  document.querySelectorAll(".tcard").forEach(b=>b.onclick=()=>{
    const keys=b.dataset.k.split("|"), list=items.filter(it=>has(it,keys)), i=ic(keys[0]);
    document.querySelectorAll(".tcard").forEach(x=>x.classList.toggle("on",x===b));
    tp.hidden=false; b.closest(".tg").appendChild(tp);
    tp.innerHTML=`<div class="tp-h"><span class="ti">${i?i.svg:""}</span><div><b>${esc(keys[0])}</b><strong>${esc(i?i.ko:"")} 적용 제품 ${list.length}종</strong></div><button class="tp-x" aria-label="닫기">✕</button></div><div class="pgrid">${list.map(card).join("")}</div>`;
    tp.querySelector(".tp-x").onclick=()=>{tp.hidden=true;b.classList.remove("on");b.focus();};
    tp.scrollIntoView({behavior:"smooth",block:"start"});
  });
}

function support(){
  const s = SITE.support;
  const pcode = params.get("product"); const pit = pcode && PROD.items.find(i=>i.code===pcode);
  $("#main").innerHTML = `<h1 class="sr-only">H.FIT 상담 신청</h1><div class="wrap"><form class="form" id="form" novalidate>
    <div class="radios" role="radiogroup" aria-label="고객 구분">${s.types.map((t,k)=>`<label><input type="radio" name="type" id="type${k}" value="${esc(t)}"${k===0?" checked":""}>${esc(t)}</label>`).join("")}</div>
    <div class="field"><label for="f-name">신청자명</label><input id="f-name" name="name" autocomplete="name" placeholder="이름을 입력해 주세요." maxlength="40"></div>
    <div class="field"><label for="f-tel">연락처</label><input id="f-tel" name="tel" inputmode="numeric" autocomplete="tel" placeholder="휴대폰 번호 ‘-’를 제외한 숫자만 입력해 주세요." maxlength="13"></div>
    <div class="field"><label for="f-mail">메일</label><input id="f-mail" name="mail" type="email" autocomplete="email" placeholder="메일 주소를 입력해주세요." maxlength="80"></div>
    <div class="field"><label for="f-msg">문의사항</label><textarea id="f-msg" name="msg" placeholder="${esc(s.placeholder)}" maxlength="3000"></textarea></div>
    <label class="agree"><input type="checkbox" id="f-agree"><span>[필수] 개인정보 수집·이용에 동의합니다. ${esc(s.privacy)}</span></label>
    <button class="btn-solid" type="submit" id="submit">문의 등록하기</button>
    <div class="msg" id="msg" hidden></div>
  </form></div>`;
  if(pit) $("#f-msg").value = `-제품명: ${pit.name} (${pit.code})\n-예상 수량: \n-예상 일정: \n-희망 색상: \n-희망 사이즈: \n-로고 포함 여부: \n-변경 하고싶은 부분: \n-예산: `;
  $("#f-tel").addEventListener("input",e=>{ e.target.value=e.target.value.replace(/\D/g,""); });
  const msg=(t,err)=>{ const m=$("#msg"); m.textContent=t; m.className="msg"+(err?" err":""); m.hidden=false; };
  $("#form").addEventListener("submit", async e=>{
    e.preventDefault();
    const d = { type: document.querySelector('input[name="type"]:checked').value, name: $("#f-name").value.trim(), tel: $("#f-tel").value.trim(), mail: $("#f-mail").value.trim(), msg: $("#f-msg").value.trim(), product: pcode||"" };
    if(!d.name){ $("#f-name").focus(); return msg("신청자명을 입력해 주세요.",1); }
    if(!/^\d{9,11}$/.test(d.tel)){ $("#f-tel").focus(); return msg("연락처를 숫자 9~11자리로 입력해 주세요.",1); }
    if(d.mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.mail)){ $("#f-mail").focus(); return msg("메일 주소 형식을 확인해 주세요.",1); }
    if(!d.msg){ $("#f-msg").focus(); return msg("문의사항을 입력해 주세요.",1); }
    if(!$("#f-agree").checked){ return msg("개인정보 수집·이용에 동의해 주세요.",1); }
    if(!s.endpoint){ return msg("테스트 기간에는 상담 신청이 접수되지 않습니다. 정식 오픈 후 이용해 주세요."); }
    $("#submit").disabled=true; $("#submit").textContent="등록 중…";
    try{
      const r = await fetch(s.endpoint,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});
      const j = await r.json(); if(!j.ok) throw new Error(j.error||"fail");
      $("#form").reset(); msg("상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
    }catch(err){ msg("접수하지 못했습니다. 잠시 후 다시 시도해 주세요.",1); }
    finally{ $("#submit").disabled=false; $("#submit").textContent="문의 등록하기"; }
  });
}

/* ---------- boot ---------- */
const WMAP={};
function srcsets(root){ (root.querySelectorAll?root:document).querySelectorAll("img[src*='.webp']:not([srcset])").forEach(img=>{ const u=img.getAttribute("src"), path=u.split("?")[0], m=WMAP[path]; if(!m||!m[1]) return;
  const w=(img.getBoundingClientRect().width||img.parentElement.getBoundingClientRect().width||600);
  img.sizes=Math.ceil(w)+"px"; img.srcset=`${path.replace(/\.webp$/,"-640.webp")}?v=6 640w, ${u} ${m[0]}w`; }); }
Promise.all([fetch("content/site.json"+V).then(r=>r.json()), fetch("content/products.json"+V).then(r=>r.json()), fetch("images/manifest.json"+V).then(r=>r.ok?r.json():{}).catch(()=>({}))])
.then(([s,p,man])=>{ for(const k in man) WMAP[k.replace(/\.(jpe?g)$/i,".webp")]=man[k];
  const bust=o=>{ for(const k in o){ const v=o[k]; if(typeof v==="string" && /^images\/.+\.(jpe?g|png)$/i.test(v)) o[k]= man[v] ? v.replace(/\.(jpe?g)$/i,".webp")+"?v=6" : v+"?v=5"; else if(v && typeof v==="object") bust(v); } }; bust(s); bust(p); SITE=s; PROD=p; chrome();
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1) srcsets(n.tagName==="IMG"?n.parentElement:n); }))).observe(document.body,{childList:true,subtree:true});
  ({home,brand,product,detail,lookbook,support,technology})[PAGE](); srcsets(document); })
.catch(()=>{ $("#main").innerHTML='<p class="wrap" style="padding:80px 0">내용을 불러오지 못했습니다. 새로고침해 주세요.</p>'; });
})();
