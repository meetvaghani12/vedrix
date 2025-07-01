import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Document {
  id: number;
  name: string;
  date: string;
  score: number;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/api/documents/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setDocuments(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load documents');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [token]);

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
          className="mb-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-2 font-sora">
                All Documents
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                View and analyze all your scanned documents
              </p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-200 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <Card variant="neumorphic" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-dark-500 dark:text-dark-400 text-sm border-b border-gray-200 dark:border-dark-700">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr 
                      key={doc.id} 
                      className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-primary-500 mr-3" />
                          <span className="font-medium text-dark-800 dark:text-dark-200">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-dark-600 dark:text-dark-400">
                        {new Date(doc.date).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.score >= 90 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : doc.score >= 80 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {doc.score}% Original
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end">
                          <button 
                            onClick={() => navigate(`/document/${doc.id}/analysis`)}
                            className="p-2 text-dark-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
                            title="View Analysis"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsPage; 