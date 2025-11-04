import { useMemo } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvailableRewards, filterAvailableRewards } from '../../../features/rewards';

interface FloatingRewardButtonProps {
  clientId: string;
  onOpenRenew?: () => void;
}

/**
 * Floating Reward Button Component
 * Displays a floating button when there are available rewards
 * Prompts user to apply rewards when renewing subscriptions
 */
export const FloatingRewardButton: React.FC<FloatingRewardButtonProps> = ({
  clientId,
  onOpenRenew,
}) => {
  const { data: availableRewards, isLoading } = useAvailableRewards(clientId);
  
  const availableRewardsCount = useMemo(() => {
    if (!availableRewards) return 0;
    return filterAvailableRewards(availableRewards).length;
  }, [availableRewards]);

  if (isLoading || availableRewardsCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          <Button
            onClick={onOpenRenew}
            size="lg"
            className="shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-5 py-3 rounded-full flex items-center gap-3"
            leftIcon={<Gift className="w-5 h-5" />}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">Recompensa Disponible</span>
              <span className="text-xs opacity-90">
                {availableRewardsCount === 1 
                  ? '1 pendiente' 
                  : `${availableRewardsCount} pendientes`
                }
              </span>
            </div>
            {availableRewardsCount > 0 && (
              <Badge 
                variant="success" 
                size="sm" 
                className="ml-1 bg-white text-purple-600 font-bold"
              >
                {availableRewardsCount}
              </Badge>
            )}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

