import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, MessageSquare, RotateCcw, Bookmark, BookOpen, FileText, Code } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
        
        // Generate mock sources based on the extracted text
        const mockSources = generateMockSources(extractedText);
        setSources(mockSources);
        
        // Calculate a mock score (this would be replaced with real analysis)
        setOverallScore(Math.floor(Math.random() * 20) + 75); // Random score between 75-95%
      } else {
        // Fallback to sample text if no extracted text is available
        const sampleText = `The concept of artificial intelligence has been a subject of fascination for decades. As technology advances, the ethical implications of AI become increasingly important to consider. Researchers argue that responsible development of AI systems must include considerations of fairness, transparency, and accountability. The potential for AI to transform industries is significant, but challenges remain in ensuring these systems operate in ways that benefit society as a whole.`;
        
        setOriginalText(sampleText);
        
        const mockSources: Source[] = [
          {
            id: 1,
            title: "Ethical Implications of Artificial Intelligence",
            url: "https://journal.ai/ethical-implications",
            matchPercentage: 23,
            matchedText: [
              "ethical implications of AI become increasingly important to consider",
              "responsible development of AI systems must include considerations of fairness, transparency, and accountability"
            ]
          },
          {
            id: 2,
            title: "The Future of AI Technology",
            url: "https://techreview.org/ai-future",
            matchPercentage: 17,
            matchedText: [
              "The concept of artificial intelligence has been a subject of fascination for decades",
              "The potential for AI to transform industries is significant"
            ]
          },
          {
            id: 3,
            title: "AI and Society: Challenges and Opportunities",
            url: "https://airesearch.edu/society-challenges",
            matchPercentage: 8,
            matchedText: [
              "challenges remain in ensuring these systems operate in ways that benefit society as a whole"
            ]
          },
        ];
        
        setSources(mockSources);
        setOverallScore(85); // 85% original, 15% plagiarized
      }
      
      setSelectedSource(1);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper function to generate mock sources based on extracted text
  const generateMockSources = (text: string): Source[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length < 3) {
      return [
        {
          id: 1,
          title: "Academic Source",
          url: "https://example.com/academic-source",
          matchPercentage: 5,
          matchedText: [sentences[0] || "Sample matched text"]
        }
      ];
    }
    
    // Take 3 random sentences to use as "matched" text
    const randomSentences = [];
    const usedIndexes = new Set<number>();
    
    while (randomSentences.length < Math.min(3, sentences.length)) {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      if (!usedIndexes.has(randomIndex) && sentences[randomIndex]?.trim()) {
        randomSentences.push(sentences[randomIndex].trim());
        usedIndexes.add(randomIndex);
      }
    }
    
    return [
      {
        id: 1,
        title: "Academic Journal Reference",
        url: "https://journal.example.com/article",
        matchPercentage: Math.floor(Math.random() * 15) + 10, // 10-25%
        matchedText: [randomSentences[0]]
      },
      {
        id: 2,
        title: "Online Publication",
        url: "https://publication.example.org/content",
        matchPercentage: Math.floor(Math.random() * 10) + 5, // 5-15%
        matchedText: [randomSentences[1]]
      },
      {
        id: 3,
        title: "Research Database",
        url: "https://research.example.edu/database",
        matchPercentage: Math.floor(Math.random() * 5) + 3, // 3-8%
        matchedText: [randomSentences[2]]
      }
    ].filter(source => source.matchedText[0]); // Filter out sources without matched text
  };

  const getHighlightedText = () => {
    if (!selectedSource) return originalText;
    
    const source = sources.find(s => s.id === selectedSource);
    if (!source) return originalText;
    
    let highlightedText = originalText;
    
    source.matchedText.forEach(match => {
      if (match && originalText.includes(match)) {
        highlightedText = highlightedText.replace(
          match,
          `<span class="bg-accent-100 dark:bg-accent-900/50 text-accent-800 dark:text-accent-100 px-1 rounded">${match}</span>`
        );
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
    
    return "ethical implications of AI become increasingly important to consider";
  };

  const getAlternativeSentence = (): string => {
    const randomSentence = getRandomSentence();
    
    // Simple alternatives for demo purposes
    const alternatives = [
      "As this concept continues to evolve, considering its broader implications has become a crucial area of focus.",
      "Researchers now emphasize that evaluating the consequences of this approach is an essential priority.",
      "Experts highlight the growing significance of addressing the potential impacts in this field.",
      "As AI continues to evolve, the ethical considerations surrounding its implementation have become a crucial focus area."
    ];
    
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  };

  const getCitationText = (): string => {
    if (sources.length > 0) {
      const source = sources[0];
      const currentYear = new Date().getFullYear();
      const authorLastName = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller"][Math.floor(Math.random() * 7)];
      const authorInitial = ["A", "B", "C", "D", "E", "J", "M", "R", "S", "T"][Math.floor(Math.random() * 10)];
      
      return `${authorLastName}, ${authorInitial}. (${currentYear}). ${source.title}. Journal of Academic Research, ${Math.floor(Math.random() * 20) + 1}(${Math.floor(Math.random() * 4) + 1}), ${Math.floor(Math.random() * 100) + 1}-${Math.floor(Math.random() * 100) + 101}.`;
    }
    
    return "Smith, J. (2023). Academic Analysis and Insights. Journal of Research, 15(2), 45-67.";
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

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(processedJSON);
    alert('JSON copied to clipboard!');
  };

  const handleCloseJSON = () => {
    setShowJSON(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-600 dark:text-dark-400">Loading results...</p>
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
                      Source: "{sources[0]?.title || 'Academic Source'}"
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
      </div>
    </div>
  );
};

export default ResultsPage;