import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionsTable } from '../features/subscriptions/components/SubscriptionsTable';
import { SubscriptionDetailModal } from '../features/subscriptions/components/SubscriptionDetailModal';
import { useAllSubscriptions } from '../features/subscriptions';
import { Subscription, SubscriptionFilters, SubscriptionStatus } from '../features/subscriptions/api/types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RefreshButton } from '../components/ui/RefreshButton';
import { CreditCard } from 'lucide-react';
import { useToast } from '../shared';
import { PageLayout } from '../components/ui/PageLayout';

export const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [filters, setFilters] = useState<SubscriptionFilters>({
    limit: 100,
    offset: 0,
  });
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: subscriptions = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAllSubscriptions(filters, true); // Enable loading on mount

  const handleFiltersChange = useCallback((newFilters: SubscriptionFilters) => {
    setFilters(newFilters);
  }, []);

  const handleViewDetails = useCallback((subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  }, []);

  const handleViewClient = useCallback((clientId: string) => {
    // Guardar el clientId en localStorage para que Clients.tsx lo lea
    localStorage.setItem('selected_client_id', clientId);
    navigate(`/dashboard#clients`);
  }, [navigate]);

  const handleRefresh = useCallback(async () => {
    await refetch();
    showToast({
      title: 'Actualizado',
      message: 'Las suscripciones se han actualizado correctamente',
      type: 'success',
    });
  }, [refetch, showToast]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  }, []);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Suscripciones
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gestiona todas las suscripciones de los clientes
            </p>
          </div>
          <RefreshButton
            onClick={handleRefresh}
            isRefetching={isRefetching}
            variant="secondary"
          />
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <div className="text-red-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900">
                  Error al cargar suscripciones
                </p>
                <p className="text-xs text-red-700 mt-1">
                  {error instanceof Error ? error.message : 'No se pudieron cargar las suscripciones'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Reintentar
              </Button>
            </div>
          </Card>
        )}

        {/* Subscriptions Table */}
        <SubscriptionsTable
          subscriptions={subscriptions}
          isLoading={isLoading}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onViewDetails={handleViewDetails}
          onViewClient={handleViewClient}
        />

        {/* Subscription Detail Modal */}
        {selectedSubscription && (
          <SubscriptionDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            subscription={selectedSubscription}
          />
        )}
      </div>
    </PageLayout>
  );
};

