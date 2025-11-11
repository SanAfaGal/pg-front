import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * Componente de paginación reutilizable
 * 
 * Muestra controles de navegación (anterior/siguiente) y información de página actual.
 * Soporta modo con total de páginas conocido o modo heurístico (detecta última página).
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading = false,
  className = '',
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = totalPages ? currentPage >= totalPages : false;

  // Calcular rango de items mostrados
  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const endItem = totalItems 
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : undefined;

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Información de página */}
      <div className="text-sm text-gray-600">
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
          <span>
            Mostrando <span className="font-semibold">{startItem}</span> -{' '}
            <span className="font-semibold">{endItem}</span> de{' '}
            <span className="font-semibold">{totalItems}</span> suscripciones
          </span>
        ) : totalPages ? (
          <span>
            Página <span className="font-semibold">{currentPage}</span> de{' '}
            <span className="font-semibold">{totalPages}</span>
          </span>
        ) : (
          <span>
            Página <span className="font-semibold">{currentPage}</span>
          </span>
        )}
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={isFirstPage || isLoading}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          aria-label="Página anterior"
        >
          Anterior
        </Button>

        <div className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">
          {currentPage}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={isLastPage || isLoading}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          aria-label="Página siguiente"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

