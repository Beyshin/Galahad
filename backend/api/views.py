import json


import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from django.conf import settings
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

        file_name = request.POST.get('name')

        file_obj = request.FILES.get('file')

        print(f"Received name: {file_name}")
        print(f"Received file: {file_obj}")

        if not file_obj:
            return JsonResponse({'error': 'no file provided'}, status=400)

        s3_client = boto3.client('s3', region_name=settings.AWS_REGION,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                 aws_access_key_id=settings.AWS_ACCESS_KEY_ID, config=Config(signature_version='s3v4'))

        try:
            s3_client.upload_fileobj(
                file_obj,
                settings.AWS_BUCKET_NAME,
                file_name,
                ExtraArgs={'ContentType': file_obj.content_type}  # Preserves the file type in S3
            )
        except ClientError as e:
            print(e)
            return JsonResponse({'error': 'Failed to upload to S3'}, status=500)

        try:
            new_file = File.objects.create(
                name=file_name if file_name else file_obj.name,
                s3_key="test_s3_key",
            )
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Failed to save to database'}, status=500)

        return JsonResponse({"message": "file sucessfully added"}, status=201)
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)


def remove_file(request):
    if request.method == 'POST':
        print("POST | Remove file")

def list_files_from_s3(request):
    if request.method == 'GET':
        s3_client = boto3.client('s3', region_name=settings.AWS_REGION, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, aws_access_key_id=settings.AWS_ACCESS_KEY_ID, config=Config(signature_version='s3v4'))

        bucket_name = settings.AWS_BUCKET_NAME

        try:
            response = s3_client.list_objects(Bucket=bucket_name)

            files = []

            if 'Contents' in response:
                for file in response['Contents']:
                    files.append({
                        'name': file['Key'],
                        'size': file['Size'],
                        'last_modified': file['LastModified'].isoformat(),
                        's3_key': s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': file['Key']}, ExpiresIn=3600),
                    })
            return JsonResponse({'files': files})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
