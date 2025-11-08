import React from 'react';
import { Card } from '../../../components/ui/Card';
import { AttendanceWithClient } from '../types';
import { getAttendanceInitials } from '../utils/attendanceHelpers';

interface RecentAttendancesProps {
  attendances: AttendanceWithClient[];
  isLoading: boolean;
  className?: string;
}

export const RecentAttendances: React.FC<RecentAttendancesProps> = ({
  attendances,
  isLoading,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Asistencias Recientes</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16 flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!attendances || attendances.length === 0) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Asistencias Recientes</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm sm:text-base">No hay asistencias recientes</p>
          </div>
        </div>
      </Card>
    );
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Asistencias Recientes</h3>
        <span className="text-xs sm:text-sm text-gray-500">{attendances.length} total</span>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {attendances.slice(0, 10).map((attendance) => (
          <div
            key={attendance.id}
            className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {/* Avatar */}
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              {getAttendanceInitials(attendance.client_first_name, attendance.client_last_name)}
            </div>
            
            {/* Client Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {attendance.client_first_name} {attendance.client_last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                DNI: {attendance.client_dni_number}
              </p>
            </div>
            
            {/* Time */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {formatTime(attendance.check_in)}
              </p>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(attendance.check_in).toLocaleTimeString('es-CO', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {attendances.length > 10 && (
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Mostrando 10 de {attendances.length} asistencias recientes
          </p>
        </div>
      )}
    </Card>
  );
};
