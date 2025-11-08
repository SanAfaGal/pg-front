import React from 'react';
import { MetricsCards } from './MetricsCards';
import { AttendanceChart, WeeklyTrendChart } from './AttendanceChart';
import { RecentAttendances } from './RecentAttendances';
import { useAttendanceMetrics, useAttendances } from '../hooks/useAttendances';

export const AttendanceDashboard: React.FC = () => {
  const { metrics, isLoading: metricsLoading } = useAttendanceMetrics();
  const { attendances, isLoading: attendancesLoading } = useAttendances({}, { limit: 10, offset: 0 });

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Metrics Cards */}
      <MetricsCards
        metrics={metrics}
        isLoading={metricsLoading}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
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
