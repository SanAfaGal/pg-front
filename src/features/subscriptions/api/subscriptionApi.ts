import { UUID, PaginationParams } from '../../../shared/types/common';
import { apiClient, API_ENDPOINTS, logger } from '../../../shared';
import {
  Subscription,
  SubscriptionCreateInput,
  SubscriptionRenewInput,
  SubscriptionCancelInput,
} from './types';

// Subscription API functions

/**
 * Create a new subscription for a client
 */
export const createSubscription = async (
  clientId: UUID,
  data: SubscriptionCreateInput
): Promise<Subscription> => {
  logger.debug('Creating subscription for client:', clientId, 'with data:', data);
  return apiClient.post<Subscription>(API_ENDPOINTS.subscriptions.list(clientId), data);
};

/**
 * Get all subscriptions for a client
 */
export const getSubscriptions = async (
  clientId: UUID,
  params: PaginationParams = {}
): Promise<Subscription[]> => {
  const { limit = 100, offset = 0 } = params;
  
  return apiClient.get<Subscription[]>(API_ENDPOINTS.subscriptions.list(clientId), {
    params: { limit, offset }
  });
};

/**
 * Get active subscription for a client
 */
export const getActiveSubscription = async (
  clientId: UUID
): Promise<Subscription> => {
  return apiClient.get<Subscription>(API_ENDPOINTS.clients.activeSubscription(clientId));
};

/**
 * Renew a subscription
 */
export const renewSubscription = async (
  clientId: UUID,
  subscriptionId: UUID,
  data: SubscriptionRenewInput = {}
): Promise<Subscription> => {
  return apiClient.post<Subscription>(API_ENDPOINTS.subscriptions.renew(clientId, subscriptionId), data);
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (
  clientId: UUID,
  subscriptionId: UUID,
  data: SubscriptionCancelInput = {}
): Promise<Subscription> => {
  return apiClient.patch<Subscription>(API_ENDPOINTS.subscriptions.cancel(clientId, subscriptionId), data);
};

/**
 * Get subscription by ID (if needed for direct access)
 */
export const getSubscriptionById = async (
  subscriptionId: UUID
): Promise<Subscription> => {
  return apiClient.get<Subscription>(API_ENDPOINTS.subscriptions.detail(subscriptionId));
};

/**
 * Update subscription (if needed for direct updates)
 */
export const updateSubscription = async (
  subscriptionId: UUID,
  data: Partial<SubscriptionCreateInput>
): Promise<Subscription> => {
  return apiClient.put<Subscription>(API_ENDPOINTS.subscriptions.detail(subscriptionId), data);
};

/**
 * Delete subscription (if needed for hard delete)
 */
export const deleteSubscription = async (
  subscriptionId: UUID
): Promise<void> => {
  return apiClient.delete(API_ENDPOINTS.subscriptions.detail(subscriptionId));
};
