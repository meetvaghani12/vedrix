import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, MessageSquare, RotateCcw, Bookmark, BookOpen, FileText, Code, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Define environment variables for TypeScript
declare global {
  interface Window {
    env: {
      REACT_APP_GOOGLE_API_KEY?: string;
      REACT_APP_GOOGLE_SEARCH_ENGINE_ID?: string;
    }
  }
}

// Get API keys from environment variables
const getApiKey = (): string => {
  try {
    // Try to access from window.env first
    if (window.env?.REACT_APP_GOOGLE_API_KEY) {
      return window.env.REACT_APP_GOOGLE_API_KEY;
    }
    
    // Try to access from import.meta.env (for Vite)
    // @ts-ignore - Ignore TypeScript errors for environment variable access
    const envApiKey = import.meta?.env?.REACT_APP_GOOGLE_API_KEY || 
                     import.meta?.env?.VITE_GOOGLE_API_KEY;
    
    return envApiKey || '';
  } catch (error) {
    console.error('Error accessing API key:', error);
    return '';
  }
};

const getSearchEngineId = (): string => {
  try {
    // Try to access from window.env first
    if (window.env?.REACT_APP_GOOGLE_SEARCH_ENGINE_ID) {
      return window.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;
    }
    
    // Try to access from import.meta.env (for Vite)
    // @ts-ignore - Ignore TypeScript errors for environment variable access
    const envSearchEngineId = import.meta?.env?.REACT_APP_GOOGLE_SEARCH_ENGINE_ID || 
                             import.meta?.env?.VITE_GOOGLE_SEARCH_ENGINE_ID;
    
    return envSearchEngineId || '';
  } catch (error) {
    console.error('Error accessing Search Engine ID:', error);
    return '';
  }
};

// Helper function for PDF text wrapping
const addWrappedText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return y + (lines.length * lineHeight);
};

// Helper function to process text for PDF display
const processTextForPDF = (text: string): string => {
  // Replace HTML entities
  let processedText = text.replace(/&nbsp;/g, ' ')
                         .replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'");
  
  // Normalize line breaks
  processedText = processedText.replace(/\r\n/g, '\n');
  processedText = processedText.replace(/\r/g, '\n');
  
  // Ensure paragraph breaks are preserved with double line breaks
  processedText = processedText.replace(/\n\s*\n/g, '\n\n');
  
  // Remove excessive whitespace
  processedText = processedText.replace(/[ \t]+/g, ' ');
  processedText = processedText.replace(/^\s+/gm, ''); // Remove leading spaces on each line
  
  // Ensure there's a space after each sentence period for readability
  processedText = processedText.replace(/\.([A-Z])/g, '. $1');
  
  return processedText;
};

/**
 * Breaks a list of sentences into meaningful chunks for similarity detection
 * @param sentences List of cleaned sentences to chunk
 * @param minSize Minimum number of sentences per chunk (default: 3)
 * @param maxSize Maximum number of sentences per chunk (default: 5)
 * @returns Object with chunks array
 */
interface ChunkedText {
  chunks: string[];
}

const chunkTextForSimilaritySearch = (
  sentences: string[],
  minSize: number = 3,
  maxSize: number = 5
): ChunkedText => {
  // Handle edge cases
  if (!sentences || sentences.length === 0) {
    return { chunks: [] };
  }
  
  if (sentences.length <= maxSize) {
    // If we have fewer sentences than maxSize, return as a single chunk
    return { chunks: [sentences.join(' ')] };
  }
  
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  
  // Try to detect paragraph breaks (capital letter after period) to create better chunk boundaries
  const isParagraphStart = (index: number): boolean => {
    if (index === 0) return true;
    
    const prevSentence = sentences[index - 1];
    // Check if previous sentence ends with a period and current starts with capital
    return prevSentence.trim().endsWith('.') && 
           /^[A-Z]/.test(sentences[index].trim());
  };
  
  // Process sentences into chunks
  for (let i = 0; i < sentences.length; i++) {
    currentChunk.push(sentences[i]);
    
    // Determine if we should complete the current chunk
    const isLastSentence = i === sentences.length - 1;
    const reachedMaxSize = currentChunk.length >= maxSize;
    const atGoodBreakPoint = currentChunk.length >= minSize && isParagraphStart(i + 1);
    
    if (isLastSentence || reachedMaxSize || atGoodBreakPoint) {
      // Add the current chunk to our list of chunks
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
    }
  }
  
  // Handle any remaining sentences (should only happen if < minSize remaining)
  if (currentChunk.length > 0) {
    // If we have a small remainder, merge with the last chunk if possible
    if (currentChunk.length < minSize && chunks.length > 0) {
      const lastChunk = chunks.pop()!.split(' ');
      const combinedChunk = [...lastChunk, ...currentChunk].join(' ');
      chunks.push(combinedChunk);
    } else {
      chunks.push(currentChunk.join(' '));
    }
  }
  
  return { chunks };
};

// English stopwords list
const ENGLISH_STOPWORDS = [
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 
  'to', 'from', 'by', 'with', 'in', 'out', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
  'should', 'now', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
  'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'would',
  'could', 'should', 'ought', 'i\'m', 'you\'re', 'he\'s', 'she\'s',
  'it\'s', 'we\'re', 'they\'re', 'i\'ve', 'you\'ve', 'we\'ve', 'they\'ve',
  'i\'d', 'you\'d', 'he\'d', 'she\'d', 'we\'d', 'they\'d', 'i\'ll',
  'you\'ll', 'he\'ll', 'she\'ll', 'we\'ll', 'they\'ll', 'isn\'t', 'aren\'t',
  'wasn\'t', 'weren\'t', 'hasn\'t', 'haven\'t', 'hadn\'t', 'doesn\'t',
  'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'shan\'t', 'shouldn\'t',
  'can\'t', 'cannot', 'couldn\'t', 'mustn\'t', 'let\'s', 'that\'s',
  'who\'s', 'what\'s', 'here\'s', 'there\'s', 'when\'s', 'where\'s',
  'why\'s', 'how\'s'
];

// NLP text processing utility
interface ProcessedText {
  cleaned_text: string;
  sentences: string[];
  tokens: string[][];
}

const processTextNLP = (text: string, removeStopwords: boolean = false): ProcessedText => {
  // Step 1: Clean the text
  // Normalize whitespace and line breaks
  let cleanedText = text.replace(/\r\n/g, ' ').replace(/\r/g, ' ').replace(/\n/g, ' ');
  
  // Remove extra whitespace
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  // Remove special characters except basic punctuation
  cleanedText = cleanedText.replace(/[^\w\s.,?!;:'"()-]/g, '');
  
  // Convert to lowercase
  cleanedText = cleanedText.toLowerCase();
  
  // Step 2: Tokenize into sentences
  // Use regex to split on sentence boundaries
  const sentenceRegex = /[.!?]+\s+/g;
  let sentences = cleanedText.split(sentenceRegex).filter(Boolean);
  
  // Clean up sentences
  sentences = sentences.map(sentence => {
    let cleanSentence = sentence.trim();
    // Add period if sentence doesn't end with punctuation
    if (!/[.!?]$/.test(cleanSentence)) {
      cleanSentence += '.';
    }
    // Ensure first letter is capitalized
    return cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1);
  });
  
  // Step 3: Tokenize each sentence into words
  const tokens = sentences.map(sentence => {
    // Remove punctuation for tokenization
    const cleanSentence = sentence.replace(/[.,!?;:'"()-]/g, '');
    // Split into words
    let words = cleanSentence.split(/\s+/).filter(Boolean);
    
    // Remove stopwords if requested
    if (removeStopwords) {
      words = words.filter(word => !ENGLISH_STOPWORDS.includes(word.toLowerCase()));
    }
    
    return words;
  });
  
  return {
    cleaned_text: sentences.join(' '),
    sentences,
    tokens
  };
};

interface Source {
  id: number;
  title: string;
  url: string;
  matchPercentage: number;
  matchedText: string[];
}

// Interface for Google Search API configuration
interface GoogleSearchConfig {
  apiKey: string;
  searchEngineId: string;
  maxResults?: number;
}

// Interface for search result
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  htmlSnippet?: string;
  formattedUrl?: string;
  source?: string;
}

// Interface for chunk search results
interface ChunkSearchResults {
  chunkId: number;
  chunkText: string;
  query: string;
  results: SearchResult[];
  error?: string;
}

// Add this function after the imports and before the component
const updateScoreInDatabase = async (score: number) => {
  const documentId = sessionStorage.getItem('documentId');
  const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
  
  if (!documentId) {
    console.error('No document ID found in session storage');
    return;
  }

  if (!token) {
    console.error('No auth token found');
    return;
  }

  console.log('Attempting to update score:', {
    documentId,
    score,
    hasToken: !!token,
    url: `http://localhost:8000/api/documents/${documentId}/update_originality_score/`
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  console.log('Request headers:', headers);

  try {
    const response = await fetch(`http://localhost:8000/api/documents/${documentId}/update_originality_score/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        score: score
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(`Failed to update score: ${response.status} - ${JSON.stringify(data)}`);
    }

    console.log('Score updated successfully:', data);
  } catch (error) {
    console.error('Error updating originality score:', error);
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  }
};

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [originalText, setOriginalText] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [originalFilename, setOriginalFilename] = useState<string>('');
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [processedJSON, setProcessedJSON] = useState<string>('');
  const [showJSON, setShowJSON] = useState<boolean>(false);
  const [chunkedJSON, setChunkedJSON] = useState<string>('');
  const [showChunks, setShowChunks] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<ChunkSearchResults[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [searchConfig, setSearchConfig] = useState<GoogleSearchConfig>({
    apiKey: getApiKey(),
    searchEngineId: getSearchEngineId(),
    maxResults: 5
  });
  const [configError, setConfigError] = useState<string>('');
  const [showSearchConfig, setShowSearchConfig] = useState<boolean>(false);
  const [searchProgress, setSearchProgress] = useState(0);

  // Load data from session storage or use simulated data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Try to get extracted text from session storage
      const extractedText = sessionStorage.getItem('extractedText');
      const filename = sessionStorage.getItem('originalFilename');
      
      if (filename) {
        setOriginalFilename(filename);
      }
      
      // If we have extracted text from the upload, use it
      if (extractedText) {
        setOriginalText(extractedText);
        
        // Start plagiarism detection immediately if API keys are available
        const apiKey = getApiKey();
        const searchEngineId = getSearchEngineId();
        
        if (apiKey && searchEngineId) {
          console.log('API keys available - running actual plagiarism analysis');
        } else {
          console.log('API keys not available - cannot perform plagiarism analysis');
          // Initialize with empty sources until API can be called
          setSources([]);
          setOverallScore(100); // Default to 100% original
        }
      } else {
        // No extracted text available, can't proceed with analysis
        console.error('No extracted text available for analysis');
        setOriginalText('');
        setSources([]);
        setOverallScore(100);
      }
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Automatically search for similar content when document is loaded
  useEffect(() => {
    // Only run this effect when originalText is available and we're not loading
    if (originalText && !isLoading) {
      // Check if API keys are available
      const apiKey = getApiKey();
      const searchEngineId = getSearchEngineId();
      
      if (apiKey && searchEngineId) {
        // If keys are available, perform real search
        performSimilaritySearch();
      } else {
        // If keys are not available, we can't perform analysis
        console.log('API keys not available - cannot perform plagiarism analysis');
      }
    }
  }, [originalText, isLoading]);

  // Function to perform similarity search
  const performSimilaritySearch = async () => {
    const apiKey = window.env?.REACT_APP_GOOGLE_API_KEY || getApiKey();
    const searchEngineId = window.env?.REACT_APP_GOOGLE_SEARCH_ENGINE_ID || getSearchEngineId();
    
    if (!apiKey || !searchEngineId) {
      console.error('Google Search API keys not configured in environment variables');
      return;
    }
    
    setIsSearching(true);
    setSearchProgress(0);

    // Progress simulation interval
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 1000);

    try {
      // First tokenize the text into sentences
      const { sentences } = processTextNLP(originalText, false);
      
      // Then chunk the sentences
      const { chunks } = chunkTextForSimilaritySearch(sentences);
      
      // Start the search process with rate limiting
      const results = await batchSearchSimilarContent(chunks, {
        apiKey,
        searchEngineId,
        maxResults: searchConfig.maxResults
      });
      
      // Update state with results
      setSearchResults(results);
      
      // Update sources based on search results
      updateSourcesFromSearchResults(results);
      
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      // If we found sources, use them
      if (sources.length > 0) {
        setSources(sources);
        
        // Calculate overall plagiarism score based on total matched text
        const totalTextLength = originalText.length;
        let totalMatchedLength = 0;
        
        results.forEach(chunkResult => {
          chunkResult.results.forEach(result => {
            // Calculate similarity score using text comparison algorithms
            const matchScore = calculateSimilarityScore(chunkResult.chunkText, result.snippet);
            
            // Calculate match percentage based on chunk length and match score
            const chunkLength = chunkResult.chunkText.length;
            const effectiveMatchLength = chunkLength * matchScore;
            totalMatchedLength += effectiveMatchLength;
          });
        });
        
        const overallMatchPercentage = Math.min(100, Math.round((totalMatchedLength / totalTextLength) * 100));
        
        // Originality score is inverse of match percentage
        const newScore = 100 - overallMatchPercentage;
        
        // Apply score with minimum threshold
        const finalScore = Math.max(newScore, 5);
        setOverallScore(finalScore);
        
        // Update score in database
        await updateScoreInDatabase(finalScore);
        
        console.log(`Calculated plagiarism score: ${overallMatchPercentage}%, originality: ${newScore}%`);
      }
    } catch (error) {
      console.error('Error performing similarity search:', error);
      clearInterval(progressInterval);
      setSearchProgress(0);
    } finally {
      setIsSearching(false);
    }
  };

  // Update sources based on search results
  const updateSourcesFromSearchResults = async (results: ChunkSearchResults[]) => {
    // Create new sources from search results
    const newSources: Source[] = [];
    let sourceId = 1;
    
    // Track total text length for percentage calculations
    const totalTextLength = originalText.length;
    let totalMatchedLength = 0;
    
    // Store matched text segments for highlighting
    const matchedSegments: {text: string, sourceId: number}[] = [];
    
    results.forEach(chunkResult => {
      chunkResult.results.forEach(result => {
        // Calculate similarity score using text comparison algorithms
        const matchScore = calculateSimilarityScore(chunkResult.chunkText, result.snippet);
        
        // Calculate match percentage based on chunk length and match score
        const chunkLength = chunkResult.chunkText.length;
        const effectiveMatchLength = chunkLength * matchScore;
        totalMatchedLength += effectiveMatchLength;
        
        // Convert to percentage (0-100)
        const matchPercentage = Math.round(matchScore * 100);
        
        // Only include sources with significant matches
        if (matchPercentage > 3) {
          const sourceId = newSources.length + 1;
          
          // Find specific matching text segments
          const matchedTextSegments = findMatchingSegments(chunkResult.chunkText, result.snippet);
          
          newSources.push({
            id: sourceId,
            title: result.title,
            url: result.link,
            matchPercentage,
            matchedText: matchedTextSegments.length > 0 ? matchedTextSegments : [result.snippet]
          });
          
          // Store matched segments for highlighting
          matchedTextSegments.forEach(segment => {
            matchedSegments.push({
              text: segment,
              sourceId
            });
          });
        }
      });
    });
    
    // If we found sources, use them
    if (newSources.length > 0) {
      setSources(newSources);
      
      // Calculate overall plagiarism score based on total matched text
      const overallMatchPercentage = Math.min(100, Math.round((totalMatchedLength / totalTextLength) * 100));
      
      // Originality score is inverse of match percentage
      const newScore = 100 - overallMatchPercentage;
      
      // Apply score with minimum threshold
      const finalScore = Math.max(newScore, 5);
      setOverallScore(finalScore);
      
      // Update score in database
      await updateScoreInDatabase(finalScore);
      
      console.log(`Calculated plagiarism score: ${overallMatchPercentage}%, originality: ${newScore}%`);
    }
  };
  
  // Find specific matching text segments between two texts
  const findMatchingSegments = (text1: string, text2: string): string[] => {
    const segments: string[] = [];
    
    // Normalize texts
    const normalizedText1 = text1.toLowerCase();
    const normalizedText2 = text2.toLowerCase();
    
    // Extract phrases from text2 (3+ words)
    const phrases = extractPhrases(normalizedText2, 3);
    
    // Check each phrase for matches in text1
    for (const phrase of phrases) {
      if (phrase.length < 15) continue; // Skip very short phrases
      
      if (normalizedText1.includes(phrase)) {
        // Find the actual case-preserved text from original
        const startIndex = text1.toLowerCase().indexOf(phrase);
        if (startIndex >= 0) {
          const originalPhrase = text1.substring(startIndex, startIndex + phrase.length);
          if (!segments.includes(originalPhrase)) {
            segments.push(originalPhrase);
          }
        }
      }
    }
    
    return segments;
  };
  
  // Extract phrases of n or more words from text
  const extractPhrases = (text: string, minWords: number = 3): string[] => {
    const phrases: string[] = [];
    const words = text.split(/\s+/);
    
    // Generate phrases of increasing length
    for (let length = minWords; length <= words.length; length++) {
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(' ');
        phrases.push(phrase);
      }
    }
    
    return phrases;
  };
  
  // Calculate similarity between two text strings
  const calculateSimilarityScore = (text1: string, text2: string): number => {
    // Normalize texts for comparison
    const normalizedText1 = text1.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedText2 = text2.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // If either text is empty, no similarity
    if (!normalizedText1 || !normalizedText2) return 0;
    
    // Check for exact matches
    if (normalizedText1 === normalizedText2) return 1.0;
    
    // Check if one text contains the other
    if (normalizedText1.includes(normalizedText2)) {
      return normalizedText2.length / normalizedText1.length;
    }
    
    if (normalizedText2.includes(normalizedText1)) {
      return normalizedText1.length / normalizedText2.length;
    }
    
    // Calculate word overlap
    const words1 = normalizedText1.split(' ');
    const words2 = normalizedText2.split(' ');
    
    // Count matching words
    let matchCount = 0;
    const wordSet = new Set(words2);
    
    for (const word of words1) {
      if (wordSet.has(word) && word.length > 3) { // Only count significant words
        matchCount++;
      }
    }
    
    // Calculate Jaccard similarity coefficient
    const uniqueWords = new Set([...words1, ...words2]);
    const similarity = matchCount / uniqueWords.size;
    
    // Apply significance factor based on text lengths
    const lengthFactor = Math.min(normalizedText1.length, normalizedText2.length) / 
                        Math.max(normalizedText1.length, normalizedText2.length);
    
    // Combine factors with weights
    const weightedSimilarity = (similarity * 0.7) + (lengthFactor * 0.3);
    
    return weightedSimilarity;
  };

  const getHighlightedText = () => {
    if (!selectedSource) return originalText;
    
    const source = sources.find(s => s.id === selectedSource);
    if (!source) return originalText;
    
    let highlightedText = originalText;
    
    // Sort matched text segments by length (longest first) to avoid nested highlights
    const sortedMatches = [...source.matchedText].sort((a, b) => b.length - a.length);
    
    // Create a map to track which parts of the text have been highlighted
    const highlightedRanges: {start: number, end: number}[] = [];
    
    // Process each match
    sortedMatches.forEach(match => {
      if (match && match.trim().length > 10) { // Only highlight substantial matches
        // Find all occurrences of the match in the text
        let startIndex = 0;
        let currentIndex: number = -1;
        
        while ((currentIndex = highlightedText.indexOf(match, startIndex)) !== -1) {
          // Check if this range overlaps with any existing highlight
          const overlaps = highlightedRanges.some(range => 
            (currentIndex >= range.start && currentIndex < range.end) || 
            (currentIndex + match.length > range.start && currentIndex + match.length <= range.end)
          );
          
          if (!overlaps) {
            // Calculate the parts before, during, and after the match
            const before = highlightedText.substring(0, currentIndex);
            const highlighted = `<span class="bg-accent-100 dark:bg-accent-900/50 text-accent-800 dark:text-accent-100 px-1 rounded">${match}</span>`;
            const after = highlightedText.substring(currentIndex + match.length);
            
            // Reconstruct the text with the highlighted match
            highlightedText = before + highlighted + after;
            
            // Track this highlighted range
            highlightedRanges.push({
              start: currentIndex,
              end: currentIndex + highlighted.length
            });
            
            // Adjust the start index for the next search
            startIndex = currentIndex + highlighted.length;
          } else {
            // Skip this match and move to the next position
            startIndex = currentIndex + 1;
          }
        }
      }
    });
    
    return highlightedText;
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).length;
  };

  const getRandomSentence = (): string => {
    if (sources.length > 0 && sources[0].matchedText.length > 0) {
      return sources[0].matchedText[0];
    }
    
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      return sentences[Math.floor(Math.random() * sentences.length)].trim();
    }
    
    return "";
  };

  const getAlternativeSentence = (): string => {
    // Get a paraphrased version of the matched text
    // In a real implementation, this would call an API for paraphrasing
    const matchedText = getRandomSentence();
    
    if (!matchedText) {
      return "";
    }
    
    // Simple paraphrasing implementation
    return "Paraphrased version would appear here from a real paraphrasing API.";
  };

  const getCitationText = (): string => {
    if (sources.length > 0) {
      const source = sources[0];
      const currentYear = new Date().getFullYear();
      
      // Use actual source information for citation
      return `(${currentYear}). ${source.title}. Retrieved from ${source.url}`;
    }
    
    return "";
  };

  const handleRescan = () => {
    // Navigate back to the upload page
    navigate('/upload');
  };

  const handleDownloadReport = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Define constants for positioning
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add header with logo and title
      pdf.setFillColor(42, 72, 120); // Dark blue header
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Originality Report', margin, 22);
      
      // First page: Document information
      let yPos = 50;
      
      // Document info section
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Document Information', margin, yPos);
      yPos += 10;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // Document details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const details = [
        { label: 'File Name:', value: originalFilename || 'Document' },
        { label: 'Submission Date:', value: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() },
        { label: 'Word Count:', value: getWordCount(originalText).toString() },
        { label: 'Originality Score:', value: `${overallScore}%` },
        { label: 'Similarity Score:', value: `${100 - overallScore}%` },
        { label: 'Matched Sources:', value: sources.length.toString() }
      ];
      
      details.forEach(detail => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(detail.label, margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(detail.value, margin + 50, yPos);
        yPos += 8;
      });
      
      yPos += 10;
      
      // Score visualization
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Originality Score', margin, yPos);
      yPos += 10;
      
      // Draw score bar
      const barWidth = 150;
      const barHeight = 15;
      const barX = margin;
      const barY = yPos;
      
      // Background bar
      pdf.setFillColor(220, 220, 220);
      pdf.rect(barX, barY, barWidth, barHeight, 'F');
      
      // Score bar
      const scoreColor = overallScore > 80 ? [0, 176, 116] : overallScore > 50 ? [245, 158, 11] : [239, 68, 68];
      pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdf.rect(barX, barY, barWidth * (overallScore / 100), barHeight, 'F');
      
      // Score text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(`${overallScore}%`, barX + (barWidth * (overallScore / 100)) - 10, barY + barHeight - 4);
      
      yPos += barHeight + 15;
      
      // Summary text
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const summaryText = `This document has an originality score of ${overallScore}%. ${
        overallScore > 80 
          ? 'The document appears to be mostly original with minimal matched content.'
          : overallScore > 50
            ? 'The document contains some matched content that may require review or citation.'
            : 'The document contains significant matched content that requires extensive review and citation.'
      }`;
      
      yPos = addWrappedText(pdf, summaryText, margin, yPos, contentWidth, 6) + 10;
      
      // Add document text in the next page
      pdf.addPage();
      
      // Header for document text
      pdf.setFillColor(42, 72, 120);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Document Content', margin, 22);
      
      // Add document name in smaller text
      pdf.setFontSize(12);
      pdf.text(originalFilename || 'Document', pageWidth - margin, 22, { align: 'right' });
      
      yPos = 50;
      
      // Document text section
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Full Text', margin, yPos);
      yPos += 10;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // Document content
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Process the text to ensure proper formatting
      const documentText = processTextForPDF(originalText);
      
      // Create a function to add text with pagination
      const addDocumentText = (text: string, startY: number) => {
        let currentY = startY;
        let remainingText = text;
        let pageNum = 1;
        
        // Set up max height per page
        const maxY = pdf.internal.pageSize.getHeight() - 40; // Leave space for footer
        
        // Add text until all text is added
        while (remainingText.length > 0) {
          // Calculate how much text can fit on this page
          const textToFit = remainingText;
          const lineHeight = 5;
          const lines = pdf.splitTextToSize(textToFit, contentWidth);
          
          // Calculate how many lines can fit on current page
          const availableHeight = maxY - currentY;
          const maxLines = Math.floor(availableHeight / lineHeight);
          const linesForPage = lines.slice(0, maxLines);
          
          // Add the lines that fit on this page
          if (linesForPage.length > 0) {
            // Add each line with proper spacing
            for (let i = 0; i < linesForPage.length; i++) {
              pdf.text(linesForPage[i], margin, currentY);
              currentY += lineHeight;
            }
          }
          
          // Check if we've used all lines or have more remaining
          if (linesForPage.length < lines.length) {
            // We have more text that didn't fit
            remainingText = lines.slice(linesForPage.length).join(' ');
          } else {
            // All text has been processed
            remainingText = '';
          }
          
          // If there's more text, add a new page
          if (remainingText.length > 0) {
            pdf.addPage();
            pageNum++;
            
            // Add header to new page
            pdf.setFillColor(42, 72, 120);
            pdf.rect(0, 0, pageWidth, 35, 'F');
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Document Content (continued)', margin, 22);
            
            // Add document name in smaller text
            pdf.setFontSize(12);
            pdf.text(originalFilename || 'Document', pageWidth - margin, 22, { align: 'right' });
            
            // Reset Y position for new page
            currentY = 50;
            
            // Add section header to new page
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Full Text (continued)', margin, currentY);
            currentY += 10;
            
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 10;
            
            // Reset font for content
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
          }
        }
        
        return currentY;
      };
      
      // Start adding document text
      yPos = addDocumentText(documentText, yPos);
      
      // Add source matches in the next page
      pdf.addPage();
      
      // Header for matches
      pdf.setFillColor(42, 72, 120);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Matched Sources', margin, 22);
      
      yPos = 50;
      
      // Matches section
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Source Details', margin, yPos);
      yPos += 10;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // List each source and its matches
      if (sources.length === 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text('No matched sources found.', margin, yPos);
      } else {
        sources.forEach((source, index) => {
          // Source header
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          
          // Set color based on match percentage
          const sourceColor = source.matchPercentage > 20 ? [239, 68, 68] : source.matchPercentage > 10 ? [245, 158, 11] : [0, 176, 116];
          pdf.setTextColor(sourceColor[0], sourceColor[1], sourceColor[2]);
          
          pdf.text(`Source ${index + 1}: ${source.matchPercentage}% match`, margin, yPos);
          yPos += 8;
          
          // Source details
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Title:', margin, yPos);
          pdf.setFont('helvetica', 'normal');
          yPos = addWrappedText(pdf, source.title, margin + 30, yPos, contentWidth - 30, 5) + 5;
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('URL:', margin, yPos);
          pdf.setFont('helvetica', 'normal');
          yPos = addWrappedText(pdf, source.url, margin + 30, yPos, contentWidth - 30, 5) + 5;
          
          // Matched text
          pdf.setFont('helvetica', 'bold');
          pdf.text('Matched Text:', margin, yPos);
          yPos += 8;
          
          pdf.setFont('helvetica', 'normal');
          source.matchedText.forEach((match, i) => {
            if (match && match.trim()) {
              // Process match text for better display
              const processedMatch = processTextForPDF(match);
              
              pdf.setFillColor(255, 240, 240); // Light red background
              
              // Get text dimensions for the background
              const lines = pdf.splitTextToSize(processedMatch, contentWidth - 10);
              const textHeight = lines.length * 5;
              
              // Draw background
              pdf.rect(margin + 5, yPos - 4, contentWidth - 10, textHeight + 6, 'F');
              
              // Add matched text
              yPos = addWrappedText(pdf, `${i + 1}. "${processedMatch}"`, margin + 10, yPos, contentWidth - 20, 5) + 8;
            }
          });
          
          yPos += 5;
          
          // Add separator between sources
          if (index < sources.length - 1) {
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;
          }
          
          // Check if we need a new page
          if (yPos > pdf.internal.pageSize.getHeight() - 30 && index < sources.length - 1) {
            pdf.addPage();
            
            // Header for new page
            pdf.setFillColor(42, 72, 120);
            pdf.rect(0, 0, pageWidth, 35, 'F');
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Matched Sources (continued)', margin, 22);
            
            yPos = 50;
          }
        });
      }
      
      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Footer line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, 280, pageWidth - margin, 280);
        
        // Footer text
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated by Vedrix | Page ${i} of ${totalPages} | ${new Date().toISOString().split('T')[0]}`, pageWidth / 2, 287, { align: 'center' });
      }
      
      // Save the PDF
      pdf.save(`${originalFilename ? originalFilename.split('.')[0] : 'document'}_report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleProcessText = () => {
    // Process the text using NLP
    const nlpResult = processTextNLP(originalText, true);
    
    // Convert to formatted JSON string
    const jsonOutput = JSON.stringify(nlpResult, null, 2);
    
    // Set the processed JSON
    setProcessedJSON(jsonOutput);
    setShowJSON(true);
  };

  const handleChunkText = () => {
    // First tokenize the text into sentences
    const { sentences } = processTextNLP(originalText, false);
    
    // Then chunk the sentences
    const chunkedResult = chunkTextForSimilaritySearch(sentences);
    
    // Convert to formatted JSON string
    const jsonOutput = JSON.stringify(chunkedResult, null, 2);
    
    // Set the chunked JSON
    setChunkedJSON(jsonOutput);
    setShowChunks(true);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(processedJSON);
    alert('JSON copied to clipboard!');
  };

  const handleCopyChunks = () => {
    navigator.clipboard.writeText(chunkedJSON);
    alert('Chunks copied to clipboard!');
  };

  const handleCloseJSON = () => {
    setShowJSON(false);
  };

  const handleCloseChunks = () => {
    setShowChunks(false);
  };

  // Helper function to search for similar content using Google Programmable Search API
  const searchSimilarContent = async (
    chunk: string,
    config: GoogleSearchConfig,
    chunkId: number = 0
  ): Promise<ChunkSearchResults> => {
    try {
      // Create a search query from the chunk
      // For better results, take first ~150 characters as they're often most relevant
      const queryText = chunk.substring(0, 150).trim();
      
      // Get the API keys from environment or config (double-check)
      const apiKey = window.env?.REACT_APP_GOOGLE_API_KEY || config.apiKey;
      const searchEngineId = window.env?.REACT_APP_GOOGLE_SEARCH_ENGINE_ID || config.searchEngineId;
      
      // Log the actual values being used (without exposing full keys)
      console.log(`Using API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);
      console.log(`Using Search Engine ID: ${searchEngineId.substring(0, 5)}...${searchEngineId.substring(searchEngineId.length - 4)}`);
      
      // Construct the API URL with parameters
      const url = new URL('https://www.googleapis.com/customsearch/v1');
      url.searchParams.append('key', apiKey);
      url.searchParams.append('cx', searchEngineId);
      url.searchParams.append('q', queryText);
      url.searchParams.append('num', String(config.maxResults || 5));
      
      // Send the request
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the search results
      const results: SearchResult[] = data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        htmlSnippet: item.htmlSnippet,
        formattedUrl: item.formattedUrl,
        source: item.displayLink
      })) || [];
      
      return {
        chunkId,
        chunkText: chunk,
        query: queryText,
        results
      };
    } catch (error) {
      console.error(`Error searching for chunk ${chunkId}:`, error);
      return {
        chunkId,
        chunkText: chunk,
        query: chunk.substring(0, 150).trim(),
        results: [],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  };

  // Helper function to search for similar content for multiple chunks with rate limiting
  const batchSearchSimilarContent = async (
    chunks: string[],
    config: GoogleSearchConfig,
    delayMs: number = 2000
  ): Promise<ChunkSearchResults[]> => {
    const results: ChunkSearchResults[] = [];
    
    // Process chunks sequentially with delay to respect rate limits
    for (let i = 0; i < chunks.length; i++) {
      try {
        // Search for the current chunk
        const result = await searchSimilarContent(chunks[i], config, i);
        results.push(result);
        
        // Log progress
        console.log(`Processed chunk ${i + 1}/${chunks.length}`);
        
        // Add delay between requests (except for the last one)
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`Error processing chunk ${i}:`, error);
        results.push({
          chunkId: i,
          chunkText: chunks[i],
          query: chunks[i].substring(0, 150).trim(),
          results: [],
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return results;
  };

  // Handle search for similar content
  const handleSearchSimilarContent = async () => {
    // Validate API key and Search Engine ID
    if (!searchConfig.apiKey) {
      setConfigError('API Key is required');
      return;
    }
    
    if (!searchConfig.searchEngineId) {
      setConfigError('Search Engine ID is required');
      return;
    }
    
    setConfigError('');
    setIsSearching(true);
    
    try {
      // First tokenize the text into sentences
      const { sentences } = processTextNLP(originalText, false);
      
      // Then chunk the sentences
      const { chunks } = chunkTextForSimilaritySearch(sentences);
      
      // Start the search process with rate limiting
      const results = await batchSearchSimilarContent(chunks, searchConfig);
      
      // Update state with results
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching for similar content:', error);
      setConfigError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSearching(false);
    }
  };

  // Handle API key change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchConfig(prev => ({ ...prev, apiKey: e.target.value }));
  };

  // Handle Search Engine ID change
  const handleSearchEngineIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchConfig(prev => ({ ...prev, searchEngineId: e.target.value }));
  };

  // Handle max results change
  const handleMaxResultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSearchConfig(prev => ({ ...prev, maxResults: isNaN(value) ? 5 : value }));
  };

  // Close search results modal
  const handleCloseSearchResults = () => {
    setShowSearchResults(false);
  };

  if (isLoading || isSearching) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary-500"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * (isLoading ? 100 : searchProgress)) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {isLoading ? '' : `${searchProgress}%`}
                </span>
              </div>
            </div>
          </div>
          <p className="text-lg font-medium text-dark-900 dark:text-dark-100 mb-2">
            {isLoading ? 'Loading document...' : 'Analyzing document...'}
          </p>
          <p className="text-sm text-dark-600 dark:text-dark-400">
            {isLoading 
              ? 'Please wait while we prepare your document'
              : searchProgress < 50
                ? 'Searching for similar content...'
                : searchProgress < 80
                  ? 'Comparing text segments...'
                  : 'Calculating originality score...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora">
            Plagiarism Analysis Results
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Review your document's originality score and any matching sources detected.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-8" ref={reportRef}>
            <Card variant="glass" className="p-6 mb-6">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-dark-800 dark:text-dark-200">
                  Document Analysis
                </h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleDownloadReport}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? 'Generating...' : 'Download Report'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleRescan}
                  >
                    Rescan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Code className="w-4 h-4" />}
                    onClick={handleProcessText}
                  >
                    Process Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<FileText className="w-4 h-4" />}
                    onClick={handleChunkText}
                  >
                    Chunk Text
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-dark-500 mr-2" />
                  <h3 className="font-medium text-dark-700 dark:text-dark-300">
                    {originalFilename || "Document.pdf"}
                  </h3>
                </div>
                <div className="text-sm text-dark-500 dark:text-dark-400">
                  Scanned on {new Date().toLocaleDateString()} • {getWordCount(originalText)} words
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-4 overflow-auto max-h-[500px]">
                <div className="prose prose-sm max-w-none dark:prose-invert text-dark-800 dark:text-dark-200">
                  <div dangerouslySetInnerHTML={{ __html: getHighlightedText() }} />
                </div>
              </div>
            </Card>
            
            <Card variant="neumorphic" className="p-6">
              <h2 className="text-xl font-semibold text-dark-800 dark:text-dark-200 mb-4">
                AI-Powered Suggestions
              </h2>
              {sources.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-4">
                    <h4 className="font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Paraphrasing Suggestion
                    </h4>
                    <p className="text-dark-600 dark:text-dark-400 mb-3">
                      Consider revising this highlighted sentence to make it more original:
                    </p>
                    <blockquote className="border-l-4 border-accent-500 pl-3 py-1 mb-3 text-dark-600 dark:text-dark-400 italic">
                      {getRandomSentence()}
                    </blockquote>
                    <div className="bg-secondary-50 dark:bg-secondary-900/20 p-3 rounded-lg border border-secondary-200 dark:border-secondary-800">
                      <p className="text-dark-700 dark:text-dark-300">
                        Suggestion: "{getAlternativeSentence()}"
                      </p>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">Ignore</Button>
                      <Button variant="secondary" size="sm">Apply</Button>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-4">
                    <h4 className="font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Citation Recommendation
                    </h4>
                    <p className="text-dark-600 dark:text-dark-400 mb-3">
                      Add a citation for the matched content from this source:
                    </p>
                    <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg border border-primary-200 dark:border-primary-800">
                      <p className="text-dark-700 dark:text-dark-300 mb-2">
                        Source: "{sources[0]?.title}"
                      </p>
                      <div className="text-sm text-dark-500 dark:text-dark-400">
                        {getCitationText()}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">Ignore</Button>
                      <Button variant="primary" size="sm">Add Citation</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-6 text-center">
                  <Search className="w-12 h-12 text-dark-400 dark:text-dark-600 mx-auto mb-4" />
                  <h4 className="font-medium text-dark-700 dark:text-dark-300 mb-2">
                    No Matched Sources Found
                  </h4>
                  <p className="text-dark-500 dark:text-dark-400">
                    No similar content was detected in our database. Your content appears to be original.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card variant="glass" className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4">
                  Originality Score
                </h3>
                <div className="relative w-40 h-40 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#E2E8F0" 
                      strokeWidth="8" 
                      className="dark:stroke-dark-700"
                    />
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={overallScore > 80 ? "#10B981" : overallScore > 50 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="8" 
                      strokeDasharray="283"
                      strokeDashoffset="283"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * overallScore / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-3xl font-bold text-dark-900 dark:text-dark-100">
                        {overallScore}%
                      </div>
                      <div className="text-sm text-dark-500 dark:text-dark-400">
                        Original
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm mt-4">
                  <span className={`inline-block px-2 py-1 rounded-full ${
                    overallScore > 80 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : overallScore > 50 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {overallScore > 80 ? 'Low Plagiarism' : overallScore > 50 ? 'Moderate Plagiarism' : 'High Plagiarism'}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-dark-700 dark:text-dark-300 mb-3">
                  Summary:
                </h4>
                <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                  <li className="flex justify-between">
                    <span>Word Count:</span>
                    <span className="font-medium text-dark-700 dark:text-dark-300">{getWordCount(originalText)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Matched Sources:</span>
                    <span className="font-medium text-dark-700 dark:text-dark-300">{sources.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Matched Words:</span>
                    <span className="font-medium text-dark-700 dark:text-dark-300">{Math.floor(getWordCount(originalText) * (100 - overallScore) / 100)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Plagiarism Score:</span>
                    <span className="font-medium text-dark-700 dark:text-dark-300">{100 - overallScore}%</span>
                  </li>
                </ul>
              </div>
            </Card>
            
            <Card variant="neumorphic" className="p-6">
              <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4">
                Matched Sources
              </h3>
              <div className="space-y-4">
                {sources.map(source => (
                  <div 
                    key={source.id}
                    className={`bg-white dark:bg-dark-900 border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSource === source.id 
                        ? 'border-primary-500 dark:border-primary-400 shadow-md' 
                        : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => setSelectedSource(source.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-primary-500 mr-2" />
                        <h4 className="font-medium text-dark-700 dark:text-dark-300 line-clamp-1">
                          {source.title}
                        </h4>
                      </div>
                      <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        source.matchPercentage > 20 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                          : source.matchPercentage > 10 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {source.matchPercentage}%
                      </div>
                    </div>
                    <div className="text-xs text-blue-500 dark:text-blue-400 truncate mb-2">
                      {source.url}
                    </div>
                    <div className="text-xs text-dark-500 dark:text-dark-400">
                      {source.matchedText.length} matched text segments
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary-500" />
                Need Help?
              </h3>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                Have questions about your results or need assistance with improving your content?
              </p>
              <Button 
                variant="primary" 
                size="sm" 
                fullWidth
                className="mb-2"
              >
                Chat with Support
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={<Bookmark className="w-4 h-4" />}
                fullWidth
              >
                View Resources
              </Button>
            </Card>
          </div>
        </div>

        {/* JSON Modal */}
        {showJSON && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200">
                  NLP Processed Text
                </h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleCopyJSON}
                  >
                    Copy JSON
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCloseJSON}
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="bg-gray-100 dark:bg-dark-900 p-4 rounded-lg text-sm text-dark-800 dark:text-dark-200 overflow-auto whitespace-pre-wrap">
                  {processedJSON}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Chunks Modal */}
        {showChunks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200">
                  Chunked Text
                </h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleCopyChunks}
                  >
                    Copy JSON
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCloseChunks}
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="bg-gray-100 dark:bg-dark-900 p-4 rounded-lg text-sm text-dark-800 dark:text-dark-200 overflow-auto whitespace-pre-wrap">
                  {chunkedJSON}
                </pre>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Results Modal */}
        {showSearchResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200">
                  Similarity Search Results
                </h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCloseSearchResults}
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {searchResults.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-dark-500 dark:text-dark-400">No search results found.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {searchResults.map((chunkResult) => (
                      <div key={chunkResult.chunkId} className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 dark:bg-dark-900/50 p-4 border-b border-gray-200 dark:border-dark-700">
                          <h4 className="font-medium text-dark-800 dark:text-dark-200 mb-2">
                            Chunk #{chunkResult.chunkId + 1}
                          </h4>
                          <div className="bg-white dark:bg-dark-900 p-3 rounded-lg text-sm text-dark-600 dark:text-dark-400 mb-2">
                            <strong>Text:</strong> {chunkResult.chunkText}
                          </div>
                          <div className="text-sm text-dark-500 dark:text-dark-400">
                            <strong>Search Query:</strong> {chunkResult.query}
                          </div>
                          {chunkResult.error && (
                            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
                              Error: {chunkResult.error}
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h5 className="font-medium text-dark-700 dark:text-dark-300 mb-3">
                            {chunkResult.results.length} Similar Sources Found:
                          </h5>
                          
                          {chunkResult.results.length === 0 ? (
                            <p className="text-dark-500 dark:text-dark-400 text-sm italic">No similar content found for this chunk.</p>
                          ) : (
                            <div className="space-y-4">
                              {chunkResult.results.map((result, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-dark-900/30 p-3 rounded-lg">
                                  <h6 className="font-medium text-primary-700 dark:text-primary-400 mb-1">
                                    {result.title}
                                  </h6>
                                  <a 
                                    href={result.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline mb-2 block"
                                  >
                                    {result.formattedUrl || result.link}
                                  </a>
                                  <p className="text-sm text-dark-600 dark:text-dark-400 mt-2">
                                    {result.snippet}
                                  </p>
                                  <div className="text-xs text-dark-500 dark:text-dark-400 mt-2">
                                    Source: {result.source}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;