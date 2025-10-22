import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const Badge = ({ 
  variant = 'default', 
  size = 'md',
  animated = false,
  className = '', 
  children, 
  ...props 
}: BadgeProps) => {
  const variants = {
    success: 'bg-success-50 text-success-700 border-success-200 shadow-success-500/10',
    warning: 'bg-warning-50 text-warning-700 border-warning-200 shadow-warning-500/10',
    error: 'bg-error-50 text-error-700 border-error-200 shadow-error-500/10',
    info: 'bg-primary-50 text-primary-700 border-primary-200 shadow-primary-500/10',
    primary: 'bg-primary-500 text-white border-primary-500 shadow-primary-500/20',
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200 shadow-neutral-500/5',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const baseStyles = `
    inline-flex items-center font-medium border rounded-full
    transition-all duration-200 ease-out
    ${variants[variant]}
    ${sizes[size]}
  `;

  if (animated) {
    return (
      <motion.span
        className={`${baseStyles} ${className}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
