import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  buttonText: string;
  highlight?: boolean;
}

const PricingPage: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      name: 'Free',
      price: 0,
      period: billing === 'monthly' ? 'month' : 'year',
      description: 'Basic plagiarism detection for individual use',
      features: [
        { text: '3 document scans per month', included: true },
        { text: 'Up to 2,000 words per document', included: true },
        { text: 'Web content comparison', included: true },
        { text: 'Basic similarity report', included: true },
        { text: 'Email support', included: false },
        { text: 'AI rewrite suggestions', included: false },
        { text: 'Citation assistance', included: false },
        { text: 'Team sharing', included: false },
      ],
      buttonText: 'Start Free',
    },
    {
      name: 'Pro',
      price: billing === 'monthly' ? 19 : 190,
      period: billing === 'monthly' ? 'month' : 'year',
      description: 'Advanced features for writers and educators',
      features: [
        { text: '50 document scans per month', included: true },
        { text: 'Up to 10,000 words per document', included: true },
        { text: 'Web and academic content comparison', included: true },
        { text: 'Detailed similarity report', included: true },
        { text: 'Priority email support', included: true },
        { text: 'AI rewrite suggestions', included: true },
        { text: 'Citation assistance', included: true },
        { text: 'Team sharing (up to 3 users)', included: false },
      ],
      buttonText: 'Get Started',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: billing === 'monthly' ? 49 : 490,
      period: billing === 'monthly' ? 'month' : 'year',
      description: 'Complete solution for organizations and institutions',
      features: [
        { text: 'Unlimited document scans', included: true },
        { text: 'Unlimited word count', included: true },
        { text: 'Comprehensive content database', included: true },
        { text: 'Advanced analytical reports', included: true },
        { text: '24/7 dedicated support', included: true },
        { text: 'Enhanced AI writing tools', included: true },
        { text: 'Multi-format citation tools', included: true },
        { text: 'Team sharing (unlimited users)', included: true },
      ],
      buttonText: 'Contact Sales',
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
            Choose the Right Plan for Your Needs
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400 mb-10">
            Get access to our advanced plagiarism detection tools with plans 
            designed for individuals, professionals, and organizations.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-dark-800 rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-100 shadow-sm'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-800 dark:hover:text-dark-200'
              }`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billing === 'yearly'
                  ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-100 shadow-sm'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-800 dark:hover:text-dark-200'
              }`}
              onClick={() => setBilling('yearly')}
            >
              Yearly
              <span className="ml-1 text-xs py-0.5 px-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                variant={plan.highlight ? 'neon' : 'glass'}
                className={`p-6 md:p-8 h-full flex flex-col ${
                  plan.highlight
                    ? 'border-2 border-accent-500/50 relative'
                    : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-xl font-bold mb-2 ${
                    plan.highlight 
                      ? 'text-accent-500 dark:text-accent-400' 
                      : 'text-dark-900 dark:text-dark-100'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-dark-900 dark:text-dark-100">
                      ${plan.price}
                    </span>
                    <span className="text-dark-500 dark:text-dark-400 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-secondary-500 flex-shrink-0 mr-3" />
                      ) : (
                        <X className="w-5 h-5 text-dark-400 flex-shrink-0 mr-3" />
                      )}
                      <span className={feature.included 
                        ? 'text-dark-700 dark:text-dark-300' 
                        : 'text-dark-500 dark:text-dark-500'
                      }>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? 'primary' : 'outline'}
                  fullWidth
                  className={plan.highlight 
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg hover:shadow-xl' 
                    : ''
                  }
                  icon={plan.highlight ? <Zap className="w-4 h-4" /> : undefined}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <Card variant="glass" className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora">
                  Need a Custom Solution?
                </h2>
                <p className="text-dark-600 dark:text-dark-400 max-w-2xl">
                  Contact our sales team to discuss custom pricing options for your organization.
                  We offer tailored plans for educational institutions, large enterprises, and special use cases.
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="whitespace-nowrap"
              >
                Contact Sales
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-6 text-center font-sora">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "How accurate is the plagiarism detection?",
                answer: "Our system uses advanced AI algorithms to achieve over 98% accuracy in detecting plagiarism across multiple languages and sources, including paraphrased content."
              },
              {
                question: "Can I switch between plans?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll get immediate access to the new features. If you downgrade, the changes will take effect at the end of your billing cycle."
              },
              {
                question: "Is my content secure when I upload it?",
                answer: "Absolutely. We employ bank-level encryption and security measures to protect your content. Your documents are not stored permanently unless you explicitly opt to save them in your account."
              },
              {
                question: "Do you offer educational discounts?",
                answer: "Yes, we offer special pricing for educational institutions. Please contact our sales team for more information on our educational packages and volume discounts."
              },
            ].map((faq, index) => (
              <Card key={index} variant="neumorphic" className="p-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <HelpCircle className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;