import React from 'react';
import { Card } from '../../../components/ui/Card';
import { AttendanceMetrics } from '../types';

interface AttendanceChartProps {
  metrics: AttendanceMetrics | null;
  isLoading: boolean;
  className?: string;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  metrics,
  isLoading,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!metrics || !metrics.hourly_data || metrics.hourly_data.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance by Hour</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No data available</p>
        </div>
      </Card>
    );
  }

  const maxCount = Math.max(...metrics.hourly_data.map(d => d.count));
  const maxHeight = 200;

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance by Hour</h3>
      
      <div className="space-y-4">
        {/* Chart */}
        <div className="flex items-end space-x-1 h-64">
          {metrics.hourly_data.map((data, index) => {
            const height = (data.count / maxCount) * maxHeight;
            const isCurrentHour = new Date().getHours() === data.hour;
            
            return (
              <div key={data.hour} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isCurrentHour 
                        ? 'bg-blue-500' 
                        : data.count > 0 
                          ? 'bg-blue-300' 
                          : 'bg-gray-200'
                    }`}
                    style={{ height: Math.max(height, 4) }}
                    title={`${data.hour}:00 - ${data.count} attendances`}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {data.hour.toString().padStart(2, '0')}:00
                </div>
                <div className="text-xs font-medium text-gray-900 mt-1">
                  {data.count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Current Hour</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-300 rounded"></div>
            <span className="text-gray-600">Other Hours</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span className="text-gray-600">No Data</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Weekly Trend Chart Component
interface WeeklyTrendChartProps {
  metrics: AttendanceMetrics | null;
  isLoading: boolean;
  className?: string;
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({
  metrics,
  isLoading,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!metrics || !metrics.weekly_trend || metrics.weekly_trend.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trend</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No data available</p>
        </div>
      </Card>
    );
  }

  const maxCount = Math.max(...metrics.weekly_trend.map(d => d.count));
  const maxHeight = 200;

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trend</h3>
      
      <div className="space-y-4">
        {/* Chart */}
        <div className="flex items-end space-x-2 h-64">
          {metrics.weekly_trend.map((data, index) => {
            const height = (data.count / maxCount) * maxHeight;
            const date = new Date(data.date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div key={data.date} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isToday 
                        ? 'bg-green-500' 
                        : data.count > 0 
                          ? 'bg-green-300' 
                          : 'bg-gray-200'
                    }`}
                    style={{ height: Math.max(height, 4) }}
                    title={`${date.toLocaleDateString()} - ${data.count} attendances`}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs font-medium text-gray-900 mt-1">
                  {data.count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-300 rounded"></div>
            <span className="text-gray-600">Other Days</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span className="text-gray-600">No Data</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
