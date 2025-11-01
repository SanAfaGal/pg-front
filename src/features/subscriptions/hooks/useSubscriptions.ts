import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from '../../../shared/types/common';
import { subscriptionKeys } from '../api/types';
import {
  createSubscription,
  getSubscriptions,
  getActiveSubscription,
  renewSubscription,
  cancelSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from '../api/subscriptionApi';
import {
  Subscription,
  SubscriptionCreateInput,
  SubscriptionRenewInput,
  SubscriptionCancelInput,
  PaginationParams,
} from '../api/types';
import { QUERY_STALE_TIMES, QUERY_CACHE_TIMES, RETRY_CONFIG, NOTIFICATION_MESSAGES } from '../constants/subscriptionConstants';

// Hook to get all subscriptions for a client
export const useSubscriptions = (
  clientId: UUID,
  params: PaginationParams = {}
) => {
  return useQuery({
    queryKey: subscriptionKeys.list(clientId),
    queryFn: () => getSubscriptions(clientId, params),
    staleTime: QUERY_STALE_TIMES.subscriptions,
    gcTime: QUERY_CACHE_TIMES.subscriptions,
    enabled: !!clientId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to get active subscription for a client
export const useActiveSubscription = (clientId: UUID) => {
  return useQuery({
    queryKey: subscriptionKeys.active(clientId),
    queryFn: () => getActiveSubscription(clientId),
    staleTime: QUERY_STALE_TIMES.subscriptions,
    gcTime: QUERY_CACHE_TIMES.subscriptions,
    enabled: !!clientId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to get subscription by ID
export const useSubscriptionDetails = (subscriptionId: UUID) => {
  return useQuery({
    queryKey: subscriptionKeys.detail(subscriptionId),
    queryFn: () => getSubscriptionById(subscriptionId),
    staleTime: QUERY_STALE_TIMES.subscriptions,
    gcTime: QUERY_CACHE_TIMES.subscriptions,
    enabled: !!subscriptionId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to create a new subscription
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: UUID; data: SubscriptionCreateInput }) =>
      createSubscription(clientId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch subscriptions list
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(variables.clientId),
      });
      
      // CRITICAL: Invalidate active subscription (new subscription might be active)
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.active(variables.clientId),
      });

      // Add the new subscription to the cache
      queryClient.setQueryData(
        subscriptionKeys.detail(data.id),
        data
      );

      // Also add to list cache optimistically
      queryClient.setQueryData(
        subscriptionKeys.list(variables.clientId),
        (old: Subscription[] = []) => {
          // Check if already exists
          if (old.some(s => s.id === data.id)) return old;
          return [data, ...old];
        }
      );
    },
  });
};

// Hook to renew a subscription
export const useRenewSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      clientId, 
      subscriptionId, 
      data 
    }: { 
      clientId: UUID; 
      subscriptionId: UUID; 
      data?: SubscriptionRenewInput 
    }) => renewSubscription(clientId, subscriptionId, data),
    onSuccess: (data, variables) => {
      // Update the subscription in cache
      queryClient.setQueryData(
        subscriptionKeys.detail(variables.subscriptionId),
        data
      );

      // CRITICAL: Invalidate subscriptions list to refresh
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(variables.clientId),
      });

      // CRITICAL: Invalidate active subscription (renewed might be active now)
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.active(variables.clientId),
      });

      // Update in list cache optimistically
      queryClient.setQueryData(
        subscriptionKeys.list(variables.clientId),
        (old: Subscription[] = []) => {
          return old.map(s => s.id === variables.subscriptionId ? data : s);
        }
      );
    },
  });
};

// Hook to cancel a subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      clientId, 
      subscriptionId, 
      data 
    }: { 
      clientId: UUID; 
      subscriptionId: UUID; 
      data?: SubscriptionCancelInput 
    }) => cancelSubscription(clientId, subscriptionId, data),
    onSuccess: (data, variables) => {
      // Update the subscription in cache
      queryClient.setQueryData(
        subscriptionKeys.detail(variables.subscriptionId),
        data
      );

      // CRITICAL: Invalidate subscriptions list
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(variables.clientId),
      });

      // CRITICAL: Invalidate active subscription (cancelled subscription is no longer active)
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.active(variables.clientId),
      });

      // Update in list cache optimistically
      queryClient.setQueryData(
        subscriptionKeys.list(variables.clientId),
        (old: Subscription[] = []) => {
          return old.map(s => s.id === variables.subscriptionId ? data : s);
        }
      );

      // CRITICAL: Invalidate payment stats for this subscription since status changed
      queryClient.invalidateQueries({
        queryKey: ['paymentStats', variables.subscriptionId],
      });
    },
  });
};

// Hook to update a subscription
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      data,
      clientId,
    }: { 
      subscriptionId: UUID; 
      data: Partial<SubscriptionCreateInput>;
      clientId?: UUID;
    }) => updateSubscription(subscriptionId, data),
    onSuccess: (data, variables) => {
      // Update the subscription in cache
      queryClient.setQueryData(
        subscriptionKeys.detail(variables.subscriptionId),
        data
      );

      // If clientId available, invalidate client-specific queries
      if (variables.clientId) {
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.list(variables.clientId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.active(variables.clientId),
        });
      } else {
        // Fallback: Invalidate all subscription lists
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.lists(),
        });
      }
    },
  });
};

// Hook to delete a subscription
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId,
      clientId,
    }: { 
      subscriptionId: UUID;
      clientId?: UUID;
    }) => deleteSubscription(subscriptionId),
    onSuccess: (_, variables) => {
      const { subscriptionId, clientId } = variables;

      // Remove from cache
      queryClient.removeQueries({
        queryKey: subscriptionKeys.detail(subscriptionId),
      });

      // If clientId available, invalidate client-specific queries
      if (clientId) {
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.list(clientId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.active(clientId),
        });
      } else {
        // Fallback: Invalidate all subscription lists
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.lists(),
        });
      }
    },
  });
};
