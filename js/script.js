const API = '/api';
let currentView = 'home', adminLogged = false, adminTab = 'dashboard';
let posCart = [], posCustomer = '', posPhone = '', adminOrderFilter = '';
let lang = localStorage.getItem('lang') || 'ar';

const i18n = {
  ar: {
    home: 'الرئيسية', store: 'المتجر', cashier: 'الكاشير', myOrders: 'طلباتي', admin: 'الإدارة',
    heroTitle: 'تسوقي <span>بأناقة</span><br>مع saarabaa_boutique',
    heroSub: 'أحدث صيحات الموضة والإكسسوارات الفاخرة. تشكيلة مميزة بأسعار منافسة.',
    shopNow: 'تسوق الآن',
    categories: 'الأقسام', featured: 'منتجات مميزة',
    all: 'الكل', sortDefault: 'الافتراضي', sortPriceAsc: 'السعر: الأقل أولاً', sortPriceDesc: 'السعر: الأعلى أولاً', sortName: 'الاسم',
    search: 'بحث', noProducts: 'لا توجد منتجات', outOfStock: '❌ نفذ من المخزون', inStock: '📦 متوفر',
    add: 'أضف', addedToCart: '✔️ تمت الإضافة للسلة',
    cart: 'سلة التسوق', cartEmpty: '🛒 السلة فارغة', total: 'المجموع', checkout: 'إتمام الطلب',
    checkoutTitle: '💳 إتمام الطلب', fullName: 'الاسم الكامل *', phone: 'رقم الجوال *', address: 'العنوان (اختياري)',
    cash: 'نقدي', card: 'بطاقة', debt: 'دفع بالدين', cancel: 'إلغاء',
    orderTracking: 'تتبع الطلبات', enterPhone: 'أدخل رقم جوالك لعرض طلباتك', noOrders: 'لا توجد طلبات بهذا الرقم',
    statusNew: 'جديد', statusCompleted: 'مكتمل', statusCancelled: 'ملغي', statusProcessing: 'قيد التجهيز',
    invoice: '🧾 الفاتورة', items: 'أصناف', customerName: 'اسم العميل', totalItems: 'أضف منتجات',
    payCash: 'نقدي', payCard: 'بطاقة', payDebt: 'دين', clear: 'تفريغ',
    adminPanel: 'لوحة الإدارة', logout: 'خروج', adminLogin: 'دخول المدير', password: 'كلمة المرور', login: 'دخول',
    dashboard: '📊 الإحصائيات', manageProducts: '📦 المنتجات', manageCategories: '📁 الأقسام', manageOrders: '📋 الطلبات', manageDebts: '📕 الديون', reports: '📈 التقارير',
    totalSales: 'إجمالي المبيعات (XOF)', totalOrders: 'إجمالي الطلبات', totalProducts: 'المنتجات', todaySales: 'مبيعات اليوم', lowStock: 'مخزون منخفض',
    totalDebt: 'إجمالي الديون (XOF)', debtOrders: 'طلبات بالدين',
    addProduct: 'إضافة منتج', editProduct: 'تعديل', save: '💾 حفظ',
    productName: 'اسم المنتج *', price: 'السعر *', stock: 'المخزون', desc: 'وصف المنتج',
    chooseImage: 'اختيار صورة', camera: 'تصوير', link: 'رابط',
    name: 'الاسم', actions: 'الإجراءات', image: 'الصورة', date: 'التاريخ',
    addCategory: 'إضافة قسم', categoryName: 'اسم القسم',
    paid: 'المدفوع', remaining: 'المتبقي', collect: 'تحصيل',
    revenue: 'إجمالي الإيرادات', completedOrders: 'الطلبات المكتملة', topProducts: 'أفضل المنتجات مبيعاً',
    invoiceNum: 'رقم', invoiceDate: 'التاريخ والوقت', client: 'العميل', payment: 'الدفع',
    print: 'طباعة', close: 'إغلاق', error: '⚠️ حدث خطأ',
    noItems: 'لا توجد منتجات', searchPlaceholder: '🔍 بحث...',
    quantity: 'الكمية', thankYou: 'شكراً لتسوقكم معنا 🌸',
    debtor: 'زبون نقدي', fillNamePhone: '⚠️ أدخل الاسم ورقم الجوال',
    wrongPass: '❌ كلمة مرور خاطئة',
    confirmDelete: 'حذف المنتج؟', confirmDeleteCat: 'حذف القسم؟', confirmClear: 'تفريغ الفاتورة؟',
    debtPaymentTitle: '💰 تحصيل دفعة', debtAmount: 'المبلغ', debtNote: 'ملاحظة (اختياري)', confirm: 'تأكيد',
    recordPayment: '✅ تم تسجيل الدفعة',
    footerDesc: 'متجر إلكتروني للأزياء والإكسسوارات الفاخرة.',
    quickLinks: 'روابط سريعة', contactUs: 'تواصل معنا',
    fr: {}
  },
  fr: {
    home: 'Accueil', store: 'Boutique', cashier: 'Caisse', myOrders: 'Mes commandes', admin: 'Admin',
    heroTitle: 'Achetez <span>avec style</span><br>chez saarabaa_boutique',
    heroSub: 'Dernières tendances de la mode et accessoires de luxe. Sélection exclusive à prix compétitifs.',
    shopNow: 'Acheter maintenant',
    categories: 'Catégories', featured: 'Produits vedettes',
    all: 'Tous', sortDefault: 'Par défaut', sortPriceAsc: 'Prix: croissant', sortPriceDesc: 'Prix: décroissant', sortName: 'Nom',
    search: 'Rechercher', noProducts: 'Aucun produit', outOfStock: '❌ Rupture de stock', inStock: '📦 En stock',
    add: 'Ajouter', addedToCart: '✔️ Ajouté au panier',
    cart: 'Panier', cartEmpty: '🛒 Le panier est vide', total: 'Total', checkout: 'Commander',
    checkoutTitle: '💳 Passer la commande', fullName: 'Nom complet *', phone: 'Téléphone *', address: 'Adresse (optionnel)',
    cash: 'Espèces', card: 'Carte', debt: 'Payer à crédit', cancel: 'Annuler',
    orderTracking: 'Suivi des commandes', enterPhone: 'Entrez votre téléphone pour voir vos commandes', noOrders: 'Aucune commande avec ce numéro',
    statusNew: 'Nouveau', statusCompleted: 'Terminé', statusCancelled: 'Annulé', statusProcessing: 'En cours',
    invoice: '🧾 Facture', items: 'articles', customerName: 'Nom du client', totalItems: 'Ajoutez des produits',
    payCash: 'Espèces', payCard: 'Carte', payDebt: 'Crédit', clear: 'Vider',
    adminPanel: 'Panneau d\'administration', logout: 'Déconnexion', adminLogin: 'Connexion admin', password: 'Mot de passe', login: 'Connexion',
    dashboard: '📊 Tableau de bord', manageProducts: '📦 Produits', manageCategories: '📁 Catégories', manageOrders: '📋 Commandes', manageDebts: '📕 Dettes', reports: '📈 Rapports',
    totalSales: 'Ventes totales (XOF)', totalOrders: 'Total commandes', totalProducts: 'Produits', todaySales: 'Ventes du jour', lowStock: 'Stock faible',
    totalDebt: 'Total des dettes (XOF)', debtOrders: 'Commandes à crédit',
    addProduct: 'Ajouter un produit', editProduct: 'Modifier', save: '💾 Enregistrer',
    productName: 'Nom du produit *', price: 'Prix *', stock: 'Stock', desc: 'Description',
    chooseImage: 'Choisir une image', camera: 'Appareil photo', link: 'Lien',
    name: 'Nom', actions: 'Actions', image: 'Image', date: 'Date',
    addCategory: 'Ajouter une catégorie', categoryName: 'Nom de la catégorie',
    paid: 'Payé', remaining: 'Restant', collect: 'Percevoir',
    revenue: 'Revenu total', completedOrders: 'Commandes terminées', topProducts: 'Meilleurs produits',
    invoiceNum: 'N°', invoiceDate: 'Date et heure', client: 'Client', payment: 'Paiement',
    print: 'Imprimer', close: 'Fermer', error: '⚠️ Erreur',
    noItems: 'Aucun produit', searchPlaceholder: '🔍 Recherche...',
    quantity: 'Quantité', thankYou: 'Merci pour votre achat 🌸',
    debtor: 'Client au comptant', fillNamePhone: '⚠️ Entrez le nom et le téléphone',
    wrongPass: '❌ Mot de passe incorrect',
    confirmDelete: 'Supprimer le produit ?', confirmDeleteCat: 'Supprimer la catégorie ?', confirmClear: 'Vider la facture ?',
    debtPaymentTitle: '💰 Encaisser un paiement', debtAmount: 'Montant', debtNote: 'Note (optionnel)', confirm: 'Confirmer',
    recordPayment: '✅ Paiement enregistré',
    footerDesc: 'Boutique en ligne de mode et d\'accessoires de luxe.',
    quickLinks: 'Liens rapides', contactUs: 'Contactez-nous'
  }
};

function t(key) { return i18n[lang][key] || i18n.ar[key] || key; }
function l10n(item, field) { return lang === 'fr' && item[field + '_fr'] ? item[field + '_fr'] : item[field]; }
function toggleLangMenu() {
  document.getElementById('lang-menu').classList.toggle('open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.lang-selector')) document.getElementById('lang-menu')?.classList.remove('open');
  if (!e.target.closest('.nav-links') && !e.target.closest('#hamburger-btn') && !e.target.closest('.hamburger')) document.querySelector('.nav-links')?.classList.remove('nav-open');
});
function switchLang(l) {
  lang = l; localStorage.setItem('lang', l);
  document.getElementById('html-tag').setAttribute('dir', l === 'fr' ? 'ltr' : 'rtl');
  document.getElementById('html-tag').setAttribute('lang', l);
  document.getElementById('lang-current').textContent = l === 'ar' ? 'AR' : 'FR';
  document.getElementById('lang-menu').classList.remove('open');
  translateStatic(); render(); updateBadge();
}
function translateStatic() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}

// ========== API ==========
async function api(action, method = 'GET', body = null) {
    let url = `${API}?action=${action}`;
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (method === 'GET' && body) {
        url += '&' + new URLSearchParams(body);
    } else if (body) {
        opts.body = JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    return await res.json();
}

// ========== NAV ==========
function navTo(view) {
    currentView = view;
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active-nav'));
    const btn = document.querySelector(`.nav-link[data-view="${view}"]`);
    if (btn) btn.classList.add('active-nav');
    closeDrawer();
    render();
}

document.querySelectorAll('.nav-link').forEach(b => b.onclick = () => navTo(b.dataset.view));
document.getElementById('nav-home').onclick = (e) => { e.preventDefault(); navTo('home'); };
document.getElementById('nav-cart-btn').onclick = toggleDrawer;

// ========== RENDER ==========
async function render() {
    const app = document.getElementById('app-root');
    let html = '';
    try {
        if (currentView === 'home') html = await renderHome();
        else if (currentView === 'products') html = await renderProducts();
        else if (currentView === 'product') html = await renderProductDetail();
        else if (currentView === 'orders') html = await renderOrders();
        else if (currentView === 'pos') html = renderPOS();
        else if (currentView === 'admin') html = await renderAdmin();
        else html = await renderHome();
    } catch(e) { html = `<div class="empty-state">${t('error')}: ${e.message}</div>`; }
    app.innerHTML = html;
    bindEvents();
}

// ========== HOME ==========
async function renderHome() {
    const featured = (await api('getFeatured')).products || [];
    const cats = (await api('getCategories')).categories || [];
    return `
    <div class="hero">
        <div class="hero-content">
            <div class="hero-title">${t('heroTitle')}</div>
            <div class="hero-sub">${t('heroSub')}</div>
            <button class="btn btn-primary" onclick="navTo('products')"><i class="fas fa-store"></i> ${t('shopNow')}</button>
        </div>
        <img src="/uploads/logos.png" class="hero-img" alt="saarabaa_boutique">
    </div>
    <div class="section-title"><i class="fas fa-th-large"></i> <span>${t('categories')}</span></div>
    <div class="cat-grid">${cats.map(c => `<div class="cat-card" onclick="navTo('products')"><img src="${c.image}" alt="${l10n(c,'name')}"><div class="cat-overlay">${l10n(c,'name')}</div></div>`).join('')}</div>
    <div class="section-title"><i class="fas fa-star"></i> <span>${t('featured')}</span></div>
    <div class="prod-grid">${featured.map(p => prodCard(p)).join('')}</div>`;
}

// ========== PRODUCTS ==========
async function renderProducts() {
    const cats = (await api('getCategories')).categories || [];
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat') || 'all';
    const sort = params.get('sort') || '';
    const search = params.get('q') || '';
    const data = await api('getProducts', 'GET', { cat, sort, search });
    return `<div class="products-layout">
        <div class="filter-sidebar">
            <h4>${t('categories')}</h4>
            <label><input type="radio" name="cat" value="all" ${cat==='all'?'checked':''} onchange="filterProducts('cat',this.value)"> ${t('all')}</label>
            ${cats.map(c => `<label><input type="radio" name="cat" value="${c.id}" ${String(cat)==String(c.id)?'checked':''} onchange="filterProducts('cat',this.value)"> ${l10n(c,'name')}</label>`).join('')}
            <hr style="margin:0.8rem 0;border-color:#eee2d6;">
            <h4>${t('sortName')}</h4>
            <label><input type="radio" name="sort" value="" ${!sort?'checked':''} onchange="filterProducts('sort','')"> ${t('sortDefault')}</label>
            <label><input type="radio" name="sort" value="price_asc" ${sort==='price_asc'?'checked':''} onchange="filterProducts('sort','price_asc')"> ${t('sortPriceAsc')}</label>
            <label><input type="radio" name="sort" value="price_desc" ${sort==='price_desc'?'checked':''} onchange="filterProducts('sort','price_desc')"> ${t('sortPriceDesc')}</label>
            <label><input type="radio" name="sort" value="name" ${sort==='name'?'checked':''} onchange="filterProducts('sort','name')"> ${t('sortName')}</label>
        </div>
        <div class="products-main">
            <div class="prod-toolbar">
                <button class="btn btn-sm btn-outline filter-toggle" onclick="toggleFilter()"><i class="fas fa-sliders-h"></i> <span>${t('categories')}</span></button>
                <div style="display:flex;gap:0.5rem;flex:1;">
                    <input id="prod-search" placeholder="${t('searchPlaceholder')}" style="flex:1;padding:0.6rem 1rem;border:2px solid #e6dbcf;border-radius:12px;">
                    <button class="btn" onclick="filterProducts('q',document.getElementById('prod-search').value)"><i class="fas fa-search"></i></button>
                </div>
            </div>
            <div class="prod-grid">${(data.products||[]).map(p => prodCard(p)).join('')||`<div class="empty-state" style="grid-column:1/-1">${t('noProducts')}</div>`}</div>
        </div>
    </div>`;
}

function toggleFilter() {
    document.querySelector('.filter-sidebar')?.classList.toggle('filter-open');
}

function toggleNav() {
    document.querySelector('.nav-links')?.classList.toggle('nav-open');
}

function filterProducts(key, val) {
    const params = new URLSearchParams(window.location.search);
    if (val) params.set(key, val);
    else params.delete(key);
    const q = params.toString();
    window.history.replaceState({}, '', '?view=products' + (q ? '&' + q : ''));
    render();
}

function prodCard(p) {
    return `<div class="prod-card">
        <img class="prod-img" src="${p.image}" alt="${l10n(p,'name')}" onerror="this.src='https://via.placeholder.com/400x500?text=No+Image'" loading="lazy">
        <div class="prod-body">
            <div class="prod-name truncate">${l10n(p,'name')}</div>
            <div class="prod-price">${p.price} XOF</div>
            <div class="prod-rating">${'★'.repeat(Math.round(p.rate||0))}${'☆'.repeat(5-Math.round(p.rate||0))} (${p.rate||0})</div>
            <div class="prod-stock">${p.stock > 0 ? t('inStock') + ': ' + p.stock : t('outOfStock')}</div>
            <div class="prod-actions">
                <button class="btn btn-sm btn-outline" onclick="showProduct(${p.id})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-primary" onclick="quickAdd(${p.id})" ${p.stock<1?'disabled':''}><i class="fas fa-cart-plus"></i> ${t('add')}</button>
            </div>
        </div>
    </div>`;
}

async function showProduct(id) {
    const d = await api('getProduct', 'GET', { id, lang });
    const p = d.product; if (!p) return;
    window.productDetail = p;
    currentView = 'product';
    render();
}

async function renderProductDetail() {
    const p = window.productDetail; if (!p) return '<div class="empty-state">المنتج غير موجود</div>';
    return `<button class="btn btn-sm" onclick="navTo('products')" style="margin-bottom:1rem;"><i class="fas fa-arrow-right"></i> ${t('store')}</button>
    <div class="prod-detail">
        <div class="prod-detail-img"><img src="${p.image}" alt="${l10n(p,'name')}" onerror="this.src='https://via.placeholder.com/500'"></div>
        <div class="prod-detail-info">
            <div class="prod-detail-name">${l10n(p,'name')}</div>
            <div class="prod-detail-price">${p.price} XOF</div>
            <div class="prod-rating mb-1">${'★'.repeat(Math.round(p.rate||0))}${'☆'.repeat(5-Math.round(p.rate||0))} (${p.rate||0})</div>
            <div class="prod-detail-desc">${l10n(p,'desc')}</div>
            <div class="prod-detail-stock">${p.stock > 0 ? '📦 ' + t('stock') + ': ' + p.stock : t('outOfStock')}</div>
            <div class="qty-control">
                <span>${t('quantity')}:</span>
                <button class="btn btn-sm" onclick="detQty(-1)">-</button>
                <input type="number" id="detail-qty" value="1" min="1" max="${p.stock}">
                <button class="btn btn-sm" onclick="detQty(1)">+</button>
            </div>
            <div style="display:flex;gap:0.5rem;">
                <button class="btn btn-primary" onclick="addFromDetail()" ${p.stock<1?'disabled':''}><i class="fas fa-cart-plus"></i> ${t('add')}</button>
            </div>
        </div>
    </div>`;
}

function detQty(d) {
    const inp = document.getElementById('detail-qty');
    if (!inp) return;
    let v = parseInt(inp.value) + d;
    if (v < 1) v = 1;
    if (v > (window.productDetail?.stock || 999)) v = window.productDetail.stock;
    inp.value = v;
}

async function addFromDetail() {
    const p = window.productDetail;
    if (!p) return;
    const qty = parseInt(document.getElementById('detail-qty')?.value || 1);
    await api('addToCart', 'POST', { id: p.id, quantity: qty });
    updateBadge();
    showToast(t('addedToCart'));
}

// ========== CART DRAWER ==========
function toggleDrawer() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('drawer-overlay').classList.toggle('open');
    if (document.getElementById('cart-drawer').classList.contains('open')) loadDrawer();
}
function closeDrawer() { document.getElementById('cart-drawer').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('open'); }
document.getElementById('drawer-overlay').onclick = closeDrawer;
document.getElementById('drawer-close').onclick = closeDrawer;

async function loadDrawer() {
    const d = await api('getCart');
    const body = document.getElementById('drawer-body');
    if (!d.items || !d.items.length) {
        body.innerHTML = `<div class="empty-state">${t('cartEmpty')}</div>`;
        document.getElementById('drawer-total').textContent = '0 XOF';
        document.getElementById('drawer-checkout').disabled = true;
        return;
    }
    body.innerHTML = d.items.map(i => `<div class="cart-item">
        <img src="${i.image||'https://via.placeholder.com/70'}" alt="${i.name}">
        <div class="cart-item-info">
            <div class="cart-item-name">${lang === 'fr' && i.name_fr ? i.name_fr : i.name}</div>
            <div class="cart-item-price">${i.price} XOF</div>
            <div class="cart-item-qty">
                <button class="btn btn-sm" onclick="cartQty(${i.id},${i.qty-1})">-</button>
                <span>${i.qty}</span>
                <button class="btn btn-sm" onclick="cartQty(${i.id},${i.qty+1})">+</button>
                <button class="btn btn-sm btn-danger" onclick="cartQty(${i.id},0)" style="margin-right:0.5rem;"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div style="font-weight:700;">${i.price*i.qty} XOF</div>
    </div>`).join('');
    document.getElementById('drawer-total').textContent = d.total + ' XOF';
    document.getElementById('drawer-checkout').disabled = false;
}

async function cartQty(id, qty) {
    await api('updateCart', 'POST', { id, qty });
    updateBadge();
    loadDrawer();
}

async function quickAdd(id) {
    await api('addToCart', 'POST', { id, quantity: 1 });
    updateBadge();
    showToast(t('addedToCart'));
}

async function updateBadge() {
    const d = await api('getCart');
    const b = document.getElementById('cart-badge');
    if (b) b.textContent = d.count || 0;
}

document.getElementById('drawer-checkout').onclick = () => { closeDrawer(); showCheckoutForm(); };

// ========== CHECKOUT ==========
function showCheckoutForm() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="modal-box">
        <div class="modal-title">${t('checkoutTitle')}</div>
        <input id="ch-name" class="pos-input" placeholder="${t('fullName')}" required>
        <input id="ch-phone" class="pos-input" placeholder="${t('phone')}" required>
        <input id="ch-address" class="pos-input" placeholder="${t('address')}">
        <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
            <button class="btn btn-success" onclick="submitCheckout('نقدي')" style="flex:1;justify-content:center;"><i class="fas fa-money-bill"></i> ${t('cash')}</button>
            <button class="btn btn-primary" onclick="submitCheckout('بطاقة')" style="flex:1;justify-content:center;"><i class="fas fa-credit-card"></i> ${t('card')}</button>
        </div>
        <div style="margin-top:0.5rem;">
            <button class="btn btn-outline btn-block" onclick="submitCheckout('دين')" style="border-color:#b47c48;color:#b47c48;"><i class="fas fa-book"></i> ${t('debt')}</button>
        </div>
        <button class="btn mt-1" onclick="this.closest('.modal-overlay').remove()">${t('cancel')}</button>
    </div>`;
    document.body.appendChild(overlay);
}

async function submitCheckout(pm) {
    const name = document.getElementById('ch-name')?.value;
    const phone = document.getElementById('ch-phone')?.value;
    if (!name || !phone) return showAlert(t('fillNamePhone'));
    const res = await api('checkout', 'POST', { name, phone, address: document.getElementById('ch-address')?.value || '', payment: pm });
    document.querySelector('.modal-overlay')?.remove();
    if (res.success) {
        showInvoice(res.order);
        updateBadge();
    } else showAlert('❌ ' + (res.error || t('error')));
}

// ========== ORDERS ==========
async function renderOrders() {
    return `<h2><i class="fas fa-truck"></i> ${t('orderTracking')}</h2>
    <p class="text-muted mb-1">${t('enterPhone')}</p>
    <div style="display:flex;gap:0.5rem;max-width:400px;">
        <input id="order-phone" class="pos-input" placeholder="${t('phone')}" style="flex:1;">
        <button class="btn btn-primary" onclick="lookupOrders()"><i class="fas fa-search"></i></button>
    </div>
    <div id="orders-result" class="mt-2"></div>`;
}

async function lookupOrders() {
    const phone = document.getElementById('order-phone')?.value;
    if (!phone) return showAlert('⚠️ ' + t('phone'));
    const d = await api('getOrdersByPhone', 'GET', { phone });
    const div = document.getElementById('orders-result');
    if (!d.orders || !d.orders.length) { div.innerHTML = `<div class="empty-state">${t('noOrders')}</div>`; return; }
    div.innerHTML = d.orders.map(o => `<div class="order-card">
        <div><strong>#${o.invoice||o.id}</strong><br><span class="text-muted">${o.date}</span></div>
        <div><span class="tag ${statusClass(o.status)}">${statusLabel(o.status)}</span></div>
        <div style="font-weight:700;">${o.total} XOF</div>
        <button class="btn btn-sm" onclick='showInvoice(${JSON.stringify(o).replace(/'/g,"&#39;")})'><i class="fas fa-eye"></i></button>
    </div>`).join('');
}

function statusClass(s) {
    if (s === 'مكتمل' || s === 'Terminé') return 'tag-completed';
    if (s === 'ملغي' || s === 'Annulé') return 'tag-cancelled';
    if (s === 'قيد التجهيز' || s === 'En cours') return 'tag-processing';
    return 'tag-new';
}
function statusLabel(s) {
    if (s === 'مكتمل' || s === 'Terminé') return lang === 'fr' ? 'Terminé' : 'مكتمل';
    if (s === 'ملغي' || s === 'Annulé') return lang === 'fr' ? 'Annulé' : 'ملغي';
    if (s === 'قيد التجهيز' || s === 'En cours') return lang === 'fr' ? 'En cours' : 'قيد التجهيز';
    return lang === 'fr' ? 'Nouveau' : 'جديد';
}

// ========== POS ==========
function renderPOS() {
    let cartH = '', total = 0;
    posCart.forEach((it, i) => {
        const sub = it.price * it.qty; total += sub;
        cartH += `<div class="pos-item">
            <div class="pos-item-name">${it.name}</div>
            <div class="pos-item-qty">
                <button class="btn btn-sm" onclick="posQty(${i},-1)">-</button>
                <span>${it.qty}</span>
                <button class="btn btn-sm" onclick="posQty(${i},1)">+</button>
            </div>
            <div class="pos-item-total">${sub} XOF</div>
            <button class="btn btn-sm btn-danger" onclick="posRemove(${i})"><i class="fas fa-times"></i></button>
        </div>`;
    });
    return `<div class="pos-layout">
        <div class="pos-products">
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
                <input id="pos-search" placeholder="🔍 بحث..." style="flex:1;padding:0.6rem 1rem;border:2px solid #e6dbcf;border-radius:12px;">
            </div>
            <div class="prod-grid" id="pos-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));"></div>
        </div>
        <div class="pos-cart">
            <div class="pos-cart-header"><span>${t('invoice')}</span><span id="pos-count">${posCart.reduce((s,i)=>s+i.qty,0)} ${t('items')}</span></div>
            <div class="pos-cart-items">${cartH || `<div class="empty-state">${t('totalItems')}</div>`}</div>
            <div class="pos-footer">
                <div class="pos-total"><span>المجموع</span><span>${total} XOF</span></div>
                <input class="pos-input" id="pos-name" placeholder="${t('customerName')}" value="${posCustomer}" oninput="posCustomer=this.value">
                <input class="pos-input" id="pos-phone" placeholder="${t('phone')}" value="${posPhone}" oninput="posPhone=this.value">
                <div class="pos-pay" style="flex-wrap:wrap;">
                    <button class="btn btn-success" onclick="posPay('نقدي')" ${!posCart.length?'disabled':''}><i class="fas fa-money-bill"></i> ${t('payCash')}</button>
                    <button class="btn btn-primary" onclick="posPay('بطاقة')" ${!posCart.length?'disabled':''}><i class="fas fa-credit-card"></i> ${t('payCard')}</button>
                    <button class="btn" onclick="posPay('دين')" ${!posCart.length?'disabled':''} style="background:#b47c48;"><i class="fas fa-book"></i> ${t('payDebt')}</button>
                    <button class="btn btn-danger" onclick="posClear()"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    </div>`;
}

function posQty(i, d) {
    if (posCart[i].qty + d <= 0) posCart.splice(i, 1);
    else posCart[i].qty += d;
    render();
}
function posRemove(i) { posCart.splice(i, 1); render(); }
function posClear() { if (confirm(t('confirmClear'))) { posCart = []; render(); } }

async function posPay(method) {
    if (!posCart.length) return;
    const res = await api('cashierCheckout', 'POST', { items: posCart, customerName: posCustomer || 'زبون نقدي', customerPhone: posPhone, paymentMethod: method });
    if (res.success) {
        posCart = []; posCustomer = ''; posPhone = '';
        showInvoice(res.order); render();
    } else showAlert('❌ ' + (res.error || t('error')));
}

async function loadPOS() {
    const grid = document.getElementById('pos-grid');
    if (!grid) return;
    const d = await api('getProducts');
    if (!d.products || !d.products.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${t('noItems')}</div>`; return; }
    grid.innerHTML = d.products.map(p => `<div class="prod-card" style="cursor:pointer;" onclick="posAdd(${p.id},'${p.name.replace(/'/g,"\\'")}',${p.price})">
        <img class="prod-img" src="${p.image}" alt="${l10n(p,'name')}" style="height:160px;" onerror="this.src='https://via.placeholder.com/300'">
        <div class="prod-body" style="padding:0.6rem;">
            <div class="prod-name" style="font-size:0.9rem;">${l10n(p,'name')}</div>
            <div class="prod-price" style="font-size:0.95rem;">${p.price} XOF</div>
        </div>
    </div>`).join('');
    // Search
    document.getElementById('pos-search')?.setAttribute('placeholder', t('searchPlaceholder'));
    document.getElementById('pos-search')?.addEventListener('input', function() {
        const q = this.value.toLowerCase();
        grid.querySelectorAll('.prod-card').forEach(c => c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none');
    });
}

function posAdd(id, name, price) {
    const ex = posCart.find(i => i.id === id);
    if (ex) ex.qty++;
    else posCart.push({ id, name, price, qty: 1 });
    render();
}

// ========== INVOICE MODAL ==========
function showInvoice(order) {
    const o = document.createElement('div');
    o.className = 'modal-overlay';
    o.onclick = (e) => { if (e.target === o) o.remove(); };
    o.innerHTML = `<div class="modal-box" style="text-align:center;">
        <img src="/uploads/logos.png" style="max-height:60px;margin-bottom:0.5rem;border-radius:10px;" onerror="this.style.display='none'" alt="Logo">
        <div class="modal-title">saarabaa_boutique</div>
        <div class="modal-meta" style="text-align:right;">
            <div>${t('invoiceNum')}: <strong>${order.invoice||order.id}</strong></div>
            <div>${t('invoiceDate')}: ${order.date}</div>
            <div>${t('client')}: ${order.customerName}</div>
            ${order.customerPhone ? `<div>${t('phone')}: ${order.customerPhone}</div>` : ''}
            ${order.customerAddress ? `<div>${t('address')}: ${order.customerAddress}</div>` : ''}
            ${order.payment ? `<div>${t('payment')}: <strong>${order.payment}</strong></div>` : ''}
            ${order.paymentMethod ? `<div>${t('payment')}: <strong>${order.paymentMethod}</strong></div>` : ''}
            ${order.payment === 'دين' || order.debtRemaining > 0 ? `
            <div style="background:#fff5e6;padding:0.5rem 0.8rem;border-radius:10px;margin-top:0.5rem;">
                <div>💰 المدفوع: ${order.debtPaid||0} XOF</div>
                <div style="color:#b34a4a;font-weight:700;">⏳ المتبقي: ${order.debtRemaining||order.total} XOF</div>
            </div>` : ''}
            <hr style="border:none;border-top:1px solid #eee2d6;margin:0.8rem 0;">
            <div style="font-size:0.85rem;color:#555;text-align:center;">
                <div>📞 221763809805</div>
                <div>✉️ bayelo011@gmail.com</div>
            </div>
        </div>
        <table><thead><tr><th>#</th><th>${t('name')}</th><th>${t('quantity')}</th><th>${t('price')}</th><th>${t('total')}</th></tr></thead><tbody>
        ${(order.items||[]).map((it,i) => `<tr><td>${i+1}</td><td>${lang==='fr'&&it.name_fr?it.name_fr:it.name||it.item}</td><td>${it.quantity||it.qty}</td><td>${it.price}</td><td>${(it.price)*(it.quantity||it.qty||1)}</td></tr>`).join('')}
        </tbody></table>
        <div style="font-size:1.3rem;font-weight:800;text-align:left;margin:1rem 0;">${t('total')}: ${order.total} XOF</div>
        <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-primary" onclick='printInvoice(${JSON.stringify(order).replace(/'/g,"&#39;")})'><i class="fas fa-print"></i> ${t('print')}</button>
            <button class="btn btn-success" onclick='downloadPDF(${JSON.stringify(order).replace(/'/g,"&#39;")})'><i class="fas fa-file-pdf"></i> PDF</button>
            <button class="btn" onclick="this.closest('.modal-overlay').remove()">${t('close')}</button>
        </div>
    </div>`;
    document.body.appendChild(o);
}

function printInvoice(order) {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printInvoiceHTML(order));
    doc.close();
    setTimeout(() => { iframe.contentWindow.print(); setTimeout(() => document.body.removeChild(iframe), 1000); }, 500);
}

// ========== DOWNLOAD PDF ==========
async function downloadPDF(order) {
    const res = await fetch('/download-invoice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang, order }) });
    if (!res.ok) { showAlert('❌ ' + (lang==='fr'?'Erreur PDF':'خطأ في تحميل PDF')); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `invoice-${order.invoice||order.id}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function printInvoiceHTML(order) {
    const dir = lang === 'fr' ? 'ltr' : 'rtl';
    return `<html dir="${dir}"><head><title>فاتورة</title><style>
        body{font-family:Tajawal,sans-serif;padding:1.2rem;max-width:380px;margin:auto;color:#2d2a24;font-size:13px;}
        .header{text-align:center;margin-bottom:0.8rem;}
        .header h2{color:#d4af7a;margin-bottom:0.2rem;font-size:1.1rem;}
        .logo-print{max-height:60px;margin-bottom:0.3rem;border-radius:10px;}
        .shop{text-align:center;color:#555;font-size:0.8rem;margin-bottom:1rem;}
        table{width:100%;border-collapse:collapse;margin:0.8rem 0;font-size:12px;}
        th{background:#f3ede6;padding:0.3rem;text-align:${dir==='rtl'?'right':'left'};}
        td{padding:0.3rem;border-bottom:1px solid #eee;}
        .total{font-size:1.1rem;font-weight:800;text-align:left;margin-top:0.8rem;}
        hr{border:none;border-top:2px dashed #d4af7a;margin:0.8rem 0;}
        .footer{text-align:center;color:#888;font-size:0.75rem;margin-top:0.8rem;}
    </style></head><body>
    <div class="header">
        <img src="/uploads/logos.png" class="logo-print" onerror="this.style.display='none'" alt="Logo">
        <h2>saarabaa_boutique</h2>
    </div>
    <div class="shop">${order.customerName} | ${order.date}</div>
    <div style="font-size:0.8rem;color:#555;">${t('invoiceNum')}: ${order.invoice||order.id}</div>
    ${order.customerPhone ? `<div style="font-size:0.8rem;color:#555;">${t('phone')}: ${order.customerPhone}</div>` : ''}
    <hr>
    <table><thead><tr><th>${t('name')}</th><th>${t('quantity')}</th><th>${t('price')}</th><th>${t('total')}</th></tr></thead><tbody>
    ${(order.items||[]).map(it => `<tr><td>${lang==='fr'&&it.name_fr?it.name_fr:it.name||it.item}</td><td>${it.quantity||it.qty}</td><td>${it.price}</td><td>${(it.price)*(it.quantity||it.qty||1)}</td></tr>`).join('')}
    </tbody></table>
    <div class="total">${t('total')}: ${order.total} XOF</div>
    <div style="text-align:center;color:#555;font-size:0.8rem;">${t('payment')}: ${order.payment||order.paymentMethod||'Payé'}</div>
    ${(order.payment === 'دين' || order.debtRemaining > 0) ? `
    <div style="margin-top:0.5rem;padding:0.4rem;background:#fff5e6;border-radius:8px;font-size:0.8rem;text-align:center;">
        <div>💰 ${t('paid')}: ${order.debtPaid||0} XOF</div>
        <div style="color:#b34a4a;">⏳ ${t('remaining')}: ${order.debtRemaining||order.total} XOF</div>
    </div>` : ''}
    <hr>
    <div style="text-align:center;color:#888;font-size:0.75rem;margin-bottom:0.3rem;">
        <div>📞 221763809805  |  ✉️ bayelo011@gmail.com</div>
    </div>
    <div class="footer">${t('thankYou')}</div>
    </body></html>`;
}

// ========== ADMIN ==========
async function renderAdmin() {
    if (!adminLogged) return `
    <div style="max-width:400px;margin:3rem auto;background:#fff;border-radius:24px;padding:2rem;text-align:center;">
        <h3><i class="fas fa-lock"></i> ${t('adminLogin')}</h3>
        <input id="admin-pass" type="password" class="pos-input" placeholder="${t('password')}">
        <button class="btn btn-primary btn-block mt-1" onclick="adminLogin()">${t('login')}</button>
    </div>`;
    const dash = currentView === 'admin' ? await api('adminDashboard') : null;
    const tabs = ['dashboard','products','categories','orders','debts','reports'];
    let content = '';
    if (adminTab === 'dashboard') {
        content = `<div class="stats-grid">
            <div class="stat-card"><div class="stat-num">${dash?.totalSales||0}</div><div class="stat-label">${t('totalSales')}</div></div>
            <div class="stat-card"><div class="stat-num">${dash?.totalOrders||0}</div><div class="stat-label">${t('totalOrders')}</div></div>
            <div class="stat-card"><div class="stat-num">${dash?.totalProducts||0}</div><div class="stat-label">${t('totalProducts')}</div></div>
            <div class="stat-card"><div class="stat-num">${dash?.todaySales||0}</div><div class="stat-label">${t('todaySales')}</div></div>
            <div class="stat-card"><div class="stat-num">${dash?.lowStock||0}</div><div class="stat-label">${t('lowStock')}</div></div>
            <div class="stat-card" style="background:#fff5e6;"><div class="stat-num" style="color:#b47c48;">${dash?.totalDebt||0}</div><div class="stat-label">${t('totalDebt')}</div></div>
            <div class="stat-card" style="background:#fff5e6;"><div class="stat-num" style="color:#b47c48;">${dash?.debtOrders||0}</div><div class="stat-label">${t('debtOrders')}</div></div>
        </div>
        <h4>${t('manageOrders')}</h4>
        ${(dash?.recentOrders||[]).map(o => `<div class="order-card"><div><strong>#${o.invoice||o.id}</strong><br><span class="text-muted">${o.customerName} | ${o.date}</span></div><div>${o.total} XOF</div></div>`).join('')||`<div class="empty-state">${t('noOrders')}</div>`}
        <div style="margin-top:2rem;padding-top:1.5rem;border-top:2px solid #eee2d6;">
            <h4 style="color:#b34a4a;"><i class="fas fa-exclamation-triangle"></i> ${lang==='fr'?'Réinitialiser les données':'إعادة تعيين البيانات'}</h4>
            <p style="font-size:0.85rem;color:#7a6b5a;margin-bottom:0.8rem;">${lang==='fr'?'Réinitialiser les produits, catégories et commandes aux valeurs par défaut':'إعادة المنتجات والأقسام والطلبات إلى الوضع الافتراضي'}</p>
            <button class="btn btn-danger btn-sm" onclick="adminResetData('products')"><i class="fas fa-box"></i> ${lang==='fr'?'Produits':'المنتجات'}</button>
            <button class="btn btn-danger btn-sm" onclick="adminResetData('categories')"><i class="fas fa-folder"></i> ${lang==='fr'?'Catégories':'الأقسام'}</button>
            <button class="btn btn-danger btn-sm" onclick="adminResetData('orders')"><i class="fas fa-trash"></i> ${lang==='fr'?'Commandes':'الطلبات'}</button>
            <button class="btn btn-danger btn-sm" onclick="adminResetData('all')" style="background:#8b0000;"><i class="fas fa-undo"></i> ${lang==='fr'?'Tout réinitialiser':'مسح الكل'}</button>
        </div>`;
    }
    else if (adminTab === 'products') content = await adminProducts();
    else if (adminTab === 'categories') content = await adminCategories();
    else if (adminTab === 'orders') content = await adminOrders();
    else if (adminTab === 'debts') content = await adminDebts();
    else if (adminTab === 'reports') content = await adminReports();
    return `<div class="admin-header"><h2><i class="fas fa-cog"></i> ${t('adminPanel')}</h2><button class="btn btn-danger" onclick="adminLogout()"><i class="fas fa-sign-out-alt"></i> ${t('logout')}</button></div>
    <div class="admin-tabs">${tabs.map(t => `<button class="tab-btn ${adminTab===t?'active-tab':''}" onclick="adminTab='${t}';render()">${tabName(t)}</button>`).join('')}</div>
    ${content}`;
}

function tabName(tab) {
    const m = { dashboard: t('dashboard'), products: t('manageProducts'), categories: t('manageCategories'), orders: t('manageOrders'), debts: t('manageDebts'), reports: t('reports') };
    return m[tab]||tab;
}

async function adminLogin() {
    const pass = document.getElementById('admin-pass')?.value;
    const r = await api('adminLogin', 'POST', { password: pass });
    if (r.success) { adminLogged = true; render(); }
    else showAlert(t('wrongPass'));
}

function adminLogout() { adminLogged = false; adminTab = 'dashboard'; navTo('home'); }

async function adminProducts() {
    const d = await api('adminProducts');
    const ps = d.products || [];
    return `<div style="margin-bottom:1rem;"><button class="btn btn-primary" onclick="adminProdForm()"><i class="fas fa-plus"></i> ${t('addProduct')}</button></div>
    <div class="table-wrap"><table><thead><tr><th>${t('image')}</th><th>${t('name')}</th><th>${t('categories')}</th><th>${t('price')}</th><th>${t('stock')}</th><th>${t('actions')}</th></tr></thead><tbody>
    ${ps.map(p => `<tr><td><img src="${p.image}" width="40" height="40" style="border-radius:8px;object-fit:cover;"></td>
    <td>${l10n(p,'name')}</td><td>${p.catId||'-'}</td><td>${p.price} XOF</td><td>${p.stock}</td>
    <td><button class="btn btn-sm" onclick="adminProdForm(${p.id})"><i class="fas fa-edit"></i></button>
    <button class="btn btn-sm btn-danger" onclick="adminDelProd(${p.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
    </tbody></table></div>`;
}

async function adminProdForm(id) {
    let p = null;
    if (id) { const d = await api('adminProducts'); p = (d.products||[]).find(x => x.id === id); }
    const cats = (await api('getCategories')).categories || [];
    const ov = document.createElement('div'); ov.className = 'form-overlay';
    ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
    const currentImg = p?.image || 'https://picsum.photos/400/500';
    ov.innerHTML = `<div class="form-card">
        <h3>${p ? t('editProduct') : t('addProduct')}</h3>
        <input id="fp-name" placeholder="${t('productName')}" value="${p?.name||''}">
        <input id="fp-name-fr" placeholder="Nom (FR)" value="${p?.name_fr||''}">
        <input id="fp-price" type="number" step="0.01" placeholder="${t('price')}" value="${p?.price||''}">
        <input id="fp-stock" type="number" placeholder="${t('stock')}" value="${p?.stock||''}">
        <textarea id="fp-desc" placeholder="${t('desc')}">${p?.desc||''}</textarea>
        <textarea id="fp-desc-fr" placeholder="Description (FR)">${p?.desc_fr||''}</textarea>

        <div class="img-upload-area">
            <div class="img-preview" id="fp-img-preview"><img src="${currentImg}" id="fp-img-show"></div>
            <div class="img-upload-btns">
                <button type="button" class="btn btn-sm" onclick="document.getElementById('fp-file-input').click()"><i class="fas fa-folder-open"></i> ${t('chooseImage')}</button>
                <button type="button" class="btn btn-sm" onclick="openCamera()"><i class="fas fa-camera"></i> ${t('camera')}</button>
                <button type="button" class="btn btn-sm btn-outline" onclick="toggleImgUrlInput()"><i class="fas fa-link"></i> ${t('link')}</button>
            </div>
            <input type="file" id="fp-file-input" accept="image/*" style="display:none" onchange="uploadImageFile(this)">
            <input id="fp-img" type="text" placeholder="أو أدخل رابط الصورة" style="display:none;margin-top:0.4rem;" value="${p?.image?.startsWith('http') ? p.image : ''}">
            <div id="fp-upload-status" style="font-size:0.85rem;color:#7a6b5a;margin-top:0.3rem;"></div>
        </div>

        <select id="fp-cat"><option value="">${lang==='fr'?'Sans catégorie':'بدون قسم'}</option>${cats.map(c => `<option value="${c.id}" ${p?.catId==c.id?'selected':''}>${l10n(c,'name')}</option>`).join('')}</select>
        <div class="form-btns"><button class="btn btn-primary" onclick="adminSaveProd(${id||0})">${t('save')}</button><button class="btn" onclick="this.closest('.form-overlay').remove()">${t('cancel')}</button></div>
    </div>`;
    document.body.appendChild(ov);
    // Auto-open URL field if current image is from URL
    if (p?.image?.startsWith('http') && !p?.image?.includes('picsum.photos')) {
        document.getElementById('fp-img').style.display = 'block';
        document.getElementById('fp-img').value = p.image;
    }
}

function toggleImgUrlInput() {
    const inp = document.getElementById('fp-img');
    inp.style.display = inp.style.display === 'none' ? 'block' : 'none';
}

async function uploadImageFile(input) {
    const file = input.files[0];
    if (!file) return;
    const status = document.getElementById('fp-upload-status');
    status.textContent = '⏳ جاري الرفع...';
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await fetch('/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
            document.getElementById('fp-img-show').src = data.url;
            document.getElementById('fp-img').value = data.url;
            document.getElementById('fp-img').style.display = 'block';
            status.textContent = '✅ تم رفع الصورة';
        } else {
            status.textContent = '❌ فشل الرفع: ' + (data.error || '');
        }
    } catch(e) {
        status.textContent = '❌ خطأ: ' + e.message;
    }
}

async function openCamera() {
    const status = document.getElementById('fp-upload-status');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const ov = document.createElement('div'); ov.className = 'form-overlay';
        ov.innerHTML = `<div class="form-card" style="text-align:center;">
            <h3>📷 التصوير</h3>
            <video id="camera-feed" autoplay playsinline style="width:100%;max-height:300px;border-radius:12px;background:#000;"></video>
            <div style="display:flex;gap:0.5rem;margin-top:1rem;justify-content:center;">
                <button class="btn btn-primary" id="capture-btn"><i class="fas fa-camera"></i> التقاط</button>
                <button class="btn btn-danger" id="camera-close-btn">إلغاء</button>
            </div>
        </div>`;
        document.body.appendChild(ov);
        const video = document.getElementById('camera-feed');
        video.srcObject = stream;
        await video.play();
        document.getElementById('capture-btn').onclick = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            stream.getTracks().forEach(t => t.stop());
            ov.remove();
            uploadBase64Image(dataUrl);
        };
        document.getElementById('camera-close-btn').onclick = () => {
            stream.getTracks().forEach(t => t.stop());
            ov.remove();
        };
    } catch(e) {
        // Fallback: use file input with capture attribute
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.capture = 'environment';
        inp.onchange = () => uploadImageFile(inp);
        inp.click();
    }
}

async function uploadBase64Image(dataUrl) {
    const status = document.getElementById('fp-upload-status');
    status.textContent = '⏳ جاري رفع الصورة...';
    try {
        const res = await fetch('/upload-base64', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl })
        });
        const data = await res.json();
        if (data.url) {
            document.getElementById('fp-img-show').src = data.url;
            document.getElementById('fp-img').value = data.url;
            document.getElementById('fp-img').style.display = 'block';
            status.textContent = '✅ تم رفع الصورة';
        } else {
            status.textContent = '❌ فشل الرفع';
        }
    } catch(e) {
        status.textContent = '❌ خطأ: ' + e.message;
    }
}

// Also update the category form to support image upload
async function adminCatForm(id) {
    let c = null;
    if (id) { const d = await api('adminCategories'); c = (d.categories||[]).find(x => x.id === id); }
    const ov = document.createElement('div'); ov.className = 'form-overlay';
    ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
    ov.innerHTML = `<div class="form-card">
        <h3>${c ? 'Modifier' : t('addCategory')}</h3>
        <input id="fc-name" placeholder="${t('categoryName')}" value="${c?.name||''}">
        <input id="fc-name-fr" placeholder="Nom (FR)" value="${c?.name_fr||''}">
        <div class="img-upload-area" style="margin:0.5rem 0;">
            <div class="img-preview"><img id="fc-img-show" src="${c?.image||'https://picsum.photos/400/300'}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;"></div>
            <div class="img-upload-btns">
                <button type="button" class="btn btn-sm" onclick="document.getElementById('fc-file-input').click()"><i class="fas fa-folder-open"></i> اختيار</button>
                <button type="button" class="btn btn-sm" onclick="catOpenCamera()"><i class="fas fa-camera"></i> تصوير</button>
            </div>
            <input type="file" id="fc-file-input" accept="image/*" style="display:none" onchange="catUploadImage(this)">
            <input id="fc-img" type="hidden" value="${c?.image||'https://picsum.photos/400/300'}">
            <div id="fc-upload-status" style="font-size:0.85rem;color:#7a6b5a;"></div>
        </div>
        <div class="form-btns"><button class="btn btn-primary" onclick="adminSaveCat(${id||0})">${t('save')}</button><button class="btn" onclick="this.closest('.form-overlay').remove()">${t('cancel')}</button></div>
    </div>`;
    document.body.appendChild(ov);
}

function catUploadImage(input) {
    const file = input.files[0]; if (!file) return;
    const status = document.getElementById('fc-upload-status'); status.textContent = '⏳...';
    const fd = new FormData(); fd.append('file', file);
    fetch('/upload', { method: 'POST', body: fd }).then(r=>r.json()).then(d => {
        if (d.url) { document.getElementById('fc-img-show').src = d.url; document.getElementById('fc-img').value = d.url; status.textContent = '✅'; }
        else status.textContent = '❌';
    }).catch(() => status.textContent = '❌');
}

function catOpenCamera() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.capture = 'environment';
    inp.onchange = () => catUploadImage(inp); inp.click();
}

async function adminSaveCat(id) {
    const ov = document.querySelector('.form-overlay');
    const data = { id: id || 0, name: document.getElementById('fc-name')?.value, name_fr: document.getElementById('fc-name-fr')?.value, image: document.getElementById('fc-img')?.value };
    if (!data.name) return showAlert('⚠️ ' + t('categoryName'));
    await api('adminSaveCategory', 'POST', data);
    if (ov) ov.remove();
    render();
}

async function adminSaveProd(id) {
    const ov = document.querySelector('.form-overlay');
    const data = {
        id: id,
        name: document.getElementById('fp-name')?.value,
        name_fr: document.getElementById('fp-name-fr')?.value,
        price: parseFloat(document.getElementById('fp-price')?.value),
        stock: parseInt(document.getElementById('fp-stock')?.value),
        desc: document.getElementById('fp-desc')?.value,
        desc_fr: document.getElementById('fp-desc-fr')?.value,
        image: document.getElementById('fp-img')?.value,
        catId: parseInt(document.getElementById('fp-cat')?.value) || 0
    };
    if (!data.name || !data.price) return showAlert('⚠️ ' + t('productName') + ' / ' + t('price'));
    await api('adminSaveProduct', 'POST', data);
    if (ov) ov.remove();
    render();
}

async function adminDelProd(id) {
    if (!confirm(t('confirmDelete'))) return;
    await api('adminDeleteProduct', 'POST', { id });
    render();
}

async function adminCategories() {
    const cats = (await api('adminCategories')).categories || [];
    return `<div style="margin-bottom:1rem;"><button class="btn btn-primary" onclick="adminCatForm()"><i class="fas fa-plus"></i> ${t('addCategory')}</button></div>
    <div class="table-wrap"><table><thead><tr><th>${t('image')}</th><th>${t('name')}</th><th>${t('actions')}</th></tr></thead><tbody>
    ${cats.map(c => `<tr><td><img src="${c.image}" width="40" height="40" style="border-radius:8px;object-fit:cover;"></td>
    <td>${l10n(c,'name')}</td><td><button class="btn btn-sm" onclick="adminCatForm(${c.id})"><i class="fas fa-edit"></i></button>
    <button class="btn btn-sm btn-danger" onclick="adminDelCat(${c.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
    </tbody></table></div>`;
}

async function adminDelCat(id) {
    if (!confirm(t('confirmDeleteCat'))) return;
    await api('adminDeleteCategory', 'POST', { id });
    render();
}

async function adminOrders() {
    const d = await api('adminOrders', 'GET', adminOrderFilter ? { status: adminOrderFilter } : {});
    const os = d.orders || [];
    return `<div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
        <button class="btn btn-sm ${!adminOrderFilter?'btn-primary':'btn-outline'}" onclick="adminOrderFilter='';render()">${t('all')}</button>
        <button class="btn btn-sm ${adminOrderFilter==='جديد'?'btn-primary':'btn-outline'}" onclick="adminOrderFilter='${lang==='fr'?'Nouveau':'جديد'}';render()">${t('statusNew')}</button>
        <button class="btn btn-sm ${adminOrderFilter==='مكتمل'?'btn-primary':'btn-outline'}" onclick="adminOrderFilter='${lang==='fr'?'Terminé':'مكتمل'}';render()">${t('statusCompleted')}</button>
        <button class="btn btn-sm ${adminOrderFilter==='ملغي'?'btn-primary':'btn-outline'}" onclick="adminOrderFilter='${lang==='fr'?'Annulé':'ملغي'}';render()">${t('statusCancelled')}</button>
    </div>
    <div class="table-wrap"><table><thead><tr><th>${t('invoiceNum')}</th><th>${t('client')}</th><th>${t('total')}</th><th>${t('date')}</th><th>${t('statusNew')}</th><th>${t('actions')}</th></tr></thead><tbody>
    ${os.map(o => `<tr><td>${o.invoice||o.id}</td><td>${o.customerName}</td><td>${o.total} XOF</td><td>${o.date}</td>
    <td><span class="tag ${statusClass(o.status)}">${statusLabel(o.status)}</span></td>
    <td><button class="btn btn-sm" onclick='showInvoice(${JSON.stringify(o).replace(/'/g,"&#39;")})'><i class="fas fa-eye"></i></button>
    <select onchange="adminUpdStatus('${o.id}',this.value)" style="padding:0.2rem;border:2px solid #e6dbcf;border-radius:8px;">
        <option value="">${lang==='fr'?'Mettre à jour':'تحديث'}</option><option value="${lang==='fr'?'Nouveau':'جديد'}">${t('statusNew')}</option><option value="${lang==='fr'?'En cours':'قيد التجهيز'}">${t('statusProcessing')}</option>
        <option value="${lang==='fr'?'Terminé':'مكتمل'}">${t('statusCompleted')}</option><option value="${lang==='fr'?'Annulé':'ملغي'}">${t('statusCancelled')}</option>
    </select></td></tr>`).join('')}
    </tbody></table></div>`;
}

async function adminUpdStatus(id, status) {
    if (!status) return;
    await api('adminUpdateOrderStatus', 'POST', { id, status });
    render();
}

async function adminDebts() {
    const d = await api('adminDebts');
    const debts = d.debts || [];
    const totalDebt = d.totalDebt || 0;
    let html = `<div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));">
        <div class="stat-card"><div class="stat-num" style="color:#b47c48;">${totalDebt} XOF</div><div class="stat-label">${t('totalDebt')}</div></div>
        <div class="stat-card"><div class="stat-num">${debts.length}</div><div class="stat-label">${t('debtOrders')}</div></div>
    </div>`;
    if (!debts.length) return html + `<div class="empty-state">${t('noOrders')}</div>`;
    html += `<div class="table-wrap"><table><thead><tr><th>${t('invoiceNum')}</th><th>${t('client')}</th><th>${t('phone')}</th><th>${t('total')}</th><th>${t('paid')}</th><th>${t('remaining')}</th><th>${t('date')}</th><th>${t('actions')}</th></tr></thead><tbody>
    ${debts.map(o => `<tr>
        <td>${o.invoice||o.id}</td>
        <td>${o.customerName}</td>
        <td>${o.customerPhone||'-'}</td>
        <td>${o.total} XOF</td>
        <td>${o.debtPaid||0} XOF</td>
        <td style="font-weight:800;color:${(o.debtRemaining||o.total)>0?'#b34a4a':'#2a8a2a'};">${o.debtRemaining||o.total} XOF</td>
        <td>${o.date}</td>
        <td>
            <button class="btn btn-sm" onclick='showInvoice(${JSON.stringify(o).replace(/'/g,"&#39;")})'><i class="fas fa-eye"></i></button>
            ${(o.debtRemaining||o.total) > 0 ? `<button class="btn btn-sm btn-success" onclick="showDebtPayment('${o.id}')"><i class="fas fa-money-bill"></i> ${t('collect')}</button>` : ''}
        </td>
    </tr>`).join('')}
    </tbody></table></div>`;
    return html;
}

function showDebtPayment(orderId) {
    const ov = document.createElement('div'); ov.className = 'form-overlay';
    ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
    ov.innerHTML = `<div class="form-card">
        <h3>${t('debtPaymentTitle')}</h3>
        <input id="dp-amount" type="number" step="0.01" class="pos-input" placeholder="${t('debtAmount')}">
        <input id="dp-note" class="pos-input" placeholder="${t('debtNote')}">
        <div class="form-btns">
            <button class="btn btn-success" onclick="submitDebtPayment('${orderId}')"><i class="fas fa-check"></i> ${t('confirm')}</button>
            <button class="btn" onclick="this.closest('.form-overlay').remove()">${t('cancel')}</button>
        </div>
    </div>`;
    document.body.appendChild(ov);
}

async function submitDebtPayment(orderId) {
    const amount = parseFloat(document.getElementById('dp-amount')?.value);
    if (!amount || amount <= 0) return showAlert('⚠️ ' + t('debtAmount'));
    const note = document.getElementById('dp-note')?.value || '';
    await api('addDebtPayment', 'POST', { orderId, amount, note });
    document.querySelector('.form-overlay')?.remove();
    render();
    showToast(t('recordPayment'));
}

async function adminReports() {
    const d = await api('adminReports');
    return `<div class="stats-grid">
        <div class="stat-card"><div class="stat-num">${d?.totalRevenue||0}</div><div class="stat-label">${t('revenue')}</div></div>
        <div class="stat-card"><div class="stat-num">${d?.totalOrders||0}</div><div class="stat-label">${t('totalOrders')}</div></div>
        <div class="stat-card"><div class="stat-num">${d?.completedOrders||0}</div><div class="stat-label">${t('completedOrders')}</div></div>
    </div>
    <h4>${t('topProducts')}</h4>
    <div class="table-wrap"><table><thead><tr><th>#</th><th>${t('name')}</th><th>${t('quantity')}</th></tr></thead><tbody>
    ${(d?.topProducts||[]).map((tp,i) => `<tr><td>${i+1}</td><td>${tp.name}</td><td>${tp.count}</td></tr>`).join('')||'<tr><td colspan="3" class="text-center">-</td></tr>'}
    </tbody></table></div>`;
}

// ========== RESET DATA ==========
async function adminResetData(mode) {
  const msgs = {
    all: lang==='fr'?'⚠️ Réinitialiser TOUTES les données ? Cette action est irréversible !':'⚠️ مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!',
    products: lang==='fr'?'Réinitialiser les produits ?':'إعادة تعيين المنتجات؟',
    categories: lang==='fr'?'Réinitialiser les catégories ?':'إعادة تعيين الأقسام؟',
    orders: lang==='fr'?'Supprimer toutes les commandes ?':'حذف جميع الطلبات؟'
  };
  if (!confirm(msgs[mode]||msgs.all)) return;
  const r = await api('adminResetData', 'POST', { mode });
  if (r.success) { showToast(r.message||'✅ Done'); render(); }
  else showAlert('❌ ' + (r.error||'Error'));
}

// ========== TOAST ==========
function showToast(msg) {
    let t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#2c2a27;color:#fff;padding:0.8rem 1.2rem;border-radius:12px;font-weight:600;z-index:999;animation:fadeIn 0.3s;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 2000);
}

function showAlert(msg) { alert(msg); }

// ========== BIND EVENTS ==========
function bindEvents() {
    if (currentView === 'pos') setTimeout(loadPOS, 50);
    if (currentView === 'products') {
        document.getElementById('prod-search')?.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filterProducts('q', this.value);
        });
    }
}

// ========== INIT ==========
// Handle view from URL
const urlParams = new URLSearchParams(window.location.search);
const urlView = urlParams.get('view');
if (urlView) { currentView = urlView; }
// Also check URL hash
const hash = window.location.hash.replace('#', '');
if (hash && ['home','products','orders','pos','admin'].includes(hash)) currentView = hash;

(function init() {
    updateBadge();
    if (lang === 'fr') { document.getElementById('html-tag').setAttribute('dir', 'ltr'); document.getElementById('html-tag').setAttribute('lang', 'fr'); }
    translateStatic();
    render();
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active-nav'));
    const btn = document.querySelector(`.nav-link[data-view="${currentView}"]`);
    if (btn) btn.classList.add('active-nav');
    document.getElementById('hamburger-btn')?.addEventListener('click', function(e) { e.stopPropagation(); toggleNav(); });
})();
