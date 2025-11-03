import { Card } from '../../../components/ui/Card';
import { DollarSign, CreditCard, Receipt, AlertCircle } from 'lucide-react';
import { FinancialStats, PeriodType } from '../types';
import { formatCurrency, formatDate } from '../utils/dashboardHelpers';
import { PERIOD_TYPES } from '../constants/dashboardConstants';

interface DailyFinancialSummaryProps {
  stats: FinancialStats;
  period: PeriodType;
  startDate: string;
  endDate: string;
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

export const DailyFinancialSummary = ({ stats, period, startDate, endDate }: DailyFinancialSummaryProps) => {
  const isToday = period === PERIOD_TYPES.TODAY;
  const periodLabel = getPeriodLabel(period);
  
  // Format date range for display
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const dateRangeDisplay = isToday 
    ? formattedStartDate
    : startDate === endDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedEndDate}`;
  
  const title = isToday 
    ? `Cierre de Caja - ${formattedStartDate}`
    : `Cierre de Caja - ${periodLabel}`;
  
  const subtitle = isToday 
    ? 'Resumen financiero del día'
    : `Resumen financiero del período: ${dateRangeDisplay}`;

  return (
    <Card padding="lg" className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-600 rounded-xl">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-powergym-charcoal">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Ingresos del Período - Destacado */}
        <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-green-600" />
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Ingresos {periodLabel}
            </p>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.period_revenue)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.payments_count} {stats.payments_count === 1 ? 'pago' : 'pagos'} recibidos
          </p>
        </div>

        {/* Total Pagos */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-semibold text-gray-600 uppercase">Total Pagos</p>
          </div>
          <p className="text-2xl font-bold text-powergym-charcoal">
            {stats.payments_count}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            En el período
          </p>
        </div>

        {/* Deuda Pendiente */}
        {stats.pending_debt && parseFloat(stats.pending_debt) > 0 && (
          <div className="bg-white rounded-xl p-4 border-2 border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-semibold text-gray-600 uppercase">Deuda Pendiente</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {formatCurrency(stats.pending_debt)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.debt_count} {stats.debt_count === 1 ? 'suscripción' : 'suscripciones'}
            </p>
          </div>
        )}
      </div>

      {/* Desglose por Método de Pago */}
      <div className="pt-4 border-t border-gray-300">
        <p className="text-sm font-semibold text-gray-700 mb-3">Ingresos por Método de Pago</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.revenue_by_method.cash && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-700">Efectivo</span>
                </div>
                <span className="text-base font-bold text-powergym-charcoal">
                  {formatCurrency(stats.revenue_by_method.cash)}
                </span>
              </div>
            </div>
          )}
          {stats.revenue_by_method.qr && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-700">QR</span>
                </div>
                <span className="text-base font-bold text-powergym-charcoal">
                  {formatCurrency(stats.revenue_by_method.qr)}
                </span>
              </div>
            </div>
          )}
          {stats.revenue_by_method.card && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium text-gray-700">Tarjeta</span>
                </div>
                <span className="text-base font-bold text-powergym-charcoal">
                  {formatCurrency(stats.revenue_by_method.card)}
                </span>
              </div>
            </div>
          )}
          {stats.revenue_by_method.transfer && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-sm font-medium text-gray-700">Transferencia</span>
                </div>
                <span className="text-base font-bold text-powergym-charcoal">
                  {formatCurrency(stats.revenue_by_method.transfer)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
