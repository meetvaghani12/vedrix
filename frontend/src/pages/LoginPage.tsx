import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin, error: authError, isAuthenticated, loading, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: '',
  });
  
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // If email verification is required, navigate to verification page
  useEffect(() => {
    if (verificationRequired && userEmail) {
      navigate('/verify-email', { state: { email: userEmail } });
    }
  }, [verificationRequired, userEmail, navigate]);

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

    if (!formData.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await login(formData.username, formData.password);
        // Navigation is handled by the useEffect when isAuthenticated changes
      } catch (err) {
        // Check if verification is required (this error is set by the login function)
        const errorMessage = (err as Error).message || '';
        if (errorMessage === 'Email verification required') {
          // If we know the user's email (from the login response), direct to verification
          const userByUsername = await fetch(`/api/user-by-username/?username=${formData.username}`, {
            method: 'GET',
          }).then(res => res.json());
          
          if (userByUsername && userByUsername.email) {
            setUserEmail(userByUsername.email);
            setVerificationRequired(true);
          }
        }
        // Other errors are handled in the auth context
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
        general: 'Failed to login with Google. Please try again.'
      }));
    }
  };

  const handleGoogleError = () => {
    setErrors(prev => ({
      ...prev,
      general: 'Google login was cancelled or failed. Please try again.'
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
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-dark-500 dark:text-dark-400">
            Sign in to your account to continue
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
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-dark-400" />
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
                  placeholder="your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.username}
                </p>
              )}
            </div>
            
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
                  autoComplete="current-password"
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
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-dark-600 dark:bg-dark-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-700 dark:text-dark-300">
                Remember me
              </label>
            </div>
            
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Forgot password?
            </a>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={<LogIn className="w-5 h-5" />}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
                  text="signin_with"
                  auto_select={false}
                  ux_mode="popup"
                />
              </div>
            </div>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link 
            to="/register" 
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Don't have an account? Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 