import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendanceApi';
import {
  AttendanceWithClient,
  CheckInRequest,
  CheckInResponse,
  AttendanceFilterOptions,
  AttendancePagination,
  AttendanceMetrics,
  AttendanceStats
} from '../types';
import {
  QUERY_STALE_TIMES,
  QUERY_CACHE_TIMES,
  RETRY_CONFIG,
  PAGINATION_DEFAULTS,
} from '../constants/attendanceConstants';

// Query keys - centralized for consistent cache management
export const attendanceKeys = {
  all: ['attendances'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (filters: AttendanceFilterOptions, pagination: AttendancePagination) => 
    [...attendanceKeys.lists(), filters, pagination] as const,
  detail: (id: string) => [...attendanceKeys.all, 'detail', id] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  metrics: () => [...attendanceKeys.all, 'metrics'] as const,
  stats: () => [...attendanceKeys.all, 'stats'] as const,
} as const;

/**
 * Hook for attendance list with filters and pagination
 * Uses optimized React Query configuration from constants
 */
export const useAttendances = (
  filters: AttendanceFilterOptions = {},
  pagination: AttendancePagination = PAGINATION_DEFAULTS
) => {
  const queryClient = useQueryClient();

  const {
    data: attendances = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: attendanceKeys.list(filters, pagination),
    queryFn: () => attendanceApi.getAttendances(filters, pagination),
    staleTime: QUERY_STALE_TIMES.attendances,
    gcTime: QUERY_CACHE_TIMES.attendances,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches when tab is focused
  });

  // Invalidate and refetch attendances
  const invalidateAttendances = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
  }, [queryClient]);

  return {
    attendances,
    isLoading,
    error,
    refetch,
    invalidateAttendances,
  };
};

/**
 * Hook for single attendance detail
 */
export const useAttendance = (id: string) => {
  const {
    data: attendance,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: attendanceKeys.detail(id),
    queryFn: () => attendanceApi.getAttendanceById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIMES.detail,
    gcTime: QUERY_CACHE_TIMES.detail,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });

  return {
    attendance,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for attendance metrics (dashboard data)
 * Auto-refetches every 30 seconds for real-time updates
 */
export const useAttendanceMetrics = () => {
  const {
    data: metrics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: attendanceKeys.metrics(),
    queryFn: attendanceApi.getMetrics,
    staleTime: QUERY_STALE_TIMES.metrics,
    gcTime: QUERY_CACHE_TIMES.metrics,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time metrics
  });

  return {
    metrics,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for attendance statistics
 */
export const useAttendanceStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: attendanceKeys.stats(),
    queryFn: attendanceApi.getStats,
    staleTime: QUERY_STALE_TIMES.stats,
    gcTime: QUERY_CACHE_TIMES.stats,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for check-in with facial recognition
 * Automatically invalidates all attendance queries on success
 */
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CheckInRequest) => attendanceApi.checkIn(data),
    onSuccess: () => {
      // Invalidate all attendance-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      // Also invalidate metrics and stats as they depend on attendance data
      queryClient.invalidateQueries({ queryKey: attendanceKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.stats() });
    },
  });

  const checkIn = useCallback(
    async (imageBase64: string): Promise<CheckInResponse> => {
      return mutation.mutateAsync({ image_base64: imageBase64 });
    },
    [mutation]
  );

  return {
    checkIn,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

/**
 * Hook for attendance history state management
 * Manages filters, pagination, and data fetching for history view
 */
export const useAttendanceHistory = () => {
  const [filters, setFilters] = useState<AttendanceFilterOptions>({});
  const [pagination, setPagination] = useState<AttendancePagination>(PAGINATION_DEFAULTS);

  const { attendances, isLoading, error, invalidateAttendances } = useAttendances(
    filters,
    pagination
  );

  const updateFilters = useCallback((newFilters: AttendanceFilterOptions) => {
    // Clean filters: remove undefined and empty string values
    const cleanFilters: AttendanceFilterOptions = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    ) as AttendanceFilterOptions;
    
    setFilters(cleanFilters);
    // Reset pagination when filters change
    setPagination(PAGINATION_DEFAULTS);
  }, []);

  const updatePagination = useCallback((newPagination: Partial<AttendancePagination>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(PAGINATION_DEFAULTS);
  }, []);

  return {
    attendances,
    isLoading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    clearFilters,
    invalidateAttendances,
  };
};
