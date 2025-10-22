import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { LoginCredentials, AuthTokens } from '../types';
import { tokenManager } from '../../../shared/api/apiClient';

const AUTH_QUERY_KEY = ['auth'] as const;

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasToken, setHasToken] = useState(!!tokenManager.getAccessToken());
  const queryClient = useQueryClient();

  // Update hasToken when tokens change
  useEffect(() => {
    const checkToken = () => {
      const token = !!tokenManager.getAccessToken();
      setHasToken(token);
    };
    
    // Check immediately
    checkToken();
    
    // Set up an interval to check for token changes
    const interval = setInterval(checkToken, 1000);
    
    return () => clearInterval(interval);
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
      console.error('Login error:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      tokenManager.clearTokens();
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails on server, clear local tokens
      tokenManager.clearTokens();
      queryClient.clear();
    },
  });

  // Check authentication status
  const checkAuth = useCallback(async () => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      setIsInitialized(true);
      return;
    }

    try {
      await queryClient.fetchQuery({
        queryKey: [...AUTH_QUERY_KEY, 'user'],
        queryFn: authApi.getCurrentUser,
      });
    } catch (error) {
      // Token is invalid, clear it
      tokenManager.clearTokens();
      queryClient.clear();
    } finally {
      setIsInitialized(true);
    }
  }, [queryClient]);

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
        console.error('Login failed:', error);
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
