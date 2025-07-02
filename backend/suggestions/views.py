from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Suggestion
from .serializers import SuggestionSerializer
import requests
import json
import logging
import os
from decouple import config
from datetime import datetime

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
            
            if not text or not matched_sources:
                return Response({'error': 'Missing required fields: text and matched_sources'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not document_id:
                return Response({'error': 'Missing required field: document_id'}, status=status.HTTP_400_BAD_REQUEST)

            suggestions = []
            rate_limited = False
            rate_limit_message = ""
            
            for source in matched_sources:
                matched_text = source.get('matchedText', [])
                if not matched_text:  # Skip if no matched text
                    continue
                    
                for text_segment in matched_text:
                    try:
                        # Generate paraphrased version
                        paraphrased = self._generate_paraphrase(text_segment)
                        
                        # Generate citation
                        citation = self._generate_citation(source)
                        
                        # Create suggestion
                        suggestion = Suggestion.objects.create(
                            original_text=text_segment,
                            paraphrased_text=paraphrased,
                            citation_text=citation,
                            source_url=source.get('url', ''),
                            source_title=source.get('title', ''),
                            document_id=document_id
                        )
                        suggestions.append(suggestion)
                    except Exception as e:
                        error_msg = str(e)
                        logger.error(f"Error processing text segment: {error_msg}")
                        if "rate limit exceeded" in error_msg.lower():
                            rate_limited = True
                            rate_limit_message = error_msg
                        continue

            if not suggestions:
                if rate_limited:
                    return Response({
                        'error': 'Rate limit exceeded',
                        'message': rate_limit_message,
                        'suggestions': []
                    }, status=status.HTTP_429_TOO_MANY_REQUESTS)
                return Response({
                    'error': 'No suggestions could be generated',
                    'suggestions': []
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(suggestions, many=True)
            return Response({
                'suggestions': serializer.data,
                'rate_limited': rate_limited,
                'rate_limit_message': rate_limit_message if rate_limited else None
            })

        except Exception as e:
            logger.exception("Error generating suggestions:")
            return Response(
                {'error': f'Internal server error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _generate_paraphrase(self, text: str) -> str:
        """Generate a paraphrased version of the text using OpenRouter."""
        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {config('OPENROUTER_API_KEY')}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": config('SITE_URL', default='http://localhost:3000'),
                    "X-Title": config('SITE_NAME', default='Plagiarism Checker'),
                },
                data=json.dumps({
                    "model": "deepseek/deepseek-chat-v3-0324:free",
                    "messages": [
                        {"role": "system", "content": "You are an expert academic writer helping to paraphrase text to avoid plagiarism while maintaining academic quality."},
                        {"role": "user", "content": f"Please rewrite the following text in a completely original way while maintaining the same meaning: {text}"}
                    ],
                })
            )
            
            if response.status_code == 429:
                error_data = response.json().get('error', {})
                reset_time = error_data.get('metadata', {}).get('headers', {}).get('X-RateLimit-Reset')
                if reset_time:
                    reset_time = datetime.fromtimestamp(int(reset_time)/1000).strftime('%Y-%m-%d %H:%M:%S')
                    raise Exception(f"API rate limit exceeded. Service will be available again at {reset_time}")
                else:
                    raise Exception("API rate limit exceeded. Please try again later.")
                    
            if response.status_code != 200:
                raise Exception(f"OpenRouter API error: {response.text}")
            
            return response.json()['choices'][0]['message']['content'].strip()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling OpenRouter API: {str(e)}")
            raise Exception(f"Error calling OpenRouter API: {str(e)}")

    def _generate_citation(self, source: dict) -> str:
        """Generate a proper academic citation for the source."""
        prompt = f"""
        Generate a proper academic citation (APA format) for the following source:
        
        Title: {source.get('title', '')}
        URL: {source.get('url', '')}
        Date: {datetime.utcnow().strftime('%Y-%m-%d')}
        
        Citation:
        """
        
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {config('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json",
                "HTTP-Referer": config('SITE_URL', default='http://localhost:3000'),
                "X-Title": config('SITE_NAME', default='Plagiarism Checker'),
            },
            data=json.dumps({
                "model": "deepseek/deepseek-chat-v3-0324:free",
                "messages": [
                    {"role": "system", "content": "You are an expert in academic citations. Generate an APA format citation."},
                    {"role": "user", "content": prompt}
                ],
            })
        )
        
        if response.status_code != 200:
            raise Exception(f"OpenRouter API error: {response.text}")
        
        return response.json()['choices'][0]['message']['content'].strip()
