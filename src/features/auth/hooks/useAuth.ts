import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { LoginCredentials, AuthTokens } from '../types';
import { tokenManager } from '../../../shared/api/apiClient';
import { logger } from '../../../shared';

const AUTH_QUERY_KEY = ['auth'] as const;

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasToken, setHasToken] = useState(!!tokenManager.getAccessToken());
  const queryClient = useQueryClient();

  // Update hasToken when tokens change
  // Removed aggressive setInterval - only check on mount and when explicitly needed
  useEffect(() => {
    const token = !!tokenManager.getAccessToken();
    setHasToken(token);
  }, []);

  // Get current user query
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: [...AUTH_QUERY_KEY, 'user'],
    queryFn: authApi.getCurrentUser,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens: AuthTokens) => {
      tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
    onError: (error) => {
      logger.error('Login error:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      tokenManager.clearTokens();
      queryClient.clear();
      setHasToken(false); // Explicitly set authentication status to false
      queryClient.resetQueries({ queryKey: AUTH_QUERY_KEY, exact: false });
      // Limpiar el estado del recordatorio de membresías para que aparezca en la próxima sesión
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('membership_reminder_shown');
      }
    },
    onError: () => {
      // Even if logout fails on server, clear local tokens
      tokenManager.clearTokens();
      queryClient.clear();
      setHasToken(false); // Explicitly set authentication status to false
      queryClient.resetQueries({ queryKey: AUTH_QUERY_KEY, exact: false });
      // Limpiar el estado del recordatorio de membresías para que aparezca en la próxima sesión
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('membership_reminder_shown');
      }
    },
  });

  // Check authentication status
  const checkAuth = useCallback(async () => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      setIsInitialized(true);
      setHasToken(false);
      return;
    }

    // Token exists, set hasToken to true and let useQuery handle fetching
    setHasToken(true);
    setIsInitialized(true);
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await loginMutation.mutateAsync(credentials);
        return true;
      } catch (error) {
        logger.error('Login failed:', error);
        return false;
      }
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const isAuthenticated = !!user && !!tokenManager.getAccessToken();
  const isLoading = !isInitialized || isUserLoading || loginMutation.isPending || logoutMutation.isPending;

  return {
    user,
    isAuthenticated,
    isLoading,
    error: userError || loginMutation.error || logoutMutation.error,
    login,
    logout,
    checkAuth,
  };
};
