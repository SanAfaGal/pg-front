import React, { useCallback } from 'react';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceTable } from './AttendanceTable';
import { useAttendanceHistory } from '../hooks/useAttendances';
import { Button } from '../../../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    // Create CSV content
    const headers = ['ID', 'Nombre del Cliente', 'DNI', 'Fecha de Check-in', 'Hora de Check-in'];
    const csvContent = [
      headers.join(','),
      ...attendances.map(attendance => [
        attendance.id,
        `"${attendance.client_first_name} ${attendance.client_last_name}"`,
        attendance.client_dni_number,
        new Date(attendance.check_in).toLocaleDateString(),
        new Date(attendance.check_in).toLocaleTimeString(),
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendances-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="space-y-6">
      {/* Filters - Always Visible */}
      <AttendanceFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* Table */}
      <AttendanceTable
        attendances={attendances}
        isLoading={isLoading}
        onExport={handleExport}
      />

      {/* Pagination */}
      {attendances.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{startItem}</span> a{' '}
            <span className="font-semibold text-gray-900">{endItem}</span> de{' '}
            <span className="font-semibold text-gray-900">{totalItems}</span> resultados
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
