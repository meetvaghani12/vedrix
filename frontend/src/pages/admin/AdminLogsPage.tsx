import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, AlertTriangle, Info, CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogDetail {
  [key: string]: any;
}

interface Log {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  source: string;
  details: LogDetail;
}

interface LogsResponse {
  logs: Log[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogLevels, setSelectedLogLevels] = useState<string[]>(['info', 'warning', 'error']);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('today');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Build query params
      const queryParams = new URLSearchParams();
      selectedLogLevels.forEach(level => queryParams.append('levels', level));
      if (searchQuery) queryParams.append('search', searchQuery);
      queryParams.append('timeRange', selectedTimeRange);
      queryParams.append('page', page.toString());
      
      const response = await fetch(`/api/admin/logs/?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching logs: ${response.statusText}`);
      }
      
      const data: LogsResponse = await response.json();
      setLogs(data.logs);
      setTotalLogs(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
      if (refresh) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedLogLevels, selectedTimeRange, page]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1); // Reset to page 1 when search changes
      } else {
        fetchLogs(); // If already on page 1, just fetch
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogLevelToggle = (level: string) => {
    setSelectedLogLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };

  const refreshLogs = () => {
    fetchLogs(true);
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
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const exportLogs = () => {
    // In a real application, this would generate and download a file
    // For this example, we'll just show the current logs in JSON format
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `logs-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
            onClick={exportLogs}
            className="flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
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
                {logs.length === 0 ? (
                  <tr className="bg-white dark:bg-dark-800">
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      No logs found matching your filters.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
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
          Showing <span className="font-medium">{logs.length}</span> of <span className="font-medium">{totalLogs}</span> logs
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handlePreviousPage}
            disabled={page === 1 || loading}
            className={`px-3 py-1 border border-gray-300 dark:border-dark-700 rounded-md text-sm font-medium ${
              page === 1 || loading
                ? 'bg-gray-100 text-gray-400 dark:bg-dark-800 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700'
            }`}
          >
            Previous
          </button>
          <button 
            onClick={handleNextPage}
            disabled={page >= totalPages || loading}
            className={`px-3 py-1 border border-gray-300 dark:border-dark-700 rounded-md text-sm font-medium ${
              page >= totalPages || loading
                ? 'bg-gray-100 text-gray-400 dark:bg-dark-800 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogsPage; 