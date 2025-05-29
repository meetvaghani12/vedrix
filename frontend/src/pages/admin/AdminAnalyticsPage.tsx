import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, ArrowUp, ArrowDown, Users, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserGrowthData {
  date: string;
  users: number;
}

interface DocumentCheckData {
  date: string;
  checks: number;
}

interface PlagiarismData {
  category: string;
  value: number;
}

interface StatsData {
  users: {
    total: number;
    change: string;
    isPositive: boolean;
  };
  documents: {
    total: number;
    change: string;
    isPositive: boolean;
  };
  responseTime: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  plagiarismRate: {
    value: string;
    change: string;
    isPositive: boolean;
  };
}

interface AnalyticsData {
  stats: StatsData;
  charts: {
    userGrowth: UserGrowthData[];
    documentChecks: DocumentCheckData[];
    plagiarismDistribution: PlagiarismData[];
  };
}

const AdminAnalyticsPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`/api/admin/analytics/?timeRange=${selectedTimeRange}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [selectedTimeRange]);

  // Stats cards data
  const statsCards = analyticsData ? [
    {
      title: 'Total Users',
      value: analyticsData.stats.users.total.toLocaleString(),
      change: analyticsData.stats.users.change,
      isPositive: analyticsData.stats.users.isPositive,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Documents Checked',
      value: analyticsData.stats.documents.total.toLocaleString(),
      change: analyticsData.stats.documents.change,
      isPositive: analyticsData.stats.documents.isPositive,
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Avg. Response Time',
      value: analyticsData.stats.responseTime.value,
      change: analyticsData.stats.responseTime.change,
      isPositive: analyticsData.stats.responseTime.isPositive,
      icon: <Clock className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Plagiarism Rate',
      value: analyticsData.stats.plagiarismRate.value,
      change: analyticsData.stats.plagiarismRate.change,
      isPositive: analyticsData.stats.plagiarismRate.isPositive,
      icon: <PieChart className="h-6 w-6 text-red-500" />,
      color: 'bg-red-100 dark:bg-red-900/20',
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        
        <div className="mt-4 sm:mt-0 flex p-1 bg-gray-200 dark:bg-dark-800 rounded-lg">
          <button
            onClick={() => setSelectedTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedTimeRange === 'week'
                ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedTimeRange === 'month'
                ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedTimeRange('year')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedTimeRange === 'year'
                ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Year
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton loaders for stats cards
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="w-2/3">
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/3"></div>
                </div>
                <div className="p-3 rounded-lg bg-gray-200 dark:bg-dark-700 h-12 w-12"></div>
              </div>
            </div>
          ))
        ) : (
          statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</h3>
                  <div className="flex items-center mt-2">
                    {stat.isPositive ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ml-1 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : analyticsData ? (
            <div className="h-64 relative">
              {/* Chart visualization of userGrowth data */}
              <div className="absolute inset-0 flex flex-col justify-end">
                <div className="flex items-end justify-between h-52">
                  {analyticsData.charts.userGrowth.map((item, index) => {
                    const maxUsers = Math.max(...analyticsData.charts.userGrowth.map(d => d.users));
                    const height = maxUsers > 0 ? (item.users / maxUsers) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center w-full">
                        <div 
                          className="w-12 bg-blue-500 rounded-t-md" 
                          style={{ 
                            height: `${height}%`,
                            maxHeight: '100%',
                            minHeight: item.users > 0 ? '4px' : '0'
                          }}
                        ></div>
                        <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                          {selectedTimeRange === 'year' 
                            ? item.date.substring(5) // Show only month for year view
                            : item.date.substring(5).replace('-', '/')} {/* Format date for display */}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Document Checks Chart */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Checks</h3>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : analyticsData ? (
            <div className="h-64 relative">
              {/* Line chart for document checks */}
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-52" viewBox="0 0 300 100" preserveAspectRatio="none">
                  {analyticsData.charts.documentChecks.length > 0 && (
                    <path
                      d={`M0,${100 - (analyticsData.charts.documentChecks[0].checks / Math.max(...analyticsData.charts.documentChecks.map(d => d.checks))) * 100} ${
                        analyticsData.charts.documentChecks.map((d, i) => 
                          `L${(i * 300) / (analyticsData.charts.documentChecks.length - 1)},${
                            100 - (d.checks / Math.max(...analyticsData.charts.documentChecks.map(c => c.checks))) * 100
                          }`
                        ).join(' ')}`}
                      stroke="rgb(168, 85, 247)"
                      strokeWidth="2"
                      fill="none"
                    />
                  )}
                </svg>
              </div>
              <div className="absolute bottom-0 w-full flex justify-between px-2">
                {analyticsData.charts.documentChecks.map((item, i) => (
                  <div key={i} className="text-xs text-gray-600 dark:text-gray-400">
                    {item.date.substring(5)}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Plagiarism Rate Chart */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Plagiarism Distribution</h3>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
              <PieChart className="h-5 w-5 text-red-500" />
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : analyticsData ? (
            <div className="h-64 flex">
              {/* Pie chart for plagiarism distribution */}
              <div className="w-1/2 flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    {/* Calculate total for percentages */}
                    {(() => {
                      const total = analyticsData.charts.plagiarismDistribution.reduce((sum, item) => sum + item.value, 0);
                      const normalizedData = analyticsData.charts.plagiarismDistribution.map(item => ({
                        ...item,
                        normalizedValue: (item.value / total) * 360 // Convert to degrees
                      }));
                      
                      let currentAngle = 0;
                      
                      return normalizedData.map((item, index) => {
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + item.normalizedValue;
                        
                        // SVG circle parameters
                        const radius = 40;
                        const strokeWidth = 20;
                        const circumference = 2 * Math.PI * radius;
                        
                        // Calculate stroke-dasharray and stroke-dashoffset
                        const dashArray = `${(item.normalizedValue / 360) * circumference} ${circumference}`;
                        const dashOffset = -((startAngle / 360) * circumference);
                        
                        // Color based on category
                        const colors = ['#4ade80', '#fbbf24', '#fb923c', '#ef4444'];
                        
                        currentAngle = endAngle;
                        
                        return (
                          <circle 
                            key={index}
                            cx="50" cy="50" r={radius}
                            fill="transparent" 
                            stroke={colors[index % colors.length]}
                            strokeWidth={strokeWidth}
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            transform="rotate(-90 50 50)"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                {analyticsData.charts.plagiarismDistribution.map((item, i) => (
                  <div key={i} className="flex items-center mb-3">
                    <div className={`h-4 w-4 rounded-full mr-2 ${
                      i === 0 ? 'bg-green-400' : 
                      i === 1 ? 'bg-yellow-400' : 
                      i === 2 ? 'bg-orange-400' : 'bg-red-500'
                    }`}></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage; 