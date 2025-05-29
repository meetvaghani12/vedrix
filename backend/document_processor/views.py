from django.shortcuts import render
import os
from io import BytesIO
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from .models import Document
from .serializers import DocumentSerializer, DocumentTextSerializer
from .utils import extract_text_from_pdf, extract_text_from_docx, extract_text_from_doc

# Create your views here.

class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for handling document operations."""
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [AllowAny]  # Allow any user for testing
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """Filter documents to only show those uploaded by the current user."""
        if self.request.user.is_authenticated:
            return Document.objects.filter(uploaded_by=self.request.user)
        return Document.objects.all()  # For testing purposes
    
    def create(self, request, *args, **kwargs):
        """
        Override create method to handle file upload without saving to disk.
        Process the file in memory and only store the extracted text.
        """
        # Get the uploaded file
        uploaded_file = request.FILES.get('file')
        title = request.data.get('title', '')
        
        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not title:
            title = uploaded_file.name
        
        # Determine file type from extension
        file_name = uploaded_file.name.lower()
        if file_name.endswith('.pdf'):
            file_type = 'pdf'
            extracted_text = self.process_pdf_in_memory(uploaded_file)
        elif file_name.endswith('.docx'):
            file_type = 'docx'
            extracted_text = self.process_docx_in_memory(uploaded_file)
        elif file_name.endswith('.doc'):
            file_type = 'doc'
            extracted_text = "Direct extraction from DOC files is not supported. Please convert to DOCX format for better results."
        else:
            return Response(
                {"error": "Unsupported file type. Please upload a PDF or DOCX file."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create document object without saving the file
        document_data = {
            'title': title,
            'file_type': file_type,
            'extracted_text': extracted_text,
            'original_filename': uploaded_file.name,
        }
        
        if request.user.is_authenticated:
            document_data['uploaded_by'] = request.user
        
        # Create document in database
        document = Document.objects.create(**document_data)
        
        # Serialize and return the document
        serializer = self.get_serializer(document)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def process_pdf_in_memory(self, file):
        """Process PDF file in memory without saving to disk."""
        try:
            # Create a BytesIO object from the content
            file_stream = BytesIO(file.read())
            
            # Extract text from the BytesIO object
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(file_stream)
            
            text = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() or ""  # Handle None return value
                # Add a newline between pages for better readability
                if page_num < len(pdf_reader.pages) - 1:
                    text += "\n\n"
            
            return text
        except Exception as e:
            return f"Error extracting text from PDF: {str(e)}"
    
    def process_docx_in_memory(self, file):
        """Process DOCX file in memory without saving to disk."""
        try:
            # Create a BytesIO object from the content
            file_stream = BytesIO(file.read())
            
            # Extract text from the BytesIO object
            import docx
            doc = docx.Document(file_stream)
            
            text = ""
            for para in doc.paragraphs:
                if para.text:
                    text += para.text + "\n"
            
            return text
        except Exception as e:
            return f"Error extracting text from DOCX: {str(e)}"
    
    @action(detail=True, methods=['get'])
    def extracted_text(self, request, pk=None):
        """Return only the extracted text for a document."""
        document = self.get_object()
        serializer = DocumentTextSerializer(document)
        return Response(serializer.data)
        
    @action(detail=True, methods=['get'])
    def download_text(self, request, pk=None):
        """Download the extracted text as a plain text file."""
        document = self.get_object()
        response = HttpResponse(document.extracted_text, content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="{document.title}_extracted.txt"'
        return response
