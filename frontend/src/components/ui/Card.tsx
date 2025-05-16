import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'neumorphic' | 'neon' | 'solid';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  className = '',
  hover = false,
  onClick,
}) => {
  // Base classes
  const baseClasses = 'rounded-2xl overflow-hidden transition-all duration-300';
  
  // Variant-specific classes
  const variantClasses = {
    glass: 'bg-white/30 dark:bg-dark-800/30 backdrop-blur-md border border-white/20 dark:border-dark-700/20 shadow-glass dark:shadow-glass-dark',
    neumorphic: 'bg-gray-100 dark:bg-dark-800 shadow-neumorphic dark:shadow-neumorphic-dark',
    neon: 'bg-dark-900/80 border border-accent-500/50 shadow-neon',
    solid: 'bg-white dark:bg-dark-800 shadow-md',
  };
  
  // Hover classes
  const hoverClasses = hover ? 'hover:shadow-xl hover:translate-y-[-4px]' : '';
  
  // Clickable classes
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;