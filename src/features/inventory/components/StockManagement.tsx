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
  User,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { StockStatusBadge } from './ProductList';
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

  const handleFormSubmit = (data: StockOperationFormData) => {
    const request = {
      product_id: product.id,
      quantity: data.quantity,
      notes: data.notes,
      ...(operationType === 'remove' && { responsible: user?.username }),
    };

    if (operationType === 'add') {
      onAddStock(request as StockAddRequest);
    } else {
      onRemoveStock(request as StockRemoveRequest);
    }
  };

  const handleClose = () => {
    reset();
    setOperationType('add');
    onClose();
  };

  const formatQuantity = (quantity: string, unit: string) => {
    return `${parseFloat(quantity)} ${unit}`;
  };

  const calculateNewStock = () => {
    if (!watchedQuantity) return null;
    
    const currentStock = parseFloat(product.available_quantity);
    const operationQuantity = parseFloat(watchedQuantity);
    
    if (isNaN(operationQuantity)) return null;
    
    const newStock = operationType === 'add' 
      ? currentStock + operationQuantity 
      : currentStock - operationQuantity;
    
    return Math.max(0, newStock);
  };

  const getNewStockStatus = () => {
    const newStock = calculateNewStock();
    if (newStock === null) return null;
    
    const minStock = parseFloat(product.min_stock);
    const maxStock = parseFloat(product.max_stock);
    
    if (newStock === 0) return 'STOCK_OUT';
    if (newStock < minStock) return 'LOW_STOCK';
    if (newStock > maxStock) return 'OVERSTOCK';
    return 'NORMAL';
  };

  const isValidOperation = () => {
    if (!watchedQuantity) return false;
    
    const operationQuantity = parseFloat(watchedQuantity);
    if (isNaN(operationQuantity) || operationQuantity <= 0) return false;
    
    const currentStock = parseFloat(product.available_quantity);
    const maxStock = parseFloat(product.max_stock);
    
    if (operationType === 'add') {
      return (currentStock + operationQuantity) <= maxStock;
    } else {
      return operationQuantity <= currentStock;
    }
  };

  const getOperationError = () => {
    if (!watchedQuantity) return null;
    
    const operationQuantity = parseFloat(watchedQuantity);
    if (isNaN(operationQuantity)) return 'Debe ser un número válido';
    if (operationQuantity <= 0) return 'La cantidad debe ser mayor a 0';
    
    const currentStock = parseFloat(product.available_quantity);
    const maxStock = parseFloat(product.max_stock);
    
    if (operationType === 'add') {
      if ((currentStock + operationQuantity) > maxStock) {
        return `No se puede exceder el stock máximo de ${maxStock} ${product.unit_type}`;
      }
    } else if (operationQuantity > currentStock) {
      return `No hay suficiente stock. Disponible: ${formatQuantity(currentStock.toString(), product.unit_type)}`;
    }
    
    return null;
  };

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
            {product.photo_url ? (
              <img 
                src={product.photo_url} 
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">
                {formatQuantity(product.capacity_value, product.unit_type)}
              </p>
            </div>
            <StockStatusBadge status={product.stock_status} />
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

        {/* Operation Type Selector */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1 group">
            <Button
              type="button"
              variant={operationType === 'add' ? 'primary' : 'secondary'}
              onClick={() => setOperationType('add')}
              leftIcon={<Plus className="w-4 h-4" />}
              className="w-full"
              disabled={!isAdmin}
            >
              Agregar Stock
            </Button>
            {!isAdmin && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Solo administradores pueden agregar stock
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant={operationType === 'remove' ? 'primary' : 'secondary'}
            onClick={() => setOperationType('remove')}
            leftIcon={<Minus className="w-4 h-4" />}
            className="flex-1"
          >
            Remover Stock
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad {operationType === 'add' ? 'a agregar' : 'a remover'} *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {operationType === 'add' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
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
                className="pl-10"
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

          {/* Preview */}
          {watchedQuantity && isValidOperation() && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Vista Previa</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stock actual:</span>
                  <span className="ml-2 font-medium">
                    {product.available_quantity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Nuevo stock:</span>
                  <span className="ml-2 font-medium">
                    {calculateNewStock()?.toString() || '0'}
                  </span>
                </div>
              </div>
              {getNewStockStatus() && getNewStockStatus() !== product.stock_status && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Nuevo estado:</span>
                    <StockStatusBadge status={getNewStockStatus()!} />
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Warning for critical operations */}
          {operationType === 'remove' && getNewStockStatus() === 'STOCK_OUT' && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">¡Advertencia!</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Esta operación dejará el producto sin stock.
              </p>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
                variant="primary"
                isLoading={isLoading}
                leftIcon={operationType === 'add' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                disabled={!isValid || isLoading || (operationType === 'add' && !isAdmin)}
              >
                {operationType === 'add' ? 'Agregar Stock' : 'Remover Stock'}
              </Button>
              {operationType === 'add' && !isAdmin && (
                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
