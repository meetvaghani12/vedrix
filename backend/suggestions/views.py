from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Suggestion
from .serializers import SuggestionSerializer
import logging
from decouple import config
from services.llm_service import LLMService

logger = logging.getLogger(__name__)

class SuggestionViewSet(viewsets.ModelViewSet):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        try:
            text = request.data.get('text')
            matched_sources = request.data.get('matched_sources', [])
            document_id = request.data.get('document_id')
            
            # Log request data for debugging
            logger.debug(f"Received generate request with text length: {len(text) if text else 0}")
            logger.debug(f"Number of matched sources: {len(matched_sources)}")
            logger.debug(f"Document ID: {document_id}")
            
            if not text:
                logger.warning("Missing required field: text")
                return Response({'error': 'Missing required field: text'}, status=status.HTTP_400_BAD_REQUEST)
                
            if not matched_sources:
                logger.warning("Missing required field: matched_sources")
                return Response({'error': 'Missing required field: matched_sources'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not document_id:
                logger.warning("Missing required field: document_id")
                return Response({'error': 'Missing required field: document_id'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate matched_sources structure
            if not isinstance(matched_sources, list):
                logger.error(f"Invalid matched_sources format. Expected list, got {type(matched_sources)}")
                return Response(
                    {'error': 'Invalid matched_sources format. Expected a list.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Initialize LLM service
            llm_service = LLMService(
                api_key=config('OPENROUTER_API_KEY'),
                site_url=config('SITE_URL', default='http://localhost:3000'),
                site_name=config('SITE_NAME', default='Plagiarism Checker')
            )

            try:
                # Generate suggestions with document_id
                suggestions = llm_service.generate_suggestions(text, matched_sources, document_id)
                
                if not suggestions:
                    logger.warning("No suggestions were generated")
                    return Response({
                        'suggestions': [],
                        'rate_limited': False,
                        'rate_limit_message': None,
                        'warning': 'No suggestions could be generated. Please check your input text and matched sources.'
                    })

                serializer = self.get_serializer(suggestions, many=True)
                logger.info(f"Successfully generated {len(suggestions)} suggestions")
                return Response({
                    'suggestions': serializer.data,
                    'rate_limited': False,
                    'rate_limit_message': None
                })

            except Exception as e:
                error_msg = str(e)
                logger.error(f"Error generating suggestions: {error_msg}", exc_info=True)
                if "rate limit exceeded" in error_msg.lower():
                    return Response({
                        'error': 'Rate limit exceeded',
                        'message': error_msg,
                        'suggestions': []
                    }, status=status.HTTP_429_TOO_MANY_REQUESTS)
                    
                if "Failed to generate suggestions" in error_msg:
                    return Response({
                        'error': 'Failed to generate suggestions',
                        'message': error_msg,
                        'suggestions': []
                    }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
                raise

        except Exception as e:
            logger.exception("Unexpected error in generate endpoint:")
            return Response(
                {
                    'error': 'Internal server error',
                    'message': str(e),
                    'suggestions': []
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
