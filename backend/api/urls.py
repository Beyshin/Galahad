from django.urls import path

from api import views

urlpatterns = [
  path("test/", views.test, name='test'),
    path("files/", views.list_files, name='files')
]
