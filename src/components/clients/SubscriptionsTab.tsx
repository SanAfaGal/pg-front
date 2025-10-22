import { useState } from 'react';
import { CreditCard, Calendar, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { type ClientDashboardResponse } from '../../features/clients';
import { NewSubscriptionModal } from '../subscriptions/NewSubscriptionModal';
import { useQueryClient } from '@tanstack/react-query';

interface SubscriptionsTabProps {
  dashboard: ClientDashboardResponse | undefined;
  clientId: string;
  clientName: string;
}

export function SubscriptionsTab({ dashboard, clientId, clientName }: SubscriptionsTabProps) {
  const [isNewSubscriptionModalOpen, setIsNewSubscriptionModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleSubscriptionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['client', clientId] });
    queryClient.invalidateQueries({ queryKey: ['client-dashboard', clientId] });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-powergym-charcoal flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-powergym-red" />
            Suscripción Actual
          </h3>
          <Button
            onClick={() => setIsNewSubscriptionModalOpen(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Suscripción
          </Button>
        </div>

        {dashboard?.subscription ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge
                    variant={
                      dashboard.subscription.status === 'active' ? 'success' :
                      dashboard.subscription.status === 'expired' ? 'error' : 'warning'
                    }
                    className="mb-3 capitalize text-base px-4 py-1"
                  >
                    {dashboard.subscription.status === 'active' ? 'Activa' :
                     dashboard.subscription.status === 'expired' ? 'Expirada' : 'Pendiente Pago'}
                  </Badge>
                  <h4 className="text-2xl font-bold text-powergym-charcoal mb-1">
                    {dashboard.subscription.plan}
                  </h4>
                  <p className="text-gray-600">Plan de suscripción</p>
                </div>
                <TrendingUp className={`w-10 h-10 ${
                  dashboard.subscription.status === 'active' ? 'text-green-500' :
                  dashboard.subscription.status === 'expired' ? 'text-red-500' : 'text-amber-500'
                }`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500">Fecha de vencimiento</p>
                  </div>
                  <p className="text-lg font-semibold text-powergym-charcoal">
                    {new Date(dashboard.subscription.end_date).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500">Días restantes</p>
                  </div>
                  <p className="text-lg font-semibold text-powergym-charcoal">
                    {Math.max(0, Math.ceil((new Date(dashboard.subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} días
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-powergym-charcoal mb-3">Detalles de la suscripción</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total de suscripciones:</span>
                  <span className="font-semibold text-powergym-charcoal">{dashboard.stats.subscriptions}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Cliente desde:</span>
                  <span className="font-semibold text-powergym-charcoal">
                    {new Date(dashboard.stats.since).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">No hay suscripción activa</p>
            <p className="text-gray-500">Este cliente no tiene ninguna suscripción asignada</p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-powergym-charcoal mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-powergym-red" />
          Historial de Suscripciones
        </h3>

        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">El historial de suscripciones estará disponible próximamente</p>
        </div>
      </Card>

      <NewSubscriptionModal
        isOpen={isNewSubscriptionModalOpen}
        onClose={() => setIsNewSubscriptionModalOpen(false)}
        clientId={clientId}
        clientName={clientName}
        onSuccess={handleSubscriptionSuccess}
      />
    </div>
  );
}
