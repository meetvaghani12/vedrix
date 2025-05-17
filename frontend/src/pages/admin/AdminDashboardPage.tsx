import React from 'react';
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  Info, 
  AlertTriangle, 
  Clock
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface ActivityLogProps {
  activities: {
    user: string;
    action: string;
    time: string;
  }[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="rounded-full bg-gray-100 dark:bg-dark-700 p-2">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.user}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.action}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SystemNoticeProps {
  notices: {
    title: string;
    description: string;
    type: 'info' | 'warning';
  }[];
}

const SystemNotice: React.FC<SystemNoticeProps> = ({ notices }) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Notices</h3>
      <div className="space-y-4">
        {notices.map((notice, index) => (
          <div key={index} className={`p-4 rounded-lg ${
            notice.type === 'info' 
              ? 'bg-blue-50 dark:bg-blue-900/20' 
              : 'bg-amber-50 dark:bg-amber-900/20'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {notice.type === 'info' ? (
                  <Info className={`w-5 h-5 text-blue-500 dark:text-blue-400`} />
                ) : (
                  <AlertTriangle className={`w-5 h-5 text-amber-500 dark:text-amber-400`} />
                )}
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${
                  notice.type === 'info' 
                    ? 'text-blue-800 dark:text-blue-300' 
                    : 'text-amber-800 dark:text-amber-300'
                }`}>
                  {notice.title}
                </h4>
                <p className={`text-xs mt-1 ${
                  notice.type === 'info' 
                    ? 'text-blue-700 dark:text-blue-400' 
                    : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {notice.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  // Mock data - in a real app, you would fetch this from your API
  const stats = [
    { 
      title: 'Total Users', 
      value: 2451, 
      icon: <Users className="w-6 h-6 text-white" />, 
      color: 'bg-blue-500 dark:bg-blue-600' 
    },
    { 
      title: 'Documents Scanned', 
      value: 9823, 
      icon: <FileText className="w-6 h-6 text-white" />, 
      color: 'bg-green-500 dark:bg-green-600' 
    },
    { 
      title: 'Active Sessions', 
      value: 157, 
      icon: <TrendingUp className="w-6 h-6 text-white" />, 
      color: 'bg-purple-500 dark:bg-purple-600' 
    },
    { 
      title: 'System Uptime', 
      value: '99.9%', 
      icon: <Settings className="w-6 h-6 text-white" />, 
      color: 'bg-amber-500 dark:bg-amber-600' 
    },
  ];

  const activities = [
    { user: 'John Doe', action: 'Updated user profile settings', time: '5 minutes ago' },
    { user: 'Sarah Smith', action: 'Uploaded a new document for scanning', time: '10 minutes ago' },
    { user: 'Mike Johnson', action: 'Changed account password', time: '25 minutes ago' },
    { user: 'Emily Brown', action: 'Registered a new account', time: '1 hour ago' },
    { user: 'Admin User', action: 'System maintenance completed', time: '2 hours ago' },
  ];

  const notices = [
    { 
      title: 'Scheduled Maintenance', 
      description: 'System maintenance scheduled for tomorrow at 2:00 AM UTC. Expected downtime: 30 minutes.', 
      type: 'info' 
    },
    { 
      title: 'Storage Warning', 
      description: 'Database storage usage at 85%. Consider optimizing or increasing capacity.', 
      type: 'warning' 
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your system status and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityLog activities={activities} />
        </div>
        <div>
          <SystemNotice notices={notices} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 