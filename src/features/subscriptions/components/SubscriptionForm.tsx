import React, { useState } from 'react';
import { Plan } from '../../plans/api/types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useCreateSubscription } from '../hooks/useSubscriptions';
import { PlanAndDateSelector } from '../../plans/components/PlanAndDateSelector';
import { Calendar } from 'lucide-react';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientId: string;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  clientId,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const createSubscriptionMutation = useCreateSubscription();

  const handleClose = () => {
    setIsSelectorOpen(false);
    onClose();
  };

  const handleConfirmPlanAndDate = async (plan: Plan, startDate: string) => {
    console.log('Plan and date confirmed:', { plan, startDate });
    
    try {
      await createSubscriptionMutation.mutateAsync({
        clientId,
        data: {
          plan_id: plan.id,
          start_date: startDate,
        },
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleOpenSelector = () => {
    setIsSelectorOpen(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva Suscripción"
    >
      <div className="p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Crear Nueva Suscripción
            </h2>
            <p className="text-gray-600">
              Selecciona un plan y fecha de inicio para crear la suscripción
            </p>
          </div>

          <Button
            onClick={handleOpenSelector}
            size="lg"
            className="inline-flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Seleccionar Plan y Fecha
          </Button>
        </div>

        {/* Error Display */}
        {createSubscriptionMutation.error && (
          <Card className="p-4 bg-red-50 border-red-200 mt-6">
            <p className="text-red-800 text-sm">
              Error: {(createSubscriptionMutation.error as any)?.detail || 'Error al crear la suscripción'}
            </p>
          </Card>
        )}
      </div>

      {/* Unified Plan and Date Selector */}
      <PlanAndDateSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onConfirm={handleConfirmPlanAndDate}
      />
    </Modal>
  );
};
