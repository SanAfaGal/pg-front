import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '../api/clientsApi';
import { Client, ClientFormData, ClientFilters, ClientDashboardResponse } from '../types';

const CLIENTS_QUERY_KEY = ['clients'] as const;

export const useClients = (filters?: ClientFilters) => {
  return useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, 'list', filters],
    queryFn: () => clientsApi.getClients(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, 'detail', id],
    queryFn: () => clientsApi.getClientById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClientDashboard = (id: string) => {
  return useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, 'dashboard', id],
    queryFn: () => clientsApi.getClientDashboard(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientFormData> }) =>
      clientsApi.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'dashboard', variables.id] });
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsApi.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
};

export const useToggleClientStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      clientsApi.toggleClientStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
};

export const useUploadBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photo }: { id: string; photo: File }) =>
      clientsApi.uploadBiometric(id, photo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'dashboard', variables.id] });
    },
  });
};

export const useRegisterFaceBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, imageBase64 }: { clientId: string; imageBase64: string }) =>
      clientsApi.registerFaceBiometric(clientId, imageBase64),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'detail', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'dashboard', variables.clientId] });
    },
  });
};

export const useUpdateFaceBiometric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, imageBase64 }: { clientId: string; imageBase64: string }) =>
      clientsApi.updateFaceBiometric(clientId, imageBase64),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'detail', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_QUERY_KEY, 'dashboard', variables.clientId] });
    },
  });
};
