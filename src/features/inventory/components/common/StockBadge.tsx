/**
 * StockBadge Component
 * Reusable badge for displaying stock status
 */

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { StockStatus } from '../../types';
import { getStockStatusColors, getStockStatusLabel } from '../../utils/stockHelpers';

export interface StockBadgeProps {
  /** Stock status */
  status: StockStatus;
  /** Show compact version (icon only, no label) */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StockBadge - Displays stock status with color coding and icon
 * 
 * Features:
 * - Color-coded by status (green=normal, yellow=low, red=out, blue=overstock)
 * - Icon indicators
 * - Compact mode for space-constrained layouts
 * - Localized labels in Spanish
 * 
 * @example
 * <StockBadge status="LOW_STOCK" />
 * <StockBadge status="NORMAL" compact />
 */
export const StockBadge: React.FC<StockBadgeProps> = ({
  status,
  compact = false,
  className = '',
}) => {
  const colors = getStockStatusColors(status);
  const label = getStockStatusLabel(status);

  const getIcon = () => {
    const iconClass = "w-3 h-3";
    switch (status) {
      case 'NORMAL':
        return <CheckCircle className={iconClass} />;
      case 'LOW_STOCK':
        return <AlertTriangle className={iconClass} />;
      case 'STOCK_OUT':
        return <XCircle className={iconClass} />;
      case 'OVERSTOCK':
        return <TrendingUp className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 
        px-2.5 py-1 
        rounded-md 
        text-xs font-medium 
        border
        ${colors.bg}
        ${colors.text}
        ${colors.border}
        ${className}
      `}
      role="status"
      aria-label={`Estado de stock: ${label}`}
    >
      {getIcon()}
      {!compact && <span>{label}</span>}
    </span>
  );
};

