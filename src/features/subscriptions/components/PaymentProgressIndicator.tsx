import React, { memo } from 'react';
import { PaymentStats, Subscription } from '../api/types';
import { formatCurrency, calculatePaymentProgress } from '../utils/paymentHelpers';
import { getSubscriptionPrice } from '../../../features/rewards/utils/rewardHelpers';
import { Card } from '../../../components/ui/Card';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PaymentProgressIndicatorProps {
  paymentStats: PaymentStats;
  subscription?: Subscription;
  planPrice?: number | string;
  className?: string;
}

export const PaymentProgressIndicator: React.FC<PaymentProgressIndicatorProps> = memo(({
  paymentStats,
  subscription,
  planPrice,
  className = '',
}) => {
  const totalPaid = parseFloat(paymentStats.total_amount_paid);
  const remainingDebt = parseFloat(paymentStats.remaining_debt);
  // Use subscription.final_price if available, otherwise use planPrice or calculate from stats
  const totalRequired = getSubscriptionPrice(subscription, planPrice) || (totalPaid + remainingDebt);
  
  const progress = calculatePaymentProgress(totalPaid, totalRequired);
  const isFullyPaid = remainingDebt === 0;
  const isPartiallyPaid = totalPaid > 0 && remainingDebt > 0;
  const hasNoPayments = totalPaid === 0;

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Payment Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700 uppercase tracking-wide">
                Pagado
              </span>
            </div>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div className={`p-3 rounded-lg border ${
            isFullyPaid
              ? 'bg-gray-50 border-gray-200'
              : 'bg-red-50 border-red-100'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-4 h-4 ${isFullyPaid ? 'text-gray-600' : 'text-red-600'}`} />
              <span className={`text-xs font-medium uppercase tracking-wide ${
                isFullyPaid ? 'text-gray-700' : 'text-red-700'
              }`}>
                {isFullyPaid ? 'Completo' : 'Restante'}
              </span>
            </div>
            <p className={`text-lg font-bold ${
              isFullyPaid ? 'text-gray-900' : 'text-red-900'
            }`}>
              {formatCurrency(remainingDebt)}
            </p>
          </div>
        </div>

        {/* Payment Count */}
        {paymentStats.total_payments > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total de pagos realizados:</span>
              <span className="font-semibold text-gray-900">{paymentStats.total_payments}</span>
            </div>
            {paymentStats.last_payment_date && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Último pago:</span>
                <span className="font-medium text-gray-900">
                  {new Date(paymentStats.last_payment_date).toLocaleDateString('es-CO')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});

PaymentProgressIndicator.displayName = 'PaymentProgressIndicator';

