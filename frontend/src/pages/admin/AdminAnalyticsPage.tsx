import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, ArrowUp, ArrowDown, Users, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for the charts
const mockUserData = [
  { month: 'Jan', users: 65 },
  { month: 'Feb', users: 78 },
  { month: 'Mar', users: 90 },
  { month: 'Apr', users: 81 },
  { month: 'May', users: 95 },
  { month: 'Jun', users: 110 },
];

const mockDocumentChecks = [
  { month: 'Jan', checks: 250 },
  { month: 'Feb', checks: 285 },
  { month: 'Mar', checks: 310 },
  { month: 'Apr', checks: 350 },
  { month: 'May', checks: 410 },
  { month: 'Jun', checks: 450 },
];

const mockPlagiarismRate = [
  { category: 'Original', value: 72 },
  { category: 'Minor similarities', value: 18 },
  { category: 'Significant similarities', value: 7 },
  { category: 'Plagiarized', value: 3 },
];

const AdminAnalyticsPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: '2,845',
      change: '+12.5%',
      isPositive: true,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Documents Checked',
      value: '18,392',
      change: '+8.3%',
      isPositive: true,
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Avg. Response Time',
      value: '2.3s',
      change: '-0.5s',
      isPositive: true,
      icon: <Clock className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Plagiarism Rate',
      value: '3.2%',
      change: '-0.8%',
      isPositive: true,
      icon: <PieChart className="h-6 w-6 text-red-500" />,
      color: 'bg-red-100 dark:bg-red-900/20',
    },
  ];

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
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
        ))}
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
          ) : (
            <div className="h-64 relative">
              {/* This is a placeholder for the chart. In a real application, you would use a charting library */}
              <div className="absolute inset-0 flex flex-col justify-end">
                <div className="flex items-end justify-between h-52">
                  {mockUserData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                      <div 
                        className="w-12 bg-blue-500 rounded-t-md" 
                        style={{ 
                          height: `${(item.users / Math.max(...mockUserData.map(d => d.users))) * 100}%`,
                          maxHeight: '100%' 
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
          ) : (
            <div className="h-64 relative">
              {/* This is a placeholder for the chart. In a real application, you would use a charting library */}
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-52" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <path
                    d={`M0,${100 - (mockDocumentChecks[0].checks / 450) * 100} ${mockDocumentChecks.map((d, i) => 
                      `L${(i * 300) / (mockDocumentChecks.length - 1)},${100 - (d.checks / 450) * 100}`
                    ).join(' ')}`}
                    stroke="rgb(168, 85, 247)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="absolute bottom-0 w-full flex justify-between px-2">
                {mockDocumentChecks.map((item, i) => (
                  <div key={i} className="text-xs text-gray-600 dark:text-gray-400">{item.month}</div>
                ))}
              </div>
            </div>
          )}
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
          ) : (
            <div className="h-64 flex">
              {/* This is a placeholder for a pie chart */}
              <div className="w-1/2 flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    {/* Pie chart segments */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#4ade80" 
                      strokeWidth="20" 
                      strokeDasharray={`${mockPlagiarismRate[0].value * 2.51} ${251 - mockPlagiarismRate[0].value * 2.51}`} 
                      strokeDashoffset="0" 
                    />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#fbbf24" 
                      strokeWidth="20" 
                      strokeDasharray={`${mockPlagiarismRate[1].value * 2.51} ${251 - mockPlagiarismRate[1].value * 2.51}`} 
                      strokeDashoffset={`${-mockPlagiarismRate[0].value * 2.51}`} 
                    />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#fb923c" 
                      strokeWidth="20" 
                      strokeDasharray={`${mockPlagiarismRate[2].value * 2.51} ${251 - mockPlagiarismRate[2].value * 2.51}`} 
                      strokeDashoffset={`${-(mockPlagiarismRate[0].value + mockPlagiarismRate[1].value) * 2.51}`} 
                    />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#ef4444" 
                      strokeWidth="20" 
                      strokeDasharray={`${mockPlagiarismRate[3].value * 2.51} ${251 - mockPlagiarismRate[3].value * 2.51}`} 
                      strokeDashoffset={`${-(mockPlagiarismRate[0].value + mockPlagiarismRate[1].value + mockPlagiarismRate[2].value) * 2.51}`} 
                    />
                  </svg>
                </div>
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                {mockPlagiarismRate.map((item, i) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage; 