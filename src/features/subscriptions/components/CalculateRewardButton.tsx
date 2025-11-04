import { useCallback, useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useCalculateRewardEligibility } from '../../../features/rewards';
import { useToast } from '../../../shared';
import { NOTIFICATION_MESSAGES, REWARD_RULES } from '../../../features/rewards/constants/rewardConstants';
import { RewardEligibilityResponse } from '../../../features/rewards/types';

interface CalculateRewardButtonProps {
  subscriptionId: string;
  onSuccess?: () => void;
  onCalculationResult?: (result: RewardEligibilityResponse) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Calculate Reward Button Component
 * Reusable button to calculate reward eligibility for a subscription
 * Provides clear feedback on calculation results
 */
export const CalculateRewardButton: React.FC<CalculateRewardButtonProps> = ({
  subscriptionId,
  onSuccess,
  onCalculationResult,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const { showToast } = useToast();
  const calculateEligibilityMutation = useCalculateRewardEligibility();

  const handleCalculate = useCallback(async () => {
    if (!subscriptionId) return;

    try {
      const result = await calculateEligibilityMutation.mutateAsync(subscriptionId);
      
      // Notify parent component of result
      onCalculationResult?.(result);
      
      if (result.eligible) {
        showToast({
          title: '¡Recompensa Obtenida!',
          message: `Has ganado un ${REWARD_RULES.DISCOUNT_PERCENTAGE}% de descuento. La recompensa está disponible para aplicar.`,
          type: 'success',
        });
        onSuccess?.();
      } else {
        // Not eligible - show informative message
        const remaining = REWARD_RULES.ATTENDANCE_THRESHOLD - result.attendance_count;
        const message = remaining > 0
          ? `El cliente tiene ${result.attendance_count} ${result.attendance_count === 1 ? 'asistencia' : 'asistencias'} en este ciclo. Se requieren ${REWARD_RULES.ATTENDANCE_THRESHOLD} para obtener la recompensa. Faltan ${remaining} ${remaining === 1 ? 'asistencia' : 'asistencias'}.`
          : `El cliente tiene ${result.attendance_count} ${result.attendance_count === 1 ? 'asistencia' : 'asistencias'} en este ciclo. Se requieren ${REWARD_RULES.ATTENDANCE_THRESHOLD} para obtener la recompensa.`;
        
        showToast({
          title: 'No Elegible para Recompensa',
          message,
          type: 'info',
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || NOTIFICATION_MESSAGES.error.calculate;
      showToast({
        title: 'Error al Calcular',
        message: errorMessage,
        type: 'error',
      });
    }
  }, [subscriptionId, calculateEligibilityMutation, showToast, onSuccess, onCalculationResult]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCalculate}
      disabled={calculateEligibilityMutation.isPending}
      leftIcon={
        calculateEligibilityMutation.isPending ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )
      }
      className={className}
    >
      {calculateEligibilityMutation.isPending ? 'Calculando...' : 'Calcular Recompensa'}
    </Button>
  );
};
