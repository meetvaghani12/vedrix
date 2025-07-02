from typing import List, Dict, Any, Tuple
from openai import OpenAI
from suggestions.models import Suggestion
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self, api_key: str, site_url: str = "", site_name: str = ""):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )
        self.site_url = site_url
        self.site_name = site_name
        self.model = "moonshotai/kimi-dev-72b:free"

    def generate_suggestions(self, text: str, matched_sources: List[Dict[str, Any]], document_id: int = None) -> List[Suggestion]:
        """
        Generate AI-powered suggestions for plagiarism removal using DeepSeek model.
        Processes all matched content in a single request.
        
        Args:
            text: The original text to process
            matched_sources: List of matched sources with their text segments
            document_id: The ID of the document these suggestions are for
        """
        try:
            # Log input parameters for debugging
            logger.info(f"Starting suggestion generation for text of length: {len(text)}")
            logger.info(f"Number of matched sources: {len(matched_sources)}")
            logger.debug(f"Using model: {self.model}")
            
            # Validate input text
            if not text or not text.strip():
                logger.error("Input text is empty or whitespace")
                return []
                
            # Validate matched sources
            if not matched_sources:
                logger.error("No matched sources provided")
                return []
                
            # Validate document_id
            if not document_id:
                logger.error("No document_id provided")
                return []

            # Process each source's matched text
            combined_text = ""
            text_markers = []
            current_position = 0
            
            for source in matched_sources:
                matched_text = source.get('matchedText', [])
                if not isinstance(matched_text, list):
                    logger.warning(f"Invalid matchedText format for source {source.get('url')}. Converting to list.")
                    matched_text = [matched_text] if matched_text else []
                
                # Process each text segment
                for text_segment in matched_text:
                    if not text_segment or not isinstance(text_segment, str):
                        logger.warning(f"Skipping invalid text segment: {text_segment}")
                        continue
                        
                    text_segment = text_segment.strip()
                    if not text_segment:
                        continue
                        
                    if combined_text:
                        combined_text += "\n---\n"
                        current_position += 4
                    
                    combined_text += text_segment
                    text_markers.append({
                        'start': current_position,
                        'length': len(text_segment),
                        'source': source,
                        'original_text': text_segment
                    })
                    current_position += len(text_segment)

            if not combined_text:
                logger.error("No valid text segments found in matched_sources")
                return []

            logger.info(f"Processing {len(text_markers)} text segments")
            logger.debug(f"Combined text length: {len(combined_text)}")

            # Generate paraphrased version
            prompt = f"""
            Please rewrite each text segment below in a completely original way while maintaining the same meaning.
            Make it sound natural and academic. Ensure it is significantly different from the original to avoid plagiarism.
            
            IMPORTANT: You must separate each rewritten segment with a line containing only "---".
            Do not add any additional text, numbering, or labels.
            Just provide the rewritten segments separated by "---" lines.
            
            Original text segments:
            {combined_text}
            
            Rewritten text (remember to separate segments with "---"):
            """

            try:
                paraphrase_completion = self.client.chat.completions.create(
                    extra_headers={
                        "HTTP-Referer": self.site_url,
                        "X-Title": self.site_name,
                    },
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert academic writer helping to paraphrase text to avoid plagiarism while maintaining academic quality."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,  # Add some creativity but maintain coherence
                    max_tokens=4000  # Ensure enough tokens for response
                )
                
                if not paraphrase_completion or not paraphrase_completion.choices:
                    logger.error("No completion received from OpenAI API")
                    return []
                
                paraphrased_content = paraphrase_completion.choices[0].message.content.strip()
                if not paraphrased_content:
                    logger.error("Received empty response from LLM for paraphrasing")
                    return []
                    
                logger.debug(f"Raw LLM response length: {len(paraphrased_content)}")
                
            except Exception as e:
                logger.error(f"OpenAI API call failed: {str(e)}")
                raise Exception(f"OpenAI API call failed: {str(e)}")
            
            # Process the response with multiple separator attempts
            separators = ["\n---\n", "\n\n---\n\n", "---", "\n\n"]
            paraphrased_segments = None
            
            for separator in separators:
                segments = paraphrased_content.split(separator)
                segments = [seg.strip() for seg in segments if seg.strip()]  # Clean segments
                
                if len(segments) >= len(text_markers):
                    logger.debug(f"Found valid separator: {separator}")
                    paraphrased_segments = segments[:len(text_markers)]  # Trim to expected length
                    break
            
            if not paraphrased_segments:
                logger.error(f"Could not find valid separator pattern in LLM response")
                return []
            
            logger.info(f"Successfully processed {len(paraphrased_segments)} segments")

            # Generate citations
            unique_sources = {}
            for marker in text_markers:
                source_url = marker['source'].get('url', '')
                if source_url and source_url not in unique_sources:
                    unique_sources[source_url] = marker['source']

            if not unique_sources:
                logger.warning("No valid sources found for citation generation")
                return []

            citation_prompt = "Generate APA citations for the following sources:\n\n"
            source_urls = []
            for source in unique_sources.values():
                source_urls.append(source.get('url', ''))
                citation_prompt += f"""
                Title: {source.get('title', '')}
                URL: {source.get('url', '')}
                Date: {datetime.utcnow().strftime('%Y-%m-%d')}
                ---
                """
            
            try:
                citation_completion = self.client.chat.completions.create(
                    extra_headers={
                        "HTTP-Referer": self.site_url,
                        "X-Title": self.site_name,
                    },
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert in academic citations. Generate APA format citations."},
                        {"role": "user", "content": citation_prompt}
                    ]
                )
                
                citation_content = citation_completion.choices[0].message.content.strip()
                if not citation_content:
                    logger.error("Received empty response from LLM for citations")
                    return []
                    
            except Exception as e:
                logger.error(f"OpenAI API call failed during citation generation: {str(e)}")
                raise Exception(f"OpenAI API call failed during citation generation: {str(e)}")
            
            citations = [cit.strip() for cit in citation_content.split("\n---\n") if cit.strip()]
            logger.debug(f"Received {len(citations)} citations")
            
            # Create citation mapping
            citation_map = {}
            for i, url in enumerate(source_urls):
                if i < len(citations):
                    citation_map[url] = citations[i]
                else:
                    citation_map[url] = f"Retrieved from {url}"  # Fallback citation
            
            # Create suggestions
            suggestions = []
            for i, marker in enumerate(text_markers):
                if i >= len(paraphrased_segments):
                    break
                    
                try:
                    source_url = marker['source'].get('url', '')
                    suggestion = Suggestion.objects.create(
                        original_text=marker['original_text'],
                        paraphrased_text=paraphrased_segments[i],
                        citation_text=citation_map.get(source_url, f"Retrieved from {source_url}"),
                        source_url=source_url,
                        source_title=marker['source'].get('title', ''),
                        document_id=document_id
                    )
                    suggestions.append(suggestion)
                except Exception as e:
                    logger.error(f"Error creating suggestion {i}: {str(e)}")
                    continue
            
            if not suggestions:
                logger.warning("No suggestions were created despite having valid responses")
                return []
                
            logger.info(f"Successfully created {len(suggestions)} suggestions")
            return suggestions
            
        except Exception as e:
            logger.error(f"Error in generate_suggestions: {str(e)}", exc_info=True)
            raise Exception(f"Failed to generate suggestions: {str(e)}")

    def _batch_generate(self, batch_data: List[Dict[str, Any]]) -> Tuple[List[str], List[str]]:
        """
        Generate paraphrases and citations for multiple texts in a single request.
        """
        # Prepare the batch prompt
        batch_prompt = {
            "texts": [],
            "sources": []
        }
        
        for data in batch_data:
            batch_prompt["texts"].append(data['text'])
            batch_prompt["sources"].append({
                "title": data['source'].get('title', ''),
                "url": data['source'].get('url', ''),
                "date": datetime.utcnow().strftime('%Y-%m-%d')
            })
        
        prompt = f"""
        Process the following batch of texts and sources to generate paraphrases and citations.
        Each paraphrase should be completely original while maintaining the same meaning.
        Each citation should be in APA format.
        
        Input batch:
        {json.dumps(batch_prompt, indent=2)}
        
        Please respond with a JSON object in this exact format:
        {{
            "paraphrases": ["paraphrase1", "paraphrase2", ...],
            "citations": ["citation1", "citation2", ...]
        }}
        
        Make sure to maintain the same order as the input texts.
        """
        
        completion = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": self.site_url,
                "X-Title": self.site_name,
            },
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert academic writer helping to paraphrase texts and generate citations. Always respond in the exact JSON format requested."},
                {"role": "user", "content": prompt}
            ]
        )
        
        try:
            response = json.loads(completion.choices[0].message.content.strip())
            return response["paraphrases"], response["citations"]
        except (json.JSONDecodeError, KeyError) as e:
            # Fallback to individual processing if batch processing fails
            paraphrases = []
            citations = []
            
            for data in batch_data:
                paraphrases.append(self._generate_paraphrase(data['text']))
                citations.append(self._generate_citation(data['source']))
            
            return paraphrases, citations

    def _generate_paraphrase(self, text: str) -> str:
        """
        Fallback method for individual paraphrase generation.
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
        Fallback method for individual citation generation.
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