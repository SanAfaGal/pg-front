import { Activity, Clock, Users, TrendingUp } from 'lucide-react';
import { AttendanceStats, PeriodType } from '../types';
import { formatNumber, formatPercentage } from '../utils/dashboardHelpers';
import { BaseStatsCard } from './BaseStatsCard';

interface AttendanceStatsCardProps {
  stats: AttendanceStats;
  period: PeriodType;
}

export const AttendanceStatsCard = ({ stats, period }: AttendanceStatsCardProps) => {
  // Calcular métricas relevantes
  const avgPerVisitor = stats.unique_visitors > 0 
    ? (stats.total_attendances / stats.unique_visitors).toFixed(1)
    : '0';

  return (
    <BaseStatsCard title="Asistencias" icon={Activity} iconColor="red">
      {/* Métricas Principales - Compactas */}
      <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-100">
        <div className="text-center p-2 bg-red-50/50 rounded-lg border border-red-100">
          <p className="text-xs text-gray-600 mb-0.5">Total</p>
          <p className="text-xl font-bold text-powergym-charcoal">{formatNumber(stats.total_attendances)}</p>
        </div>
        <div className="text-center p-2 bg-blue-50/50 rounded-lg border border-blue-100">
          <p className="text-xs text-gray-600 mb-0.5">Únicos</p>
          <p className="text-xl font-bold text-blue-600">{formatNumber(stats.unique_visitors)}</p>
        </div>
      </div>

      {/* Tasa de Asistencia - Destacada */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-[10px] text-gray-600">Tasa de Asistencia</p>
              <p className="text-lg font-bold text-green-600">
                {formatPercentage(stats.attendance_rate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Secundarias - Compactas */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <Clock className="w-3 h-3 text-gray-500 mx-auto mb-1" />
          <p className="text-[10px] text-gray-500">Hora Pico</p>
          <p className="text-sm font-semibold text-powergym-charcoal">{stats.peak_hour}</p>
        </div>
        <div className="text-center">
          <Activity className="w-3 h-3 text-gray-500 mx-auto mb-1" />
          <p className="text-[10px] text-gray-500">Promedio</p>
          <p className="text-sm font-semibold text-powergym-charcoal">{formatNumber(stats.average_daily)}</p>
        </div>
        <div className="text-center">
          <Users className="w-3 h-3 text-gray-500 mx-auto mb-1" />
          <p className="text-[10px] text-gray-500">Prom/Visitante</p>
          <p className="text-sm font-semibold text-powergym-charcoal">{avgPerVisitor}</p>
        </div>
      </div>
    </BaseStatsCard>
  );
};
