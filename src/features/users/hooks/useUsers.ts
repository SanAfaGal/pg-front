import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  changeUserRole,
  enableUser,
  disableUser,
  UserCreateInput,
  UserUpdateInput,
  UserRole,
} from '../api/userApi';
import { User } from '../api/types';
import {
  QUERY_STALE_TIMES,
  QUERY_CACHE_TIMES,
  RETRY_CONFIG,
} from '../constants/userConstants';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (username: string) => [...userKeys.details(), username] as const,
};

/**
 * Hook to get all users (admin only)
 * enabled=true by default - loads data automatically on mount
 */
export const useUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => getAllUsers(),
    enabled,
    staleTime: QUERY_STALE_TIMES.users,
    gcTime: QUERY_CACHE_TIMES.users,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

/**
 * Hook to get a single user by username (admin only)
 */
export const useUser = (username: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: userKeys.detail(username),
    queryFn: () => getUserByUsername(username),
    enabled: enabled && !!username,
    staleTime: QUERY_STALE_TIMES.user,
    gcTime: QUERY_CACHE_TIMES.user,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

/**
 * Hook to create a user (admin only)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserCreateInput) => createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch lists automatically
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.refetchQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook to update a user (admin only)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, data }: { username: string; data: UserUpdateInput }) =>
      updateUser(username, data),
    onSuccess: (updatedUser: User) => {
      // Invalidate and refetch lists automatically
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.refetchQueries({ queryKey: userKeys.lists() });
      // Update the specific user in cache (optimistic update)
      queryClient.setQueryData(userKeys.detail(updatedUser.username), updatedUser);
    },
  });
};

/**
 * Hook to delete a user (admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => deleteUser(username),
    onSuccess: (_, deletedUsername) => {
      // Invalidate and refetch lists automatically
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.refetchQueries({ queryKey: userKeys.lists() });
      // Remove the specific user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedUsername) });
    },
  });
};

/**
 * Hook to reset user password (admin only)
 */
export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, newPassword }: { username: string; newPassword: string }) =>
      resetUserPassword(username, newPassword),
    onSuccess: (_, { username }) => {
      // Invalidate and refetch lists to show updated data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.refetchQueries({ queryKey: userKeys.lists() });
      // Invalidate user detail to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.detail(username) });
    },
  });
};

/**
 * Hook to change user role (admin only)
 */
export const useChangeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, role }: { username: string; role: UserRole }) =>
      changeUserRole(username, role),
    onSuccess: (updatedUser: User) => {
      // Invalidate and refetch lists automatically
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.refetchQueries({ queryKey: userKeys.lists() });
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.username), updatedUser);
    },
  });
};

/**
 * Hook to enable a user (admin only)
 */
export const useEnableUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => enableUser(username),
    onSuccess: (updatedUser: User) => {
      // Invalidate and refetch lists automatically
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.refetchQueries({ queryKey: userKeys.lists() });
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.username), updatedUser);
    },
  });
};

/**
 * Hook to disable a user (admin only)
 */
export const useDisableUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => disableUser(username),
    onSuccess: (updatedUser: User) => {
      // Invalidate and refetch lists automatically
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.refetchQueries({ queryKey: userKeys.lists() });
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.username), updatedUser);
    },
  });
};

