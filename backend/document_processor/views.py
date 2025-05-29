from django.shortcuts import render
import os
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Document
from .serializers import DocumentSerializer, DocumentTextSerializer
from .utils import extract_text

# Create your views here.

class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for handling document operations."""
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [AllowAny]  # Allow any user for testing
    
    def get_queryset(self):
        """Filter documents to only show those uploaded by the current user."""
        if self.request.user.is_authenticated:
            return Document.objects.filter(uploaded_by=self.request.user)
        return Document.objects.all()  # For testing purposes
    
    def perform_create(self, serializer):
        """Process the uploaded file and extract text."""
        # Get the uploaded file
        uploaded_file = self.request.FILES.get('file')
        
        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine file type from extension
        file_name = uploaded_file.name.lower()
        if file_name.endswith('.pdf'):
            file_type = 'pdf'
        elif file_name.endswith('.docx'):
            file_type = 'docx'
        elif file_name.endswith('.doc'):
            file_type = 'doc'
        else:
            return Response(
                {"error": "Unsupported file type. Please upload a PDF or DOCX file."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save the document with file type and user if authenticated
        if self.request.user.is_authenticated:
            document = serializer.save(uploaded_by=self.request.user, file_type=file_type)
        else:
            # For anonymous users, save without uploaded_by
            document = serializer.save(file_type=file_type)
        
        # Extract text from the document
        file_path = document.file.path
        extracted_text = extract_text(file_path, file_type)
        
        # Update the document with extracted text
        document.extracted_text = extracted_text
        document.save()
    
    @action(detail=True, methods=['get'])
    def extracted_text(self, request, pk=None):
        """Return only the extracted text for a document."""
        document = self.get_object()
        serializer = DocumentTextSerializer(document)
        return Response(serializer.data)
