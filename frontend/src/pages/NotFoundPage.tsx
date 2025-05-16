import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-dark-200 mb-4">
            Page Not Found
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/">
            <Button
              variant="primary"
              icon={<Home className="w-5 h-5" />}
            >
              Back to Home
            </Button>
          </Link>
          
          <Button
            variant="outline"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;