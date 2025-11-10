import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import { MovementFilters } from '../types';

// Query Keys
export const movementKeys = {
  all: ['movements'] as const,
  lists: () => [...movementKeys.all, 'list'] as const,
  list: (filters?: MovementFilters) => [...movementKeys.lists(), filters] as const,
  details: () => [...movementKeys.all, 'detail'] as const,
  detail: (id: string) => [...movementKeys.details(), id] as const,
};

// Hooks
export const useMovements = (filters?: MovementFilters, enabled = true) => {
  return useQuery({
    queryKey: movementKeys.list(filters),
    queryFn: () => inventoryApi.getMovements(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMovement = (id: string, enabled = true) => {
  return useQuery({
    queryKey: movementKeys.detail(id),
    queryFn: () => inventoryApi.getMovementById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
