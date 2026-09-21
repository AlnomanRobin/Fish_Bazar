from django.core.management.base import BaseCommand
from django.db import transaction
from apps.accounts.models import User
from apps.catalog.models import Category, District, Product
from apps.orders.models import Order, OrderItem

class Command(BaseCommand):
    help = 'Seeds initial marketplace data for FishBazar'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding FishBazar database...')

        # 1. Admin User
        admin_user, _ = User.objects.get_or_create(
            phone='01711-333333',
            defaults={
                'name': 'Admin User',
                'email': 'admin@example.com',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.role = 'admin'
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()

        # 2. Categories
        categories_data = [
            {'id': 1, 'name_en': 'Hilsa',      'name_bn': 'ইলিশ',        'slug': 'hilsa',       'icon': '🐟'},
            {'id': 2, 'name_en': 'Shrimp',     'name_bn': 'চিংড়ি',       'slug': 'shrimp',      'icon': '🦐'},
            {'id': 3, 'name_en': 'Freshwater', 'name_bn': 'মিঠাপানির মাছ', 'slug': 'freshwater',  'icon': '🐡'},
            {'id': 4, 'name_en': 'Saltwater',  'name_bn': 'সামুদ্রিক',    'slug': 'saltwater',   'icon': '🌊'},
            {'id': 5, 'name_en': 'Dried Fish', 'name_bn': 'শুঁটকি',       'slug': 'dried',       'icon': '🐠'},
            {'id': 6, 'name_en': 'Live Fish',  'name_bn': 'জীবন্ত মাছ',   'slug': 'live',        'icon': '🎣'},
        ]
        cat_map = {}
        for c in categories_data:
            cat, _ = Category.objects.update_or_create(
                id=c['id'],
                defaults={'name_en': c['name_en'], 'name_bn': c['name_bn'], 'slug': c['slug'], 'icon': c['icon']}
            )
            cat_map[c['id']] = cat

        # 3. Districts
        districts_data = [
            {'id':1, 'name':'Dhaka',       'name_bn':'ঢাকা',      'charge':60,  'days':1},
            {'id':2, 'name':'Chittagong',  'name_bn':'চট্টগ্রাম',  'charge':100, 'days':2},
            {'id':3, 'name':'Rajshahi',    'name_bn':'রাজশাহী',    'charge':120, 'days':2},
            {'id':4, 'name':'Sylhet',      'name_bn':'সিলেট',      'charge':130, 'days':2},
            {'id':5, 'name':'Khulna',      'name_bn':'খুলনা',      'charge':120, 'days':2},
            {'id':6, 'name':'Barishal',    'name_bn':'বরিশাল',     'charge':140, 'days':3},
            {'id':7, 'name':'Rangpur',     'name_bn':'রংপুর',      'charge':150, 'days':3},
            {'id':8, 'name':'Mymensingh',  'name_bn':'ময়মনসিংহ',  'charge':90,  'days':1},
            {'id':9, 'name':"Cox's Bazar", 'name_bn':'কক্সবাজার',  'charge':160, 'days':3},
            {'id':10,'name':'Comilla',     'name_bn':'কুমিল্লা',   'charge':80,  'days':1},
            {'id':11,'name':'Chandpur',    'name_bn':'চাঁদপুর',    'charge':90,  'days':2},
            {'id':12,'name':'Gazipur',     'name_bn':'গাজীপুর',    'charge':60,  'days':1},
            {'id':13,'name':'Narayanganj', 'name_bn':'নারায়ণগঞ্জ', 'charge':60,  'days':1},
            {'id':14,'name':'Tangail',     'name_bn':'টাঙ্গাইল',   'charge':80,  'days':1},
            {'id':15,'name':'Bogra',       'name_bn':'বগুড়া',      'charge':130, 'days':2},
            {'id':16,'name':'Jessore',     'name_bn':'যশোর',       'charge':130, 'days':2},
            {'id':17,'name':'Dinajpur',    'name_bn':'দিনাজপুর',   'charge':160, 'days':3},
            {'id':18,'name':'Pabna',       'name_bn':'পাবনা',      'charge':120, 'days':2},
            {'id':19,'name':'Noakhali',    'name_bn':'নোয়াখালী',   'charge':120, 'days':2},
            {'id':20,'name':'Feni',        'name_bn':'ফেনী',       'charge':110, 'days':2},
        ]
        for d in districts_data:
            District.objects.update_or_create(
                id=d['id'],
                defaults={'name': d['name'], 'name_bn': d['name_bn'], 'charge': d['charge'], 'days': d['days']}
            )

        # 4. Sellers
        sellers_data = [
            {'id':1, 'shop_name':'Padma Fresh Fish',    'name':'Karim Uddin',   'district':'Rajshahi',    'rating':4.8, 'total_sales':1240, 'is_approved':True,  'phone':'01711-234567', 'email':'karim@example.com'},
            {'id':2, 'shop_name':"Cox's Bazar Seafood", 'name':'Rahim Sheikh',  'district':"Cox's Bazar", 'rating':4.6, 'total_sales':980,  'is_approved':True,  'phone':'01812-345678', 'email':'rahim@example.com'},
            {'id':3, 'shop_name':'Sundarban Catches',   'name':'Fatema Begum',  'district':'Khulna',      'rating':4.9, 'total_sales':1560, 'is_approved':True,  'phone':'01913-456789', 'email':'fatema@example.com'},
            {'id':4, 'shop_name':'Meghna Fish House',   'name':'Hasan Ali',     'district':'Chandpur',    'rating':4.5, 'total_sales':720,  'is_approved':True,  'phone':'01614-567890', 'email':'hasan@example.com'},
            {'id':5, 'shop_name':'Sylhet River Fresh',  'name':'Nusrat Jahan',  'district':'Sylhet',      'rating':4.7, 'total_sales':890,  'is_approved':False, 'phone':'01515-678901', 'email':'nusrat@example.com'},
            {'id':6, 'shop_name':'Barishal Hilsa Depot','name':'Abdul Mannan',  'district':'Barishal',    'rating':4.4, 'total_sales':430,  'is_approved':True,  'phone':'01716-789012', 'email':'abdul@example.com'},
        ]
        seller_map = {}
        for s in sellers_data:
            user, _ = User.objects.update_or_create(
                phone=s['phone'],
                defaults={
                    'name': s['name'],
                    'shop_name': s['shop_name'],
                    'email': s['email'],
                    'district': s['district'],
                    'role': 'seller',
                    'rating': s['rating'],
                    'total_sales': s['total_sales'],
                    'is_approved': s['is_approved']
                }
            )
            user.set_password('seller123')
            user.save()
            seller_map[s['id']] = user

        # 5. Customers
        customers_data = [
            {'id':1, 'name':'Arif Rahman',   'phone':'01711-111111', 'email':'arif@example.com',  'district':'Dhaka',      'orders':12, 'spent':24500, 'is_active':True},
            {'id':2, 'name':'Sadia Islam',   'phone':'01812-222222', 'email':'sadia@example.com', 'district':'Chittagong', 'orders':5,  'spent':8900,  'is_active':True},
            {'id':3, 'name':'Kabir Hossain', 'phone':'01913-333333', 'email':'kabir@example.com', 'district':'Sylhet',     'orders':8,  'spent':16200, 'is_active':True},
            {'id':4, 'name':'Nadia Begum',   'phone':'01614-444444', 'email':'nadia@example.com', 'district':'Rajshahi',   'orders':3,  'spent':4600,  'is_active':False},
        ]
        cust_map = {}
        for c in customers_data:
            user, _ = User.objects.update_or_create(
                phone=c['phone'],
                defaults={
                    'name': c['name'],
                    'email': c['email'],
                    'district': c['district'],
                    'role': 'customer',
                    'orders_count': c['orders'],
                    'total_spent': c['spent'],
                    'is_active': c['is_active']
                }
            )
            user.set_password('customer123')
            user.save()
            cust_map[c['id']] = user

        # 6. Products
        products_data = [
            {'id':1,  'name_en':'Hilsa Fish (Ilish)',     'name_bn':'ইলিশ মাছ',          'slug':'hilsa-ilish',       'cat_id':1, 'seller_id':1, 'price':1200, 'stock':45.5, 'region':'Padma River',    'freshness':12, 'cleaning':['whole','cleaned','fillet'], 'rating':4.9, 'reviews':234, 'img':'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80', 'featured':True, 'desc':'Premium Padma Hilsa, the king of fish. Caught fresh from the Padma River every morning. Rich in omega-3 fatty acids.' },
            {'id':2,  'name_en':'Tiger Shrimp',           'name_bn':'বাগদা চিংড়ি',        'slug':'tiger-shrimp',      'cat_id':2, 'seller_id':2, 'price':950,  'stock':28.0, 'region':'Bay of Bengal',  'freshness':8,  'cleaning':['whole','cleaned'],          'rating':4.7, 'reviews':189, 'img':'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80', 'featured':True, 'desc':'Large tiger shrimp from the Bay of Bengal. Perfect for curries and grilling.' },
            {'id':3,  'name_en':'Rohu Fish',              'name_bn':'রুই মাছ',            'slug':'rohu-fish',         'cat_id':3, 'seller_id':1, 'price':280,  'stock':65.0, 'region':'Padma River',    'freshness':18, 'cleaning':['whole','cleaned'],          'rating':4.5, 'reviews':312, 'img':'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', 'featured':True, 'desc':'Fresh Rohu from Padma River. Popular in Bengali households, great for curries.' },
            {'id':4,  'name_en':'Catla Fish',             'name_bn':'কাতলা মাছ',           'slug':'catla-fish',        'cat_id':3, 'seller_id':3, 'price':320,  'stock':42.5, 'region':'Meghna River',   'freshness':16, 'cleaning':['whole','cleaned'],          'rating':4.6, 'reviews':198, 'img':'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', 'featured':False, 'desc':'Large Catla fish, full of flavor. Excellent for traditional Bengali recipes.' },
            {'id':5,  'name_en':'King Prawn',             'name_bn':'গলদা চিংড়ি',         'slug':'king-prawn',        'cat_id':2, 'seller_id':3, 'price':1100, 'stock':18.5, 'region':'Sundarban',      'freshness':10, 'cleaning':['whole','cleaned'],          'rating':4.8, 'reviews':145, 'img':'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80', 'featured':True, 'desc':'Giant freshwater prawns from Sundarban. Sweet, succulent, and a true delicacy.' },
            {'id':6,  'name_en':'Small Hilsa (Jatka)',    'name_bn':'জাটকা ইলিশ',         'slug':'jatka-hilsa',       'cat_id':1, 'seller_id':6, 'price':600,  'stock':30.0, 'region':'Barishal',       'freshness':14, 'cleaning':['whole'],                    'rating':4.3, 'reviews':87,  'img':'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80', 'featured':False, 'desc':'Small hilsa fish from Barishal. Great taste at an affordable price.' },
            {'id':7,  'name_en':'Dried Hilsa (Ilish Shutki)', 'name_bn':'ইলিশ শুঁটকি',  'slug':'ilish-shutki',      'cat_id':5, 'seller_id':4, 'price':2400, 'stock':12.0, 'region':'Chandpur',       'freshness':8760, 'cleaning':['whole'],                   'rating':4.7, 'reviews':156, 'img':'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', 'featured':True, 'desc':'Sun-dried hilsa, a traditional Bangladeshi delicacy with intense flavor.' },
            {'id':8,  'name_en':'Tilapia Fish',           'name_bn':'তেলাপিয়া মাছ',       'slug':'tilapia',           'cat_id':3, 'seller_id':4, 'price':180,  'stock':80.0, 'region':'Dhaka',          'freshness':24, 'cleaning':['whole','cleaned','fillet'], 'rating':4.2, 'reviews':267, 'img':'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', 'featured':False, 'desc':'Farm-raised tilapia, affordable and nutritious. Good for everyday cooking.' },
            {'id':9,  'name_en':'Pomfret',                'name_bn':'রূপচাঁদা মাছ',        'slug':'pomfret',           'cat_id':4, 'seller_id':2, 'price':750,  'stock':22.0, 'region':'Bay of Bengal',  'freshness':10, 'cleaning':['whole','cleaned'],          'rating':4.6, 'reviews':178, 'img':'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600&q=80', 'featured':True, 'desc':'Silver pomfret from Bay of Bengal. A prized sea fish with delicious white flesh.' },
            {'id':10, 'name_en':'Pangash Fish',           'name_bn':'পাঙ্গাশ মাছ',         'slug':'pangash',           'cat_id':3, 'seller_id':1, 'price':140,  'stock':95.0, 'region':'Mymensingh',     'freshness':20, 'cleaning':['whole','cleaned','fillet'], 'rating':4.0, 'reviews':421, 'img':'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', 'featured':False, 'desc':'Popular and affordable Pangash. Great for curries and fry preparations.' },
            {'id':11, 'name_en':'Crab (Mud Crab)',        'name_bn':'কাঁকড়া',             'slug':'mud-crab',          'cat_id':4, 'seller_id':3, 'price':850,  'stock':15.0, 'region':'Sundarban',      'freshness':6,  'cleaning':['whole'],                    'rating':4.8, 'reviews':132, 'img':'https://images.unsplash.com/photo-1559056961-1f4a1a8a8e5e?w=600&q=80', 'featured':False, 'desc':'Live mud crabs from the Sundarban mangroves. Exceptional taste.' },
            {'id':12, 'name_en':'Boal Fish',              'name_bn':'বোয়াল মাছ',           'slug':'boal-fish',         'cat_id':3, 'seller_id':4, 'price':380,  'stock':35.0, 'region':'Jamuna River',   'freshness':16, 'cleaning':['whole','cleaned'],          'rating':4.5, 'reviews':98,  'img':'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', 'featured':False, 'desc':'Boal fish from the Jamuna River, a prized freshwater catfish.' },
            {'id':13, 'name_en':'Dried Shrimp (Shutki)', 'name_bn':'শুকনা চিংড়ি শুঁটকি',  'slug':'dried-shrimp',      'cat_id':5, 'seller_id':2, 'price':1800, 'stock':8.0,  'region':"Cox's Bazar",   'freshness':8760, 'cleaning':['whole'],                   'rating':4.5, 'reviews':89,  'img':'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', 'featured':False, 'desc':'Sun-dried shrimp from Cox\'s Bazar, perfect for flavoring dishes.' },
            {'id':14, 'name_en':'Koi Fish (Live)',        'name_bn':'কই মাছ (জীবন্ত)',      'slug':'live-koi',          'cat_id':6, 'seller_id':4, 'price':450,  'stock':20.0, 'region':'Dhaka',          'freshness':72, 'cleaning':['whole','cleaned'],          'rating':4.7, 'reviews':167, 'img':'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', 'featured':False, 'desc':'Live climbing perch (Koi), delivered alive in oxygenated water bags.' },
            {'id':15, 'name_en':'Tuna Steak',             'name_bn':'টুনা মাছ',            'slug':'tuna-steak',        'cat_id':4, 'seller_id':2, 'price':680,  'stock':25.0, 'region':'Bay of Bengal',  'freshness':12, 'cleaning':['fillet'],                   'rating':4.6, 'reviews':143, 'img':'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80', 'featured':False, 'desc':'Fresh yellowfin tuna from the deep waters of the Bay of Bengal.' },
            {'id':16, 'name_en':'Magur (Catfish)',        'name_bn':'মাগুর মাছ',           'slug':'magur-catfish',     'cat_id':3, 'seller_id':5, 'price':520,  'stock':18.0, 'region':'Sylhet',         'freshness':18, 'cleaning':['whole','cleaned'],          'rating':4.4, 'reviews':76,  'img':'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', 'featured':False, 'desc':'Fresh Magur catfish from Sylhet haor region, known for its medicinal value.' },
            {'id':17, 'name_en':'Mrigel Fish',            'name_bn':'মৃগেল মাছ',           'slug':'mrigel-fish',       'cat_id':3, 'seller_id':6, 'price':260,  'stock':55.0, 'region':'Barishal',       'freshness':20, 'cleaning':['whole','cleaned'],          'rating':4.3, 'reviews':112, 'img':'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', 'featured':False, 'desc':'Mrigel carp from Barishal, a popular everyday fish.' },
            {'id':18, 'name_en':'Snapper (Lal Puti)',     'name_bn':'লাল পুঁটি',           'slug':'red-snapper',       'cat_id':4, 'seller_id':2, 'price':490,  'stock':30.0, 'region':'Bay of Bengal',  'freshness':10, 'cleaning':['whole','cleaned'],          'rating':4.5, 'reviews':95,  'img':'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600&q=80', 'featured':False, 'desc':'Red snapper from the Bay of Bengal with firm, white flesh.' },
            {'id':19, 'name_en':'Pabda Fish',             'name_bn':'পাবদা মাছ',           'slug':'pabda-fish',        'cat_id':3, 'seller_id':3, 'price':680,  'stock':22.0, 'region':'Khulna',         'freshness':14, 'cleaning':['whole','cleaned'],          'rating':4.8, 'reviews':203, 'img':'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', 'featured':True, 'desc':'Prized Pabda fish from Khulna, known for its soft texture and unique flavor.' },
            {'id':20, 'name_en':'Tengra Fish',            'name_bn':'টেংরা মাছ',           'slug':'tengra-fish',       'cat_id':3, 'seller_id':4, 'price':420,  'stock':28.0, 'region':'Comilla',        'freshness':16, 'cleaning':['whole'],                    'rating':4.6, 'reviews':134, 'img':'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', 'featured':False, 'desc':'Small but flavorful Tengra fish, perfect for mustard curry.' },
            {'id':21, 'name_en':'Dried Bombay Duck (Loitta Shutki)', 'name_bn':'লইট্যা শুঁটকি', 'slug':'loitta-shutki', 'cat_id':5, 'seller_id':2, 'price':1200, 'stock':10.0, 'region':"Cox's Bazar", 'freshness':8760, 'cleaning':['whole'], 'rating':4.6, 'reviews':88, 'img':'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', 'featured':False, 'desc':'Loitta Shutki, dried Bombay duck from Cox\'s Bazar, a popular dry fish.' },
            {'id':22, 'name_en':'Squid (Shingara Mach)',  'name_bn':'স্কুইড',              'slug':'squid',             'cat_id':4, 'seller_id':2, 'price':580,  'stock':17.0, 'region':'Bay of Bengal',  'freshness':10, 'cleaning':['whole','cleaned'],          'rating':4.4, 'reviews':76,  'img':'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80', 'featured':False, 'desc':'Fresh squid from the Bay of Bengal, great for stir-fry and curries.' },
            {'id':23, 'name_en':'Chital Fish',            'name_bn':'চিতল মাছ',            'slug':'chital-fish',       'cat_id':3, 'seller_id':3, 'price':750,  'stock':14.0, 'region':'Sundarban',      'freshness':16, 'cleaning':['whole','cleaned'],          'rating':4.7, 'reviews':109, 'img':'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', 'featured':False, 'desc':'Chital fish from Sundarban, famous for its unique oval scales.' },
            {'id':24, 'name_en':'Shol Fish',              'name_bn':'শোল মাছ',             'slug':'shol-fish',         'cat_id':3, 'seller_id':1, 'price':580,  'stock':25.0, 'region':'Padma River',    'freshness':18, 'cleaning':['whole','cleaned'],          'rating':4.5, 'reviews':91,  'img':'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&q=80', 'featured':False, 'desc':'Snakehead fish (Shol) from Padma, known for rapid wound healing properties.' },
            {'id':25, 'name_en':'Golsha (Gulsha Tengra)', 'name_bn':'গুলশা টেংরা',         'slug':'gulsha-tengra',     'cat_id':3, 'seller_id':5, 'price':550,  'stock':20.0, 'region':'Sylhet',         'freshness':14, 'cleaning':['whole'],                    'rating':4.6, 'reviews':117, 'img':'https://images.unsplash.com/photo-1560717845-968823efbee1?w=600&q=80', 'featured':False, 'desc':'Gulsha Tengra from Sylhet haors, a delicacy with amazing taste.' },
        ]
        for p in products_data:
            cat = cat_map.get(p['cat_id']) or Category.objects.first()
            seller = seller_map.get(p['seller_id']) or User.objects.filter(role='seller').first()
            Product.objects.update_or_create(
                id=p['id'],
                defaults={
                    'name_en': p['name_en'],
                    'name_bn': p['name_bn'],
                    'slug': p['slug'],
                    'category': cat,
                    'seller': seller,
                    'price_per_kg': p['price'],
                    'stock_kg': p['stock'],
                    'region': p['region'],
                    'freshness_hours': p['freshness'],
                    'cleaning_options': p['cleaning'],
                    'rating': p['rating'],
                    'reviews': p['reviews'],
                    'img': p['img'],
                    'is_featured': p['featured'],
                    'description': p['desc']
                }
            )

        # 7. Initial Orders
        orders_data = [
            {'id':'ORD-2024-001', 'cust_id':1, 'status':'delivered', 'total':3600, 'items':[{'p_id':1, 'qty':2, 'price':1200},{'p_id':3, 'qty':3, 'price':280}], 'district':'Dhaka', 'address':'45 Mirpur Road, Dhaka 1216', 'payment':'cod'},
            {'id':'ORD-2024-002', 'cust_id':1, 'status':'shipped',   'total':1900, 'items':[{'p_id':2, 'qty':2, 'price':950}], 'district':'Dhaka', 'address':'45 Mirpur Road, Dhaka 1216', 'payment':'cod'},
            {'id':'ORD-2024-003', 'cust_id':2, 'status':'pending',   'total':2200, 'items':[{'p_id':9, 'qty':2, 'price':750},{'p_id':5, 'qty':1, 'price':1100}], 'district':'Chittagong', 'address':'12 Agrabad, Chittagong', 'payment':'cod'},
        ]
        for od in orders_data:
            cust = cust_map.get(od['cust_id']) or User.objects.filter(role='customer').first()
            order, _ = Order.objects.update_or_create(
                id=od['id'],
                defaults={
                    'customer': cust,
                    'status': od['status'],
                    'total': od['total'],
                    'district': od['district'],
                    'address': od['address'],
                    'payment': od['payment']
                }
            )
            for it in od['items']:
                prod = Product.objects.filter(id=it['p_id']).first()
                if prod:
                    OrderItem.objects.update_or_create(
                        order=order,
                        product=prod,
                        defaults={'qty_kg': it['qty'], 'price': it['price'], 'cleaning': 'whole'}
                    )

        self.stdout.write(self.style.SUCCESS('Successfully seeded FishBazar marketplace data!'))
