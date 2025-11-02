import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { AttendanceFilterOptions } from '../types';
import { 
  getDateFilterPresets, 
  hasActiveFilters, 
  formatDateForInput, 
  parseInputDateToISO 
} from '../utils/filterHelpers';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { SEARCH_DEBOUNCE_MS } from '../constants/attendanceConstants';
import { Search, Filter, X } from 'lucide-react';

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
  const [localSearch, setLocalSearch] = useState<string>(filters.search || '');
  const [localDateFilters, setLocalDateFilters] = useState<Pick<AttendanceFilterOptions, 'start_date' | 'end_date'>>({
    start_date: filters.start_date,
    end_date: filters.end_date,
  });
  
  // Refs to access latest values without causing re-renders
  const filtersRef = useRef(filters);
  const onFiltersChangeRef = useRef(onFiltersChange);
  
  // Keep refs updated
  useEffect(() => {
    filtersRef.current = filters;
    onFiltersChangeRef.current = onFiltersChange;
  }, [filters, onFiltersChange]);
  
  // Debounce search value using module constant
  const debouncedSearch = useDebounce(localSearch.trim(), SEARCH_DEBOUNCE_MS);
  
  const datePresets = useMemo(() => getDateFilterPresets(), []);
  const hasActive = useMemo(() => hasActiveFilters(filters), [filters]);
  
  // Sync local search with props when filters change externally (e.g., clear filters)
  useEffect(() => {
    const externalSearch = filters.search || '';
    if (externalSearch !== localSearch) {
      setLocalSearch(externalSearch);
    }
  }, [filters.search]);

  // Sync local date filters with props
  useEffect(() => {
    if (filters.start_date !== localDateFilters.start_date || filters.end_date !== localDateFilters.end_date) {
      setLocalDateFilters({
        start_date: filters.start_date,
        end_date: filters.end_date,
      });
    }
  }, [filters.start_date, filters.end_date, localDateFilters.start_date, localDateFilters.end_date]);

  // Apply debounced search automatically
  useEffect(() => {
    const currentFilters = filtersRef.current;
    const currentSearch = (currentFilters.search || '').trim();
    const trimmedDebounced = debouncedSearch.trim();
    
    // Only apply if the debounced value differs from current filters
    if (trimmedDebounced !== currentSearch) {
      const updatedFilters: AttendanceFilterOptions = {
        ...currentFilters,
        search: trimmedDebounced || undefined,
      };
      onFiltersChangeRef.current(updatedFilters);
    }
    // Only depend on debouncedSearch to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
  }, []);

  const handleDateFilterChange = useCallback((key: 'start_date' | 'end_date', value: string) => {
    setLocalDateFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    // Apply date filters immediately (they don't have debounce)
    const cleanFilters: AttendanceFilterOptions = {
      ...(localSearch.trim() && { search: localSearch.trim() }),
      ...(localDateFilters.start_date && { start_date: localDateFilters.start_date }),
      ...(localDateFilters.end_date && { end_date: localDateFilters.end_date }),
    };
    onFiltersChange(cleanFilters);
  }, [localSearch, localDateFilters, onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    setLocalSearch('');
    setLocalDateFilters({ start_date: undefined, end_date: undefined });
    onClearFilters();
  }, [onClearFilters]);

  const handlePresetClick = useCallback((preset: ReturnType<typeof getDateFilterPresets>[0]) => {
    setLocalDateFilters({
      start_date: preset.start_date.toISOString(),
      end_date: preset.end_date.toISOString(),
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    const updatedFilters = { ...filters, search: undefined };
    onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  const handleRemoveFilter = useCallback((key: keyof AttendanceFilterOptions) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[key];
    onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  return (
    <Card className={`p-4 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActive && (
          <Button
            variant="ghost"
            size="xs"
            onClick={handleClearFilters}
            leftIcon={<X className="w-3 h-3" />}
            className="text-red-600 hover:text-red-700 h-7 px-2 text-xs"
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Compact Filters */}
      <div className="space-y-3">
        {/* Search - Inline with Clear Button */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyFilters();
              }
            }}
            className="w-full pl-9 pr-9 h-9 text-sm"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded hover:bg-gray-100 z-10"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Range - Compact Grid */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="datetime-local"
            value={formatDateForInput(localDateFilters.start_date)}
            onChange={(e) => handleDateFilterChange('start_date', parseInputDateToISO(e.target.value))}
            className="w-full h-9 text-sm"
            placeholder="Desde"
          />
          <Input
            type="datetime-local"
            value={formatDateForInput(localDateFilters.end_date)}
            onChange={(e) => handleDateFilterChange('end_date', parseInputDateToISO(e.target.value))}
            className="w-full h-9 text-sm"
            placeholder="Hasta"
          />
        </div>

        {/* Quick Date Filters - Compact */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 mr-1">Rápido:</span>
          <div className="flex flex-wrap gap-1.5">
            {datePresets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="xs"
                onClick={() => handlePresetClick(preset)}
                className="h-7 px-2 text-xs hover:bg-blue-50 hover:text-blue-700"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Apply/Cancel Buttons - Compact */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => {
              setLocalSearch(filters.search || '');
              setLocalDateFilters({
                start_date: filters.start_date,
                end_date: filters.end_date,
              });
            }}
            size="xs"
            className="h-7 px-3 text-xs"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApplyFilters}
            size="xs"
            className="h-7 px-3 text-xs"
          >
            Aplicar
          </Button>
        </div>
      </div>

      {/* Active Filters Display - Compact */}
      {hasActive && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-600">Activos:</span>
            {filters.search && (
              <Badge 
                variant="info" 
                size="sm"
                className="h-5 px-1.5 text-xs flex items-center gap-1"
              >
                {filters.search}
                <button
                  onClick={() => handleRemoveFilter('search')}
                  className="ml-0.5 hover:opacity-70"
                  aria-label="Remover filtro de búsqueda"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            )}
            {filters.start_date && (
              <Badge 
                variant="success" 
                size="sm"
                className="h-5 px-1.5 text-xs flex items-center gap-1"
              >
                {new Date(filters.start_date).toLocaleDateString()}
                <button
                  onClick={() => handleRemoveFilter('start_date')}
                  className="ml-0.5 hover:opacity-70"
                  aria-label="Remover filtro de fecha inicio"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            )}
            {filters.end_date && (
              <Badge 
                variant="success" 
                size="sm"
                className="h-5 px-1.5 text-xs flex items-center gap-1"
              >
                {new Date(filters.end_date).toLocaleDateString()}
                <button
                  onClick={() => handleRemoveFilter('end_date')}
                  className="ml-0.5 hover:opacity-70"
                  aria-label="Remover filtro de fecha fin"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
