import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-md pt-12 pb-8 border-t border-gray-200 dark:border-dark-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold font-sora mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Vedrix
              </span>
            </Link>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Advanced AI-powered plagiarism detection for educators, writers, and enterprises.
              Ensuring content integrity with cutting-edge technology.
            </p>
            <div className="flex space-x-4 text-dark-500 dark:text-dark-400">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-900 dark:text-dark-200 mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              {['Features', , 'Case Studies', 'Reviews', 'Updates'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-900 dark:text-dark-200 mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {['Documentation', 'Help Center', 'API', 'Community', 'Blog'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-900 dark:text-dark-200 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {['About', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-800">
          <p className="text-center text-dark-500 dark:text-dark-400 text-sm">
            © {new Date().getFullYear()} Vedrix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;