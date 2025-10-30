/**
 * ProductFilters Component
 * Handles search, filtering, and sorting for product list
 */

import React from 'react';
import { Input } from '../../../../../components/ui/Input';
import { Search, Filter, X as CloseIcon } from 'lucide-react';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../../../constants/productConstants';

export type FilterType = 'all' | 'stock_out' | 'low_stock' | 'active';
export type SortType = 'name_asc' | 'name_desc' | 'stock_asc' | 'stock_desc';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  getStockCount: (filter: FilterType) => number;
}

/**
 * ProductFilters - Search bar, filters, and sort controls
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  sortType,
  onSortChange,
  showFilters,
  onToggleFilters,
  getStockCount,
}) => {
  const getFilterLabel = (filter: FilterType): string => {
    const option = FILTER_OPTIONS.find(o => o.value === filter);
    return option?.label || 'Todos';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
      {/* Search and quick actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Limpiar búsqueda"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            showFilters 
              ? 'bg-powergym-blue-medium text-white border-powergym-blue-medium' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          aria-label={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {(filterType !== 'all' || sortType !== 'name_asc') && (
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-medium">
              {filterType !== 'all' ? '1' : ''}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="pt-4 border-t border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Quick filters */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Mostrar
            </label>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(option.value as FilterType)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterType === option.value
                      ? 'bg-powergym-blue-medium text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={filterType === option.value}
                >
                  {option.label}
                  <span className="ml-1.5 opacity-75">
                    ({getStockCount(option.value as FilterType)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort options */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Ordenar por
            </label>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value as SortType)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sortType === option.value
                      ? 'bg-powergym-blue-medium text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={sortType === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

