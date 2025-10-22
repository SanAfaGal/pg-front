import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    hover = false, 
    variant = 'default',
    padding = 'md',
    className = '', 
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-white shadow-card border border-neutral-100',
      elevated: 'bg-white shadow-elevated border border-neutral-200',
      outlined: 'bg-white shadow-none border-2 border-neutral-200',
      glass: 'bg-white/80 backdrop-blur-sm shadow-card border border-white/20',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const baseStyles = `
      rounded-3xl transition-all duration-300 ease-out
      ${variants[variant]}
      ${paddings[padding]}
      ${hover ? 'hover:shadow-elevated hover:-translate-y-1 cursor-pointer' : ''}
    `;

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={`${baseStyles} ${className}`}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
