import React, { useMemo } from 'react';
import { type ClientDashboardResponse } from '../../features/clients';
import { SubscriptionsTab as NewSubscriptionsTab } from '../../features/subscriptions/components/SubscriptionsTab';
import { useActivePlans } from '../../features/plans';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Plan } from '../../features/subscriptions/api/types';

interface SubscriptionsTabProps {
  dashboard: ClientDashboardResponse | undefined;
  clientId: string;
  clientName: string;
}

export function SubscriptionsTab({ dashboard, clientId, clientName }: SubscriptionsTabProps) {
  // Fetch active plans using the hook
  const { data: activePlansData, isLoading: plansLoading, error: plansError } = useActivePlans();

  // Convert plans from plans module format to subscriptions module format
  const plans: Plan[] = useMemo(() => {
    if (!activePlansData) return [];
    
    return activePlansData.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration_days: plan.duration_unit === 'day' ? plan.duration_count :
                    plan.duration_unit === 'week' ? plan.duration_count * 7 :
                    plan.duration_unit === 'month' ? plan.duration_count * 30 :
                    plan.duration_unit === 'year' ? plan.duration_count * 365 : 30,
      is_active: plan.is_active,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
    }));
  }, [activePlansData]);

  if (plansLoading) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Cargando planes disponibles...</p>
        </div>
      </Card>
    );
  }

  if (plansError) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Error al cargar planes</p>
          <p className="text-gray-600 text-sm">
            {(plansError as Error)?.message || 'No se pudieron cargar los planes disponibles'}
          </p>
        </div>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <p className="text-gray-600 font-medium mb-2">No hay planes disponibles</p>
          <p className="text-gray-500 text-sm">
            No se encontraron planes activos para crear suscripciones.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <NewSubscriptionsTab
      clientId={clientId}
      clientName={clientName}
      plans={plans}
    />
  );
}
