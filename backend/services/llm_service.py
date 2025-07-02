from typing import List, Dict, Any
from openai import OpenAI
from models.suggestion import Suggestion
from models.database import db
from datetime import datetime

class LLMService:
    def __init__(self, api_key: str, site_url: str = "", site_name: str = ""):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )
        self.site_url = site_url
        self.site_name = site_name
        self.model = "moonshotai/kimi-dev-72b:free"

    def generate_suggestions(self, text: str, matched_sources: List[Dict[str, Any]]) -> List[Suggestion]:
        """
        Generate AI-powered suggestions for plagiarism removal using DeepSeek model.
        """
        suggestions = []
        
        for source in matched_sources:
            matched_text = source.get('matchedText', [])
            for text_segment in matched_text:
                # Generate paraphrased version
                paraphrased = self._generate_paraphrase(text_segment)
                
                # Generate citation
                citation = self._generate_citation(source)
                
                # Create and store suggestion
                suggestion = Suggestion(
                    original_text=text_segment,
                    paraphrased_text=paraphrased,
                    citation_text=citation,
                    source_url=source.get('url', ''),
                    source_title=source.get('title', ''),
                    created_at=datetime.utcnow()
                )
                
                db.session.add(suggestion)
                suggestions.append(suggestion)
        
        db.session.commit()
        return suggestions

    def _generate_paraphrase(self, text: str) -> str:
        """
        Generate a paraphrased version of the text using DeepSeek model.
        """
        prompt = f"""
        Please rewrite the following text in a completely original way while maintaining the same meaning.
        Make it sound natural and academic. Ensure it is significantly different from the original to avoid plagiarism.
        
        Original text:
        {text}
        
        Rewritten text:
        """
        
        completion = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": self.site_url,
                "X-Title": self.site_name,
            },
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert academic writer helping to paraphrase text to avoid plagiarism while maintaining academic quality."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return completion.choices[0].message.content.strip()

    def _generate_citation(self, source: Dict[str, Any]) -> str:
        """
        Generate a proper academic citation for the source.
        """
        prompt = f"""
        Generate a proper academic citation (APA format) for the following source:
        
        Title: {source.get('title', '')}
        URL: {source.get('url', '')}
        Date: {datetime.utcnow().strftime('%Y-%m-%d')}
        
        Citation:
        """
        
        completion = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": self.site_url,
                "X-Title": self.site_name,
            },
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert in academic citations. Generate an APA format citation."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return completion.choices[0].message.content.strip() 