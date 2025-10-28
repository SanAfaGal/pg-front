import React from 'react';
import { useInventoryStats, useLowStockProducts, useOutOfStockProducts } from '../hooks/useReports';
import { Card } from '../../../components/ui/Card';
import { StockStatusBadge } from './ProductList';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  DollarSign
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-blue-50 text-blue-600 border-blue-200',
    success: 'bg-green-50 text-green-600 border-green-200',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    error: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${variants[variant]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export const SimpleInventoryReports: React.FC = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useInventoryStats();
  const { data: lowStockProducts, isLoading: lowStockLoading } = useLowStockProducts();
  const { data: outOfStockProducts, isLoading: outOfStockLoading } = useOutOfStockProducts();

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(num);
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Reportes de Inventario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Reportes de Inventario</h2>
        <Card className="p-6 text-center text-red-600">
          Error al cargar estadísticas: {String(statsError)}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reportes de Inventario</h2>
        <p className="text-gray-600">Resumen general del estado del inventario</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Productos"
            value={stats.total_products}
            icon={<Package className="w-6 h-6" />}
          />
          <StatsCard
            title="Stock Bajo"
            value={stats.low_stock_count}
            icon={<AlertTriangle className="w-6 h-6" />}
            variant="warning"
          />
          <StatsCard
            title="Sin Stock"
            value={stats.out_of_stock_count}
            icon={<TrendingDown className="w-6 h-6" />}
            variant="error"
          />
          <StatsCard
            title="Valor Total"
            value={formatCurrency(stats.total_inventory_value)}
            subtitle={`${stats.total_units} unidades`}
            icon={<DollarSign className="w-6 h-6" />}
            variant="success"
          />
        </div>
      )}

      {/* Alert Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Productos con Stock Bajo</h3>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {lowStockProducts?.length || 0}
            </span>
          </div>
          
          {lowStockLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : lowStockProducts && lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.available_quantity} | Mín: {product.min_stock}
                    </p>
                  </div>
                  <StockStatusBadge status={product.stock_status as any} />
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  Y {lowStockProducts.length - 5} productos más...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay productos con stock bajo</p>
          )}
        </Card>

        {/* Out of Stock Products */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Productos Sin Stock</h3>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {outOfStockProducts?.length || 0}
            </span>
          </div>
          
          {outOfStockLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : outOfStockProducts && outOfStockProducts.length > 0 ? (
            <div className="space-y-3">
              {outOfStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.available_quantity}
                    </p>
                  </div>
                  <StockStatusBadge status={product.stock_status as any} />
                </div>
              ))}
              {outOfStockProducts.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  Y {outOfStockProducts.length - 5} productos más...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay productos sin stock</p>
          )}
        </Card>
      </div>
    </div>
  );
};
