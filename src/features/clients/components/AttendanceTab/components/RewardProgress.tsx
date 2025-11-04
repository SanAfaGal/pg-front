import { useMemo } from 'react';
import { Gift } from 'lucide-react';
import { Card } from '../../../../../components/ui/Card';
import { Badge } from '../../../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { calculateCycleAttendances, isPlanEligibleForRewards } from '../../../../rewards';
import { REWARD_RULES } from '../../../../rewards/constants/rewardConstants';

interface RewardProgressProps {
  activeSubscription: {
    id: string;
    start_date: string;
    end_date: string;
    plan_id: string;
  } | null | undefined;
  subscriptionPlan: {
    duration_unit: string;
  } | null | undefined;
  attendances: Array<{ check_in: string }>;
}

/**
 * Reward Progress Component (Read-only)
 * Displays progress toward reward eligibility for the current subscription cycle
 */
export const RewardProgress = ({ 
  activeSubscription, 
  subscriptionPlan, 
  attendances 
}: RewardProgressProps) => {
  const progress = useMemo(() => {
    if (!activeSubscription || !subscriptionPlan || !attendances || attendances.length === 0) {
      return null;
    }

    const isEligible = isPlanEligibleForRewards(subscriptionPlan.duration_unit);
    if (!isEligible) {
      return null; // Don't show progress for non-monthly plans
    }

    const cycleAttendances = calculateCycleAttendances(
      attendances,
      activeSubscription.start_date,
      activeSubscription.end_date
    );

    const threshold = REWARD_RULES.ATTENDANCE_THRESHOLD;
    const progressPercentage = Math.min((cycleAttendances / threshold) * 100, 100);
    const remaining = Math.max(0, threshold - cycleAttendances);
    const isComplete = cycleAttendances >= threshold;

    return {
      cycleAttendances,
      threshold,
      progressPercentage,
      remaining,
      isComplete,
    };
  }, [activeSubscription, subscriptionPlan, attendances]);

  if (!progress) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Progreso hacia Recompensa</p>
          <p className="text-xs text-gray-600">20% de descuento con 20+ asistencias</p>
        </div>
        <Badge 
          variant={progress.isComplete ? 'success' : 'info'} 
          size="lg"
        >
          {progress.cycleAttendances}/{progress.threshold}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <motion.div
          className={`h-2.5 rounded-full ${
            progress.isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress.progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">
          {progress.isComplete 
            ? '¡Has alcanzado el objetivo!' 
            : `Faltan ${progress.remaining} asistencias`
          }
        </span>
        <span className="text-gray-500 font-medium">
          {Math.round(progress.progressPercentage)}%
        </span>
      </div>
    </Card>
  );
};

