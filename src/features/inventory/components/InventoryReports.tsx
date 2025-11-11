import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  useInventoryStats, 
  useLowStockProducts, 
  useOutOfStockProducts, 
  useOverstockProducts,
  useDailySales,
  useDailySalesByEmployee,
  useReconciliationReport
} from '../hooks/useReports';
import { Card } from '../../../components/ui/Card';
import { StockBadge } from './common/StockBadge';
import {
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { formatCurrency, formatQuantity } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DailySalesByEmployee as DailySalesByEmployeeResponse,
  ReconciliationReport as ReconciliationReportResponse,
  Movement,
  StockStatus,
} from '../types/index';

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
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${variants[variant]}`}>
          <div className="w-5 h-5 sm:w-6 sm:h-6">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface ProductAlertListProps {
  title: string;
  products: Array<{
    id: string;
    name: string;
    available_quantity: string;
    stock_status: StockStatus;
    min_stock?: string;
    max_stock?: string;
  }>;
  isLoading: boolean;
  error?: string;
  emptyMessage: string;
  icon: React.ReactNode;
}

const ProductAlertList: React.FC<ProductAlertListProps> = ({
  title,
  products,
  isLoading,
  error,
  emptyMessage,
  icon
}) => {
  if (isLoading && products.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 text-gray-400">{icon}</div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 text-gray-400">{icon}</div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-red-600 text-xs sm:text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 text-gray-400 flex-shrink-0">{icon}</div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate flex-1">{title}</h3>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex-shrink-0">
          {products.length}
        </span>
      </div>
      
      {products.length === 0 ? (
        <p className="text-gray-500 text-xs sm:text-sm">{emptyMessage}</p>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{product.name}</p>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Stock: <span className="font-medium">{formatQuantity(product.available_quantity)}</span>
                  </p>
                  {product.min_stock && (
                    <>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Mín: <span className="font-medium">{formatQuantity(product.min_stock)}</span>
                      </p>
                    </>
                  )}
                  {product.max_stock && (
                    <>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Máx: <span className="font-medium">{formatQuantity(product.max_stock)}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <StockBadge status={product.stock_status} />
              </div>
            </div>
          ))}
          {products.length > 5 && (
            <p className="text-xs sm:text-sm text-gray-500 text-center pt-2">
              Y {products.length - 5} productos más...
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export const InventoryReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startDate, setStartDate] = useState(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Solo hacer peticiones cuando el tab correspondiente esté activo
  const isOverviewTab = activeTab === 'overview';
  const isSalesTab = activeTab === 'sales';
  const isReconciliationTab = activeTab === 'reconciliation';

  // Datos del tab Overview - solo cuando está activo
  const { data: stats, isLoading: statsLoading, error: statsError } = useInventoryStats(isOverviewTab);
  const { data: lowStockProducts, isLoading: lowStockLoading, error: lowStockError } = useLowStockProducts(isOverviewTab);
  const { data: outOfStockProducts, isLoading: outOfStockLoading, error: outOfStockError } = useOutOfStockProducts(isOverviewTab);
  const { data: overstockProducts, isLoading: overstockLoading, error: overstockError } = useOverstockProducts(isOverviewTab);
  
  // Datos del tab Sales - solo cuando está activo
  const { data: dailySales, isLoading: dailySalesLoading, error: dailySalesError } = useDailySales({
    date: selectedDate,
    ...(selectedEmployee && { responsible: selectedEmployee })
  }, isSalesTab);
  
  const { data: salesByEmployee, isLoading: salesByEmployeeLoading, error: salesByEmployeeError } = useDailySalesByEmployee({
    date: selectedDate
  }, isSalesTab);
  
  // Datos del tab Reconciliation - solo cuando está activo
  const { data: reconciliation, isLoading: reconciliationLoading, error: reconciliationError } = useReconciliationReport({
    start_date: startDate,
    end_date: endDate
  }, isReconciliationTab);

  const renderOverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      {statsLoading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : statsError ? (
        <Card className="p-4 sm:p-6 text-center">
          <div className="flex flex-col items-center justify-center py-4">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Error al cargar estadísticas</p>
            <p className="text-xs text-gray-600">{String(statsError)}</p>
          </div>
        </Card>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Total de Productos"
            value={stats.total_products}
            icon={<Package className="w-full h-full" />}
          />
          <StatsCard
            title="Stock Bajo"
            value={stats.low_stock_count}
            icon={<AlertTriangle className="w-full h-full" />}
            variant="warning"
          />
          <StatsCard
            title="Sin Stock"
            value={stats.out_of_stock_count}
            icon={<TrendingDown className="w-full h-full" />}
            variant="error"
          />
          <StatsCard
            title="Valor Total"
            value={formatCurrency(stats.total_inventory_value, 'COP')}
            subtitle={`${formatQuantity(stats.total_units)} unidades`}
            icon={<DollarSign className="w-full h-full" />}
            variant="success"
          />
        </div>
      ) : null}

      {/* Alert Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <ProductAlertList
              title="Stock Bajo"
              products={lowStockProducts || []}
              isLoading={lowStockLoading}
              error={lowStockError ? String(lowStockError) : undefined}
              emptyMessage="No hay productos con stock bajo"
              icon={<AlertTriangle className="w-5 h-5 text-yellow-600" />}
            />
            
            <ProductAlertList
              title="Sin Stock"
              products={outOfStockProducts || []}
              isLoading={outOfStockLoading}
              error={outOfStockError ? String(outOfStockError) : undefined}
              emptyMessage="No hay productos sin stock"
              icon={<TrendingDown className="w-5 h-5 text-red-600" />}
            />
            
            <ProductAlertList
              title="Sobrestock"
              products={overstockProducts || []}
              isLoading={overstockLoading}
              error={overstockError ? String(overstockError) : undefined}
              emptyMessage="No hay productos con sobrestock"
              icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            />
          </div>
        </div>
      );

  const renderDailySalesTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Selector */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Fecha
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Empleado (opcional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Nombre del empleado"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Sales Summary */}
      {dailySalesLoading && !dailySales ? (
        <Card className="p-4 sm:p-6 animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </Card>
      ) : dailySalesError ? (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Error al cargar ventas</p>
            <p className="text-xs text-gray-600">{String(dailySalesError)}</p>
          </div>
        </Card>
      ) : dailySales ? (
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Resumen de Ventas - {format(new Date(selectedDate), 'dd/MM/yyyy', { locale: es })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatQuantity(dailySales.total_units_sold)}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Unidades Vendidas</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{dailySales.total_transactions}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Transacciones</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {dailySales.responsible || 'Todos'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Responsable</p>
            </div>
          </div>
          
          {dailySales.movements.length > 0 && (
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-3">Movimientos Recientes</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {dailySales.movements.slice(0, 10).map((movement, index) => (
                  <motion.div
                    key={movement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        ID: {movement.product_id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{movement.notes || 'Sin notas'}</p>
                    </div>
                    <div className="flex sm:flex-col sm:text-right gap-2 sm:gap-0">
                      <p className="text-sm font-semibold text-gray-900">{formatQuantity(movement.quantity)}</p>
                      {movement.responsible && (
                        <p className="text-xs text-gray-600 truncate">{movement.responsible}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ) : null}

      {/* Sales by Employee */}
      {salesByEmployeeLoading && !salesByEmployee ? (
        <Card className="p-4 sm:p-6 animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 sm:h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
      ) : salesByEmployeeError ? (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Error al cargar ventas por empleado</p>
            <p className="text-xs text-gray-600">{String(salesByEmployeeError)}</p>
          </div>
        </Card>
      ) : salesByEmployee && Object.keys(salesByEmployee.sales_by_employee).length > 0 ? (
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Ventas por Empleado
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(salesByEmployee.sales_by_employee).map(([employee, sales]: [string, DailySalesByEmployeeResponse['sales_by_employee'][string]], index) => (
              <motion.div
                key={employee}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{employee}</h4>
                  <span className="text-xs sm:text-sm text-gray-600">{sales.total_transactions} transacciones</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Unidades:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatQuantity(sales.total_units)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-600 text-xs sm:text-sm">Monto:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatCurrency(sales.total_amount, 'COP')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      ) : salesByEmployee ? (
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-sm text-gray-500">No hay ventas registradas para esta fecha</p>
        </Card>
      ) : null}
    </div>
  );

  const renderReconciliationTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Range Selector */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Fecha Fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Reconciliation Report */}
      {reconciliationLoading && !reconciliation ? (
        <Card className="p-4 sm:p-6 animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 sm:h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
      ) : reconciliationError ? (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Error al cargar conciliación</p>
            <p className="text-xs text-gray-600">{String(reconciliationError)}</p>
          </div>
        </Card>
      ) : reconciliation && Object.keys(reconciliation.reconciliation).length > 0 ? (
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Reporte de Conciliación
          </h3>
   
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(reconciliation.reconciliation).map(([employee, data]: [string, ReconciliationReportResponse['reconciliation'][string]], index) => (
              <motion.div
                key={employee}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{employee}</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{formatQuantity(data.total_units_sold)}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Unidades Vendidas</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{data.exit_count}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Salidas</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{formatQuantity(data.entries)}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Entradas</p>
                  </div>
                </div>
                
                {data.movements.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Ver movimientos ({data.movements.length})
                    </summary>
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                      {data.movements.map((movement: Movement, idx) => (
                        <motion.div
                          key={movement.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15, delay: idx * 0.01 }}
                          className="text-xs p-2 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900">ID: {movement.product_id.slice(0, 8)}</span>
                            {movement.notes && (
                              <span className="text-gray-600 ml-2">- {movement.notes}</span>
                            )}
                          </div>
                          <span className={`font-semibold ${movement.movement_type === 'EXIT' ? 'text-red-600' : 'text-green-600'}`}>
                            {movement.movement_type === 'EXIT' ? '-' : '+'}{formatQuantity(Math.abs(parseFloat(movement.quantity)))}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </details>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      ) : reconciliation ? (
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-sm text-gray-500">No hay datos de conciliación para el rango seleccionado</p>
        </Card>
      ) : null}
    </div>
  );

  // Configuración de tabs (sin contenido, solo metadatos)
  const tabs = useMemo(() => [
    {
      id: 'overview',
      label: 'Visión General',
      icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'sales',
      label: 'Ventas Diarias',
      icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'reconciliation',
      label: 'Conciliación',
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
    }
  ], []);

  // Renderizar contenido basado en el tab activo (no dentro de useMemo)
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'sales':
        return renderDailySalesTab();
      case 'reconciliation':
        return renderReconciliationTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Tabs Navigation */}
      <div className="w-full">
        <div className="flex justify-center w-full">
          <div className="inline-flex max-w-full bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-xs sm:text-sm transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-powergym-red text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};