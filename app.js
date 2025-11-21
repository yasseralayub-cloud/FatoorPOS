(function(){
  function $(id){ return document.getElementById(id); }
  function showPage(name){ document.querySelectorAll('.view').forEach(v=>v.style.display='none'); var el=$('page-'+name); if(el) el.style.display='block'; }
  function endSplash(){
    var s=$('splash'), app=$('app');
    if(s) s.style.display='none';
    if(app) app.style.display='block';
    showPage('login');

    // 🔊 تشغيل الصوت بعد السبلش
    var audio = $('startupSound');
    if(audio){
      setTimeout(()=>audio.play().catch(()=>{}),300);
    }
  }

  setTimeout(endSplash, 6000);
  setTimeout(function(){
    var app=$('app');
    if(app && app.style.display!=='block') endSplash();
  }, 8000);

  var products = JSON.parse(localStorage.getItem('f31_products')||'[]');
  var cart = [];
  var invoiceCounter = Number(localStorage.getItem('f31_invoiceCounter')||'1');
  var settings = JSON.parse(localStorage.getItem('f31_settings')||'{}');

  function fmt(n){ return Number(n||0).toLocaleString('ar-EG',{maximumFractionDigits:2}); }

  function renderProducts(){
    var grid = $('productsGrid');
    if(!grid) return;
    grid.innerHTML='';

    var q = ($('searchProd')?.value||'').toLowerCase();
    var filtered = products.filter(p =>
      (p.name||'').toLowerCase().includes(q) ||
      (p.barcode||'').toLowerCase().includes(q)
    );

    if(filtered.length===0){
      grid.innerHTML='<div class="muted">لا توجد أصناف</div>';
      return;
    }

    filtered.forEach(p=>{
      var d=document.createElement('div');
      d.className='prod';
      d.onclick=()=>addToCart(p, getPendingQty()||1);

      d.innerHTML=
        (p.image ? `<img src="${p.image}">` : `<div class="noimg">لا توجد صورة</div>`) +
        `<p class="name">${p.name}</p>` +
        `<p class="price">${fmt(p.price)} ر.س</p>` +
        (p.barcode ? `<div class="small muted">باركود: ${p.barcode}</div>`:'');
      grid.appendChild(d);
    });
  }

  function renderCart(){
    var el=$('cartList');
    if(!el) return;

    el.innerHTML='';

    if(cart.length===0){
      el.innerHTML='<div class="small muted">السلة فارغة</div>';
      $('totalsArea').innerText='الإجمالي: 0 ر.س';
      return;
    }

    var total=0;

    cart.forEach(it=>{
      total+=it.price*it.qty;

      var d=document.createElement('div');
      d.className='cart-item';
      d.innerHTML=
        `<div><strong>${it.name}</strong>
           <div class="small muted">${fmt(it.price)} ر.س × ${it.qty} = ${fmt(it.price*it.qty)} ر.س</div>
         </div>
         <div class="qty">
           <button class="btn secondary" data-act="dec">-</button>
           <div class="badge">${it.qty}</div>
           <button class="btn secondary" data-act="inc">+</button>
           <button class="btn ghost" data-act="del">حذف</button>
         </div>`;

      d.querySelector('[data-act="inc"]').onclick=()=>{ it.qty++; renderCart(); };
      d.querySelector('[data-act="dec"]').onclick=()=>{ it.qty--; if(it.qty<=0) cart=cart.filter(x=>x!==it); renderCart(); };
      d.querySelector('[data-act="del"]').onclick=()=>{ cart=cart.filter(x=>x!==it); renderCart(); };

      el.appendChild(d);
    });

    $('totalsArea').innerText='الإجمالي: '+fmt(total)+' ر.س';
  }

  function getPendingQty(){
    var d=$('numDisplay');
    var v=Number(d?.innerText||'0');
    return v>0?v:0;
  }

  function keyPress(k){
    var d=$('numDisplay');
    if(!d) return;
    if(d.innerText==='0') d.innerText=String(k);
    else d.innerText+=String(k);
  }

  function keyClear(){
    var d=$('numDisplay');
    if(d) d.innerText='0';
  }

  function addToCart(p, qty){
    var ex=cart.find(c=>c.id===p.id);
    if(ex) ex.qty+=qty;
    else cart.push({id:p.id,name:p.name,price:p.price,qty:qty});
    keyClear();
    renderCart();
  }

  function printInvoice(){
    if(cart.length===0) return alert('السلة فارغة');
    if(!confirm('تأكيد إنهاء وطباعه الفاتورة؟')) return;

    var items=cart.map(i=>({name:i.name,price:i.price,qty:i.qty}));
    var total=cart.reduce((s,i)=>s+i.price*i.qty,0);

    var inv={
      number:invoiceCounter,
      date:new Date().toISOString(),
      items:items,
      total:total,
      storeName:settings.storeName||'فَاتور',
      storeLogo:settings.storeLogo||''
    };

    invoiceCounter+=1;
    localStorage.setItem('f31_invoiceCounter', String(invoiceCounter));

    var w=window.open('','_blank','scrollbars=yes');
    var html=
      `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8">
       <title>فاتورة ${inv.number}</title>
       <style>
         body{font-family:Tahoma,Arial;margin:12px}
         table{width:100%;border-collapse:collapse}
         th,td{padding:6px;border-bottom:1px solid #eee}
         .small{font-size:12px;color:#555}
       </style></head><body>`;

    html+=
      `<div style="display:flex;justify-content:space-between;align-items:center">
         <div style="text-align:right">
           <div style="font-weight:800;font-size:18px">${inv.storeName}</div>
           <div class="small">فاتورة رقم: ${inv.number}</div>
           <div class="small">التاريخ: ${(new Date(inv.date)).toLocaleString('ar-EG')}</div>
         </div>` +
       (inv.storeLogo
         ? `<img src="${inv.storeLogo}" style="width:80px;height:80px;object-fit:contain">`
         : `<div style="width:80px;height:80px;border:1px dashed #999;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666">لا شعار</div>`
       ) +
       `</div>`;

    html+=`<table>
              <thead>
                <tr><th style="text-align:right">الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
              </thead><tbody>`;
    items.forEach(i=>{
      html+=
        `<tr>
           <td style="text-align:right">${i.name}</td>
           <td style="text-align:center">${i.qty}</td>
           <td>${fmt(i.price)} ر.س</td>
           <td>${fmt(i.price*i.qty)} ر.س</td>
         </tr>`;
    });

    html+=`</tbody></table>
           <div style="margin-top:8px"><strong>الإجمالي الكلي: ${fmt(total)} ر.س</strong></div>
           </body></html>`;

    w.document.write(html);
    w.document.close();

    cart=[];
    renderCart();
  }

  // 🔍 فحص الشعار قبل الحفظ (الحجم + الأبعاد)
  function validateLogoFile(file, callback){
    if(!file) return callback(false, "لم يتم اختيار أي صورة.");

    if(file.size > 300 * 1024){
      return callback(false, "⚠ حجم الشعار كبير جدًا.\nالحد الأقصى هو 300KB.");
    }

    var img = new Image();
    img.onload = function(){
      if(img.width < 100 || img.height < 100)
        return callback(false, "⚠ أبعاد الشعار صغيرة جدًا.\nالحد الأدنى 100×100.");

      if(img.width > 500 || img.height > 500)
        return callback(false, "⚠ أبعاد الشعار كبيرة جدًا.\nالحد الأقصى 500×500.");

      callback(true);
    };

    img.onerror = ()=>callback(false, "⚠ الصورة غير صالحة أو تالفة.");

    img.src = URL.createObjectURL(file);
  }

  function addProductUI(){
    var name = ($('p_name')?.value||'').trim();
    var price = parseFloat(($('p_price')?.value||'0'));
    var barcode = ($('p_barcode')?.value||'').trim();
    var imgInput=$('p_img');

    if(!name || isNaN(price))
      return alert('أدخل اسمًا وسعرًا صالحين');

    var id=Date.now();

    function done(image){
      products.push({id:id,name:name,price:price,barcode:barcode,image:image||''});
      localStorage.setItem('f31_products', JSON.stringify(products));

      $('p_name').value='';
      $('p_price').value='';
      $('p_barcode').value='';
      $('p_img').value='';

      renderProducts();
      renderProductsList();
    }

    if(imgInput && imgInput.files && imgInput.files[0]){
      var r=new FileReader();
      r.onload=e=>done(e.target.result);
      r.readAsDataURL(imgInput.files[0]);
    }
    else done('');
  }

  function renderProductsList(){
    var el=$('productsList');
    if(!el) return;

    el.innerHTML='';

    if(products.length===0){
      el.innerHTML='<div class="muted small">لا توجد أصناف</div>';
      return;
    }

    products.forEach(p=>{
      var d=document.createElement('div');
      d.style.display='flex';
      d.style.justifyContent='space-between';
      d.style.padding='6px 0';

      d.innerHTML=
        `<div>
           <strong>${p.name}</strong>
           <div class="small muted">${fmt(p.price)} ر.س ${(p.barcode?(' - باركود: '+p.barcode):'')}</div>
         </div>
         <div style="display:flex;gap:6px">
           <button class="btn secondary" data-act="edit">تعديل</button>
           <button class="btn ghost" data-act="del">حذف</button>
         </div>`;

      d.querySelector('[data-act="edit"]').onclick=function(){
        var n=prompt('اسم الصنف',p.name);
        if(n===null) return;

        var pr=prompt('السعر',p.price);
        if(pr===null) return;

        var b=prompt('الباركود',p.barcode||'');
        if(b===null) return;

        var num=parseFloat(pr);
        if(!n.trim() || isNaN(num))
          return alert('قيم غير صحيحة');

        p.name=n.trim();
        p.price=num;
        p.barcode=b.trim();

        localStorage.setItem('f31_products', JSON.stringify(products));

        renderProducts();
        renderProductsList();
      };

      d.querySelector('[data-act="del"]').onclick=function(){
        if(!confirm('حذف الصنف؟')) return;

        products=products.filter(x=>x.id!==p.id);
        localStorage.setItem('f31_products', JSON.stringify(products));

        renderProducts();
        renderProductsList();
      };

      el.appendChild(d);
    });
  }

  window.addEventListener('DOMContentLoaded', function(){
    $('logoutBtn').onclick=()=>location.reload();

    $('cashierEnter').onclick=function(){
      $('userBadge').innerText='دخول: كاشير';
      showPage('pos');
      renderProducts();
    };

    $('adminEnter').onclick=()=> $('adminLogin').style.display='block';

    $('adminLoginBtn').onclick=function(){
      var u=($('adminUser')?.value||'').trim();
      var p=($('adminPass')?.value||'');

      if(u==='admin' && p==='admin'){
        $('userBadge').innerText='دخول: admin (admin)';
        showPage('admin');
        renderProductsList();
      } else alert('بيانات الدخول غير صحيحة');
    };

    $('refreshProd').onclick=renderProducts;
    var s=$('searchProd');
    if(s) s.oninput=renderProducts;

    $('finishInvoiceBtn').onclick=printInvoice;

    $('clearCartBtn').onclick=function(){
      if(!confirm('مسح الطلب الحالي؟')) return;
      cart=[];
      renderCart();
    };

    document.querySelectorAll('.kbtn[data-k]').forEach(btn=>{
      btn.onclick=()=> keyPress(btn.getAttribute('data-k'));
    });

    $('ceBtn').onclick=keyClear;

    // 🟦 زر الحفظ مع التحقق من الشعار
    $('saveSettingsBtn').onclick=function(){
      var file = $('logoInput')?.files?.[0];

      if(file){
        validateLogoFile(file, function(valid, message){
          if(!valid){
            alert(message);
            return;
          }

          var reader=new FileReader();
          reader.onload=function(e){
            settings.storeLogo=e.target.result;
            settings.storeName=($('storeName')?.value||'').trim();
            localStorage.setItem('f31_settings', JSON.stringify(settings));
            $('currentStoreName').innerText=settings.storeName||'اسم المحل';
            alert("✔ تم حفظ الشعار والإعدادات بنجاح.");
          };
          reader.readAsDataURL(file);
        });

      } else {
        settings.storeName=($('storeName')?.value||'').trim();
        localStorage.setItem('f31_settings', JSON.stringify(settings));
        $('currentStoreName').innerText=settings.storeName||'اسم المحل';
        alert("✔ تم حفظ إعدادات المحل.");
      }
    };

    $('addProductBtn').onclick=addProductUI;

    $('currentStoreName').innerText=settings.storeName||'اسم المحل';
    $('currentInvoiceNumber').innerText=String(invoiceCounter);

    renderProducts();
  });
})();
