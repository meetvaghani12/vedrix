import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  BarChart2, 
  AlertTriangle,
  ChevronLeft,
  Book,
  Type,
  Percent
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface DocumentInfo {
  id: number;
  title: string;
  uploadDate: string;
  fileType: string;
  originalFilename: string;
}

interface TextAnalysis {
  totalWords: number;
  totalSentences: number;
  avgWordsPerSentence: number;
}

interface PlagiarismAnalysis {
  originalityScore: number;
  similarityScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

interface AnalyticsData {
  documentInfo: DocumentInfo;
  textAnalysis: TextAnalysis;
  plagiarismAnalysis: PlagiarismAnalysis;
}

const DocumentAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`/api/documents/${id}/analytics/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setAnalyticsData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, token]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
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
        >
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={handleBack}
              className="mb-4"
            >
              Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-2 font-sora">
              Document Analytics
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              Detailed analysis and insights for your document.
            </p>
          </div>

          {/* Document Info Card */}
          <Card variant="glass" className="p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-primary-500 mr-3" />
                  <h2 className="text-xl font-semibold text-dark-800 dark:text-dark-200">
                    {analyticsData?.documentInfo.title}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-dark-500 dark:text-dark-400">Original Filename</p>
                    <p className="text-dark-800 dark:text-dark-200">{analyticsData?.documentInfo.originalFilename}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 dark:text-dark-400">File Type</p>
                    <p className="text-dark-800 dark:text-dark-200">{analyticsData?.documentInfo.fileType.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 dark:text-dark-400">Upload Date</p>
                    <p className="text-dark-800 dark:text-dark-200">
                      {new Date(analyticsData?.documentInfo.uploadDate || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Text Analysis */}
            <Card variant="neumorphic" className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/20">
                  <Book className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 ml-3">
                  Text Analysis
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Total Words</p>
                  <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">
                    {analyticsData?.textAnalysis.totalWords.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Total Sentences</p>
                  <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">
                    {analyticsData?.textAnalysis.totalSentences.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Average Words per Sentence</p>
                  <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">
                    {analyticsData?.textAnalysis.avgWordsPerSentence}
                  </p>
                </div>
              </div>
            </Card>

            {/* Plagiarism Analysis */}
            <Card variant="neumorphic" className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-secondary-500/10 dark:bg-secondary-500/20">
                  <Percent className="w-6 h-6 text-secondary-500" />
                </div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 ml-3">
                  Plagiarism Analysis
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Originality Score</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">
                      {analyticsData?.plagiarismAnalysis.originalityScore.toFixed(1)}%
                    </p>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      analyticsData?.plagiarismAnalysis.riskLevel === 'Low' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : analyticsData?.plagiarismAnalysis.riskLevel === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {analyticsData?.plagiarismAnalysis.riskLevel} Risk
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Similarity Score</p>
                  <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">
                    {analyticsData?.plagiarismAnalysis.similarityScore.toFixed(1)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${
                      analyticsData?.plagiarismAnalysis.riskLevel === 'Low'
                        ? 'bg-green-500'
                        : analyticsData?.plagiarismAnalysis.riskLevel === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${analyticsData?.plagiarismAnalysis.originalityScore}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* Risk Assessment */}
            <Card variant="neumorphic" className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-accent-500/10 dark:bg-accent-500/20">
                  <AlertTriangle className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 ml-3">
                  Risk Assessment
                </h3>
              </div>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  analyticsData?.plagiarismAnalysis.riskLevel === 'Low'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : analyticsData?.plagiarismAnalysis.riskLevel === 'Medium'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    analyticsData?.plagiarismAnalysis.riskLevel === 'Low'
                      ? 'text-green-800 dark:text-green-300'
                      : analyticsData?.plagiarismAnalysis.riskLevel === 'Medium'
                        ? 'text-yellow-800 dark:text-yellow-300'
                        : 'text-red-800 dark:text-red-300'
                  }`}>
                    {analyticsData?.plagiarismAnalysis.riskLevel} Risk Level
                  </h4>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    {analyticsData?.plagiarismAnalysis.riskLevel === 'Low'
                      ? 'This document shows a high level of originality. Great work!'
                      : analyticsData?.plagiarismAnalysis.riskLevel === 'Medium'
                        ? 'Some similarities detected. Consider reviewing the matched content.'
                        : 'Significant similarities found. Please review the document carefully.'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentAnalyticsPage; 