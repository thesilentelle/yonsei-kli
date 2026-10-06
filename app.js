(function(){
"use strict";
window.GUIDE=window.GUIDE||{};
const UI={
 en:{html:"en",hide:"Hide English",show:"Show English",collapse:"Collapse grammar",expand:"Expand grammar",ph:"Search all chapters: 도록, 저렴하다, fluent…",g:"Grammar",dv:"Dialogue vocab",xv:"Extended vocab",ch:n=>"Chapter "+n,search:"Search",count:(g,v)=>g+" grammar · "+v+" vocab",none:"No matches. Try the dictionary form (저렴하다) or an English word.",ext:"확장",fail:"Couldn't load this language. Check that the data folder was uploaded."},
 ja:{html:"ja",hide:"訳を隠す",show:"訳を表示",collapse:"文法を閉じる",expand:"文法を開く",ph:"全課を検索：도록、저렴하다、流暢…",g:"文法",dv:"会話語彙",xv:"拡張語彙",ch:n=>"第"+n+"課",search:"検索",count:(g,v)=>"文法 "+g+" · 語彙 "+v,none:"見つかりませんでした。辞書形（저렴하다）や日本語の単語で検索してみてください。",ext:"확장",fail:"この言語のデータを読み込めませんでした。"},
 zh:{html:"zh-CN",hide:"隐藏译文",show:"显示译文",collapse:"收起语法",expand:"展开语法",ph:"搜索全部课：도록、저렴하다、流利…",g:"语法",dv:"会话词汇",xv:"扩展词汇",ch:n=>"第"+n+"课",search:"搜索",count:(g,v)=>"语法 "+g+" · 词汇 "+v,none:"没有结果。请试试词典形（저렴하다）或中文词语。",ext:"확장",fail:"无法加载该语言的数据。"},
 tr:{html:"tr",hide:"Çeviriyi gizle",show:"Çeviriyi göster",collapse:"Dilbilgisini daralt",expand:"Dilbilgisini genişlet",ph:"Tüm bölümlerde ara: 도록, 저렴하다, akıcı…",g:"Dilbilgisi",dv:"Diyalog kelimeleri",xv:"Ek kelimeler",ch:n=>n+". Bölüm",search:"Arama",count:(g,v)=>g+" dilbilgisi · "+v+" kelime",none:"Sonuç yok. Sözlük biçimini (저렴하다) ya da Türkçe bir kelimeyi deneyin.",ext:"확장",fail:"Bu dilin verileri yüklenemedi."}
};
const $=s=>document.querySelector(s);
const main=$("#main"),chips=$("#chips"),q=$("#q"),sel=$("#lang"),quizBtn=$("#quiz"),expBtn=$("#expand");
const hl=s=>s.replace(/\*\*(.+?)\*\*/g,"<mark>$1</mark>");
const esc=s=>s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
let lang="en",cur=1,allOpen=true,D=[],t=UI.en;

function grammar(g,label){
  return `<details class="gcard" ${allOpen?"open":""}><summary>${label?`<span class="res-ch">${label}</span>`:""}<span class="gform">${g.f}</span><span class="ggloss en">${g.en}</span></summary>
  <div class="gbody"><p class="core">${g.core}</p>
  <div class="forms"><table>${g.forms.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table></div>
  <ul class="rules">${g.rules.map(r=>`<li>${r}</li>`).join("")}</ul>
  <div class="exs">${g.ex.map(e=>`<div class="ex"><div class="ko" lang="ko">${hl(e[0])}</div><div class="en">${e[1]}</div></div>`).join("")}</div></div></details>`;
}
function vocab(r,tag){
  return `<div class="v"><div class="vtop"><span class="vw" lang="ko">${r[0]}</span><span class="en">${r[1]}</span>${tag?`<span class="tag">${tag}</span>`:""}</div>
  <p class="vnote">${r[2]}</p><div class="vex"><div lang="ko">${hl(r[3])}</div><div class="ex-en en">${r[4]}</div></div></div>`;
}
function chapter(n){
  const c=D.find(x=>x.n===n);if(!c)return;
  let h=`<div class="ch-head"><span class="num">제${c.n}과 · ${t.ch(c.n)}</span><h2 lang="ko">${c.t}</h2><p>${c.en}</p></div>`;
  c.units.forEach(u=>{
    h+=`<section class="unit"><div class="unit-head"><span class="u">${c.n}-${u.n}</span><h3 lang="ko">${u.t}</h3></div>
    <div class="sec-label">문법 · ${t.g}</div>${u.g.map(g=>grammar(g)).join("")}
    <div class="sec-label">대화 어휘 · ${t.dv}</div><div class="vlist">${u.v.map(r=>vocab(r)).join("")}</div>
    <div class="sec-label">확장 어휘 · ${t.xv}</div><div class="vlist">${u.x.map(r=>vocab(r)).join("")}</div></section>`;
  });
  main.innerHTML=h;
}
function search(term){
  const s=term.toLowerCase().replace(/^-/,"");
  const strip=x=>x.replace(/<[^>]+>/g,"").toLowerCase();
  const gs=[],vs=[];
  D.forEach(c=>c.units.forEach(u=>{
    const lab=`${c.n}-${u.n} ${u.t}`;
    u.g.forEach(g=>{if(strip(g.f).includes(s)||strip(g.en).includes(s))gs.push(grammar(g,lab))});
    u.v.forEach(r=>{if((r[0]+" "+r[1]).toLowerCase().includes(s))vs.push(vocab(r,lab))});
    u.x.forEach(r=>{if((r[0]+" "+r[1]).toLowerCase().includes(s))vs.push(vocab(r,lab+" · "+t.ext))});
  }));
  main.innerHTML=`<div class="ch-head"><span class="num">${t.search}</span><h2>“${esc(term)}”</h2><p>${t.count(gs.length,vs.length)}</p></div>`+
   (gs.length?`<div class="sec-label">문법 · ${t.g}</div>${gs.join("")}`:"")+
   (vs.length?`<div class="sec-label">어휘</div><div class="vlist">${vs.join("")}</div>`:"")+
   (!gs.length&&!vs.length?`<p class="empty">${t.none}</p>`:"");
}
function renderChips(){
  chips.innerHTML=D.map(c=>`<button class="chip" role="tab" data-n="${c.n}" aria-selected="${c.n===cur&&!q.value}"><b>${c.n}과</b> <span lang="ko">${c.t}</span></button>`).join("");
}
function render(){
  const term=q.value.trim();renderChips();
  if(term)search(term);else chapter(cur);
}
function go(n,scroll){
  cur=n;q.value="";render();store.set("ch",n);
  if(scroll)window.scrollTo({top:0});
  const el=chips.querySelector(`[data-n="${n}"]`);if(el)el.scrollIntoView({inline:"center",block:"nearest"});
}
function applyUI(){
  document.documentElement.lang=t.html;
  q.placeholder=t.ph;
  quizBtn.textContent=document.body.classList.contains("quiz")?t.show:t.hide;
  expBtn.textContent=allOpen?t.collapse:t.expand;
  sel.value=lang;
}
function ensure(l,cb){
  if(GUIDE[l])return cb();
  const s=document.createElement("script");
  s.src="guide-"+l+".js";s.onload=cb;
  s.onerror=()=>{main.innerHTML=`<p class="empty">${(UI[l]||UI.en).fail}</p>`};
  document.head.appendChild(s);
}
function setLang(l){
  if(!UI[l])l="en";
  ensure(l,()=>{lang=l;t=UI[l];D=GUIDE[l];store.set("lang",l);applyUI();render()});
}

chips.addEventListener("click",e=>{const b=e.target.closest(".chip");if(b)go(+b.dataset.n,true)});
let tm;q.addEventListener("input",()=>{clearTimeout(tm);tm=setTimeout(()=>{if(q.value.trim())render();else go(cur)},150)});
sel.addEventListener("change",()=>setLang(sel.value));
quizBtn.addEventListener("click",()=>{const on=document.body.classList.toggle("quiz");quizBtn.setAttribute("aria-pressed",on);quizBtn.textContent=on?t.show:t.hide});
main.addEventListener("click",e=>{const en=e.target.closest(".en");if(en&&document.body.classList.contains("quiz")){e.preventDefault();en.classList.toggle("shown")}});
expBtn.addEventListener("click",()=>{allOpen=!allOpen;document.querySelectorAll(".gcard").forEach(d=>d.open=allOpen);expBtn.textContent=allOpen?t.collapse:t.expand});

// starting chapter: #ch3 in the URL, else last visited
const m=location.hash.match(/^#ch(\d+)$/);
if(m)cur=+m[1];else{const s=+store.get("ch");if(s>=1&&s<=10)cur=s}
// starting language: ?lang=ja in the URL, else last used, else browser language
let start=null;
try{start=new URLSearchParams(location.search).get("lang")}catch(e){}
if(!UI[start])start=store.get("lang");
if(!UI[start]){const nav=(navigator.language||"en").slice(0,2).toLowerCase();start=UI[nav]?nav:"en"}
setLang(start);
})();
