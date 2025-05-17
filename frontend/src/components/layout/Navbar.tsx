import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Zap, Sun, Moon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Upload', path: '/upload' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Security', path: '/security' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-dark-900/80 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold font-sora"
          >
            <Shield className="w-8 h-8 text-primary-500" />
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Vedrix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-200
                ${location.pathname === link.path || (link.path.includes('#') && location.pathname === '/')
                  ? 'text-primary-500 dark:text-primary-400' 
                  : 'text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/register" className="flex items-center text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </motion.button>
            )}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full text-dark-600 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-dark-600 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-dark-600 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-dark-900 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col h-full pt-16 overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 text-base font-medium text-dark-800 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-center rounded-xl font-medium shadow-lg"
                >
                  <span className="flex items-center justify-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </span>
                </button>
              ) : (
                <Link
                  to="/register"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-center rounded-xl font-medium shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center justify-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Get Started
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;