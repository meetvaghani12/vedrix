import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadArea from '../components/upload/UploadArea';
import ScanOptions from '../components/upload/ScanOptions';
import ScanButton from '../components/upload/ScanButton';
import Card from '../components/ui/Card';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleOptionSelected = (option: string) => {
    setSelectedOption(option);
  };

  const handleScan = () => {
    if (!selectedFile || !selectedOption) return;

    setIsScanning(true);
    setProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/results');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora">
              Upload Your Document
            </h1>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Get instant plagiarism detection with our advanced AI analysis. 
              Simply upload your file and get comprehensive results in seconds.
            </p>
          </div>

          <Card variant="glass" className="p-6 md:p-10 mb-8">
            <div className="mb-12">
              <UploadArea onFileSelected={handleFileSelected} />
            </div>

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <ScanOptions onOptionSelected={handleOptionSelected} />
              </motion.div>
            )}

            {selectedFile && selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ScanButton 
                  onScan={handleScan}
                  isLoading={isScanning}
                  isDisabled={!selectedFile || !selectedOption}
                />
              </motion.div>
            )}
          </Card>

          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <Card variant="solid" className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-dark-800 dark:text-dark-200">
                  Scan Progress
                </h3>
                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-4 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  />
                </div>
                <div className="flex justify-between text-sm text-dark-500 dark:text-dark-400">
                  <span>Analyzing document...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-4 space-y-2">
                  {progress > 10 && (
                    <div className="flex items-center text-sm text-dark-600 dark:text-dark-400">
                      <div className="w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      </div>
                      <span>Preprocessing document</span>
                    </div>
                  )}
                  {progress > 30 && (
                    <div className="flex items-center text-sm text-dark-600 dark:text-dark-400">
                      <div className="w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      </div>
                      <span>Comparing against academic sources</span>
                    </div>
                  )}
                  {progress > 60 && (
                    <div className="flex items-center text-sm text-dark-600 dark:text-dark-400">
                      <div className="w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      </div>
                      <span>Analyzing web content matches</span>
                    </div>
                  )}
                  {progress > 85 && (
                    <div className="flex items-center text-sm text-dark-600 dark:text-dark-400">
                      <div className="w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      </div>
                      <span>Generating detailed report</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;