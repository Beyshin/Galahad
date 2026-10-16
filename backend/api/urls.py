from django.urls import path
from .views import test, files_api, TagListView, get_csrf_token

urlpatterns = [
  path("test/", test, name='test'),
  path("csrf/", get_csrf_token, name="csrf_token"),
  path("files/", files_api, name='files'),
  path("tags/", TagListView.as_view(), name="tag_list"),
]
