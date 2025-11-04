import { useState, useEffect } from 'react';
import { Gift, AlertCircle } from 'lucide-react';
import { useAvailableRewards, useApplyReward } from '../hooks/useRewards';
import {
  isRewardAvailable,
  formatDiscount,
  formatExpirationDate,
  getDaysUntilExpiration,
  filterAvailableRewards,
} from '../utils/rewardHelpers';
import { Reward } from '../types';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Badge } from '../../../components/ui/Badge';

interface RewardSelectorProps {
  clientId: string;
  subscriptionId?: string;
  onSelect: (reward: Reward | null) => void;
  selectedRewardId?: string;
  className?: string;
}

/**
 * Component to select and apply available rewards
 */
export const RewardSelector: React.FC<RewardSelectorProps> = ({
  clientId,
  subscriptionId,
  onSelect,
  selectedRewardId,
  className = '',
}) => {
  const { data: availableRewards, isLoading, error } = useAvailableRewards(clientId);
  const [localSelectedId, setLocalSelectedId] = useState<string>(selectedRewardId || '');

  useEffect(() => {
    if (selectedRewardId !== localSelectedId) {
      setLocalSelectedId(selectedRewardId || '');
    }
  }, [selectedRewardId]);

  const handleChange = (rewardId: string) => {
    setLocalSelectedId(rewardId);
    const reward = availableRewards?.find((r) => r.id === rewardId);
    onSelect(reward || null);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-gray-600">Cargando recompensas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-sm text-red-800">
          Error al cargar recompensas. Por favor, intente nuevamente.
        </p>
      </div>
    );
  }

  const available = availableRewards ? filterAvailableRewards(availableRewards) : [];

  if (available.length === 0) {
    return null;
  }

  const selectedReward = available.find((r) => r.id === localSelectedId);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Gift className="w-4 h-4 text-primary-600" />
        Aplicar recompensa (opcional)
      </label>

      <select
        value={localSelectedId}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
      >
        <option value="">Sin recompensa</option>
        {available.map((reward) => {
          const daysLeft = getDaysUntilExpiration(reward.expires_at);
          const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;

          return (
            <option key={reward.id} value={reward.id}>
              {formatDiscount(reward.discount_percentage)} OFF - {reward.attendance_count} asistencias
              {isExpiringSoon && ` (Expira en ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'})`}
            </option>
          );
        })}
      </select>

      {selectedReward && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Gift className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">
                  {formatDiscount(selectedReward.discount_percentage)} de descuento
                </Badge>
                <span className="text-xs text-gray-600">
                  Por {selectedReward.attendance_count} asistencias
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Elegible: {formatExpirationDate(selectedReward.eligible_date)}
              </p>
              <p className="text-xs text-gray-600">
                Expira: {formatExpirationDate(selectedReward.expires_at)}
              </p>
              {getDaysUntilExpiration(selectedReward.expires_at) <= 3 && (
                <div className="flex items-center gap-1 text-xs text-amber-700">
                  <AlertCircle className="w-3 h-3" />
                  <span>Esta recompensa expira pronto</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

