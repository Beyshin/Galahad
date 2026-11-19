import json


import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from django.conf import settings
from django.contrib.auth.models import User
from django.http.response import JsonResponse
from .models import Tag, File
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from django.contrib.auth import authenticate, login, logout
from .serializers import TagSerializer

# Create your views here.

def test(request):
    return JsonResponse(File.objects.all())

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get('username')
        password = data.get('password')

        print(username, password)

        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'status': 'logged_in'}, status=200)
            else:
                return JsonResponse({'status': 'failed'}, status=401)
        except ClientError as e:
            print(e)
    return JsonResponse({"error": "Method not allowed"}, status=405)

#POST /api/logout
@csrf_exempt
def logout_user(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({'status': 'logged_out'}, status=200)

    return JsonResponse({"error": "Method not allowed"}, status=405)

#POST /api/addFile
@csrf_exempt
def add_file(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

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
                file_obj.name,
                ExtraArgs={'ContentType': file_obj.content_type}
            )
        except ClientError as e:
            print(e)
            return JsonResponse({'error': 'Failed to upload to S3'}, status=500)

        try:
            new_file = File.objects.create(
                name=file_name if file_name else file_obj.name,
                s3_key=file_obj.name,
                created_by=request.user
            )
            new_file.save()
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Failed to save to database'}, status=500)

        return JsonResponse({"message": "file sucessfully added"}, status=201)
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)

# POST /api/removeFile
@csrf_exempt
def remove_file(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if request.method == 'POST':
        s3_client = boto3.client('s3', region_name=settings.AWS_REGION, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, aws_access_key_id=settings.AWS_ACCESS_KEY_ID, config=Config(signature_version='s3v4'))
        bucket_name = settings.AWS_BUCKET_NAME

        data = json.loads(request.body)
        s3_key = data.get('s3_key')
        print(f"Received name: {s3_key}")
        try:
            s3_client.delete_object(Bucket=bucket_name, Key=s3_key)
            File.objects.filter(s3_key=s3_key).delete()
            return JsonResponse({"message": "file successfully removed"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)

# GET /api/files
def list_all_files(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if request.method == 'GET':
        s3_client = boto3.client('s3', region_name=settings.AWS_REGION, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, aws_access_key_id=settings.AWS_ACCESS_KEY_ID, config=Config(signature_version='s3v4'))

        bucket_name = settings.AWS_BUCKET_NAME

        try:
            files = File.objects.all()
            files_data = []
            for file in files:
                presigned_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': settings.AWS_BUCKET_NAME, 'Key': file.s3_key},
                    ExpiresIn=3600
                )

                files_data.append({
                    'id': str(file.id),
                    'name': file.name,
                    's3_key': file.s3_key,
                    's3_url': presigned_url,
                })
            return JsonResponse({'files': files_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)

def list_files_by_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    if request.method == 'GET':
        s3_client = boto3.client('s3', region_name=settings.AWS_REGION, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, aws_access_key_id=settings.AWS_ACCESS_KEY_ID, config=Config(signature_version='s3v4'))
        user = request.user
        files = File.objects.filter(created_by=user)
        files_data = []
        for file in files:
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': settings.AWS_BUCKET_NAME, 'Key': file.s3_key},
                ExpiresIn=3600
            )

            files_data.append({
                'id': str(file.id),
                'name': file.name,
                's3_key': file.s3_key,
                's3_url': presigned_url,
            })
        return JsonResponse({'files': files_data}, status=200)
    else:
        return JsonResponse({'error': 'method not allowed'}, status=405)


def list_files_by_share(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    if request.method == 'GET':
        s3_client = boto3.client('s3', region_name=settings.AWS_REGION, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, aws_access_key_id=settings.AWS_ACCESS_KEY_ID, config=Config(signature_version='s3v4'))
        user = request.user

        files = File.objects.filter(shared_to_users=user)
        files_data = []

        for file in files:
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': settings.AWS_BUCKET_NAME, 'Key': file.s3_key},
                ExpiresIn=3600
            )
            files_data.append({
                'id': str(file.id),
                'name': file.name,
                's3_key': file.s3_key,
                's3_url': presigned_url,
            })

        return JsonResponse({'files': files_data}, status=200)
    else:
        return JsonResponse({'message': "method not allowed"}, status=405)

@csrf_exempt
def share_file(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    if request.method == 'POST':
        data = json.loads(request.body)
        file_id = data.get('file_id')
        users_id = data.get('users_id')

        file = File.objects.get(id=file_id)

        for u_id in users_id:
            file.shared_to_users.add(u_id)

        return JsonResponse({'message': 'file shared'}, status=200)
    else:
        return JsonResponse({'error': 'method not allowed'}, status=405)

# GET /api/users
def get_users(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    if request.method == 'GET':
        users = User.objects.all()
        users_data = []
        for user in users:
            users_data.append({
                'username': user.username,
                'id': user.id,
            })

        return JsonResponse({'users': users_data})
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
