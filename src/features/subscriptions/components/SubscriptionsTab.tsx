import React, { useState } from 'react';
import { UUID } from '../../../shared/types/common';
import { Subscription, Plan } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { useToast } from '../../../shared';

// Import subscription components
import {
  SubscriptionList,
  SubscriptionDetail,
  SubscriptionForm,
  PaymentForm,
  useSubscriptions,
  useActiveSubscription,
  usePayments,
  usePaymentStats,
  useCreateSubscription,
  useRenewSubscription,
  useCancelSubscription,
  useCreatePayment,
} from '../index';

import { Plus, RefreshCw, Calendar } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('list');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { showToast } = useToast();

  // Queries
  const { data: subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions(clientId);
  const { data: activeSubscription } = useActiveSubscription(clientId);
  
  // Selected subscription data
  const { data: subscriptionPayments, isLoading: paymentsLoading } = usePayments(
    selectedSubscription?.id || '',
    { limit: 50 }
  );
  const { data: paymentStats } = usePaymentStats(selectedSubscription?.id || '');

  // Mutations
  const createSubscriptionMutation = useCreateSubscription();
  const renewSubscriptionMutation = useRenewSubscription();
  const cancelSubscriptionMutation = useCancelSubscription();
  const createPaymentMutation = useCreatePayment();

  // Handlers
  const handleCreateSubscription = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubscriptionCreated = () => {
    showToast('Suscripción creada exitosamente', 'success');
  };

  const handleRenewSubscription = async (subscription: Subscription) => {
    try {
      await renewSubscriptionMutation.mutateAsync({
        clientId,
        subscriptionId: subscription.id,
      });
      showToast('Suscripción renovada exitosamente', 'success');
    } catch (error) {
      showToast('Error al renovar la suscripción', 'error');
    }
  };

  const handleCancelSubscription = async (subscription: Subscription) => {
    const reason = prompt('Ingrese la razón de cancelación (opcional):');
    try {
      await cancelSubscriptionMutation.mutateAsync({
        clientId,
        subscriptionId: subscription.id,
        data: { cancellation_reason: reason || undefined },
      });
      showToast('Suscripción cancelada exitosamente', 'success');
    } catch (error) {
      showToast('Error al cancelar la suscripción', 'error');
    }
  };

  const handleViewSubscriptionDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setActiveTab('detail');
  };

  const handleAddPayment = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentCreated = () => {
    showToast('Pago registrado exitosamente', 'success');
  };

  const handleBackToList = () => {
    setSelectedSubscription(null);
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suscripciones</h2>
          <p className="text-gray-600">Gestión de suscripciones para {clientName}</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleCreateSubscription}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nueva Suscripción
          </Button>
        </div>
      </div>

      {/* Active Subscription Summary */}
      {activeSubscription && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900">Suscripción Activa</h3>
              <p className="text-sm text-green-700">
                ID: {activeSubscription.id.slice(0, 8)} • 
                Vence: {new Date(activeSubscription.end_date).toLocaleDateString('es-CO')}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleViewSubscriptionDetails(activeSubscription)}
            >
              Ver Detalles
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="list" activeValue={activeTab} onChange={setActiveTab}>
            <Calendar className="w-4 h-4 mr-2" />
            Lista de Suscripciones
          </TabsTrigger>
          
          {selectedSubscription && (
            <TabsTrigger value="detail" activeValue={activeTab} onChange={setActiveTab}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Detalle
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" activeValue={activeTab}>
          <SubscriptionList
            subscriptions={subscriptions || []}
            onRenew={handleRenewSubscription}
            onCancel={handleCancelSubscription}
            onViewDetails={handleViewSubscriptionDetails}
            isLoading={subscriptionsLoading}
            error={subscriptionsError?.message}
          />
        </TabsContent>

        {selectedSubscription && (
          <TabsContent value="detail" activeValue={activeTab}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToList}
                >
                  ← Volver a la lista
                </Button>
              </div>
              
              <SubscriptionDetail
                subscription={selectedSubscription}
                payments={subscriptionPayments || []}
                paymentStats={paymentStats}
                onRenew={handleRenewSubscription}
                onCancel={handleCancelSubscription}
                onAddPayment={handleAddPayment}
                isLoading={paymentsLoading}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Modals */}
      <SubscriptionForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSubscriptionCreated}
        clientId={clientId}
      />

      {selectedSubscription && (
        <PaymentForm
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentCreated}
          subscription={selectedSubscription}
        />
      )}
    </div>
  );
};
