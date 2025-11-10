/**
 * ProductList Component (Improved & Refactored)
 * Main component that orchestrates product listing with filters, search, and multiple views
 */

import React, { useState, useMemo } from 'react';
import { Product } from '../../../types';
import { Button } from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { Package, Plus, List, Grid3x3, XCircle } from 'lucide-react';
import { LoadingState } from '../../common/LoadingState';
import { ProductFilters, type FilterType, type SortType } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { ProductCards } from './ProductCards';
import { useMediaQuery } from '../../../../../shared';

export interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onManageStock?: (product: Product) => void;
  onViewHistory?: (product: Product) => void;
  onCreateNew?: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

type ViewMode = 'table' | 'cards';

/**
 * ProductList - Main product listing component
 * 
 * Features:
 * - Search functionality
 * - Status filtering (all, stock_out, low_stock, active)
 * - Sorting (name, stock)
 * - Multiple views (table, cards)
 * - Loading and error states
 * - Empty state with CTA
 */
export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  onManageStock,
  onViewHistory,
  onCreateNew,
  isLoading = false,
  error,
  className = '',
}) => {
  const { isDesktop } = useMediaQuery();
  
  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('name_asc');
  const [showFilters, setShowFilters] = useState(false);

  // Auto-select view mode based on screen size
  const effectiveViewMode = isDesktop ? viewMode : 'cards';

  /**
   * Filter and sort products based on current settings
   */
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description?.toLowerCase().includes(term) ?? false)
      );
    }

    // Apply status filter
    switch (filterType) {
      case 'stock_out':
        result = result.filter(p => p.stock_status === 'STOCK_OUT');
        break;
      case 'low_stock':
        result = result.filter(p => p.stock_status === 'LOW_STOCK');
        break;
      case 'active':
        result = result.filter(p => p.is_active);
        break;
      case 'all':
      default:
        break;
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortType) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'stock_asc':
          return parseFloat(a.available_quantity) - parseFloat(b.available_quantity);
        case 'stock_desc':
          return parseFloat(b.available_quantity) - parseFloat(a.available_quantity);
        default:
          return 0;
      }
    });

    return result;
  }, [products, searchTerm, filterType, sortType]);

  /**
   * Get count of products matching a filter
   */
  const getStockCount = (filter: FilterType): number => {
    switch (filter) {
      case 'stock_out':
        return products.filter(p => p.stock_status === 'STOCK_OUT').length;
      case 'low_stock':
        return products.filter(p => p.stock_status === 'LOW_STOCK').length;
      case 'active':
        return products.filter(p => p.is_active).length;
      case 'all':
      default:
        return products.length;
    }
  };

  /**
   * Get filter label for display
   */
  const getFilterLabel = (filter: FilterType): string => {
    const labels: Record<FilterType, string> = {
      all: 'Todos',
      stock_out: 'Sin stock',
      low_stock: 'Stock bajo',
      active: 'Activos',
    };
    return labels[filter];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <LoadingState variant="skeleton" rows={3} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error al cargar productos
        </h3>
        <p className="text-gray-600 text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-600">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'producto' : 'productos'}
            {filterType !== 'all' && ` • ${getFilterLabel(filterType)}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* View toggle - only show on desktop */}
          {isDesktop && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'table' 
                    ? 'bg-white shadow-sm text-powergym-blue-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Vista tabla"
                aria-label="Vista tabla"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white shadow-sm text-powergym-blue-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Vista tarjetas"
                aria-label="Vista tarjetas"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          )}

          {onCreateNew && (
            <Button
              onClick={onCreateNew}
              size="sm"
              className="bg-powergym-red hover:bg-[#c50202] flex-1 sm:flex-none"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Nuevo Producto</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        sortType={sortType}
        onSortChange={setSortType}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        getStockCount={getStockCount}
      />

      {/* Content */}
      {filteredAndSortedProducts.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' 
              ? 'No se encontraron productos' 
              : 'No hay productos registrados'
            }
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {searchTerm || filterType !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer producto al inventario'
            }
          </p>
          {onCreateNew && !searchTerm && filterType === 'all' && (
            <Button
              onClick={onCreateNew}
              size="sm"
              className="bg-powergym-red hover:bg-[#c50202]"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Crear primer producto
            </Button>
          )}
        </Card>
      ) : effectiveViewMode === 'table' ? (
        <ProductTable 
          products={filteredAndSortedProducts}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageStock={onManageStock}
          onViewHistory={onViewHistory}
        />
      ) : (
        <ProductCards 
          products={filteredAndSortedProducts}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageStock={onManageStock}
          onViewHistory={onViewHistory}
        />
      )}
    </div>
  );
};

// Re-export for convenience
export { ProductFilters, ProductTable, ProductCards };
export type { FilterType, SortType };

