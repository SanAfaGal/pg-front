import React, { useState, useCallback, useMemo } from 'react';
import { UUID } from '../../../shared/types/common';
import { Subscription, Plan } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast, logger } from '../../../shared';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ActiveSubscriptionCard } from './ActiveSubscriptionCard';
import { SubscriptionHistoryTable } from './SubscriptionHistoryTable';

// Import subscription components
import {
  PaymentForm,
  useSubscriptions,
  useActiveSubscription,
  usePayments,
  usePaymentStats,
  useCreateSubscription,
  useRenewSubscription,
  useCancelSubscription,
} from '../index';

// Import plan selector
import { PlanAndDateSelector } from '../../plans/components/PlanAndDateSelector';
import { Plan as PlanType } from '../../plans/api/types';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { RenewSubscriptionModal } from './RenewSubscriptionModal';
import { FloatingRewardButton } from './FloatingRewardButton';
import { NOTIFICATION_MESSAGES } from '../constants/subscriptionConstants';
import { useApplyReward, useAvailableRewards } from '../../../features/rewards';
import { getScheduledRenewal } from '../utils/subscriptionFilters';

import { Plus, AlertCircle } from 'lucide-react';

interface SubscriptionsTabProps {
  clientId: UUID;
  clientName: string;
  plans: Plan[];
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  clientId,
  clientName,
  plans,
}) => {
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState<Subscription | null>(null);
  const [subscriptionToRenew, setSubscriptionToRenew] = useState<Subscription | null>(null);
  
  const { showToast } = useToast();

  // Queries
  const { 
    data: subscriptions, 
    isLoading: subscriptionsLoading, 
    error: subscriptionsError,
  } = useSubscriptions(clientId);
  
  const { 
    data: activeSubscription,
    isLoading: activeLoading,
  } = useActiveSubscription(clientId);
  
  // Active subscription payment data (only fetch if active subscription exists)
  const { 
    data: activeSubscriptionPayments, 
    isLoading: activePaymentsLoading,
  } = usePayments(
    activeSubscription?.id || '',
    { limit: 50 }
  );
  
  const { 
    data: activePaymentStats,
    isLoading: activeStatsLoading,
  } = usePaymentStats(activeSubscription?.id || '');
  
  // Get scheduled renewal subscription
  const scheduledSubscription = useMemo(() => {
    if (!subscriptions || !activeSubscription) return null;
    return getScheduledRenewal(subscriptions, activeSubscription);
  }, [subscriptions, activeSubscription]);

  // Mutations
  const createSubscriptionMutation = useCreateSubscription();
  const renewSubscriptionMutation = useRenewSubscription();
  const cancelSubscriptionMutation = useCancelSubscription();
  const applyRewardMutation = useApplyReward();
  
  // Get available rewards to find the selected one when renewing
  const { data: availableRewards } = useAvailableRewards(clientId);

  // Memoized handlers
  const handleCreateSubscription = useCallback(() => {
    setIsPlanSelectorOpen(true);
  }, []);

  const handleConfirmPlanAndDate = useCallback(async (plan: PlanType, startDate: string) => {
    try {
      await createSubscriptionMutation.mutateAsync({
        clientId,
        data: {
          plan_id: plan.id,
          start_date: startDate,
        },
      });
      showToast({ title: 'Suscripción', message: NOTIFICATION_MESSAGES.subscription.created, type: 'success' });
      setIsPlanSelectorOpen(false);
      // React Query will automatically invalidate and refetch due to mutation callbacks
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail || 
                            (error as { message?: string })?.message || 
                            NOTIFICATION_MESSAGES.error.generic;
      showToast({ title: 'Error', message: errorMessage, type: 'error' });
      logger.error('Error creating subscription:', error);
    }
  }, [clientId, createSubscriptionMutation, showToast]);

  const handleOpenRenewModal = useCallback((subscription: Subscription) => {
    setSubscriptionToRenew(subscription);
    setIsRenewModalOpen(true);
  }, []);

  const handleConfirmRenew = useCallback(async (discountPercentage?: number): Promise<string | undefined> => {
    if (!subscriptionToRenew) return;
    
    try {
      const renewedSubscription = await renewSubscriptionMutation.mutateAsync({
        clientId,
        subscriptionId: subscriptionToRenew.id,
        data: discountPercentage ? { discount_percentage: discountPercentage } : undefined,
      });
      
      showToast({ title: 'Suscripción', message: NOTIFICATION_MESSAGES.subscription.renewed, type: 'success' });
      setIsRenewModalOpen(false);
      setSubscriptionToRenew(null);
      // React Query will automatically invalidate and refetch due to mutation callbacks
      
      // Return the new subscription ID so the modal can apply the reward
      return renewedSubscription.id;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail || 
                            (error as { message?: string })?.message || 
                            NOTIFICATION_MESSAGES.error.generic;
      throw new Error(errorMessage);
    }
  }, [clientId, subscriptionToRenew, renewSubscriptionMutation, showToast]);

  const handleOpenCancelModal = useCallback((subscription: Subscription) => {
    setSubscriptionToCancel(subscription);
    setIsCancelModalOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(async (reason?: string) => {
    if (!subscriptionToCancel) return;
    
    try {
      await cancelSubscriptionMutation.mutateAsync({
        clientId,
        subscriptionId: subscriptionToCancel.id,
        data: { cancellation_reason: reason || undefined },
      });
      showToast({ title: 'Suscripción', message: NOTIFICATION_MESSAGES.subscription.canceled, type: 'success' });
      setIsCancelModalOpen(false);
      setSubscriptionToCancel(null);
      // React Query will automatically invalidate and refetch due to mutation callbacks
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail || 
                            (error as { message?: string })?.message || 
                            NOTIFICATION_MESSAGES.error.generic;
      throw new Error(errorMessage);
    }
  }, [clientId, subscriptionToCancel, cancelSubscriptionMutation, showToast]);

  const handleAddPayment = useCallback((subscription: Subscription) => {
    setIsPaymentModalOpen(true);
  }, []);

  const handlePaymentCreated = useCallback(() => {
    showToast({ title: 'Pago', message: NOTIFICATION_MESSAGES.payment.created, type: 'success' });
    setIsPaymentModalOpen(false);
    // React Query will automatically refetch due to invalidations in payment mutations
  }, [showToast]);

  // Memoized subscription count
  const subscriptionCount = useMemo(() => subscriptions?.length || 0, [subscriptions]);

  // Get the first expired subscription that can be renewed for floating button
  const expiredSubscriptionToRenew = useMemo(() => {
    if (!subscriptions) return null;
    const expired = subscriptions
      .filter(sub => sub.status === 'expired' || (sub.status !== 'active' && new Date(sub.end_date) < new Date()))
      .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
    return expired.length > 0 ? expired[0] : null;
  }, [subscriptions]);

  const handleFloatingRewardClick = useCallback(() => {
    // Solo permitir renovar suscripciones vencidas, no la activa
    if (expiredSubscriptionToRenew) {
      handleOpenRenewModal(expiredSubscriptionToRenew);
    }
  }, [expiredSubscriptionToRenew, handleOpenRenewModal]);

  return (
    <div className="space-y-6 sm:space-y-8 relative">

      {/* Error Banner */}
      {subscriptionsError && (
        <Card className="p-4 sm:p-5 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-red-900 mb-1">Error al cargar suscripciones</p>
              <p className="text-xs sm:text-sm text-red-800 mb-3">
                {subscriptionsError.message || 'No se pudieron cargar las suscripciones. Por favor, intente de nuevo.'}
              </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-900 w-full sm:w-auto"
            >
              Reintentar
            </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Subscription Section */}
      <div>
        
        {activeLoading ? (
          <Card className="p-8 sm:p-12 border-2 border-gray-200">
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" />
              <p className="text-sm sm:text-base text-gray-600 mt-4 font-medium">Cargando suscripción activa...</p>
            </div>
          </Card>
        ) : activeSubscription ? (
          <ActiveSubscriptionCard
            subscription={activeSubscription}
            payments={activeSubscriptionPayments || []}
            paymentStats={activePaymentStats}
            scheduledSubscription={scheduledSubscription}
            onRenew={handleOpenRenewModal}
            onCancel={handleOpenCancelModal}
            onAddPayment={handleAddPayment}
            isLoadingPayments={activePaymentsLoading || activeStatsLoading}
          />
        ) : (
          <Card className="p-6 sm:p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-sm ring-4 ring-gray-100">
                <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No hay suscripción activa</p>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mb-4 sm:mb-6">
                Este cliente no tiene una suscripción activa. Crea una nueva suscripción para comenzar a gestionar pagos y membresías.
              </p>
              <Button
                onClick={handleCreateSubscription}
                leftIcon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                size="lg"
                className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
              >
                Crear Suscripción
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Subscription History Section */}
      <div>
        <SubscriptionHistoryTable
          subscriptions={subscriptions || []}
          isLoading={subscriptionsLoading}
          onRenew={handleOpenRenewModal}
          onViewDetails={(subscription) => {
            // Handle view details if needed
          }}
        />
      </div>

      {/* Modals */}
      <PlanAndDateSelector
        isOpen={isPlanSelectorOpen}
        onClose={() => setIsPlanSelectorOpen(false)}
        onConfirm={handleConfirmPlanAndDate}
      />

      {activeSubscription && (
        <PaymentForm
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentCreated}
          subscription={activeSubscription}
          clientId={clientId}
          remainingDebt={activePaymentStats?.remaining_debt ? parseFloat(activePaymentStats.remaining_debt) : undefined}
          paymentStats={activePaymentStats}
        />
      )}

      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSubscriptionToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        subscription={subscriptionToCancel}
        isLoading={cancelSubscriptionMutation.isPending}
      />

      <RenewSubscriptionModal
        clientId={clientId}
        isOpen={isRenewModalOpen}
        onClose={() => {
          setIsRenewModalOpen(false);
          setSubscriptionToRenew(null);
        }}
        onConfirm={handleConfirmRenew}
        subscription={subscriptionToRenew}
        isLoading={renewSubscriptionMutation.isPending}
      />

      {/* Floating Reward Button */}
      <FloatingRewardButton
        clientId={clientId}
        onOpenRenew={handleFloatingRewardClick}
      />
    </div>
  );
};
