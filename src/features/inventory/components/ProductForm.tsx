import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Product, ProductFormData, UnitType, Currency } from '../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Save, X, Package } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  title?: string;
}

const UNIT_TYPES: { value: UnitType; label: string }[] = [
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'units', label: 'Unidades' },
  { value: 'pcs', label: 'Piezas' },
];

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'COP', label: 'Peso Colombiano (COP)' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ProductFormData>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        capacity_value: product.capacity_value,
        unit_type: product.unit_type,
        price: product.price,
        currency: product.currency,
        photo_url: product.photo_url || '',
        min_stock: product.min_stock,
        max_stock: product.max_stock,
      });
    } else {
      reset({
        name: '',
        description: '',
        capacity_value: '',
        unit_type: 'units',
        price: '',
        currency: 'COP',
        photo_url: '',
        min_stock: '',
        max_stock: '',
      });
    }
  }, [product, reset]);

  const watchedValues = watch();

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatCurrency = (amount: string, currency: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="lg"
      title={title || (product ? 'Editar Producto' : 'Nuevo Producto')}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title || (product ? 'Editar Producto' : 'Nuevo Producto')}
              </h2>
              <p className="text-sm text-gray-600">
                {product ? 'Modifica la información del producto' : 'Agrega un nuevo producto al inventario'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            leftIcon={<X className="w-4 h-4" />}
          >
            Cerrar
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <Input
                  {...register('name', { 
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                  })}
                  placeholder="Ej: Coca Cola 500ml"
                  error={errors.name?.message}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Descripción opcional del producto"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad/Cantidad *
                </label>
                <Input
                  {...register('capacity_value', { 
                    required: 'La capacidad es obligatoria',
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
                      message: 'Debe ser un número válido'
                    }
                  })}
                  type="number"
                  step="0.01"
                  placeholder="500"
                  error={errors.capacity_value?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad de Medida *
                </label>
                <select
                  {...register('unit_type', { required: 'La unidad es obligatoria' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {UNIT_TYPES.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                {errors.unit_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit_type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Imagen
                </label>
                <Input
                  {...register('photo_url', {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Debe ser una URL válida (http:// o https://)'
                    }
                  })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  error={errors.photo_url?.message}
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Precio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <Input
                  {...register('price', { 
                    required: 'El precio es obligatorio',
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
                      message: 'Debe ser un número válido'
                    },
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                  type="number"
                  step="0.01"
                  placeholder="2550.00"
                  error={errors.price?.message}
                />
                {watchedValues.price && watchedValues.currency && (
                  <p className="mt-1 text-sm text-gray-600">
                    Precio: {formatCurrency(watchedValues.price, watchedValues.currency)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda *
                </label>
                <select
                  {...register('currency', { required: 'La moneda es obligatoria' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Stock Configuration */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Stock</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Mínimo *
                </label>
                <Input
                  {...register('min_stock', { 
                    required: 'El stock mínimo es obligatorio',
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
                      message: 'Debe ser un número válido'
                    },
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                  })}
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  error={errors.min_stock?.message}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Cantidad mínima antes de mostrar alerta de stock bajo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Máximo *
                </label>
                <Input
                  {...register('max_stock', { 
                    required: 'El stock máximo es obligatorio',
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
                      message: 'Debe ser un número válido'
                    },
                    min: { value: 1, message: 'Debe ser mayor a 0' },
                    validate: (value) => {
                      const minStock = parseFloat(watchedValues.min_stock || '0');
                      const maxStock = parseFloat(value || '0');
                      if (maxStock <= minStock) {
                        return 'El stock máximo debe ser mayor al mínimo';
                      }
                      return true;
                    }
                  })}
                  type="number"
                  step="0.01"
                  placeholder="1000.00"
                  error={errors.max_stock?.message}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Cantidad máxima recomendada en inventario
                </p>
              </div>
            </div>
          </Card>

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
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!isValid || isLoading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {product ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
