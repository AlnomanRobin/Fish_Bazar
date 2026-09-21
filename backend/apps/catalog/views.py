from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.utils.text import slugify
import time
from .models import Category, District, Product
from .serializers import CategorySerializer, DistrictSerializer, ProductSerializer
from apps.accounts.models import User

@api_view(['GET'])
@permission_classes([AllowAny])
def categories_list(request):
    categories = Category.objects.all().order_by('id')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def districts_list(request):
    districts = District.objects.all().order_by('id')
    serializer = DistrictSerializer(districts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def products_list(request):
    qs = Product.objects.select_related('category', 'seller').all()

    category_id = request.query_params.get('category')
    if category_id:
        qs = qs.filter(category_id=category_id)

    search = request.query_params.get('search')
    if search:
        s = search.strip()
        qs = qs.filter(Q(name_en__icontains=s) | Q(name_bn__icontains=s) | Q(region__icontains=s))

    min_price = request.query_params.get('min_price')
    if min_price:
        try:
            qs = qs.filter(price_per_kg__gte=float(min_price))
        except ValueError:
            pass

    max_price = request.query_params.get('max_price')
    if max_price:
        try:
            qs = qs.filter(price_per_kg__lte=float(max_price))
        except ValueError:
            pass

    seller_id = request.query_params.get('seller_id')
    if seller_id:
        qs = qs.filter(seller_id=seller_id)

    featured = request.query_params.get('featured')
    if featured in ['true', '1', True]:
        qs = qs.filter(is_featured=True)

    sort = request.query_params.get('sort')
    if sort == 'price_asc':
        qs = qs.order_by('price_per_kg')
    elif sort == 'price_desc':
        qs = qs.order_by('-price_per_kg')
    elif sort == 'rating':
        qs = qs.order_by('-rating')
    elif sort == 'newest':
        qs = qs.order_by('-id')
    else:
        qs = qs.order_by('-id')

    serializer = ProductSerializer(qs, many=True)
    return Response({
        'count': qs.count(),
        'results': serializer.data
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, slug):
    p = Product.objects.select_related('category', 'seller').filter(Q(slug=slug) | Q(id__iexact=slug)).first()
    if not p:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    data = ProductSerializer(p).data

    # Related products from same category
    related_qs = Product.objects.select_related('seller', 'category').filter(
        category_id=p.category_id
    ).exclude(id=p.id)[:4]
    data['related'] = ProductSerializer(related_qs, many=True).data

    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def product_suggestions(request):
    q = (request.query_params.get('q') or '').strip().lower()
    if not q:
        return Response([])

    qs = Product.objects.select_related('category').filter(
        Q(name_en__icontains=q) | Q(name_bn__icontains=q) | Q(slug__icontains=q) | Q(category__name_en__icontains=q)
    )[:8]

    suggestions = []
    for p in qs:
        suggestions.append({
            'id': p.id,
            'name_en': p.name_en,
            'name_bn': p.name_bn,
            'slug': p.slug,
            'img': p.img,
            'category': p.category.name_en if p.category else '',
            'price': p.price_per_kg
        })

    return Response(suggestions)

@api_view(['GET', 'POST'])
def seller_products_view(request):
    # Determine seller
    user = request.user
    if not user.is_authenticated or user.role != 'seller':
        # Default fallback to first seller if unauthenticated or testing
        user = User.objects.filter(role='seller').first()

    if request.method == 'GET':
        seller_id = request.query_params.get('seller_id') or (user.id if user else 1)
        products = Product.objects.select_related('category', 'seller').filter(seller_id=seller_id).order_by('-id')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        name_en = data.get('name_en') or 'Fish'
        raw_slug = slugify(name_en)
        unique_slug = f"{raw_slug}-{str(int(time.time()))[-4:]}"
        
        category_id = data.get('category_id') or 1
        category = Category.objects.filter(id=category_id).first() or Category.objects.first()

        product = Product.objects.create(
            name_en=name_en,
            name_bn=data.get('name_bn') or name_en,
            slug=unique_slug,
            category=category,
            seller=user,
            price_per_kg=float(data.get('price_per_kg') or 0),
            stock_kg=float(data.get('stock_kg') or 0),
            region=data.get('region', ''),
            freshness_hours=int(data.get('freshness_hours') or 12),
            cleaning_options=data.get('cleaning_options') or ['whole'],
            rating=5.0,
            reviews=0,
            img=data.get('img') or 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80',
            is_featured=bool(data.get('is_featured', False)),
            description=data.get('description', '')
        )
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

@api_view(['PUT', 'DELETE'])
def seller_product_detail_view(request, slug):
    product = Product.objects.filter(Q(slug=slug) | Q(id__iexact=slug)).first()
    if not product:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        product.delete()
        return Response({'success': True})

    elif request.method == 'PUT':
        data = request.data
        if 'name_en' in data: product.name_en = data['name_en']
        if 'name_bn' in data: product.name_bn = data['name_bn']
        if 'price_per_kg' in data: product.price_per_kg = float(data['price_per_kg'])
        if 'stock_kg' in data: product.stock_kg = float(data['stock_kg'])
        if 'region' in data: product.region = data['region']
        if 'freshness_hours' in data: product.freshness_hours = int(data['freshness_hours'])
        if 'cleaning_options' in data: product.cleaning_options = data['cleaning_options']
        if 'description' in data: product.description = data['description']
        if 'img' in data: product.img = data['img']
        if 'category_id' in data:
            cat = Category.objects.filter(id=data['category_id']).first()
            if cat: product.category = cat
        product.save()
        return Response(ProductSerializer(product).data)

@api_view(['GET'])
def admin_products_list(request):
    products = Product.objects.select_related('category', 'seller').all().order_by('-id')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
