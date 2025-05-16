import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page in history
  };

  return (
    <motion.button
      className="fixed top-6 left-6 z-50 p-3 rounded-full bg-white dark:bg-dark-800 shadow-md hover:shadow-lg text-dark-700 dark:text-dark-300 transition-all"
      onClick={handleGoBack}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </motion.button>
  );
};

export default BackButton; 