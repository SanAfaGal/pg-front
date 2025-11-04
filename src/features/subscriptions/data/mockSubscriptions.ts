import { Subscription, Payment, PaymentStats, SubscriptionStatus, PaymentMethod } from '../api/types';
import { UUID } from '../../../shared/types/common';

// Mock data for development
export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    client_id: 'client-1',
    plan_id: 'plan-basic',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    status: SubscriptionStatus.ACTIVE,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sub-2',
    client_id: 'client-1',
    plan_id: 'plan-premium',
    start_date: '2023-12-01',
    end_date: '2023-12-31',
    status: SubscriptionStatus.EXPIRED,
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2023-12-31T00:00:00Z',
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    subscription_id: 'sub-1',
    amount: '50000',
    payment_method: PaymentMethod.CASH,
    payment_date: '2024-01-01T10:00:00Z',
    meta_info: {},
  },
  {
    id: 'pay-2',
    subscription_id: 'sub-1',
    amount: '25000',
    payment_method: PaymentMethod.TRANSFER,
    payment_date: '2024-01-15T14:30:00Z',
    meta_info: {},
  },
];

export const MOCK_PAYMENT_STATS: PaymentStats = {
  subscription_id: 'sub-1',
  client_id: 'client-1',
  total_payments: 2,
  total_amount_paid: '75000',
  remaining_debt: '0',
  last_payment_date: '2024-01-15T14:30:00Z',
};

// Mock API functions
export const mockApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const mockGetSubscriptions = async (clientId: UUID): Promise<Subscription[]> => {
  await mockApiDelay();
  return MOCK_SUBSCRIPTIONS.filter(sub => sub.client_id === clientId);
};

export const mockGetActiveSubscription = async (clientId: UUID): Promise<Subscription | null> => {
  await mockApiDelay();
  const activeSub = MOCK_SUBSCRIPTIONS.find(
    sub => sub.client_id === clientId && sub.status === SubscriptionStatus.ACTIVE
  );
  return activeSub || null;
};

export const mockGetPayments = async (subscriptionId: UUID): Promise<Payment[]> => {
  await mockApiDelay();
  return MOCK_PAYMENTS.filter(pay => pay.subscription_id === subscriptionId);
};

export const mockGetPaymentStats = async (subscriptionId: UUID): Promise<PaymentStats> => {
  await mockApiDelay();
  return MOCK_PAYMENT_STATS;
};

export const mockCreateSubscription = async (clientId: UUID, data: any): Promise<Subscription> => {
  await mockApiDelay();
  const newSubscription: Subscription = {
    id: `sub-${Date.now()}`,
    client_id: clientId,
    plan_id: data.plan_id,
    start_date: data.start_date,
    end_date: new Date(new Date(data.start_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: SubscriptionStatus.ACTIVE,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  MOCK_SUBSCRIPTIONS.push(newSubscription);
  return newSubscription;
};

export const mockCreatePayment = async (subscriptionId: UUID, data: any): Promise<any> => {
  await mockApiDelay();
  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    subscription_id: subscriptionId,
    amount: data.amount,
    payment_method: data.payment_method,
    payment_date: new Date().toISOString(),
    meta_info: {},
  };
  
  MOCK_PAYMENTS.push(newPayment);
  
  return {
    payment: newPayment,
    remaining_debt: '0',
    subscription_status: 'active',
  };
};


