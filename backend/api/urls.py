from django.urls import path
from .views import test, add_file, TagListView, list_files_from_s3, login_user, logout_user, get_users, \
  remove_file

urlpatterns = [
  path("test/", test, name='test'),
  path("files/", list_files_from_s3, name='files'),
  path("addFile/", add_file, name='add_file'),
  path("tagList/", TagListView.as_view(), name="tag_list"),
  path("login/", login_user, name='login'),
  path("logout/", logout_user, name='logout'),
  path("users/", get_users, name='users'),
  path("removeFile/", remove_file, name='remove_file'),
]
