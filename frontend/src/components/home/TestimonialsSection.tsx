import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "This platform revolutionized how our university handles academic integrity. The AI detection is far more sophisticated than competitors, catching even cleverly paraphrased content.",
    author: "Dr. Sarah Johnson",
    role: "Department Chair",
    company: "Stanford University",
    rating: 5,
  },
  {
    id: 2,
    quote: "As a content creator, I needed a reliable way to ensure my work remains original. This tool not only detects potential issues but offers smart rewrites that maintain my voice.",
    author: "Michael Chen",
    role: "Content Director",
    company: "Creative Publishing",
    rating: 5,
  },
  {
    id: 3,
    quote: "The detailed reports and source tracking have saved our editorial team countless hours of manual verification. Absolutely essential for any serious publication.",
    author: "Amelia Rodriguez",
    role: "Editor-in-Chief",
    company: "Global Media Group",
    rating: 4,
  },
  {
    id: 4,
    quote: "Unlike other plagiarism checkers, this platform catches content across multiple languages. As an international institution, this feature alone made it worth the investment.",
    author: "Prof. Jean-Pierre Dubois",
    role: "Academic Director",
    company: "International Academy of Sciences",
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, current]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-dark-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-dark-950 dark:to-dark-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100 mb-4 font-sora"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Trusted by Educators & Content Creators
          </motion.h2>
          <motion.p 
            className="text-lg text-dark-600 dark:text-dark-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            See what our customers say about our plagiarism detection solution
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial slider */}
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full"
              >
                <Card variant="glass" className="p-6 md:p-10">
                  <div className="mb-6 text-accent-500 dark:text-accent-400">
                    <Quote className="w-12 h-12 opacity-50" />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <p className="text-lg md:text-xl text-dark-800 dark:text-dark-200 italic mb-6 text-center">
                      "{testimonials[current].quote}"
                    </p>
                    
                    <div className="flex items-center justify-center mb-3">
                      {renderStars(testimonials[current].rating)}
                    </div>
                    
                    <div className="text-center">
                      <h4 className="font-semibold text-dark-900 dark:text-dark-100">
                        {testimonials[current].author}
                      </h4>
                      <p className="text-dark-600 dark:text-dark-400">
                        {testimonials[current].role}, {testimonials[current].company}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300 shadow-md hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-300 dark:bg-dark-600 hover:bg-primary-400 dark:hover:bg-primary-700'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300 shadow-md hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;