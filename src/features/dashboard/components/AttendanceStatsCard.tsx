import { Card } from '../../../components/ui/Card';
import { Activity, Clock, Users, TrendingUp } from 'lucide-react';
import { AttendanceStats, PeriodType } from '../types';
import { formatNumber, formatPercentage } from '../utils/dashboardHelpers';

interface AttendanceStatsCardProps {
  stats: AttendanceStats;
  period: PeriodType;
}

export const AttendanceStatsCard = ({ stats, period }: AttendanceStatsCardProps) => {
  return (
    <Card padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-xl">
          <Activity className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-powergym-charcoal">Asistencias</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Total Asistencias
            </p>
            <p className="text-2xl font-bold text-powergym-charcoal">
              {formatNumber(stats.total_attendances)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Visitantes Únicos
            </p>
            <p className="text-2xl font-bold text-powergym-charcoal">
              {formatNumber(stats.unique_visitors)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Hora Pico
            </p>
            <p className="text-lg font-semibold text-powergym-charcoal">{stats.peak_hour}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Promedio Diario
            </p>
            <p className="text-lg font-semibold text-powergym-charcoal">
              {formatNumber(stats.average_daily)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tasa de Asistencia</p>
            <p className="text-lg font-semibold text-green-600">
              {formatPercentage(stats.attendance_rate)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
