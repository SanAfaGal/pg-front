import { Package, AlertTriangle, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { InventoryStats } from '../types';
import { formatCurrency, formatNumber } from '../utils/dashboardHelpers';
import { BaseStatsCard } from './BaseStatsCard';

interface InventoryStatsCardProps {
  stats: InventoryStats;
}

export const InventoryStatsCard = ({ stats }: InventoryStatsCardProps) => {
  // Calcular métricas relevantes
  const activeRate = stats.total_products > 0 
    ? ((stats.active_products / stats.total_products) * 100).toFixed(1)
    : '0';
  const avgProductValue = stats.active_products > 0
    ? stats.total_inventory_value / stats.active_products
    : 0;

  return (
    <BaseStatsCard title="Inventario" icon={Package} iconColor="amber">
      {/* Métricas Principales - Compactas */}
      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">Total</p>
          <p className="text-xl font-bold text-powergym-charcoal">{formatNumber(stats.total_products)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">Activos</p>
          <p className="text-xl font-bold text-green-600">{formatNumber(stats.active_products)}</p>
          <p className="text-[10px] text-gray-400">{activeRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">Valor Total</p>
          <p className="text-lg font-bold text-powergym-charcoal">
            {formatCurrency(stats.total_inventory_value)}
          </p>
        </div>
      </div>

      {/* Alertas de Stock - Destacadas */}
      {(stats.out_of_stock_count > 0 || stats.low_stock_count > 0) && (
        <div className="mb-3 pb-3 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            {stats.out_of_stock_count > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600">Sin Stock</p>
                  <p className="text-base font-bold text-red-600">{formatNumber(stats.out_of_stock_count)}</p>
                </div>
              </div>
            )}
            {stats.low_stock_count > 0 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600">Stock Bajo</p>
                  <p className="text-base font-bold text-amber-600">{formatNumber(stats.low_stock_count)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ventas del Período - Compactas */}
      {stats.sales_in_period.units > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3 h-3 text-gray-500" />
            <p className="text-xs font-semibold text-gray-700">Ventas del Período</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[10px] text-gray-500">Unidades</p>
              <p className="text-base font-bold text-powergym-charcoal">
                {formatNumber(stats.sales_in_period.units)}
              </p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[10px] text-gray-500">Monto</p>
              <p className="text-base font-bold text-green-600">
                {formatCurrency(stats.sales_in_period.amount)}
              </p>
            </div>
          </div>
        </div>
      )}
    </BaseStatsCard>
  );
};
