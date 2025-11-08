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
    <Card padding="md" className="sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-red-100 rounded-lg sm:rounded-xl">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-powergym-charcoal">Asistencias</h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Total Asistencias</span>
              <span className="sm:hidden">Total</span>
            </p>
            <p className="text-xl sm:text-2xl font-bold text-powergym-charcoal">
              {formatNumber(stats.total_attendances)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Visitantes Únicos</span>
              <span className="sm:hidden">Únicos</span>
            </p>
            <p className="text-xl sm:text-2xl font-bold text-powergym-charcoal">
              {formatNumber(stats.unique_visitors)}
            </p>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Hora Pico
            </p>
            <p className="text-base sm:text-lg font-semibold text-powergym-charcoal">{stats.peak_hour}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Promedio Diario</span>
              <span className="sm:hidden">Promedio</span>
            </p>
            <p className="text-base sm:text-lg font-semibold text-powergym-charcoal">
              {formatNumber(stats.average_daily)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              <span className="hidden sm:inline">Tasa de Asistencia</span>
              <span className="sm:hidden">Tasa</span>
            </p>
            <p className="text-base sm:text-lg font-semibold text-green-600">
              {formatPercentage(stats.attendance_rate)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
