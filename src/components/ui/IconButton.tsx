import { ButtonHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md';
  'aria-label': string;
}

/**
 * Componente reutilizable para botones de icono
 * Optimizado para acciones rápidas y diseño limpio
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = `
      flex items-center justify-center
      rounded-lg transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-1
    `;

    const variants = {
      default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
      primary: 'text-powergym-blue-medium hover:text-powergym-blue-dark hover:bg-blue-50 focus:ring-blue-300',
      danger: 'text-gray-400 hover:text-powergym-red hover:bg-red-50 focus:ring-red-300',
    };

    const sizes = {
      sm: 'p-1.5 min-w-[36px] min-h-[36px]',
      md: 'p-2 min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]',
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4 sm:w-5 sm:h-5',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        <Icon className={iconSizes[size]} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

