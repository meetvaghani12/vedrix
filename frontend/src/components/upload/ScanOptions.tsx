import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, DivideIcon as LucideIcon, Globe, Database, BookMarked } from 'lucide-react';
import Card from '../ui/Card';

interface ScanOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ScanOptionsProps {
  onOptionSelected: (option: string) => void;
}

const ScanOptions: React.FC<ScanOptionsProps> = ({ onOptionSelected }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options: ScanOption[] = [
    {
      id: 'academic',
      icon: BookOpen,
      title: 'Academic',
      description: 'Compare against academic journals, research papers, and scholarly publications',
    },
    {
      id: 'web',
      icon: Globe,
      title: 'Web Content',
      description: 'Check against websites, blogs, news articles, and online publications',
    },
    {
      id: 'comprehensive',
      icon: Database,
      title: 'Comprehensive',
      description: 'Full analysis across all sources for maximum detection (recommended)',
    },
    {
      id: 'custom',
      icon: BookMarked,
      title: 'Custom Sources',
      description: 'Add specific sources or databases to compare against',
    },
  ];

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
    onOptionSelected(id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-200 mb-2">
          Choose Scanning Depth
        </h3>
        <p className="text-dark-500 dark:text-dark-400">
          Select which content sources to check against
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption === option.id;
          
          return (
            <motion.div
              key={option.id}
              whileHover={{ y: -4 }}
              whileTap={{ y: 0 }}
              onClick={() => handleOptionClick(option.id)}
            >
              <Card
                variant={isSelected ? 'neon' : 'glass'}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-accent-500 shadow-neon'
                    : 'hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-xl mr-4 ${
                    isSelected 
                      ? 'bg-accent-500/20' 
                      : 'bg-primary-500/10 dark:bg-primary-500/20'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isSelected 
                        ? 'text-accent-400' 
                        : 'text-primary-500'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      isSelected 
                        ? 'text-accent-400'
                        : 'text-dark-800 dark:text-dark-200'
                    }`}>
                      {option.title}
                    </h4>
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-6 h-6 rounded-full border-2 border-accent-500 flex items-center justify-center"
                    >
                      <div className="w-3 h-3 rounded-full bg-accent-500" />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ScanOptions;