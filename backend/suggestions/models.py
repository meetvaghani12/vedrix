from django.db import models

# Create your models here.

class Suggestion(models.Model):
    original_text = models.TextField()
    paraphrased_text = models.TextField()
    citation_text = models.TextField()
    source_url = models.URLField(max_length=512)
    source_title = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)
    document = models.ForeignKey('document_processor.Document', on_delete=models.CASCADE, related_name='suggestions')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Suggestion for {self.document.title if self.document else 'Unknown Document'}"
