import { apiClient, API_ENDPOINTS } from '../../../shared/api/apiClient';
import { DashboardData } from '../types';

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    return apiClient.get<DashboardData>(API_ENDPOINTS.statistics);
  },
};
