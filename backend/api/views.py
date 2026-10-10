from ctypes.wintypes import tagSIZE

from django.http.response import JsonResponse
from django.shortcuts import render
from django.db import models
from .models import *
from .models import Tag


# Create your views here.

def test(request):
    return JsonResponse({'test': 'test'})


def list_files(request):
    files = File.objects.all()
    files_data = []


    tag = request.GET.get('tag')

    print(tag)

    if tag :
        files = files.filter(tags__name=tag)

    for f in files:
        files_data.append({
            'name' : f.name,
            's3_key': f.s3_key,
            'tags': [{"name": tag.name, "color": tag.color} for tag in f.tags.all()]
        })

    return JsonResponse({'files': files_data})

