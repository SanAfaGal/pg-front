import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, CreditCard, Calendar, AlertCircle, Loader2, Gift } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../shared';
import { useActivePlans, formatPrice, formatDuration } from '../../features/plans';
import { useCreateSubscription } from '../../features/subscriptions';
import { RewardSelector } from '../../features/rewards/components/RewardSelector';
import { useAvailableRewards, useApplyReward } from '../../features/rewards';
import { 
  calculateDiscountedPrice, 
  calculateDiscountAmount,
  formatDiscount,
} from '../../features/rewards/utils/rewardHelpers';
import { Reward } from '../../features/rewards/types';
import type { Plan as PlanType } from '../../features/plans/api/types';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
}

interface SubscriptionFormData {
  planId: string;
  startDate: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  'already has an active subscription': 'El cliente ya tiene una suscripción activa',
  'Plan is not active': 'El plan seleccionado no está activo',
  'Client not found': 'Cliente no encontrado',
  'Plan not found': 'Plan no encontrado',
  '422': 'Error de validación en los datos',
};

export function NewSubscriptionModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  onSuccess,
}: NewSubscriptionModalProps) {
  const { showToast } = useToast();
  const { data: activePlans, isLoading: isLoadingPlans, error: plansError } = useActivePlans();
  const createSubscriptionMutation = useCreateSubscription();
  const applyRewardMutation = useApplyReward();
  const { data: availableRewards } = useAvailableRewards(clientId);
  
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const today = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  }, []);

  const [formData, setFormData] = useState<SubscriptionFormData>({
    planId: '',
    startDate: today,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SubscriptionFormData, string>>>({});

  const selectedPlan = useMemo(
    () => activePlans?.find(p => p.id === formData.planId),
    [activePlans, formData.planId]
  );

  // Calculate end date based on plan duration
  const estimatedEndDate = useMemo(() => {
    if (!selectedPlan || !formData.startDate) return null;
    try {
      const startDate = new Date(formData.startDate);
      let endDate: Date;
      
      switch (selectedPlan.duration_unit) {
        case 'day':
          endDate = addDays(startDate, selectedPlan.duration_count);
          break;
        case 'week':
          endDate = addDays(startDate, selectedPlan.duration_count * 7);
          break;
        case 'month':
          endDate = addDays(startDate, selectedPlan.duration_count * 30);
          break;
        case 'year':
          endDate = addDays(startDate, selectedPlan.duration_count * 365);
          break;
        default:
          return null;
      }
      
      return format(endDate, 'EEEE, d \'de\' MMMM, yyyy', { locale: es });
    } catch {
      return null;
    }
  }, [selectedPlan, formData.startDate]);

  // Calculate price with discount
  const originalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    const price = typeof selectedPlan.price === 'string' ? parseFloat(selectedPlan.price) : selectedPlan.price;
    return isNaN(price) ? 0 : price;
  }, [selectedPlan]);

  const finalPrice = useMemo(() => {
    if (!selectedReward || !selectedPlan) return originalPrice;
    return calculateDiscountedPrice(originalPrice, selectedReward.discount_percentage);
  }, [originalPrice, selectedReward, selectedPlan]);

  const discountAmount = useMemo(() => {
    if (!selectedReward || !selectedPlan) return 0;
    return calculateDiscountAmount(originalPrice, selectedReward.discount_percentage);
  }, [originalPrice, selectedReward, selectedPlan]);

  // Convert discount percentage to number for API
  const discountPercentageForAPI = useMemo(() => {
    if (!selectedReward) return undefined;
    const discount = typeof selectedReward.discount_percentage === 'string' 
      ? parseFloat(selectedReward.discount_percentage) 
      : selectedReward.discount_percentage;
    return isNaN(discount) ? undefined : discount;
  }, [selectedReward]);

  useEffect(() => {
    if (isOpen) {
      setFormData({ planId: '', startDate: today });
      setErrors({});
      setSelectedReward(null);
    }
  }, [isOpen, today]);

  const handleChange = useCallback((field: keyof SubscriptionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof SubscriptionFormData, string>> = {};

    if (!formData.planId) {
      newErrors.planId = 'Debe seleccionar un plan';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getErrorMessage = (errorMessage: string): string => {
    for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
      if (errorMessage.includes(key)) {
        return message;
      }
    }
    return 'Error al crear la suscripción';
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const createData = {
        plan_id: formData.planId,
        start_date: formData.startDate,
        ...(discountPercentageForAPI !== undefined && { discount_percentage: discountPercentageForAPI }),
      };

      // Create subscription first
      const newSubscription = await createSubscriptionMutation.mutateAsync({
        clientId,
        data: createData,
      });
      
      // If reward was selected, apply it to mark it as used
      if (selectedReward && newSubscription && discountPercentageForAPI !== undefined) {
        try {
          // Validate discount percentage before sending
          if (typeof discountPercentageForAPI !== 'number' || isNaN(discountPercentageForAPI)) {
            console.error('Invalid discount percentage:', discountPercentageForAPI);
            throw new Error('Porcentaje de descuento inválido');
          }

          // Validate reward ID
          if (!selectedReward.id || typeof selectedReward.id !== 'string') {
            console.error('Invalid reward ID:', selectedReward.id);
            throw new Error('ID de recompensa inválido');
          }

          // Validate subscription ID
          if (!newSubscription.id || typeof newSubscription.id !== 'string') {
            console.error('Invalid subscription ID:', newSubscription.id);
            throw new Error('ID de suscripción inválido');
          }

          console.log('Applying reward:', {
            rewardId: selectedReward.id,
            subscriptionId: newSubscription.id,
            discountPercentage: discountPercentageForAPI,
          });

          const appliedReward = await applyRewardMutation.mutateAsync({
            rewardId: selectedReward.id,
            data: {
              subscription_id: newSubscription.id,
              discount_percentage: discountPercentageForAPI,
            },
          });

          console.log('Reward applied successfully:', appliedReward);
        } catch (rewardError) {
          // If applying reward fails, log but don't fail the whole operation
          // The discount was already applied in the subscription creation
          const errorMessage = rewardError instanceof Error ? rewardError.message : 'Error desconocido';
          console.error('Error applying reward:', {
            error: rewardError,
            message: errorMessage,
            rewardId: selectedReward.id,
            subscriptionId: newSubscription.id,
            discountPercentage: discountPercentageForAPI,
          });
          // Show a warning toast to inform the user
          showToast('La suscripción se creó pero hubo un problema al marcar la recompensa como aplicada', 'warning');
        }
      }
      
      showToast('Suscripción creada exitosamente', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      const message = getErrorMessage(errorMessage);
      
      if (errorMessage.includes('Client not found') || errorMessage.includes('Plan not found')) {
        onClose();
      }
      
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedReward, discountPercentageForAPI, clientId, validateForm, onSuccess, onClose, showToast, createSubscriptionMutation, applyRewardMutation]);

  const isFormDisabled = isSubmitting || isLoadingPlans || !activePlans || activePlans.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-powergym-charcoal flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-powergym-red" />
              Nueva Suscripción
            </h2>
            <p className="text-gray-600 mt-1">
              Crear suscripción para: <span className="font-semibold">{clientName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Selection */}
          <div>
            <label htmlFor="planId" className="block text-sm font-semibold text-powergym-charcoal mb-2">
              Plan de Suscripción
            </label>

            {isLoadingPlans ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-powergym-red" />
                <span className="ml-2 text-gray-600">Cargando planes...</span>
              </div>
            ) : plansError ? (
              <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-600">Error al cargar los planes</p>
              </div>
            ) : !activePlans || activePlans.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hay planes activos disponibles</p>
              </div>
            ) : (
              <>
                <select
                  id="planId"
                  value={formData.planId}
                  onChange={(e) => handleChange('planId', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.planId ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-powergym-red focus:border-transparent transition-all`}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccione un plan</option>
                  {activePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>

                {errors.planId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.planId}
                  </p>
                )}

                {selectedPlan && (
                  <div className="mt-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Descripción:</span> {selectedPlan.description || 'Sin descripción'}
                    </p>
                    <div className="mt-2 flex gap-4 text-sm flex-wrap">
                      <span className="text-gray-600">
                        <span className="font-semibold">Duración:</span>{' '}
                        {formatDuration(selectedPlan.duration_count, selectedPlan.duration_unit)}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-semibold">Precio:</span>{' '}
                        {formatPrice(selectedPlan.price)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Reward Selector */}
          {availableRewards && availableRewards.length > 0 && (
            <RewardSelector
              clientId={clientId}
              onSelect={setSelectedReward}
              selectedRewardId={selectedReward?.id}
            />
          )}

          {/* Price Display with Discount */}
          {selectedPlan && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Precio:</span>
                {selectedReward ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(originalPrice.toString())}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(finalPrice.toString())}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {formatDiscount(selectedReward.discount_percentage)} OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(originalPrice.toString())}
                  </span>
                )}
              </div>
              {selectedReward && discountAmount > 0 && (
                <p className="text-xs text-green-700 mt-1">
                  Ahorro: {formatPrice(discountAmount.toString())}
                </p>
              )}
            </div>
          )}

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-powergym-charcoal mb-2">
              Fecha de Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                max={today}
                error={errors.startDate}
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.startDate}
              </p>
            )}
          </div>

          {/* Estimated End Date */}
          {estimatedEndDate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span>
                  <span className="font-semibold">Fecha estimada de expiración:</span> {estimatedEndDate}
                </span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <Button
              type="submit"
              variant="primary"
              disabled={isFormDisabled}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Crear Suscripción
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
