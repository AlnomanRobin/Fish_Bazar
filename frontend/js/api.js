/* =====================================================
   FishBazar — API Layer (Connected to Django Backend)
   ===================================================== */

const API_MODE = 'real'; // 'mock' | 'real'
const BASE_URL = 'http://localhost:8000/api/v1';
const DELAY    = 400; // ms - simulate network

/* -------- Mock Data -------- */
const MOCK = {
  categories: [
    { id:1, name_en:'Hilsa',      name_bn:'ইলিশ',        slug:'hilsa',       icon:'🐟', count:18 },
    { id:2, name_en:'Shrimp',     name_bn:'চিংড়ি',       slug:'shrimp',      icon:'🦐', count:24 },
    { id:3, name_en:'Freshwater', name_bn:'মিঠাপানির মাছ', slug:'freshwater',  icon:'🐡', count:32 },
    { id:4, name_en:'Saltwater',  name_bn:'সামুদ্রিক',    slug:'saltwater',   icon:'🌊', count:15 },
    { id:5, name_en:'Dried Fish', name_bn:'শুঁটকি',       slug:'dried',       icon:'🐠', count:20 },
    { id:6, name_en:'Live Fish',  name_bn:'জীবন্ত মাছ',   slug:'live',        icon:'🎣', count:8  },
  ],

  sellers: [
    { id:1, shop_name:'Padma Fresh Fish',    name:'Karim Uddin',   district:'Rajshahi',    rating:4.8, total_sales:1240, is_approved:true,  joined:'2024-01-15', phone:'01711-234567' },
    { id:2, shop_name:'Cox\'s Bazar Seafood', name:'Rahim Sheikh',  district:'Cox\'s Bazar',rating:4.6, total_sales:980,  is_approved:true,  joined:'2024-02-20', phone:'01812-345678' },
    { id:3, shop_name:'Sundarban Catches',   name:'Fatema Begum',  district:'Khulna',      rating:4.9, total_sales:1560, is_approved:true,  joined:'2023-11-05', phone:'01913-456789' },
    { id:4, shop_name:'Meghna Fish House',   name:'Hasan Ali',     district:'Chandpur',    rating:4.5, total_sales:720,  is_approved:true,  joined:'2024-03-10', phone:'01614-567890' },
    { id:5, shop_name:'Sylhet River Fresh',  name:'Nusrat Jahan',  district:'Sylhet',      rating:4.7, total_sales:890,  is_approved:false, joined:'2024-08-01', phone:'01515-678901' },
    { id:6, shop_name:'Barishal Hilsa Depot',name:'Abdul Mannan',  district:'Barishal',    rating:4.4, total_sales:430,  is_approved:true,  joined:'2024-05-18', phone:'01716-789012' },
  ],

  products: [
    { id:1,  name_en:'Hilsa Fish (Ilish)',     name_bn:'ইলিশ মাছ',          slug:'hilsa-ilish',       category_id:1, seller_id:1, price_per_kg:1200, stock_kg:45.5, region:'Padma River',    freshness_hours:12, cleaning_options:['whole','cleaned','fillet'], rating:4.9, reviews:234, img:'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80', is_featured:true, description:'Premium Padma Hilsa, the king of fish. Caught fresh from the Padma River every morning. Rich in omega-3 fatty acids.' },
    { id:2,  name_en:'Tiger Shrimp',           name_bn:'বাগদা চিংড়ি',        slug:'tiger-shrimp',      category_id:2, seller_id:2, price_per_kg:950,  stock_kg:28.0, region:'Bay of Bengal',  freshness_hours:8,  cleaning_options:['whole','cleaned'],          rating:4.7, reviews:189, img:'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80', is_featured:true, description:'Large tiger shrimp from the Bay of Bengal. Perfect for curries and grilling.' },
    { id:3,  name_en:'Rohu Fish',              name_bn:'রুই মাছ',            slug:'rohu-fish',         category_id:3, seller_id:1, price_per_kg:280,  stock_kg:65.0, region:'Padma River',    freshness_hours:18, cleaning_options:['whole','cleaned'],          rating:4.5, reviews:312, img:'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', is_featured:true, description:'Fresh Rohu from Padma River. Popular in Bengali households, great for curries.' },
    { id:4,  name_en:'Catla Fish',             name_bn:'কাতলা মাছ',           slug:'catla-fish',        category_id:3, seller_id:3, price_per_kg:320,  stock_kg:42.5, region:'Meghna River',   freshness_hours:16, cleaning_options:['whole','cleaned'],          rating:4.6, reviews:198, img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', is_featured:false, description:'Large Catla fish, full of flavor. Excellent for traditional Bengali recipes.' },
    { id:5,  name_en:'King Prawn',             name_bn:'গলদা চিংড়ি',         slug:'king-prawn',        category_id:2, seller_id:3, price_per_kg:1100, stock_kg:18.5, region:'Sundarban',      freshness_hours:10, cleaning_options:['whole','cleaned'],          rating:4.8, reviews:145, img:'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80', is_featured:true, description:'Giant freshwater prawns from Sundarban. Sweet, succulent, and a true delicacy.' },
    { id:6,  name_en:'Small Hilsa (Jatka)',    name_bn:'জাটকা ইলিশ',         slug:'jatka-hilsa',       category_id:1, seller_id:6, price_per_kg:600,  stock_kg:30.0, region:'Barishal',       freshness_hours:14, cleaning_options:['whole'],                    rating:4.3, reviews:87,  img:'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80', is_featured:false, description:'Small hilsa fish from Barishal. Great taste at an affordable price.' },
    { id:7,  name_en:'Dried Hilsa (Ilish Shutki)', name_bn:'ইলিশ শুঁটকি',  slug:'ilish-shutki',      category_id:5, seller_id:4, price_per_kg:2400, stock_kg:12.0, region:'Chandpur',       freshness_hours:8760, cleaning_options:['whole'],                   rating:4.7, reviews:156, img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', is_featured:true, description:'Sun-dried hilsa, a traditional Bangladeshi delicacy with intense flavor.' },
    { id:8,  name_en:'Tilapia Fish',           name_bn:'তেলাপিয়া মাছ',       slug:'tilapia',           category_id:3, seller_id:4, price_per_kg:180,  stock_kg:80.0, region:'Dhaka',          freshness_hours:24, cleaning_options:['whole','cleaned','fillet'], rating:4.2, reviews:267, img:'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', is_featured:false, description:'Farm-raised tilapia, affordable and nutritious. Good for everyday cooking.' },
    { id:9,  name_en:'Pomfret',                name_bn:'রূপচাঁদা মাছ',        slug:'pomfret',           category_id:4, seller_id:2, price_per_kg:750,  stock_kg:22.0, region:'Bay of Bengal',  freshness_hours:10, cleaning_options:['whole','cleaned'],          rating:4.6, reviews:178, img:'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600&q=80', is_featured:true, description:'Silver pomfret from Bay of Bengal. A prized sea fish with delicious white flesh.' },
    { id:10, name_en:'Pangash Fish',           name_bn:'পাঙ্গাশ মাছ',         slug:'pangash',           category_id:3, seller_id:1, price_per_kg:140,  stock_kg:95.0, region:'Mymensingh',     freshness_hours:20, cleaning_options:['whole','cleaned','fillet'], rating:4.0, reviews:421, img:'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', is_featured:false, description:'Popular and affordable Pangash. Great for curries and fry preparations.' },
    { id:11, name_en:'Crab (Mud Crab)',        name_bn:'কাঁকড়া',             slug:'mud-crab',          category_id:4, seller_id:3, price_per_kg:850,  stock_kg:15.0, region:'Sundarban',      freshness_hours:6,  cleaning_options:['whole'],                    rating:4.8, reviews:132, img:'https://images.unsplash.com/photo-1559056961-1f4a1a8a8e5e?w=600&q=80', is_featured:false, description:'Live mud crabs from the Sundarban mangroves. Exceptional taste.' },
    { id:12, name_en:'Boal Fish',              name_bn:'বোয়াল মাছ',           slug:'boal-fish',         category_id:3, seller_id:4, price_per_kg:380,  stock_kg:35.0, region:'Jamuna River',   freshness_hours:16, cleaning_options:['whole','cleaned'],          rating:4.5, reviews:98,  img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', is_featured:false, description:'Boal fish from the Jamuna River, a prized freshwater catfish.' },
    { id:13, name_en:'Dried Shrimp (Shutki)', name_bn:'শুকনা চিংড়ি শুঁটকি',  slug:'dried-shrimp',      category_id:5, seller_id:2, price_per_kg:1800, stock_kg:8.0,  region:'Cox\'s Bazar',   freshness_hours:8760, cleaning_options:['whole'],                   rating:4.5, reviews:89,  img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', is_featured:false, description:'Sun-dried shrimp from Cox\'s Bazar, perfect for flavoring dishes.' },
    { id:14, name_en:'Koi Fish (Live)',        name_bn:'কই মাছ (জীবন্ত)',      slug:'live-koi',          category_id:6, seller_id:4, price_per_kg:450,  stock_kg:20.0, region:'Dhaka',          freshness_hours:72, cleaning_options:['whole','cleaned'],          rating:4.7, reviews:167, img:'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', is_featured:false, description:'Live climbing perch (Koi), delivered alive in oxygenated water bags.' },
    { id:15, name_en:'Tuna Steak',             name_bn:'টুনা মাছ',            slug:'tuna-steak',        category_id:4, seller_id:2, price_per_kg:680,  stock_kg:25.0, region:'Bay of Bengal',  freshness_hours:12, cleaning_options:['fillet'],                   rating:4.6, reviews:143, img:'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80', is_featured:false, description:'Fresh yellowfin tuna from the deep waters of the Bay of Bengal.' },
    { id:16, name_en:'Magur (Catfish)',        name_bn:'মাগুর মাছ',           slug:'magur-catfish',     category_id:3, seller_id:5, price_per_kg:520,  stock_kg:18.0, region:'Sylhet',         freshness_hours:18, cleaning_options:['whole','cleaned'],          rating:4.4, reviews:76,  img:'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', is_featured:false, description:'Fresh Magur catfish from Sylhet haor region, known for its medicinal value.' },
    { id:17, name_en:'Mrigel Fish',            name_bn:'মৃগেল মাছ',           slug:'mrigel-fish',       category_id:3, seller_id:6, price_per_kg:260,  stock_kg:55.0, region:'Barishal',       freshness_hours:20, cleaning_options:['whole','cleaned'],          rating:4.3, reviews:112, img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', is_featured:false, description:'Mrigel carp from Barishal, a popular everyday fish.' },
    { id:18, name_en:'Snapper (Lal Puti)',     name_bn:'লাল পুঁটি',           slug:'red-snapper',       category_id:4, seller_id:2, price_per_kg:490,  stock_kg:30.0, region:'Bay of Bengal',  freshness_hours:10, cleaning_options:['whole','cleaned'],          rating:4.5, reviews:95,  img:'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600&q=80', is_featured:false, description:'Red snapper from the Bay of Bengal with firm, white flesh.' },
    { id:19, name_en:'Pabda Fish',             name_bn:'পাবদা মাছ',           slug:'pabda-fish',        category_id:3, seller_id:3, price_per_kg:680,  stock_kg:22.0, region:'Khulna',         freshness_hours:14, cleaning_options:['whole','cleaned'],          rating:4.8, reviews:203, img:'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', is_featured:true, description:'Prized Pabda fish from Khulna, known for its soft texture and unique flavor.' },
    { id:20, name_en:'Tengra Fish',            name_bn:'টেংরা মাছ',           slug:'tengra-fish',       category_id:3, seller_id:4, price_per_kg:420,  stock_kg:28.0, region:'Comilla',        freshness_hours:16, cleaning_options:['whole'],                    rating:4.6, reviews:134, img:'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', is_featured:false, description:'Small but flavorful Tengra fish, perfect for mustard curry.' },
    { id:21, name_en:'Dried Bombay Duck (Loitta Shutki)', name_bn:'লইট্যা শুঁটকি', slug:'loitta-shutki', category_id:5, seller_id:2, price_per_kg:1200, stock_kg:10.0, region:'Cox\'s Bazar', freshness_hours:8760, cleaning_options:['whole'], rating:4.6, reviews:88, img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', is_featured:false, description:'Loitta Shutki, dried Bombay duck from Cox\'s Bazar, a popular dry fish.' },
    { id:22, name_en:'Squid (Shingara Mach)',  name_bn:'স্কুইড',              slug:'squid',             category_id:4, seller_id:2, price_per_kg:580,  stock_kg:17.0, region:'Bay of Bengal',  freshness_hours:10, cleaning_options:['whole','cleaned'],          rating:4.4, reviews:76,  img:'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80', is_featured:false, description:'Fresh squid from the Bay of Bengal, great for stir-fry and curries.' },
    { id:23, name_en:'Chital Fish',            name_bn:'চিতল মাছ',            slug:'chital-fish',       category_id:3, seller_id:3, price_per_kg:750,  stock_kg:14.0, region:'Sundarban',      freshness_hours:16, cleaning_options:['whole','cleaned'],          rating:4.7, reviews:109, img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', is_featured:false, description:'Chital fish from Sundarban, famous for its unique oval scales.' },
    { id:24, name_en:'Shol Fish',              name_bn:'শোল মাছ',             slug:'shol-fish',         category_id:3, seller_id:1, price_per_kg:580,  stock_kg:25.0, region:'Padma River',    freshness_hours:18, cleaning_options:['whole','cleaned'],          rating:4.5, reviews:91,  img:'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', is_featured:false, description:'Snakehead fish (Shol) from Padma, known for rapid wound healing properties.' },
    { id:25, name_en:'Golsha (Gulsha Tengra)', name_bn:'গুলশা টেংরা',         slug:'gulsha-tengra',     category_id:3, seller_id:5, price_per_kg:550,  stock_kg:20.0, region:'Sylhet',         freshness_hours:14, cleaning_options:['whole'],                    rating:4.6, reviews:117, img:'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', is_featured:false, description:'Gulsha Tengra from Sylhet haors, a delicacy with amazing taste.' },
  ],

  orders: [
    { id:'ORD-2024-001', customer_id:1, status:'delivered', total:3600, items:[{product_id:1, qty_kg:2, price:1200},{product_id:3, qty_kg:3, price:280}], district:'Dhaka', address:'45 Mirpur Road, Dhaka 1216', date:'2024-08-10', payment:'cod' },
    { id:'ORD-2024-002', customer_id:1, status:'shipped',   total:1900, items:[{product_id:2, qty_kg:2, price:950}], district:'Dhaka', address:'45 Mirpur Road, Dhaka 1216', date:'2024-08-18', payment:'cod' },
    { id:'ORD-2024-003', customer_id:2, status:'pending',   total:2200, items:[{product_id:9, qty_kg:2, price:750},{product_id:5, qty_kg:1, price:1100}], district:'Chittagong', address:'12 Agrabad, Chittagong', date:'2024-08-22', payment:'cod' },
  ],

  districts: [
    {id:1, name:'Dhaka',       name_bn:'ঢাকা',      charge:60,  days:1},
    {id:2, name:'Chittagong',  name_bn:'চট্টগ্রাম',  charge:100, days:2},
    {id:3, name:'Rajshahi',    name_bn:'রাজশাহী',    charge:120, days:2},
    {id:4, name:'Sylhet',      name_bn:'সিলেট',      charge:130, days:2},
    {id:5, name:'Khulna',      name_bn:'খুলনা',      charge:120, days:2},
    {id:6, name:'Barishal',    name_bn:'বরিশাল',     charge:140, days:3},
    {id:7, name:'Rangpur',     name_bn:'রংপুর',      charge:150, days:3},
    {id:8, name:'Mymensingh',  name_bn:'ময়মনসিংহ',  charge:90,  days:1},
    {id:9, name:"Cox's Bazar", name_bn:'কক্সবাজার',  charge:160, days:3},
    {id:10,name:'Comilla',     name_bn:'কুমিল্লা',   charge:80,  days:1},
    {id:11,name:'Chandpur',    name_bn:'চাঁদপুর',    charge:90,  days:2},
    {id:12,name:'Gazipur',     name_bn:'গাজীপুর',    charge:60,  days:1},
    {id:13,name:'Narayanganj', name_bn:'নারায়ণগঞ্জ', charge:60,  days:1},
    {id:14,name:'Tangail',     name_bn:'টাঙ্গাইল',   charge:80,  days:1},
    {id:15,name:'Bogra',       name_bn:'বগুড়া',      charge:130, days:2},
    {id:16,name:'Jessore',     name_bn:'যশোর',       charge:130, days:2},
    {id:17,name:'Dinajpur',    name_bn:'দিনাজপুর',   charge:160, days:3},
    {id:18,name:'Pabna',       name_bn:'পাবনা',      charge:120, days:2},
    {id:19,name:'Noakhali',    name_bn:'নোয়াখালী',   charge:120, days:2},
    {id:20,name:'Feni',        name_bn:'ফেনী',       charge:110, days:2},
  ],

  customers: [
    { id:1, name:'Arif Rahman',   phone:'01711-111111', email:'arif@example.com', district:'Dhaka',      orders:12, spent:24500, joined:'2024-01-10', is_active:true },
    { id:2, name:'Sadia Islam',   phone:'01812-222222', email:'sadia@example.com', district:'Chittagong', orders:5,  spent:8900,  joined:'2024-03-22', is_active:true },
    { id:3, name:'Kabir Hossain', phone:'01913-333333', email:'kabir@example.com', district:'Sylhet',     orders:8,  spent:16200, joined:'2024-02-14', is_active:true },
    { id:4, name:'Nadia Begum',   phone:'01614-444444', email:'nadia@example.com', district:'Rajshahi',   orders:3,  spent:4600,  joined:'2024-06-05', is_active:false },
  ],

  adminStats: {
    total_revenue: 985420,
    orders_today: 48,
    active_sellers: 5,
    total_customers: 1240,
    pending_seller_approvals: 2,
    monthly_revenue: [45000,62000,58000,75000,89000,92000,78000,95000,110000,98000,115000,120000],
    orders_by_status: { pending:12, confirmed:18, shipped:25, delivered:180, cancelled:8 },
  }
};

/* -------- Helpers -------- */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function mockOr(realFn, mockData) {
  if (API_MODE === 'real') {
    try {
      const res = await realFn();
      if (res && res.networkError) {
        console.warn('[FishBazar API] Backend unreachable, falling back to local data.');
        return { ok: true, data: mockData, offlineFallback: true };
      }
      return res;
    } catch (err) {
      console.warn('[FishBazar API] Request failed, falling back to local data:', err);
      return { ok: true, data: mockData, offlineFallback: true };
    }
  }
  await delay(DELAY);
  return { ok: true, data: mockData };
}

function getHeaders() {
  const token = localStorage.getItem('fb_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function realRequest(method, path, body=null) {
  try {
    const res = await fetch(BASE_URL + path, {
      method,
      headers: getHeaders(),
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message, networkError: true };
  }
}

/* -------- Public API Functions -------- */

// Categories
export async function fetchCategories() {
  return mockOr(() => realRequest('GET', '/categories/'), MOCK.categories);
}

// Products
export async function fetchProducts(filters = {}) {
  return mockOr(() => realRequest('GET', `/products/?${new URLSearchParams(filters)}`),
    (() => {
      let list = [...MOCK.products];
      const seller = MOCK.sellers.reduce((m,s) => ({...m,[s.id]:s}), {});
      const cat    = MOCK.categories.reduce((m,c) => ({...m,[c.id]:c}), {});
      if (filters.category) list = list.filter(p => p.category_id === +filters.category);
      if (filters.search)   list = list.filter(p => p.name_en.toLowerCase().includes(filters.search.toLowerCase()) || p.name_bn.includes(filters.search));
      if (filters.min_price) list = list.filter(p => p.price_per_kg >= +filters.min_price);
      if (filters.max_price) list = list.filter(p => p.price_per_kg <= +filters.max_price);
      if (filters.seller_id) list = list.filter(p => p.seller_id === +filters.seller_id);
      if (filters.featured)  list = list.filter(p => p.is_featured);
      if (filters.sort === 'price_asc')  list.sort((a,b)=>a.price_per_kg-b.price_per_kg);
      if (filters.sort === 'price_desc') list.sort((a,b)=>b.price_per_kg-a.price_per_kg);
      if (filters.sort === 'rating')     list.sort((a,b)=>b.rating-a.rating);
      if (filters.sort === 'newest')     list.sort((a,b)=>b.id-a.id);
      return {
        count: list.length,
        results: list.map(p => ({ ...p, category: cat[p.category_id], seller: seller[p.seller_id] }))
      };
    })()
  );
}

export async function fetchProduct(slug) {
  return mockOr(() => realRequest('GET', `/products/${slug}/`),
    (() => {
      const p = MOCK.products.find(p => p.slug === slug || String(p.id) === String(slug));
      if (!p) return null;
      const seller = MOCK.sellers.find(s=>s.id===p.seller_id);
      const cat    = MOCK.categories.find(c=>c.id===p.category_id);
      const related = MOCK.products.filter(r=>r.category_id===p.category_id && r.id!==p.id).slice(0,4).map(r=>({...r, seller:MOCK.sellers.find(s=>s.id===r.seller_id)}));
      return { ...p, category: cat, seller, related };
    })()
  );
}

// Districts
export async function fetchDistricts() {
  return mockOr(() => realRequest('GET', '/districts/'), MOCK.districts);
}

// Cart (session-based on frontend)
export function getCart() {
  const c = localStorage.getItem('fb_cart');
  return c ? JSON.parse(c) : [];
}
export function saveCart(cart) {
  localStorage.setItem('fb_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

// Orders
export async function placeOrder(orderData) {
  return mockOr(() => realRequest('POST', '/orders/', orderData),
    (() => {
      const newOrder = {
        id: 'ORD-2024-' + Math.floor(Math.random()*9000+1000),
        status: 'pending',
        customer_id: 1,
        date: new Date().toISOString().split('T')[0],
        ...orderData
      };
      MOCK.orders.unshift(newOrder);
      try {
        const stored = JSON.parse(localStorage.getItem('fb_custom_orders') || '[]');
        stored.unshift(newOrder);
        localStorage.setItem('fb_custom_orders', JSON.stringify(stored));
      } catch(e) {}
      return newOrder;
    })()
  );
}

export async function fetchMyOrders() {
  return mockOr(() => realRequest('GET', '/orders/'),
    (() => {
      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem('fb_custom_orders') || '[]');
      } catch(e) {}
      const combined = [...custom, ...MOCK.orders];
      const seen = new Set();
      return combined.filter(o => {
        if (seen.has(o.id)) return false;
        seen.add(o.id);
        return true;
      });
    })()
  );
}

export async function fetchOrderDetail(id) {
  return mockOr(() => realRequest('GET', `/orders/${id}/`),
    (() => {
      let custom = [];
      try {
        custom = JSON.parse(localStorage.getItem('fb_custom_orders') || '[]');
      } catch(e) {}
      const combined = [...custom, ...MOCK.orders];
      return combined.find(o => o.id === id);
    })()
  );
}

// Initialize custom products from localStorage
try {
  const savedCustom = JSON.parse(localStorage.getItem('fb_custom_products') || '[]');
  if (Array.isArray(savedCustom) && savedCustom.length > 0) {
    savedCustom.forEach(cp => {
      if (!MOCK.products.some(p => p.id === cp.id || p.slug === cp.slug)) {
        MOCK.products.unshift(cp);
      }
    });
  }
} catch(e) {}

// ----- Seller APIs -----
export async function fetchSellerProducts(sellerId) {
  const q = sellerId ? `?seller_id=${sellerId}` : '';
  return mockOr(() => realRequest('GET', `/seller/products/${q}`),
    MOCK.products.filter(p=>p.seller_id===(sellerId||1))
      .map(p=>({...p, category:MOCK.categories.find(c=>c.id===p.category_id)}))
  );
}

export async function createProduct(data) {
  return mockOr(() => realRequest('POST', '/seller/products/', data),
    (() => {
      const slug = (data.name_en || 'fish')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
      const newProduct = {
        id: Date.now(),
        slug: slug,
        rating: 5.0,
        reviews: 0,
        seller_id: 1,
        is_featured: false,
        img: data.img || 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80',
        ...data
      };
      MOCK.products.unshift(newProduct);
      try {
        const stored = JSON.parse(localStorage.getItem('fb_custom_products') || '[]');
        stored.unshift(newProduct);
        localStorage.setItem('fb_custom_products', JSON.stringify(stored));
      } catch(e) {}
      return newProduct;
    })()
  );
}

export async function updateProduct(slug, data) {
  return mockOr(() => realRequest('PUT', `/seller/products/${slug}/`, data),
    (() => {
      const idx = MOCK.products.findIndex(p => p.slug === slug);
      if (idx !== -1) {
        MOCK.products[idx] = { ...MOCK.products[idx], ...data };
      }
      try {
        const stored = JSON.parse(localStorage.getItem('fb_custom_products') || '[]');
        const sIdx = stored.findIndex(p => p.slug === slug);
        if (sIdx !== -1) {
          stored[sIdx] = { ...stored[sIdx], ...data };
          localStorage.setItem('fb_custom_products', JSON.stringify(stored));
        }
      } catch(e) {}
      return { slug, ...data };
    })()
  );
}

export async function deleteProduct(slug) {
  return mockOr(() => realRequest('DELETE', `/seller/products/${slug}/`),
    (() => {
      const idx = MOCK.products.findIndex(p => p.slug === slug);
      if (idx !== -1) MOCK.products.splice(idx, 1);
      try {
        const stored = JSON.parse(localStorage.getItem('fb_custom_products') || '[]');
        const filtered = stored.filter(p => p.slug !== slug);
        localStorage.setItem('fb_custom_products', JSON.stringify(filtered));
      } catch(e) {}
      return { success: true };
    })()
  );
}

export async function fetchSellerOrders(sellerId) {
  const q = sellerId ? `?seller_id=${sellerId}` : '';
  return mockOr(() => realRequest('GET', `/seller/orders/${q}`),
    MOCK.orders
      .filter(o => o.items.some(i => MOCK.products.find(p=>p.id===i.product_id)?.seller_id===(sellerId||1)))
      .map(o => ({
        ...o,
        customer: MOCK.customers.find(c=>c.id===o.customer_id),
        items: o.items.map(i=>({...i, product: MOCK.products.find(p=>p.id===i.product_id)}))
      }))
  );
}

export async function fetchSellerStats(sellerId) {
  const q = sellerId ? `?seller_id=${sellerId}` : '';
  return mockOr(() => realRequest('GET', `/seller/stats/${q}`), {
    total_earnings: 184500,
    orders_this_month: 38,
    active_listings: MOCK.products.filter(p=>p.seller_id===(sellerId||1)).length,
    pending_orders: 5,
    monthly_earnings: [8000,12000,15000,18000,22000,28000,20000,25000,32000,28000,35000,42000],
    top_products: MOCK.products.filter(p=>p.seller_id===(sellerId||1)).slice(0,3),
  });
}

export async function updateOrderStatus(orderId, status) {
  return mockOr(() => realRequest('PATCH', `/seller/orders/${orderId}/`, { status }),
    { id: orderId, status }
  );
}

// ----- Admin APIs -----
export async function fetchAdminStats() {
  return mockOr(() => realRequest('GET', '/admin/stats/'), MOCK.adminStats);
}

export async function fetchAdminSellers() {
  return mockOr(() => realRequest('GET', '/admin/sellers/'), MOCK.sellers);
}

export async function approveSeller(sellerId) {
  return mockOr(() => realRequest('PATCH', `/admin/sellers/${sellerId}/`, { is_approved: true }),
    { id: sellerId, is_approved: true }
  );
}

export async function suspendSeller(sellerId) {
  return mockOr(() => realRequest('PATCH', `/admin/sellers/${sellerId}/`, { is_approved: false }),
    { id: sellerId, is_approved: false }
  );
}

export async function fetchAdminCustomers() {
  return mockOr(() => realRequest('GET', '/admin/customers/'), MOCK.customers);
}

export async function fetchAdminOrders() {
  return mockOr(() => realRequest('GET', '/admin/orders/'),
    MOCK.orders.map(o=>({
      ...o,
      customer: MOCK.customers.find(c=>c.id===o.customer_id),
      items: o.items.map(i=>({...i, product: MOCK.products.find(p=>p.id===i.product_id)}))
    }))
  );
}

export async function fetchAdminProducts() {
  return mockOr(() => realRequest('GET', '/admin/products/'),
    MOCK.products.map(p=>({
      ...p,
      category: MOCK.categories.find(c=>c.id===p.category_id),
      seller: MOCK.sellers.find(s=>s.id===p.seller_id)
    }))
  );
}

// Search suggestions (names)
export async function fetchSearchSuggestions(query, limit = 8) {
  return mockOr(() => realRequest('GET', `/products/suggest/?q=${encodeURIComponent(query)}`),
    (() => {
      if (!query || typeof query !== 'string') return [];
      const q = query.trim().toLowerCase();
      const seen = new Set();
      const buckets = { exact: [], starts: [], contains: [], related: [] };

      // maps
      const catMap = MOCK.categories.reduce((m,c)=>({...m,[c.id]:c}),{});

      for (const p of MOCK.products) {
        if (seen.has(p.slug)) continue;
        const nameEn = (p.name_en || '').toLowerCase();
        const nameBn = (p.name_bn || '').toLowerCase();
        const slug = (p.slug || '').toLowerCase();
        let placed = false;

        if (nameEn === q || nameBn === q) {
          buckets.exact.push(p); placed = true;
        }
        if (!placed && (nameEn.startsWith(q) || nameBn.startsWith(q) || slug.startsWith(q))) {
          buckets.starts.push(p); placed = true;
        }
        if (!placed && (nameEn.includes(q) || nameBn.includes(q) || slug.includes(q))) {
          buckets.contains.push(p); placed = true;
        }
        // related: category match
        if (!placed) {
          const cat = catMap[p.category_id];
          if (cat && (cat.name_en.toLowerCase().includes(q) || (cat.name_bn && cat.name_bn.includes(q)))) {
            buckets.related.push(p); placed = true;
          }
        }
        if (placed) seen.add(p.slug);
      }

      // combine in priority order and map to lighter result
      const combined = [...buckets.exact, ...buckets.starts, ...buckets.contains, ...buckets.related].slice(0, limit);
      return combined.map(p => ({ id: p.id, name_en: p.name_en, name_bn: p.name_bn, slug: p.slug, img: p.img, category: (catMap[p.category_id] && catMap[p.category_id].name_en) || '', price: p.price_per_kg }));
    })()
  );
}

// Auth
export async function loginUser(identifier, password) {
  return mockOr(() => realRequest('POST', '/auth/login/', { identifier, password }),
    (() => {
      const mockUsers = [
        { id:1, name:'Arif Rahman',   role:'customer', token:'mock-customer-jwt-token', phone:'01711-111111', email:'arif@example.com' },
        { id:2, name:'Karim Uddin',   role:'seller',   token:'mock-seller-jwt-token',   phone:'01711-234567', email:'karim@example.com', seller_id:1 },
        { id:3, name:'Admin User',    role:'admin',    token:'mock-admin-jwt-token',     phone:'01711-333333', email:'admin@example.com' },
      ];
      const str = (identifier || '').toLowerCase();
      let role = 'customer';
      if (str.includes('seller') || str.includes('karim')) role = 'seller';
      else if (str.includes('admin')) role = 'admin';
      else if (str.includes('customer') || str.includes('arif')) role = 'customer';

      const found = mockUsers.find(u =>
        (u.email && u.email.toLowerCase() === str) ||
        (u.role === role)
      );

      const user = found || {
        id: Date.now(),
        name: str.includes('@') ? str.split('@')[0] : 'User',
        role: role,
        token: 'mock-jwt-token-' + Date.now(),
        email: str.includes('@') ? str : 'user@example.com',
        phone: str.includes('@') ? '01711-000000' : str
      };
      return user;
    })()
  );
}

export async function registerUser(data) {
  return mockOr(() => realRequest('POST', '/auth/register/', data),
    { id: Date.now(), ...data, token: 'mock-new-user-jwt-token' }
  );
}

