import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Subscription, SubscriptionCreateInput } from '../api/types';
import { Plan } from '../../plans/api/types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useCreateSubscription } from '../hooks/useSubscriptions';
import { formatCurrency } from '../utils/paymentHelpers';
import { formatPrice, formatDuration } from '../../plans/utils/planHelpers';
import { PlanSelector } from '../../plans/components/PlanSelector';
import { Calendar, DollarSign, Clock } from 'lucide-react';

// Validation schema
const subscriptionFormSchema = z.object({
  plan_id: z.string().min(1, 'Debe seleccionar un plan'),
  start_date: z.string().min(1, 'Debe seleccionar una fecha de inicio'),
});

type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientId: string;
  className?: string;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  clientId,
  className = '',
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const createSubscriptionMutation = useCreateSubscription();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      plan_id: '',
      start_date: new Date().toISOString().split('T')[0], // Today's date
    },
  });

  const watchedPlanId = watch('plan_id');

  // Update selected plan when plan_id changes
  React.useEffect(() => {
    if (watchedPlanId && selectedPlan && selectedPlan.id !== watchedPlanId) {
      setSelectedPlan(null);
    }
  }, [watchedPlanId, selectedPlan]);

  const onSubmit = async (data: SubscriptionFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Selected plan:', selectedPlan);
    
    try {
      await createSubscriptionMutation.mutateAsync({
        clientId,
        data: {
          plan_id: data.plan_id,
          start_date: data.start_date,
        },
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedPlan(null);
    setIsSelectorOpen(false);
    onClose();
  };

  const handleSelectPlan = (plan: Plan) => {
    console.log('Plan selected:', plan);
    setSelectedPlan(plan);
    setIsSelectorOpen(false);
    // Update the form field using setValue
    setValue('plan_id', plan.id);
    console.log('Form plan_id set to:', plan.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nueva Suscripción"
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden field for plan_id */}
        <input type="hidden" {...register('plan_id')} />
        
        {/* Plan Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan *
          </label>
          
          {selectedPlan ? (
            <div className="p-3 border border-green-300 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">{selectedPlan.name}</p>
              <p className="text-sm text-green-700">
                {formatPrice(selectedPlan.price)} -{' '}
                {formatDuration(selectedPlan.duration_count, selectedPlan.duration_unit)}
              </p>
              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Cambiar Plan
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg
                         text-gray-600 hover:border-blue-500 hover:text-blue-600
                         transition-colors"
            >
              + Seleccionar Plan
            </button>
          )}
          
          {errors.plan_id && (
            <p className="mt-1 text-sm text-red-600">{errors.plan_id.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio
          </label>
          <Input
            type="date"
            {...register('start_date')}
            className={errors.start_date ? 'border-red-500' : ''}
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
          )}
        </div>

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Resumen del Plan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Plan:</span>
                <span className="font-medium text-blue-900">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Precio:</span>
                <span className="font-medium text-blue-900">
                  {formatPrice(selectedPlan.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Duración:</span>
                <span className="font-medium text-blue-900">
                  {formatDuration(selectedPlan.duration_count, selectedPlan.duration_unit)}
                </span>
              </div>
              {selectedPlan.description && (
                <div className="pt-2 border-t border-blue-200">
                  <span className="text-blue-700">Descripción:</span>
                  <p className="text-blue-900 mt-1">{selectedPlan.description}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Error Display */}
        {createSubscriptionMutation.error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-red-800 text-sm">
              Error: {(createSubscriptionMutation.error as any)?.detail || 'Error al crear la suscripción'}
            </p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedPlan}
            leftIcon={isSubmitting ? <LoadingSpinner size="sm" /> : undefined}
          >
            {isSubmitting ? 'Creando...' : 'Crear Suscripción'}
          </Button>
        </div>
      </form>

      {/* Plan Selector Modal */}
      <PlanSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleSelectPlan}
        selectedPlanId={selectedPlan?.id}
      />
    </Modal>
  );
};
