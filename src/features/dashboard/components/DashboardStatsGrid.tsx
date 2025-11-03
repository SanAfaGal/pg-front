import { StatsCard } from '../../../components/dashboard/StatsCard';
import { Users, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { DashboardData, PeriodType } from '../types';
import { formatCurrency, formatNumber } from '../utils/dashboardHelpers';
import { PERIOD_TYPES } from '../constants/dashboardConstants';

interface DashboardStatsGridProps {
  data: DashboardData;
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

export const DashboardStatsGrid = ({ data, period }: DashboardStatsGridProps) => {
  const { client_stats, financial_stats, subscription_stats, attendance_stats } = data;
  const periodLabel = getPeriodLabel(period);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatsCard
        title="Total Clientes"
        value={client_stats.total}
        icon={Users}
        color="blue"
      />
      <StatsCard
        title={`Ingresos ${periodLabel}`}
        value={formatCurrency(financial_stats.period_revenue)}
        icon={DollarSign}
        color="green"
      />
      <StatsCard
        title={`Asistencias ${periodLabel}`}
        value={attendance_stats.total_attendances}
        icon={TrendingUp}
        color="red"
      />
      <StatsCard
        title="Suscripciones Activas"
        value={subscription_stats.active}
        icon={ShoppingCart}
        color="amber"
      />
    </div>
  );
};
