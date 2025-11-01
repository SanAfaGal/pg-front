import React from 'react';
import { Subscription } from '../api/types';
import { Modal } from '../../../components/ui/Modal';
import { SubscriptionDetail } from './SubscriptionDetail';
import { usePayments, usePaymentStats } from '../hooks/usePayments';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Card } from '../../../components/ui/Card';

interface SubscriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onRenew?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
  onAddPayment?: (subscription: Subscription) => void;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onRenew,
  onCancel,
  onAddPayment,
}) => {
  const { data: payments, isLoading: paymentsLoading } = usePayments(subscription.id, { limit: 50 });
  const { data: paymentStats, isLoading: statsLoading } = usePaymentStats(subscription.id);

  const isLoading = paymentsLoading || statsLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de Suscripción #${subscription.id.slice(0, 8)}`}
      size="xl"
    >
      {isLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">Cargando detalles...</p>
          </div>
        </Card>
      ) : (
        <SubscriptionDetail
          subscription={subscription}
          payments={payments || []}
          paymentStats={paymentStats}
          onRenew={onRenew}
          onCancel={onCancel}
          onAddPayment={onAddPayment}
          isLoading={false}
        />
      )}
    </Modal>
  );
};

