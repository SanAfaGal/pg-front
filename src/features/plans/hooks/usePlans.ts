import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllPlans,
  fetchPlanById,
  searchPlans,
  createPlan,
  updatePlan,
  deletePlan,
  PlanCreateInput,
  PlanUpdateInput,
} from '../api/planApi';
import { Plan } from '../api/types';
import {
  QUERY_STALE_TIMES,
  QUERY_CACHE_TIMES,
  RETRY_CONFIG,
} from '../constants/planConstants';

// Query Keys
export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (filters?: { is_active?: boolean; limit?: number; offset?: number }) =>
    [...planKeys.lists(), filters] as const,
  details: () => [...planKeys.all, 'detail'] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
  search: (params: { q: string; limit?: number }) =>
    [...planKeys.all, 'search', params] as const,
};

// Hook to get all plans (admin only)
export const usePlans = (
  filters?: { is_active?: boolean; limit?: number; offset?: number },
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: planKeys.list(filters),
    queryFn: () => fetchAllPlans(filters?.is_active, filters?.limit, filters?.offset),
    enabled,
    staleTime: QUERY_STALE_TIMES.plans,
    gcTime: QUERY_CACHE_TIMES.plans,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to get a single plan by ID
export const usePlan = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => fetchPlanById(id),
    enabled: enabled && !!id,
    staleTime: QUERY_STALE_TIMES.plan,
    gcTime: QUERY_CACHE_TIMES.plan,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to search plans
export const useSearchPlans = (
  searchTerm: string,
  limit: number = 50,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: planKeys.search({ q: searchTerm, limit }),
    queryFn: () => searchPlans(searchTerm, limit),
    enabled: enabled && !!searchTerm && searchTerm.length > 0,
    staleTime: QUERY_STALE_TIMES.search,
    gcTime: QUERY_CACHE_TIMES.search,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to create a plan
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData: PlanCreateInput) => createPlan(planData),
    onSuccess: () => {
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
    },
  });
};

// Hook to update a plan
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlanUpdateInput }) =>
      updatePlan(id, data),
    onSuccess: (updatedPlan: Plan) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      // Update the specific plan in cache (optimistic update)
      queryClient.setQueryData(planKeys.detail(updatedPlan.id), updatedPlan);
    },
  });
};

// Hook to delete a plan
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: (_, deletedId) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      // Remove the specific plan from cache
      queryClient.removeQueries({ queryKey: planKeys.detail(deletedId) });
    },
  });
};


