import React, { useState } from 'react';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceTable } from './AttendanceTable';
import { AttendanceDetail } from './AttendanceDetail';
import { useAttendanceHistory } from '../hooks/useAttendances';
import { AttendanceWithClient } from '../types';

export const AttendanceHistory: React.FC = () => {
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceWithClient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    attendances,
    isLoading,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    clearFilters,
  } = useAttendanceHistory();

  const handleViewDetails = (attendance: AttendanceWithClient) => {
    setSelectedAttendance(attendance);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedAttendance(null);
    setIsDetailModalOpen(false);
  };

  const handleExport = () => {
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
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Asistencias</h1>
        <p className="text-gray-600">
          Ve y gestiona todos los registros de asistencia con opciones de filtrado avanzadas.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <AttendanceFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Table */}
      <AttendanceTable
        attendances={attendances}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onExport={handleExport}
      />

      {/* Pagination */}
      {attendances.length > 0 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {pagination.offset + 1} a {Math.min(pagination.offset + pagination.limit, attendances.length)} de {attendances.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updatePagination({ offset: Math.max(0, pagination.offset - pagination.limit) })}
              disabled={pagination.offset === 0}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => updatePagination({ offset: pagination.offset + pagination.limit })}
              disabled={attendances.length < pagination.limit}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AttendanceDetail
        attendance={selectedAttendance}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
};
