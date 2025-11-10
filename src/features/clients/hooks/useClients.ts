import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { clientsApi } from '../api/clientsApi';
import { Client, ClientFormData, ClientFilters, ClientDashboardResponse } from '../types';
import {
  QUERY_STALE_TIMES,
  QUERY_CACHE_TIMES,
  RETRY_CONFIG,
} from '../constants/clientConstants';

// Query keys - centralized for consistent cache management
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters?: ClientFilters) => [...clientKeys.lists(), filters] as const,
  detail: (id: string) => [...clientKeys.all, 'detail', id] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  dashboard: (id: string) => [...clientKeys.all, 'dashboard', id] as const,
  dashboards: () => [...clientKeys.all, 'dashboard'] as const,
  stats: () => [...clientKeys.all, 'stats'] as const,
} as const;

/**
 * Hook for clients list with optional filters
 */
export const useClients = (filters?: ClientFilters) => {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => clientsApi.getClients(filters),
    staleTime: QUERY_STALE_TIMES.clients,
    gcTime: QUERY_CACHE_TIMES.clients,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for single client detail
 */
export const useClient = (id: string) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsApi.getClientById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIMES.detail,
    gcTime: QUERY_CACHE_TIMES.detail,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

/**
 * Hook for client dashboard data
 */
export const useClientDashboard = (id: string) => {
  return useQuery({
    queryKey: clientKeys.dashboard(id),
    queryFn: () => clientsApi.getClientDashboard(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIMES.dashboard,
    gcTime: QUERY_CACHE_TIMES.dashboard,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

/**
 * Hook to get multiple clients by their IDs and return a Map for quick lookup
 * Uses useQueries to fetch clients in parallel, leveraging React Query cache
 * 
 * @param clientIds - Array of client IDs to fetch
 * @returns Map<string, Client> - Map of client_id to Client object, and loading state
 */
export const useClientsMap = (clientIds: string[]) => {
  // Get unique client IDs to avoid duplicate queries
  const uniqueClientIds = useMemo(() => {
    return Array.from(new Set(clientIds.filter(Boolean)));
  }, [clientIds]);

  // Use useQueries to fetch all clients in parallel
  const queries = useQueries({
    queries: uniqueClientIds.map((clientId) => ({
      queryKey: clientKeys.detail(clientId),
      queryFn: () => clientsApi.getClientById(clientId),
      enabled: !!clientId,
      staleTime: QUERY_STALE_TIMES.detail,
      gcTime: QUERY_CACHE_TIMES.detail,
      retry: RETRY_CONFIG.retries,
      retryDelay: RETRY_CONFIG.retryDelay,
    })),
  });

  // Create a Map for O(1) lookup
  const clientsMap = useMemo(() => {
    const map = new Map<string, Client>();
    queries.forEach((query, index) => {
      if (query.data && uniqueClientIds[index]) {
        map.set(uniqueClientIds[index], query.data);
      }
    });
    return map;
  }, [queries, uniqueClientIds]);

  // Check if any query is still loading
  const isLoading = queries.some((query) => query.isLoading);

  return {
    clientsMap,
    isLoading,
  };
};

/**
 * Hook for creating a new client
 * Automatically invalidates client list on success
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
};

/**
 * Hook for updating an existing client
 * Invalidates detail, dashboard, and list queries on success
 */
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientFormData> }) =>
      clientsApi.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.dashboard(variables.id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
};

/**
 * Hook for deleting (deactivating) a client
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsApi.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
};

/**
 * Hook for toggling client active status
 */
export const useToggleClientStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      clientsApi.toggleClientStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
};

/**
 * Hook for uploading biometric photo
 */
export const useUploadBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photo }: { id: string; photo: File }) =>
      clientsApi.uploadBiometric(id, photo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.dashboard(variables.id) });
    },
  });
};

/**
 * Hook for registering face biometric
 */
export const useRegisterFaceBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, imageBase64 }: { clientId: string; imageBase64: string }) =>
      clientsApi.registerFaceBiometric(clientId, imageBase64),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.dashboard(variables.clientId) });
    },
  });
};

/**
 * Hook for updating face biometric
 */
export const useUpdateFaceBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, imageBase64 }: { clientId: string; imageBase64: string }) =>
      clientsApi.updateFaceBiometric(clientId, imageBase64),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.dashboard(variables.clientId) });
    },
  });
};
