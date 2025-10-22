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

// Hook to get all subscriptions for a client
export const useSubscriptions = (
  clientId: UUID,
  params: PaginationParams = {}
) => {
  return useQuery({
    queryKey: subscriptionKeys.list(clientId),
    queryFn: () => getSubscriptions(clientId, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!clientId,
  });
};

// Hook to get active subscription for a client
export const useActiveSubscription = (clientId: UUID) => {
  return useQuery({
    queryKey: subscriptionKeys.active(clientId),
    queryFn: () => getActiveSubscription(clientId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!clientId,
  });
};

// Hook to get subscription by ID
export const useSubscriptionDetails = (subscriptionId: UUID) => {
  return useQuery({
    queryKey: subscriptionKeys.detail(subscriptionId),
    queryFn: () => getSubscriptionById(subscriptionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!subscriptionId,
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
      
      // Invalidate active subscription
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.active(variables.clientId),
      });

      // Add the new subscription to the cache
      queryClient.setQueryData(
        subscriptionKeys.detail(data.id),
        data
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
      // Invalidate subscriptions list
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(variables.clientId),
      });

      // Invalidate active subscription
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.active(variables.clientId),
      });

      // Update the subscription in cache
      queryClient.setQueryData(
        subscriptionKeys.detail(variables.subscriptionId),
        data
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
      // Invalidate subscriptions list
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(variables.clientId),
      });

      // Invalidate active subscription
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.active(variables.clientId),
      });

      // Update the subscription in cache
      queryClient.setQueryData(
        subscriptionKeys.detail(variables.subscriptionId),
        data
      );
    },
  });
};

// Hook to update a subscription
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      data 
    }: { 
      subscriptionId: UUID; 
      data: Partial<SubscriptionCreateInput> 
    }) => updateSubscription(subscriptionId, data),
    onSuccess: (data, variables) => {
      // Update the subscription in cache
      queryClient.setQueryData(
        subscriptionKeys.detail(variables.subscriptionId),
        data
      );

      // Invalidate all subscription lists to ensure consistency
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.lists(),
      });
    },
  });
};

// Hook to delete a subscription
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: UUID) => deleteSubscription(subscriptionId),
    onSuccess: (_, subscriptionId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: subscriptionKeys.detail(subscriptionId),
      });

      // Invalidate all subscription lists
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.lists(),
      });
    },
  });
};
