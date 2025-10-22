import { UUID, PaginationParams } from '../../../shared/types/common';
import { apiClient } from '../../../shared/api/apiClient';
import {
  Payment,
  PaymentCreateInput,
  PaymentStats,
  PaymentWithDebtInfo,
} from './types';

// Payment API functions

/**
 * Create a payment for a subscription
 */
export const createPayment = async (
  subscriptionId: UUID,
  data: PaymentCreateInput
): Promise<PaymentWithDebtInfo> => {
  return apiClient.post(`/subscriptions/${subscriptionId}/payments`, data);
};

/**
 * Get all payments for a subscription
 */
export const getPayments = async (
  subscriptionId: UUID,
  params: PaginationParams = {}
): Promise<Payment[]> => {
  const { limit = 100, offset = 0 } = params;
  
  return apiClient.get(`/subscriptions/${subscriptionId}/payments`, {
    params: { limit, offset },
  });
};

/**
 * Get payment statistics for a subscription
 */
export const getPaymentStats = async (
  subscriptionId: UUID
): Promise<PaymentStats> => {
  return apiClient.get(`/subscriptions/${subscriptionId}/payments/stats`);
};

/**
 * Get payment by ID (if needed for direct access)
 */
export const getPaymentById = async (
  paymentId: UUID
): Promise<Payment> => {
  return apiClient.get(`/payments/${paymentId}`);
};

/**
 * Update payment (if needed for corrections)
 */
export const updatePayment = async (
  paymentId: UUID,
  data: Partial<PaymentCreateInput>
): Promise<Payment> => {
  return apiClient.patch(`/payments/${paymentId}`, data);
};

/**
 * Delete payment (if needed for refunds/cancellations)
 */
export const deletePayment = async (
  paymentId: UUID
): Promise<void> => {
  return apiClient.delete(`/payments/${paymentId}`);
};

/**
 * Get payment history for a client (if endpoint exists)
 */
export const getClientPaymentHistory = async (
  clientId: UUID,
  params: PaginationParams = {}
): Promise<Payment[]> => {
  const { limit = 100, offset = 0 } = params;
  
  return apiClient.get(`/clients/${clientId}/payments`, {
    params: { limit, offset },
  });
};

/**
 * Get payment statistics for a client (if endpoint exists)
 */
export const getClientPaymentStats = async (
  clientId: UUID
): Promise<PaymentStats> => {
  return apiClient.get(`/clients/${clientId}/payments/stats`);
};
