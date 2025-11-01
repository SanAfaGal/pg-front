import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { AttendanceFilterOptions } from '../types';

interface AttendanceFiltersProps {
  filters: AttendanceFilterOptions;
  onFiltersChange: (filters: AttendanceFilterOptions) => void;
  onClearFilters: () => void;
  className?: string;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
}) => {
  const [localFilters, setLocalFilters] = useState<AttendanceFilterOptions>(filters);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced search effect - auto-apply search filter after user stops typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const searchValue = localFilters.search;
    
    // Only auto-apply if search value changed and is different from current filters
    if (searchValue !== undefined && searchValue !== filters.search) {
      searchTimeoutRef.current = setTimeout(() => {
        onFiltersChange({ ...localFilters, search: searchValue });
      }, 500);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localFilters.search, filters.search, localFilters, onFiltersChange]);

  const handleFilterChange = (key: keyof AttendanceFilterOptions, value: string) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Limpiar Todo
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Nombre o DNI
            </label>
            <Input
              type="text"
              placeholder="Ingresa el nombre del cliente o DNI..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <Input
                type="datetime-local"
                value={localFilters.start_date ? localFilters.start_date.slice(0, 16) : ''}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                  handleFilterChange('start_date', value);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <Input
                type="datetime-local"
                value={localFilters.end_date ? localFilters.end_date.slice(0, 16) : ''}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                  handleFilterChange('end_date', value);
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Date Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtros Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  
                  setLocalFilters({
                    ...localFilters,
                    start_date: today.toISOString(),
                    end_date: tomorrow.toISOString(),
                  });
                }}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const weekStart = new Date();
                  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                  weekStart.setHours(0, 0, 0, 0);
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekEnd.getDate() + 7);
                  
                  setLocalFilters({
                    ...localFilters,
                    start_date: weekStart.toISOString(),
                    end_date: weekEnd.toISOString(),
                  });
                }}
              >
                Esta Semana
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const monthStart = new Date();
                  monthStart.setDate(1);
                  monthStart.setHours(0, 0, 0, 0);
                  const monthEnd = new Date(monthStart);
                  monthEnd.setMonth(monthEnd.getMonth() + 1);
                  
                  setLocalFilters({
                    ...localFilters,
                    start_date: monthStart.toISOString(),
                    end_date: monthEnd.toISOString(),
                  });
                }}
              >
                Este Mes
              </Button>
            </div>
          </div>

          {/* Apply/Cancel Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setLocalFilters(filters)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Búsqueda: {filters.search}
                <button
                  onClick={() => onFiltersChange({ ...filters, search: undefined })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.start_date && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Desde: {new Date(filters.start_date).toLocaleDateString()}
                <button
                  onClick={() => onFiltersChange({ ...filters, start_date: undefined })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.end_date && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Hasta: {new Date(filters.end_date).toLocaleDateString()}
                <button
                  onClick={() => onFiltersChange({ ...filters, end_date: undefined })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
