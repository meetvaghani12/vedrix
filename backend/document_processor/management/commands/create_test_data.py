from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from document_processor.models import Document
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Creates test data for the application'

    def handle(self, *args, **kwargs):
        # Create a test user if it doesn't exist
        username = 'testuser'
        email = 'test@example.com'
        password = 'testpass123'

        try:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.SUCCESS(f'Using existing user: {username}'))
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'Created new user: {username}'))

        # Create some test documents
        titles = [
            'Research Paper on AI',
            'Machine Learning Study',
            'Data Analysis Report',
            'Python Programming Guide',
            'Web Development Tutorial',
            'Database Design Document',
            'Project Proposal',
            'Technical Documentation'
        ]

        # Delete existing documents for this user
        Document.objects.filter(uploaded_by=user).delete()

        # Create documents with different dates
        for i, title in enumerate(titles):
            days_ago = random.randint(0, 60)  # Random date within last 60 days
            upload_date = timezone.now() - timedelta(days=days_ago)
            
            Document.objects.create(
                title=title,
                file_type='pdf',
                extracted_text=f'Sample text for {title}',
                uploaded_by=user,
                uploaded_at=upload_date
            )
            self.stdout.write(self.style.SUCCESS(f'Created document: {title}'))

        self.stdout.write(self.style.SUCCESS('Successfully created test data')) 