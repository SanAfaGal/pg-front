import React from 'react';
import { SubscriptionStatus, Subscription } from '../api/types';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeProps } from '../../../components/ui/Badge';
import { 
  getSubscriptionStatusInfo,
  canRenewSubscription,
  canCancelSubscription
} from '../utils/subscriptionHelpers';

interface SubscriptionStatusProps {
  status: SubscriptionStatus;
  showActions?: boolean;
  onRenew?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const SubscriptionStatusComponent: React.FC<SubscriptionStatusProps> = ({
  status,
  showActions = false,
  onRenew,
  onCancel,
  className = '',
}) => {
  const statusInfo = getSubscriptionStatusInfo(status);
  const canRenew = canRenewSubscription({ status } as Subscription);
  const canCancel = canCancelSubscription({ status } as Subscription);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Badge
        variant={statusInfo.color === 'green' ? 'success' : 
                 statusInfo.color === 'red' ? 'error' : 
                 statusInfo.color === 'yellow' ? 'warning' : 
                 statusInfo.color === 'blue' ? 'info' : 
                 'default'}
        className={`${statusInfo.bgColor} ${statusInfo.textColor}`}
      >
        <span className="mr-1">{statusInfo.icon}</span>
        {statusInfo.label}
      </Badge>

      {showActions && (
        <div className="flex gap-2">
          {canRenew && onRenew && (
            <button
              onClick={onRenew}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Renovar
            </button>
          )}
          
          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
