from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document model."""
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username', required=False)
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'original_filename', 'file_type', 'extracted_text', 'uploaded_by', 'uploaded_at', 'originality_score']
        read_only_fields = ['extracted_text', 'uploaded_at', 'file_type', 'original_filename']

class DocumentTextSerializer(serializers.ModelSerializer):
    """Serializer for returning just the extracted text."""
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'extracted_text']
        read_only_fields = ['id', 'title', 'extracted_text'] 