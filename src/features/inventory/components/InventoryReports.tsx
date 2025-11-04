import React, { useState } from 'react';
import { format } from 'date-fns'; // Added format import
import { es } from 'date-fns/locale';
import { 
  useInventoryStats, 
  useLowStockProducts, 
  useOutOfStockProducts, 
  useOverstockProducts,
  useDailySales, // Added useDailySales import
  useDailySalesByEmployee, // Added useDailySalesByEmployee import
  useReconciliationReport // Added useReconciliationReport import
} from '../hooks/useReports';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StockBadge } from './common/StockBadge';
import {
  BarChart3,
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  Package,
  DollarSign,
  RefreshCw, // Added RefreshCw import
  Download   // Added Download import
} from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { logger } from '../../../shared';
import {
  DailySalesByEmployee as DailySalesByEmployeeResponse,
  ReconciliationReport as ReconciliationReportResponse,
  Movement,
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

interface ProductAlertListProps {
  title: string;
  products: Array<{
    id: string;
    name: string;
    available_quantity: string;
    stock_status: string;
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
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
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
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
          {products.length}
        </span>
      </div>
      
      {products.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">
                  Stock: {product.available_quantity}
                  {product.min_stock && ` | Mín: ${product.min_stock}`}
                  {product.max_stock && ` | Máx: ${product.max_stock}`}
                </p>
              </div>
              <StockBadge status={product.stock_status as any} />
            </div>
          ))}
          {products.length > 5 && (
            <p className="text-sm text-gray-500 text-center pt-2">
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

  // Fetch data
  const { data: stats, isLoading: statsLoading, error: statsError } = useInventoryStats();
  const { data: lowStockProducts, isLoading: lowStockLoading, error: lowStockError } = useLowStockProducts();
  const { data: outOfStockProducts, isLoading: outOfStockLoading, error: outOfStockError } = useOutOfStockProducts();
  const { data: overstockProducts, isLoading: overstockLoading, error: overstockError } = useOverstockProducts();
  
  const { data: dailySales, isLoading: dailySalesLoading, error: dailySalesError } = useDailySales({
    date: selectedDate,
    ...(selectedEmployee && { responsible: selectedEmployee })
  });
  
  const { data: salesByEmployee, isLoading: salesByEmployeeLoading, error: salesByEmployeeError } = useDailySalesByEmployee({
    date: selectedDate
  });
  
  const { data: reconciliation, isLoading: reconciliationLoading, error: reconciliationError } = useReconciliationReport({
    start_date: startDate,
    end_date: endDate
  });

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(num);
  };

  const renderOverviewTab = () => (
        <div className="space-y-6">
          {/* Stats Cards */}
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          ) : statsError ? (
            <Card className="p-6 text-center text-red-600">
              Error al cargar estadísticas: {String(statsError)}
            </Card>
          ) : stats ? (
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
          ) : null}

          {/* Alert Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    <div className="space-y-6">
      {/* Date Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empleado (opcional)
            </label>
            <Input
              type="text"
              placeholder="Nombre del empleado"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Sales Summary */}
      {dailySalesLoading ? (
        <Card className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </Card>
      ) : dailySalesError ? (
        <Card className="p-6 text-red-600">
          Error: {String(dailySalesError)}
        </Card>
      ) : dailySales ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen de Ventas - {format(new Date(selectedDate), 'dd/MM/yyyy', { locale: es })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{dailySales.total_units_sold}</p>
              <p className="text-sm text-gray-600">Unidades Vendidas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{dailySales.total_transactions}</p>
              <p className="text-sm text-gray-600">Transacciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {dailySales.responsible || 'Todos'}
              </p>
              <p className="text-sm text-gray-600">Responsable</p>
            </div>
          </div>
          
          {dailySales.movements.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Movimientos Recientes</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {dailySales.movements.slice(0, 10).map((movement) => (
                  <div key={movement.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{movement.product_id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-600">{movement.notes || 'Sin notas'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{movement.quantity}</p>
                      <p className="text-xs text-gray-600">{movement.responsible}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ) : null}

      {/* Sales by Employee */}
      {salesByEmployeeLoading ? (
        <Card className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
      ) : salesByEmployeeError ? (
        <Card className="p-6 text-red-600">
          Error: {String(salesByEmployeeError)}
        </Card>
      ) : salesByEmployee ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ventas por Empleado
          </h3>
          <div className="space-y-4">
            {Object.entries(salesByEmployee.sales_by_employee).map(([employee, sales]: [string, DailySalesByEmployeeResponse['sales_by_employee'][string]]) => (
              <div key={employee} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{employee}</h4>
                  <span className="text-sm text-gray-600">{sales.total_transactions} transacciones</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Unidades:</span>
                    <span className="ml-2 font-medium">{sales.total_units}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Monto:</span>
                    <span className="ml-2 font-medium">{formatCurrency(sales.total_amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderReconciliationTab = () => (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Generar Reporte
          </Button>
          <Button
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Exportar
          </Button>
        </div>
      </Card>

      {/* Reconciliation Report */}
      {reconciliationLoading ? (
        <Card className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
      ) : reconciliationError ? (
        <Card className="p-6 text-red-600">
          Error: {String(reconciliationError)}
        </Card>
      ) : reconciliation ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reporte de Conciliación
          </h3>
   
          <div className="space-y-6">
            {Object.entries(reconciliation.reconciliation).map(([employee, data]: [string, ReconciliationReportResponse['reconciliation'][string]]) => (
              <div key={employee} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{employee}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{data.total_units_sold}</p>
                    <p className="text-sm text-gray-600">Unidades Vendidas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{data.exit_count}</p>
                    <p className="text-sm text-gray-600">Salidas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{data.entries}</p>
                    <p className="text-sm text-gray-600">Entradas</p>
                  </div>
                </div>
                
                {data.movements.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Ver movimientos ({data.movements.length})
                    </summary>
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {data.movements.map((movement: Movement) => (
                        <div key={movement.id} className="text-xs p-2 bg-gray-50 rounded flex justify-between">
                          <span>{movement.product_id.slice(0, 8)} - {movement.notes || 'Sin notas'}</span>
                          <span className={movement.movement_type === 'EXIT' ? 'text-red-600' : 'text-green-600'}>
                            {movement.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const tabs = [
    {
      id: 'overview',
      label: 'Visión General',
      content: renderOverviewTab()
    },
    {
      id: 'sales',
      label: 'Ventas Diarias',
      content: renderDailySalesTab()
    },
    {
      id: 'reconciliation',
      label: 'Conciliación',
      content: renderReconciliationTab()
    }
  ];

  logger.debug('InventoryReports - activeTab:', activeTab);
  logger.debug('InventoryReports - tabs:', tabs.map(t => ({ id: t.id, label: t.label })));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Inventario</h1>
          <p className="text-gray-600">Análisis y estadísticas del inventario</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-2 p-2 bg-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-md font-medium text-sm transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-powergym-red shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};