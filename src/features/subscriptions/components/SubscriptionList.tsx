import React, { memo } from 'react';
import { Subscription, SubscriptionStatus } from '../api/types';
import { Badge } from '../../../components/ui/Badge';
import type { BadgeProps } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { 
  getSubscriptionStatusInfo, 
  formatDate, 
  getDaysRemaining,
  canRenewSubscription,
  canCancelSubscription,
  getSubscriptionProgress
} from '../utils/subscriptionHelpers';
import { Calendar, Clock, RefreshCw, X, ArrowRight } from 'lucide-react';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

export const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = memo(({ 
  status, 
  className = '' 
}) => {
  const statusInfo = getSubscriptionStatusInfo(status);
  
  return (
    <Badge
      variant={statusInfo.color === 'green' ? 'success' : 
               statusInfo.color === 'red' ? 'error' : 
               statusInfo.color === 'yellow' ? 'warning' : 
               statusInfo.color === 'blue' ? 'info' : 
               'default'}
      className={`${statusInfo.bgColor} ${statusInfo.textColor} ${className}`}
    >
      <span className="mr-1">{statusInfo.icon}</span>
      {statusInfo.label}
    </Badge>
  );
});

SubscriptionStatusBadge.displayName = 'SubscriptionStatusBadge';

interface SubscriptionCardProps {
  subscription: Subscription;
  onRenew?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onViewDetails?: (subscription: Subscription) => void;
  showActions?: boolean;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = memo(({
  subscription,
  onRenew,
  onCancel,
  onViewDetails,
  showActions = true,
  className = '',
}) => {
  const daysRemaining = getDaysRemaining(subscription);
  const progress = getSubscriptionProgress(subscription);
  const canRenew = canRenewSubscription(subscription);
  const canCancel = canCancelSubscription(subscription);

  return (
    <Card className={`p-4 sm:p-6 hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
            Suscripción #{subscription.id.slice(0, 8)}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Plan ID: {subscription.plan_id.slice(0, 8)}
          </p>
        </div>
        <div className="flex-shrink-0">
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Inicio</p>
            <p className="text-sm font-semibold text-gray-900">{formatDate(subscription.start_date)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Fin</p>
            <p className="text-sm font-semibold text-gray-900">{formatDate(subscription.end_date)}</p>
          </div>
        </div>
      </div>

      {subscription.status === SubscriptionStatus.ACTIVE && (
        <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-medium">{daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {subscription.cancellation_date && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs sm:text-sm text-red-800 font-medium">
            <strong>Cancelada:</strong> {formatDate(subscription.cancellation_date)}
          </p>
          {subscription.cancellation_reason && (
            <p className="text-xs sm:text-sm text-red-700 mt-1">
              <strong>Razón:</strong> {subscription.cancellation_reason}
            </p>
          )}
        </div>
      )}

      {showActions && (
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(subscription)}
              className="w-full sm:flex-1"
            >
              Ver Detalles
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          
          {canRenew && onRenew && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRenew(subscription)}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full sm:flex-1"
            >
              Renovar
            </Button>
          )}
          
          {canCancel && onCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(subscription)}
              leftIcon={<X className="w-4 h-4" />}
              className="w-full sm:flex-1"
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
    </Card>
  );
});

SubscriptionCard.displayName = 'SubscriptionCard';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onRenew?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onViewDetails?: (subscription: Subscription) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = memo(({
  subscriptions,
  onRenew,
  onCancel,
  onViewDetails,
  isLoading = false,
  error,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <p className="font-semibold text-red-900 mb-2">Error al cargar suscripciones</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className={`p-12 text-center ${className}`}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-900 mb-2">No hay suscripciones</p>
          <p className="text-gray-600 text-sm max-w-md">
            Este cliente no tiene suscripciones registradas. 
            Crea una nueva suscripción para comenzar.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onRenew={onRenew}
          onCancel={onCancel}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
});

SubscriptionList.displayName = 'SubscriptionList';
