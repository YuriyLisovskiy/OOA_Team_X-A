from django.urls import re_path, include
from rest_framework_jwt.views import obtain_jwt_token

app_name = 'api_v1'

urlpatterns = [
    re_path(r'^auth/?', obtain_jwt_token),
    re_path(r'^core/?', include('core.urls')),
]
