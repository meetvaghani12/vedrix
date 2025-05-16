import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Scan } from 'lucide-react';
import Button from '../ui/Button';

interface ScanButtonProps {
  onScan: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const ScanButton: React.FC<ScanButtonProps> = ({ onScan, isLoading, isDisabled }) => {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="primary"
          size="lg"
          icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
          onClick={onScan}
          loading={isLoading}
          disabled={isDisabled}
          fullWidth
          className="bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Scanning...' : 'Start Plagiarism Scan'}
        </Button>
        <p className="mt-4 text-sm text-dark-500 dark:text-dark-400">
          Secure, private, and accurate analysis
        </p>
      </motion.div>
    </div>
  );
};

export default ScanButton;