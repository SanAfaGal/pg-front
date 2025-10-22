import { UUID } from '../../shared/types/common';

// Subscription Status Enum
export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING_PAYMENT = 'pending_payment',
  CANCELED = 'canceled',
  SCHEDULED = 'scheduled',
}

// Payment Method Enum
export enum PaymentMethod {
  CASH = 'cash',
  QR = 'qr',
  TRANSFER = 'transfer',
  CARD = 'card',
}

// Subscription Types
export interface Subscription {
  id: UUID;
  client_id: UUID;
  plan_id: UUID;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status: SubscriptionStatus;
  cancellation_date?: string; // ISO date string
  cancellation_reason?: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  meta_info?: Record<string, any>;
}

export interface SubscriptionCreateInput {
  plan_id: UUID;
  start_date: string; // ISO date string
}

export interface SubscriptionRenewInput {
  plan_id?: UUID; // Optional, uses current plan if not provided
}

export interface SubscriptionCancelInput {
  cancellation_reason?: string;
}

// Payment Types
export interface Payment {
  id: UUID;
  subscription_id: UUID;
  amount: string; // Decimal as string
  payment_method: PaymentMethod;
  payment_date: string; // ISO datetime string
  meta_info?: Record<string, any>;
}

export interface PaymentCreateInput {
  amount: string; // Decimal as string
  payment_method: PaymentMethod;
}

export interface PaymentStats {
  subscription_id?: UUID;
  client_id?: UUID;
  total_payments: number;
  total_amount_paid: string; // Decimal as string
  remaining_debt: string; // Decimal as string
  last_payment_date?: string; // ISO datetime string
}

export interface PaymentWithDebtInfo {
  payment: Payment;
  remaining_debt?: string; // Decimal as string
  subscription_status: string;
}

// Plan Types (referenced but not defined in the API spec)
export interface Plan {
  id: UUID;
  name: string;
  description?: string;
  price: string; // Decimal as string
  duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Query Keys Factory
export const subscriptionKeys = {
  all: () => ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all(), 'list'] as const,
  list: (clientId: UUID) => [...subscriptionKeys.lists(), clientId] as const,
  details: () => [...subscriptionKeys.all(), 'detail'] as const,
  detail: (id: UUID) => [...subscriptionKeys.details(), id] as const,
  active: (clientId: UUID) => [...subscriptionKeys.list(clientId), 'active'] as const,
  payments: (subscriptionId: UUID) => ['payments', subscriptionId] as const,
  paymentStats: (subscriptionId: UUID) => ['paymentStats', subscriptionId] as const,
} as const;
