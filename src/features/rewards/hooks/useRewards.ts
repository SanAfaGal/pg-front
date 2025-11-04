import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from '../../../shared/types/common';
import { rewardsApi } from '../api/rewardsApi';
import {
  Reward,
  RewardEligibilityResponse,
  RewardApplyInput,
  rewardKeys,
} from '../types';
import {
  QUERY_STALE_TIMES,
  QUERY_CACHE_TIMES,
  RETRY_CONFIG,
} from '../constants/rewardConstants';

/**
 * Hook to calculate eligibility for a subscription
 */
export const useRewardEligibility = (
  subscriptionId: string | undefined,
  enabled = true
) => {
  return useQuery({
    queryKey: rewardKeys.eligibility(subscriptionId || ''),
    queryFn: () => rewardsApi.calculateEligibility(subscriptionId!),
    enabled: enabled && !!subscriptionId,
    staleTime: QUERY_STALE_TIMES.eligibility,
    gcTime: QUERY_CACHE_TIMES.eligibility,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get available rewards for a client
 */
export const useAvailableRewards = (clientId: UUID | undefined) => {
  return useQuery({
    queryKey: rewardKeys.available(clientId || ''),
    queryFn: () => rewardsApi.getAvailableRewards(clientId!),
    enabled: !!clientId,
    staleTime: QUERY_STALE_TIMES.rewards,
    gcTime: QUERY_CACHE_TIMES.rewards,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get all rewards for a subscription
 */
export const useRewardsBySubscription = (subscriptionId: string | undefined) => {
  return useQuery({
    queryKey: rewardKeys.bySubscription(subscriptionId || ''),
    queryFn: () => rewardsApi.getRewardsBySubscription(subscriptionId!),
    enabled: !!subscriptionId,
    staleTime: QUERY_STALE_TIMES.rewards,
    gcTime: QUERY_CACHE_TIMES.rewards,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to calculate reward eligibility (mutation)
 */
export const useCalculateRewardEligibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      rewardsApi.calculateEligibility(subscriptionId),
    onSuccess: (data, subscriptionId) => {
      // Invalidate eligibility query
      queryClient.invalidateQueries({
        queryKey: rewardKeys.eligibility(subscriptionId),
      });

      // If reward was created, invalidate available rewards for the client
      if (data.eligible && data.reward_id) {
        // We need to get the client_id from the subscription
        // For now, invalidate all available rewards queries
        queryClient.invalidateQueries({
          queryKey: rewardKeys.lists(),
        });
      }
    },
  });
};

/**
 * Hook to apply a reward
 */
export const useApplyReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rewardId, data }: { rewardId: string; data: RewardApplyInput }) =>
      rewardsApi.applyReward(rewardId, data),
    onSuccess: (data, variables) => {
      // Invalidate all reward-related queries
      queryClient.invalidateQueries({
        queryKey: rewardKeys.all,
      });

      // Invalidate subscriptions to update pricing
      queryClient.invalidateQueries({
        queryKey: ['subscriptions'],
      });

      // Invalidate clients to refresh dashboard data
      queryClient.invalidateQueries({
        queryKey: ['clients'],
      });
    },
  });
};

