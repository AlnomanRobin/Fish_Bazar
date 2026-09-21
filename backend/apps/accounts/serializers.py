from rest_framework import serializers
from .models import User
from .authentication import generate_token

class UserSerializer(serializers.ModelSerializer):
    joined = serializers.SerializerMethodField()
    orders = serializers.IntegerField(source='orders_count', read_only=True)
    spent = serializers.FloatField(source='total_spent', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'name', 'phone', 'email', 'role', 'district', 'address',
            'avatar', 'shop_name', 'rating', 'total_sales', 'is_approved',
            'is_active', 'joined', 'orders', 'spent'
        ]

    def get_joined(self, obj):
        return obj.date_joined.strftime('%Y-%m-%d')

class SellerSerializer(serializers.ModelSerializer):
    joined = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'shop_name', 'name', 'district', 'rating',
            'total_sales', 'is_approved', 'joined', 'phone', 'email',
            'avatar', 'address'
        ]

    def get_joined(self, obj):
        return obj.date_joined.strftime('%Y-%m-%d')
