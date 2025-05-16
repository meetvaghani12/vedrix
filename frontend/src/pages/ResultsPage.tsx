import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, MessageSquare, RotateCcw, Bookmark, BookOpen, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Source {
  id: number;
  title: string;
  url: string;
  matchPercentage: number;
  matchedText: string[];
}

const ResultsPage: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulated data loading
  useEffect(() => {
    const timer = setTimeout(() => {
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
      setSelectedSource(1);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getHighlightedText = () => {
    if (!selectedSource) return originalText;
    
    const source = sources.find(s => s.id === selectedSource);
    if (!source) return originalText;
    
    let highlightedText = originalText;
    
    source.matchedText.forEach(match => {
      highlightedText = highlightedText.replace(
        match,
        `<span class="bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300 px-1 rounded">${match}</span>`
      );
    });
    
    return highlightedText;
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
          <div className="lg:col-span-8">
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
                  >
                    Download Report
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    Rescan
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-dark-500 mr-2" />
                  <h3 className="font-medium text-dark-700 dark:text-dark-300">
                    Document.pdf
                  </h3>
                </div>
                <div className="text-sm text-dark-500 dark:text-dark-400">
                  Scanned on {new Date().toLocaleDateString()} • 2 pages • 1,245 words
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-4 overflow-auto max-h-[500px]">
                <div className="prose prose-sm max-w-none dark:prose-invert">
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
                    "ethical implications of AI become increasingly important to consider"
                  </blockquote>
                  <div className="bg-secondary-50 dark:bg-secondary-900/20 p-3 rounded-lg border border-secondary-200 dark:border-secondary-800">
                    <p className="text-dark-700 dark:text-dark-300">
                      Suggestion: "As AI continues to evolve, the ethical considerations surrounding its implementation have become a crucial focus area."
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
                      Source: "Ethical Implications of Artificial Intelligence"
                    </p>
                    <div className="text-sm text-dark-500 dark:text-dark-400">
                      Smith, J. (2023). Ethical Implications of Artificial Intelligence. Journal of AI Ethics, 15(2), 45-67.
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
                    <span className="font-medium text-dark-700 dark:text-dark-300">1,245</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Matched Sources:</span>
                    <span className="font-medium text-dark-700 dark:text-dark-300">{sources.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Matched Words:</span>
                    <span className="font-medium text-dark-700 dark:text-dark-300">187</span>
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
      </div>
    </div>
  );
};

export default ResultsPage;