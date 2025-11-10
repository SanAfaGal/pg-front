import React, { useCallback } from 'react';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceTable } from './AttendanceTable';
import { useAttendanceHistory } from '../hooks/useAttendances';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { exportToCSV } from '../../../shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AttendanceWithClient } from '../types';

export const AttendanceHistory: React.FC = () => {
  const {
    attendances,
    isLoading,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    clearFilters,
  } = useAttendanceHistory();

  const handleExport = useCallback(() => {
    exportToCSV<AttendanceWithClient>(
      attendances,
      ['ID', 'Nombre del Cliente', 'DNI', 'Fecha de Check-in', 'Hora de Check-in'],
      (attendance) => [
        attendance.id,
        `${attendance.client_first_name} ${attendance.client_last_name}`,
        attendance.client_dni_number,
        new Date(attendance.check_in).toLocaleDateString('es-CO'),
        new Date(attendance.check_in).toLocaleTimeString('es-CO'),
      ],
      'asistencias'
    );
  }, [attendances]);

  const handlePreviousPage = useCallback(() => {
    updatePagination({ offset: Math.max(0, pagination.offset - pagination.limit) });
  }, [pagination.offset, pagination.limit, updatePagination]);

  const handleNextPage = useCallback(() => {
    updatePagination({ offset: pagination.offset + pagination.limit });
  }, [pagination.offset, pagination.limit, updatePagination]);

  const canGoPrevious = pagination.offset > 0;
  const canGoNext = attendances.length >= pagination.limit;
  const startItem = pagination.offset + 1;
  const endItem = Math.min(pagination.offset + pagination.limit, pagination.offset + attendances.length);
  const totalItems = pagination.offset + attendances.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters - Always Visible */}
      <div className="w-full">
        <AttendanceFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden">
        <AttendanceTable
          attendances={attendances}
          isLoading={isLoading}
          onExport={handleExport}
        />
      </div>

      {/* Pagination */}
      {attendances.length > 0 && (
        <Card className="p-4 sm:p-5" padding="none">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Mostrando <span className="font-bold text-gray-900">{startItem}</span> a{' '}
              <span className="font-bold text-gray-900">{endItem}</span> de{' '}
              <span className="font-bold text-gray-900">{totalItems}</span> resultados
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!canGoPrevious}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="flex-1 sm:flex-initial min-w-[100px]"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!canGoNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="flex-1 sm:flex-initial min-w-[100px]"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
