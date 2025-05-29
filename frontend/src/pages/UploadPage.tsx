import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadArea from '../components/upload/UploadArea';
import ScanOptions from '../components/upload/ScanOptions';
import ScanButton from '../components/upload/ScanButton';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Download, Copy, ArrowRight } from 'lucide-react';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleOptionSelected = (option: string) => {
    setSelectedOption(option);
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    // Automatically select "Comprehensive" option when text is extracted
    setSelectedOption('comprehensive');
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
  
  const copyToClipboard = async () => {
    if (extractedText) {
      try {
        await navigator.clipboard.writeText(extractedText);
        alert('Text copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };
  
  const downloadText = () => {
    if (extractedText) {
      const element = document.createElement('a');
      const file = new Blob([extractedText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${selectedFile?.name.split('.')[0] || 'extracted'}_text.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const continueToResults = () => {
    if (extractedText) {
      // Store the extracted text in session storage for use in results page
      sessionStorage.setItem('extractedText', extractedText);
      
      // Navigate to results page
      navigate('/results');
    }
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
              Get instant text extraction from PDF, DOC, and DOCX files.
              Simply upload your file and get clean, readable text in seconds.
            </p>
          </div>

          <Card variant="glass" className="p-6 md:p-10 mb-8">
            <div className="mb-12">
              <UploadArea 
                onFileSelected={handleFileSelected} 
                onTextExtracted={handleTextExtracted}
              />
            </div>

            {extractedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-200">
                      Extracted Text
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        icon={<Copy className="w-4 h-4" />}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadText}
                        icon={<Download className="w-4 h-4" />}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-dark-700 dark:text-dark-300 whitespace-pre-wrap font-sans text-sm">
                      {showFullText || extractedText.length <= 1000 
                        ? extractedText 
                        : `${extractedText.substring(0, 1000)}...`}
                    </pre>
                  </div>
                  
                  {extractedText.length > 1000 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullText(!showFullText)}
                      >
                        {showFullText ? 'Show Less' : 'Show Full Text'}
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={continueToResults}
                      icon={<ArrowRight className="w-4 h-4 ml-2" />}
                    >
                      Continue to Analysis
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedFile && !extractedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <ScanOptions onOptionSelected={handleOptionSelected} />
              </motion.div>
            )}

            {selectedFile && selectedOption && !extractedText && (
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