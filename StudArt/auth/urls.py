from django.urls import re_path
from rest_framework_jwt.views import obtain_jwt_token

from auth.views import RegisterUserAPIView, UserExistsAPIView

app_name = 'auth'

urlpatterns = [
    re_path(r'^login/?', obtain_jwt_token, name='login'),
    re_path(r'^register/?', RegisterUserAPIView.as_view(), name='register'),
    re_path(r'^user/exists/?', UserExistsAPIView.as_view(), name='user_exists')
]
