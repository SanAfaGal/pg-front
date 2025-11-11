import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product, StockAddRequest, StockRemoveRequest } from '../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { 
  Plus, 
  Minus, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { ProductImage } from './common/ProductImage';
import { StockBadge } from './common/StockBadge';
import { formatQuantity } from '../utils/formatters';
import { useAuth } from '../../../features/auth/hooks/useAuth';

interface StockOperationFormData {
  quantity: string;
  notes?: string;
}

interface StockManagementProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (request: StockAddRequest) => void;
  onRemoveStock: (request: StockRemoveRequest) => void;
  isLoading?: boolean;
}

export const StockManagement: React.FC<StockManagementProps> = ({
  product,
  isOpen,
  onClose,
  onAddStock,
  onRemoveStock,
  isLoading = false,
}) => {
  const [operationType, setOperationType] = useState<'add' | 'remove'>('add');
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<StockOperationFormData>({
    defaultValues: {
      quantity: '',
      notes: '',
    },
    mode: 'onChange',
  });

  const watchedQuantity = watch('quantity');

  // Helper functions for stock calculations
  const parseQuantity = (value: string | undefined): number | null => {
    if (!value) return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  const getProductStockValues = () => ({
    current: parseFloat(product.available_quantity),
    min: parseFloat(product.min_stock),
    max: parseFloat(product.max_stock),
  });

  const handleFormSubmit = (data: StockOperationFormData) => {
    const baseRequest = {
      product_id: product.id,
      quantity: data.quantity,
      notes: data.notes,
      responsible: user?.username, // Include responsible for both add and remove operations
    };

    if (operationType === 'add') {
      onAddStock(baseRequest as StockAddRequest);
    } else {
      onRemoveStock(baseRequest as StockRemoveRequest);
    }
  };

  const handleClose = () => {
    reset();
    setOperationType('add');
    onClose();
  };


  const calculateNewStock = (): number | null => {
    const operationQuantity = parseQuantity(watchedQuantity);
    if (operationQuantity === null) return null;
    
    const { current } = getProductStockValues();
    const newStock = operationType === 'add' 
      ? current + operationQuantity 
      : current - operationQuantity;
    
    return Math.max(0, newStock);
  };

  const getNewStockStatus = (): 'NORMAL' | 'LOW_STOCK' | 'STOCK_OUT' | 'OVERSTOCK' | null => {
    const newStock = calculateNewStock();
    if (newStock === null) return null;
    
    const { min, max } = getProductStockValues();
    
    if (newStock === 0) return 'STOCK_OUT';
    if (newStock < min) return 'LOW_STOCK';
    if (newStock > max) return 'OVERSTOCK';
    return 'NORMAL';
  };

  const isValidOperation = (): boolean => {
    const operationQuantity = parseQuantity(watchedQuantity);
    if (operationQuantity === null || operationQuantity <= 0) return false;
    
    const { current, max } = getProductStockValues();
    
    if (operationType === 'add') {
      return (current + operationQuantity) <= max;
    } else {
      return operationQuantity <= current;
    }
  };

  const getOperationError = (): string | null => {
    const operationQuantity = parseQuantity(watchedQuantity);
    
    if (operationQuantity === null) return 'Debe ser un número válido';
    if (operationQuantity <= 0) return 'La cantidad debe ser mayor a 0';
    
    const { current, max } = getProductStockValues();
    
    if (operationType === 'add') {
      if ((current + operationQuantity) > max) {
        return `No se puede exceder el stock máximo de ${Math.floor(max)} unidades`;
      }
    } else if (operationQuantity > current) {
      return `No hay suficiente stock. Disponible: ${Math.floor(current)} unidades`;
    }
    
    return null;
  };

  // Operation type colors and styles
  const operationStyles = {
    add: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      ring: 'ring-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      text: 'text-green-700',
      textDark: 'text-green-900',
      label: 'text-green-700',
      focus: 'focus:ring-green-500 focus:border-green-500',
      button: '',
    },
    remove: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      ring: 'ring-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      text: 'text-red-700',
      textDark: 'text-red-900',
      label: 'text-red-700',
      focus: 'focus:ring-red-500 focus:border-red-500',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
  };

  const currentStyle = operationStyles[operationType];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="md"
      title="Gestionar Stock"
    >
      <div className="p-6">
        {/* Product Info */}
        <Card className="p-4 mb-6 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <ProductImage 
              url={product.photo_url} 
              name={product.name}
              size="SMALL"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">
                {formatQuantity(product.capacity_value, product.unit_type)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Stock Actual
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatQuantity(product.available_quantity, "")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Mínimo
              </p>
              <p className="text-sm text-gray-600">
                {formatQuantity(product.min_stock, "")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Máximo
              </p>
              <p className="text-sm text-gray-600">
                {formatQuantity(product.max_stock, "")}
              </p>
            </div>
          </div>
        </Card>

        {/* Operation Type Selector - Mejorado con mejor diferenciación visual */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Operación
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Botón Agregar Stock */}
            <button
              type="button"
              onClick={() => setOperationType('add')}
              disabled={!isAdmin}
              className={`
                relative flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200
                ${operationType === 'add' 
                  ? 'bg-green-50 border-green-500 shadow-md ring-2 ring-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                p-2 rounded-full transition-colors
                ${operationType === 'add' ? 'bg-green-100' : 'bg-gray-100'}
              `}>
                <Plus className={`w-6 h-6 ${operationType === 'add' ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm font-semibold ${operationType === 'add' ? 'text-green-700' : 'text-gray-600'}`}>
                Agregar Stock
              </span>
              {operationType === 'add' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
              {!isAdmin && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Solo administradores
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
                </div>
              )}
            </button>

            {/* Botón Remover Stock */}
            <button
              type="button"
              onClick={() => setOperationType('remove')}
              className={`
                relative flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${operationType === 'remove' 
                  ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                p-2 rounded-full transition-colors
                ${operationType === 'remove' ? 'bg-red-100' : 'bg-gray-100'}
              `}>
                <Minus className={`w-6 h-6 ${operationType === 'remove' ? 'text-red-600' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm font-semibold ${operationType === 'remove' ? 'text-red-700' : 'text-gray-600'}`}>
                Remover Stock
              </span>
              {operationType === 'remove' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Quantity Input - Mejorado con mejor feedback visual */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${currentStyle.label}`}>
              Cantidad {operationType === 'add' ? 'a agregar' : 'a remover'} *
            </label>
            <div className="relative">
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentStyle.iconColor}`}>
                {operationType === 'add' ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
              </div>
              <Input
                {...register('quantity', { 
                  required: 'La cantidad es obligatoria',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Debe ser un número entero'
                  },
                  min: { value: 1, message: 'Debe ser mayor a 0' }
                })}
                type="number"
                step="1"
                placeholder="Ej: 10"
                className={`pl-11 ${currentStyle.focus}`}
                error={errors.quantity?.message || getOperationError() || undefined}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3">
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <textarea
                {...register('notes')}
                placeholder={`Motivo de la ${operationType === 'add' ? 'entrada' : 'salida'} (opcional)`}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Preview - Mejorado con colores temáticos según operación */}
          {watchedQuantity && isValidOperation() && (
            <Card className={`p-4 border-2 ${currentStyle.bg} ${
              operationType === 'add' ? 'border-green-200' : 'border-red-200'
            }`}>
              <div className={`flex items-center gap-2 mb-3 ${currentStyle.textDark}`}>
                <Package className={`w-5 h-5 ${currentStyle.iconColor}`} />
                <span className="text-sm font-semibold">
                  Vista Previa - {operationType === 'add' ? 'Agregar Stock' : 'Remover Stock'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="bg-white rounded-lg p-2">
                  <span className="text-gray-600 block text-xs mb-1">Stock actual:</span>
                  <span className="text-base font-bold text-gray-900">
                    {formatQuantity(product.available_quantity, "")} unidades
                  </span>
                </div>
                <div className={`rounded-lg p-2 ${currentStyle.iconBg}`}>
                  <span className={`block text-xs mb-1 ${currentStyle.text}`}>
                    Nuevo stock:
                  </span>
                  <span className={`text-base font-bold ${currentStyle.textDark}`}>
                    {formatQuantity(calculateNewStock()?.toString() || '0', "")} unidades
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-medium ${currentStyle.text}`}>
                  {operationType === 'add' ? '+' : '-'}
                  {formatQuantity(watchedQuantity, "")}
                </span>
                <span className="text-gray-500">unidades</span>
              </div>
              {getNewStockStatus() && getNewStockStatus() !== product.stock_status && (
                <div className={`mt-3 pt-3 border-t ${
                  operationType === 'add' ? 'border-green-200' : 'border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${currentStyle.text}`}>
                      Nuevo estado:
                    </span>
                    <StockBadge status={getNewStockStatus()!} />
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Warning for critical operations */}
          {operationType === 'remove' && getNewStockStatus() === 'STOCK_OUT' && (
            <Card className="p-4 bg-red-50 border-2 border-red-300">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-semibold">¡Advertencia!</span>
              </div>
              <p className="text-sm text-red-700 mt-2">
                Esta operación dejará el producto sin stock.
              </p>
            </Card>
          )}

          {/* Error message when operation is invalid */}
          {watchedQuantity && !isValidOperation() && getOperationError() && (
            <Card className="p-4 bg-red-50 border-2 border-red-300">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-semibold">Error de validación</span>
              </div>
              <p className="text-sm text-red-700 mt-2">
                {getOperationError()}
              </p>
            </Card>
          )}

          {/* Actions - Mejorado con colores temáticos */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <div className="relative group">
              <Button
                type="submit"
                variant={operationType === 'add' ? 'primary' : 'primary'}
                isLoading={isLoading}
                leftIcon={
                  operationType === 'add' ? (
                    <Plus className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )
                }
                disabled={!isValid || isLoading || (operationType === 'add' && !isAdmin)}
                className={operationType === 'remove' ? currentStyle.button : ''}
              >
                {operationType === 'add' ? 'Agregar Stock' : 'Remover Stock'}
              </Button>
              {operationType === 'add' && !isAdmin && (
                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Solo administradores pueden agregar stock
                  <div className="absolute top-full left-4 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
