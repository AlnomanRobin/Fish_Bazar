from rest_framework import serializers
from .models import Order, OrderItem
from apps.accounts.serializers import UserSerializer
from apps.catalog.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'qty_kg', 'price', 'cleaning', 'product']

class OrderSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    date = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'status', 'total', 'district', 'address',
            'delivery_charge', 'payment', 'date', 'items'
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['customer_id'] = instance.customer_id
        return ret
