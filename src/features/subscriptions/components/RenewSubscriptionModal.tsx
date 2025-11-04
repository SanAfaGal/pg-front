import React, { useState } from 'react';
import { Subscription } from '../api/types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { formatDate } from '../utils/subscriptionHelpers';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { RewardSelector } from '../../../features/rewards/components/RewardSelector';
import { Reward } from '../../../features/rewards/types';
import { useAvailableRewards, useApplyReward } from '../../../features/rewards';

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (discountPercentage?: number) => Promise<string | undefined>;
  subscription: Subscription | null;
  clientId?: string;
  isLoading?: boolean;
}

export const RenewSubscriptionModal: React.FC<RenewSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  subscription,
  clientId,
  isLoading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  
  // Get available rewards if clientId is provided
  const { data: availableRewards } = useAvailableRewards(clientId);
  const applyRewardMutation = useApplyReward();

  const handleConfirm = async () => {
    if (!subscription) return;
    
    setError(null);
    setIsSubmitting(true);
    try {
      // Convert discount percentage to number if it's a string
      let discountPercentage: number | undefined;
      if (selectedReward) {
        const discount = typeof selectedReward.discount_percentage === 'string' 
          ? parseFloat(selectedReward.discount_percentage) 
          : selectedReward.discount_percentage;
        discountPercentage = isNaN(discount) ? undefined : discount;
      }
      
      // Call onConfirm which will return the new subscription ID
      const newSubscriptionId = await onConfirm(discountPercentage);
      
      // If reward was selected and we have the new subscription ID, apply the reward
      if (selectedReward && newSubscriptionId && discountPercentage) {
        try {
          await applyRewardMutation.mutateAsync({
            rewardId: selectedReward.id,
            data: {
              subscription_id: newSubscriptionId,
              discount_percentage: discountPercentage,
            },
          });
        } catch (rewardError) {
          // If applying reward fails, log but don't fail the whole operation
          console.error('Error applying reward:', rewardError);
        }
      }
      
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al renovar la suscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setIsSubmitting(false);
    setSelectedReward(null);
    onClose();
  };

  if (!subscription) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Renovar Suscripción"
      size="md"
    >
      <div className="space-y-6">
        {/* Info Message */}
        <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <RefreshCw className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              ¿Estás seguro de renovar esta suscripción?
            </h3>
            <p className="text-sm text-blue-800">
              La suscripción se renovará extendiendo su período de vigencia según el plan actual.
            </p>
          </div>
        </div>

        {/* Subscription Info */}
        <Card className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID de Suscripción:</span>
              <span className="font-medium text-gray-900">{subscription.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha de Fin Actual:</span>
              <span className="font-medium text-gray-900">{formatDate(subscription.end_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-gray-900 capitalize">{subscription.status}</span>
            </div>
          </div>
        </Card>

        {/* Reward Selector */}
        {clientId && availableRewards && availableRewards.length > 0 && (
          <div className="pt-2">
            <RewardSelector
              clientId={clientId}
              subscriptionId={subscription.id}
              onSelect={setSelectedReward}
              selectedRewardId={selectedReward?.id}
            />
          </div>
        )}

        {/* Warning */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Esta acción no se puede deshacer. La suscripción se renovará inmediatamente después de la confirmación.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-3 bg-red-50 border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading}
            leftIcon={isSubmitting || isLoading ? <LoadingSpinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
          >
            {isSubmitting || isLoading ? 'Renovando...' : 'Confirmar Renovación'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

