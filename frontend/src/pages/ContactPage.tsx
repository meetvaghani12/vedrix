import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Send,
  AlertCircle,
  FileQuestion,
  Users,
  MessageCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      details: "support@plaegiguard.com",
      action: "Send an Email",
      link: "mailto:support@plaegiguard.com"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      action: "Make a Call",
      link: "tel:+15551234567"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Live Chat",
      details: "Available 24/7",
      action: "Start Chat",
      link: "#"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      details: "123 Tech Street, San Francisco, CA",
      action: "Get Directions",
      link: "#"
    },
  ];

  const helpTopics = [
    {
      icon: <FileQuestion className="w-10 h-10 text-primary-500" />,
      title: "FAQs",
      description: "Find answers to frequently asked questions about our services and features."
    },
    {
      icon: <Users className="w-10 h-10 text-primary-500" />,
      title: "Community Forum",
      description: "Connect with other users, share insights, and learn tips and tricks."
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-primary-500" />,
      title: "Knowledge Base",
      description: "Access detailed guides, tutorials, and troubleshooting resources."
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formState.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formState.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };

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
            Contact Us
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400">
            Have questions or need assistance? We're here to help.
            Our support team is available to address any inquiries you may have.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="glass" className="p-6 md:p-8 h-full">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-6 font-sora">
                Send Us a Message
              </h2>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 p-4 rounded-lg mb-6 flex items-start"
                >
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm">Thank you for contacting us. We'll respond to your inquiry as soon as possible.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.name 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-dark-700'
                      } bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-dark-700'
                      } bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.subject 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-dark-700'
                      } bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.message 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-dark-700'
                      } bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSubmitting}
                      icon={<Send className="w-4 h-4" />}
                      className="w-full md:w-auto"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <Card variant="neumorphic" className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-6 font-sora">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/20 mr-4">
                      <div className="text-primary-500">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark-800 dark:text-dark-200 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-dark-600 dark:text-dark-400 mb-2">
                        {item.details}
                      </p>
                      <a 
                        href={item.link} 
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {item.action} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card variant="glass" className="p-6 md:p-8 flex-grow">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-6 font-sora">
                Business Hours
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-700">
                  <span className="font-medium text-dark-800 dark:text-dark-200">Monday - Friday</span>
                  <span className="text-dark-600 dark:text-dark-400">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-700">
                  <span className="font-medium text-dark-800 dark:text-dark-200">Saturday</span>
                  <span className="text-dark-600 dark:text-dark-400">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-700">
                  <span className="font-medium text-dark-800 dark:text-dark-200">Sunday</span>
                  <span className="text-dark-600 dark:text-dark-400">Closed</span>
                </div>
                <div className="py-2">
                  <span className="text-dark-600 dark:text-dark-400">
                    * Online customer support available 24/7
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Help Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-8 text-center font-sora">
            Self-Service Help Resources
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {helpTopics.map((topic, index) => (
              <Card key={index} variant="glass" className="p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 flex items-center justify-center mb-4">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark-800 dark:text-dark-200 mb-2">
                  {topic.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 mb-6">
                  {topic.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Explore
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card variant="neumorphic" className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-6 font-sora">
              Our Location
            </h2>
            
            <div className="aspect-video bg-gray-200 dark:bg-dark-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-primary-500" />
                <p className="absolute mt-20 text-dark-800 dark:text-dark-200 font-medium">
                  123 Tech Street, San Francisco, CA
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;