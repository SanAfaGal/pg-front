import React, { memo, useMemo, useState, useCallback } from 'react';
import { Subscription } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { SubscriptionStatusBadge } from './SubscriptionList';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import { formatDate, sortSubscriptionsByStatus, isSubscriptionExpired, getLastExpiredSubscription } from '../utils/subscriptionHelpers';
import { useMediaQuery } from '../../../shared';
import { Eye, Calendar, RefreshCw, History } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionHistoryTableProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onViewDetails?: (subscription: Subscription) => void;
  onRenew?: (subscription: Subscription) => void;
  className?: string;
}

/**
 * Compact Subscription Row Component (Desktop)
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
            <span className="text-sm text-gray-600">{subscription.id.slice(0, 8)}</span>
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

/**
 * Subscription History Card Component (Mobile)
 * Card-based layout optimized for mobile screens
 */
const SubscriptionHistoryCard: React.FC<{
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
      className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      {/* Header with Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">ID:</span>
            <span className="text-sm font-semibold text-gray-900">{subscription.id.slice(0, 8)}</span>
          </div>
        </div>
        <SubscriptionStatusBadge status={subscription.status} />
      </div>

      {/* Date Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-gray-500">Inicio: </span>
            <span className="text-sm font-medium text-gray-900">{formatDate(subscription.start_date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-gray-500">Fin: </span>
            <span className="text-sm font-medium text-gray-900">{formatDate(subscription.end_date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xs text-gray-500">Duración: </span>
          <span className="text-sm font-medium text-gray-900">{duration} día{duration !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
        {isLastExpired && isExpired && onRenew && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRenew(subscription)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="w-full font-medium"
          >
            Renovar
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(subscription)}
          leftIcon={<Eye className="w-4 h-4" />}
          className="w-full"
        >
          Ver Detalles
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
  const { isMobile } = useMediaQuery();

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
      <Card className={`p-4 sm:p-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Historial de Suscripciones
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {historySubscriptions.length} {historySubscriptions.length === 1 ? 'suscripción registrada' : 'suscripciones registradas'}
            </p>
          </div>
        </div>

        {/* Subscription List */}
        <div className={isMobile ? 'space-y-3' : 'space-y-1'}>
          {historySubscriptions.map((subscription, index) => {
            const startDate = new Date(subscription.start_date);
            const endDate = new Date(subscription.end_date);
            const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const isLastExpired = lastExpiredSubscription?.id === subscription.id;
            
            return isMobile ? (
              <SubscriptionHistoryCard
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
            ) : (
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
