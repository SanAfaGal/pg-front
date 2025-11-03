import { Card } from '../../../components/ui/Card';
import { Package, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { InventoryStats } from '../types';
import { formatCurrency, formatNumber } from '../utils/dashboardHelpers';

interface InventoryStatsCardProps {
  stats: InventoryStats;
}

export const InventoryStatsCard = ({ stats }: InventoryStatsCardProps) => {
  return (
    <Card padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 rounded-xl">
          <Package className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-powergym-charcoal">Inventario</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Productos</p>
            <p className="text-2xl font-bold text-powergym-charcoal">
              {formatNumber(stats.total_products)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Activos</p>
            <p className="text-xl font-semibold text-green-600">
              {formatNumber(stats.active_products)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Valor Total</p>
            <p className="text-xl font-semibold text-powergym-charcoal">
              {formatCurrency(stats.total_inventory_value)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Estado del Stock</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-semibold text-red-700">Sin Stock</p>
              </div>
              <p className="text-xl font-bold text-red-600">
                {formatNumber(stats.out_of_stock_count)}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-semibold text-amber-700">Stock Bajo</p>
              </div>
              <p className="text-xl font-bold text-amber-600">
                {formatNumber(stats.low_stock_count)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm font-semibold text-green-700">Sobrestock</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                {formatNumber(stats.overstock_count)}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Ventas en el Período</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Unidades</p>
              <p className="text-lg font-semibold">{formatNumber(stats.sales_in_period.units)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Monto</p>
              <p className="text-lg font-semibold">
                {formatCurrency(stats.sales_in_period.amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
