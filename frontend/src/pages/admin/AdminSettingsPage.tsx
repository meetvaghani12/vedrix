import React, { useState } from 'react';
import { Shield, Globe, Bell, Moon, Sun, Lock, Save, UserPlus, Mail, Server, ExternalLink, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettingsPage: React.FC = () => {
  // General Settings
  const [siteName, setSiteName] = useState('Turnitin');
  const [siteDescription, setSiteDescription] = useState('Document similarity checker');
  const [contactEmail, setContactEmail] = useState('admin@turnitin.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Appearance Settings
  const [colorTheme, setColorTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6'); // blue-500
  const [accentColor, setAccentColor] = useState('#8b5cf6'); // purple-500
  
  // Security Settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [passwordRequireSpecial, setPasswordRequireSpecial] = useState(true);
  
  // Email Settings
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailFromName, setEmailFromName] = useState('Turnitin Admin');
  const [emailFromAddress, setEmailFromAddress] = useState('noreply@turnitin.com');
  
  // API Settings
  const [apiRateLimit, setApiRateLimit] = useState(1000);
  const [allowCors, setAllowCors] = useState(true);
  
  // Notification Settings
  const [adminNotifyOnNewUsers, setAdminNotifyOnNewUsers] = useState(true);
  const [adminNotifyOnErrors, setAdminNotifyOnErrors] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to backend
    console.log('Saving settings...');
    
    // Show success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden">
            <nav className="space-y-1 p-2">
              <a href="#general" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                <Globe className="h-5 w-5 mr-3" />
                <span>General</span>
              </a>
              <a href="#appearance" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-700">
                <Moon className="h-5 w-5 mr-3" />
                <span>Appearance</span>
              </a>
              <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-700">
                <Shield className="h-5 w-5 mr-3" />
                <span>Security</span>
              </a>
              <a href="#email" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-700">
                <Mail className="h-5 w-5 mr-3" />
                <span>Email</span>
              </a>
              <a href="#api" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-700">
                <Server className="h-5 w-5 mr-3" />
                <span>API</span>
              </a>
              <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-700">
                <Bell className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Settings Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <motion.section 
            id="general"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">General Settings</h3>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Site Name
                </label>
                <input
                  type="text"
                  id="site-name"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Site Description
                </label>
                <input
                  type="text"
                  id="site-description"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</span>
                  <div className="relative inline-block w-10 ml-2 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="maintenance-toggle"
                      name="maintenance-toggle"
                      className="sr-only"
                      checked={maintenanceMode}
                      onChange={() => setMaintenanceMode(!maintenanceMode)}
                    />
                    <label
                      htmlFor="maintenance-toggle"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        maintenanceMode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-700'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          maintenanceMode ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {maintenanceMode ? (
                    <span className="text-yellow-500 font-medium">Site is in maintenance mode</span>
                  ) : (
                    <span>Site is currently live</span>
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Appearance Settings */}
          <motion.section 
            id="appearance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h3>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setColorTheme('light')}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      colorTheme === 'light'
                        ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'bg-white border border-gray-300 text-gray-700 dark:bg-dark-700 dark:border-dark-600 dark:text-gray-300'
                    }`}
                  >
                    <Sun className="h-5 w-5 mr-2" />
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorTheme('dark')}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      colorTheme === 'dark'
                        ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'bg-white border border-gray-300 text-gray-700 dark:bg-dark-700 dark:border-dark-600 dark:text-gray-300'
                    }`}
                  >
                    <Moon className="h-5 w-5 mr-2" />
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorTheme('system')}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      colorTheme === 'system'
                        ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'bg-white border border-gray-300 text-gray-700 dark:bg-dark-700 dark:border-dark-600 dark:text-gray-300'
                    }`}
                  >
                    <Sun className="h-5 w-5 mr-2" />
                    <Moon className="h-5 w-5 mr-2" />
                    Auto
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Primary Color
                </label>
                <div className="mt-1 flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full mr-2 border border-gray-300 dark:border-dark-600"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <input
                    type="color"
                    id="primary-color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="accent-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Accent Color
                </label>
                <div className="mt-1 flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full mr-2 border border-gray-300 dark:border-dark-600"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <input
                    type="color"
                    id="accent-color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Security Settings */}
          <motion.section 
            id="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Two-Factor Authentication
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setTwoFactorRequired(!twoFactorRequired)}
                    className="focus:outline-none"
                  >
                    {twoFactorRequired ? (
                      <ToggleRight className="h-6 w-6 text-primary-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  id="session-timeout"
                  min="5"
                  max="240"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 60)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password-min-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    id="password-min-length"
                    min="6"
                    max="32"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(parseInt(e.target.value) || 8)}
                  />
                </div>
                
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="password-require-special"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-dark-700"
                    checked={passwordRequireSpecial}
                    onChange={() => setPasswordRequireSpecial(!passwordRequireSpecial)}
                  />
                  <label htmlFor="password-require-special" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Require special characters
                  </label>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Email Settings */}
          <motion.section 
            id="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Email Settings</h3>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Email Notifications
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setEmailEnabled(!emailEnabled)}
                    className="focus:outline-none"
                  >
                    {emailEnabled ? (
                      <ToggleRight className="h-6 w-6 text-primary-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="email-from-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  From Name
                </label>
                <input
                  type="text"
                  id="email-from-name"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                  disabled={!emailEnabled}
                  value={emailFromName}
                  onChange={(e) => setEmailFromName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="email-from-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  From Email Address
                </label>
                <input
                  type="email"
                  id="email-from-address"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                  disabled={!emailEnabled}
                  value={emailFromAddress}
                  onChange={(e) => setEmailFromAddress(e.target.value)}
                />
              </div>
            </div>
          </motion.section>

          {/* API Settings */}
          <motion.section 
            id="api"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">API Settings</h3>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="api-rate-limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  API Rate Limit (requests per day)
                </label>
                <input
                  type="number"
                  id="api-rate-limit"
                  min="100"
                  max="10000"
                  step="100"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-800"
                  value={apiRateLimit}
                  onChange={(e) => setApiRateLimit(parseInt(e.target.value) || 1000)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow Cross-Origin Requests (CORS)
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setAllowCors(!allowCors)}
                    className="focus:outline-none"
                  >
                    {allowCors ? (
                      <ToggleRight className="h-6 w-6 text-primary-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-dark-700 rounded-md">
                <div className="flex items-center mb-2">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span className="font-medium">API Documentation</span>
                </div>
                <p>API documentation and keys can be found in the developer portal.</p>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block">
                  Visit Developer Portal
                </a>
              </div>
            </div>
          </motion.section>

          {/* Notification Settings */}
          <motion.section 
            id="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserPlus className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notify admins when new users register
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setAdminNotifyOnNewUsers(!adminNotifyOnNewUsers)}
                    className="focus:outline-none"
                  >
                    {adminNotifyOnNewUsers ? (
                      <ToggleRight className="h-6 w-6 text-primary-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notify admins on system errors
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setAdminNotifyOnErrors(!adminNotifyOnErrors)}
                    className="focus:outline-none"
                  >
                    {adminNotifyOnErrors ? (
                      <ToggleRight className="h-6 w-6 text-primary-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage; 