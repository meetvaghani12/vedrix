import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Upload } from 'lucide-react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-20 md:pb-32">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/30 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/10 dark:bg-accent-500/30 rounded-full filter blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-sora bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent leading-tight mb-6"
          >
            Revolutionize Content Integrity with AI-Powered Plagiarism Detection
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-dark-700 dark:text-dark-300 mb-8 max-w-3xl mx-auto"
          >
            Lightning-fast, accurate, and built for writers, educators, and enterprises.
            Our cutting-edge AI analyzes your content with unmatched precision.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/register">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Upload className="w-5 h-5" />}
              >
                Start Free Scan
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              icon={<Play className="w-5 h-5" />}
            >
              Watch Demo
            </Button>
          </motion.div>
          
          {/* Abstract background animation */}
          <motion.div 
            variants={itemVariants}
            className="relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/80 via-primary-800/70 to-accent-900/80 backdrop-blur-sm">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full border-4 border-t-transparent border-primary-300/50 animate-spin"></div>
                  <Play className="w-12 h-12 text-white/90" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;