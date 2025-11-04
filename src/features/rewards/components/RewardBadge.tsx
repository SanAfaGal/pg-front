import { Gift, AlertCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Reward } from '../types';
import {
  isRewardAvailable,
  formatDiscount,
  getDaysUntilExpiration,
  isRewardExpiringSoon,
  formatDaysUntilExpiration,
} from '../utils/rewardHelpers';

interface RewardBadgeProps {
  reward?: Reward;
  attendanceCount?: number;
  subscriptionEndDate?: string;
  showExpirationWarning?: boolean;
}

/**
 * Badge component to display reward status and information
 */
export const RewardBadge: React.FC<RewardBadgeProps> = ({
  reward,
  attendanceCount,
  subscriptionEndDate,
  showExpirationWarning = true,
}) => {
  // If there's an available reward, show it
  if (reward && isRewardAvailable(reward)) {
    const daysLeft = getDaysUntilExpiration(reward.expires_at);
    const expiringSoon = isRewardExpiringSoon(reward);

    return (
      <Badge
        variant={expiringSoon ? 'warning' : 'success'}
        className="flex items-center gap-1.5"
        animated
      >
        <Gift className="w-4 h-4" />
        <span>Recompensa disponible ({formatDiscount(reward.discount_percentage)} OFF)</span>
        {showExpirationWarning && expiringSoon && (
          <span className="text-xs ml-1">
            ({formatDaysUntilExpiration(reward.expires_at)})
          </span>
        )}
      </Badge>
    );
  }

  // If there's attendance count info, show progress
  if (attendanceCount !== undefined && subscriptionEndDate) {
    const canCalculate = new Date(subscriptionEndDate) <= new Date();
    
    if (attendanceCount >= 20 && canCalculate) {
      return (
        <Badge variant="info" className="flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>Elegible para recompensa ({attendanceCount}/20 asistencias)</span>
        </Badge>
      );
    }

    if (attendanceCount < 20) {
      return (
        <Badge variant="info" className="flex items-center gap-1.5">
          <span>{attendanceCount}/20 asistencias</span>
        </Badge>
      );
    }
  }

  return null;
};

