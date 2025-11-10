import React, { memo, useMemo } from 'react';
import { Subscription, Payment, PaymentStats } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Tooltip } from '../../../components/ui/Tooltip';
import { SubscriptionStatusBadge } from './SubscriptionList';
import { PaymentProgressIndicator } from './PaymentProgressIndicator';
import { 
  formatDate, 
  getDaysRemaining,
} from '../utils/subscriptionHelpers';
import { 
  formatCurrency, 
  formatPaymentDate, 
  getPaymentMethodInfo,
} from '../utils/paymentHelpers';
import { Calendar, Clock, DollarSign, RefreshCw, X, Plus } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

interface ActiveSubscriptionCardProps {
  subscription: Subscription;
  payments?: Payment[];
  paymentStats?: PaymentStats;
  onRenew?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onAddPayment?: (subscription: Subscription) => void;
  isLoadingPayments?: boolean;
}

export const ActiveSubscriptionCard: React.FC<ActiveSubscriptionCardProps> = memo(({
  subscription,
  payments = [],
  paymentStats,
  onRenew,
  onAddPayment,
  isLoadingPayments = false,
}) => {
  const daysRemaining = useMemo(() => getDaysRemaining(subscription), [subscription]);

  const canRenew = subscription.status === 'active' || subscription.status === 'expired';
  const canCancel = ['active', 'pending_payment', 'scheduled'].includes(subscription.status);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Subscription Card */}
      <Card className="p-4 sm:p-6 shadow-lg border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Suscripción Activa
              </h2>
              <SubscriptionStatusBadge status={subscription.status} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              ID: {subscription.id.slice(0, 8)} • Plan: {subscription.plan_id.slice(0, 8)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {onAddPayment && (
              <Button
                onClick={() => onAddPayment(subscription)}
                leftIcon={<Plus className="w-4 h-4" />}
                size="sm"
                className="w-full sm:w-auto"
              >
                Agregar Pago
              </Button>
            )}
            {canRenew && onRenew && (
              <Button
                variant="secondary"
                onClick={() => onRenew(subscription)}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                size="sm"
                className="w-full sm:w-auto"
              >
                Renovar
              </Button>
            )}
            {canCancel && (
              <Tooltip
                content="Deshabilitado"
                position="top"
              >
                <span className="inline-block w-full sm:w-auto">
                  <Button
                    variant="outline"
                    disabled={true}
                    leftIcon={<X className="w-4 h-4" />}
                    size="sm"
                    className="cursor-not-allowed pointer-events-none w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Inicio</p>
                <p className="text-base sm:text-lg font-bold text-blue-900">{formatDate(subscription.start_date)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Fin</p>
                <p className="text-base sm:text-lg font-bold text-red-900">{formatDate(subscription.end_date)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Restantes</p>
                <p className="text-base sm:text-lg font-bold text-green-900">{daysRemaining} día{daysRemaining !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Information */}
      {isLoadingPayments ? (
        <Card className="p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-sm sm:text-base text-gray-600 mt-4">Cargando información de pagos...</p>
          </div>
        </Card>
      ) : (
        paymentStats && (
          <div className="space-y-3 sm:space-y-4">
            <PaymentProgressIndicator 
              paymentStats={paymentStats} 
              subscription={subscription}
            />
            
            {/* Recent Payments */}
            {payments.length > 0 && (
              <Card className="p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  Últimos Pagos
                </h3>
                <div className="space-y-2">
                  {payments.slice(0, 5).map((payment) => {
                    const methodInfo = getPaymentMethodInfo(payment.payment_method);
                    return (
                      <div 
                        key={payment.id} 
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-lg sm:text-xl">{methodInfo.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-base font-semibold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {formatPaymentDate(payment.payment_date)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="font-medium self-start sm:self-center">
                          {methodInfo.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )
      )}
    </div>
  );
});

ActiveSubscriptionCard.displayName = 'ActiveSubscriptionCard';

