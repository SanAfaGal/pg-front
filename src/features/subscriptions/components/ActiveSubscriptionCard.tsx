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
    <div className="space-y-6">
      {/* Main Subscription Card */}
      <Card className="p-6 shadow-lg border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Suscripción Activa
              </h2>
              <SubscriptionStatusBadge status={subscription.status} />
            </div>
            <p className="text-sm text-gray-500">
              ID: {subscription.id.slice(0, 8)} • Plan: {subscription.plan_id.slice(0, 8)}
            </p>
          </div>
          <div className="flex gap-2">
            {onAddPayment && (
              <Button
                onClick={() => onAddPayment(subscription)}
                leftIcon={<Plus className="w-4 h-4" />}
                size="sm"
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
              >
                Renovar
              </Button>
            )}
            {canCancel && (
              <Tooltip
                content="Deshabilitado"
                position="top"
              >
                <span className="inline-block">
                  <Button
                    variant="outline"
                    disabled={true}
                    leftIcon={<X className="w-4 h-4" />}
                    size="sm"
                    className="cursor-not-allowed pointer-events-none"
                  >
                    Cancelar
                  </Button>
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Dates Grid */}
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
      </Card>

      {/* Payment Information */}
      {isLoadingPayments ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">Cargando información de pagos...</p>
          </div>
        </Card>
      ) : (
        paymentStats && (
          <div className="space-y-4">
            <PaymentProgressIndicator 
              paymentStats={paymentStats} 
              subscription={subscription}
            />
            
            {/* Recent Payments */}
            {payments.length > 0 && (
              <Card className="p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  Últimos Pagos
                </h3>
                <div className="space-y-2">
                  {payments.slice(0, 5).map((payment) => {
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
                        <Badge variant="default" className="font-medium">
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

