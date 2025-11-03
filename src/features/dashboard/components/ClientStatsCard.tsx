import { Card } from '../../../components/ui/Card';
import { Users, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { ClientStats, PeriodType } from '../types';
import { formatNumber } from '../utils/dashboardHelpers';
import { PERIOD_TYPES } from '../constants/dashboardConstants';

interface ClientStatsCardProps {
  stats: ClientStats;
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

export const ClientStatsCard = ({ stats, period }: ClientStatsCardProps) => {
  const periodLabel = getPeriodLabel(period);

  return (
    <Card padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-powergym-charcoal">Clientes</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-powergym-charcoal">{formatNumber(stats.total)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Activos</p>
          <p className="text-2xl font-bold text-green-600">{formatNumber(stats.active)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Inactivos</p>
          <p className="text-2xl font-bold text-gray-500">{formatNumber(stats.inactive)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <UserPlus className="w-4 h-4" />
            Nuevos en Período
          </p>
          <p className="text-xl font-semibold text-blue-600">{formatNumber(stats.new_in_period)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Con Suscripción Activa
          </p>
          <p className="text-xl font-semibold text-green-600">
            {formatNumber(stats.with_active_subscription)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Con Pago Pendiente
          </p>
          <p className="text-xl font-semibold text-amber-600">
            {formatNumber(stats.with_pending_payment)}
          </p>
        </div>
      </div>
    </Card>
  );
};
