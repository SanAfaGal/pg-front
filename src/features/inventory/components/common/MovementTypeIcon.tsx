/**
 * MovementTypeIcon Component
 * Reusable icon component for movement types
 */

import React from 'react';
import { TrendingUp, TrendingDown, FileText } from 'lucide-react';

export interface MovementTypeIconProps {
  /** Movement type (ENTRY or EXIT) */
  type: 'ENTRY' | 'EXIT';
  /** Icon size class */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * MovementTypeIcon - Displays appropriate icon for movement type
 * 
 * Features:
 * - Color-coded icons (green for ENTRY, red for EXIT)
 * - Multiple size options
 * - Consistent styling across the app
 * 
 * @example
 * <MovementTypeIcon type="ENTRY" />
 * <MovementTypeIcon type="EXIT" size="lg" />
 */
export const MovementTypeIcon: React.FC<MovementTypeIconProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const sizeClass = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  switch (type) {
    case 'ENTRY':
      return (
        <TrendingUp
          className={`${sizeClass} text-green-600 ${className}`}
          aria-label="Entrada de inventario"
        />
      );
    case 'EXIT':
      return (
        <TrendingDown
          className={`${sizeClass} text-red-600 ${className}`}
          aria-label="Salida de inventario"
        />
      );
    default:
      return (
        <FileText
          className={`${sizeClass} text-gray-500 ${className}`}
          aria-label="Movimiento de inventario"
        />
      );
  }
};

