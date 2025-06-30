from django.shortcuts import render
import os
from io import BytesIO
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, parser_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from .models import Document
from .serializers import DocumentSerializer, DocumentTextSerializer
from .utils import extract_text_from_pdf, extract_text_from_docx, extract_text_from_doc
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncMonth
from django.db import models

# Create your views here.

class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for handling document operations."""
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]  # Change to require authentication
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """Filter documents to only show those uploaded by the current user."""
        return Document.objects.filter(uploaded_by=self.request.user)
    
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
        
        # Calculate originality score (implement your plagiarism detection logic here)
        originality_score = self.calculate_originality_score(extracted_text)
        
        # Create document object without saving the file
        document_data = {
            'title': title,
            'file_type': file_type,
            'extracted_text': extracted_text,
            'original_filename': uploaded_file.name,
            'uploaded_by': request.user,
            'originality_score': originality_score
        }
        
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

    def calculate_originality_score(self, text):
        """
        Calculate originality score for the given text.
        This is a placeholder implementation - you should replace this with your actual
        plagiarism detection logic.
        """
        # For now, return a random score between 70 and 100 as an example
        import random
        return random.uniform(70, 100)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_data(request):
    # Get user's documents
    user_documents = Document.objects.filter(uploaded_by=request.user)
    
    # Get recent documents
    recent_documents = user_documents.order_by('-uploaded_at')[:4]
    recent_docs_data = [{
        'id': doc.id,
        'name': doc.title,
        'date': doc.uploaded_at.strftime('%Y-%m-%d'),
        'score': doc.originality_score  # Use the actual originality score
    } for doc in recent_documents]
    
    # Calculate total documents
    total_documents = user_documents.count()
    
    # Calculate monthly trend
    last_month = timezone.now() - timedelta(days=30)
    recent_scans = user_documents.filter(uploaded_at__gte=last_month).count()
    
    # Calculate month-over-month change
    previous_month = last_month - timedelta(days=30)
    previous_month_scans = user_documents.filter(
        uploaded_at__gte=previous_month,
        uploaded_at__lt=last_month
    ).count()
    
    scan_change = ((recent_scans - previous_month_scans) / max(previous_month_scans, 1)) * 100 if previous_month_scans else 0
    
    # Calculate real average originality score
    avg_originality = user_documents.aggregate(
        avg_score=models.Avg('originality_score')
    )['avg_score'] or 100.0  # Default to 100 if no documents exist
    
    return Response({
        'recentDocuments': recent_docs_data,
        'stats': {
            'totalDocuments': total_documents,
            'recentScans': recent_scans,
            'scanChange': scan_change,
            'avgOriginality': round(avg_originality, 1)  # Round to 1 decimal place
        }
    })
