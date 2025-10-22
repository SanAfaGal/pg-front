import React from 'react';
import { Payment, PaymentStats } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { 
  formatPaymentDate, 
  getPaymentMethodInfo,
  formatCurrency,
  calculateTotalPayments,
  sortPaymentsByDate
} from '../utils/paymentHelpers';
import { CreditCard, DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
  paymentStats?: PaymentStats;
  isLoading?: boolean;
  error?: string;
  onExport?: () => void;
  className?: string;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  paymentStats,
  isLoading = false,
  error,
  onExport,
  className = '',
}) => {
  const sortedPayments = sortPaymentsByDate(payments);
  const totalPaid = calculateTotalPayments(payments);

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-red-600 mb-2">
          <CreditCard className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Error al cargar pagos</p>
        </div>
        <p className="text-gray-600 text-sm">{error}</p>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-gray-400 mb-2">
          <CreditCard className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">No hay pagos registrados</p>
        </div>
        <p className="text-gray-600 text-sm">
          No se han registrado pagos para esta suscripción.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Payment Statistics */}
      {paymentStats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Estadísticas de Pagos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {paymentStats.last_payment_date && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Último pago:</strong> {formatPaymentDate(paymentStats.last_payment_date)}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Payment List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Historial de Pagos ({payments.length})
          </h3>
          
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Exportar
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {sortedPayments.map((payment) => {
            const methodInfo = getPaymentMethodInfo(payment.payment_method);
            
            return (
              <div
                key={payment.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <span className="text-lg">{methodInfo.icon}</span>
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
                
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {methodInfo.label}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    ID: {payment.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Pagado:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
