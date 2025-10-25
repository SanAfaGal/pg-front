import React from 'react';
import { MetricsCards } from './MetricsCards';
import { AttendanceChart, WeeklyTrendChart } from './AttendanceChart';
import { RecentAttendances } from './RecentAttendances';
import { useAttendanceMetrics, useAttendances } from '../hooks/useAttendances';

export const AttendanceDashboard: React.FC = () => {
  const { metrics, isLoading: metricsLoading } = useAttendanceMetrics();
  const { attendances, isLoading: attendancesLoading } = useAttendances({}, { limit: 10, offset: 0 });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control de Asistencias</h1>
        <p className="text-gray-600">
          Monitorea las métricas de asistencia del gimnasio y los check-ins recientes en tiempo real.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="mb-8">
        <MetricsCards
          metrics={metrics}
          isLoading={metricsLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AttendanceChart
          metrics={metrics}
          isLoading={metricsLoading}
        />
        <WeeklyTrendChart
          metrics={metrics}
          isLoading={metricsLoading}
        />
      </div>

      {/* Recent Attendances */}
      <RecentAttendances
        attendances={attendances}
        isLoading={attendancesLoading}
      />
    </div>
  );
};
