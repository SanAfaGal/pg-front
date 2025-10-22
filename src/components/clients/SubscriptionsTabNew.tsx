import React from 'react';
import { type ClientDashboardResponse } from '../../features/clients';
import { SubscriptionsTab as NewSubscriptionsTab } from '../../features/subscriptions/components/SubscriptionsTab';
import { MOCK_PLANS } from '../../data/mockPlans';

interface SubscriptionsTabProps {
  dashboard: ClientDashboardResponse | undefined;
  clientId: string;
  clientName: string;
}

export function SubscriptionsTab({ dashboard, clientId, clientName }: SubscriptionsTabProps) {
  // Convert dashboard data to the format expected by the new subscriptions module
  const activePlans = MOCK_PLANS.filter(plan => plan.is_active);

  return (
    <NewSubscriptionsTab
      clientId={clientId}
      clientName={clientName}
      plans={activePlans}
    />
  );
}
