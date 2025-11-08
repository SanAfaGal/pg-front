import { Card } from '../../../components/ui/Card';
import { Package, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { InventoryStats } from '../types';
import { formatCurrency, formatNumber } from '../utils/dashboardHelpers';

interface InventoryStatsCardProps {
  stats: InventoryStats;
}

export const InventoryStatsCard = ({ stats }: InventoryStatsCardProps) => {
  return (
    <Card padding="md" className="sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-amber-100 rounded-lg sm:rounded-xl">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-powergym-charcoal">Inventario</h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              <span className="hidden sm:inline">Total Productos</span>
              <span className="sm:hidden">Total</span>
            </p>
            <p className="text-xl sm:text-2xl font-bold text-powergym-charcoal">
              {formatNumber(stats.total_products)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Activos</p>
            <p className="text-lg sm:text-xl font-semibold text-green-600">
              {formatNumber(stats.active_products)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              <span className="hidden sm:inline">Valor Total</span>
              <span className="sm:hidden">Valor</span>
            </p>
            <p className="text-lg sm:text-xl font-semibold text-powergym-charcoal">
              {formatCurrency(stats.total_inventory_value)}
            </p>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            <span className="hidden sm:inline">Estado del Stock</span>
            <span className="sm:hidden">Stock</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-red-50 rounded-lg sm:rounded-xl border border-red-200">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <p className="text-xs sm:text-sm font-semibold text-red-700">Sin Stock</p>
              </div>
              <p className="text-lg sm:text-xl font-bold text-red-600">
                {formatNumber(stats.out_of_stock_count)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-amber-50 rounded-lg sm:rounded-xl border border-amber-200">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <p className="text-xs sm:text-sm font-semibold text-amber-700">Stock Bajo</p>
              </div>
              <p className="text-lg sm:text-xl font-bold text-amber-600">
                {formatNumber(stats.low_stock_count)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-200">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <p className="text-xs sm:text-sm font-semibold text-green-700">Sobrestock</p>
              </div>
              <p className="text-lg sm:text-xl font-bold text-green-600">
                {formatNumber(stats.overstock_count)}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            <span className="hidden sm:inline">Ventas en el Período</span>
            <span className="sm:hidden">Ventas</span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Unidades</p>
              <p className="text-base sm:text-lg font-semibold">{formatNumber(stats.sales_in_period.units)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Monto</p>
              <p className="text-base sm:text-lg font-semibold">
                {formatCurrency(stats.sales_in_period.amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
