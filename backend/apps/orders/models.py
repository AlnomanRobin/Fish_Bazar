from django.db import models
from django.conf import settings
from apps.catalog.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )

    id = models.CharField(max_length=50, primary_key=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    total = models.FloatField(default=0.0)
    district = models.CharField(max_length=100, blank=True, default='')
    address = models.TextField(blank=True, default='')
    delivery_charge = models.FloatField(default=0.0)
    payment = models.CharField(max_length=50, default='cod')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} - {self.status} - {self.total} Tk"

    @property
    def date(self):
        return self.created_at.strftime('%Y-%m-%d')

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    qty_kg = models.FloatField(default=1.0)
    price = models.FloatField(default=0.0)
    cleaning = models.CharField(max_length=50, blank=True, default='whole')

    def __str__(self):
        return f"{self.order_id} - {self.product.name_en} ({self.qty_kg} kg)"
