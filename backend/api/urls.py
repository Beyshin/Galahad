from django.urls import path
from .views import test, add_file, TagListView, list_all_files, login_user, logout_user, get_users, \
  remove_file, list_files_by_user, list_files_by_share, share_file


urlpatterns = [
  path("test/", test, name='test'),
  path("files/", list_all_files, name='files'),
  path("addFile/", add_file, name='add_file'),
  path("tagList/", TagListView.as_view(), name="tag_list"),
  path("login/", login_user, name='login'),
  path("logout/", logout_user, name='logout'),
  path("users/", get_users, name='users'),
  path("removeFile/", remove_file, name='remove_file'),
  path("myFiles/", list_files_by_user, name='my_files'),
  path("sharedFiles/", list_files_by_share, name="shared_files"),
  path("shareFile/", share_file, name="share_file"),
]
