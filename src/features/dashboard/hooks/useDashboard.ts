import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardQueryParams } from '../types';
import {
  QUERY_STALE_TIMES,
  QUERY_CACHE_TIMES,
  RETRY_CONFIG,
} from '../constants/dashboardConstants';

// Query keys - centralized for consistent cache management
export const dashboardKeys = {
  all: ['dashboard'] as const,
  detail: (params?: DashboardQueryParams) => 
    [...dashboardKeys.all, 'detail', params] as const,
  recentActivities: () => [...dashboardKeys.all, 'recent-activities'] as const,
} as const;

/**
 * Hook for dashboard data with optional period and date filters
 * Uses optimized React Query configuration from constants
 */
export const useDashboard = (params?: DashboardQueryParams) => {
  return useQuery({
    queryKey: dashboardKeys.detail(params),
    queryFn: () => dashboardApi.getDashboardData(params),
    staleTime: QUERY_STALE_TIMES.dashboard,
    gcTime: QUERY_CACHE_TIMES.dashboard,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches when tab is focused
  });
};

/**
 * Hook for recent activities (last 24 hours)
 * Uses separate endpoint as per new API structure
 */
export const useRecentActivities = () => {
  return useQuery({
    queryKey: dashboardKeys.recentActivities(),
    queryFn: () => dashboardApi.getRecentActivities(),
    staleTime: 30 * 1000, // 30 seconds - activities change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchOnWindowFocus: false,
  });
};
