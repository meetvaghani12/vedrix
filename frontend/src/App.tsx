import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import SettingsPage from './pages/SettingsPage';
import BackgroundParticles from './components/ui/BackgroundParticles';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import ModeSelectionPage from './pages/ModeSelectionPage';

function App() {
  const { loading, user, isAuthenticated } = useAuth();
  const [userMode, setUserMode] = useState<'user' | 'admin' | null>(null);

  // Check for userMode in localStorage whenever it changes
  useEffect(() => {
    const handleModeChange = () => {
      const mode = localStorage.getItem('userMode') as 'user' | 'admin' | null;
      setUserMode(mode);
    };
    
    // Initial check
    handleModeChange();
    
    // Set up event listener for localStorage changes
    window.addEventListener('storage', handleModeChange);
    
    return () => {
      window.removeEventListener('storage', handleModeChange);
    };
  }, []);
  
  // Check if the current user can access admin routes
  const canAccessAdmin = isAuthenticated && user?.isAdmin && userMode === 'admin';
  
  // If the user is logged in but no mode is selected and user is admin, show mode selection
  const shouldShowModeSelection = isAuthenticated && user?.isAdmin && !userMode;

  if (loading) {
    // Show a simple loading spinner while authentication state is being determined
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-dark-950 transition-colors duration-300 ease-in-out">
      <BackgroundParticles />
      <Routes>
        {/* Mode Selection Route */}
        {shouldShowModeSelection && (
          <Route path="*" element={<Navigate to="/mode-selection" replace />} />
        )}
        <Route path="/mode-selection" element={<ModeSelectionPage />} />

        {/* Admin Routes - Always defined but protected */}
        <Route path="/admin" element={canAccessAdmin ? <AdminLayout /> : <Navigate to="/" replace />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Public and User Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* <Route path="pricing" element={<PricingPage />} /> */}
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<OTPVerificationPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="upload" element={<UploadPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;