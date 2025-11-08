import React, { useState, useMemo, useCallback, memo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
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

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              Registros de Asistencia
            </h3>
            <p className="text-xs text-gray-500">
              {attendances.length} {attendances.length === 1 ? 'registro' : 'registros'}
            </p>
          </div>
        </div>
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-3 h-3 sm:w-4 sm:h-4" />}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Exportar</span>
            <span className="sm:hidden">Exportar CSV</span>
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50/50">
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors rounded-l-lg min-w-[200px]"
                onClick={() => handleSort('client_first_name')}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                  <span>Cliente</span>
                  {renderSortIcon('client_first_name')}
                </div>
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors hidden sm:table-cell"
                onClick={() => handleSort('client_dni_number')}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span>DNI</span>
                  {renderSortIcon('client_dni_number')}
                </div>
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('check_in')}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                  <span>Check-in</span>
                  {renderSortIcon('check_in')}
                </div>
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-r-lg">
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
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  {/* Client Info */}
                  <td className="px-2 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm flex-shrink-0">
                        {getAttendanceInitials(attendance.client_first_name, attendance.client_last_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {attendance.client_first_name} {attendance.client_last_name}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {attendance.client_dni_number}
                        </div>
                        <div className="text-xs text-gray-500 hidden sm:block">
                          {attendance.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="px-2 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {attendance.client_dni_number}
                    </div>
                  </td>

                  {/* Check-in DateTime */}
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{date}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {time}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
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
  );
});

AttendanceTable.displayName = 'AttendanceTable';
