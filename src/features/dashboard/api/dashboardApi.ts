import { apiClient, API_ENDPOINTS } from '../../../shared/api/apiClient';
import { DashboardData, RecentActivity } from '../types';
import { calculateDateRange } from '../utils/dateRangeHelpers';
import { DashboardQueryParams, PeriodType } from '../types';
import { PERIOD_TYPES } from '../constants/dashboardConstants';

export const dashboardApi = {
  async getDashboardData(params?: DashboardQueryParams): Promise<DashboardData> {
    // Calculate start_date and end_date from period and date
    const period: PeriodType = params?.period || PERIOD_TYPES.MONTH;
    const referenceDate = params?.date || new Date().toISOString().split('T')[0];
    
    const { start_date, end_date } = calculateDateRange(period, referenceDate);
    
    return apiClient.get<DashboardData>(API_ENDPOINTS.statistics, {
      params: {
        start_date,
        end_date,
      },
    });
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    return apiClient.get<RecentActivity[]>('/statistics/recent-activities');
  },
};
