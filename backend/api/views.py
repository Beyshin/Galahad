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
            return JsonResponse({"message": "file successfully removed"}, status=200)
        except Exception as e:
            return JsonResponse({"error": e}, status=500)
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)

# GET /api/files
def list_files_from_s3(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

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
                        's3_url': s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': file['Key']}, ExpiresIn=3600),
                        's3_key': file['Key'],
                    })
            return JsonResponse({'files': files})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

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
            })

        return JsonResponse({'users': users_data})
    else:
        return JsonResponse({"message": "method not allowed"}, status=405)


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
