import json

from django.http.response import JsonResponse
from .models import Tag, File
from rest_framework import generics
from .serializers import TagSerializer
from django.middleware.csrf import get_token

# Create your views here.

def test(request):
    return JsonResponse({"message" : "test"})

def get_csrf_token(request):
    if request.method == "GET":
        return JsonResponse({"csrf_token" : get_token(request)}, status=200)
    else:
        return JsonResponse({"message" : "unsupported method"}, status=400)
def root_view(request):
    return JsonResponse({"message" : "Galahad API"})

def files_api(request):
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
    elif request.method == 'POST':
            ##TODO: TAGS
            # data = json.loads(request.body)
            # tags = data.get('tags', [])
            # print(tags)

            # file_obj = request.FILES.get('file')
            #
            # if not file_obj:
            #     return JsonResponse({'error': 'no file provided'}, status=400)


            print(request.body)

            File.objects.create(
                name="test",
                s3_key="test post s3",
            )

            return JsonResponse({"message": "file successfully added"}, status=201)
    elif request.method == 'DELETE':
        #TODO:
        print("DELETE | Remove file")
        return None
    else:
        return JsonResponse({'error': 'unsupported method'}, status=400)



class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
