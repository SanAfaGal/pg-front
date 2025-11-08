import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { FinancialStats, PeriodType } from '../types';
import { formatCurrency } from '../utils/dashboardHelpers';
import { BaseStatsCard } from './BaseStatsCard';

interface FinancialStatsCardProps {
  stats: FinancialStats;
  period: PeriodType;
}

export const FinancialStatsCard = ({ stats, period }: FinancialStatsCardProps) => {
  // Calcular métricas relevantes
  const avgPayment = stats.payments_count > 0 
    ? stats.period_revenue / stats.payments_count 
    : 0;

  return (
    <BaseStatsCard title="Finanzas" icon={DollarSign} iconColor="green">
      {/* Métrica Principal - Ingresos */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-600">Ingresos del Período</p>
          <TrendingUp className="w-4 h-4 text-green-600" />
        </div>
        <p className="text-2xl font-bold text-green-600 mb-1">
          {formatCurrency(stats.period_revenue)}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{stats.payments_count} pagos</span>
          {avgPayment > 0 && (
            <>
              <span>•</span>
              <span>Promedio: {formatCurrency(avgPayment)}</span>
            </>
          )}
        </div>
      </div>

      {/* Deuda Pendiente - Destacada */}
      {stats.pending_debt > 0 && (
        <div className="mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-[10px] text-gray-600">Deuda Pendiente</p>
                <p className="text-lg font-bold text-amber-600">
                  {formatCurrency(stats.pending_debt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">{stats.debt_count}</p>
              <p className="text-[10px] text-gray-500">
                {stats.debt_count === 1 ? 'suscripción' : 'suscripciones'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Métodos de Pago - Compacto */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">Por Método</p>
        <div className="space-y-1.5">
          {stats.revenue_by_method.cash > 0 && (
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">Efectivo</span>
              <span className="text-sm font-semibold">{formatCurrency(stats.revenue_by_method.cash)}</span>
            </div>
          )}
          {stats.revenue_by_method.qr > 0 && (
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">QR</span>
              <span className="text-sm font-semibold">{formatCurrency(stats.revenue_by_method.qr)}</span>
            </div>
          )}
          {stats.revenue_by_method.card > 0 && (
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">Tarjeta</span>
              <span className="text-sm font-semibold">{formatCurrency(stats.revenue_by_method.card)}</span>
            </div>
          )}
        </div>
      </div>
    </BaseStatsCard>
  );
};
