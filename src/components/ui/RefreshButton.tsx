import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface RefreshButtonProps {
  isRefetching?: boolean;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  showText?: boolean;
}

/**
 * RefreshButton - Componente reutilizable para botones de actualizar
 * 
 * Características:
 * - Diseño consistente en toda la aplicación
 * - Responsive y user-friendly
 * - Feedback visual claro (animación, texto, estado disabled)
 * 
 * @example
 * <RefreshButton 
 *   isRefetching={isRefetching} 
 *   onClick={handleRefresh} 
 * />
 */
export const RefreshButton: React.FC<RefreshButtonProps> = ({
  isRefetching = false,
  onClick,
  className = '',
  variant = 'secondary',
  showText = true,
}) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={isRefetching}
      leftIcon={
        <RefreshCw
          className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`}
        />
      }
      className={`whitespace-nowrap ${className}`}
    >
      {showText && (isRefetching ? 'Actualizando...' : 'Actualizar')}
    </Button>
  );
};

RefreshButton.displayName = 'RefreshButton';

