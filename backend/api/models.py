from datetime import datetime

from django.contrib.auth.models import User
from django.db import models

def get_default_user():
    user, created = User.objects.get_or_create(username='default')
    return user.id

class Tag(models.Model):
    name = models.CharField(max_length=30)
    color = models.CharField(max_length=7)

    def __str__(self):
        return self.name


class File(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    s3_key = models.CharField(max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, default=get_default_user)

    tags = models.ManyToManyField(Tag, blank=True)


    def __str__(self):
        return self.name