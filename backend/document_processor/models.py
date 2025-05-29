from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    """Model to store uploaded documents and their extracted text."""
    DOCUMENT_TYPES = (
        ('pdf', 'PDF'),
        ('doc', 'DOC'),
        ('docx', 'DOCX'),
    )
    
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    extracted_text = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
