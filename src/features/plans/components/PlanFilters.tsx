import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Search, X as CloseIcon, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isActiveFilter: 'all' | 'active' | 'inactive';
  onIsActiveFilterChange: (value: 'all' | 'active' | 'inactive') => void;
}

const FILTER_OPTIONS = [
  { value: 'all' as const, label: 'Todos', count: null },
  { value: 'active' as const, label: 'Activos', count: null },
  { value: 'inactive' as const, label: 'Inactivos', count: null },
];

export const PlanFilters: React.FC<PlanFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  isActiveFilter,
  onIsActiveFilterChange,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchTerm);
    onSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const hasActiveFilters = isActiveFilter !== 'all' || localSearchTerm.trim() !== '';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Search and quick actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            type="text"
            placeholder="Buscar planes por nombre, descripción o slug..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-9 sm:pl-11 pr-9 sm:pr-11 text-sm"
          />
          {localSearchTerm && (
            <button
              onClick={() => {
                setLocalSearchTerm('');
                onSearchChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
            showFilters || hasActiveFilters
              ? 'bg-powergym-blue-medium text-white border-powergym-blue-medium shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          aria-label={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
              showFilters || hasActiveFilters
                ? 'bg-white/20'
                : 'bg-powergym-blue-medium/10 text-powergym-blue-medium'
            }`}>
              1
            </span>
          )}
        </button>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-3 sm:pt-4 border-t border-gray-200 space-y-3 sm:space-y-4 overflow-hidden"
          >
            {/* Status filters */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Estado del Plan
              </label>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onIsActiveFilterChange(option.value)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      isActiveFilter === option.value
                        ? 'bg-powergym-blue-medium text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-pressed={isActiveFilter === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

