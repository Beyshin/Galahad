from django.core.management import BaseCommand
from django.conf import settings

import boto3

class Command(BaseCommand):

    help = "Upload files to S3"

    def handle(self, *args, **options):
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

        bucket_name = settings.AWS_BUCKET_NAME

        file_content = b'TEST'
        object_key = 'test/testowy_plik.txt'

        try:
            s3_client.put_object(
                Bucket=bucket_name,
                Key=object_key,
                Body=file_content
            )
            self.stdout.write(self.style.SUCCESS(f'Utworzono obiekt {object_key} na S3'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'ERROR S3: {str(e)}'))
