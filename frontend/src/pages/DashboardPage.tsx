import React from 'react';
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
  Clock,
  Users,
  Settings,
  Download
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const recentDocuments = [
    { id: 1, name: 'Research Paper.pdf', date: '2023-05-15', score: 92 },
    { id: 2, name: 'Academic Essay.docx', date: '2023-05-10', score: 85 },
    { id: 3, name: 'Project Proposal.pdf', date: '2023-05-05', score: 97 },
    { id: 4, name: 'Literature Review.docx', date: '2023-04-28', score: 78 },
  ];

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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-200 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              </div>
              <Button 
                variant="primary" 
                icon={<Upload className="w-5 h-5" />}
              >
                New Scan
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
                  48
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">Total Documents</p>
                <div className="mt-4 flex items-center text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>12% from last month</span>
                </div>
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
                  87%
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">Originality Score</p>
                <div className="mt-4 flex items-center text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>5% from last month</span>
                </div>
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
                  12
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">Recent Scans</p>
                <div className="mt-4 flex items-center text-red-500 text-sm">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>3% from last month</span>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="glass" className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/20">
                    <Calendar className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className="text-sm font-medium text-dark-500 dark:text-dark-400">This month</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-1">
                  Pro
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">Current Plan</p>
                <div className="mt-4 flex items-center text-primary-500 text-sm">
                  <span>Active until Jun 15, 2023</span>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card variant="neumorphic" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-dark-800 dark:text-dark-200">
                    Recent Documents
                  </h2>
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
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
                      {recentDocuments.map(doc => (
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
                            <div className="flex space-x-2">
                              <button className="p-1 text-dark-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400 transition-colors">
                                <FileText className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-dark-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-dark-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400 transition-colors">
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
            
            {/* Sidebar widgets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4">
                  Account Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        JS
                      </div>
                      <div>
                        <h4 className="font-medium text-dark-800 dark:text-dark-200">
                          John Smith
                        </h4>
                        <p className="text-sm text-dark-500 dark:text-dark-400">
                          john@example.com
                        </p>
                      </div>
                    </div>
                    <button className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-dark-600 dark:text-dark-400 text-sm">Plan</span>
                      <span className="text-dark-800 dark:text-dark-200 font-medium text-sm">Pro Plan</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-dark-600 dark:text-dark-400 text-sm">Scans Used</span>
                      <span className="text-dark-800 dark:text-dark-200 font-medium text-sm">48 / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-4">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                    <Button variant="outline" size="sm" fullWidth>
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card variant="neumorphic" className="p-6">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary-500" />
                  Team Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="relative mr-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        AM
                      </div>
                      <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-800"></div>
                    </div>
                    <div>
                      <p className="text-dark-800 dark:text-dark-200 text-sm">
                        <span className="font-medium">Alex Mitchell</span> uploaded a new document
                      </p>
                      <p className="text-xs text-dark-500 dark:text-dark-400">
                        5 minutes ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="relative mr-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        RK
                      </div>
                      <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white dark:border-dark-800"></div>
                    </div>
                    <div>
                      <p className="text-dark-800 dark:text-dark-200 text-sm">
                        <span className="font-medium">Rebecca Kim</span> viewed scan results
                      </p>
                      <p className="text-xs text-dark-500 dark:text-dark-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="relative mr-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        TJ
                      </div>
                      <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white dark:border-dark-800"></div>
                    </div>
                    <div>
                      <p className="text-dark-800 dark:text-dark-200 text-sm">
                        <span className="font-medium">Tom Jackson</span> downloaded a report
                      </p>
                      <p className="text-xs text-dark-500 dark:text-dark-400">
                        Yesterday at 4:30 PM
                      </p>
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 text-sm text-center w-full text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                  View all activity
                </button>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;