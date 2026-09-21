from rest_framework import serializers
from .models import Category, District, Product
from apps.accounts.serializers import SellerSerializer

class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name_en', 'name_bn', 'slug', 'icon', 'count']

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'name_bn', 'charge', 'days']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    seller = SellerSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=False
    )
    seller_id = serializers.IntegerField(source='seller.id', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name_en', 'name_bn', 'slug', 'category_id', 'seller_id',
            'price_per_kg', 'stock_kg', 'region', 'freshness_hours',
            'cleaning_options', 'rating', 'reviews', 'img', 'is_featured',
            'description', 'category', 'seller'
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Ensure category_id is integer in representation
        ret['category_id'] = instance.category_id
        ret['seller_id'] = instance.seller_id
        return ret
