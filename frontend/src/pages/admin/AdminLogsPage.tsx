import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, AlertTriangle, Info, CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock log data
const mockLogs = [
  {
    id: '1',
    timestamp: '2023-05-20T08:23:45Z',
    level: 'info',
    message: 'User john.doe@example.com logged in successfully',
    source: 'auth-service',
    details: { userId: 'usr_123', ip: '192.168.1.1', userAgent: 'Mozilla/5.0...' }
  },
  {
    id: '2',
    timestamp: '2023-05-20T08:24:12Z',
    level: 'warning',
    message: 'High CPU usage detected (85%)',
    source: 'monitoring-service',
    details: { server: 'server-01', duration: '5m', threshold: '80%' }
  },
  {
    id: '3',
    timestamp: '2023-05-20T08:25:30Z',
    level: 'error',
    message: 'Database connection failed',
    source: 'db-service',
    details: { database: 'users-db', error: 'Connection timeout', retries: 3 }
  },
  {
    id: '4',
    timestamp: '2023-05-20T08:30:45Z',
    level: 'info',
    message: 'Document scan completed for assignment.pdf',
    source: 'scanning-service',
    details: { documentId: 'doc_456', size: '2.3MB', pages: 12 }
  },
  {
    id: '5',
    timestamp: '2023-05-20T08:32:15Z',
    level: 'error',
    message: 'Payment processing failed',
    source: 'payment-service',
    details: { transactionId: 'tx_789', userId: 'usr_456', amount: '$49.99', error: 'Card declined' }
  },
  {
    id: '6',
    timestamp: '2023-05-20T08:35:22Z',
    level: 'info',
    message: 'System backup completed successfully',
    source: 'backup-service',
    details: { backupId: 'bkp_123', size: '1.2GB', duration: '3m 45s' }
  },
  {
    id: '7',
    timestamp: '2023-05-20T08:40:18Z',
    level: 'warning',
    message: 'API rate limit approaching for client',
    source: 'api-gateway',
    details: { clientId: 'client_789', currentUsage: '950/1000', resetIn: '20m' }
  },
  {
    id: '8',
    timestamp: '2023-05-20T08:45:30Z',
    level: 'info',
    message: 'New user registered: jane.smith@example.com',
    source: 'user-service',
    details: { userId: 'usr_789', plan: 'Premium', referredBy: 'usr_123' }
  },
  {
    id: '9',
    timestamp: '2023-05-20T08:50:12Z',
    level: 'error',
    message: 'Email delivery failed',
    source: 'notification-service',
    details: { recipientId: 'usr_321', emailId: 'em_456', reason: 'Invalid email address' }
  },
  {
    id: '10',
    timestamp: '2023-05-20T08:55:45Z',
    level: 'info',
    message: 'Scheduled maintenance completed',
    source: 'system-service',
    details: { maintenanceId: 'mt_123', duration: '10m', services: ['api', 'db', 'auth'] }
  }
];

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState(mockLogs);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogLevels, setSelectedLogLevels] = useState<string[]>(['info', 'warning', 'error']);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('today');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = logs.filter(log => {
    // Filter by log level
    if (!selectedLogLevels.includes(log.level)) return false;
    
    // Filter by search query (case insensitive)
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !log.source.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleLogLevelToggle = (level: string) => {
    setSelectedLogLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };

  const refreshLogs = () => {
    setIsRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Logs</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={refreshLogs}
            className="flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button
            className="flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLogLevelToggle('info')}
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                selectedLogLevels.includes('info')
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-gray-400'
              }`}
            >
              <Info className="h-3 w-3" />
              <span>Info</span>
            </button>
            
            <button
              onClick={() => handleLogLevelToggle('warning')}
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                selectedLogLevels.includes('warning')
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-gray-400'
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>Warning</span>
            </button>
            
            <button
              onClick={() => handleLogLevelToggle('error')}
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                selectedLogLevels.includes('error')
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-gray-400'
              }`}
            >
              <XCircle className="h-3 w-3" />
              <span>Error</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 ml-0 sm:ml-auto">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="text-sm border-none bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0 focus:outline-none py-1 px-2"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Logs table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {filteredLogs.length === 0 ? (
                  <tr className="bg-white dark:bg-dark-800">
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      No logs found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr 
                        className="hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors"
                        onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getLogLevelIcon(log.level)}
                            <span className={`ml-2 text-sm font-medium ${
                              log.level === 'info' ? 'text-blue-600 dark:text-blue-400' :
                              log.level === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                              log.level === 'error' ? 'text-red-600 dark:text-red-400' :
                              'text-green-600 dark:text-green-400'
                            }`}>
                              {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-300">
                            {log.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {log.message}
                        </td>
                      </tr>
                      {expandedLogId === log.id && (
                        <tr className="bg-gray-50 dark:bg-dark-700">
                          <td colSpan={4} className="px-6 py-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              <h4 className="font-medium mb-2">Details:</h4>
                              <pre className="bg-gray-100 dark:bg-dark-800 p-3 rounded-lg text-xs overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{mockLogs.length}</span> logs
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 dark:border-dark-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-dark-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogsPage; 