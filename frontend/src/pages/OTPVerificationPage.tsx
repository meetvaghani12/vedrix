import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, CheckCircle, AlertCircle, RotateCw } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP, isAuthenticated, loading, error, clearError } = useAuth();
  
  // Get email from state or use empty string
  const email = location.state?.email || '';

  const [formData, setFormData] = useState({
    otp: '',
    email: email
  });
  
  const [errors, setErrors] = useState({
    otp: '',
    email: '',
    general: ''
  });

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Update errors from auth context
  useEffect(() => {
    if (error) {
      setErrors(prev => ({ ...prev, general: error }));
    }
  }, [error]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Auto-format OTP to maximum 6 digits
    if (name === 'otp' && value.length > 6) {
      return;
    }
    
    // Only allow digits for OTP
    if (name === 'otp' && !/^\d*$/.test(value)) {
      return;
    }
    
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

    if (!formData.otp) {
      newErrors.otp = 'Verification code is required';
      isValid = false;
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'Verification code must be 6 digits';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await verifyOTP(formData.otp, formData.email);
        // Navigation is handled by the useEffect when isAuthenticated changes
      } catch (err) {
        // Error is handled in the auth context
      }
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required to resend verification code' }));
      return;
    }
    
    try {
      await resendOTP(formData.email);
      setCanResend(false);
      setCountdown(60);
    } catch (err) {
      // Error is handled in the auth context
    }
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
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-dark-500 dark:text-dark-400">
            We've sent a 6-digit verification code to {formData.email || 'your email address'}. 
            Enter the code below to confirm your email address.
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
            {!formData.email && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors text-center`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
                  </p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.otp ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                } rounded-xl placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-dark-700 text-dark-900 dark:text-white transition-colors text-center`}
                placeholder="123456"
                maxLength={6}
                style={{ letterSpacing: '0.5em', fontSize: '1.5em' }}
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.otp}
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
              icon={<CheckCircle className="w-5 h-5" />}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
            
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend}
                className={`flex items-center text-sm font-medium ${
                  canResend 
                    ? 'text-primary-600 hover:text-primary-500 dark:text-primary-400' 
                    : 'text-dark-400 dark:text-dark-500 cursor-not-allowed'
                }`}
              >
                <RotateCw className="w-4 h-4 mr-1" />
                {canResend 
                  ? 'Resend verification code' 
                  : `Resend code in ${countdown}s`
                }
              </button>
            </div>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link 
            to="/login" 
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerificationPage; 