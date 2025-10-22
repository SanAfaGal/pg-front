import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    className = '', 
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const variants = {
      default: 'bg-white border-neutral-200 hover:border-neutral-300',
      filled: 'bg-neutral-50 border-neutral-200 hover:border-neutral-300',
      outlined: 'bg-transparent border-2 border-neutral-200 hover:border-neutral-300',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    const inputStyles = `
      w-full bg-transparent border rounded-2xl transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-0
      placeholder:text-neutral-400 text-neutral-900
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50
      ${variants[variant]}
      ${sizes[size]}
      ${error 
        ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' 
        : isFocused 
          ? 'border-primary-500 focus:border-primary-500 focus:ring-primary-500/20'
          : ''
      }
      ${leftIcon ? 'pl-12' : ''}
      ${rightIcon ? 'pr-12' : ''}
    `;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`${inputStyles} ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error ? (
                <p className="text-sm text-error-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              ) : helperText ? (
                <p className="text-sm text-neutral-500">{helperText}</p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
