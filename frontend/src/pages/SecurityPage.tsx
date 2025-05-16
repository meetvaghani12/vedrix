import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  FileText, 
  Users, 
  RefreshCw, 
  CheckCircle,
  Server
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SecurityPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Lock />,
      title: "End-to-End Encryption",
      description: "All documents and data are encrypted in transit and at rest using AES-256 encryption standards."
    },
    {
      icon: <RefreshCw />,
      title: "Regular Security Audits",
      description: "We conduct regular penetration testing and security audits to ensure our systems remain secure."
    },
    {
      icon: <FileText />,
      title: "Document Privacy",
      description: "Your documents are never stored permanently unless explicitly requested and are automatically purged after analysis."
    },
    {
      icon: <Users />,
      title: "User Access Controls",
      description: "Granular permissions system ensures users only access data they're authorized to see."
    },
    {
      icon: <Shield />,
      title: "GDPR Compliance",
      description: "Our platform is fully compliant with GDPR and other global data protection regulations."
    },
    {
      icon: <Server />,
      title: "Secure Infrastructure",
      description: "Cloud infrastructure with multiple redundancies and 99.9% guaranteed uptime."
    },
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Independently verified controls for security, availability, and confidentiality"
    },
    {
      name: "ISO 27001",
      description: "Certified information security management system"
    },
    {
      name: "GDPR Compliant",
      description: "Full compliance with EU data protection regulations"
    },
    {
      name: "CCPA Compliant",
      description: "Adherence to California Consumer Privacy Act"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora">
            Security & Trust
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400">
            We prioritize the security of your data and content integrity with industry-leading
            safeguards and transparent practices.
          </p>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <Card variant="glass" className="p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 dark:bg-primary-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-500/10 dark:bg-accent-500/20 rounded-full filter blur-3xl"></div>
            
            <div className="md:flex items-center justify-between relative z-10">
              <div className="md:w-3/5 mb-8 md:mb-0 md:pr-12">
                <h2 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-dark-100 mb-6 font-sora">
                  Your Content and Data Security Is Our Priority
                </h2>
                <p className="text-dark-600 dark:text-dark-400 mb-6">
                  At Vedrix, we understand that your documents may contain sensitive intellectual property. 
                  That's why we've built our platform from the ground up with security and privacy as core principles.
                </p>
                <ul className="space-y-3">
                  {[
                    "End-to-end encryption for all documents",
                    "Strict data retention policies",
                    "Regular third-party security audits",
                    "Compliance with global privacy regulations"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0" />
                      <span className="text-dark-700 dark:text-dark-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="md:w-2/5 flex justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-24 h-24 text-primary-500" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security features */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-8 text-center font-sora">
            Our Security Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card variant="neumorphic" className="p-6 h-full">
                  <div className="p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/20 mb-4 inline-block">
                    <div className="text-primary-500">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-200 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-8 text-center font-sora">
            Certifications & Compliance
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} variant="glass" className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                  {cert.name}
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  {cert.description}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Data handling policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-16"
        >
          <Card variant="neumorphic" className="p-8">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-6 font-sora">
              Our Data Handling Policies
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                  Data Retention
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  By default, we do not permanently store your documents after analysis. Documents are automatically 
                  purged from our systems within 24 hours unless you specifically opt to save them to your account.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                  Access Controls
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  We implement strict access controls within our organization. Only authorized personnel with specific 
                  job requirements can access systems that process customer data, and all access is logged and monitored.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                  Third-Party Integrations
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  We carefully vet all third-party services we integrate with to ensure they meet our security standards. 
                  Data shared with third parties is limited to only what's necessary for the specific service.
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-dark-700 flex flex-wrap gap-4">
                <Button variant="outline" size="md">
                  Privacy Policy
                </Button>
                <Button variant="outline" size="md">
                  Terms of Service
                </Button>
                <Button variant="outline" size="md">
                  GDPR Compliance
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card variant="neon" className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-sora">
              Ready for Secure Plagiarism Detection?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the peace of mind that comes with using a secure, privacy-focused 
              plagiarism detection service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="primary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-white text-white hover:bg-white/10"
              >
                Contact Security Team
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityPage;