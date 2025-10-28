import React, { useState } from 'react';
import { Product, StockStatus } from '../types';
import { Badge } from '../../../components/ui/Badge';
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
  TrendingUp
} from 'lucide-react';

interface StockStatusBadgeProps {
  status: StockStatus;
  className?: string;
}

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusInfo = (status: StockStatus) => {
    switch (status) {
      case 'NORMAL':
        return {
          label: 'Normal',
          variant: 'success' as const,
          icon: <CheckCircle className="w-3 h-3" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
        };
      case 'LOW_STOCK':
        return {
          label: 'Stock Bajo',
          variant: 'warning' as const,
          icon: <AlertTriangle className="w-3 h-3" />,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
        };
      case 'STOCK_OUT':
        return {
          label: 'Sin Stock',
          variant: 'error' as const,
          icon: <XCircle className="w-3 h-3" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
        };
      case 'OVERSTOCK':
        return {
          label: 'Sobrestock',
          variant: 'info' as const,
          icon: <TrendingUp className="w-3 h-3" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
        };
      default:
        return {
          label: 'Desconocido',
          variant: 'default' as const,
          icon: null,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  
  return (
    <Badge
      variant={statusInfo.variant}
      className={`${statusInfo.bgColor} ${statusInfo.textColor} ${className}`}
    >
      {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
      {statusInfo.label}
    </Badge>
  );
};

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onManageStock?: (product: Product) => void;
  onViewHistory?: (product: Product) => void;
  showActions?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onManageStock,
  onViewHistory,
  showActions = true,
  className = '',
}) => {
  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };

  const formatQuantity = (quantity: string, unit: string) => {
    return `${parseFloat(quantity)} ${unit}`;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {product.photo_url ? (
              <img 
                src={product.photo_url} 
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {formatQuantity(product.capacity_value, product.unit_type)}
              </p>
            </div>
          </div>
          {product.description && (
            <p className="text-sm text-gray-600 mb-2">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StockStatusBadge status={product.stock_status} />
          {!product.is_active && (
            <Badge variant="default" className="bg-gray-100 text-gray-600">
              Inactivo
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Precio
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(product.price, product.currency)}
          </p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Stock Actual
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatQuantity(product.available_quantity, "")}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Stock Mínimo
          </p>
          <p className="text-sm text-gray-600">
            {formatQuantity(product.min_stock, "")}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Stock Máximo
          </p>
          <p className="text-sm text-gray-600">
            {formatQuantity(product.max_stock, "")}
          </p>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {onManageStock && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onManageStock(product)}
            >
              Gestionar Stock
            </Button>
          )}
          
          {onViewHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewHistory(product)}
            >
              Ver Historial
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(product)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Editar
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(product)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

interface ProductListProps {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'ALL'>('ALL');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'ALL' || product.stock_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-red-600 mb-2">
          <XCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Error al cargar productos</p>
        </div>
        <p className="text-gray-600 text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
          <p className="text-gray-600">
            {filteredProducts.length} de {products.length} productos
          </p>
        </div>
        
        {onCreateNew && (
          <Button
            variant="primary"
            onClick={onCreateNew}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo Producto
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StockStatus | 'ALL')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">Todos los estados</option>
          <option value="NORMAL">Normal</option>
          <option value="LOW_STOCK">Stock Bajo</option>
          <option value="STOCK_OUT">Sin Stock</option>
          <option value="OVERSTOCK">Sobrestock</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="text-gray-400 mb-2">
            <Package className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'No se encontraron productos' 
                : 'No hay productos registrados'
              }
            </p>
          </div>
          <p className="text-gray-600 text-sm">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer producto al inventario'
            }
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              onManageStock={onManageStock}
              onViewHistory={onViewHistory}
            />
          ))}
        </div>
      )}
    </div>
  );
};
