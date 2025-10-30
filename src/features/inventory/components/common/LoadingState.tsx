/**
 * LoadingState Component
 * Reusable loading skeleton component
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';

export interface LoadingStateProps {
  /** Type of loading state */
  variant?: 'spinner' | 'skeleton' | 'table';
  /** Number of skeleton rows (for skeleton and table variants) */
  rows?: number;
  /** Loading message */
  message?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * LoadingState - Displays loading states with various styles
 * 
 * Variants:
 * - spinner: Centered spinner with optional message
 * - skeleton: Content skeleton (cards/list)
 * - table: Table skeleton with rows
 * 
 * @example
 * <LoadingState variant="spinner" message="Cargando productos..." />
 * <LoadingState variant="skeleton" rows={5} />
 * <LoadingState variant="table" rows={10} />
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  rows = 3,
  message,
  className = '',
}) => {
  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 text-powergym-blue-medium animate-spin mb-3" />
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(rows)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // skeleton variant
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <Card key={i} className="p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, j) => (
              <div key={j}>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

