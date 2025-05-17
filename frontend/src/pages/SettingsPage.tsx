import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  PaintBucket, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Save,
  Moon,
  Sun
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [profileErrors, setProfileErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });
  
  // Update form with user data when it's loaded
  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);
  
  // Profile form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
    
    // Clear error when user types
    if (profileErrors[name as keyof typeof profileErrors]) {
      setProfileErrors({
        ...profileErrors,
        [name]: '',
      });
    }
  };
  
  const validateProfileForm = () => {
    let isValid = true;
    const newErrors = { ...profileErrors };
    
    if (!profileForm.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!profileForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!profileForm.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    
    if (!profileForm.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Only validate password if user is trying to change it
    if (profileForm.password) {
      if (profileForm.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      if (!profileForm.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (profileForm.password !== profileForm.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setProfileErrors(newErrors);
    return isValid;
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateProfileForm()) {
      // TODO: Implement profile update logic
      console.log('Profile updated:', profileForm);
      // For now, just show a success message
      alert('Profile updated successfully!');
    }
  };
  
  // Plans data
  const plans = [
    {
      name: 'Free',
      price: '0',
      features: ['Basic plagiarism detection', '3 documents per month', 'Standard report'],
      current: true,
    },
    {
      name: 'Pro',
      price: '9.99',
      features: ['Advanced plagiarism detection', 'Unlimited documents', 'Detailed reports', 'Priority support'],
      current: false,
    },
    {
      name: 'Team',
      price: '29.99',
      features: ['Everything in Pro', 'Team collaboration', 'API access', 'Custom integration'],
      current: false,
    }
  ];
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-sora text-dark-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-dark-500 dark:text-dark-400">
            Manage your account settings and preferences
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto mb-8 border-b border-gray-200 dark:border-dark-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium text-lg whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-primary-500 border-b-2 border-primary-500 dark:border-primary-400'
                : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
            }`}
          >
            <User className="inline-block w-5 h-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 font-medium text-lg whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'text-primary-500 border-b-2 border-primary-500 dark:border-primary-400'
                : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
            }`}
          >
            <PaintBucket className="inline-block w-5 h-5 mr-2" />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-2 font-medium text-lg whitespace-nowrap ${
              activeTab === 'plan'
                ? 'text-primary-500 border-b-2 border-primary-500 dark:border-primary-400'
                : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="inline-block w-5 h-5 mr-2" />
            Plan Details
          </button>
        </div>
        
        {/* Content */}
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-md">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-dark-900 dark:text-white">Profile Information</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {profileErrors.general && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{profileErrors.general}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-dark-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                          profileErrors.firstName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                        } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                        placeholder="John"
                      />
                    </div>
                    {profileErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {profileErrors.firstName}
                      </p>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-dark-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                          profileErrors.lastName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                        } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                        placeholder="Doe"
                      />
                    </div>
                    {profileErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {profileErrors.lastName}
                      </p>
                    )}
                  </div>
                  
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-dark-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                        className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                          profileErrors.username ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                        } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                        placeholder="johndoe"
                      />
                    </div>
                    {profileErrors.username && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {profileErrors.username}
                      </p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-dark-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                          profileErrors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                        } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {profileErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="text-lg font-medium mb-4 text-dark-900 dark:text-white">Change Password</h3>
                  <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
                    Leave these fields empty if you don't want to change your password.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-dark-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={profileForm.password}
                          onChange={handleProfileChange}
                          className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                            profileErrors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                          } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                          placeholder="••••••••"
                        />
                      </div>
                      {profileErrors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" /> {profileErrors.password}
                        </p>
                      )}
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-dark-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={handleProfileChange}
                          className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                            profileErrors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                          } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                          placeholder="••••••••"
                        />
                      </div>
                      {profileErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" /> {profileErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={<Save className="w-5 h-5" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-dark-900 dark:text-white">Appearance</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-xl">
                  <h3 className="text-lg font-medium mb-4 text-dark-900 dark:text-white flex items-center">
                    <PaintBucket className="w-5 h-5 mr-2" />
                    Theme
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`flex-1 p-4 rounded-xl text-left ${
                        theme === 'light' 
                          ? 'bg-white border-2 border-primary-500 shadow-lg' 
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sun className="w-6 h-6 text-amber-500 mr-3" />
                          <div>
                            <p className="font-medium text-dark-900">Light Mode</p>
                            <p className="text-sm text-dark-500">Light background with dark text</p>
                          </div>
                        </div>
                        {theme === 'light' && <CheckCircle className="w-5 h-5 text-primary-500" />}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`flex-1 p-4 rounded-xl text-left ${
                        theme === 'dark' 
                          ? 'bg-dark-800 border-2 border-primary-500 shadow-lg' 
                          : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Moon className="w-6 h-6 text-indigo-400 mr-3" />
                          <div>
                            <p className="font-medium text-white">Dark Mode</p>
                            <p className="text-sm text-gray-400">Dark background with light text</p>
                          </div>
                        </div>
                        {theme === 'dark' && <CheckCircle className="w-5 h-5 text-primary-500" />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Plan Details */}
          {activeTab === 'plan' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-dark-900 dark:text-white">Plan Details</h2>
              
              <div className="mb-8">
                <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-xl">
                  {plans.map(plan => (
                    plan.current && (
                      <div key={plan.name} className="flex items-center">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                            Your Current Plan: {plan.name}
                          </h3>
                          <p className="text-dark-500 dark:text-dark-400">
                            ${plan.price}/month
                          </p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-dark-900 dark:text-white">Available Plans</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div
                    key={plan.name}
                    className={`bg-white dark:bg-dark-800 border ${
                      plan.current 
                        ? 'border-primary-500 dark:border-primary-500 ring-2 ring-primary-500/30' 
                        : 'border-gray-200 dark:border-dark-700'
                    } rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <h4 className="text-xl font-bold text-dark-900 dark:text-white mb-2">{plan.name}</h4>
                    <p className="text-3xl font-bold text-dark-900 dark:text-white mb-4">
                      ${plan.price}
                      <span className="text-sm font-normal text-dark-500 dark:text-dark-400">/month</span>
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-dark-700 dark:text-dark-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={plan.current ? 'outline' : 'primary'}
                      size="lg"
                      fullWidth
                      disabled={plan.current}
                    >
                      {plan.current ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 