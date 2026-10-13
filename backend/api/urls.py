from django.urls import path
from .views import test, list_files, add_file, TagListView

urlpatterns = [
  path("test/", test, name='test'),
  path("files/", list_files, name='files'),
  path("addFile/", add_file, name='add_file'),
  path("tagList/", TagListView.as_view(), name="tag_list"),
]
