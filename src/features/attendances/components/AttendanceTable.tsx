import React, { useState, useMemo, useCallback, memo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { useMediaQuery } from '../../../shared';
import { AttendanceWithClient } from '../types';
import { formatAttendanceDateTime } from '../utils/dateUtils';
import { 
  getAttendanceInitials, 
  sortAttendances, 
  getAttendanceStatus 
} from '../utils/attendanceHelpers';
import { ArrowUpDown, Download, User, Calendar, Clock } from 'lucide-react';

interface AttendanceTableProps {
  attendances: AttendanceWithClient[];
  isLoading: boolean;
  onExport?: () => void;
  className?: string;
}

type SortableField = 'client_first_name' | 'client_dni_number' | 'check_in';

export const AttendanceTable: React.FC<AttendanceTableProps> = memo(({
  attendances,
  isLoading,
  onExport,
  className = '',
}) => {
  const { isDesktop } = useMediaQuery();
  const [sortField, setSortField] = useState<SortableField>('check_in');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = useCallback((field: SortableField) => {
    setSortField((currentField) => {
      if (currentField === field) {
        setSortDirection((currentDir) => currentDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortDirection('desc');
      }
      return field;
    });
  }, []);

  const sortedAttendances = useMemo(() => {
    if (isLoading || !attendances || attendances.length === 0) {
      return [];
    }
    return sortAttendances(attendances, sortField, sortDirection);
  }, [attendances, sortField, sortDirection, isLoading]);

  const renderSortIcon = useCallback((field: SortableField) => {
    if (sortField !== field) return null;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
      />
    );
  }, [sortField, sortDirection]);

  // Loading State
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32 sm:w-48"></div>
            <div className="h-9 sm:h-10 bg-gray-200 rounded w-24 sm:w-32"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 sm:h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!attendances || attendances.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            No se encontraron asistencias
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto px-4">
            Intenta ajustar tus filtros o revisa más tarde para ver los registros de asistencia.
          </p>
        </div>
      </div>
    );
  }

  // Mobile Card View Component
  const MobileCardView = ({ attendance }: { attendance: AttendanceWithClient }) => {
    const { date, time } = formatAttendanceDateTime(attendance.check_in);
    const status = getAttendanceStatus(attendance.check_in);
    
    return (
      <Card className="p-4 hover:shadow-md transition-all duration-200" hover>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
            {getAttendanceInitials(attendance.client_first_name, attendance.client_last_name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {attendance.client_first_name} {attendance.client_last_name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">DNI: {attendance.client_dni_number}</p>
              </div>
              <Badge variant={status.variant} size="sm">
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-medium">{date}</span>
              <Clock className="w-3.5 h-3.5 text-gray-400 ml-2" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Historial de Asistencias
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {attendances.length} {attendances.length === 1 ? 'asistencia registrada' : 'asistencias registradas'}
            </p>
          </div>
        </div>
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Exportar CSV
          </Button>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {sortedAttendances.map((attendance) => (
          <MobileCardView key={attendance.id} attendance={attendance} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th
                  className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('client_first_name')}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Cliente</span>
                    {renderSortIcon('client_first_name')}
                  </div>
                </th>
                <th
                  className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('client_dni_number')}
                >
                  <div className="flex items-center gap-2">
                    <span>DNI</span>
                    {renderSortIcon('client_dni_number')}
                  </div>
                </th>
                <th
                  className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('check_in')}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Check-in</span>
                    {renderSortIcon('check_in')}
                  </div>
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedAttendances.map((attendance) => {
                const { date, time } = formatAttendanceDateTime(attendance.check_in);
                const status = getAttendanceStatus(attendance.check_in);
                
                return (
                  <tr 
                    key={attendance.id} 
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                          {getAttendanceInitials(attendance.client_first_name, attendance.client_last_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {attendance.client_first_name} {attendance.client_last_name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            ID: {attendance.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.client_dni_number}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{date}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

AttendanceTable.displayName = 'AttendanceTable';
