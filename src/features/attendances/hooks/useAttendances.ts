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

// Query keys
const ATTENDANCE_QUERY_KEYS = {
  all: ['attendances'] as const,
  list: (filters: AttendanceFilterOptions, pagination: AttendancePagination) => 
    [...ATTENDANCE_QUERY_KEYS.all, 'list', filters, pagination] as const,
  detail: (id: string) => [...ATTENDANCE_QUERY_KEYS.all, 'detail', id] as const,
  metrics: () => [...ATTENDANCE_QUERY_KEYS.all, 'metrics'] as const,
  stats: () => [...ATTENDANCE_QUERY_KEYS.all, 'stats'] as const,
};

// Hook for attendance list with filters
export const useAttendances = (
  filters: AttendanceFilterOptions = {},
  pagination: AttendancePagination = { limit: 100, offset: 0 }
) => {
  const queryClient = useQueryClient();

  const {
    data: attendances = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.list(filters, pagination),
    queryFn: () => attendanceApi.getAttendances(filters, pagination),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Invalidate and refetch attendances
  const invalidateAttendances = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEYS.all });
  }, [queryClient]);

  return {
    attendances,
    isLoading,
    error,
    refetch,
    invalidateAttendances,
  };
};

// Hook for single attendance
export const useAttendance = (id: string) => {
  const {
    data: attendance,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.detail(id),
    queryFn: () => attendanceApi.getAttendanceById(id),
    enabled: !!id,
  });

  return {
    attendance,
    isLoading,
    error,
    refetch,
  };
};

// Hook for attendance metrics
export const useAttendanceMetrics = () => {
  const {
    data: metrics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.metrics(),
    queryFn: attendanceApi.getMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  return {
    metrics,
    isLoading,
    error,
    refetch,
  };
};

// Hook for attendance statistics
export const useAttendanceStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.stats(),
    queryFn: attendanceApi.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};

// Hook for check-in with facial recognition
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CheckInRequest) => attendanceApi.checkIn(data),
    onSuccess: () => {
      // Invalidate all attendance queries to refresh data
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEYS.all });
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

// Hook for attendance history state management
export const useAttendanceHistory = () => {
  const [filters, setFilters] = useState<AttendanceFilterOptions>({});
  const [pagination, setPagination] = useState<AttendancePagination>({
    limit: 100,
    offset: 0,
  });

  const { attendances, isLoading, error, invalidateAttendances } = useAttendances(
    filters,
    pagination
  );

  const updateFilters = useCallback((newFilters: Partial<AttendanceFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
  }, []);

  const updatePagination = useCallback((newPagination: Partial<AttendancePagination>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination({ limit: 100, offset: 0 });
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
