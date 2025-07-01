import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of our user object
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  isAdmin?: boolean;
}

// Define the structure of our auth context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<{ requires_verification: boolean; email: string } | void>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyOTP: (otp: string, email: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL - using environment variable or fallback to proxy
const API_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/user/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            // Set isAdmin flag based on is_staff or is_superuser
            setUser({
              ...userData,
              isAdmin: userData.is_staff || userData.is_superuser
            });
            setIsAuthenticated(true);
          } else {
            // If token is invalid, clear everything
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error('Error loading user:', err);
          setError('Failed to load user data');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // Store the initial admin status from login response
        if (data.is_admin) {
          localStorage.setItem('isAdmin', 'true');
        }
        // We'll load the full user profile in the useEffect
        return;
      } else if (response.status === 403 && data.requires_verification) {
        // User needs to verify email
        setError('Email verification required. Please check your email for the verification code.');
        throw new Error('Email verification required');
      } else {
        setError(data.error || 'Login failed');
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      if ((err as Error).message !== 'Email verification required') {
        console.error('Login error:', err);
        setError('An error occurred during login');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const googleLogin = async (credential: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/google-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: credential })
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.error || 'Google login failed');
        } catch {
          setError('Google login failed');
        }
        throw new Error('Google login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      if (data.is_admin) {
        localStorage.setItem('isAdmin', 'true');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('An error occurred during Google login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_verification) {
          // Return data to redirect to verification page
          return {
            requires_verification: true,
            email: userData.email
          };
        } else {
          // If somehow no verification is required, set token
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
      } else {
        // Handle validation errors and other error responses
        if (typeof data === 'object') {
          // Extract the first error message
          const firstError = Object.entries(data)[0];
          if (firstError) {
            const [field, messages] = firstError;
            const message = Array.isArray(messages) ? messages[0] : messages;
            setError(`${field}: ${message}`);
          } else {
            setError('Registration failed');
          }
        } else {
          setError('Registration failed');
        }
        throw new Error('Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (!(err instanceof Error && err.message === 'Registration failed')) {
        setError('An error occurred during registration');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const verifyOTP = async (otp: string, email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp, email })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // The user will be loaded in the useEffect
      } else {
        setError(data.error || 'Verification failed');
        throw new Error(data.error || 'Verification failed');
      }
    } catch (err) {
      if (!(err instanceof Error && err.message === 'Verification failed')) {
        console.error('OTP verification error:', err);
        setError('An error occurred during verification');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const resendOTP = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/resend-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to resend verification code');
        throw new Error(data.error || 'Failed to resend verification code');
      }
    } catch (err) {
      if (!(err instanceof Error && err.message === 'Failed to resend verification code')) {
        console.error('Resend OTP error:', err);
        setError('An error occurred while resending the verification code');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      if (token) {
        await fetch(`${API_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userMode');
      localStorage.removeItem('isAdmin');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Clear any errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        googleLogin,
        register,
        logout,
        clearError,
        verifyOTP,
        resendOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 