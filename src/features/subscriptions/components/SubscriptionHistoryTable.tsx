import React, { memo, useMemo, useState, useCallback } from 'react';
import { Subscription } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { SubscriptionStatusBadge } from './SubscriptionList';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import { formatDate, sortSubscriptionsByStatus, isSubscriptionExpired, getLastExpiredSubscription } from '../utils/subscriptionHelpers';
import { Eye, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionHistoryTableProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onViewDetails?: (subscription: Subscription) => void;
  onRenew?: (subscription: Subscription) => void;
  className?: string;
}

/**
 * Compact Subscription Row Component
 * Modern, minimal design with essential information
 */
const SubscriptionRow: React.FC<{
  subscription: Subscription;
  startDate: Date;
  endDate: Date;
  duration: number;
  onViewDetails: (subscription: Subscription) => void;
  onRenew?: (subscription: Subscription) => void;
  isLastExpired: boolean;
  index: number;
}> = ({ subscription, startDate, endDate, duration, onViewDetails, onRenew, isLastExpired, index }) => {
  const isExpired = isSubscriptionExpired(subscription);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Status Badge */}
        <div className="flex-shrink-0">
          <SubscriptionStatusBadge status={subscription.status} />
        </div>

        {/* Subscription Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-mono text-gray-600">{subscription.id.slice(0, 8)}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-700">{formatDate(subscription.start_date)}</span>
            <span className="text-xs text-gray-400">→</span>
            <span className="text-sm text-gray-700">{formatDate(subscription.end_date)}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-600">{duration} día{duration !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isLastExpired && isExpired && onRenew && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRenew(subscription)}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="font-medium"
          >
            Renovar
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(subscription)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Ver
        </Button>
      </div>
    </motion.div>
  );
};

export const SubscriptionHistoryTable: React.FC<SubscriptionHistoryTableProps> = memo(({
  subscriptions,
  isLoading = false,
  onViewDetails,
  onRenew,
  className = '',
}) => {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter out active subscription and get last expired
  const { historySubscriptions, lastExpiredSubscription } = useMemo(() => {
    const filtered = subscriptions.filter(sub => sub.status !== 'active');
    const lastExpired = getLastExpiredSubscription(subscriptions);
    return {
      historySubscriptions: filtered,
      lastExpiredSubscription: lastExpired,
    };
  }, [subscriptions]);

  const handleViewDetails = useCallback((subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
    onViewDetails?.(subscription);
  }, [onViewDetails]);

  if (isLoading) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <p className="text-sm text-gray-500 mt-3">Cargando historial...</p>
        </div>
      </Card>
    );
  }

  if (historySubscriptions.length === 0) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="flex flex-col items-center py-8">
          <p className="text-sm text-gray-500">No hay historial de suscripciones</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={`p-4 ${className}`}>
        <div className="space-y-1">
          {historySubscriptions.map((subscription, index) => {
            const startDate = new Date(subscription.start_date);
            const endDate = new Date(subscription.end_date);
            const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const isLastExpired = lastExpiredSubscription?.id === subscription.id;
            
            return (
              <SubscriptionRow
                key={subscription.id}
                subscription={subscription}
                startDate={startDate}
                endDate={endDate}
                duration={duration}
                onViewDetails={handleViewDetails}
                onRenew={onRenew}
                isLastExpired={isLastExpired}
                index={index}
              />
            );
          })}
        </div>
      </Card>

      {selectedSubscription && (
        <SubscriptionDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSubscription(null);
          }}
          subscription={selectedSubscription}
          onRenew={onRenew}
        />
      )}
    </>
  );
});

SubscriptionHistoryTable.displayName = 'SubscriptionHistoryTable';
