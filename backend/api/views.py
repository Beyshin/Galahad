import json

from django.http.response import JsonResponse

from .models import Tag, File
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics

from .serializers import TagSerializer


# Create your views here.

def test(request):
    return JsonResponse(File.objects.all())


def list_files(request):
    if request.method == 'GET':
        files = File.objects.all()
        files_data = []

        tag = request.GET.get('tag')

        if tag :
            files = files.filter(tags__name=tag)

        for f in files:
            files_data.append({
                'name' : f.name,
                's3_key': f.s3_key,
                'tags': [{"name": tag.name, "color": tag.color} for tag in f.tags.all()],
                'created_by': f.created_by.username,
            })

        return JsonResponse({'files': files_data})
    else:
        return JsonResponse({"message": "method not allowed"})

@csrf_exempt
def add_file(request):
    if request.method == 'POST':
        ##TODO: TAGS
        #data = json.loads(request.body)
        #tags = data.get('tags', [])
        #print(tags)

        file_obj = request.FILES.get('file')

        if not file_obj:
            return JsonResponse({'error': 'no file provided'}, status=400)

        File.objects.create(
            name="test",
            s3_key="test post s3",
        )

        return JsonResponse({"message": "file sucessfully added"}, status=201)
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)


def remove_file(request):
    if request.method == 'POST':
        print("POST | Remove file")


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
