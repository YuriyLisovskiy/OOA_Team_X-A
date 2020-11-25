from django.urls import re_path, include

app_name = 'api_v1'

urlpatterns = [
    re_path(r'^auth/?', include('auth.urls', namespace='auth')),
    re_path(r'^core/?', include('core.urls', namespace='core')),
    re_path(r'^artworks/?', include('artwork.urls', namespace='artwork')),
]
