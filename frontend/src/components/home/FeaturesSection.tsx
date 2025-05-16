import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Clock,
  Shield,
  Database,
  Sparkles,
  LineChart,
  Book,
  Globe,
} from 'lucide-react';
import Card from '../ui/Card';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card variant="glass" hover className="h-full p-6">
        <div className="flex flex-col items-start h-full">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-2">
            {title}
          </h3>
          <p className="text-dark-600 dark:text-dark-400">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-primary-500" />,
      title: "Advanced AI",
      description: "Our machine learning algorithms detect even the most sophisticated paraphrasing and content modifications.",
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-500" />,
      title: "Real-time Results",
      description: "Get instant feedback with our lightning-fast scanning and matching technology.",
    },
    {
      icon: <Shield className="w-6 h-6 text-primary-500" />,
      title: "Secure & Private",
      description: "Your documents are encrypted and never stored without your permission. Your content stays yours.",
    },
    {
      icon: <Database className="w-6 h-6 text-primary-500" />,
      title: "Massive Database",
      description: "Compare against billions of web pages, academic journals, and publications for thorough analysis.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary-500" />,
      title: "AI Rewrite Suggestions",
      description: "Get intelligent suggestions for improving flagged content while maintaining your ideas.",
    },
    {
      icon: <LineChart className="w-6 h-6 text-primary-500" />,
      title: "Detailed Analytics",
      description: "Comprehensive reports with percentage matches, sources, and content improvement metrics.",
    },
    {
      icon: <Book className="w-6 h-6 text-primary-500" />,
      title: "Citation Tools",
      description: "Automatically generate citations for matched sources in multiple formats (APA, MLA, Chicago).",
    },
    {
      icon: <Globe className="w-6 h-6 text-primary-500" />,
      title: "Multilingual Support",
      description: "Detect plagiarism across 30+ languages with our advanced language processing capabilities.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-dark-900 dark:to-dark-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Powerful Features for Content Integrity
          </motion.h2>
          <motion.p 
            className="text-lg text-dark-600 dark:text-dark-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our comprehensive toolkit ensures your content remains original and properly attributed
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;