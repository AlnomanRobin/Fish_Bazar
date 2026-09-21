from django.db import models
from django.conf import settings

class Category(models.Model):
    name_en = models.CharField(max_length=100)
    name_bn = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=10, default='🐟')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name_en

    @property
    def count(self):
        return self.products.count()

class District(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_bn = models.CharField(max_length=100)
    charge = models.FloatField(default=100.0)
    days = models.IntegerField(default=2)

    def __str__(self):
        return self.name

class Product(models.Model):
    name_en = models.CharField(max_length=200)
    name_bn = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    price_per_kg = models.FloatField(default=0.0)
    stock_kg = models.FloatField(default=0.0)
    region = models.CharField(max_length=150, blank=True, default='')
    freshness_hours = models.IntegerField(default=12)
    cleaning_options = models.JSONField(default=list) # e.g. ["whole", "cleaned", "fillet"]
    rating = models.FloatField(default=4.8)
    reviews = models.IntegerField(default=0)
    img = models.TextField(blank=True, default='')
    is_featured = models.BooleanField(default=False)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name_en} ({self.price_per_kg} Tk/kg)"
