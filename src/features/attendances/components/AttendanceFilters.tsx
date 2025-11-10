import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { AttendanceFilterOptions } from '../types';
import { 
  getDateFilterPresets, 
  hasActiveFilters, 
  formatDateForInput, 
  parseInputDateToISO 
} from '../utils/filterHelpers';
import { Filter, X, Calendar } from 'lucide-react';

interface AttendanceFiltersProps {
  filters: AttendanceFilterOptions;
  onFiltersChange: (filters: AttendanceFilterOptions) => void;
  onClearFilters: () => void;
  className?: string;
}

/**
 * AttendanceFilters component
 * Provides date range filtering with quick presets for attendance records
 * Optimized for performance with memoization and efficient state management
 */
export const AttendanceFilters: React.FC<AttendanceFiltersProps> = memo(({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
}) => {
  // Local state for date filters (allows cancellation before applying)
  const [localDateFilters, setLocalDateFilters] = useState<Pick<AttendanceFilterOptions, 'start_date' | 'end_date'>>({
    start_date: filters.start_date,
    end_date: filters.end_date,
  });
  
  // Memoized computed values
  const datePresets = useMemo(() => getDateFilterPresets(), []);
  const hasActive = useMemo(() => hasActiveFilters(filters), [filters]);

  // Sync local date filters with props when filters change externally
  useEffect(() => {
    setLocalDateFilters({
      start_date: filters.start_date,
      end_date: filters.end_date,
    });
  }, [filters.start_date, filters.end_date]);

  /**
   * Handle date filter input changes
   */
  const handleDateFilterChange = useCallback((key: 'start_date' | 'end_date', value: string) => {
    setLocalDateFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  }, []);

  /**
   * Apply current local filters to parent component
   */
  const handleApplyFilters = useCallback(() => {
    const cleanFilters: AttendanceFilterOptions = {
      ...(localDateFilters.start_date && { start_date: localDateFilters.start_date }),
      ...(localDateFilters.end_date && { end_date: localDateFilters.end_date }),
    };
    onFiltersChange(cleanFilters);
  }, [localDateFilters, onFiltersChange]);

  /**
   * Cancel changes and reset to current active filters
   */
  const handleCancel = useCallback(() => {
    setLocalDateFilters({
      start_date: filters.start_date,
      end_date: filters.end_date,
    });
  }, [filters.start_date, filters.end_date]);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    setLocalDateFilters({ start_date: undefined, end_date: undefined });
    onClearFilters();
  }, [onClearFilters]);

  /**
   * Apply a date preset (automatically applies to filters)
   */
  const handlePresetClick = useCallback((preset: ReturnType<typeof getDateFilterPresets>[0]) => {
    const newFilters: AttendanceFilterOptions = {
      start_date: preset.start_date.toISOString(),
      end_date: preset.end_date.toISOString(),
    };
    setLocalDateFilters({
      start_date: newFilters.start_date,
      end_date: newFilters.end_date,
    });
    onFiltersChange(newFilters);
  }, [onFiltersChange]);

  /**
   * Remove a specific filter by key
   */
  const handleRemoveFilter = useCallback((key: 'start_date' | 'end_date') => {
    const updatedFilters = { ...filters };
    delete updatedFilters[key];
    
    // Update local state to match
    setLocalDateFilters({
      start_date: updatedFilters.start_date,
      end_date: updatedFilters.end_date,
    });
    
    onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  /**
   * Format date for display in badges
   */
  const formatBadgeDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }, []);

  return (
    <Card className={`${className}`} padding="md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900">Filtros de Fecha</h3>
            <p className="text-xs text-gray-500 hidden sm:block mt-0.5">Filtra asistencias por rango de fechas</p>
          </div>
        </div>
        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            leftIcon={<X className="w-4 h-4" />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
          >
            Limpiar todo
          </Button>
        )}
      </div>

      {/* Quick Date Presets */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Rangos Rápidos</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {datePresets.map((preset) => {
            const isActive = 
              filters.start_date === preset.start_date.toISOString() &&
              filters.end_date === preset.end_date.toISOString();

            return (
              <Button
                key={preset.label}
                variant={isActive ? "primary" : "ghost"}
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className={`text-xs font-medium transition-all ${
                  isActive 
                    ? 'shadow-md' 
                    : 'hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200'
                }`}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Date Range Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <Input
            type="datetime-local"
            value={formatDateForInput(localDateFilters.start_date)}
            onChange={(e) => handleDateFilterChange('start_date', parseInputDateToISO(e.target.value))}
            className="w-full text-sm pl-10"
            placeholder="Fecha y hora inicio"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <Input
            type="datetime-local"
            value={formatDateForInput(localDateFilters.end_date)}
            onChange={(e) => handleDateFilterChange('end_date', parseInputDateToISO(e.target.value))}
            className="w-full text-sm pl-10"
            placeholder="Fecha y hora fin"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={handleCancel}
          size="sm"
          className="order-2 sm:order-1"
          disabled={!hasActive}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleApplyFilters}
          size="sm"
          className="order-1 sm:order-2"
          disabled={
            localDateFilters.start_date === filters.start_date &&
            localDateFilters.end_date === filters.end_date
          }
        >
          Aplicar Filtros
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActive && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-600">Filtros activos:</span>
            {filters.start_date && (
              <Badge 
                variant="success" 
                size="sm"
                className="text-xs flex items-center gap-1.5 font-medium"
              >
                <Calendar className="w-3 h-3" />
                Desde: {formatBadgeDate(filters.start_date)}
                <button
                  type="button"
                  onClick={() => handleRemoveFilter('start_date')}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  aria-label="Remover filtro de fecha inicio"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.end_date && (
              <Badge 
                variant="success" 
                size="sm"
                className="text-xs flex items-center gap-1.5 font-medium"
              >
                <Calendar className="w-3 h-3" />
                Hasta: {formatBadgeDate(filters.end_date)}
                <button
                  type="button"
                  onClick={() => handleRemoveFilter('end_date')}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  aria-label="Remover filtro de fecha fin"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
});

AttendanceFilters.displayName = 'AttendanceFilters';
