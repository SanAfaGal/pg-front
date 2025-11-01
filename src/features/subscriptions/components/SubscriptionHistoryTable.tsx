import React, { memo, useMemo, useState } from 'react';
import { Subscription } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { SubscriptionStatusBadge } from './SubscriptionList';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import { formatDate, sortSubscriptionsByStatus } from '../utils/subscriptionHelpers';
import { Eye, Calendar, Clock } from 'lucide-react';

interface SubscriptionHistoryTableProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onViewDetails?: (subscription: Subscription) => void;
  className?: string;
}

export const SubscriptionHistoryTable: React.FC<SubscriptionHistoryTableProps> = memo(({
  subscriptions,
  isLoading = false,
  onViewDetails,
  className = '',
}) => {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter out active subscription and sort
  const historySubscriptions = useMemo(() => {
    return sortSubscriptionsByStatus(
      subscriptions.filter(sub => sub.status !== 'active')
    );
  }, [subscriptions]);

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
    onViewDetails?.(subscription);
  };

  if (isLoading) {
    return (
      <Card className={`p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Cargando historial de suscripciones...</p>
        </div>
      </Card>
    );
  }

  if (historySubscriptions.length === 0) {
    return (
      <Card className={`p-12 text-center ${className}`}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-900 mb-2">No hay historial de suscripciones</p>
          <p className="text-gray-600 text-sm max-w-md">
            Este cliente solo tiene la suscripción activa. El historial aparecerá aquí cuando haya más suscripciones.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={`p-6 shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            Historial de Suscripciones
          </h3>
          <Badge variant="secondary" className="font-medium">
            {historySubscriptions.length} {historySubscriptions.length === 1 ? 'suscripción' : 'suscripciones'}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha Inicio</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha Fin</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duración</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historySubscriptions.map((subscription) => {
                const startDate = new Date(subscription.start_date);
                const endDate = new Date(subscription.end_date);
                const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <tr 
                    key={subscription.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="text-sm font-mono text-gray-900">
                        {subscription.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <SubscriptionStatusBadge status={subscription.status} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{formatDate(subscription.start_date)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{formatDate(subscription.end_date)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{duration} día{duration !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(subscription)}
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
        />
      )}
    </>
  );
});

SubscriptionHistoryTable.displayName = 'SubscriptionHistoryTable';

