/* H.FIT site — 공통 스크립트: 내용 파일(content/*.json)을 읽어 각 페이지를 그림 */
(function(){
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const V = "?v=" + Math.floor(Date.now()/60000);
const PAGE = document.body.dataset.page;
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
const detailUrl = it => `detail.html?id=${encodeURIComponent(it.id)}`;
const inqUrl = it => `support.html?product=${encodeURIComponent(it.code)}`;
const visible = () => PROD.items.filter(i => i.show !== false);

/* ---------- header / footer ---------- */
function chrome(){
  const nav = [["brand.html","BRAND","brand"],["product.html","PRODUCT","product"],["lookbook.html","LOOKBOOK","lookbook"],["support.html","SUPPORT","support"]];
  const cur = PAGE==="detail" ? "product" : PAGE;
  const insta = SITE.brand.instagram ? `<a class="insta" href="${esc(SITE.brand.instagram)}" target="_blank" rel="noopener" aria-label="인스타그램">${ICON.insta}</a>` : "";
  $("#chrome-top").innerHTML = (SITE.notice?`<div class="notice">${esc(SITE.notice)}</div>`:"") + `<div class="topbar"></div>
  <header class="site"><div class="wrap">
    <a class="logo" href="index.html" aria-label="H.FIT 홈"><img src="images/brand/logo-color.png" alt="H.FIT"></a>
    <nav class="gnb" id="gnb">${nav.map(([h,t,k])=>`<a href="${h}"${k===cur?' aria-current="page"':''}>${t}</a>`).join("")}</nav>
    ${insta}<button class="menu-btn" id="menu" aria-label="메뉴 열기" aria-expanded="false">${ICON.menu}</button>
  </div></header>`;
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
const card = it => `<div class="pcard"><a href="${detailUrl(it)}" class="ph"><img loading="lazy" src="${esc(it.thumb)}" alt="${esc(it.name)}"></a>
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
  $("#main").innerHTML = `
  <section class="hero" style="background-image:url('${esc(h.heroImage)}')"><div class="in"><h1>${esc(SITE.brand.slogan)}</h1><p>${esc(SITE.brand.quote)}</p></div></section>
  <section class="slider" id="slider" aria-label="화보"><div class="track">${h.slides.map(s=>`<div class="slide"><img src="${esc(s.image)}" alt="${esc(s.alt)}"></div>`).join("")}</div>
    <button class="arrow prev" aria-label="이전">${ICON.prev}</button><button class="arrow next" aria-label="다음">${ICON.next}</button><div class="count" id="count"></div></section>
  ${h.sections.map((s,k)=>{ const list=visible().filter(i=>i.season===s.season && i.featured!==false); return `
  <section class="season"><div class="season-title"><h2>${esc(s.title)}</h2></div>
    <div class="band"><div class="wrap"><div class="carousel" id="car${k}"><div class="viewport"><div class="track">${list.map(it=>`<div class="cell">${card(it)}</div>`).join("")}</div></div>
    <button class="arrow prev" aria-label="이전 제품">${ICON.prev}</button><button class="arrow next" aria-label="다음 제품">${ICON.next}</button></div></div></div></section>`; }).join("")}`;
  const sl = $("#slider"), total = h.slides.length;
  const c = carousel(sl, () => narrow()?2:4);
  const upd = () => $("#count").textContent = `${c.i+1} / ${total}`;
  sl.addEventListener("moved", upd); upd();
  setInterval(()=>{ if(!document.hidden) c.go(c.i+1); }, 5000);
  h.sections.forEach((s,k)=>carousel($("#car"+k), () => narrow()?2:5));
}

function brand(){
  const b = SITE.brandPage;
  $("#main").innerHTML = `
  <section class="hero light" style="background-image:url('${esc(b.heroImage)}')"><div class="in"><h1>${esc(SITE.brand.slogan)}</h1><p>${esc(SITE.brand.quote)}</p></div></section>
  <section class="b-intro wrap"><img src="images/brand/logo-color.png" alt="H.FIT"><p>${esc(b.intro)}</p></section>
  ${b.stories.map((s,k)=>`<section class="story${k%2?' rev':''}"><div class="img"><img loading="lazy" src="${esc(s.image)}" alt=""></div><div class="txt"><p>${esc(s.text)}</p>${s.en?`<small>${esc(s.en)}</small>`:""}</div></section>`).join("")}
  <section class="mosaic">${b.mosaic.map(m=> /^LOGO/.test(m.image) ? `<div class="logo"><img src="images/brand/logo-color.png" alt="H.FIT"></div>` : `<div class="${/products\//.test(m.image)?'prod':''}"><img loading="lazy" src="${esc(m.image)}" alt=""></div>`).join("")}</section>
  <p class="closing wrap">${esc(b.closing)}</p>`;
}

function product(){
  const cats = ["전체", ...(PROD.categories||[])];
  const seasons = ["전체 시즌", ...new Set(visible().map(i=>i.season))];
  let cat = params.get("cat") && cats.includes(params.get("cat")) ? params.get("cat") : "전체";
  let season = "전체 시즌", shown = 16;
  $("#main").innerHTML = `<div class="wrap"><div class="plist-head"><h1 id="ptitle"></h1><div class="filters" id="filters"></div></div>
    <div class="seasons" id="seasons"></div><div class="pgrid" id="pgrid"></div><button class="more" id="more" aria-label="더 보기">${ICON.down}</button></div>`;
  const render = () => {
    $("#ptitle").textContent = cat;
    $("#filters").innerHTML = cats.map(c=>`<button aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    $("#seasons").innerHTML = seasons.map(s=>`<button aria-pressed="${s===season}" data-s="${esc(s)}">${esc(s)}</button>`).join("");
    const list = visible().filter(i => (cat==="전체"||i.category===cat) && (season==="전체 시즌"||i.season===season));
    $("#pgrid").innerHTML = list.slice(0,shown).map(card).join("") || `<div class="empty">${cat==="하의"?"하의 제품은 준비 중입니다.":"등록된 제품이 없습니다."}</div>`;
    $("#more").hidden = list.length <= shown;
    document.querySelectorAll("#filters button").forEach(b=>b.onclick=()=>{ cat=b.dataset.c; shown=16; history.replaceState(null,"",cat==="전체"?"product.html":`product.html?cat=${encodeURIComponent(cat)}`); render(); });
    document.querySelectorAll("#seasons button").forEach(b=>b.onclick=()=>{ season=b.dataset.s; shown=16; render(); });
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
      ${it.iconImage?`<img class="icons" src="${esc(it.iconImage)}" alt="${esc((it.icons||[]).join(", "))}">`:""}
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
  document.querySelectorAll("#thumbs button").forEach(b=>b.onclick=()=>{ const m=imgs[+b.dataset.k]; const z=$("#z0 img"); z.src=m.image; z.alt=`${it.name} ${m.caption}`; document.querySelectorAll("#thumbs button").forEach(x=>x.setAttribute("aria-current",String(x===b))); });
  // hover zoom (mouse) / tap toggle (touch)
  document.querySelectorAll(".zoom").forEach(z=>{
    const img=z.querySelector("img");
    z.addEventListener("mousemove",e=>{ const r=z.getBoundingClientRect(); img.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`; z.classList.add("on"); });
    z.addEventListener("mouseleave",()=>z.classList.remove("on"));
    z.addEventListener("click",e=>{ if(matchMedia("(hover:none)").matches){ const r=z.getBoundingClientRect(); img.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`; z.classList.toggle("on"); } });
  });
}

function lookbook(){
  $("#main").innerHTML = `<div class="wrap"><div class="lgrid">${SITE.lookbook.map((c,k)=>`<div class="lcard">
    <button class="cover" data-k="${k}" aria-label="${esc(c.title)} 보기"><img loading="lazy" src="${esc(c.cover)}" alt=""><div class="t"><b>${esc(c.title)}</b><span>${esc(c.en)}</span></div></button>
    <div class="acts"><button class="btn-line view" data-k="${k}">VIEW</button>${c.pdf?`<a class="btn-line" href="${esc(c.pdf)}" target="_blank" rel="noopener">카달로그 다운받기</a>`:`<button class="btn-line nopdf">카달로그 다운받기</button>`}</div></div>`).join("")}</div></div>`;
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

function support(){
  const s = SITE.support;
  const pcode = params.get("product"); const pit = pcode && PROD.items.find(i=>i.code===pcode);
  $("#main").innerHTML = `<div class="wrap"><form class="form" id="form" novalidate>
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
Promise.all([fetch("content/site.json"+V).then(r=>r.json()), fetch("content/products.json"+V).then(r=>r.json())])
.then(([s,p])=>{ const bust=o=>{ for(const k in o){ const v=o[k]; if(typeof v==="string" && /^images\/.+\.(jpe?g|png)$/i.test(v)) o[k]=v+"?v=4"; else if(v && typeof v==="object") bust(v); } }; bust(s); bust(p); SITE=s; PROD=p; chrome(); ({home,brand,product,detail,lookbook,support})[PAGE](); })
.catch(()=>{ $("#main").innerHTML='<p class="wrap" style="padding:80px 0">내용을 불러오지 못했습니다. 새로고침해 주세요.</p>'; });
})();
