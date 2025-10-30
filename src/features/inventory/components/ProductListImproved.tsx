import React, { useState, useMemo } from 'react';
import { Product, StockStatus } from '../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { 
  Package, 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Grid3x3,
  List,
  ArrowUpDown,
  History,
  Settings2,
  Filter,
  X as CloseIcon
} from 'lucide-react';

interface ProductListImprovedProps {
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
type FilterType = 'all' | 'stock_out' | 'low_stock' | 'active';
type SortType = 'name_asc' | 'name_desc' | 'stock_asc' | 'stock_desc';

interface StockBadgeProps {
  status: StockStatus;
  compact?: boolean;
}

const StockBadge: React.FC<StockBadgeProps> = ({ status, compact = false }) => {
  const getStatusConfig = (status: StockStatus) => {
    switch (status) {
      case 'NORMAL':
        return {
          label: 'Normal',
          icon: <CheckCircle className="w-3 h-3" />,
          className: 'bg-green-50 text-green-700 border-green-200',
        };
      case 'LOW_STOCK':
        return {
          label: 'Bajo',
          icon: <AlertTriangle className="w-3 h-3" />,
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        };
      case 'STOCK_OUT':
        return {
          label: 'Sin stock',
          icon: <XCircle className="w-3 h-3" />,
          className: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'OVERSTOCK':
        return {
          label: 'Exceso',
          icon: <TrendingUp className="w-3 h-3" />,
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      default:
        return {
          label: 'N/A',
          icon: null,
          className: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${config.className}`}>
      {config.icon}
      {!compact && config.label}
    </span>
  );
};

export const ProductListImproved: React.FC<ProductListImprovedProps> = ({
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
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('name_asc');
  const [showFilters, setShowFilters] = useState(false);

  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };

  const formatQuantity = (quantity: string) => {
    return parseFloat(quantity).toFixed(0);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
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

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'Todos';
      case 'stock_out': return 'Sin stock';
      case 'low_stock': return 'Stock bajo';
      case 'active': return 'Activos';
      default: return 'Todos';
    }
  };

  const getStockCount = (filter: FilterType) => {
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

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar productos</h3>
        <p className="text-gray-600 text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header con acciones */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'producto' : 'productos'}
            {filterType !== 'all' && ` • ${getFilterLabel(filterType)}`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'table' 
                  ? 'bg-white shadow-sm text-powergym-blue-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Vista tabla"
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
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>

          {onCreateNew && (
            <Button
              onClick={onCreateNew}
              className="bg-powergym-red hover:bg-[#c50202]"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nuevo Producto
            </Button>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
        {/* Search and quick actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              showFilters 
                ? 'bg-powergym-blue-medium text-white border-powergym-blue-medium' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
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
                {(['all', 'stock_out', 'low_stock', 'active'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterType(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterType === filter
                        ? 'bg-powergym-blue-medium text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getFilterLabel(filter)}
                    <span className="ml-1.5 opacity-75">({getStockCount(filter)})</span>
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
                {[
                  { value: 'name_asc', label: 'Nombre A-Z' },
                  { value: 'name_desc', label: 'Nombre Z-A' },
                  { value: 'stock_asc', label: 'Stock menor' },
                  { value: 'stock_desc', label: 'Stock mayor' },
                ].map((sort) => (
                  <button
                    key={sort.value}
                    onClick={() => setSortType(sort.value as SortType)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      sortType === sort.value
                        ? 'bg-powergym-blue-medium text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {filteredAndSortedProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
          {onCreateNew && (searchTerm || filterType !== 'all') === false && (
            <Button
              onClick={onCreateNew}
              className="bg-powergym-red hover:bg-[#c50202]"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Crear primer producto
            </Button>
          )}
        </Card>
      ) : viewMode === 'table' ? (
        <TableView 
          products={filteredAndSortedProducts}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageStock={onManageStock}
          onViewHistory={onViewHistory}
          formatCurrency={formatCurrency}
          formatQuantity={formatQuantity}
        />
      ) : (
        <CardsView 
          products={filteredAndSortedProducts}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageStock={onManageStock}
          onViewHistory={onViewHistory}
          formatCurrency={formatCurrency}
          formatQuantity={formatQuantity}
        />
      )}
    </div>
  );
};

// Table View Component
interface ViewProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onManageStock?: (product: Product) => void;
  onViewHistory?: (product: Product) => void;
  formatCurrency: (amount: string, currency: string) => string;
  formatQuantity: (quantity: string) => string;
}

const TableView: React.FC<ViewProps> = ({ 
  products, 
  onEdit, 
  onDelete, 
  onManageStock, 
  onViewHistory,
  formatCurrency,
  formatQuantity
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr 
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Product info */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.photo_url ? (
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 p-1.5">
                        <img 
                          src={product.photo_url} 
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatQuantity(product.capacity_value)} {product.unit_type}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                </td>

                {/* Stock info - COMPACTO */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-mono font-semibold text-gray-900">
                        {formatQuantity(product.available_quantity)} / {formatQuantity(product.min_stock)} / {formatQuantity(product.max_stock)}
                      </p>
                      <p className="text-xs text-gray-500">Actual / Mín / Máx</p>
                    </div>
                    <StockBadge status={product.stock_status} />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {onManageStock && (
                      <Button
                        size="sm"
                        className="bg-powergym-red hover:bg-[#c50202] text-white"
                        onClick={() => onManageStock(product)}
                      >
                        <Settings2 className="w-3.5 h-3.5 mr-1" />
                        Gestionar
                      </Button>
                    )}
                    
                    {onViewHistory && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewHistory(product)}
                        title="Ver historial"
                      >
                        <History className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(product)}
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(product)}
                        className="text-red-600 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Cards View Component
const CardsView: React.FC<ViewProps> = ({ 
  products, 
  onEdit, 
  onDelete, 
  onManageStock, 
  onViewHistory,
  formatCurrency,
  formatQuantity
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {/* Image */}
            {product.photo_url ? (
              <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 p-2 shadow-sm">
                <img 
                  src={product.photo_url} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-lg truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatQuantity(product.capacity_value)} {product.unit_type} • {formatCurrency(product.price, product.currency)}
                </p>
              </div>

              {/* Stock info - en una línea */}
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-mono font-semibold text-gray-900">
                  Stock: <span className="text-powergym-blue-medium">{formatQuantity(product.available_quantity)}</span>
                  {' / '}
                  <span className="text-gray-500">{formatQuantity(product.min_stock)}</span>
                  {' / '}
                  <span className="text-gray-500">{formatQuantity(product.max_stock)}</span>
                </p>
                <StockBadge status={product.stock_status} />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {onManageStock && (
                  <Button
                    size="sm"
                    className="bg-powergym-red hover:bg-[#c50202] text-white"
                    onClick={() => onManageStock(product)}
                  >
                    <Settings2 className="w-3.5 h-3.5 mr-1" />
                    Gestionar
                  </Button>
                )}
                
                {onViewHistory && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewHistory(product)}
                  >
                    <History className="w-3.5 h-3.5 mr-1" />
                    Historial
                  </Button>
                )}
                
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(product)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

