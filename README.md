# FatoorPOS
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>فَاتور — Fatoor POS v3.4</title>
<link rel="stylesheet" href="css/style.css" />
</head>
<body class="light">

<!-- Splash (Light) -->
<div id="splash" class="splash">
  <div class="splash-card">
    <div class="logo-anim">
      <svg width="220" height="120" viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" aria-label="Fatoor Logo">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#fbe9a1"/>
            <stop offset="100%" stop-color="#f6d365"/>
          </linearGradient>
        </defs>
        <rect width="200" height="110" rx="18" fill="url(#g)"></rect>
        <text x="100" y="66" font-size="42" font-family="Tahoma, Arial" font-weight="800" text-anchor="middle" fill="#2b2b2b">فَاتور</text>
      </svg>
    </div>
    <div class="splash-welcome">Fatoor POS — الإصدار v3.4</div>
    <div class="splash-support">للدعم الفني: 0506572881</div>
    <div class="splash-dev">تطوير ياسر الأيوب</div>
    <div class="loader"><span></span><span></span><span></span></div>
  </div>
</div>

<!-- App -->
<div id="app" style="display:none">
  <header class="topbar">
    <div class="brand">
      <div class="logo-small">فَ</div>
      <div class="title">نظام نقاط البيع والفواتير</div>
    </div>
    <div class="actions">
      <button id="themeToggle" class="btn ghost" title="تبديل الوضع">🌓</button>
      <span id="userBadge" class="muted"></span>
      <button id="logoutBtn" class="btn ghost">تسجيل الخروج</button>
    </div>
  </header>

  <nav class="tabs">
    <button class="tab" data-tab="login">دخول</button>
    <button class="tab" data-tab="pos" style="display:none">الكاشير</button>
    <button class="tab" data-tab="admin" style="display:none">المدير</button>
    <button class="tab" data-tab="reports" style="display:none">الفواتير</button>
    <button class="tab" data-tab="shifts" style="display:none">الموازنات</button>
  </nav>

  <main class="container">
    <!-- Login -->
    <section id="page-login" class="card view">
      <h2>تسجيل الدخول</h2>
      <div class="muted">اختر نوع الدخول</div>
      <div class="role-row">
        <button class="btn" id="cashierEnter">دخول كاشير</button>
        <button class="btn secondary" id="adminEnter">دخول مدير</button>
      </div>
      <div id="adminLogin" style="display:none;margin-top:12px">
        <label>اسم المستخدم</label><input id="adminUser" type="text" placeholder="admin" />
        <label>كلمة المرور</label><input id="adminPass" type="password" placeholder="admin" />
        <div style="margin-top:10px"><button class="btn" id="adminLoginBtn">دخول</button></div>
      </div>
    </section>

    <!-- POS -->
    <section id="page-pos" class="card view" style="display:none">
      <div class="pos-header">
        <div>
          <div id="storeNameHeader" class="store-name">اسم المحل</div>
          <div class="small muted" id="currentDateTime"></div>
        </div>
        <div class="pos-controls">
          <button class="btn" id="startShiftBtn">بدء وردية</button>
          <button class="btn secondary" id="closeShiftBtn">إغلاق وردية</button>
          <select id="paperSize">
            <option value="80">حراري 80mm</option>
            <option value="58">حراري 58mm</option>
            <option value="a4">A4</option>
          </select>
          <button class="btn" id="openSettingsBtn">⚙️ إعدادات</button>
        </div>
      </div>
      <div class="pos-body">
        <div class="left">
          <div class="searchRow">
            <input id="searchProd" class="search" placeholder="بحث عن صنف أو باركود..." />
            <button class="btn ghost" id="refreshProd">⟳</button>
          </div>
          <div id="productsGrid" class="products-grid"></div>
        </div>
        <div class="right">
          <div class="card mini">
            <div class="current-info">
              <div class="bold">فاتورة جديدة — وردية: <span id="shiftIdDisplay">—</span></div>
              <div class="small muted">رقم الفاتورة: <span id="currentInvoiceNumber">—</span></div>
            </div>
            <div id="cartList" class="cart-list"></div>
            <div id="totalsArea" class="totals">الإجمالي: 0 ر.س</div>
            <div class="btnRow">
              <button class="btn" id="finishInvoiceBtn">إنهاء وطباعه</button>
              <button class="btn ghost" id="clearCartBtn">مسح</button>
            </div>
          </div>

          <div class="card keypad">
            <h4>لوحة الأرقام</h4>
            <div id="numDisplay" class="num-display">0</div>
            <div class="keypad-grid">
              <button class="kbtn" data-k="7">7</button><button class="kbtn" data-k="8">8</button><button class="kbtn" data-k="9">9</button><button class="kbtn op" data-op="-">-</button>
              <button class="kbtn" data-k="4">4</button><button class="kbtn" data-k="5">5</button><button class="kbtn" data-k="6">6</button><button class="kbtn op" data-op="+">+</button>
              <button class="kbtn" data-k="1">1</button><button class="kbtn" data-k="2">2</button><button class="kbtn" data-k="3">3</button><button class="kbtn equal" id="equalBtn">=</button>
              <button class="kbtn zero" data-k="0">0</button><button class="kbtn" id="ceBtn">CE</button><button class="kbtn" id="applyBtn">تطبيق</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin -->
    <section id="page-admin" class="card view" style="display:none">
      <h2>لوحة المدير</h2>
      <div class="admin-grid">
        <div class="card">
          <h3>معلومات المحل</h3>
          <label>اسم المحل</label><input id="storeName" type="text" />
          <label>الرقم الضريبي</label><input id="vatNumber" type="text" />
          <label>الهاتف</label><input id="storePhone" type="text" />
          <label>الشعار</label><input id="logoInput" type="file" accept="image/*" />
          <div style="margin-top:8px"><button class="btn" id="saveSettingsBtn">حفظ</button></div>
        </div>

        <div class="card">
          <h3>إعدادات الفاتورة</h3>
          <label>نص ترحيبي</label><input id="invoiceHeaderText" type="text" />
          <label>نص ختامي</label><input id="invoiceFooterText" type="text" />
          <label>الضريبة (%)</label><input id="vatRate" type="number" min="0" step="0.01" value="0" />
          <div style="margin-top:8px"><button class="btn" id="saveInvoiceBtn">حفظ إعدادات الفاتورة</button></div>
        </div>

        <div class="card">
          <h3>إدارة الأصناف</h3>
          <label>اسم الصنف</label><input id="p_name" type="text" />
          <label>السعر (ريال)</label><input id="p_price" type="number" min="0" step="0.01" />
          <label>باركود (اختياري)</label><input id="p_barcode" type="text" />
          <label>صورة الصنف</label><input id="p_img" type="file" accept="image/*" />
          <div style="margin-top:8px"><button class="btn" id="addProductBtn">إضافة</button></div>
          <div id="productsList" class="scroll"></div>
        </div>

        <div class="card">
          <h3>المستخدمون والصلاحيات</h3>
          <div class="small muted">المدير الافتراضي: admin/admin</div>
          <label>اسم مستخدم</label><input id="newUser" type="text" />
          <label>كلمة مرور</label><input id="newPass" type="password" />
          <label>الدور</label><select id="newRole"><option value="admin">مدير</option><option value="cashier">كاشير</option></select>
          <div style="margin-top:8px"><button class="btn" id="createUserBtn">إنشاء مستخدم</button></div>
          <div id="usersList" class="scroll"></div>
        </div>
      </div>
    </section>

    <!-- Reports -->
    <section id="page-reports" class="card view" style="display:none">
      <h2>الفواتير</h2>
      <input id="searchInvoice" class="search" placeholder="رقم أو تاريخ" />
      <div id="invoiceList" class="scroll"></div>
    </section>

    <!-- Shifts -->
    <section id="page-shifts" class="card view" style="display:none">
      <h2>الموازنات اليومية</h2>
      <div id="currentShiftInfo" class="muted small"></div>
      <div id="shiftsList" class="scroll"></div>
    </section>
  </main>

  <footer class="footer muted">© جميع الحقوق محفوظة — تطوير ياسر الأيوب — الإصدار v3.4</footer>
</div>

<!-- صوت بدء التشغيل (WAV) مضمّن Base64 -->
<audio id="startupSound" preload="auto"
src="data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRAAAAABAQEBAQEBAQAAAAAAAP///wAAAP///wAAAAAAAP///w=="></audio>

<script type="module" src="js/app.js"></script>
</body>
</html>
:root{
  --bg:#faf8ef;--card:#ffffff;--muted:#6b7280;--text:#0f1720;--accent:#0ea5a4;
  --radius:12px;--shadow:0 8px 24px rgba(14,30,37,0.06)
}
.dark{--bg:#0b1220;--card:#0f172a;--muted:#93a3b8;--text:#e6edf6;--accent:#22d3ee}
*{box-sizing:border-box}
body{margin:0;padding:18px;font-family:'Noto Sans',Tahoma,Arial;background:var(--bg);color:var(--text);direction:rtl}

.splash{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
background:linear-gradient(180deg,#fffef7,#fff3cc);z-index:9999}
.splash-card{width:560px;padding:28px;border-radius:16px;box-shadow:var(--shadow);
text-align:center;background:var(--card);border:1px solid rgba(2,6,23,0.08)}
.loader{margin-top:14px;display:flex;gap:6px;justify-content:center}
.loader span{width:10px;height:10px;background:#f6d365;border-radius:50%;
display:inline-block;animation:b 1.2s infinite}
.loader span:nth-child(2){animation-delay:.2s}.loader span:nth-child(3){animation-delay:.4s}
@keyframes b{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}

.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.brand{display:flex;align-items:center;gap:12px}
.logo-small{width:52px;height:52px;border-radius:10px;background:linear-gradient(180deg,#fff9db,#fff1b8);
display:flex;align-items:center;justify-content:center;color:#5b4d00;font-weight:700;border:1px solid rgba(2,6,23,0.08)}
.title{font-size:16px;font-weight:700}

.tabs{display:flex;gap:6px;margin-bottom:10px}
.tab{background:transparent;border:1px solid rgba(2,6,23,0.12);color:var(--text);
padding:8px 12px;border-radius:10px;cursor:pointer}

.container{display:flex;gap:18px;align-items:flex-start}
.card{background:var(--card);padding:14px;border-radius:var(--radius);box-shadow:var(--shadow);
border:1px solid rgba(2,6,23,0.12);width:100%}
.view{max-width:1200px}
.role-row{display:flex;gap:12px;margin-top:12px}
.btn{background:var(--accent);color:#00333a;padding:10px 14px;border:none;border-radius:10px;cursor:pointer;font-weight:800}
.btn.secondary{background:transparent;border:1px solid rgba(2,6,23,0.12);color:var(--accent)}
.btn.ghost{background:transparent;border:1px dashed rgba(2,6,23,0.12);color:var(--muted)}
.muted{color:var(--muted);font-size:13px}
.small{font-size:12px;color:var(--muted)}
.footer{text-align:center;margin-top:14px}

.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
.prod{background:var(--card);border:1px solid rgba(2,6,23,0.12);border-radius:12px;padding:8px;cursor:pointer;transition:transform .15s}
.prod:hover{transform:translateY(-2px)}
.prod img{width:100%;height:100px;object-fit:cover;border-radius:8px}
.prod .noimg{height:100px;border-radius:8px;background:#fff1b8;display:flex;align-items:center;justify-content:center;color:#9a8a40}

.pos-header{display:flex;justify-content:space-between;align-items:center}
.pos-body{display:flex;gap:12px;margin-top:12px}
.left{flex:1}
.right{width:480px}
.search{width:100%;padding:10px;border-radius:10px;border:1px solid rgba(2,6,23,0.12);background:transparent;color:var(--text)}

.cart-list .cart-item{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(2,6,23,0.1)}
.cart-item .qty{display:flex;gap:6px;align-items:center}
.badge{min-width:26px;text-align:center;background:#eef8f8;border-radius:8px;padding:4px 6px}

.num-display{background:transparent;border:1px solid rgba(2,6,23,0.12);border-radius:10px;padding:10px;text-align:center;font-size:22px}
.keypad-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.kbtn{padding:12px;border-radius:8px;border:1px solid rgba(2,6,23,0.12);background:transparent;color:var(--text);cursor:pointer}
.kbtn.equal{background:var(--accent);color:#00333a}
.btnRow{display:flex;gap:8px;margin-top:8px}

.admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.scroll{max-height:320px;overflow:auto}
.totals{margin-top:8px;font-weight:800}
// IndexedDB helpers
export const DB = 'fatoor_pos_v34';

export function open(){
  return new Promise((res,rej)=>{
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = e => {
      const db = e.target.result;
      ['users','products','invoices','shifts'].forEach(s=>{
        if(!db.objectStoreNames.contains(s)){
          db.createObjectStore(s, { keyPath: s==='users' ? 'username' : 'id' });
        }
      });
    };
    r.onsuccess = ()=> res(r.result);
    r.onerror   = ()=> rej(r.error);
  });
}

export function store(db, s, m='readonly'){
  return db.transaction(s, m).objectStore(s);
}

export async function all(s){
  const db = await open();
  return new Promise((res,rej)=>{
    const q = store(db,s).getAll();
    q.onsuccess = ()=> res(q.result || []);
    q.onerror   = ()=> rej(q.error);
  });
}

export async function get(s,k){
  const db = await open();
  return new Promise((res,rej)=>{
    const q = store(db,s).get(k);
    q.onsuccess = ()=> res(q.result || null);
    q.onerror   = ()=> rej(q.error);
  });
}

export async function put(s,v){
  const db = await open();
  return new Promise((res,rej)=>{
    const q = store(db,s,'readwrite').put(v);
    q.onsuccess = ()=> res(true);
    q.onerror   = ()=> rej(q.error);
  });
}

export async function del(s,k){
  const db = await open();
  return new Promise((res,rej)=>{
    const q = store(db,s,'readwrite').delete(k);
    q.onsuccess = ()=> res(true);
    q.onerror   = ()=> rej(q.error);
  });
}
import { all, get, put } from './db.js';

export async function ensureAdmin(hash){
  const users = await all('users');
  if(!users || users.length===0){
    const passHash = await hash('admin');
    await put('users',{ username:'admin', role:'admin', passHash });
  }
}

export async function login(u,p,hash){
  const user = await get('users', u);
  if(!user) throw new Error('المستخدم غير موجود');
  const h = await hash(p);
  if(h !== user.passHash) throw new Error('كلمة المرور خاطئة');
  return { username:user.username, role:user.role };
}

export async function createUser(current,{username,password,role},hash){
  if(!current || current.role!=='admin') throw new Error('فقط المدير ينشئ المستخدمين');
  if(!username || !password) throw new Error('أدخل اسم وكلمة مرور');
  const passHash = await hash(password);
  await put('users',{ username, role, passHash });
}
import { all, put, del } from './db.js';
import { ensureAdmin, login, createUser } from './auth.js';

const C = 'ر.س';
const S = {
  user: null,
  theme: localStorage.getItem('f34_theme') || 'light',
  settings: JSON.parse(localStorage.getItem('f34_settings') || '{}'),
  inv: JSON.parse(localStorage.getItem('f34_inv') || '{"headerText":"","footerText":"","vatRate":0}'),
  products: [],
  cart: [],
  shift: JSON.parse(localStorage.getItem('f34_shift') || 'null')
};

const $ = id => document.getElementById(id);
const show = pg => {
  document.querySelectorAll('.view').forEach(v => v.style.display='none');
  const el = $('page-'+pg);
  if(el) el.style.display='block';
};
const fmt = n => Number(n||0).toLocaleString('ar-EG',{maximumFractionDigits:2});

async function sha(s){
  const e = new TextEncoder();
  const b = await crypto.subtle.digest('SHA-256', e.encode(s));
  return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
}

function theme(){
  document.body.classList.remove('light','dark');
  document.body.classList.add(S.theme);
  localStorage.setItem('f34_theme', S.theme);
}
function canA(){ return S.user && S.user.role==='admin'; }
function canC(){ return S.user && (S.user.role==='cashier' || S.user.role==='admin'); }

function bindTabs(){
  document.querySelectorAll('.tab').forEach(b=> b.onclick = ()=> show(b.dataset.tab));
}

function splash(){
  const a = $('startupSound');
  try{ if(a){ a.volume=0.16; a.play().catch(()=>{}); } }catch(e){}
  setTimeout(()=>{
    const s = $('splash'); if(s) s.style.display='none';
    const app = $('app');  if(app) app.style.display='block';
    show('login');
  }, 4500);
}

function bindLogin(){
  $('cashierEnter').onclick = ()=>{
    $('adminLogin').style.display='block';
    $('adminUser').value='cashier';
    $('adminPass').value='cashier';
  };
  $('adminEnter').onclick = ()=>{
    $('adminLogin').style.display='block';
    $('adminUser').value='admin';
    $('adminPass').value='admin';
  };
  $('adminLoginBtn').onclick = async ()=>{
    try{
      const u = $('adminUser').value.trim();
      const p = $('adminPass').value;
      S.user = await login(u,p,sha);
      $('userBadge').innerText = 'دخول: ' + S.user.username + ' (' + S.user.role + ')';
      document.querySelector('[data-tab="pos"]').style.display     = canC()?'inline-block':'none';
      document.querySelector('[data-tab="admin"]').style.display   = canA()?'inline-block':'none';
      document.querySelector('[data-tab="reports"]').style.display = canC()?'inline-block':'none';
      document.querySelector('[data-tab="shifts"]').style.display  = canC()?'inline-block':'none';
      $('page-pos').style.display   = canC()?'block':'none';
      $('page-admin').style.display = canA()?'block':'none';
      show(canC()?'pos':'admin');
      await loadProducts();
      renderUsers();
      renderProdsList();
      renderInvoices();
      renderShifts();
    }catch(e){
      alert(e.message || 'خطأ في تسجيل الدخول');
    }
  };
  $('logoutBtn').onclick = ()=> location.reload();
}

async function loadProducts(){
  S.products = await all('products');
  renderProducts();
}

function toDataURL(f){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(r.result);
    r.onerror= ()=> rej(r.error);
    r.readAsDataURL(f);
  });
}

async function addProd(){
  const name = $('p_name').value.trim();
  const price = parseFloat(($('p_price').value || '0'));
  const barcode = $('p_barcode').value.trim();
  if(!name || isNaN(price)) return alert('أدخل اسمًا وسعرًا صالحين');
  const id = Date.now();
  let image = '';
  const f = $('p_img').files?.[0];
  if(f) image = await toDataURL(f);
  await put('products', { id, name, price, barcode, image });
  $('p_name').value=''; $('p_price').value=''; $('p_barcode').value=''; $('p_img').value='';
  await loadProducts();
  renderProdsList();
}

function renderProducts(){
  const grid = $('productsGrid'); if(!grid) return;
  grid.innerHTML='';
  const q = ($('searchProd')?.value || '').toLowerCase();
  const F = S.products.filter(p=>(p.name||'').toLowerCase().includes(q) || (p.barcode||'').toLowerCase().includes(q));
  if(F.length===0){ grid.innerHTML='<div class="muted">لا توجد أصناف</div>'; return; }
  F.forEach(p=>{
    const d = document.createElement('div');
    d.className='prod';
    d.onclick=()=> addToCart(p, pendingQty()||1);
    d.innerHTML = (p.image? `<img src="${p.image}">` : `<div class="noimg">لا توجد صورة</div>`)
      + `<p class="name">${p.name}</p>`
      + `<p class="price">${fmt(p.price)} ${C}</p>`
      + (p.barcode? `<div class="small muted">باركود: ${p.barcode}</div>` : '');
    grid.appendChild(d);
  });
}

async function renderProdsList(){
  const el = $('productsList'); if(!el) return;
  el.innerHTML='';
  const prods = await all('products');
  prods.forEach(p=>{
    const d = document.createElement('div');
    d.style.display='flex'; d.style.justifyContent='space-between'; d.style.padding='6px 0';
    d.innerHTML = `
      <div><strong>${p.name}</strong>
        <div class="small muted">${fmt(p.price)} ${C} ${(p.barcode?(' - باركود: '+p.barcode):'')}</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn secondary" data-act="edit">تعديل</button>
        <button class="btn ghost" data-act="del">حذف</button>
      </div>`;
    d.querySelector('[data-act="edit"]').onclick=async()=>{
      const n = prompt('اسم الصنف', p.name);        if(n===null) return;
      const pr= prompt('السعر', p.price);            if(pr===null) return;
      const b = prompt('الباركود', p.barcode||'');   if(b===null) return;
      const num = parseFloat(pr);
      if(!n.trim() || isNaN(num)) return alert('قيم غير صحيحة');
      await put('products',{...p, name:n.trim(), price:num, barcode:b.trim()});
      renderProdsList(); loadProducts();
    };
    d.querySelector('[data-act="del"]').onclick=async()=>{
      if(!confirm('حذف الصنف؟')) return;
      await del('products', p.id);
      renderProdsList(); loadProducts();
    };
    el.appendChild(d);
  });
}

function pendingQty(){
  const d = $('numDisplay');
  const v = Number(d?.innerText || '0');
  return v>0 ? v : 0;
}
function kpress(k){
  const d = $('numDisplay'); if(!d) return;
  if(d.innerText==='0') d.innerText=String(k); else d.innerText+=String(k);
}
function kclear(){ const d=$('numDisplay'); if(d) d.innerText='0'; }

function addToCart(p,qty){
  const ex = S.cart.find(c=>c.id===p.id);
  if(ex) ex.qty += qty;
  else S.cart.push({ id:p.id, name:p.name, price:p.price, qty });
  kclear(); renderCart();
}
function inc(id){ const c=S.cart.find(i=>i.id===id); if(!c) return; c.qty++; renderCart(); }
function dec(id){ const c=S.cart.find(i=>i.id===id); if(!c) return; c.qty--; if(c.qty<=0) S.cart=S.cart.filter(x=>x.id!==id); renderCart(); }
function rm(id){ S.cart=S.cart.filter(x=>x.id!==id); renderCart(); }

function tot(){ return S.cart.reduce((s,i)=>s+i.price*i.qty,0); }
function updTot(){ const t=$('totalsArea'); if(t) t.innerText='الإجمالي: '+fmt(tot())+' '+C; }

function renderCart(){
  const el = $('cartList'); if(!el) return;
  el.innerHTML='';
  if(S.cart.length===0){ el.innerHTML='<div class="small muted">السلة فارغة</div>'; updTot(); return; }
  S.cart.forEach(it=>{
    const d = document.createElement('div'); d.className='cart-item';
    d.innerHTML = `
      <div><strong>${it.name}</strong>
        <div class="small muted">${fmt(it.price)} ${C} × ${it.qty} = ${fmt(it.price*it.qty)} ${C}</div>
      </div>
      <div class="qty">
        <button class="btn secondary" data-act="dec">-</button>
        <div class="badge">${it.qty}</div>
        <button class="btn secondary" data-act="inc">+</button>
        <button class="btn ghost" data-act="del">حذف</button>
      </div>`;
    d.querySelector('[data-act="inc"]').onclick=()=>inc(it.id);
    d.querySelector('[data-act="dec"]').onclick=()=>dec(it.id);
    d.querySelector('[data-act="del"]').onclick=()=>rm(it.id);
    el.appendChild(d);
  });
  updTot();
}

function startShift(){
  if(S.shift){ alert('هناك وردية مفتوحة بالفعل'); return; }
  S.shift = {
    id: 'shift-'+Date.now(),
    start: new Date().toISOString(),
    invoiceCounter: 1,
    totals: { cash:0, card:0, transfer:0 },
    count: 0
  };
  localStorage.setItem('f34_shift', JSON.stringify(S.shift));
  updShift();
}

async function closeShift(){
  if(!S.shift) return alert('لا توجد وردية مفتوحة');
  if(!confirm('إغلاق الوردية وحفظ الموازنة؟')) return;
  const rec = {
    id: S.shift.id,
    start: S.shift.start,
    end: new Date().toISOString(),
    totals: S.shift.totals,
    count: S.shift.count
  };
  await put('shifts', rec);
  S.shift = null;
  localStorage.removeItem('f34_shift');
  updShift();
  renderShifts();
}

function updShift(){
  $('shiftIdDisplay').innerText      = S.shift ? S.shift.id : '—';
  $('currentInvoiceNumber').innerText= S.shift ? S.shift.invoiceCounter : '—';
  $('currentShiftInfo').innerText    = S.shift ? ('وردية مفتوحة منذ: ' + new Date(S.shift.start).toLocaleString('ar-EG')) : 'لا توجد وردية مفتوحة';
}

function payDialog(){
  const m = prompt('طريقة الدفع: كاش / شبكة / تحويل', 'كاش');
  if(!m) return null;
  const v = m.trim();
  if(['كاش','شبكة','تحويل'].indexOf(v)===-1){ alert('طريقة دفع غير صحيحة'); return null; }
  return v;
}

async function finish(){
  if(S.cart.length===0) return alert('السلة فارغة');
  if(!S.shift){ if(!confirm('لا توجد وردية مفتوحة. بدء وردية جديدة؟')) return; startShift(); }
  const payment = payDialog(); if(!payment) return;
  if(!confirm('تأكيد إنهاء وطباعه الفاتورة؟')) return;

  const id='inv-'+Date.now();
  const inv = {
    id,
    shiftId: S.shift.id,
    number: S.shift.invoiceCounter,
    date: new Date().toISOString(),
    items: S.cart.map(i=>({ name:i.name, price:i.price, qty:i.qty })),
    total: tot(),
    storeName: S.settings.storeName || 'فَاتور',
    vatNumber: S.settings.vatNumber || '',
    storePhone: S.settings.storePhone || '',
    storeLogo: S.settings.storeLogo || '',
    headerText: S.inv.headerText || '',
    footerText: S.inv.footerText || '',
    vatRate: Number(S.inv.vatRate || 0),
    payment
  };
  await put('invoices', inv);

  // تحديث الوردية:
  S.shift.invoiceCounter++;
  S.shift.count++;
  if(payment==='كاش')    S.shift.totals.cash     += inv.total;
  if(payment==='شبكة')  S.shift.totals.card     += inv.total;
  if(payment==='تحويل') S.shift.totals.transfer += inv.total;
  localStorage.setItem('f34_shift', JSON.stringify(S.shift));

  printInv(inv);
  S.cart=[]; renderCart(); updShift(); renderInvoices();
}

function vatCalc(total,rate){
  const vat = total * (rate/100);
  const sub = total - vat;
  return { vat, sub };
}

function printInv(inv){
  const { vat, sub } = vatCalc(inv.total, inv.vatRate||0);
  const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8">
    <title>فاتورة ${inv.number}</title>
    <style>
      body{font-family:Tahoma,Arial;margin:12px}
      table{width:100%;border-collapse:collapse}
      th,td{padding:6px;border-bottom:1px solid #eee}
      .small{font-size:12px;color:#555}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="text-align:right">
        <div style="font-weight:800;font-size:18px">${inv.storeName}</div>
        <div class="small">رقم ضريبي: ${inv.vatNumber || '-'}</div>
        <div class="small">فاتورة رقم: ${inv.number}</div>
        <div class="small">التاريخ: ${(new Date(inv.date)).toLocaleString('ar-EG')}</div>
        <div class="small">طريقة الدفع: ${inv.payment}</div>
      </div>
      ${inv.storeLogo
        ? `<img src="${inv.storeLogo}" style="width:80px;height:80px;object-fit:contain">`
        : `<div style="width:80px;height:80px;border:1px dashed #999;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666">لا شعار</div>`}
    </div>

    <div style="margin-top:8px">${inv.headerText || ''}</div>

    <table>
      <thead><tr><th style="text-align:right">الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
      <tbody>
        ${inv.items.map(i=>`<tr>
          <td style="text-align:right">${i.name}</td>
          <td style="text-align:center">${i.qty}</td>
          <td>${Number(i.price).toLocaleString('ar-EG',{maximumFractionDigits:2})} ${C}</td>
          <td>${Number(i.price*i.qty).toLocaleString('ar-EG',{maximumFractionDigits:2})} ${C}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <div style="margin-top:8px">
      ${inv.vatRate>0
        ? `الإجمالي الفرعي: ${Number(sub).toLocaleString('ar-EG',{maximumFractionDigits:2})} ${C}<br>
           الضريبة (${inv.vatRate}%): ${Number(vat).toLocaleString('ar-EG',{maximumFractionDigits:2})} ${C}<br>`
        : ``}
      <strong>الإجمالي الكلي: ${Number(inv.total).toLocaleString('ar-EG',{maximumFractionDigits:2})} ${C}</strong>
    </div>

    <div style="margin-top:8px">${inv.footerText || ''}</div>

    <script>setTimeout(()=>window.print(),400)</script>
  </body></html>`;

  const win = window.open('','_blank','scrollbars=yes');
  win.document.write(html);
  win.document.close();
}

async function renderInvoices(){
  const el = $('invoiceList'); if(!el) return;
  el.innerHTML='';
  const allInv = (await all('invoices')).sort((a,b)=>(a.date>b.date?-1:1));
  const q = ($('searchInvoice')?.value || '').trim();
  let F = allInv;
  if(q){ F = allInv.filter(inv => String(inv.number).includes(q) || inv.date.includes(q)); }
  if(F.length===0){ el.innerHTML='<div class="muted small">لا توجد فواتير</div>'; return; }

  F.slice(0,200).forEach(inv=>{
    const d = document.createElement('div');
    d.style.display='flex'; d.style.justifyContent='space-between'; d.style.padding='6px 0';
    d.innerHTML = `
      <div><strong>فاتورة #${inv.number}</strong>
        <div class="small muted">${new Date(inv.date).toLocaleString('ar-EG')} — ${Number(inv.total).toLocaleString('ar-EG',{maximumFractionDigits:2})} ${C} — ${inv.payment}</div>
      </div>
      <div style="display:flex;gap:6px"><button class="btn secondary" data-act="print">إعادة طباعة</button></div>`;
    d.querySelector('[data-act="print"]').onclick = ()=> printInv(inv);
    el.appendChild(d);
  });
}

async function renderShifts(){
  const el = $('shiftsList'); if(!el) return;
  el.innerHTML='';
  const allS = (await all('shifts')).sort((a,b)=>(a.start>b.start?-1:1));
  if(allS.length===0){ el.innerHTML='<div class="muted small">لا توجد موازنات محفوظة</div>'; return; }
  allS.forEach(s=>{
    const c = s.totals || { cash:0, card:0, transfer:0 };
    const d = document.createElement('div');
    d.style.display='grid'; d.style.gridTemplateColumns='1fr auto'; d.style.padding='8px 0'; d.style.borderBottom='1px solid rgba(2,6,23,0.08)';
    d.innerHTML = `
      <div>
        <div><strong>${s.id}</strong> — من ${new Date(s.start).toLocaleString('ar-EG')} إلى ${new Date(s.end).toLocaleString('ar-EG')}</div>
        <div class="small muted">عدد الفواتير: ${s.count} — نقد: ${Number(c.cash).toLocaleString('ar-EG',{maximumFractionDigits:2})} — شبكة: ${Number(c.card).toLocaleString('ar-EG',{maximumFractionDigits:2})} — تحويل: ${Number(c.transfer).toLocaleString('ar-EG',{maximumFractionDigits:2})}</div>
      </div>`;
    el.appendChild(d);
  });
}

function saveSettings(){
  S.settings.storeName  = $('storeName').value.trim();
  S.settings.vatNumber  = $('vatNumber').value.trim();
  S.settings.storePhone = $('storePhone').value.trim();
  const f = $('logoInput').files?.[0];
  if(f){
    const r = new FileReader();
    r.onload = ()=>{
      S.settings.storeLogo = r.result;
      localStorage.setItem('f34_settings', JSON.stringify(S.settings));
      alert('تم حفظ إعدادات المتجر');
      $('storeNameHeader').innerText = S.settings.storeName || 'اسم المحل';
    };
    r.readAsDataURL(f);
  }else{
    localStorage.setItem('f34_settings', JSON.stringify(S.settings));
    alert('تم حفظ إعدادات المتجر');
    $('storeNameHeader').innerText = S.settings.storeName || 'اسم المحل';
  }
}

function saveInv(){
  S.inv.headerText = $('invoiceHeaderText').value || '';
  S.inv.footerText = $('invoiceFooterText').value || '';
  S.inv.vatRate    = Number($('vatRate').value || 0);
  localStorage.setItem('f34_inv', JSON.stringify(S.inv));
  alert('تم حفظ إعدادات الفاتورة');
}

function bindPOS(){
  $('openSettingsBtn').onclick = ()=> show('admin');
  $('refreshProd').onclick     = ()=> renderProducts();
  $('searchProd').oninput      = ()=> renderProducts();
  $('finishInvoiceBtn').onclick= finish;
  $('clearCartBtn').onclick    = ()=>{ if(!confirm('مسح الطلب الحالي؟')) return; S.cart=[]; renderCart(); };
  $('startShiftBtn').onclick   = startShift;
  $('closeShiftBtn').onclick   = closeShift;

  document.querySelectorAll('.kbtn[data-k]').forEach(b=> b.onclick = ()=> kpress(b.dataset.k));
  $('ceBtn').onclick = kclear;
  $('applyBtn').onclick = ()=>{};
  setInterval(()=>{ const dt=$('currentDateTime'); if(dt) dt.innerText=new Date().toLocaleString('ar-EG'); },1000);
}

function bindAdmin(){
  $('saveSettingsBtn').onclick = saveSettings;
  $('saveInvoiceBtn').onclick  = saveInv;
  $('addProductBtn').onclick   = addProd;

  $('createUserBtn').onclick = async ()=>{
    try{
      const u = $('newUser').value.trim();
      const p = $('newPass').value;
      const r = $('newRole').value;
      await createUser({ username:S.user?.username, role:S.user?.role }, { username:u, password:p, role:r }, sha);
      $('newUser').value=''; $('newPass').value='';
      alert('تم إنشاء المستخدم');
      renderUsers();
    }catch(e){ alert(e.message || 'خطأ في إنشاء المستخدم'); }
  };
}

async function renderUsers(){
  const el = $('usersList'); if(!el) return;
  el.innerHTML='';
  const users = await all('users');
  users.forEach(u=>{
    const d = document.createElement('div');
    d.style.display='flex'; d.style.justifyContent='space-between'; d.style.padding='6px 0';
    d.innerHTML = `
      <div><strong>${u.username}</strong><div class="small muted">${u.role}</div></div>
      <div style="display:flex;gap:6px">${u.username==="admin" ? "" : `<button class="btn ghost" data-act="del">حذف</button>`}</div>`;
    if(u.username!=='admin'){
      d.querySelector('[data-act="del"]').onclick = async ()=>{
        if(!confirm('حذف المستخدم؟')) return;
        await del('users', u.username);
        renderUsers();
      };
    }
    el.appendChild(d);
  });
}

window.addEventListener('DOMContentLoaded', async ()=>{
  document.getElementById('themeToggle').onclick = ()=>{
    S.theme = (S.theme==='light' ? 'dark' : 'light');
    theme();
  };
  theme();
  document.getElementById('logoutBtn').onclick = ()=> location.reload();

  bindTabs(); splash(); bindLogin(); bindPOS(); bindAdmin();
  await ensureAdmin(sha);

  $('storeNameHeader').innerText = S.settings.storeName || 'اسم المحل';

  S.products = await all('products');
  renderProducts(); renderInvoices(); renderShifts();
});
