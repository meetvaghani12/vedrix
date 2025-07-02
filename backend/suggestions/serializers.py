from rest_framework import serializers
from .models import Suggestion

class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = ['id', 'original_text', 'paraphrased_text', 'citation_text', 'source_url', 'source_title', 'created_at'] 