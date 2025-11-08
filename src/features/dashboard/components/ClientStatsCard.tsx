import { Users, UserPlus, XCircle } from 'lucide-react';
import { ClientStats, PeriodType } from '../types';
import { formatNumber } from '../utils/dashboardHelpers';
import { BaseStatsCard } from './BaseStatsCard';

interface ClientStatsCardProps {
  stats: ClientStats;
  period: PeriodType;
}

export const ClientStatsCard = ({ stats }: ClientStatsCardProps) => {
  // Calcular métricas relevantes
  const activeRate = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : '0';
  const subscriptionRate = stats.total > 0 ? ((stats.with_active_subscription / stats.total) * 100).toFixed(1) : '0';

  return (
    <BaseStatsCard title="Clientes" icon={Users} iconColor="blue">
      {/* Métricas Principales - Compactas */}
      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">Total</p>
          <p className="text-xl font-bold text-powergym-charcoal">{formatNumber(stats.total)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">Activos</p>
          <p className="text-xl font-bold text-green-600">{formatNumber(stats.active)}</p>
          <p className="text-[10px] text-gray-400">{activeRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">Suscripciones</p>
          <p className="text-xl font-bold text-blue-600">{formatNumber(stats.with_active_subscription)}</p>
          <p className="text-[10px] text-gray-400">{subscriptionRate}%</p>
        </div>
      </div>

      {/* Métricas Secundarias - Compactas */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
          <UserPlus className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-600">Nuevos</p>
            <p className="text-base font-bold text-blue-600">{formatNumber(stats.new_in_period)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-amber-50/50 rounded-lg border border-amber-100">
          <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-600">Pendientes</p>
            <p className="text-base font-bold text-amber-600">{formatNumber(stats.with_pending_payment)}</p>
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
};
