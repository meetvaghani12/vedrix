import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, googleLogin, error: authError, isAuthenticated, loading, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Update general error from auth context
  useEffect(() => {
    if (authError) {
      setErrors(prev => ({ ...prev, general: authError }));
    }
  }, [authError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
      clearError();
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      try {
        const result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword,
          first_name: firstName,
          last_name: lastName
        });
        
        // Check if verification is required
        if (result && result.requires_verification) {
          // Navigate to verification page with email
          navigate('/verify-email', { state: { email: formData.email } });
        }
        // If verification is not required, useEffect will handle navigation
      } catch (err) {
        // Error handling is done in the auth context
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential);
      // Navigation is handled by the useEffect when isAuthenticated changes
    } catch (err) {
      console.error('Google login error:', err);
      setErrors(prev => ({
        ...prev,
        general: 'Failed to sign up with Google. Please try again.'
      }));
    }
  };

  const handleGoogleError = () => {
    setErrors(prev => ({
      ...prev,
      general: 'Google sign up was cancelled or failed. Please try again.'
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/20 rounded-full filter blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark backdrop-blur-sm z-10"
      >
        <div>
          <Link to="/" className="flex items-center justify-center space-x-2 text-xl font-bold font-sora">
            <Zap className="w-8 h-8 text-primary-500" />
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Vedrix
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold font-sora text-dark-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-dark-500 dark:text-dark-400">
            Sign up to get started with Vedrix
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Full Name field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.fullName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Username field */}
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
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.username ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.username}
                </p>
              )}
            </div>
            
            {/* Email field */}
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
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
                </p>
              )}
            </div>
            
            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.password}
                </p>
              )}
            </div>
            
            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={<UserPlus className="w-5 h-5" />}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-dark-800 text-dark-500 dark:text-dark-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="signup_with"
                  auto_select={false}
                  ux_mode="popup"
                />
              </div>
            </div>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link 
            to="/login" 
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Already have an account? Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 