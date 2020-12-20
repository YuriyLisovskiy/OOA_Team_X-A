from django.urls import re_path
from rest_framework_simplejwt import views as jwt_views

from authentication.views import RegisterUserAPIView, UserExistsAPIView

app_name = 'authentication'

urlpatterns = [
    re_path(r'^login/?', jwt_views.TokenObtainPairView.as_view(), name='login'),
    re_path(r'^refresh/?', jwt_views.TokenRefreshView.as_view(), name='refresh_token'),
    re_path(r'^register/?', RegisterUserAPIView.as_view(), name='register'),
    re_path(r'^user/exists/?', UserExistsAPIView.as_view(), name='user_exists')
]
