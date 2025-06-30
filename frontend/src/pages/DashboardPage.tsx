import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Document {
  id: number;
  name: string;
  date: string;
  score: number;
}

interface DashboardData {
  recentDocuments: Document[];
  stats: {
    totalDocuments: number;
    recentScans: number;
    scanChange: number;
    avgOriginality: number;
  }
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/documents/dashboard/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Handle new scan button click
  const handleNewScan = () => {
    navigate('/upload');
  };

  // Handle view all documents click
  const handleViewAllDocuments = () => {
    navigate('/documents');
  };

  const handleViewAnalytics = (documentId: number) => {
    navigate(`/analytics/${documentId}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/documents?search=${encodeURIComponent(searchQuery)}`);
    }
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
          className="mb-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-2 font-sora">
                Dashboard
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                Welcome back! Check your documents and analysis.
              </p>
            </div>
            <div className="flex space-x-3">
              <form onSubmit={handleSearch} className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-200 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                </div>
              </form>
              <Button 
                variant="primary" 
                icon={<Upload className="w-5 h-5" />}
                onClick={handleNewScan}
              >
                New Scan
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/20">
                    <FileText className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className="text-sm font-medium text-dark-500 dark:text-dark-400">All time</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-1">
                  {dashboardData?.stats.totalDocuments || 0}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">Total Documents</p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-secondary-500/10 dark:bg-secondary-500/20">
                    <BarChart3 className="w-6 h-6 text-secondary-500" />
                  </div>
                  <span className="text-sm font-medium text-dark-500 dark:text-dark-400">Average</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-1">
                  {dashboardData?.stats.avgOriginality.toFixed(1) || 0}%
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">Originality Score</p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-accent-500/10 dark:bg-accent-500/20">
                    <Clock className="w-6 h-6 text-accent-500" />
                  </div>
                  <span className="text-sm font-medium text-dark-500 dark:text-dark-400">Past 30 days</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-1">
                  {dashboardData?.stats.recentScans || 0}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">Recent Scans</p>
              </Card>
            </motion.div>
          </div>

          {/* Recent documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="neumorphic" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-dark-800 dark:text-dark-200">
                  Recent Documents
                </h2>
                <Button variant="ghost" size="sm" onClick={handleViewAllDocuments}>
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              {dashboardData?.recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No documents scanned yet</p>
                </div>
              ) : (
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
                      {dashboardData?.recentDocuments.slice(0, 5).map(doc => (
                        <tr 
                          key={doc.id} 
                          className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                        >
                          <td className="py-4">
                            <div className="flex items-center">
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
                              doc.score > 80 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : doc.score > 50 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {doc.score}% Original
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<BarChart3 className="w-4 h-4" />}
                                onClick={() => handleViewAnalytics(doc.id)}
                              >
                                Analytics
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;