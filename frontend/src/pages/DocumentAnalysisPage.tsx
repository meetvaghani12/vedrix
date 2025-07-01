import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, BarChart3, AlertTriangle, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface DocumentAnalysis {
  id: number;
  name: string;
  date: string;
  score: number;
  analysis: {
    matches: Array<{
      text: string;
      similarity: number;
      source: string;
    }>;
    summary: {
      totalMatches: number;
      averageSimilarity: number;
      riskLevel: 'low' | 'medium' | 'high';
    };
  };
}

function DocumentAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Get document details and analysis in a single request
        const response = await api.get(`/api/documents/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        // Assuming the document response includes both document details and analysis
        setAnalysis({
          id: response.data.id,
          name: response.data.name,
          date: response.data.created_at || response.data.date,
          score: response.data.originality_score || response.data.score,
          analysis: {
            matches: response.data.matches || [],
            summary: {
              totalMatches: response.data.total_matches || 0,
              averageSimilarity: response.data.average_similarity || 0,
              riskLevel: response.data.risk_level || 'low'
            }
          }
        });
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Document not found or analysis not available');
        } else {
          setError('Failed to load document analysis. Please try again later.');
        }
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-center">
              <p className="text-lg font-medium mb-2">{error}</p>
              <p className="text-sm">Please check if the document exists and try again.</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-lg text-center">
              <p className="text-lg font-medium mb-2">No analysis found for this document</p>
              <p className="text-sm">The document might still be processing or was not found.</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Go Back
            </Button>
          </div>
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
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="mr-2"
            >
              Back
            </Button>
            <div className="p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/20">
              <FileText className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-2 font-sora">
                {analysis.name}
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                Analysis Report • {new Date(analysis.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                Originality Score
              </h3>
              <div className="text-4xl font-bold text-primary-500">
                {analysis.score}%
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                Matched Sources
              </h3>
              <div className="text-4xl font-bold text-secondary-500">
                {analysis.analysis.summary.totalMatches}
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                Risk Level
              </h3>
              <div className={`text-4xl font-bold ${
                analysis.analysis.summary.riskLevel === 'low' 
                  ? 'text-green-500'
                  : analysis.analysis.summary.riskLevel === 'medium'
                    ? 'text-yellow-500'
                    : 'text-red-500'
              }`}>
                {analysis.analysis.summary.riskLevel.charAt(0).toUpperCase() + analysis.analysis.summary.riskLevel.slice(1)}
              </div>
            </Card>
          </div>

          <Card variant="neumorphic" className="p-6">
            <h2 className="text-xl font-semibold text-dark-800 dark:text-dark-200 mb-6">
              Matched Content
            </h2>
            {analysis.analysis.matches.length > 0 ? (
              <div className="space-y-6">
                {analysis.analysis.matches.map((match, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-200 dark:border-dark-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle className={`w-5 h-5 mr-2 ${
                          match.similarity >= 90 
                            ? 'text-red-500' 
                            : match.similarity >= 70 
                              ? 'text-yellow-500' 
                              : 'text-green-500'
                        }`} />
                        <span className="font-medium text-dark-800 dark:text-dark-200">
                          {match.similarity}% Match
                        </span>
                      </div>
                      <a 
                        href={match.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        View Source
                      </a>
                    </div>
                    <p className="text-dark-600 dark:text-dark-400 text-sm">
                      {match.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-500 dark:text-dark-400">
                No matches found. This document appears to be original.
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default DocumentAnalysisPage; 