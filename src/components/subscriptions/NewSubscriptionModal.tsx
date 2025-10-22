import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, CreditCard, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../shared';
import { planHelpers } from '../../features/plans';
import { type Plan, type SubscriptionFormData } from '../../features/subscriptions';

interface NewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
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
    () => plans.find(p => p.id === formData.planId),
    [plans, formData.planId]
  );

  const estimatedEndDate = useMemo(() => {
    if (!selectedPlan || !formData.startDate) return null;
    try {
      const endDate = SubscriptionService.calculateEndDate(formData.startDate, selectedPlan);
      return endDate.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  }, [selectedPlan, formData.startDate]);

  useEffect(() => {
    if (isOpen) {
      loadPlans();
      setFormData({ planId: '', startDate: today });
      setErrors({});
    }
  }, [isOpen, today]);

  const loadPlans = useCallback(async () => {
    setIsLoadingPlans(true);
    try {
      const data = await SubscriptionService.getActivePlans();
      setPlans(data);
      if (data.length === 0) {
        showToast('No hay planes activos disponibles', 'error');
      }
    } catch (error) {
      showToast('Error al cargar los planes', 'error');
      console.error('Error loading plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  }, [showToast]);

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
      };

      await SubscriptionService.createSubscription(clientId, createData);
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
  }, [formData, clientId, validateForm, onSuccess, onClose, showToast]);

  const isFormDisabled = isSubmitting || isLoadingPlans || plans.length === 0;

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
            ) : plans.length === 0 ? (
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
                  {plans.map((plan) => (
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
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Descripción:</span> {selectedPlan.description}
                    </p>
                    <div className="mt-2 flex gap-4 text-sm flex-wrap">
                      <span className="text-gray-600">
                        <span className="font-semibold">Duración:</span> {SubscriptionService.formatDuration(selectedPlan)}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-semibold">Precio:</span> {SubscriptionService.formatPrice(selectedPlan.price, selectedPlan.currency)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

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