import { Calendar, Activity, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { type ClientDashboardResponse } from '../../features/clients';

interface AttendanceTabProps {
  dashboard: ClientDashboardResponse | undefined;
}

export function AttendanceTab({ dashboard }: AttendanceTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-700 mb-1">-</p>
          <p className="text-sm text-blue-600 font-medium">Asistencias este mes</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-700 mb-1">-</p>
          <p className="text-sm text-green-600 font-medium">Promedio mensual</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-amber-700 mb-1">
            {dashboard?.stats.last_attendance
              ? new Date(dashboard.stats.last_attendance).toLocaleDateString('es-CO', {
                  day: '2-digit',
                  month: 'short'
                })
              : 'N/A'
            }
          </p>
          <p className="text-sm text-amber-600 font-medium">Última asistencia</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-powergym-charcoal mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-powergym-red" />
          Registro de Asistencias
        </h3>

        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-600 mb-2">Registro de asistencias</p>
          <p className="text-gray-500">El sistema de registro de asistencias estará disponible próximamente</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-powergym-charcoal mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-powergym-red" />
          Estadísticas de Asistencia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Días más frecuentes</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Información no disponible</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Horarios preferidos</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Información no disponible</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
