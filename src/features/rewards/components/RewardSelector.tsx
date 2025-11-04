import { useState, useEffect, useMemo } from 'react';
import { Gift, AlertCircle, Clock } from 'lucide-react';
import { useAvailableRewards } from '../hooks/useRewards';
import {
  formatDiscount,
  formatExpirationDate,
  getDaysUntilExpiration,
  filterAvailableRewards,
  isRewardExpiringSoon,
  sortRewardsByPriority,
  formatDaysUntilExpiration,
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
  }, [selectedRewardId, localSelectedId]);

  const handleChange = (rewardId: string) => {
    setLocalSelectedId(rewardId);
    const reward = availableRewards?.find((r) => r.id === rewardId);
    onSelect(reward || null);
  };

  // Calculate derived values before conditional returns
  const available = useMemo(() => {
    return availableRewards ? filterAvailableRewards(availableRewards) : [];
  }, [availableRewards]);
  
  // Sort rewards by priority: expiring soon first
  const sortedRewards = useMemo(() => {
    return sortRewardsByPriority(available);
  }, [available]);

  const selectedReward = useMemo(() => {
    return available.find((r) => r.id === localSelectedId);
  }, [available, localSelectedId]);

  const expiringSoonRewards = useMemo(() => {
    return available.filter(reward => isRewardExpiringSoon(reward));
  }, [available]);

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

  if (available.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Gift className="w-4 h-4 text-primary-600" />
        Aplicar recompensa (opcional)
      </label>

      {/* Warning for expiring rewards */}
      {expiringSoonRewards.length > 0 && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {expiringSoonRewards.length === 1 
                ? '1 recompensa por expirar'
                : `${expiringSoonRewards.length} recompensas por expirar`
              }
            </span>
          </div>
        </div>
      )}

      <select
        value={localSelectedId}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
      >
        <option value="">Sin recompensa</option>
        {sortedRewards.map((reward) => {
          const daysLeft = getDaysUntilExpiration(reward.expires_at);
          const expiringSoon = isRewardExpiringSoon(reward);

          return (
            <option key={reward.id} value={reward.id}>
              {formatDiscount(reward.discount_percentage)} OFF - {reward.attendance_count} asistencias
              {expiringSoon && ` ⚠️ ${formatDaysUntilExpiration(reward.expires_at)}`}
            </option>
          );
        })}
      </select>

      {selectedReward && (
        <div className={`p-3 rounded-lg border ${
          isRewardExpiringSoon(selectedReward) 
            ? 'bg-amber-50 border-amber-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-start gap-2">
            <Gift className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isRewardExpiringSoon(selectedReward) ? 'text-amber-600' : 'text-green-600'
            }`} />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={isRewardExpiringSoon(selectedReward) ? 'warning' : 'success'} size="sm">
                  {formatDiscount(selectedReward.discount_percentage)} de descuento
                </Badge>
                <span className="text-xs text-gray-600">
                  Por {selectedReward.attendance_count} asistencias
                </span>
              </div>
              <div className="space-y-0.5 text-xs text-gray-600">
                <p>
                  <span className="font-medium">Elegible:</span> {formatExpirationDate(selectedReward.eligible_date)}
                </p>
                <p>
                  <span className="font-medium">Expira:</span> {formatExpirationDate(selectedReward.expires_at)}
                </p>
              </div>
              {isRewardExpiringSoon(selectedReward) && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formatDaysUntilExpiration(selectedReward.expires_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

