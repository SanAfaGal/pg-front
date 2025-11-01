import React, { useState, useCallback, useMemo } from 'react';
import { UUID } from '../../../shared/types/common';
import { Subscription, Plan } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../shared';
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
import { NOTIFICATION_MESSAGES } from '../constants/subscriptionConstants';

import { Plus, AlertCircle, Calendar, Loader2, CheckCircle2 } from 'lucide-react';

interface SubscriptionsTabProps {
  clientId: UUID;
  clientName: string;
  plans?: Plan[];
}

type ProcessingStage = 'idle' | 'creating' | 'renewing' | 'canceling' | 'processing_payment' | 'completed';

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
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [processingMessage, setProcessingMessage] = useState<string>('');
  
  const { showToast } = useToast();

  // Queries
  const { 
    data: subscriptions, 
    isLoading: subscriptionsLoading, 
    error: subscriptionsError,
    refetch: refetchSubscriptions 
  } = useSubscriptions(clientId);
  
  const { 
    data: activeSubscription,
    isLoading: activeLoading,
    refetch: refetchActiveSubscription 
  } = useActiveSubscription(clientId);
  
  // Active subscription payment data
  const { 
    data: activeSubscriptionPayments, 
    isLoading: activePaymentsLoading,
    refetch: refetchActivePayments 
  } = usePayments(
    activeSubscription?.id || ''
  );
  
  const { 
    data: activePaymentStats,
    isLoading: activeStatsLoading,
    refetch: refetchActivePaymentStats 
  } = usePaymentStats(activeSubscription?.id || '');

  // Mutations
  const createSubscriptionMutation = useCreateSubscription();
  const renewSubscriptionMutation = useRenewSubscription();
  const cancelSubscriptionMutation = useCancelSubscription();

  // Update processing stage
  const updateProcessingStage = useCallback((stage: ProcessingStage) => {
    setProcessingStage(stage);
    const messages: Record<ProcessingStage, string> = {
      idle: '',
      creating: 'Creando nueva suscripción...',
      renewing: 'Renovando suscripción...',
      canceling: 'Cancelando suscripción...',
      processing_payment: 'Procesando pago...',
      completed: 'Operación completada exitosamente',
    };
    setProcessingMessage(messages[stage]);
  }, []);

  // Memoized handlers
  const handleCreateSubscription = useCallback(() => {
    setIsPlanSelectorOpen(true);
  }, []);

  const handleConfirmPlanAndDate = useCallback(async (plan: PlanType, startDate: string) => {
    updateProcessingStage('creating');
    setIsPlanSelectorOpen(false);
    
    try {
      await createSubscriptionMutation.mutateAsync({
        clientId,
        data: {
          plan_id: plan.id,
          start_date: startDate,
        },
      });
      
      updateProcessingStage('completed');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast({ type: 'success', title: 'Éxito', message: NOTIFICATION_MESSAGES.subscription.created });
      refetchSubscriptions();
      refetchActiveSubscription();
      
      updateProcessingStage('idle');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || NOTIFICATION_MESSAGES.error.generic;
      showToast({ type: 'error', title: 'Error', message: errorMessage });
      updateProcessingStage('idle');
      console.error('Error creating subscription:', error);
    }
  }, [clientId, createSubscriptionMutation, showToast, refetchSubscriptions, refetchActiveSubscription, updateProcessingStage]);

  const handleOpenRenewModal = useCallback((subscription: Subscription) => {
    setSubscriptionToRenew(subscription);
    setIsRenewModalOpen(true);
  }, []);

  const handleConfirmRenew = useCallback(async () => {
    if (!subscriptionToRenew) return;
    
    updateProcessingStage('renewing');
    setIsRenewModalOpen(false);
    
    try {
      await renewSubscriptionMutation.mutateAsync({
        clientId,
        subscriptionId: subscriptionToRenew.id,
      });
      
      updateProcessingStage('completed');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast({ type: 'success', title: 'Éxito', message: NOTIFICATION_MESSAGES.subscription.renewed });
      setSubscriptionToRenew(null);
      
      refetchSubscriptions();
      refetchActiveSubscription();
      refetchActivePayments();
      refetchActivePaymentStats();
      
      updateProcessingStage('idle');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || NOTIFICATION_MESSAGES.error.generic;
      showToast({ type: 'error', title: 'Error', message: errorMessage });
      updateProcessingStage('idle');
      throw new Error(errorMessage);
    }
  }, [clientId, subscriptionToRenew, renewSubscriptionMutation, showToast, refetchSubscriptions, refetchActiveSubscription, refetchActivePayments, refetchActivePaymentStats, updateProcessingStage]);

  const handleOpenCancelModal = useCallback((subscription: Subscription) => {
    setSubscriptionToCancel(subscription);
    setIsCancelModalOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(async (reason?: string) => {
    if (!subscriptionToCancel) return;
    
    updateProcessingStage('canceling');
    setIsCancelModalOpen(false);
    
    try {
      await cancelSubscriptionMutation.mutateAsync({
        clientId,
        subscriptionId: subscriptionToCancel.id,
        data: { cancellation_reason: reason || undefined },
      });
      
      updateProcessingStage('completed');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast({ type: 'success', title: 'Éxito', message: NOTIFICATION_MESSAGES.subscription.canceled });
      setSubscriptionToCancel(null);
      
      refetchSubscriptions();
      refetchActiveSubscription();
      refetchActivePayments();
      refetchActivePaymentStats();
      
      updateProcessingStage('idle');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || NOTIFICATION_MESSAGES.error.generic;
      updateProcessingStage('idle');
      throw new Error(errorMessage);
    }
  }, [clientId, subscriptionToCancel, cancelSubscriptionMutation, showToast, refetchSubscriptions, refetchActiveSubscription, refetchActivePayments, refetchActivePaymentStats, updateProcessingStage]);

  const handleAddPayment = useCallback(() => {
    setIsPaymentModalOpen(true);
  }, []);

  const handlePaymentCreated = useCallback(() => {
    updateProcessingStage('processing_payment');
    
    // Small delay to show processing state
    setTimeout(() => {
      updateProcessingStage('completed');
      
      showToast({ type: 'success', title: 'Éxito', message: NOTIFICATION_MESSAGES.payment.created });
      setIsPaymentModalOpen(false);
      
      refetchActivePayments();
      refetchActivePaymentStats();
      refetchSubscriptions();
      refetchActiveSubscription();
      
      setTimeout(() => {
        updateProcessingStage('idle');
      }, 800);
    }, 300);
  }, [showToast, refetchActivePayments, refetchActivePaymentStats, refetchSubscriptions, refetchActiveSubscription, updateProcessingStage]);


  // Check if any mutation is in progress
  const isProcessing = useMemo(() => {
    return processingStage !== 'idle' || 
           createSubscriptionMutation.isPending ||
           renewSubscriptionMutation.isPending ||
           cancelSubscriptionMutation.isPending;
  }, [processingStage, createSubscriptionMutation.isPending, renewSubscriptionMutation.isPending, cancelSubscriptionMutation.isPending]);

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-gray-200">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Suscripciones</h2>
          <p className="text-sm text-gray-600">
            Gestión completa de suscripciones y pagos para{' '}
            <span className="font-semibold text-gray-900">{clientName}</span>
          </p>
        </div>
        
        <Button
          onClick={handleCreateSubscription}
          leftIcon={<Plus className="w-4 h-4" />}
          className="whitespace-nowrap shadow-md hover:shadow-lg transition-shadow"
          size="lg"
          disabled={isProcessing}
        >
          Nueva Suscripción
        </Button>
      </div>

      {/* Processing Status Banner - Always visible when processing */}
      {isProcessing && processingStage !== 'idle' && (
        <Card className="p-4 bg-blue-50 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-blue-900">{processingMessage}</p>
              <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: processingStage === 'creating' ? '33%' :
                           processingStage === 'renewing' ? '66%' :
                           processingStage === 'canceling' ? '66%' :
                           processingStage === 'processing_payment' ? '80%' :
                           processingStage === 'completed' ? '100%' : '0%'
                  }}
                />
              </div>
            </div>
            {processingStage === 'completed' && (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
          </div>
        </Card>
      )}

      {/* Error Banner */}
      {subscriptionsError && (
        <Card className="p-4 bg-red-50 border-2 border-red-300 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-900 mb-1">Error al cargar suscripciones</p>
              <p className="text-xs text-red-800 mb-2">
                {subscriptionsError.message || 'No se pudieron cargar las suscripciones. Por favor, intente de nuevo.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchSubscriptions()}
                className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-900"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Subscription Section */}
      <div className="overflow-hidden">
        {activeLoading ? (
          <Card className="p-8 border-2 border-gray-200">
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-3 font-medium text-sm">Cargando suscripción activa...</p>
            </div>
          </Card>
        ) : activeSubscription ? (
          <ActiveSubscriptionCard
            subscription={activeSubscription}
            payments={activeSubscriptionPayments || []}
            paymentStats={activePaymentStats}
            onRenew={handleOpenRenewModal}
            onCancel={handleOpenCancelModal}
            onAddPayment={() => handleAddPayment()}
            isLoadingPayments={activePaymentsLoading || activeStatsLoading}
          />
        ) : (
          <Card className="p-8 text-center border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm ring-4 ring-gray-100">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1.5">No hay suscripción activa</p>
              <p className="text-gray-600 text-xs max-w-md mb-4">
                Este cliente no tiene una suscripción activa. Crea una nueva suscripción para comenzar a gestionar pagos y membresías.
              </p>
              <Button
                onClick={handleCreateSubscription}
                leftIcon={<Plus className="w-4 h-4" />}
                size="lg"
                className="shadow-md hover:shadow-lg transition-shadow"
                disabled={isProcessing}
              >
                Crear Suscripción
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Subscription History Section */}
      <div className="overflow-hidden">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            Historial de Suscripciones
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Registro de suscripciones anteriores</p>
        </div>
        
        <SubscriptionHistoryTable
          subscriptions={subscriptions || []}
          isLoading={subscriptionsLoading}
          onViewDetails={() => {
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
        isOpen={isRenewModalOpen}
        onClose={() => {
          setIsRenewModalOpen(false);
          setSubscriptionToRenew(null);
        }}
        onConfirm={handleConfirmRenew}
        subscription={subscriptionToRenew}
        isLoading={renewSubscriptionMutation.isPending}
      />
    </div>
  );
};
