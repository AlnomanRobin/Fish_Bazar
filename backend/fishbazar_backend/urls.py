"""
URL configuration for fishbazar_backend project.
"""
from django.contrib import admin
from django.urls import path, re_path
from apps.accounts import views as account_views
from apps.catalog import views as catalog_views
from apps.orders import views as order_views

api_v1_patterns = [
    # Auth
    path('api/v1/auth/login/', account_views.login_view, name='login'),
    path('api/v1/auth/register/', account_views.register_view, name='register'),

    # Catalog
    path('api/v1/categories/', catalog_views.categories_list, name='categories'),
    path('api/v1/districts/', catalog_views.districts_list, name='districts'),
    path('api/v1/products/', catalog_views.products_list, name='products'),
    path('api/v1/products/suggest/', catalog_views.product_suggestions, name='product-suggestions'),
    path('api/v1/products/<slug>/', catalog_views.product_detail, name='product-detail'),

    # Orders
    path('api/v1/orders/', order_views.orders_view, name='orders'),
    path('api/v1/orders/<order_id>/', order_views.order_detail_view, name='order-detail'),

    # Seller APIs
    path('api/v1/seller/products/', catalog_views.seller_products_view, name='seller-products'),
    path('api/v1/seller/products/<slug>/', catalog_views.seller_product_detail_view, name='seller-product-detail'),
    path('api/v1/seller/orders/', order_views.seller_orders_view, name='seller-orders'),
    path('api/v1/seller/orders/<order_id>/', order_views.seller_order_status_patch, name='seller-order-patch'),
    path('api/v1/seller/stats/', order_views.seller_stats_view, name='seller-stats'),

    # Admin APIs
    path('api/v1/admin/stats/', order_views.admin_stats_view, name='admin-stats'),
    path('api/v1/admin/sellers/', account_views.admin_sellers_list, name='admin-sellers'),
    path('api/v1/admin/sellers/<int:pk>/', account_views.admin_seller_patch, name='admin-seller-patch'),
    path('api/v1/admin/customers/', account_views.admin_customers_list, name='admin-customers'),
    path('api/v1/admin/orders/', order_views.admin_orders_list, name='admin-orders'),
    path('api/v1/admin/products/', catalog_views.admin_products_list, name='admin-products'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    *api_v1_patterns,
]
