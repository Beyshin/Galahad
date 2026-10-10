from django.db import models

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=30)
    color = models.CharField(max_length=7)

    def __str__(self):
        return self.name



class File(models.Model):
    name = models.CharField(max_length=30)
    s3_key = models.CharField(max_length=1024)

    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.name