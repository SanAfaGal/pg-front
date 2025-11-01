import React, { memo, useMemo } from 'react';
import { Subscription, Payment, PaymentStats } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { 
  formatDate, 
  formatDateTime, 
  getDaysRemaining,
  getSubscriptionProgress
} from '../utils/subscriptionHelpers';
import { 
  formatCurrency, 
  formatPaymentDate, 
  getPaymentMethodInfo,
  calculateTotalPayments,
  calculatePaymentProgress,
} from '../utils/paymentHelpers';
import { PaymentProgressIndicator } from './PaymentProgressIndicator';
import { SubscriptionStatusBadge } from './SubscriptionList';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  CreditCard, 
  RefreshCw,
  X,
  Plus
} from 'lucide-react';

interface SubscriptionDetailProps {
  subscription: Subscription;
  payments?: Payment[];
  paymentStats?: PaymentStats;
  onRenew?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onAddPayment?: (subscription: Subscription) => void;
  onViewPayments?: (subscription: Subscription) => void;
  isLoading?: boolean;
  className?: string;
}

export const SubscriptionDetail: React.FC<SubscriptionDetailProps> = memo(({
  subscription,
  payments = [],
  paymentStats,
  onRenew,
  onCancel,
  onAddPayment,
  onViewPayments,
  isLoading = false,
  className = '',
}) => {
  // Memoized calculations
  const { daysRemaining, progress, totalPaid, canRenew, canCancel } = useMemo(() => ({
    daysRemaining: getDaysRemaining(subscription),
    progress: getSubscriptionProgress(subscription),
    totalPaid: calculateTotalPayments(payments),
    canRenew: subscription.status === 'active' || subscription.status === 'expired',
    canCancel: ['active', 'pending_payment', 'scheduled'].includes(subscription.status),
  }), [subscription, payments]);

  // Memoized recent payments
  const recentPayments = useMemo(() => payments.slice(0, 3), [payments]);

  if (isLoading) {
    return (
      <Card className={`p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Cargando detalles de la suscripción...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Subscription Overview */}
      <Card className="p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Suscripción #{subscription.id.slice(0, 8)}
            </h2>
            <p className="text-sm text-gray-500">
              Plan ID: {subscription.plan_id.slice(0, 8)}
            </p>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Inicio</p>
                <p className="text-lg font-bold text-blue-900">{formatDate(subscription.start_date)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Fin</p>
                <p className="text-lg font-bold text-red-900">{formatDate(subscription.end_date)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Restantes</p>
                <p className="text-lg font-bold text-green-900">{daysRemaining} día{daysRemaining !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {subscription.status === 'active' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Progreso de Suscripción</span>
              <span className="text-sm font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          {onAddPayment && (
            <Button
              onClick={() => onAddPayment(subscription)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              Agregar Pago
            </Button>
          )}
          
          {onViewPayments && (
            <Button
              variant="secondary"
              onClick={() => onViewPayments(subscription)}
              leftIcon={<CreditCard className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              Ver Pagos
            </Button>
          )}
          
          {canRenew && onRenew && (
            <Button
              variant="secondary"
              onClick={() => onRenew(subscription)}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              Renovar
            </Button>
          )}
          
          {canCancel && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(subscription)}
              leftIcon={<X className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
          )}
        </div>
      </Card>

      {/* Payment Information */}
      {(payments.length > 0 || paymentStats) && (
        <Card className="p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            Información de Pagos
          </h3>

          {/* Payment Progress Indicator */}
          {paymentStats && (
            <div className="mb-6">
              <PaymentProgressIndicator paymentStats={paymentStats} />
            </div>
          )}

          {payments.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Últimos Pagos</h4>
              <div className="space-y-2">
                {recentPayments.map((payment) => {
                  const methodInfo = getPaymentMethodInfo(payment.payment_method);
                  return (
                    <div 
                      key={payment.id} 
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-xl">{methodInfo.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPaymentDate(payment.payment_date)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-medium">
                        {methodInfo.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Cancellation Information */}
      {subscription.cancellation_date && (
        <Card className="p-6 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-sm">
          <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
            <X className="w-5 h-5" />
            Información de Cancelación
          </h3>
          <div className="space-y-2">
            <p className="text-red-800">
              <strong className="font-semibold">Fecha de Cancelación:</strong>{' '}
              {formatDateTime(subscription.cancellation_date)}
            </p>
            {subscription.cancellation_reason && (
              <p className="text-red-800">
                <strong className="font-semibold">Razón:</strong>{' '}
                {subscription.cancellation_reason}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
});

SubscriptionDetail.displayName = 'SubscriptionDetail';
