import React from 'react';
import { Subscription, Payment, PaymentStats } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { 
  formatDate, 
  formatDateTime, 
  getSubscriptionStatusInfo,
  getDaysRemaining,
  getSubscriptionProgress
} from '../utils/subscriptionHelpers';
import { 
  formatCurrency, 
  formatPaymentDate, 
  getPaymentMethodInfo,
  calculateTotalPayments,
  calculatePaymentProgress
} from '../utils/paymentHelpers';
import { SubscriptionStatusBadge } from './SubscriptionList';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  CreditCard, 
  TrendingUp,
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

export const SubscriptionDetail: React.FC<SubscriptionDetailProps> = ({
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
  const daysRemaining = getDaysRemaining(subscription);
  const progress = getSubscriptionProgress(subscription);
  const totalPaid = calculateTotalPayments(payments);
  const canRenew = subscription.status === 'active' || subscription.status === 'expired';
  const canCancel = ['active', 'pending_payment', 'scheduled'].includes(subscription.status);

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Subscription Overview */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Suscripción #{subscription.id.slice(0, 8)}
            </h2>
            <p className="text-gray-600">
              Plan ID: {subscription.plan_id.slice(0, 8)}
            </p>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatDate(subscription.start_date)}
            </div>
            <p className="text-sm text-gray-600">Fecha de Inicio</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {formatDate(subscription.end_date)}
            </div>
            <p className="text-sm text-gray-600">Fecha de Fin</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {daysRemaining}
            </div>
            <p className="text-sm text-gray-600">Días Restantes</p>
          </div>
        </div>

        {subscription.status === 'active' && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso de Suscripción</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onAddPayment && (
            <Button
              onClick={() => onAddPayment(subscription)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Agregar Pago
            </Button>
          )}
          
          {onViewPayments && (
            <Button
              variant="secondary"
              onClick={() => onViewPayments(subscription)}
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              Ver Pagos
            </Button>
          )}
          
          {canRenew && onRenew && (
            <Button
              variant="secondary"
              onClick={() => onRenew(subscription)}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Renovar
            </Button>
          )}
          
          {canCancel && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(subscription)}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancelar
            </Button>
          )}
        </div>
      </Card>

      {/* Payment Information */}
      {(payments.length > 0 || paymentStats) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Información de Pagos
          </h3>

          {paymentStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(paymentStats.total_amount_paid)}
                </div>
                <p className="text-sm text-green-700">Total Pagado</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {formatCurrency(paymentStats.remaining_debt)}
                </div>
                <p className="text-sm text-red-700">Deuda Restante</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {paymentStats.total_payments}
                </div>
                <p className="text-sm text-blue-700">Total Pagos</p>
              </div>
            </div>
          )}

          {payments.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Últimos Pagos</h4>
              <div className="space-y-2">
                {payments.slice(0, 3).map((payment) => {
                  const methodInfo = getPaymentMethodInfo(payment.payment_method);
                  return (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{methodInfo.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPaymentDate(payment.payment_date)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
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
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
            <X className="w-5 h-5 mr-2" />
            Información de Cancelación
          </h3>
          <div className="space-y-2">
            <p className="text-red-800">
              <strong>Fecha de Cancelación:</strong> {formatDateTime(subscription.cancellation_date)}
            </p>
            {subscription.cancellation_reason && (
              <p className="text-red-800">
                <strong>Razón:</strong> {subscription.cancellation_reason}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
