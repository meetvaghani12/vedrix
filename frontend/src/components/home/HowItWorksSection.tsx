import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, FileText } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: 'Upload Your Content',
    description: 'Upload your document, paper, or text via our secure drag-and-drop interface.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: 'AI-Powered Analysis',
    description: 'Our advanced algorithms scan and compare your content against billions of sources.',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Review Detailed Results',
    description: 'Get comprehensive insights with highlighted matches, source links, and rewrite suggestions.',
    color: 'from-accent-500 to-accent-600',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-dark-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How Vedrix Works
          </motion.h2>
          <motion.p 
            className="text-lg text-dark-600 dark:text-dark-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our simple three-step process ensures thorough plagiarism detection with detailed reporting
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              {/* Step connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-dark-700 dark:to-dark-800 -z-10 transform -translate-x-1/2" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 mb-6 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;