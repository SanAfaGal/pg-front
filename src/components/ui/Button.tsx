import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '', 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const baseStyles = `
      relative inline-flex items-center justify-center font-medium 
      rounded-2xl transition-all duration-300 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      focus:outline-none focus:ring-2 focus:ring-offset-2
      active:scale-[0.98] transform-gpu
      ${fullWidth ? 'w-full' : ''}
    `;

    const variants = {
      primary: `
        bg-primary-500 hover:bg-primary-600 active:bg-primary-700
        text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/25
        focus:ring-primary-500/50
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r 
        before:from-primary-500 before:to-primary-600 before:opacity-0 
        hover:before:opacity-100 before:transition-opacity before:duration-300
      `,
      secondary: `
        bg-white hover:bg-neutral-50 active:bg-neutral-100
        text-neutral-700 border border-neutral-200 hover:border-neutral-300
        shadow-sm hover:shadow-md
        focus:ring-primary-500/30
      `,
      ghost: `
        bg-transparent hover:bg-neutral-100 active:bg-neutral-200
        text-neutral-700 hover:text-neutral-900
        focus:ring-primary-500/30
      `,
      outline: `
        bg-transparent hover:bg-primary-50 active:bg-primary-100
        text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300
        focus:ring-primary-500/30
      `,
      danger: `
        bg-error-500 hover:bg-error-600 active:bg-error-700
        text-white shadow-lg hover:shadow-xl hover:shadow-error-500/25
        focus:ring-error-500/50
      `,
    };

    const sizes = {
      xs: 'px-3 py-1.5 text-xs min-h-[2rem]',
      sm: 'px-4 py-2 text-sm min-h-[2.5rem]',
      md: 'px-6 py-3 text-base min-h-[3rem]',
      lg: 'px-8 py-4 text-lg min-h-[3.5rem]',
      xl: 'px-10 py-5 text-xl min-h-[4rem]',
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <motion.div 
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Cargando...</span>
          </div>
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
