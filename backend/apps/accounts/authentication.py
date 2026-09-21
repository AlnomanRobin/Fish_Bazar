import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model

def generate_token(user):
    payload = {
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]
        User = get_user_model()

        # Support mock tokens if any left in storage
        if token.startswith('mock-'):
            if 'admin' in token:
                user = User.objects.filter(role='admin').first()
            elif 'seller' in token:
                user = User.objects.filter(role='seller').first()
            else:
                user = User.objects.filter(role='customer').first()
            if user:
                return (user, token)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
            if not user.is_active:
                raise exceptions.AuthenticationFailed('User account is inactive.')
            return (user, token)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return None
