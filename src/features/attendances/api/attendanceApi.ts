import { apiClient } from '../../../shared/api/apiClient';
import {
  Attendance,
  AttendanceWithClient,
  CheckInRequest,
  CheckInResponse,
  AttendanceFilterOptions,
  AttendancePagination,
  AttendanceMetrics,
  AttendanceStats
} from '../types';

// API Endpoints
const ATTENDANCE_ENDPOINTS = {
  checkIn: '/check-in',
  list: '/attendances',
  detail: (id: string) => `/attendances/${id}`,
  metrics: '/attendances/metrics',
  stats: '/attendances/stats',
} as const;

export const attendanceApi = {
  // Check-in with facial recognition
  async checkIn(data: CheckInRequest): Promise<CheckInResponse> {
    return apiClient.post<CheckInResponse>(ATTENDANCE_ENDPOINTS.checkIn, data);
  },

  // Get attendance list with filters and pagination
  async getAttendances(
    filters: AttendanceFilterOptions = {},
    pagination: AttendancePagination = { limit: 100, offset: 0 }
  ): Promise<AttendanceWithClient[]> {
    const params: Record<string, string | number> = {
      limit: pagination.limit,
      offset: pagination.offset,
    };

    if (filters.start_date) {
      params.start_date = filters.start_date;
    }
    if (filters.end_date) {
      params.end_date = filters.end_date;
    }
    if (filters.search) {
      params.search = filters.search;
    }

    return apiClient.get<AttendanceWithClient[]>(ATTENDANCE_ENDPOINTS.list, { params });
  },

  // Get single attendance by ID
  async getAttendanceById(id: string): Promise<Attendance> {
    return apiClient.get<Attendance>(ATTENDANCE_ENDPOINTS.detail(id));
  },

  // Get attendance metrics for dashboard
  async getMetrics(): Promise<AttendanceMetrics> {
    return apiClient.get<AttendanceMetrics>(ATTENDANCE_ENDPOINTS.metrics);
  },

  // Get attendance statistics
  async getStats(): Promise<AttendanceStats> {
    return apiClient.get<AttendanceStats>(ATTENDANCE_ENDPOINTS.stats);
  },
};
