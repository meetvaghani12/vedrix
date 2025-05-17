import React from 'react';
import { Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ModeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const selectMode = (mode: 'admin' | 'user') => {
    localStorage.setItem('userMode', mode);
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    if (mode === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Background gradient elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/20 rounded-full filter blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark backdrop-blur-sm z-10"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold font-sora text-dark-900 dark:text-white">
            Choose Your Mode
          </h2>
          <p className="mt-2 text-lg text-dark-500 dark:text-dark-400">
            Welcome back, {user?.first_name || 'Admin'}! Please select how you'd like to use the application.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectMode('admin')}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-700 border-2 border-primary-100 dark:border-dark-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all"
          >
            <div className="bg-primary-50 dark:bg-dark-600 p-4 rounded-full mb-4">
              <Shield className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Admin Mode</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Access administrative features, manage users, and view system analytics.
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectMode('user')}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-700 border-2 border-primary-100 dark:border-dark-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all"
          >
            <div className="bg-accent-50 dark:bg-dark-600 p-4 rounded-full mb-4">
              <User className="w-12 h-12 text-accent-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Mode</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Use standard features like document scanning, results viewing, and personal settings.
            </p>
          </motion.button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          You can switch between modes at any time using the account menu.
        </p>
      </motion.div>
    </div>
  );
};

export default ModeSelectionPage; 