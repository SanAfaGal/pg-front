import React from 'react';
import { Subscription, SubscriptionStatus } from '../api/types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { 
  getSubscriptionStatusInfo, 
  formatDate, 
  getDaysRemaining,
  canRenewSubscription,
  canCancelSubscription,
  getSubscriptionProgress
} from '../utils/subscriptionHelpers';
import { formatCurrency } from '../utils/paymentHelpers';
import { Calendar, Clock, DollarSign, RefreshCw, X } from 'lucide-react';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

export const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const statusInfo = getSubscriptionStatusInfo(status);
  
  return (
    <Badge
      variant={statusInfo.color as any}
      className={`${statusInfo.bgColor} ${statusInfo.textColor} ${className}`}
    >
      <span className="mr-1">{statusInfo.icon}</span>
      {statusInfo.label}
    </Badge>
  );
};

interface SubscriptionCardProps {
  subscription: Subscription;
  onRenew?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onViewDetails?: (subscription: Subscription) => void;
  showActions?: boolean;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
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
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Suscripción #{subscription.id.slice(0, 8)}
          </h3>
          <p className="text-sm text-gray-600">
            Plan ID: {subscription.plan_id.slice(0, 8)}
          </p>
        </div>
        <SubscriptionStatusBadge status={subscription.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <div>
            <p className="font-medium">Inicio</p>
            <p>{formatDate(subscription.start_date)}</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <div>
            <p className="font-medium">Fin</p>
            <p>{formatDate(subscription.end_date)}</p>
          </div>
        </div>
      </div>

      {subscription.status === SubscriptionStatus.ACTIVE && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{daysRemaining} días restantes</span>
          </div>
        </div>
      )}

      {subscription.cancellation_date && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Cancelada:</strong> {formatDate(subscription.cancellation_date)}
          </p>
          {subscription.cancellation_reason && (
            <p className="text-sm text-red-700 mt-1">
              <strong>Razón:</strong> {subscription.cancellation_reason}
            </p>
          )}
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(subscription)}
            >
              Ver Detalles
            </Button>
          )}
          
          {canRenew && onRenew && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRenew(subscription)}
              leftIcon={<RefreshCw className="w-4 h-4" />}
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
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onRenew?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onViewDetails?: (subscription: Subscription) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = ({
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
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-red-600 mb-2">
          <X className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Error al cargar suscripciones</p>
        </div>
        <p className="text-gray-600 text-sm">{error}</p>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-gray-400 mb-2">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">No hay suscripciones</p>
        </div>
        <p className="text-gray-600 text-sm">
          Este cliente no tiene suscripciones registradas.
        </p>
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
};
