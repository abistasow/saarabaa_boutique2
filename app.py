from flask import Flask, session, request, jsonify, send_from_directory
import json, os, time, random, uuid, sqlite3

app = Flask(__name__)
app.secret_key = os.urandom(24).hex()

DATA_DIR = 'data'
UPLOADS_DIR = os.path.join('/tmp', 'uploads') if os.environ.get('VERCEL_ENV') else 'uploads'
ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

ON_VERCEL = os.environ.get('VERCEL_ENV', '') != ''
DB_PATH = os.path.join('/tmp', 'data.db') if ON_VERCEL else os.path.join(DATA_DIR, 'data.db')

os.makedirs(UPLOADS_DIR, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    ''')
    conn.commit()
    # Seed defaults if empty
    c = conn.cursor()
    if not c.execute('SELECT COUNT(*) FROM categories').fetchone()[0]:
        for cat in [
            {"id":1,"name":"فساتين","name_fr":"Robes","image":"https://picsum.photos/id/30/400/300"},
            {"id":2,"name":"حقائب","name_fr":"Sacs","image":"https://picsum.photos/id/27/400/300"},
            {"id":3,"name":"إكسسوارات","name_fr":"Accessoires","image":"https://picsum.photos/id/36/400/300"},
            {"id":4,"name":"أحذية","name_fr":"Chaussures","image":"https://picsum.photos/id/21/400/300"},
        ]:
            c.execute('INSERT INTO categories (id, data) VALUES (?,?)', (cat['id'], json.dumps(cat, ensure_ascii=False)))
    if not c.execute('SELECT COUNT(*) FROM products').fetchone()[0]:
        for p in [
            {"id":101,"name":"فستان كوكتيل أنيق","name_fr":"Robe cocktail élégante","price":350,"desc":"فستان دانتيل فاخر بقصة أمريكية","desc_fr":"Robe en dentelle de luxe coupe américaine","stock":12,"image":"https://picsum.photos/id/30/400/500","catId":1,"featured":True,"rate":4.5},
            {"id":102,"name":"حقيبة يد جلدية","name_fr":"Sac à main en cuir","price":220,"desc":"حقيبة كلاسيكية جلد طبيعي","desc_fr":"Sac classique en cuir véritable","stock":8,"image":"https://picsum.photos/id/27/400/500","catId":2,"featured":True,"rate":4.8},
            {"id":103,"name":"بلوزة حرير","name_fr":"Chemisier en soie","price":180,"desc":"بلوزة حرير طبيعي بقصة واسعة","desc_fr":"Chemisier en soie naturelle coupe large","stock":5,"image":"https://picsum.photos/id/36/400/500","catId":1,"featured":False,"rate":4.2},
            {"id":104,"name":"ساعة أنيقة","name_fr":"Montre élégante","price":550,"desc":"ساعة جلدية فاخرة بتصميم سويسري","desc_fr":"Montre en cuir de luxe design suisse","stock":3,"image":"https://picsum.photos/id/175/400/500","catId":3,"featured":True,"rate":4.9},
            {"id":105,"name":"نظارة شمسية","name_fr":"Lunettes de soleil","price":120,"desc":"نظارة عصرية تحمي من الأشعة","desc_fr":"Lunettes modernes anti-UV","stock":15,"image":"https://picsum.photos/id/250/400/500","catId":3,"featured":False,"rate":4.0},
            {"id":106,"name":"حذاء كعب عالي","name_fr":"Talons hauts","price":280,"desc":"حذاء جلدي كلاسيكي مريح","desc_fr":"Talons en cuir classiques confortables","stock":7,"image":"https://picsum.photos/id/21/400/500","catId":4,"featured":True,"rate":4.6},
            {"id":107,"name":"عقد لؤلؤ","name_fr":"Collier de perles","price":450,"desc":"عقد لؤلؤ طبيعي فاخر","desc_fr":"Collier de perles naturelles de luxe","stock":4,"image":"https://picsum.photos/id/160/400/500","catId":3,"featured":True,"rate":4.7},
            {"id":108,"name":"حقيبة ظهر عصرية","name_fr":"Sac à dos moderne","price":190,"desc":"حقيبة ظهر جلدية أنيقة","desc_fr":"Sac à dos en cuir élégant","stock":10,"image":"https://picsum.photos/id/26/400/500","catId":2,"featured":False,"rate":4.3},
        ]:
            c.execute('INSERT OR IGNORE INTO products (id, data) VALUES (?,?)', (p['id'], json.dumps(p, ensure_ascii=False)))
    conn.commit()
    conn.close()

TABLE_MAP = {'products.json': 'products', 'categories.json': 'categories', 'orders.json': 'orders'}

def load_json(file):
    table = TABLE_MAP.get(os.path.basename(file))
    if not table:
        return []
    conn = get_db()
    rows = conn.execute(f'SELECT data FROM {table} ORDER BY id').fetchall()
    conn.close()
    return [json.loads(r['data']) for r in rows]

def save_json(file, data):
    table = TABLE_MAP.get(os.path.basename(file))
    if not table:
        return
    conn = get_db()
    conn.execute(f'DELETE FROM {table}')
    for item in data:
        item_id = str(item.get('id', item.get('invoice', item.get('name', random.randint(1,99999)))))
        conn.execute('INSERT INTO %s (id, data) VALUES (?,?)' % table, (item_id, json.dumps(item, ensure_ascii=False)))
    conn.commit()
    conn.close()

init_db()

PRODUCTS_FILE = 'data/products.json'
CATEGORIES_FILE = 'data/categories.json'
ORDERS_FILE = 'data/orders.json'

@app.route('/api', methods=['GET', 'POST'])
def api():
    action = request.args.get('action')
    if not action:
        return jsonify({'error': 'no action'})

    # ========== PUBLIC ==========
    if action == 'getProducts':
        cat = request.args.get('cat')
        search = request.args.get('search', '').lower()
        sort = request.args.get('sort', '')
        products = load_json(PRODUCTS_FILE)
        if cat and cat != 'all':
            products = [p for p in products if str(p.get('catId')) == cat]
        if search:
            products = [p for p in products if search in p['name'].lower() or search in p.get('desc', '').lower()]
        if sort == 'price_asc':
            products.sort(key=lambda p: p['price'])
        elif sort == 'price_desc':
            products.sort(key=lambda p: -p['price'])
        elif sort == 'name':
            products.sort(key=lambda p: p['name'])
        return jsonify({'products': products})

    elif action == 'getProduct':
        try: pid = int(request.args.get('id', 0))
        except: return jsonify({'error': 'invalid id'}), 400
        products = load_json(PRODUCTS_FILE)
        p = next((p for p in products if p['id'] == pid), None)
        return jsonify({'product': p}) if p else (jsonify({'error': 'not found'}), 404)

    elif action == 'getFeatured':
        products = load_json(PRODUCTS_FILE)
        return jsonify({'products': [p for p in products if p.get('featured')]})

    elif action == 'getCategories':
        return jsonify({'categories': load_json(CATEGORIES_FILE)})

    elif action == 'addToCart':
        data = request.json or {}
        cart = session.get('cart', {})
        pid = str(data.get('id', 0))
        cart[pid] = cart.get(pid, 0) + data.get('quantity', 1)
        session['cart'] = cart
        return jsonify({'success': True, 'count': sum(cart.values())})

    elif action == 'getCart':
        cart = session.get('cart', {})
        products = load_json(PRODUCTS_FILE)
        items = []
        total = 0
        for pid, qty in cart.items():
            prod = next((p for p in products if str(p['id']) == pid), None)
            if prod:
                items.append({'id': int(pid), 'name': prod['name'], 'name_fr': prod.get('name_fr', ''), 'price': prod['price'], 'qty': qty, 'image': prod.get('image', '')})
                total += prod['price'] * qty
        return jsonify({'items': items, 'total': total, 'count': sum(cart.values())})

    elif action == 'updateCart':
        data = request.json
        cart = session.get('cart', {})
        pid = str(data['id'])
        if data.get('qty', 0) <= 0:
            cart.pop(pid, None)
        else:
            cart[pid] = data['qty']
        session['cart'] = cart
        return jsonify({'success': True})

    elif action == 'checkout':
        data = request.json
        cart = session.get('cart', {})
        if not cart:
            return jsonify({'success': False, 'error': 'السلة فارغة'})
        products = load_json(PRODUCTS_FILE)
        items = []
        total = 0
        for pid, qty in cart.items():
            prod = next((p for p in products if str(p['id']) == pid), None)
            if not prod or prod['stock'] < qty:
                return jsonify({'success': False, 'error': f'المنتج {prod["name"] if prod else ""} غير متوفر'})
            items.append({'id': int(pid), 'name': prod['name'], 'name_fr': prod.get('name_fr',''), 'price': prod['price'], 'quantity': qty})
            total += prod['price'] * qty
        for pid, qty in cart.items():
            for p in products:
                if str(p['id']) == pid:
                    p['stock'] -= qty
        save_json(PRODUCTS_FILE, products)
        pay_method = data.get('payment', 'بطاقة')
        is_debt = (pay_method == 'دين')
        order = {
            'id': f"ORD{int(time.time())}{random.randint(100,999)}",
            'invoice': f"INV-{random.randint(10000,99999)}",
            'customerName': data.get('name', ''),
            'customerPhone': data.get('phone', ''),
            'customerAddress': data.get('address', ''),
            'items': items, 'total': total,
            'date': time.strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'دين' if is_debt else 'جديد',
            'payment': pay_method,
            'debtPaid': 0, 'debtRemaining': total if is_debt else 0,
            'debtPayments': []
        }
        orders = load_json(ORDERS_FILE)
        orders.insert(0, order)
        save_json(ORDERS_FILE, orders)
        session['cart'] = {}
        return jsonify({'success': True, 'order': order})

    elif action == 'getOrdersByPhone':
        phone = request.args.get('phone', '')
        orders = load_json(ORDERS_FILE)
        return jsonify({'orders': [o for o in orders if o.get('customerPhone') == phone]})

    # ========== POS ==========
    elif action == 'cashierCheckout':
        data = request.json
        items = data.get('items', [])
        if not items:
            return jsonify({'success': False, 'error': 'الفاتورة فارغة'})
        products = load_json(PRODUCTS_FILE)
        detailed, total = [], 0
        for item in items:
            prod = next((p for p in products if str(p['id']) == str(item['id'])), None)
            if not prod or prod['stock'] < item['qty']:
                return jsonify({'success': False, 'error': f'المنتج {prod["name"] if prod else ""} غير متوفر'})
            detailed.append({'id': int(item['id']), 'name': prod['name'], 'name_fr': prod.get('name_fr',''), 'price': prod['price'], 'quantity': item['qty']})
            total += prod['price'] * item['qty']
        for item in items:
            for p in products:
                if str(p['id']) == str(item['id']):
                    p['stock'] -= item['qty']
        save_json(PRODUCTS_FILE, products)
        pay_method = data.get('paymentMethod', 'نقدي')
        is_debt = (pay_method == 'دين')
        order = {
            'id': f"POS{int(time.time())}{random.randint(10,99)}",
            'invoice': f"INV-{random.randint(10000,99999)}",
            'customerName': data.get('customerName', 'زبون نقدي'),
            'customerPhone': data.get('customerPhone', ''),
            'items': detailed, 'total': total,
            'date': time.strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'دين' if is_debt else 'مكتمل',
            'payment': pay_method,
            'debtPaid': 0, 'debtRemaining': total if is_debt else 0,
            'debtPayments': []
        }
        orders = load_json(ORDERS_FILE)
        orders.insert(0, order)
        save_json(ORDERS_FILE, orders)
        return jsonify({'success': True, 'order': order})

    # ========== ADMIN ==========
    elif action == 'adminLogin':
        data = request.json
        if data.get('password') == 'adminlo1012':
            session['admin'] = True
            return jsonify({'success': True})
        return jsonify({'success': False})

    elif action == 'adminLogout':
        session.pop('admin', None)
        return jsonify({'success': True})

    if not session.get('admin'):
        return jsonify({'error': 'unauthorized'}), 401

    if action == 'adminDashboard':
        orders = load_json(ORDERS_FILE)
        products = load_json(PRODUCTS_FILE)
        total_sales = sum(o['total'] for o in orders if o.get('status') != 'ملغي')
        today = time.strftime('%Y-%m-%d')
        today_sales = sum(o['total'] for o in orders if o.get('date', '').startswith(today) and o.get('status') != 'ملغي')
        debts = [o for o in orders if o.get('payment') == 'دين' or o.get('debtRemaining', 0) > 0]
        total_debt = sum(o.get('debtRemaining', o.get('total', 0)) for o in debts)
        return jsonify({
            'totalSales': total_sales, 'totalOrders': len(orders),
            'totalProducts': len(products), 'todaySales': today_sales,
            'lowStock': len([p for p in products if p['stock'] <= 3]),
            'totalDebt': total_debt, 'debtOrders': len(debts),
            'recentOrders': orders[:5]
        })

    elif action == 'adminProducts':
        return jsonify({'products': load_json(PRODUCTS_FILE)})

    elif action == 'adminSaveProduct':
        data = request.json
        products = load_json(PRODUCTS_FILE)
        if data.get('id') and data['id'] != 0:
            idx = next((i for i, p in enumerate(products) if p['id'] == data['id']), None)
            if idx is not None:
                products[idx] = data
        else:
            data['id'] = int(time.time())
            data['featured'] = False
            data['rate'] = 0
            products.append(data)
        save_json(PRODUCTS_FILE, products)
        return jsonify({'success': True})

    elif action == 'adminDeleteProduct':
        pid = request.json.get('id')
        products = [p for p in load_json(PRODUCTS_FILE) if p['id'] != pid]
        save_json(PRODUCTS_FILE, products)
        return jsonify({'success': True})

    elif action == 'adminCategories':
        return jsonify({'categories': load_json(CATEGORIES_FILE)})

    elif action == 'adminSaveCategory':
        data = request.json
        cats = load_json(CATEGORIES_FILE)
        if data.get('id'):
            idx = next((i for i, c in enumerate(cats) if c['id'] == data['id']), None)
            if idx is not None:
                cats[idx] = data
        else:
            data['id'] = int(time.time())
            cats.append(data)
        save_json(CATEGORIES_FILE, cats)
        return jsonify({'success': True})

    elif action == 'adminDeleteCategory':
        cid = request.json.get('id')
        cats = [c for c in load_json(CATEGORIES_FILE) if c['id'] != cid]
        save_json(CATEGORIES_FILE, cats)
        return jsonify({'success': True})

    elif action == 'adminOrders':
        status = request.args.get('status', '')
        orders = load_json(ORDERS_FILE)
        if status:
            orders = [o for o in orders if o.get('status') == status]
        return jsonify({'orders': orders})

    elif action == 'adminUpdateOrderStatus':
        data = request.json
        oid = data.get('id')
        new_status = data.get('status')
        orders = load_json(ORDERS_FILE)
        for o in orders:
            if o['id'] == oid:
                o['status'] = new_status
        save_json(ORDERS_FILE, orders)
        return jsonify({'success': True})

    elif action == 'adminReports':
        orders = load_json(ORDERS_FILE)
        completed = [o for o in orders if o.get('status') != 'ملغي']
        total_revenue = sum(o['total'] for o in completed)
        products = load_json(PRODUCTS_FILE)
        # Top products
        sales_count = {}
        for o in completed:
            for item in o.get('items', []):
                sales_count[item['name']] = sales_count.get(item['name'], 0) + item.get('quantity', 1)
        top = sorted(sales_count.items(), key=lambda x: -x[1])[:10]
        return jsonify({
            'totalRevenue': total_revenue,
            'totalOrders': len(orders),
            'completedOrders': len(completed),
            'topProducts': [{'name': n, 'count': c} for n, c in top],
            'orders': orders
        })

    elif action == 'adminDebts':
        orders = load_json(ORDERS_FILE)
        debts = [o for o in orders if o.get('payment') == 'دين' or o.get('debtRemaining', 0) > 0]
        total_debt = sum(o.get('debtRemaining', o.get('total', 0)) for o in debts)
        return jsonify({'debts': debts, 'totalDebt': total_debt})

    elif action == 'addDebtPayment':
        data = request.json
        oid = data.get('orderId')
        amount = float(data.get('amount', 0))
        note = data.get('note', '')
        orders = load_json(ORDERS_FILE)
        for o in orders:
            if o['id'] == oid:
                if not o.get('debtPayments'):
                    o['debtPayments'] = []
                o['debtPayments'].append({
                    'amount': amount,
                    'date': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'note': note
                })
                o['debtPaid'] = o.get('debtPaid', 0) + amount
                o['debtRemaining'] = max(0, o.get('total', 0) - o['debtPaid'])
                if o['debtRemaining'] <= 0:
                    o['status'] = 'مكتمل'
                else:
                    o['status'] = 'دين'
        save_json(ORDERS_FILE, orders)
        return jsonify({'success': True})

    elif action == 'adminResetData':
        data = request.json or {}
        mode = data.get('mode', 'all')
        if mode in ('all', 'products'):
            save_json(PRODUCTS_FILE, [
                {"id":101,"name":"فستان كوكتيل أنيق","name_fr":"Robe cocktail élégante","price":350,"desc":"فستان دانتيل فاخر بقصة أمريكية","desc_fr":"Robe en dentelle de luxe coupe américaine","stock":12,"image":"https://picsum.photos/id/30/400/500","catId":1,"featured":True,"rate":4.5},
                {"id":102,"name":"حقيبة يد جلدية","name_fr":"Sac à main en cuir","price":220,"desc":"حقيبة كلاسيكية جلد طبيعي","desc_fr":"Sac classique en cuir véritable","stock":8,"image":"https://picsum.photos/id/27/400/500","catId":2,"featured":True,"rate":4.8},
                {"id":103,"name":"بلوزة حرير","name_fr":"Chemisier en soie","price":180,"desc":"بلوزة حرير طبيعي بقصة واسعة","desc_fr":"Chemisier en soie naturelle coupe large","stock":5,"image":"https://picsum.photos/id/36/400/500","catId":1,"featured":False,"rate":4.2},
                {"id":104,"name":"ساعة أنيقة","name_fr":"Montre élégante","price":550,"desc":"ساعة جلدية فاخرة بتصميم سويسري","desc_fr":"Montre en cuir de luxe design suisse","stock":3,"image":"https://picsum.photos/id/175/400/500","catId":3,"featured":True,"rate":4.9},
                {"id":105,"name":"نظارة شمسية","name_fr":"Lunettes de soleil","price":120,"desc":"نظارة عصرية تحمي من الأشعة","desc_fr":"Lunettes modernes anti-UV","stock":15,"image":"https://picsum.photos/id/250/400/500","catId":3,"featured":False,"rate":4.0},
                {"id":106,"name":"حذاء كعب عالي","name_fr":"Talons hauts","price":280,"desc":"حذاء جلدي كلاسيكي مريح","desc_fr":"Talons en cuir classiques confortables","stock":7,"image":"https://picsum.photos/id/21/400/500","catId":4,"featured":True,"rate":4.6},
                {"id":107,"name":"عقد لؤلؤ","name_fr":"Collier de perles","price":450,"desc":"عقد لؤلؤ طبيعي فاخر","desc_fr":"Collier de perles naturelles de luxe","stock":4,"image":"https://picsum.photos/id/160/400/500","catId":3,"featured":True,"rate":4.7},
                {"id":108,"name":"حقيبة ظهر عصرية","name_fr":"Sac à dos moderne","price":190,"desc":"حقيبة ظهر جلدية أنيقة","desc_fr":"Sac à dos en cuir élégant","stock":10,"image":"https://picsum.photos/id/26/400/500","catId":2,"featured":False,"rate":4.3},
            ])
        if mode in ('all', 'categories'):
            save_json(CATEGORIES_FILE, [
                {"id":1,"name":"فساتين","name_fr":"Robes","image":"https://picsum.photos/id/30/400/300"},
                {"id":2,"name":"حقائب","name_fr":"Sacs","image":"https://picsum.photos/id/27/400/300"},
                {"id":3,"name":"إكسسوارات","name_fr":"Accessoires","image":"https://picsum.photos/id/36/400/300"},
                {"id":4,"name":"أحذية","name_fr":"Chaussures","image":"https://picsum.photos/id/21/400/300"},
            ])
        if mode in ('all', 'orders'):
            save_json(ORDERS_FILE, [])
        return jsonify({'success': True, 'message': '✅ تم إعادة التعيين بنجاح'})

    return jsonify({'error': 'unknown action'})

@app.route('/uploads/<path:f>')
def uploaded_file(f):
    if os.path.exists(os.path.join(UPLOADS_DIR, f)):
        return send_from_directory(UPLOADS_DIR, f)
    return send_from_directory('uploads', f)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'no file'}), 400
    f = request.files['file']
    if not f or f.filename == '':
        return jsonify({'error': 'empty file'}), 400
    ext = f.filename.rsplit('.', 1)[-1].lower() if '.' in f.filename else ''
    if ext not in ALLOWED_EXT:
        return jsonify({'error': 'extension not allowed'}), 400
    name = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(UPLOADS_DIR, name)
    f.save(path)
    return jsonify({'url': f'/uploads/{name}'})

@app.route('/upload-base64', methods=['POST'])
def upload_base64():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'error': 'no image data'}), 400
    import base64, re
    img_data = data['image']
    if ';base64,' in img_data:
        meta, img_data = img_data.split(';base64,', 1)
        ext_match = re.search(r'image/(\w+)', meta)
        ext = ext_match.group(1) if ext_match else 'png'
        if ext not in ALLOWED_EXT:
            ext = 'png'
    else:
        ext = 'png'
    try:
        raw = base64.b64decode(img_data)
    except:
        return jsonify({'error': 'invalid base64'}), 400
    name = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(UPLOADS_DIR, name)
    with open(path, 'wb') as f:
        f.write(raw)
    return jsonify({'url': f'/uploads/{name}'})

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/css/<path:f>')
def css(f):
    return send_from_directory('css', f)

@app.route('/js/<path:f>')
def js(f):
    return send_from_directory('js', f)

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/download-invoice', methods=['POST'])
def download_invoice():
    data = request.json
    if not data:
        return jsonify({'error': 'no data'}), 400
    from fpdf import FPDF
    import io
    lang = data.get('lang', 'ar')
    order = data.get('order', {})
    items = order.get('items', [])
    is_rtl = lang == 'ar'

    pdf = FPDF(orientation='P', unit='mm', format='A5')
    FONT_PATH = None
    for fp in [r'C:\Windows\Fonts\arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf']:
        if os.path.exists(fp):
            FONT_PATH = fp
            break
    if FONT_PATH:
        pdf.add_font('m', '', FONT_PATH)
        bold_path = FONT_PATH.replace('.ttf', 'bd.ttf') if 'arial' in FONT_PATH else FONT_PATH
        if not os.path.exists(bold_path):
            bold_path = FONT_PATH
        pdf.add_font('m', 'B', bold_path)
    pdf.add_page()

    # Logo
    logo_path = os.path.join(UPLOADS_DIR, 'logos.png')
    if os.path.exists(logo_path):
        pdf.image(logo_path, x=pdf.w/2-15, w=30, h=15)

    # Title
    pdf.ln(18)
    pdf.set_font('m', 'B', 14)
    if is_rtl:
        pdf.cell(0, 6, 'saarabaa_boutique', new_x="LMARGIN", new_y="NEXT", align='C')
    else:
        pdf.cell(0, 6, 'saarabaa_boutique', new_x="LMARGIN", new_y="NEXT", align='C')

    pdf.ln(2)
    pdf.set_font('m', '', 8)
    info_line = f"{order.get('customerName','')} | {order.get('date','')}"
    pdf.cell(0, 4, info_line, new_x="LMARGIN", new_y="NEXT", align='C')

    pdf.set_font('m', '', 8)
    inv_label = 'N\xb0' if lang == 'fr' else '\u0631\u0642\u0645'
    pdf.cell(0, 4, f"{inv_label}: {order.get('invoice','') or order.get('id','')}", new_x="LMARGIN", new_y="NEXT", align='C')

    phone = order.get('customerPhone', '')
    if phone:
        phone_label = 'Tel' if lang == 'fr' else '\u0627\u0644\u062c\u0648\u0627\u0644'
        pdf.cell(0, 4, f"{phone_label}: {phone}", new_x="LMARGIN", new_y="NEXT", align='C')

    pdf.ln(3)
    pdf.set_draw_color(212, 175, 122)
    pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
    pdf.ln(3)

    # Table header
    pdf.set_font('m', 'B', 9)
    col_w = [12, 50, 18, 22, 22]
    if lang == 'fr':
        headers = ['#', 'Produit', 'Qte', 'Prix', 'Total']
    else:
        headers = ['#', '\u0627\u0644\u0645\u0646\u062a\u062c', '\u0627\u0644\u0643\u0645\u064a\u0629', '\u0627\u0644\u0633\u0639\u0631', '\u0627\u0644\u0645\u062c\u0645\u0648\u0639']
    pdf.set_fill_color(243, 237, 230)
    for i, h in enumerate(headers):
        pdf.cell(col_w[i], 6, h, border=1, fill=True, align='C')
    pdf.ln()

    # Table rows
    pdf.set_font('m', '', 8)
    for idx, it in enumerate(items):
        name = it.get('name_fr', '') if lang == 'fr' and it.get('name_fr') else it.get('name', it.get('item', ''))
        qty = it.get('quantity', it.get('qty', 1))
        price = it.get('price', 0)
        total = price * qty
        row = [str(idx+1), name[:28], str(qty), f"{int(price)} XOF", f"{int(total)} XOF"]
        for j, val in enumerate(row):
            pdf.cell(col_w[j], 5, val, border=1, align='C' if j != 1 else '')
        pdf.ln()

    pdf.ln(3)
    pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
    pdf.ln(3)

    # Total
    pdf.set_font('m', 'B', 11)
    total_label = 'Total' if lang == 'fr' else '\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a'
    pdf.cell(0, 6, f"{total_label}: {int(order.get('total',0))} XOF", new_x="LMARGIN", new_y="NEXT", align='C')

    # Payment method
    pdf.set_font('m', '', 8)
    pay_label = 'Paiement' if lang == 'fr' else '\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639'
    pay_method = order.get('payment', order.get('paymentMethod', 'Pay\xe9'))
    pdf.cell(0, 4, f"{pay_label}: {pay_method}", new_x="LMARGIN", new_y="NEXT", align='C')

    # Debt info
    if order.get('payment') in ('\u062f\u064a\u0646',) or order.get('debtRemaining', 0) > 0:
        pdf.ln(2)
        pdf.set_fill_color(255, 245, 230)
        paid_label = 'Pay\xe9' if lang == 'fr' else '\u0627\u0644\u0645\u062f\u0641\u0648\u0639'
        rem_label = 'Restant' if lang == 'fr' else '\u0627\u0644\u0645\u062a\u0628\u0642\u064a'
        debt_paid = int(order.get('debtPaid', 0))
        debt_rem = int(order.get('debtRemaining', order.get('total', 0)))
        pdf.cell(0, 4, f"{paid_label}: {debt_paid} XOF", new_x="LMARGIN", new_y="NEXT", align='C', fill=True)
        pdf.set_text_color(179, 74, 74)
        pdf.cell(0, 4, f"{rem_label}: {debt_rem} XOF", new_x="LMARGIN", new_y="NEXT", align='C', fill=True)
        pdf.set_text_color(0, 0, 0)

    pdf.ln(5)
    pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
    pdf.ln(2)

    # Contact
    pdf.set_font('m', '', 7)
    pdf.set_text_color(136, 136, 136)
    pdf.cell(0, 3, "221763809805  |  bayelo011@gmail.com", new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.ln(2)

    # Footer
    thank = 'Merci pour votre achat' if lang == 'fr' else '\u0634\u0643\u0631\u0627\u064b \u0644\u062a\u0633\u0648\u0642\u0643\u0645 \u0645\u0639\u0646\u0627'
    pdf.cell(0, 3, thank, new_x="LMARGIN", new_y="NEXT", align='C')

    pdf_bytes = bytes(pdf.output())
    return pdf_bytes, 200, {'Content-Type': 'application/pdf', 'Content-Disposition': f'attachment; filename=invoice-{order.get("invoice","") or order.get("id","")}.pdf'}

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1')
