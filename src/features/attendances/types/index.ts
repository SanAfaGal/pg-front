// Attendance Types
export interface Attendance {
  id: string;
  client_id: string;
  check_in: string; // ISO 8601 datetime
  meta_info: Record<string, any>;
}

export interface AttendanceWithClient extends Attendance {
  client_first_name: string;
  client_last_name: string;
  client_dni_number: string;
}

export interface CheckInRequest {
  image_base64: string;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  can_enter: boolean;
  attendance?: Attendance;
  client_info?: {
    first_name: string;
    last_name: string;
    dni_number: string;
  };
  reason?: 'subscription_expired' | 'inactive_client' | 'no_active_subscription' | 'face_not_recognized' | 'no_face_detected' | 'system_error';
  detail?: string;
}

// Error response types for different HTTP status codes
export interface CheckInErrorResponse {
  detail: string;
  error: 'no_face_detected' | 'face_not_recognized' | 'validation_error' | 'system_error';
}

export interface CheckInAccessDeniedResponse {
  success: false;
  message: string;
  can_enter: false;
  reason: 'subscription_expired' | 'inactive_client' | 'no_active_subscription' | 'payment_required';
  detail: string;
}

export interface AttendanceFilterOptions {
  start_date?: string; // ISO 8601 datetime
  end_date?: string; // ISO 8601 datetime
  search?: string;
}

export interface AttendancePagination {
  limit: number;
  offset: number;
  total?: number;
}

export interface AttendanceMetrics {
  today_count: number;
  week_count: number;
  month_count: number;
  hourly_data: Array<{
    hour: number;
    count: number;
  }>;
  weekly_trend: Array<{
    date: string;
    count: number;
  }>;
}

export interface AttendanceStats {
  total_attendances: number;
  unique_clients: number;
  average_daily: number;
  peak_hour: number;
  growth_rate: number;
}

// UI State Types
export interface CheckInState {
  isCapturing: boolean;
  isCameraActive: boolean;
  capturedImage: string | null;
  isProcessing: boolean;
  result: CheckInResponse | null;
}

export interface AttendanceHistoryState {
  attendances: AttendanceWithClient[];
  isLoading: boolean;
  filters: AttendanceFilters;
  pagination: AttendancePagination;
}

export interface AttendanceDashboardState {
  metrics: AttendanceMetrics | null;
  recentAttendances: AttendanceWithClient[];
  isLoading: boolean;
}
