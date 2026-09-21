from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Phone field must be set')
        phone = str(phone).strip()
        user = self.model(phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(phone, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    )

    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=50, unique=True, db_index=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    
    # Customer / Seller profile fields
    district = models.CharField(max_length=100, blank=True, default='')
    address = models.TextField(blank=True, default='')
    avatar = models.TextField(blank=True, default='')
    
    # Seller specific fields
    shop_name = models.CharField(max_length=200, blank=True, default='')
    rating = models.FloatField(default=4.8)
    total_sales = models.IntegerField(default=0)
    is_approved = models.BooleanField(default=True)

    # Customer stats
    orders_count = models.IntegerField(default=0)
    total_spent = models.FloatField(default=0.0)

    # System fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name} ({self.phone}) - {self.role}"
