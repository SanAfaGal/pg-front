import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plan, DurationType } from '../api/types';
import { PlanCreateInput } from '../api/planApi';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { FileText, AlertCircle } from 'lucide-react';
import { DURATION_TYPES, CURRENCIES, VALIDATION_RULES } from '../constants/planConstants';

interface PlanFormProps {
  plan?: Plan;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlanCreateInput) => void;
  isLoading?: boolean;
  title?: string;
}

interface PlanFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  currency: string;
  duration_unit: DurationType;
  duration_count: string;
  is_active: boolean;
}

// Helper to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const PlanForm: React.FC<PlanFormProps> = ({
  plan,
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
    setValue,
  } = useForm<PlanFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: '',
      currency: 'COP',
      duration_unit: 'month',
      duration_count: '1',
      is_active: true,
    },
  });

  const watchedName = watch('name');
  const watchedSlug = watch('slug');

  // Auto-generate slug from name if slug is empty
  useEffect(() => {
    if (watchedName && !watchedSlug && !plan) {
      const generatedSlug = generateSlug(watchedName);
      setValue('slug', generatedSlug, { shouldValidate: false });
    }
  }, [watchedName, watchedSlug, plan, setValue]);

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        slug: plan.slug || '',
        description: plan.description || '',
        price: plan.price,
        currency: plan.currency,
        duration_unit: plan.duration_unit,
        duration_count: plan.duration_count.toString(),
        is_active: plan.is_active,
      });
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
        price: '',
        currency: 'COP',
        duration_unit: 'month',
        duration_count: '1',
        is_active: true,
      });
    }
  }, [plan, reset]);

  const handleFormSubmit = (data: PlanFormData) => {
    const submitData: PlanFormData = {
      ...data,
      slug: data.slug || generateSlug(data.name),
    };
    
    onSubmit({
      name: submitData.name,
      slug: submitData.slug || undefined,
      description: submitData.description || undefined,
      price: parseFloat(submitData.price),
      currency: submitData.currency,
      duration_unit: submitData.duration_unit,
      duration_count: parseInt(submitData.duration_count, 10),
      is_active: submitData.is_active,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title={title || (plan ? 'Editar Plan' : 'Nuevo Plan')}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title || (plan ? 'Editar Plan' : 'Nuevo Plan')}
              </h2>
              <p className="text-sm text-gray-600">
                {plan
                  ? 'Modifica la información del plan'
                  : 'Agrega un nuevo plan de suscripción'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  {...register('name', {
                    required: VALIDATION_RULES.plan.name.message.required,
                    minLength: {
                      value: VALIDATION_RULES.plan.name.minLength,
                      message: VALIDATION_RULES.plan.name.message.minLength,
                    },
                    maxLength: {
                      value: VALIDATION_RULES.plan.name.maxLength,
                      message: VALIDATION_RULES.plan.name.message.maxLength,
                    },
                  })}
                  label="Nombre del Plan *"
                  placeholder="Ej: Plan Básico Mensual"
                  error={errors.name?.message}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  {...register('slug', {
                    maxLength: {
                      value: VALIDATION_RULES.plan.slug.maxLength,
                      message: VALIDATION_RULES.plan.slug.message.maxLength,
                    },
                  })}
                  label="Slug (opcional)"
                  placeholder="Se genera automáticamente desde el nombre"
                  helperText="Identificador único para URLs. Se genera automáticamente si se deja vacío."
                  error={errors.slug?.message}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register('description', {
                    maxLength: {
                      value: VALIDATION_RULES.plan.description.maxLength,
                      message:
                        VALIDATION_RULES.plan.description.message.maxLength,
                    },
                  })}
                  placeholder="Descripción opcional del plan"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Pricing and Duration */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Precio y Duración
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  {...register('price', {
                    required: VALIDATION_RULES.plan.price.message.required,
                    min: {
                      value: VALIDATION_RULES.plan.price.min,
                      message: VALIDATION_RULES.plan.price.message.min,
                    },
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'El precio debe tener máximo 2 decimales',
                    },
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  label="Precio *"
                  placeholder="50000"
                  error={errors.price?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda *
                </label>
                <select
                  {...register('currency', {
                    required: VALIDATION_RULES.plan.currency.message.required,
                    validate: (value) =>
                      value.length === 3 ||
                      VALIDATION_RULES.plan.currency.message.length,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad de Duración *
                </label>
                <select
                  {...register('duration_unit', {
                    required:
                      VALIDATION_RULES.plan.duration_unit.message.required,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {DURATION_TYPES.map((duration) => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
                {errors.duration_unit && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.duration_unit.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...register('duration_count', {
                    required:
                      VALIDATION_RULES.plan.duration_count.message.required,
                    min: {
                      value: VALIDATION_RULES.plan.duration_count.min,
                      message: VALIDATION_RULES.plan.duration_count.message.min,
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: 'Debe ser un número entero',
                    },
                  })}
                  type="number"
                  min="1"
                  label="Cantidad de Duración *"
                  placeholder="1"
                  error={errors.duration_count?.message}
                />
              </div>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado</h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Plan activo
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Los planes inactivos no estarán disponibles para nuevas
              suscripciones
            </p>
          </Card>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Por favor corrige los siguientes errores:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  {errors.name && <li>{errors.name.message}</li>}
                  {errors.price && <li>{errors.price.message}</li>}
                  {errors.currency && <li>{errors.currency.message}</li>}
                  {errors.duration_unit && (
                    <li>{errors.duration_unit.message}</li>
                  )}
                  {errors.duration_count && (
                    <li>{errors.duration_count.message}</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading
                ? 'Guardando...'
                : plan
                  ? 'Actualizar Plan'
                  : 'Crear Plan'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};



