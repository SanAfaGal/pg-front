import { Card } from '../../../components/ui/Card';
import { DollarSign, CreditCard, AlertCircle, QrCode } from 'lucide-react';
import { FinancialStats, PeriodType } from '../types';
import { formatCurrency } from '../utils/dashboardHelpers';
import { PERIOD_TYPES } from '../constants/dashboardConstants';

interface FinancialStatsCardProps {
  stats: FinancialStats;
  period: PeriodType;
}

const getPeriodLabel = (period: PeriodType): string => {
  const labels: Record<PeriodType, string> = {
    today: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año',
  };
  return labels[period] || 'Período';
};

export const FinancialStatsCard = ({ stats, period }: FinancialStatsCardProps) => {
  const periodLabel = getPeriodLabel(period);

  return (
    <Card padding="md" className="sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-powergym-charcoal">Finanzas</h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              <span className="hidden sm:inline">Ingresos del Período</span>
              <span className="sm:hidden">Ingresos</span>
            </p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {formatCurrency(stats.period_revenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pagos</p>
            <p className="text-xl sm:text-2xl font-bold text-powergym-charcoal">
              {stats.payments_count}
            </p>
            <p className="text-xs text-gray-500 mt-1">En el período</p>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
              <span className="hidden sm:inline">Deuda Pendiente</span>
              <span className="sm:hidden">Deuda</span>
            </p>
            <p className="text-base sm:text-lg font-bold text-amber-600">
              {formatCurrency(stats.pending_debt)}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            {stats.debt_count} {stats.debt_count === 1 ? 'suscripción' : 'suscripciones'} con deuda
          </p>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
            <span className="hidden sm:inline">Ingresos por Método</span>
            <span className="sm:hidden">Por Método</span>
          </p>
          <div className="space-y-2">
            {stats.revenue_by_method.cash && (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                  Efectivo
                </span>
                <span className="text-sm sm:text-base font-semibold">{formatCurrency(stats.revenue_by_method.cash)}</span>
              </div>
            )}
            {stats.revenue_by_method.qr && (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                  <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                  QR
                </span>
                <span className="text-sm sm:text-base font-semibold">{formatCurrency(stats.revenue_by_method.qr)}</span>
              </div>
            )}
            {stats.revenue_by_method.card && (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                  Tarjeta
                </span>
                <span className="text-sm sm:text-base font-semibold">{formatCurrency(stats.revenue_by_method.card)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
