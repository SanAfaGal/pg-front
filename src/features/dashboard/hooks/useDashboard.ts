import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

export const useDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: dashboardApi.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
