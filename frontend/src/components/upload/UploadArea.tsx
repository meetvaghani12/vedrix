import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  onTextExtracted?: (text: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelected, onTextExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File) => {
    // Reset states
    setUploadError(null);
    setExtractedText(null);
    setSelectedFile(file);
    onFileSelected(file);
    
    // Check file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      setUploadError('Unsupported file type. Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    // Upload file to server
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', file.name);
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/documents/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          // Don't set Content-Type header when using FormData
          // browser will automatically set the correct boundary
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // The extracted text is now included in the response
      if (data.extracted_text) {
        setExtractedText(data.extracted_text);
        
        if (onTextExtracted) {
          onTextExtracted(data.extracted_text);
        }
      } else {
        // If for some reason the extracted text isn't in the response, fetch it
        const textResponse = await fetch(`http://localhost:8000/api/documents/${data.id}/extracted_text/`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!textResponse.ok) {
          throw new Error(`Failed to get extracted text with status: ${textResponse.status}`);
        }
        
        const textData = await textResponse.json();
        setExtractedText(textData.extracted_text);
        
        if (onTextExtracted) {
          onTextExtracted(textData.extracted_text);
        }
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setExtractedText(null);
    setUploadError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".doc,.docx,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <motion.div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600'
        } ${
          selectedFile ? 'bg-gray-50 dark:bg-dark-800/50' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
      >
        {!selectedFile ? (
          <div className="py-8">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 flex items-center justify-center"
            >
              <Upload className={`w-10 h-10 ${isDragging ? 'text-primary-500' : 'text-dark-400 dark:text-dark-500'}`} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-dark-800 dark:text-dark-200">
              {isDragging ? 'Drop your file here' : 'Drag & Drop your file here'}
            </h3>
            <p className="text-dark-500 dark:text-dark-400 mb-6">or</p>
            <Button
              variant="primary"
              size="md"
              onClick={openFileInput}
              className="mx-auto"
            >
              Browse Files
            </Button>
            <p className="mt-4 text-sm text-dark-500 dark:text-dark-400">
              Supported formats: .docx, .pdf, .doc (max 10MB)
            </p>
          </div>
        ) : (
          <div className="py-6">
            <div className="flex items-center justify-between bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-dark-800 dark:text-dark-200 truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeSelectedFile}
                className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {isUploading && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                  <div className="h-full rounded-full bg-primary-500 animate-pulse" style={{ width: '100%' }}></div>
                </div>
                <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
                  Uploading and extracting text...
                </p>
              </div>
            )}
            
            {uploadError && (
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-red-500">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>{uploadError}</p>
                </div>
              </div>
            )}
            
            {!isUploading && !uploadError && (
            <div className="mt-6 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center mr-2"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
                <p className="text-secondary-500 font-medium">
                  {extractedText ? 'Text extracted successfully' : 'File ready for processing'}
                </p>
            </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UploadArea;